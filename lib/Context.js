module.exports = Object.create( {

    Bcrypt: require('bcrypt'),

    Qs: require('querystring'),

    apply( resource ) { return Promise.resolve( this[ resource.request.method ]( resource ) ) },

    DELETE(){},

    GET( resource ) {
        const indexOf = resource.request.url.indexOf('?')
        if( indexOf !== -1 ) resource.query = JSON.parse( this.Qs.unescape( resource.request.url.slice( indexOf + 1 ) ) )
    },

    OPTIONS() { return Promise.resolve() },

    PATCH( resource ) {
        [ '_id', 'id' ].forEach( key => { if( resource.body[ key ] ) delete resource.body[key] } )

        return ( resource.body.password )
            ? resource.P( this.Bcrypt.hash, [ resource.body.password, parseInt( process.env.SALT ) ] )
              .then( ( [ password ] ) => Promise.resolve( resource.body.password = password ) )
            : Promise.resolve()
    },

    POST( resource ){
        return ( resource.body.password && resource.path[0] !== "auth" )
            ? resource.P( this.Bcrypt.hash, [ resource.body.password, parseInt( process.env.SALT ) ] )
              .then( ( [ password ] ) => Promise.resolve( resource.body.password = password ) )
            : Promise.resolve()
    }   

}, { } )
