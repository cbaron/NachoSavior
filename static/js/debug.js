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

},{"../../lib/MyObject":36}],5:[function(require,module,exports){
'use strict';

module.exports = Object.create({
    create: function create(name, opts) {
        name = name.charAt(0).toUpperCase() + name.slice(1);
        return Object.create(this.Views[name], Object.assign({
            name: { value: name },
            factory: { value: this },
            template: { value: this.Templates[name] },
            user: { value: this.User }
        }, opts)).constructor().on('navigate', function (route) {
            return require('../router').navigate(route);
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

},{"../../../lib/MyObject":36,"../Xhr":4,"events":37}],9:[function(require,module,exports){
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

            _this.header.onUser().on('signout', function () {
                return Promise.all(Object.keys(_this.views).map(function (name) {
                    return _this.views[name].delete();
                })).then(function () {
                    return _this.navigate('');
                });
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
        });
    },
    navigate: function navigate(location) {
        history.pushState({}, '', location);
        this.handle();
    }
}, { currentView: { value: '', writable: true }, views: { value: {} } });

},{"../../lib/MyError":35,"./.ViewMap":2,"./factory/View":5,"./models/User":7}],10:[function(require,module,exports){
'use strict';

module.exports = Object.assign({}, require('./__proto__'), {
    navigate: function navigate(path) {
        var _this = this;

        this.path = path;

        return path.length === 1 && this.els.container.classList.includes('hide') ? Promise.all(Object.keys(this.subViews).map(function (view) {
            return _this.subViews[view].hide();
        })).then(function () {
            return _this.show();
        }).catch(this.Error) : this.path.length > 1 ? this.els.container.classList.contains('hide') ? this.renderSubView() : this.hide().then(function () {
            return _this.renderSubView();
        }) : Promise.resolve();
    },
    postRender: function postRender() {
        var _this2 = this;

        this.views = {};
        this.subViews = {};

        if (this.path.length > 1) {
            this.els.container.classList.add('hide', 'hidden');
            this.renderSubView();
        }

        this.options = Object.create(this.Model, { resource: { value: 'admin' } });

        this.options.get({ method: 'options' }).then(function () {
            return _this2.options.data.forEach(function (collection) {
                return _this2.views[collection] = _this2.factory.create('AdminItem', { insertion: { value: { el: _this2.els.container } },
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
        edit: 'click'
    },

    onEditClick: function onEditClick() {
        this.emit('edit');
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

        return (this.binaryFile ? this.Xhr({ method: 'PATCH', resource: 'file/' + this.model.data.image.split('/')[3], data: this.binaryFile, headers: { contentType: 'application/octet-stream' } }) : Promise.resolve()).then(function () {
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
        });
    },


    events: {
        addBtn: 'click'
    },

    manageComic: function manageComic(type, comic) {
        var _this2 = this;

        this.views.ComicManage ? this.views.ComicManage.onNavigation(type, comic) : this.views.ComicManage = this.factory.create('ComicManage', { type: { value: type, writable: true }, model: { value: { data: comic || {} } }, insertion: { value: { el: this.els.container, method: 'insertBefore' } } }).on('added', function (comic) {
            _this2.createComicView(comic);_this2.emit('navigate', '/admin/comic');
        }).on('edited', function (comic) {
            _this2.views[comic._id].update(comic);_this2.emit('navigate', '/admin/comic');
        }).on('cancelled', function () {
            return _this2.emit('navigate', '/admin/comic');
        });
    },
    onAddBtnClick: function onAddBtnClick() {
        this.emit('navigate', '/admin/comic/add');
    },
    onNavigation: function onNavigation(path) {
        var _this3 = this;

        this.path = path;

        path.length === 2 && this.els.container.classList.contains('hide') ? this.show() : path.length === 3 ? this.hide().then(function () {
            return _this3.manageComic(path[2], {});
        }) : path.length === 4 ? this.hide().then(function () {
            return _this3.manageComic(path[2], _this3.views[path[3]].model.data);
        }) : undefined;
    },
    postRender: function postRender() {
        var _this4 = this;

        if (this.path.length > 2) {
            this.els.container.classList.add('hidden', 'hide');
            if (this.path[2] === "add") {
                this.manageComic("add", {});
            } else if (this.path[2] === "edit" && this.path[3]) {
                this.Xhr({ method: "get", resource: 'comic/' + this.path[3] }).then(function (response) {
                    return _this4.manageComic("edit", response);
                }).catch(function (e) {
                    _this4.Error(e);_this4.emit('navigate', '/admin/comic');
                });
            }
        } else if (this.path.length === 1 && this.views.ComicManage) {
            this.views.ComicManage.hide();
        }

        this.comics = Object.create(this.Model, { resource: { value: 'comic' } });

        this.comics.get().then(function () {
            return Promise.resolve(_this4.comics.data.forEach(function (comic) {
                return _this4.createComicView(comic);
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
        signoutBtn: 'click'
    },

    onUser: function onUser() {
        return this;
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
                return _this.views[comic._id] = _this.factory.create('comic', { insertion: { value: { el: _this.els.container } }, model: { value: { data: comic } } });
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
        edit: 'click'
    },

    getTemplateOptions: function getTemplateOptions() {
        return Object.assign(require('./__proto__').getTemplateOptions.call(this), { user: this.user.data });
    },
    onEditClick: function onEditClick() {
        this.emit('edit');
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
    },
    populate: function populate() {
        this.els.title.textContent = this.capitalizeFirstLetter(this.type) + ' User';

        this.els.username.value = Object.keys(this.model.data).length ? this.els.username.value : '';
        this.els.username.password = '';
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
            return _this.manageUser('edit', user);
        });
    },


    events: {
        addBtn: 'click'
    },

    manageUser: function manageUser(type, user) {
        var _this2 = this;

        this.hide().then(function () {
            _this2.views.UserManage ? _this2.views.UserManage.onNavigation(type, user) : _this2.views.UserManage = _this2.factory.create('UserManage', { type: { value: type, writable: true }, model: { value: { data: user || {} } }, insertion: { value: { el: _this2.els.container, method: 'insertBefore' } } }).on('added', function (user) {
                _this2.createUserView(user);_this2.show();
            }).on('edited', function (user) {
                _this2.views[user._id].update(user);_this2.show();
            }).on('cancelled', function () {
                return _this2.show();
            });
        });
    },
    onAddBtnClick: function onAddBtnClick() {
        this.manageUser('add');
    },
    onNavigation: function onNavigation(path) {
        if (this.els.container.classList.contains('hide')) return this.show();
    },
    postRender: function postRender() {
        var _this3 = this;

        this.users = Object.create(this.Model, { resource: { value: 'user' } });

        this.users.get().then(function () {
            return Promise.resolve(_this3.users.data.forEach(function (user) {
                return _this3.createUserView(user);
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
            resolve(_this3.emit('removed'));
        });
    },


    events: {},

    getData: function getData() {
        if (!this.model) this.model = Object.create(this.Model, { resource: { value: this.name } });

        return this.model.get();
    },
    getTemplateOptions: function getTemplateOptions() {
        return this.model ? this.model.data : {};
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
            _this6.els.container.classList.add('hide');
            _this6.els.container.addEventListener('transitionend', function (e) {
                _this6.els.container.classList.add('hidden');
                resolve(_this6.emit('hidden'));
            }, true);
        });
    },
    htmlToFragment: function htmlToFragment(str) {
        var range = document.createRange();
        // make the parent of the first div in the document becomes the context node
        range.selectNode(document.getElementsByTagName("div").item(0));
        return range.createContextualFragment(str);
    },
    isHidden: function isHidden() {
        return this.els.container.css('display') === 'none';
    },
    onLogin: function onLogin() {
        this.router.header.onUser(this.user);

        this[this.hasPrivileges() ? 'render' : 'showNoAccess']();
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
            _this8.els.container.classList.remove('hide', 'hidden');
            _this8.els.container.addEventListener('transitionend', function (e) {
                if (_this8.size) _this8.size();
                resolve(_this8.emit('shown'));
            }, true);
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

},{"../../../lib/MyObject":36,"../Xhr":4,"../models/__proto__.js":8,"./lib/OptimizedResize":22,"./lib/Spin":23,"events":37}],22:[function(require,module,exports){
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
  return "<div></div>";
};

},{}],25:[function(require,module,exports){
"use strict";

module.exports = function (p) {
  return "<div>" + p.collection + "</div>";
};

},{}],26:[function(require,module,exports){
'use strict';

module.exports = function (p) {
    return '<div>\n    <div data-js="title" >' + (p.title || '') + '</div>\n    <img data-js="image" src="' + p.image + '"/>\n    <button class="edit" data-js="edit"></button>\n</div>';
};

},{}],27:[function(require,module,exports){
"use strict";

module.exports = function (p) {
    return "<div>\n    <div data-js=\"header\"></div>\n    <div class=\"form-group\">\n       <label class=\"form-label\">title</label>\n       <input data-js=\"title\" type=\"text\"></input>\n    </div>\n    <div class=\"form-group\">\n       <label class=\"form-label\">image</label>\n        <div>\n            <button data-js=\"upload\" class=\"upload\">\n                <span>Upload File</span>\n                <input type=\"file\" data-js=\"image\" />\n            </button>\n            <img data-js=\"preview\" />\n        </div>\n    </div>\n    <div>\n        <button data-js=\"submit\" class=\"btn-ghost\" type=\"button\">Submit</button>\n        <button data-js=\"cancel\" class=\"btn-ghost\" type=\"button\">Cancel</button>\n    </div>\n</div>";
};

},{}],28:[function(require,module,exports){
"use strict";

module.exports = function (p) {
    return "<div>\n    <div>\n        <div>Comics</div>\n        <button data-js=\"addBtn\" class=\"add\"></button>\n    </div>\n    <div data-js=\"list\"></div>\n</div>";
};

},{}],29:[function(require,module,exports){
"use strict";

module.exports = function (p) {
    return "<header>\n    <ul>\n        <li>About</li>\n        <li>Store</li>\n    </ul>\n    <span>Tiny Handed</span>\n    <span>logo</span>\n</header>";
};

},{}],30:[function(require,module,exports){
"use strict";

module.exports = function (p) {
  return "<div></div>";
};

},{}],31:[function(require,module,exports){
"use strict";

module.exports = function (p) {
   return "<div>\n    <h1>Login</h1>\n    <div class=\"form-group\">\n       <label class=\"form-label\" for=\"username\">username</label>\n       <input data-js=\"username\" class=\"username\" type=\"text\"></input>\n    </div>\n    <div class=\"form-group\">\n       <label class=\"form-label\" for=\"password\">password</label>\n       <input data-js=\"password\" class=\"password\" type=\"password\"></input>\n    </div>\n    <div>\n        <button data-js=\"submit\" class=\"btn-ghost\" type=\"button\">Log In</button>\n    </div>\n</div>";
};

},{}],32:[function(require,module,exports){
'use strict';

module.exports = function (p) {
    return '<div>\n    <span data-js="username">' + p.username + '</span>\n    ' + (p.user._id === p._id ? '<button class="edit" data-js="edit"></button>' : '') + '\n</div>\n';
};

},{}],33:[function(require,module,exports){
"use strict";

module.exports = function (p) {
   return "<div>\n    <div data-js=\"title\"></div>\n    <div class=\"form-group\">\n       <label class=\"form-label\" for=\"username\">username</label>\n       <input data-js=\"username\" class=\"username\" type=\"text\"></input>\n    </div>\n    <div class=\"form-group\">\n       <label class=\"form-label\" for=\"password\">password</label>\n       <input data-js=\"password\" class=\"password\" type=\"password\"></input>\n    </div>\n    <div>\n        <button data-js=\"submit\" class=\"btn-ghost\" type=\"button\">Submit</button>\n        <button data-js=\"cancel\" class=\"btn-ghost\" type=\"button\">Cancel</button>\n    </div>\n</div>";
};

},{}],34:[function(require,module,exports){
"use strict";

module.exports = function (p) {
    return "<div>\n    <div>\n        <div>Users</div>\n        <button data-js=\"addBtn\" class=\"add\"></button>\n    </div>\n    <div data-js=\"list\"></div>\n</div>";
};

},{}],35:[function(require,module,exports){
"use strict";

module.exports = function (err) {
  console.log(err.stack || err);
};

},{}],36:[function(require,module,exports){
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

},{"./MyError":35}],37:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJjbGllbnQvanMvLlRlbXBsYXRlTWFwLmpzIiwiY2xpZW50L2pzLy5WaWV3TWFwLmpzIiwiY2xpZW50L2pzLy5lbnYiLCJjbGllbnQvanMvWGhyLmpzIiwiY2xpZW50L2pzL2ZhY3RvcnkvVmlldy5qcyIsImNsaWVudC9qcy9tYWluLmpzIiwiY2xpZW50L2pzL21vZGVscy9Vc2VyLmpzIiwiY2xpZW50L2pzL21vZGVscy9fX3Byb3RvX18uanMiLCJjbGllbnQvanMvcm91dGVyLmpzIiwiY2xpZW50L2pzL3ZpZXdzL0FkbWluLmpzIiwiY2xpZW50L2pzL3ZpZXdzL0FkbWluSXRlbS5qcyIsImNsaWVudC9qcy92aWV3cy9Db21pYy5qcyIsImNsaWVudC9qcy92aWV3cy9Db21pY01hbmFnZS5qcyIsImNsaWVudC9qcy92aWV3cy9Db21pY1Jlc291cmNlcy5qcyIsImNsaWVudC9qcy92aWV3cy9IZWFkZXIuanMiLCJjbGllbnQvanMvdmlld3MvSG9tZS5qcyIsImNsaWVudC9qcy92aWV3cy9Mb2dpbi5qcyIsImNsaWVudC9qcy92aWV3cy9Vc2VyLmpzIiwiY2xpZW50L2pzL3ZpZXdzL1VzZXJNYW5hZ2UuanMiLCJjbGllbnQvanMvdmlld3MvVXNlclJlc291cmNlcy5qcyIsImNsaWVudC9qcy92aWV3cy9fX3Byb3RvX18uanMiLCJjbGllbnQvanMvdmlld3MvbGliL09wdGltaXplZFJlc2l6ZS5qcyIsImNsaWVudC9qcy92aWV3cy9saWIvU3Bpbi5qcyIsImNsaWVudC9qcy92aWV3cy90ZW1wbGF0ZXMvQWRtaW4uanMiLCJjbGllbnQvanMvdmlld3MvdGVtcGxhdGVzL0FkbWluSXRlbS5qcyIsImNsaWVudC9qcy92aWV3cy90ZW1wbGF0ZXMvQ29taWMuanMiLCJjbGllbnQvanMvdmlld3MvdGVtcGxhdGVzL0NvbWljTWFuYWdlLmpzIiwiY2xpZW50L2pzL3ZpZXdzL3RlbXBsYXRlcy9Db21pY1Jlc291cmNlcy5qcyIsImNsaWVudC9qcy92aWV3cy90ZW1wbGF0ZXMvSGVhZGVyLmpzIiwiY2xpZW50L2pzL3ZpZXdzL3RlbXBsYXRlcy9Ib21lLmpzIiwiY2xpZW50L2pzL3ZpZXdzL3RlbXBsYXRlcy9Mb2dpbi5qcyIsImNsaWVudC9qcy92aWV3cy90ZW1wbGF0ZXMvVXNlci5qcyIsImNsaWVudC9qcy92aWV3cy90ZW1wbGF0ZXMvVXNlck1hbmFnZS5qcyIsImNsaWVudC9qcy92aWV3cy90ZW1wbGF0ZXMvVXNlclJlc291cmNlcy5qcyIsImxpYi9NeUVycm9yLmpzIiwibGliL015T2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2V2ZW50cy9ldmVudHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBLE9BQU8sT0FBUCxHQUFlO0FBQ2QsUUFBTyxRQUFRLHlCQUFSLENBRE87QUFFZCxZQUFXLFFBQVEsNkJBQVIsQ0FGRztBQUdkLFFBQU8sUUFBUSx5QkFBUixDQUhPO0FBSWQsY0FBYSxRQUFRLCtCQUFSLENBSkM7QUFLZCxpQkFBZ0IsUUFBUSxrQ0FBUixDQUxGO0FBTWQsU0FBUSxRQUFRLDBCQUFSLENBTk07QUFPZCxPQUFNLFFBQVEsd0JBQVIsQ0FQUTtBQVFkLFFBQU8sUUFBUSx5QkFBUixDQVJPO0FBU2QsT0FBTSxRQUFRLHdCQUFSLENBVFE7QUFVZCxhQUFZLFFBQVEsOEJBQVIsQ0FWRTtBQVdkLGdCQUFlLFFBQVEsaUNBQVI7QUFYRCxDQUFmOzs7OztBQ0FBLE9BQU8sT0FBUCxHQUFlO0FBQ2QsUUFBTyxRQUFRLGVBQVIsQ0FETztBQUVkLFlBQVcsUUFBUSxtQkFBUixDQUZHO0FBR2QsUUFBTyxRQUFRLGVBQVIsQ0FITztBQUlkLGNBQWEsUUFBUSxxQkFBUixDQUpDO0FBS2QsaUJBQWdCLFFBQVEsd0JBQVIsQ0FMRjtBQU1kLFNBQVEsUUFBUSxnQkFBUixDQU5NO0FBT2QsT0FBTSxRQUFRLGNBQVIsQ0FQUTtBQVFkLFFBQU8sUUFBUSxlQUFSLENBUk87QUFTZCxPQUFN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O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIm1vZHVsZS5leHBvcnRzPXtcblx0QWRtaW46IHJlcXVpcmUoJy4vdmlld3MvdGVtcGxhdGVzL0FkbWluJyksXG5cdEFkbWluSXRlbTogcmVxdWlyZSgnLi92aWV3cy90ZW1wbGF0ZXMvQWRtaW5JdGVtJyksXG5cdENvbWljOiByZXF1aXJlKCcuL3ZpZXdzL3RlbXBsYXRlcy9Db21pYycpLFxuXHRDb21pY01hbmFnZTogcmVxdWlyZSgnLi92aWV3cy90ZW1wbGF0ZXMvQ29taWNNYW5hZ2UnKSxcblx0Q29taWNSZXNvdXJjZXM6IHJlcXVpcmUoJy4vdmlld3MvdGVtcGxhdGVzL0NvbWljUmVzb3VyY2VzJyksXG5cdEhlYWRlcjogcmVxdWlyZSgnLi92aWV3cy90ZW1wbGF0ZXMvSGVhZGVyJyksXG5cdEhvbWU6IHJlcXVpcmUoJy4vdmlld3MvdGVtcGxhdGVzL0hvbWUnKSxcblx0TG9naW46IHJlcXVpcmUoJy4vdmlld3MvdGVtcGxhdGVzL0xvZ2luJyksXG5cdFVzZXI6IHJlcXVpcmUoJy4vdmlld3MvdGVtcGxhdGVzL1VzZXInKSxcblx0VXNlck1hbmFnZTogcmVxdWlyZSgnLi92aWV3cy90ZW1wbGF0ZXMvVXNlck1hbmFnZScpLFxuXHRVc2VyUmVzb3VyY2VzOiByZXF1aXJlKCcuL3ZpZXdzL3RlbXBsYXRlcy9Vc2VyUmVzb3VyY2VzJylcbn0iLCJtb2R1bGUuZXhwb3J0cz17XG5cdEFkbWluOiByZXF1aXJlKCcuL3ZpZXdzL0FkbWluJyksXG5cdEFkbWluSXRlbTogcmVxdWlyZSgnLi92aWV3cy9BZG1pbkl0ZW0nKSxcblx0Q29taWM6IHJlcXVpcmUoJy4vdmlld3MvQ29taWMnKSxcblx0Q29taWNNYW5hZ2U6IHJlcXVpcmUoJy4vdmlld3MvQ29taWNNYW5hZ2UnKSxcblx0Q29taWNSZXNvdXJjZXM6IHJlcXVpcmUoJy4vdmlld3MvQ29taWNSZXNvdXJjZXMnKSxcblx0SGVhZGVyOiByZXF1aXJlKCcuL3ZpZXdzL0hlYWRlcicpLFxuXHRIb21lOiByZXF1aXJlKCcuL3ZpZXdzL0hvbWUnKSxcblx0TG9naW46IHJlcXVpcmUoJy4vdmlld3MvTG9naW4nKSxcblx0VXNlcjogcmVxdWlyZSgnLi92aWV3cy9Vc2VyJyksXG5cdFVzZXJNYW5hZ2U6IHJlcXVpcmUoJy4vdmlld3MvVXNlck1hbmFnZScpLFxuXHRVc2VyUmVzb3VyY2VzOiByZXF1aXJlKCcuL3ZpZXdzL1VzZXJSZXNvdXJjZXMnKVxufSIsIndpbmRvdy5jb29raWVOYW1lID0gJ2NoZWV0b2plc3VzJ1xuIiwibW9kdWxlLmV4cG9ydHMgPSBPYmplY3QuY3JlYXRlKCBPYmplY3QuYXNzaWduKCB7fSwgcmVxdWlyZSgnLi4vLi4vbGliL015T2JqZWN0JyksIHtcblxuICAgIFJlcXVlc3Q6IHtcblxuICAgICAgICBjb25zdHJ1Y3RvciggZGF0YSApIHtcbiAgICAgICAgICAgIGxldCByZXEgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKVxuXG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoICggcmVzb2x2ZSwgcmVqZWN0ICkgPT4ge1xuXG4gICAgICAgICAgICAgICAgcmVxLm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICBbIDUwMCwgNDA0LCA0MDEgXS5pbmNsdWRlcyggdGhpcy5zdGF0dXMgKVxuICAgICAgICAgICAgICAgICAgICAgICAgPyByZWplY3QoIHRoaXMucmVzcG9uc2UgKVxuICAgICAgICAgICAgICAgICAgICAgICAgOiByZXNvbHZlKCBKU09OLnBhcnNlKHRoaXMucmVzcG9uc2UpIClcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiggZGF0YS5tZXRob2QgPT09IFwiZ2V0XCIgfHwgZGF0YS5tZXRob2QgPT09IFwib3B0aW9uc1wiICkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgcXMgPSBkYXRhLnFzID8gYD8ke2RhdGEucXN9YCA6ICcnIFxuICAgICAgICAgICAgICAgICAgICByZXEub3BlbiggZGF0YS5tZXRob2QsIGAvJHtkYXRhLnJlc291cmNlfSR7cXN9YCApXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0SGVhZGVycyggcmVxLCBkYXRhLmhlYWRlcnMgKVxuICAgICAgICAgICAgICAgICAgICByZXEuc2VuZChudWxsKVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJlcS5vcGVuKCBkYXRhLm1ldGhvZCwgYC8ke2RhdGEucmVzb3VyY2V9YCwgdHJ1ZSlcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRIZWFkZXJzKCByZXEsIGRhdGEuaGVhZGVycyApXG4gICAgICAgICAgICAgICAgICAgIHJlcS5zZW5kKCBkYXRhLmRhdGEgKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gKVxuICAgICAgICB9LFxuXG4gICAgICAgIHBsYWluRXNjYXBlKCBzVGV4dCApIHtcbiAgICAgICAgICAgIC8qIGhvdyBzaG91bGQgSSB0cmVhdCBhIHRleHQvcGxhaW4gZm9ybSBlbmNvZGluZz8gd2hhdCBjaGFyYWN0ZXJzIGFyZSBub3QgYWxsb3dlZD8gdGhpcyBpcyB3aGF0IEkgc3VwcG9zZS4uLjogKi9cbiAgICAgICAgICAgIC8qIFwiNFxcM1xcNyAtIEVpbnN0ZWluIHNhaWQgRT1tYzJcIiAtLS0tPiBcIjRcXFxcM1xcXFw3XFwgLVxcIEVpbnN0ZWluXFwgc2FpZFxcIEVcXD1tYzJcIiAqL1xuICAgICAgICAgICAgcmV0dXJuIHNUZXh0LnJlcGxhY2UoL1tcXHNcXD1cXFxcXS9nLCBcIlxcXFwkJlwiKTtcbiAgICAgICAgfSxcblxuICAgICAgICBzZXRIZWFkZXJzKCByZXEsIGhlYWRlcnM9e30gKSB7XG4gICAgICAgICAgICByZXEuc2V0UmVxdWVzdEhlYWRlciggXCJBY2NlcHRcIiwgaGVhZGVycy5hY2NlcHQgfHwgJ2FwcGxpY2F0aW9uL2pzb24nIClcbiAgICAgICAgICAgIHJlcS5zZXRSZXF1ZXN0SGVhZGVyKCBcIkNvbnRlbnQtVHlwZVwiLCBoZWFkZXJzLmNvbnRlbnRUeXBlIHx8ICd0ZXh0L3BsYWluJyApXG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgX2ZhY3RvcnkoIGRhdGEgKSB7XG4gICAgICAgIHJldHVybiBPYmplY3QuY3JlYXRlKCB0aGlzLlJlcXVlc3QsIHsgfSApLmNvbnN0cnVjdG9yKCBkYXRhIClcbiAgICB9LFxuXG4gICAgY29uc3RydWN0b3IoKSB7XG5cbiAgICAgICAgaWYoICFYTUxIdHRwUmVxdWVzdC5wcm90b3R5cGUuc2VuZEFzQmluYXJ5ICkge1xuICAgICAgICAgIFhNTEh0dHBSZXF1ZXN0LnByb3RvdHlwZS5zZW5kQXNCaW5hcnkgPSBmdW5jdGlvbihzRGF0YSkge1xuICAgICAgICAgICAgdmFyIG5CeXRlcyA9IHNEYXRhLmxlbmd0aCwgdWk4RGF0YSA9IG5ldyBVaW50OEFycmF5KG5CeXRlcyk7XG4gICAgICAgICAgICBmb3IgKHZhciBuSWR4ID0gMDsgbklkeCA8IG5CeXRlczsgbklkeCsrKSB7XG4gICAgICAgICAgICAgIHVpOERhdGFbbklkeF0gPSBzRGF0YS5jaGFyQ29kZUF0KG5JZHgpICYgMHhmZjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuc2VuZCh1aThEYXRhKTtcbiAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuX2ZhY3RvcnkuYmluZCh0aGlzKVxuICAgIH1cblxufSApLCB7IH0gKS5jb25zdHJ1Y3RvcigpXG4iLCJtb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5jcmVhdGUoIHtcblxuICAgIGNyZWF0ZSggbmFtZSwgb3B0cyApIHtcbiAgICAgICAgbmFtZSA9IG5hbWUuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBuYW1lLnNsaWNlKDEpXG4gICAgICAgIHJldHVybiBPYmplY3QuY3JlYXRlKFxuICAgICAgICAgICAgdGhpcy5WaWV3c1sgbmFtZSBdLFxuICAgICAgICAgICAgT2JqZWN0LmFzc2lnbigge1xuICAgICAgICAgICAgICAgIG5hbWU6IHsgdmFsdWU6IG5hbWUgfSxcbiAgICAgICAgICAgICAgICBmYWN0b3J5OiB7IHZhbHVlOiB0aGlzIH0sXG4gICAgICAgICAgICAgICAgdGVtcGxhdGU6IHsgdmFsdWU6IHRoaXMuVGVtcGxhdGVzWyBuYW1lIF0gfSxcbiAgICAgICAgICAgICAgICB1c2VyOiB7IHZhbHVlOiB0aGlzLlVzZXIgfVxuICAgICAgICAgICAgICAgIH0sIG9wdHMgKVxuICAgICAgICApLmNvbnN0cnVjdG9yKClcbiAgICAgICAgLm9uKCAnbmF2aWdhdGUnLCByb3V0ZSA9PiByZXF1aXJlKCcuLi9yb3V0ZXInKS5uYXZpZ2F0ZSggcm91dGUgKSApXG4gICAgfSxcblxufSwge1xuICAgIFRlbXBsYXRlczogeyB2YWx1ZTogcmVxdWlyZSgnLi4vLlRlbXBsYXRlTWFwJykgfSxcbiAgICBVc2VyOiB7IHZhbHVlOiByZXF1aXJlKCcuLi9tb2RlbHMvVXNlcicgKSB9LFxuICAgIFZpZXdzOiB7IHZhbHVlOiByZXF1aXJlKCcuLi8uVmlld01hcCcpIH1cbn0gKVxuIiwid2luZG93Lm9ubG9hZCA9ICgpID0+IHtcbiAgICByZXF1aXJlKCcuLy5lbnYnKVxuICAgIHJlcXVpcmUoJy4vcm91dGVyJykuaW5pdGlhbGl6ZSgpXG59XG4iLCJtb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5jcmVhdGUoIHJlcXVpcmUoJy4vX19wcm90b19fLmpzJyksIHsgcmVzb3VyY2U6IHsgdmFsdWU6ICdtZScgfSB9IClcbiIsIm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmFzc2lnbiggeyB9LCByZXF1aXJlKCcuLi8uLi8uLi9saWIvTXlPYmplY3QnKSwgcmVxdWlyZSgnZXZlbnRzJykuRXZlbnRFbWl0dGVyLnByb3RvdHlwZSwge1xuXG4gICAgWGhyOiByZXF1aXJlKCcuLi9YaHInKSxcblxuICAgIGdldCggb3B0cz17fSApIHtcbiAgICAgICAgaWYoIG9wdHMucXVlcnkgJiYgdGhpcy5wYWdpbmF0aW9uICkgT2JqZWN0LmFzc2lnbiggb3B0cy5xdWVyeSwgdGhpcy5wYWdpbmF0aW9uIClcbiAgICAgICAgcmV0dXJuIHRoaXMuWGhyKCB7IG1ldGhvZDogb3B0cy5tZXRob2QgfHwgJ2dldCcsIHJlc291cmNlOiB0aGlzLnJlc291cmNlLCBoZWFkZXJzOiB0aGlzLmhlYWRlcnMgfHwge30sIHFzOiBvcHRzLnF1ZXJ5ID8gSlNPTi5zdHJpbmdpZnkoIG9wdHMucXVlcnkgKSA6IHVuZGVmaW5lZCB9IClcbiAgICAgICAgLnRoZW4oIHJlc3BvbnNlID0+IHtcbiAgICAgICAgICAgIGlmKCAhdGhpcy5wYWdpbmF0aW9uICkgcmV0dXJuIFByb21pc2UucmVzb2x2ZSggdGhpcy5kYXRhID0gcmVzcG9uc2UgKVxuXG4gICAgICAgICAgICBpZiggIXRoaXMuZGF0YSApIHRoaXMuZGF0YSA9IFsgXVxuICAgICAgICAgICAgdGhpcy5kYXRhID0gdGhpcy5kYXRhLmNvbmNhdChyZXNwb25zZSlcbiAgICAgICAgICAgIHRoaXMucGFnaW5hdGlvbi5za2lwICs9IHRoaXMucGFnaW5hdGlvbi5saW1pdFxuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShyZXNwb25zZSlcbiAgICAgICAgfSApXG4gICAgfVxuXG59IClcbiIsIm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmNyZWF0ZSgge1xuXG4gICAgRXJyb3I6IHJlcXVpcmUoJy4uLy4uL2xpYi9NeUVycm9yJyksXG4gICAgXG4gICAgVXNlcjogcmVxdWlyZSgnLi9tb2RlbHMvVXNlcicpLFxuXG4gICAgVmlld0ZhY3Rvcnk6IHJlcXVpcmUoJy4vZmFjdG9yeS9WaWV3JyksXG4gICAgXG4gICAgVmlld3M6IHJlcXVpcmUoJy4vLlZpZXdNYXAnKSxcblxuICAgIGluaXRpYWxpemUoKSB7XG4gICAgICAgIHRoaXMuY29udGVudENvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNjb250ZW50JylcblxuICAgICAgICB3aW5kb3cub25wb3BzdGF0ZSA9IHRoaXMuaGFuZGxlLmJpbmQodGhpcylcblxuICAgICAgICB0aGlzLmhlYWRlciA9IHRoaXMuVmlld0ZhY3RvcnkuY3JlYXRlKCAnaGVhZGVyJywgeyBpbnNlcnRpb246IHsgdmFsdWU6IHsgZWw6IHRoaXMuY29udGVudENvbnRhaW5lciwgbWV0aG9kOiAnaW5zZXJ0QmVmb3JlJyB9IH0gfSApXG5cbiAgICAgICAgdGhpcy5Vc2VyLmdldCgpLnRoZW4oICgpID0+IHtcbiAgICAgICAgXG4gICAgICAgICAgICB0aGlzLmhlYWRlci5vblVzZXIoKVxuICAgICAgICAgICAgLm9uKCAnc2lnbm91dCcsICgpID0+IFxuICAgICAgICAgICAgICAgIFByb21pc2UuYWxsKCBPYmplY3Qua2V5cyggdGhpcy52aWV3cyApLm1hcCggbmFtZSA9PiB0aGlzLnZpZXdzWyBuYW1lIF0uZGVsZXRlKCkgKSApXG4gICAgICAgICAgICAgICAgLnRoZW4oICgpID0+IHRoaXMubmF2aWdhdGUoICcnICkgKVxuICAgICAgICAgICAgKVxuXG4gICAgICAgIH0gKVxuICAgICAgICAuY2F0Y2goIHRoaXMuRXJyb3IgKVxuICAgICAgICAudGhlbiggKCkgPT4gdGhpcy5oYW5kbGUoKSApXG5cbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICB9LFxuXG4gICAgaGFuZGxlKCkge1xuICAgICAgICB0aGlzLmhhbmRsZXIoIHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZS5zcGxpdCgnLycpLnNsaWNlKDEpIClcbiAgICB9LFxuXG4gICAgaGFuZGxlciggcGF0aCApIHtcbiAgICAgICAgY29uc3QgbmFtZSA9IHBhdGhbMF0gPyBwYXRoWzBdLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgcGF0aFswXS5zbGljZSgxKSA6ICcnLFxuICAgICAgICAgICAgICB2aWV3ID0gdGhpcy5WaWV3c1tuYW1lXSA/IHBhdGhbMF0gOiAnaG9tZSc7XG5cbiAgICAgICAgKCAoIHZpZXcgPT09IHRoaXMuY3VycmVudFZpZXcgKVxuICAgICAgICAgICAgPyBQcm9taXNlLnJlc29sdmUoKVxuICAgICAgICAgICAgOiBQcm9taXNlLmFsbCggT2JqZWN0LmtleXMoIHRoaXMudmlld3MgKS5tYXAoIHZpZXcgPT4gdGhpcy52aWV3c1sgdmlldyBdLmhpZGUoKSApICkgKSBcbiAgICAgICAgLnRoZW4oICgpID0+IHtcblxuICAgICAgICAgICAgdGhpcy5jdXJyZW50VmlldyA9IHZpZXdcblxuICAgICAgICAgICAgaWYoIHRoaXMudmlld3NbIHZpZXcgXSApIHJldHVybiB0aGlzLnZpZXdzWyB2aWV3IF0ubmF2aWdhdGUoIHBhdGggKVxuXG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKFxuICAgICAgICAgICAgICAgIHRoaXMudmlld3NbIHZpZXcgXSA9XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuVmlld0ZhY3RvcnkuY3JlYXRlKCB2aWV3LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbnNlcnRpb246IHsgdmFsdWU6IHsgZWw6IHRoaXMuY29udGVudENvbnRhaW5lciB9IH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXRoOiB7IHZhbHVlOiBwYXRoLCB3cml0YWJsZTogdHJ1ZSB9XG4gICAgICAgICAgICAgICAgICAgIH0gKVxuICAgICAgICAgICAgKVxuICAgICAgICB9IClcbiAgICB9LFxuXG4gICAgbmF2aWdhdGUoIGxvY2F0aW9uICkge1xuICAgICAgICBoaXN0b3J5LnB1c2hTdGF0ZSgge30sICcnLCBsb2NhdGlvbiApXG4gICAgICAgIHRoaXMuaGFuZGxlKClcbiAgICB9XG5cbn0sIHsgY3VycmVudFZpZXc6IHsgdmFsdWU6ICcnLCB3cml0YWJsZTogdHJ1ZSB9LCB2aWV3czogeyB2YWx1ZTogeyB9IH0gfSApXG4iLCJtb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5hc3NpZ24oIHt9LCByZXF1aXJlKCcuL19fcHJvdG9fXycpLCB7XG5cbiAgICBuYXZpZ2F0ZSggcGF0aCApIHtcbiAgICAgICAgdGhpcy5wYXRoID0gcGF0aDtcblxuICAgICAgICByZXR1cm4gKCBwYXRoLmxlbmd0aCA9PT0gMSAmJiB0aGlzLmVscy5jb250YWluZXIuY2xhc3NMaXN0LmluY2x1ZGVzKCdoaWRlJykgKVxuICAgICAgICAgICAgPyBQcm9taXNlLmFsbCggT2JqZWN0LmtleXMoIHRoaXMuc3ViVmlld3MgKS5tYXAoIHZpZXcgPT4gdGhpcy5zdWJWaWV3c1sgdmlldyBdLmhpZGUoKSApICkudGhlbiggKCkgPT4gdGhpcy5zaG93KCkgKS5jYXRjaCggdGhpcy5FcnJvciApXG4gICAgICAgICAgICA6ICggdGhpcy5wYXRoLmxlbmd0aCA+IDEgKVxuICAgICAgICAgICAgICAgID8gKCB0aGlzLmVscy5jb250YWluZXIuY2xhc3NMaXN0LmNvbnRhaW5zKCdoaWRlJykgKVxuICAgICAgICAgICAgICAgICAgICA/IHRoaXMucmVuZGVyU3ViVmlldygpXG4gICAgICAgICAgICAgICAgICAgIDogdGhpcy5oaWRlKCkudGhlbiggKCkgPT4gdGhpcy5yZW5kZXJTdWJWaWV3KCkgKVxuICAgICAgICAgICAgICAgIDogUHJvbWlzZS5yZXNvbHZlKClcbiAgICB9LFxuXG4gICAgcG9zdFJlbmRlcigpIHtcbiAgICAgICAgdGhpcy52aWV3cyA9IHsgfVxuICAgICAgICB0aGlzLnN1YlZpZXdzID0geyB9XG5cbiAgICAgICAgaWYoIHRoaXMucGF0aC5sZW5ndGggPiAxICkge1xuICAgICAgICAgICAgdGhpcy5lbHMuY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoICdoaWRlJywgJ2hpZGRlbicgKVxuICAgICAgICAgICAgdGhpcy5yZW5kZXJTdWJWaWV3KClcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMub3B0aW9ucyA9IE9iamVjdC5jcmVhdGUoIHRoaXMuTW9kZWwsIHsgcmVzb3VyY2U6IHsgdmFsdWU6ICdhZG1pbicgfSB9IClcblxuICAgICAgICB0aGlzLm9wdGlvbnMuZ2V0KCB7IG1ldGhvZDogJ29wdGlvbnMnIH0gKVxuICAgICAgICAudGhlbiggKCkgPT5cbiAgICAgICAgICAgIHRoaXMub3B0aW9ucy5kYXRhLmZvckVhY2goIGNvbGxlY3Rpb24gPT5cbiAgICAgICAgICAgICAgICB0aGlzLnZpZXdzWyBjb2xsZWN0aW9uIF0gPSB0aGlzLmZhY3RvcnkuY3JlYXRlKFxuICAgICAgICAgICAgICAgICAgICAnQWRtaW5JdGVtJyxcbiAgICAgICAgICAgICAgICAgICAgeyBpbnNlcnRpb246IHsgdmFsdWU6IHsgZWw6IHRoaXMuZWxzLmNvbnRhaW5lciB9IH0sXG4gICAgICAgICAgICAgICAgICAgICAgbW9kZWw6IHsgdmFsdWU6IHsgZGF0YTogeyBjb2xsZWN0aW9uIH0gfSB9IH1cbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICApXG4gICAgICAgIClcbiAgICAgICAgLmNhdGNoKCB0aGlzLkVycm9yIClcblxuICAgICAgICByZXR1cm4gdGhpc1xuICAgIH0sXG5cbiAgICByZW5kZXJTdWJWaWV3KCkge1xuICAgICAgICBjb25zdCBzdWJWaWV3TmFtZSA9IGAke3RoaXMuY2FwaXRhbGl6ZUZpcnN0TGV0dGVyKHRoaXMucGF0aFsxXSl9UmVzb3VyY2VzYFxuXG4gICAgICAgIHJldHVybiB0aGlzLnN1YlZpZXdzWyBzdWJWaWV3TmFtZSBdXG4gICAgICAgICAgICA/IHRoaXMuc3ViVmlld3NbIHN1YlZpZXdOYW1lIF0ub25OYXZpZ2F0aW9uKCB0aGlzLnBhdGggKVxuICAgICAgICAgICAgOiB0aGlzLnN1YlZpZXdzWyBzdWJWaWV3TmFtZSBdID0gdGhpcy5mYWN0b3J5LmNyZWF0ZSggc3ViVmlld05hbWUsIHsgcGF0aDogeyB2YWx1ZTogdGhpcy5wYXRoLCB3cml0YWJsZTogdHJ1ZSB9LCBpbnNlcnRpb246IHsgdmFsdWU6IHsgZWw6IHRoaXMuZWxzLmNvbnRhaW5lciwgbWV0aG9kOiAnaW5zZXJ0QmVmb3JlJyB9IH0gfSApXG4gICAgfSxcblxuICAgIHJlcXVpcmVzTG9naW46IHRydWVcbn0gKVxuIiwibW9kdWxlLmV4cG9ydHMgPSBPYmplY3QuYXNzaWduKCB7fSwgcmVxdWlyZSgnLi9fX3Byb3RvX18nKSwge1xuXG4gICAgZXZlbnRzOiB7XG4gICAgICAgIGNvbnRhaW5lcjogJ2NsaWNrJ1xuICAgIH0sXG5cbiAgICBvbkNvbnRhaW5lckNsaWNrKCkge1xuICAgICAgICB0aGlzLmVtaXQoICduYXZpZ2F0ZScsIGAvYWRtaW4vJHt0aGlzLm1vZGVsLmRhdGEuY29sbGVjdGlvbn1gIClcbiAgICB9XG59IClcbiIsIm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmFzc2lnbigge30sIHJlcXVpcmUoJy4vX19wcm90b19fJyksIHtcblxuICAgIGV2ZW50czoge1xuICAgICAgICBlZGl0OiAnY2xpY2snXG4gICAgfSxcblxuICAgIG9uRWRpdENsaWNrKCkge1xuICAgICAgICB0aGlzLmVtaXQoJ2VkaXQnKVxuICAgIH0sXG5cbiAgICB1cGRhdGUoY29taWMpIHtcbiAgICAgICAgdGhpcy5tb2RlbC5kYXRhID0gY29taWNcbiAgICAgICAgdGhpcy5lbHMudGl0bGUudGV4dENvbnRlbnQgPSBjb21pYy50aXRsZVxuICAgICAgICB0aGlzLmVscy5pbWFnZS5zcmMgPSBgJHtjb21pYy5pbWFnZX0/JHtuZXcgRGF0ZSgpLmdldFRpbWUoKX1gXG4gICAgfVxufSApXG4iLCJtb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5hc3NpZ24oIHt9LCByZXF1aXJlKCcuL19fcHJvdG9fXycpLCB7XG5cbiAgICBldmVudHM6IHtcbiAgICAgICAgY2FuY2VsOiAnY2xpY2snLFxuICAgICAgICBzdWJtaXQ6ICdjbGljaydcbiAgICB9LFxuXG4gICAgb25DYW5jZWxDbGljaygpIHsgdGhpcy5oaWRlKCkudGhlbiggKCkgPT4gdGhpcy5lbWl0KCdjYW5jZWxsZWQnKSApIH0sXG4gICAgXG4gICAgb25TdWJtaXRDbGljaygpIHtcbiAgICAgICAgdGhpc1sgYHJlcXVlc3Qke3RoaXMuY2FwaXRhbGl6ZUZpcnN0TGV0dGVyKCB0aGlzLnR5cGUgKX1gIF0oKVxuICAgICAgICAuY2F0Y2goIHRoaXMuRXJyb3IgKVxuICAgIH0sXG5cbiAgICBvbk5hdmlnYXRpb24oIHR5cGUsIGNvbWljICkge1xuICAgICAgICB0aGlzLnR5cGUgPSB0eXBlXG4gICAgICAgIHRoaXMubW9kZWwuZGF0YSA9IGNvbWljXG4gICAgICAgXG4gICAgICAgIHRoaXMucG9wdWxhdGUoKSBcblxuICAgICAgICBpZiggdGhpcy5lbHMuY29udGFpbmVyLmNsYXNzTGlzdC5jb250YWlucygnaGlkZScpICkgdGhpcy5zaG93KClcbiAgICAgICAgXG4gICAgfSxcblxuICAgIHBvcHVsYXRlKCkge1xuICAgICAgICB0aGlzLmVscy5oZWFkZXIudGV4dENvbnRlbnQgPSBgJHt0aGlzLmNhcGl0YWxpemVGaXJzdExldHRlciggdGhpcy50eXBlICl9IENvbWljYFxuXG4gICAgICAgIGlmKCBPYmplY3Qua2V5cyggdGhpcy5tb2RlbC5kYXRhICkubGVuZ3RoICkge1xuICAgICAgICAgICAgdGhpcy5lbHMudGl0bGUudmFsdWUgPSB0aGlzLm1vZGVsLmRhdGEudGl0bGUgfHwgJydcbiAgICAgICAgICAgIHRoaXMuZWxzLnByZXZpZXcuc3JjID0gdGhpcy5tb2RlbC5kYXRhLmltYWdlXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmVscy50aXRsZS52YWx1ZSA9ICcnXG4gICAgICAgICAgICB0aGlzLmVscy5wcmV2aWV3LnNyYyA9ICcnXG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgcG9zdFJlbmRlcigpIHtcbiAgICAgICAgdGhpcy5zcGlubmVyID0gbmV3IHRoaXMuU3Bpbm5lcigge1xuICAgICAgICAgICAgY29sb3I6ICcjZmZmJyxcbiAgICAgICAgICAgIGxlbmd0aDogMTUsXG4gICAgICAgICAgICBzY2FsZTogMC4yNSxcbiAgICAgICAgICAgIHdpZHRoOiA1XG4gICAgICAgIH0gKS5zcGluKClcblxuICAgICAgICB0aGlzLnBvcHVsYXRlKClcblxuICAgICAgICB0aGlzLmVscy5pbWFnZS5hZGRFdmVudExpc3RlbmVyKCAnY2hhbmdlJywgZSA9PiB7XG4gICAgICAgICAgICBjb25zdCBiYXNlNjRSZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpLFxuICAgICAgICAgICAgICAgICAgYmluYXJ5UmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKVxuICAgICAgICAgICAgXG4gICAgICAgICAgICB0aGlzLmVscy51cGxvYWQuY2xhc3NMaXN0LmFkZCgnaGFzLXNwaW5uZXInKVxuICAgICAgICAgICAgdGhpcy5lbHMudXBsb2FkLmFwcGVuZENoaWxkKCB0aGlzLnNwaW5uZXIuc3BpbigpLmVsIClcblxuICAgICAgICAgICAgYmFzZTY0UmVhZGVyLm9ubG9hZCA9ICggZXZ0ICkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuZmlsZSA9IGV2dC50YXJnZXQucmVzdWx0XG4gICAgICAgICAgICAgICAgdGhpcy5lbHMudXBsb2FkLmNsYXNzTGlzdC5yZW1vdmUoJ2hhcy1zcGlubmVyJylcbiAgICAgICAgICAgICAgICB0aGlzLnNwaW5uZXIuc3RvcCgpXG4gICAgICAgICAgICAgICAgdGhpcy5lbHMucHJldmlldy5zcmMgPSBldnQudGFyZ2V0LnJlc3VsdCBcbiAgICAgICAgICAgICAgICBiaW5hcnlSZWFkZXIub25sb2FkID0gZXZlbnQgPT4gdGhpcy5iaW5hcnlGaWxlID0gZXZlbnQudGFyZ2V0LnJlc3VsdFxuICAgICAgICAgICAgICAgIGJpbmFyeVJlYWRlci5yZWFkQXNBcnJheUJ1ZmZlciggZS50YXJnZXQuZmlsZXNbMF0gKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBiYXNlNjRSZWFkZXIucmVhZEFzRGF0YVVSTCggZS50YXJnZXQuZmlsZXNbMF0gKVxuICAgICAgICB9IClcbiAgICAgICAgICAgIFxuICAgICAgICByZXR1cm4gdGhpc1xuICAgIH0sXG5cbiAgICByZXF1ZXN0QWRkKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5YaHIoIHsgbWV0aG9kOiAnUE9TVCcsIHJlc291cmNlOiAnZmlsZScsIGRhdGE6IHRoaXMuYmluYXJ5RmlsZSwgaGVhZGVyczogeyBjb250ZW50VHlwZTogJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbScgfSB9IClcbiAgICAgICAgLnRoZW4oIHJlc3BvbnNlID0+IHRoaXMuWGhyKCB7IG1ldGhvZDogJ1BPU1QnLCByZXNvdXJjZTogJ2NvbWljJywgZGF0YTogSlNPTi5zdHJpbmdpZnkoIHsgdGl0bGU6IHRoaXMuZWxzLnRpdGxlLnZhbHVlLCBpbWFnZTogcmVzcG9uc2UucGF0aCB9ICkgfSApIClcbiAgICAgICAgLnRoZW4oIHJlc3BvbnNlID0+IHRoaXMuaGlkZSgpLnRoZW4oICgpID0+IHRoaXMuZW1pdCggJ2FkZGVkJywgcmVzcG9uc2UgKSApIClcbiAgICB9LFxuXG4gICAgcmVxdWVzdEVkaXQoKSB7XG4gICAgICAgIGxldCBkYXRhID0geyB0aXRsZTogdGhpcy5lbHMudGl0bGUudmFsdWUgfVxuXG4gICAgICAgIHJldHVybiAoICggdGhpcy5iaW5hcnlGaWxlIClcbiAgICAgICAgICAgID8gdGhpcy5YaHIoIHsgbWV0aG9kOiAnUEFUQ0gnLCByZXNvdXJjZTogYGZpbGUvJHt0aGlzLm1vZGVsLmRhdGEuaW1hZ2Uuc3BsaXQoJy8nKVszXX1gLCBkYXRhOiB0aGlzLmJpbmFyeUZpbGUsIGhlYWRlcnM6IHsgY29udGVudFR5cGU6ICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nIH0gfSApXG4gICAgICAgICAgICA6IFByb21pc2UucmVzb2x2ZSgpIClcbiAgICAgICAgLnRoZW4oICgpID0+IHRoaXMuWGhyKCB7IG1ldGhvZDogJ1BBVENIJywgcmVzb3VyY2U6IGBjb21pYy8ke3RoaXMubW9kZWwuZGF0YS5faWR9YCwgZGF0YTogSlNPTi5zdHJpbmdpZnkoIGRhdGEgKSB9ICkgKVxuICAgICAgICAudGhlbiggcmVzcG9uc2UgPT4gdGhpcy5oaWRlKCkudGhlbiggKCkgPT4gdGhpcy5lbWl0KCAnZWRpdGVkJywgcmVzcG9uc2UgKSApIClcbiAgICB9XG59IClcbiIsIm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmFzc2lnbigge30sIHJlcXVpcmUoJy4vX19wcm90b19fJyksIHtcblxuICAgIGNyZWF0ZUNvbWljVmlldyggY29taWMgKSB7XG4gICAgICAgIHRoaXMudmlld3NbIGNvbWljLl9pZCBdID0gdGhpcy5mYWN0b3J5LmNyZWF0ZShcbiAgICAgICAgICAgICdDb21pYycsXG4gICAgICAgICAgICB7IGluc2VydGlvbjogeyB2YWx1ZTogeyBlbDogdGhpcy5lbHMubGlzdCB9IH0sXG4gICAgICAgICAgICAgIG1vZGVsOiB7IHZhbHVlOiB7IGRhdGE6IGNvbWljIH0gfVxuICAgICAgICAgICAgfVxuICAgICAgICApXG5cbiAgICAgICAgdGhpcy52aWV3c1sgY29taWMuX2lkIF0ub24oICdlZGl0JywgKCkgPT4gdGhpcy5lbWl0KCAnbmF2aWdhdGUnLCBgL2FkbWluL2NvbWljL2VkaXQvJHtjb21pYy5faWR9YCkgKVxuICAgIH0sXG5cbiAgICBldmVudHM6IHtcbiAgICAgICAgYWRkQnRuOiAnY2xpY2snXG4gICAgfSxcblxuICAgIG1hbmFnZUNvbWljKCB0eXBlLCBjb21pYyApIHtcbiAgICAgICAgdGhpcy52aWV3cy5Db21pY01hbmFnZSBcbiAgICAgICAgICAgID8gdGhpcy52aWV3cy5Db21pY01hbmFnZS5vbk5hdmlnYXRpb24oIHR5cGUsIGNvbWljIClcbiAgICAgICAgICAgIDogdGhpcy52aWV3cy5Db21pY01hbmFnZSA9XG4gICAgICAgICAgICAgICAgdGhpcy5mYWN0b3J5LmNyZWF0ZSggJ0NvbWljTWFuYWdlJywgeyB0eXBlOiB7IHZhbHVlOiB0eXBlLCB3cml0YWJsZTogdHJ1ZSB9LCBtb2RlbDogeyB2YWx1ZTogeyBkYXRhOiBjb21pYyB8fCB7fSB9IH0sIGluc2VydGlvbjogeyB2YWx1ZTogeyBlbDogdGhpcy5lbHMuY29udGFpbmVyLCBtZXRob2Q6ICdpbnNlcnRCZWZvcmUnIH0gfSB9IClcbiAgICAgICAgICAgICAgICAub24oICdhZGRlZCcsIGNvbWljID0+IHsgdGhpcy5jcmVhdGVDb21pY1ZpZXcoY29taWMpOyB0aGlzLmVtaXQoICduYXZpZ2F0ZScsIGAvYWRtaW4vY29taWNgICk7IH0gKVxuICAgICAgICAgICAgICAgIC5vbiggJ2VkaXRlZCcsIGNvbWljID0+IHsgdGhpcy52aWV3c1sgY29taWMuX2lkIF0udXBkYXRlKCBjb21pYyApOyB0aGlzLmVtaXQoICduYXZpZ2F0ZScsIGAvYWRtaW4vY29taWNgICk7IH0gKVxuICAgICAgICAgICAgICAgIC5vbiggJ2NhbmNlbGxlZCcsICgpID0+IHRoaXMuZW1pdCggJ25hdmlnYXRlJywgYC9hZG1pbi9jb21pY2AgKSApXG4gICAgfSxcblxuICAgIG9uQWRkQnRuQ2xpY2soKSB7IHRoaXMuZW1pdCggJ25hdmlnYXRlJywgYC9hZG1pbi9jb21pYy9hZGRgICkgfSxcblxuICAgIG9uTmF2aWdhdGlvbiggcGF0aCApIHtcbiAgICAgICAgdGhpcy5wYXRoID0gcGF0aDtcblxuICAgICAgICAoIHBhdGgubGVuZ3RoID09PSAyICYmIHRoaXMuZWxzLmNvbnRhaW5lci5jbGFzc0xpc3QuY29udGFpbnMoJ2hpZGUnKSApIFxuICAgICAgICAgICAgPyB0aGlzLnNob3coKVxuICAgICAgICAgICAgOiBwYXRoLmxlbmd0aCA9PT0gM1xuICAgICAgICAgICAgICAgID8gdGhpcy5oaWRlKCkudGhlbiggKCkgPT4gdGhpcy5tYW5hZ2VDb21pYyggcGF0aFsyXSwgeyB9ICkgKVxuICAgICAgICAgICAgICAgIDogcGF0aC5sZW5ndGggPT09IDRcbiAgICAgICAgICAgICAgICAgICAgID8gdGhpcy5oaWRlKCkudGhlbiggKCkgPT4gdGhpcy5tYW5hZ2VDb21pYyggcGF0aFsyXSwgdGhpcy52aWV3c1sgcGF0aFszXSBdLm1vZGVsLmRhdGEgKSApXG4gICAgICAgICAgICAgICAgICAgICA6IHVuZGVmaW5lZFxuICAgIH0sXG5cbiAgICBwb3N0UmVuZGVyKCkge1xuXG4gICAgICAgIGlmKCB0aGlzLnBhdGgubGVuZ3RoID4gMiApIHtcbiAgICAgICAgICAgIHRoaXMuZWxzLmNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCAnaGlkZGVuJywgJ2hpZGUnIClcbiAgICAgICAgICAgIGlmKCB0aGlzLnBhdGhbMl0gPT09IFwiYWRkXCIgKSB7IHRoaXMubWFuYWdlQ29taWMoIFwiYWRkXCIsIHsgfSApIH1cbiAgICAgICAgICAgIGVsc2UgaWYoIHRoaXMucGF0aFsyXSA9PT0gXCJlZGl0XCIgJiYgdGhpcy5wYXRoWzNdICkge1xuICAgICAgICAgICAgICAgIHRoaXMuWGhyKCB7IG1ldGhvZDogXCJnZXRcIiwgcmVzb3VyY2U6IGBjb21pYy8ke3RoaXMucGF0aFszXX1gIH0gKVxuICAgICAgICAgICAgICAgIC50aGVuKCByZXNwb25zZSA9PiB0aGlzLm1hbmFnZUNvbWljKCBcImVkaXRcIiwgcmVzcG9uc2UgKSApXG4gICAgICAgICAgICAgICAgLmNhdGNoKCBlID0+IHsgdGhpcy5FcnJvcihlKTsgdGhpcy5lbWl0KCAnbmF2aWdhdGUnLCBgL2FkbWluL2NvbWljYCApIH0gKVxuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYoIHRoaXMucGF0aC5sZW5ndGggPT09IDEgJiYgdGhpcy52aWV3cy5Db21pY01hbmFnZSApIHtcbiAgICAgICAgICAgIHRoaXMudmlld3MuQ29taWNNYW5hZ2UuaGlkZSgpXG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmNvbWljcyA9IE9iamVjdC5jcmVhdGUoIHRoaXMuTW9kZWwsIHsgcmVzb3VyY2U6IHsgdmFsdWU6ICdjb21pYycgfSB9IClcblxuICAgICAgICB0aGlzLmNvbWljcy5nZXQoKVxuICAgICAgICAudGhlbiggKCkgPT4gUHJvbWlzZS5yZXNvbHZlKCB0aGlzLmNvbWljcy5kYXRhLmZvckVhY2goIGNvbWljID0+IHRoaXMuY3JlYXRlQ29taWNWaWV3KCBjb21pYyApICkgKSApXG4gICAgICAgIC5jYXRjaCggdGhpcy5FcnJvciApXG5cbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICB9LFxuXG4gICAgcmVxdWlyZXNMb2dpbjogdHJ1ZVxufSApXG4iLCJtb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5hc3NpZ24oIHt9LCByZXF1aXJlKCcuL19fcHJvdG9fXycpLCB7XG5cbiAgICBldmVudHM6IHtcbiAgICAgICAgc2lnbm91dEJ0bjogJ2NsaWNrJ1xuICAgIH0sXG5cbiAgICBvblVzZXIoKSB7XG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgfSxcblxuICAgIHJlcXVpcmVzTG9naW46IGZhbHNlLFxuICAgIFxuICAgIHNpZ25vdXQoKSB7XG5cbiAgICAgICAgZG9jdW1lbnQuY29va2llID0gYCR7d2luZG93LmNvb2tpZU5hbWV9PTsgZXhwaXJlcz1UaHUsIDAxIEphbiAxOTcwIDAwOjAwOjAxIEdNVDtgO1xuXG4gICAgICAgIHRoaXMudXNlci5kYXRhID0geyB9XG5cbiAgICAgICAgdGhpcy5lbWl0KCdzaWdub3V0JylcblxuICAgIH1cblxufSApXG4iLCJtb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5hc3NpZ24oIHt9LCByZXF1aXJlKCcuL19fcHJvdG9fXycpLCB7XG5cbiAgICBmZXRjaEFuZERpc3BsYXkoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldERhdGEoKVxuICAgICAgICAudGhlbiggcmVzcG9uc2UgPT4gXG4gICAgICAgICAgICByZXNwb25zZS5mb3JFYWNoKCBjb21pYyA9PlxuICAgICAgICAgICAgICAgIHRoaXMudmlld3NbIGNvbWljLl9pZCBdID1cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5mYWN0b3J5LmNyZWF0ZSggJ2NvbWljJywgeyBpbnNlcnRpb246IHsgdmFsdWU6IHsgZWw6IHRoaXMuZWxzLmNvbnRhaW5lciB9IH0sIG1vZGVsOiB7IHZhbHVlOiB7IGRhdGE6IGNvbWljIH0gfSB9IClcbiAgICAgICAgICAgIClcbiAgICAgICAgKVxuICAgIH0sXG5cbiAgICBnZXREYXRhKCkge1xuICAgICAgICBpZiggIXRoaXMubW9kZWwgKSB0aGlzLm1vZGVsID0gT2JqZWN0LmNyZWF0ZSggdGhpcy5Nb2RlbCwgeyBwYWdpbmF0aW9uOiB7IHZhbHVlOiB7IHNraXA6IDAsIGxpbWl0OjEwLCBzb3J0OiB7IGNyZWF0ZWQ6IC0xIH0gfSB9LCByZXNvdXJjZTogeyB2YWx1ZTogJ2NvbWljJyB9IH0gKVxuXG4gICAgICAgIHJldHVybiB0aGlzLm1vZGVsLmdldCgpXG4gICAgfSxcblxuICAgIG5hdmlnYXRlKCkge1xuICAgICAgICB0aGlzLnNob3coKVxuICAgIH0sXG5cbiAgICBwb3N0UmVuZGVyKCkge1xuICAgICAgICB0aGlzLmZldGNoQW5kRGlzcGxheSgpLmNhdGNoKCB0aGlzLkVycm9yIClcbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICB9XG5cbn0gKVxuIiwibW9kdWxlLmV4cG9ydHMgPSBPYmplY3QuYXNzaWduKCB7fSwgcmVxdWlyZSgnLi9fX3Byb3RvX18nKSwge1xuICAgIFxuICAgIGV2ZW50czoge1xuICAgICAgICBzdWJtaXQ6ICdjbGljaydcbiAgICB9LFxuXG4gICAgb25TdWJtaXRDbGljaygpIHtcbiAgICAgICAgdGhpcy5YaHIoIHsgbWV0aG9kOiAncG9zdCcsIHJlc291cmNlOiAnYXV0aCcsIGRhdGE6IEpTT04uc3RyaW5naWZ5KCB7IHVzZXJuYW1lOiB0aGlzLmVscy51c2VybmFtZS52YWx1ZSwgcGFzc3dvcmQ6IHRoaXMuZWxzLnBhc3N3b3JkLnZhbHVlIH0gKSB9IClcbiAgICAgICAgLnRoZW4oICgpID0+IHRoaXMudXNlci5nZXQoKSApXG4gICAgICAgIC50aGVuKCAoKSA9PiB0aGlzLmhpZGUoKSApXG4gICAgICAgIC50aGVuKCAoKSA9PiBQcm9taXNlLnJlc29sdmUoIHRoaXMuZW1pdCggJ2xvZ2dlZEluJyApKSApXG4gICAgICAgIC5jYXRjaCggdGhpcy5FcnJvciApXG4gICAgfVxufSApXG4iLCJtb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5hc3NpZ24oIHt9LCByZXF1aXJlKCcuL19fcHJvdG9fXycpLCB7XG5cbiAgICBldmVudHM6IHtcbiAgICAgICAgZWRpdDogJ2NsaWNrJ1xuICAgIH0sXG5cbiAgICBnZXRUZW1wbGF0ZU9wdGlvbnMoKSB7XG4gICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKCByZXF1aXJlKCcuL19fcHJvdG9fXycpLmdldFRlbXBsYXRlT3B0aW9ucy5jYWxsKHRoaXMpLCB7IHVzZXI6IHRoaXMudXNlci5kYXRhIH0gKVxuICAgIH0sXG5cbiAgICBvbkVkaXRDbGljaygpIHtcbiAgICAgICAgdGhpcy5lbWl0KCdlZGl0JylcbiAgICB9LFxuXG4gICAgdXBkYXRlKHVzZXIpIHtcbiAgICAgICAgdGhpcy51c2VyLmRhdGEgPSB1c2VyXG4gICAgICAgIHRoaXMuZWxzLnVzZXJuYW1lLnRleHRDb250ZW50ID0gdXNlci51c2VybmFtZVxuICAgIH1cblxufSApXG4iLCJtb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5hc3NpZ24oIHt9LCByZXF1aXJlKCcuL19fcHJvdG9fXycpLCB7XG5cbiAgICBldmVudHM6IHtcbiAgICAgICAgY2FuY2VsOiAnY2xpY2snLFxuICAgICAgICBzdWJtaXQ6ICdjbGljaydcbiAgICB9LFxuXG4gICAgb25DYW5jZWxDbGljaygpIHsgdGhpcy5oaWRlKCkudGhlbiggKCkgPT4gdGhpcy5lbWl0KCdjYW5jZWxsZWQnKSApIH0sXG4gICAgXG4gICAgb25TdWJtaXRDbGljaygpIHtcbiAgICAgICAgdGhpc1sgYHJlcXVlc3Qke3RoaXMuY2FwaXRhbGl6ZUZpcnN0TGV0dGVyKCB0aGlzLnR5cGUgKX1gIF0oKVxuICAgICAgICAuY2F0Y2goIHRoaXMuRXJyb3IgKVxuICAgIH0sXG5cbiAgICBvbk5hdmlnYXRpb24oIHR5cGUsIGNvbWljICkge1xuICAgICAgICB0aGlzLnR5cGUgPSB0eXBlXG4gICAgICAgIHRoaXMubW9kZWwuZGF0YSA9IGNvbWljXG4gICAgICAgXG4gICAgICAgIHRoaXMucG9wdWxhdGUoKSBcbiAgICB9LFxuXG4gICAgcG9wdWxhdGUoKSB7XG4gICAgICAgIHRoaXMuZWxzLnRpdGxlLnRleHRDb250ZW50ID0gYCR7dGhpcy5jYXBpdGFsaXplRmlyc3RMZXR0ZXIoIHRoaXMudHlwZSApfSBVc2VyYFxuXG4gICAgICAgIHRoaXMuZWxzLnVzZXJuYW1lLnZhbHVlID0gT2JqZWN0LmtleXMoIHRoaXMubW9kZWwuZGF0YSApLmxlbmd0aCA/IHRoaXMuZWxzLnVzZXJuYW1lLnZhbHVlIDogJydcbiAgICAgICAgdGhpcy5lbHMudXNlcm5hbWUucGFzc3dvcmQgPSAnJ1xuICAgIH0sXG5cbiAgICBwb3N0UmVuZGVyKCkge1xuICAgICAgICB0aGlzLnBvcHVsYXRlKCkgXG4gICAgICAgICAgICBcbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICB9LFxuXG4gICAgcmVxdWVzdEFkZCgpIHtcbiAgICAgICAgaWYoIHRoaXMuZWxzLnBhc3N3b3JkLnZhbHVlLmxlbmd0aCA9PT0gMCApIHJldHVyblxuICAgICAgICByZXR1cm4gdGhpcy5YaHIoIHsgbWV0aG9kOiAnUE9TVCcsIHJlc291cmNlOiAndXNlcicsIGRhdGE6IEpTT04uc3RyaW5naWZ5KCB7IHVzZXJuYW1lOiB0aGlzLmVscy51c2VybmFtZS52YWx1ZSwgcGFzc3dvcmQ6IHRoaXMuZWxzLnBhc3N3b3JkLnZhbHVlIH0gKSB9IClcbiAgICAgICAgLnRoZW4oIHJlc3BvbnNlID0+IHRoaXMuaGlkZSgpLnRoZW4oICgpID0+IHRoaXMuZW1pdCggJ2FkZGVkJywgeyBfaWQ6IHJlc3BvbnNlLl9pZCwgdXNlcm5hbWU6IHJlc3BvbnNlLnVzZXJuYW1lIH0gKSApIClcbiAgICB9LFxuXG4gICAgcmVxdWVzdEVkaXQoKSB7XG4gICAgICAgIGxldCBkYXRhID0geyB1c2VybmFtZTogdGhpcy5lbHMudXNlcm5hbWUudmFsdWUgfVxuXG4gICAgICAgIGlmKCB0aGlzLmVscy5wYXNzd29yZC52YWx1ZS5sZW5ndGggKSBkYXRhLnBhc3N3b3JkID0gdGhpcy5lbHMucGFzc3dvcmQudmFsdWVcbiAgICAgICAgcmV0dXJuIHRoaXMuWGhyKCB7IG1ldGhvZDogJ1BBVENIJywgcmVzb3VyY2U6IGB1c2VyLyR7dGhpcy51c2VyLmRhdGEuX2lkfWAsIGRhdGE6IEpTT04uc3RyaW5naWZ5KCBkYXRhICkgfSApXG4gICAgICAgIC50aGVuKCByZXNwb25zZSA9PiB0aGlzLmhpZGUoKS50aGVuKCAoKSA9PiB0aGlzLmVtaXQoICdlZGl0ZWQnLCB7IF9pZDogcmVzcG9uc2UuX2lkLCB1c2VybmFtZTogcmVzcG9uc2UudXNlcm5hbWUgfSApICkgKVxuICAgIH1cbn0gKVxuIiwibW9kdWxlLmV4cG9ydHMgPSBPYmplY3QuYXNzaWduKCB7fSwgcmVxdWlyZSgnLi9fX3Byb3RvX18nKSwge1xuXG4gICAgY3JlYXRlVXNlclZpZXcoIHVzZXIgKSB7XG4gICAgICAgIHRoaXMudmlld3NbIHVzZXIuX2lkIF0gPSB0aGlzLmZhY3RvcnkuY3JlYXRlKFxuICAgICAgICAgICAgJ1VzZXInLFxuICAgICAgICAgICAgeyBpbnNlcnRpb246IHsgdmFsdWU6IHsgZWw6IHRoaXMuZWxzLmxpc3QgfSB9LFxuICAgICAgICAgICAgICBtb2RlbDogeyB2YWx1ZTogeyBkYXRhOiB1c2VyIH0gfVxuICAgICAgICAgICAgfVxuICAgICAgICApXG5cbiAgICAgICAgdGhpcy52aWV3c1sgdXNlci5faWQgXS5vbiggJ2VkaXQnLCAoKSA9PiB0aGlzLm1hbmFnZVVzZXIoJ2VkaXQnLCB1c2VyKSApXG4gICAgfSxcblxuICAgIGV2ZW50czoge1xuICAgICAgICBhZGRCdG46ICdjbGljaydcbiAgICB9LFxuXG4gICAgbWFuYWdlVXNlciggdHlwZSwgdXNlciApIHtcbiAgICAgICAgdGhpcy5oaWRlKCkudGhlbiggKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy52aWV3cy5Vc2VyTWFuYWdlIFxuICAgICAgICAgICAgICAgID8gdGhpcy52aWV3cy5Vc2VyTWFuYWdlLm9uTmF2aWdhdGlvbiggdHlwZSwgdXNlciApXG4gICAgICAgICAgICAgICAgOiB0aGlzLnZpZXdzLlVzZXJNYW5hZ2UgPVxuICAgICAgICAgICAgICAgICAgICB0aGlzLmZhY3RvcnkuY3JlYXRlKCAnVXNlck1hbmFnZScsIHsgdHlwZTogeyB2YWx1ZTogdHlwZSwgd3JpdGFibGU6IHRydWUgfSwgbW9kZWw6IHsgdmFsdWU6IHsgZGF0YTogdXNlciB8fCB7fSB9IH0sIGluc2VydGlvbjogeyB2YWx1ZTogeyBlbDogdGhpcy5lbHMuY29udGFpbmVyLCBtZXRob2Q6ICdpbnNlcnRCZWZvcmUnIH0gfSB9IClcbiAgICAgICAgICAgICAgICAgICAgLm9uKCAnYWRkZWQnLCB1c2VyID0+IHsgdGhpcy5jcmVhdGVVc2VyVmlldyh1c2VyKTsgdGhpcy5zaG93KCkgfSApXG4gICAgICAgICAgICAgICAgICAgIC5vbiggJ2VkaXRlZCcsIHVzZXIgPT4geyB0aGlzLnZpZXdzWyB1c2VyLl9pZCBdLnVwZGF0ZSggdXNlciApOyB0aGlzLnNob3coKSB9IClcbiAgICAgICAgICAgICAgICAgICAgLm9uKCAnY2FuY2VsbGVkJywgKCkgPT4gdGhpcy5zaG93KCkgKVxuICAgICAgICB9IClcbiAgICB9LFxuXG4gICAgb25BZGRCdG5DbGljaygpIHsgdGhpcy5tYW5hZ2VVc2VyKCdhZGQnICkgfSxcblxuICAgIG9uTmF2aWdhdGlvbiggcGF0aCApIHtcbiAgICAgICAgaWYoIHRoaXMuZWxzLmNvbnRhaW5lci5jbGFzc0xpc3QuY29udGFpbnMoJ2hpZGUnKSApIHJldHVybiB0aGlzLnNob3coKVxuICAgIH0sXG5cbiAgICBwb3N0UmVuZGVyKCkge1xuICAgICAgICB0aGlzLnVzZXJzID0gT2JqZWN0LmNyZWF0ZSggdGhpcy5Nb2RlbCwgeyByZXNvdXJjZTogeyB2YWx1ZTogJ3VzZXInIH0gfSApXG5cbiAgICAgICAgdGhpcy51c2Vycy5nZXQoKVxuICAgICAgICAudGhlbiggKCkgPT4gUHJvbWlzZS5yZXNvbHZlKCB0aGlzLnVzZXJzLmRhdGEuZm9yRWFjaCggdXNlciA9PiB0aGlzLmNyZWF0ZVVzZXJWaWV3KCB1c2VyICkgKSApIClcbiAgICAgICAgLmNhdGNoKCB0aGlzLkVycm9yIClcblxuICAgICAgICByZXR1cm4gdGhpc1xuICAgIH0sXG5cbiAgICByZXF1aXJlc0xvZ2luOiB0cnVlXG59IClcbiIsIm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmFzc2lnbiggeyB9LCByZXF1aXJlKCcuLi8uLi8uLi9saWIvTXlPYmplY3QnKSwgcmVxdWlyZSgnZXZlbnRzJykuRXZlbnRFbWl0dGVyLnByb3RvdHlwZSwge1xuXG4gICAgTW9kZWw6IHJlcXVpcmUoJy4uL21vZGVscy9fX3Byb3RvX18uanMnKSxcblxuICAgIE9wdGltaXplZFJlc2l6ZTogcmVxdWlyZSgnLi9saWIvT3B0aW1pemVkUmVzaXplJyksXG4gICAgXG4gICAgU3Bpbm5lcjogcmVxdWlyZSgnLi9saWIvU3BpbicpLFxuICAgIFxuICAgIFhocjogcmVxdWlyZSgnLi4vWGhyJyksXG5cbiAgICBiaW5kRXZlbnQoIGtleSwgZXZlbnQgKSB7XG4gICAgICAgIHZhciBlbHMgPSBBcnJheS5pc0FycmF5KCB0aGlzLmVsc1sga2V5IF0gKSA/IHRoaXMuZWxzWyBrZXkgXSA6IFsgdGhpcy5lbHNbIGtleSBdIF1cbiAgICAgICAgZWxzLmZvckVhY2goIGVsID0+IGVsLmFkZEV2ZW50TGlzdGVuZXIoIGV2ZW50IHx8ICdjbGljaycsIGUgPT4gdGhpc1sgYG9uJHt0aGlzLmNhcGl0YWxpemVGaXJzdExldHRlcihrZXkpfSR7dGhpcy5jYXBpdGFsaXplRmlyc3RMZXR0ZXIoZXZlbnQpfWAgXSggZSApICkgKVxuICAgIH0sXG5cbiAgICBjYXBpdGFsaXplRmlyc3RMZXR0ZXI6IHN0cmluZyA9PiBzdHJpbmcuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBzdHJpbmcuc2xpY2UoMSksXG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcblxuICAgICAgICBpZiggdGhpcy5zaXplICkgdGhpcy5PcHRpbWl6ZWRSZXNpemUuYWRkKCB0aGlzLnNpemUgKTtcblxuICAgICAgICBpZiggdGhpcy5yZXF1aXJlc0xvZ2luICYmICghdGhpcy51c2VyLmRhdGEgfHwgIXRoaXMudXNlci5kYXRhLl9pZCApICkgcmV0dXJuIHRoaXMuaGFuZGxlTG9naW4oKVxuXG4gICAgICAgIGlmKCB0aGlzLnVzZXIuZGF0YSAmJiB0aGlzLnVzZXIuZGF0YS5pZCAmJiB0aGlzLnJlcXVpcmVzUm9sZSAmJiAhdGhpcy5oYXNQcml2aWxlZ2VzKCkgKSByZXR1cm4gdGhpcy5zaG93Tm9BY2Nlc3MoKVxuICAgICAgICBcbiAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oIHRoaXMsIHsgZWxzOiB7IH0sIHNsdXJwOiB7IGF0dHI6ICdkYXRhLWpzJywgdmlldzogJ2RhdGEtdmlldycgfSwgdmlld3M6IHsgfSB9ICkucmVuZGVyKClcbiAgICB9LFxuXG4gICAgZGVsZWdhdGVFdmVudHMoIGtleSwgZWwgKSB7XG4gICAgICAgIHZhciB0eXBlID0gdHlwZW9mIHRoaXMuZXZlbnRzW2tleV1cblxuICAgICAgICBpZiggdHlwZSA9PT0gXCJzdHJpbmdcIiApIHsgdGhpcy5iaW5kRXZlbnQoIGtleSwgdGhpcy5ldmVudHNba2V5XSApIH1cbiAgICAgICAgZWxzZSBpZiggQXJyYXkuaXNBcnJheSggdGhpcy5ldmVudHNba2V5XSApICkge1xuICAgICAgICAgICAgdGhpcy5ldmVudHNbIGtleSBdLmZvckVhY2goIGV2ZW50T2JqID0+IHRoaXMuYmluZEV2ZW50KCBrZXksIGV2ZW50T2JqLmV2ZW50ICkgKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5iaW5kRXZlbnQoIGtleSwgdGhpcy5ldmVudHNba2V5XS5ldmVudCApXG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgZGVsZXRlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5oaWRlKClcbiAgICAgICAgLnRoZW4oICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZWxzLmNvbnRhaW5lci5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKCB0aGlzLmVscy5jb250YWluZXIgKTtcbiAgICAgICAgICAgIHJlc29sdmUoIHRoaXMuZW1pdCgncmVtb3ZlZCcpIClcbiAgICAgICAgfSApXG4gICAgfSxcblxuICAgIGV2ZW50czoge30sXG5cbiAgICBnZXREYXRhKCkge1xuICAgICAgICBpZiggIXRoaXMubW9kZWwgKSB0aGlzLm1vZGVsID0gT2JqZWN0LmNyZWF0ZSggdGhpcy5Nb2RlbCwgeyByZXNvdXJjZTogeyB2YWx1ZTogdGhpcy5uYW1lIH0gfSApXG5cbiAgICAgICAgcmV0dXJuIHRoaXMubW9kZWwuZ2V0KClcbiAgICB9LFxuXG4gICAgZ2V0VGVtcGxhdGVPcHRpb25zKCkgeyByZXR1cm4gKHRoaXMubW9kZWwpID8gdGhpcy5tb2RlbC5kYXRhIDoge30gfSxcblxuICAgIGhhbmRsZUxvZ2luKCkge1xuICAgICAgICB0aGlzLmZhY3RvcnkuY3JlYXRlKCAnbG9naW4nLCB7IGluc2VydGlvbjogeyB2YWx1ZTogeyBlbDogZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2NvbnRlbnQnKSB9IH0gfSApXG4gICAgICAgICAgICAub25jZSggXCJsb2dnZWRJblwiLCAoKSA9PiB0aGlzLm9uTG9naW4oKSApXG5cbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICB9LFxuXG4gICAgaGFzUHJpdmlsZWdlKCkge1xuICAgICAgICAoIHRoaXMucmVxdWlyZXNSb2xlICYmICggdGhpcy51c2VyLmdldCgncm9sZXMnKS5maW5kKCByb2xlID0+IHJvbGUgPT09IHRoaXMucmVxdWlyZXNSb2xlICkgPT09IFwidW5kZWZpbmVkXCIgKSApID8gZmFsc2UgOiB0cnVlXG4gICAgfSxcblxuICAgIGhpZGUoKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSggcmVzb2x2ZSA9PiB7XG4gICAgICAgICAgICB0aGlzLmVscy5jb250YWluZXIuY2xhc3NMaXN0LmFkZCgnaGlkZScpXG4gICAgICAgICAgICB0aGlzLmVscy5jb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lciggJ3RyYW5zaXRpb25lbmQnLCBlID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmVscy5jb250YWluZXIuY2xhc3NMaXN0LmFkZCgnaGlkZGVuJylcbiAgICAgICAgICAgICAgICByZXNvbHZlKCB0aGlzLmVtaXQoJ2hpZGRlbicpIClcbiAgICAgICAgICAgIH0sIHRydWUgKVxuICAgICAgICB9IClcbiAgICB9LFxuXG4gICAgaHRtbFRvRnJhZ21lbnQoIHN0ciApIHtcbiAgICAgICAgbGV0IHJhbmdlID0gZG9jdW1lbnQuY3JlYXRlUmFuZ2UoKTtcbiAgICAgICAgLy8gbWFrZSB0aGUgcGFyZW50IG9mIHRoZSBmaXJzdCBkaXYgaW4gdGhlIGRvY3VtZW50IGJlY29tZXMgdGhlIGNvbnRleHQgbm9kZVxuICAgICAgICByYW5nZS5zZWxlY3ROb2RlKGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiZGl2XCIpLml0ZW0oMCkpXG4gICAgICAgIHJldHVybiByYW5nZS5jcmVhdGVDb250ZXh0dWFsRnJhZ21lbnQoIHN0ciApXG4gICAgfSxcbiAgICBcbiAgICBpc0hpZGRlbigpIHsgcmV0dXJuIHRoaXMuZWxzLmNvbnRhaW5lci5jc3MoJ2Rpc3BsYXknKSA9PT0gJ25vbmUnIH0sXG5cbiAgICBvbkxvZ2luKCkge1xuICAgICAgICB0aGlzLnJvdXRlci5oZWFkZXIub25Vc2VyKCB0aGlzLnVzZXIgKVxuXG4gICAgICAgIHRoaXNbICggdGhpcy5oYXNQcml2aWxlZ2VzKCkgKSA/ICdyZW5kZXInIDogJ3Nob3dOb0FjY2VzcycgXSgpXG4gICAgfSxcblxuICAgIHNob3dOb0FjY2VzcygpIHtcbiAgICAgICAgYWxlcnQoXCJObyBwcml2aWxlZ2VzLCBzb25cIilcbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICB9LFxuXG4gICAgcG9zdFJlbmRlcigpIHsgcmV0dXJuIHRoaXMgfSxcblxuICAgIHJlbmRlcigpIHtcbiAgICAgICAgdGhpcy5zbHVycFRlbXBsYXRlKCB7IHRlbXBsYXRlOiB0aGlzLnRlbXBsYXRlKCB0aGlzLmdldFRlbXBsYXRlT3B0aW9ucygpICksIGluc2VydGlvbjogdGhpcy5pbnNlcnRpb24gfSApXG5cbiAgICAgICAgaWYoIHRoaXMuc2l6ZSApIHRoaXMuc2l6ZSgpXG5cbiAgICAgICAgcmV0dXJuIHRoaXMucmVuZGVyU3Vidmlld3MoKVxuICAgICAgICAgICAgICAgICAgIC5wb3N0UmVuZGVyKClcbiAgICB9LFxuXG4gICAgcmVuZGVyU3Vidmlld3MoKSB7XG4gICAgICAgIE9iamVjdC5rZXlzKCB0aGlzLlZpZXdzIHx8IFsgXSApLmZvckVhY2goIGtleSA9PiB7XG4gICAgICAgICAgICBpZiggdGhpcy5WaWV3c1sga2V5IF0uZWwgKSB7XG4gICAgICAgICAgICAgICAgbGV0IG9wdHMgPSB0aGlzLlZpZXdzWyBrZXkgXS5vcHRzXG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgb3B0cyA9ICggb3B0cyApXG4gICAgICAgICAgICAgICAgICAgID8gdHlwZW9mIG9wdHMgPT09IFwib2JqZWN0XCJcbiAgICAgICAgICAgICAgICAgICAgICAgID8gb3B0c1xuICAgICAgICAgICAgICAgICAgICAgICAgOiBvcHRzKClcbiAgICAgICAgICAgICAgICAgICAgOiB7fVxuXG4gICAgICAgICAgICAgICAgdGhpcy52aWV3c1sga2V5IF0gPSB0aGlzLmZhY3RvcnkuY3JlYXRlKCBrZXksIE9iamVjdC5hc3NpZ24oIHsgaW5zZXJ0aW9uOiB7IHZhbHVlOiB7IGVsOiB0aGlzLlZpZXdzWyBrZXkgXS5lbCwgbWV0aG9kOiAnaW5zZXJ0QmVmb3JlJyB9IH0gfSwgb3B0cyApIClcbiAgICAgICAgICAgICAgICB0aGlzLlZpZXdzWyBrZXkgXS5lbC5yZW1vdmUoKVxuICAgICAgICAgICAgICAgIHRoaXMuVmlld3NbIGtleSBdLmVsID0gdW5kZWZpbmVkXG4gICAgICAgICAgICB9XG4gICAgICAgIH0gKVxuXG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgfSxcblxuICAgIHNob3coIGR1cmF0aW9uICkge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoIHJlc29sdmUgPT4ge1xuICAgICAgICAgICAgdGhpcy5lbHMuY29udGFpbmVyLmNsYXNzTGlzdC5yZW1vdmUoICdoaWRlJywgJ2hpZGRlbicgKVxuICAgICAgICAgICAgdGhpcy5lbHMuY29udGFpbmVyLmFkZEV2ZW50TGlzdGVuZXIoICd0cmFuc2l0aW9uZW5kJywgZSA9PiB7XG4gICAgICAgICAgICAgICAgaWYoIHRoaXMuc2l6ZSApIHRoaXMuc2l6ZSgpXG4gICAgICAgICAgICAgICAgcmVzb2x2ZSggdGhpcy5lbWl0KCdzaG93bicpIClcbiAgICAgICAgICAgIH0sIHRydWUgKVxuICAgICAgICB9IClcbiAgICB9LFxuXG4gICAgc2x1cnBFbCggZWwgKSB7XG4gICAgICAgIHZhciBrZXkgPSBlbC5nZXRBdHRyaWJ1dGUoIHRoaXMuc2x1cnAuYXR0ciApIHx8ICdjb250YWluZXInXG5cbiAgICAgICAgaWYoIGtleSA9PT0gJ2NvbnRhaW5lcicgKSBlbC5jbGFzc0xpc3QuYWRkKCB0aGlzLm5hbWUgKVxuXG4gICAgICAgIHRoaXMuZWxzWyBrZXkgXSA9IEFycmF5LmlzQXJyYXkoIHRoaXMuZWxzWyBrZXkgXSApXG4gICAgICAgICAgICA/IHRoaXMuZWxzWyBrZXkgXS5wdXNoKCBlbCApXG4gICAgICAgICAgICA6ICggdGhpcy5lbHNbIGtleSBdICE9PSB1bmRlZmluZWQgKVxuICAgICAgICAgICAgICAgID8gWyB0aGlzLmVsc1sga2V5IF0sIGVsIF1cbiAgICAgICAgICAgICAgICA6IGVsXG5cbiAgICAgICAgZWwucmVtb3ZlQXR0cmlidXRlKHRoaXMuc2x1cnAuYXR0cilcblxuICAgICAgICBpZiggdGhpcy5ldmVudHNbIGtleSBdICkgdGhpcy5kZWxlZ2F0ZUV2ZW50cygga2V5LCBlbCApXG4gICAgfSxcblxuICAgIHNsdXJwVGVtcGxhdGUoIG9wdGlvbnMgKSB7XG4gICAgICAgIHZhciBmcmFnbWVudCA9IHRoaXMuaHRtbFRvRnJhZ21lbnQoIG9wdGlvbnMudGVtcGxhdGUgKSxcbiAgICAgICAgICAgIHNlbGVjdG9yID0gYFske3RoaXMuc2x1cnAuYXR0cn1dYCxcbiAgICAgICAgICAgIHZpZXdTZWxlY3RvciA9IGBbJHt0aGlzLnNsdXJwLnZpZXd9XWBcblxuICAgICAgICB0aGlzLnNsdXJwRWwoIGZyYWdtZW50LnF1ZXJ5U2VsZWN0b3IoJyonKSApXG4gICAgICAgIGZyYWdtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoIGAke3NlbGVjdG9yfSwgJHt2aWV3U2VsZWN0b3J9YCApLmZvckVhY2goIGVsID0+XG4gICAgICAgICAgICAoIGVsLmhhc0F0dHJpYnV0ZSggdGhpcy5zbHVycC5hdHRyICkgKSBcbiAgICAgICAgICAgICAgICA/IHRoaXMuc2x1cnBFbCggZWwgKVxuICAgICAgICAgICAgICAgIDogdGhpcy5WaWV3c1sgZWwuZ2V0QXR0cmlidXRlKHRoaXMuc2x1cnAudmlldykgXS5lbCA9IGVsXG4gICAgICAgIClcbiAgICAgICAgICBcbiAgICAgICAgb3B0aW9ucy5pbnNlcnRpb24ubWV0aG9kID09PSAnaW5zZXJ0QmVmb3JlJ1xuICAgICAgICAgICAgPyBvcHRpb25zLmluc2VydGlvbi5lbC5wYXJlbnROb2RlLmluc2VydEJlZm9yZSggZnJhZ21lbnQsIG9wdGlvbnMuaW5zZXJ0aW9uLmVsIClcbiAgICAgICAgICAgIDogb3B0aW9ucy5pbnNlcnRpb24uZWxbIG9wdGlvbnMuaW5zZXJ0aW9uLm1ldGhvZCB8fCAnYXBwZW5kQ2hpbGQnIF0oIGZyYWdtZW50IClcblxuICAgICAgICByZXR1cm4gdGhpc1xuICAgIH0sXG5cbiAgICBpc01vdXNlT25FbCggZXZlbnQsIGVsICkge1xuXG4gICAgICAgIHZhciBlbE9mZnNldCA9IGVsLm9mZnNldCgpLFxuICAgICAgICAgICAgZWxIZWlnaHQgPSBlbC5vdXRlckhlaWdodCggdHJ1ZSApLFxuICAgICAgICAgICAgZWxXaWR0aCA9IGVsLm91dGVyV2lkdGgoIHRydWUgKVxuXG4gICAgICAgIGlmKCAoIGV2ZW50LnBhZ2VYIDwgZWxPZmZzZXQubGVmdCApIHx8XG4gICAgICAgICAgICAoIGV2ZW50LnBhZ2VYID4gKCBlbE9mZnNldC5sZWZ0ICsgZWxXaWR0aCApICkgfHxcbiAgICAgICAgICAgICggZXZlbnQucGFnZVkgPCBlbE9mZnNldC50b3AgKSB8fFxuICAgICAgICAgICAgKCBldmVudC5wYWdlWSA+ICggZWxPZmZzZXQudG9wICsgZWxIZWlnaHQgKSApICkge1xuXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdHJ1ZVxuICAgIH0sXG5cbiAgICByZXF1aXJlc0xvZ2luOiBmYWxzZSxcblxuICAgIC8vX190b0RvOiBodG1sLnJlcGxhY2UoLz5cXHMrPC9nLCc+PCcpXG59IClcbiIsIm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmNyZWF0ZSgge1xuXG4gICAgYWRkKGNhbGxiYWNrKSB7XG4gICAgICAgIGlmKCAhdGhpcy5jYWxsYmFja3MubGVuZ3RoICkgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHRoaXMub25SZXNpemUpXG4gICAgICAgIHRoaXMuY2FsbGJhY2tzLnB1c2goY2FsbGJhY2spXG4gICAgfSxcblxuICAgIG9uUmVzaXplKCkge1xuICAgICAgIGlmKCB0aGlzLnJ1bm5pbmcgKSByZXR1cm5cblxuICAgICAgICB0aGlzLnJ1bm5pbmcgPSB0cnVlXG4gICAgICAgIFxuICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lXG4gICAgICAgICAgICA/IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoIHRoaXMucnVuQ2FsbGJhY2tzIClcbiAgICAgICAgICAgIDogc2V0VGltZW91dCggdGhpcy5ydW5DYWxsYmFja3MsIDY2KVxuICAgIH0sXG5cbiAgICBydW5DYWxsYmFja3MoKSB7XG4gICAgICAgIHRoaXMuY2FsbGJhY2tzID0gdGhpcy5jYWxsYmFja3MuZmlsdGVyKCBjYWxsYmFjayA9PiBjYWxsYmFjaygpIClcbiAgICAgICAgdGhpcy5ydW5uaW5nID0gZmFsc2UgXG4gICAgfVxuXG59LCB7IGNhbGxiYWNrczogeyB2YWx1ZTogW10gfSwgcnVubmluZzogeyB2YWx1ZTogZmFsc2UgfSB9ICkuYWRkXG4iLCIvLyBodHRwOi8vc3Bpbi5qcy5vcmcvI3YyLjMuMlxuIWZ1bmN0aW9uKGEsYil7XCJvYmplY3RcIj09dHlwZW9mIG1vZHVsZSYmbW9kdWxlLmV4cG9ydHM/bW9kdWxlLmV4cG9ydHM9YigpOlwiZnVuY3Rpb25cIj09dHlwZW9mIGRlZmluZSYmZGVmaW5lLmFtZD9kZWZpbmUoYik6YS5TcGlubmVyPWIoKX0odGhpcyxmdW5jdGlvbigpe1widXNlIHN0cmljdFwiO2Z1bmN0aW9uIGEoYSxiKXt2YXIgYyxkPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoYXx8XCJkaXZcIik7Zm9yKGMgaW4gYilkW2NdPWJbY107cmV0dXJuIGR9ZnVuY3Rpb24gYihhKXtmb3IodmFyIGI9MSxjPWFyZ3VtZW50cy5sZW5ndGg7Yz5iO2IrKylhLmFwcGVuZENoaWxkKGFyZ3VtZW50c1tiXSk7cmV0dXJuIGF9ZnVuY3Rpb24gYyhhLGIsYyxkKXt2YXIgZT1bXCJvcGFjaXR5XCIsYix+figxMDAqYSksYyxkXS5qb2luKFwiLVwiKSxmPS4wMStjL2QqMTAwLGc9TWF0aC5tYXgoMS0oMS1hKS9iKigxMDAtZiksYSksaD1qLnN1YnN0cmluZygwLGouaW5kZXhPZihcIkFuaW1hdGlvblwiKSkudG9Mb3dlckNhc2UoKSxpPWgmJlwiLVwiK2grXCItXCJ8fFwiXCI7cmV0dXJuIG1bZV18fChrLmluc2VydFJ1bGUoXCJAXCIraStcImtleWZyYW1lcyBcIitlK1wiezAle29wYWNpdHk6XCIrZytcIn1cIitmK1wiJXtvcGFjaXR5OlwiK2ErXCJ9XCIrKGYrLjAxKStcIiV7b3BhY2l0eToxfVwiKyhmK2IpJTEwMCtcIiV7b3BhY2l0eTpcIithK1wifTEwMCV7b3BhY2l0eTpcIitnK1wifX1cIixrLmNzc1J1bGVzLmxlbmd0aCksbVtlXT0xKSxlfWZ1bmN0aW9uIGQoYSxiKXt2YXIgYyxkLGU9YS5zdHlsZTtpZihiPWIuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkrYi5zbGljZSgxKSx2b2lkIDAhPT1lW2JdKXJldHVybiBiO2ZvcihkPTA7ZDxsLmxlbmd0aDtkKyspaWYoYz1sW2RdK2Isdm9pZCAwIT09ZVtjXSlyZXR1cm4gY31mdW5jdGlvbiBlKGEsYil7Zm9yKHZhciBjIGluIGIpYS5zdHlsZVtkKGEsYyl8fGNdPWJbY107cmV0dXJuIGF9ZnVuY3Rpb24gZihhKXtmb3IodmFyIGI9MTtiPGFyZ3VtZW50cy5sZW5ndGg7YisrKXt2YXIgYz1hcmd1bWVudHNbYl07Zm9yKHZhciBkIGluIGMpdm9pZCAwPT09YVtkXSYmKGFbZF09Y1tkXSl9cmV0dXJuIGF9ZnVuY3Rpb24gZyhhLGIpe3JldHVyblwic3RyaW5nXCI9PXR5cGVvZiBhP2E6YVtiJWEubGVuZ3RoXX1mdW5jdGlvbiBoKGEpe3RoaXMub3B0cz1mKGF8fHt9LGguZGVmYXVsdHMsbil9ZnVuY3Rpb24gaSgpe2Z1bmN0aW9uIGMoYixjKXtyZXR1cm4gYShcIjxcIitiKycgeG1sbnM9XCJ1cm46c2NoZW1hcy1taWNyb3NvZnQuY29tOnZtbFwiIGNsYXNzPVwic3Bpbi12bWxcIj4nLGMpfWsuYWRkUnVsZShcIi5zcGluLXZtbFwiLFwiYmVoYXZpb3I6dXJsKCNkZWZhdWx0I1ZNTClcIiksaC5wcm90b3R5cGUubGluZXM9ZnVuY3Rpb24oYSxkKXtmdW5jdGlvbiBmKCl7cmV0dXJuIGUoYyhcImdyb3VwXCIse2Nvb3Jkc2l6ZTprK1wiIFwiK2ssY29vcmRvcmlnaW46LWorXCIgXCIrLWp9KSx7d2lkdGg6ayxoZWlnaHQ6a30pfWZ1bmN0aW9uIGgoYSxoLGkpe2IobSxiKGUoZigpLHtyb3RhdGlvbjozNjAvZC5saW5lcyphK1wiZGVnXCIsbGVmdDp+fmh9KSxiKGUoYyhcInJvdW5kcmVjdFwiLHthcmNzaXplOmQuY29ybmVyc30pLHt3aWR0aDpqLGhlaWdodDpkLnNjYWxlKmQud2lkdGgsbGVmdDpkLnNjYWxlKmQucmFkaXVzLHRvcDotZC5zY2FsZSpkLndpZHRoPj4xLGZpbHRlcjppfSksYyhcImZpbGxcIix7Y29sb3I6ZyhkLmNvbG9yLGEpLG9wYWNpdHk6ZC5vcGFjaXR5fSksYyhcInN0cm9rZVwiLHtvcGFjaXR5OjB9KSkpKX12YXIgaSxqPWQuc2NhbGUqKGQubGVuZ3RoK2Qud2lkdGgpLGs9MipkLnNjYWxlKmosbD0tKGQud2lkdGgrZC5sZW5ndGgpKmQuc2NhbGUqMitcInB4XCIsbT1lKGYoKSx7cG9zaXRpb246XCJhYnNvbHV0ZVwiLHRvcDpsLGxlZnQ6bH0pO2lmKGQuc2hhZG93KWZvcihpPTE7aTw9ZC5saW5lcztpKyspaChpLC0yLFwicHJvZ2lkOkRYSW1hZ2VUcmFuc2Zvcm0uTWljcm9zb2Z0LkJsdXIocGl4ZWxyYWRpdXM9MixtYWtlc2hhZG93PTEsc2hhZG93b3BhY2l0eT0uMylcIik7Zm9yKGk9MTtpPD1kLmxpbmVzO2krKyloKGkpO3JldHVybiBiKGEsbSl9LGgucHJvdG90eXBlLm9wYWNpdHk9ZnVuY3Rpb24oYSxiLGMsZCl7dmFyIGU9YS5maXJzdENoaWxkO2Q9ZC5zaGFkb3cmJmQubGluZXN8fDAsZSYmYitkPGUuY2hpbGROb2Rlcy5sZW5ndGgmJihlPWUuY2hpbGROb2Rlc1tiK2RdLGU9ZSYmZS5maXJzdENoaWxkLGU9ZSYmZS5maXJzdENoaWxkLGUmJihlLm9wYWNpdHk9YykpfX12YXIgaixrLGw9W1wid2Via2l0XCIsXCJNb3pcIixcIm1zXCIsXCJPXCJdLG09e30sbj17bGluZXM6MTIsbGVuZ3RoOjcsd2lkdGg6NSxyYWRpdXM6MTAsc2NhbGU6MSxjb3JuZXJzOjEsY29sb3I6XCIjMDAwXCIsb3BhY2l0eTouMjUscm90YXRlOjAsZGlyZWN0aW9uOjEsc3BlZWQ6MSx0cmFpbDoxMDAsZnBzOjIwLHpJbmRleDoyZTksY2xhc3NOYW1lOlwic3Bpbm5lclwiLHRvcDpcIjUwJVwiLGxlZnQ6XCI1MCVcIixzaGFkb3c6ITEsaHdhY2NlbDohMSxwb3NpdGlvbjpcImFic29sdXRlXCJ9O2lmKGguZGVmYXVsdHM9e30sZihoLnByb3RvdHlwZSx7c3BpbjpmdW5jdGlvbihiKXt0aGlzLnN0b3AoKTt2YXIgYz10aGlzLGQ9Yy5vcHRzLGY9Yy5lbD1hKG51bGwse2NsYXNzTmFtZTpkLmNsYXNzTmFtZX0pO2lmKGUoZix7cG9zaXRpb246ZC5wb3NpdGlvbix3aWR0aDowLHpJbmRleDpkLnpJbmRleCxsZWZ0OmQubGVmdCx0b3A6ZC50b3B9KSxiJiZiLmluc2VydEJlZm9yZShmLGIuZmlyc3RDaGlsZHx8bnVsbCksZi5zZXRBdHRyaWJ1dGUoXCJyb2xlXCIsXCJwcm9ncmVzc2JhclwiKSxjLmxpbmVzKGYsYy5vcHRzKSwhail7dmFyIGcsaD0wLGk9KGQubGluZXMtMSkqKDEtZC5kaXJlY3Rpb24pLzIsaz1kLmZwcyxsPWsvZC5zcGVlZCxtPSgxLWQub3BhY2l0eSkvKGwqZC50cmFpbC8xMDApLG49bC9kLmxpbmVzOyFmdW5jdGlvbiBvKCl7aCsrO2Zvcih2YXIgYT0wO2E8ZC5saW5lczthKyspZz1NYXRoLm1heCgxLShoKyhkLmxpbmVzLWEpKm4pJWwqbSxkLm9wYWNpdHkpLGMub3BhY2l0eShmLGEqZC5kaXJlY3Rpb24raSxnLGQpO2MudGltZW91dD1jLmVsJiZzZXRUaW1lb3V0KG8sfn4oMWUzL2spKX0oKX1yZXR1cm4gY30sc3RvcDpmdW5jdGlvbigpe3ZhciBhPXRoaXMuZWw7cmV0dXJuIGEmJihjbGVhclRpbWVvdXQodGhpcy50aW1lb3V0KSxhLnBhcmVudE5vZGUmJmEucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChhKSx0aGlzLmVsPXZvaWQgMCksdGhpc30sbGluZXM6ZnVuY3Rpb24oZCxmKXtmdW5jdGlvbiBoKGIsYyl7cmV0dXJuIGUoYSgpLHtwb3NpdGlvbjpcImFic29sdXRlXCIsd2lkdGg6Zi5zY2FsZSooZi5sZW5ndGgrZi53aWR0aCkrXCJweFwiLGhlaWdodDpmLnNjYWxlKmYud2lkdGgrXCJweFwiLGJhY2tncm91bmQ6Yixib3hTaGFkb3c6Yyx0cmFuc2Zvcm1PcmlnaW46XCJsZWZ0XCIsdHJhbnNmb3JtOlwicm90YXRlKFwiK35+KDM2MC9mLmxpbmVzKmsrZi5yb3RhdGUpK1wiZGVnKSB0cmFuc2xhdGUoXCIrZi5zY2FsZSpmLnJhZGl1cytcInB4LDApXCIsYm9yZGVyUmFkaXVzOihmLmNvcm5lcnMqZi5zY2FsZSpmLndpZHRoPj4xKStcInB4XCJ9KX1mb3IodmFyIGksaz0wLGw9KGYubGluZXMtMSkqKDEtZi5kaXJlY3Rpb24pLzI7azxmLmxpbmVzO2srKylpPWUoYSgpLHtwb3NpdGlvbjpcImFic29sdXRlXCIsdG9wOjErfihmLnNjYWxlKmYud2lkdGgvMikrXCJweFwiLHRyYW5zZm9ybTpmLmh3YWNjZWw/XCJ0cmFuc2xhdGUzZCgwLDAsMClcIjpcIlwiLG9wYWNpdHk6Zi5vcGFjaXR5LGFuaW1hdGlvbjpqJiZjKGYub3BhY2l0eSxmLnRyYWlsLGwraypmLmRpcmVjdGlvbixmLmxpbmVzKStcIiBcIisxL2Yuc3BlZWQrXCJzIGxpbmVhciBpbmZpbml0ZVwifSksZi5zaGFkb3cmJmIoaSxlKGgoXCIjMDAwXCIsXCIwIDAgNHB4ICMwMDBcIikse3RvcDpcIjJweFwifSkpLGIoZCxiKGksaChnKGYuY29sb3IsayksXCIwIDAgMXB4IHJnYmEoMCwwLDAsLjEpXCIpKSk7cmV0dXJuIGR9LG9wYWNpdHk6ZnVuY3Rpb24oYSxiLGMpe2I8YS5jaGlsZE5vZGVzLmxlbmd0aCYmKGEuY2hpbGROb2Rlc1tiXS5zdHlsZS5vcGFjaXR5PWMpfX0pLFwidW5kZWZpbmVkXCIhPXR5cGVvZiBkb2N1bWVudCl7az1mdW5jdGlvbigpe3ZhciBjPWEoXCJzdHlsZVwiLHt0eXBlOlwidGV4dC9jc3NcIn0pO3JldHVybiBiKGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiaGVhZFwiKVswXSxjKSxjLnNoZWV0fHxjLnN0eWxlU2hlZXR9KCk7dmFyIG89ZShhKFwiZ3JvdXBcIikse2JlaGF2aW9yOlwidXJsKCNkZWZhdWx0I1ZNTClcIn0pOyFkKG8sXCJ0cmFuc2Zvcm1cIikmJm8uYWRqP2koKTpqPWQobyxcImFuaW1hdGlvblwiKX1yZXR1cm4gaH0pOyIsIm1vZHVsZS5leHBvcnRzID0gcCA9PiBgPGRpdj48L2Rpdj5gXG4iLCJtb2R1bGUuZXhwb3J0cyA9IHAgPT4gYDxkaXY+JHtwLmNvbGxlY3Rpb259PC9kaXY+YFxuIiwibW9kdWxlLmV4cG9ydHMgPSBwID0+IFxuYDxkaXY+XG4gICAgPGRpdiBkYXRhLWpzPVwidGl0bGVcIiA+JHtwLnRpdGxlIHx8ICcnfTwvZGl2PlxuICAgIDxpbWcgZGF0YS1qcz1cImltYWdlXCIgc3JjPVwiJHtwLmltYWdlfVwiLz5cbiAgICA8YnV0dG9uIGNsYXNzPVwiZWRpdFwiIGRhdGEtanM9XCJlZGl0XCI+PC9idXR0b24+XG48L2Rpdj5gXG4iLCJtb2R1bGUuZXhwb3J0cyA9IHAgPT5cbmA8ZGl2PlxuICAgIDxkaXYgZGF0YS1qcz1cImhlYWRlclwiPjwvZGl2PlxuICAgIDxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwXCI+XG4gICAgICAgPGxhYmVsIGNsYXNzPVwiZm9ybS1sYWJlbFwiPnRpdGxlPC9sYWJlbD5cbiAgICAgICA8aW5wdXQgZGF0YS1qcz1cInRpdGxlXCIgdHlwZT1cInRleHRcIj48L2lucHV0PlxuICAgIDwvZGl2PlxuICAgIDxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwXCI+XG4gICAgICAgPGxhYmVsIGNsYXNzPVwiZm9ybS1sYWJlbFwiPmltYWdlPC9sYWJlbD5cbiAgICAgICAgPGRpdj5cbiAgICAgICAgICAgIDxidXR0b24gZGF0YS1qcz1cInVwbG9hZFwiIGNsYXNzPVwidXBsb2FkXCI+XG4gICAgICAgICAgICAgICAgPHNwYW4+VXBsb2FkIEZpbGU8L3NwYW4+XG4gICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJmaWxlXCIgZGF0YS1qcz1cImltYWdlXCIgLz5cbiAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgPGltZyBkYXRhLWpzPVwicHJldmlld1wiIC8+XG4gICAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICAgIDxkaXY+XG4gICAgICAgIDxidXR0b24gZGF0YS1qcz1cInN1Ym1pdFwiIGNsYXNzPVwiYnRuLWdob3N0XCIgdHlwZT1cImJ1dHRvblwiPlN1Ym1pdDwvYnV0dG9uPlxuICAgICAgICA8YnV0dG9uIGRhdGEtanM9XCJjYW5jZWxcIiBjbGFzcz1cImJ0bi1naG9zdFwiIHR5cGU9XCJidXR0b25cIj5DYW5jZWw8L2J1dHRvbj5cbiAgICA8L2Rpdj5cbjwvZGl2PmBcbiIsIm1vZHVsZS5leHBvcnRzID0gcCA9PiBcbmA8ZGl2PlxuICAgIDxkaXY+XG4gICAgICAgIDxkaXY+Q29taWNzPC9kaXY+XG4gICAgICAgIDxidXR0b24gZGF0YS1qcz1cImFkZEJ0blwiIGNsYXNzPVwiYWRkXCI+PC9idXR0b24+XG4gICAgPC9kaXY+XG4gICAgPGRpdiBkYXRhLWpzPVwibGlzdFwiPjwvZGl2PlxuPC9kaXY+YFxuIiwibW9kdWxlLmV4cG9ydHMgPSBwID0+IGA8aGVhZGVyPlxuICAgIDx1bD5cbiAgICAgICAgPGxpPkFib3V0PC9saT5cbiAgICAgICAgPGxpPlN0b3JlPC9saT5cbiAgICA8L3VsPlxuICAgIDxzcGFuPlRpbnkgSGFuZGVkPC9zcGFuPlxuICAgIDxzcGFuPmxvZ288L3NwYW4+XG48L2hlYWRlcj5gXG4iLCJtb2R1bGUuZXhwb3J0cyA9ICggcCApID0+IGA8ZGl2PjwvZGl2PmBcbiIsIm1vZHVsZS5leHBvcnRzID0gKCBwICkgPT5cbmA8ZGl2PlxuICAgIDxoMT5Mb2dpbjwvaDE+XG4gICAgPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXBcIj5cbiAgICAgICA8bGFiZWwgY2xhc3M9XCJmb3JtLWxhYmVsXCIgZm9yPVwidXNlcm5hbWVcIj51c2VybmFtZTwvbGFiZWw+XG4gICAgICAgPGlucHV0IGRhdGEtanM9XCJ1c2VybmFtZVwiIGNsYXNzPVwidXNlcm5hbWVcIiB0eXBlPVwidGV4dFwiPjwvaW5wdXQ+XG4gICAgPC9kaXY+XG4gICAgPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXBcIj5cbiAgICAgICA8bGFiZWwgY2xhc3M9XCJmb3JtLWxhYmVsXCIgZm9yPVwicGFzc3dvcmRcIj5wYXNzd29yZDwvbGFiZWw+XG4gICAgICAgPGlucHV0IGRhdGEtanM9XCJwYXNzd29yZFwiIGNsYXNzPVwicGFzc3dvcmRcIiB0eXBlPVwicGFzc3dvcmRcIj48L2lucHV0PlxuICAgIDwvZGl2PlxuICAgIDxkaXY+XG4gICAgICAgIDxidXR0b24gZGF0YS1qcz1cInN1Ym1pdFwiIGNsYXNzPVwiYnRuLWdob3N0XCIgdHlwZT1cImJ1dHRvblwiPkxvZyBJbjwvYnV0dG9uPlxuICAgIDwvZGl2PlxuPC9kaXY+YFxuIiwibW9kdWxlLmV4cG9ydHMgPSBwID0+XG5gPGRpdj5cbiAgICA8c3BhbiBkYXRhLWpzPVwidXNlcm5hbWVcIj4ke3AudXNlcm5hbWV9PC9zcGFuPlxuICAgICR7cC51c2VyLl9pZCA9PT0gcC5faWQgPyAnPGJ1dHRvbiBjbGFzcz1cImVkaXRcIiBkYXRhLWpzPVwiZWRpdFwiPjwvYnV0dG9uPicgOiAnJ31cbjwvZGl2PlxuYFxuIiwibW9kdWxlLmV4cG9ydHMgPSBwID0+XG5gPGRpdj5cbiAgICA8ZGl2IGRhdGEtanM9XCJ0aXRsZVwiPjwvZGl2PlxuICAgIDxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwXCI+XG4gICAgICAgPGxhYmVsIGNsYXNzPVwiZm9ybS1sYWJlbFwiIGZvcj1cInVzZXJuYW1lXCI+dXNlcm5hbWU8L2xhYmVsPlxuICAgICAgIDxpbnB1dCBkYXRhLWpzPVwidXNlcm5hbWVcIiBjbGFzcz1cInVzZXJuYW1lXCIgdHlwZT1cInRleHRcIj48L2lucHV0PlxuICAgIDwvZGl2PlxuICAgIDxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwXCI+XG4gICAgICAgPGxhYmVsIGNsYXNzPVwiZm9ybS1sYWJlbFwiIGZvcj1cInBhc3N3b3JkXCI+cGFzc3dvcmQ8L2xhYmVsPlxuICAgICAgIDxpbnB1dCBkYXRhLWpzPVwicGFzc3dvcmRcIiBjbGFzcz1cInBhc3N3b3JkXCIgdHlwZT1cInBhc3N3b3JkXCI+PC9pbnB1dD5cbiAgICA8L2Rpdj5cbiAgICA8ZGl2PlxuICAgICAgICA8YnV0dG9uIGRhdGEtanM9XCJzdWJtaXRcIiBjbGFzcz1cImJ0bi1naG9zdFwiIHR5cGU9XCJidXR0b25cIj5TdWJtaXQ8L2J1dHRvbj5cbiAgICAgICAgPGJ1dHRvbiBkYXRhLWpzPVwiY2FuY2VsXCIgY2xhc3M9XCJidG4tZ2hvc3RcIiB0eXBlPVwiYnV0dG9uXCI+Q2FuY2VsPC9idXR0b24+XG4gICAgPC9kaXY+XG48L2Rpdj5gXG4iLCJtb2R1bGUuZXhwb3J0cyA9IHAgPT4gXG5gPGRpdj5cbiAgICA8ZGl2PlxuICAgICAgICA8ZGl2PlVzZXJzPC9kaXY+XG4gICAgICAgIDxidXR0b24gZGF0YS1qcz1cImFkZEJ0blwiIGNsYXNzPVwiYWRkXCI+PC9idXR0b24+XG4gICAgPC9kaXY+XG4gICAgPGRpdiBkYXRhLWpzPVwibGlzdFwiPjwvZGl2PlxuPC9kaXY+YFxuIiwibW9kdWxlLmV4cG9ydHMgPSBlcnIgPT4geyBjb25zb2xlLmxvZyggZXJyLnN0YWNrIHx8IGVyciApIH1cbiIsIm1vZHVsZS5leHBvcnRzID0ge1xuXG4gICAgRXJyb3I6IHJlcXVpcmUoJy4vTXlFcnJvcicpLFxuXG4gICAgUDogKCBmdW4sIGFyZ3M9WyBdLCB0aGlzQXJnICkgPT5cbiAgICAgICAgbmV3IFByb21pc2UoICggcmVzb2x2ZSwgcmVqZWN0ICkgPT4gUmVmbGVjdC5hcHBseSggZnVuLCB0aGlzQXJnIHx8IHRoaXMsIGFyZ3MuY29uY2F0KCAoIGUsIC4uLmNhbGxiYWNrICkgPT4gZSA/IHJlamVjdChlKSA6IHJlc29sdmUoY2FsbGJhY2spICkgKSApLFxuICAgIFxuICAgIGNvbnN0cnVjdG9yKCkgeyByZXR1cm4gdGhpcyB9XG59XG4iLCIvLyBDb3B5cmlnaHQgSm95ZW50LCBJbmMuIGFuZCBvdGhlciBOb2RlIGNvbnRyaWJ1dG9ycy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYVxuLy8gY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxuLy8gXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nXG4vLyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsXG4vLyBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0XG4vLyBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGVcbi8vIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4vLyBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTXG4vLyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4vLyBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOXG4vLyBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbi8vIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuLy8gT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuLy8gVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblxuZnVuY3Rpb24gRXZlbnRFbWl0dGVyKCkge1xuICB0aGlzLl9ldmVudHMgPSB0aGlzLl9ldmVudHMgfHwge307XG4gIHRoaXMuX21heExpc3RlbmVycyA9IHRoaXMuX21heExpc3RlbmVycyB8fCB1bmRlZmluZWQ7XG59XG5tb2R1bGUuZXhwb3J0cyA9IEV2ZW50RW1pdHRlcjtcblxuLy8gQmFja3dhcmRzLWNvbXBhdCB3aXRoIG5vZGUgMC4xMC54XG5FdmVudEVtaXR0ZXIuRXZlbnRFbWl0dGVyID0gRXZlbnRFbWl0dGVyO1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLl9ldmVudHMgPSB1bmRlZmluZWQ7XG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLl9tYXhMaXN0ZW5lcnMgPSB1bmRlZmluZWQ7XG5cbi8vIEJ5IGRlZmF1bHQgRXZlbnRFbWl0dGVycyB3aWxsIHByaW50IGEgd2FybmluZyBpZiBtb3JlIHRoYW4gMTAgbGlzdGVuZXJzIGFyZVxuLy8gYWRkZWQgdG8gaXQuIFRoaXMgaXMgYSB1c2VmdWwgZGVmYXVsdCB3aGljaCBoZWxwcyBmaW5kaW5nIG1lbW9yeSBsZWFrcy5cbkV2ZW50RW1pdHRlci5kZWZhdWx0TWF4TGlzdGVuZXJzID0gMTA7XG5cbi8vIE9idmlvdXNseSBub3QgYWxsIEVtaXR0ZXJzIHNob3VsZCBiZSBsaW1pdGVkIHRvIDEwLiBUaGlzIGZ1bmN0aW9uIGFsbG93c1xuLy8gdGhhdCB0byBiZSBpbmNyZWFzZWQuIFNldCB0byB6ZXJvIGZvciB1bmxpbWl0ZWQuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnNldE1heExpc3RlbmVycyA9IGZ1bmN0aW9uKG4pIHtcbiAgaWYgKCFpc051bWJlcihuKSB8fCBuIDwgMCB8fCBpc05hTihuKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ24gbXVzdCBiZSBhIHBvc2l0aXZlIG51bWJlcicpO1xuICB0aGlzLl9tYXhMaXN0ZW5lcnMgPSBuO1xuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuZW1pdCA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgdmFyIGVyLCBoYW5kbGVyLCBsZW4sIGFyZ3MsIGksIGxpc3RlbmVycztcblxuICBpZiAoIXRoaXMuX2V2ZW50cylcbiAgICB0aGlzLl9ldmVudHMgPSB7fTtcblxuICAvLyBJZiB0aGVyZSBpcyBubyAnZXJyb3InIGV2ZW50IGxpc3RlbmVyIHRoZW4gdGhyb3cuXG4gIGlmICh0eXBlID09PSAnZXJyb3InKSB7XG4gICAgaWYgKCF0aGlzLl9ldmVudHMuZXJyb3IgfHxcbiAgICAgICAgKGlzT2JqZWN0KHRoaXMuX2V2ZW50cy5lcnJvcikgJiYgIXRoaXMuX2V2ZW50cy5lcnJvci5sZW5ndGgpKSB7XG4gICAgICBlciA9IGFyZ3VtZW50c1sxXTtcbiAgICAgIGlmIChlciBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICAgIHRocm93IGVyOyAvLyBVbmhhbmRsZWQgJ2Vycm9yJyBldmVudFxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gQXQgbGVhc3QgZ2l2ZSBzb21lIGtpbmQgb2YgY29udGV4dCB0byB0aGUgdXNlclxuICAgICAgICB2YXIgZXJyID0gbmV3IEVycm9yKCdVbmNhdWdodCwgdW5zcGVjaWZpZWQgXCJlcnJvclwiIGV2ZW50LiAoJyArIGVyICsgJyknKTtcbiAgICAgICAgZXJyLmNvbnRleHQgPSBlcjtcbiAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGhhbmRsZXIgPSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgaWYgKGlzVW5kZWZpbmVkKGhhbmRsZXIpKVxuICAgIHJldHVybiBmYWxzZTtcblxuICBpZiAoaXNGdW5jdGlvbihoYW5kbGVyKSkge1xuICAgIHN3aXRjaCAoYXJndW1lbnRzLmxlbmd0aCkge1xuICAgICAgLy8gZmFzdCBjYXNlc1xuICAgICAgY2FzZSAxOlxuICAgICAgICBoYW5kbGVyLmNhbGwodGhpcyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAyOlxuICAgICAgICBoYW5kbGVyLmNhbGwodGhpcywgYXJndW1lbnRzWzFdKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDM6XG4gICAgICAgIGhhbmRsZXIuY2FsbCh0aGlzLCBhcmd1bWVudHNbMV0sIGFyZ3VtZW50c1syXSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgLy8gc2xvd2VyXG4gICAgICBkZWZhdWx0OlxuICAgICAgICBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcbiAgICAgICAgaGFuZGxlci5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICB9XG4gIH0gZWxzZSBpZiAoaXNPYmplY3QoaGFuZGxlcikpIHtcbiAgICBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcbiAgICBsaXN0ZW5lcnMgPSBoYW5kbGVyLnNsaWNlKCk7XG4gICAgbGVuID0gbGlzdGVuZXJzLmxlbmd0aDtcbiAgICBmb3IgKGkgPSAwOyBpIDwgbGVuOyBpKyspXG4gICAgICBsaXN0ZW5lcnNbaV0uYXBwbHkodGhpcywgYXJncyk7XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuYWRkTGlzdGVuZXIgPSBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuICB2YXIgbTtcblxuICBpZiAoIWlzRnVuY3Rpb24obGlzdGVuZXIpKVxuICAgIHRocm93IFR5cGVFcnJvcignbGlzdGVuZXIgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMpXG4gICAgdGhpcy5fZXZlbnRzID0ge307XG5cbiAgLy8gVG8gYXZvaWQgcmVjdXJzaW9uIGluIHRoZSBjYXNlIHRoYXQgdHlwZSA9PT0gXCJuZXdMaXN0ZW5lclwiISBCZWZvcmVcbiAgLy8gYWRkaW5nIGl0IHRvIHRoZSBsaXN0ZW5lcnMsIGZpcnN0IGVtaXQgXCJuZXdMaXN0ZW5lclwiLlxuICBpZiAodGhpcy5fZXZlbnRzLm5ld0xpc3RlbmVyKVxuICAgIHRoaXMuZW1pdCgnbmV3TGlzdGVuZXInLCB0eXBlLFxuICAgICAgICAgICAgICBpc0Z1bmN0aW9uKGxpc3RlbmVyLmxpc3RlbmVyKSA/XG4gICAgICAgICAgICAgIGxpc3RlbmVyLmxpc3RlbmVyIDogbGlzdGVuZXIpO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzW3R5cGVdKVxuICAgIC8vIE9wdGltaXplIHRoZSBjYXNlIG9mIG9uZSBsaXN0ZW5lci4gRG9uJ3QgbmVlZCB0aGUgZXh0cmEgYXJyYXkgb2JqZWN0LlxuICAgIHRoaXMuX2V2ZW50c1t0eXBlXSA9IGxpc3RlbmVyO1xuICBlbHNlIGlmIChpc09iamVjdCh0aGlzLl9ldmVudHNbdHlwZV0pKVxuICAgIC8vIElmIHdlJ3ZlIGFscmVhZHkgZ290IGFuIGFycmF5LCBqdXN0IGFwcGVuZC5cbiAgICB0aGlzLl9ldmVudHNbdHlwZV0ucHVzaChsaXN0ZW5lcik7XG4gIGVsc2VcbiAgICAvLyBBZGRpbmcgdGhlIHNlY29uZCBlbGVtZW50LCBuZWVkIHRvIGNoYW5nZSB0byBhcnJheS5cbiAgICB0aGlzLl9ldmVudHNbdHlwZV0gPSBbdGhpcy5fZXZlbnRzW3R5cGVdLCBsaXN0ZW5lcl07XG5cbiAgLy8gQ2hlY2sgZm9yIGxpc3RlbmVyIGxlYWtcbiAgaWYgKGlzT2JqZWN0KHRoaXMuX2V2ZW50c1t0eXBlXSkgJiYgIXRoaXMuX2V2ZW50c1t0eXBlXS53YXJuZWQpIHtcbiAgICBpZiAoIWlzVW5kZWZpbmVkKHRoaXMuX21heExpc3RlbmVycykpIHtcbiAgICAgIG0gPSB0aGlzLl9tYXhMaXN0ZW5lcnM7XG4gICAgfSBlbHNlIHtcbiAgICAgIG0gPSBFdmVudEVtaXR0ZXIuZGVmYXVsdE1heExpc3RlbmVycztcbiAgICB9XG5cbiAgICBpZiAobSAmJiBtID4gMCAmJiB0aGlzLl9ldmVudHNbdHlwZV0ubGVuZ3RoID4gbSkge1xuICAgICAgdGhpcy5fZXZlbnRzW3R5cGVdLndhcm5lZCA9IHRydWU7XG4gICAgICBjb25zb2xlLmVycm9yKCcobm9kZSkgd2FybmluZzogcG9zc2libGUgRXZlbnRFbWl0dGVyIG1lbW9yeSAnICtcbiAgICAgICAgICAgICAgICAgICAgJ2xlYWsgZGV0ZWN0ZWQuICVkIGxpc3RlbmVycyBhZGRlZC4gJyArXG4gICAgICAgICAgICAgICAgICAgICdVc2UgZW1pdHRlci5zZXRNYXhMaXN0ZW5lcnMoKSB0byBpbmNyZWFzZSBsaW1pdC4nLFxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9ldmVudHNbdHlwZV0ubGVuZ3RoKTtcbiAgICAgIGlmICh0eXBlb2YgY29uc29sZS50cmFjZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAvLyBub3Qgc3VwcG9ydGVkIGluIElFIDEwXG4gICAgICAgIGNvbnNvbGUudHJhY2UoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUub24gPSBFdmVudEVtaXR0ZXIucHJvdG90eXBlLmFkZExpc3RlbmVyO1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLm9uY2UgPSBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuICBpZiAoIWlzRnVuY3Rpb24obGlzdGVuZXIpKVxuICAgIHRocm93IFR5cGVFcnJvcignbGlzdGVuZXIgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG5cbiAgdmFyIGZpcmVkID0gZmFsc2U7XG5cbiAgZnVuY3Rpb24gZygpIHtcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGcpO1xuXG4gICAgaWYgKCFmaXJlZCkge1xuICAgICAgZmlyZWQgPSB0cnVlO1xuICAgICAgbGlzdGVuZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9XG4gIH1cblxuICBnLmxpc3RlbmVyID0gbGlzdGVuZXI7XG4gIHRoaXMub24odHlwZSwgZyk7XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vLyBlbWl0cyBhICdyZW1vdmVMaXN0ZW5lcicgZXZlbnQgaWZmIHRoZSBsaXN0ZW5lciB3YXMgcmVtb3ZlZFxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVMaXN0ZW5lciA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gIHZhciBsaXN0LCBwb3NpdGlvbiwgbGVuZ3RoLCBpO1xuXG4gIGlmICghaXNGdW5jdGlvbihsaXN0ZW5lcikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCdsaXN0ZW5lciBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcblxuICBpZiAoIXRoaXMuX2V2ZW50cyB8fCAhdGhpcy5fZXZlbnRzW3R5cGVdKVxuICAgIHJldHVybiB0aGlzO1xuXG4gIGxpc3QgPSB0aGlzLl9ldmVudHNbdHlwZV07XG4gIGxlbmd0aCA9IGxpc3QubGVuZ3RoO1xuICBwb3NpdGlvbiA9IC0xO1xuXG4gIGlmIChsaXN0ID09PSBsaXN0ZW5lciB8fFxuICAgICAgKGlzRnVuY3Rpb24obGlzdC5saXN0ZW5lcikgJiYgbGlzdC5saXN0ZW5lciA9PT0gbGlzdGVuZXIpKSB7XG4gICAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgICBpZiAodGhpcy5fZXZlbnRzLnJlbW92ZUxpc3RlbmVyKVxuICAgICAgdGhpcy5lbWl0KCdyZW1vdmVMaXN0ZW5lcicsIHR5cGUsIGxpc3RlbmVyKTtcblxuICB9IGVsc2UgaWYgKGlzT2JqZWN0KGxpc3QpKSB7XG4gICAgZm9yIChpID0gbGVuZ3RoOyBpLS0gPiAwOykge1xuICAgICAgaWYgKGxpc3RbaV0gPT09IGxpc3RlbmVyIHx8XG4gICAgICAgICAgKGxpc3RbaV0ubGlzdGVuZXIgJiYgbGlzdFtpXS5saXN0ZW5lciA9PT0gbGlzdGVuZXIpKSB7XG4gICAgICAgIHBvc2l0aW9uID0gaTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHBvc2l0aW9uIDwgMClcbiAgICAgIHJldHVybiB0aGlzO1xuXG4gICAgaWYgKGxpc3QubGVuZ3RoID09PSAxKSB7XG4gICAgICBsaXN0Lmxlbmd0aCA9IDA7XG4gICAgICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuICAgIH0gZWxzZSB7XG4gICAgICBsaXN0LnNwbGljZShwb3NpdGlvbiwgMSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX2V2ZW50cy5yZW1vdmVMaXN0ZW5lcilcbiAgICAgIHRoaXMuZW1pdCgncmVtb3ZlTGlzdGVuZXInLCB0eXBlLCBsaXN0ZW5lcik7XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUucmVtb3ZlQWxsTGlzdGVuZXJzID0gZnVuY3Rpb24odHlwZSkge1xuICB2YXIga2V5LCBsaXN0ZW5lcnM7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMpXG4gICAgcmV0dXJuIHRoaXM7XG5cbiAgLy8gbm90IGxpc3RlbmluZyBmb3IgcmVtb3ZlTGlzdGVuZXIsIG5vIG5lZWQgdG8gZW1pdFxuICBpZiAoIXRoaXMuX2V2ZW50cy5yZW1vdmVMaXN0ZW5lcikge1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKVxuICAgICAgdGhpcy5fZXZlbnRzID0ge307XG4gICAgZWxzZSBpZiAodGhpcy5fZXZlbnRzW3R5cGVdKVxuICAgICAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8vIGVtaXQgcmVtb3ZlTGlzdGVuZXIgZm9yIGFsbCBsaXN0ZW5lcnMgb24gYWxsIGV2ZW50c1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCkge1xuICAgIGZvciAoa2V5IGluIHRoaXMuX2V2ZW50cykge1xuICAgICAgaWYgKGtleSA9PT0gJ3JlbW92ZUxpc3RlbmVyJykgY29udGludWU7XG4gICAgICB0aGlzLnJlbW92ZUFsbExpc3RlbmVycyhrZXkpO1xuICAgIH1cbiAgICB0aGlzLnJlbW92ZUFsbExpc3RlbmVycygncmVtb3ZlTGlzdGVuZXInKTtcbiAgICB0aGlzLl9ldmVudHMgPSB7fTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGxpc3RlbmVycyA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcblxuICBpZiAoaXNGdW5jdGlvbihsaXN0ZW5lcnMpKSB7XG4gICAgdGhpcy5yZW1vdmVMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lcnMpO1xuICB9IGVsc2UgaWYgKGxpc3RlbmVycykge1xuICAgIC8vIExJRk8gb3JkZXJcbiAgICB3aGlsZSAobGlzdGVuZXJzLmxlbmd0aClcbiAgICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIodHlwZSwgbGlzdGVuZXJzW2xpc3RlbmVycy5sZW5ndGggLSAxXSk7XG4gIH1cbiAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcblxuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUubGlzdGVuZXJzID0gZnVuY3Rpb24odHlwZSkge1xuICB2YXIgcmV0O1xuICBpZiAoIXRoaXMuX2V2ZW50cyB8fCAhdGhpcy5fZXZlbnRzW3R5cGVdKVxuICAgIHJldCA9IFtdO1xuICBlbHNlIGlmIChpc0Z1bmN0aW9uKHRoaXMuX2V2ZW50c1t0eXBlXSkpXG4gICAgcmV0ID0gW3RoaXMuX2V2ZW50c1t0eXBlXV07XG4gIGVsc2VcbiAgICByZXQgPSB0aGlzLl9ldmVudHNbdHlwZV0uc2xpY2UoKTtcbiAgcmV0dXJuIHJldDtcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUubGlzdGVuZXJDb3VudCA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgaWYgKHRoaXMuX2V2ZW50cykge1xuICAgIHZhciBldmxpc3RlbmVyID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gICAgaWYgKGlzRnVuY3Rpb24oZXZsaXN0ZW5lcikpXG4gICAgICByZXR1cm4gMTtcbiAgICBlbHNlIGlmIChldmxpc3RlbmVyKVxuICAgICAgcmV0dXJuIGV2bGlzdGVuZXIubGVuZ3RoO1xuICB9XG4gIHJldHVybiAwO1xufTtcblxuRXZlbnRFbWl0dGVyLmxpc3RlbmVyQ291bnQgPSBmdW5jdGlvbihlbWl0dGVyLCB0eXBlKSB7XG4gIHJldHVybiBlbWl0dGVyLmxpc3RlbmVyQ291bnQodHlwZSk7XG59O1xuXG5mdW5jdGlvbiBpc0Z1bmN0aW9uKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ2Z1bmN0aW9uJztcbn1cblxuZnVuY3Rpb24gaXNOdW1iZXIoYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnbnVtYmVyJztcbn1cblxuZnVuY3Rpb24gaXNPYmplY3QoYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnb2JqZWN0JyAmJiBhcmcgIT09IG51bGw7XG59XG5cbmZ1bmN0aW9uIGlzVW5kZWZpbmVkKGFyZykge1xuICByZXR1cm4gYXJnID09PSB2b2lkIDA7XG59XG4iXX0=
