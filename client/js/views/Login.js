module.exports = Object.assign( {}, require('./__proto__'), {
    
    events: {
        submit: 'click'
    },

    onSubmitClick() {
        this.Xhr( { method: 'post', resource: 'auth', data: JSON.stringify( { username: this.els.username.value, password: this.els.password.value } ) } )
        .then( () => this.user.get() )
        .then( () => this.hide() )
        .then( () => Promise.resolve( this.emit( 'loggedIn' )) )
        .catch( this.Error )
    }
} )
