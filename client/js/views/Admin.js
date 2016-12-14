module.exports = Object.assign( {}, require('./__proto__'), {

    navigate( path ) {
        this.path = path

        return ( path.length === 1 && this.els.container.classList.contains('hide') )
            ? Promise.all( Object.keys( this.subViews ).map( view => this.subViews[ view ].hide() ) ).then( () => this.show() ).catch( this.Error )
            : ( this.path.length > 1 )
                ? this.hide().then( () => this.renderSubView() )
                : true
    },

    postRender() {
        this.views = { }
        this.subViews = { }

        this.options = Object.create( this.Model, { resource: { value: 'admin' } } )

        this.options.get( { method: 'options' } )
        .then( () => {
            this.options.data.forEach( collection =>
                this.views[ collection ] = this.factory.create(
                    'AdminItem',
                    { insertion: { value: { el: this.els.container } },
                      model: { value: { data: { collection } } } }
                )
            )

            return this.path.length > 1
                ? this.hide().then( () => this.renderSubView() )
                : Promise.resolve()
        } )
        .catch( this.Error )

        return this
    },

    renderSubView() {
        const subViewName = `${this.capitalizeFirstLetter(this.path[1])}Resources`

        return this.subViews[ subViewName ]
            ? this.subViews[ subViewName ].onNavigation()
            : this.subViews[ subViewName ] = this.factory.create( subViewName, { insertion: { value: { el: this.els.container, method: 'insertBefore' } } } )
    },

    requiresLogin: true
} )
