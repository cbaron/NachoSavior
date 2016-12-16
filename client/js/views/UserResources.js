module.exports = Object.assign( {}, require('./__proto__'), {

    createUserView( user ) {
        this.views[ user._id ] = this.factory.create(
            'User',
            { insertion: { value: { el: this.els.list } },
              model: { value: { data: user } }
            }
        )

        this.views[ user._id ]
        .on( 'edit', () => this.emit( 'navigate', `/admin/user/edit/${user._id}`) )
        .on( 'delete', () =>
            this.Xhr( { method: 'delete', resource: `user/${user._id}` } )
            .then( () => this.views[ user._id ].delete() )
            .catch( this.Error )
        )
    },

    delete() {
        return ( ( this.views.UserManage )
            ? this.views.UserManage.delete()
            : Promise.resolve() )
        .then( () => require('./__proto__').delete.call(this) )
    },

    events: {
        addBtn: 'click'
    },

    manageUser( type, user ) {
        this.views.UserManage 
            ? this.views.UserManage.onNavigation( type, user )
            : this.views.UserManage =
                this.factory.create( 'UserManage', { type: { value: type, writable: true }, model: { value: { data: user || {} } }, insertion: { value: { el: this.els.container, method: 'insertBefore' } } } )
                    .on( 'added', user => { this.createUserView(user); this.emit( 'navigate', `/admin/user` ); } )
                    .on( 'edited', user => { this.views[ user._id ].update( user ); this.emit( 'navigate', `/admin/user` ); } )
                    .on( 'cancelled', () => this.emit( 'navigate', `/admin/user` ) )
    },

    onAddBtnClick() { this.emit( 'navigate', `/admin/user/add` ) },

    onNavigation( path ) {
        this.path = path;

        ( path.length === 2 && this.els.container.classList.contains('hide') ) 
            ? this.views.UserManage && !this.views.UserManage.els.container.classList.contains('hide')
                ? this.views.UserManage.hide().then( () => this.show() )
                : this.show()
            : path.length === 3
                ? this.hide().then( () => this.manageUser( path[2], { } ) )
                : path.length === 4
                     ? this.hide().then( () => this.manageUser( path[2], this.views[ path[3] ].model.data ) )
                     : undefined
    },

    postRender() {

        if( this.path.length > 2 ) {
            this.els.container.classList.add( 'hidden', 'hide' )
            if( this.path[2] === "add" ) { this.manageUser( "add", { } ) }
            else if( this.path[2] === "edit" && this.path[3] ) {
                this.Xhr( { method: "get", resource: `user/${this.path[3]}` } )
                .then( response => this.manageUser( "edit", response ) )
                .catch( e => { this.Error(e); this.emit( 'navigate', `/admin/user` ) } )
            }
        } else if( this.path.length === 1 && this.views.UserManage ) {
            this.views.UserManage.hide()
        }

        this.users = Object.create( this.Model, { resource: { value: 'user' } } )

        this.users.get()
        .then( () => Promise.resolve( this.users.data.forEach( user => this.createUserView( user ) ) ) )
        .catch( this.Error )

        return this
    },

    requiresLogin: true
} )
