module.exports = Object.create( Object.assign( {}, require('./__proto__'), {

    constructor() {
        return Object.assign( this, {
            els: { },
            slurp: { attr: 'data-js', view: 'data-view' },
            template: require('./templates/Toast')
        } )
        .render()
    },

    factory( text ) {
        this.els.content.textContent = text
        return this.show().then( () => this.hide() )
    },

    insertion: { el: document.querySelector('body') },

    name: 'Toast',

    postRender() {

        return this.factory.bind(this)
    }
    
} ), { } ).constructor()
