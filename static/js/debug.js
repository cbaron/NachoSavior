(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

module.exports = {
	Admin: require('./views/templates/Admin'),
	AdminItem: require('./views/templates/AdminItem'),
	Comic: require('./views/templates/Comic'),
	ComicManage: require('./views/templates/ComicManage'),
	ComicResources: require('./views/templates/ComicResources'),
	Header: require('./views/templates/Header'),
	Home: require('./views/templates/Home'),
	Login: require('./views/templates/Login'),
	User: require('./views/templates/User'),
	UserManage: require('./views/templates/UserManage'),
	UserResources: require('./views/templates/UserResources')
};

},{"./views/templates/Admin":24,"./views/templates/AdminItem":25,"./views/templates/Comic":26,"./views/templates/ComicManage":27,"./views/templates/ComicResources":28,"./views/templates/Header":29,"./views/templates/Home":30,"./views/templates/Login":31,"./views/templates/User":32,"./views/templates/UserManage":33,"./views/templates/UserResources":34}],2:[function(require,module,exports){
'use strict';

module.exports = {
	Admin: require('./views/Admin'),
	AdminItem: require('./views/AdminItem'),
	Comic: require('./views/Comic'),
	ComicManage: require('./views/ComicManage'),
	ComicResources: require('./views/ComicResources'),
	Header: require('./views/Header'),
	Home: require('./views/Home'),
	Login: require('./views/Login'),
	User: require('./views/User'),
	UserManage: require('./views/UserManage'),
	UserResources: require('./views/UserResources')
};

},{"./views/Admin":10,"./views/AdminItem":11,"./views/Comic":12,"./views/ComicManage":13,"./views/ComicResources":14,"./views/Header":15,"./views/Home":16,"./views/Login":17,"./views/User":18,"./views/UserManage":19,"./views/UserResources":20}],3:[function(require,module,exports){
window.cookieName = 'cheetojesus'

},{}],4:[function(require,module,exports){
"use strict";

module.exports = Object.create(Object.assign({}, require('../../lib/MyObject'), {

    Request: {
        constructor: function constructor(data) {
            var _this = this;

            var req = new XMLHttpRequest();

            return new Promise(function (resolve, reject) {

                req.onload = function () {
                    [500, 404, 401].includes(this.status) ? reject(this.response) : resolve(JSON.parse(this.response));
                };

                if (data.method === "get" || data.method === "options") {
                    var qs = data.qs ? "?" + data.qs : '';
                    req.open(data.method, "/" + data.resource + qs);
                    _this.setHeaders(req, data.headers);
                    req.send(null);
                } else {
                    req.open(data.method, "/" + data.resource, true);
                    _this.setHeaders(req, data.headers);
                    req.send(data.data);
                }
            });
        },
        plainEscape: function plainEscape(sText) {
            /* how should I treat a text/plain form encoding? what characters are not allowed? this is what I suppose...: */
            /* "4\3\7 - Einstein said E=mc2" ----> "4\\3\\7\ -\ Einstein\ said\ E\=mc2" */
            return sText.replace(/[\s\=\\]/g, "\\$&");
        },
        setHeaders: function setHeaders(req) {
            var headers = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

            req.setRequestHeader("Accept", headers.accept || 'application/json');
            req.setRequestHeader("Content-Type", headers.contentType || 'text/plain');
        }
    },

    _factory: function _factory(data) {
        return Object.create(this.Request, {}).constructor(data);
    },
    constructor: function constructor() {

        if (!XMLHttpRequest.prototype.sendAsBinary) {
            XMLHttpRequest.prototype.sendAsBinary = function (sData) {
                var nBytes = sData.length,
                    ui8Data = new Uint8Array(nBytes);
                for (var nIdx = 0; nIdx < nBytes; nIdx++) {
                    ui8Data[nIdx] = sData.charCodeAt(nIdx) & 0xff;
                }
                this.send(ui8Data);
            };
        }

        return this._factory.bind(this);
    }
}), {}).constructor();

},{"../../lib/MyObject":39}],5:[function(require,module,exports){
'use strict';

module.exports = Object.create({
    create: function create(name, opts) {
        var lower = name;
        name = name.charAt(0).toUpperCase() + name.slice(1);
        return Object.create(this.Views[name], Object.assign({
            name: { value: name },
            factory: { value: this },
            template: { value: this.Templates[name] },
            user: { value: this.User }
        }, opts)).constructor().on('navigate', function (route) {
            return require('../router').navigate(route);
        }).on('deleted', function () {
            return delete require('../router').views[name];
        });
    }
}, {
    Templates: { value: require('../.TemplateMap') },
    User: { value: require('../models/User') },
    Views: { value: require('../.ViewMap') }
});

},{"../.TemplateMap":1,"../.ViewMap":2,"../models/User":7,"../router":9}],6:[function(require,module,exports){
'use strict';

window.onload = function () {
    require('./.env');
    require('./router').initialize();
};

},{"./.env":3,"./router":9}],7:[function(require,module,exports){
'use strict';

module.exports = Object.create(require('./__proto__.js'), { resource: { value: 'me' } });

},{"./__proto__.js":8}],8:[function(require,module,exports){
'use strict';

module.exports = Object.assign({}, require('../../../lib/MyObject'), require('events').EventEmitter.prototype, {

    Xhr: require('../Xhr'),

    get: function get() {
        var _this = this;

        var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        if (opts.query && this.pagination) Object.assign(opts.query, this.pagination);
        return this.Xhr({ method: opts.method || 'get', resource: this.resource, headers: this.headers || {}, qs: opts.query ? JSON.stringify(opts.query) : undefined }).then(function (response) {
            if (!_this.pagination) return Promise.resolve(_this.data = response);

            if (!_this.data) _this.data = [];
            _this.data = _this.data.concat(response);
            _this.pagination.skip += _this.pagination.limit;
            return Promise.resolve(response);
        });
    }
});

},{"../../../lib/MyObject":39,"../Xhr":4,"events":40}],9:[function(require,module,exports){
'use strict';

module.exports = Object.create({

    Error: require('../../lib/MyError'),

    User: require('./models/User'),

    ViewFactory: require('./factory/View'),

    Views: require('./.ViewMap'),

    initialize: function initialize() {
        var _this = this;

        this.contentContainer = document.querySelector('#content');

        window.onpopstate = this.handle.bind(this);

        this.header = this.ViewFactory.create('header', { insertion: { value: { el: this.contentContainer, method: 'insertBefore' } } });

        this.User.get().then(function () {
            return _this.header.onUser().on('signout', function () {
                return Promise.all(Object.keys(_this.views).map(function (name) {
                    return _this.views[name].delete();
                })).then(function () {
                    return _this.header.emit('navigate', '/');
                }).catch(_this.Error);
            });
        }).catch(this.Error).then(function () {
            return _this.handle();
        });

        return this;
    },
    handle: function handle() {
        this.handler(window.location.pathname.split('/').slice(1));
    },
    handler: function handler(path) {
        var _this2 = this;

        var name = path[0] ? path[0].charAt(0).toUpperCase() + path[0].slice(1) : '',
            view = this.Views[name] ? path[0] : 'home';

        (view === this.currentView ? Promise.resolve() : Promise.all(Object.keys(this.views).map(function (view) {
            return _this2.views[view].hide();
        }))).then(function () {

            _this2.currentView = view;

            if (_this2.views[view]) return _this2.views[view].navigate(path);

            return Promise.resolve(_this2.views[view] = _this2.ViewFactory.create(view, {
                insertion: { value: { el: _this2.contentContainer } },
                path: { value: path, writable: true }
            }));
        }).catch(this.Error);
    },
    navigate: function navigate(location) {
        history.pushState({}, '', location);
        this.handle();
    }
}, { currentView: { value: '', writable: true }, views: { value: {} } });

},{"../../lib/MyError":38,"./.ViewMap":2,"./factory/View":5,"./models/User":7}],10:[function(require,module,exports){
'use strict';

module.exports = Object.assign({}, require('./__proto__'), {
    delete: function _delete() {
        var _this = this;

        return Promise.all(Object.keys(this.subViews).map(function (subView) {
            return _this.subViews[subView].delete();
        })).then(function () {
            return require('./__proto__').delete.call(_this);
        });
    },
    navigate: function navigate(path) {
        var _this2 = this;

        this.path = path;

        return path.length === 1 && this.els.container.classList.contains('hide') ? Promise.all(Object.keys(this.subViews).map(function (view) {
            return _this2.subViews[view].hide();
        })).then(function () {
            return _this2.show();
        }).catch(this.Error) : this.path.length > 1 ? this.els.container.classList.contains('hide') ? this.renderSubView() : this.hide().then(function () {
            return _this2.renderSubView();
        }) : Promise.resolve();
    },
    postRender: function postRender() {
        var _this3 = this;

        this.views = {};
        this.subViews = {};

        if (this.path.length > 1) {
            this.els.container.classList.add('hide', 'hidden');
            this.renderSubView();
        }

        this.options = Object.create(this.Model, { resource: { value: 'admin' } });

        this.options.get({ method: 'options' }).then(function () {
            return _this3.options.data.forEach(function (collection) {
                return _this3.views[collection] = _this3.factory.create('AdminItem', { insertion: { value: { el: _this3.els.list } },
                    model: { value: { data: { collection: collection } } } });
            });
        }).catch(this.Error);

        return this;
    },
    renderSubView: function renderSubView() {
        var subViewName = this.capitalizeFirstLetter(this.path[1]) + 'Resources';

        return this.subViews[subViewName] ? this.subViews[subViewName].onNavigation(this.path) : this.subViews[subViewName] = this.factory.create(subViewName, { path: { value: this.path, writable: true }, insertion: { value: { el: this.els.container, method: 'insertBefore' } } });
    },


    requiresLogin: true
});

},{"./__proto__":21}],11:[function(require,module,exports){
'use strict';

module.exports = Object.assign({}, require('./__proto__'), {

    events: {
        container: 'click'
    },

    onContainerClick: function onContainerClick() {
        this.emit('navigate', '/admin/' + this.model.data.collection);
    }
});

},{"./__proto__":21}],12:[function(require,module,exports){
'use strict';

module.exports = Object.assign({}, require('./__proto__'), {

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

    getLink: function getLink() {
        return window.location.origin + '/comic/' + this.model.data._id;
    },
    getComic: function getComic() {
        return '' + window.location.origin + this.model.data.image;
    },
    navigate: function navigate(path) {
        var _this = this;

        this.path = path;
        this.model.resource = 'comic/' + this.path[1];

        this.model.get().then(function (comic) {
            _this.update(comic);
            return _this.show();
        }).catch(this.Error);
    },
    onCancelClick: function onCancelClick() {
        this.els.header.classList.remove('hidden');
        this.els.confirmDialog.classList.add('hidden');
    },
    onConfirmClick: function onConfirmClick() {
        this.emit('delete');
    },
    onDeleteClick: function onDeleteClick() {
        if (this.user && this.user.data._id) {
            this.els.header.classList.add('hidden');
            this.els.confirmDialog.classList.remove('hidden');
        }
    },
    onEditClick: function onEditClick() {
        if (this.user && this.user.data._id) this.emit('edit');
    },


    //onFacebookClick() { window.open( `https://www.facebook.com/share.php?u=${this.getLink()}` ) },

    onFacebookClick: function onFacebookClick() {
        window.open('http://www.zazzle.com/api/create/at-238555878123854031?rf=238357470884685468&' + 'ax=DesignBlast&sr=250375202542180800&cg=0&t__useQpc=true&ed=false&t__smart=true&' + ('continueUrl=' + encodeURIComponent(window.location.origin) + '&fwd=ProductPage&tc=' + window.location + '&ic=' + this.model.data._id + '&image1=' + this.getComic()));
    },
    onGoogleClick: function onGoogleClick() {
        window.open('https://plus.google.com/share?url={' + this.getLink() + '}');
    },
    onTitleClick: function onTitleClick() {
        this.emit('navigate', '/comic/' + this.model.data._id);
    },
    onTwitterClick: function onTwitterClick() {
        window.open('https://www.twitter.com/share?url=' + this.getLink() + '&via=tinyhanded&text=' + encodeURIComponent(this.model.data.title));
    },
    postRender: function postRender() {
        if (this.model && this.model.data._id) return this;

        if (this.path.length !== 2) {
            this.emit('navigate', '');return this;
        }

        this.model = Object.create(this.Model, { resource: { value: 'comic/' + this.path[1], writable: true } });
        this.model.get().then(this.update.bind(this)).catch(this.Error);

        return this;
    },
    update: function update(comic) {
        this.model.data = comic;
        this.els.title.textContent = comic.title;
        this.els.image.src = comic.image + '?' + new Date().getTime();
    }
});

},{"./__proto__":21}],13:[function(require,module,exports){
'use strict';

module.exports = Object.assign({}, require('./__proto__'), {

    events: {
        cancel: 'click',
        submit: 'click'
    },

    onCancelClick: function onCancelClick() {
        var _this = this;

        this.hide().then(function () {
            return _this.emit('cancelled');
        });
    },
    onSubmitClick: function onSubmitClick() {
        this['request' + this.capitalizeFirstLetter(this.type)]().catch(this.Error);
    },
    onNavigation: function onNavigation(type, comic) {
        this.type = type;
        this.model.data = comic;

        this.populate();

        if (this.els.container.classList.contains('hide')) this.show();
    },
    populate: function populate() {
        this.els.header.textContent = this.capitalizeFirstLetter(this.type) + ' Comic';

        if (Object.keys(this.model.data).length) {
            this.els.title.value = this.model.data.title || '';
            this.els.preview.src = this.model.data.image;
        } else {
            this.els.title.value = '';
            this.els.preview.src = '';
        }
    },
    postRender: function postRender() {
        var _this2 = this;

        this.spinner = new this.Spinner({
            color: '#fff',
            length: 15,
            scale: 0.25,
            width: 5
        }).spin();

        this.populate();

        this.els.image.addEventListener('change', function (e) {
            var base64Reader = new FileReader(),
                binaryReader = new FileReader();

            _this2.els.upload.classList.add('has-spinner');
            _this2.els.upload.appendChild(_this2.spinner.spin().el);

            base64Reader.onload = function (evt) {
                _this2.file = evt.target.result;
                _this2.els.upload.classList.remove('has-spinner');
                _this2.spinner.stop();
                _this2.els.preview.src = evt.target.result;
                binaryReader.onload = function (event) {
                    return _this2.binaryFile = event.target.result;
                };
                binaryReader.readAsArrayBuffer(e.target.files[0]);
            };

            base64Reader.readAsDataURL(e.target.files[0]);
        });

        return this;
    },
    requestAdd: function requestAdd() {
        var _this3 = this;

        return this.Xhr({ method: 'POST', resource: 'file', data: this.binaryFile, headers: { contentType: 'application/octet-stream' } }).then(function (response) {
            return _this3.Xhr({ method: 'POST', resource: 'comic', data: JSON.stringify({ title: _this3.els.title.value, image: response.path }) });
        }).then(function (response) {
            return _this3.hide().then(function () {
                return _this3.emit('added', response);
            });
        });
    },
    requestEdit: function requestEdit() {
        var _this4 = this;

        var data = { title: this.els.title.value };

        return (this.binaryFile ? this.Xhr({ method: 'PATCH', resource: 'file/' + this.model.data.image.split('/')[4], data: this.binaryFile, headers: { contentType: 'application/octet-stream' } }) : Promise.resolve()).then(function () {
            return _this4.Xhr({ method: 'PATCH', resource: 'comic/' + _this4.model.data._id, data: JSON.stringify(data) });
        }).then(function (response) {
            return _this4.hide().then(function () {
                return _this4.emit('edited', response);
            });
        });
    }
});

},{"./__proto__":21}],14:[function(require,module,exports){
'use strict';

module.exports = Object.assign({}, require('./__proto__'), {
    createComicView: function createComicView(comic) {
        var _this = this;

        this.views[comic._id] = this.factory.create('Comic', { insertion: { value: { el: this.els.list } },
            model: { value: { data: comic } }
        });

        this.views[comic._id].on('edit', function () {
            return _this.emit('navigate', '/admin/comic/edit/' + comic._id);
        }).on('delete', function () {
            return _this.Xhr({ method: 'delete', resource: 'comic/' + comic._id }).then(function () {
                return _this.views[comic._id].delete();
            }).catch(_this.Error);
        });
    },
    delete: function _delete() {
        var _this2 = this;

        return (this.views.ComicManage ? this.views.ComicManage.delete() : Promise.resolve()).then(function () {
            return require('./__proto__').delete.call(_this2);
        });
    },


    events: {
        addBtn: 'click'
    },

    manageComic: function manageComic(type, comic) {
        var _this3 = this;

        this.views.ComicManage ? this.views.ComicManage.onNavigation(type, comic) : this.views.ComicManage = this.factory.create('ComicManage', { type: { value: type, writable: true }, model: { value: { data: comic || {} } }, insertion: { value: { el: this.els.container, method: 'insertBefore' } } }).on('added', function (comic) {
            _this3.createComicView(comic);_this3.emit('navigate', '/admin/comic');
        }).on('cancelled', function () {
            return _this3.emit('navigate', '/admin/comic');
        }).on('edited', function (comic) {
            _this3.views[comic._id].update(comic);_this3.emit('navigate', '/admin/comic');
        });
    },
    onAddBtnClick: function onAddBtnClick() {
        this.emit('navigate', '/admin/comic/add');
    },
    onNavigation: function onNavigation(path) {
        var _this4 = this;

        this.path = path;

        path.length === 2 && this.els.container.classList.contains('hide') ? this.views.ComicManage && !this.views.ComicManage.els.container.classList.contains('hide') ? this.views.ComicManage.hide().then(function () {
            return _this4.show();
        }) : this.show() : path.length === 3 ? this.hide().then(function () {
            return _this4.manageComic(path[2], {});
        }) : path.length === 4 ? this.hide().then(function () {
            return _this4.manageComic(path[2], _this4.views[path[3]].model.data);
        }) : undefined;
    },
    postRender: function postRender() {
        var _this5 = this;

        if (this.path.length > 2) {
            this.els.container.classList.add('hidden', 'hide');
            if (this.path[2] === "add") {
                this.manageComic("add", {});
            } else if (this.path[2] === "edit" && this.path[3]) {
                this.Xhr({ method: "get", resource: 'comic/' + this.path[3] }).then(function (response) {
                    return _this5.manageComic("edit", response);
                }).catch(function (e) {
                    _this5.Error(e);_this5.emit('navigate', '/admin/comic');
                });
            }
        } else if (this.path.length === 1 && this.views.ComicManage) {
            this.views.ComicManage.hide();
        }

        this.comics = Object.create(this.Model, { resource: { value: 'comic' } });

        this.comics.get().then(function () {
            return Promise.resolve(_this5.comics.data.forEach(function (comic) {
                return _this5.createComicView(comic);
            }));
        }).catch(this.Error);

        return this;
    },


    requiresLogin: true
});

},{"./__proto__":21}],15:[function(require,module,exports){
'use strict';

module.exports = Object.assign({}, require('./__proto__'), {

    events: {
        logo: 'click'
    },

    onUser: function onUser() {
        return this;
    },
    onLogoClick: function onLogoClick() {
        this.signout();
    },


    requiresLogin: false,

    signout: function signout() {

        document.cookie = window.cookieName + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';

        this.user.data = {};

        this.emit('signout');
    }
});

},{"./__proto__":21}],16:[function(require,module,exports){
'use strict';

module.exports = Object.assign({}, require('./__proto__'), {
    fetchAndDisplay: function fetchAndDisplay() {
        var _this = this;

        return this.getData().then(function (response) {
            return response.forEach(function (comic) {
                return _this.views[comic._id] = _this.factory.create('comic', { insertion: { value: { el: _this.els.container } }, model: { value: { data: comic } }, templateOpts: { value: { readOnly: true } } });
            });
        });
    },
    getData: function getData() {
        if (!this.model) this.model = Object.create(this.Model, { pagination: { value: { skip: 0, limit: 10, sort: { created: -1 } } }, resource: { value: 'comic' } });

        return this.model.get();
    },
    navigate: function navigate() {
        this.show();
    },
    postRender: function postRender() {
        this.fetchAndDisplay().catch(this.Error);
        return this;
    }
});

},{"./__proto__":21}],17:[function(require,module,exports){
'use strict';

module.exports = Object.assign({}, require('./__proto__'), {

    events: {
        submit: 'click'
    },

    onSubmitClick: function onSubmitClick() {
        var _this = this;

        this.Xhr({ method: 'post', resource: 'auth', data: JSON.stringify({ username: this.els.username.value, password: this.els.password.value }) }).then(function () {
            return _this.user.get();
        }).then(function () {
            return _this.hide();
        }).then(function () {
            return Promise.resolve(_this.emit('loggedIn'));
        }).catch(this.Error);
    }
});

},{"./__proto__":21}],18:[function(require,module,exports){
'use strict';

module.exports = Object.assign({}, require('./__proto__'), {

    events: {
        cancel: 'click',
        confirm: 'click',
        delete: 'click',
        edit: 'click'
    },

    onCancelClick: function onCancelClick() {
        this.els.username.classList.remove('hidden');
        this.els.confirmDialog.classList.add('hidden');
    },
    onConfirmClick: function onConfirmClick() {
        this.emit('delete');
    },
    onDeleteClick: function onDeleteClick() {
        if (this.user && this.user.data._id) {
            this.els.username.classList.add('hidden');
            this.els.confirmDialog.classList.remove('hidden');
        }
    },
    onEditClick: function onEditClick() {
        if (this.user && this.user.data._id) this.emit('edit');
    },
    update: function update(user) {
        this.user.data = user;
        this.els.username.textContent = user.username;
    }
});

},{"./__proto__":21}],19:[function(require,module,exports){
'use strict';

module.exports = Object.assign({}, require('./__proto__'), {

    events: {
        cancel: 'click',
        submit: 'click'
    },

    onCancelClick: function onCancelClick() {
        var _this = this;

        this.hide().then(function () {
            return _this.emit('cancelled');
        });
    },
    onSubmitClick: function onSubmitClick() {
        this['request' + this.capitalizeFirstLetter(this.type)]().catch(this.Error);
    },
    onNavigation: function onNavigation(type, comic) {
        this.type = type;
        this.model.data = comic;

        this.populate();

        if (this.els.container.classList.contains('hide')) this.show();
    },
    populate: function populate() {
        this.els.title.textContent = this.capitalizeFirstLetter(this.type) + ' User';

        this.els.username.value = Object.keys(this.model.data).length ? this.model.data.username : '';
        this.els.password.value = '';
    },
    postRender: function postRender() {
        this.populate();

        return this;
    },
    requestAdd: function requestAdd() {
        var _this2 = this;

        if (this.els.password.value.length === 0) return;
        return this.Xhr({ method: 'POST', resource: 'user', data: JSON.stringify({ username: this.els.username.value, password: this.els.password.value }) }).then(function (response) {
            return _this2.hide().then(function () {
                return _this2.emit('added', { _id: response._id, username: response.username });
            });
        });
    },
    requestEdit: function requestEdit() {
        var _this3 = this;

        var data = { username: this.els.username.value };

        if (this.els.password.value.length) data.password = this.els.password.value;
        return this.Xhr({ method: 'PATCH', resource: 'user/' + this.user.data._id, data: JSON.stringify(data) }).then(function (response) {
            return _this3.hide().then(function () {
                return _this3.emit('edited', { _id: response._id, username: response.username });
            });
        });
    }
});

},{"./__proto__":21}],20:[function(require,module,exports){
'use strict';

module.exports = Object.assign({}, require('./__proto__'), {
    createUserView: function createUserView(user) {
        var _this = this;

        this.views[user._id] = this.factory.create('User', { insertion: { value: { el: this.els.list } },
            model: { value: { data: user } }
        });

        this.views[user._id].on('edit', function () {
            return _this.emit('navigate', '/admin/user/edit/' + user._id);
        }).on('delete', function () {
            return _this.Xhr({ method: 'delete', resource: 'user/' + user._id }).then(function () {
                return _this.views[user._id].delete();
            }).catch(_this.Error);
        });
    },
    delete: function _delete() {
        var _this2 = this;

        return (this.views.UserManage ? this.views.UserManage.delete() : Promise.resolve()).then(function () {
            return require('./__proto__').delete.call(_this2);
        });
    },


    events: {
        addBtn: 'click'
    },

    manageUser: function manageUser(type, user) {
        var _this3 = this;

        this.views.UserManage ? this.views.UserManage.onNavigation(type, user) : this.views.UserManage = this.factory.create('UserManage', { type: { value: type, writable: true }, model: { value: { data: user || {} } }, insertion: { value: { el: this.els.container, method: 'insertBefore' } } }).on('added', function (user) {
            _this3.createUserView(user);_this3.emit('navigate', '/admin/user');
        }).on('edited', function (user) {
            _this3.views[user._id].update(user);_this3.emit('navigate', '/admin/user');
        }).on('cancelled', function () {
            return _this3.emit('navigate', '/admin/user');
        });
    },
    onAddBtnClick: function onAddBtnClick() {
        this.emit('navigate', '/admin/user/add');
    },
    onNavigation: function onNavigation(path) {
        var _this4 = this;

        this.path = path;

        path.length === 2 && this.els.container.classList.contains('hide') ? this.views.UserManage && !this.views.UserManage.els.container.classList.contains('hide') ? this.views.UserManage.hide().then(function () {
            return _this4.show();
        }) : this.show() : path.length === 3 ? this.hide().then(function () {
            return _this4.manageUser(path[2], {});
        }) : path.length === 4 ? this.hide().then(function () {
            return _this4.manageUser(path[2], _this4.views[path[3]].model.data);
        }) : undefined;
    },
    postRender: function postRender() {
        var _this5 = this;

        if (this.path.length > 2) {
            this.els.container.classList.add('hidden', 'hide');
            if (this.path[2] === "add") {
                this.manageUser("add", {});
            } else if (this.path[2] === "edit" && this.path[3]) {
                this.Xhr({ method: "get", resource: 'user/' + this.path[3] }).then(function (response) {
                    return _this5.manageUser("edit", response);
                }).catch(function (e) {
                    _this5.Error(e);_this5.emit('navigate', '/admin/user');
                });
            }
        } else if (this.path.length === 1 && this.views.UserManage) {
            this.views.UserManage.hide();
        }

        this.users = Object.create(this.Model, { resource: { value: 'user' } });

        this.users.get().then(function () {
            return Promise.resolve(_this5.users.data.forEach(function (user) {
                return _this5.createUserView(user);
            }));
        }).catch(this.Error);

        return this;
    },


    requiresLogin: true
});

},{"./__proto__":21}],21:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

