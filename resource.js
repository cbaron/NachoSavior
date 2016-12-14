module.exports = Object.assign( { }, require('./lib/MyObject'), {

    BCrypt: require('bcrypt'),

    Context: require('./lib/Context'),

    Fs: require('fs'),

    Jws: require('jws'),

    Mongo: require('./dal/Mongo'),

    Uuid: require('uuid'),

    Validate: require('./lib/Validate'),

    apply( method ) {

        if( method === "POST" && this.path[0] === "file" ) return this.handleFileUpload()
        if( method === "PATCH" && this.path[0] === "file" ) return this.handleFileUpload(this.path[1])

        return this.Validate.apply( this )
           .then( () => this.Context.apply( this ) )
           .then( () => this[method]() )
    },

    addToBody(doc) {
        this.body.push(doc)
    },

    find(db) {
        let find = db.collection( this.path[0] ).find()
        if( !this.query) return find
        if( this.query.skip ) find.skip(this.query.skip)
        if( this.query.limit ) find.limit(this.query.limit)
        if( this.query.sort ) find.sort(this.query.sort)
        return find
    },

    authError(error) { return this.respond( { stopChain: true, body: { error }, code: 500 } ) },

    handleAuth() {
       
        return this.Mongo.getDb( db => db.collection('user').findOne( { username: this.body.username } ), this ) 
        .then( user => {
            if( ! user ) return this.authError('Invalid Credentials')

            const password = user.password
            delete user.password

            return this.P( this.BCrypt.compare, [ this.body.password, password ] )
            .then( checkedOut =>
                    checkedOut
                        ? this.makeToken( user )
                        : this.authError('Invalid Credentials')
            )
            .then( token =>
                this.respond( {
                    body: {},
                    headers: {
                        'Set-Cookie': `${process.env.COOKIE}=${token}; Expires=${new Date("2020-01-20").toUTCString()}`
                    }
                } )
            )
        } )
    },

    handleFileUpload(path) {
        this.request.setEncoding('binary')

        return this.Validate.GET(this)
        .then( () => 
            new Promise( ( resolve, reject ) => {
                const relativePath = path || `/static/img/${this.Uuid.v4()}`,
                      fileStream = this.Fs.createWriteStream( `${__dirname}${relativePath}`, { defaultEncoding: 'binary' } )

                this.request.on( 'error', reject )
                this.request.on( 'end', () => resolve( this.respond( { body: { path: `${relativePath}` } } ) ) )
                this.request.pipe( fileStream )
            } )
        )
    },

    handleMe() {
        return this.respond( { body: this.user } )
    },

    makeToken( obj ) {
        return new Promise( ( resolve, reject ) =>
            this.Jws.createSign( {
                header: { "alg": "HS256", "typ": "JWT" },
                payload: JSON.stringify( obj ),
                privateKey: process.env.JWS_SECRET
            } )
            .on( 'done', resolve )
            .on( 'error', reject )
        )
    },

    GET() {
        if( this.path[0] === "me" ) return this.handleMe()
        this.body = [ ]
        return this.Mongo.forEach( this.find, this.addToBody, this )
        .then( () => Promise.resolve( this.respond( { body: this.body } ) ) )
    },

    OPTIONS() {
        return Promise.resolve(
            this.respond( 
                ( this.path[0] !== "admin" )
                    ? { body: "Sorry, mate", code: 401 }
                    : { body: Object.keys( this.Mongo.collections ) }
            )
        )
    },
    
    PATCH() {
        return this.Mongo.getDb( db => db.collection(this.path[0]).findOneAndUpdate( { _id: this.Mongo.ObjectId( this.path[1] ) }, { $set: this.body }, { returnOriginal: false } ), this )
        .then( result => {
            if( result.value && result.value.password ) delete result.value.password
            return this.respond( { body: result.value } )
        } )
    },

    POST() {
        if( this.path[0] === 'auth' ) return this.handleAuth()
        return this.Mongo.getDb( db => db.collection(this.path[0]).insertOne( this.body ), this )
        .then( result => {
            delete this.body.password
            return this.respond( { body: Object.assign( this.body, { _id: result.insertedId } ) } )
        } )
    },

    end( data ) {
        return new Promise( resolve => {
            data.body = JSON.stringify( data.body )
            this.response.writeHead( data.code || 200, Object.assign( this.getHeaders( data.body ), data.headers || {} ) )
            this.response.end( data.body )
            resolve()
        } )
    },

    getHeaders( body ) { return Object.assign( {}, this.headers, { 'Date': new Date().toISOString(), 'Content-Length': Buffer.byteLength( body ) } ) },

    headers: {
        'Connection': 'Keep-Alive',
        'Content-Type': 'application/ld+json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Keep-Alive': 'timeout=20, max=20'
    },

    respond( data ) {
        data.body = JSON.stringify( data.body )
        this.response.writeHead( data.code || 200, Object.assign( this.getHeaders( data.body ), data.headers || {} ) )
        this.response.end( data.body )
        if( data.stopChain ) { this.handled = true; throw new Error("Handled") }
    }
} )
