module.exports = Object.assign( {}, require('./__proto__'), {

    events: {
        cancel: 'click',
        confirm: 'click',
        delete: 'click',
        edit: 'click',
        facebook: 'click',
        google: 'click',
        title: 'click',
        twitter: 'click'
    },

    getLink() {
        return `${window.location.origin}/comic/${this.model.data._id}`
    },

    getComic() {
        return encodeURIComponent( `${window.location.origin}${this.model.data.image}` )
    },

    navigate( path ) {
        this.path = path
        this.model.resource = `comic/${this.path[1]}`

        this.model.get()
        .then( comic => {
            this.update(comic)
            return this.show()
        } )
        .catch( this.Error )
    },

    onCancelClick() {
        this.els.header.classList.remove('hidden')
        this.els.confirmDialog.classList.add('hidden')
    },

    onConfirmClick() {
        this.emit('delete')
    },

    onDeleteClick() {
        if( this.user && this.user.data._id ) {
            this.els.header.classList.add('hidden')
            this.els.confirmDialog.classList.remove('hidden')
        }
    },

    onEditClick() {
        if( this.user && this.user.data._id ) this.emit('edit')
    },

    //onFacebookClick() { window.open( `https://www.facebook.com/share.php?u=${this.getLink()}` ) },

    onFacebookClick() {
        console.log(`http://www.zazzle.com/api/create/at-238357470884685468?rf=238357470884685468&` +
            `ax=designblast&br=true&cg=196167085186428961&t__useQpc=true&ed=false&t__smart=true&` +
            `continueUrl=${encodeURIComponent(window.location.origin)}&fwd=ProductPage&tc=${window.location}&ic=${this.model.data._id}&image1=${this.getComic()}`);

        window.open(
            `http://www.zazzle.com/api/create/at-238357470884685468?rf=238357470884685468&` +
            `ax=designblast&br=true&cg=196167085186428961&t__useQpc=true&ed=false&t__smart=true&` +
            `continueUrl=${encodeURIComponent(window.location.origin)}&fwd=ProductPage&tc=${window.location}&ic=${this.model.data._id}&image1=${this.getComic()}` )
    },
    
    onGoogleClick() { window.open( `https://plus.google.com/share?url={${this.getLink()}}`) },
    
    onTitleClick() { this.emit( 'navigate', `/comic/${this.model.data._id}` ) },

    onTwitterClick() { window.open( `https://www.twitter.com/share?url=${this.getLink()}&via=tinyhanded&text=${encodeURIComponent(this.model.data.title)}` ) },

    postRender() {
        if( this.model && this.model.data._id ) return this

        if( this.path.length !== 2 ) { this.emit( 'navigate', '' ); return this }

        this.model = Object.create( this.Model, { resource: { value: `comic/${this.path[1]}`, writable: true } } )
        this.model.get()
        .then( this.update.bind(this) )
        .catch( this.Error )

        return this
    },

    update(comic) {
        this.model.data = comic
        this.els.title.textContent = comic.title
        this.els.image.src = `${comic.image}?${new Date().getTime()}`
    }
} )
