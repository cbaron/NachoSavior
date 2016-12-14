module.exports = Object.assign( {}, require('./__proto__'), {

    createComicView( comic ) {
        this.views[ comic._id ] = this.factory.create(
            'Comic',
            { insertion: { value: { el: this.els.list } },
              model: { value: { data: comic } }
            }
        )

        this.views[ comic._id ].on( 'edit', () => this.manageComic('edit', comic) )
    },

    events: {
        addBtn: 'click'
    },

    manageComic( type, comic ) {
        this.hide().then( () => {
            this.views.ComicManage 
                ? this.views.ComicManage.onNavigation( type, comic )
                : this.views.ComicManage =
                    this.factory.create( 'ComicManage', { type: { value: type, writable: true }, model: { value: { data: comic || {} } }, insertion: { value: { el: this.els.container, method: 'insertBefore' } } } )
                    .on( 'added', comic => { this.createComicView(comic); this.show() } )
                    .on( 'edited', comic => { this.views[ comic._id ].update( comic ); this.show() } )
                    .on( 'cancelled', () => this.show() )
        } )
    },

    onAddBtnClick() { this.manageComic('add') },

    onNavigation( path ) {
        ( path.length === 2 && this.els.container.classList.contains('hide') ) 
            ? this.show()
            : path.length === 3
                ? this.manageComic( path[2], { } )
                : path.length === 4
                     ? this.manageComic( path[2], this.views[ path[3] ].model.data )
                     : undefined
    },

    postRender() {
        this.comics = Object.create( this.Model, { resource: { value: 'comic' } } )

        this.comics.get()
        .then( () => Promise.resolve( this.comics.data.forEach( comic => this.createComicView( comic ) ) ) )
        .catch( this.Error )

        return this
    },

    requiresLogin: true
} )
