module.exports = Object.assign( {}, require('./__proto__'), {

    createUserView( user ) {
        this.views[ user._id ] = this.factory.create(
            'User',
            { insertion: { value: { el: this.els.list } },
              model: { value: { data: user } }
            }
        )

        this.views[ user._id ].on( 'edit', () => this.manageUser('edit', user) )
    },

    events: {
        addBtn: 'click'
    },

    manageUser( type, user ) {
        this.hide().then( () => {
            this.views.UserManage 
                ? this.views.UserManage.onNavigation( type, user )
                : this.views.UserManage =
                    this.factory.create( 'UserManage', { type: { value: type, writable: true }, model: { value: { data: user || {} } }, insertion: { value: { el: this.els.container, method: 'insertBefore' } } } )
                    .on( 'added', user => { this.createUserView(user); this.show() } )
                    .on( 'edited', user => { this.views[ user._id ].update( user ); this.show() } )
                    .on( 'cancelled', () => this.show() )
        } )
    },

    onAddBtnClick() { this.manageUser('add' ) },

    onNavigation( path ) {
        if( this.els.container.classList.contains('hide') ) return this.show()
    },

    postRender() {
        this.users = Object.create( this.Model, { resource: { value: 'user' } } )

        this.users.get()
        .then( () => Promise.resolve( this.users.data.forEach( user => this.createUserView( user ) ) ) )
        .catch( this.Error )

        return this
    },

    requiresLogin: true
} )
