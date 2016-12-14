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
                    this.factory.create( 'ComicManage', { type: { value: type }, model: { value: { data: comic || {} } }, insertion: { value: { el: this.els.container, method: 'insertBefore' } } } )
                    .on( 'added', comic => { this.createComicView(comic); this.show() } )
                    .on( 'edited', comic => { this.views[ comic._id ].update( comic ); this.show() } )
                    .on( 'cancelled', () => this.show() )
        } )
    },

    onAddBtnClick() { this.manageComic( 'add', { } ) },

    onNavigation( path ) {
        if( this.els.container.classList.contains('hide') ) return this.show()
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