module.exports = Object.assign({}, require('../../../lib/MyObject'), require('events').EventEmitter.prototype, {

    Model: require('../models/__proto__.js'),

    OptimizedResize: require('./lib/OptimizedResize'),

    Spinner: require('./lib/Spin'),

    Xhr: require('../Xhr'),

    bindEvent: function bindEvent(key, event) {
        var _this = this;

        var els = Array.isArray(this.els[key]) ? this.els[key] : [this.els[key]];
        els.forEach(function (el) {
            return el.addEventListener(event || 'click', function (e) {
                return _this['on' + _this.capitalizeFirstLetter(key) + _this.capitalizeFirstLetter(event)](e);
            });
        });
    },


    capitalizeFirstLetter: function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    },

    constructor: function constructor() {

        if (this.size) this.OptimizedResize.add(this.size);

        if (this.requiresLogin && (!this.user.data || !this.user.data._id)) return this.handleLogin();

        if (this.user.data && this.user.data.id && this.requiresRole && !this.hasPrivileges()) return this.showNoAccess();

        return Object.assign(this, { els: {}, slurp: { attr: 'data-js', view: 'data-view' }, views: {} }).render();
    },
    delegateEvents: function delegateEvents(key, el) {
        var _this2 = this;

        var type = _typeof(this.events[key]);

        if (type === "string") {
            this.bindEvent(key, this.events[key]);
        } else if (Array.isArray(this.events[key])) {
            this.events[key].forEach(function (eventObj) {
                return _this2.bindEvent(key, eventObj.event);
            });
        } else {
            this.bindEvent(key, this.events[key].event);
        }
    },
    delete: function _delete() {
        var _this3 = this;

        return this.hide().then(function () {
            _this3.els.container.parentNode.removeChild(_this3.els.container);
            return Promise.resolve(_this3.emit('deleted'));
        });
    },


    events: {},

    getData: function getData() {
        if (!this.model) this.model = Object.create(this.Model, { resource: { value: this.name } });

        return this.model.get();
    },
    getTemplateOptions: function getTemplateOptions() {
        return Object.assign({}, this.model ? this.model.data : {}, { user: this.user ? this.user.data : {} }, { opts: this.templateOpts ? this.templateOpts : {} });
    },
    handleLogin: function handleLogin() {
        var _this4 = this;

        this.factory.create('login', { insertion: { value: { el: document.querySelector('#content') } } }).once("loggedIn", function () {
            return _this4.onLogin();
        });

        return this;
    },
    hasPrivilege: function hasPrivilege() {
        var _this5 = this;

        this.requiresRole && this.user.get('roles').find(function (role) {
            return role === _this5.requiresRole;
        }) === "undefined" ? false : true;
    },
    hide: function hide() {
        var _this6 = this;

        return new Promise(function (resolve) {
            if (!document.body.contains(_this6.els.container) || _this6.isHidden()) return resolve();
            _this6.onHiddenProxy = function (e) {
                return _this6.onHidden(resolve);
            };
            _this6.els.container.addEventListener('transitionend', _this6.onHiddenProxy);
            _this6.els.container.classList.add('hide');
        });
    },
    htmlToFragment: function htmlToFragment(str) {
        var range = document.createRange();
        // make the parent of the first div in the document becomes the context node
        range.selectNode(document.getElementsByTagName("div").item(0));
        return range.createContextualFragment(str);
    },
    isHidden: function isHidden() {
        return this.els.container.classList.contains('hidden');
    },
    onHidden: function onHidden(resolve) {
        this.els.container.removeEventListener('transitionend', this.onHiddenProxy);
        this.els.container.classList.add('hidden');
        resolve(this.emit('hidden'));
    },
    onLogin: function onLogin() {
        Object.assign(this, { els: {}, slurp: { attr: 'data-js', view: 'data-view' }, views: {} }).render();
    },
    onShown: function onShown(resolve) {
        this.els.container.removeEventListener('transitionend', this.onShownProxy);
        if (this.size) this.size();
        resolve(this.emit('shown'));
    },
    showNoAccess: function showNoAccess() {
        alert("No privileges, son");
        return this;
    },
    postRender: function postRender() {
        return this;
    },
    render: function render() {
        this.slurpTemplate({ template: this.template(this.getTemplateOptions()), insertion: this.insertion });

        if (this.size) this.size();

        return this.renderSubviews().postRender();
    },
    renderSubviews: function renderSubviews() {
        var _this7 = this;

        Object.keys(this.Views || []).forEach(function (key) {
            if (_this7.Views[key].el) {
                var opts = _this7.Views[key].opts;

                opts = opts ? (typeof opts === 'undefined' ? 'undefined' : _typeof(opts)) === "object" ? opts : opts() : {};

                _this7.views[key] = _this7.factory.create(key, Object.assign({ insertion: { value: { el: _this7.Views[key].el, method: 'insertBefore' } } }, opts));
                _this7.Views[key].el.remove();
                _this7.Views[key].el = undefined;
            }
        });

        return this;
    },
    show: function show(duration) {
        var _this8 = this;

        return new Promise(function (resolve) {
            _this8.onShownProxy = function (e) {
                return _this8.onShown(resolve);
            };
            _this8.els.container.addEventListener('transitionend', _this8.onShownProxy);
            _this8.els.container.classList.remove('hide', 'hidden');
        });
    },
    slurpEl: function slurpEl(el) {
        var key = el.getAttribute(this.slurp.attr) || 'container';

        if (key === 'container') el.classList.add(this.name);

        this.els[key] = Array.isArray(this.els[key]) ? this.els[key].push(el) : this.els[key] !== undefined ? [this.els[key], el] : el;

        el.removeAttribute(this.slurp.attr);

        if (this.events[key]) this.delegateEvents(key, el);
    },
    slurpTemplate: function slurpTemplate(options) {
        var _this9 = this;

        var fragment = this.htmlToFragment(options.template),
            selector = '[' + this.slurp.attr + ']',
            viewSelector = '[' + this.slurp.view + ']';

        this.slurpEl(fragment.querySelector('*'));
        fragment.querySelectorAll(selector + ', ' + viewSelector).forEach(function (el) {
            return el.hasAttribute(_this9.slurp.attr) ? _this9.slurpEl(el) : _this9.Views[el.getAttribute(_this9.slurp.view)].el = el;
        });

        options.insertion.method === 'insertBefore' ? options.insertion.el.parentNode.insertBefore(fragment, options.insertion.el) : options.insertion.el[options.insertion.method || 'appendChild'](fragment);

        return this;
    },
    isMouseOnEl: function isMouseOnEl(event, el) {

        var elOffset = el.offset(),
            elHeight = el.outerHeight(true),
            elWidth = el.outerWidth(true);

        if (event.pageX < elOffset.left || event.pageX > elOffset.left + elWidth || event.pageY < elOffset.top || event.pageY > elOffset.top + elHeight) {

            return false;
        }

        return true;
    },


    requiresLogin: false

});

},{"../../../lib/MyObject":39,"../Xhr":4,"../models/__proto__.js":8,"./lib/OptimizedResize":22,"./lib/Spin":23,"events":40}],22:[function(require,module,exports){
'use strict';

module.exports = Object.create({
    add: function add(callback) {
        if (!this.callbacks.length) window.addEventListener('resize', this.onResize);
        this.callbacks.push(callback);
    },
    onResize: function onResize() {
        if (this.running) return;

        this.running = true;

        window.requestAnimationFrame ? window.requestAnimationFrame(this.runCallbacks) : setTimeout(this.runCallbacks, 66);
    },
    runCallbacks: function runCallbacks() {
        this.callbacks = this.callbacks.filter(function (callback) {
            return callback();
        });
        this.running = false;
    }
}, { callbacks: { value: [] }, running: { value: false } }).add;

},{}],23:[function(require,module,exports){
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

// http://spin.js.org/#v2.3.2
!function (a, b) {
  "object" == (typeof module === "undefined" ? "undefined" : _typeof(module)) && module.exports ? module.exports = b() : "function" == typeof define && define.amd ? define(b) : a.Spinner = b();
}(undefined, function () {
  "use strict";
  function a(a, b) {
    var c,
        d = document.createElement(a || "div");for (c in b) {
      d[c] = b[c];
    }return d;
  }function b(a) {
    for (var b = 1, c = arguments.length; c > b; b++) {
      a.appendChild(arguments[b]);
    }return a;
  }function c(a, b, c, d) {
    var e = ["opacity", b, ~~(100 * a), c, d].join("-"),
        f = .01 + c / d * 100,
        g = Math.max(1 - (1 - a) / b * (100 - f), a),
        h = j.substring(0, j.indexOf("Animation")).toLowerCase(),
        i = h && "-" + h + "-" || "";return m[e] || (k.insertRule("@" + i + "keyframes " + e + "{0%{opacity:" + g + "}" + f + "%{opacity:" + a + "}" + (f + .01) + "%{opacity:1}" + (f + b) % 100 + "%{opacity:" + a + "}100%{opacity:" + g + "}}", k.cssRules.length), m[e] = 1), e;
  }function d(a, b) {
    var c,
        d,
        e = a.style;if (b = b.charAt(0).toUpperCase() + b.slice(1), void 0 !== e[b]) return b;for (d = 0; d < l.length; d++) {
      if (c = l[d] + b, void 0 !== e[c]) return c;
    }
  }function e(a, b) {
    for (var c in b) {
      a.style[d(a, c) || c] = b[c];
    }return a;
  }function f(a) {
    for (var b = 1; b < arguments.length; b++) {
      var c = arguments[b];for (var d in c) {
        void 0 === a[d] && (a[d] = c[d]);
      }
    }return a;
  }function g(a, b) {
    return "string" == typeof a ? a : a[b % a.length];
  }function h(a) {
    this.opts = f(a || {}, h.defaults, n);
  }function i() {
    function c(b, c) {
      return a("<" + b + ' xmlns="urn:schemas-microsoft.com:vml" class="spin-vml">', c);
    }k.addRule(".spin-vml", "behavior:url(#default#VML)"), h.prototype.lines = function (a, d) {
      function f() {
        return e(c("group", { coordsize: k + " " + k, coordorigin: -j + " " + -j }), { width: k, height: k });
      }function h(a, h, i) {
        b(m, b(e(f(), { rotation: 360 / d.lines * a + "deg", left: ~~h }), b(e(c("roundrect", { arcsize: d.corners }), { width: j, height: d.scale * d.width, left: d.scale * d.radius, top: -d.scale * d.width >> 1, filter: i }), c("fill", { color: g(d.color, a), opacity: d.opacity }), c("stroke", { opacity: 0 }))));
      }var i,
          j = d.scale * (d.length + d.width),
          k = 2 * d.scale * j,
          l = -(d.width + d.length) * d.scale * 2 + "px",
          m = e(f(), { position: "absolute", top: l, left: l });if (d.shadow) for (i = 1; i <= d.lines; i++) {
        h(i, -2, "progid:DXImageTransform.Microsoft.Blur(pixelradius=2,makeshadow=1,shadowopacity=.3)");
      }for (i = 1; i <= d.lines; i++) {
        h(i);
      }return b(a, m);
    }, h.prototype.opacity = function (a, b, c, d) {
      var e = a.firstChild;d = d.shadow && d.lines || 0, e && b + d < e.childNodes.length && (e = e.childNodes[b + d], e = e && e.firstChild, e = e && e.firstChild, e && (e.opacity = c));
    };
  }var j,
      k,
      l = ["webkit", "Moz", "ms", "O"],
      m = {},
      n = { lines: 12, length: 7, width: 5, radius: 10, scale: 1, corners: 1, color: "#000", opacity: .25, rotate: 0, direction: 1, speed: 1, trail: 100, fps: 20, zIndex: 2e9, className: "spinner", top: "50%", left: "50%", shadow: !1, hwaccel: !1, position: "absolute" };if (h.defaults = {}, f(h.prototype, { spin: function spin(b) {
      this.stop();var c = this,
          d = c.opts,
          f = c.el = a(null, { className: d.className });if (e(f, { position: d.position, width: 0, zIndex: d.zIndex, left: d.left, top: d.top }), b && b.insertBefore(f, b.firstChild || null), f.setAttribute("role", "progressbar"), c.lines(f, c.opts), !j) {
        var g,
            h = 0,
            i = (d.lines - 1) * (1 - d.direction) / 2,
            k = d.fps,
            l = k / d.speed,
            m = (1 - d.opacity) / (l * d.trail / 100),
            n = l / d.lines;!function o() {
          h++;for (var a = 0; a < d.lines; a++) {
            g = Math.max(1 - (h + (d.lines - a) * n) % l * m, d.opacity), c.opacity(f, a * d.direction + i, g, d);
          }c.timeout = c.el && setTimeout(o, ~~(1e3 / k));
        }();
      }return c;
    }, stop: function stop() {
      var a = this.el;return a && (clearTimeout(this.timeout), a.parentNode && a.parentNode.removeChild(a), this.el = void 0), this;
    }, lines: function lines(d, f) {
      function h(b, c) {
        return e(a(), { position: "absolute", width: f.scale * (f.length + f.width) + "px", height: f.scale * f.width + "px", background: b, boxShadow: c, transformOrigin: "left", transform: "rotate(" + ~~(360 / f.lines * k + f.rotate) + "deg) translate(" + f.scale * f.radius + "px,0)", borderRadius: (f.corners * f.scale * f.width >> 1) + "px" });
      }for (var i, k = 0, l = (f.lines - 1) * (1 - f.direction) / 2; k < f.lines; k++) {
        i = e(a(), { position: "absolute", top: 1 + ~(f.scale * f.width / 2) + "px", transform: f.hwaccel ? "translate3d(0,0,0)" : "", opacity: f.opacity, animation: j && c(f.opacity, f.trail, l + k * f.direction, f.lines) + " " + 1 / f.speed + "s linear infinite" }), f.shadow && b(i, e(h("#000", "0 0 4px #000"), { top: "2px" })), b(d, b(i, h(g(f.color, k), "0 0 1px rgba(0,0,0,.1)")));
      }return d;
    }, opacity: function opacity(a, b, c) {
      b < a.childNodes.length && (a.childNodes[b].style.opacity = c);
    } }), "undefined" != typeof document) {
    k = function () {
      var c = a("style", { type: "text/css" });return b(document.getElementsByTagName("head")[0], c), c.sheet || c.styleSheet;
    }();var o = e(a("group"), { behavior: "url(#default#VML)" });!d(o, "transform") && o.adj ? i() : j = d(o, "animation");
  }return h;
});

},{}],24:[function(require,module,exports){
"use strict";

module.exports = function (p) {
  return "<div>\n<div>Admin</div>\n<div data-js=\"list\"></div>\n</div>";
};

},{}],25:[function(require,module,exports){
"use strict";

module.exports = function (p) {
  return "<div>" + p.collection + "</div>";
};

},{}],26:[function(require,module,exports){
'use strict';

module.exports = function (p) {
    return '<div>\n    <div class="header" data-js="header">\n        <div class="title" data-js="title" >' + (p.title || '') + '</div>\n        ' + (p._id && p.user._id && !p.opts.readOnly ? '<button class="delete" data-js="delete"></button>' : '') + '\n        ' + (p._id && p.user._id && !p.opts.readOnly ? '<button class="edit" data-js="edit"></button>' : '') + '\n    </div>\n    ' + (p._id && p.user._id && !p.opts.readOnly ? '<div class="confirm hidden" data-js="confirmDialog">\n               <span>Are you sure?</span>\n               <button data-js="confirm" type="button">Delete</button> \n               <button data-js="cancel" type="button">Cancel</button> \n           </div>' : '') + '\n    <img data-js="image" src="' + (p.image ? p.image : '') + '"/>\n    <div class="clearfix">\n        <div class="share">\n            ' + require('./lib/facebook') + '\n            ' + require('./lib/twitter') + '\n            ' + require('./lib/google') + '\n        </div>\n    </div>\n</div>';
};

},{"./lib/facebook":35,"./lib/google":36,"./lib/twitter":37}],27:[function(require,module,exports){
"use strict";

module.exports = function (p) {
    return "<div>\n    <div data-js=\"header\"></div>\n    <div class=\"form-group\">\n       <label class=\"form-label\">title</label>\n       <input data-js=\"title\" type=\"text\"></input>\n    </div>\n    <div class=\"form-group\">\n       <label class=\"form-label\">image</label>\n        <div>\n            <div data-js=\"upload\" class=\"upload\">\n                <span>Upload File</span>\n                <input type=\"file\" data-js=\"image\" />\n            </div>\n            <img class=\"preview\" data-js=\"preview\" />\n        </div>\n    </div>\n    <div class=\"button-row\">\n        <button data-js=\"submit\" type=\"button\">Submit</button>\n        <button data-js=\"cancel\" type=\"button\">Cancel</button>\n    </div>\n</div>";
};

},{}],28:[function(require,module,exports){
"use strict";

module.exports = function (p) {
    return "<div>\n    <div>\n        <div>Comics</div>\n        <button data-js=\"addBtn\" class=\"add\"></button>\n    </div>\n    <div data-js=\"list\"></div>\n</div>";
};

},{}],29:[function(require,module,exports){
"use strict";

module.exports = function (p) {
    return "<header>\n    <ul>\n        <li>About</li>\n        <li>Store</li>\n    </ul>\n    <span>Tiny Handed</span>\n    <img data-js=\"logo\" src=\"/static/img/tinyHanded.jpg\" />\n</header>";
};

},{}],30:[function(require,module,exports){
"use strict";

module.exports = function (p) {
  return "<div></div>";
};

},{}],31:[function(require,module,exports){
"use strict";

module.exports = function (p) {
   return "<div>\n    <h1>Login</h1>\n    <div class=\"form-group\">\n       <label class=\"form-label\" for=\"username\">username</label>\n       <input data-js=\"username\" class=\"username\" type=\"text\"></input>\n    </div>\n    <div class=\"form-group\">\n       <label class=\"form-label\" for=\"password\">password</label>\n       <input data-js=\"password\" class=\"password\" type=\"password\"></input>\n    </div>\n    <div class=\"button-row\">\n        <button data-js=\"submit\" class=\"btn-ghost\" type=\"button\">Log In</button>\n    </div>\n</div>";
};

},{}],32:[function(require,module,exports){
'use strict';

module.exports = function (p) {
    return '<div>\n    <div data-js="username">' + p.username + '</div>\n    ' + (p.user._id && !p.opts.readOnly ? '<button class="delete" data-js="delete"></button>' : '') + '\n    ' + (p.user._id === p._id ? '<button class="edit" data-js="edit"></button>' : '') + '\n    ' + (p.user._id && !p.opts.readOnly ? '<div class="confirm hidden" data-js="confirmDialog">\n           <span>Are you sure?</span>\n           <button data-js="confirm" type="button">Delete</button> \n           <button data-js="cancel" type="button">Cancel</button> \n       </div>' : '') + '\n</div>\n';
};

},{}],33:[function(require,module,exports){
"use strict";

module.exports = function (p) {
   return "<div>\n    <div data-js=\"title\"></div>\n    <div class=\"form-group\">\n       <label class=\"form-label\" for=\"username\">username</label>\n       <input data-js=\"username\" class=\"username\" type=\"text\"></input>\n    </div>\n    <div class=\"form-group\">\n       <label class=\"form-label\" for=\"password\">password</label>\n       <input data-js=\"password\" class=\"password\" type=\"password\"></input>\n    </div>\n    <div class=\"button-row\">\n        <button data-js=\"submit\" class=\"btn-ghost\" type=\"button\">Submit</button>\n        <button data-js=\"cancel\" class=\"btn-ghost\" type=\"button\">Cancel</button>\n    </div>\n</div>";
};

},{}],34:[function(require,module,exports){
"use strict";

module.exports = function (p) {
    return "<div>\n    <div>\n        <div>Users</div>\n        <button data-js=\"addBtn\" class=\"add\"></button>\n    </div>\n    <div data-js=\"list\"></div>\n</div>";
};

},{}],35:[function(require,module,exports){
"use strict";

module.exports = "<svg data-js=\"facebook\" enable-background=\"new 0 0 56.693 56.693\" height=\"56.693px\" id=\"Layer_1\" version=\"1.1\" viewBox=\"0 0 56.693 56.693\" width=\"56.693px\" xml:space=\"preserve\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\"><path d=\"M28.347,5.157c-13.6,0-24.625,11.027-24.625,24.625c0,13.6,11.025,24.623,24.625,24.623c13.6,0,24.625-11.023,24.625-24.623  C52.972,16.184,41.946,5.157,28.347,5.157z M34.864,29.679h-4.264c0,6.814,0,15.207,0,15.207h-6.32c0,0,0-8.307,0-15.207h-3.006  V24.31h3.006v-3.479c0-2.49,1.182-6.377,6.379-6.377l4.68,0.018v5.215c0,0-2.846,0-3.398,0c-0.555,0-1.34,0.277-1.34,1.461v3.163  h4.818L34.864,29.679z\"/></svg>";

},{}],36:[function(require,module,exports){
"use strict";

module.exports = "<svg data-js=\"google\" enable-background=\"new 0 0 56.693 56.693\" height=\"56.693px\" id=\"Layer_1\" version=\"1.1\" viewBox=\"0 0 56.693 56.693\" width=\"56.693px\" xml:space=\"preserve\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\"><g><path d=\"M23.761,27.96c0.629,0,1.16-0.248,1.57-0.717c0.645-0.732,0.928-1.936,0.76-3.215c-0.301-2.287-1.932-4.186-3.637-4.236   h-0.068c-0.604,0-1.141,0.246-1.551,0.715c-0.637,0.725-0.903,1.871-0.736,3.146c0.299,2.283,1.965,4.256,3.635,4.307H23.761z\"/><path d=\"M25.622,34.847c-0.168-0.113-0.342-0.232-0.521-0.355c-0.525-0.162-1.084-0.246-1.654-0.254h-0.072   c-2.625,0-4.929,1.592-4.929,3.406c0,1.971,1.972,3.518,4.491,3.518c3.322,0,5.006-1.145,5.006-3.404   c0-0.215-0.025-0.436-0.076-0.656C27.642,36.222,26.837,35.675,25.622,34.847z\"/><path d=\"M28.347,5.157c-13.601,0-24.625,11.023-24.625,24.623s11.025,24.625,24.625,24.625c13.598,0,24.623-11.025,24.623-24.625   S41.944,5.157,28.347,5.157z M26.106,43.179c-0.982,0.283-2.041,0.428-3.154,0.428c-1.238,0-2.43-0.143-3.54-0.424   c-2.15-0.541-3.74-1.57-4.48-2.895c-0.32-0.574-0.482-1.184-0.482-1.816c0-0.652,0.156-1.312,0.463-1.967   c1.18-2.51,4.283-4.197,7.722-4.197c0.035,0,0.068,0,0.1,0c-0.279-0.492-0.416-1.002-0.416-1.537c0-0.268,0.035-0.539,0.105-0.814   c-3.606-0.084-6.306-2.725-6.306-6.207c0-2.461,1.965-4.855,4.776-5.824c0.842-0.291,1.699-0.439,2.543-0.439h7.713   c0.264,0,0.494,0.17,0.576,0.42c0.084,0.252-0.008,0.525-0.221,0.68l-1.725,1.248c-0.104,0.074-0.229,0.115-0.357,0.115h-0.617   c0.799,0.955,1.266,2.316,1.266,3.848c0,1.691-0.855,3.289-2.41,4.506c-1.201,0.936-1.25,1.191-1.25,1.729   c0.016,0.295,0.854,1.252,1.775,1.904c2.152,1.523,2.953,3.014,2.953,5.508C31.14,40.04,29.163,42.292,26.106,43.179z    M43.528,29.948c0,0.334-0.273,0.605-0.607,0.605h-4.383v4.385c0,0.336-0.271,0.607-0.607,0.607h-1.248   c-0.336,0-0.607-0.271-0.607-0.607v-4.385H31.69c-0.332,0-0.605-0.271-0.605-0.605v-1.25c0-0.334,0.273-0.607,0.605-0.607h4.385   v-4.383c0-0.336,0.271-0.607,0.607-0.607h1.248c0.336,0,0.607,0.271,0.607,0.607v4.383h4.383c0.334,0,0.607,0.273,0.607,0.607   V29.948z\"/></g></svg>";

},{}],37:[function(require,module,exports){
"use strict";

module.exports = "<svg data-js=\"twitter\" enable-background=\"new 0 0 56.693 56.693\" height=\"56.693px\" id=\"Layer_1\" version=\"1.1\" viewBox=\"0 0 56.693 56.693\" width=\"56.693px\" xml:space=\"preserve\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\"><path d=\"M28.348,5.157c-13.6,0-24.625,11.027-24.625,24.625c0,13.6,11.025,24.623,24.625,24.623c13.6,0,24.623-11.023,24.623-24.623  C52.971,16.184,41.947,5.157,28.348,5.157z M40.752,24.817c0.013,0.266,0.018,0.533,0.018,0.803c0,8.201-6.242,17.656-17.656,17.656  c-3.504,0-6.767-1.027-9.513-2.787c0.486,0.057,0.979,0.086,1.48,0.086c2.908,0,5.584-0.992,7.707-2.656  c-2.715-0.051-5.006-1.846-5.796-4.311c0.378,0.074,0.767,0.111,1.167,0.111c0.566,0,1.114-0.074,1.635-0.217  c-2.84-0.57-4.979-3.08-4.979-6.084c0-0.027,0-0.053,0.001-0.08c0.836,0.465,1.793,0.744,2.811,0.777  c-1.666-1.115-2.761-3.012-2.761-5.166c0-1.137,0.306-2.204,0.84-3.12c3.061,3.754,7.634,6.225,12.792,6.483  c-0.106-0.453-0.161-0.928-0.161-1.414c0-3.426,2.778-6.205,6.206-6.205c1.785,0,3.397,0.754,4.529,1.959  c1.414-0.277,2.742-0.795,3.941-1.506c-0.465,1.45-1.448,2.666-2.73,3.433c1.257-0.15,2.453-0.484,3.565-0.977  C43.018,22.849,41.965,23.942,40.752,24.817z\"/></svg>";

},{}],38:[function(require,module,exports){
"use strict";

module.exports = function (err) {
  console.log(err.stack || err);
};

},{}],39:[function(require,module,exports){
'use strict';

module.exports = {

    Error: require('./MyError'),

    P: function P(fun) {
        var args = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
        var thisArg = arguments[2];
        return new Promise(function (resolve, reject) {
            return Reflect.apply(fun, thisArg || undefined, args.concat(function (e) {
                for (var _len = arguments.length, callback = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                    callback[_key - 1] = arguments[_key];
                }

                return e ? reject(e) : resolve(callback);
            }));
        });
    },

    constructor: function constructor() {
        return this;
    }
};

},{"./MyError":38}],40:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      } else {
        // At least give some kind of context to the user
        var err = new Error('Uncaught, unspecified "error" event. (' + er + ')');
        err.context = er;
        throw err;
      }
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        args = Array.prototype.slice.call(arguments, 1);
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    args = Array.prototype.slice.call(arguments, 1);
    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else if (listeners) {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.prototype.listenerCount = function(type) {
  if (this._events) {
    var evlistener = this._events[type];

    if (isFunction(evlistener))
      return 1;
    else if (evlistener)
      return evlistener.length;
  }
  return 0;
};

EventEmitter.listenerCount = function(emitter, type) {
  return emitter.listenerCount(type);
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}

},{}]},{},[6])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJjbGllbnQvanMvLlRlbXBsYXRlTWFwLmpzIiwiY2xpZW50L2pzLy5WaWV3TWFwLmpzIiwiY2xpZW50L2pzLy5lbnYiLCJjbGllbnQvanMvWGhyLmpzIiwiY2xpZW50L2pzL2ZhY3RvcnkvVmlldy5qcyIsImNsaWVudC9qcy9tYWluLmpzIiwiY2xpZW50L2pzL21vZGVscy9Vc2VyLmpzIiwiY2xpZW50L2pzL21vZGVscy9fX3Byb3RvX18uanMiLCJjbGllbnQvanMvcm91dGVyLmpzIiwiY2xpZW50L2pzL3ZpZXdzL0FkbWluLmpzIiwiY2xpZW50L2pzL3ZpZXdzL0FkbWluSXRlbS5qcyIsImNsaWVudC9qcy92aWV3cy9Db21pYy5qcyIsImNsaWVudC9qcy92aWV3cy9Db21pY01hbmFnZS5qcyIsImNsaWVudC9qcy92aWV3cy9Db21pY1Jlc291cmNlcy5qcyIsImNsaWVudC9qcy92aWV3cy9IZWFkZXIuanMiLCJjbGllbnQvanMvdmlld3MvSG9tZS5qcyIsImNsaWVudC9qcy92aWV3cy9Mb2dpbi5qcyIsImNsaWVudC9qcy92aWV3cy9Vc2VyLmpzIiwiY2xpZW50L2pzL3ZpZXdzL1VzZXJNYW5hZ2UuanMiLCJjbGllbnQvanMvdmlld3MvVXNlclJlc291cmNlcy5qcyIsImNsaWVudC9qcy92aWV3cy9fX3Byb3RvX18uanMiLCJjbGllbnQvanMvdmlld3MvbGliL09wdGltaXplZFJlc2l6ZS5qcyIsImNsaWVudC9qcy92aWV3cy9saWIvU3Bpbi5qcyIsImNsaWVudC9qcy92aWV3cy90ZW1wbGF0ZXMvQWRtaW4uanMiLCJjbGllbnQvanMvdmlld3MvdGVtcGxhdGVzL0FkbWluSXRlbS5qcyIsImNsaWVudC9qcy92aWV3cy90ZW1wbGF0ZXMvQ29taWMuanMiLCJjbGllbnQvanMvdmlld3MvdGVtcGxhdGVzL0NvbWljTWFuYWdlLmpzIiwiY2xpZW50L2pzL3ZpZXdzL3RlbXBsYXRlcy9Db21pY1Jlc291cmNlcy5qcyIsImNsaWVudC9qcy92aWV3cy90ZW1wbGF0ZXMvSGVhZGVyLmpzIiwiY2xpZW50L2pzL3ZpZXdzL3RlbXBsYXRlcy9Ib21lLmpzIiwiY2xpZW50L2pzL3ZpZXdzL3RlbXBsYXRlcy9Mb2dpbi5qcyIsImNsaWVudC9qcy92aWV3cy90ZW1wbGF0ZXMvVXNlci5qcyIsImNsaWVudC9qcy92aWV3cy90ZW1wbGF0ZXMvVXNlck1hbmFnZS5qcyIsImNsaWVudC9qcy92aWV3cy90ZW1wbGF0ZXMvVXNlclJlc291cmNlcy5qcyIsImNsaWVudC9qcy92aWV3cy90ZW1wbGF0ZXMvbGliL2ZhY2Vib29rLmpzIiwiY2xpZW50L2pzL3ZpZXdzL3RlbXBsYXRlcy9saWIvZ29vZ2xlLmpzIiwiY2xpZW50L2pzL3ZpZXdzL3RlbXBsYXRlcy9saWIvdHdpdHRlci5qcyIsImxpYi9NeUVycm9yLmpzIiwibGliL015T2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2V2ZW50cy9ldmVudHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBLE9BQU8sT0FBUCxHQUFlO0FBQ2QsUUFBTyxRQUFRLHlCQUFSLENBRE87QUFFZCxZQUFXLFFBQVEsNkJBQVIsQ0FGRztBQUdkLFFBQU8sUUFBUSx5QkFBUixDQUhPO0FBSWQsY0FBYSxRQUFRLCtCQUFSLENBSkM7QUFLZCxpQkFBZ0IsUUFBUSxrQ0FBUixDQUxGO0FBTWQsU0FBUSxRQUFRLDBCQUFSLENBTk07QUFPZCxPQUFNLFFBQVEsd0JBQVIsQ0FQUTtBQVFkLFFBQU8sUUFBUSx5QkFBUixDQVJPO0FBU2QsT0FBTSxRQUFRLHdCQUFSLENBVFE7QUFVZCxhQUFZLFFBQVEsOEJBQVIsQ0FWRTtBQVdkLGdCQUFlLFFBQVEsaUNBQVI7QUFYRCxDQUFmOzs7OztBQ0FBLE9BQU8sT0FBUCxHQUFlO0FBQ2QsUUFBTyxRQUFRLGVBQVIsQ0FETztBQUVkLFlBQVcsUUFBUSxtQkFBUixDQUZHO0FBR2QsUUFBTyxRQUFRLGVBQVIsQ0FITztBQUlkLGNBQWEs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QUFBQSxLQUpVOztBQU9iLGVBUGEseUJBT0M7QUFBRSxlQUFPLElBQVA7QUFBYTtBQVBoQixDQUFqQjs7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIm1vZHVsZS5leHBvcnRzPXtcblx0QWRtaW46IHJlcXVpcmUoJy4vdmlld3MvdGVtcGxhdGVzL0FkbWluJyksXG5cdEFkbWluSXRlbTogcmVxdWlyZSgnLi92aWV3cy90ZW1wbGF0ZXMvQWRtaW5JdGVtJyksXG5cdENvbWljOiByZXF1aXJlKCcuL3ZpZXdzL3RlbXBsYXRlcy9Db21pYycpLFxuXHRDb21pY01hbmFnZTogcmVxdWlyZSgnLi92aWV3cy90ZW1wbGF0ZXMvQ29taWNNYW5hZ2UnKSxcblx0Q29taWNSZXNvdXJjZXM6IHJlcXVpcmUoJy4vdmlld3MvdGVtcGxhdGVzL0NvbWljUmVzb3VyY2VzJyksXG5cdEhlYWRlcjogcmVxdWlyZSgnLi92aWV3cy90ZW1wbGF0ZXMvSGVhZGVyJyksXG5cdEhvbWU6IHJlcXVpcmUoJy4vdmlld3MvdGVtcGxhdGVzL0hvbWUnKSxcblx0TG9naW46IHJlcXVpcmUoJy4vdmlld3MvdGVtcGxhdGVzL0xvZ2luJyksXG5cdFVzZXI6IHJlcXVpcmUoJy4vdmlld3MvdGVtcGxhdGVzL1VzZXInKSxcblx0VXNlck1hbmFnZTogcmVxdWlyZSgnLi92aWV3cy90ZW1wbGF0ZXMvVXNlck1hbmFnZScpLFxuXHRVc2VyUmVzb3VyY2VzOiByZXF1aXJlKCcuL3ZpZXdzL3RlbXBsYXRlcy9Vc2VyUmVzb3VyY2VzJylcbn0iLCJtb2R1bGUuZXhwb3J0cz17XG5cdEFkbWluOiByZXF1aXJlKCcuL3ZpZXdzL0FkbWluJyksXG5cdEFkbWluSXRlbTogcmVxdWlyZSgnLi92aWV3cy9BZG1pbkl0ZW0nKSxcblx0Q29taWM6IHJlcXVpcmUoJy4vdmlld3MvQ29taWMnKSxcblx0Q29taWNNYW5hZ2U6IHJlcXVpcmUoJy4vdmlld3MvQ29taWNNYW5hZ2UnKSxcblx0Q29taWNSZXNvdXJjZXM6IHJlcXVpcmUoJy4vdmlld3MvQ29taWNSZXNvdXJjZXMnKSxcblx0SGVhZGVyOiByZXF1aXJlKCcuL3ZpZXdzL0hlYWRlcicpLFxuXHRIb21lOiByZXF1aXJlKCcuL3ZpZXdzL0hvbWUnKSxcblx0TG9naW46IHJlcXVpcmUoJy4vdmlld3MvTG9naW4nKSxcblx0VXNlcjogcmVxdWlyZSgnLi92aWV3cy9Vc2VyJyksXG5cdFVzZXJNYW5hZ2U6IHJlcXVpcmUoJy4vdmlld3MvVXNlck1hbmFnZScpLFxuXHRVc2VyUmVzb3VyY2VzOiByZXF1aXJlKCcuL3ZpZXdzL1VzZXJSZXNvdXJjZXMnKVxufSIsIndpbmRvdy5jb29raWVOYW1lID0gJ2NoZWV0b2plc3VzJ1xuIiwibW9kdWxlLmV4cG9ydHMgPSBPYmplY3QuY3JlYXRlKCBPYmplY3QuYXNzaWduKCB7fSwgcmVxdWlyZSgnLi4vLi4vbGliL015T2JqZWN0JyksIHtcblxuICAgIFJlcXVlc3Q6IHtcblxuICAgICAgICBjb25zdHJ1Y3RvciggZGF0YSApIHtcbiAgICAgICAgICAgIGxldCByZXEgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKVxuXG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoICggcmVzb2x2ZSwgcmVqZWN0ICkgPT4ge1xuXG4gICAgICAgICAgICAgICAgcmVxLm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICBbIDUwMCwgNDA0LCA0MDEgXS5pbmNsdWRlcyggdGhpcy5zdGF0dXMgKVxuICAgICAgICAgICAgICAgICAgICAgICAgPyByZWplY3QoIHRoaXMucmVzcG9uc2UgKVxuICAgICAgICAgICAgICAgICAgICAgICAgOiByZXNvbHZlKCBKU09OLnBhcnNlKHRoaXMucmVzcG9uc2UpIClcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiggZGF0YS5tZXRob2QgPT09IFwiZ2V0XCIgfHwgZGF0YS5tZXRob2QgPT09IFwib3B0aW9uc1wiICkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgcXMgPSBkYXRhLnFzID8gYD8ke2RhdGEucXN9YCA6ICcnIFxuICAgICAgICAgICAgICAgICAgICByZXEub3BlbiggZGF0YS5tZXRob2QsIGAvJHtkYXRhLnJlc291cmNlfSR7cXN9YCApXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0SGVhZGVycyggcmVxLCBkYXRhLmhlYWRlcnMgKVxuICAgICAgICAgICAgICAgICAgICByZXEuc2VuZChudWxsKVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJlcS5vcGVuKCBkYXRhLm1ldGhvZCwgYC8ke2RhdGEucmVzb3VyY2V9YCwgdHJ1ZSlcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRIZWFkZXJzKCByZXEsIGRhdGEuaGVhZGVycyApXG4gICAgICAgICAgICAgICAgICAgIHJlcS5zZW5kKCBkYXRhLmRhdGEgKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gKVxuICAgICAgICB9LFxuXG4gICAgICAgIHBsYWluRXNjYXBlKCBzVGV4dCApIHtcbiAgICAgICAgICAgIC8qIGhvdyBzaG91bGQgSSB0cmVhdCBhIHRleHQvcGxhaW4gZm9ybSBlbmNvZGluZz8gd2hhdCBjaGFyYWN0ZXJzIGFyZSBub3QgYWxsb3dlZD8gdGhpcyBpcyB3aGF0IEkgc3VwcG9zZS4uLjogKi9cbiAgICAgICAgICAgIC8qIFwiNFxcM1xcNyAtIEVpbnN0ZWluIHNhaWQgRT1tYzJcIiAtLS0tPiBcIjRcXFxcM1xcXFw3XFwgLVxcIEVpbnN0ZWluXFwgc2FpZFxcIEVcXD1tYzJcIiAqL1xuICAgICAgICAgICAgcmV0dXJuIHNUZXh0LnJlcGxhY2UoL1tcXHNcXD1cXFxcXS9nLCBcIlxcXFwkJlwiKTtcbiAgICAgICAgfSxcblxuICAgICAgICBzZXRIZWFkZXJzKCByZXEsIGhlYWRlcnM9e30gKSB7XG4gICAgICAgICAgICByZXEuc2V0UmVxdWVzdEhlYWRlciggXCJBY2NlcHRcIiwgaGVhZGVycy5hY2NlcHQgfHwgJ2FwcGxpY2F0aW9uL2pzb24nIClcbiAgICAgICAgICAgIHJlcS5zZXRSZXF1ZXN0SGVhZGVyKCBcIkNvbnRlbnQtVHlwZVwiLCBoZWFkZXJzLmNvbnRlbnRUeXBlIHx8ICd0ZXh0L3BsYWluJyApXG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgX2ZhY3RvcnkoIGRhdGEgKSB7XG4gICAgICAgIHJldHVybiBPYmplY3QuY3JlYXRlKCB0aGlzLlJlcXVlc3QsIHsgfSApLmNvbnN0cnVjdG9yKCBkYXRhIClcbiAgICB9LFxuXG4gICAgY29uc3RydWN0b3IoKSB7XG5cbiAgICAgICAgaWYoICFYTUxIdHRwUmVxdWVzdC5wcm90b3R5cGUuc2VuZEFzQmluYXJ5ICkge1xuICAgICAgICAgIFhNTEh0dHBSZXF1ZXN0LnByb3RvdHlwZS5zZW5kQXNCaW5hcnkgPSBmdW5jdGlvbihzRGF0YSkge1xuICAgICAgICAgICAgdmFyIG5CeXRlcyA9IHNEYXRhLmxlbmd0aCwgdWk4RGF0YSA9IG5ldyBVaW50OEFycmF5KG5CeXRlcyk7XG4gICAgICAgICAgICBmb3IgKHZhciBuSWR4ID0gMDsgbklkeCA8IG5CeXRlczsgbklkeCsrKSB7XG4gICAgICAgICAgICAgIHVpOERhdGFbbklkeF0gPSBzRGF0YS5jaGFyQ29kZUF0KG5JZHgpICYgMHhmZjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuc2VuZCh1aThEYXRhKTtcbiAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuX2ZhY3RvcnkuYmluZCh0aGlzKVxuICAgIH1cblxufSApLCB7IH0gKS5jb25zdHJ1Y3RvcigpXG4iLCJtb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5jcmVhdGUoIHtcblxuICAgIGNyZWF0ZSggbmFtZSwgb3B0cyApIHtcbiAgICAgICAgY29uc3QgbG93ZXIgPSBuYW1lXG4gICAgICAgIG5hbWUgPSBuYW1lLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgbmFtZS5zbGljZSgxKVxuICAgICAgICByZXR1cm4gT2JqZWN0LmNyZWF0ZShcbiAgICAgICAgICAgIHRoaXMuVmlld3NbIG5hbWUgXSxcbiAgICAgICAgICAgIE9iamVjdC5hc3NpZ24oIHtcbiAgICAgICAgICAgICAgICBuYW1lOiB7IHZhbHVlOiBuYW1lIH0sXG4gICAgICAgICAgICAgICAgZmFjdG9yeTogeyB2YWx1ZTogdGhpcyB9LFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlOiB7IHZhbHVlOiB0aGlzLlRlbXBsYXRlc1sgbmFtZSBdIH0sXG4gICAgICAgICAgICAgICAgdXNlcjogeyB2YWx1ZTogdGhpcy5Vc2VyIH1cbiAgICAgICAgICAgICAgICB9LCBvcHRzIClcbiAgICAgICAgKS5jb25zdHJ1Y3RvcigpXG4gICAgICAgIC5vbiggJ25hdmlnYXRlJywgcm91dGUgPT4gcmVxdWlyZSgnLi4vcm91dGVyJykubmF2aWdhdGUoIHJvdXRlICkgKVxuICAgICAgICAub24oICdkZWxldGVkJywgKCkgPT4gZGVsZXRlIChyZXF1aXJlKCcuLi9yb3V0ZXInKSkudmlld3NbbmFtZV0gKVxuICAgIH0sXG5cbn0sIHtcbiAgICBUZW1wbGF0ZXM6IHsgdmFsdWU6IHJlcXVpcmUoJy4uLy5UZW1wbGF0ZU1hcCcpIH0sXG4gICAgVXNlcjogeyB2YWx1ZTogcmVxdWlyZSgnLi4vbW9kZWxzL1VzZXInICkgfSxcbiAgICBWaWV3czogeyB2YWx1ZTogcmVxdWlyZSgnLi4vLlZpZXdNYXAnKSB9XG59IClcbiIsIndpbmRvdy5vbmxvYWQgPSAoKSA9PiB7XG4gICAgcmVxdWlyZSgnLi8uZW52JylcbiAgICByZXF1aXJlKCcuL3JvdXRlcicpLmluaXRpYWxpemUoKVxufVxuIiwibW9kdWxlLmV4cG9ydHMgPSBPYmplY3QuY3JlYXRlKCByZXF1aXJlKCcuL19fcHJvdG9fXy5qcycpLCB7IHJlc291cmNlOiB7IHZhbHVlOiAnbWUnIH0gfSApXG4iLCJtb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5hc3NpZ24oIHsgfSwgcmVxdWlyZSgnLi4vLi4vLi4vbGliL015T2JqZWN0JyksIHJlcXVpcmUoJ2V2ZW50cycpLkV2ZW50RW1pdHRlci5wcm90b3R5cGUsIHtcblxuICAgIFhocjogcmVxdWlyZSgnLi4vWGhyJyksXG5cbiAgICBnZXQoIG9wdHM9e30gKSB7XG4gICAgICAgIGlmKCBvcHRzLnF1ZXJ5ICYmIHRoaXMucGFnaW5hdGlvbiApIE9iamVjdC5hc3NpZ24oIG9wdHMucXVlcnksIHRoaXMucGFnaW5hdGlvbiApXG4gICAgICAgIHJldHVybiB0aGlzLlhociggeyBtZXRob2Q6IG9wdHMubWV0aG9kIHx8ICdnZXQnLCByZXNvdXJjZTogdGhpcy5yZXNvdXJjZSwgaGVhZGVyczogdGhpcy5oZWFkZXJzIHx8IHt9LCBxczogb3B0cy5xdWVyeSA/IEpTT04uc3RyaW5naWZ5KCBvcHRzLnF1ZXJ5ICkgOiB1bmRlZmluZWQgfSApXG4gICAgICAgIC50aGVuKCByZXNwb25zZSA9PiB7XG4gICAgICAgICAgICBpZiggIXRoaXMucGFnaW5hdGlvbiApIHJldHVybiBQcm9taXNlLnJlc29sdmUoIHRoaXMuZGF0YSA9IHJlc3BvbnNlIClcblxuICAgICAgICAgICAgaWYoICF0aGlzLmRhdGEgKSB0aGlzLmRhdGEgPSBbIF1cbiAgICAgICAgICAgIHRoaXMuZGF0YSA9IHRoaXMuZGF0YS5jb25jYXQocmVzcG9uc2UpXG4gICAgICAgICAgICB0aGlzLnBhZ2luYXRpb24uc2tpcCArPSB0aGlzLnBhZ2luYXRpb24ubGltaXRcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUocmVzcG9uc2UpXG4gICAgICAgIH0gKVxuICAgIH1cblxufSApXG4iLCJtb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5jcmVhdGUoIHtcblxuICAgIEVycm9yOiByZXF1aXJlKCcuLi8uLi9saWIvTXlFcnJvcicpLFxuICAgIFxuICAgIFVzZXI6IHJlcXVpcmUoJy4vbW9kZWxzL1VzZXInKSxcblxuICAgIFZpZXdGYWN0b3J5OiByZXF1aXJlKCcuL2ZhY3RvcnkvVmlldycpLFxuICAgIFxuICAgIFZpZXdzOiByZXF1aXJlKCcuLy5WaWV3TWFwJyksXG5cbiAgICBpbml0aWFsaXplKCkge1xuICAgICAgICB0aGlzLmNvbnRlbnRDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjY29udGVudCcpXG5cbiAgICAgICAgd2luZG93Lm9ucG9wc3RhdGUgPSB0aGlzLmhhbmRsZS5iaW5kKHRoaXMpXG5cbiAgICAgICAgdGhpcy5oZWFkZXIgPSB0aGlzLlZpZXdGYWN0b3J5LmNyZWF0ZSggJ2hlYWRlcicsIHsgaW5zZXJ0aW9uOiB7IHZhbHVlOiB7IGVsOiB0aGlzLmNvbnRlbnRDb250YWluZXIsIG1ldGhvZDogJ2luc2VydEJlZm9yZScgfSB9IH0gKVxuXG4gICAgICAgIHRoaXMuVXNlci5nZXQoKS50aGVuKCAoKSA9PlxuICAgICAgICBcbiAgICAgICAgICAgIHRoaXMuaGVhZGVyLm9uVXNlcigpXG4gICAgICAgICAgICAub24oICdzaWdub3V0JywgKCkgPT4gXG4gICAgICAgICAgICAgICAgUHJvbWlzZS5hbGwoIE9iamVjdC5rZXlzKCB0aGlzLnZpZXdzICkubWFwKCBuYW1lID0+IHRoaXMudmlld3NbIG5hbWUgXS5kZWxldGUoKSApIClcbiAgICAgICAgICAgICAgICAudGhlbiggKCkgPT4gdGhpcy5oZWFkZXIuZW1pdCggJ25hdmlnYXRlJywgJy8nICkgKVxuICAgICAgICAgICAgICAgIC5jYXRjaCggdGhpcy5FcnJvciApXG4gICAgICAgICAgICApXG5cbiAgICAgICAgKVxuICAgICAgICAuY2F0Y2goIHRoaXMuRXJyb3IgKVxuICAgICAgICAudGhlbiggKCkgPT4gdGhpcy5oYW5kbGUoKSApXG5cbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICB9LFxuXG4gICAgaGFuZGxlKCkge1xuICAgICAgICB0aGlzLmhhbmRsZXIoIHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZS5zcGxpdCgnLycpLnNsaWNlKDEpIClcbiAgICB9LFxuXG4gICAgaGFuZGxlciggcGF0aCApIHtcbiAgICAgICAgY29uc3QgbmFtZSA9IHBhdGhbMF0gPyBwYXRoWzBdLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgcGF0aFswXS5zbGljZSgxKSA6ICcnLFxuICAgICAgICAgICAgICB2aWV3ID0gdGhpcy5WaWV3c1tuYW1lXSA/IHBhdGhbMF0gOiAnaG9tZSc7XG5cbiAgICAgICAgKCAoIHZpZXcgPT09IHRoaXMuY3VycmVudFZpZXcgKVxuICAgICAgICAgICAgPyBQcm9taXNlLnJlc29sdmUoKVxuICAgICAgICAgICAgOiBQcm9taXNlLmFsbCggT2JqZWN0LmtleXMoIHRoaXMudmlld3MgKS5tYXAoIHZpZXcgPT4gdGhpcy52aWV3c1sgdmlldyBdLmhpZGUoKSApICkgKSBcbiAgICAgICAgLnRoZW4oICgpID0+IHtcblxuICAgICAgICAgICAgdGhpcy5jdXJyZW50VmlldyA9IHZpZXdcblxuICAgICAgICAgICAgaWYoIHRoaXMudmlld3NbIHZpZXcgXSApIHJldHVybiB0aGlzLnZpZXdzWyB2aWV3IF0ubmF2aWdhdGUoIHBhdGggKVxuXG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKFxuICAgICAgICAgICAgICAgIHRoaXMudmlld3NbIHZpZXcgXSA9XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuVmlld0ZhY3RvcnkuY3JlYXRlKCB2aWV3LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbnNlcnRpb246IHsgdmFsdWU6IHsgZWw6IHRoaXMuY29udGVudENvbnRhaW5lciB9IH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXRoOiB7IHZhbHVlOiBwYXRoLCB3cml0YWJsZTogdHJ1ZSB9XG4gICAgICAgICAgICAgICAgICAgIH0gKVxuICAgICAgICAgICAgKVxuICAgICAgICB9IClcbiAgICAgICAgLmNhdGNoKCB0aGlzLkVycm9yIClcbiAgICB9LFxuXG4gICAgbmF2aWdhdGUoIGxvY2F0aW9uICkge1xuICAgICAgICBoaXN0b3J5LnB1c2hTdGF0ZSgge30sICcnLCBsb2NhdGlvbiApXG4gICAgICAgIHRoaXMuaGFuZGxlKClcbiAgICB9XG5cbn0sIHsgY3VycmVudFZpZXc6IHsgdmFsdWU6ICcnLCB3cml0YWJsZTogdHJ1ZSB9LCB2aWV3czogeyB2YWx1ZTogeyB9IH0gfSApXG4iLCJtb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5hc3NpZ24oIHt9LCByZXF1aXJlKCcuL19fcHJvdG9fXycpLCB7XG5cbiAgICBkZWxldGUoKSB7XG4gICAgICAgIHJldHVybiBQcm9taXNlLmFsbCggT2JqZWN0LmtleXMoIHRoaXMuc3ViVmlld3MgKS5tYXAoIHN1YlZpZXcgPT4gdGhpcy5zdWJWaWV3c1sgc3ViVmlldyBdLmRlbGV0ZSgpICkgKVxuICAgICAgICAudGhlbiggKCkgPT4gcmVxdWlyZSgnLi9fX3Byb3RvX18nKS5kZWxldGUuY2FsbCh0aGlzKSApXG4gICAgfSxcblxuICAgIG5hdmlnYXRlKCBwYXRoICkge1xuICAgICAgICB0aGlzLnBhdGggPSBwYXRoO1xuXG4gICAgICAgIHJldHVybiAoIHBhdGgubGVuZ3RoID09PSAxICYmIHRoaXMuZWxzLmNvbnRhaW5lci5jbGFzc0xpc3QuY29udGFpbnMoJ2hpZGUnKSApXG4gICAgICAgICAgICA/IFByb21pc2UuYWxsKCBPYmplY3Qua2V5cyggdGhpcy5zdWJWaWV3cyApLm1hcCggdmlldyA9PiB0aGlzLnN1YlZpZXdzWyB2aWV3IF0uaGlkZSgpICkgKS50aGVuKCAoKSA9PiB0aGlzLnNob3coKSApLmNhdGNoKCB0aGlzLkVycm9yIClcbiAgICAgICAgICAgIDogKCB0aGlzLnBhdGgubGVuZ3RoID4gMSApXG4gICAgICAgICAgICAgICAgPyAoIHRoaXMuZWxzLmNvbnRhaW5lci5jbGFzc0xpc3QuY29udGFpbnMoJ2hpZGUnKSApXG4gICAgICAgICAgICAgICAgICAgID8gdGhpcy5yZW5kZXJTdWJWaWV3KClcbiAgICAgICAgICAgICAgICAgICAgOiB0aGlzLmhpZGUoKS50aGVuKCAoKSA9PiB0aGlzLnJlbmRlclN1YlZpZXcoKSApXG4gICAgICAgICAgICAgICAgOiBQcm9taXNlLnJlc29sdmUoKVxuICAgIH0sXG5cbiAgICBwb3N0UmVuZGVyKCkge1xuICAgICAgICB0aGlzLnZpZXdzID0geyB9XG4gICAgICAgIHRoaXMuc3ViVmlld3MgPSB7IH1cblxuICAgICAgICBpZiggdGhpcy5wYXRoLmxlbmd0aCA+IDEgKSB7XG4gICAgICAgICAgICB0aGlzLmVscy5jb250YWluZXIuY2xhc3NMaXN0LmFkZCggJ2hpZGUnLCAnaGlkZGVuJyApXG4gICAgICAgICAgICB0aGlzLnJlbmRlclN1YlZpZXcoKVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5vcHRpb25zID0gT2JqZWN0LmNyZWF0ZSggdGhpcy5Nb2RlbCwgeyByZXNvdXJjZTogeyB2YWx1ZTogJ2FkbWluJyB9IH0gKVxuXG4gICAgICAgIHRoaXMub3B0aW9ucy5nZXQoIHsgbWV0aG9kOiAnb3B0aW9ucycgfSApXG4gICAgICAgIC50aGVuKCAoKSA9PlxuICAgICAgICAgICAgdGhpcy5vcHRpb25zLmRhdGEuZm9yRWFjaCggY29sbGVjdGlvbiA9PlxuICAgICAgICAgICAgICAgIHRoaXMudmlld3NbIGNvbGxlY3Rpb24gXSA9IHRoaXMuZmFjdG9yeS5jcmVhdGUoXG4gICAgICAgICAgICAgICAgICAgICdBZG1pbkl0ZW0nLFxuICAgICAgICAgICAgICAgICAgICB7IGluc2VydGlvbjogeyB2YWx1ZTogeyBlbDogdGhpcy5lbHMubGlzdCB9IH0sXG4gICAgICAgICAgICAgICAgICAgICAgbW9kZWw6IHsgdmFsdWU6IHsgZGF0YTogeyBjb2xsZWN0aW9uIH0gfSB9IH1cbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICApXG4gICAgICAgIClcbiAgICAgICAgLmNhdGNoKCB0aGlzLkVycm9yIClcblxuICAgICAgICByZXR1cm4gdGhpc1xuICAgIH0sXG5cbiAgICByZW5kZXJTdWJWaWV3KCkge1xuICAgICAgICBjb25zdCBzdWJWaWV3TmFtZSA9IGAke3RoaXMuY2FwaXRhbGl6ZUZpcnN0TGV0dGVyKHRoaXMucGF0aFsxXSl9UmVzb3VyY2VzYFxuXG4gICAgICAgIHJldHVybiB0aGlzLnN1YlZpZXdzWyBzdWJWaWV3TmFtZSBdXG4gICAgICAgICAgICA/IHRoaXMuc3ViVmlld3NbIHN1YlZpZXdOYW1lIF0ub25OYXZpZ2F0aW9uKCB0aGlzLnBhdGggKVxuICAgICAgICAgICAgOiB0aGlzLnN1YlZpZXdzWyBzdWJWaWV3TmFtZSBdID0gdGhpcy5mYWN0b3J5LmNyZWF0ZSggc3ViVmlld05hbWUsIHsgcGF0aDogeyB2YWx1ZTogdGhpcy5wYXRoLCB3cml0YWJsZTogdHJ1ZSB9LCBpbnNlcnRpb246IHsgdmFsdWU6IHsgZWw6IHRoaXMuZWxzLmNvbnRhaW5lciwgbWV0aG9kOiAnaW5zZXJ0QmVmb3JlJyB9IH0gfSApXG4gICAgfSxcblxuICAgIHJlcXVpcmVzTG9naW46IHRydWVcbn0gKVxuIiwibW9kdWxlLmV4cG9ydHMgPSBPYmplY3QuYXNzaWduKCB7fSwgcmVxdWlyZSgnLi9fX3Byb3RvX18nKSwge1xuXG4gICAgZXZlbnRzOiB7XG4gICAgICAgIGNvbnRhaW5lcjogJ2NsaWNrJ1xuICAgIH0sXG5cbiAgICBvbkNvbnRhaW5lckNsaWNrKCkge1xuICAgICAgICB0aGlzLmVtaXQoICduYXZpZ2F0ZScsIGAvYWRtaW4vJHt0aGlzLm1vZGVsLmRhdGEuY29sbGVjdGlvbn1gIClcbiAgICB9XG59IClcbiIsIm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmFzc2lnbigge30sIHJlcXVpcmUoJy4vX19wcm90b19fJyksIHtcblxuICAgIGV2ZW50czoge1xuICAgICAgICBjYW5jZWw6ICdjbGljaycsXG4gICAgICAgIGNvbmZpcm06ICdjbGljaycsXG4gICAgICAgIGRlbGV0ZTogJ2NsaWNrJyxcbiAgICAgICAgZWRpdDogJ2NsaWNrJyxcbiAgICAgICAgZmFjZWJvb2s6ICdjbGljaycsXG4gICAgICAgIGdvb2dsZTogJ2NsaWNrJyxcbiAgICAgICAgdGl0bGU6ICdjbGljaycsXG4gICAgICAgIHR3aXR0ZXI6ICdjbGljaydcbiAgICB9LFxuXG4gICAgZ2V0TGluaygpIHtcbiAgICAgICAgcmV0dXJuIGAke3dpbmRvdy5sb2NhdGlvbi5vcmlnaW59L2NvbWljLyR7dGhpcy5tb2RlbC5kYXRhLl9pZH1gXG4gICAgfSxcblxuICAgIGdldENvbWljKCkge1xuICAgICAgICByZXR1cm4gYCR7d2luZG93LmxvY2F0aW9uLm9yaWdpbn0ke3RoaXMubW9kZWwuZGF0YS5pbWFnZX1gXG4gICAgfSxcblxuICAgIG5hdmlnYXRlKCBwYXRoICkge1xuICAgICAgICB0aGlzLnBhdGggPSBwYXRoXG4gICAgICAgIHRoaXMubW9kZWwucmVzb3VyY2UgPSBgY29taWMvJHt0aGlzLnBhdGhbMV19YFxuXG4gICAgICAgIHRoaXMubW9kZWwuZ2V0KClcbiAgICAgICAgLnRoZW4oIGNvbWljID0+IHtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlKGNvbWljKVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2hvdygpXG4gICAgICAgIH0gKVxuICAgICAgICAuY2F0Y2goIHRoaXMuRXJyb3IgKVxuICAgIH0sXG5cbiAgICBvbkNhbmNlbENsaWNrKCkge1xuICAgICAgICB0aGlzLmVscy5oZWFkZXIuY2xhc3NMaXN0LnJlbW92ZSgnaGlkZGVuJylcbiAgICAgICAgdGhpcy5lbHMuY29uZmlybURpYWxvZy5jbGFzc0xpc3QuYWRkKCdoaWRkZW4nKVxuICAgIH0sXG5cbiAgICBvbkNvbmZpcm1DbGljaygpIHtcbiAgICAgICAgdGhpcy5lbWl0KCdkZWxldGUnKVxuICAgIH0sXG5cbiAgICBvbkRlbGV0ZUNsaWNrKCkge1xuICAgICAgICBpZiggdGhpcy51c2VyICYmIHRoaXMudXNlci5kYXRhLl9pZCApIHtcbiAgICAgICAgICAgIHRoaXMuZWxzLmhlYWRlci5jbGFzc0xpc3QuYWRkKCdoaWRkZW4nKVxuICAgICAgICAgICAgdGhpcy5lbHMuY29uZmlybURpYWxvZy5jbGFzc0xpc3QucmVtb3ZlKCdoaWRkZW4nKVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIG9uRWRpdENsaWNrKCkge1xuICAgICAgICBpZiggdGhpcy51c2VyICYmIHRoaXMudXNlci5kYXRhLl9pZCApIHRoaXMuZW1pdCgnZWRpdCcpXG4gICAgfSxcblxuICAgIC8vb25GYWNlYm9va0NsaWNrKCkgeyB3aW5kb3cub3BlbiggYGh0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS9zaGFyZS5waHA/dT0ke3RoaXMuZ2V0TGluaygpfWAgKSB9LFxuICAgIFxuICAgIG9uRmFjZWJvb2tDbGljaygpIHtcbiAgICAgICAgd2luZG93Lm9wZW4oXG4gICAgICAgICAgICBgaHR0cDovL3d3dy56YXp6bGUuY29tL2FwaS9jcmVhdGUvYXQtMjM4NTU1ODc4MTIzODU0MDMxP3JmPTIzODM1NzQ3MDg4NDY4NTQ2OCZgICtcbiAgICAgICAgICAgIGBheD1EZXNpZ25CbGFzdCZzcj0yNTAzNzUyMDI1NDIxODA4MDAmY2c9MCZ0X191c2VRcGM9dHJ1ZSZlZD1mYWxzZSZ0X19zbWFydD10cnVlJmAgK1xuICAgICAgICAgICAgYGNvbnRpbnVlVXJsPSR7ZW5jb2RlVVJJQ29tcG9uZW50KHdpbmRvdy5sb2NhdGlvbi5vcmlnaW4pfSZmd2Q9UHJvZHVjdFBhZ2UmdGM9JHt3aW5kb3cubG9jYXRpb259JmljPSR7dGhpcy5tb2RlbC5kYXRhLl9pZH0maW1hZ2UxPSR7dGhpcy5nZXRDb21pYygpfWAgKVxuICAgIH0sXG4gICAgXG4gICAgb25Hb29nbGVDbGljaygpIHsgd2luZG93Lm9wZW4oIGBodHRwczovL3BsdXMuZ29vZ2xlLmNvbS9zaGFyZT91cmw9eyR7dGhpcy5nZXRMaW5rKCl9fWApIH0sXG4gICAgXG4gICAgb25UaXRsZUNsaWNrKCkgeyB0aGlzLmVtaXQoICduYXZpZ2F0ZScsIGAvY29taWMvJHt0aGlzLm1vZGVsLmRhdGEuX2lkfWAgKSB9LFxuXG4gICAgb25Ud2l0dGVyQ2xpY2soKSB7IHdpbmRvdy5vcGVuKCBgaHR0cHM6Ly93d3cudHdpdHRlci5jb20vc2hhcmU/dXJsPSR7dGhpcy5nZXRMaW5rKCl9JnZpYT10aW55aGFuZGVkJnRleHQ9JHtlbmNvZGVVUklDb21wb25lbnQodGhpcy5tb2RlbC5kYXRhLnRpdGxlKX1gICkgfSxcblxuICAgIHBvc3RSZW5kZXIoKSB7XG4gICAgICAgIGlmKCB0aGlzLm1vZGVsICYmIHRoaXMubW9kZWwuZGF0YS5faWQgKSByZXR1cm4gdGhpc1xuXG4gICAgICAgIGlmKCB0aGlzLnBhdGgubGVuZ3RoICE9PSAyICkgeyB0aGlzLmVtaXQoICduYXZpZ2F0ZScsICcnICk7IHJldHVybiB0aGlzIH1cblxuICAgICAgICB0aGlzLm1vZGVsID0gT2JqZWN0LmNyZWF0ZSggdGhpcy5Nb2RlbCwgeyByZXNvdXJjZTogeyB2YWx1ZTogYGNvbWljLyR7dGhpcy5wYXRoWzFdfWAsIHdyaXRhYmxlOiB0cnVlIH0gfSApXG4gICAgICAgIHRoaXMubW9kZWwuZ2V0KClcbiAgICAgICAgLnRoZW4oIHRoaXMudXBkYXRlLmJpbmQodGhpcykgKVxuICAgICAgICAuY2F0Y2goIHRoaXMuRXJyb3IgKVxuXG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgfSxcblxuICAgIHVwZGF0ZShjb21pYykge1xuICAgICAgICB0aGlzLm1vZGVsLmRhdGEgPSBjb21pY1xuICAgICAgICB0aGlzLmVscy50aXRsZS50ZXh0Q29udGVudCA9IGNvbWljLnRpdGxlXG4gICAgICAgIHRoaXMuZWxzLmltYWdlLnNyYyA9IGAke2NvbWljLmltYWdlfT8ke25ldyBEYXRlKCkuZ2V0VGltZSgpfWBcbiAgICB9XG59IClcbiIsIm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmFzc2lnbigge30sIHJlcXVpcmUoJy4vX19wcm90b19fJyksIHtcblxuICAgIGV2ZW50czoge1xuICAgICAgICBjYW5jZWw6ICdjbGljaycsXG4gICAgICAgIHN1Ym1pdDogJ2NsaWNrJ1xuICAgIH0sXG5cbiAgICBvbkNhbmNlbENsaWNrKCkgeyB0aGlzLmhpZGUoKS50aGVuKCAoKSA9PiB0aGlzLmVtaXQoJ2NhbmNlbGxlZCcpICkgfSxcbiAgICBcbiAgICBvblN1Ym1pdENsaWNrKCkge1xuICAgICAgICB0aGlzWyBgcmVxdWVzdCR7dGhpcy5jYXBpdGFsaXplRmlyc3RMZXR0ZXIoIHRoaXMudHlwZSApfWAgXSgpXG4gICAgICAgIC5jYXRjaCggdGhpcy5FcnJvciApXG4gICAgfSxcblxuICAgIG9uTmF2aWdhdGlvbiggdHlwZSwgY29taWMgKSB7XG4gICAgICAgIHRoaXMudHlwZSA9IHR5cGVcbiAgICAgICAgdGhpcy5tb2RlbC5kYXRhID0gY29taWNcbiAgICAgICBcbiAgICAgICAgdGhpcy5wb3B1bGF0ZSgpIFxuXG4gICAgICAgIGlmKCB0aGlzLmVscy5jb250YWluZXIuY2xhc3NMaXN0LmNvbnRhaW5zKCdoaWRlJykgKSB0aGlzLnNob3coKVxuICAgIH0sXG5cbiAgICBwb3B1bGF0ZSgpIHtcbiAgICAgICAgdGhpcy5lbHMuaGVhZGVyLnRleHRDb250ZW50ID0gYCR7dGhpcy5jYXBpdGFsaXplRmlyc3RMZXR0ZXIoIHRoaXMudHlwZSApfSBDb21pY2BcblxuICAgICAgICBpZiggT2JqZWN0LmtleXMoIHRoaXMubW9kZWwuZGF0YSApLmxlbmd0aCApIHtcbiAgICAgICAgICAgIHRoaXMuZWxzLnRpdGxlLnZhbHVlID0gdGhpcy5tb2RlbC5kYXRhLnRpdGxlIHx8ICcnXG4gICAgICAgICAgICB0aGlzLmVscy5wcmV2aWV3LnNyYyA9IHRoaXMubW9kZWwuZGF0YS5pbWFnZVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5lbHMudGl0bGUudmFsdWUgPSAnJ1xuICAgICAgICAgICAgdGhpcy5lbHMucHJldmlldy5zcmMgPSAnJ1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIHBvc3RSZW5kZXIoKSB7XG4gICAgICAgIHRoaXMuc3Bpbm5lciA9IG5ldyB0aGlzLlNwaW5uZXIoIHtcbiAgICAgICAgICAgIGNvbG9yOiAnI2ZmZicsXG4gICAgICAgICAgICBsZW5ndGg6IDE1LFxuICAgICAgICAgICAgc2NhbGU6IDAuMjUsXG4gICAgICAgICAgICB3aWR0aDogNVxuICAgICAgICB9ICkuc3BpbigpXG5cbiAgICAgICAgdGhpcy5wb3B1bGF0ZSgpXG5cbiAgICAgICAgdGhpcy5lbHMuaW1hZ2UuYWRkRXZlbnRMaXN0ZW5lciggJ2NoYW5nZScsIGUgPT4ge1xuICAgICAgICAgICAgY29uc3QgYmFzZTY0UmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKSxcbiAgICAgICAgICAgICAgICAgIGJpbmFyeVJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKClcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdGhpcy5lbHMudXBsb2FkLmNsYXNzTGlzdC5hZGQoJ2hhcy1zcGlubmVyJylcbiAgICAgICAgICAgIHRoaXMuZWxzLnVwbG9hZC5hcHBlbmRDaGlsZCggdGhpcy5zcGlubmVyLnNwaW4oKS5lbCApXG5cbiAgICAgICAgICAgIGJhc2U2NFJlYWRlci5vbmxvYWQgPSAoIGV2dCApID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmZpbGUgPSBldnQudGFyZ2V0LnJlc3VsdFxuICAgICAgICAgICAgICAgIHRoaXMuZWxzLnVwbG9hZC5jbGFzc0xpc3QucmVtb3ZlKCdoYXMtc3Bpbm5lcicpXG4gICAgICAgICAgICAgICAgdGhpcy5zcGlubmVyLnN0b3AoKVxuICAgICAgICAgICAgICAgIHRoaXMuZWxzLnByZXZpZXcuc3JjID0gZXZ0LnRhcmdldC5yZXN1bHQgXG4gICAgICAgICAgICAgICAgYmluYXJ5UmVhZGVyLm9ubG9hZCA9IGV2ZW50ID0+IHRoaXMuYmluYXJ5RmlsZSA9IGV2ZW50LnRhcmdldC5yZXN1bHRcbiAgICAgICAgICAgICAgICBiaW5hcnlSZWFkZXIucmVhZEFzQXJyYXlCdWZmZXIoIGUudGFyZ2V0LmZpbGVzWzBdIClcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgYmFzZTY0UmVhZGVyLnJlYWRBc0RhdGFVUkwoIGUudGFyZ2V0LmZpbGVzWzBdIClcbiAgICAgICAgfSApXG4gICAgICAgICAgICBcbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICB9LFxuXG4gICAgcmVxdWVzdEFkZCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuWGhyKCB7IG1ldGhvZDogJ1BPU1QnLCByZXNvdXJjZTogJ2ZpbGUnLCBkYXRhOiB0aGlzLmJpbmFyeUZpbGUsIGhlYWRlcnM6IHsgY29udGVudFR5cGU6ICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nIH0gfSApXG4gICAgICAgIC50aGVuKCByZXNwb25zZSA9PiB0aGlzLlhociggeyBtZXRob2Q6ICdQT1NUJywgcmVzb3VyY2U6ICdjb21pYycsIGRhdGE6IEpTT04uc3RyaW5naWZ5KCB7IHRpdGxlOiB0aGlzLmVscy50aXRsZS52YWx1ZSwgaW1hZ2U6IHJlc3BvbnNlLnBhdGggfSApIH0gKSApXG4gICAgICAgIC50aGVuKCByZXNwb25zZSA9PiB0aGlzLmhpZGUoKS50aGVuKCAoKSA9PiB0aGlzLmVtaXQoICdhZGRlZCcsIHJlc3BvbnNlICkgKSApXG4gICAgfSxcblxuICAgIHJlcXVlc3RFZGl0KCkge1xuICAgICAgICBsZXQgZGF0YSA9IHsgdGl0bGU6IHRoaXMuZWxzLnRpdGxlLnZhbHVlIH1cbiAgICAgICAgXG4gICAgICAgIHJldHVybiAoICggdGhpcy5iaW5hcnlGaWxlIClcbiAgICAgICAgICAgID8gdGhpcy5YaHIoIHsgbWV0aG9kOiAnUEFUQ0gnLCByZXNvdXJjZTogYGZpbGUvJHt0aGlzLm1vZGVsLmRhdGEuaW1hZ2Uuc3BsaXQoJy8nKVs0XX1gLCBkYXRhOiB0aGlzLmJpbmFyeUZpbGUsIGhlYWRlcnM6IHsgY29udGVudFR5cGU6ICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nIH0gfSApXG4gICAgICAgICAgICA6IFByb21pc2UucmVzb2x2ZSgpIClcbiAgICAgICAgLnRoZW4oICgpID0+IHRoaXMuWGhyKCB7IG1ldGhvZDogJ1BBVENIJywgcmVzb3VyY2U6IGBjb21pYy8ke3RoaXMubW9kZWwuZGF0YS5faWR9YCwgZGF0YTogSlNPTi5zdHJpbmdpZnkoIGRhdGEgKSB9ICkgKVxuICAgICAgICAudGhlbiggcmVzcG9uc2UgPT4gdGhpcy5oaWRlKCkudGhlbiggKCkgPT4gdGhpcy5lbWl0KCAnZWRpdGVkJywgcmVzcG9uc2UgKSApIClcbiAgICB9XG59IClcbiIsIm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmFzc2lnbigge30sIHJlcXVpcmUoJy4vX19wcm90b19fJyksIHtcblxuICAgIGNyZWF0ZUNvbWljVmlldyggY29taWMgKSB7XG4gICAgICAgIHRoaXMudmlld3NbIGNvbWljLl9pZCBdID0gdGhpcy5mYWN0b3J5LmNyZWF0ZShcbiAgICAgICAgICAgICdDb21pYycsXG4gICAgICAgICAgICB7IGluc2VydGlvbjogeyB2YWx1ZTogeyBlbDogdGhpcy5lbHMubGlzdCB9IH0sXG4gICAgICAgICAgICAgIG1vZGVsOiB7IHZhbHVlOiB7IGRhdGE6IGNvbWljIH0gfVxuICAgICAgICAgICAgfVxuICAgICAgICApXG5cbiAgICAgICAgdGhpcy52aWV3c1sgY29taWMuX2lkIF1cbiAgICAgICAgLm9uKCAnZWRpdCcsICgpID0+IHRoaXMuZW1pdCggJ25hdmlnYXRlJywgYC9hZG1pbi9jb21pYy9lZGl0LyR7Y29taWMuX2lkfWApIClcbiAgICAgICAgLm9uKCAnZGVsZXRlJywgKCkgPT5cbiAgICAgICAgICAgIHRoaXMuWGhyKCB7IG1ldGhvZDogJ2RlbGV0ZScsIHJlc291cmNlOiBgY29taWMvJHtjb21pYy5faWR9YCB9IClcbiAgICAgICAgICAgIC50aGVuKCAoKSA9PiB0aGlzLnZpZXdzWyBjb21pYy5faWQgXS5kZWxldGUoKSApXG4gICAgICAgICAgICAuY2F0Y2goIHRoaXMuRXJyb3IgKVxuICAgICAgICApXG4gICAgfSxcblxuICAgIGRlbGV0ZSgpIHtcbiAgICAgICAgcmV0dXJuICggKCB0aGlzLnZpZXdzLkNvbWljTWFuYWdlIClcbiAgICAgICAgICAgID8gdGhpcy52aWV3cy5Db21pY01hbmFnZS5kZWxldGUoKVxuICAgICAgICAgICAgOiBQcm9taXNlLnJlc29sdmUoKSApXG4gICAgICAgIC50aGVuKCAoKSA9PiByZXF1aXJlKCcuL19fcHJvdG9fXycpLmRlbGV0ZS5jYWxsKHRoaXMpIClcbiAgICB9LFxuXG4gICAgZXZlbnRzOiB7XG4gICAgICAgIGFkZEJ0bjogJ2NsaWNrJ1xuICAgIH0sXG5cbiAgICBtYW5hZ2VDb21pYyggdHlwZSwgY29taWMgKSB7XG4gICAgICAgIHRoaXMudmlld3MuQ29taWNNYW5hZ2UgXG4gICAgICAgICAgICA/IHRoaXMudmlld3MuQ29taWNNYW5hZ2Uub25OYXZpZ2F0aW9uKCB0eXBlLCBjb21pYyApXG4gICAgICAgICAgICA6IHRoaXMudmlld3MuQ29taWNNYW5hZ2UgPVxuICAgICAgICAgICAgICAgIHRoaXMuZmFjdG9yeS5jcmVhdGUoICdDb21pY01hbmFnZScsIHsgdHlwZTogeyB2YWx1ZTogdHlwZSwgd3JpdGFibGU6IHRydWUgfSwgbW9kZWw6IHsgdmFsdWU6IHsgZGF0YTogY29taWMgfHwge30gfSB9LCBpbnNlcnRpb246IHsgdmFsdWU6IHsgZWw6IHRoaXMuZWxzLmNvbnRhaW5lciwgbWV0aG9kOiAnaW5zZXJ0QmVmb3JlJyB9IH0gfSApXG4gICAgICAgICAgICAgICAgLm9uKCAnYWRkZWQnLCBjb21pYyA9PiB7IHRoaXMuY3JlYXRlQ29taWNWaWV3KGNvbWljKTsgdGhpcy5lbWl0KCAnbmF2aWdhdGUnLCBgL2FkbWluL2NvbWljYCApOyB9IClcbiAgICAgICAgICAgICAgICAub24oICdjYW5jZWxsZWQnLCAoKSA9PiB0aGlzLmVtaXQoICduYXZpZ2F0ZScsIGAvYWRtaW4vY29taWNgICkgKVxuICAgICAgICAgICAgICAgIC5vbiggJ2VkaXRlZCcsIGNvbWljID0+IHsgdGhpcy52aWV3c1sgY29taWMuX2lkIF0udXBkYXRlKCBjb21pYyApOyB0aGlzLmVtaXQoICduYXZpZ2F0ZScsIGAvYWRtaW4vY29taWNgICk7IH0gKVxuICAgIH0sXG5cbiAgICBvbkFkZEJ0bkNsaWNrKCkgeyB0aGlzLmVtaXQoICduYXZpZ2F0ZScsIGAvYWRtaW4vY29taWMvYWRkYCApIH0sXG5cbiAgICBvbk5hdmlnYXRpb24oIHBhdGggKSB7XG4gICAgICAgIHRoaXMucGF0aCA9IHBhdGg7XG5cbiAgICAgICAgKCBwYXRoLmxlbmd0aCA9PT0gMiAmJiB0aGlzLmVscy5jb250YWluZXIuY2xhc3NMaXN0LmNvbnRhaW5zKCdoaWRlJykgKSBcbiAgICAgICAgICAgID8gdGhpcy52aWV3cy5Db21pY01hbmFnZSAmJiAhdGhpcy52aWV3cy5Db21pY01hbmFnZS5lbHMuY29udGFpbmVyLmNsYXNzTGlzdC5jb250YWlucygnaGlkZScpXG4gICAgICAgICAgICAgICAgPyB0aGlzLnZpZXdzLkNvbWljTWFuYWdlLmhpZGUoKS50aGVuKCAoKSA9PiB0aGlzLnNob3coKSApXG4gICAgICAgICAgICAgICAgOiB0aGlzLnNob3coKVxuICAgICAgICAgICAgOiBwYXRoLmxlbmd0aCA9PT0gM1xuICAgICAgICAgICAgICAgID8gdGhpcy5oaWRlKCkudGhlbiggKCkgPT4gdGhpcy5tYW5hZ2VDb21pYyggcGF0aFsyXSwgeyB9ICkgKVxuICAgICAgICAgICAgICAgIDogcGF0aC5sZW5ndGggPT09IDRcbiAgICAgICAgICAgICAgICAgICAgID8gdGhpcy5oaWRlKCkudGhlbiggKCkgPT4gdGhpcy5tYW5hZ2VDb21pYyggcGF0aFsyXSwgdGhpcy52aWV3c1sgcGF0aFszXSBdLm1vZGVsLmRhdGEgKSApXG4gICAgICAgICAgICAgICAgICAgICA6IHVuZGVmaW5lZFxuICAgIH0sXG5cbiAgICBwb3N0UmVuZGVyKCkge1xuXG4gICAgICAgIGlmKCB0aGlzLnBhdGgubGVuZ3RoID4gMiApIHtcbiAgICAgICAgICAgIHRoaXMuZWxzLmNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCAnaGlkZGVuJywgJ2hpZGUnIClcbiAgICAgICAgICAgIGlmKCB0aGlzLnBhdGhbMl0gPT09IFwiYWRkXCIgKSB7IHRoaXMubWFuYWdlQ29taWMoIFwiYWRkXCIsIHsgfSApIH1cbiAgICAgICAgICAgIGVsc2UgaWYoIHRoaXMucGF0aFsyXSA9PT0gXCJlZGl0XCIgJiYgdGhpcy5wYXRoWzNdICkge1xuICAgICAgICAgICAgICAgIHRoaXMuWGhyKCB7IG1ldGhvZDogXCJnZXRcIiwgcmVzb3VyY2U6IGBjb21pYy8ke3RoaXMucGF0aFszXX1gIH0gKVxuICAgICAgICAgICAgICAgIC50aGVuKCByZXNwb25zZSA9PiB0aGlzLm1hbmFnZUNvbWljKCBcImVkaXRcIiwgcmVzcG9uc2UgKSApXG4gICAgICAgICAgICAgICAgLmNhdGNoKCBlID0+IHsgdGhpcy5FcnJvcihlKTsgdGhpcy5lbWl0KCAnbmF2aWdhdGUnLCBgL2FkbWluL2NvbWljYCApIH0gKVxuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYoIHRoaXMucGF0aC5sZW5ndGggPT09IDEgJiYgdGhpcy52aWV3cy5Db21pY01hbmFnZSApIHtcbiAgICAgICAgICAgIHRoaXMudmlld3MuQ29taWNNYW5hZ2UuaGlkZSgpXG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmNvbWljcyA9IE9iamVjdC5jcmVhdGUoIHRoaXMuTW9kZWwsIHsgcmVzb3VyY2U6IHsgdmFsdWU6ICdjb21pYycgfSB9IClcblxuICAgICAgICB0aGlzLmNvbWljcy5nZXQoKVxuICAgICAgICAudGhlbiggKCkgPT4gUHJvbWlzZS5yZXNvbHZlKCB0aGlzLmNvbWljcy5kYXRhLmZvckVhY2goIGNvbWljID0+IHRoaXMuY3JlYXRlQ29taWNWaWV3KCBjb21pYyApICkgKSApXG4gICAgICAgIC5jYXRjaCggdGhpcy5FcnJvciApXG5cbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICB9LFxuXG4gICAgcmVxdWlyZXNMb2dpbjogdHJ1ZVxufSApXG4iLCJtb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5hc3NpZ24oIHt9LCByZXF1aXJlKCcuL19fcHJvdG9fXycpLCB7XG5cbiAgICBldmVudHM6IHtcbiAgICAgICAgbG9nbzogJ2NsaWNrJ1xuICAgIH0sXG5cbiAgICBvblVzZXIoKSB7XG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgfSxcblxuICAgIG9uTG9nb0NsaWNrKCkge1xuICAgICAgICB0aGlzLnNpZ25vdXQoKVxuICAgIH0sXG5cbiAgICByZXF1aXJlc0xvZ2luOiBmYWxzZSxcbiAgICBcbiAgICBzaWdub3V0KCkge1xuXG4gICAgICAgIGRvY3VtZW50LmNvb2tpZSA9IGAke3dpbmRvdy5jb29raWVOYW1lfT07IGV4cGlyZXM9VGh1LCAwMSBKYW4gMTk3MCAwMDowMDowMSBHTVQ7YDtcblxuICAgICAgICB0aGlzLnVzZXIuZGF0YSA9IHsgfVxuXG4gICAgICAgIHRoaXMuZW1pdCggJ3NpZ25vdXQnIClcblxuICAgIH1cblxufSApXG4iLCJtb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5hc3NpZ24oIHt9LCByZXF1aXJlKCcuL19fcHJvdG9fXycpLCB7XG5cbiAgICBmZXRjaEFuZERpc3BsYXkoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldERhdGEoKVxuICAgICAgICAudGhlbiggcmVzcG9uc2UgPT4gXG4gICAgICAgICAgICByZXNwb25zZS5mb3JFYWNoKCBjb21pYyA9PlxuICAgICAgICAgICAgICAgIHRoaXMudmlld3NbIGNvbWljLl9pZCBdID1cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5mYWN0b3J5LmNyZWF0ZSggJ2NvbWljJywgeyBpbnNlcnRpb246IHsgdmFsdWU6IHsgZWw6IHRoaXMuZWxzLmNvbnRhaW5lciB9IH0sIG1vZGVsOiB7IHZhbHVlOiB7IGRhdGE6IGNvbWljIH0gfSwgdGVtcGxhdGVPcHRzOiB7IHZhbHVlOiB7IHJlYWRPbmx5OiB0cnVlIH0gfSB9IClcbiAgICAgICAgICAgIClcbiAgICAgICAgKVxuICAgIH0sXG5cbiAgICBnZXREYXRhKCkge1xuICAgICAgICBpZiggIXRoaXMubW9kZWwgKSB0aGlzLm1vZGVsID0gT2JqZWN0LmNyZWF0ZSggdGhpcy5Nb2RlbCwgeyBwYWdpbmF0aW9uOiB7IHZhbHVlOiB7IHNraXA6IDAsIGxpbWl0OjEwLCBzb3J0OiB7IGNyZWF0ZWQ6IC0xIH0gfSB9LCByZXNvdXJjZTogeyB2YWx1ZTogJ2NvbWljJyB9IH0gKVxuXG4gICAgICAgIHJldHVybiB0aGlzLm1vZGVsLmdldCgpXG4gICAgfSxcblxuICAgIG5hdmlnYXRlKCkge1xuICAgICAgICB0aGlzLnNob3coKVxuICAgIH0sXG5cbiAgICBwb3N0UmVuZGVyKCkge1xuICAgICAgICB0aGlzLmZldGNoQW5kRGlzcGxheSgpLmNhdGNoKCB0aGlzLkVycm9yIClcbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICB9XG5cbn0gKVxuIiwibW9kdWxlLmV4cG9ydHMgPSBPYmplY3QuYXNzaWduKCB7fSwgcmVxdWlyZSgnLi9fX3Byb3RvX18nKSwge1xuICAgIFxuICAgIGV2ZW50czoge1xuICAgICAgICBzdWJtaXQ6ICdjbGljaydcbiAgICB9LFxuXG4gICAgb25TdWJtaXRDbGljaygpIHtcbiAgICAgICAgdGhpcy5YaHIoIHsgbWV0aG9kOiAncG9zdCcsIHJlc291cmNlOiAnYXV0aCcsIGRhdGE6IEpTT04uc3RyaW5naWZ5KCB7IHVzZXJuYW1lOiB0aGlzLmVscy51c2VybmFtZS52YWx1ZSwgcGFzc3dvcmQ6IHRoaXMuZWxzLnBhc3N3b3JkLnZhbHVlIH0gKSB9IClcbiAgICAgICAgLnRoZW4oICgpID0+IHRoaXMudXNlci5nZXQoKSApXG4gICAgICAgIC50aGVuKCAoKSA9PiB0aGlzLmhpZGUoKSApXG4gICAgICAgIC50aGVuKCAoKSA9PiBQcm9taXNlLnJlc29sdmUoIHRoaXMuZW1pdCggJ2xvZ2dlZEluJyApKSApXG4gICAgICAgIC5jYXRjaCggdGhpcy5FcnJvciApXG4gICAgfVxufSApXG4iLCJtb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5hc3NpZ24oIHt9LCByZXF1aXJlKCcuL19fcHJvdG9fXycpLCB7XG5cbiAgICBldmVudHM6IHtcbiAgICAgICAgY2FuY2VsOiAnY2xpY2snLFxuICAgICAgICBjb25maXJtOiAnY2xpY2snLFxuICAgICAgICBkZWxldGU6ICdjbGljaycsXG4gICAgICAgIGVkaXQ6ICdjbGljaydcbiAgICB9LFxuXG4gICAgb25DYW5jZWxDbGljaygpIHtcbiAgICAgICAgdGhpcy5lbHMudXNlcm5hbWUuY2xhc3NMaXN0LnJlbW92ZSgnaGlkZGVuJylcbiAgICAgICAgdGhpcy5lbHMuY29uZmlybURpYWxvZy5jbGFzc0xpc3QuYWRkKCdoaWRkZW4nKVxuICAgIH0sXG5cbiAgICBvbkNvbmZpcm1DbGljaygpIHtcbiAgICAgICAgdGhpcy5lbWl0KCdkZWxldGUnKVxuICAgIH0sXG5cbiAgICBvbkRlbGV0ZUNsaWNrKCkge1xuICAgICAgICBpZiggdGhpcy51c2VyICYmIHRoaXMudXNlci5kYXRhLl9pZCApIHtcbiAgICAgICAgICAgIHRoaXMuZWxzLnVzZXJuYW1lLmNsYXNzTGlzdC5hZGQoJ2hpZGRlbicpXG4gICAgICAgICAgICB0aGlzLmVscy5jb25maXJtRGlhbG9nLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGRlbicpXG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgb25FZGl0Q2xpY2soKSB7XG4gICAgICAgIGlmKCB0aGlzLnVzZXIgJiYgdGhpcy51c2VyLmRhdGEuX2lkICkgdGhpcy5lbWl0KCdlZGl0JylcbiAgICB9LFxuXG4gICAgdXBkYXRlKHVzZXIpIHtcbiAgICAgICAgdGhpcy51c2VyLmRhdGEgPSB1c2VyXG4gICAgICAgIHRoaXMuZWxzLnVzZXJuYW1lLnRleHRDb250ZW50ID0gdXNlci51c2VybmFtZVxuICAgIH1cblxufSApXG4iLCJtb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5hc3NpZ24oIHt9LCByZXF1aXJlKCcuL19fcHJvdG9fXycpLCB7XG5cbiAgICBldmVudHM6IHtcbiAgICAgICAgY2FuY2VsOiAnY2xpY2snLFxuICAgICAgICBzdWJtaXQ6ICdjbGljaydcbiAgICB9LFxuXG4gICAgb25DYW5jZWxDbGljaygpIHsgdGhpcy5oaWRlKCkudGhlbiggKCkgPT4gdGhpcy5lbWl0KCdjYW5jZWxsZWQnKSApIH0sXG4gICAgXG4gICAgb25TdWJtaXRDbGljaygpIHtcbiAgICAgICAgdGhpc1sgYHJlcXVlc3Qke3RoaXMuY2FwaXRhbGl6ZUZpcnN0TGV0dGVyKCB0aGlzLnR5cGUgKX1gIF0oKVxuICAgICAgICAuY2F0Y2goIHRoaXMuRXJyb3IgKVxuICAgIH0sXG5cbiAgICBvbk5hdmlnYXRpb24oIHR5cGUsIGNvbWljICkge1xuICAgICAgICB0aGlzLnR5cGUgPSB0eXBlXG4gICAgICAgIHRoaXMubW9kZWwuZGF0YSA9IGNvbWljXG4gICAgICAgXG4gICAgICAgIHRoaXMucG9wdWxhdGUoKSBcbiAgICAgICAgXG4gICAgICAgIGlmKCB0aGlzLmVscy5jb250YWluZXIuY2xhc3NMaXN0LmNvbnRhaW5zKCdoaWRlJykgKSB0aGlzLnNob3coKVxuICAgIH0sXG5cbiAgICBwb3B1bGF0ZSgpIHtcbiAgICAgICAgdGhpcy5lbHMudGl0bGUudGV4dENvbnRlbnQgPSBgJHt0aGlzLmNhcGl0YWxpemVGaXJzdExldHRlciggdGhpcy50eXBlICl9IFVzZXJgXG5cbiAgICAgICAgdGhpcy5lbHMudXNlcm5hbWUudmFsdWUgPSBPYmplY3Qua2V5cyggdGhpcy5tb2RlbC5kYXRhICkubGVuZ3RoID8gdGhpcy5tb2RlbC5kYXRhLnVzZXJuYW1lIDogJydcbiAgICAgICAgdGhpcy5lbHMucGFzc3dvcmQudmFsdWUgPSAnJ1xuICAgIH0sXG5cbiAgICBwb3N0UmVuZGVyKCkge1xuICAgICAgICB0aGlzLnBvcHVsYXRlKCkgXG4gICAgICAgICAgICBcbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICB9LFxuXG4gICAgcmVxdWVzdEFkZCgpIHtcbiAgICAgICAgaWYoIHRoaXMuZWxzLnBhc3N3b3JkLnZhbHVlLmxlbmd0aCA9PT0gMCApIHJldHVyblxuICAgICAgICByZXR1cm4gdGhpcy5YaHIoIHsgbWV0aG9kOiAnUE9TVCcsIHJlc291cmNlOiAndXNlcicsIGRhdGE6IEpTT04uc3RyaW5naWZ5KCB7IHVzZXJuYW1lOiB0aGlzLmVscy51c2VybmFtZS52YWx1ZSwgcGFzc3dvcmQ6IHRoaXMuZWxzLnBhc3N3b3JkLnZhbHVlIH0gKSB9IClcbiAgICAgICAgLnRoZW4oIHJlc3BvbnNlID0+IHRoaXMuaGlkZSgpLnRoZW4oICgpID0+IHRoaXMuZW1pdCggJ2FkZGVkJywgeyBfaWQ6IHJlc3BvbnNlLl9pZCwgdXNlcm5hbWU6IHJlc3BvbnNlLnVzZXJuYW1lIH0gKSApIClcbiAgICB9LFxuXG4gICAgcmVxdWVzdEVkaXQoKSB7XG4gICAgICAgIGxldCBkYXRhID0geyB1c2VybmFtZTogdGhpcy5lbHMudXNlcm5hbWUudmFsdWUgfVxuXG4gICAgICAgIGlmKCB0aGlzLmVscy5wYXNzd29yZC52YWx1ZS5sZW5ndGggKSBkYXRhLnBhc3N3b3JkID0gdGhpcy5lbHMucGFzc3dvcmQudmFsdWVcbiAgICAgICAgcmV0dXJuIHRoaXMuWGhyKCB7IG1ldGhvZDogJ1BBVENIJywgcmVzb3VyY2U6IGB1c2VyLyR7dGhpcy51c2VyLmRhdGEuX2lkfWAsIGRhdGE6IEpTT04uc3RyaW5naWZ5KCBkYXRhICkgfSApXG4gICAgICAgIC50aGVuKCByZXNwb25zZSA9PiB0aGlzLmhpZGUoKS50aGVuKCAoKSA9PiB0aGlzLmVtaXQoICdlZGl0ZWQnLCB7IF9pZDogcmVzcG9uc2UuX2lkLCB1c2VybmFtZTogcmVzcG9uc2UudXNlcm5hbWUgfSApICkgKVxuICAgIH1cbn0gKVxuIiwibW9kdWxlLmV4cG9ydHMgPSBPYmplY3QuYXNzaWduKCB7fSwgcmVxdWlyZSgnLi9fX3Byb3RvX18nKSwge1xuXG4gICAgY3JlYXRlVXNlclZpZXcoIHVzZXIgKSB7XG4gICAgICAgIHRoaXMudmlld3NbIHVzZXIuX2lkIF0gPSB0aGlzLmZhY3RvcnkuY3JlYXRlKFxuICAgICAgICAgICAgJ1VzZXInLFxuICAgICAgICAgICAgeyBpbnNlcnRpb246IHsgdmFsdWU6IHsgZWw6IHRoaXMuZWxzLmxpc3QgfSB9LFxuICAgICAgICAgICAgICBtb2RlbDogeyB2YWx1ZTogeyBkYXRhOiB1c2VyIH0gfVxuICAgICAgICAgICAgfVxuICAgICAgICApXG5cbiAgICAgICAgdGhpcy52aWV3c1sgdXNlci5faWQgXVxuICAgICAgICAub24oICdlZGl0JywgKCkgPT4gdGhpcy5lbWl0KCAnbmF2aWdhdGUnLCBgL2FkbWluL3VzZXIvZWRpdC8ke3VzZXIuX2lkfWApIClcbiAgICAgICAgLm9uKCAnZGVsZXRlJywgKCkgPT5cbiAgICAgICAgICAgIHRoaXMuWGhyKCB7IG1ldGhvZDogJ2RlbGV0ZScsIHJlc291cmNlOiBgdXNlci8ke3VzZXIuX2lkfWAgfSApXG4gICAgICAgICAgICAudGhlbiggKCkgPT4gdGhpcy52aWV3c1sgdXNlci5faWQgXS5kZWxldGUoKSApXG4gICAgICAgICAgICAuY2F0Y2goIHRoaXMuRXJyb3IgKVxuICAgICAgICApXG4gICAgfSxcblxuICAgIGRlbGV0ZSgpIHtcbiAgICAgICAgcmV0dXJuICggKCB0aGlzLnZpZXdzLlVzZXJNYW5hZ2UgKVxuICAgICAgICAgICAgPyB0aGlzLnZpZXdzLlVzZXJNYW5hZ2UuZGVsZXRlKClcbiAgICAgICAgICAgIDogUHJvbWlzZS5yZXNvbHZlKCkgKVxuICAgICAgICAudGhlbiggKCkgPT4gcmVxdWlyZSgnLi9fX3Byb3RvX18nKS5kZWxldGUuY2FsbCh0aGlzKSApXG4gICAgfSxcblxuICAgIGV2ZW50czoge1xuICAgICAgICBhZGRCdG46ICdjbGljaydcbiAgICB9LFxuXG4gICAgbWFuYWdlVXNlciggdHlwZSwgdXNlciApIHtcbiAgICAgICAgdGhpcy52aWV3cy5Vc2VyTWFuYWdlIFxuICAgICAgICAgICAgPyB0aGlzLnZpZXdzLlVzZXJNYW5hZ2Uub25OYXZpZ2F0aW9uKCB0eXBlLCB1c2VyIClcbiAgICAgICAgICAgIDogdGhpcy52aWV3cy5Vc2VyTWFuYWdlID1cbiAgICAgICAgICAgICAgICB0aGlzLmZhY3RvcnkuY3JlYXRlKCAnVXNlck1hbmFnZScsIHsgdHlwZTogeyB2YWx1ZTogdHlwZSwgd3JpdGFibGU6IHRydWUgfSwgbW9kZWw6IHsgdmFsdWU6IHsgZGF0YTogdXNlciB8fCB7fSB9IH0sIGluc2VydGlvbjogeyB2YWx1ZTogeyBlbDogdGhpcy5lbHMuY29udGFpbmVyLCBtZXRob2Q6ICdpbnNlcnRCZWZvcmUnIH0gfSB9IClcbiAgICAgICAgICAgICAgICAgICAgLm9uKCAnYWRkZWQnLCB1c2VyID0+IHsgdGhpcy5jcmVhdGVVc2VyVmlldyh1c2VyKTsgdGhpcy5lbWl0KCAnbmF2aWdhdGUnLCBgL2FkbWluL3VzZXJgICk7IH0gKVxuICAgICAgICAgICAgICAgICAgICAub24oICdlZGl0ZWQnLCB1c2VyID0+IHsgdGhpcy52aWV3c1sgdXNlci5faWQgXS51cGRhdGUoIHVzZXIgKTsgdGhpcy5lbWl0KCAnbmF2aWdhdGUnLCBgL2FkbWluL3VzZXJgICk7IH0gKVxuICAgICAgICAgICAgICAgICAgICAub24oICdjYW5jZWxsZWQnLCAoKSA9PiB0aGlzLmVtaXQoICduYXZpZ2F0ZScsIGAvYWRtaW4vdXNlcmAgKSApXG4gICAgfSxcblxuICAgIG9uQWRkQnRuQ2xpY2soKSB7IHRoaXMuZW1pdCggJ25hdmlnYXRlJywgYC9hZG1pbi91c2VyL2FkZGAgKSB9LFxuXG4gICAgb25OYXZpZ2F0aW9uKCBwYXRoICkge1xuICAgICAgICB0aGlzLnBhdGggPSBwYXRoO1xuXG4gICAgICAgICggcGF0aC5sZW5ndGggPT09IDIgJiYgdGhpcy5lbHMuY29udGFpbmVyLmNsYXNzTGlzdC5jb250YWlucygnaGlkZScpICkgXG4gICAgICAgICAgICA/IHRoaXMudmlld3MuVXNlck1hbmFnZSAmJiAhdGhpcy52aWV3cy5Vc2VyTWFuYWdlLmVscy5jb250YWluZXIuY2xhc3NMaXN0LmNvbnRhaW5zKCdoaWRlJylcbiAgICAgICAgICAgICAgICA/IHRoaXMudmlld3MuVXNlck1hbmFnZS5oaWRlKCkudGhlbiggKCkgPT4gdGhpcy5zaG93KCkgKVxuICAgICAgICAgICAgICAgIDogdGhpcy5zaG93KClcbiAgICAgICAgICAgIDogcGF0aC5sZW5ndGggPT09IDNcbiAgICAgICAgICAgICAgICA/IHRoaXMuaGlkZSgpLnRoZW4oICgpID0+IHRoaXMubWFuYWdlVXNlciggcGF0aFsyXSwgeyB9ICkgKVxuICAgICAgICAgICAgICAgIDogcGF0aC5sZW5ndGggPT09IDRcbiAgICAgICAgICAgICAgICAgICAgID8gdGhpcy5oaWRlKCkudGhlbiggKCkgPT4gdGhpcy5tYW5hZ2VVc2VyKCBwYXRoWzJdLCB0aGlzLnZpZXdzWyBwYXRoWzNdIF0ubW9kZWwuZGF0YSApIClcbiAgICAgICAgICAgICAgICAgICAgIDogdW5kZWZpbmVkXG4gICAgfSxcblxuICAgIHBvc3RSZW5kZXIoKSB7XG5cbiAgICAgICAgaWYoIHRoaXMucGF0aC5sZW5ndGggPiAyICkge1xuICAgICAgICAgICAgdGhpcy5lbHMuY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoICdoaWRkZW4nLCAnaGlkZScgKVxuICAgICAgICAgICAgaWYoIHRoaXMucGF0aFsyXSA9PT0gXCJhZGRcIiApIHsgdGhpcy5tYW5hZ2VVc2VyKCBcImFkZFwiLCB7IH0gKSB9XG4gICAgICAgICAgICBlbHNlIGlmKCB0aGlzLnBhdGhbMl0gPT09IFwiZWRpdFwiICYmIHRoaXMucGF0aFszXSApIHtcbiAgICAgICAgICAgICAgICB0aGlzLlhociggeyBtZXRob2Q6IFwiZ2V0XCIsIHJlc291cmNlOiBgdXNlci8ke3RoaXMucGF0aFszXX1gIH0gKVxuICAgICAgICAgICAgICAgIC50aGVuKCByZXNwb25zZSA9PiB0aGlzLm1hbmFnZVVzZXIoIFwiZWRpdFwiLCByZXNwb25zZSApIClcbiAgICAgICAgICAgICAgICAuY2F0Y2goIGUgPT4geyB0aGlzLkVycm9yKGUpOyB0aGlzLmVtaXQoICduYXZpZ2F0ZScsIGAvYWRtaW4vdXNlcmAgKSB9IClcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmKCB0aGlzLnBhdGgubGVuZ3RoID09PSAxICYmIHRoaXMudmlld3MuVXNlck1hbmFnZSApIHtcbiAgICAgICAgICAgIHRoaXMudmlld3MuVXNlck1hbmFnZS5oaWRlKClcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMudXNlcnMgPSBPYmplY3QuY3JlYXRlKCB0aGlzLk1vZGVsLCB7IHJlc291cmNlOiB7IHZhbHVlOiAndXNlcicgfSB9IClcblxuICAgICAgICB0aGlzLnVzZXJzLmdldCgpXG4gICAgICAgIC50aGVuKCAoKSA9PiBQcm9taXNlLnJlc29sdmUoIHRoaXMudXNlcnMuZGF0YS5mb3JFYWNoKCB1c2VyID0+IHRoaXMuY3JlYXRlVXNlclZpZXcoIHVzZXIgKSApICkgKVxuICAgICAgICAuY2F0Y2goIHRoaXMuRXJyb3IgKVxuXG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgfSxcblxuICAgIHJlcXVpcmVzTG9naW46IHRydWVcbn0gKVxuIiwibW9kdWxlLmV4cG9ydHMgPSBPYmplY3QuYXNzaWduKCB7IH0sIHJlcXVpcmUoJy4uLy4uLy4uL2xpYi9NeU9iamVjdCcpLCByZXF1aXJlKCdldmVudHMnKS5FdmVudEVtaXR0ZXIucHJvdG90eXBlLCB7XG5cbiAgICBNb2RlbDogcmVxdWlyZSgnLi4vbW9kZWxzL19fcHJvdG9fXy5qcycpLFxuXG4gICAgT3B0aW1pemVkUmVzaXplOiByZXF1aXJlKCcuL2xpYi9PcHRpbWl6ZWRSZXNpemUnKSxcbiAgICBcbiAgICBTcGlubmVyOiByZXF1aXJlKCcuL2xpYi9TcGluJyksXG4gICAgXG4gICAgWGhyOiByZXF1aXJlKCcuLi9YaHInKSxcblxuICAgIGJpbmRFdmVudCgga2V5LCBldmVudCApIHtcbiAgICAgICAgdmFyIGVscyA9IEFycmF5LmlzQXJyYXkoIHRoaXMuZWxzWyBrZXkgXSApID8gdGhpcy5lbHNbIGtleSBdIDogWyB0aGlzLmVsc1sga2V5IF0gXVxuICAgICAgICBlbHMuZm9yRWFjaCggZWwgPT4gZWwuYWRkRXZlbnRMaXN0ZW5lciggZXZlbnQgfHwgJ2NsaWNrJywgZSA9PiB0aGlzWyBgb24ke3RoaXMuY2FwaXRhbGl6ZUZpcnN0TGV0dGVyKGtleSl9JHt0aGlzLmNhcGl0YWxpemVGaXJzdExldHRlcihldmVudCl9YCBdKCBlICkgKSApXG4gICAgfSxcblxuICAgIGNhcGl0YWxpemVGaXJzdExldHRlcjogc3RyaW5nID0+IHN0cmluZy5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHN0cmluZy5zbGljZSgxKSxcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuXG4gICAgICAgIGlmKCB0aGlzLnNpemUgKSB0aGlzLk9wdGltaXplZFJlc2l6ZS5hZGQoIHRoaXMuc2l6ZSApO1xuXG4gICAgICAgIGlmKCB0aGlzLnJlcXVpcmVzTG9naW4gJiYgKCF0aGlzLnVzZXIuZGF0YSB8fCAhdGhpcy51c2VyLmRhdGEuX2lkICkgKSByZXR1cm4gdGhpcy5oYW5kbGVMb2dpbigpXG5cbiAgICAgICAgaWYoIHRoaXMudXNlci5kYXRhICYmIHRoaXMudXNlci5kYXRhLmlkICYmIHRoaXMucmVxdWlyZXNSb2xlICYmICF0aGlzLmhhc1ByaXZpbGVnZXMoKSApIHJldHVybiB0aGlzLnNob3dOb0FjY2VzcygpXG4gICAgICAgIFxuICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbiggdGhpcywgeyBlbHM6IHsgfSwgc2x1cnA6IHsgYXR0cjogJ2RhdGEtanMnLCB2aWV3OiAnZGF0YS12aWV3JyB9LCB2aWV3czogeyB9IH0gKS5yZW5kZXIoKVxuICAgIH0sXG5cbiAgICBkZWxlZ2F0ZUV2ZW50cygga2V5LCBlbCApIHtcbiAgICAgICAgdmFyIHR5cGUgPSB0eXBlb2YgdGhpcy5ldmVudHNba2V5XVxuXG4gICAgICAgIGlmKCB0eXBlID09PSBcInN0cmluZ1wiICkgeyB0aGlzLmJpbmRFdmVudCgga2V5LCB0aGlzLmV2ZW50c1trZXldICkgfVxuICAgICAgICBlbHNlIGlmKCBBcnJheS5pc0FycmF5KCB0aGlzLmV2ZW50c1trZXldICkgKSB7XG4gICAgICAgICAgICB0aGlzLmV2ZW50c1sga2V5IF0uZm9yRWFjaCggZXZlbnRPYmogPT4gdGhpcy5iaW5kRXZlbnQoIGtleSwgZXZlbnRPYmouZXZlbnQgKSApXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmJpbmRFdmVudCgga2V5LCB0aGlzLmV2ZW50c1trZXldLmV2ZW50IClcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBkZWxldGUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmhpZGUoKVxuICAgICAgICAudGhlbiggKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5lbHMuY29udGFpbmVyLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoIHRoaXMuZWxzLmNvbnRhaW5lciApXG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCB0aGlzLmVtaXQoJ2RlbGV0ZWQnKSApXG4gICAgICAgIH0gKVxuICAgIH0sXG5cbiAgICBldmVudHM6IHt9LFxuXG4gICAgZ2V0RGF0YSgpIHtcbiAgICAgICAgaWYoICF0aGlzLm1vZGVsICkgdGhpcy5tb2RlbCA9IE9iamVjdC5jcmVhdGUoIHRoaXMuTW9kZWwsIHsgcmVzb3VyY2U6IHsgdmFsdWU6IHRoaXMubmFtZSB9IH0gKVxuXG4gICAgICAgIHJldHVybiB0aGlzLm1vZGVsLmdldCgpXG4gICAgfSxcblxuICAgIGdldFRlbXBsYXRlT3B0aW9ucygpIHtcbiAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oXG4gICAgICAgICAgICB7fSxcbiAgICAgICAgICAgICh0aGlzLm1vZGVsKSA/IHRoaXMubW9kZWwuZGF0YSA6IHt9ICxcbiAgICAgICAgICAgIHsgdXNlcjogKHRoaXMudXNlcikgPyB0aGlzLnVzZXIuZGF0YSA6IHt9IH0sXG4gICAgICAgICAgICB7IG9wdHM6ICh0aGlzLnRlbXBsYXRlT3B0cykgPyB0aGlzLnRlbXBsYXRlT3B0cyA6IHt9IH1cbiAgICAgICAgKVxuICAgIH0sXG5cbiAgICBoYW5kbGVMb2dpbigpIHtcbiAgICAgICAgdGhpcy5mYWN0b3J5LmNyZWF0ZSggJ2xvZ2luJywgeyBpbnNlcnRpb246IHsgdmFsdWU6IHsgZWw6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNjb250ZW50JykgfSB9IH0gKVxuICAgICAgICAgICAgLm9uY2UoIFwibG9nZ2VkSW5cIiwgKCkgPT4gdGhpcy5vbkxvZ2luKCkgKVxuXG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgfSxcblxuICAgIGhhc1ByaXZpbGVnZSgpIHtcbiAgICAgICAgKCB0aGlzLnJlcXVpcmVzUm9sZSAmJiAoIHRoaXMudXNlci5nZXQoJ3JvbGVzJykuZmluZCggcm9sZSA9PiByb2xlID09PSB0aGlzLnJlcXVpcmVzUm9sZSApID09PSBcInVuZGVmaW5lZFwiICkgKSA/IGZhbHNlIDogdHJ1ZVxuICAgIH0sXG5cbiAgICBoaWRlKCkge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoIHJlc29sdmUgPT4ge1xuICAgICAgICAgICAgaWYoICFkb2N1bWVudC5ib2R5LmNvbnRhaW5zKHRoaXMuZWxzLmNvbnRhaW5lcikgfHwgdGhpcy5pc0hpZGRlbigpICkgcmV0dXJuIHJlc29sdmUoKVxuICAgICAgICAgICAgdGhpcy5vbkhpZGRlblByb3h5ID0gZSA9PiB0aGlzLm9uSGlkZGVuKHJlc29sdmUpXG4gICAgICAgICAgICB0aGlzLmVscy5jb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lciggJ3RyYW5zaXRpb25lbmQnLCB0aGlzLm9uSGlkZGVuUHJveHkgKVxuICAgICAgICAgICAgdGhpcy5lbHMuY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ2hpZGUnKVxuICAgICAgICB9IClcbiAgICB9LFxuXG4gICAgaHRtbFRvRnJhZ21lbnQoIHN0ciApIHtcbiAgICAgICAgbGV0IHJhbmdlID0gZG9jdW1lbnQuY3JlYXRlUmFuZ2UoKTtcbiAgICAgICAgLy8gbWFrZSB0aGUgcGFyZW50IG9mIHRoZSBmaXJzdCBkaXYgaW4gdGhlIGRvY3VtZW50IGJlY29tZXMgdGhlIGNvbnRleHQgbm9kZVxuICAgICAgICByYW5nZS5zZWxlY3ROb2RlKGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiZGl2XCIpLml0ZW0oMCkpXG4gICAgICAgIHJldHVybiByYW5nZS5jcmVhdGVDb250ZXh0dWFsRnJhZ21lbnQoIHN0ciApXG4gICAgfSxcbiAgICBcbiAgICBpc0hpZGRlbigpIHsgcmV0dXJuIHRoaXMuZWxzLmNvbnRhaW5lci5jbGFzc0xpc3QuY29udGFpbnMoJ2hpZGRlbicpIH0sXG5cbiAgICBvbkhpZGRlbiggcmVzb2x2ZSApIHtcbiAgICAgICAgdGhpcy5lbHMuY29udGFpbmVyLnJlbW92ZUV2ZW50TGlzdGVuZXIoICd0cmFuc2l0aW9uZW5kJywgdGhpcy5vbkhpZGRlblByb3h5IClcbiAgICAgICAgdGhpcy5lbHMuY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ2hpZGRlbicpXG4gICAgICAgIHJlc29sdmUoIHRoaXMuZW1pdCgnaGlkZGVuJykgKVxuICAgIH0sXG5cbiAgICBvbkxvZ2luKCkge1xuICAgICAgICBPYmplY3QuYXNzaWduKCB0aGlzLCB7IGVsczogeyB9LCBzbHVycDogeyBhdHRyOiAnZGF0YS1qcycsIHZpZXc6ICdkYXRhLXZpZXcnIH0sIHZpZXdzOiB7IH0gfSApLnJlbmRlcigpXG4gICAgfSxcblxuICAgIG9uU2hvd24oIHJlc29sdmUgKSB7XG4gICAgICAgIHRoaXMuZWxzLmNvbnRhaW5lci5yZW1vdmVFdmVudExpc3RlbmVyKCAndHJhbnNpdGlvbmVuZCcsIHRoaXMub25TaG93blByb3h5IClcbiAgICAgICAgaWYoIHRoaXMuc2l6ZSApIHRoaXMuc2l6ZSgpXG4gICAgICAgIHJlc29sdmUoIHRoaXMuZW1pdCgnc2hvd24nKSApXG4gICAgfSxcblxuICAgIHNob3dOb0FjY2VzcygpIHtcbiAgICAgICAgYWxlcnQoXCJObyBwcml2aWxlZ2VzLCBzb25cIilcbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICB9LFxuXG4gICAgcG9zdFJlbmRlcigpIHsgcmV0dXJuIHRoaXMgfSxcblxuICAgIHJlbmRlcigpIHtcbiAgICAgICAgdGhpcy5zbHVycFRlbXBsYXRlKCB7IHRlbXBsYXRlOiB0aGlzLnRlbXBsYXRlKCB0aGlzLmdldFRlbXBsYXRlT3B0aW9ucygpICksIGluc2VydGlvbjogdGhpcy5pbnNlcnRpb24gfSApXG5cbiAgICAgICAgaWYoIHRoaXMuc2l6ZSApIHRoaXMuc2l6ZSgpXG5cbiAgICAgICAgcmV0dXJuIHRoaXMucmVuZGVyU3Vidmlld3MoKVxuICAgICAgICAgICAgICAgICAgIC5wb3N0UmVuZGVyKClcbiAgICB9LFxuXG4gICAgcmVuZGVyU3Vidmlld3MoKSB7XG4gICAgICAgIE9iamVjdC5rZXlzKCB0aGlzLlZpZXdzIHx8IFsgXSApLmZvckVhY2goIGtleSA9PiB7XG4gICAgICAgICAgICBpZiggdGhpcy5WaWV3c1sga2V5IF0uZWwgKSB7XG4gICAgICAgICAgICAgICAgbGV0IG9wdHMgPSB0aGlzLlZpZXdzWyBrZXkgXS5vcHRzXG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgb3B0cyA9ICggb3B0cyApXG4gICAgICAgICAgICAgICAgICAgID8gdHlwZW9mIG9wdHMgPT09IFwib2JqZWN0XCJcbiAgICAgICAgICAgICAgICAgICAgICAgID8gb3B0c1xuICAgICAgICAgICAgICAgICAgICAgICAgOiBvcHRzKClcbiAgICAgICAgICAgICAgICAgICAgOiB7fVxuXG4gICAgICAgICAgICAgICAgdGhpcy52aWV3c1sga2V5IF0gPSB0aGlzLmZhY3RvcnkuY3JlYXRlKCBrZXksIE9iamVjdC5hc3NpZ24oIHsgaW5zZXJ0aW9uOiB7IHZhbHVlOiB7IGVsOiB0aGlzLlZpZXdzWyBrZXkgXS5lbCwgbWV0aG9kOiAnaW5zZXJ0QmVmb3JlJyB9IH0gfSwgb3B0cyApIClcbiAgICAgICAgICAgICAgICB0aGlzLlZpZXdzWyBrZXkgXS5lbC5yZW1vdmUoKVxuICAgICAgICAgICAgICAgIHRoaXMuVmlld3NbIGtleSBdLmVsID0gdW5kZWZpbmVkXG4gICAgICAgICAgICB9XG4gICAgICAgIH0gKVxuXG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgfSxcblxuICAgIHNob3coIGR1cmF0aW9uICkge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoIHJlc29sdmUgPT4ge1xuICAgICAgICAgICAgdGhpcy5vblNob3duUHJveHkgPSBlID0+IHRoaXMub25TaG93bihyZXNvbHZlKVxuICAgICAgICAgICAgdGhpcy5lbHMuY29udGFpbmVyLmFkZEV2ZW50TGlzdGVuZXIoICd0cmFuc2l0aW9uZW5kJywgdGhpcy5vblNob3duUHJveHkgKVxuICAgICAgICAgICAgdGhpcy5lbHMuY29udGFpbmVyLmNsYXNzTGlzdC5yZW1vdmUoICdoaWRlJywgJ2hpZGRlbicgKVxuICAgICAgICB9IClcbiAgICB9LFxuXG4gICAgc2x1cnBFbCggZWwgKSB7XG4gICAgICAgIHZhciBrZXkgPSBlbC5nZXRBdHRyaWJ1dGUoIHRoaXMuc2x1cnAuYXR0ciApIHx8ICdjb250YWluZXInXG5cbiAgICAgICAgaWYoIGtleSA9PT0gJ2NvbnRhaW5lcicgKSBlbC5jbGFzc0xpc3QuYWRkKCB0aGlzLm5hbWUgKVxuXG4gICAgICAgIHRoaXMuZWxzWyBrZXkgXSA9IEFycmF5LmlzQXJyYXkoIHRoaXMuZWxzWyBrZXkgXSApXG4gICAgICAgICAgICA/IHRoaXMuZWxzWyBrZXkgXS5wdXNoKCBlbCApXG4gICAgICAgICAgICA6ICggdGhpcy5lbHNbIGtleSBdICE9PSB1bmRlZmluZWQgKVxuICAgICAgICAgICAgICAgID8gWyB0aGlzLmVsc1sga2V5IF0sIGVsIF1cbiAgICAgICAgICAgICAgICA6IGVsXG5cbiAgICAgICAgZWwucmVtb3ZlQXR0cmlidXRlKHRoaXMuc2x1cnAuYXR0cilcblxuICAgICAgICBpZiggdGhpcy5ldmVudHNbIGtleSBdICkgdGhpcy5kZWxlZ2F0ZUV2ZW50cygga2V5LCBlbCApXG4gICAgfSxcblxuICAgIHNsdXJwVGVtcGxhdGUoIG9wdGlvbnMgKSB7XG4gICAgICAgIHZhciBmcmFnbWVudCA9IHRoaXMuaHRtbFRvRnJhZ21lbnQoIG9wdGlvbnMudGVtcGxhdGUgKSxcbiAgICAgICAgICAgIHNlbGVjdG9yID0gYFske3RoaXMuc2x1cnAuYXR0cn1dYCxcbiAgICAgICAgICAgIHZpZXdTZWxlY3RvciA9IGBbJHt0aGlzLnNsdXJwLnZpZXd9XWBcblxuICAgICAgICB0aGlzLnNsdXJwRWwoIGZyYWdtZW50LnF1ZXJ5U2VsZWN0b3IoJyonKSApXG4gICAgICAgIGZyYWdtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoIGAke3NlbGVjdG9yfSwgJHt2aWV3U2VsZWN0b3J9YCApLmZvckVhY2goIGVsID0+XG4gICAgICAgICAgICAoIGVsLmhhc0F0dHJpYnV0ZSggdGhpcy5zbHVycC5hdHRyICkgKSBcbiAgICAgICAgICAgICAgICA/IHRoaXMuc2x1cnBFbCggZWwgKVxuICAgICAgICAgICAgICAgIDogdGhpcy5WaWV3c1sgZWwuZ2V0QXR0cmlidXRlKHRoaXMuc2x1cnAudmlldykgXS5lbCA9IGVsXG4gICAgICAgIClcbiAgICAgICAgICBcbiAgICAgICAgb3B0aW9ucy5pbnNlcnRpb24ubWV0aG9kID09PSAnaW5zZXJ0QmVmb3JlJ1xuICAgICAgICAgICAgPyBvcHRpb25zLmluc2VydGlvbi5lbC5wYXJlbnROb2RlLmluc2VydEJlZm9yZSggZnJhZ21lbnQsIG9wdGlvbnMuaW5zZXJ0aW9uLmVsIClcbiAgICAgICAgICAgIDogb3B0aW9ucy5pbnNlcnRpb24uZWxbIG9wdGlvbnMuaW5zZXJ0aW9uLm1ldGhvZCB8fCAnYXBwZW5kQ2hpbGQnIF0oIGZyYWdtZW50IClcblxuICAgICAgICByZXR1cm4gdGhpc1xuICAgIH0sXG5cbiAgICBpc01vdXNlT25FbCggZXZlbnQsIGVsICkge1xuXG4gICAgICAgIHZhciBlbE9mZnNldCA9IGVsLm9mZnNldCgpLFxuICAgICAgICAgICAgZWxIZWlnaHQgPSBlbC5vdXRlckhlaWdodCggdHJ1ZSApLFxuICAgICAgICAgICAgZWxXaWR0aCA9IGVsLm91dGVyV2lkdGgoIHRydWUgKVxuXG4gICAgICAgIGlmKCAoIGV2ZW50LnBhZ2VYIDwgZWxPZmZzZXQubGVmdCApIHx8XG4gICAgICAgICAgICAoIGV2ZW50LnBhZ2VYID4gKCBlbE9mZnNldC5sZWZ0ICsgZWxXaWR0aCApICkgfHxcbiAgICAgICAgICAgICggZXZlbnQucGFnZVkgPCBlbE9mZnNldC50b3AgKSB8fFxuICAgICAgICAgICAgKCBldmVudC5wYWdlWSA+ICggZWxPZmZzZXQudG9wICsgZWxIZWlnaHQgKSApICkge1xuXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdHJ1ZVxuICAgIH0sXG5cbiAgICByZXF1aXJlc0xvZ2luOiBmYWxzZSxcblxuICAgIC8vX190b0RvOiBodG1sLnJlcGxhY2UoLz5cXHMrPC9nLCc+PCcpXG59IClcbiIsIm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmNyZWF0ZSgge1xuXG4gICAgYWRkKGNhbGxiYWNrKSB7XG4gICAgICAgIGlmKCAhdGhpcy5jYWxsYmFja3MubGVuZ3RoICkgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHRoaXMub25SZXNpemUpXG4gICAgICAgIHRoaXMuY2FsbGJhY2tzLnB1c2goY2FsbGJhY2spXG4gICAgfSxcblxuICAgIG9uUmVzaXplKCkge1xuICAgICAgIGlmKCB0aGlzLnJ1bm5pbmcgKSByZXR1cm5cblxuICAgICAgICB0aGlzLnJ1bm5pbmcgPSB0cnVlXG4gICAgICAgIFxuICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lXG4gICAgICAgICAgICA/IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoIHRoaXMucnVuQ2FsbGJhY2tzIClcbiAgICAgICAgICAgIDogc2V0VGltZW91dCggdGhpcy5ydW5DYWxsYmFja3MsIDY2KVxuICAgIH0sXG5cbiAgICBydW5DYWxsYmFja3MoKSB7XG4gICAgICAgIHRoaXMuY2FsbGJhY2tzID0gdGhpcy5jYWxsYmFja3MuZmlsdGVyKCBjYWxsYmFjayA9PiBjYWxsYmFjaygpIClcbiAgICAgICAgdGhpcy5ydW5uaW5nID0gZmFsc2UgXG4gICAgfVxuXG59LCB7IGNhbGxiYWNrczogeyB2YWx1ZTogW10gfSwgcnVubmluZzogeyB2YWx1ZTogZmFsc2UgfSB9ICkuYWRkXG4iLCIvLyBodHRwOi8vc3Bpbi5qcy5vcmcvI3YyLjMuMlxuIWZ1bmN0aW9uKGEsYil7XCJvYmplY3RcIj09dHlwZW9mIG1vZHVsZSYmbW9kdWxlLmV4cG9ydHM/bW9kdWxlLmV4cG9ydHM9YigpOlwiZnVuY3Rpb25cIj09dHlwZW9mIGRlZmluZSYmZGVmaW5lLmFtZD9kZWZpbmUoYik6YS5TcGlubmVyPWIoKX0odGhpcyxmdW5jdGlvbigpe1widXNlIHN0cmljdFwiO2Z1bmN0aW9uIGEoYSxiKXt2YXIgYyxkPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoYXx8XCJkaXZcIik7Zm9yKGMgaW4gYilkW2NdPWJbY107cmV0dXJuIGR9ZnVuY3Rpb24gYihhKXtmb3IodmFyIGI9MSxjPWFyZ3VtZW50cy5sZW5ndGg7Yz5iO2IrKylhLmFwcGVuZENoaWxkKGFyZ3VtZW50c1tiXSk7cmV0dXJuIGF9ZnVuY3Rpb24gYyhhLGIsYyxkKXt2YXIgZT1bXCJvcGFjaXR5XCIsYix+figxMDAqYSksYyxkXS5qb2luKFwiLVwiKSxmPS4wMStjL2QqMTAwLGc9TWF0aC5tYXgoMS0oMS1hKS9iKigxMDAtZiksYSksaD1qLnN1YnN0cmluZygwLGouaW5kZXhPZihcIkFuaW1hdGlvblwiKSkudG9Mb3dlckNhc2UoKSxpPWgmJlwiLVwiK2grXCItXCJ8fFwiXCI7cmV0dXJuIG1bZV18fChrLmluc2VydFJ1bGUoXCJAXCIraStcImtleWZyYW1lcyBcIitlK1wiezAle29wYWNpdHk6XCIrZytcIn1cIitmK1wiJXtvcGFjaXR5OlwiK2ErXCJ9XCIrKGYrLjAxKStcIiV7b3BhY2l0eToxfVwiKyhmK2IpJTEwMCtcIiV7b3BhY2l0eTpcIithK1wifTEwMCV7b3BhY2l0eTpcIitnK1wifX1cIixrLmNzc1J1bGVzLmxlbmd0aCksbVtlXT0xKSxlfWZ1bmN0aW9uIGQoYSxiKXt2YXIgYyxkLGU9YS5zdHlsZTtpZihiPWIuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkrYi5zbGljZSgxKSx2b2lkIDAhPT1lW2JdKXJldHVybiBiO2ZvcihkPTA7ZDxsLmxlbmd0aDtkKyspaWYoYz1sW2RdK2Isdm9pZCAwIT09ZVtjXSlyZXR1cm4gY31mdW5jdGlvbiBlKGEsYil7Zm9yKHZhciBjIGluIGIpYS5zdHlsZVtkKGEsYyl8fGNdPWJbY107cmV0dXJuIGF9ZnVuY3Rpb24gZihhKXtmb3IodmFyIGI9MTtiPGFyZ3VtZW50cy5sZW5ndGg7YisrKXt2YXIgYz1hcmd1bWVudHNbYl07Zm9yKHZhciBkIGluIGMpdm9pZCAwPT09YVtkXSYmKGFbZF09Y1tkXSl9cmV0dXJuIGF9ZnVuY3Rpb24gZyhhLGIpe3JldHVyblwic3RyaW5nXCI9PXR5cGVvZiBhP2E6YVtiJWEubGVuZ3RoXX1mdW5jdGlvbiBoKGEpe3RoaXMub3B0cz1mKGF8fHt9LGguZGVmYXVsdHMsbil9ZnVuY3Rpb24gaSgpe2Z1bmN0aW9uIGMoYixjKXtyZXR1cm4gYShcIjxcIitiKycgeG1sbnM9XCJ1cm46c2NoZW1hcy1taWNyb3NvZnQuY29tOnZtbFwiIGNsYXNzPVwic3Bpbi12bWxcIj4nLGMpfWsuYWRkUnVsZShcIi5zcGluLXZtbFwiLFwiYmVoYXZpb3I6dXJsKCNkZWZhdWx0I1ZNTClcIiksaC5wcm90b3R5cGUubGluZXM9ZnVuY3Rpb24oYSxkKXtmdW5jdGlvbiBmKCl7cmV0dXJuIGUoYyhcImdyb3VwXCIse2Nvb3Jkc2l6ZTprK1wiIFwiK2ssY29vcmRvcmlnaW46LWorXCIgXCIrLWp9KSx7d2lkdGg6ayxoZWlnaHQ6a30pfWZ1bmN0aW9uIGgoYSxoLGkpe2IobSxiKGUoZigpLHtyb3RhdGlvbjozNjAvZC5saW5lcyphK1wiZGVnXCIsbGVmdDp+fmh9KSxiKGUoYyhcInJvdW5kcmVjdFwiLHthcmNzaXplOmQuY29ybmVyc30pLHt3aWR0aDpqLGhlaWdodDpkLnNjYWxlKmQud2lkdGgsbGVmdDpkLnNjYWxlKmQucmFkaXVzLHRvcDotZC5zY2FsZSpkLndpZHRoPj4xLGZpbHRlcjppfSksYyhcImZpbGxcIix7Y29sb3I6ZyhkLmNvbG9yLGEpLG9wYWNpdHk6ZC5vcGFjaXR5fSksYyhcInN0cm9rZVwiLHtvcGFjaXR5OjB9KSkpKX12YXIgaSxqPWQuc2NhbGUqKGQubGVuZ3RoK2Qud2lkdGgpLGs9MipkLnNjYWxlKmosbD0tKGQud2lkdGgrZC5sZW5ndGgpKmQuc2NhbGUqMitcInB4XCIsbT1lKGYoKSx7cG9zaXRpb246XCJhYnNvbHV0ZVwiLHRvcDpsLGxlZnQ6bH0pO2lmKGQuc2hhZG93KWZvcihpPTE7aTw9ZC5saW5lcztpKyspaChpLC0yLFwicHJvZ2lkOkRYSW1hZ2VUcmFuc2Zvcm0uTWljcm9zb2Z0LkJsdXIocGl4ZWxyYWRpdXM9MixtYWtlc2hhZG93PTEsc2hhZG93b3BhY2l0eT0uMylcIik7Zm9yKGk9MTtpPD1kLmxpbmVzO2krKyloKGkpO3JldHVybiBiKGEsbSl9LGgucHJvdG90eXBlLm9wYWNpdHk9ZnVuY3Rpb24oYSxiLGMsZCl7dmFyIGU9YS5maXJzdENoaWxkO2Q9ZC5zaGFkb3cmJmQubGluZXN8fDAsZSYmYitkPGUuY2hpbGROb2Rlcy5sZW5ndGgmJihlPWUuY2hpbGROb2Rlc1tiK2RdLGU9ZSYmZS5maXJzdENoaWxkLGU9ZSYmZS5maXJzdENoaWxkLGUmJihlLm9wYWNpdHk9YykpfX12YXIgaixrLGw9W1wid2Via2l0XCIsXCJNb3pcIixcIm1zXCIsXCJPXCJdLG09e30sbj17bGluZXM6MTIsbGVuZ3RoOjcsd2lkdGg6NSxyYWRpdXM6MTAsc2NhbGU6MSxjb3JuZXJzOjEsY29sb3I6XCIjMDAwXCIsb3BhY2l0eTouMjUscm90YXRlOjAsZGlyZWN0aW9uOjEsc3BlZWQ6MSx0cmFpbDoxMDAsZnBzOjIwLHpJbmRleDoyZTksY2xhc3NOYW1lOlwic3Bpbm5lclwiLHRvcDpcIjUwJVwiLGxlZnQ6XCI1MCVcIixzaGFkb3c6ITEsaHdhY2NlbDohMSxwb3NpdGlvbjpcImFic29sdXRlXCJ9O2lmKGguZGVmYXVsdHM9e30sZihoLnByb3RvdHlwZSx7c3BpbjpmdW5jdGlvbihiKXt0aGlzLnN0b3AoKTt2YXIgYz10aGlzLGQ9Yy5vcHRzLGY9Yy5lbD1hKG51bGwse2NsYXNzTmFtZTpkLmNsYXNzTmFtZX0pO2lmKGUoZix7cG9zaXRpb246ZC5wb3NpdGlvbix3aWR0aDowLHpJbmRleDpkLnpJbmRleCxsZWZ0OmQubGVmdCx0b3A6ZC50b3B9KSxiJiZiLmluc2VydEJlZm9yZShmLGIuZmlyc3RDaGlsZHx8bnVsbCksZi5zZXRBdHRyaWJ1dGUoXCJyb2xlXCIsXCJwcm9ncmVzc2JhclwiKSxjLmxpbmVzKGYsYy5vcHRzKSwhail7dmFyIGcsaD0wLGk9KGQubGluZXMtMSkqKDEtZC5kaXJlY3Rpb24pLzIsaz1kLmZwcyxsPWsvZC5zcGVlZCxtPSgxLWQub3BhY2l0eSkvKGwqZC50cmFpbC8xMDApLG49bC9kLmxpbmVzOyFmdW5jdGlvbiBvKCl7aCsrO2Zvcih2YXIgYT0wO2E8ZC5saW5lczthKyspZz1NYXRoLm1heCgxLShoKyhkLmxpbmVzLWEpKm4pJWwqbSxkLm9wYWNpdHkpLGMub3BhY2l0eShmLGEqZC5kaXJlY3Rpb24raSxnLGQpO2MudGltZW91dD1jLmVsJiZzZXRUaW1lb3V0KG8sfn4oMWUzL2spKX0oKX1yZXR1cm4gY30sc3RvcDpmdW5jdGlvbigpe3ZhciBhPXRoaXMuZWw7cmV0dXJuIGEmJihjbGVhclRpbWVvdXQodGhpcy50aW1lb3V0KSxhLnBhcmVudE5vZGUmJmEucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChhKSx0aGlzLmVsPXZvaWQgMCksdGhpc30sbGluZXM6ZnVuY3Rpb24oZCxmKXtmdW5jdGlvbiBoKGIsYyl7cmV0dXJuIGUoYSgpLHtwb3NpdGlvbjpcImFic29sdXRlXCIsd2lkdGg6Zi5zY2FsZSooZi5sZW5ndGgrZi53aWR0aCkrXCJweFwiLGhlaWdodDpmLnNjYWxlKmYud2lkdGgrXCJweFwiLGJhY2tncm91bmQ6Yixib3hTaGFkb3c6Yyx0cmFuc2Zvcm1PcmlnaW46XCJsZWZ0XCIsdHJhbnNmb3JtOlwicm90YXRlKFwiK35+KDM2MC9mLmxpbmVzKmsrZi5yb3RhdGUpK1wiZGVnKSB0cmFuc2xhdGUoXCIrZi5zY2FsZSpmLnJhZGl1cytcInB4LDApXCIsYm9yZGVyUmFkaXVzOihmLmNvcm5lcnMqZi5zY2FsZSpmLndpZHRoPj4xKStcInB4XCJ9KX1mb3IodmFyIGksaz0wLGw9KGYubGluZXMtMSkqKDEtZi5kaXJlY3Rpb24pLzI7azxmLmxpbmVzO2srKylpPWUoYSgpLHtwb3NpdGlvbjpcImFic29sdXRlXCIsdG9wOjErfihmLnNjYWxlKmYud2lkdGgvMikrXCJweFwiLHRyYW5zZm9ybTpmLmh3YWNjZWw/XCJ0cmFuc2xhdGUzZCgwLDAsMClcIjpcIlwiLG9wYWNpdHk6Zi5vcGFjaXR5LGFuaW1hdGlvbjpqJiZjKGYub3BhY2l0eSxmLnRyYWlsLGwraypmLmRpcmVjdGlvbixmLmxpbmVzKStcIiBcIisxL2Yuc3BlZWQrXCJzIGxpbmVhciBpbmZpbml0ZVwifSksZi5zaGFkb3cmJmIoaSxlKGgoXCIjMDAwXCIsXCIwIDAgNHB4ICMwMDBcIikse3RvcDpcIjJweFwifSkpLGIoZCxiKGksaChnKGYuY29sb3IsayksXCIwIDAgMXB4IHJnYmEoMCwwLDAsLjEpXCIpKSk7cmV0dXJuIGR9LG9wYWNpdHk6ZnVuY3Rpb24oYSxiLGMpe2I8YS5jaGlsZE5vZGVzLmxlbmd0aCYmKGEuY2hpbGROb2Rlc1tiXS5zdHlsZS5vcGFjaXR5PWMpfX0pLFwidW5kZWZpbmVkXCIhPXR5cGVvZiBkb2N1bWVudCl7az1mdW5jdGlvbigpe3ZhciBjPWEoXCJzdHlsZVwiLHt0eXBlOlwidGV4dC9jc3NcIn0pO3JldHVybiBiKGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiaGVhZFwiKVswXSxjKSxjLnNoZWV0fHxjLnN0eWxlU2hlZXR9KCk7dmFyIG89ZShhKFwiZ3JvdXBcIikse2JlaGF2aW9yOlwidXJsKCNkZWZhdWx0I1ZNTClcIn0pOyFkKG8sXCJ0cmFuc2Zvcm1cIikmJm8uYWRqP2koKTpqPWQobyxcImFuaW1hdGlvblwiKX1yZXR1cm4gaH0pOyIsIm1vZHVsZS5leHBvcnRzID0gcCA9PiBcbmA8ZGl2PlxuPGRpdj5BZG1pbjwvZGl2PlxuPGRpdiBkYXRhLWpzPVwibGlzdFwiPjwvZGl2PlxuPC9kaXY+YFxuIiwibW9kdWxlLmV4cG9ydHMgPSBwID0+IGA8ZGl2PiR7cC5jb2xsZWN0aW9ufTwvZGl2PmBcbiIsIm1vZHVsZS5leHBvcnRzID0gcCA9PiBcbmA8ZGl2PlxuICAgIDxkaXYgY2xhc3M9XCJoZWFkZXJcIiBkYXRhLWpzPVwiaGVhZGVyXCI+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJ0aXRsZVwiIGRhdGEtanM9XCJ0aXRsZVwiID4ke3AudGl0bGUgfHwgJyd9PC9kaXY+XG4gICAgICAgICR7cC5faWQgJiYgcC51c2VyLl9pZCAmJiAhcC5vcHRzLnJlYWRPbmx5ID8gJzxidXR0b24gY2xhc3M9XCJkZWxldGVcIiBkYXRhLWpzPVwiZGVsZXRlXCI+PC9idXR0b24+JyA6ICcnfVxuICAgICAgICAke3AuX2lkICYmIHAudXNlci5faWQgJiYgIXAub3B0cy5yZWFkT25seSA/ICc8YnV0dG9uIGNsYXNzPVwiZWRpdFwiIGRhdGEtanM9XCJlZGl0XCI+PC9idXR0b24+JyA6ICcnfVxuICAgIDwvZGl2PlxuICAgICR7cC5faWQgJiYgcC51c2VyLl9pZCAmJiAhcC5vcHRzLnJlYWRPbmx5XG4gICAgICAgID8gYDxkaXYgY2xhc3M9XCJjb25maXJtIGhpZGRlblwiIGRhdGEtanM9XCJjb25maXJtRGlhbG9nXCI+XG4gICAgICAgICAgICAgICA8c3Bhbj5BcmUgeW91IHN1cmU/PC9zcGFuPlxuICAgICAgICAgICAgICAgPGJ1dHRvbiBkYXRhLWpzPVwiY29uZmlybVwiIHR5cGU9XCJidXR0b25cIj5EZWxldGU8L2J1dHRvbj4gXG4gICAgICAgICAgICAgICA8YnV0dG9uIGRhdGEtanM9XCJjYW5jZWxcIiB0eXBlPVwiYnV0dG9uXCI+Q2FuY2VsPC9idXR0b24+IFxuICAgICAgICAgICA8L2Rpdj5gXG4gICAgICAgIDogYGB9XG4gICAgPGltZyBkYXRhLWpzPVwiaW1hZ2VcIiBzcmM9XCIke3AuaW1hZ2UgPyBwLmltYWdlIDogJyd9XCIvPlxuICAgIDxkaXYgY2xhc3M9XCJjbGVhcmZpeFwiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwic2hhcmVcIj5cbiAgICAgICAgICAgICR7cmVxdWlyZSgnLi9saWIvZmFjZWJvb2snKX1cbiAgICAgICAgICAgICR7cmVxdWlyZSgnLi9saWIvdHdpdHRlcicpfVxuICAgICAgICAgICAgJHtyZXF1aXJlKCcuL2xpYi9nb29nbGUnKX1cbiAgICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG48L2Rpdj5gXG4iLCJtb2R1bGUuZXhwb3J0cyA9IHAgPT5cbmA8ZGl2PlxuICAgIDxkaXYgZGF0YS1qcz1cImhlYWRlclwiPjwvZGl2PlxuICAgIDxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwXCI+XG4gICAgICAgPGxhYmVsIGNsYXNzPVwiZm9ybS1sYWJlbFwiPnRpdGxlPC9sYWJlbD5cbiAgICAgICA8aW5wdXQgZGF0YS1qcz1cInRpdGxlXCIgdHlwZT1cInRleHRcIj48L2lucHV0PlxuICAgIDwvZGl2PlxuICAgIDxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwXCI+XG4gICAgICAgPGxhYmVsIGNsYXNzPVwiZm9ybS1sYWJlbFwiPmltYWdlPC9sYWJlbD5cbiAgICAgICAgPGRpdj5cbiAgICAgICAgICAgIDxkaXYgZGF0YS1qcz1cInVwbG9hZFwiIGNsYXNzPVwidXBsb2FkXCI+XG4gICAgICAgICAgICAgICAgPHNwYW4+VXBsb2FkIEZpbGU8L3NwYW4+XG4gICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJmaWxlXCIgZGF0YS1qcz1cImltYWdlXCIgLz5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGltZyBjbGFzcz1cInByZXZpZXdcIiBkYXRhLWpzPVwicHJldmlld1wiIC8+XG4gICAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICAgIDxkaXYgY2xhc3M9XCJidXR0b24tcm93XCI+XG4gICAgICAgIDxidXR0b24gZGF0YS1qcz1cInN1Ym1pdFwiIHR5cGU9XCJidXR0b25cIj5TdWJtaXQ8L2J1dHRvbj5cbiAgICAgICAgPGJ1dHRvbiBkYXRhLWpzPVwiY2FuY2VsXCIgdHlwZT1cImJ1dHRvblwiPkNhbmNlbDwvYnV0dG9uPlxuICAgIDwvZGl2PlxuPC9kaXY+YFxuIiwibW9kdWxlLmV4cG9ydHMgPSBwID0+IFxuYDxkaXY+XG4gICAgPGRpdj5cbiAgICAgICAgPGRpdj5Db21pY3M8L2Rpdj5cbiAgICAgICAgPGJ1dHRvbiBkYXRhLWpzPVwiYWRkQnRuXCIgY2xhc3M9XCJhZGRcIj48L2J1dHRvbj5cbiAgICA8L2Rpdj5cbiAgICA8ZGl2IGRhdGEtanM9XCJsaXN0XCI+PC9kaXY+XG48L2Rpdj5gXG4iLCJtb2R1bGUuZXhwb3J0cyA9IHAgPT4gYDxoZWFkZXI+XG4gICAgPHVsPlxuICAgICAgICA8bGk+QWJvdXQ8L2xpPlxuICAgICAgICA8bGk+U3RvcmU8L2xpPlxuICAgIDwvdWw+XG4gICAgPHNwYW4+VGlueSBIYW5kZWQ8L3NwYW4+XG4gICAgPGltZyBkYXRhLWpzPVwibG9nb1wiIHNyYz1cIi9zdGF0aWMvaW1nL3RpbnlIYW5kZWQuanBnXCIgLz5cbjwvaGVhZGVyPmBcbiIsIm1vZHVsZS5leHBvcnRzID0gKCBwICkgPT4gYDxkaXY+PC9kaXY+YFxuIiwibW9kdWxlLmV4cG9ydHMgPSAoIHAgKSA9PlxuYDxkaXY+XG4gICAgPGgxPkxvZ2luPC9oMT5cbiAgICA8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cFwiPlxuICAgICAgIDxsYWJlbCBjbGFzcz1cImZvcm0tbGFiZWxcIiBmb3I9XCJ1c2VybmFtZVwiPnVzZXJuYW1lPC9sYWJlbD5cbiAgICAgICA8aW5wdXQgZGF0YS1qcz1cInVzZXJuYW1lXCIgY2xhc3M9XCJ1c2VybmFtZVwiIHR5cGU9XCJ0ZXh0XCI+PC9pbnB1dD5cbiAgICA8L2Rpdj5cbiAgICA8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cFwiPlxuICAgICAgIDxsYWJlbCBjbGFzcz1cImZvcm0tbGFiZWxcIiBmb3I9XCJwYXNzd29yZFwiPnBhc3N3b3JkPC9sYWJlbD5cbiAgICAgICA8aW5wdXQgZGF0YS1qcz1cInBhc3N3b3JkXCIgY2xhc3M9XCJwYXNzd29yZFwiIHR5cGU9XCJwYXNzd29yZFwiPjwvaW5wdXQ+XG4gICAgPC9kaXY+XG4gICAgPGRpdiBjbGFzcz1cImJ1dHRvbi1yb3dcIj5cbiAgICAgICAgPGJ1dHRvbiBkYXRhLWpzPVwic3VibWl0XCIgY2xhc3M9XCJidG4tZ2hvc3RcIiB0eXBlPVwiYnV0dG9uXCI+TG9nIEluPC9idXR0b24+XG4gICAgPC9kaXY+XG48L2Rpdj5gXG4iLCJtb2R1bGUuZXhwb3J0cyA9IHAgPT5cbmA8ZGl2PlxuICAgIDxkaXYgZGF0YS1qcz1cInVzZXJuYW1lXCI+JHtwLnVzZXJuYW1lfTwvZGl2PlxuICAgICR7cC51c2VyLl9pZCAmJiAhcC5vcHRzLnJlYWRPbmx5ID8gJzxidXR0b24gY2xhc3M9XCJkZWxldGVcIiBkYXRhLWpzPVwiZGVsZXRlXCI+PC9idXR0b24+JyA6ICcnfVxuICAgICR7cC51c2VyLl9pZCA9PT0gcC5faWQgPyAnPGJ1dHRvbiBjbGFzcz1cImVkaXRcIiBkYXRhLWpzPVwiZWRpdFwiPjwvYnV0dG9uPicgOiAnJ31cbiAgICAke3AudXNlci5faWQgJiYgIXAub3B0cy5yZWFkT25seVxuICAgID8gYDxkaXYgY2xhc3M9XCJjb25maXJtIGhpZGRlblwiIGRhdGEtanM9XCJjb25maXJtRGlhbG9nXCI+XG4gICAgICAgICAgIDxzcGFuPkFyZSB5b3Ugc3VyZT88L3NwYW4+XG4gICAgICAgICAgIDxidXR0b24gZGF0YS1qcz1cImNvbmZpcm1cIiB0eXBlPVwiYnV0dG9uXCI+RGVsZXRlPC9idXR0b24+IFxuICAgICAgICAgICA8YnV0dG9uIGRhdGEtanM9XCJjYW5jZWxcIiB0eXBlPVwiYnV0dG9uXCI+Q2FuY2VsPC9idXR0b24+IFxuICAgICAgIDwvZGl2PmBcbiAgICA6IGBgfVxuPC9kaXY+XG5gXG4iLCJtb2R1bGUuZXhwb3J0cyA9IHAgPT5cbmA8ZGl2PlxuICAgIDxkaXYgZGF0YS1qcz1cInRpdGxlXCI+PC9kaXY+XG4gICAgPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXBcIj5cbiAgICAgICA8bGFiZWwgY2xhc3M9XCJmb3JtLWxhYmVsXCIgZm9yPVwidXNlcm5hbWVcIj51c2VybmFtZTwvbGFiZWw+XG4gICAgICAgPGlucHV0IGRhdGEtanM9XCJ1c2VybmFtZVwiIGNsYXNzPVwidXNlcm5hbWVcIiB0eXBlPVwidGV4dFwiPjwvaW5wdXQ+XG4gICAgPC9kaXY+XG4gICAgPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXBcIj5cbiAgICAgICA8bGFiZWwgY2xhc3M9XCJmb3JtLWxhYmVsXCIgZm9yPVwicGFzc3dvcmRcIj5wYXNzd29yZDwvbGFiZWw+XG4gICAgICAgPGlucHV0IGRhdGEtanM9XCJwYXNzd29yZFwiIGNsYXNzPVwicGFzc3dvcmRcIiB0eXBlPVwicGFzc3dvcmRcIj48L2lucHV0PlxuICAgIDwvZGl2PlxuICAgIDxkaXYgY2xhc3M9XCJidXR0b24tcm93XCI+XG4gICAgICAgIDxidXR0b24gZGF0YS1qcz1cInN1Ym1pdFwiIGNsYXNzPVwiYnRuLWdob3N0XCIgdHlwZT1cImJ1dHRvblwiPlN1Ym1pdDwvYnV0dG9uPlxuICAgICAgICA8YnV0dG9uIGRhdGEtanM9XCJjYW5jZWxcIiBjbGFzcz1cImJ0bi1naG9zdFwiIHR5cGU9XCJidXR0b25cIj5DYW5jZWw8L2J1dHRvbj5cbiAgICA8L2Rpdj5cbjwvZGl2PmBcbiIsIm1vZHVsZS5leHBvcnRzID0gcCA9PiBcbmA8ZGl2PlxuICAgIDxkaXY+XG4gICAgICAgIDxkaXY+VXNlcnM8L2Rpdj5cbiAgICAgICAgPGJ1dHRvbiBkYXRhLWpzPVwiYWRkQnRuXCIgY2xhc3M9XCJhZGRcIj48L2J1dHRvbj5cbiAgICA8L2Rpdj5cbiAgICA8ZGl2IGRhdGEtanM9XCJsaXN0XCI+PC9kaXY+XG48L2Rpdj5gXG4iLCJtb2R1bGUuZXhwb3J0cyA9IGA8c3ZnIGRhdGEtanM9XCJmYWNlYm9va1wiIGVuYWJsZS1iYWNrZ3JvdW5kPVwibmV3IDAgMCA1Ni42OTMgNTYuNjkzXCIgaGVpZ2h0PVwiNTYuNjkzcHhcIiBpZD1cIkxheWVyXzFcIiB2ZXJzaW9uPVwiMS4xXCIgdmlld0JveD1cIjAgMCA1Ni42OTMgNTYuNjkzXCIgd2lkdGg9XCI1Ni42OTNweFwiIHhtbDpzcGFjZT1cInByZXNlcnZlXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHhtbG5zOnhsaW5rPVwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1wiPjxwYXRoIGQ9XCJNMjguMzQ3LDUuMTU3Yy0xMy42LDAtMjQuNjI1LDExLjAyNy0yNC42MjUsMjQuNjI1YzAsMTMuNiwxMS4wMjUsMjQuNjIzLDI0LjYyNSwyNC42MjNjMTMuNiwwLDI0LjYyNS0xMS4wMjMsMjQuNjI1LTI0LjYyMyAgQzUyLjk3MiwxNi4xODQsNDEuOTQ2LDUuMTU3LDI4LjM0Nyw1LjE1N3ogTTM0Ljg2NCwyOS42NzloLTQuMjY0YzAsNi44MTQsMCwxNS4yMDcsMCwxNS4yMDdoLTYuMzJjMCwwLDAtOC4zMDcsMC0xNS4yMDdoLTMuMDA2ICBWMjQuMzFoMy4wMDZ2LTMuNDc5YzAtMi40OSwxLjE4Mi02LjM3Nyw2LjM3OS02LjM3N2w0LjY4LDAuMDE4djUuMjE1YzAsMC0yLjg0NiwwLTMuMzk4LDBjLTAuNTU1LDAtMS4zNCwwLjI3Ny0xLjM0LDEuNDYxdjMuMTYzICBoNC44MThMMzQuODY0LDI5LjY3OXpcIi8+PC9zdmc+YFxuIiwibW9kdWxlLmV4cG9ydHM9YDxzdmcgZGF0YS1qcz1cImdvb2dsZVwiIGVuYWJsZS1iYWNrZ3JvdW5kPVwibmV3IDAgMCA1Ni42OTMgNTYuNjkzXCIgaGVpZ2h0PVwiNTYuNjkzcHhcIiBpZD1cIkxheWVyXzFcIiB2ZXJzaW9uPVwiMS4xXCIgdmlld0JveD1cIjAgMCA1Ni42OTMgNTYuNjkzXCIgd2lkdGg9XCI1Ni42OTNweFwiIHhtbDpzcGFjZT1cInByZXNlcnZlXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHhtbG5zOnhsaW5rPVwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1wiPjxnPjxwYXRoIGQ9XCJNMjMuNzYxLDI3Ljk2YzAuNjI5LDAsMS4xNi0wLjI0OCwxLjU3LTAuNzE3YzAuNjQ1LTAuNzMyLDAuOTI4LTEuOTM2LDAuNzYtMy4yMTVjLTAuMzAxLTIuMjg3LTEuOTMyLTQuMTg2LTMuNjM3LTQuMjM2ICAgaC0wLjA2OGMtMC42MDQsMC0xLjE0MSwwLjI0Ni0xLjU1MSwwLjcxNWMtMC42MzcsMC43MjUtMC45MDMsMS44NzEtMC43MzYsMy4xNDZjMC4yOTksMi4yODMsMS45NjUsNC4yNTYsMy42MzUsNC4zMDdIMjMuNzYxelwiLz48cGF0aCBkPVwiTTI1LjYyMiwzNC44NDdjLTAuMTY4LTAuMTEzLTAuMzQyLTAuMjMyLTAuNTIxLTAuMzU1Yy0wLjUyNS0wLjE2Mi0xLjA4NC0wLjI0Ni0xLjY1NC0wLjI1NGgtMC4wNzIgICBjLTIuNjI1LDAtNC45MjksMS41OTItNC45MjksMy40MDZjMCwxLjk3MSwxLjk3MiwzLjUxOCw0LjQ5MSwzLjUxOGMzLjMyMiwwLDUuMDA2LTEuMTQ1LDUuMDA2LTMuNDA0ICAgYzAtMC4yMTUtMC4wMjUtMC40MzYtMC4wNzYtMC42NTZDMjcuNjQyLDM2LjIyMiwyNi44MzcsMzUuNjc1LDI1LjYyMiwzNC44NDd6XCIvPjxwYXRoIGQ9XCJNMjguMzQ3LDUuMTU3Yy0xMy42MDEsMC0yNC42MjUsMTEuMDIzLTI0LjYyNSwyNC42MjNzMTEuMDI1LDI0LjYyNSwyNC42MjUsMjQuNjI1YzEzLjU5OCwwLDI0LjYyMy0xMS4wMjUsMjQuNjIzLTI0LjYyNSAgIFM0MS45NDQsNS4xNTcsMjguMzQ3LDUuMTU3eiBNMjYuMTA2LDQzLjE3OWMtMC45ODIsMC4yODMtMi4wNDEsMC40MjgtMy4xNTQsMC40MjhjLTEuMjM4LDAtMi40My0wLjE0My0zLjU0LTAuNDI0ICAgYy0yLjE1LTAuNTQxLTMuNzQtMS41Ny00LjQ4LTIuODk1Yy0wLjMyLTAuNTc0LTAuNDgyLTEuMTg0LTAuNDgyLTEuODE2YzAtMC42NTIsMC4xNTYtMS4zMTIsMC40NjMtMS45NjcgICBjMS4xOC0yLjUxLDQuMjgzLTQuMTk3LDcuNzIyLTQuMTk3YzAuMDM1LDAsMC4wNjgsMCwwLjEsMGMtMC4yNzktMC40OTItMC40MTYtMS4wMDItMC40MTYtMS41MzdjMC0wLjI2OCwwLjAzNS0wLjUzOSwwLjEwNS0wLjgxNCAgIGMtMy42MDYtMC4wODQtNi4zMDYtMi43MjUtNi4zMDYtNi4yMDdjMC0yLjQ2MSwxLjk2NS00Ljg1NSw0Ljc3Ni01LjgyNGMwLjg0Mi0wLjI5MSwxLjY5OS0wLjQzOSwyLjU0My0wLjQzOWg3LjcxMyAgIGMwLjI2NCwwLDAuNDk0LDAuMTcsMC41NzYsMC40MmMwLjA4NCwwLjI1Mi0wLjAwOCwwLjUyNS0wLjIyMSwwLjY4bC0xLjcyNSwxLjI0OGMtMC4xMDQsMC4wNzQtMC4yMjksMC4xMTUtMC4zNTcsMC4xMTVoLTAuNjE3ICAgYzAuNzk5LDAuOTU1LDEuMjY2LDIuMzE2LDEuMjY2LDMuODQ4YzAsMS42OTEtMC44NTUsMy4yODktMi40MSw0LjUwNmMtMS4yMDEsMC45MzYtMS4yNSwxLjE5MS0xLjI1LDEuNzI5ICAgYzAuMDE2LDAuMjk1LDAuODU0LDEuMjUyLDEuNzc1LDEuOTA0YzIuMTUyLDEuNTIzLDIuOTUzLDMuMDE0LDIuOTUzLDUuNTA4QzMxLjE0LDQwLjA0LDI5LjE2Myw0Mi4yOTIsMjYuMTA2LDQzLjE3OXogICAgTTQzLjUyOCwyOS45NDhjMCwwLjMzNC0wLjI3MywwLjYwNS0wLjYwNywwLjYwNWgtNC4zODN2NC4zODVjMCwwLjMzNi0wLjI3MSwwLjYwNy0wLjYwNywwLjYwN2gtMS4yNDggICBjLTAuMzM2LDAtMC42MDctMC4yNzEtMC42MDctMC42MDd2LTQuMzg1SDMxLjY5Yy0wLjMzMiwwLTAuNjA1LTAuMjcxLTAuNjA1LTAuNjA1di0xLjI1YzAtMC4zMzQsMC4yNzMtMC42MDcsMC42MDUtMC42MDdoNC4zODUgICB2LTQuMzgzYzAtMC4zMzYsMC4yNzEtMC42MDcsMC42MDctMC42MDdoMS4yNDhjMC4zMzYsMCwwLjYwNywwLjI3MSwwLjYwNywwLjYwN3Y0LjM4M2g0LjM4M2MwLjMzNCwwLDAuNjA3LDAuMjczLDAuNjA3LDAuNjA3ICAgVjI5Ljk0OHpcIi8+PC9nPjwvc3ZnPmBcbiIsIm1vZHVsZS5leHBvcnRzPWA8c3ZnIGRhdGEtanM9XCJ0d2l0dGVyXCIgZW5hYmxlLWJhY2tncm91bmQ9XCJuZXcgMCAwIDU2LjY5MyA1Ni42OTNcIiBoZWlnaHQ9XCI1Ni42OTNweFwiIGlkPVwiTGF5ZXJfMVwiIHZlcnNpb249XCIxLjFcIiB2aWV3Qm94PVwiMCAwIDU2LjY5MyA1Ni42OTNcIiB3aWR0aD1cIjU2LjY5M3B4XCIgeG1sOnNwYWNlPVwicHJlc2VydmVcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgeG1sbnM6eGxpbms9XCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rXCI+PHBhdGggZD1cIk0yOC4zNDgsNS4xNTdjLTEzLjYsMC0yNC42MjUsMTEuMDI3LTI0LjYyNSwyNC42MjVjMCwxMy42LDExLjAyNSwyNC42MjMsMjQuNjI1LDI0LjYyM2MxMy42LDAsMjQuNjIzLTExLjAyMywyNC42MjMtMjQuNjIzICBDNTIuOTcxLDE2LjE4NCw0MS45NDcsNS4xNTcsMjguMzQ4LDUuMTU3eiBNNDAuNzUyLDI0LjgxN2MwLjAxMywwLjI2NiwwLjAxOCwwLjUzMywwLjAxOCwwLjgwM2MwLDguMjAxLTYuMjQyLDE3LjY1Ni0xNy42NTYsMTcuNjU2ICBjLTMuNTA0LDAtNi43NjctMS4wMjctOS41MTMtMi43ODdjMC40ODYsMC4wNTcsMC45NzksMC4wODYsMS40OCwwLjA4NmMyLjkwOCwwLDUuNTg0LTAuOTkyLDcuNzA3LTIuNjU2ICBjLTIuNzE1LTAuMDUxLTUuMDA2LTEuODQ2LTUuNzk2LTQuMzExYzAuMzc4LDAuMDc0LDAuNzY3LDAuMTExLDEuMTY3LDAuMTExYzAuNTY2LDAsMS4xMTQtMC4wNzQsMS42MzUtMC4yMTcgIGMtMi44NC0wLjU3LTQuOTc5LTMuMDgtNC45NzktNi4wODRjMC0wLjAyNywwLTAuMDUzLDAuMDAxLTAuMDhjMC44MzYsMC40NjUsMS43OTMsMC43NDQsMi44MTEsMC43NzcgIGMtMS42NjYtMS4xMTUtMi43NjEtMy4wMTItMi43NjEtNS4xNjZjMC0xLjEzNywwLjMwNi0yLjIwNCwwLjg0LTMuMTJjMy4wNjEsMy43NTQsNy42MzQsNi4yMjUsMTIuNzkyLDYuNDgzICBjLTAuMTA2LTAuNDUzLTAuMTYxLTAuOTI4LTAuMTYxLTEuNDE0YzAtMy40MjYsMi43NzgtNi4yMDUsNi4yMDYtNi4yMDVjMS43ODUsMCwzLjM5NywwLjc1NCw0LjUyOSwxLjk1OSAgYzEuNDE0LTAuMjc3LDIuNzQyLTAuNzk1LDMuOTQxLTEuNTA2Yy0wLjQ2NSwxLjQ1LTEuNDQ4LDIuNjY2LTIuNzMsMy40MzNjMS4yNTctMC4xNSwyLjQ1My0wLjQ4NCwzLjU2NS0wLjk3NyAgQzQzLjAxOCwyMi44NDksNDEuOTY1LDIzLjk0Miw0MC43NTIsMjQuODE3elwiLz48L3N2Zz5gXG4iLCJtb2R1bGUuZXhwb3J0cyA9IGVyciA9PiB7IGNvbnNvbGUubG9nKCBlcnIuc3RhY2sgfHwgZXJyICkgfVxuIiwibW9kdWxlLmV4cG9ydHMgPSB7XG5cbiAgICBFcnJvcjogcmVxdWlyZSgnLi9NeUVycm9yJyksXG5cbiAgICBQOiAoIGZ1biwgYXJncz1bIF0sIHRoaXNBcmcgKSA9PlxuICAgICAgICBuZXcgUHJvbWlzZSggKCByZXNvbHZlLCByZWplY3QgKSA9PiBSZWZsZWN0LmFwcGx5KCBmdW4sIHRoaXNBcmcgfHwgdGhpcywgYXJncy5jb25jYXQoICggZSwgLi4uY2FsbGJhY2sgKSA9PiBlID8gcmVqZWN0KGUpIDogcmVzb2x2ZShjYWxsYmFjaykgKSApICksXG4gICAgXG4gICAgY29uc3RydWN0b3IoKSB7IHJldHVybiB0aGlzIH1cbn1cbiIsIi8vIENvcHlyaWdodCBKb3llbnQsIEluYy4gYW5kIG90aGVyIE5vZGUgY29udHJpYnV0b3JzLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhXG4vLyBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlXG4vLyBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmdcbi8vIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCxcbi8vIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXRcbi8vIHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZVxuLy8gZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbi8vIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1Ncbi8vIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0Zcbi8vIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU5cbi8vIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuLy8gREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4vLyBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4vLyBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuXG5mdW5jdGlvbiBFdmVudEVtaXR0ZXIoKSB7XG4gIHRoaXMuX2V2ZW50cyA9IHRoaXMuX2V2ZW50cyB8fCB7fTtcbiAgdGhpcy5fbWF4TGlzdGVuZXJzID0gdGhpcy5fbWF4TGlzdGVuZXJzIHx8IHVuZGVmaW5lZDtcbn1cbm1vZHVsZS5leHBvcnRzID0gRXZlbnRFbWl0dGVyO1xuXG4vLyBCYWNrd2FyZHMtY29tcGF0IHdpdGggbm9kZSAwLjEwLnhcbkV2ZW50RW1pdHRlci5FdmVudEVtaXR0ZXIgPSBFdmVudEVtaXR0ZXI7XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuX2V2ZW50cyA9IHVuZGVmaW5lZDtcbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuX21heExpc3RlbmVycyA9IHVuZGVmaW5lZDtcblxuLy8gQnkgZGVmYXVsdCBFdmVudEVtaXR0ZXJzIHdpbGwgcHJpbnQgYSB3YXJuaW5nIGlmIG1vcmUgdGhhbiAxMCBsaXN0ZW5lcnMgYXJlXG4vLyBhZGRlZCB0byBpdC4gVGhpcyBpcyBhIHVzZWZ1bCBkZWZhdWx0IHdoaWNoIGhlbHBzIGZpbmRpbmcgbWVtb3J5IGxlYWtzLlxuRXZlbnRFbWl0dGVyLmRlZmF1bHRNYXhMaXN0ZW5lcnMgPSAxMDtcblxuLy8gT2J2aW91c2x5IG5vdCBhbGwgRW1pdHRlcnMgc2hvdWxkIGJlIGxpbWl0ZWQgdG8gMTAuIFRoaXMgZnVuY3Rpb24gYWxsb3dzXG4vLyB0aGF0IHRvIGJlIGluY3JlYXNlZC4gU2V0IHRvIHplcm8gZm9yIHVubGltaXRlZC5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuc2V0TWF4TGlzdGVuZXJzID0gZnVuY3Rpb24obikge1xuICBpZiAoIWlzTnVtYmVyKG4pIHx8IG4gPCAwIHx8IGlzTmFOKG4pKVxuICAgIHRocm93IFR5cGVFcnJvcignbiBtdXN0IGJlIGEgcG9zaXRpdmUgbnVtYmVyJyk7XG4gIHRoaXMuX21heExpc3RlbmVycyA9IG47XG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5lbWl0ID0gZnVuY3Rpb24odHlwZSkge1xuICB2YXIgZXIsIGhhbmRsZXIsIGxlbiwgYXJncywgaSwgbGlzdGVuZXJzO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzKVxuICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuXG4gIC8vIElmIHRoZXJlIGlzIG5vICdlcnJvcicgZXZlbnQgbGlzdGVuZXIgdGhlbiB0aHJvdy5cbiAgaWYgKHR5cGUgPT09ICdlcnJvcicpIHtcbiAgICBpZiAoIXRoaXMuX2V2ZW50cy5lcnJvciB8fFxuICAgICAgICAoaXNPYmplY3QodGhpcy5fZXZlbnRzLmVycm9yKSAmJiAhdGhpcy5fZXZlbnRzLmVycm9yLmxlbmd0aCkpIHtcbiAgICAgIGVyID0gYXJndW1lbnRzWzFdO1xuICAgICAgaWYgKGVyIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgICAgdGhyb3cgZXI7IC8vIFVuaGFuZGxlZCAnZXJyb3InIGV2ZW50XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBBdCBsZWFzdCBnaXZlIHNvbWUga2luZCBvZiBjb250ZXh0IHRvIHRoZSB1c2VyXG4gICAgICAgIHZhciBlcnIgPSBuZXcgRXJyb3IoJ1VuY2F1Z2h0LCB1bnNwZWNpZmllZCBcImVycm9yXCIgZXZlbnQuICgnICsgZXIgKyAnKScpO1xuICAgICAgICBlcnIuY29udGV4dCA9IGVyO1xuICAgICAgICB0aHJvdyBlcnI7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgaGFuZGxlciA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcblxuICBpZiAoaXNVbmRlZmluZWQoaGFuZGxlcikpXG4gICAgcmV0dXJuIGZhbHNlO1xuXG4gIGlmIChpc0Z1bmN0aW9uKGhhbmRsZXIpKSB7XG4gICAgc3dpdGNoIChhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgICAvLyBmYXN0IGNhc2VzXG4gICAgICBjYXNlIDE6XG4gICAgICAgIGhhbmRsZXIuY2FsbCh0aGlzKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDI6XG4gICAgICAgIGhhbmRsZXIuY2FsbCh0aGlzLCBhcmd1bWVudHNbMV0pO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMzpcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMsIGFyZ3VtZW50c1sxXSwgYXJndW1lbnRzWzJdKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICAvLyBzbG93ZXJcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuICAgICAgICBoYW5kbGVyLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgIH1cbiAgfSBlbHNlIGlmIChpc09iamVjdChoYW5kbGVyKSkge1xuICAgIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuICAgIGxpc3RlbmVycyA9IGhhbmRsZXIuc2xpY2UoKTtcbiAgICBsZW4gPSBsaXN0ZW5lcnMubGVuZ3RoO1xuICAgIGZvciAoaSA9IDA7IGkgPCBsZW47IGkrKylcbiAgICAgIGxpc3RlbmVyc1tpXS5hcHBseSh0aGlzLCBhcmdzKTtcbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5hZGRMaXN0ZW5lciA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gIHZhciBtO1xuXG4gIGlmICghaXNGdW5jdGlvbihsaXN0ZW5lcikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCdsaXN0ZW5lciBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcblxuICBpZiAoIXRoaXMuX2V2ZW50cylcbiAgICB0aGlzLl9ldmVudHMgPSB7fTtcblxuICAvLyBUbyBhdm9pZCByZWN1cnNpb24gaW4gdGhlIGNhc2UgdGhhdCB0eXBlID09PSBcIm5ld0xpc3RlbmVyXCIhIEJlZm9yZVxuICAvLyBhZGRpbmcgaXQgdG8gdGhlIGxpc3RlbmVycywgZmlyc3QgZW1pdCBcIm5ld0xpc3RlbmVyXCIuXG4gIGlmICh0aGlzLl9ldmVudHMubmV3TGlzdGVuZXIpXG4gICAgdGhpcy5lbWl0KCduZXdMaXN0ZW5lcicsIHR5cGUsXG4gICAgICAgICAgICAgIGlzRnVuY3Rpb24obGlzdGVuZXIubGlzdGVuZXIpID9cbiAgICAgICAgICAgICAgbGlzdGVuZXIubGlzdGVuZXIgOiBsaXN0ZW5lcik7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgLy8gT3B0aW1pemUgdGhlIGNhc2Ugb2Ygb25lIGxpc3RlbmVyLiBEb24ndCBuZWVkIHRoZSBleHRyYSBhcnJheSBvYmplY3QuXG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdID0gbGlzdGVuZXI7XG4gIGVsc2UgaWYgKGlzT2JqZWN0KHRoaXMuX2V2ZW50c1t0eXBlXSkpXG4gICAgLy8gSWYgd2UndmUgYWxyZWFkeSBnb3QgYW4gYXJyYXksIGp1c3QgYXBwZW5kLlxuICAgIHRoaXMuX2V2ZW50c1t0eXBlXS5wdXNoKGxpc3RlbmVyKTtcbiAgZWxzZVxuICAgIC8vIEFkZGluZyB0aGUgc2Vjb25kIGVsZW1lbnQsIG5lZWQgdG8gY2hhbmdlIHRvIGFycmF5LlxuICAgIHRoaXMuX2V2ZW50c1t0eXBlXSA9IFt0aGlzLl9ldmVudHNbdHlwZV0sIGxpc3RlbmVyXTtcblxuICAvLyBDaGVjayBmb3IgbGlzdGVuZXIgbGVha1xuICBpZiAoaXNPYmplY3QodGhpcy5fZXZlbnRzW3R5cGVdKSAmJiAhdGhpcy5fZXZlbnRzW3R5cGVdLndhcm5lZCkge1xuICAgIGlmICghaXNVbmRlZmluZWQodGhpcy5fbWF4TGlzdGVuZXJzKSkge1xuICAgICAgbSA9IHRoaXMuX21heExpc3RlbmVycztcbiAgICB9IGVsc2Uge1xuICAgICAgbSA9IEV2ZW50RW1pdHRlci5kZWZhdWx0TWF4TGlzdGVuZXJzO1xuICAgIH1cblxuICAgIGlmIChtICYmIG0gPiAwICYmIHRoaXMuX2V2ZW50c1t0eXBlXS5sZW5ndGggPiBtKSB7XG4gICAgICB0aGlzLl9ldmVudHNbdHlwZV0ud2FybmVkID0gdHJ1ZTtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJyhub2RlKSB3YXJuaW5nOiBwb3NzaWJsZSBFdmVudEVtaXR0ZXIgbWVtb3J5ICcgK1xuICAgICAgICAgICAgICAgICAgICAnbGVhayBkZXRlY3RlZC4gJWQgbGlzdGVuZXJzIGFkZGVkLiAnICtcbiAgICAgICAgICAgICAgICAgICAgJ1VzZSBlbWl0dGVyLnNldE1heExpc3RlbmVycygpIHRvIGluY3JlYXNlIGxpbWl0LicsXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2V2ZW50c1t0eXBlXS5sZW5ndGgpO1xuICAgICAgaWYgKHR5cGVvZiBjb25zb2xlLnRyYWNlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIC8vIG5vdCBzdXBwb3J0ZWQgaW4gSUUgMTBcbiAgICAgICAgY29uc29sZS50cmFjZSgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbiA9IEV2ZW50RW1pdHRlci5wcm90b3R5cGUuYWRkTGlzdGVuZXI7XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUub25jZSA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gIGlmICghaXNGdW5jdGlvbihsaXN0ZW5lcikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCdsaXN0ZW5lciBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcblxuICB2YXIgZmlyZWQgPSBmYWxzZTtcblxuICBmdW5jdGlvbiBnKCkge1xuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIodHlwZSwgZyk7XG5cbiAgICBpZiAoIWZpcmVkKSB7XG4gICAgICBmaXJlZCA9IHRydWU7XG4gICAgICBsaXN0ZW5lci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH1cbiAgfVxuXG4gIGcubGlzdGVuZXIgPSBsaXN0ZW5lcjtcbiAgdGhpcy5vbih0eXBlLCBnKTtcblxuICByZXR1cm4gdGhpcztcbn07XG5cbi8vIGVtaXRzIGEgJ3JlbW92ZUxpc3RlbmVyJyBldmVudCBpZmYgdGhlIGxpc3RlbmVyIHdhcyByZW1vdmVkXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUxpc3RlbmVyID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgdmFyIGxpc3QsIHBvc2l0aW9uLCBsZW5ndGgsIGk7XG5cbiAgaWYgKCFpc0Z1bmN0aW9uKGxpc3RlbmVyKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ2xpc3RlbmVyIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzIHx8ICF0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgcmV0dXJuIHRoaXM7XG5cbiAgbGlzdCA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgbGVuZ3RoID0gbGlzdC5sZW5ndGg7XG4gIHBvc2l0aW9uID0gLTE7XG5cbiAgaWYgKGxpc3QgPT09IGxpc3RlbmVyIHx8XG4gICAgICAoaXNGdW5jdGlvbihsaXN0Lmxpc3RlbmVyKSAmJiBsaXN0Lmxpc3RlbmVyID09PSBsaXN0ZW5lcikpIHtcbiAgICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuICAgIGlmICh0aGlzLl9ldmVudHMucmVtb3ZlTGlzdGVuZXIpXG4gICAgICB0aGlzLmVtaXQoJ3JlbW92ZUxpc3RlbmVyJywgdHlwZSwgbGlzdGVuZXIpO1xuXG4gIH0gZWxzZSBpZiAoaXNPYmplY3QobGlzdCkpIHtcbiAgICBmb3IgKGkgPSBsZW5ndGg7IGktLSA+IDA7KSB7XG4gICAgICBpZiAobGlzdFtpXSA9PT0gbGlzdGVuZXIgfHxcbiAgICAgICAgICAobGlzdFtpXS5saXN0ZW5lciAmJiBsaXN0W2ldLmxpc3RlbmVyID09PSBsaXN0ZW5lcikpIHtcbiAgICAgICAgcG9zaXRpb24gPSBpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAocG9zaXRpb24gPCAwKVxuICAgICAgcmV0dXJuIHRoaXM7XG5cbiAgICBpZiAobGlzdC5sZW5ndGggPT09IDEpIHtcbiAgICAgIGxpc3QubGVuZ3RoID0gMDtcbiAgICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG4gICAgfSBlbHNlIHtcbiAgICAgIGxpc3Quc3BsaWNlKHBvc2l0aW9uLCAxKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fZXZlbnRzLnJlbW92ZUxpc3RlbmVyKVxuICAgICAgdGhpcy5lbWl0KCdyZW1vdmVMaXN0ZW5lcicsIHR5cGUsIGxpc3RlbmVyKTtcbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBmdW5jdGlvbih0eXBlKSB7XG4gIHZhciBrZXksIGxpc3RlbmVycztcblxuICBpZiAoIXRoaXMuX2V2ZW50cylcbiAgICByZXR1cm4gdGhpcztcblxuICAvLyBub3QgbGlzdGVuaW5nIGZvciByZW1vdmVMaXN0ZW5lciwgbm8gbmVlZCB0byBlbWl0XG4gIGlmICghdGhpcy5fZXZlbnRzLnJlbW92ZUxpc3RlbmVyKSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApXG4gICAgICB0aGlzLl9ldmVudHMgPSB7fTtcbiAgICBlbHNlIGlmICh0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLy8gZW1pdCByZW1vdmVMaXN0ZW5lciBmb3IgYWxsIGxpc3RlbmVycyBvbiBhbGwgZXZlbnRzXG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKSB7XG4gICAgZm9yIChrZXkgaW4gdGhpcy5fZXZlbnRzKSB7XG4gICAgICBpZiAoa2V5ID09PSAncmVtb3ZlTGlzdGVuZXInKSBjb250aW51ZTtcbiAgICAgIHRoaXMucmVtb3ZlQWxsTGlzdGVuZXJzKGtleSk7XG4gICAgfVxuICAgIHRoaXMucmVtb3ZlQWxsTGlzdGVuZXJzKCdyZW1vdmVMaXN0ZW5lcicpO1xuICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgbGlzdGVuZXJzID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gIGlmIChpc0Z1bmN0aW9uKGxpc3RlbmVycykpIHtcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGxpc3RlbmVycyk7XG4gIH0gZWxzZSBpZiAobGlzdGVuZXJzKSB7XG4gICAgLy8gTElGTyBvcmRlclxuICAgIHdoaWxlIChsaXN0ZW5lcnMubGVuZ3RoKVxuICAgICAgdGhpcy5yZW1vdmVMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lcnNbbGlzdGVuZXJzLmxlbmd0aCAtIDFdKTtcbiAgfVxuICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5saXN0ZW5lcnMgPSBmdW5jdGlvbih0eXBlKSB7XG4gIHZhciByZXQ7XG4gIGlmICghdGhpcy5fZXZlbnRzIHx8ICF0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgcmV0ID0gW107XG4gIGVsc2UgaWYgKGlzRnVuY3Rpb24odGhpcy5fZXZlbnRzW3R5cGVdKSlcbiAgICByZXQgPSBbdGhpcy5fZXZlbnRzW3R5cGVdXTtcbiAgZWxzZVxuICAgIHJldCA9IHRoaXMuX2V2ZW50c1t0eXBlXS5zbGljZSgpO1xuICByZXR1cm4gcmV0O1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5saXN0ZW5lckNvdW50ID0gZnVuY3Rpb24odHlwZSkge1xuICBpZiAodGhpcy5fZXZlbnRzKSB7XG4gICAgdmFyIGV2bGlzdGVuZXIgPSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgICBpZiAoaXNGdW5jdGlvbihldmxpc3RlbmVyKSlcbiAgICAgIHJldHVybiAxO1xuICAgIGVsc2UgaWYgKGV2bGlzdGVuZXIpXG4gICAgICByZXR1cm4gZXZsaXN0ZW5lci5sZW5ndGg7XG4gIH1cbiAgcmV0dXJuIDA7XG59O1xuXG5FdmVudEVtaXR0ZXIubGlzdGVuZXJDb3VudCA9IGZ1bmN0aW9uKGVtaXR0ZXIsIHR5cGUpIHtcbiAgcmV0dXJuIGVtaXR0ZXIubGlzdGVuZXJDb3VudCh0eXBlKTtcbn07XG5cbmZ1bmN0aW9uIGlzRnVuY3Rpb24oYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnZnVuY3Rpb24nO1xufVxuXG5mdW5jdGlvbiBpc051bWJlcihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdudW1iZXInO1xufVxuXG5mdW5jdGlvbiBpc09iamVjdChhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdvYmplY3QnICYmIGFyZyAhPT0gbnVsbDtcbn1cblxuZnVuY3Rpb24gaXNVbmRlZmluZWQoYXJnKSB7XG4gIHJldHVybiBhcmcgPT09IHZvaWQgMDtcbn1cbiJdfQ==
