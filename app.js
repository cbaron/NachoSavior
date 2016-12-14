const Fs = require('fs')

require('node-env-file')( __dirname + '/.env' )
      
const router = require('./router')

router.collectionPromise.then( () => 
    require('http')
        .createServer( router.handler.bind(router) )
        .listen( process.env.PORT )
)
.catch( e => {
    console.log( e.stack || e )
    process.exit(1)
} )
