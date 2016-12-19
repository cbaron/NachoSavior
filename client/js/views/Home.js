module.exports = Object.assign( {}, require('./__proto__'), {

    fetchAndDisplay() {
        this.fetching = true
        return this.getData()
        .then( response => {
            response.forEach( comic =>
                this.views[ comic._id ] =
                    this.factory.create( 'comic', { insertion: { value: { el: this.els.container } }, model: { value: { data: comic } }, templateOpts: { value: { readOnly: true } } } )
            )
            return Promise.resolve(this.fetching = false )
        } )
    },

    getData() {
        if( !this.model ) this.model = Object.create( this.Model, { pagination: { value: { skip: 0, limit:10, sort: { created: -1 } } }, resource: { value: 'comic' } } )

        return this.model.get()
    },

    navigate() {
        this.show()
    },

    onScroll( e ) {
        if( this.fetching ) return
        if( ( this.content.offsetHeight - ( window.scrollY + window.innerHeight ) ) < 100 ) window.requestAnimationFrame( this.fetchAndDisplay.bind(this) )
    },

    postRender() {
        this.content = document.querySelector('#content')
        
        this.fetchAndDisplay().catch( this.Error )

        window.addEventListener( 'scroll', e => this.onScroll(e) )

        return this
    }

} )
