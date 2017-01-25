#!/usr/bin/env node

const Jimp = require('jimp'),
      Fs = require('fs'),
      dir = `${__dirname}/../static/img/i`,
      P = ( fun, args=[ ], thisArg ) => new Promise( ( resolve, reject ) => Reflect.apply( fun, thisArg || this, args.concat( ( e, ...callback ) => e ? reject(e) : resolve(callback) ) ) )

P( Fs.readdir, [ dir ] )
.then( ( [ files ] ) =>
    Promise.all( files.map( file =>
        Jimp.read( `${dir}/${file}` ).then( img => {
            img.contain( img.bitmap.width, img.bitmap.width / 1.91 )
            return P( img.write, [ `${dir}/${file}-og.png` ], img )
        } )
    ) )
)
.catch( e => console.log( e.stack || e ) )
.then( () => process.exit(0) )
