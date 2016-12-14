module.exports = Object.create( Object.assign( { }, require('../lib/MyObject'), {

    Client: require('mongodb').MongoClient,

    ObjectId: require('mongodb').ObjectID,

    _connect() { return this.Client.connect(process.env.MONGODB) },

    forEach( cursorFn, callbackFn, thisVar ) {
        return this.getDb()
        .then( db => {
            let cursor = Reflect.apply( cursorFn, thisVar, [ db ] )
            return new Promise( ( resolve, reject ) => {
                let handler = function( item ) {
                    if( item === null ) return resolve(db.close())

                    Reflect.apply( callbackFn, thisVar, [ item ] )
                    cursor.next().then( handler ).catch( reject )
                }
                    
                cursor.next()
                .then( handler )
                .catch( reject )
            } )
        } )
    },

    cacheCollection( collection ) {
        this.collections[ collection.name ] = { }
    },

    getCollectionData() {
        return this.forEach( db => db.listCollections( { name: { $ne: 'system.indexes' } } ), this.cacheCollection, this )
    },

    getDb( callback, thisVar ) {
        return this._connect().then( db => Promise.resolve( callback ? Reflect.apply( callback, thisVar, [ db ] ) : db ) )
    }

} ), { collections: { value: { } } } )
