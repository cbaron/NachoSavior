#!/usr/bin/env node

require('node-env-file')( __dirname + '/../../.env' );

require('mongodb').MongoClient.connect(process.env.MONGODB)
.then( db => 
    db.createCollection('comic')
    db.createCollection('user')
    .catch( e => console.log( e.stack || e ) )
    .then( () => { db.close(); process.exit(0) } )
)
