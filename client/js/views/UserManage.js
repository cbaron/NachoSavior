module.exports = Object.assign( {}, require('./__proto__'), {

    events: {
        cancel: 'click',
        submit: 'click'
    },

    onCancelClick() { this.hide().then( () => this.emit('cancelled') ) },
    
    onSubmitClick() {
        this[ `request${this.capitalizeFirstLetter(type)}` ]()
        this.Xhr( { method: this.type === "add" ? 'POST' : 'PATCH', resource: this.type
        this.hide().then( () => this.emit('cancelled') )
    },

    postRender() {
        this.els.title.textContent = `${this.capitalizeFirstLetter( this.type )} User`

        if( Object.keys( this.model.data ).length ) this.els.username.value = this.model.data.username
            
        return this
    },

    requestAdd() {
        this.Xhr( { method: 'POST', resource: 'user', data: JSON.stringify( { username: this.els.username.value, password: this.els.password.value } ) } )
        .then( response => this.hide().then( () => this.emit( 'added', { _id: response._id, username: response.username } ) ) )
    },

    requestEdit() {
        this.Xhr( { method: 'PATCH', resource: `user/${this.user.data._id}`, data: JSON.stringify( { username: this.els.username.value, password: this.els.password.value } ) } )
        .then( response => this.hide().then( () => this.emit( 'edited', { _id: response._id, username: response.username } ) ) )
    }
} )
