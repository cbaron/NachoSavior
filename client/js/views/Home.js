module.exports = Object.assign( {}, require('./__proto__'), {

    fetchAndDisplay() {
        return this.getData()
        .then( response => 
            response.forEach( comic =>
                this.views[ comic._id ] =
                    this.factory.create( 'comic', { insertion: { value: { el: this.els.container } }, model: { value: { data: comic } }, templateOpts: { value: { readOnly: true } } } )
            )
        )
    },

    getData() {
        if( !this.model ) this.model = Object.create( this.Model, { pagination: { value: { skip: 0, limit:10, sort: { created: -1 } } }, resource: { value: 'comic' } } )

        return this.model.get()
    },

    navigate() {
        this.show()
    },

    postRender() {
        this.fetchAndDisplay().catch( this.Error )
        return this
    }

} )
