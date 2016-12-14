module.exports = Object.assign( {}, require('./__proto__'), {

    navigate( path ) {
        this.path = path

        return ( path.length === 1 && this.els.container.classList.contains('hide') )
            ? this.show().catch( this.Error )
            : ( this.path.length > 1 )
                ? this.hide().then( () => this.renderSubView() )
                : true
    },

    postRender() {
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

        return this.views[ subViewName ]
            ? this.views[ subViewName ].handleNavigation()
            : this.views[ subViewName ] = this.factory.create( subViewName, { insertion: { value: { el: this.els.container, method: 'insertBefore' } } } )
    },

    requiresLogin: true
} )
