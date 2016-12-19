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

        var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { query: {} };

        if (opts.query || this.pagination) Object.assign(opts.query, this.pagination);
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
            return _this3.Xhr({ method: 'POST', resource: 'comic', data: JSON.stringify({ title: _this3.els.title.value, image: response.path, created: new Date().toISOString() }) });
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

        var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        this.views[comic._id] = this.factory.create('Comic', { insertion: opts.insertion || { value: { el: this.els.list } },
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

    fetchAndDisplay: function fetchAndDisplay() {
        var _this3 = this;

        this.fetching = true;
        return this.comics.get().then(function (response) {
            response.forEach(function (comic) {
                return _this3.createComicView(comic);
            });
            return Promise.resolve(_this3.fetching = false);
        });
    },
    manageComic: function manageComic(type, comic) {
        var _this4 = this;

        this.views.ComicManage ? this.views.ComicManage.onNavigation(type, comic) : this.views.ComicManage = this.factory.create('ComicManage', { type: { value: type, writable: true }, model: { value: { data: comic || {} } }, insertion: { value: { el: this.els.container, method: 'insertBefore' } } }).on('added', function (comic) {
            _this4.createComicView(comic, { insertion: { value: { el: _this4.els.list.firstChild, method: 'insertBefore' } } });_this4.emit('navigate', '/admin/comic');
        }).on('cancelled', function () {
            return _this4.emit('navigate', '/admin/comic');
        }).on('edited', function (comic) {
            _this4.views[comic._id].update(comic);_this4.emit('navigate', '/admin/comic');
        });
    },
    onAddBtnClick: function onAddBtnClick() {
        this.emit('navigate', '/admin/comic/add');
    },
    onNavigation: function onNavigation(path) {
        var _this5 = this;

        this.path = path;

        path.length === 2 && this.els.container.classList.contains('hide') ? this.views.ComicManage && !this.views.ComicManage.els.container.classList.contains('hide') ? this.views.ComicManage.hide().then(function () {
            return _this5.show();
        }) : this.show() : path.length === 3 ? this.hide().then(function () {
            return _this5.manageComic(path[2], {});
        }) : path.length === 4 ? this.hide().then(function () {
            return _this5.manageComic(path[2], _this5.views[path[3]].model.data);
        }) : undefined;
    },
    onScroll: function onScroll(e) {
        if (this.fetching || this.isHidden()) return;
        if (this.content.offsetHeight - (window.scrollY + window.innerHeight) < 100) window.requestAnimationFrame(this.fetchAndDisplay.bind(this).catch(this.Error));
    },
    postRender: function postRender() {
        var _this6 = this;

        this.content = document.querySelector('#content');

        if (this.path.length > 2) {
            this.els.container.classList.add('hidden', 'hide');
            if (this.path[2] === "add") {
                this.manageComic("add", {});
            } else if (this.path[2] === "edit" && this.path[3]) {
                this.Xhr({ method: "get", resource: 'comic/' + this.path[3] }).then(function (response) {
                    return _this6.manageComic("edit", response);
                }).catch(function (e) {
                    _this6.Error(e);_this6.emit('navigate', '/admin/comic');
                });
            }
        } else if (this.path.length === 1 && this.views.ComicManage) {
            this.views.ComicManage.hide();
        }

        this.comics = Object.create(this.Model, { pagination: { value: { skip: 0, limit: 10, sort: { created: -1 } } }, resource: { value: 'comic' } });

        this.fetchAndDisplay().catch(this.Error);

        window.addEventListener('scroll', function (e) {
            return _this6.onScroll(e);
        });

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

        this.fetching = true;
        return this.getData().then(function (response) {
            response.forEach(function (comic) {
                return _this.views[comic._id] = _this.factory.create('comic', { insertion: { value: { el: _this.els.container } }, model: { value: { data: comic } }, templateOpts: { value: { readOnly: true } } });
            });
            return Promise.resolve(_this.fetching = false);
        });
    },
    getData: function getData() {
        if (!this.model) this.model = Object.create(this.Model, { pagination: { value: { skip: 0, limit: 10, sort: { created: -1 } } }, resource: { value: 'comic' } });

        return this.model.get();
    },
    navigate: function navigate() {
        this.show();
    },
    onScroll: function onScroll(e) {
        if (this.fetching) return;
        if (this.content.offsetHeight - (window.scrollY + window.innerHeight) < 100) window.requestAnimationFrame(this.fetchAndDisplay.bind(this));
    },
    postRender: function postRender() {
        var _this2 = this;

        this.content = document.querySelector('#content');

        this.fetchAndDisplay().catch(this.Error);

        window.addEventListener('scroll', function (e) {
            return _this2.onScroll(e);
        });

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
    return '<div>\n    <div class="header" data-js="header">\n        <div class="title" data-js="title" >' + (p.title || '') + '</div>\n        ' + (p._id && p.user._id && !p.opts.readOnly ? '<button class="delete" data-js="delete"></button>' : '') + '\n        ' + (p._id && p.user._id && !p.opts.readOnly ? '<button class="edit" data-js="edit"></button>' : '') + '\n    </div>\n    ' + (p._id && p.user._id && !p.opts.readOnly ? '<div class="confirm hidden" data-js="confirmDialog">\n               <span>Are you sure?</span>\n               <button data-js="confirm" type="button">Delete</button> \n               <button data-js="cancel" type="button">Cancel</button> \n           </div>' : '') + '\n    <img data-js="image" src="' + (p.image ? p.image : '') + '"/>\n    ' + (p.opts.readOnly ? '<div class="clearfix">\n             <div class="share">\n                 ' + require('./lib/facebook') + '\n                 ' + require('./lib/twitter') + '\n                 ' + require('./lib/google') + '\n             </div>\n         </div>' : '') + '\n</div>';
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
    return "<header>\n    <ul>&nbsp;\n    </ul>\n    <span>Tiny Handed</span>\n    <img data-js=\"logo\" src=\"/static/img/tinyHanded.jpg\" />\n</header>";
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJjbGllbnQvanMvLlRlbXBsYXRlTWFwLmpzIiwiY2xpZW50L2pzLy5WaWV3TWFwLmpzIiwiY2xpZW50L2pzLy5lbnYiLCJjbGllbnQvanMvWGhyLmpzIiwiY2xpZW50L2pzL2ZhY3RvcnkvVmlldy5qcyIsImNsaWVudC9qcy9tYWluLmpzIiwiY2xpZW50L2pzL21vZGVscy9Vc2VyLmpzIiwiY2xpZW50L2pzL21vZGVscy9fX3Byb3RvX18uanMiLCJjbGllbnQvanMvcm91dGVyLmpzIiwiY2xpZW50L2pzL3ZpZXdzL0FkbWluLmpzIiwiY2xpZW50L2pzL3ZpZXdzL0FkbWluSXRlbS5qcyIsImNsaWVudC9qcy92aWV3cy9Db21pYy5qcyIsImNsaWVudC9qcy92aWV3cy9Db21pY01hbmFnZS5qcyIsImNsaWVudC9qcy92aWV3cy9Db21pY1Jlc291cmNlcy5qcyIsImNsaWVudC9qcy92aWV3cy9IZWFkZXIuanMiLCJjbGllbnQvanMvdmlld3MvSG9tZS5qcyIsImNsaWVudC9qcy92aWV3cy9Mb2dpbi5qcyIsImNsaWVudC9qcy92aWV3cy9Vc2VyLmpzIiwiY2xpZW50L2pzL3ZpZXdzL1VzZXJNYW5hZ2UuanMiLCJjbGllbnQvanMvdmlld3MvVXNlclJlc291cmNlcy5qcyIsImNsaWVudC9qcy92aWV3cy9fX3Byb3RvX18uanMiLCJjbGllbnQvanMvdmlld3MvbGliL09wdGltaXplZFJlc2l6ZS5qcyIsImNsaWVudC9qcy92aWV3cy9saWIvU3Bpbi5qcyIsImNsaWVudC9qcy92aWV3cy90ZW1wbGF0ZXMvQWRtaW4uanMiLCJjbGllbnQvanMvdmlld3MvdGVtcGxhdGVzL0FkbWluSXRlbS5qcyIsImNsaWVudC9qcy92aWV3cy90ZW1wbGF0ZXMvQ29taWMuanMiLCJjbGllbnQvanMvdmlld3MvdGVtcGxhdGVzL0NvbWljTWFuYWdlLmpzIiwiY2xpZW50L2pzL3ZpZXdzL3RlbXBsYXRlcy9Db21pY1Jlc291cmNlcy5qcyIsImNsaWVudC9qcy92aWV3cy90ZW1wbGF0ZXMvSGVhZGVyLmpzIiwiY2xpZW50L2pzL3ZpZXdzL3RlbXBsYXRlcy9Ib21lLmpzIiwiY2xpZW50L2pzL3ZpZXdzL3RlbXBsYXRlcy9Mb2dpbi5qcyIsImNsaWVudC9qcy92aWV3cy90ZW1wbGF0ZXMvVXNlci5qcyIsImNsaWVudC9qcy92aWV3cy90ZW1wbGF0ZXMvVXNlck1hbmFnZS5qcyIsImNsaWVudC9qcy92aWV3cy90ZW1wbGF0ZXMvVXNlclJlc291cmNlcy5qcyIsImNsaWVudC9qcy92aWV3cy90ZW1wbGF0ZXMvbGliL2ZhY2Vib29rLmpzIiwiY2xpZW50L2pzL3ZpZXdzL3RlbXBsYXRlcy9saWIvZ29vZ2xlLmpzIiwiY2xpZW50L2pzL3ZpZXdzL3RlbXBsYXRlcy9saWIvdHdpdHRlci5qcyIsImxpYi9NeUVycm9yLmpzIiwibGliL015T2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2V2ZW50cy9ldmVudHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBLE9BQU8sT0FBUCxHQUFlO0FBQ2QsUUFBTyxRQUFRLHlCQUFSLENBRE87QUFFZCxZQUFXLFFBQVEsNkJBQVIsQ0FGRztBQUdkLFFBQU8sUUFBUSx5QkFBUixDQUhPO0FBSWQsY0FBYSxRQUFRLCtCQUFSLENBSkM7QUFLZCxpQkFBZ0IsUUFBUSxrQ0FBUixDQUxGO0FBTWQsU0FBUSxRQUFRLDBCQUFSLENBTk07QUFPZCxPQUFNLFFBQVEsd0JBQVIsQ0FQUTtBQVFkLFFBQU8sUUFBUSx5QkFBUixDQVJPO0FBU2QsT0FBTSxRQUFRLHdCQUFSLENBVFE7QUFVZCxhQUFZLFFBQVEsOEJBQVIsQ0FWRTtBQVdkLGdCQUFlLFFBQVEsaUNBQVI7QUFYRCxDQUFmOzs7OztBQ0FBLE9BQU8sT0FBUCxHQUFlO0FBQ2QsUUFBTyxRQUFRLGVBQVIsQ0FETztBQUVkLFlBQVcsUUFBUSxtQkFBUixDQUZHO0FBR2QsUUFBTyxRQUFRLGVBQVIsQ0FITztBQUlkLGNBQWEs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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJtb2R1bGUuZXhwb3J0cz17XG5cdEFkbWluOiByZXF1aXJlKCcuL3ZpZXdzL3RlbXBsYXRlcy9BZG1pbicpLFxuXHRBZG1pbkl0ZW06IHJlcXVpcmUoJy4vdmlld3MvdGVtcGxhdGVzL0FkbWluSXRlbScpLFxuXHRDb21pYzogcmVxdWlyZSgnLi92aWV3cy90ZW1wbGF0ZXMvQ29taWMnKSxcblx0Q29taWNNYW5hZ2U6IHJlcXVpcmUoJy4vdmlld3MvdGVtcGxhdGVzL0NvbWljTWFuYWdlJyksXG5cdENvbWljUmVzb3VyY2VzOiByZXF1aXJlKCcuL3ZpZXdzL3RlbXBsYXRlcy9Db21pY1Jlc291cmNlcycpLFxuXHRIZWFkZXI6IHJlcXVpcmUoJy4vdmlld3MvdGVtcGxhdGVzL0hlYWRlcicpLFxuXHRIb21lOiByZXF1aXJlKCcuL3ZpZXdzL3RlbXBsYXRlcy9Ib21lJyksXG5cdExvZ2luOiByZXF1aXJlKCcuL3ZpZXdzL3RlbXBsYXRlcy9Mb2dpbicpLFxuXHRVc2VyOiByZXF1aXJlKCcuL3ZpZXdzL3RlbXBsYXRlcy9Vc2VyJyksXG5cdFVzZXJNYW5hZ2U6IHJlcXVpcmUoJy4vdmlld3MvdGVtcGxhdGVzL1VzZXJNYW5hZ2UnKSxcblx0VXNlclJlc291cmNlczogcmVxdWlyZSgnLi92aWV3cy90ZW1wbGF0ZXMvVXNlclJlc291cmNlcycpXG59IiwibW9kdWxlLmV4cG9ydHM9e1xuXHRBZG1pbjogcmVxdWlyZSgnLi92aWV3cy9BZG1pbicpLFxuXHRBZG1pbkl0ZW06IHJlcXVpcmUoJy4vdmlld3MvQWRtaW5JdGVtJyksXG5cdENvbWljOiByZXF1aXJlKCcuL3ZpZXdzL0NvbWljJyksXG5cdENvbWljTWFuYWdlOiByZXF1aXJlKCcuL3ZpZXdzL0NvbWljTWFuYWdlJyksXG5cdENvbWljUmVzb3VyY2VzOiByZXF1aXJlKCcuL3ZpZXdzL0NvbWljUmVzb3VyY2VzJyksXG5cdEhlYWRlcjogcmVxdWlyZSgnLi92aWV3cy9IZWFkZXInKSxcblx0SG9tZTogcmVxdWlyZSgnLi92aWV3cy9Ib21lJyksXG5cdExvZ2luOiByZXF1aXJlKCcuL3ZpZXdzL0xvZ2luJyksXG5cdFVzZXI6IHJlcXVpcmUoJy4vdmlld3MvVXNlcicpLFxuXHRVc2VyTWFuYWdlOiByZXF1aXJlKCcuL3ZpZXdzL1VzZXJNYW5hZ2UnKSxcblx0VXNlclJlc291cmNlczogcmVxdWlyZSgnLi92aWV3cy9Vc2VyUmVzb3VyY2VzJylcbn0iLCJ3aW5kb3cuY29va2llTmFtZSA9ICdjaGVldG9qZXN1cydcbiIsIm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmNyZWF0ZSggT2JqZWN0LmFzc2lnbigge30sIHJlcXVpcmUoJy4uLy4uL2xpYi9NeU9iamVjdCcpLCB7XG5cbiAgICBSZXF1ZXN0OiB7XG5cbiAgICAgICAgY29uc3RydWN0b3IoIGRhdGEgKSB7XG4gICAgICAgICAgICBsZXQgcmVxID0gbmV3IFhNTEh0dHBSZXF1ZXN0KClcblxuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKCAoIHJlc29sdmUsIHJlamVjdCApID0+IHtcblxuICAgICAgICAgICAgICAgIHJlcS5vbmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgWyA1MDAsIDQwNCwgNDAxIF0uaW5jbHVkZXMoIHRoaXMuc3RhdHVzIClcbiAgICAgICAgICAgICAgICAgICAgICAgID8gcmVqZWN0KCB0aGlzLnJlc3BvbnNlIClcbiAgICAgICAgICAgICAgICAgICAgICAgIDogcmVzb2x2ZSggSlNPTi5wYXJzZSh0aGlzLnJlc3BvbnNlKSApXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYoIGRhdGEubWV0aG9kID09PSBcImdldFwiIHx8IGRhdGEubWV0aG9kID09PSBcIm9wdGlvbnNcIiApIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHFzID0gZGF0YS5xcyA/IGA/JHtkYXRhLnFzfWAgOiAnJyBcbiAgICAgICAgICAgICAgICAgICAgcmVxLm9wZW4oIGRhdGEubWV0aG9kLCBgLyR7ZGF0YS5yZXNvdXJjZX0ke3FzfWAgKVxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldEhlYWRlcnMoIHJlcSwgZGF0YS5oZWFkZXJzIClcbiAgICAgICAgICAgICAgICAgICAgcmVxLnNlbmQobnVsbClcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXEub3BlbiggZGF0YS5tZXRob2QsIGAvJHtkYXRhLnJlc291cmNlfWAsIHRydWUpXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0SGVhZGVycyggcmVxLCBkYXRhLmhlYWRlcnMgKVxuICAgICAgICAgICAgICAgICAgICByZXEuc2VuZCggZGF0YS5kYXRhIClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IClcbiAgICAgICAgfSxcblxuICAgICAgICBwbGFpbkVzY2FwZSggc1RleHQgKSB7XG4gICAgICAgICAgICAvKiBob3cgc2hvdWxkIEkgdHJlYXQgYSB0ZXh0L3BsYWluIGZvcm0gZW5jb2Rpbmc/IHdoYXQgY2hhcmFjdGVycyBhcmUgbm90IGFsbG93ZWQ/IHRoaXMgaXMgd2hhdCBJIHN1cHBvc2UuLi46ICovXG4gICAgICAgICAgICAvKiBcIjRcXDNcXDcgLSBFaW5zdGVpbiBzYWlkIEU9bWMyXCIgLS0tLT4gXCI0XFxcXDNcXFxcN1xcIC1cXCBFaW5zdGVpblxcIHNhaWRcXCBFXFw9bWMyXCIgKi9cbiAgICAgICAgICAgIHJldHVybiBzVGV4dC5yZXBsYWNlKC9bXFxzXFw9XFxcXF0vZywgXCJcXFxcJCZcIik7XG4gICAgICAgIH0sXG5cbiAgICAgICAgc2V0SGVhZGVycyggcmVxLCBoZWFkZXJzPXt9ICkge1xuICAgICAgICAgICAgcmVxLnNldFJlcXVlc3RIZWFkZXIoIFwiQWNjZXB0XCIsIGhlYWRlcnMuYWNjZXB0IHx8ICdhcHBsaWNhdGlvbi9qc29uJyApXG4gICAgICAgICAgICByZXEuc2V0UmVxdWVzdEhlYWRlciggXCJDb250ZW50LVR5cGVcIiwgaGVhZGVycy5jb250ZW50VHlwZSB8fCAndGV4dC9wbGFpbicgKVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIF9mYWN0b3J5KCBkYXRhICkge1xuICAgICAgICByZXR1cm4gT2JqZWN0LmNyZWF0ZSggdGhpcy5SZXF1ZXN0LCB7IH0gKS5jb25zdHJ1Y3RvciggZGF0YSApXG4gICAgfSxcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuXG4gICAgICAgIGlmKCAhWE1MSHR0cFJlcXVlc3QucHJvdG90eXBlLnNlbmRBc0JpbmFyeSApIHtcbiAgICAgICAgICBYTUxIdHRwUmVxdWVzdC5wcm90b3R5cGUuc2VuZEFzQmluYXJ5ID0gZnVuY3Rpb24oc0RhdGEpIHtcbiAgICAgICAgICAgIHZhciBuQnl0ZXMgPSBzRGF0YS5sZW5ndGgsIHVpOERhdGEgPSBuZXcgVWludDhBcnJheShuQnl0ZXMpO1xuICAgICAgICAgICAgZm9yICh2YXIgbklkeCA9IDA7IG5JZHggPCBuQnl0ZXM7IG5JZHgrKykge1xuICAgICAgICAgICAgICB1aThEYXRhW25JZHhdID0gc0RhdGEuY2hhckNvZGVBdChuSWR4KSAmIDB4ZmY7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnNlbmQodWk4RGF0YSk7XG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLl9mYWN0b3J5LmJpbmQodGhpcylcbiAgICB9XG5cbn0gKSwgeyB9ICkuY29uc3RydWN0b3IoKVxuIiwibW9kdWxlLmV4cG9ydHMgPSBPYmplY3QuY3JlYXRlKCB7XG5cbiAgICBjcmVhdGUoIG5hbWUsIG9wdHMgKSB7XG4gICAgICAgIGNvbnN0IGxvd2VyID0gbmFtZVxuICAgICAgICBuYW1lID0gbmFtZS5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIG5hbWUuc2xpY2UoMSlcbiAgICAgICAgcmV0dXJuIE9iamVjdC5jcmVhdGUoXG4gICAgICAgICAgICB0aGlzLlZpZXdzWyBuYW1lIF0sXG4gICAgICAgICAgICBPYmplY3QuYXNzaWduKCB7XG4gICAgICAgICAgICAgICAgbmFtZTogeyB2YWx1ZTogbmFtZSB9LFxuICAgICAgICAgICAgICAgIGZhY3Rvcnk6IHsgdmFsdWU6IHRoaXMgfSxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogeyB2YWx1ZTogdGhpcy5UZW1wbGF0ZXNbIG5hbWUgXSB9LFxuICAgICAgICAgICAgICAgIHVzZXI6IHsgdmFsdWU6IHRoaXMuVXNlciB9XG4gICAgICAgICAgICAgICAgfSwgb3B0cyApXG4gICAgICAgICkuY29uc3RydWN0b3IoKVxuICAgICAgICAub24oICduYXZpZ2F0ZScsIHJvdXRlID0+IHJlcXVpcmUoJy4uL3JvdXRlcicpLm5hdmlnYXRlKCByb3V0ZSApIClcbiAgICAgICAgLm9uKCAnZGVsZXRlZCcsICgpID0+IGRlbGV0ZSAocmVxdWlyZSgnLi4vcm91dGVyJykpLnZpZXdzW25hbWVdIClcbiAgICB9LFxuXG59LCB7XG4gICAgVGVtcGxhdGVzOiB7IHZhbHVlOiByZXF1aXJlKCcuLi8uVGVtcGxhdGVNYXAnKSB9LFxuICAgIFVzZXI6IHsgdmFsdWU6IHJlcXVpcmUoJy4uL21vZGVscy9Vc2VyJyApIH0sXG4gICAgVmlld3M6IHsgdmFsdWU6IHJlcXVpcmUoJy4uLy5WaWV3TWFwJykgfVxufSApXG4iLCJ3aW5kb3cub25sb2FkID0gKCkgPT4ge1xuICAgIHJlcXVpcmUoJy4vLmVudicpXG4gICAgcmVxdWlyZSgnLi9yb3V0ZXInKS5pbml0aWFsaXplKClcbn1cbiIsIm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmNyZWF0ZSggcmVxdWlyZSgnLi9fX3Byb3RvX18uanMnKSwgeyByZXNvdXJjZTogeyB2YWx1ZTogJ21lJyB9IH0gKVxuIiwibW9kdWxlLmV4cG9ydHMgPSBPYmplY3QuYXNzaWduKCB7IH0sIHJlcXVpcmUoJy4uLy4uLy4uL2xpYi9NeU9iamVjdCcpLCByZXF1aXJlKCdldmVudHMnKS5FdmVudEVtaXR0ZXIucHJvdG90eXBlLCB7XG5cbiAgICBYaHI6IHJlcXVpcmUoJy4uL1hocicpLFxuXG4gICAgZ2V0KCBvcHRzPXsgcXVlcnk6e30gfSApIHtcbiAgICAgICAgaWYoIG9wdHMucXVlcnkgfHwgdGhpcy5wYWdpbmF0aW9uICkgT2JqZWN0LmFzc2lnbiggb3B0cy5xdWVyeSwgdGhpcy5wYWdpbmF0aW9uIClcbiAgICAgICAgcmV0dXJuIHRoaXMuWGhyKCB7IG1ldGhvZDogb3B0cy5tZXRob2QgfHwgJ2dldCcsIHJlc291cmNlOiB0aGlzLnJlc291cmNlLCBoZWFkZXJzOiB0aGlzLmhlYWRlcnMgfHwge30sIHFzOiBvcHRzLnF1ZXJ5ID8gSlNPTi5zdHJpbmdpZnkoIG9wdHMucXVlcnkgKSA6IHVuZGVmaW5lZCB9IClcbiAgICAgICAgLnRoZW4oIHJlc3BvbnNlID0+IHtcbiAgICAgICAgICAgIGlmKCAhdGhpcy5wYWdpbmF0aW9uICkgcmV0dXJuIFByb21pc2UucmVzb2x2ZSggdGhpcy5kYXRhID0gcmVzcG9uc2UgKVxuXG4gICAgICAgICAgICBpZiggIXRoaXMuZGF0YSApIHRoaXMuZGF0YSA9IFsgXVxuICAgICAgICAgICAgdGhpcy5kYXRhID0gdGhpcy5kYXRhLmNvbmNhdChyZXNwb25zZSlcbiAgICAgICAgICAgIHRoaXMucGFnaW5hdGlvbi5za2lwICs9IHRoaXMucGFnaW5hdGlvbi5saW1pdFxuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShyZXNwb25zZSlcbiAgICAgICAgfSApXG4gICAgfVxuXG59IClcbiIsIm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmNyZWF0ZSgge1xuXG4gICAgRXJyb3I6IHJlcXVpcmUoJy4uLy4uL2xpYi9NeUVycm9yJyksXG4gICAgXG4gICAgVXNlcjogcmVxdWlyZSgnLi9tb2RlbHMvVXNlcicpLFxuXG4gICAgVmlld0ZhY3Rvcnk6IHJlcXVpcmUoJy4vZmFjdG9yeS9WaWV3JyksXG4gICAgXG4gICAgVmlld3M6IHJlcXVpcmUoJy4vLlZpZXdNYXAnKSxcblxuICAgIGluaXRpYWxpemUoKSB7XG4gICAgICAgIHRoaXMuY29udGVudENvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNjb250ZW50JylcblxuICAgICAgICB3aW5kb3cub25wb3BzdGF0ZSA9IHRoaXMuaGFuZGxlLmJpbmQodGhpcylcblxuICAgICAgICB0aGlzLmhlYWRlciA9IHRoaXMuVmlld0ZhY3RvcnkuY3JlYXRlKCAnaGVhZGVyJywgeyBpbnNlcnRpb246IHsgdmFsdWU6IHsgZWw6IHRoaXMuY29udGVudENvbnRhaW5lciwgbWV0aG9kOiAnaW5zZXJ0QmVmb3JlJyB9IH0gfSApXG5cbiAgICAgICAgdGhpcy5Vc2VyLmdldCgpLnRoZW4oICgpID0+XG4gICAgICAgIFxuICAgICAgICAgICAgdGhpcy5oZWFkZXIub25Vc2VyKClcbiAgICAgICAgICAgIC5vbiggJ3NpZ25vdXQnLCAoKSA9PiBcbiAgICAgICAgICAgICAgICBQcm9taXNlLmFsbCggT2JqZWN0LmtleXMoIHRoaXMudmlld3MgKS5tYXAoIG5hbWUgPT4gdGhpcy52aWV3c1sgbmFtZSBdLmRlbGV0ZSgpICkgKVxuICAgICAgICAgICAgICAgIC50aGVuKCAoKSA9PiB0aGlzLmhlYWRlci5lbWl0KCAnbmF2aWdhdGUnLCAnLycgKSApXG4gICAgICAgICAgICAgICAgLmNhdGNoKCB0aGlzLkVycm9yIClcbiAgICAgICAgICAgIClcblxuICAgICAgICApXG4gICAgICAgIC5jYXRjaCggdGhpcy5FcnJvciApXG4gICAgICAgIC50aGVuKCAoKSA9PiB0aGlzLmhhbmRsZSgpIClcblxuICAgICAgICByZXR1cm4gdGhpc1xuICAgIH0sXG5cbiAgICBoYW5kbGUoKSB7XG4gICAgICAgIHRoaXMuaGFuZGxlciggd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lLnNwbGl0KCcvJykuc2xpY2UoMSkgKVxuICAgIH0sXG5cbiAgICBoYW5kbGVyKCBwYXRoICkge1xuICAgICAgICBjb25zdCBuYW1lID0gcGF0aFswXSA/IHBhdGhbMF0uY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBwYXRoWzBdLnNsaWNlKDEpIDogJycsXG4gICAgICAgICAgICAgIHZpZXcgPSB0aGlzLlZpZXdzW25hbWVdID8gcGF0aFswXSA6ICdob21lJztcblxuICAgICAgICAoICggdmlldyA9PT0gdGhpcy5jdXJyZW50VmlldyApXG4gICAgICAgICAgICA/IFByb21pc2UucmVzb2x2ZSgpXG4gICAgICAgICAgICA6IFByb21pc2UuYWxsKCBPYmplY3Qua2V5cyggdGhpcy52aWV3cyApLm1hcCggdmlldyA9PiB0aGlzLnZpZXdzWyB2aWV3IF0uaGlkZSgpICkgKSApIFxuICAgICAgICAudGhlbiggKCkgPT4ge1xuXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRWaWV3ID0gdmlld1xuXG4gICAgICAgICAgICBpZiggdGhpcy52aWV3c1sgdmlldyBdICkgcmV0dXJuIHRoaXMudmlld3NbIHZpZXcgXS5uYXZpZ2F0ZSggcGF0aCApXG5cbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoXG4gICAgICAgICAgICAgICAgdGhpcy52aWV3c1sgdmlldyBdID1cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5WaWV3RmFjdG9yeS5jcmVhdGUoIHZpZXcsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGluc2VydGlvbjogeyB2YWx1ZTogeyBlbDogdGhpcy5jb250ZW50Q29udGFpbmVyIH0gfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhdGg6IHsgdmFsdWU6IHBhdGgsIHdyaXRhYmxlOiB0cnVlIH1cbiAgICAgICAgICAgICAgICAgICAgfSApXG4gICAgICAgICAgICApXG4gICAgICAgIH0gKVxuICAgICAgICAuY2F0Y2goIHRoaXMuRXJyb3IgKVxuICAgIH0sXG5cbiAgICBuYXZpZ2F0ZSggbG9jYXRpb24gKSB7XG4gICAgICAgIGhpc3RvcnkucHVzaFN0YXRlKCB7fSwgJycsIGxvY2F0aW9uIClcbiAgICAgICAgdGhpcy5oYW5kbGUoKVxuICAgIH1cblxufSwgeyBjdXJyZW50VmlldzogeyB2YWx1ZTogJycsIHdyaXRhYmxlOiB0cnVlIH0sIHZpZXdzOiB7IHZhbHVlOiB7IH0gfSB9IClcbiIsIm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmFzc2lnbigge30sIHJlcXVpcmUoJy4vX19wcm90b19fJyksIHtcblxuICAgIGRlbGV0ZSgpIHtcbiAgICAgICAgcmV0dXJuIFByb21pc2UuYWxsKCBPYmplY3Qua2V5cyggdGhpcy5zdWJWaWV3cyApLm1hcCggc3ViVmlldyA9PiB0aGlzLnN1YlZpZXdzWyBzdWJWaWV3IF0uZGVsZXRlKCkgKSApXG4gICAgICAgIC50aGVuKCAoKSA9PiByZXF1aXJlKCcuL19fcHJvdG9fXycpLmRlbGV0ZS5jYWxsKHRoaXMpIClcbiAgICB9LFxuXG4gICAgbmF2aWdhdGUoIHBhdGggKSB7XG4gICAgICAgIHRoaXMucGF0aCA9IHBhdGg7XG5cbiAgICAgICAgcmV0dXJuICggcGF0aC5sZW5ndGggPT09IDEgJiYgdGhpcy5lbHMuY29udGFpbmVyLmNsYXNzTGlzdC5jb250YWlucygnaGlkZScpIClcbiAgICAgICAgICAgID8gUHJvbWlzZS5hbGwoIE9iamVjdC5rZXlzKCB0aGlzLnN1YlZpZXdzICkubWFwKCB2aWV3ID0+IHRoaXMuc3ViVmlld3NbIHZpZXcgXS5oaWRlKCkgKSApLnRoZW4oICgpID0+IHRoaXMuc2hvdygpICkuY2F0Y2goIHRoaXMuRXJyb3IgKVxuICAgICAgICAgICAgOiAoIHRoaXMucGF0aC5sZW5ndGggPiAxIClcbiAgICAgICAgICAgICAgICA/ICggdGhpcy5lbHMuY29udGFpbmVyLmNsYXNzTGlzdC5jb250YWlucygnaGlkZScpIClcbiAgICAgICAgICAgICAgICAgICAgPyB0aGlzLnJlbmRlclN1YlZpZXcoKVxuICAgICAgICAgICAgICAgICAgICA6IHRoaXMuaGlkZSgpLnRoZW4oICgpID0+IHRoaXMucmVuZGVyU3ViVmlldygpIClcbiAgICAgICAgICAgICAgICA6IFByb21pc2UucmVzb2x2ZSgpXG4gICAgfSxcblxuICAgIHBvc3RSZW5kZXIoKSB7XG4gICAgICAgIHRoaXMudmlld3MgPSB7IH1cbiAgICAgICAgdGhpcy5zdWJWaWV3cyA9IHsgfVxuXG4gICAgICAgIGlmKCB0aGlzLnBhdGgubGVuZ3RoID4gMSApIHtcbiAgICAgICAgICAgIHRoaXMuZWxzLmNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCAnaGlkZScsICdoaWRkZW4nIClcbiAgICAgICAgICAgIHRoaXMucmVuZGVyU3ViVmlldygpXG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLm9wdGlvbnMgPSBPYmplY3QuY3JlYXRlKCB0aGlzLk1vZGVsLCB7IHJlc291cmNlOiB7IHZhbHVlOiAnYWRtaW4nIH0gfSApXG5cbiAgICAgICAgdGhpcy5vcHRpb25zLmdldCggeyBtZXRob2Q6ICdvcHRpb25zJyB9IClcbiAgICAgICAgLnRoZW4oICgpID0+XG4gICAgICAgICAgICB0aGlzLm9wdGlvbnMuZGF0YS5mb3JFYWNoKCBjb2xsZWN0aW9uID0+XG4gICAgICAgICAgICAgICAgdGhpcy52aWV3c1sgY29sbGVjdGlvbiBdID0gdGhpcy5mYWN0b3J5LmNyZWF0ZShcbiAgICAgICAgICAgICAgICAgICAgJ0FkbWluSXRlbScsXG4gICAgICAgICAgICAgICAgICAgIHsgaW5zZXJ0aW9uOiB7IHZhbHVlOiB7IGVsOiB0aGlzLmVscy5saXN0IH0gfSxcbiAgICAgICAgICAgICAgICAgICAgICBtb2RlbDogeyB2YWx1ZTogeyBkYXRhOiB7IGNvbGxlY3Rpb24gfSB9IH0gfVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgIClcbiAgICAgICAgKVxuICAgICAgICAuY2F0Y2goIHRoaXMuRXJyb3IgKVxuXG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgfSxcblxuICAgIHJlbmRlclN1YlZpZXcoKSB7XG4gICAgICAgIGNvbnN0IHN1YlZpZXdOYW1lID0gYCR7dGhpcy5jYXBpdGFsaXplRmlyc3RMZXR0ZXIodGhpcy5wYXRoWzFdKX1SZXNvdXJjZXNgXG5cbiAgICAgICAgcmV0dXJuIHRoaXMuc3ViVmlld3NbIHN1YlZpZXdOYW1lIF1cbiAgICAgICAgICAgID8gdGhpcy5zdWJWaWV3c1sgc3ViVmlld05hbWUgXS5vbk5hdmlnYXRpb24oIHRoaXMucGF0aCApXG4gICAgICAgICAgICA6IHRoaXMuc3ViVmlld3NbIHN1YlZpZXdOYW1lIF0gPSB0aGlzLmZhY3RvcnkuY3JlYXRlKCBzdWJWaWV3TmFtZSwgeyBwYXRoOiB7IHZhbHVlOiB0aGlzLnBhdGgsIHdyaXRhYmxlOiB0cnVlIH0sIGluc2VydGlvbjogeyB2YWx1ZTogeyBlbDogdGhpcy5lbHMuY29udGFpbmVyLCBtZXRob2Q6ICdpbnNlcnRCZWZvcmUnIH0gfSB9IClcbiAgICB9LFxuXG4gICAgcmVxdWlyZXNMb2dpbjogdHJ1ZVxufSApXG4iLCJtb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5hc3NpZ24oIHt9LCByZXF1aXJlKCcuL19fcHJvdG9fXycpLCB7XG5cbiAgICBldmVudHM6IHtcbiAgICAgICAgY29udGFpbmVyOiAnY2xpY2snXG4gICAgfSxcblxuICAgIG9uQ29udGFpbmVyQ2xpY2soKSB7XG4gICAgICAgIHRoaXMuZW1pdCggJ25hdmlnYXRlJywgYC9hZG1pbi8ke3RoaXMubW9kZWwuZGF0YS5jb2xsZWN0aW9ufWAgKVxuICAgIH1cbn0gKVxuIiwibW9kdWxlLmV4cG9ydHMgPSBPYmplY3QuYXNzaWduKCB7fSwgcmVxdWlyZSgnLi9fX3Byb3RvX18nKSwge1xuXG4gICAgZXZlbnRzOiB7XG4gICAgICAgIGNhbmNlbDogJ2NsaWNrJyxcbiAgICAgICAgY29uZmlybTogJ2NsaWNrJyxcbiAgICAgICAgZGVsZXRlOiAnY2xpY2snLFxuICAgICAgICBlZGl0OiAnY2xpY2snLFxuICAgICAgICBmYWNlYm9vazogJ2NsaWNrJyxcbiAgICAgICAgZ29vZ2xlOiAnY2xpY2snLFxuICAgICAgICB0aXRsZTogJ2NsaWNrJyxcbiAgICAgICAgdHdpdHRlcjogJ2NsaWNrJ1xuICAgIH0sXG5cbiAgICBnZXRMaW5rKCkge1xuICAgICAgICByZXR1cm4gYCR7d2luZG93LmxvY2F0aW9uLm9yaWdpbn0vY29taWMvJHt0aGlzLm1vZGVsLmRhdGEuX2lkfWBcbiAgICB9LFxuXG4gICAgZ2V0Q29taWMoKSB7XG4gICAgICAgIHJldHVybiBgJHt3aW5kb3cubG9jYXRpb24ub3JpZ2lufSR7dGhpcy5tb2RlbC5kYXRhLmltYWdlfWBcbiAgICB9LFxuXG4gICAgbmF2aWdhdGUoIHBhdGggKSB7XG4gICAgICAgIHRoaXMucGF0aCA9IHBhdGhcbiAgICAgICAgdGhpcy5tb2RlbC5yZXNvdXJjZSA9IGBjb21pYy8ke3RoaXMucGF0aFsxXX1gXG5cbiAgICAgICAgdGhpcy5tb2RlbC5nZXQoKVxuICAgICAgICAudGhlbiggY29taWMgPT4ge1xuICAgICAgICAgICAgdGhpcy51cGRhdGUoY29taWMpXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zaG93KClcbiAgICAgICAgfSApXG4gICAgICAgIC5jYXRjaCggdGhpcy5FcnJvciApXG4gICAgfSxcblxuICAgIG9uQ2FuY2VsQ2xpY2soKSB7XG4gICAgICAgIHRoaXMuZWxzLmhlYWRlci5jbGFzc0xpc3QucmVtb3ZlKCdoaWRkZW4nKVxuICAgICAgICB0aGlzLmVscy5jb25maXJtRGlhbG9nLmNsYXNzTGlzdC5hZGQoJ2hpZGRlbicpXG4gICAgfSxcblxuICAgIG9uQ29uZmlybUNsaWNrKCkge1xuICAgICAgICB0aGlzLmVtaXQoJ2RlbGV0ZScpXG4gICAgfSxcblxuICAgIG9uRGVsZXRlQ2xpY2soKSB7XG4gICAgICAgIGlmKCB0aGlzLnVzZXIgJiYgdGhpcy51c2VyLmRhdGEuX2lkICkge1xuICAgICAgICAgICAgdGhpcy5lbHMuaGVhZGVyLmNsYXNzTGlzdC5hZGQoJ2hpZGRlbicpXG4gICAgICAgICAgICB0aGlzLmVscy5jb25maXJtRGlhbG9nLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGRlbicpXG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgb25FZGl0Q2xpY2soKSB7XG4gICAgICAgIGlmKCB0aGlzLnVzZXIgJiYgdGhpcy51c2VyLmRhdGEuX2lkICkgdGhpcy5lbWl0KCdlZGl0JylcbiAgICB9LFxuXG4gICAgLy9vbkZhY2Vib29rQ2xpY2soKSB7IHdpbmRvdy5vcGVuKCBgaHR0cHM6Ly93d3cuZmFjZWJvb2suY29tL3NoYXJlLnBocD91PSR7dGhpcy5nZXRMaW5rKCl9YCApIH0sXG4gICAgXG4gICAgb25GYWNlYm9va0NsaWNrKCkge1xuICAgICAgICB3aW5kb3cub3BlbihcbiAgICAgICAgICAgIGBodHRwOi8vd3d3LnphenpsZS5jb20vYXBpL2NyZWF0ZS9hdC0yMzg1NTU4NzgxMjM4NTQwMzE/cmY9MjM4MzU3NDcwODg0Njg1NDY4JmAgK1xuICAgICAgICAgICAgYGF4PURlc2lnbkJsYXN0JnNyPTI1MDM3NTIwMjU0MjE4MDgwMCZjZz0wJnRfX3VzZVFwYz10cnVlJmVkPWZhbHNlJnRfX3NtYXJ0PXRydWUmYCArXG4gICAgICAgICAgICBgY29udGludWVVcmw9JHtlbmNvZGVVUklDb21wb25lbnQod2luZG93LmxvY2F0aW9uLm9yaWdpbil9JmZ3ZD1Qcm9kdWN0UGFnZSZ0Yz0ke3dpbmRvdy5sb2NhdGlvbn0maWM9JHt0aGlzLm1vZGVsLmRhdGEuX2lkfSZpbWFnZTE9JHt0aGlzLmdldENvbWljKCl9YCApXG4gICAgfSxcbiAgICBcbiAgICBvbkdvb2dsZUNsaWNrKCkgeyB3aW5kb3cub3BlbiggYGh0dHBzOi8vcGx1cy5nb29nbGUuY29tL3NoYXJlP3VybD17JHt0aGlzLmdldExpbmsoKX19YCkgfSxcbiAgICBcbiAgICBvblRpdGxlQ2xpY2soKSB7IHRoaXMuZW1pdCggJ25hdmlnYXRlJywgYC9jb21pYy8ke3RoaXMubW9kZWwuZGF0YS5faWR9YCApIH0sXG5cbiAgICBvblR3aXR0ZXJDbGljaygpIHsgd2luZG93Lm9wZW4oIGBodHRwczovL3d3dy50d2l0dGVyLmNvbS9zaGFyZT91cmw9JHt0aGlzLmdldExpbmsoKX0mdmlhPXRpbnloYW5kZWQmdGV4dD0ke2VuY29kZVVSSUNvbXBvbmVudCh0aGlzLm1vZGVsLmRhdGEudGl0bGUpfWAgKSB9LFxuXG4gICAgcG9zdFJlbmRlcigpIHtcbiAgICAgICAgaWYoIHRoaXMubW9kZWwgJiYgdGhpcy5tb2RlbC5kYXRhLl9pZCApIHJldHVybiB0aGlzXG5cbiAgICAgICAgaWYoIHRoaXMucGF0aC5sZW5ndGggIT09IDIgKSB7IHRoaXMuZW1pdCggJ25hdmlnYXRlJywgJycgKTsgcmV0dXJuIHRoaXMgfVxuXG4gICAgICAgIHRoaXMubW9kZWwgPSBPYmplY3QuY3JlYXRlKCB0aGlzLk1vZGVsLCB7IHJlc291cmNlOiB7IHZhbHVlOiBgY29taWMvJHt0aGlzLnBhdGhbMV19YCwgd3JpdGFibGU6IHRydWUgfSB9IClcbiAgICAgICAgdGhpcy5tb2RlbC5nZXQoKVxuICAgICAgICAudGhlbiggdGhpcy51cGRhdGUuYmluZCh0aGlzKSApXG4gICAgICAgIC5jYXRjaCggdGhpcy5FcnJvciApXG5cbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICB9LFxuXG4gICAgdXBkYXRlKGNvbWljKSB7XG4gICAgICAgIHRoaXMubW9kZWwuZGF0YSA9IGNvbWljXG4gICAgICAgIHRoaXMuZWxzLnRpdGxlLnRleHRDb250ZW50ID0gY29taWMudGl0bGVcbiAgICAgICAgdGhpcy5lbHMuaW1hZ2Uuc3JjID0gYCR7Y29taWMuaW1hZ2V9PyR7bmV3IERhdGUoKS5nZXRUaW1lKCl9YFxuICAgIH1cbn0gKVxuIiwibW9kdWxlLmV4cG9ydHMgPSBPYmplY3QuYXNzaWduKCB7fSwgcmVxdWlyZSgnLi9fX3Byb3RvX18nKSwge1xuXG4gICAgZXZlbnRzOiB7XG4gICAgICAgIGNhbmNlbDogJ2NsaWNrJyxcbiAgICAgICAgc3VibWl0OiAnY2xpY2snXG4gICAgfSxcblxuICAgIG9uQ2FuY2VsQ2xpY2soKSB7IHRoaXMuaGlkZSgpLnRoZW4oICgpID0+IHRoaXMuZW1pdCgnY2FuY2VsbGVkJykgKSB9LFxuICAgIFxuICAgIG9uU3VibWl0Q2xpY2soKSB7XG4gICAgICAgIHRoaXNbIGByZXF1ZXN0JHt0aGlzLmNhcGl0YWxpemVGaXJzdExldHRlciggdGhpcy50eXBlICl9YCBdKClcbiAgICAgICAgLmNhdGNoKCB0aGlzLkVycm9yIClcbiAgICB9LFxuXG4gICAgb25OYXZpZ2F0aW9uKCB0eXBlLCBjb21pYyApIHtcbiAgICAgICAgdGhpcy50eXBlID0gdHlwZVxuICAgICAgICB0aGlzLm1vZGVsLmRhdGEgPSBjb21pY1xuICAgICAgIFxuICAgICAgICB0aGlzLnBvcHVsYXRlKCkgXG5cbiAgICAgICAgaWYoIHRoaXMuZWxzLmNvbnRhaW5lci5jbGFzc0xpc3QuY29udGFpbnMoJ2hpZGUnKSApIHRoaXMuc2hvdygpXG4gICAgfSxcblxuICAgIHBvcHVsYXRlKCkge1xuICAgICAgICB0aGlzLmVscy5oZWFkZXIudGV4dENvbnRlbnQgPSBgJHt0aGlzLmNhcGl0YWxpemVGaXJzdExldHRlciggdGhpcy50eXBlICl9IENvbWljYFxuXG4gICAgICAgIGlmKCBPYmplY3Qua2V5cyggdGhpcy5tb2RlbC5kYXRhICkubGVuZ3RoICkge1xuICAgICAgICAgICAgdGhpcy5lbHMudGl0bGUudmFsdWUgPSB0aGlzLm1vZGVsLmRhdGEudGl0bGUgfHwgJydcbiAgICAgICAgICAgIHRoaXMuZWxzLnByZXZpZXcuc3JjID0gdGhpcy5tb2RlbC5kYXRhLmltYWdlXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmVscy50aXRsZS52YWx1ZSA9ICcnXG4gICAgICAgICAgICB0aGlzLmVscy5wcmV2aWV3LnNyYyA9ICcnXG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgcG9zdFJlbmRlcigpIHtcbiAgICAgICAgdGhpcy5zcGlubmVyID0gbmV3IHRoaXMuU3Bpbm5lcigge1xuICAgICAgICAgICAgY29sb3I6ICcjZmZmJyxcbiAgICAgICAgICAgIGxlbmd0aDogMTUsXG4gICAgICAgICAgICBzY2FsZTogMC4yNSxcbiAgICAgICAgICAgIHdpZHRoOiA1XG4gICAgICAgIH0gKS5zcGluKClcblxuICAgICAgICB0aGlzLnBvcHVsYXRlKClcblxuICAgICAgICB0aGlzLmVscy5pbWFnZS5hZGRFdmVudExpc3RlbmVyKCAnY2hhbmdlJywgZSA9PiB7XG4gICAgICAgICAgICBjb25zdCBiYXNlNjRSZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpLFxuICAgICAgICAgICAgICAgICAgYmluYXJ5UmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKVxuICAgICAgICAgICAgXG4gICAgICAgICAgICB0aGlzLmVscy51cGxvYWQuY2xhc3NMaXN0LmFkZCgnaGFzLXNwaW5uZXInKVxuICAgICAgICAgICAgdGhpcy5lbHMudXBsb2FkLmFwcGVuZENoaWxkKCB0aGlzLnNwaW5uZXIuc3BpbigpLmVsIClcblxuICAgICAgICAgICAgYmFzZTY0UmVhZGVyLm9ubG9hZCA9ICggZXZ0ICkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuZmlsZSA9IGV2dC50YXJnZXQucmVzdWx0XG4gICAgICAgICAgICAgICAgdGhpcy5lbHMudXBsb2FkLmNsYXNzTGlzdC5yZW1vdmUoJ2hhcy1zcGlubmVyJylcbiAgICAgICAgICAgICAgICB0aGlzLnNwaW5uZXIuc3RvcCgpXG4gICAgICAgICAgICAgICAgdGhpcy5lbHMucHJldmlldy5zcmMgPSBldnQudGFyZ2V0LnJlc3VsdCBcbiAgICAgICAgICAgICAgICBiaW5hcnlSZWFkZXIub25sb2FkID0gZXZlbnQgPT4gdGhpcy5iaW5hcnlGaWxlID0gZXZlbnQudGFyZ2V0LnJlc3VsdFxuICAgICAgICAgICAgICAgIGJpbmFyeVJlYWRlci5yZWFkQXNBcnJheUJ1ZmZlciggZS50YXJnZXQuZmlsZXNbMF0gKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBiYXNlNjRSZWFkZXIucmVhZEFzRGF0YVVSTCggZS50YXJnZXQuZmlsZXNbMF0gKVxuICAgICAgICB9IClcbiAgICAgICAgICAgIFxuICAgICAgICByZXR1cm4gdGhpc1xuICAgIH0sXG5cbiAgICByZXF1ZXN0QWRkKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5YaHIoIHsgbWV0aG9kOiAnUE9TVCcsIHJlc291cmNlOiAnZmlsZScsIGRhdGE6IHRoaXMuYmluYXJ5RmlsZSwgaGVhZGVyczogeyBjb250ZW50VHlwZTogJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbScgfSB9IClcbiAgICAgICAgLnRoZW4oIHJlc3BvbnNlID0+IHRoaXMuWGhyKCB7IG1ldGhvZDogJ1BPU1QnLCByZXNvdXJjZTogJ2NvbWljJywgZGF0YTogSlNPTi5zdHJpbmdpZnkoIHsgdGl0bGU6IHRoaXMuZWxzLnRpdGxlLnZhbHVlLCBpbWFnZTogcmVzcG9uc2UucGF0aCwgY3JlYXRlZDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpIH0gKSB9ICkgKVxuICAgICAgICAudGhlbiggcmVzcG9uc2UgPT4gdGhpcy5oaWRlKCkudGhlbiggKCkgPT4gdGhpcy5lbWl0KCAnYWRkZWQnLCByZXNwb25zZSApICkgKVxuICAgIH0sXG5cbiAgICByZXF1ZXN0RWRpdCgpIHtcbiAgICAgICAgbGV0IGRhdGEgPSB7IHRpdGxlOiB0aGlzLmVscy50aXRsZS52YWx1ZSB9XG4gICAgICAgIFxuICAgICAgICByZXR1cm4gKCAoIHRoaXMuYmluYXJ5RmlsZSApXG4gICAgICAgICAgICA/IHRoaXMuWGhyKCB7IG1ldGhvZDogJ1BBVENIJywgcmVzb3VyY2U6IGBmaWxlLyR7dGhpcy5tb2RlbC5kYXRhLmltYWdlLnNwbGl0KCcvJylbNF19YCwgZGF0YTogdGhpcy5iaW5hcnlGaWxlLCBoZWFkZXJzOiB7IGNvbnRlbnRUeXBlOiAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJyB9IH0gKVxuICAgICAgICAgICAgOiBQcm9taXNlLnJlc29sdmUoKSApXG4gICAgICAgIC50aGVuKCAoKSA9PiB0aGlzLlhociggeyBtZXRob2Q6ICdQQVRDSCcsIHJlc291cmNlOiBgY29taWMvJHt0aGlzLm1vZGVsLmRhdGEuX2lkfWAsIGRhdGE6IEpTT04uc3RyaW5naWZ5KCBkYXRhICkgfSApIClcbiAgICAgICAgLnRoZW4oIHJlc3BvbnNlID0+IHRoaXMuaGlkZSgpLnRoZW4oICgpID0+IHRoaXMuZW1pdCggJ2VkaXRlZCcsIHJlc3BvbnNlICkgKSApXG4gICAgfVxufSApXG4iLCJtb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5hc3NpZ24oIHt9LCByZXF1aXJlKCcuL19fcHJvdG9fXycpLCB7XG5cbiAgICBjcmVhdGVDb21pY1ZpZXcoIGNvbWljLCBvcHRzPXt9ICkge1xuICAgICAgICB0aGlzLnZpZXdzWyBjb21pYy5faWQgXSA9IHRoaXMuZmFjdG9yeS5jcmVhdGUoXG4gICAgICAgICAgICAnQ29taWMnLFxuICAgICAgICAgICAgeyBpbnNlcnRpb246IG9wdHMuaW5zZXJ0aW9uIHx8IHsgdmFsdWU6IHsgZWw6IHRoaXMuZWxzLmxpc3QgfSB9LFxuICAgICAgICAgICAgICBtb2RlbDogeyB2YWx1ZTogeyBkYXRhOiBjb21pYyB9IH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgKVxuXG4gICAgICAgIHRoaXMudmlld3NbIGNvbWljLl9pZCBdXG4gICAgICAgIC5vbiggJ2VkaXQnLCAoKSA9PiB0aGlzLmVtaXQoICduYXZpZ2F0ZScsIGAvYWRtaW4vY29taWMvZWRpdC8ke2NvbWljLl9pZH1gKSApXG4gICAgICAgIC5vbiggJ2RlbGV0ZScsICgpID0+XG4gICAgICAgICAgICB0aGlzLlhociggeyBtZXRob2Q6ICdkZWxldGUnLCByZXNvdXJjZTogYGNvbWljLyR7Y29taWMuX2lkfWAgfSApXG4gICAgICAgICAgICAudGhlbiggKCkgPT4gdGhpcy52aWV3c1sgY29taWMuX2lkIF0uZGVsZXRlKCkgKVxuICAgICAgICAgICAgLmNhdGNoKCB0aGlzLkVycm9yIClcbiAgICAgICAgKVxuICAgIH0sXG5cbiAgICBkZWxldGUoKSB7XG4gICAgICAgIHJldHVybiAoICggdGhpcy52aWV3cy5Db21pY01hbmFnZSApXG4gICAgICAgICAgICA/IHRoaXMudmlld3MuQ29taWNNYW5hZ2UuZGVsZXRlKClcbiAgICAgICAgICAgIDogUHJvbWlzZS5yZXNvbHZlKCkgKVxuICAgICAgICAudGhlbiggKCkgPT4gcmVxdWlyZSgnLi9fX3Byb3RvX18nKS5kZWxldGUuY2FsbCh0aGlzKSApXG4gICAgfSxcblxuICAgIGV2ZW50czoge1xuICAgICAgICBhZGRCdG46ICdjbGljaydcbiAgICB9LFxuXG4gICAgZmV0Y2hBbmREaXNwbGF5KCkge1xuICAgICAgICB0aGlzLmZldGNoaW5nID0gdHJ1ZVxuICAgICAgICByZXR1cm4gdGhpcy5jb21pY3MuZ2V0KClcbiAgICAgICAgLnRoZW4oIHJlc3BvbnNlID0+IHtcbiAgICAgICAgICAgIHJlc3BvbnNlLmZvckVhY2goIGNvbWljID0+IHRoaXMuY3JlYXRlQ29taWNWaWV3KGNvbWljKSApXG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRoaXMuZmV0Y2hpbmcgPSBmYWxzZSApXG4gICAgICAgIH0gKVxuICAgIH0sXG5cbiAgICBtYW5hZ2VDb21pYyggdHlwZSwgY29taWMgKSB7XG4gICAgICAgIHRoaXMudmlld3MuQ29taWNNYW5hZ2UgXG4gICAgICAgICAgICA/IHRoaXMudmlld3MuQ29taWNNYW5hZ2Uub25OYXZpZ2F0aW9uKCB0eXBlLCBjb21pYyApXG4gICAgICAgICAgICA6IHRoaXMudmlld3MuQ29taWNNYW5hZ2UgPVxuICAgICAgICAgICAgICAgIHRoaXMuZmFjdG9yeS5jcmVhdGUoICdDb21pY01hbmFnZScsIHsgdHlwZTogeyB2YWx1ZTogdHlwZSwgd3JpdGFibGU6IHRydWUgfSwgbW9kZWw6IHsgdmFsdWU6IHsgZGF0YTogY29taWMgfHwge30gfSB9LCBpbnNlcnRpb246IHsgdmFsdWU6IHsgZWw6IHRoaXMuZWxzLmNvbnRhaW5lciwgbWV0aG9kOiAnaW5zZXJ0QmVmb3JlJyB9IH0gfSApXG4gICAgICAgICAgICAgICAgLm9uKCAnYWRkZWQnLCBjb21pYyA9PiB7IHRoaXMuY3JlYXRlQ29taWNWaWV3KGNvbWljLCB7IGluc2VydGlvbjogeyB2YWx1ZTogeyBlbDogdGhpcy5lbHMubGlzdC5maXJzdENoaWxkLCBtZXRob2Q6ICdpbnNlcnRCZWZvcmUnIH0gfSB9ICk7IHRoaXMuZW1pdCggJ25hdmlnYXRlJywgYC9hZG1pbi9jb21pY2AgKTsgfSApXG4gICAgICAgICAgICAgICAgLm9uKCAnY2FuY2VsbGVkJywgKCkgPT4gdGhpcy5lbWl0KCAnbmF2aWdhdGUnLCBgL2FkbWluL2NvbWljYCApIClcbiAgICAgICAgICAgICAgICAub24oICdlZGl0ZWQnLCBjb21pYyA9PiB7IHRoaXMudmlld3NbIGNvbWljLl9pZCBdLnVwZGF0ZSggY29taWMgKTsgdGhpcy5lbWl0KCAnbmF2aWdhdGUnLCBgL2FkbWluL2NvbWljYCApOyB9IClcbiAgICB9LFxuXG4gICAgb25BZGRCdG5DbGljaygpIHsgdGhpcy5lbWl0KCAnbmF2aWdhdGUnLCBgL2FkbWluL2NvbWljL2FkZGAgKSB9LFxuXG4gICAgb25OYXZpZ2F0aW9uKCBwYXRoICkge1xuICAgICAgICB0aGlzLnBhdGggPSBwYXRoO1xuXG4gICAgICAgICggcGF0aC5sZW5ndGggPT09IDIgJiYgdGhpcy5lbHMuY29udGFpbmVyLmNsYXNzTGlzdC5jb250YWlucygnaGlkZScpICkgXG4gICAgICAgICAgICA/IHRoaXMudmlld3MuQ29taWNNYW5hZ2UgJiYgIXRoaXMudmlld3MuQ29taWNNYW5hZ2UuZWxzLmNvbnRhaW5lci5jbGFzc0xpc3QuY29udGFpbnMoJ2hpZGUnKVxuICAgICAgICAgICAgICAgID8gdGhpcy52aWV3cy5Db21pY01hbmFnZS5oaWRlKCkudGhlbiggKCkgPT4gdGhpcy5zaG93KCkgKVxuICAgICAgICAgICAgICAgIDogdGhpcy5zaG93KClcbiAgICAgICAgICAgIDogcGF0aC5sZW5ndGggPT09IDNcbiAgICAgICAgICAgICAgICA/IHRoaXMuaGlkZSgpLnRoZW4oICgpID0+IHRoaXMubWFuYWdlQ29taWMoIHBhdGhbMl0sIHsgfSApIClcbiAgICAgICAgICAgICAgICA6IHBhdGgubGVuZ3RoID09PSA0XG4gICAgICAgICAgICAgICAgICAgICA/IHRoaXMuaGlkZSgpLnRoZW4oICgpID0+IHRoaXMubWFuYWdlQ29taWMoIHBhdGhbMl0sIHRoaXMudmlld3NbIHBhdGhbM10gXS5tb2RlbC5kYXRhICkgKVxuICAgICAgICAgICAgICAgICAgICAgOiB1bmRlZmluZWRcbiAgICB9LFxuXG4gICAgb25TY3JvbGwoIGUgKSB7XG4gICAgICAgIGlmKCB0aGlzLmZldGNoaW5nIHx8IHRoaXMuaXNIaWRkZW4oKSApIHJldHVyblxuICAgICAgICBpZiggKCB0aGlzLmNvbnRlbnQub2Zmc2V0SGVpZ2h0IC0gKCB3aW5kb3cuc2Nyb2xsWSArIHdpbmRvdy5pbm5lckhlaWdodCApICkgPCAxMDAgKSB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCB0aGlzLmZldGNoQW5kRGlzcGxheS5iaW5kKHRoaXMpLmNhdGNoKCB0aGlzLkVycm9yICkgKVxuICAgIH0sXG5cbiAgICBwb3N0UmVuZGVyKCkge1xuICAgICAgICB0aGlzLmNvbnRlbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjY29udGVudCcpXG5cbiAgICAgICAgaWYoIHRoaXMucGF0aC5sZW5ndGggPiAyICkge1xuICAgICAgICAgICAgdGhpcy5lbHMuY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoICdoaWRkZW4nLCAnaGlkZScgKVxuICAgICAgICAgICAgaWYoIHRoaXMucGF0aFsyXSA9PT0gXCJhZGRcIiApIHsgdGhpcy5tYW5hZ2VDb21pYyggXCJhZGRcIiwgeyB9ICkgfVxuICAgICAgICAgICAgZWxzZSBpZiggdGhpcy5wYXRoWzJdID09PSBcImVkaXRcIiAmJiB0aGlzLnBhdGhbM10gKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5YaHIoIHsgbWV0aG9kOiBcImdldFwiLCByZXNvdXJjZTogYGNvbWljLyR7dGhpcy5wYXRoWzNdfWAgfSApXG4gICAgICAgICAgICAgICAgLnRoZW4oIHJlc3BvbnNlID0+IHRoaXMubWFuYWdlQ29taWMoIFwiZWRpdFwiLCByZXNwb25zZSApIClcbiAgICAgICAgICAgICAgICAuY2F0Y2goIGUgPT4geyB0aGlzLkVycm9yKGUpOyB0aGlzLmVtaXQoICduYXZpZ2F0ZScsIGAvYWRtaW4vY29taWNgICkgfSApXG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiggdGhpcy5wYXRoLmxlbmd0aCA9PT0gMSAmJiB0aGlzLnZpZXdzLkNvbWljTWFuYWdlICkge1xuICAgICAgICAgICAgdGhpcy52aWV3cy5Db21pY01hbmFnZS5oaWRlKClcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuY29taWNzID0gT2JqZWN0LmNyZWF0ZSggdGhpcy5Nb2RlbCwgeyBwYWdpbmF0aW9uOiB7IHZhbHVlOiB7IHNraXA6IDAsIGxpbWl0OjEwLCBzb3J0OiB7IGNyZWF0ZWQ6IC0xIH0gfSB9LCByZXNvdXJjZTogeyB2YWx1ZTogJ2NvbWljJyB9IH0gKVxuICAgICAgICBcbiAgICAgICAgdGhpcy5mZXRjaEFuZERpc3BsYXkoKS5jYXRjaCggdGhpcy5FcnJvciApXG5cbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoICdzY3JvbGwnLCBlID0+IHRoaXMub25TY3JvbGwoZSkgKVxuXG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgfSxcblxuICAgIHJlcXVpcmVzTG9naW46IHRydWVcbn0gKVxuIiwibW9kdWxlLmV4cG9ydHMgPSBPYmplY3QuYXNzaWduKCB7fSwgcmVxdWlyZSgnLi9fX3Byb3RvX18nKSwge1xuXG4gICAgZXZlbnRzOiB7XG4gICAgICAgIGxvZ286ICdjbGljaydcbiAgICB9LFxuXG4gICAgb25Vc2VyKCkge1xuICAgICAgICByZXR1cm4gdGhpc1xuICAgIH0sXG5cbiAgICBvbkxvZ29DbGljaygpIHtcbiAgICAgICAgdGhpcy5zaWdub3V0KClcbiAgICB9LFxuXG4gICAgcmVxdWlyZXNMb2dpbjogZmFsc2UsXG4gICAgXG4gICAgc2lnbm91dCgpIHtcblxuICAgICAgICBkb2N1bWVudC5jb29raWUgPSBgJHt3aW5kb3cuY29va2llTmFtZX09OyBleHBpcmVzPVRodSwgMDEgSmFuIDE5NzAgMDA6MDA6MDEgR01UO2A7XG5cbiAgICAgICAgdGhpcy51c2VyLmRhdGEgPSB7IH1cblxuICAgICAgICB0aGlzLmVtaXQoICdzaWdub3V0JyApXG5cbiAgICB9XG5cbn0gKVxuIiwibW9kdWxlLmV4cG9ydHMgPSBPYmplY3QuYXNzaWduKCB7fSwgcmVxdWlyZSgnLi9fX3Byb3RvX18nKSwge1xuXG4gICAgZmV0Y2hBbmREaXNwbGF5KCkge1xuICAgICAgICB0aGlzLmZldGNoaW5nID0gdHJ1ZVxuICAgICAgICByZXR1cm4gdGhpcy5nZXREYXRhKClcbiAgICAgICAgLnRoZW4oIHJlc3BvbnNlID0+IHtcbiAgICAgICAgICAgIHJlc3BvbnNlLmZvckVhY2goIGNvbWljID0+XG4gICAgICAgICAgICAgICAgdGhpcy52aWV3c1sgY29taWMuX2lkIF0gPVxuICAgICAgICAgICAgICAgICAgICB0aGlzLmZhY3RvcnkuY3JlYXRlKCAnY29taWMnLCB7IGluc2VydGlvbjogeyB2YWx1ZTogeyBlbDogdGhpcy5lbHMuY29udGFpbmVyIH0gfSwgbW9kZWw6IHsgdmFsdWU6IHsgZGF0YTogY29taWMgfSB9LCB0ZW1wbGF0ZU9wdHM6IHsgdmFsdWU6IHsgcmVhZE9ubHk6IHRydWUgfSB9IH0gKVxuICAgICAgICAgICAgKVxuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh0aGlzLmZldGNoaW5nID0gZmFsc2UgKVxuICAgICAgICB9IClcbiAgICB9LFxuXG4gICAgZ2V0RGF0YSgpIHtcbiAgICAgICAgaWYoICF0aGlzLm1vZGVsICkgdGhpcy5tb2RlbCA9IE9iamVjdC5jcmVhdGUoIHRoaXMuTW9kZWwsIHsgcGFnaW5hdGlvbjogeyB2YWx1ZTogeyBza2lwOiAwLCBsaW1pdDoxMCwgc29ydDogeyBjcmVhdGVkOiAtMSB9IH0gfSwgcmVzb3VyY2U6IHsgdmFsdWU6ICdjb21pYycgfSB9IClcblxuICAgICAgICByZXR1cm4gdGhpcy5tb2RlbC5nZXQoKVxuICAgIH0sXG5cbiAgICBuYXZpZ2F0ZSgpIHtcbiAgICAgICAgdGhpcy5zaG93KClcbiAgICB9LFxuXG4gICAgb25TY3JvbGwoIGUgKSB7XG4gICAgICAgIGlmKCB0aGlzLmZldGNoaW5nICkgcmV0dXJuXG4gICAgICAgIGlmKCAoIHRoaXMuY29udGVudC5vZmZzZXRIZWlnaHQgLSAoIHdpbmRvdy5zY3JvbGxZICsgd2luZG93LmlubmVySGVpZ2h0ICkgKSA8IDEwMCApIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoIHRoaXMuZmV0Y2hBbmREaXNwbGF5LmJpbmQodGhpcykgKVxuICAgIH0sXG5cbiAgICBwb3N0UmVuZGVyKCkge1xuICAgICAgICB0aGlzLmNvbnRlbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjY29udGVudCcpXG4gICAgICAgIFxuICAgICAgICB0aGlzLmZldGNoQW5kRGlzcGxheSgpLmNhdGNoKCB0aGlzLkVycm9yIClcblxuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lciggJ3Njcm9sbCcsIGUgPT4gdGhpcy5vblNjcm9sbChlKSApXG5cbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICB9XG5cbn0gKVxuIiwibW9kdWxlLmV4cG9ydHMgPSBPYmplY3QuYXNzaWduKCB7fSwgcmVxdWlyZSgnLi9fX3Byb3RvX18nKSwge1xuICAgIFxuICAgIGV2ZW50czoge1xuICAgICAgICBzdWJtaXQ6ICdjbGljaydcbiAgICB9LFxuXG4gICAgb25TdWJtaXRDbGljaygpIHtcbiAgICAgICAgdGhpcy5YaHIoIHsgbWV0aG9kOiAncG9zdCcsIHJlc291cmNlOiAnYXV0aCcsIGRhdGE6IEpTT04uc3RyaW5naWZ5KCB7IHVzZXJuYW1lOiB0aGlzLmVscy51c2VybmFtZS52YWx1ZSwgcGFzc3dvcmQ6IHRoaXMuZWxzLnBhc3N3b3JkLnZhbHVlIH0gKSB9IClcbiAgICAgICAgLnRoZW4oICgpID0+IHRoaXMudXNlci5nZXQoKSApXG4gICAgICAgIC50aGVuKCAoKSA9PiB0aGlzLmhpZGUoKSApXG4gICAgICAgIC50aGVuKCAoKSA9PiBQcm9taXNlLnJlc29sdmUoIHRoaXMuZW1pdCggJ2xvZ2dlZEluJyApKSApXG4gICAgICAgIC5jYXRjaCggdGhpcy5FcnJvciApXG4gICAgfVxufSApXG4iLCJtb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5hc3NpZ24oIHt9LCByZXF1aXJlKCcuL19fcHJvdG9fXycpLCB7XG5cbiAgICBldmVudHM6IHtcbiAgICAgICAgY2FuY2VsOiAnY2xpY2snLFxuICAgICAgICBjb25maXJtOiAnY2xpY2snLFxuICAgICAgICBkZWxldGU6ICdjbGljaycsXG4gICAgICAgIGVkaXQ6ICdjbGljaydcbiAgICB9LFxuXG4gICAgb25DYW5jZWxDbGljaygpIHtcbiAgICAgICAgdGhpcy5lbHMudXNlcm5hbWUuY2xhc3NMaXN0LnJlbW92ZSgnaGlkZGVuJylcbiAgICAgICAgdGhpcy5lbHMuY29uZmlybURpYWxvZy5jbGFzc0xpc3QuYWRkKCdoaWRkZW4nKVxuICAgIH0sXG5cbiAgICBvbkNvbmZpcm1DbGljaygpIHtcbiAgICAgICAgdGhpcy5lbWl0KCdkZWxldGUnKVxuICAgIH0sXG5cbiAgICBvbkRlbGV0ZUNsaWNrKCkge1xuICAgICAgICBpZiggdGhpcy51c2VyICYmIHRoaXMudXNlci5kYXRhLl9pZCApIHtcbiAgICAgICAgICAgIHRoaXMuZWxzLnVzZXJuYW1lLmNsYXNzTGlzdC5hZGQoJ2hpZGRlbicpXG4gICAgICAgICAgICB0aGlzLmVscy5jb25maXJtRGlhbG9nLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGRlbicpXG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgb25FZGl0Q2xpY2soKSB7XG4gICAgICAgIGlmKCB0aGlzLnVzZXIgJiYgdGhpcy51c2VyLmRhdGEuX2lkICkgdGhpcy5lbWl0KCdlZGl0JylcbiAgICB9LFxuXG4gICAgdXBkYXRlKHVzZXIpIHtcbiAgICAgICAgdGhpcy51c2VyLmRhdGEgPSB1c2VyXG4gICAgICAgIHRoaXMuZWxzLnVzZXJuYW1lLnRleHRDb250ZW50ID0gdXNlci51c2VybmFtZVxuICAgIH1cblxufSApXG4iLCJtb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5hc3NpZ24oIHt9LCByZXF1aXJlKCcuL19fcHJvdG9fXycpLCB7XG5cbiAgICBldmVudHM6IHtcbiAgICAgICAgY2FuY2VsOiAnY2xpY2snLFxuICAgICAgICBzdWJtaXQ6ICdjbGljaydcbiAgICB9LFxuXG4gICAgb25DYW5jZWxDbGljaygpIHsgdGhpcy5oaWRlKCkudGhlbiggKCkgPT4gdGhpcy5lbWl0KCdjYW5jZWxsZWQnKSApIH0sXG4gICAgXG4gICAgb25TdWJtaXRDbGljaygpIHtcbiAgICAgICAgdGhpc1sgYHJlcXVlc3Qke3RoaXMuY2FwaXRhbGl6ZUZpcnN0TGV0dGVyKCB0aGlzLnR5cGUgKX1gIF0oKVxuICAgICAgICAuY2F0Y2goIHRoaXMuRXJyb3IgKVxuICAgIH0sXG5cbiAgICBvbk5hdmlnYXRpb24oIHR5cGUsIGNvbWljICkge1xuICAgICAgICB0aGlzLnR5cGUgPSB0eXBlXG4gICAgICAgIHRoaXMubW9kZWwuZGF0YSA9IGNvbWljXG4gICAgICAgXG4gICAgICAgIHRoaXMucG9wdWxhdGUoKSBcbiAgICAgICAgXG4gICAgICAgIGlmKCB0aGlzLmVscy5jb250YWluZXIuY2xhc3NMaXN0LmNvbnRhaW5zKCdoaWRlJykgKSB0aGlzLnNob3coKVxuICAgIH0sXG5cbiAgICBwb3B1bGF0ZSgpIHtcbiAgICAgICAgdGhpcy5lbHMudGl0bGUudGV4dENvbnRlbnQgPSBgJHt0aGlzLmNhcGl0YWxpemVGaXJzdExldHRlciggdGhpcy50eXBlICl9IFVzZXJgXG5cbiAgICAgICAgdGhpcy5lbHMudXNlcm5hbWUudmFsdWUgPSBPYmplY3Qua2V5cyggdGhpcy5tb2RlbC5kYXRhICkubGVuZ3RoID8gdGhpcy5tb2RlbC5kYXRhLnVzZXJuYW1lIDogJydcbiAgICAgICAgdGhpcy5lbHMucGFzc3dvcmQudmFsdWUgPSAnJ1xuICAgIH0sXG5cbiAgICBwb3N0UmVuZGVyKCkge1xuICAgICAgICB0aGlzLnBvcHVsYXRlKCkgXG4gICAgICAgICAgICBcbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICB9LFxuXG4gICAgcmVxdWVzdEFkZCgpIHtcbiAgICAgICAgaWYoIHRoaXMuZWxzLnBhc3N3b3JkLnZhbHVlLmxlbmd0aCA9PT0gMCApIHJldHVyblxuICAgICAgICByZXR1cm4gdGhpcy5YaHIoIHsgbWV0aG9kOiAnUE9TVCcsIHJlc291cmNlOiAndXNlcicsIGRhdGE6IEpTT04uc3RyaW5naWZ5KCB7IHVzZXJuYW1lOiB0aGlzLmVscy51c2VybmFtZS52YWx1ZSwgcGFzc3dvcmQ6IHRoaXMuZWxzLnBhc3N3b3JkLnZhbHVlIH0gKSB9IClcbiAgICAgICAgLnRoZW4oIHJlc3BvbnNlID0+IHRoaXMuaGlkZSgpLnRoZW4oICgpID0+IHRoaXMuZW1pdCggJ2FkZGVkJywgeyBfaWQ6IHJlc3BvbnNlLl9pZCwgdXNlcm5hbWU6IHJlc3BvbnNlLnVzZXJuYW1lIH0gKSApIClcbiAgICB9LFxuXG4gICAgcmVxdWVzdEVkaXQoKSB7XG4gICAgICAgIGxldCBkYXRhID0geyB1c2VybmFtZTogdGhpcy5lbHMudXNlcm5hbWUudmFsdWUgfVxuXG4gICAgICAgIGlmKCB0aGlzLmVscy5wYXNzd29yZC52YWx1ZS5sZW5ndGggKSBkYXRhLnBhc3N3b3JkID0gdGhpcy5lbHMucGFzc3dvcmQudmFsdWVcbiAgICAgICAgcmV0dXJuIHRoaXMuWGhyKCB7IG1ldGhvZDogJ1BBVENIJywgcmVzb3VyY2U6IGB1c2VyLyR7dGhpcy51c2VyLmRhdGEuX2lkfWAsIGRhdGE6IEpTT04uc3RyaW5naWZ5KCBkYXRhICkgfSApXG4gICAgICAgIC50aGVuKCByZXNwb25zZSA9PiB0aGlzLmhpZGUoKS50aGVuKCAoKSA9PiB0aGlzLmVtaXQoICdlZGl0ZWQnLCB7IF9pZDogcmVzcG9uc2UuX2lkLCB1c2VybmFtZTogcmVzcG9uc2UudXNlcm5hbWUgfSApICkgKVxuICAgIH1cbn0gKVxuIiwibW9kdWxlLmV4cG9ydHMgPSBPYmplY3QuYXNzaWduKCB7fSwgcmVxdWlyZSgnLi9fX3Byb3RvX18nKSwge1xuXG4gICAgY3JlYXRlVXNlclZpZXcoIHVzZXIgKSB7XG4gICAgICAgIHRoaXMudmlld3NbIHVzZXIuX2lkIF0gPSB0aGlzLmZhY3RvcnkuY3JlYXRlKFxuICAgICAgICAgICAgJ1VzZXInLFxuICAgICAgICAgICAgeyBpbnNlcnRpb246IHsgdmFsdWU6IHsgZWw6IHRoaXMuZWxzLmxpc3QgfSB9LFxuICAgICAgICAgICAgICBtb2RlbDogeyB2YWx1ZTogeyBkYXRhOiB1c2VyIH0gfVxuICAgICAgICAgICAgfVxuICAgICAgICApXG5cbiAgICAgICAgdGhpcy52aWV3c1sgdXNlci5faWQgXVxuICAgICAgICAub24oICdlZGl0JywgKCkgPT4gdGhpcy5lbWl0KCAnbmF2aWdhdGUnLCBgL2FkbWluL3VzZXIvZWRpdC8ke3VzZXIuX2lkfWApIClcbiAgICAgICAgLm9uKCAnZGVsZXRlJywgKCkgPT5cbiAgICAgICAgICAgIHRoaXMuWGhyKCB7IG1ldGhvZDogJ2RlbGV0ZScsIHJlc291cmNlOiBgdXNlci8ke3VzZXIuX2lkfWAgfSApXG4gICAgICAgICAgICAudGhlbiggKCkgPT4gdGhpcy52aWV3c1sgdXNlci5faWQgXS5kZWxldGUoKSApXG4gICAgICAgICAgICAuY2F0Y2goIHRoaXMuRXJyb3IgKVxuICAgICAgICApXG4gICAgfSxcblxuICAgIGRlbGV0ZSgpIHtcbiAgICAgICAgcmV0dXJuICggKCB0aGlzLnZpZXdzLlVzZXJNYW5hZ2UgKVxuICAgICAgICAgICAgPyB0aGlzLnZpZXdzLlVzZXJNYW5hZ2UuZGVsZXRlKClcbiAgICAgICAgICAgIDogUHJvbWlzZS5yZXNvbHZlKCkgKVxuICAgICAgICAudGhlbiggKCkgPT4gcmVxdWlyZSgnLi9fX3Byb3RvX18nKS5kZWxldGUuY2FsbCh0aGlzKSApXG4gICAgfSxcblxuICAgIGV2ZW50czoge1xuICAgICAgICBhZGRCdG46ICdjbGljaydcbiAgICB9LFxuXG4gICAgbWFuYWdlVXNlciggdHlwZSwgdXNlciApIHtcbiAgICAgICAgdGhpcy52aWV3cy5Vc2VyTWFuYWdlIFxuICAgICAgICAgICAgPyB0aGlzLnZpZXdzLlVzZXJNYW5hZ2Uub25OYXZpZ2F0aW9uKCB0eXBlLCB1c2VyIClcbiAgICAgICAgICAgIDogdGhpcy52aWV3cy5Vc2VyTWFuYWdlID1cbiAgICAgICAgICAgICAgICB0aGlzLmZhY3RvcnkuY3JlYXRlKCAnVXNlck1hbmFnZScsIHsgdHlwZTogeyB2YWx1ZTogdHlwZSwgd3JpdGFibGU6IHRydWUgfSwgbW9kZWw6IHsgdmFsdWU6IHsgZGF0YTogdXNlciB8fCB7fSB9IH0sIGluc2VydGlvbjogeyB2YWx1ZTogeyBlbDogdGhpcy5lbHMuY29udGFpbmVyLCBtZXRob2Q6ICdpbnNlcnRCZWZvcmUnIH0gfSB9IClcbiAgICAgICAgICAgICAgICAgICAgLm9uKCAnYWRkZWQnLCB1c2VyID0+IHsgdGhpcy5jcmVhdGVVc2VyVmlldyh1c2VyKTsgdGhpcy5lbWl0KCAnbmF2aWdhdGUnLCBgL2FkbWluL3VzZXJgICk7IH0gKVxuICAgICAgICAgICAgICAgICAgICAub24oICdlZGl0ZWQnLCB1c2VyID0+IHsgdGhpcy52aWV3c1sgdXNlci5faWQgXS51cGRhdGUoIHVzZXIgKTsgdGhpcy5lbWl0KCAnbmF2aWdhdGUnLCBgL2FkbWluL3VzZXJgICk7IH0gKVxuICAgICAgICAgICAgICAgICAgICAub24oICdjYW5jZWxsZWQnLCAoKSA9PiB0aGlzLmVtaXQoICduYXZpZ2F0ZScsIGAvYWRtaW4vdXNlcmAgKSApXG4gICAgfSxcblxuICAgIG9uQWRkQnRuQ2xpY2soKSB7IHRoaXMuZW1pdCggJ25hdmlnYXRlJywgYC9hZG1pbi91c2VyL2FkZGAgKSB9LFxuXG4gICAgb25OYXZpZ2F0aW9uKCBwYXRoICkge1xuICAgICAgICB0aGlzLnBhdGggPSBwYXRoO1xuXG4gICAgICAgICggcGF0aC5sZW5ndGggPT09IDIgJiYgdGhpcy5lbHMuY29udGFpbmVyLmNsYXNzTGlzdC5jb250YWlucygnaGlkZScpICkgXG4gICAgICAgICAgICA/IHRoaXMudmlld3MuVXNlck1hbmFnZSAmJiAhdGhpcy52aWV3cy5Vc2VyTWFuYWdlLmVscy5jb250YWluZXIuY2xhc3NMaXN0LmNvbnRhaW5zKCdoaWRlJylcbiAgICAgICAgICAgICAgICA/IHRoaXMudmlld3MuVXNlck1hbmFnZS5oaWRlKCkudGhlbiggKCkgPT4gdGhpcy5zaG93KCkgKVxuICAgICAgICAgICAgICAgIDogdGhpcy5zaG93KClcbiAgICAgICAgICAgIDogcGF0aC5sZW5ndGggPT09IDNcbiAgICAgICAgICAgICAgICA/IHRoaXMuaGlkZSgpLnRoZW4oICgpID0+IHRoaXMubWFuYWdlVXNlciggcGF0aFsyXSwgeyB9ICkgKVxuICAgICAgICAgICAgICAgIDogcGF0aC5sZW5ndGggPT09IDRcbiAgICAgICAgICAgICAgICAgICAgID8gdGhpcy5oaWRlKCkudGhlbiggKCkgPT4gdGhpcy5tYW5hZ2VVc2VyKCBwYXRoWzJdLCB0aGlzLnZpZXdzWyBwYXRoWzNdIF0ubW9kZWwuZGF0YSApIClcbiAgICAgICAgICAgICAgICAgICAgIDogdW5kZWZpbmVkXG4gICAgfSxcblxuICAgIHBvc3RSZW5kZXIoKSB7XG5cbiAgICAgICAgaWYoIHRoaXMucGF0aC5sZW5ndGggPiAyICkge1xuICAgICAgICAgICAgdGhpcy5lbHMuY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoICdoaWRkZW4nLCAnaGlkZScgKVxuICAgICAgICAgICAgaWYoIHRoaXMucGF0aFsyXSA9PT0gXCJhZGRcIiApIHsgdGhpcy5tYW5hZ2VVc2VyKCBcImFkZFwiLCB7IH0gKSB9XG4gICAgICAgICAgICBlbHNlIGlmKCB0aGlzLnBhdGhbMl0gPT09IFwiZWRpdFwiICYmIHRoaXMucGF0aFszXSApIHtcbiAgICAgICAgICAgICAgICB0aGlzLlhociggeyBtZXRob2Q6IFwiZ2V0XCIsIHJlc291cmNlOiBgdXNlci8ke3RoaXMucGF0aFszXX1gIH0gKVxuICAgICAgICAgICAgICAgIC50aGVuKCByZXNwb25zZSA9PiB0aGlzLm1hbmFnZVVzZXIoIFwiZWRpdFwiLCByZXNwb25zZSApIClcbiAgICAgICAgICAgICAgICAuY2F0Y2goIGUgPT4geyB0aGlzLkVycm9yKGUpOyB0aGlzLmVtaXQoICduYXZpZ2F0ZScsIGAvYWRtaW4vdXNlcmAgKSB9IClcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmKCB0aGlzLnBhdGgubGVuZ3RoID09PSAxICYmIHRoaXMudmlld3MuVXNlck1hbmFnZSApIHtcbiAgICAgICAgICAgIHRoaXMudmlld3MuVXNlck1hbmFnZS5oaWRlKClcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMudXNlcnMgPSBPYmplY3QuY3JlYXRlKCB0aGlzLk1vZGVsLCB7IHJlc291cmNlOiB7IHZhbHVlOiAndXNlcicgfSB9IClcblxuICAgICAgICB0aGlzLnVzZXJzLmdldCgpXG4gICAgICAgIC50aGVuKCAoKSA9PiBQcm9taXNlLnJlc29sdmUoIHRoaXMudXNlcnMuZGF0YS5mb3JFYWNoKCB1c2VyID0+IHRoaXMuY3JlYXRlVXNlclZpZXcoIHVzZXIgKSApICkgKVxuICAgICAgICAuY2F0Y2goIHRoaXMuRXJyb3IgKVxuXG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgfSxcblxuICAgIHJlcXVpcmVzTG9naW46IHRydWVcbn0gKVxuIiwibW9kdWxlLmV4cG9ydHMgPSBPYmplY3QuYXNzaWduKCB7IH0sIHJlcXVpcmUoJy4uLy4uLy4uL2xpYi9NeU9iamVjdCcpLCByZXF1aXJlKCdldmVudHMnKS5FdmVudEVtaXR0ZXIucHJvdG90eXBlLCB7XG5cbiAgICBNb2RlbDogcmVxdWlyZSgnLi4vbW9kZWxzL19fcHJvdG9fXy5qcycpLFxuXG4gICAgT3B0aW1pemVkUmVzaXplOiByZXF1aXJlKCcuL2xpYi9PcHRpbWl6ZWRSZXNpemUnKSxcbiAgICBcbiAgICBTcGlubmVyOiByZXF1aXJlKCcuL2xpYi9TcGluJyksXG4gICAgXG4gICAgWGhyOiByZXF1aXJlKCcuLi9YaHInKSxcblxuICAgIGJpbmRFdmVudCgga2V5LCBldmVudCApIHtcbiAgICAgICAgdmFyIGVscyA9IEFycmF5LmlzQXJyYXkoIHRoaXMuZWxzWyBrZXkgXSApID8gdGhpcy5lbHNbIGtleSBdIDogWyB0aGlzLmVsc1sga2V5IF0gXVxuICAgICAgICBlbHMuZm9yRWFjaCggZWwgPT4gZWwuYWRkRXZlbnRMaXN0ZW5lciggZXZlbnQgfHwgJ2NsaWNrJywgZSA9PiB0aGlzWyBgb24ke3RoaXMuY2FwaXRhbGl6ZUZpcnN0TGV0dGVyKGtleSl9JHt0aGlzLmNhcGl0YWxpemVGaXJzdExldHRlcihldmVudCl9YCBdKCBlICkgKSApXG4gICAgfSxcblxuICAgIGNhcGl0YWxpemVGaXJzdExldHRlcjogc3RyaW5nID0+IHN0cmluZy5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHN0cmluZy5zbGljZSgxKSxcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuXG4gICAgICAgIGlmKCB0aGlzLnNpemUgKSB0aGlzLk9wdGltaXplZFJlc2l6ZS5hZGQoIHRoaXMuc2l6ZSApO1xuXG4gICAgICAgIGlmKCB0aGlzLnJlcXVpcmVzTG9naW4gJiYgKCF0aGlzLnVzZXIuZGF0YSB8fCAhdGhpcy51c2VyLmRhdGEuX2lkICkgKSByZXR1cm4gdGhpcy5oYW5kbGVMb2dpbigpXG5cbiAgICAgICAgaWYoIHRoaXMudXNlci5kYXRhICYmIHRoaXMudXNlci5kYXRhLmlkICYmIHRoaXMucmVxdWlyZXNSb2xlICYmICF0aGlzLmhhc1ByaXZpbGVnZXMoKSApIHJldHVybiB0aGlzLnNob3dOb0FjY2VzcygpXG4gICAgICAgIFxuICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbiggdGhpcywgeyBlbHM6IHsgfSwgc2x1cnA6IHsgYXR0cjogJ2RhdGEtanMnLCB2aWV3OiAnZGF0YS12aWV3JyB9LCB2aWV3czogeyB9IH0gKS5yZW5kZXIoKVxuICAgIH0sXG5cbiAgICBkZWxlZ2F0ZUV2ZW50cygga2V5LCBlbCApIHtcbiAgICAgICAgdmFyIHR5cGUgPSB0eXBlb2YgdGhpcy5ldmVudHNba2V5XVxuXG4gICAgICAgIGlmKCB0eXBlID09PSBcInN0cmluZ1wiICkgeyB0aGlzLmJpbmRFdmVudCgga2V5LCB0aGlzLmV2ZW50c1trZXldICkgfVxuICAgICAgICBlbHNlIGlmKCBBcnJheS5pc0FycmF5KCB0aGlzLmV2ZW50c1trZXldICkgKSB7XG4gICAgICAgICAgICB0aGlzLmV2ZW50c1sga2V5IF0uZm9yRWFjaCggZXZlbnRPYmogPT4gdGhpcy5iaW5kRXZlbnQoIGtleSwgZXZlbnRPYmouZXZlbnQgKSApXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmJpbmRFdmVudCgga2V5LCB0aGlzLmV2ZW50c1trZXldLmV2ZW50IClcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBkZWxldGUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmhpZGUoKVxuICAgICAgICAudGhlbiggKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5lbHMuY29udGFpbmVyLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoIHRoaXMuZWxzLmNvbnRhaW5lciApXG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCB0aGlzLmVtaXQoJ2RlbGV0ZWQnKSApXG4gICAgICAgIH0gKVxuICAgIH0sXG5cbiAgICBldmVudHM6IHt9LFxuXG4gICAgZ2V0RGF0YSgpIHtcbiAgICAgICAgaWYoICF0aGlzLm1vZGVsICkgdGhpcy5tb2RlbCA9IE9iamVjdC5jcmVhdGUoIHRoaXMuTW9kZWwsIHsgcmVzb3VyY2U6IHsgdmFsdWU6IHRoaXMubmFtZSB9IH0gKVxuXG4gICAgICAgIHJldHVybiB0aGlzLm1vZGVsLmdldCgpXG4gICAgfSxcblxuICAgIGdldFRlbXBsYXRlT3B0aW9ucygpIHtcbiAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oXG4gICAgICAgICAgICB7fSxcbiAgICAgICAgICAgICh0aGlzLm1vZGVsKSA/IHRoaXMubW9kZWwuZGF0YSA6IHt9ICxcbiAgICAgICAgICAgIHsgdXNlcjogKHRoaXMudXNlcikgPyB0aGlzLnVzZXIuZGF0YSA6IHt9IH0sXG4gICAgICAgICAgICB7IG9wdHM6ICh0aGlzLnRlbXBsYXRlT3B0cykgPyB0aGlzLnRlbXBsYXRlT3B0cyA6IHt9IH1cbiAgICAgICAgKVxuICAgIH0sXG5cbiAgICBoYW5kbGVMb2dpbigpIHtcbiAgICAgICAgdGhpcy5mYWN0b3J5LmNyZWF0ZSggJ2xvZ2luJywgeyBpbnNlcnRpb246IHsgdmFsdWU6IHsgZWw6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNjb250ZW50JykgfSB9IH0gKVxuICAgICAgICAgICAgLm9uY2UoIFwibG9nZ2VkSW5cIiwgKCkgPT4gdGhpcy5vbkxvZ2luKCkgKVxuXG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgfSxcblxuICAgIGhhc1ByaXZpbGVnZSgpIHtcbiAgICAgICAgKCB0aGlzLnJlcXVpcmVzUm9sZSAmJiAoIHRoaXMudXNlci5nZXQoJ3JvbGVzJykuZmluZCggcm9sZSA9PiByb2xlID09PSB0aGlzLnJlcXVpcmVzUm9sZSApID09PSBcInVuZGVmaW5lZFwiICkgKSA/IGZhbHNlIDogdHJ1ZVxuICAgIH0sXG5cbiAgICBoaWRlKCkge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoIHJlc29sdmUgPT4ge1xuICAgICAgICAgICAgaWYoICFkb2N1bWVudC5ib2R5LmNvbnRhaW5zKHRoaXMuZWxzLmNvbnRhaW5lcikgfHwgdGhpcy5pc0hpZGRlbigpICkgcmV0dXJuIHJlc29sdmUoKVxuICAgICAgICAgICAgdGhpcy5vbkhpZGRlblByb3h5ID0gZSA9PiB0aGlzLm9uSGlkZGVuKHJlc29sdmUpXG4gICAgICAgICAgICB0aGlzLmVscy5jb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lciggJ3RyYW5zaXRpb25lbmQnLCB0aGlzLm9uSGlkZGVuUHJveHkgKVxuICAgICAgICAgICAgdGhpcy5lbHMuY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ2hpZGUnKVxuICAgICAgICB9IClcbiAgICB9LFxuXG4gICAgaHRtbFRvRnJhZ21lbnQoIHN0ciApIHtcbiAgICAgICAgbGV0IHJhbmdlID0gZG9jdW1lbnQuY3JlYXRlUmFuZ2UoKTtcbiAgICAgICAgLy8gbWFrZSB0aGUgcGFyZW50IG9mIHRoZSBmaXJzdCBkaXYgaW4gdGhlIGRvY3VtZW50IGJlY29tZXMgdGhlIGNvbnRleHQgbm9kZVxuICAgICAgICByYW5nZS5zZWxlY3ROb2RlKGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiZGl2XCIpLml0ZW0oMCkpXG4gICAgICAgIHJldHVybiByYW5nZS5jcmVhdGVDb250ZXh0dWFsRnJhZ21lbnQoIHN0ciApXG4gICAgfSxcbiAgICBcbiAgICBpc0hpZGRlbigpIHsgcmV0dXJuIHRoaXMuZWxzLmNvbnRhaW5lci5jbGFzc0xpc3QuY29udGFpbnMoJ2hpZGRlbicpIH0sXG5cbiAgICBvbkhpZGRlbiggcmVzb2x2ZSApIHtcbiAgICAgICAgdGhpcy5lbHMuY29udGFpbmVyLnJlbW92ZUV2ZW50TGlzdGVuZXIoICd0cmFuc2l0aW9uZW5kJywgdGhpcy5vbkhpZGRlblByb3h5IClcbiAgICAgICAgdGhpcy5lbHMuY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ2hpZGRlbicpXG4gICAgICAgIHJlc29sdmUoIHRoaXMuZW1pdCgnaGlkZGVuJykgKVxuICAgIH0sXG5cbiAgICBvbkxvZ2luKCkge1xuICAgICAgICBPYmplY3QuYXNzaWduKCB0aGlzLCB7IGVsczogeyB9LCBzbHVycDogeyBhdHRyOiAnZGF0YS1qcycsIHZpZXc6ICdkYXRhLXZpZXcnIH0sIHZpZXdzOiB7IH0gfSApLnJlbmRlcigpXG4gICAgfSxcblxuICAgIG9uU2hvd24oIHJlc29sdmUgKSB7XG4gICAgICAgIHRoaXMuZWxzLmNvbnRhaW5lci5yZW1vdmVFdmVudExpc3RlbmVyKCAndHJhbnNpdGlvbmVuZCcsIHRoaXMub25TaG93blByb3h5IClcbiAgICAgICAgaWYoIHRoaXMuc2l6ZSApIHRoaXMuc2l6ZSgpXG4gICAgICAgIHJlc29sdmUoIHRoaXMuZW1pdCgnc2hvd24nKSApXG4gICAgfSxcblxuICAgIHNob3dOb0FjY2VzcygpIHtcbiAgICAgICAgYWxlcnQoXCJObyBwcml2aWxlZ2VzLCBzb25cIilcbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICB9LFxuXG4gICAgcG9zdFJlbmRlcigpIHsgcmV0dXJuIHRoaXMgfSxcblxuICAgIHJlbmRlcigpIHtcbiAgICAgICAgdGhpcy5zbHVycFRlbXBsYXRlKCB7IHRlbXBsYXRlOiB0aGlzLnRlbXBsYXRlKCB0aGlzLmdldFRlbXBsYXRlT3B0aW9ucygpICksIGluc2VydGlvbjogdGhpcy5pbnNlcnRpb24gfSApXG5cbiAgICAgICAgaWYoIHRoaXMuc2l6ZSApIHRoaXMuc2l6ZSgpXG5cbiAgICAgICAgcmV0dXJuIHRoaXMucmVuZGVyU3Vidmlld3MoKVxuICAgICAgICAgICAgICAgICAgIC5wb3N0UmVuZGVyKClcbiAgICB9LFxuXG4gICAgcmVuZGVyU3Vidmlld3MoKSB7XG4gICAgICAgIE9iamVjdC5rZXlzKCB0aGlzLlZpZXdzIHx8IFsgXSApLmZvckVhY2goIGtleSA9PiB7XG4gICAgICAgICAgICBpZiggdGhpcy5WaWV3c1sga2V5IF0uZWwgKSB7XG4gICAgICAgICAgICAgICAgbGV0IG9wdHMgPSB0aGlzLlZpZXdzWyBrZXkgXS5vcHRzXG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgb3B0cyA9ICggb3B0cyApXG4gICAgICAgICAgICAgICAgICAgID8gdHlwZW9mIG9wdHMgPT09IFwib2JqZWN0XCJcbiAgICAgICAgICAgICAgICAgICAgICAgID8gb3B0c1xuICAgICAgICAgICAgICAgICAgICAgICAgOiBvcHRzKClcbiAgICAgICAgICAgICAgICAgICAgOiB7fVxuXG4gICAgICAgICAgICAgICAgdGhpcy52aWV3c1sga2V5IF0gPSB0aGlzLmZhY3RvcnkuY3JlYXRlKCBrZXksIE9iamVjdC5hc3NpZ24oIHsgaW5zZXJ0aW9uOiB7IHZhbHVlOiB7IGVsOiB0aGlzLlZpZXdzWyBrZXkgXS5lbCwgbWV0aG9kOiAnaW5zZXJ0QmVmb3JlJyB9IH0gfSwgb3B0cyApIClcbiAgICAgICAgICAgICAgICB0aGlzLlZpZXdzWyBrZXkgXS5lbC5yZW1vdmUoKVxuICAgICAgICAgICAgICAgIHRoaXMuVmlld3NbIGtleSBdLmVsID0gdW5kZWZpbmVkXG4gICAgICAgICAgICB9XG4gICAgICAgIH0gKVxuXG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgfSxcblxuICAgIHNob3coIGR1cmF0aW9uICkge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoIHJlc29sdmUgPT4ge1xuICAgICAgICAgICAgdGhpcy5vblNob3duUHJveHkgPSBlID0+IHRoaXMub25TaG93bihyZXNvbHZlKVxuICAgICAgICAgICAgdGhpcy5lbHMuY29udGFpbmVyLmFkZEV2ZW50TGlzdGVuZXIoICd0cmFuc2l0aW9uZW5kJywgdGhpcy5vblNob3duUHJveHkgKVxuICAgICAgICAgICAgdGhpcy5lbHMuY29udGFpbmVyLmNsYXNzTGlzdC5yZW1vdmUoICdoaWRlJywgJ2hpZGRlbicgKVxuICAgICAgICB9IClcbiAgICB9LFxuXG4gICAgc2x1cnBFbCggZWwgKSB7XG4gICAgICAgIHZhciBrZXkgPSBlbC5nZXRBdHRyaWJ1dGUoIHRoaXMuc2x1cnAuYXR0ciApIHx8ICdjb250YWluZXInXG5cbiAgICAgICAgaWYoIGtleSA9PT0gJ2NvbnRhaW5lcicgKSBlbC5jbGFzc0xpc3QuYWRkKCB0aGlzLm5hbWUgKVxuXG4gICAgICAgIHRoaXMuZWxzWyBrZXkgXSA9IEFycmF5LmlzQXJyYXkoIHRoaXMuZWxzWyBrZXkgXSApXG4gICAgICAgICAgICA/IHRoaXMuZWxzWyBrZXkgXS5wdXNoKCBlbCApXG4gICAgICAgICAgICA6ICggdGhpcy5lbHNbIGtleSBdICE9PSB1bmRlZmluZWQgKVxuICAgICAgICAgICAgICAgID8gWyB0aGlzLmVsc1sga2V5IF0sIGVsIF1cbiAgICAgICAgICAgICAgICA6IGVsXG5cbiAgICAgICAgZWwucmVtb3ZlQXR0cmlidXRlKHRoaXMuc2x1cnAuYXR0cilcblxuICAgICAgICBpZiggdGhpcy5ldmVudHNbIGtleSBdICkgdGhpcy5kZWxlZ2F0ZUV2ZW50cygga2V5LCBlbCApXG4gICAgfSxcblxuICAgIHNsdXJwVGVtcGxhdGUoIG9wdGlvbnMgKSB7XG4gICAgICAgIHZhciBmcmFnbWVudCA9IHRoaXMuaHRtbFRvRnJhZ21lbnQoIG9wdGlvbnMudGVtcGxhdGUgKSxcbiAgICAgICAgICAgIHNlbGVjdG9yID0gYFske3RoaXMuc2x1cnAuYXR0cn1dYCxcbiAgICAgICAgICAgIHZpZXdTZWxlY3RvciA9IGBbJHt0aGlzLnNsdXJwLnZpZXd9XWBcblxuICAgICAgICB0aGlzLnNsdXJwRWwoIGZyYWdtZW50LnF1ZXJ5U2VsZWN0b3IoJyonKSApXG4gICAgICAgIGZyYWdtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoIGAke3NlbGVjdG9yfSwgJHt2aWV3U2VsZWN0b3J9YCApLmZvckVhY2goIGVsID0+XG4gICAgICAgICAgICAoIGVsLmhhc0F0dHJpYnV0ZSggdGhpcy5zbHVycC5hdHRyICkgKSBcbiAgICAgICAgICAgICAgICA/IHRoaXMuc2x1cnBFbCggZWwgKVxuICAgICAgICAgICAgICAgIDogdGhpcy5WaWV3c1sgZWwuZ2V0QXR0cmlidXRlKHRoaXMuc2x1cnAudmlldykgXS5lbCA9IGVsXG4gICAgICAgIClcbiAgICAgICAgICBcbiAgICAgICAgb3B0aW9ucy5pbnNlcnRpb24ubWV0aG9kID09PSAnaW5zZXJ0QmVmb3JlJ1xuICAgICAgICAgICAgPyBvcHRpb25zLmluc2VydGlvbi5lbC5wYXJlbnROb2RlLmluc2VydEJlZm9yZSggZnJhZ21lbnQsIG9wdGlvbnMuaW5zZXJ0aW9uLmVsIClcbiAgICAgICAgICAgIDogb3B0aW9ucy5pbnNlcnRpb24uZWxbIG9wdGlvbnMuaW5zZXJ0aW9uLm1ldGhvZCB8fCAnYXBwZW5kQ2hpbGQnIF0oIGZyYWdtZW50IClcblxuICAgICAgICByZXR1cm4gdGhpc1xuICAgIH0sXG5cbiAgICBpc01vdXNlT25FbCggZXZlbnQsIGVsICkge1xuXG4gICAgICAgIHZhciBlbE9mZnNldCA9IGVsLm9mZnNldCgpLFxuICAgICAgICAgICAgZWxIZWlnaHQgPSBlbC5vdXRlckhlaWdodCggdHJ1ZSApLFxuICAgICAgICAgICAgZWxXaWR0aCA9IGVsLm91dGVyV2lkdGgoIHRydWUgKVxuXG4gICAgICAgIGlmKCAoIGV2ZW50LnBhZ2VYIDwgZWxPZmZzZXQubGVmdCApIHx8XG4gICAgICAgICAgICAoIGV2ZW50LnBhZ2VYID4gKCBlbE9mZnNldC5sZWZ0ICsgZWxXaWR0aCApICkgfHxcbiAgICAgICAgICAgICggZXZlbnQucGFnZVkgPCBlbE9mZnNldC50b3AgKSB8fFxuICAgICAgICAgICAgKCBldmVudC5wYWdlWSA+ICggZWxPZmZzZXQudG9wICsgZWxIZWlnaHQgKSApICkge1xuXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdHJ1ZVxuICAgIH0sXG5cbiAgICByZXF1aXJlc0xvZ2luOiBmYWxzZSxcblxuICAgIC8vX190b0RvOiBodG1sLnJlcGxhY2UoLz5cXHMrPC9nLCc+PCcpXG59IClcbiIsIm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmNyZWF0ZSgge1xuXG4gICAgYWRkKGNhbGxiYWNrKSB7XG4gICAgICAgIGlmKCAhdGhpcy5jYWxsYmFja3MubGVuZ3RoICkgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHRoaXMub25SZXNpemUpXG4gICAgICAgIHRoaXMuY2FsbGJhY2tzLnB1c2goY2FsbGJhY2spXG4gICAgfSxcblxuICAgIG9uUmVzaXplKCkge1xuICAgICAgIGlmKCB0aGlzLnJ1bm5pbmcgKSByZXR1cm5cblxuICAgICAgICB0aGlzLnJ1bm5pbmcgPSB0cnVlXG4gICAgICAgIFxuICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lXG4gICAgICAgICAgICA/IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoIHRoaXMucnVuQ2FsbGJhY2tzIClcbiAgICAgICAgICAgIDogc2V0VGltZW91dCggdGhpcy5ydW5DYWxsYmFja3MsIDY2KVxuICAgIH0sXG5cbiAgICBydW5DYWxsYmFja3MoKSB7XG4gICAgICAgIHRoaXMuY2FsbGJhY2tzID0gdGhpcy5jYWxsYmFja3MuZmlsdGVyKCBjYWxsYmFjayA9PiBjYWxsYmFjaygpIClcbiAgICAgICAgdGhpcy5ydW5uaW5nID0gZmFsc2UgXG4gICAgfVxuXG59LCB7IGNhbGxiYWNrczogeyB2YWx1ZTogW10gfSwgcnVubmluZzogeyB2YWx1ZTogZmFsc2UgfSB9ICkuYWRkXG4iLCIvLyBodHRwOi8vc3Bpbi5qcy5vcmcvI3YyLjMuMlxuIWZ1bmN0aW9uKGEsYil7XCJvYmplY3RcIj09dHlwZW9mIG1vZHVsZSYmbW9kdWxlLmV4cG9ydHM/bW9kdWxlLmV4cG9ydHM9YigpOlwiZnVuY3Rpb25cIj09dHlwZW9mIGRlZmluZSYmZGVmaW5lLmFtZD9kZWZpbmUoYik6YS5TcGlubmVyPWIoKX0odGhpcyxmdW5jdGlvbigpe1widXNlIHN0cmljdFwiO2Z1bmN0aW9uIGEoYSxiKXt2YXIgYyxkPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoYXx8XCJkaXZcIik7Zm9yKGMgaW4gYilkW2NdPWJbY107cmV0dXJuIGR9ZnVuY3Rpb24gYihhKXtmb3IodmFyIGI9MSxjPWFyZ3VtZW50cy5sZW5ndGg7Yz5iO2IrKylhLmFwcGVuZENoaWxkKGFyZ3VtZW50c1tiXSk7cmV0dXJuIGF9ZnVuY3Rpb24gYyhhLGIsYyxkKXt2YXIgZT1bXCJvcGFjaXR5XCIsYix+figxMDAqYSksYyxkXS5qb2luKFwiLVwiKSxmPS4wMStjL2QqMTAwLGc9TWF0aC5tYXgoMS0oMS1hKS9iKigxMDAtZiksYSksaD1qLnN1YnN0cmluZygwLGouaW5kZXhPZihcIkFuaW1hdGlvblwiKSkudG9Mb3dlckNhc2UoKSxpPWgmJlwiLVwiK2grXCItXCJ8fFwiXCI7cmV0dXJuIG1bZV18fChrLmluc2VydFJ1bGUoXCJAXCIraStcImtleWZyYW1lcyBcIitlK1wiezAle29wYWNpdHk6XCIrZytcIn1cIitmK1wiJXtvcGFjaXR5OlwiK2ErXCJ9XCIrKGYrLjAxKStcIiV7b3BhY2l0eToxfVwiKyhmK2IpJTEwMCtcIiV7b3BhY2l0eTpcIithK1wifTEwMCV7b3BhY2l0eTpcIitnK1wifX1cIixrLmNzc1J1bGVzLmxlbmd0aCksbVtlXT0xKSxlfWZ1bmN0aW9uIGQoYSxiKXt2YXIgYyxkLGU9YS5zdHlsZTtpZihiPWIuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkrYi5zbGljZSgxKSx2b2lkIDAhPT1lW2JdKXJldHVybiBiO2ZvcihkPTA7ZDxsLmxlbmd0aDtkKyspaWYoYz1sW2RdK2Isdm9pZCAwIT09ZVtjXSlyZXR1cm4gY31mdW5jdGlvbiBlKGEsYil7Zm9yKHZhciBjIGluIGIpYS5zdHlsZVtkKGEsYyl8fGNdPWJbY107cmV0dXJuIGF9ZnVuY3Rpb24gZihhKXtmb3IodmFyIGI9MTtiPGFyZ3VtZW50cy5sZW5ndGg7YisrKXt2YXIgYz1hcmd1bWVudHNbYl07Zm9yKHZhciBkIGluIGMpdm9pZCAwPT09YVtkXSYmKGFbZF09Y1tkXSl9cmV0dXJuIGF9ZnVuY3Rpb24gZyhhLGIpe3JldHVyblwic3RyaW5nXCI9PXR5cGVvZiBhP2E6YVtiJWEubGVuZ3RoXX1mdW5jdGlvbiBoKGEpe3RoaXMub3B0cz1mKGF8fHt9LGguZGVmYXVsdHMsbil9ZnVuY3Rpb24gaSgpe2Z1bmN0aW9uIGMoYixjKXtyZXR1cm4gYShcIjxcIitiKycgeG1sbnM9XCJ1cm46c2NoZW1hcy1taWNyb3NvZnQuY29tOnZtbFwiIGNsYXNzPVwic3Bpbi12bWxcIj4nLGMpfWsuYWRkUnVsZShcIi5zcGluLXZtbFwiLFwiYmVoYXZpb3I6dXJsKCNkZWZhdWx0I1ZNTClcIiksaC5wcm90b3R5cGUubGluZXM9ZnVuY3Rpb24oYSxkKXtmdW5jdGlvbiBmKCl7cmV0dXJuIGUoYyhcImdyb3VwXCIse2Nvb3Jkc2l6ZTprK1wiIFwiK2ssY29vcmRvcmlnaW46LWorXCIgXCIrLWp9KSx7d2lkdGg6ayxoZWlnaHQ6a30pfWZ1bmN0aW9uIGgoYSxoLGkpe2IobSxiKGUoZigpLHtyb3RhdGlvbjozNjAvZC5saW5lcyphK1wiZGVnXCIsbGVmdDp+fmh9KSxiKGUoYyhcInJvdW5kcmVjdFwiLHthcmNzaXplOmQuY29ybmVyc30pLHt3aWR0aDpqLGhlaWdodDpkLnNjYWxlKmQud2lkdGgsbGVmdDpkLnNjYWxlKmQucmFkaXVzLHRvcDotZC5zY2FsZSpkLndpZHRoPj4xLGZpbHRlcjppfSksYyhcImZpbGxcIix7Y29sb3I6ZyhkLmNvbG9yLGEpLG9wYWNpdHk6ZC5vcGFjaXR5fSksYyhcInN0cm9rZVwiLHtvcGFjaXR5OjB9KSkpKX12YXIgaSxqPWQuc2NhbGUqKGQubGVuZ3RoK2Qud2lkdGgpLGs9MipkLnNjYWxlKmosbD0tKGQud2lkdGgrZC5sZW5ndGgpKmQuc2NhbGUqMitcInB4XCIsbT1lKGYoKSx7cG9zaXRpb246XCJhYnNvbHV0ZVwiLHRvcDpsLGxlZnQ6bH0pO2lmKGQuc2hhZG93KWZvcihpPTE7aTw9ZC5saW5lcztpKyspaChpLC0yLFwicHJvZ2lkOkRYSW1hZ2VUcmFuc2Zvcm0uTWljcm9zb2Z0LkJsdXIocGl4ZWxyYWRpdXM9MixtYWtlc2hhZG93PTEsc2hhZG93b3BhY2l0eT0uMylcIik7Zm9yKGk9MTtpPD1kLmxpbmVzO2krKyloKGkpO3JldHVybiBiKGEsbSl9LGgucHJvdG90eXBlLm9wYWNpdHk9ZnVuY3Rpb24oYSxiLGMsZCl7dmFyIGU9YS5maXJzdENoaWxkO2Q9ZC5zaGFkb3cmJmQubGluZXN8fDAsZSYmYitkPGUuY2hpbGROb2Rlcy5sZW5ndGgmJihlPWUuY2hpbGROb2Rlc1tiK2RdLGU9ZSYmZS5maXJzdENoaWxkLGU9ZSYmZS5maXJzdENoaWxkLGUmJihlLm9wYWNpdHk9YykpfX12YXIgaixrLGw9W1wid2Via2l0XCIsXCJNb3pcIixcIm1zXCIsXCJPXCJdLG09e30sbj17bGluZXM6MTIsbGVuZ3RoOjcsd2lkdGg6NSxyYWRpdXM6MTAsc2NhbGU6MSxjb3JuZXJzOjEsY29sb3I6XCIjMDAwXCIsb3BhY2l0eTouMjUscm90YXRlOjAsZGlyZWN0aW9uOjEsc3BlZWQ6MSx0cmFpbDoxMDAsZnBzOjIwLHpJbmRleDoyZTksY2xhc3NOYW1lOlwic3Bpbm5lclwiLHRvcDpcIjUwJVwiLGxlZnQ6XCI1MCVcIixzaGFkb3c6ITEsaHdhY2NlbDohMSxwb3NpdGlvbjpcImFic29sdXRlXCJ9O2lmKGguZGVmYXVsdHM9e30sZihoLnByb3RvdHlwZSx7c3BpbjpmdW5jdGlvbihiKXt0aGlzLnN0b3AoKTt2YXIgYz10aGlzLGQ9Yy5vcHRzLGY9Yy5lbD1hKG51bGwse2NsYXNzTmFtZTpkLmNsYXNzTmFtZX0pO2lmKGUoZix7cG9zaXRpb246ZC5wb3NpdGlvbix3aWR0aDowLHpJbmRleDpkLnpJbmRleCxsZWZ0OmQubGVmdCx0b3A6ZC50b3B9KSxiJiZiLmluc2VydEJlZm9yZShmLGIuZmlyc3RDaGlsZHx8bnVsbCksZi5zZXRBdHRyaWJ1dGUoXCJyb2xlXCIsXCJwcm9ncmVzc2JhclwiKSxjLmxpbmVzKGYsYy5vcHRzKSwhail7dmFyIGcsaD0wLGk9KGQubGluZXMtMSkqKDEtZC5kaXJlY3Rpb24pLzIsaz1kLmZwcyxsPWsvZC5zcGVlZCxtPSgxLWQub3BhY2l0eSkvKGwqZC50cmFpbC8xMDApLG49bC9kLmxpbmVzOyFmdW5jdGlvbiBvKCl7aCsrO2Zvcih2YXIgYT0wO2E8ZC5saW5lczthKyspZz1NYXRoLm1heCgxLShoKyhkLmxpbmVzLWEpKm4pJWwqbSxkLm9wYWNpdHkpLGMub3BhY2l0eShmLGEqZC5kaXJlY3Rpb24raSxnLGQpO2MudGltZW91dD1jLmVsJiZzZXRUaW1lb3V0KG8sfn4oMWUzL2spKX0oKX1yZXR1cm4gY30sc3RvcDpmdW5jdGlvbigpe3ZhciBhPXRoaXMuZWw7cmV0dXJuIGEmJihjbGVhclRpbWVvdXQodGhpcy50aW1lb3V0KSxhLnBhcmVudE5vZGUmJmEucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChhKSx0aGlzLmVsPXZvaWQgMCksdGhpc30sbGluZXM6ZnVuY3Rpb24oZCxmKXtmdW5jdGlvbiBoKGIsYyl7cmV0dXJuIGUoYSgpLHtwb3NpdGlvbjpcImFic29sdXRlXCIsd2lkdGg6Zi5zY2FsZSooZi5sZW5ndGgrZi53aWR0aCkrXCJweFwiLGhlaWdodDpmLnNjYWxlKmYud2lkdGgrXCJweFwiLGJhY2tncm91bmQ6Yixib3hTaGFkb3c6Yyx0cmFuc2Zvcm1PcmlnaW46XCJsZWZ0XCIsdHJhbnNmb3JtOlwicm90YXRlKFwiK35+KDM2MC9mLmxpbmVzKmsrZi5yb3RhdGUpK1wiZGVnKSB0cmFuc2xhdGUoXCIrZi5zY2FsZSpmLnJhZGl1cytcInB4LDApXCIsYm9yZGVyUmFkaXVzOihmLmNvcm5lcnMqZi5zY2FsZSpmLndpZHRoPj4xKStcInB4XCJ9KX1mb3IodmFyIGksaz0wLGw9KGYubGluZXMtMSkqKDEtZi5kaXJlY3Rpb24pLzI7azxmLmxpbmVzO2srKylpPWUoYSgpLHtwb3NpdGlvbjpcImFic29sdXRlXCIsdG9wOjErfihmLnNjYWxlKmYud2lkdGgvMikrXCJweFwiLHRyYW5zZm9ybTpmLmh3YWNjZWw/XCJ0cmFuc2xhdGUzZCgwLDAsMClcIjpcIlwiLG9wYWNpdHk6Zi5vcGFjaXR5LGFuaW1hdGlvbjpqJiZjKGYub3BhY2l0eSxmLnRyYWlsLGwraypmLmRpcmVjdGlvbixmLmxpbmVzKStcIiBcIisxL2Yuc3BlZWQrXCJzIGxpbmVhciBpbmZpbml0ZVwifSksZi5zaGFkb3cmJmIoaSxlKGgoXCIjMDAwXCIsXCIwIDAgNHB4ICMwMDBcIikse3RvcDpcIjJweFwifSkpLGIoZCxiKGksaChnKGYuY29sb3IsayksXCIwIDAgMXB4IHJnYmEoMCwwLDAsLjEpXCIpKSk7cmV0dXJuIGR9LG9wYWNpdHk6ZnVuY3Rpb24oYSxiLGMpe2I8YS5jaGlsZE5vZGVzLmxlbmd0aCYmKGEuY2hpbGROb2Rlc1tiXS5zdHlsZS5vcGFjaXR5PWMpfX0pLFwidW5kZWZpbmVkXCIhPXR5cGVvZiBkb2N1bWVudCl7az1mdW5jdGlvbigpe3ZhciBjPWEoXCJzdHlsZVwiLHt0eXBlOlwidGV4dC9jc3NcIn0pO3JldHVybiBiKGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiaGVhZFwiKVswXSxjKSxjLnNoZWV0fHxjLnN0eWxlU2hlZXR9KCk7dmFyIG89ZShhKFwiZ3JvdXBcIikse2JlaGF2aW9yOlwidXJsKCNkZWZhdWx0I1ZNTClcIn0pOyFkKG8sXCJ0cmFuc2Zvcm1cIikmJm8uYWRqP2koKTpqPWQobyxcImFuaW1hdGlvblwiKX1yZXR1cm4gaH0pOyIsIm1vZHVsZS5leHBvcnRzID0gcCA9PiBcbmA8ZGl2PlxuPGRpdj5BZG1pbjwvZGl2PlxuPGRpdiBkYXRhLWpzPVwibGlzdFwiPjwvZGl2PlxuPC9kaXY+YFxuIiwibW9kdWxlLmV4cG9ydHMgPSBwID0+IGA8ZGl2PiR7cC5jb2xsZWN0aW9ufTwvZGl2PmBcbiIsIm1vZHVsZS5leHBvcnRzID0gcCA9PiBcbmA8ZGl2PlxuICAgIDxkaXYgY2xhc3M9XCJoZWFkZXJcIiBkYXRhLWpzPVwiaGVhZGVyXCI+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJ0aXRsZVwiIGRhdGEtanM9XCJ0aXRsZVwiID4ke3AudGl0bGUgfHwgJyd9PC9kaXY+XG4gICAgICAgICR7cC5faWQgJiYgcC51c2VyLl9pZCAmJiAhcC5vcHRzLnJlYWRPbmx5ID8gJzxidXR0b24gY2xhc3M9XCJkZWxldGVcIiBkYXRhLWpzPVwiZGVsZXRlXCI+PC9idXR0b24+JyA6ICcnfVxuICAgICAgICAke3AuX2lkICYmIHAudXNlci5faWQgJiYgIXAub3B0cy5yZWFkT25seSA/ICc8YnV0dG9uIGNsYXNzPVwiZWRpdFwiIGRhdGEtanM9XCJlZGl0XCI+PC9idXR0b24+JyA6ICcnfVxuICAgIDwvZGl2PlxuICAgICR7cC5faWQgJiYgcC51c2VyLl9pZCAmJiAhcC5vcHRzLnJlYWRPbmx5XG4gICAgICAgID8gYDxkaXYgY2xhc3M9XCJjb25maXJtIGhpZGRlblwiIGRhdGEtanM9XCJjb25maXJtRGlhbG9nXCI+XG4gICAgICAgICAgICAgICA8c3Bhbj5BcmUgeW91IHN1cmU/PC9zcGFuPlxuICAgICAgICAgICAgICAgPGJ1dHRvbiBkYXRhLWpzPVwiY29uZmlybVwiIHR5cGU9XCJidXR0b25cIj5EZWxldGU8L2J1dHRvbj4gXG4gICAgICAgICAgICAgICA8YnV0dG9uIGRhdGEtanM9XCJjYW5jZWxcIiB0eXBlPVwiYnV0dG9uXCI+Q2FuY2VsPC9idXR0b24+IFxuICAgICAgICAgICA8L2Rpdj5gXG4gICAgICAgIDogYGB9XG4gICAgPGltZyBkYXRhLWpzPVwiaW1hZ2VcIiBzcmM9XCIke3AuaW1hZ2UgPyBwLmltYWdlIDogJyd9XCIvPlxuICAgICR7cC5vcHRzLnJlYWRPbmx5XG4gICAgICAgID8gYDxkaXYgY2xhc3M9XCJjbGVhcmZpeFwiPlxuICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJzaGFyZVwiPlxuICAgICAgICAgICAgICAgICAke3JlcXVpcmUoJy4vbGliL2ZhY2Vib29rJyl9XG4gICAgICAgICAgICAgICAgICR7cmVxdWlyZSgnLi9saWIvdHdpdHRlcicpfVxuICAgICAgICAgICAgICAgICAke3JlcXVpcmUoJy4vbGliL2dvb2dsZScpfVxuICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgPC9kaXY+YFxuICAgICAgICA6IGBgIH1cbjwvZGl2PmBcbiIsIm1vZHVsZS5leHBvcnRzID0gcCA9PlxuYDxkaXY+XG4gICAgPGRpdiBkYXRhLWpzPVwiaGVhZGVyXCI+PC9kaXY+XG4gICAgPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXBcIj5cbiAgICAgICA8bGFiZWwgY2xhc3M9XCJmb3JtLWxhYmVsXCI+dGl0bGU8L2xhYmVsPlxuICAgICAgIDxpbnB1dCBkYXRhLWpzPVwidGl0bGVcIiB0eXBlPVwidGV4dFwiPjwvaW5wdXQ+XG4gICAgPC9kaXY+XG4gICAgPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXBcIj5cbiAgICAgICA8bGFiZWwgY2xhc3M9XCJmb3JtLWxhYmVsXCI+aW1hZ2U8L2xhYmVsPlxuICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgPGRpdiBkYXRhLWpzPVwidXBsb2FkXCIgY2xhc3M9XCJ1cGxvYWRcIj5cbiAgICAgICAgICAgICAgICA8c3Bhbj5VcGxvYWQgRmlsZTwvc3Bhbj5cbiAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cImZpbGVcIiBkYXRhLWpzPVwiaW1hZ2VcIiAvPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8aW1nIGNsYXNzPVwicHJldmlld1wiIGRhdGEtanM9XCJwcmV2aWV3XCIgLz5cbiAgICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gICAgPGRpdiBjbGFzcz1cImJ1dHRvbi1yb3dcIj5cbiAgICAgICAgPGJ1dHRvbiBkYXRhLWpzPVwic3VibWl0XCIgdHlwZT1cImJ1dHRvblwiPlN1Ym1pdDwvYnV0dG9uPlxuICAgICAgICA8YnV0dG9uIGRhdGEtanM9XCJjYW5jZWxcIiB0eXBlPVwiYnV0dG9uXCI+Q2FuY2VsPC9idXR0b24+XG4gICAgPC9kaXY+XG48L2Rpdj5gXG4iLCJtb2R1bGUuZXhwb3J0cyA9IHAgPT4gXG5gPGRpdj5cbiAgICA8ZGl2PlxuICAgICAgICA8ZGl2PkNvbWljczwvZGl2PlxuICAgICAgICA8YnV0dG9uIGRhdGEtanM9XCJhZGRCdG5cIiBjbGFzcz1cImFkZFwiPjwvYnV0dG9uPlxuICAgIDwvZGl2PlxuICAgIDxkaXYgZGF0YS1qcz1cImxpc3RcIj48L2Rpdj5cbjwvZGl2PmBcbiIsIm1vZHVsZS5leHBvcnRzID0gcCA9PiBgPGhlYWRlcj5cbiAgICA8dWw+Jm5ic3A7XG4gICAgPC91bD5cbiAgICA8c3Bhbj5UaW55IEhhbmRlZDwvc3Bhbj5cbiAgICA8aW1nIGRhdGEtanM9XCJsb2dvXCIgc3JjPVwiL3N0YXRpYy9pbWcvdGlueUhhbmRlZC5qcGdcIiAvPlxuPC9oZWFkZXI+YFxuIiwibW9kdWxlLmV4cG9ydHMgPSAoIHAgKSA9PiBgPGRpdj48L2Rpdj5gXG4iLCJtb2R1bGUuZXhwb3J0cyA9ICggcCApID0+XG5gPGRpdj5cbiAgICA8aDE+TG9naW48L2gxPlxuICAgIDxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwXCI+XG4gICAgICAgPGxhYmVsIGNsYXNzPVwiZm9ybS1sYWJlbFwiIGZvcj1cInVzZXJuYW1lXCI+dXNlcm5hbWU8L2xhYmVsPlxuICAgICAgIDxpbnB1dCBkYXRhLWpzPVwidXNlcm5hbWVcIiBjbGFzcz1cInVzZXJuYW1lXCIgdHlwZT1cInRleHRcIj48L2lucHV0PlxuICAgIDwvZGl2PlxuICAgIDxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwXCI+XG4gICAgICAgPGxhYmVsIGNsYXNzPVwiZm9ybS1sYWJlbFwiIGZvcj1cInBhc3N3b3JkXCI+cGFzc3dvcmQ8L2xhYmVsPlxuICAgICAgIDxpbnB1dCBkYXRhLWpzPVwicGFzc3dvcmRcIiBjbGFzcz1cInBhc3N3b3JkXCIgdHlwZT1cInBhc3N3b3JkXCI+PC9pbnB1dD5cbiAgICA8L2Rpdj5cbiAgICA8ZGl2IGNsYXNzPVwiYnV0dG9uLXJvd1wiPlxuICAgICAgICA8YnV0dG9uIGRhdGEtanM9XCJzdWJtaXRcIiBjbGFzcz1cImJ0bi1naG9zdFwiIHR5cGU9XCJidXR0b25cIj5Mb2cgSW48L2J1dHRvbj5cbiAgICA8L2Rpdj5cbjwvZGl2PmBcbiIsIm1vZHVsZS5leHBvcnRzID0gcCA9PlxuYDxkaXY+XG4gICAgPGRpdiBkYXRhLWpzPVwidXNlcm5hbWVcIj4ke3AudXNlcm5hbWV9PC9kaXY+XG4gICAgJHtwLnVzZXIuX2lkICYmICFwLm9wdHMucmVhZE9ubHkgPyAnPGJ1dHRvbiBjbGFzcz1cImRlbGV0ZVwiIGRhdGEtanM9XCJkZWxldGVcIj48L2J1dHRvbj4nIDogJyd9XG4gICAgJHtwLnVzZXIuX2lkID09PSBwLl9pZCA/ICc8YnV0dG9uIGNsYXNzPVwiZWRpdFwiIGRhdGEtanM9XCJlZGl0XCI+PC9idXR0b24+JyA6ICcnfVxuICAgICR7cC51c2VyLl9pZCAmJiAhcC5vcHRzLnJlYWRPbmx5XG4gICAgPyBgPGRpdiBjbGFzcz1cImNvbmZpcm0gaGlkZGVuXCIgZGF0YS1qcz1cImNvbmZpcm1EaWFsb2dcIj5cbiAgICAgICAgICAgPHNwYW4+QXJlIHlvdSBzdXJlPzwvc3Bhbj5cbiAgICAgICAgICAgPGJ1dHRvbiBkYXRhLWpzPVwiY29uZmlybVwiIHR5cGU9XCJidXR0b25cIj5EZWxldGU8L2J1dHRvbj4gXG4gICAgICAgICAgIDxidXR0b24gZGF0YS1qcz1cImNhbmNlbFwiIHR5cGU9XCJidXR0b25cIj5DYW5jZWw8L2J1dHRvbj4gXG4gICAgICAgPC9kaXY+YFxuICAgIDogYGB9XG48L2Rpdj5cbmBcbiIsIm1vZHVsZS5leHBvcnRzID0gcCA9PlxuYDxkaXY+XG4gICAgPGRpdiBkYXRhLWpzPVwidGl0bGVcIj48L2Rpdj5cbiAgICA8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cFwiPlxuICAgICAgIDxsYWJlbCBjbGFzcz1cImZvcm0tbGFiZWxcIiBmb3I9XCJ1c2VybmFtZVwiPnVzZXJuYW1lPC9sYWJlbD5cbiAgICAgICA8aW5wdXQgZGF0YS1qcz1cInVzZXJuYW1lXCIgY2xhc3M9XCJ1c2VybmFtZVwiIHR5cGU9XCJ0ZXh0XCI+PC9pbnB1dD5cbiAgICA8L2Rpdj5cbiAgICA8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cFwiPlxuICAgICAgIDxsYWJlbCBjbGFzcz1cImZvcm0tbGFiZWxcIiBmb3I9XCJwYXNzd29yZFwiPnBhc3N3b3JkPC9sYWJlbD5cbiAgICAgICA8aW5wdXQgZGF0YS1qcz1cInBhc3N3b3JkXCIgY2xhc3M9XCJwYXNzd29yZFwiIHR5cGU9XCJwYXNzd29yZFwiPjwvaW5wdXQ+XG4gICAgPC9kaXY+XG4gICAgPGRpdiBjbGFzcz1cImJ1dHRvbi1yb3dcIj5cbiAgICAgICAgPGJ1dHRvbiBkYXRhLWpzPVwic3VibWl0XCIgY2xhc3M9XCJidG4tZ2hvc3RcIiB0eXBlPVwiYnV0dG9uXCI+U3VibWl0PC9idXR0b24+XG4gICAgICAgIDxidXR0b24gZGF0YS1qcz1cImNhbmNlbFwiIGNsYXNzPVwiYnRuLWdob3N0XCIgdHlwZT1cImJ1dHRvblwiPkNhbmNlbDwvYnV0dG9uPlxuICAgIDwvZGl2PlxuPC9kaXY+YFxuIiwibW9kdWxlLmV4cG9ydHMgPSBwID0+IFxuYDxkaXY+XG4gICAgPGRpdj5cbiAgICAgICAgPGRpdj5Vc2VyczwvZGl2PlxuICAgICAgICA8YnV0dG9uIGRhdGEtanM9XCJhZGRCdG5cIiBjbGFzcz1cImFkZFwiPjwvYnV0dG9uPlxuICAgIDwvZGl2PlxuICAgIDxkaXYgZGF0YS1qcz1cImxpc3RcIj48L2Rpdj5cbjwvZGl2PmBcbiIsIm1vZHVsZS5leHBvcnRzID0gYDxzdmcgZGF0YS1qcz1cImZhY2Vib29rXCIgZW5hYmxlLWJhY2tncm91bmQ9XCJuZXcgMCAwIDU2LjY5MyA1Ni42OTNcIiBoZWlnaHQ9XCI1Ni42OTNweFwiIGlkPVwiTGF5ZXJfMVwiIHZlcnNpb249XCIxLjFcIiB2aWV3Qm94PVwiMCAwIDU2LjY5MyA1Ni42OTNcIiB3aWR0aD1cIjU2LjY5M3B4XCIgeG1sOnNwYWNlPVwicHJlc2VydmVcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgeG1sbnM6eGxpbms9XCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rXCI+PHBhdGggZD1cIk0yOC4zNDcsNS4xNTdjLTEzLjYsMC0yNC42MjUsMTEuMDI3LTI0LjYyNSwyNC42MjVjMCwxMy42LDExLjAyNSwyNC42MjMsMjQuNjI1LDI0LjYyM2MxMy42LDAsMjQuNjI1LTExLjAyMywyNC42MjUtMjQuNjIzICBDNTIuOTcyLDE2LjE4NCw0MS45NDYsNS4xNTcsMjguMzQ3LDUuMTU3eiBNMzQuODY0LDI5LjY3OWgtNC4yNjRjMCw2LjgxNCwwLDE1LjIwNywwLDE1LjIwN2gtNi4zMmMwLDAsMC04LjMwNywwLTE1LjIwN2gtMy4wMDYgIFYyNC4zMWgzLjAwNnYtMy40NzljMC0yLjQ5LDEuMTgyLTYuMzc3LDYuMzc5LTYuMzc3bDQuNjgsMC4wMTh2NS4yMTVjMCwwLTIuODQ2LDAtMy4zOTgsMGMtMC41NTUsMC0xLjM0LDAuMjc3LTEuMzQsMS40NjF2My4xNjMgIGg0LjgxOEwzNC44NjQsMjkuNjc5elwiLz48L3N2Zz5gXG4iLCJtb2R1bGUuZXhwb3J0cz1gPHN2ZyBkYXRhLWpzPVwiZ29vZ2xlXCIgZW5hYmxlLWJhY2tncm91bmQ9XCJuZXcgMCAwIDU2LjY5MyA1Ni42OTNcIiBoZWlnaHQ9XCI1Ni42OTNweFwiIGlkPVwiTGF5ZXJfMVwiIHZlcnNpb249XCIxLjFcIiB2aWV3Qm94PVwiMCAwIDU2LjY5MyA1Ni42OTNcIiB3aWR0aD1cIjU2LjY5M3B4XCIgeG1sOnNwYWNlPVwicHJlc2VydmVcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgeG1sbnM6eGxpbms9XCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rXCI+PGc+PHBhdGggZD1cIk0yMy43NjEsMjcuOTZjMC42MjksMCwxLjE2LTAuMjQ4LDEuNTctMC43MTdjMC42NDUtMC43MzIsMC45MjgtMS45MzYsMC43Ni0zLjIxNWMtMC4zMDEtMi4yODctMS45MzItNC4xODYtMy42MzctNC4yMzYgICBoLTAuMDY4Yy0wLjYwNCwwLTEuMTQxLDAuMjQ2LTEuNTUxLDAuNzE1Yy0wLjYzNywwLjcyNS0wLjkwMywxLjg3MS0wLjczNiwzLjE0NmMwLjI5OSwyLjI4MywxLjk2NSw0LjI1NiwzLjYzNSw0LjMwN0gyMy43NjF6XCIvPjxwYXRoIGQ9XCJNMjUuNjIyLDM0Ljg0N2MtMC4xNjgtMC4xMTMtMC4zNDItMC4yMzItMC41MjEtMC4zNTVjLTAuNTI1LTAuMTYyLTEuMDg0LTAuMjQ2LTEuNjU0LTAuMjU0aC0wLjA3MiAgIGMtMi42MjUsMC00LjkyOSwxLjU5Mi00LjkyOSwzLjQwNmMwLDEuOTcxLDEuOTcyLDMuNTE4LDQuNDkxLDMuNTE4YzMuMzIyLDAsNS4wMDYtMS4xNDUsNS4wMDYtMy40MDQgICBjMC0wLjIxNS0wLjAyNS0wLjQzNi0wLjA3Ni0wLjY1NkMyNy42NDIsMzYuMjIyLDI2LjgzNywzNS42NzUsMjUuNjIyLDM0Ljg0N3pcIi8+PHBhdGggZD1cIk0yOC4zNDcsNS4xNTdjLTEzLjYwMSwwLTI0LjYyNSwxMS4wMjMtMjQuNjI1LDI0LjYyM3MxMS4wMjUsMjQuNjI1LDI0LjYyNSwyNC42MjVjMTMuNTk4LDAsMjQuNjIzLTExLjAyNSwyNC42MjMtMjQuNjI1ICAgUzQxLjk0NCw1LjE1NywyOC4zNDcsNS4xNTd6IE0yNi4xMDYsNDMuMTc5Yy0wLjk4MiwwLjI4My0yLjA0MSwwLjQyOC0zLjE1NCwwLjQyOGMtMS4yMzgsMC0yLjQzLTAuMTQzLTMuNTQtMC40MjQgICBjLTIuMTUtMC41NDEtMy43NC0xLjU3LTQuNDgtMi44OTVjLTAuMzItMC41NzQtMC40ODItMS4xODQtMC40ODItMS44MTZjMC0wLjY1MiwwLjE1Ni0xLjMxMiwwLjQ2My0xLjk2NyAgIGMxLjE4LTIuNTEsNC4yODMtNC4xOTcsNy43MjItNC4xOTdjMC4wMzUsMCwwLjA2OCwwLDAuMSwwYy0wLjI3OS0wLjQ5Mi0wLjQxNi0xLjAwMi0wLjQxNi0xLjUzN2MwLTAuMjY4LDAuMDM1LTAuNTM5LDAuMTA1LTAuODE0ICAgYy0zLjYwNi0wLjA4NC02LjMwNi0yLjcyNS02LjMwNi02LjIwN2MwLTIuNDYxLDEuOTY1LTQuODU1LDQuNzc2LTUuODI0YzAuODQyLTAuMjkxLDEuNjk5LTAuNDM5LDIuNTQzLTAuNDM5aDcuNzEzICAgYzAuMjY0LDAsMC40OTQsMC4xNywwLjU3NiwwLjQyYzAuMDg0LDAuMjUyLTAuMDA4LDAuNTI1LTAuMjIxLDAuNjhsLTEuNzI1LDEuMjQ4Yy0wLjEwNCwwLjA3NC0wLjIyOSwwLjExNS0wLjM1NywwLjExNWgtMC42MTcgICBjMC43OTksMC45NTUsMS4yNjYsMi4zMTYsMS4yNjYsMy44NDhjMCwxLjY5MS0wLjg1NSwzLjI4OS0yLjQxLDQuNTA2Yy0xLjIwMSwwLjkzNi0xLjI1LDEuMTkxLTEuMjUsMS43MjkgICBjMC4wMTYsMC4yOTUsMC44NTQsMS4yNTIsMS43NzUsMS45MDRjMi4xNTIsMS41MjMsMi45NTMsMy4wMTQsMi45NTMsNS41MDhDMzEuMTQsNDAuMDQsMjkuMTYzLDQyLjI5MiwyNi4xMDYsNDMuMTc5eiAgICBNNDMuNTI4LDI5Ljk0OGMwLDAuMzM0LTAuMjczLDAuNjA1LTAuNjA3LDAuNjA1aC00LjM4M3Y0LjM4NWMwLDAuMzM2LTAuMjcxLDAuNjA3LTAuNjA3LDAuNjA3aC0xLjI0OCAgIGMtMC4zMzYsMC0wLjYwNy0wLjI3MS0wLjYwNy0wLjYwN3YtNC4zODVIMzEuNjljLTAuMzMyLDAtMC42MDUtMC4yNzEtMC42MDUtMC42MDV2LTEuMjVjMC0wLjMzNCwwLjI3My0wLjYwNywwLjYwNS0wLjYwN2g0LjM4NSAgIHYtNC4zODNjMC0wLjMzNiwwLjI3MS0wLjYwNywwLjYwNy0wLjYwN2gxLjI0OGMwLjMzNiwwLDAuNjA3LDAuMjcxLDAuNjA3LDAuNjA3djQuMzgzaDQuMzgzYzAuMzM0LDAsMC42MDcsMC4yNzMsMC42MDcsMC42MDcgICBWMjkuOTQ4elwiLz48L2c+PC9zdmc+YFxuIiwibW9kdWxlLmV4cG9ydHM9YDxzdmcgZGF0YS1qcz1cInR3aXR0ZXJcIiBlbmFibGUtYmFja2dyb3VuZD1cIm5ldyAwIDAgNTYuNjkzIDU2LjY5M1wiIGhlaWdodD1cIjU2LjY5M3B4XCIgaWQ9XCJMYXllcl8xXCIgdmVyc2lvbj1cIjEuMVwiIHZpZXdCb3g9XCIwIDAgNTYuNjkzIDU2LjY5M1wiIHdpZHRoPVwiNTYuNjkzcHhcIiB4bWw6c3BhY2U9XCJwcmVzZXJ2ZVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB4bWxuczp4bGluaz1cImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmtcIj48cGF0aCBkPVwiTTI4LjM0OCw1LjE1N2MtMTMuNiwwLTI0LjYyNSwxMS4wMjctMjQuNjI1LDI0LjYyNWMwLDEzLjYsMTEuMDI1LDI0LjYyMywyNC42MjUsMjQuNjIzYzEzLjYsMCwyNC42MjMtMTEuMDIzLDI0LjYyMy0yNC42MjMgIEM1Mi45NzEsMTYuMTg0LDQxLjk0Nyw1LjE1NywyOC4zNDgsNS4xNTd6IE00MC43NTIsMjQuODE3YzAuMDEzLDAuMjY2LDAuMDE4LDAuNTMzLDAuMDE4LDAuODAzYzAsOC4yMDEtNi4yNDIsMTcuNjU2LTE3LjY1NiwxNy42NTYgIGMtMy41MDQsMC02Ljc2Ny0xLjAyNy05LjUxMy0yLjc4N2MwLjQ4NiwwLjA1NywwLjk3OSwwLjA4NiwxLjQ4LDAuMDg2YzIuOTA4LDAsNS41ODQtMC45OTIsNy43MDctMi42NTYgIGMtMi43MTUtMC4wNTEtNS4wMDYtMS44NDYtNS43OTYtNC4zMTFjMC4zNzgsMC4wNzQsMC43NjcsMC4xMTEsMS4xNjcsMC4xMTFjMC41NjYsMCwxLjExNC0wLjA3NCwxLjYzNS0wLjIxNyAgYy0yLjg0LTAuNTctNC45NzktMy4wOC00Ljk3OS02LjA4NGMwLTAuMDI3LDAtMC4wNTMsMC4wMDEtMC4wOGMwLjgzNiwwLjQ2NSwxLjc5MywwLjc0NCwyLjgxMSwwLjc3NyAgYy0xLjY2Ni0xLjExNS0yLjc2MS0zLjAxMi0yLjc2MS01LjE2NmMwLTEuMTM3LDAuMzA2LTIuMjA0LDAuODQtMy4xMmMzLjA2MSwzLjc1NCw3LjYzNCw2LjIyNSwxMi43OTIsNi40ODMgIGMtMC4xMDYtMC40NTMtMC4xNjEtMC45MjgtMC4xNjEtMS40MTRjMC0zLjQyNiwyLjc3OC02LjIwNSw2LjIwNi02LjIwNWMxLjc4NSwwLDMuMzk3LDAuNzU0LDQuNTI5LDEuOTU5ICBjMS40MTQtMC4yNzcsMi43NDItMC43OTUsMy45NDEtMS41MDZjLTAuNDY1LDEuNDUtMS40NDgsMi42NjYtMi43MywzLjQzM2MxLjI1Ny0wLjE1LDIuNDUzLTAuNDg0LDMuNTY1LTAuOTc3ICBDNDMuMDE4LDIyLjg0OSw0MS45NjUsMjMuOTQyLDQwLjc1MiwyNC44MTd6XCIvPjwvc3ZnPmBcbiIsIm1vZHVsZS5leHBvcnRzID0gZXJyID0+IHsgY29uc29sZS5sb2coIGVyci5zdGFjayB8fCBlcnIgKSB9XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcblxuICAgIEVycm9yOiByZXF1aXJlKCcuL015RXJyb3InKSxcblxuICAgIFA6ICggZnVuLCBhcmdzPVsgXSwgdGhpc0FyZyApID0+XG4gICAgICAgIG5ldyBQcm9taXNlKCAoIHJlc29sdmUsIHJlamVjdCApID0+IFJlZmxlY3QuYXBwbHkoIGZ1biwgdGhpc0FyZyB8fCB0aGlzLCBhcmdzLmNvbmNhdCggKCBlLCAuLi5jYWxsYmFjayApID0+IGUgPyByZWplY3QoZSkgOiByZXNvbHZlKGNhbGxiYWNrKSApICkgKSxcbiAgICBcbiAgICBjb25zdHJ1Y3RvcigpIHsgcmV0dXJuIHRoaXMgfVxufVxuIiwiLy8gQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgb3RoZXIgTm9kZSBjb250cmlidXRvcnMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbi8vIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbi8vIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuLy8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuLy8gZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdFxuLy8gcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlXG4vLyBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuLy8gaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuLy8gT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTlxuLy8gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4vLyBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1Jcbi8vIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbi8vIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbmZ1bmN0aW9uIEV2ZW50RW1pdHRlcigpIHtcbiAgdGhpcy5fZXZlbnRzID0gdGhpcy5fZXZlbnRzIHx8IHt9O1xuICB0aGlzLl9tYXhMaXN0ZW5lcnMgPSB0aGlzLl9tYXhMaXN0ZW5lcnMgfHwgdW5kZWZpbmVkO1xufVxubW9kdWxlLmV4cG9ydHMgPSBFdmVudEVtaXR0ZXI7XG5cbi8vIEJhY2t3YXJkcy1jb21wYXQgd2l0aCBub2RlIDAuMTAueFxuRXZlbnRFbWl0dGVyLkV2ZW50RW1pdHRlciA9IEV2ZW50RW1pdHRlcjtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5fZXZlbnRzID0gdW5kZWZpbmVkO1xuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5fbWF4TGlzdGVuZXJzID0gdW5kZWZpbmVkO1xuXG4vLyBCeSBkZWZhdWx0IEV2ZW50RW1pdHRlcnMgd2lsbCBwcmludCBhIHdhcm5pbmcgaWYgbW9yZSB0aGFuIDEwIGxpc3RlbmVycyBhcmVcbi8vIGFkZGVkIHRvIGl0LiBUaGlzIGlzIGEgdXNlZnVsIGRlZmF1bHQgd2hpY2ggaGVscHMgZmluZGluZyBtZW1vcnkgbGVha3MuXG5FdmVudEVtaXR0ZXIuZGVmYXVsdE1heExpc3RlbmVycyA9IDEwO1xuXG4vLyBPYnZpb3VzbHkgbm90IGFsbCBFbWl0dGVycyBzaG91bGQgYmUgbGltaXRlZCB0byAxMC4gVGhpcyBmdW5jdGlvbiBhbGxvd3Ncbi8vIHRoYXQgdG8gYmUgaW5jcmVhc2VkLiBTZXQgdG8gemVybyBmb3IgdW5saW1pdGVkLlxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5zZXRNYXhMaXN0ZW5lcnMgPSBmdW5jdGlvbihuKSB7XG4gIGlmICghaXNOdW1iZXIobikgfHwgbiA8IDAgfHwgaXNOYU4obikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCduIG11c3QgYmUgYSBwb3NpdGl2ZSBudW1iZXInKTtcbiAgdGhpcy5fbWF4TGlzdGVuZXJzID0gbjtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmVtaXQgPSBmdW5jdGlvbih0eXBlKSB7XG4gIHZhciBlciwgaGFuZGxlciwgbGVuLCBhcmdzLCBpLCBsaXN0ZW5lcnM7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMpXG4gICAgdGhpcy5fZXZlbnRzID0ge307XG5cbiAgLy8gSWYgdGhlcmUgaXMgbm8gJ2Vycm9yJyBldmVudCBsaXN0ZW5lciB0aGVuIHRocm93LlxuICBpZiAodHlwZSA9PT0gJ2Vycm9yJykge1xuICAgIGlmICghdGhpcy5fZXZlbnRzLmVycm9yIHx8XG4gICAgICAgIChpc09iamVjdCh0aGlzLl9ldmVudHMuZXJyb3IpICYmICF0aGlzLl9ldmVudHMuZXJyb3IubGVuZ3RoKSkge1xuICAgICAgZXIgPSBhcmd1bWVudHNbMV07XG4gICAgICBpZiAoZXIgaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgICB0aHJvdyBlcjsgLy8gVW5oYW5kbGVkICdlcnJvcicgZXZlbnRcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIEF0IGxlYXN0IGdpdmUgc29tZSBraW5kIG9mIGNvbnRleHQgdG8gdGhlIHVzZXJcbiAgICAgICAgdmFyIGVyciA9IG5ldyBFcnJvcignVW5jYXVnaHQsIHVuc3BlY2lmaWVkIFwiZXJyb3JcIiBldmVudC4gKCcgKyBlciArICcpJyk7XG4gICAgICAgIGVyci5jb250ZXh0ID0gZXI7XG4gICAgICAgIHRocm93IGVycjtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBoYW5kbGVyID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gIGlmIChpc1VuZGVmaW5lZChoYW5kbGVyKSlcbiAgICByZXR1cm4gZmFsc2U7XG5cbiAgaWYgKGlzRnVuY3Rpb24oaGFuZGxlcikpIHtcbiAgICBzd2l0Y2ggKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgIC8vIGZhc3QgY2FzZXNcbiAgICAgIGNhc2UgMTpcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMjpcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMsIGFyZ3VtZW50c1sxXSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAzOlxuICAgICAgICBoYW5kbGVyLmNhbGwodGhpcywgYXJndW1lbnRzWzFdLCBhcmd1bWVudHNbMl0pO1xuICAgICAgICBicmVhaztcbiAgICAgIC8vIHNsb3dlclxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG4gICAgICAgIGhhbmRsZXIuYXBwbHkodGhpcywgYXJncyk7XG4gICAgfVxuICB9IGVsc2UgaWYgKGlzT2JqZWN0KGhhbmRsZXIpKSB7XG4gICAgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG4gICAgbGlzdGVuZXJzID0gaGFuZGxlci5zbGljZSgpO1xuICAgIGxlbiA9IGxpc3RlbmVycy5sZW5ndGg7XG4gICAgZm9yIChpID0gMDsgaSA8IGxlbjsgaSsrKVxuICAgICAgbGlzdGVuZXJzW2ldLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmFkZExpc3RlbmVyID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgdmFyIG07XG5cbiAgaWYgKCFpc0Z1bmN0aW9uKGxpc3RlbmVyKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ2xpc3RlbmVyIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzKVxuICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuXG4gIC8vIFRvIGF2b2lkIHJlY3Vyc2lvbiBpbiB0aGUgY2FzZSB0aGF0IHR5cGUgPT09IFwibmV3TGlzdGVuZXJcIiEgQmVmb3JlXG4gIC8vIGFkZGluZyBpdCB0byB0aGUgbGlzdGVuZXJzLCBmaXJzdCBlbWl0IFwibmV3TGlzdGVuZXJcIi5cbiAgaWYgKHRoaXMuX2V2ZW50cy5uZXdMaXN0ZW5lcilcbiAgICB0aGlzLmVtaXQoJ25ld0xpc3RlbmVyJywgdHlwZSxcbiAgICAgICAgICAgICAgaXNGdW5jdGlvbihsaXN0ZW5lci5saXN0ZW5lcikgP1xuICAgICAgICAgICAgICBsaXN0ZW5lci5saXN0ZW5lciA6IGxpc3RlbmVyKTtcblxuICBpZiAoIXRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICAvLyBPcHRpbWl6ZSB0aGUgY2FzZSBvZiBvbmUgbGlzdGVuZXIuIERvbid0IG5lZWQgdGhlIGV4dHJhIGFycmF5IG9iamVjdC5cbiAgICB0aGlzLl9ldmVudHNbdHlwZV0gPSBsaXN0ZW5lcjtcbiAgZWxzZSBpZiAoaXNPYmplY3QodGhpcy5fZXZlbnRzW3R5cGVdKSlcbiAgICAvLyBJZiB3ZSd2ZSBhbHJlYWR5IGdvdCBhbiBhcnJheSwganVzdCBhcHBlbmQuXG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdLnB1c2gobGlzdGVuZXIpO1xuICBlbHNlXG4gICAgLy8gQWRkaW5nIHRoZSBzZWNvbmQgZWxlbWVudCwgbmVlZCB0byBjaGFuZ2UgdG8gYXJyYXkuXG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdID0gW3RoaXMuX2V2ZW50c1t0eXBlXSwgbGlzdGVuZXJdO1xuXG4gIC8vIENoZWNrIGZvciBsaXN0ZW5lciBsZWFrXG4gIGlmIChpc09iamVjdCh0aGlzLl9ldmVudHNbdHlwZV0pICYmICF0aGlzLl9ldmVudHNbdHlwZV0ud2FybmVkKSB7XG4gICAgaWYgKCFpc1VuZGVmaW5lZCh0aGlzLl9tYXhMaXN0ZW5lcnMpKSB7XG4gICAgICBtID0gdGhpcy5fbWF4TGlzdGVuZXJzO1xuICAgIH0gZWxzZSB7XG4gICAgICBtID0gRXZlbnRFbWl0dGVyLmRlZmF1bHRNYXhMaXN0ZW5lcnM7XG4gICAgfVxuXG4gICAgaWYgKG0gJiYgbSA+IDAgJiYgdGhpcy5fZXZlbnRzW3R5cGVdLmxlbmd0aCA+IG0pIHtcbiAgICAgIHRoaXMuX2V2ZW50c1t0eXBlXS53YXJuZWQgPSB0cnVlO1xuICAgICAgY29uc29sZS5lcnJvcignKG5vZGUpIHdhcm5pbmc6IHBvc3NpYmxlIEV2ZW50RW1pdHRlciBtZW1vcnkgJyArXG4gICAgICAgICAgICAgICAgICAgICdsZWFrIGRldGVjdGVkLiAlZCBsaXN0ZW5lcnMgYWRkZWQuICcgK1xuICAgICAgICAgICAgICAgICAgICAnVXNlIGVtaXR0ZXIuc2V0TWF4TGlzdGVuZXJzKCkgdG8gaW5jcmVhc2UgbGltaXQuJyxcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZXZlbnRzW3R5cGVdLmxlbmd0aCk7XG4gICAgICBpZiAodHlwZW9mIGNvbnNvbGUudHJhY2UgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgLy8gbm90IHN1cHBvcnRlZCBpbiBJRSAxMFxuICAgICAgICBjb25zb2xlLnRyYWNlKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLm9uID0gRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5hZGRMaXN0ZW5lcjtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbmNlID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgaWYgKCFpc0Z1bmN0aW9uKGxpc3RlbmVyKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ2xpc3RlbmVyIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuXG4gIHZhciBmaXJlZCA9IGZhbHNlO1xuXG4gIGZ1bmN0aW9uIGcoKSB7XG4gICAgdGhpcy5yZW1vdmVMaXN0ZW5lcih0eXBlLCBnKTtcblxuICAgIGlmICghZmlyZWQpIHtcbiAgICAgIGZpcmVkID0gdHJ1ZTtcbiAgICAgIGxpc3RlbmVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfVxuICB9XG5cbiAgZy5saXN0ZW5lciA9IGxpc3RlbmVyO1xuICB0aGlzLm9uKHR5cGUsIGcpO1xuXG4gIHJldHVybiB0aGlzO1xufTtcblxuLy8gZW1pdHMgYSAncmVtb3ZlTGlzdGVuZXInIGV2ZW50IGlmZiB0aGUgbGlzdGVuZXIgd2FzIHJlbW92ZWRcbkV2ZW50RW1pdHRlci5wcm90b3R5cGUucmVtb3ZlTGlzdGVuZXIgPSBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuICB2YXIgbGlzdCwgcG9zaXRpb24sIGxlbmd0aCwgaTtcblxuICBpZiAoIWlzRnVuY3Rpb24obGlzdGVuZXIpKVxuICAgIHRocm93IFR5cGVFcnJvcignbGlzdGVuZXIgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMgfHwgIXRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICByZXR1cm4gdGhpcztcblxuICBsaXN0ID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuICBsZW5ndGggPSBsaXN0Lmxlbmd0aDtcbiAgcG9zaXRpb24gPSAtMTtcblxuICBpZiAobGlzdCA9PT0gbGlzdGVuZXIgfHxcbiAgICAgIChpc0Z1bmN0aW9uKGxpc3QubGlzdGVuZXIpICYmIGxpc3QubGlzdGVuZXIgPT09IGxpc3RlbmVyKSkge1xuICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG4gICAgaWYgKHRoaXMuX2V2ZW50cy5yZW1vdmVMaXN0ZW5lcilcbiAgICAgIHRoaXMuZW1pdCgncmVtb3ZlTGlzdGVuZXInLCB0eXBlLCBsaXN0ZW5lcik7XG5cbiAgfSBlbHNlIGlmIChpc09iamVjdChsaXN0KSkge1xuICAgIGZvciAoaSA9IGxlbmd0aDsgaS0tID4gMDspIHtcbiAgICAgIGlmIChsaXN0W2ldID09PSBsaXN0ZW5lciB8fFxuICAgICAgICAgIChsaXN0W2ldLmxpc3RlbmVyICYmIGxpc3RbaV0ubGlzdGVuZXIgPT09IGxpc3RlbmVyKSkge1xuICAgICAgICBwb3NpdGlvbiA9IGk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChwb3NpdGlvbiA8IDApXG4gICAgICByZXR1cm4gdGhpcztcblxuICAgIGlmIChsaXN0Lmxlbmd0aCA9PT0gMSkge1xuICAgICAgbGlzdC5sZW5ndGggPSAwO1xuICAgICAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgICB9IGVsc2Uge1xuICAgICAgbGlzdC5zcGxpY2UocG9zaXRpb24sIDEpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9ldmVudHMucmVtb3ZlTGlzdGVuZXIpXG4gICAgICB0aGlzLmVtaXQoJ3JlbW92ZUxpc3RlbmVyJywgdHlwZSwgbGlzdGVuZXIpO1xuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUFsbExpc3RlbmVycyA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgdmFyIGtleSwgbGlzdGVuZXJzO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzKVxuICAgIHJldHVybiB0aGlzO1xuXG4gIC8vIG5vdCBsaXN0ZW5pbmcgZm9yIHJlbW92ZUxpc3RlbmVyLCBubyBuZWVkIHRvIGVtaXRcbiAgaWYgKCF0aGlzLl9ldmVudHMucmVtb3ZlTGlzdGVuZXIpIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMClcbiAgICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuICAgIGVsc2UgaWYgKHRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvLyBlbWl0IHJlbW92ZUxpc3RlbmVyIGZvciBhbGwgbGlzdGVuZXJzIG9uIGFsbCBldmVudHNcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApIHtcbiAgICBmb3IgKGtleSBpbiB0aGlzLl9ldmVudHMpIHtcbiAgICAgIGlmIChrZXkgPT09ICdyZW1vdmVMaXN0ZW5lcicpIGNvbnRpbnVlO1xuICAgICAgdGhpcy5yZW1vdmVBbGxMaXN0ZW5lcnMoa2V5KTtcbiAgICB9XG4gICAgdGhpcy5yZW1vdmVBbGxMaXN0ZW5lcnMoJ3JlbW92ZUxpc3RlbmVyJyk7XG4gICAgdGhpcy5fZXZlbnRzID0ge307XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBsaXN0ZW5lcnMgPSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgaWYgKGlzRnVuY3Rpb24obGlzdGVuZXJzKSkge1xuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIodHlwZSwgbGlzdGVuZXJzKTtcbiAgfSBlbHNlIGlmIChsaXN0ZW5lcnMpIHtcbiAgICAvLyBMSUZPIG9yZGVyXG4gICAgd2hpbGUgKGxpc3RlbmVycy5sZW5ndGgpXG4gICAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGxpc3RlbmVyc1tsaXN0ZW5lcnMubGVuZ3RoIC0gMV0pO1xuICB9XG4gIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmxpc3RlbmVycyA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgdmFyIHJldDtcbiAgaWYgKCF0aGlzLl9ldmVudHMgfHwgIXRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICByZXQgPSBbXTtcbiAgZWxzZSBpZiAoaXNGdW5jdGlvbih0aGlzLl9ldmVudHNbdHlwZV0pKVxuICAgIHJldCA9IFt0aGlzLl9ldmVudHNbdHlwZV1dO1xuICBlbHNlXG4gICAgcmV0ID0gdGhpcy5fZXZlbnRzW3R5cGVdLnNsaWNlKCk7XG4gIHJldHVybiByZXQ7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmxpc3RlbmVyQ291bnQgPSBmdW5jdGlvbih0eXBlKSB7XG4gIGlmICh0aGlzLl9ldmVudHMpIHtcbiAgICB2YXIgZXZsaXN0ZW5lciA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcblxuICAgIGlmIChpc0Z1bmN0aW9uKGV2bGlzdGVuZXIpKVxuICAgICAgcmV0dXJuIDE7XG4gICAgZWxzZSBpZiAoZXZsaXN0ZW5lcilcbiAgICAgIHJldHVybiBldmxpc3RlbmVyLmxlbmd0aDtcbiAgfVxuICByZXR1cm4gMDtcbn07XG5cbkV2ZW50RW1pdHRlci5saXN0ZW5lckNvdW50ID0gZnVuY3Rpb24oZW1pdHRlciwgdHlwZSkge1xuICByZXR1cm4gZW1pdHRlci5saXN0ZW5lckNvdW50KHR5cGUpO1xufTtcblxuZnVuY3Rpb24gaXNGdW5jdGlvbihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdmdW5jdGlvbic7XG59XG5cbmZ1bmN0aW9uIGlzTnVtYmVyKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ251bWJlcic7XG59XG5cbmZ1bmN0aW9uIGlzT2JqZWN0KGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ29iamVjdCcgJiYgYXJnICE9PSBudWxsO1xufVxuXG5mdW5jdGlvbiBpc1VuZGVmaW5lZChhcmcpIHtcbiAgcmV0dXJuIGFyZyA9PT0gdm9pZCAwO1xufVxuIl19
