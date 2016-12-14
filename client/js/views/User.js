module.exports = Object.assign( {}, require('./__proto__'), {

    events: {
        edit: 'click'
    },

    onEditClick() {
        this.emit('edit')
    }

} )
