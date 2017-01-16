module.exports = Object.assign( {}, require('./__proto__'), {

    events: {
        cancel: 'click',
        confirm: 'click',
        delete: 'click',
        edit: 'click',
        facebook: 'click',
        google: 'click',
        store: 'click',
        title: 'click',
        twitter: 'click'
    },

    getLink() {
        return `${window.location.origin}/comic/${this.model.data._id}`
    },

    getComic() {
        return `${window.location.origin}${this.model.data.image}`
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

    onFacebookClick() { window.open( `https://www.facebook.com/sharer.php?u=${this.getLink()}` ) },

    onStoreClick() {
        window.open(
            `http://www.zazzle.com/api/create/at-238357470884685468?rf=238357470884685468&ax=DesignBlast&sr=250782469400013616&cg=196167085186428961&t__useQpc=false&ds=true&t__smart=true&continueUrl=http%3A%2F%2Fwww.zazzle.com%2Ftinyhanded&fwd=ProductPage&tc=&ic=&t_image1_iid=${encodeURIComponent(this.getComic())}`
        )
    },
    
    onGoogleClick() { window.open( `https://plus.google.com/share?url={${this.getLink()}}`) },
    
    onTitleClick() { this.emit( 'navigate', `/comic/${this.model.data._id}` ) },

    onTwitterClick() { window.open( `https://www.twitter.com/share?url=${this.getLink()}&via=tinyhanded&text=${encodeURIComponent(this.model.data.title)}` ) },

    postRender() {
        if( this.model && this.model.data._id ) {
            if( ! this.model.data.context ) { this.els.context.style.display = 'none' }
            return this
        }

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
        this.els.preContext.textContent = comic.preContext
        this.els.postContext.textContent = comic.postContext
        this.els.image.src = `${comic.image}?${new Date().getTime()}`

        if( ! comic.context ) { this.els.context.style.display = 'none' }
        else {
            this.els.context.src = comic.context
            this.els.context.style.display = 'block'
        }
    }
} )
