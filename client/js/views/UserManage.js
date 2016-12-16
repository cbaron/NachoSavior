module.exports = Object.assign( {}, require('./__proto__'), {

    events: {
        cancel: 'click',
        submit: 'click'
    },

    onCancelClick() { this.hide().then( () => this.emit('cancelled') ) },
    
    onSubmitClick() {
        this[ `request${this.capitalizeFirstLetter( this.type )}` ]()
        .catch( this.Error )
    },

    onNavigation( type, comic ) {
        this.type = type
        this.model.data = comic
       
        this.populate() 
        
        if( this.els.container.classList.contains('hide') ) this.show()
    },

    populate() {
        this.els.title.textContent = `${this.capitalizeFirstLetter( this.type )} User`

        this.els.username.value = Object.keys( this.model.data ).length ? this.model.data.username : ''
        this.els.password.value = ''
    },

    postRender() {
        this.populate() 
            
        return this
    },

    requestAdd() {
        if( this.els.password.value.length === 0 ) return
        return this.Xhr( { method: 'POST', resource: 'user', data: JSON.stringify( { username: this.els.username.value, password: this.els.password.value } ) } )
        .then( response => this.hide().then( () => this.emit( 'added', { _id: response._id, username: response.username } ) ) )
    },

    requestEdit() {
        let data = { username: this.els.username.value }

        if( this.els.password.value.length ) data.password = this.els.password.value
        return this.Xhr( { method: 'PATCH', resource: `user/${this.user.data._id}`, data: JSON.stringify( data ) } )
        .then( response => this.hide().then( () => this.emit( 'edited', { _id: response._id, username: response.username } ) ) )
    }
} )
