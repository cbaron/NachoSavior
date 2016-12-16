module.exports = Object.assign( {}, require('./__proto__'), {

    events: {
        cancel: 'click',
        submit: 'click'
    },

    onCancelClick() { this.hide().then( () => this.emit('cancelled') ) },
    
    onSubmitClick() {
        this[ `request${this.capitalizeFirstLetter( this.type )}` ]()
        .catch( this.Error )
    },

    onNavigation( type, comic ) {
        this.type = type
        this.model.data = comic
       
        this.populate() 

        if( this.els.container.classList.contains('hide') ) this.show()
    },

    populate() {
        this.els.header.textContent = `${this.capitalizeFirstLetter( this.type )} Comic`

        if( Object.keys( this.model.data ).length ) {
            this.els.title.value = this.model.data.title || ''
            this.els.preview.src = this.model.data.image
        } else {
            this.els.title.value = ''
            this.els.preview.src = ''
        }
    },

    postRender() {
        this.spinner = new this.Spinner( {
            color: '#fff',
            length: 15,
            scale: 0.25,
            width: 5
        } ).spin()

        this.populate()

        this.els.image.addEventListener( 'change', e => {
            const base64Reader = new FileReader(),
                  binaryReader = new FileReader()
            
            this.els.upload.classList.add('has-spinner')
            this.els.upload.appendChild( this.spinner.spin().el )

            base64Reader.onload = ( evt ) => {
                this.file = evt.target.result
                this.els.upload.classList.remove('has-spinner')
                this.spinner.stop()
                this.els.preview.src = evt.target.result 
                binaryReader.onload = event => this.binaryFile = event.target.result
                binaryReader.readAsArrayBuffer( e.target.files[0] )
            }

            base64Reader.readAsDataURL( e.target.files[0] )
        } )
            
        return this
    },

    requestAdd() {
        return this.Xhr( { method: 'POST', resource: 'file', data: this.binaryFile, headers: { contentType: 'application/octet-stream' } } )
        .then( response => this.Xhr( { method: 'POST', resource: 'comic', data: JSON.stringify( { title: this.els.title.value, image: response.path } ) } ) )
        .then( response => this.hide().then( () => this.emit( 'added', response ) ) )
    },

    requestEdit() {
        let data = { title: this.els.title.value }
        
        return ( ( this.binaryFile )
            ? this.Xhr( { method: 'PATCH', resource: `file/${this.model.data.image.split('/')[4]}`, data: this.binaryFile, headers: { contentType: 'application/octet-stream' } } )
            : Promise.resolve() )
        .then( () => this.Xhr( { method: 'PATCH', resource: `comic/${this.model.data._id}`, data: JSON.stringify( data ) } ) )
        .then( response => this.hide().then( () => this.emit( 'edited', response ) ) )
    }
} )
