module.exports = Object.assign( {}, require('./__proto__'), {

    navigate( path ) {
        this.path = path;

        return ( path.length === 1 && this.els.container.classList.contains('hide') )
            ? Promise.all( Object.keys( this.subViews ).map( view => this.subViews[ view ].hide() ) ).then( () => this.show() ).catch( this.Error )
            : ( this.path.length > 1 )
                ? ( this.els.container.classList.contains('hide') )
                    ? this.renderSubView()
                    : this.hide().then( () => this.renderSubView() )
                : Promise.resolve()
    },

    postRender() {
        this.views = { }
        this.subViews = { }

        if( this.path.length > 1 ) {
            this.els.container.classList.add( 'hide', 'hidden' )
            this.renderSubView()
        }

        this.options = Object.create( this.Model, { resource: { value: 'admin' } } )

        this.options.get( { method: 'options' } )
        .then( () =>
            this.options.data.forEach( collection =>
                this.views[ collection ] = this.factory.create(
                    'AdminItem',
                    { insertion: { value: { el: this.els.list } },
                      model: { value: { data: { collection } } } }
                )
            )
        )
        .catch( this.Error )

        return this
    },

    renderSubView() {
        const subViewName = `${this.capitalizeFirstLetter(this.path[1])}Resources`

        return this.subViews[ subViewName ]
            ? this.subViews[ subViewName ].onNavigation( this.path )
            : this.subViews[ subViewName ] = this.factory.create( subViewName, { path: { value: this.path, writable: true }, insertion: { value: { el: this.els.container, method: 'insertBefore' } } } )
    },

    requiresLogin: true
} )
