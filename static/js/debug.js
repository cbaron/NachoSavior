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
        return encodeURIComponent('' + window.location.origin + this.model.data.image);
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

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

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
            this.els.contextPreview.src = this.model.data.context;
            this.els.preContext.value = this.model.data.preContext;
            this.els.postContext.value = this.model.data.postContext;
        } else {
            this.els.title.value = '';
            this.els.preview.src = '';
            this.els.preContext.value = '';
            this.els.postContext.value = '';
            this.els.contextPreview.src = '';
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

        this.els.context.addEventListener('change', function (e) {
            var base64Reader = new FileReader(),
                binaryReader = new FileReader();

            _this2.els.contextUpload.classList.add('has-spinner');
            _this2.els.contextUpload.appendChild(_this2.spinner.spin().el);

            base64Reader.onload = function (evt) {
                _this2.els.upload.classList.remove('has-spinner');
                _this2.spinner.stop();
                _this2.els.contextPreview.src = evt.target.result;
                binaryReader.onload = function (event) {
                    return _this2.binaryContext = event.target.result;
                };
                binaryReader.readAsArrayBuffer(e.target.files[0]);
            };

            base64Reader.readAsDataURL(e.target.files[0]);
        });

        return this;
    },
    requestAdd: function requestAdd() {
        var _this3 = this;

        if (!this.binaryFile) return Promise.resolve();

        var uploads = [this.Xhr({ method: 'POST', resource: 'file', data: this.binaryFile, headers: { contentType: 'application/octet-stream' } })];

        if (this.binaryContext) uploads.push(this.Xhr({ method: 'POST', resource: 'file', data: this.binaryContext, headers: { contentType: 'application/octet-stream' } }));

        return Promise.all(uploads).then(function (_ref) {
            var _ref2 = _slicedToArray(_ref, 2),
                comicResponse = _ref2[0],
                contextResponse = _ref2[1];

            return _this3.Xhr({
                method: 'POST',
                resource: 'comic',
                data: JSON.stringify({
                    title: _this3.els.title.value,
                    image: comicResponse.path,
                    preContext: _this3.els.preContext.value,
                    context: contextResponse ? contextResponse.path : undefined,
                    postContext: _this3.els.postContext.value,
                    created: new Date().toISOString()
                })
            });
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
    return '<div>\n    <div class="header" data-js="header">\n        <div class="title" data-js="title" >' + (p.title || '') + '</div>\n        <div class="pre-context" data-js="preContext" >' + (p.preContext || '') + '</div>\n        <div><img data-js="context" class="context" src="' + (p.context ? p.context : '') + '"/></div>\n        <div class="post-context" data-js="postContext" >' + (p.postContext || '') + '</div>\n        ' + (p._id && p.user._id && !p.opts.readOnly ? '<button class="delete" data-js="delete"></button>' : '') + '\n        ' + (p._id && p.user._id && !p.opts.readOnly ? '<button class="edit" data-js="edit"></button>' : '') + '\n    </div>\n    ' + (p._id && p.user._id && !p.opts.readOnly ? '<div class="confirm hidden" data-js="confirmDialog">\n               <span>Are you sure?</span>\n               <button data-js="confirm" type="button">Delete</button> \n               <button data-js="cancel" type="button">Cancel</button> \n           </div>' : '') + '\n    <div class="clearfix">\n        <div class="date">' + require('moment')(p.created).format('MM-DD-YYYY') + '</div>\n    </div>\n    <img data-js="image" src="' + (p.image ? p.image : '') + '"/>\n    ' + (p.opts.readOnly ? '<div class="clearfix">\n             <div class="share">\n                 ' + require('./lib/facebook') + '\n                 ' + require('./lib/twitter') + '\n                 ' + require('./lib/google') + '\n             </div>\n         </div>' : '') + '\n</div>';
};

},{"./lib/facebook":35,"./lib/google":36,"./lib/twitter":37,"moment":"moment"}],27:[function(require,module,exports){
"use strict";

module.exports = function (p) {
    return "<div>\n    <div data-js=\"header\"></div>\n    <div class=\"form-group\">\n       <label class=\"form-label\">title</label>\n       <input data-js=\"title\" type=\"text\"></input>\n    </div>\n    <div class=\"form-group\">\n       <label class=\"form-label\">pre context</label>\n       <input data-js=\"preContext\" type=\"text\"></input>\n    </div>\n    <div class=\"form-group\">\n       <label class=\"form-label\">context</label>\n        <div>\n            <div data-js=\"contextUpload\" class=\"upload\">\n                <span>Upload File</span>\n                <input type=\"file\" data-js=\"context\" />\n            </div>\n            <img class=\"preview\" data-js=\"contextPreview\" />\n        </div>\n    </div>\n    <div class=\"form-group\">\n       <label class=\"form-label\">post context</label>\n       <input data-js=\"postContext\" type=\"text\"></input>\n    </div>\n    <div class=\"form-group\">\n       <label class=\"form-label\">image</label>\n        <div>\n            <div data-js=\"upload\" class=\"upload\">\n                <span>Upload File</span>\n                <input type=\"file\" data-js=\"image\" />\n            </div>\n            <img class=\"preview\" data-js=\"preview\" />\n        </div>\n    </div>\n    <div class=\"button-row\">\n        <button data-js=\"submit\" type=\"button\">Submit</button>\n        <button data-js=\"cancel\" type=\"button\">Cancel</button>\n    </div>\n</div>";
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJjbGllbnQvanMvLlRlbXBsYXRlTWFwLmpzIiwiY2xpZW50L2pzLy5WaWV3TWFwLmpzIiwiY2xpZW50L2pzLy5lbnYiLCJjbGllbnQvanMvWGhyLmpzIiwiY2xpZW50L2pzL2ZhY3RvcnkvVmlldy5qcyIsImNsaWVudC9qcy9tYWluLmpzIiwiY2xpZW50L2pzL21vZGVscy9Vc2VyLmpzIiwiY2xpZW50L2pzL21vZGVscy9fX3Byb3RvX18uanMiLCJjbGllbnQvanMvcm91dGVyLmpzIiwiY2xpZW50L2pzL3ZpZXdzL0FkbWluLmpzIiwiY2xpZW50L2pzL3ZpZXdzL0FkbWluSXRlbS5qcyIsImNsaWVudC9qcy92aWV3cy9Db21pYy5qcyIsImNsaWVudC9qcy92aWV3cy9Db21pY01hbmFnZS5qcyIsImNsaWVudC9qcy92aWV3cy9Db21pY1Jlc291cmNlcy5qcyIsImNsaWVudC9qcy92aWV3cy9IZWFkZXIuanMiLCJjbGllbnQvanMvdmlld3MvSG9tZS5qcyIsImNsaWVudC9qcy92aWV3cy9Mb2dpbi5qcyIsImNsaWVudC9qcy92aWV3cy9Vc2VyLmpzIiwiY2xpZW50L2pzL3ZpZXdzL1VzZXJNYW5hZ2UuanMiLCJjbGllbnQvanMvdmlld3MvVXNlclJlc291cmNlcy5qcyIsImNsaWVudC9qcy92aWV3cy9fX3Byb3RvX18uanMiLCJjbGllbnQvanMvdmlld3MvbGliL09wdGltaXplZFJlc2l6ZS5qcyIsImNsaWVudC9qcy92aWV3cy9saWIvU3Bpbi5qcyIsImNsaWVudC9qcy92aWV3cy90ZW1wbGF0ZXMvQWRtaW4uanMiLCJjbGllbnQvanMvdmlld3MvdGVtcGxhdGVzL0FkbWluSXRlbS5qcyIsImNsaWVudC9qcy92aWV3cy90ZW1wbGF0ZXMvQ29taWMuanMiLCJjbGllbnQvanMvdmlld3MvdGVtcGxhdGVzL0NvbWljTWFuYWdlLmpzIiwiY2xpZW50L2pzL3ZpZXdzL3RlbXBsYXRlcy9Db21pY1Jlc291cmNlcy5qcyIsImNsaWVudC9qcy92aWV3cy90ZW1wbGF0ZXMvSGVhZGVyLmpzIiwiY2xpZW50L2pzL3ZpZXdzL3RlbXBsYXRlcy9Ib21lLmpzIiwiY2xpZW50L2pzL3ZpZXdzL3RlbXBsYXRlcy9Mb2dpbi5qcyIsImNsaWVudC9qcy92aWV3cy90ZW1wbGF0ZXMvVXNlci5qcyIsImNsaWVudC9qcy92aWV3cy90ZW1wbGF0ZXMvVXNlck1hbmFnZS5qcyIsImNsaWVudC9qcy92aWV3cy90ZW1wbGF0ZXMvVXNlclJlc291cmNlcy5qcyIsImNsaWVudC9qcy92aWV3cy90ZW1wbGF0ZXMvbGliL2ZhY2Vib29rLmpzIiwiY2xpZW50L2pzL3ZpZXdzL3RlbXBsYXRlcy9saWIvZ29vZ2xlLmpzIiwiY2xpZW50L2pzL3ZpZXdzL3RlbXBsYXRlcy9saWIvdHdpdHRlci5qcyIsImxpYi9NeUVycm9yLmpzIiwibGliL015T2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2V2ZW50cy9ldmVudHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBLE9BQU8sT0FBUCxHQUFlO0FBQ2QsUUFBTyxRQUFRLHlCQUFSLENBRE87QUFFZCxZQUFXLFFBQVEsNkJBQVIsQ0FGRztBQUdkLFFBQU8sUUFBUSx5QkFBUixDQUhPO0FBSWQsY0FBYSxRQUFRLCtCQUFSLENBSkM7QUFLZCxpQkFBZ0IsUUFBUSxrQ0FBUixDQUxGO0FBTWQsU0FBUSxRQUFRLDBCQUFSLENBTk07QUFPZCxPQUFNLFFBQVEsd0JBQVIsQ0FQUTtBQVFkLFFBQU8sUUFBUSx5QkFBUixDQVJPO0FBU2QsT0FBTSxRQUFRLHdCQUFSLENBVFE7QUFVZCxhQUFZLFFBQVEsOEJBQVIsQ0FWRTtBQVdkLGdCQUFlLFFBQVEsaUNBQVI7QUFYRCxDQUFmOzs7OztBQ0FBLE9BQU8sT0FBUCxHQUFlO0FBQ2QsUUFBTyxRQUFRLGVBQVIsQ0FETztBQUVkLFlBQVcsUUFBUSxtQkFBUixDQUZHO0FBR2QsUUFBTyxRQUFRLGVBQVIsQ0FITztBQUlkLGNBQWEs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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwibW9kdWxlLmV4cG9ydHM9e1xuXHRBZG1pbjogcmVxdWlyZSgnLi92aWV3cy90ZW1wbGF0ZXMvQWRtaW4nKSxcblx0QWRtaW5JdGVtOiByZXF1aXJlKCcuL3ZpZXdzL3RlbXBsYXRlcy9BZG1pbkl0ZW0nKSxcblx0Q29taWM6IHJlcXVpcmUoJy4vdmlld3MvdGVtcGxhdGVzL0NvbWljJyksXG5cdENvbWljTWFuYWdlOiByZXF1aXJlKCcuL3ZpZXdzL3RlbXBsYXRlcy9Db21pY01hbmFnZScpLFxuXHRDb21pY1Jlc291cmNlczogcmVxdWlyZSgnLi92aWV3cy90ZW1wbGF0ZXMvQ29taWNSZXNvdXJjZXMnKSxcblx0SGVhZGVyOiByZXF1aXJlKCcuL3ZpZXdzL3RlbXBsYXRlcy9IZWFkZXInKSxcblx0SG9tZTogcmVxdWlyZSgnLi92aWV3cy90ZW1wbGF0ZXMvSG9tZScpLFxuXHRMb2dpbjogcmVxdWlyZSgnLi92aWV3cy90ZW1wbGF0ZXMvTG9naW4nKSxcblx0VXNlcjogcmVxdWlyZSgnLi92aWV3cy90ZW1wbGF0ZXMvVXNlcicpLFxuXHRVc2VyTWFuYWdlOiByZXF1aXJlKCcuL3ZpZXdzL3RlbXBsYXRlcy9Vc2VyTWFuYWdlJyksXG5cdFVzZXJSZXNvdXJjZXM6IHJlcXVpcmUoJy4vdmlld3MvdGVtcGxhdGVzL1VzZXJSZXNvdXJjZXMnKVxufSIsIm1vZHVsZS5leHBvcnRzPXtcblx0QWRtaW46IHJlcXVpcmUoJy4vdmlld3MvQWRtaW4nKSxcblx0QWRtaW5JdGVtOiByZXF1aXJlKCcuL3ZpZXdzL0FkbWluSXRlbScpLFxuXHRDb21pYzogcmVxdWlyZSgnLi92aWV3cy9Db21pYycpLFxuXHRDb21pY01hbmFnZTogcmVxdWlyZSgnLi92aWV3cy9Db21pY01hbmFnZScpLFxuXHRDb21pY1Jlc291cmNlczogcmVxdWlyZSgnLi92aWV3cy9Db21pY1Jlc291cmNlcycpLFxuXHRIZWFkZXI6IHJlcXVpcmUoJy4vdmlld3MvSGVhZGVyJyksXG5cdEhvbWU6IHJlcXVpcmUoJy4vdmlld3MvSG9tZScpLFxuXHRMb2dpbjogcmVxdWlyZSgnLi92aWV3cy9Mb2dpbicpLFxuXHRVc2VyOiByZXF1aXJlKCcuL3ZpZXdzL1VzZXInKSxcblx0VXNlck1hbmFnZTogcmVxdWlyZSgnLi92aWV3cy9Vc2VyTWFuYWdlJyksXG5cdFVzZXJSZXNvdXJjZXM6IHJlcXVpcmUoJy4vdmlld3MvVXNlclJlc291cmNlcycpXG59Iiwid2luZG93LmNvb2tpZU5hbWUgPSAnY2hlZXRvamVzdXMnXG4iLCJtb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5jcmVhdGUoIE9iamVjdC5hc3NpZ24oIHt9LCByZXF1aXJlKCcuLi8uLi9saWIvTXlPYmplY3QnKSwge1xuXG4gICAgUmVxdWVzdDoge1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKCBkYXRhICkge1xuICAgICAgICAgICAgbGV0IHJlcSA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpXG5cbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSggKCByZXNvbHZlLCByZWplY3QgKSA9PiB7XG5cbiAgICAgICAgICAgICAgICByZXEub25sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIFsgNTAwLCA0MDQsIDQwMSBdLmluY2x1ZGVzKCB0aGlzLnN0YXR1cyApXG4gICAgICAgICAgICAgICAgICAgICAgICA/IHJlamVjdCggdGhpcy5yZXNwb25zZSApXG4gICAgICAgICAgICAgICAgICAgICAgICA6IHJlc29sdmUoIEpTT04ucGFyc2UodGhpcy5yZXNwb25zZSkgKVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmKCBkYXRhLm1ldGhvZCA9PT0gXCJnZXRcIiB8fCBkYXRhLm1ldGhvZCA9PT0gXCJvcHRpb25zXCIgKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBxcyA9IGRhdGEucXMgPyBgPyR7ZGF0YS5xc31gIDogJycgXG4gICAgICAgICAgICAgICAgICAgIHJlcS5vcGVuKCBkYXRhLm1ldGhvZCwgYC8ke2RhdGEucmVzb3VyY2V9JHtxc31gIClcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRIZWFkZXJzKCByZXEsIGRhdGEuaGVhZGVycyApXG4gICAgICAgICAgICAgICAgICAgIHJlcS5zZW5kKG51bGwpXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmVxLm9wZW4oIGRhdGEubWV0aG9kLCBgLyR7ZGF0YS5yZXNvdXJjZX1gLCB0cnVlKVxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldEhlYWRlcnMoIHJlcSwgZGF0YS5oZWFkZXJzIClcbiAgICAgICAgICAgICAgICAgICAgcmVxLnNlbmQoIGRhdGEuZGF0YSApXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSApXG4gICAgICAgIH0sXG5cbiAgICAgICAgcGxhaW5Fc2NhcGUoIHNUZXh0ICkge1xuICAgICAgICAgICAgLyogaG93IHNob3VsZCBJIHRyZWF0IGEgdGV4dC9wbGFpbiBmb3JtIGVuY29kaW5nPyB3aGF0IGNoYXJhY3RlcnMgYXJlIG5vdCBhbGxvd2VkPyB0aGlzIGlzIHdoYXQgSSBzdXBwb3NlLi4uOiAqL1xuICAgICAgICAgICAgLyogXCI0XFwzXFw3IC0gRWluc3RlaW4gc2FpZCBFPW1jMlwiIC0tLS0+IFwiNFxcXFwzXFxcXDdcXCAtXFwgRWluc3RlaW5cXCBzYWlkXFwgRVxcPW1jMlwiICovXG4gICAgICAgICAgICByZXR1cm4gc1RleHQucmVwbGFjZSgvW1xcc1xcPVxcXFxdL2csIFwiXFxcXCQmXCIpO1xuICAgICAgICB9LFxuXG4gICAgICAgIHNldEhlYWRlcnMoIHJlcSwgaGVhZGVycz17fSApIHtcbiAgICAgICAgICAgIHJlcS5zZXRSZXF1ZXN0SGVhZGVyKCBcIkFjY2VwdFwiLCBoZWFkZXJzLmFjY2VwdCB8fCAnYXBwbGljYXRpb24vanNvbicgKVxuICAgICAgICAgICAgcmVxLnNldFJlcXVlc3RIZWFkZXIoIFwiQ29udGVudC1UeXBlXCIsIGhlYWRlcnMuY29udGVudFR5cGUgfHwgJ3RleHQvcGxhaW4nIClcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBfZmFjdG9yeSggZGF0YSApIHtcbiAgICAgICAgcmV0dXJuIE9iamVjdC5jcmVhdGUoIHRoaXMuUmVxdWVzdCwgeyB9ICkuY29uc3RydWN0b3IoIGRhdGEgKVxuICAgIH0sXG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcblxuICAgICAgICBpZiggIVhNTEh0dHBSZXF1ZXN0LnByb3RvdHlwZS5zZW5kQXNCaW5hcnkgKSB7XG4gICAgICAgICAgWE1MSHR0cFJlcXVlc3QucHJvdG90eXBlLnNlbmRBc0JpbmFyeSA9IGZ1bmN0aW9uKHNEYXRhKSB7XG4gICAgICAgICAgICB2YXIgbkJ5dGVzID0gc0RhdGEubGVuZ3RoLCB1aThEYXRhID0gbmV3IFVpbnQ4QXJyYXkobkJ5dGVzKTtcbiAgICAgICAgICAgIGZvciAodmFyIG5JZHggPSAwOyBuSWR4IDwgbkJ5dGVzOyBuSWR4KyspIHtcbiAgICAgICAgICAgICAgdWk4RGF0YVtuSWR4XSA9IHNEYXRhLmNoYXJDb2RlQXQobklkeCkgJiAweGZmO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5zZW5kKHVpOERhdGEpO1xuICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcy5fZmFjdG9yeS5iaW5kKHRoaXMpXG4gICAgfVxuXG59ICksIHsgfSApLmNvbnN0cnVjdG9yKClcbiIsIm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmNyZWF0ZSgge1xuXG4gICAgY3JlYXRlKCBuYW1lLCBvcHRzICkge1xuICAgICAgICBjb25zdCBsb3dlciA9IG5hbWVcbiAgICAgICAgbmFtZSA9IG5hbWUuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBuYW1lLnNsaWNlKDEpXG4gICAgICAgIHJldHVybiBPYmplY3QuY3JlYXRlKFxuICAgICAgICAgICAgdGhpcy5WaWV3c1sgbmFtZSBdLFxuICAgICAgICAgICAgT2JqZWN0LmFzc2lnbigge1xuICAgICAgICAgICAgICAgIG5hbWU6IHsgdmFsdWU6IG5hbWUgfSxcbiAgICAgICAgICAgICAgICBmYWN0b3J5OiB7IHZhbHVlOiB0aGlzIH0sXG4gICAgICAgICAgICAgICAgdGVtcGxhdGU6IHsgdmFsdWU6IHRoaXMuVGVtcGxhdGVzWyBuYW1lIF0gfSxcbiAgICAgICAgICAgICAgICB1c2VyOiB7IHZhbHVlOiB0aGlzLlVzZXIgfVxuICAgICAgICAgICAgICAgIH0sIG9wdHMgKVxuICAgICAgICApLmNvbnN0cnVjdG9yKClcbiAgICAgICAgLm9uKCAnbmF2aWdhdGUnLCByb3V0ZSA9PiByZXF1aXJlKCcuLi9yb3V0ZXInKS5uYXZpZ2F0ZSggcm91dGUgKSApXG4gICAgICAgIC5vbiggJ2RlbGV0ZWQnLCAoKSA9PiBkZWxldGUgKHJlcXVpcmUoJy4uL3JvdXRlcicpKS52aWV3c1tuYW1lXSApXG4gICAgfSxcblxufSwge1xuICAgIFRlbXBsYXRlczogeyB2YWx1ZTogcmVxdWlyZSgnLi4vLlRlbXBsYXRlTWFwJykgfSxcbiAgICBVc2VyOiB7IHZhbHVlOiByZXF1aXJlKCcuLi9tb2RlbHMvVXNlcicgKSB9LFxuICAgIFZpZXdzOiB7IHZhbHVlOiByZXF1aXJlKCcuLi8uVmlld01hcCcpIH1cbn0gKVxuIiwid2luZG93Lm9ubG9hZCA9ICgpID0+IHtcbiAgICByZXF1aXJlKCcuLy5lbnYnKVxuICAgIHJlcXVpcmUoJy4vcm91dGVyJykuaW5pdGlhbGl6ZSgpXG59XG4iLCJtb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5jcmVhdGUoIHJlcXVpcmUoJy4vX19wcm90b19fLmpzJyksIHsgcmVzb3VyY2U6IHsgdmFsdWU6ICdtZScgfSB9IClcbiIsIm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmFzc2lnbiggeyB9LCByZXF1aXJlKCcuLi8uLi8uLi9saWIvTXlPYmplY3QnKSwgcmVxdWlyZSgnZXZlbnRzJykuRXZlbnRFbWl0dGVyLnByb3RvdHlwZSwge1xuXG4gICAgWGhyOiByZXF1aXJlKCcuLi9YaHInKSxcblxuICAgIGdldCggb3B0cz17IHF1ZXJ5Ont9IH0gKSB7XG4gICAgICAgIGlmKCBvcHRzLnF1ZXJ5IHx8IHRoaXMucGFnaW5hdGlvbiApIE9iamVjdC5hc3NpZ24oIG9wdHMucXVlcnksIHRoaXMucGFnaW5hdGlvbiApXG4gICAgICAgIHJldHVybiB0aGlzLlhociggeyBtZXRob2Q6IG9wdHMubWV0aG9kIHx8ICdnZXQnLCByZXNvdXJjZTogdGhpcy5yZXNvdXJjZSwgaGVhZGVyczogdGhpcy5oZWFkZXJzIHx8IHt9LCBxczogb3B0cy5xdWVyeSA/IEpTT04uc3RyaW5naWZ5KCBvcHRzLnF1ZXJ5ICkgOiB1bmRlZmluZWQgfSApXG4gICAgICAgIC50aGVuKCByZXNwb25zZSA9PiB7XG4gICAgICAgICAgICBpZiggIXRoaXMucGFnaW5hdGlvbiApIHJldHVybiBQcm9taXNlLnJlc29sdmUoIHRoaXMuZGF0YSA9IHJlc3BvbnNlIClcblxuICAgICAgICAgICAgaWYoICF0aGlzLmRhdGEgKSB0aGlzLmRhdGEgPSBbIF1cbiAgICAgICAgICAgIHRoaXMuZGF0YSA9IHRoaXMuZGF0YS5jb25jYXQocmVzcG9uc2UpXG4gICAgICAgICAgICB0aGlzLnBhZ2luYXRpb24uc2tpcCArPSB0aGlzLnBhZ2luYXRpb24ubGltaXRcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUocmVzcG9uc2UpXG4gICAgICAgIH0gKVxuICAgIH1cblxufSApXG4iLCJtb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5jcmVhdGUoIHtcblxuICAgIEVycm9yOiByZXF1aXJlKCcuLi8uLi9saWIvTXlFcnJvcicpLFxuICAgIFxuICAgIFVzZXI6IHJlcXVpcmUoJy4vbW9kZWxzL1VzZXInKSxcblxuICAgIFZpZXdGYWN0b3J5OiByZXF1aXJlKCcuL2ZhY3RvcnkvVmlldycpLFxuICAgIFxuICAgIFZpZXdzOiByZXF1aXJlKCcuLy5WaWV3TWFwJyksXG5cbiAgICBpbml0aWFsaXplKCkge1xuICAgICAgICB0aGlzLmNvbnRlbnRDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjY29udGVudCcpXG5cbiAgICAgICAgd2luZG93Lm9ucG9wc3RhdGUgPSB0aGlzLmhhbmRsZS5iaW5kKHRoaXMpXG5cbiAgICAgICAgdGhpcy5oZWFkZXIgPSB0aGlzLlZpZXdGYWN0b3J5LmNyZWF0ZSggJ2hlYWRlcicsIHsgaW5zZXJ0aW9uOiB7IHZhbHVlOiB7IGVsOiB0aGlzLmNvbnRlbnRDb250YWluZXIsIG1ldGhvZDogJ2luc2VydEJlZm9yZScgfSB9IH0gKVxuXG4gICAgICAgIHRoaXMuVXNlci5nZXQoKS50aGVuKCAoKSA9PlxuICAgICAgICBcbiAgICAgICAgICAgIHRoaXMuaGVhZGVyLm9uVXNlcigpXG4gICAgICAgICAgICAub24oICdzaWdub3V0JywgKCkgPT4gXG4gICAgICAgICAgICAgICAgUHJvbWlzZS5hbGwoIE9iamVjdC5rZXlzKCB0aGlzLnZpZXdzICkubWFwKCBuYW1lID0+IHRoaXMudmlld3NbIG5hbWUgXS5kZWxldGUoKSApIClcbiAgICAgICAgICAgICAgICAudGhlbiggKCkgPT4gdGhpcy5oZWFkZXIuZW1pdCggJ25hdmlnYXRlJywgJy8nICkgKVxuICAgICAgICAgICAgICAgIC5jYXRjaCggdGhpcy5FcnJvciApXG4gICAgICAgICAgICApXG5cbiAgICAgICAgKVxuICAgICAgICAuY2F0Y2goIHRoaXMuRXJyb3IgKVxuICAgICAgICAudGhlbiggKCkgPT4gdGhpcy5oYW5kbGUoKSApXG5cbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICB9LFxuXG4gICAgaGFuZGxlKCkge1xuICAgICAgICB0aGlzLmhhbmRsZXIoIHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZS5zcGxpdCgnLycpLnNsaWNlKDEpIClcbiAgICB9LFxuXG4gICAgaGFuZGxlciggcGF0aCApIHtcbiAgICAgICAgY29uc3QgbmFtZSA9IHBhdGhbMF0gPyBwYXRoWzBdLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgcGF0aFswXS5zbGljZSgxKSA6ICcnLFxuICAgICAgICAgICAgICB2aWV3ID0gdGhpcy5WaWV3c1tuYW1lXSA/IHBhdGhbMF0gOiAnaG9tZSc7XG5cbiAgICAgICAgKCAoIHZpZXcgPT09IHRoaXMuY3VycmVudFZpZXcgKVxuICAgICAgICAgICAgPyBQcm9taXNlLnJlc29sdmUoKVxuICAgICAgICAgICAgOiBQcm9taXNlLmFsbCggT2JqZWN0LmtleXMoIHRoaXMudmlld3MgKS5tYXAoIHZpZXcgPT4gdGhpcy52aWV3c1sgdmlldyBdLmhpZGUoKSApICkgKSBcbiAgICAgICAgLnRoZW4oICgpID0+IHtcblxuICAgICAgICAgICAgdGhpcy5jdXJyZW50VmlldyA9IHZpZXdcblxuICAgICAgICAgICAgaWYoIHRoaXMudmlld3NbIHZpZXcgXSApIHJldHVybiB0aGlzLnZpZXdzWyB2aWV3IF0ubmF2aWdhdGUoIHBhdGggKVxuXG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKFxuICAgICAgICAgICAgICAgIHRoaXMudmlld3NbIHZpZXcgXSA9XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuVmlld0ZhY3RvcnkuY3JlYXRlKCB2aWV3LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbnNlcnRpb246IHsgdmFsdWU6IHsgZWw6IHRoaXMuY29udGVudENvbnRhaW5lciB9IH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXRoOiB7IHZhbHVlOiBwYXRoLCB3cml0YWJsZTogdHJ1ZSB9XG4gICAgICAgICAgICAgICAgICAgIH0gKVxuICAgICAgICAgICAgKVxuICAgICAgICB9IClcbiAgICAgICAgLmNhdGNoKCB0aGlzLkVycm9yIClcbiAgICB9LFxuXG4gICAgbmF2aWdhdGUoIGxvY2F0aW9uICkge1xuICAgICAgICBoaXN0b3J5LnB1c2hTdGF0ZSgge30sICcnLCBsb2NhdGlvbiApXG4gICAgICAgIHRoaXMuaGFuZGxlKClcbiAgICB9XG5cbn0sIHsgY3VycmVudFZpZXc6IHsgdmFsdWU6ICcnLCB3cml0YWJsZTogdHJ1ZSB9LCB2aWV3czogeyB2YWx1ZTogeyB9IH0gfSApXG4iLCJtb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5hc3NpZ24oIHt9LCByZXF1aXJlKCcuL19fcHJvdG9fXycpLCB7XG5cbiAgICBkZWxldGUoKSB7XG4gICAgICAgIHJldHVybiBQcm9taXNlLmFsbCggT2JqZWN0LmtleXMoIHRoaXMuc3ViVmlld3MgKS5tYXAoIHN1YlZpZXcgPT4gdGhpcy5zdWJWaWV3c1sgc3ViVmlldyBdLmRlbGV0ZSgpICkgKVxuICAgICAgICAudGhlbiggKCkgPT4gcmVxdWlyZSgnLi9fX3Byb3RvX18nKS5kZWxldGUuY2FsbCh0aGlzKSApXG4gICAgfSxcblxuICAgIG5hdmlnYXRlKCBwYXRoICkge1xuICAgICAgICB0aGlzLnBhdGggPSBwYXRoO1xuXG4gICAgICAgIHJldHVybiAoIHBhdGgubGVuZ3RoID09PSAxICYmIHRoaXMuZWxzLmNvbnRhaW5lci5jbGFzc0xpc3QuY29udGFpbnMoJ2hpZGUnKSApXG4gICAgICAgICAgICA/IFByb21pc2UuYWxsKCBPYmplY3Qua2V5cyggdGhpcy5zdWJWaWV3cyApLm1hcCggdmlldyA9PiB0aGlzLnN1YlZpZXdzWyB2aWV3IF0uaGlkZSgpICkgKS50aGVuKCAoKSA9PiB0aGlzLnNob3coKSApLmNhdGNoKCB0aGlzLkVycm9yIClcbiAgICAgICAgICAgIDogKCB0aGlzLnBhdGgubGVuZ3RoID4gMSApXG4gICAgICAgICAgICAgICAgPyAoIHRoaXMuZWxzLmNvbnRhaW5lci5jbGFzc0xpc3QuY29udGFpbnMoJ2hpZGUnKSApXG4gICAgICAgICAgICAgICAgICAgID8gdGhpcy5yZW5kZXJTdWJWaWV3KClcbiAgICAgICAgICAgICAgICAgICAgOiB0aGlzLmhpZGUoKS50aGVuKCAoKSA9PiB0aGlzLnJlbmRlclN1YlZpZXcoKSApXG4gICAgICAgICAgICAgICAgOiBQcm9taXNlLnJlc29sdmUoKVxuICAgIH0sXG5cbiAgICBwb3N0UmVuZGVyKCkge1xuICAgICAgICB0aGlzLnZpZXdzID0geyB9XG4gICAgICAgIHRoaXMuc3ViVmlld3MgPSB7IH1cblxuICAgICAgICBpZiggdGhpcy5wYXRoLmxlbmd0aCA+IDEgKSB7XG4gICAgICAgICAgICB0aGlzLmVscy5jb250YWluZXIuY2xhc3NMaXN0LmFkZCggJ2hpZGUnLCAnaGlkZGVuJyApXG4gICAgICAgICAgICB0aGlzLnJlbmRlclN1YlZpZXcoKVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5vcHRpb25zID0gT2JqZWN0LmNyZWF0ZSggdGhpcy5Nb2RlbCwgeyByZXNvdXJjZTogeyB2YWx1ZTogJ2FkbWluJyB9IH0gKVxuXG4gICAgICAgIHRoaXMub3B0aW9ucy5nZXQoIHsgbWV0aG9kOiAnb3B0aW9ucycgfSApXG4gICAgICAgIC50aGVuKCAoKSA9PlxuICAgICAgICAgICAgdGhpcy5vcHRpb25zLmRhdGEuZm9yRWFjaCggY29sbGVjdGlvbiA9PlxuICAgICAgICAgICAgICAgIHRoaXMudmlld3NbIGNvbGxlY3Rpb24gXSA9IHRoaXMuZmFjdG9yeS5jcmVhdGUoXG4gICAgICAgICAgICAgICAgICAgICdBZG1pbkl0ZW0nLFxuICAgICAgICAgICAgICAgICAgICB7IGluc2VydGlvbjogeyB2YWx1ZTogeyBlbDogdGhpcy5lbHMubGlzdCB9IH0sXG4gICAgICAgICAgICAgICAgICAgICAgbW9kZWw6IHsgdmFsdWU6IHsgZGF0YTogeyBjb2xsZWN0aW9uIH0gfSB9IH1cbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICApXG4gICAgICAgIClcbiAgICAgICAgLmNhdGNoKCB0aGlzLkVycm9yIClcblxuICAgICAgICByZXR1cm4gdGhpc1xuICAgIH0sXG5cbiAgICByZW5kZXJTdWJWaWV3KCkge1xuICAgICAgICBjb25zdCBzdWJWaWV3TmFtZSA9IGAke3RoaXMuY2FwaXRhbGl6ZUZpcnN0TGV0dGVyKHRoaXMucGF0aFsxXSl9UmVzb3VyY2VzYFxuXG4gICAgICAgIHJldHVybiB0aGlzLnN1YlZpZXdzWyBzdWJWaWV3TmFtZSBdXG4gICAgICAgICAgICA/IHRoaXMuc3ViVmlld3NbIHN1YlZpZXdOYW1lIF0ub25OYXZpZ2F0aW9uKCB0aGlzLnBhdGggKVxuICAgICAgICAgICAgOiB0aGlzLnN1YlZpZXdzWyBzdWJWaWV3TmFtZSBdID0gdGhpcy5mYWN0b3J5LmNyZWF0ZSggc3ViVmlld05hbWUsIHsgcGF0aDogeyB2YWx1ZTogdGhpcy5wYXRoLCB3cml0YWJsZTogdHJ1ZSB9LCBpbnNlcnRpb246IHsgdmFsdWU6IHsgZWw6IHRoaXMuZWxzLmNvbnRhaW5lciwgbWV0aG9kOiAnaW5zZXJ0QmVmb3JlJyB9IH0gfSApXG4gICAgfSxcblxuICAgIHJlcXVpcmVzTG9naW46IHRydWVcbn0gKVxuIiwibW9kdWxlLmV4cG9ydHMgPSBPYmplY3QuYXNzaWduKCB7fSwgcmVxdWlyZSgnLi9fX3Byb3RvX18nKSwge1xuXG4gICAgZXZlbnRzOiB7XG4gICAgICAgIGNvbnRhaW5lcjogJ2NsaWNrJ1xuICAgIH0sXG5cbiAgICBvbkNvbnRhaW5lckNsaWNrKCkge1xuICAgICAgICB0aGlzLmVtaXQoICduYXZpZ2F0ZScsIGAvYWRtaW4vJHt0aGlzLm1vZGVsLmRhdGEuY29sbGVjdGlvbn1gIClcbiAgICB9XG59IClcbiIsIm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmFzc2lnbigge30sIHJlcXVpcmUoJy4vX19wcm90b19fJyksIHtcblxuICAgIGV2ZW50czoge1xuICAgICAgICBjYW5jZWw6ICdjbGljaycsXG4gICAgICAgIGNvbmZpcm06ICdjbGljaycsXG4gICAgICAgIGRlbGV0ZTogJ2NsaWNrJyxcbiAgICAgICAgZWRpdDogJ2NsaWNrJyxcbiAgICAgICAgZmFjZWJvb2s6ICdjbGljaycsXG4gICAgICAgIGdvb2dsZTogJ2NsaWNrJyxcbiAgICAgICAgdGl0bGU6ICdjbGljaycsXG4gICAgICAgIHR3aXR0ZXI6ICdjbGljaydcbiAgICB9LFxuXG4gICAgZ2V0TGluaygpIHtcbiAgICAgICAgcmV0dXJuIGAke3dpbmRvdy5sb2NhdGlvbi5vcmlnaW59L2NvbWljLyR7dGhpcy5tb2RlbC5kYXRhLl9pZH1gXG4gICAgfSxcblxuICAgIGdldENvbWljKCkge1xuICAgICAgICByZXR1cm4gZW5jb2RlVVJJQ29tcG9uZW50KCBgJHt3aW5kb3cubG9jYXRpb24ub3JpZ2lufSR7dGhpcy5tb2RlbC5kYXRhLmltYWdlfWAgKVxuICAgIH0sXG5cbiAgICBuYXZpZ2F0ZSggcGF0aCApIHtcbiAgICAgICAgdGhpcy5wYXRoID0gcGF0aFxuICAgICAgICB0aGlzLm1vZGVsLnJlc291cmNlID0gYGNvbWljLyR7dGhpcy5wYXRoWzFdfWBcblxuICAgICAgICB0aGlzLm1vZGVsLmdldCgpXG4gICAgICAgIC50aGVuKCBjb21pYyA9PiB7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZShjb21pYylcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNob3coKVxuICAgICAgICB9IClcbiAgICAgICAgLmNhdGNoKCB0aGlzLkVycm9yIClcbiAgICB9LFxuXG4gICAgb25DYW5jZWxDbGljaygpIHtcbiAgICAgICAgdGhpcy5lbHMuaGVhZGVyLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGRlbicpXG4gICAgICAgIHRoaXMuZWxzLmNvbmZpcm1EaWFsb2cuY2xhc3NMaXN0LmFkZCgnaGlkZGVuJylcbiAgICB9LFxuXG4gICAgb25Db25maXJtQ2xpY2soKSB7XG4gICAgICAgIHRoaXMuZW1pdCgnZGVsZXRlJylcbiAgICB9LFxuXG4gICAgb25EZWxldGVDbGljaygpIHtcbiAgICAgICAgaWYoIHRoaXMudXNlciAmJiB0aGlzLnVzZXIuZGF0YS5faWQgKSB7XG4gICAgICAgICAgICB0aGlzLmVscy5oZWFkZXIuY2xhc3NMaXN0LmFkZCgnaGlkZGVuJylcbiAgICAgICAgICAgIHRoaXMuZWxzLmNvbmZpcm1EaWFsb2cuY2xhc3NMaXN0LnJlbW92ZSgnaGlkZGVuJylcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBvbkVkaXRDbGljaygpIHtcbiAgICAgICAgaWYoIHRoaXMudXNlciAmJiB0aGlzLnVzZXIuZGF0YS5faWQgKSB0aGlzLmVtaXQoJ2VkaXQnKVxuICAgIH0sXG5cbiAgICAvL29uRmFjZWJvb2tDbGljaygpIHsgd2luZG93Lm9wZW4oIGBodHRwczovL3d3dy5mYWNlYm9vay5jb20vc2hhcmUucGhwP3U9JHt0aGlzLmdldExpbmsoKX1gICkgfSxcbiAgICBcbiAgICBvbkZhY2Vib29rQ2xpY2soKSB7XG4gICAgICAgIHdpbmRvdy5vcGVuKFxuICAgICAgICAgICAgYGh0dHA6Ly93d3cuemF6emxlLmNvbS9hcGkvY3JlYXRlL2F0LTIzODU1NTg3ODEyMzg1NDAzMT9yZj0yMzgzNTc0NzA4ODQ2ODU0NjgmYCArXG4gICAgICAgICAgICBgYXg9RGVzaWduQmxhc3Qmc3I9MjUwMzc1MjAyNTQyMTgwODAwJmNnPTAmdF9fdXNlUXBjPXRydWUmZWQ9ZmFsc2UmdF9fc21hcnQ9dHJ1ZSZgICtcbiAgICAgICAgICAgIGBjb250aW51ZVVybD0ke2VuY29kZVVSSUNvbXBvbmVudCh3aW5kb3cubG9jYXRpb24ub3JpZ2luKX0mZndkPVByb2R1Y3RQYWdlJnRjPSR7d2luZG93LmxvY2F0aW9ufSZpYz0ke3RoaXMubW9kZWwuZGF0YS5faWR9JmltYWdlMT0ke3RoaXMuZ2V0Q29taWMoKX1gIClcbiAgICB9LFxuICAgIFxuICAgIG9uR29vZ2xlQ2xpY2soKSB7IHdpbmRvdy5vcGVuKCBgaHR0cHM6Ly9wbHVzLmdvb2dsZS5jb20vc2hhcmU/dXJsPXske3RoaXMuZ2V0TGluaygpfX1gKSB9LFxuICAgIFxuICAgIG9uVGl0bGVDbGljaygpIHsgdGhpcy5lbWl0KCAnbmF2aWdhdGUnLCBgL2NvbWljLyR7dGhpcy5tb2RlbC5kYXRhLl9pZH1gICkgfSxcblxuICAgIG9uVHdpdHRlckNsaWNrKCkgeyB3aW5kb3cub3BlbiggYGh0dHBzOi8vd3d3LnR3aXR0ZXIuY29tL3NoYXJlP3VybD0ke3RoaXMuZ2V0TGluaygpfSZ2aWE9dGlueWhhbmRlZCZ0ZXh0PSR7ZW5jb2RlVVJJQ29tcG9uZW50KHRoaXMubW9kZWwuZGF0YS50aXRsZSl9YCApIH0sXG5cbiAgICBwb3N0UmVuZGVyKCkge1xuICAgICAgICBpZiggdGhpcy5tb2RlbCAmJiB0aGlzLm1vZGVsLmRhdGEuX2lkICkgcmV0dXJuIHRoaXNcblxuICAgICAgICBpZiggdGhpcy5wYXRoLmxlbmd0aCAhPT0gMiApIHsgdGhpcy5lbWl0KCAnbmF2aWdhdGUnLCAnJyApOyByZXR1cm4gdGhpcyB9XG5cbiAgICAgICAgdGhpcy5tb2RlbCA9IE9iamVjdC5jcmVhdGUoIHRoaXMuTW9kZWwsIHsgcmVzb3VyY2U6IHsgdmFsdWU6IGBjb21pYy8ke3RoaXMucGF0aFsxXX1gLCB3cml0YWJsZTogdHJ1ZSB9IH0gKVxuICAgICAgICB0aGlzLm1vZGVsLmdldCgpXG4gICAgICAgIC50aGVuKCB0aGlzLnVwZGF0ZS5iaW5kKHRoaXMpIClcbiAgICAgICAgLmNhdGNoKCB0aGlzLkVycm9yIClcblxuICAgICAgICByZXR1cm4gdGhpc1xuICAgIH0sXG5cbiAgICB1cGRhdGUoY29taWMpIHtcbiAgICAgICAgdGhpcy5tb2RlbC5kYXRhID0gY29taWNcbiAgICAgICAgdGhpcy5lbHMudGl0bGUudGV4dENvbnRlbnQgPSBjb21pYy50aXRsZVxuICAgICAgICB0aGlzLmVscy5pbWFnZS5zcmMgPSBgJHtjb21pYy5pbWFnZX0/JHtuZXcgRGF0ZSgpLmdldFRpbWUoKX1gXG4gICAgfVxufSApXG4iLCJtb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5hc3NpZ24oIHt9LCByZXF1aXJlKCcuL19fcHJvdG9fXycpLCB7XG5cbiAgICBldmVudHM6IHtcbiAgICAgICAgY2FuY2VsOiAnY2xpY2snLFxuICAgICAgICBzdWJtaXQ6ICdjbGljaydcbiAgICB9LFxuXG4gICAgb25DYW5jZWxDbGljaygpIHsgdGhpcy5oaWRlKCkudGhlbiggKCkgPT4gdGhpcy5lbWl0KCdjYW5jZWxsZWQnKSApIH0sXG4gICAgXG4gICAgb25TdWJtaXRDbGljaygpIHtcbiAgICAgICAgdGhpc1sgYHJlcXVlc3Qke3RoaXMuY2FwaXRhbGl6ZUZpcnN0TGV0dGVyKCB0aGlzLnR5cGUgKX1gIF0oKVxuICAgICAgICAuY2F0Y2goIHRoaXMuRXJyb3IgKVxuICAgIH0sXG5cbiAgICBvbk5hdmlnYXRpb24oIHR5cGUsIGNvbWljICkge1xuICAgICAgICB0aGlzLnR5cGUgPSB0eXBlXG4gICAgICAgIHRoaXMubW9kZWwuZGF0YSA9IGNvbWljXG4gICAgICAgXG4gICAgICAgIHRoaXMucG9wdWxhdGUoKSBcblxuICAgICAgICBpZiggdGhpcy5lbHMuY29udGFpbmVyLmNsYXNzTGlzdC5jb250YWlucygnaGlkZScpICkgdGhpcy5zaG93KClcbiAgICB9LFxuXG4gICAgcG9wdWxhdGUoKSB7XG4gICAgICAgIHRoaXMuZWxzLmhlYWRlci50ZXh0Q29udGVudCA9IGAke3RoaXMuY2FwaXRhbGl6ZUZpcnN0TGV0dGVyKCB0aGlzLnR5cGUgKX0gQ29taWNgXG5cbiAgICAgICAgaWYoIE9iamVjdC5rZXlzKCB0aGlzLm1vZGVsLmRhdGEgKS5sZW5ndGggKSB7XG4gICAgICAgICAgICB0aGlzLmVscy50aXRsZS52YWx1ZSA9IHRoaXMubW9kZWwuZGF0YS50aXRsZSB8fCAnJ1xuICAgICAgICAgICAgdGhpcy5lbHMucHJldmlldy5zcmMgPSB0aGlzLm1vZGVsLmRhdGEuaW1hZ2VcbiAgICAgICAgICAgIHRoaXMuZWxzLmNvbnRleHRQcmV2aWV3LnNyYyA9IHRoaXMubW9kZWwuZGF0YS5jb250ZXh0XG4gICAgICAgICAgICB0aGlzLmVscy5wcmVDb250ZXh0LnZhbHVlID0gdGhpcy5tb2RlbC5kYXRhLnByZUNvbnRleHRcbiAgICAgICAgICAgIHRoaXMuZWxzLnBvc3RDb250ZXh0LnZhbHVlID0gdGhpcy5tb2RlbC5kYXRhLnBvc3RDb250ZXh0XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmVscy50aXRsZS52YWx1ZSA9ICcnXG4gICAgICAgICAgICB0aGlzLmVscy5wcmV2aWV3LnNyYyA9ICcnXG4gICAgICAgICAgICB0aGlzLmVscy5wcmVDb250ZXh0LnZhbHVlID0gJydcbiAgICAgICAgICAgIHRoaXMuZWxzLnBvc3RDb250ZXh0LnZhbHVlID0gJydcbiAgICAgICAgICAgIHRoaXMuZWxzLmNvbnRleHRQcmV2aWV3LnNyYyA9ICcnXG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgcG9zdFJlbmRlcigpIHtcbiAgICAgICAgdGhpcy5zcGlubmVyID0gbmV3IHRoaXMuU3Bpbm5lcigge1xuICAgICAgICAgICAgY29sb3I6ICcjZmZmJyxcbiAgICAgICAgICAgIGxlbmd0aDogMTUsXG4gICAgICAgICAgICBzY2FsZTogMC4yNSxcbiAgICAgICAgICAgIHdpZHRoOiA1XG4gICAgICAgIH0gKS5zcGluKClcblxuICAgICAgICB0aGlzLnBvcHVsYXRlKClcblxuICAgICAgICB0aGlzLmVscy5pbWFnZS5hZGRFdmVudExpc3RlbmVyKCAnY2hhbmdlJywgZSA9PiB7XG4gICAgICAgICAgICBjb25zdCBiYXNlNjRSZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpLFxuICAgICAgICAgICAgICAgICAgYmluYXJ5UmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKVxuICAgICAgICAgICAgXG4gICAgICAgICAgICB0aGlzLmVscy51cGxvYWQuY2xhc3NMaXN0LmFkZCgnaGFzLXNwaW5uZXInKVxuICAgICAgICAgICAgdGhpcy5lbHMudXBsb2FkLmFwcGVuZENoaWxkKCB0aGlzLnNwaW5uZXIuc3BpbigpLmVsIClcblxuICAgICAgICAgICAgYmFzZTY0UmVhZGVyLm9ubG9hZCA9ICggZXZ0ICkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuZWxzLnVwbG9hZC5jbGFzc0xpc3QucmVtb3ZlKCdoYXMtc3Bpbm5lcicpXG4gICAgICAgICAgICAgICAgdGhpcy5zcGlubmVyLnN0b3AoKVxuICAgICAgICAgICAgICAgIHRoaXMuZWxzLnByZXZpZXcuc3JjID0gZXZ0LnRhcmdldC5yZXN1bHQgXG4gICAgICAgICAgICAgICAgYmluYXJ5UmVhZGVyLm9ubG9hZCA9IGV2ZW50ID0+IHRoaXMuYmluYXJ5RmlsZSA9IGV2ZW50LnRhcmdldC5yZXN1bHRcbiAgICAgICAgICAgICAgICBiaW5hcnlSZWFkZXIucmVhZEFzQXJyYXlCdWZmZXIoIGUudGFyZ2V0LmZpbGVzWzBdIClcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgYmFzZTY0UmVhZGVyLnJlYWRBc0RhdGFVUkwoIGUudGFyZ2V0LmZpbGVzWzBdIClcbiAgICAgICAgfSApXG5cbiAgICAgICAgdGhpcy5lbHMuY29udGV4dC5hZGRFdmVudExpc3RlbmVyKCAnY2hhbmdlJywgZSA9PiB7XG4gICAgICAgICAgICBjb25zdCBiYXNlNjRSZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpLFxuICAgICAgICAgICAgICAgICAgYmluYXJ5UmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKVxuICAgICAgICAgICAgXG4gICAgICAgICAgICB0aGlzLmVscy5jb250ZXh0VXBsb2FkLmNsYXNzTGlzdC5hZGQoJ2hhcy1zcGlubmVyJylcbiAgICAgICAgICAgIHRoaXMuZWxzLmNvbnRleHRVcGxvYWQuYXBwZW5kQ2hpbGQoIHRoaXMuc3Bpbm5lci5zcGluKCkuZWwgKVxuXG4gICAgICAgICAgICBiYXNlNjRSZWFkZXIub25sb2FkID0gKCBldnQgKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5lbHMudXBsb2FkLmNsYXNzTGlzdC5yZW1vdmUoJ2hhcy1zcGlubmVyJylcbiAgICAgICAgICAgICAgICB0aGlzLnNwaW5uZXIuc3RvcCgpXG4gICAgICAgICAgICAgICAgdGhpcy5lbHMuY29udGV4dFByZXZpZXcuc3JjID0gZXZ0LnRhcmdldC5yZXN1bHQgXG4gICAgICAgICAgICAgICAgYmluYXJ5UmVhZGVyLm9ubG9hZCA9IGV2ZW50ID0+IHRoaXMuYmluYXJ5Q29udGV4dCA9IGV2ZW50LnRhcmdldC5yZXN1bHRcbiAgICAgICAgICAgICAgICBiaW5hcnlSZWFkZXIucmVhZEFzQXJyYXlCdWZmZXIoIGUudGFyZ2V0LmZpbGVzWzBdIClcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgYmFzZTY0UmVhZGVyLnJlYWRBc0RhdGFVUkwoIGUudGFyZ2V0LmZpbGVzWzBdIClcbiAgICAgICAgfSApXG4gICAgICAgICAgICBcbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICB9LFxuXG4gICAgcmVxdWVzdEFkZCgpIHtcbiAgICAgICAgaWYoICF0aGlzLmJpbmFyeUZpbGUgKSByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKClcblxuICAgICAgICBsZXQgdXBsb2FkcyA9IFsgdGhpcy5YaHIoIHsgbWV0aG9kOiAnUE9TVCcsIHJlc291cmNlOiAnZmlsZScsIGRhdGE6IHRoaXMuYmluYXJ5RmlsZSwgaGVhZGVyczogeyBjb250ZW50VHlwZTogJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbScgfSB9ICkgXVxuXG4gICAgICAgIGlmKCB0aGlzLmJpbmFyeUNvbnRleHQgKSB1cGxvYWRzLnB1c2goIHRoaXMuWGhyKCB7IG1ldGhvZDogJ1BPU1QnLCByZXNvdXJjZTogJ2ZpbGUnLCBkYXRhOiB0aGlzLmJpbmFyeUNvbnRleHQsIGhlYWRlcnM6IHsgY29udGVudFR5cGU6ICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nIH0gfSApIClcblxuICAgICAgICByZXR1cm4gUHJvbWlzZS5hbGwoIHVwbG9hZHMgKVxuICAgICAgICAudGhlbiggKCBbIGNvbWljUmVzcG9uc2UsIGNvbnRleHRSZXNwb25zZSBdICkgPT5cbiAgICAgICAgICAgIHRoaXMuWGhyKCB7XG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgICAgICAgICAgcmVzb3VyY2U6ICdjb21pYycsXG4gICAgICAgICAgICAgICAgZGF0YTogSlNPTi5zdHJpbmdpZnkoIHtcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6IHRoaXMuZWxzLnRpdGxlLnZhbHVlLFxuICAgICAgICAgICAgICAgICAgICBpbWFnZTogY29taWNSZXNwb25zZS5wYXRoLFxuICAgICAgICAgICAgICAgICAgICBwcmVDb250ZXh0OiB0aGlzLmVscy5wcmVDb250ZXh0LnZhbHVlLFxuICAgICAgICAgICAgICAgICAgICBjb250ZXh0OiBjb250ZXh0UmVzcG9uc2UgPyBjb250ZXh0UmVzcG9uc2UucGF0aCA6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICAgICAgcG9zdENvbnRleHQ6IHRoaXMuZWxzLnBvc3RDb250ZXh0LnZhbHVlLFxuICAgICAgICAgICAgICAgICAgICBjcmVhdGVkOiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKClcbiAgICAgICAgICAgICAgICB9IClcbiAgICAgICAgICAgIH0gKVxuICAgICAgICApXG4gICAgICAgIC50aGVuKCByZXNwb25zZSA9PiB0aGlzLmhpZGUoKS50aGVuKCAoKSA9PiB0aGlzLmVtaXQoICdhZGRlZCcsIHJlc3BvbnNlICkgKSApXG4gICAgfSxcblxuICAgIHJlcXVlc3RFZGl0KCkge1xuICAgICAgICBsZXQgZGF0YSA9IHsgdGl0bGU6IHRoaXMuZWxzLnRpdGxlLnZhbHVlIH1cbiAgICAgICAgXG4gICAgICAgIHJldHVybiAoICggdGhpcy5iaW5hcnlGaWxlIClcbiAgICAgICAgICAgID8gdGhpcy5YaHIoIHsgbWV0aG9kOiAnUEFUQ0gnLCByZXNvdXJjZTogYGZpbGUvJHt0aGlzLm1vZGVsLmRhdGEuaW1hZ2Uuc3BsaXQoJy8nKVs0XX1gLCBkYXRhOiB0aGlzLmJpbmFyeUZpbGUsIGhlYWRlcnM6IHsgY29udGVudFR5cGU6ICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nIH0gfSApXG4gICAgICAgICAgICA6IFByb21pc2UucmVzb2x2ZSgpIClcbiAgICAgICAgLnRoZW4oICgpID0+IHRoaXMuWGhyKCB7IG1ldGhvZDogJ1BBVENIJywgcmVzb3VyY2U6IGBjb21pYy8ke3RoaXMubW9kZWwuZGF0YS5faWR9YCwgZGF0YTogSlNPTi5zdHJpbmdpZnkoIGRhdGEgKSB9ICkgKVxuICAgICAgICAudGhlbiggcmVzcG9uc2UgPT4gdGhpcy5oaWRlKCkudGhlbiggKCkgPT4gdGhpcy5lbWl0KCAnZWRpdGVkJywgcmVzcG9uc2UgKSApIClcbiAgICB9XG59IClcbiIsIm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmFzc2lnbigge30sIHJlcXVpcmUoJy4vX19wcm90b19fJyksIHtcblxuICAgIGNyZWF0ZUNvbWljVmlldyggY29taWMsIG9wdHM9e30gKSB7XG4gICAgICAgIHRoaXMudmlld3NbIGNvbWljLl9pZCBdID0gdGhpcy5mYWN0b3J5LmNyZWF0ZShcbiAgICAgICAgICAgICdDb21pYycsXG4gICAgICAgICAgICB7IGluc2VydGlvbjogb3B0cy5pbnNlcnRpb24gfHwgeyB2YWx1ZTogeyBlbDogdGhpcy5lbHMubGlzdCB9IH0sXG4gICAgICAgICAgICAgIG1vZGVsOiB7IHZhbHVlOiB7IGRhdGE6IGNvbWljIH0gfVxuICAgICAgICAgICAgfVxuICAgICAgICApXG5cbiAgICAgICAgdGhpcy52aWV3c1sgY29taWMuX2lkIF1cbiAgICAgICAgLm9uKCAnZWRpdCcsICgpID0+IHRoaXMuZW1pdCggJ25hdmlnYXRlJywgYC9hZG1pbi9jb21pYy9lZGl0LyR7Y29taWMuX2lkfWApIClcbiAgICAgICAgLm9uKCAnZGVsZXRlJywgKCkgPT5cbiAgICAgICAgICAgIHRoaXMuWGhyKCB7IG1ldGhvZDogJ2RlbGV0ZScsIHJlc291cmNlOiBgY29taWMvJHtjb21pYy5faWR9YCB9IClcbiAgICAgICAgICAgIC50aGVuKCAoKSA9PiB0aGlzLnZpZXdzWyBjb21pYy5faWQgXS5kZWxldGUoKSApXG4gICAgICAgICAgICAuY2F0Y2goIHRoaXMuRXJyb3IgKVxuICAgICAgICApXG4gICAgfSxcblxuICAgIGRlbGV0ZSgpIHtcbiAgICAgICAgcmV0dXJuICggKCB0aGlzLnZpZXdzLkNvbWljTWFuYWdlIClcbiAgICAgICAgICAgID8gdGhpcy52aWV3cy5Db21pY01hbmFnZS5kZWxldGUoKVxuICAgICAgICAgICAgOiBQcm9taXNlLnJlc29sdmUoKSApXG4gICAgICAgIC50aGVuKCAoKSA9PiByZXF1aXJlKCcuL19fcHJvdG9fXycpLmRlbGV0ZS5jYWxsKHRoaXMpIClcbiAgICB9LFxuXG4gICAgZXZlbnRzOiB7XG4gICAgICAgIGFkZEJ0bjogJ2NsaWNrJ1xuICAgIH0sXG5cbiAgICBmZXRjaEFuZERpc3BsYXkoKSB7XG4gICAgICAgIHRoaXMuZmV0Y2hpbmcgPSB0cnVlXG4gICAgICAgIHJldHVybiB0aGlzLmNvbWljcy5nZXQoKVxuICAgICAgICAudGhlbiggcmVzcG9uc2UgPT4ge1xuICAgICAgICAgICAgcmVzcG9uc2UuZm9yRWFjaCggY29taWMgPT4gdGhpcy5jcmVhdGVDb21pY1ZpZXcoY29taWMpIClcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodGhpcy5mZXRjaGluZyA9IGZhbHNlIClcbiAgICAgICAgfSApXG4gICAgfSxcblxuICAgIG1hbmFnZUNvbWljKCB0eXBlLCBjb21pYyApIHtcbiAgICAgICAgdGhpcy52aWV3cy5Db21pY01hbmFnZSBcbiAgICAgICAgICAgID8gdGhpcy52aWV3cy5Db21pY01hbmFnZS5vbk5hdmlnYXRpb24oIHR5cGUsIGNvbWljIClcbiAgICAgICAgICAgIDogdGhpcy52aWV3cy5Db21pY01hbmFnZSA9XG4gICAgICAgICAgICAgICAgdGhpcy5mYWN0b3J5LmNyZWF0ZSggJ0NvbWljTWFuYWdlJywgeyB0eXBlOiB7IHZhbHVlOiB0eXBlLCB3cml0YWJsZTogdHJ1ZSB9LCBtb2RlbDogeyB2YWx1ZTogeyBkYXRhOiBjb21pYyB8fCB7fSB9IH0sIGluc2VydGlvbjogeyB2YWx1ZTogeyBlbDogdGhpcy5lbHMuY29udGFpbmVyLCBtZXRob2Q6ICdpbnNlcnRCZWZvcmUnIH0gfSB9IClcbiAgICAgICAgICAgICAgICAub24oICdhZGRlZCcsIGNvbWljID0+IHsgdGhpcy5jcmVhdGVDb21pY1ZpZXcoY29taWMsIHsgaW5zZXJ0aW9uOiB7IHZhbHVlOiB7IGVsOiB0aGlzLmVscy5saXN0LmZpcnN0Q2hpbGQsIG1ldGhvZDogJ2luc2VydEJlZm9yZScgfSB9IH0gKTsgdGhpcy5lbWl0KCAnbmF2aWdhdGUnLCBgL2FkbWluL2NvbWljYCApOyB9IClcbiAgICAgICAgICAgICAgICAub24oICdjYW5jZWxsZWQnLCAoKSA9PiB0aGlzLmVtaXQoICduYXZpZ2F0ZScsIGAvYWRtaW4vY29taWNgICkgKVxuICAgICAgICAgICAgICAgIC5vbiggJ2VkaXRlZCcsIGNvbWljID0+IHsgdGhpcy52aWV3c1sgY29taWMuX2lkIF0udXBkYXRlKCBjb21pYyApOyB0aGlzLmVtaXQoICduYXZpZ2F0ZScsIGAvYWRtaW4vY29taWNgICk7IH0gKVxuICAgIH0sXG5cbiAgICBvbkFkZEJ0bkNsaWNrKCkgeyB0aGlzLmVtaXQoICduYXZpZ2F0ZScsIGAvYWRtaW4vY29taWMvYWRkYCApIH0sXG5cbiAgICBvbk5hdmlnYXRpb24oIHBhdGggKSB7XG4gICAgICAgIHRoaXMucGF0aCA9IHBhdGg7XG5cbiAgICAgICAgKCBwYXRoLmxlbmd0aCA9PT0gMiAmJiB0aGlzLmVscy5jb250YWluZXIuY2xhc3NMaXN0LmNvbnRhaW5zKCdoaWRlJykgKSBcbiAgICAgICAgICAgID8gdGhpcy52aWV3cy5Db21pY01hbmFnZSAmJiAhdGhpcy52aWV3cy5Db21pY01hbmFnZS5lbHMuY29udGFpbmVyLmNsYXNzTGlzdC5jb250YWlucygnaGlkZScpXG4gICAgICAgICAgICAgICAgPyB0aGlzLnZpZXdzLkNvbWljTWFuYWdlLmhpZGUoKS50aGVuKCAoKSA9PiB0aGlzLnNob3coKSApXG4gICAgICAgICAgICAgICAgOiB0aGlzLnNob3coKVxuICAgICAgICAgICAgOiBwYXRoLmxlbmd0aCA9PT0gM1xuICAgICAgICAgICAgICAgID8gdGhpcy5oaWRlKCkudGhlbiggKCkgPT4gdGhpcy5tYW5hZ2VDb21pYyggcGF0aFsyXSwgeyB9ICkgKVxuICAgICAgICAgICAgICAgIDogcGF0aC5sZW5ndGggPT09IDRcbiAgICAgICAgICAgICAgICAgICAgID8gdGhpcy5oaWRlKCkudGhlbiggKCkgPT4gdGhpcy5tYW5hZ2VDb21pYyggcGF0aFsyXSwgdGhpcy52aWV3c1sgcGF0aFszXSBdLm1vZGVsLmRhdGEgKSApXG4gICAgICAgICAgICAgICAgICAgICA6IHVuZGVmaW5lZFxuICAgIH0sXG5cbiAgICBvblNjcm9sbCggZSApIHtcbiAgICAgICAgaWYoIHRoaXMuZmV0Y2hpbmcgfHwgdGhpcy5pc0hpZGRlbigpICkgcmV0dXJuXG4gICAgICAgIGlmKCAoIHRoaXMuY29udGVudC5vZmZzZXRIZWlnaHQgLSAoIHdpbmRvdy5zY3JvbGxZICsgd2luZG93LmlubmVySGVpZ2h0ICkgKSA8IDEwMCApIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoIHRoaXMuZmV0Y2hBbmREaXNwbGF5LmJpbmQodGhpcykuY2F0Y2goIHRoaXMuRXJyb3IgKSApXG4gICAgfSxcblxuICAgIHBvc3RSZW5kZXIoKSB7XG4gICAgICAgIHRoaXMuY29udGVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNjb250ZW50JylcblxuICAgICAgICBpZiggdGhpcy5wYXRoLmxlbmd0aCA+IDIgKSB7XG4gICAgICAgICAgICB0aGlzLmVscy5jb250YWluZXIuY2xhc3NMaXN0LmFkZCggJ2hpZGRlbicsICdoaWRlJyApXG4gICAgICAgICAgICBpZiggdGhpcy5wYXRoWzJdID09PSBcImFkZFwiICkgeyB0aGlzLm1hbmFnZUNvbWljKCBcImFkZFwiLCB7IH0gKSB9XG4gICAgICAgICAgICBlbHNlIGlmKCB0aGlzLnBhdGhbMl0gPT09IFwiZWRpdFwiICYmIHRoaXMucGF0aFszXSApIHtcbiAgICAgICAgICAgICAgICB0aGlzLlhociggeyBtZXRob2Q6IFwiZ2V0XCIsIHJlc291cmNlOiBgY29taWMvJHt0aGlzLnBhdGhbM119YCB9IClcbiAgICAgICAgICAgICAgICAudGhlbiggcmVzcG9uc2UgPT4gdGhpcy5tYW5hZ2VDb21pYyggXCJlZGl0XCIsIHJlc3BvbnNlICkgKVxuICAgICAgICAgICAgICAgIC5jYXRjaCggZSA9PiB7IHRoaXMuRXJyb3IoZSk7IHRoaXMuZW1pdCggJ25hdmlnYXRlJywgYC9hZG1pbi9jb21pY2AgKSB9IClcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmKCB0aGlzLnBhdGgubGVuZ3RoID09PSAxICYmIHRoaXMudmlld3MuQ29taWNNYW5hZ2UgKSB7XG4gICAgICAgICAgICB0aGlzLnZpZXdzLkNvbWljTWFuYWdlLmhpZGUoKVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jb21pY3MgPSBPYmplY3QuY3JlYXRlKCB0aGlzLk1vZGVsLCB7IHBhZ2luYXRpb246IHsgdmFsdWU6IHsgc2tpcDogMCwgbGltaXQ6MTAsIHNvcnQ6IHsgY3JlYXRlZDogLTEgfSB9IH0sIHJlc291cmNlOiB7IHZhbHVlOiAnY29taWMnIH0gfSApXG4gICAgICAgIFxuICAgICAgICB0aGlzLmZldGNoQW5kRGlzcGxheSgpLmNhdGNoKCB0aGlzLkVycm9yIClcblxuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lciggJ3Njcm9sbCcsIGUgPT4gdGhpcy5vblNjcm9sbChlKSApXG5cbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICB9LFxuXG4gICAgcmVxdWlyZXNMb2dpbjogdHJ1ZVxufSApXG4iLCJtb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5hc3NpZ24oIHt9LCByZXF1aXJlKCcuL19fcHJvdG9fXycpLCB7XG5cbiAgICBldmVudHM6IHtcbiAgICAgICAgbG9nbzogJ2NsaWNrJ1xuICAgIH0sXG5cbiAgICBvblVzZXIoKSB7XG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgfSxcblxuICAgIG9uTG9nb0NsaWNrKCkge1xuICAgICAgICB0aGlzLnNpZ25vdXQoKVxuICAgIH0sXG5cbiAgICByZXF1aXJlc0xvZ2luOiBmYWxzZSxcbiAgICBcbiAgICBzaWdub3V0KCkge1xuXG4gICAgICAgIGRvY3VtZW50LmNvb2tpZSA9IGAke3dpbmRvdy5jb29raWVOYW1lfT07IGV4cGlyZXM9VGh1LCAwMSBKYW4gMTk3MCAwMDowMDowMSBHTVQ7YDtcblxuICAgICAgICB0aGlzLnVzZXIuZGF0YSA9IHsgfVxuXG4gICAgICAgIHRoaXMuZW1pdCggJ3NpZ25vdXQnIClcblxuICAgIH1cblxufSApXG4iLCJtb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5hc3NpZ24oIHt9LCByZXF1aXJlKCcuL19fcHJvdG9fXycpLCB7XG5cbiAgICBmZXRjaEFuZERpc3BsYXkoKSB7XG4gICAgICAgIHRoaXMuZmV0Y2hpbmcgPSB0cnVlXG4gICAgICAgIHJldHVybiB0aGlzLmdldERhdGEoKVxuICAgICAgICAudGhlbiggcmVzcG9uc2UgPT4ge1xuICAgICAgICAgICAgcmVzcG9uc2UuZm9yRWFjaCggY29taWMgPT5cbiAgICAgICAgICAgICAgICB0aGlzLnZpZXdzWyBjb21pYy5faWQgXSA9XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZmFjdG9yeS5jcmVhdGUoICdjb21pYycsIHsgaW5zZXJ0aW9uOiB7IHZhbHVlOiB7IGVsOiB0aGlzLmVscy5jb250YWluZXIgfSB9LCBtb2RlbDogeyB2YWx1ZTogeyBkYXRhOiBjb21pYyB9IH0sIHRlbXBsYXRlT3B0czogeyB2YWx1ZTogeyByZWFkT25seTogdHJ1ZSB9IH0gfSApXG4gICAgICAgICAgICApXG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRoaXMuZmV0Y2hpbmcgPSBmYWxzZSApXG4gICAgICAgIH0gKVxuICAgIH0sXG5cbiAgICBnZXREYXRhKCkge1xuICAgICAgICBpZiggIXRoaXMubW9kZWwgKSB0aGlzLm1vZGVsID0gT2JqZWN0LmNyZWF0ZSggdGhpcy5Nb2RlbCwgeyBwYWdpbmF0aW9uOiB7IHZhbHVlOiB7IHNraXA6IDAsIGxpbWl0OjEwLCBzb3J0OiB7IGNyZWF0ZWQ6IC0xIH0gfSB9LCByZXNvdXJjZTogeyB2YWx1ZTogJ2NvbWljJyB9IH0gKVxuXG4gICAgICAgIHJldHVybiB0aGlzLm1vZGVsLmdldCgpXG4gICAgfSxcblxuICAgIG5hdmlnYXRlKCkge1xuICAgICAgICB0aGlzLnNob3coKVxuICAgIH0sXG5cbiAgICBvblNjcm9sbCggZSApIHtcbiAgICAgICAgaWYoIHRoaXMuZmV0Y2hpbmcgKSByZXR1cm5cbiAgICAgICAgaWYoICggdGhpcy5jb250ZW50Lm9mZnNldEhlaWdodCAtICggd2luZG93LnNjcm9sbFkgKyB3aW5kb3cuaW5uZXJIZWlnaHQgKSApIDwgMTAwICkgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSggdGhpcy5mZXRjaEFuZERpc3BsYXkuYmluZCh0aGlzKSApXG4gICAgfSxcblxuICAgIHBvc3RSZW5kZXIoKSB7XG4gICAgICAgIHRoaXMuY29udGVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNjb250ZW50JylcbiAgICAgICAgXG4gICAgICAgIHRoaXMuZmV0Y2hBbmREaXNwbGF5KCkuY2F0Y2goIHRoaXMuRXJyb3IgKVxuXG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCAnc2Nyb2xsJywgZSA9PiB0aGlzLm9uU2Nyb2xsKGUpIClcblxuICAgICAgICByZXR1cm4gdGhpc1xuICAgIH1cblxufSApXG4iLCJtb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5hc3NpZ24oIHt9LCByZXF1aXJlKCcuL19fcHJvdG9fXycpLCB7XG4gICAgXG4gICAgZXZlbnRzOiB7XG4gICAgICAgIHN1Ym1pdDogJ2NsaWNrJ1xuICAgIH0sXG5cbiAgICBvblN1Ym1pdENsaWNrKCkge1xuICAgICAgICB0aGlzLlhociggeyBtZXRob2Q6ICdwb3N0JywgcmVzb3VyY2U6ICdhdXRoJywgZGF0YTogSlNPTi5zdHJpbmdpZnkoIHsgdXNlcm5hbWU6IHRoaXMuZWxzLnVzZXJuYW1lLnZhbHVlLCBwYXNzd29yZDogdGhpcy5lbHMucGFzc3dvcmQudmFsdWUgfSApIH0gKVxuICAgICAgICAudGhlbiggKCkgPT4gdGhpcy51c2VyLmdldCgpIClcbiAgICAgICAgLnRoZW4oICgpID0+IHRoaXMuaGlkZSgpIClcbiAgICAgICAgLnRoZW4oICgpID0+IFByb21pc2UucmVzb2x2ZSggdGhpcy5lbWl0KCAnbG9nZ2VkSW4nICkpIClcbiAgICAgICAgLmNhdGNoKCB0aGlzLkVycm9yIClcbiAgICB9XG59IClcbiIsIm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmFzc2lnbigge30sIHJlcXVpcmUoJy4vX19wcm90b19fJyksIHtcblxuICAgIGV2ZW50czoge1xuICAgICAgICBjYW5jZWw6ICdjbGljaycsXG4gICAgICAgIGNvbmZpcm06ICdjbGljaycsXG4gICAgICAgIGRlbGV0ZTogJ2NsaWNrJyxcbiAgICAgICAgZWRpdDogJ2NsaWNrJ1xuICAgIH0sXG5cbiAgICBvbkNhbmNlbENsaWNrKCkge1xuICAgICAgICB0aGlzLmVscy51c2VybmFtZS5jbGFzc0xpc3QucmVtb3ZlKCdoaWRkZW4nKVxuICAgICAgICB0aGlzLmVscy5jb25maXJtRGlhbG9nLmNsYXNzTGlzdC5hZGQoJ2hpZGRlbicpXG4gICAgfSxcblxuICAgIG9uQ29uZmlybUNsaWNrKCkge1xuICAgICAgICB0aGlzLmVtaXQoJ2RlbGV0ZScpXG4gICAgfSxcblxuICAgIG9uRGVsZXRlQ2xpY2soKSB7XG4gICAgICAgIGlmKCB0aGlzLnVzZXIgJiYgdGhpcy51c2VyLmRhdGEuX2lkICkge1xuICAgICAgICAgICAgdGhpcy5lbHMudXNlcm5hbWUuY2xhc3NMaXN0LmFkZCgnaGlkZGVuJylcbiAgICAgICAgICAgIHRoaXMuZWxzLmNvbmZpcm1EaWFsb2cuY2xhc3NMaXN0LnJlbW92ZSgnaGlkZGVuJylcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBvbkVkaXRDbGljaygpIHtcbiAgICAgICAgaWYoIHRoaXMudXNlciAmJiB0aGlzLnVzZXIuZGF0YS5faWQgKSB0aGlzLmVtaXQoJ2VkaXQnKVxuICAgIH0sXG5cbiAgICB1cGRhdGUodXNlcikge1xuICAgICAgICB0aGlzLnVzZXIuZGF0YSA9IHVzZXJcbiAgICAgICAgdGhpcy5lbHMudXNlcm5hbWUudGV4dENvbnRlbnQgPSB1c2VyLnVzZXJuYW1lXG4gICAgfVxuXG59IClcbiIsIm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmFzc2lnbigge30sIHJlcXVpcmUoJy4vX19wcm90b19fJyksIHtcblxuICAgIGV2ZW50czoge1xuICAgICAgICBjYW5jZWw6ICdjbGljaycsXG4gICAgICAgIHN1Ym1pdDogJ2NsaWNrJ1xuICAgIH0sXG5cbiAgICBvbkNhbmNlbENsaWNrKCkgeyB0aGlzLmhpZGUoKS50aGVuKCAoKSA9PiB0aGlzLmVtaXQoJ2NhbmNlbGxlZCcpICkgfSxcbiAgICBcbiAgICBvblN1Ym1pdENsaWNrKCkge1xuICAgICAgICB0aGlzWyBgcmVxdWVzdCR7dGhpcy5jYXBpdGFsaXplRmlyc3RMZXR0ZXIoIHRoaXMudHlwZSApfWAgXSgpXG4gICAgICAgIC5jYXRjaCggdGhpcy5FcnJvciApXG4gICAgfSxcblxuICAgIG9uTmF2aWdhdGlvbiggdHlwZSwgY29taWMgKSB7XG4gICAgICAgIHRoaXMudHlwZSA9IHR5cGVcbiAgICAgICAgdGhpcy5tb2RlbC5kYXRhID0gY29taWNcbiAgICAgICBcbiAgICAgICAgdGhpcy5wb3B1bGF0ZSgpIFxuICAgICAgICBcbiAgICAgICAgaWYoIHRoaXMuZWxzLmNvbnRhaW5lci5jbGFzc0xpc3QuY29udGFpbnMoJ2hpZGUnKSApIHRoaXMuc2hvdygpXG4gICAgfSxcblxuICAgIHBvcHVsYXRlKCkge1xuICAgICAgICB0aGlzLmVscy50aXRsZS50ZXh0Q29udGVudCA9IGAke3RoaXMuY2FwaXRhbGl6ZUZpcnN0TGV0dGVyKCB0aGlzLnR5cGUgKX0gVXNlcmBcblxuICAgICAgICB0aGlzLmVscy51c2VybmFtZS52YWx1ZSA9IE9iamVjdC5rZXlzKCB0aGlzLm1vZGVsLmRhdGEgKS5sZW5ndGggPyB0aGlzLm1vZGVsLmRhdGEudXNlcm5hbWUgOiAnJ1xuICAgICAgICB0aGlzLmVscy5wYXNzd29yZC52YWx1ZSA9ICcnXG4gICAgfSxcblxuICAgIHBvc3RSZW5kZXIoKSB7XG4gICAgICAgIHRoaXMucG9wdWxhdGUoKSBcbiAgICAgICAgICAgIFxuICAgICAgICByZXR1cm4gdGhpc1xuICAgIH0sXG5cbiAgICByZXF1ZXN0QWRkKCkge1xuICAgICAgICBpZiggdGhpcy5lbHMucGFzc3dvcmQudmFsdWUubGVuZ3RoID09PSAwICkgcmV0dXJuXG4gICAgICAgIHJldHVybiB0aGlzLlhociggeyBtZXRob2Q6ICdQT1NUJywgcmVzb3VyY2U6ICd1c2VyJywgZGF0YTogSlNPTi5zdHJpbmdpZnkoIHsgdXNlcm5hbWU6IHRoaXMuZWxzLnVzZXJuYW1lLnZhbHVlLCBwYXNzd29yZDogdGhpcy5lbHMucGFzc3dvcmQudmFsdWUgfSApIH0gKVxuICAgICAgICAudGhlbiggcmVzcG9uc2UgPT4gdGhpcy5oaWRlKCkudGhlbiggKCkgPT4gdGhpcy5lbWl0KCAnYWRkZWQnLCB7IF9pZDogcmVzcG9uc2UuX2lkLCB1c2VybmFtZTogcmVzcG9uc2UudXNlcm5hbWUgfSApICkgKVxuICAgIH0sXG5cbiAgICByZXF1ZXN0RWRpdCgpIHtcbiAgICAgICAgbGV0IGRhdGEgPSB7IHVzZXJuYW1lOiB0aGlzLmVscy51c2VybmFtZS52YWx1ZSB9XG5cbiAgICAgICAgaWYoIHRoaXMuZWxzLnBhc3N3b3JkLnZhbHVlLmxlbmd0aCApIGRhdGEucGFzc3dvcmQgPSB0aGlzLmVscy5wYXNzd29yZC52YWx1ZVxuICAgICAgICByZXR1cm4gdGhpcy5YaHIoIHsgbWV0aG9kOiAnUEFUQ0gnLCByZXNvdXJjZTogYHVzZXIvJHt0aGlzLnVzZXIuZGF0YS5faWR9YCwgZGF0YTogSlNPTi5zdHJpbmdpZnkoIGRhdGEgKSB9IClcbiAgICAgICAgLnRoZW4oIHJlc3BvbnNlID0+IHRoaXMuaGlkZSgpLnRoZW4oICgpID0+IHRoaXMuZW1pdCggJ2VkaXRlZCcsIHsgX2lkOiByZXNwb25zZS5faWQsIHVzZXJuYW1lOiByZXNwb25zZS51c2VybmFtZSB9ICkgKSApXG4gICAgfVxufSApXG4iLCJtb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5hc3NpZ24oIHt9LCByZXF1aXJlKCcuL19fcHJvdG9fXycpLCB7XG5cbiAgICBjcmVhdGVVc2VyVmlldyggdXNlciApIHtcbiAgICAgICAgdGhpcy52aWV3c1sgdXNlci5faWQgXSA9IHRoaXMuZmFjdG9yeS5jcmVhdGUoXG4gICAgICAgICAgICAnVXNlcicsXG4gICAgICAgICAgICB7IGluc2VydGlvbjogeyB2YWx1ZTogeyBlbDogdGhpcy5lbHMubGlzdCB9IH0sXG4gICAgICAgICAgICAgIG1vZGVsOiB7IHZhbHVlOiB7IGRhdGE6IHVzZXIgfSB9XG4gICAgICAgICAgICB9XG4gICAgICAgIClcblxuICAgICAgICB0aGlzLnZpZXdzWyB1c2VyLl9pZCBdXG4gICAgICAgIC5vbiggJ2VkaXQnLCAoKSA9PiB0aGlzLmVtaXQoICduYXZpZ2F0ZScsIGAvYWRtaW4vdXNlci9lZGl0LyR7dXNlci5faWR9YCkgKVxuICAgICAgICAub24oICdkZWxldGUnLCAoKSA9PlxuICAgICAgICAgICAgdGhpcy5YaHIoIHsgbWV0aG9kOiAnZGVsZXRlJywgcmVzb3VyY2U6IGB1c2VyLyR7dXNlci5faWR9YCB9IClcbiAgICAgICAgICAgIC50aGVuKCAoKSA9PiB0aGlzLnZpZXdzWyB1c2VyLl9pZCBdLmRlbGV0ZSgpIClcbiAgICAgICAgICAgIC5jYXRjaCggdGhpcy5FcnJvciApXG4gICAgICAgIClcbiAgICB9LFxuXG4gICAgZGVsZXRlKCkge1xuICAgICAgICByZXR1cm4gKCAoIHRoaXMudmlld3MuVXNlck1hbmFnZSApXG4gICAgICAgICAgICA/IHRoaXMudmlld3MuVXNlck1hbmFnZS5kZWxldGUoKVxuICAgICAgICAgICAgOiBQcm9taXNlLnJlc29sdmUoKSApXG4gICAgICAgIC50aGVuKCAoKSA9PiByZXF1aXJlKCcuL19fcHJvdG9fXycpLmRlbGV0ZS5jYWxsKHRoaXMpIClcbiAgICB9LFxuXG4gICAgZXZlbnRzOiB7XG4gICAgICAgIGFkZEJ0bjogJ2NsaWNrJ1xuICAgIH0sXG5cbiAgICBtYW5hZ2VVc2VyKCB0eXBlLCB1c2VyICkge1xuICAgICAgICB0aGlzLnZpZXdzLlVzZXJNYW5hZ2UgXG4gICAgICAgICAgICA/IHRoaXMudmlld3MuVXNlck1hbmFnZS5vbk5hdmlnYXRpb24oIHR5cGUsIHVzZXIgKVxuICAgICAgICAgICAgOiB0aGlzLnZpZXdzLlVzZXJNYW5hZ2UgPVxuICAgICAgICAgICAgICAgIHRoaXMuZmFjdG9yeS5jcmVhdGUoICdVc2VyTWFuYWdlJywgeyB0eXBlOiB7IHZhbHVlOiB0eXBlLCB3cml0YWJsZTogdHJ1ZSB9LCBtb2RlbDogeyB2YWx1ZTogeyBkYXRhOiB1c2VyIHx8IHt9IH0gfSwgaW5zZXJ0aW9uOiB7IHZhbHVlOiB7IGVsOiB0aGlzLmVscy5jb250YWluZXIsIG1ldGhvZDogJ2luc2VydEJlZm9yZScgfSB9IH0gKVxuICAgICAgICAgICAgICAgICAgICAub24oICdhZGRlZCcsIHVzZXIgPT4geyB0aGlzLmNyZWF0ZVVzZXJWaWV3KHVzZXIpOyB0aGlzLmVtaXQoICduYXZpZ2F0ZScsIGAvYWRtaW4vdXNlcmAgKTsgfSApXG4gICAgICAgICAgICAgICAgICAgIC5vbiggJ2VkaXRlZCcsIHVzZXIgPT4geyB0aGlzLnZpZXdzWyB1c2VyLl9pZCBdLnVwZGF0ZSggdXNlciApOyB0aGlzLmVtaXQoICduYXZpZ2F0ZScsIGAvYWRtaW4vdXNlcmAgKTsgfSApXG4gICAgICAgICAgICAgICAgICAgIC5vbiggJ2NhbmNlbGxlZCcsICgpID0+IHRoaXMuZW1pdCggJ25hdmlnYXRlJywgYC9hZG1pbi91c2VyYCApIClcbiAgICB9LFxuXG4gICAgb25BZGRCdG5DbGljaygpIHsgdGhpcy5lbWl0KCAnbmF2aWdhdGUnLCBgL2FkbWluL3VzZXIvYWRkYCApIH0sXG5cbiAgICBvbk5hdmlnYXRpb24oIHBhdGggKSB7XG4gICAgICAgIHRoaXMucGF0aCA9IHBhdGg7XG5cbiAgICAgICAgKCBwYXRoLmxlbmd0aCA9PT0gMiAmJiB0aGlzLmVscy5jb250YWluZXIuY2xhc3NMaXN0LmNvbnRhaW5zKCdoaWRlJykgKSBcbiAgICAgICAgICAgID8gdGhpcy52aWV3cy5Vc2VyTWFuYWdlICYmICF0aGlzLnZpZXdzLlVzZXJNYW5hZ2UuZWxzLmNvbnRhaW5lci5jbGFzc0xpc3QuY29udGFpbnMoJ2hpZGUnKVxuICAgICAgICAgICAgICAgID8gdGhpcy52aWV3cy5Vc2VyTWFuYWdlLmhpZGUoKS50aGVuKCAoKSA9PiB0aGlzLnNob3coKSApXG4gICAgICAgICAgICAgICAgOiB0aGlzLnNob3coKVxuICAgICAgICAgICAgOiBwYXRoLmxlbmd0aCA9PT0gM1xuICAgICAgICAgICAgICAgID8gdGhpcy5oaWRlKCkudGhlbiggKCkgPT4gdGhpcy5tYW5hZ2VVc2VyKCBwYXRoWzJdLCB7IH0gKSApXG4gICAgICAgICAgICAgICAgOiBwYXRoLmxlbmd0aCA9PT0gNFxuICAgICAgICAgICAgICAgICAgICAgPyB0aGlzLmhpZGUoKS50aGVuKCAoKSA9PiB0aGlzLm1hbmFnZVVzZXIoIHBhdGhbMl0sIHRoaXMudmlld3NbIHBhdGhbM10gXS5tb2RlbC5kYXRhICkgKVxuICAgICAgICAgICAgICAgICAgICAgOiB1bmRlZmluZWRcbiAgICB9LFxuXG4gICAgcG9zdFJlbmRlcigpIHtcblxuICAgICAgICBpZiggdGhpcy5wYXRoLmxlbmd0aCA+IDIgKSB7XG4gICAgICAgICAgICB0aGlzLmVscy5jb250YWluZXIuY2xhc3NMaXN0LmFkZCggJ2hpZGRlbicsICdoaWRlJyApXG4gICAgICAgICAgICBpZiggdGhpcy5wYXRoWzJdID09PSBcImFkZFwiICkgeyB0aGlzLm1hbmFnZVVzZXIoIFwiYWRkXCIsIHsgfSApIH1cbiAgICAgICAgICAgIGVsc2UgaWYoIHRoaXMucGF0aFsyXSA9PT0gXCJlZGl0XCIgJiYgdGhpcy5wYXRoWzNdICkge1xuICAgICAgICAgICAgICAgIHRoaXMuWGhyKCB7IG1ldGhvZDogXCJnZXRcIiwgcmVzb3VyY2U6IGB1c2VyLyR7dGhpcy5wYXRoWzNdfWAgfSApXG4gICAgICAgICAgICAgICAgLnRoZW4oIHJlc3BvbnNlID0+IHRoaXMubWFuYWdlVXNlciggXCJlZGl0XCIsIHJlc3BvbnNlICkgKVxuICAgICAgICAgICAgICAgIC5jYXRjaCggZSA9PiB7IHRoaXMuRXJyb3IoZSk7IHRoaXMuZW1pdCggJ25hdmlnYXRlJywgYC9hZG1pbi91c2VyYCApIH0gKVxuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYoIHRoaXMucGF0aC5sZW5ndGggPT09IDEgJiYgdGhpcy52aWV3cy5Vc2VyTWFuYWdlICkge1xuICAgICAgICAgICAgdGhpcy52aWV3cy5Vc2VyTWFuYWdlLmhpZGUoKVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy51c2VycyA9IE9iamVjdC5jcmVhdGUoIHRoaXMuTW9kZWwsIHsgcmVzb3VyY2U6IHsgdmFsdWU6ICd1c2VyJyB9IH0gKVxuXG4gICAgICAgIHRoaXMudXNlcnMuZ2V0KClcbiAgICAgICAgLnRoZW4oICgpID0+IFByb21pc2UucmVzb2x2ZSggdGhpcy51c2Vycy5kYXRhLmZvckVhY2goIHVzZXIgPT4gdGhpcy5jcmVhdGVVc2VyVmlldyggdXNlciApICkgKSApXG4gICAgICAgIC5jYXRjaCggdGhpcy5FcnJvciApXG5cbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICB9LFxuXG4gICAgcmVxdWlyZXNMb2dpbjogdHJ1ZVxufSApXG4iLCJtb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5hc3NpZ24oIHsgfSwgcmVxdWlyZSgnLi4vLi4vLi4vbGliL015T2JqZWN0JyksIHJlcXVpcmUoJ2V2ZW50cycpLkV2ZW50RW1pdHRlci5wcm90b3R5cGUsIHtcblxuICAgIE1vZGVsOiByZXF1aXJlKCcuLi9tb2RlbHMvX19wcm90b19fLmpzJyksXG5cbiAgICBPcHRpbWl6ZWRSZXNpemU6IHJlcXVpcmUoJy4vbGliL09wdGltaXplZFJlc2l6ZScpLFxuICAgIFxuICAgIFNwaW5uZXI6IHJlcXVpcmUoJy4vbGliL1NwaW4nKSxcbiAgICBcbiAgICBYaHI6IHJlcXVpcmUoJy4uL1hocicpLFxuXG4gICAgYmluZEV2ZW50KCBrZXksIGV2ZW50ICkge1xuICAgICAgICB2YXIgZWxzID0gQXJyYXkuaXNBcnJheSggdGhpcy5lbHNbIGtleSBdICkgPyB0aGlzLmVsc1sga2V5IF0gOiBbIHRoaXMuZWxzWyBrZXkgXSBdXG4gICAgICAgIGVscy5mb3JFYWNoKCBlbCA9PiBlbC5hZGRFdmVudExpc3RlbmVyKCBldmVudCB8fCAnY2xpY2snLCBlID0+IHRoaXNbIGBvbiR7dGhpcy5jYXBpdGFsaXplRmlyc3RMZXR0ZXIoa2V5KX0ke3RoaXMuY2FwaXRhbGl6ZUZpcnN0TGV0dGVyKGV2ZW50KX1gIF0oIGUgKSApIClcbiAgICB9LFxuXG4gICAgY2FwaXRhbGl6ZUZpcnN0TGV0dGVyOiBzdHJpbmcgPT4gc3RyaW5nLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgc3RyaW5nLnNsaWNlKDEpLFxuXG4gICAgY29uc3RydWN0b3IoKSB7XG5cbiAgICAgICAgaWYoIHRoaXMuc2l6ZSApIHRoaXMuT3B0aW1pemVkUmVzaXplLmFkZCggdGhpcy5zaXplICk7XG5cbiAgICAgICAgaWYoIHRoaXMucmVxdWlyZXNMb2dpbiAmJiAoIXRoaXMudXNlci5kYXRhIHx8ICF0aGlzLnVzZXIuZGF0YS5faWQgKSApIHJldHVybiB0aGlzLmhhbmRsZUxvZ2luKClcblxuICAgICAgICBpZiggdGhpcy51c2VyLmRhdGEgJiYgdGhpcy51c2VyLmRhdGEuaWQgJiYgdGhpcy5yZXF1aXJlc1JvbGUgJiYgIXRoaXMuaGFzUHJpdmlsZWdlcygpICkgcmV0dXJuIHRoaXMuc2hvd05vQWNjZXNzKClcbiAgICAgICAgXG4gICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKCB0aGlzLCB7IGVsczogeyB9LCBzbHVycDogeyBhdHRyOiAnZGF0YS1qcycsIHZpZXc6ICdkYXRhLXZpZXcnIH0sIHZpZXdzOiB7IH0gfSApLnJlbmRlcigpXG4gICAgfSxcblxuICAgIGRlbGVnYXRlRXZlbnRzKCBrZXksIGVsICkge1xuICAgICAgICB2YXIgdHlwZSA9IHR5cGVvZiB0aGlzLmV2ZW50c1trZXldXG5cbiAgICAgICAgaWYoIHR5cGUgPT09IFwic3RyaW5nXCIgKSB7IHRoaXMuYmluZEV2ZW50KCBrZXksIHRoaXMuZXZlbnRzW2tleV0gKSB9XG4gICAgICAgIGVsc2UgaWYoIEFycmF5LmlzQXJyYXkoIHRoaXMuZXZlbnRzW2tleV0gKSApIHtcbiAgICAgICAgICAgIHRoaXMuZXZlbnRzWyBrZXkgXS5mb3JFYWNoKCBldmVudE9iaiA9PiB0aGlzLmJpbmRFdmVudCgga2V5LCBldmVudE9iai5ldmVudCApIClcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuYmluZEV2ZW50KCBrZXksIHRoaXMuZXZlbnRzW2tleV0uZXZlbnQgKVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIGRlbGV0ZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaGlkZSgpXG4gICAgICAgIC50aGVuKCAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmVscy5jb250YWluZXIucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCggdGhpcy5lbHMuY29udGFpbmVyIClcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoIHRoaXMuZW1pdCgnZGVsZXRlZCcpIClcbiAgICAgICAgfSApXG4gICAgfSxcblxuICAgIGV2ZW50czoge30sXG5cbiAgICBnZXREYXRhKCkge1xuICAgICAgICBpZiggIXRoaXMubW9kZWwgKSB0aGlzLm1vZGVsID0gT2JqZWN0LmNyZWF0ZSggdGhpcy5Nb2RlbCwgeyByZXNvdXJjZTogeyB2YWx1ZTogdGhpcy5uYW1lIH0gfSApXG5cbiAgICAgICAgcmV0dXJuIHRoaXMubW9kZWwuZ2V0KClcbiAgICB9LFxuXG4gICAgZ2V0VGVtcGxhdGVPcHRpb25zKCkge1xuICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbihcbiAgICAgICAgICAgIHt9LFxuICAgICAgICAgICAgKHRoaXMubW9kZWwpID8gdGhpcy5tb2RlbC5kYXRhIDoge30gLFxuICAgICAgICAgICAgeyB1c2VyOiAodGhpcy51c2VyKSA/IHRoaXMudXNlci5kYXRhIDoge30gfSxcbiAgICAgICAgICAgIHsgb3B0czogKHRoaXMudGVtcGxhdGVPcHRzKSA/IHRoaXMudGVtcGxhdGVPcHRzIDoge30gfVxuICAgICAgICApXG4gICAgfSxcblxuICAgIGhhbmRsZUxvZ2luKCkge1xuICAgICAgICB0aGlzLmZhY3RvcnkuY3JlYXRlKCAnbG9naW4nLCB7IGluc2VydGlvbjogeyB2YWx1ZTogeyBlbDogZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2NvbnRlbnQnKSB9IH0gfSApXG4gICAgICAgICAgICAub25jZSggXCJsb2dnZWRJblwiLCAoKSA9PiB0aGlzLm9uTG9naW4oKSApXG5cbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICB9LFxuXG4gICAgaGFzUHJpdmlsZWdlKCkge1xuICAgICAgICAoIHRoaXMucmVxdWlyZXNSb2xlICYmICggdGhpcy51c2VyLmdldCgncm9sZXMnKS5maW5kKCByb2xlID0+IHJvbGUgPT09IHRoaXMucmVxdWlyZXNSb2xlICkgPT09IFwidW5kZWZpbmVkXCIgKSApID8gZmFsc2UgOiB0cnVlXG4gICAgfSxcblxuICAgIGhpZGUoKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSggcmVzb2x2ZSA9PiB7XG4gICAgICAgICAgICBpZiggIWRvY3VtZW50LmJvZHkuY29udGFpbnModGhpcy5lbHMuY29udGFpbmVyKSB8fCB0aGlzLmlzSGlkZGVuKCkgKSByZXR1cm4gcmVzb2x2ZSgpXG4gICAgICAgICAgICB0aGlzLm9uSGlkZGVuUHJveHkgPSBlID0+IHRoaXMub25IaWRkZW4ocmVzb2x2ZSlcbiAgICAgICAgICAgIHRoaXMuZWxzLmNvbnRhaW5lci5hZGRFdmVudExpc3RlbmVyKCAndHJhbnNpdGlvbmVuZCcsIHRoaXMub25IaWRkZW5Qcm94eSApXG4gICAgICAgICAgICB0aGlzLmVscy5jb250YWluZXIuY2xhc3NMaXN0LmFkZCgnaGlkZScpXG4gICAgICAgIH0gKVxuICAgIH0sXG5cbiAgICBodG1sVG9GcmFnbWVudCggc3RyICkge1xuICAgICAgICBsZXQgcmFuZ2UgPSBkb2N1bWVudC5jcmVhdGVSYW5nZSgpO1xuICAgICAgICAvLyBtYWtlIHRoZSBwYXJlbnQgb2YgdGhlIGZpcnN0IGRpdiBpbiB0aGUgZG9jdW1lbnQgYmVjb21lcyB0aGUgY29udGV4dCBub2RlXG4gICAgICAgIHJhbmdlLnNlbGVjdE5vZGUoZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJkaXZcIikuaXRlbSgwKSlcbiAgICAgICAgcmV0dXJuIHJhbmdlLmNyZWF0ZUNvbnRleHR1YWxGcmFnbWVudCggc3RyIClcbiAgICB9LFxuICAgIFxuICAgIGlzSGlkZGVuKCkgeyByZXR1cm4gdGhpcy5lbHMuY29udGFpbmVyLmNsYXNzTGlzdC5jb250YWlucygnaGlkZGVuJykgfSxcblxuICAgIG9uSGlkZGVuKCByZXNvbHZlICkge1xuICAgICAgICB0aGlzLmVscy5jb250YWluZXIucmVtb3ZlRXZlbnRMaXN0ZW5lciggJ3RyYW5zaXRpb25lbmQnLCB0aGlzLm9uSGlkZGVuUHJveHkgKVxuICAgICAgICB0aGlzLmVscy5jb250YWluZXIuY2xhc3NMaXN0LmFkZCgnaGlkZGVuJylcbiAgICAgICAgcmVzb2x2ZSggdGhpcy5lbWl0KCdoaWRkZW4nKSApXG4gICAgfSxcblxuICAgIG9uTG9naW4oKSB7XG4gICAgICAgIE9iamVjdC5hc3NpZ24oIHRoaXMsIHsgZWxzOiB7IH0sIHNsdXJwOiB7IGF0dHI6ICdkYXRhLWpzJywgdmlldzogJ2RhdGEtdmlldycgfSwgdmlld3M6IHsgfSB9ICkucmVuZGVyKClcbiAgICB9LFxuXG4gICAgb25TaG93biggcmVzb2x2ZSApIHtcbiAgICAgICAgdGhpcy5lbHMuY29udGFpbmVyLnJlbW92ZUV2ZW50TGlzdGVuZXIoICd0cmFuc2l0aW9uZW5kJywgdGhpcy5vblNob3duUHJveHkgKVxuICAgICAgICBpZiggdGhpcy5zaXplICkgdGhpcy5zaXplKClcbiAgICAgICAgcmVzb2x2ZSggdGhpcy5lbWl0KCdzaG93bicpIClcbiAgICB9LFxuXG4gICAgc2hvd05vQWNjZXNzKCkge1xuICAgICAgICBhbGVydChcIk5vIHByaXZpbGVnZXMsIHNvblwiKVxuICAgICAgICByZXR1cm4gdGhpc1xuICAgIH0sXG5cbiAgICBwb3N0UmVuZGVyKCkgeyByZXR1cm4gdGhpcyB9LFxuXG4gICAgcmVuZGVyKCkge1xuICAgICAgICB0aGlzLnNsdXJwVGVtcGxhdGUoIHsgdGVtcGxhdGU6IHRoaXMudGVtcGxhdGUoIHRoaXMuZ2V0VGVtcGxhdGVPcHRpb25zKCkgKSwgaW5zZXJ0aW9uOiB0aGlzLmluc2VydGlvbiB9IClcblxuICAgICAgICBpZiggdGhpcy5zaXplICkgdGhpcy5zaXplKClcblxuICAgICAgICByZXR1cm4gdGhpcy5yZW5kZXJTdWJ2aWV3cygpXG4gICAgICAgICAgICAgICAgICAgLnBvc3RSZW5kZXIoKVxuICAgIH0sXG5cbiAgICByZW5kZXJTdWJ2aWV3cygpIHtcbiAgICAgICAgT2JqZWN0LmtleXMoIHRoaXMuVmlld3MgfHwgWyBdICkuZm9yRWFjaCgga2V5ID0+IHtcbiAgICAgICAgICAgIGlmKCB0aGlzLlZpZXdzWyBrZXkgXS5lbCApIHtcbiAgICAgICAgICAgICAgICBsZXQgb3B0cyA9IHRoaXMuVmlld3NbIGtleSBdLm9wdHNcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBvcHRzID0gKCBvcHRzIClcbiAgICAgICAgICAgICAgICAgICAgPyB0eXBlb2Ygb3B0cyA9PT0gXCJvYmplY3RcIlxuICAgICAgICAgICAgICAgICAgICAgICAgPyBvcHRzXG4gICAgICAgICAgICAgICAgICAgICAgICA6IG9wdHMoKVxuICAgICAgICAgICAgICAgICAgICA6IHt9XG5cbiAgICAgICAgICAgICAgICB0aGlzLnZpZXdzWyBrZXkgXSA9IHRoaXMuZmFjdG9yeS5jcmVhdGUoIGtleSwgT2JqZWN0LmFzc2lnbiggeyBpbnNlcnRpb246IHsgdmFsdWU6IHsgZWw6IHRoaXMuVmlld3NbIGtleSBdLmVsLCBtZXRob2Q6ICdpbnNlcnRCZWZvcmUnIH0gfSB9LCBvcHRzICkgKVxuICAgICAgICAgICAgICAgIHRoaXMuVmlld3NbIGtleSBdLmVsLnJlbW92ZSgpXG4gICAgICAgICAgICAgICAgdGhpcy5WaWV3c1sga2V5IF0uZWwgPSB1bmRlZmluZWRcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSApXG5cbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICB9LFxuXG4gICAgc2hvdyggZHVyYXRpb24gKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSggcmVzb2x2ZSA9PiB7XG4gICAgICAgICAgICB0aGlzLm9uU2hvd25Qcm94eSA9IGUgPT4gdGhpcy5vblNob3duKHJlc29sdmUpXG4gICAgICAgICAgICB0aGlzLmVscy5jb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lciggJ3RyYW5zaXRpb25lbmQnLCB0aGlzLm9uU2hvd25Qcm94eSApXG4gICAgICAgICAgICB0aGlzLmVscy5jb250YWluZXIuY2xhc3NMaXN0LnJlbW92ZSggJ2hpZGUnLCAnaGlkZGVuJyApXG4gICAgICAgIH0gKVxuICAgIH0sXG5cbiAgICBzbHVycEVsKCBlbCApIHtcbiAgICAgICAgdmFyIGtleSA9IGVsLmdldEF0dHJpYnV0ZSggdGhpcy5zbHVycC5hdHRyICkgfHwgJ2NvbnRhaW5lcidcblxuICAgICAgICBpZigga2V5ID09PSAnY29udGFpbmVyJyApIGVsLmNsYXNzTGlzdC5hZGQoIHRoaXMubmFtZSApXG5cbiAgICAgICAgdGhpcy5lbHNbIGtleSBdID0gQXJyYXkuaXNBcnJheSggdGhpcy5lbHNbIGtleSBdIClcbiAgICAgICAgICAgID8gdGhpcy5lbHNbIGtleSBdLnB1c2goIGVsIClcbiAgICAgICAgICAgIDogKCB0aGlzLmVsc1sga2V5IF0gIT09IHVuZGVmaW5lZCApXG4gICAgICAgICAgICAgICAgPyBbIHRoaXMuZWxzWyBrZXkgXSwgZWwgXVxuICAgICAgICAgICAgICAgIDogZWxcblxuICAgICAgICBlbC5yZW1vdmVBdHRyaWJ1dGUodGhpcy5zbHVycC5hdHRyKVxuXG4gICAgICAgIGlmKCB0aGlzLmV2ZW50c1sga2V5IF0gKSB0aGlzLmRlbGVnYXRlRXZlbnRzKCBrZXksIGVsIClcbiAgICB9LFxuXG4gICAgc2x1cnBUZW1wbGF0ZSggb3B0aW9ucyApIHtcbiAgICAgICAgdmFyIGZyYWdtZW50ID0gdGhpcy5odG1sVG9GcmFnbWVudCggb3B0aW9ucy50ZW1wbGF0ZSApLFxuICAgICAgICAgICAgc2VsZWN0b3IgPSBgWyR7dGhpcy5zbHVycC5hdHRyfV1gLFxuICAgICAgICAgICAgdmlld1NlbGVjdG9yID0gYFske3RoaXMuc2x1cnAudmlld31dYFxuXG4gICAgICAgIHRoaXMuc2x1cnBFbCggZnJhZ21lbnQucXVlcnlTZWxlY3RvcignKicpIClcbiAgICAgICAgZnJhZ21lbnQucXVlcnlTZWxlY3RvckFsbCggYCR7c2VsZWN0b3J9LCAke3ZpZXdTZWxlY3Rvcn1gICkuZm9yRWFjaCggZWwgPT5cbiAgICAgICAgICAgICggZWwuaGFzQXR0cmlidXRlKCB0aGlzLnNsdXJwLmF0dHIgKSApIFxuICAgICAgICAgICAgICAgID8gdGhpcy5zbHVycEVsKCBlbCApXG4gICAgICAgICAgICAgICAgOiB0aGlzLlZpZXdzWyBlbC5nZXRBdHRyaWJ1dGUodGhpcy5zbHVycC52aWV3KSBdLmVsID0gZWxcbiAgICAgICAgKVxuICAgICAgICAgIFxuICAgICAgICBvcHRpb25zLmluc2VydGlvbi5tZXRob2QgPT09ICdpbnNlcnRCZWZvcmUnXG4gICAgICAgICAgICA/IG9wdGlvbnMuaW5zZXJ0aW9uLmVsLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKCBmcmFnbWVudCwgb3B0aW9ucy5pbnNlcnRpb24uZWwgKVxuICAgICAgICAgICAgOiBvcHRpb25zLmluc2VydGlvbi5lbFsgb3B0aW9ucy5pbnNlcnRpb24ubWV0aG9kIHx8ICdhcHBlbmRDaGlsZCcgXSggZnJhZ21lbnQgKVxuXG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgfSxcblxuICAgIGlzTW91c2VPbkVsKCBldmVudCwgZWwgKSB7XG5cbiAgICAgICAgdmFyIGVsT2Zmc2V0ID0gZWwub2Zmc2V0KCksXG4gICAgICAgICAgICBlbEhlaWdodCA9IGVsLm91dGVySGVpZ2h0KCB0cnVlICksXG4gICAgICAgICAgICBlbFdpZHRoID0gZWwub3V0ZXJXaWR0aCggdHJ1ZSApXG5cbiAgICAgICAgaWYoICggZXZlbnQucGFnZVggPCBlbE9mZnNldC5sZWZ0ICkgfHxcbiAgICAgICAgICAgICggZXZlbnQucGFnZVggPiAoIGVsT2Zmc2V0LmxlZnQgKyBlbFdpZHRoICkgKSB8fFxuICAgICAgICAgICAgKCBldmVudC5wYWdlWSA8IGVsT2Zmc2V0LnRvcCApIHx8XG4gICAgICAgICAgICAoIGV2ZW50LnBhZ2VZID4gKCBlbE9mZnNldC50b3AgKyBlbEhlaWdodCApICkgKSB7XG5cbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0cnVlXG4gICAgfSxcblxuICAgIHJlcXVpcmVzTG9naW46IGZhbHNlLFxuXG4gICAgLy9fX3RvRG86IGh0bWwucmVwbGFjZSgvPlxccys8L2csJz48Jylcbn0gKVxuIiwibW9kdWxlLmV4cG9ydHMgPSBPYmplY3QuY3JlYXRlKCB7XG5cbiAgICBhZGQoY2FsbGJhY2spIHtcbiAgICAgICAgaWYoICF0aGlzLmNhbGxiYWNrcy5sZW5ndGggKSB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgdGhpcy5vblJlc2l6ZSlcbiAgICAgICAgdGhpcy5jYWxsYmFja3MucHVzaChjYWxsYmFjaylcbiAgICB9LFxuXG4gICAgb25SZXNpemUoKSB7XG4gICAgICAgaWYoIHRoaXMucnVubmluZyApIHJldHVyblxuXG4gICAgICAgIHRoaXMucnVubmluZyA9IHRydWVcbiAgICAgICAgXG4gICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWVcbiAgICAgICAgICAgID8gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSggdGhpcy5ydW5DYWxsYmFja3MgKVxuICAgICAgICAgICAgOiBzZXRUaW1lb3V0KCB0aGlzLnJ1bkNhbGxiYWNrcywgNjYpXG4gICAgfSxcblxuICAgIHJ1bkNhbGxiYWNrcygpIHtcbiAgICAgICAgdGhpcy5jYWxsYmFja3MgPSB0aGlzLmNhbGxiYWNrcy5maWx0ZXIoIGNhbGxiYWNrID0+IGNhbGxiYWNrKCkgKVxuICAgICAgICB0aGlzLnJ1bm5pbmcgPSBmYWxzZSBcbiAgICB9XG5cbn0sIHsgY2FsbGJhY2tzOiB7IHZhbHVlOiBbXSB9LCBydW5uaW5nOiB7IHZhbHVlOiBmYWxzZSB9IH0gKS5hZGRcbiIsIi8vIGh0dHA6Ly9zcGluLmpzLm9yZy8jdjIuMy4yXG4hZnVuY3Rpb24oYSxiKXtcIm9iamVjdFwiPT10eXBlb2YgbW9kdWxlJiZtb2R1bGUuZXhwb3J0cz9tb2R1bGUuZXhwb3J0cz1iKCk6XCJmdW5jdGlvblwiPT10eXBlb2YgZGVmaW5lJiZkZWZpbmUuYW1kP2RlZmluZShiKTphLlNwaW5uZXI9YigpfSh0aGlzLGZ1bmN0aW9uKCl7XCJ1c2Ugc3RyaWN0XCI7ZnVuY3Rpb24gYShhLGIpe3ZhciBjLGQ9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChhfHxcImRpdlwiKTtmb3IoYyBpbiBiKWRbY109YltjXTtyZXR1cm4gZH1mdW5jdGlvbiBiKGEpe2Zvcih2YXIgYj0xLGM9YXJndW1lbnRzLmxlbmd0aDtjPmI7YisrKWEuYXBwZW5kQ2hpbGQoYXJndW1lbnRzW2JdKTtyZXR1cm4gYX1mdW5jdGlvbiBjKGEsYixjLGQpe3ZhciBlPVtcIm9wYWNpdHlcIixiLH5+KDEwMCphKSxjLGRdLmpvaW4oXCItXCIpLGY9LjAxK2MvZCoxMDAsZz1NYXRoLm1heCgxLSgxLWEpL2IqKDEwMC1mKSxhKSxoPWouc3Vic3RyaW5nKDAsai5pbmRleE9mKFwiQW5pbWF0aW9uXCIpKS50b0xvd2VyQ2FzZSgpLGk9aCYmXCItXCIraCtcIi1cInx8XCJcIjtyZXR1cm4gbVtlXXx8KGsuaW5zZXJ0UnVsZShcIkBcIitpK1wia2V5ZnJhbWVzIFwiK2UrXCJ7MCV7b3BhY2l0eTpcIitnK1wifVwiK2YrXCIle29wYWNpdHk6XCIrYStcIn1cIisoZisuMDEpK1wiJXtvcGFjaXR5OjF9XCIrKGYrYiklMTAwK1wiJXtvcGFjaXR5OlwiK2ErXCJ9MTAwJXtvcGFjaXR5OlwiK2crXCJ9fVwiLGsuY3NzUnVsZXMubGVuZ3RoKSxtW2VdPTEpLGV9ZnVuY3Rpb24gZChhLGIpe3ZhciBjLGQsZT1hLnN0eWxlO2lmKGI9Yi5jaGFyQXQoMCkudG9VcHBlckNhc2UoKStiLnNsaWNlKDEpLHZvaWQgMCE9PWVbYl0pcmV0dXJuIGI7Zm9yKGQ9MDtkPGwubGVuZ3RoO2QrKylpZihjPWxbZF0rYix2b2lkIDAhPT1lW2NdKXJldHVybiBjfWZ1bmN0aW9uIGUoYSxiKXtmb3IodmFyIGMgaW4gYilhLnN0eWxlW2QoYSxjKXx8Y109YltjXTtyZXR1cm4gYX1mdW5jdGlvbiBmKGEpe2Zvcih2YXIgYj0xO2I8YXJndW1lbnRzLmxlbmd0aDtiKyspe3ZhciBjPWFyZ3VtZW50c1tiXTtmb3IodmFyIGQgaW4gYyl2b2lkIDA9PT1hW2RdJiYoYVtkXT1jW2RdKX1yZXR1cm4gYX1mdW5jdGlvbiBnKGEsYil7cmV0dXJuXCJzdHJpbmdcIj09dHlwZW9mIGE/YTphW2IlYS5sZW5ndGhdfWZ1bmN0aW9uIGgoYSl7dGhpcy5vcHRzPWYoYXx8e30saC5kZWZhdWx0cyxuKX1mdW5jdGlvbiBpKCl7ZnVuY3Rpb24gYyhiLGMpe3JldHVybiBhKFwiPFwiK2IrJyB4bWxucz1cInVybjpzY2hlbWFzLW1pY3Jvc29mdC5jb206dm1sXCIgY2xhc3M9XCJzcGluLXZtbFwiPicsYyl9ay5hZGRSdWxlKFwiLnNwaW4tdm1sXCIsXCJiZWhhdmlvcjp1cmwoI2RlZmF1bHQjVk1MKVwiKSxoLnByb3RvdHlwZS5saW5lcz1mdW5jdGlvbihhLGQpe2Z1bmN0aW9uIGYoKXtyZXR1cm4gZShjKFwiZ3JvdXBcIix7Y29vcmRzaXplOmsrXCIgXCIrayxjb29yZG9yaWdpbjotaitcIiBcIistan0pLHt3aWR0aDprLGhlaWdodDprfSl9ZnVuY3Rpb24gaChhLGgsaSl7YihtLGIoZShmKCkse3JvdGF0aW9uOjM2MC9kLmxpbmVzKmErXCJkZWdcIixsZWZ0On5+aH0pLGIoZShjKFwicm91bmRyZWN0XCIse2FyY3NpemU6ZC5jb3JuZXJzfSkse3dpZHRoOmosaGVpZ2h0OmQuc2NhbGUqZC53aWR0aCxsZWZ0OmQuc2NhbGUqZC5yYWRpdXMsdG9wOi1kLnNjYWxlKmQud2lkdGg+PjEsZmlsdGVyOml9KSxjKFwiZmlsbFwiLHtjb2xvcjpnKGQuY29sb3IsYSksb3BhY2l0eTpkLm9wYWNpdHl9KSxjKFwic3Ryb2tlXCIse29wYWNpdHk6MH0pKSkpfXZhciBpLGo9ZC5zY2FsZSooZC5sZW5ndGgrZC53aWR0aCksaz0yKmQuc2NhbGUqaixsPS0oZC53aWR0aCtkLmxlbmd0aCkqZC5zY2FsZSoyK1wicHhcIixtPWUoZigpLHtwb3NpdGlvbjpcImFic29sdXRlXCIsdG9wOmwsbGVmdDpsfSk7aWYoZC5zaGFkb3cpZm9yKGk9MTtpPD1kLmxpbmVzO2krKyloKGksLTIsXCJwcm9naWQ6RFhJbWFnZVRyYW5zZm9ybS5NaWNyb3NvZnQuQmx1cihwaXhlbHJhZGl1cz0yLG1ha2VzaGFkb3c9MSxzaGFkb3dvcGFjaXR5PS4zKVwiKTtmb3IoaT0xO2k8PWQubGluZXM7aSsrKWgoaSk7cmV0dXJuIGIoYSxtKX0saC5wcm90b3R5cGUub3BhY2l0eT1mdW5jdGlvbihhLGIsYyxkKXt2YXIgZT1hLmZpcnN0Q2hpbGQ7ZD1kLnNoYWRvdyYmZC5saW5lc3x8MCxlJiZiK2Q8ZS5jaGlsZE5vZGVzLmxlbmd0aCYmKGU9ZS5jaGlsZE5vZGVzW2IrZF0sZT1lJiZlLmZpcnN0Q2hpbGQsZT1lJiZlLmZpcnN0Q2hpbGQsZSYmKGUub3BhY2l0eT1jKSl9fXZhciBqLGssbD1bXCJ3ZWJraXRcIixcIk1velwiLFwibXNcIixcIk9cIl0sbT17fSxuPXtsaW5lczoxMixsZW5ndGg6Nyx3aWR0aDo1LHJhZGl1czoxMCxzY2FsZToxLGNvcm5lcnM6MSxjb2xvcjpcIiMwMDBcIixvcGFjaXR5Oi4yNSxyb3RhdGU6MCxkaXJlY3Rpb246MSxzcGVlZDoxLHRyYWlsOjEwMCxmcHM6MjAsekluZGV4OjJlOSxjbGFzc05hbWU6XCJzcGlubmVyXCIsdG9wOlwiNTAlXCIsbGVmdDpcIjUwJVwiLHNoYWRvdzohMSxod2FjY2VsOiExLHBvc2l0aW9uOlwiYWJzb2x1dGVcIn07aWYoaC5kZWZhdWx0cz17fSxmKGgucHJvdG90eXBlLHtzcGluOmZ1bmN0aW9uKGIpe3RoaXMuc3RvcCgpO3ZhciBjPXRoaXMsZD1jLm9wdHMsZj1jLmVsPWEobnVsbCx7Y2xhc3NOYW1lOmQuY2xhc3NOYW1lfSk7aWYoZShmLHtwb3NpdGlvbjpkLnBvc2l0aW9uLHdpZHRoOjAsekluZGV4OmQuekluZGV4LGxlZnQ6ZC5sZWZ0LHRvcDpkLnRvcH0pLGImJmIuaW5zZXJ0QmVmb3JlKGYsYi5maXJzdENoaWxkfHxudWxsKSxmLnNldEF0dHJpYnV0ZShcInJvbGVcIixcInByb2dyZXNzYmFyXCIpLGMubGluZXMoZixjLm9wdHMpLCFqKXt2YXIgZyxoPTAsaT0oZC5saW5lcy0xKSooMS1kLmRpcmVjdGlvbikvMixrPWQuZnBzLGw9ay9kLnNwZWVkLG09KDEtZC5vcGFjaXR5KS8obCpkLnRyYWlsLzEwMCksbj1sL2QubGluZXM7IWZ1bmN0aW9uIG8oKXtoKys7Zm9yKHZhciBhPTA7YTxkLmxpbmVzO2ErKylnPU1hdGgubWF4KDEtKGgrKGQubGluZXMtYSkqbiklbCptLGQub3BhY2l0eSksYy5vcGFjaXR5KGYsYSpkLmRpcmVjdGlvbitpLGcsZCk7Yy50aW1lb3V0PWMuZWwmJnNldFRpbWVvdXQobyx+figxZTMvaykpfSgpfXJldHVybiBjfSxzdG9wOmZ1bmN0aW9uKCl7dmFyIGE9dGhpcy5lbDtyZXR1cm4gYSYmKGNsZWFyVGltZW91dCh0aGlzLnRpbWVvdXQpLGEucGFyZW50Tm9kZSYmYS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGEpLHRoaXMuZWw9dm9pZCAwKSx0aGlzfSxsaW5lczpmdW5jdGlvbihkLGYpe2Z1bmN0aW9uIGgoYixjKXtyZXR1cm4gZShhKCkse3Bvc2l0aW9uOlwiYWJzb2x1dGVcIix3aWR0aDpmLnNjYWxlKihmLmxlbmd0aCtmLndpZHRoKStcInB4XCIsaGVpZ2h0OmYuc2NhbGUqZi53aWR0aCtcInB4XCIsYmFja2dyb3VuZDpiLGJveFNoYWRvdzpjLHRyYW5zZm9ybU9yaWdpbjpcImxlZnRcIix0cmFuc2Zvcm06XCJyb3RhdGUoXCIrfn4oMzYwL2YubGluZXMqaytmLnJvdGF0ZSkrXCJkZWcpIHRyYW5zbGF0ZShcIitmLnNjYWxlKmYucmFkaXVzK1wicHgsMClcIixib3JkZXJSYWRpdXM6KGYuY29ybmVycypmLnNjYWxlKmYud2lkdGg+PjEpK1wicHhcIn0pfWZvcih2YXIgaSxrPTAsbD0oZi5saW5lcy0xKSooMS1mLmRpcmVjdGlvbikvMjtrPGYubGluZXM7aysrKWk9ZShhKCkse3Bvc2l0aW9uOlwiYWJzb2x1dGVcIix0b3A6MSt+KGYuc2NhbGUqZi53aWR0aC8yKStcInB4XCIsdHJhbnNmb3JtOmYuaHdhY2NlbD9cInRyYW5zbGF0ZTNkKDAsMCwwKVwiOlwiXCIsb3BhY2l0eTpmLm9wYWNpdHksYW5pbWF0aW9uOmomJmMoZi5vcGFjaXR5LGYudHJhaWwsbCtrKmYuZGlyZWN0aW9uLGYubGluZXMpK1wiIFwiKzEvZi5zcGVlZCtcInMgbGluZWFyIGluZmluaXRlXCJ9KSxmLnNoYWRvdyYmYihpLGUoaChcIiMwMDBcIixcIjAgMCA0cHggIzAwMFwiKSx7dG9wOlwiMnB4XCJ9KSksYihkLGIoaSxoKGcoZi5jb2xvcixrKSxcIjAgMCAxcHggcmdiYSgwLDAsMCwuMSlcIikpKTtyZXR1cm4gZH0sb3BhY2l0eTpmdW5jdGlvbihhLGIsYyl7YjxhLmNoaWxkTm9kZXMubGVuZ3RoJiYoYS5jaGlsZE5vZGVzW2JdLnN0eWxlLm9wYWNpdHk9Yyl9fSksXCJ1bmRlZmluZWRcIiE9dHlwZW9mIGRvY3VtZW50KXtrPWZ1bmN0aW9uKCl7dmFyIGM9YShcInN0eWxlXCIse3R5cGU6XCJ0ZXh0L2Nzc1wifSk7cmV0dXJuIGIoZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJoZWFkXCIpWzBdLGMpLGMuc2hlZXR8fGMuc3R5bGVTaGVldH0oKTt2YXIgbz1lKGEoXCJncm91cFwiKSx7YmVoYXZpb3I6XCJ1cmwoI2RlZmF1bHQjVk1MKVwifSk7IWQobyxcInRyYW5zZm9ybVwiKSYmby5hZGo/aSgpOmo9ZChvLFwiYW5pbWF0aW9uXCIpfXJldHVybiBofSk7IiwibW9kdWxlLmV4cG9ydHMgPSBwID0+IFxuYDxkaXY+XG48ZGl2PkFkbWluPC9kaXY+XG48ZGl2IGRhdGEtanM9XCJsaXN0XCI+PC9kaXY+XG48L2Rpdj5gXG4iLCJtb2R1bGUuZXhwb3J0cyA9IHAgPT4gYDxkaXY+JHtwLmNvbGxlY3Rpb259PC9kaXY+YFxuIiwibW9kdWxlLmV4cG9ydHMgPSBwID0+IFxuYDxkaXY+XG4gICAgPGRpdiBjbGFzcz1cImhlYWRlclwiIGRhdGEtanM9XCJoZWFkZXJcIj5cbiAgICAgICAgPGRpdiBjbGFzcz1cInRpdGxlXCIgZGF0YS1qcz1cInRpdGxlXCIgPiR7cC50aXRsZSB8fCAnJ308L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzcz1cInByZS1jb250ZXh0XCIgZGF0YS1qcz1cInByZUNvbnRleHRcIiA+JHtwLnByZUNvbnRleHQgfHwgJyd9PC9kaXY+XG4gICAgICAgIDxkaXY+PGltZyBkYXRhLWpzPVwiY29udGV4dFwiIGNsYXNzPVwiY29udGV4dFwiIHNyYz1cIiR7cC5jb250ZXh0ID8gcC5jb250ZXh0IDogJyd9XCIvPjwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzPVwicG9zdC1jb250ZXh0XCIgZGF0YS1qcz1cInBvc3RDb250ZXh0XCIgPiR7cC5wb3N0Q29udGV4dCB8fCAnJ308L2Rpdj5cbiAgICAgICAgJHtwLl9pZCAmJiBwLnVzZXIuX2lkICYmICFwLm9wdHMucmVhZE9ubHkgPyAnPGJ1dHRvbiBjbGFzcz1cImRlbGV0ZVwiIGRhdGEtanM9XCJkZWxldGVcIj48L2J1dHRvbj4nIDogJyd9XG4gICAgICAgICR7cC5faWQgJiYgcC51c2VyLl9pZCAmJiAhcC5vcHRzLnJlYWRPbmx5ID8gJzxidXR0b24gY2xhc3M9XCJlZGl0XCIgZGF0YS1qcz1cImVkaXRcIj48L2J1dHRvbj4nIDogJyd9XG4gICAgPC9kaXY+XG4gICAgJHtwLl9pZCAmJiBwLnVzZXIuX2lkICYmICFwLm9wdHMucmVhZE9ubHlcbiAgICAgICAgPyBgPGRpdiBjbGFzcz1cImNvbmZpcm0gaGlkZGVuXCIgZGF0YS1qcz1cImNvbmZpcm1EaWFsb2dcIj5cbiAgICAgICAgICAgICAgIDxzcGFuPkFyZSB5b3Ugc3VyZT88L3NwYW4+XG4gICAgICAgICAgICAgICA8YnV0dG9uIGRhdGEtanM9XCJjb25maXJtXCIgdHlwZT1cImJ1dHRvblwiPkRlbGV0ZTwvYnV0dG9uPiBcbiAgICAgICAgICAgICAgIDxidXR0b24gZGF0YS1qcz1cImNhbmNlbFwiIHR5cGU9XCJidXR0b25cIj5DYW5jZWw8L2J1dHRvbj4gXG4gICAgICAgICAgIDwvZGl2PmBcbiAgICAgICAgOiBgYH1cbiAgICA8ZGl2IGNsYXNzPVwiY2xlYXJmaXhcIj5cbiAgICAgICAgPGRpdiBjbGFzcz1cImRhdGVcIj4keyhyZXF1aXJlKCdtb21lbnQnKSkocC5jcmVhdGVkKS5mb3JtYXQoJ01NLURELVlZWVknKX08L2Rpdj5cbiAgICA8L2Rpdj5cbiAgICA8aW1nIGRhdGEtanM9XCJpbWFnZVwiIHNyYz1cIiR7cC5pbWFnZSA/IHAuaW1hZ2UgOiAnJ31cIi8+XG4gICAgJHtwLm9wdHMucmVhZE9ubHlcbiAgICAgICAgPyBgPGRpdiBjbGFzcz1cImNsZWFyZml4XCI+XG4gICAgICAgICAgICAgPGRpdiBjbGFzcz1cInNoYXJlXCI+XG4gICAgICAgICAgICAgICAgICR7cmVxdWlyZSgnLi9saWIvZmFjZWJvb2snKX1cbiAgICAgICAgICAgICAgICAgJHtyZXF1aXJlKCcuL2xpYi90d2l0dGVyJyl9XG4gICAgICAgICAgICAgICAgICR7cmVxdWlyZSgnLi9saWIvZ29vZ2xlJyl9XG4gICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICA8L2Rpdj5gXG4gICAgICAgIDogYGAgfVxuPC9kaXY+YFxuIiwibW9kdWxlLmV4cG9ydHMgPSBwID0+XG5gPGRpdj5cbiAgICA8ZGl2IGRhdGEtanM9XCJoZWFkZXJcIj48L2Rpdj5cbiAgICA8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cFwiPlxuICAgICAgIDxsYWJlbCBjbGFzcz1cImZvcm0tbGFiZWxcIj50aXRsZTwvbGFiZWw+XG4gICAgICAgPGlucHV0IGRhdGEtanM9XCJ0aXRsZVwiIHR5cGU9XCJ0ZXh0XCI+PC9pbnB1dD5cbiAgICA8L2Rpdj5cbiAgICA8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cFwiPlxuICAgICAgIDxsYWJlbCBjbGFzcz1cImZvcm0tbGFiZWxcIj5wcmUgY29udGV4dDwvbGFiZWw+XG4gICAgICAgPGlucHV0IGRhdGEtanM9XCJwcmVDb250ZXh0XCIgdHlwZT1cInRleHRcIj48L2lucHV0PlxuICAgIDwvZGl2PlxuICAgIDxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwXCI+XG4gICAgICAgPGxhYmVsIGNsYXNzPVwiZm9ybS1sYWJlbFwiPmNvbnRleHQ8L2xhYmVsPlxuICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgPGRpdiBkYXRhLWpzPVwiY29udGV4dFVwbG9hZFwiIGNsYXNzPVwidXBsb2FkXCI+XG4gICAgICAgICAgICAgICAgPHNwYW4+VXBsb2FkIEZpbGU8L3NwYW4+XG4gICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJmaWxlXCIgZGF0YS1qcz1cImNvbnRleHRcIiAvPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8aW1nIGNsYXNzPVwicHJldmlld1wiIGRhdGEtanM9XCJjb250ZXh0UHJldmlld1wiIC8+XG4gICAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICAgIDxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwXCI+XG4gICAgICAgPGxhYmVsIGNsYXNzPVwiZm9ybS1sYWJlbFwiPnBvc3QgY29udGV4dDwvbGFiZWw+XG4gICAgICAgPGlucHV0IGRhdGEtanM9XCJwb3N0Q29udGV4dFwiIHR5cGU9XCJ0ZXh0XCI+PC9pbnB1dD5cbiAgICA8L2Rpdj5cbiAgICA8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cFwiPlxuICAgICAgIDxsYWJlbCBjbGFzcz1cImZvcm0tbGFiZWxcIj5pbWFnZTwvbGFiZWw+XG4gICAgICAgIDxkaXY+XG4gICAgICAgICAgICA8ZGl2IGRhdGEtanM9XCJ1cGxvYWRcIiBjbGFzcz1cInVwbG9hZFwiPlxuICAgICAgICAgICAgICAgIDxzcGFuPlVwbG9hZCBGaWxlPC9zcGFuPlxuICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwiZmlsZVwiIGRhdGEtanM9XCJpbWFnZVwiIC8+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxpbWcgY2xhc3M9XCJwcmV2aWV3XCIgZGF0YS1qcz1cInByZXZpZXdcIiAvPlxuICAgICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgICA8ZGl2IGNsYXNzPVwiYnV0dG9uLXJvd1wiPlxuICAgICAgICA8YnV0dG9uIGRhdGEtanM9XCJzdWJtaXRcIiB0eXBlPVwiYnV0dG9uXCI+U3VibWl0PC9idXR0b24+XG4gICAgICAgIDxidXR0b24gZGF0YS1qcz1cImNhbmNlbFwiIHR5cGU9XCJidXR0b25cIj5DYW5jZWw8L2J1dHRvbj5cbiAgICA8L2Rpdj5cbjwvZGl2PmBcbiIsIm1vZHVsZS5leHBvcnRzID0gcCA9PiBcbmA8ZGl2PlxuICAgIDxkaXY+XG4gICAgICAgIDxkaXY+Q29taWNzPC9kaXY+XG4gICAgICAgIDxidXR0b24gZGF0YS1qcz1cImFkZEJ0blwiIGNsYXNzPVwiYWRkXCI+PC9idXR0b24+XG4gICAgPC9kaXY+XG4gICAgPGRpdiBkYXRhLWpzPVwibGlzdFwiPjwvZGl2PlxuPC9kaXY+YFxuIiwibW9kdWxlLmV4cG9ydHMgPSBwID0+IGA8aGVhZGVyPlxuICAgIDx1bD4mbmJzcDtcbiAgICA8L3VsPlxuICAgIDxzcGFuPlRpbnkgSGFuZGVkPC9zcGFuPlxuICAgIDxpbWcgZGF0YS1qcz1cImxvZ29cIiBzcmM9XCIvc3RhdGljL2ltZy90aW55SGFuZGVkLmpwZ1wiIC8+XG48L2hlYWRlcj5gXG4iLCJtb2R1bGUuZXhwb3J0cyA9ICggcCApID0+IGA8ZGl2PjwvZGl2PmBcbiIsIm1vZHVsZS5leHBvcnRzID0gKCBwICkgPT5cbmA8ZGl2PlxuICAgIDxoMT5Mb2dpbjwvaDE+XG4gICAgPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXBcIj5cbiAgICAgICA8bGFiZWwgY2xhc3M9XCJmb3JtLWxhYmVsXCIgZm9yPVwidXNlcm5hbWVcIj51c2VybmFtZTwvbGFiZWw+XG4gICAgICAgPGlucHV0IGRhdGEtanM9XCJ1c2VybmFtZVwiIGNsYXNzPVwidXNlcm5hbWVcIiB0eXBlPVwidGV4dFwiPjwvaW5wdXQ+XG4gICAgPC9kaXY+XG4gICAgPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXBcIj5cbiAgICAgICA8bGFiZWwgY2xhc3M9XCJmb3JtLWxhYmVsXCIgZm9yPVwicGFzc3dvcmRcIj5wYXNzd29yZDwvbGFiZWw+XG4gICAgICAgPGlucHV0IGRhdGEtanM9XCJwYXNzd29yZFwiIGNsYXNzPVwicGFzc3dvcmRcIiB0eXBlPVwicGFzc3dvcmRcIj48L2lucHV0PlxuICAgIDwvZGl2PlxuICAgIDxkaXYgY2xhc3M9XCJidXR0b24tcm93XCI+XG4gICAgICAgIDxidXR0b24gZGF0YS1qcz1cInN1Ym1pdFwiIGNsYXNzPVwiYnRuLWdob3N0XCIgdHlwZT1cImJ1dHRvblwiPkxvZyBJbjwvYnV0dG9uPlxuICAgIDwvZGl2PlxuPC9kaXY+YFxuIiwibW9kdWxlLmV4cG9ydHMgPSBwID0+XG5gPGRpdj5cbiAgICA8ZGl2IGRhdGEtanM9XCJ1c2VybmFtZVwiPiR7cC51c2VybmFtZX08L2Rpdj5cbiAgICAke3AudXNlci5faWQgJiYgIXAub3B0cy5yZWFkT25seSA/ICc8YnV0dG9uIGNsYXNzPVwiZGVsZXRlXCIgZGF0YS1qcz1cImRlbGV0ZVwiPjwvYnV0dG9uPicgOiAnJ31cbiAgICAke3AudXNlci5faWQgPT09IHAuX2lkID8gJzxidXR0b24gY2xhc3M9XCJlZGl0XCIgZGF0YS1qcz1cImVkaXRcIj48L2J1dHRvbj4nIDogJyd9XG4gICAgJHtwLnVzZXIuX2lkICYmICFwLm9wdHMucmVhZE9ubHlcbiAgICA/IGA8ZGl2IGNsYXNzPVwiY29uZmlybSBoaWRkZW5cIiBkYXRhLWpzPVwiY29uZmlybURpYWxvZ1wiPlxuICAgICAgICAgICA8c3Bhbj5BcmUgeW91IHN1cmU/PC9zcGFuPlxuICAgICAgICAgICA8YnV0dG9uIGRhdGEtanM9XCJjb25maXJtXCIgdHlwZT1cImJ1dHRvblwiPkRlbGV0ZTwvYnV0dG9uPiBcbiAgICAgICAgICAgPGJ1dHRvbiBkYXRhLWpzPVwiY2FuY2VsXCIgdHlwZT1cImJ1dHRvblwiPkNhbmNlbDwvYnV0dG9uPiBcbiAgICAgICA8L2Rpdj5gXG4gICAgOiBgYH1cbjwvZGl2PlxuYFxuIiwibW9kdWxlLmV4cG9ydHMgPSBwID0+XG5gPGRpdj5cbiAgICA8ZGl2IGRhdGEtanM9XCJ0aXRsZVwiPjwvZGl2PlxuICAgIDxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwXCI+XG4gICAgICAgPGxhYmVsIGNsYXNzPVwiZm9ybS1sYWJlbFwiIGZvcj1cInVzZXJuYW1lXCI+dXNlcm5hbWU8L2xhYmVsPlxuICAgICAgIDxpbnB1dCBkYXRhLWpzPVwidXNlcm5hbWVcIiBjbGFzcz1cInVzZXJuYW1lXCIgdHlwZT1cInRleHRcIj48L2lucHV0PlxuICAgIDwvZGl2PlxuICAgIDxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwXCI+XG4gICAgICAgPGxhYmVsIGNsYXNzPVwiZm9ybS1sYWJlbFwiIGZvcj1cInBhc3N3b3JkXCI+cGFzc3dvcmQ8L2xhYmVsPlxuICAgICAgIDxpbnB1dCBkYXRhLWpzPVwicGFzc3dvcmRcIiBjbGFzcz1cInBhc3N3b3JkXCIgdHlwZT1cInBhc3N3b3JkXCI+PC9pbnB1dD5cbiAgICA8L2Rpdj5cbiAgICA8ZGl2IGNsYXNzPVwiYnV0dG9uLXJvd1wiPlxuICAgICAgICA8YnV0dG9uIGRhdGEtanM9XCJzdWJtaXRcIiBjbGFzcz1cImJ0bi1naG9zdFwiIHR5cGU9XCJidXR0b25cIj5TdWJtaXQ8L2J1dHRvbj5cbiAgICAgICAgPGJ1dHRvbiBkYXRhLWpzPVwiY2FuY2VsXCIgY2xhc3M9XCJidG4tZ2hvc3RcIiB0eXBlPVwiYnV0dG9uXCI+Q2FuY2VsPC9idXR0b24+XG4gICAgPC9kaXY+XG48L2Rpdj5gXG4iLCJtb2R1bGUuZXhwb3J0cyA9IHAgPT4gXG5gPGRpdj5cbiAgICA8ZGl2PlxuICAgICAgICA8ZGl2PlVzZXJzPC9kaXY+XG4gICAgICAgIDxidXR0b24gZGF0YS1qcz1cImFkZEJ0blwiIGNsYXNzPVwiYWRkXCI+PC9idXR0b24+XG4gICAgPC9kaXY+XG4gICAgPGRpdiBkYXRhLWpzPVwibGlzdFwiPjwvZGl2PlxuPC9kaXY+YFxuIiwibW9kdWxlLmV4cG9ydHMgPSBgPHN2ZyBkYXRhLWpzPVwiZmFjZWJvb2tcIiBlbmFibGUtYmFja2dyb3VuZD1cIm5ldyAwIDAgNTYuNjkzIDU2LjY5M1wiIGhlaWdodD1cIjU2LjY5M3B4XCIgaWQ9XCJMYXllcl8xXCIgdmVyc2lvbj1cIjEuMVwiIHZpZXdCb3g9XCIwIDAgNTYuNjkzIDU2LjY5M1wiIHdpZHRoPVwiNTYuNjkzcHhcIiB4bWw6c3BhY2U9XCJwcmVzZXJ2ZVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB4bWxuczp4bGluaz1cImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmtcIj48cGF0aCBkPVwiTTI4LjM0Nyw1LjE1N2MtMTMuNiwwLTI0LjYyNSwxMS4wMjctMjQuNjI1LDI0LjYyNWMwLDEzLjYsMTEuMDI1LDI0LjYyMywyNC42MjUsMjQuNjIzYzEzLjYsMCwyNC42MjUtMTEuMDIzLDI0LjYyNS0yNC42MjMgIEM1Mi45NzIsMTYuMTg0LDQxLjk0Niw1LjE1NywyOC4zNDcsNS4xNTd6IE0zNC44NjQsMjkuNjc5aC00LjI2NGMwLDYuODE0LDAsMTUuMjA3LDAsMTUuMjA3aC02LjMyYzAsMCwwLTguMzA3LDAtMTUuMjA3aC0zLjAwNiAgVjI0LjMxaDMuMDA2di0zLjQ3OWMwLTIuNDksMS4xODItNi4zNzcsNi4zNzktNi4zNzdsNC42OCwwLjAxOHY1LjIxNWMwLDAtMi44NDYsMC0zLjM5OCwwYy0wLjU1NSwwLTEuMzQsMC4yNzctMS4zNCwxLjQ2MXYzLjE2MyAgaDQuODE4TDM0Ljg2NCwyOS42Nzl6XCIvPjwvc3ZnPmBcbiIsIm1vZHVsZS5leHBvcnRzPWA8c3ZnIGRhdGEtanM9XCJnb29nbGVcIiBlbmFibGUtYmFja2dyb3VuZD1cIm5ldyAwIDAgNTYuNjkzIDU2LjY5M1wiIGhlaWdodD1cIjU2LjY5M3B4XCIgaWQ9XCJMYXllcl8xXCIgdmVyc2lvbj1cIjEuMVwiIHZpZXdCb3g9XCIwIDAgNTYuNjkzIDU2LjY5M1wiIHdpZHRoPVwiNTYuNjkzcHhcIiB4bWw6c3BhY2U9XCJwcmVzZXJ2ZVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB4bWxuczp4bGluaz1cImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmtcIj48Zz48cGF0aCBkPVwiTTIzLjc2MSwyNy45NmMwLjYyOSwwLDEuMTYtMC4yNDgsMS41Ny0wLjcxN2MwLjY0NS0wLjczMiwwLjkyOC0xLjkzNiwwLjc2LTMuMjE1Yy0wLjMwMS0yLjI4Ny0xLjkzMi00LjE4Ni0zLjYzNy00LjIzNiAgIGgtMC4wNjhjLTAuNjA0LDAtMS4xNDEsMC4yNDYtMS41NTEsMC43MTVjLTAuNjM3LDAuNzI1LTAuOTAzLDEuODcxLTAuNzM2LDMuMTQ2YzAuMjk5LDIuMjgzLDEuOTY1LDQuMjU2LDMuNjM1LDQuMzA3SDIzLjc2MXpcIi8+PHBhdGggZD1cIk0yNS42MjIsMzQuODQ3Yy0wLjE2OC0wLjExMy0wLjM0Mi0wLjIzMi0wLjUyMS0wLjM1NWMtMC41MjUtMC4xNjItMS4wODQtMC4yNDYtMS42NTQtMC4yNTRoLTAuMDcyICAgYy0yLjYyNSwwLTQuOTI5LDEuNTkyLTQuOTI5LDMuNDA2YzAsMS45NzEsMS45NzIsMy41MTgsNC40OTEsMy41MThjMy4zMjIsMCw1LjAwNi0xLjE0NSw1LjAwNi0zLjQwNCAgIGMwLTAuMjE1LTAuMDI1LTAuNDM2LTAuMDc2LTAuNjU2QzI3LjY0MiwzNi4yMjIsMjYuODM3LDM1LjY3NSwyNS42MjIsMzQuODQ3elwiLz48cGF0aCBkPVwiTTI4LjM0Nyw1LjE1N2MtMTMuNjAxLDAtMjQuNjI1LDExLjAyMy0yNC42MjUsMjQuNjIzczExLjAyNSwyNC42MjUsMjQuNjI1LDI0LjYyNWMxMy41OTgsMCwyNC42MjMtMTEuMDI1LDI0LjYyMy0yNC42MjUgICBTNDEuOTQ0LDUuMTU3LDI4LjM0Nyw1LjE1N3ogTTI2LjEwNiw0My4xNzljLTAuOTgyLDAuMjgzLTIuMDQxLDAuNDI4LTMuMTU0LDAuNDI4Yy0xLjIzOCwwLTIuNDMtMC4xNDMtMy41NC0wLjQyNCAgIGMtMi4xNS0wLjU0MS0zLjc0LTEuNTctNC40OC0yLjg5NWMtMC4zMi0wLjU3NC0wLjQ4Mi0xLjE4NC0wLjQ4Mi0xLjgxNmMwLTAuNjUyLDAuMTU2LTEuMzEyLDAuNDYzLTEuOTY3ICAgYzEuMTgtMi41MSw0LjI4My00LjE5Nyw3LjcyMi00LjE5N2MwLjAzNSwwLDAuMDY4LDAsMC4xLDBjLTAuMjc5LTAuNDkyLTAuNDE2LTEuMDAyLTAuNDE2LTEuNTM3YzAtMC4yNjgsMC4wMzUtMC41MzksMC4xMDUtMC44MTQgICBjLTMuNjA2LTAuMDg0LTYuMzA2LTIuNzI1LTYuMzA2LTYuMjA3YzAtMi40NjEsMS45NjUtNC44NTUsNC43NzYtNS44MjRjMC44NDItMC4yOTEsMS42OTktMC40MzksMi41NDMtMC40MzloNy43MTMgICBjMC4yNjQsMCwwLjQ5NCwwLjE3LDAuNTc2LDAuNDJjMC4wODQsMC4yNTItMC4wMDgsMC41MjUtMC4yMjEsMC42OGwtMS43MjUsMS4yNDhjLTAuMTA0LDAuMDc0LTAuMjI5LDAuMTE1LTAuMzU3LDAuMTE1aC0wLjYxNyAgIGMwLjc5OSwwLjk1NSwxLjI2NiwyLjMxNiwxLjI2NiwzLjg0OGMwLDEuNjkxLTAuODU1LDMuMjg5LTIuNDEsNC41MDZjLTEuMjAxLDAuOTM2LTEuMjUsMS4xOTEtMS4yNSwxLjcyOSAgIGMwLjAxNiwwLjI5NSwwLjg1NCwxLjI1MiwxLjc3NSwxLjkwNGMyLjE1MiwxLjUyMywyLjk1MywzLjAxNCwyLjk1Myw1LjUwOEMzMS4xNCw0MC4wNCwyOS4xNjMsNDIuMjkyLDI2LjEwNiw0My4xNzl6ICAgIE00My41MjgsMjkuOTQ4YzAsMC4zMzQtMC4yNzMsMC42MDUtMC42MDcsMC42MDVoLTQuMzgzdjQuMzg1YzAsMC4zMzYtMC4yNzEsMC42MDctMC42MDcsMC42MDdoLTEuMjQ4ICAgYy0wLjMzNiwwLTAuNjA3LTAuMjcxLTAuNjA3LTAuNjA3di00LjM4NUgzMS42OWMtMC4zMzIsMC0wLjYwNS0wLjI3MS0wLjYwNS0wLjYwNXYtMS4yNWMwLTAuMzM0LDAuMjczLTAuNjA3LDAuNjA1LTAuNjA3aDQuMzg1ICAgdi00LjM4M2MwLTAuMzM2LDAuMjcxLTAuNjA3LDAuNjA3LTAuNjA3aDEuMjQ4YzAuMzM2LDAsMC42MDcsMC4yNzEsMC42MDcsMC42MDd2NC4zODNoNC4zODNjMC4zMzQsMCwwLjYwNywwLjI3MywwLjYwNywwLjYwNyAgIFYyOS45NDh6XCIvPjwvZz48L3N2Zz5gXG4iLCJtb2R1bGUuZXhwb3J0cz1gPHN2ZyBkYXRhLWpzPVwidHdpdHRlclwiIGVuYWJsZS1iYWNrZ3JvdW5kPVwibmV3IDAgMCA1Ni42OTMgNTYuNjkzXCIgaGVpZ2h0PVwiNTYuNjkzcHhcIiBpZD1cIkxheWVyXzFcIiB2ZXJzaW9uPVwiMS4xXCIgdmlld0JveD1cIjAgMCA1Ni42OTMgNTYuNjkzXCIgd2lkdGg9XCI1Ni42OTNweFwiIHhtbDpzcGFjZT1cInByZXNlcnZlXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHhtbG5zOnhsaW5rPVwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1wiPjxwYXRoIGQ9XCJNMjguMzQ4LDUuMTU3Yy0xMy42LDAtMjQuNjI1LDExLjAyNy0yNC42MjUsMjQuNjI1YzAsMTMuNiwxMS4wMjUsMjQuNjIzLDI0LjYyNSwyNC42MjNjMTMuNiwwLDI0LjYyMy0xMS4wMjMsMjQuNjIzLTI0LjYyMyAgQzUyLjk3MSwxNi4xODQsNDEuOTQ3LDUuMTU3LDI4LjM0OCw1LjE1N3ogTTQwLjc1MiwyNC44MTdjMC4wMTMsMC4yNjYsMC4wMTgsMC41MzMsMC4wMTgsMC44MDNjMCw4LjIwMS02LjI0MiwxNy42NTYtMTcuNjU2LDE3LjY1NiAgYy0zLjUwNCwwLTYuNzY3LTEuMDI3LTkuNTEzLTIuNzg3YzAuNDg2LDAuMDU3LDAuOTc5LDAuMDg2LDEuNDgsMC4wODZjMi45MDgsMCw1LjU4NC0wLjk5Miw3LjcwNy0yLjY1NiAgYy0yLjcxNS0wLjA1MS01LjAwNi0xLjg0Ni01Ljc5Ni00LjMxMWMwLjM3OCwwLjA3NCwwLjc2NywwLjExMSwxLjE2NywwLjExMWMwLjU2NiwwLDEuMTE0LTAuMDc0LDEuNjM1LTAuMjE3ICBjLTIuODQtMC41Ny00Ljk3OS0zLjA4LTQuOTc5LTYuMDg0YzAtMC4wMjcsMC0wLjA1MywwLjAwMS0wLjA4YzAuODM2LDAuNDY1LDEuNzkzLDAuNzQ0LDIuODExLDAuNzc3ICBjLTEuNjY2LTEuMTE1LTIuNzYxLTMuMDEyLTIuNzYxLTUuMTY2YzAtMS4xMzcsMC4zMDYtMi4yMDQsMC44NC0zLjEyYzMuMDYxLDMuNzU0LDcuNjM0LDYuMjI1LDEyLjc5Miw2LjQ4MyAgYy0wLjEwNi0wLjQ1My0wLjE2MS0wLjkyOC0wLjE2MS0xLjQxNGMwLTMuNDI2LDIuNzc4LTYuMjA1LDYuMjA2LTYuMjA1YzEuNzg1LDAsMy4zOTcsMC43NTQsNC41MjksMS45NTkgIGMxLjQxNC0wLjI3NywyLjc0Mi0wLjc5NSwzLjk0MS0xLjUwNmMtMC40NjUsMS40NS0xLjQ0OCwyLjY2Ni0yLjczLDMuNDMzYzEuMjU3LTAuMTUsMi40NTMtMC40ODQsMy41NjUtMC45NzcgIEM0My4wMTgsMjIuODQ5LDQxLjk2NSwyMy45NDIsNDAuNzUyLDI0LjgxN3pcIi8+PC9zdmc+YFxuIiwibW9kdWxlLmV4cG9ydHMgPSBlcnIgPT4geyBjb25zb2xlLmxvZyggZXJyLnN0YWNrIHx8IGVyciApIH1cbiIsIm1vZHVsZS5leHBvcnRzID0ge1xuXG4gICAgRXJyb3I6IHJlcXVpcmUoJy4vTXlFcnJvcicpLFxuXG4gICAgUDogKCBmdW4sIGFyZ3M9WyBdLCB0aGlzQXJnICkgPT5cbiAgICAgICAgbmV3IFByb21pc2UoICggcmVzb2x2ZSwgcmVqZWN0ICkgPT4gUmVmbGVjdC5hcHBseSggZnVuLCB0aGlzQXJnIHx8IHRoaXMsIGFyZ3MuY29uY2F0KCAoIGUsIC4uLmNhbGxiYWNrICkgPT4gZSA/IHJlamVjdChlKSA6IHJlc29sdmUoY2FsbGJhY2spICkgKSApLFxuICAgIFxuICAgIGNvbnN0cnVjdG9yKCkgeyByZXR1cm4gdGhpcyB9XG59XG4iLCIvLyBDb3B5cmlnaHQgSm95ZW50LCBJbmMuIGFuZCBvdGhlciBOb2RlIGNvbnRyaWJ1dG9ycy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYVxuLy8gY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxuLy8gXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nXG4vLyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsXG4vLyBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0XG4vLyBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGVcbi8vIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4vLyBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTXG4vLyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4vLyBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOXG4vLyBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbi8vIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuLy8gT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuLy8gVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblxuZnVuY3Rpb24gRXZlbnRFbWl0dGVyKCkge1xuICB0aGlzLl9ldmVudHMgPSB0aGlzLl9ldmVudHMgfHwge307XG4gIHRoaXMuX21heExpc3RlbmVycyA9IHRoaXMuX21heExpc3RlbmVycyB8fCB1bmRlZmluZWQ7XG59XG5tb2R1bGUuZXhwb3J0cyA9IEV2ZW50RW1pdHRlcjtcblxuLy8gQmFja3dhcmRzLWNvbXBhdCB3aXRoIG5vZGUgMC4xMC54XG5FdmVudEVtaXR0ZXIuRXZlbnRFbWl0dGVyID0gRXZlbnRFbWl0dGVyO1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLl9ldmVudHMgPSB1bmRlZmluZWQ7XG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLl9tYXhMaXN0ZW5lcnMgPSB1bmRlZmluZWQ7XG5cbi8vIEJ5IGRlZmF1bHQgRXZlbnRFbWl0dGVycyB3aWxsIHByaW50IGEgd2FybmluZyBpZiBtb3JlIHRoYW4gMTAgbGlzdGVuZXJzIGFyZVxuLy8gYWRkZWQgdG8gaXQuIFRoaXMgaXMgYSB1c2VmdWwgZGVmYXVsdCB3aGljaCBoZWxwcyBmaW5kaW5nIG1lbW9yeSBsZWFrcy5cbkV2ZW50RW1pdHRlci5kZWZhdWx0TWF4TGlzdGVuZXJzID0gMTA7XG5cbi8vIE9idmlvdXNseSBub3QgYWxsIEVtaXR0ZXJzIHNob3VsZCBiZSBsaW1pdGVkIHRvIDEwLiBUaGlzIGZ1bmN0aW9uIGFsbG93c1xuLy8gdGhhdCB0byBiZSBpbmNyZWFzZWQuIFNldCB0byB6ZXJvIGZvciB1bmxpbWl0ZWQuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnNldE1heExpc3RlbmVycyA9IGZ1bmN0aW9uKG4pIHtcbiAgaWYgKCFpc051bWJlcihuKSB8fCBuIDwgMCB8fCBpc05hTihuKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ24gbXVzdCBiZSBhIHBvc2l0aXZlIG51bWJlcicpO1xuICB0aGlzLl9tYXhMaXN0ZW5lcnMgPSBuO1xuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuZW1pdCA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgdmFyIGVyLCBoYW5kbGVyLCBsZW4sIGFyZ3MsIGksIGxpc3RlbmVycztcblxuICBpZiAoIXRoaXMuX2V2ZW50cylcbiAgICB0aGlzLl9ldmVudHMgPSB7fTtcblxuICAvLyBJZiB0aGVyZSBpcyBubyAnZXJyb3InIGV2ZW50IGxpc3RlbmVyIHRoZW4gdGhyb3cuXG4gIGlmICh0eXBlID09PSAnZXJyb3InKSB7XG4gICAgaWYgKCF0aGlzLl9ldmVudHMuZXJyb3IgfHxcbiAgICAgICAgKGlzT2JqZWN0KHRoaXMuX2V2ZW50cy5lcnJvcikgJiYgIXRoaXMuX2V2ZW50cy5lcnJvci5sZW5ndGgpKSB7XG4gICAgICBlciA9IGFyZ3VtZW50c1sxXTtcbiAgICAgIGlmIChlciBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICAgIHRocm93IGVyOyAvLyBVbmhhbmRsZWQgJ2Vycm9yJyBldmVudFxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gQXQgbGVhc3QgZ2l2ZSBzb21lIGtpbmQgb2YgY29udGV4dCB0byB0aGUgdXNlclxuICAgICAgICB2YXIgZXJyID0gbmV3IEVycm9yKCdVbmNhdWdodCwgdW5zcGVjaWZpZWQgXCJlcnJvclwiIGV2ZW50LiAoJyArIGVyICsgJyknKTtcbiAgICAgICAgZXJyLmNvbnRleHQgPSBlcjtcbiAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGhhbmRsZXIgPSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgaWYgKGlzVW5kZWZpbmVkKGhhbmRsZXIpKVxuICAgIHJldHVybiBmYWxzZTtcblxuICBpZiAoaXNGdW5jdGlvbihoYW5kbGVyKSkge1xuICAgIHN3aXRjaCAoYXJndW1lbnRzLmxlbmd0aCkge1xuICAgICAgLy8gZmFzdCBjYXNlc1xuICAgICAgY2FzZSAxOlxuICAgICAgICBoYW5kbGVyLmNhbGwodGhpcyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAyOlxuICAgICAgICBoYW5kbGVyLmNhbGwodGhpcywgYXJndW1lbnRzWzFdKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDM6XG4gICAgICAgIGhhbmRsZXIuY2FsbCh0aGlzLCBhcmd1bWVudHNbMV0sIGFyZ3VtZW50c1syXSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgLy8gc2xvd2VyXG4gICAgICBkZWZhdWx0OlxuICAgICAgICBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcbiAgICAgICAgaGFuZGxlci5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICB9XG4gIH0gZWxzZSBpZiAoaXNPYmplY3QoaGFuZGxlcikpIHtcbiAgICBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcbiAgICBsaXN0ZW5lcnMgPSBoYW5kbGVyLnNsaWNlKCk7XG4gICAgbGVuID0gbGlzdGVuZXJzLmxlbmd0aDtcbiAgICBmb3IgKGkgPSAwOyBpIDwgbGVuOyBpKyspXG4gICAgICBsaXN0ZW5lcnNbaV0uYXBwbHkodGhpcywgYXJncyk7XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuYWRkTGlzdGVuZXIgPSBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuICB2YXIgbTtcblxuICBpZiAoIWlzRnVuY3Rpb24obGlzdGVuZXIpKVxuICAgIHRocm93IFR5cGVFcnJvcignbGlzdGVuZXIgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMpXG4gICAgdGhpcy5fZXZlbnRzID0ge307XG5cbiAgLy8gVG8gYXZvaWQgcmVjdXJzaW9uIGluIHRoZSBjYXNlIHRoYXQgdHlwZSA9PT0gXCJuZXdMaXN0ZW5lclwiISBCZWZvcmVcbiAgLy8gYWRkaW5nIGl0IHRvIHRoZSBsaXN0ZW5lcnMsIGZpcnN0IGVtaXQgXCJuZXdMaXN0ZW5lclwiLlxuICBpZiAodGhpcy5fZXZlbnRzLm5ld0xpc3RlbmVyKVxuICAgIHRoaXMuZW1pdCgnbmV3TGlzdGVuZXInLCB0eXBlLFxuICAgICAgICAgICAgICBpc0Z1bmN0aW9uKGxpc3RlbmVyLmxpc3RlbmVyKSA/XG4gICAgICAgICAgICAgIGxpc3RlbmVyLmxpc3RlbmVyIDogbGlzdGVuZXIpO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzW3R5cGVdKVxuICAgIC8vIE9wdGltaXplIHRoZSBjYXNlIG9mIG9uZSBsaXN0ZW5lci4gRG9uJ3QgbmVlZCB0aGUgZXh0cmEgYXJyYXkgb2JqZWN0LlxuICAgIHRoaXMuX2V2ZW50c1t0eXBlXSA9IGxpc3RlbmVyO1xuICBlbHNlIGlmIChpc09iamVjdCh0aGlzLl9ldmVudHNbdHlwZV0pKVxuICAgIC8vIElmIHdlJ3ZlIGFscmVhZHkgZ290IGFuIGFycmF5LCBqdXN0IGFwcGVuZC5cbiAgICB0aGlzLl9ldmVudHNbdHlwZV0ucHVzaChsaXN0ZW5lcik7XG4gIGVsc2VcbiAgICAvLyBBZGRpbmcgdGhlIHNlY29uZCBlbGVtZW50LCBuZWVkIHRvIGNoYW5nZSB0byBhcnJheS5cbiAgICB0aGlzLl9ldmVudHNbdHlwZV0gPSBbdGhpcy5fZXZlbnRzW3R5cGVdLCBsaXN0ZW5lcl07XG5cbiAgLy8gQ2hlY2sgZm9yIGxpc3RlbmVyIGxlYWtcbiAgaWYgKGlzT2JqZWN0KHRoaXMuX2V2ZW50c1t0eXBlXSkgJiYgIXRoaXMuX2V2ZW50c1t0eXBlXS53YXJuZWQpIHtcbiAgICBpZiAoIWlzVW5kZWZpbmVkKHRoaXMuX21heExpc3RlbmVycykpIHtcbiAgICAgIG0gPSB0aGlzLl9tYXhMaXN0ZW5lcnM7XG4gICAgfSBlbHNlIHtcbiAgICAgIG0gPSBFdmVudEVtaXR0ZXIuZGVmYXVsdE1heExpc3RlbmVycztcbiAgICB9XG5cbiAgICBpZiAobSAmJiBtID4gMCAmJiB0aGlzLl9ldmVudHNbdHlwZV0ubGVuZ3RoID4gbSkge1xuICAgICAgdGhpcy5fZXZlbnRzW3R5cGVdLndhcm5lZCA9IHRydWU7XG4gICAgICBjb25zb2xlLmVycm9yKCcobm9kZSkgd2FybmluZzogcG9zc2libGUgRXZlbnRFbWl0dGVyIG1lbW9yeSAnICtcbiAgICAgICAgICAgICAgICAgICAgJ2xlYWsgZGV0ZWN0ZWQuICVkIGxpc3RlbmVycyBhZGRlZC4gJyArXG4gICAgICAgICAgICAgICAgICAgICdVc2UgZW1pdHRlci5zZXRNYXhMaXN0ZW5lcnMoKSB0byBpbmNyZWFzZSBsaW1pdC4nLFxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9ldmVudHNbdHlwZV0ubGVuZ3RoKTtcbiAgICAgIGlmICh0eXBlb2YgY29uc29sZS50cmFjZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAvLyBub3Qgc3VwcG9ydGVkIGluIElFIDEwXG4gICAgICAgIGNvbnNvbGUudHJhY2UoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUub24gPSBFdmVudEVtaXR0ZXIucHJvdG90eXBlLmFkZExpc3RlbmVyO1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLm9uY2UgPSBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuICBpZiAoIWlzRnVuY3Rpb24obGlzdGVuZXIpKVxuICAgIHRocm93IFR5cGVFcnJvcignbGlzdGVuZXIgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG5cbiAgdmFyIGZpcmVkID0gZmFsc2U7XG5cbiAgZnVuY3Rpb24gZygpIHtcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGcpO1xuXG4gICAgaWYgKCFmaXJlZCkge1xuICAgICAgZmlyZWQgPSB0cnVlO1xuICAgICAgbGlzdGVuZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9XG4gIH1cblxuICBnLmxpc3RlbmVyID0gbGlzdGVuZXI7XG4gIHRoaXMub24odHlwZSwgZyk7XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vLyBlbWl0cyBhICdyZW1vdmVMaXN0ZW5lcicgZXZlbnQgaWZmIHRoZSBsaXN0ZW5lciB3YXMgcmVtb3ZlZFxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVMaXN0ZW5lciA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gIHZhciBsaXN0LCBwb3NpdGlvbiwgbGVuZ3RoLCBpO1xuXG4gIGlmICghaXNGdW5jdGlvbihsaXN0ZW5lcikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCdsaXN0ZW5lciBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcblxuICBpZiAoIXRoaXMuX2V2ZW50cyB8fCAhdGhpcy5fZXZlbnRzW3R5cGVdKVxuICAgIHJldHVybiB0aGlzO1xuXG4gIGxpc3QgPSB0aGlzLl9ldmVudHNbdHlwZV07XG4gIGxlbmd0aCA9IGxpc3QubGVuZ3RoO1xuICBwb3NpdGlvbiA9IC0xO1xuXG4gIGlmIChsaXN0ID09PSBsaXN0ZW5lciB8fFxuICAgICAgKGlzRnVuY3Rpb24obGlzdC5saXN0ZW5lcikgJiYgbGlzdC5saXN0ZW5lciA9PT0gbGlzdGVuZXIpKSB7XG4gICAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgICBpZiAodGhpcy5fZXZlbnRzLnJlbW92ZUxpc3RlbmVyKVxuICAgICAgdGhpcy5lbWl0KCdyZW1vdmVMaXN0ZW5lcicsIHR5cGUsIGxpc3RlbmVyKTtcblxuICB9IGVsc2UgaWYgKGlzT2JqZWN0KGxpc3QpKSB7XG4gICAgZm9yIChpID0gbGVuZ3RoOyBpLS0gPiAwOykge1xuICAgICAgaWYgKGxpc3RbaV0gPT09IGxpc3RlbmVyIHx8XG4gICAgICAgICAgKGxpc3RbaV0ubGlzdGVuZXIgJiYgbGlzdFtpXS5saXN0ZW5lciA9PT0gbGlzdGVuZXIpKSB7XG4gICAgICAgIHBvc2l0aW9uID0gaTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHBvc2l0aW9uIDwgMClcbiAgICAgIHJldHVybiB0aGlzO1xuXG4gICAgaWYgKGxpc3QubGVuZ3RoID09PSAxKSB7XG4gICAgICBsaXN0Lmxlbmd0aCA9IDA7XG4gICAgICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuICAgIH0gZWxzZSB7XG4gICAgICBsaXN0LnNwbGljZShwb3NpdGlvbiwgMSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX2V2ZW50cy5yZW1vdmVMaXN0ZW5lcilcbiAgICAgIHRoaXMuZW1pdCgncmVtb3ZlTGlzdGVuZXInLCB0eXBlLCBsaXN0ZW5lcik7XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUucmVtb3ZlQWxsTGlzdGVuZXJzID0gZnVuY3Rpb24odHlwZSkge1xuICB2YXIga2V5LCBsaXN0ZW5lcnM7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMpXG4gICAgcmV0dXJuIHRoaXM7XG5cbiAgLy8gbm90IGxpc3RlbmluZyBmb3IgcmVtb3ZlTGlzdGVuZXIsIG5vIG5lZWQgdG8gZW1pdFxuICBpZiAoIXRoaXMuX2V2ZW50cy5yZW1vdmVMaXN0ZW5lcikge1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKVxuICAgICAgdGhpcy5fZXZlbnRzID0ge307XG4gICAgZWxzZSBpZiAodGhpcy5fZXZlbnRzW3R5cGVdKVxuICAgICAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8vIGVtaXQgcmVtb3ZlTGlzdGVuZXIgZm9yIGFsbCBsaXN0ZW5lcnMgb24gYWxsIGV2ZW50c1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCkge1xuICAgIGZvciAoa2V5IGluIHRoaXMuX2V2ZW50cykge1xuICAgICAgaWYgKGtleSA9PT0gJ3JlbW92ZUxpc3RlbmVyJykgY29udGludWU7XG4gICAgICB0aGlzLnJlbW92ZUFsbExpc3RlbmVycyhrZXkpO1xuICAgIH1cbiAgICB0aGlzLnJlbW92ZUFsbExpc3RlbmVycygncmVtb3ZlTGlzdGVuZXInKTtcbiAgICB0aGlzLl9ldmVudHMgPSB7fTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGxpc3RlbmVycyA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcblxuICBpZiAoaXNGdW5jdGlvbihsaXN0ZW5lcnMpKSB7XG4gICAgdGhpcy5yZW1vdmVMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lcnMpO1xuICB9IGVsc2UgaWYgKGxpc3RlbmVycykge1xuICAgIC8vIExJRk8gb3JkZXJcbiAgICB3aGlsZSAobGlzdGVuZXJzLmxlbmd0aClcbiAgICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIodHlwZSwgbGlzdGVuZXJzW2xpc3RlbmVycy5sZW5ndGggLSAxXSk7XG4gIH1cbiAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcblxuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUubGlzdGVuZXJzID0gZnVuY3Rpb24odHlwZSkge1xuICB2YXIgcmV0O1xuICBpZiAoIXRoaXMuX2V2ZW50cyB8fCAhdGhpcy5fZXZlbnRzW3R5cGVdKVxuICAgIHJldCA9IFtdO1xuICBlbHNlIGlmIChpc0Z1bmN0aW9uKHRoaXMuX2V2ZW50c1t0eXBlXSkpXG4gICAgcmV0ID0gW3RoaXMuX2V2ZW50c1t0eXBlXV07XG4gIGVsc2VcbiAgICByZXQgPSB0aGlzLl9ldmVudHNbdHlwZV0uc2xpY2UoKTtcbiAgcmV0dXJuIHJldDtcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUubGlzdGVuZXJDb3VudCA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgaWYgKHRoaXMuX2V2ZW50cykge1xuICAgIHZhciBldmxpc3RlbmVyID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gICAgaWYgKGlzRnVuY3Rpb24oZXZsaXN0ZW5lcikpXG4gICAgICByZXR1cm4gMTtcbiAgICBlbHNlIGlmIChldmxpc3RlbmVyKVxuICAgICAgcmV0dXJuIGV2bGlzdGVuZXIubGVuZ3RoO1xuICB9XG4gIHJldHVybiAwO1xufTtcblxuRXZlbnRFbWl0dGVyLmxpc3RlbmVyQ291bnQgPSBmdW5jdGlvbihlbWl0dGVyLCB0eXBlKSB7XG4gIHJldHVybiBlbWl0dGVyLmxpc3RlbmVyQ291bnQodHlwZSk7XG59O1xuXG5mdW5jdGlvbiBpc0Z1bmN0aW9uKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ2Z1bmN0aW9uJztcbn1cblxuZnVuY3Rpb24gaXNOdW1iZXIoYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnbnVtYmVyJztcbn1cblxuZnVuY3Rpb24gaXNPYmplY3QoYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnb2JqZWN0JyAmJiBhcmcgIT09IG51bGw7XG59XG5cbmZ1bmN0aW9uIGlzVW5kZWZpbmVkKGFyZykge1xuICByZXR1cm4gYXJnID09PSB2b2lkIDA7XG59XG4iXX0=
