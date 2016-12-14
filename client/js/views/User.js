module.exports = Object.assign( {}, require('./__proto__'), {

    events: {
        edit: 'click'
    },

    getTemplateOptions() {
        return Object.assign( require('./__proto__').getTemplateOptions.call(this), { user: this.user.data } )
    },

    onEditClick() {
        this.emit('edit')
    },

    update(user) {
        this.user.data = user
        this.els.username.textContent = user.username
    }

} )
