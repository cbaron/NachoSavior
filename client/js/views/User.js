module.exports = Object.assign( {}, require('./__proto__'), {

    events: {
        edit: 'click'
    },

    onEditClick() {
        if( this.user && this.user.data._id ) this.emit('edit')
    },

    update(user) {
        this.user.data = user
        this.els.username.textContent = user.username
    }

} )
