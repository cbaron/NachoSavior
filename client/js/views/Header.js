module.exports = Object.assign( {}, require('./__proto__'), {

    events: {
        logo: 'click'
    },

    onUser() {
        return this
    },

    onLogoClick() {
        this.signout()
    },

    requiresLogin: false,
    
    signout() {

        document.cookie = `${window.cookieName}=; expires=Thu, 01 Jan 1970 00:00:01 GMT;`;

        this.user.data = { }

        this.emit( 'signout' )

    }

} )
