const Fs = require('fs')

require('node-env-file')( __dirname + '/.env' )
      
const router = require('./router')

router.collectionPromise.then( () => {
    require('http')
        .createServer( ( request, response ) => {
            if( /admin/.test( request.url ) ) {
                response.writeHead( 301, { 'Location': `https://${process.env.DOMAIN}:${process.env.SECURE_PORT}${request.url}` } )
                response.end("")
            } else {
                Reflect.apply( router.handler, router, [ request, response ] )
            }
        } )
        .listen( process.env.PORT )

    require('https')
        .createServer(
            { key: Fs.readFileSync( process.env.SSLKEY ), cert: Fs.readFileSync( process.env.SSLCERT ) },
            ( request, response ) => Reflect.apply( router.handler, router, [ request, response ] )
        )
        .listen( process.env.SECURE_PORT )
} )
.catch( e => {
    console.log( e.stack || e )
    process.exit(1)
} )
