module.exports = Object.create( {

    Error: require('../../lib/MyError'),
    
    User: require('./models/User'),

    ViewFactory: require('./factory/View'),
    
    Views: require('./.ViewMap'),

    initialize() {
        this.contentContainer = document.querySelector('#content')

        window.onpopstate = this.handle.bind(this)

        this.header = this.ViewFactory.create( 'header', { insertion: { value: { el: this.contentContainer, method: 'insertBefore' } } } )

        this.User.get().then( () =>
        
            this.header.onUser()
            .on( 'signout', () => 
                Promise.all( Object.keys( this.views ).map( name => this.views[ name ].delete() ) )
                .then( () => {
                    this.views = { }
                    history.pushState( {}, '', '/' );
                    return Promise.resolve( this.handle() )
                } )
                .catch( this.Error )
            )

        )
        .catch( this.Error )
        .then( () => this.handle() )

        return this
    },

    handle() {
        this.handler( window.location.pathname.split('/').slice(1) )
    },

    handler( path ) {
        const isComic = Boolean( path[0] && path.length === 1 && (!/^(admin|comic)$/i.test( path[0] )))
        const name = isComic
            ? 'Comic'
            : path[0]
                ? path[0].charAt(0).toUpperCase() + path[0].slice(1)
                : '';
        
        let view = this.Views[name] ? path[0] : 'home';
        
        if( isComic ) { view = 'comic'; }

        ( ( view === this.currentView )
            ? Promise.resolve()
            : Promise.all( Object.keys( this.views ).map( view => this.views[ view ].hide() ) ) ) 
        .then( () => {

            this.currentView = view

            if( this.views[ view ] ) return this.views[ view ].navigate( path )

            return Promise.resolve(
                this.views[ view ] =
                    this.ViewFactory.create( view, {
                        insertion: { value: { el: this.contentContainer } },
                        path: { value: path, writable: true },
                        templateOpts: { value: { readOnly: true } }
                    } )
            )
        } )
        .catch( this.Error )
    },

    navigate( location ) {
        history.pushState( {}, '', location )
        this.handle()
    }

}, { currentView: { value: '', writable: true }, views: { value: { } , writable: true } } )
