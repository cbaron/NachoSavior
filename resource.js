module.exports = Object.assign( { }, require('./lib/MyObject'), {

    BCrypt: require('bcrypt'),

    Context: require('./lib/Context'),

    Fs: require('fs'),

    Jimp: require('jimp'),

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
            .then( ( [ checkedOut ] ) =>
                    checkedOut
                        ? this.makeToken( user )
                        : this.authError('Invalid Credentials')
            )
            .then( token =>
                this.respond( {
                    body: {},
                    headers: {
                        'Set-Cookie': `${process.env.COOKIE}=${token}; Expires=${new Date("2021-01-20").toUTCString()}`
                    }
                } )
            )
        } )
    },

    requestToFile( request, path ) {
        return new Promise( ( resolve, reject ) => {
            const fileStream = this.Fs.createWriteStream( `${path}`, { defaultEncoding: 'binary' } )

            fileStream.on( 'finish', () => resolve() )
            request.on( 'error', reject )
            //request.on( 'end', () => resolve() )
            request.pipe( fileStream )
        } )
    },

    handleFileUpload(path) {
        this.request.setEncoding('binary')
        const relativePath = `/static/img/i/${path || this.Uuid.v4()}`,
              fullPath = `${__dirname}${relativePath}`

        return this.Validate.GET(this)
        .then( () => this.requestToFile( this.request, fullPath ) )
        .then( () => this.Jimp.read( fullPath ).then( img => {
            img.contain( img.bitmap.width, img.bitmap.width / 1.91 )
            return this.P( img.write, [ `${__dirname}${relativePath}-og.png` ], img )
        } ) )
        .then( () => this.respond( { body: { path: `${relativePath}` } } ) )
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

    DELETE() {
        return this.Mongo.getDb( db => db.collection(this.path[0]).findOneAndDelete( { _id: this.Mongo.ObjectId( this.path[1] ) } ) )
        .then( () => this.respond( { body: { } } ) )
    },

    handleComicName( name ) {
        return this.Mongo.getDb( db => db.collection('comic').findOne( { name } ) )
            .then( item => Promise.resolve( this.respond( { body: item } ) ) )
    },

    GET() {
        if( this.path[0] === "me" ) return this.handleMe()
        if( ! /^(comic|user)$/.test(this.path[0]) ) return this.handleComicName( this.path[0] )
        this.body = [ ];
        ( ( this.path.length === 2 )
            ? this.Mongo.getDb( db => db.collection(this.path[0]).findOne( { _id: this.Mongo.ObjectId( this.path[1] ) } ) )
              .then( item => Promise.resolve( this.body = item ) )
            : this.Mongo.forEach( this.find, this.addToBody, this ) )
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
