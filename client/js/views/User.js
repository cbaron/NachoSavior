module.exports = Object.assign( {}, require('./__proto__'), {

    events: {
        cancel: 'click',
        confirm: 'click',
        delete: 'click',
        edit: 'click'
    },

    onCancelClick() {
        this.els.username.classList.remove('hidden')
        this.els.confirmDialog.classList.add('hidden')
    },

    onConfirmClick() {
        this.emit('delete')
    },

    onDeleteClick() {
        if( this.user && this.user.data._id ) {
            this.els.username.classList.add('hidden')
            this.els.confirmDialog.classList.remove('hidden')
        }
    },

    onEditClick() {
        if( this.user && this.user.data._id ) this.emit('edit')
    },

    update(user) {
        this.user.data = user
        this.els.username.textContent = user.username
    }

} )
