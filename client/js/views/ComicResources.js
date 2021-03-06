module.exports = Object.assign( {}, require('./__proto__'), {

    createComicView( comic, opts={} ) {
        this.views[ comic._id ] = this.factory.create(
            'Comic',
            { insertion: opts.insertion || { value: { el: this.els.list } },
              model: { value: { data: comic } }
            }
        )

        this.views[ comic._id ]
        .on( 'edit', () => this.emit( 'navigate', `/admin/comic/edit/${comic._id}`) )
        .on( 'delete', () =>
            this.Xhr( { method: 'delete', resource: `comic/${comic._id}` } )
            .then( () => this.views[ comic._id ].delete() )
            .catch( this.Error )
        )
    },

    delete() {
        return ( ( this.views.ComicManage )
            ? this.views.ComicManage.delete()
            : Promise.resolve() )
        .then( () => require('./__proto__').delete.call(this) )
    },

    events: {
        addBtn: 'click'
    },

    fetchAndDisplay() {
        this.fetching = true
        return this.comics.get()
        .then( response => {
            response.forEach( comic => this.createComicView(comic) )
            return Promise.resolve(this.fetching = false )
        } )
    },

    manageComic( type, comic ) {
        this.views.ComicManage 
            ? this.views.ComicManage.onNavigation( type, comic )
            : this.views.ComicManage =
                this.factory.create( 'ComicManage', { type: { value: type, writable: true }, model: { value: { data: comic || {} } }, insertion: { value: { el: this.els.container, method: 'insertBefore' } } } )
                .on( 'added', comic => { this.createComicView(comic, { insertion: { value: { el: this.els.list.firstChild, method: 'insertBefore' } } } ); this.emit( 'navigate', `/admin/comic` ); } )
                .on( 'cancelled', () => this.emit( 'navigate', `/admin/comic` ) )
                .on( 'edited', comic => { this.views[ comic._id ].update( comic ); this.emit( 'navigate', `/admin/comic` ); } )
    },

    onAddBtnClick() { this.emit( 'navigate', `/admin/comic/add` ) },

    onNavigation( path ) {
        this.path = path;

        ( path.length === 2 && this.els.container.classList.contains('hide') ) 
            ? this.views.ComicManage && !this.views.ComicManage.els.container.classList.contains('hide')
                ? this.views.ComicManage.hide().then( () => this.show() )
                : this.show()
            : path.length === 3
                ? this.hide().then( () => this.manageComic( path[2], { } ) )
                : path.length === 4
                     ? this.hide().then( () => this.manageComic( path[2], this.views[ path[3] ].model.data ) )
                     : undefined
    },

    onScroll( e ) {
        if( this.fetching || this.isHidden() ) return
        if( ( this.content.offsetHeight - ( window.scrollY + window.innerHeight ) ) < 100 ) window.requestAnimationFrame( this.fetchAndDisplay.bind(this).catch( this.Error ) )
    },

    postRender() {
        this.content = document.querySelector('#content')

        if( this.path.length > 2 ) {
            this.els.container.classList.add( 'hidden', 'hide' )
            if( this.path[2] === "add" ) { this.manageComic( "add", { } ) }
            else if( this.path[2] === "edit" && this.path[3] ) {
                this.Xhr( { method: "get", resource: `comic/${this.path[3]}` } )
                .then( response => this.manageComic( "edit", response ) )
                .catch( e => { this.Error(e); this.emit( 'navigate', `/admin/comic` ) } )
            }
        } else if( this.path.length === 1 && this.views.ComicManage ) {
            this.views.ComicManage.hide()
        }

        this.comics = Object.create( this.Model, { pagination: { value: { skip: 0, limit:10, sort: { created: -1 } } }, resource: { value: 'comic' } } )
        
        this.fetchAndDisplay().catch( this.Error )

        window.addEventListener( 'scroll', e => this.onScroll(e) )

        return this
    },

    requiresLogin: true
} )
