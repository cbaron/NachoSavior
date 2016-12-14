module.exports = Object.assign( {}, require('./__proto__'), {

    events: {
        container: 'click'
    },

    onContainerClick() {
        this.emit( 'navigate', `/admin/${this.model.data.collection}` )
    }
} )
