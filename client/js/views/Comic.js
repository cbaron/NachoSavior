module.exports = Object.assign( {}, require('./__proto__'), {

    events: {
        edit: 'click'
    },

    onEditClick() {
        this.emit('edit')
    },

    update(comic) {
        this.model.data = comic
        this.els.title.textContent = comic.title
        this.els.image.src = comic.image
    }
} )
