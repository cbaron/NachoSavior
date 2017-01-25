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
	Toast: require('./views/templates/Toast'),
	User: require('./views/templates/User'),
	UserManage: require('./views/templates/UserManage'),
	UserResources: require('./views/templates/UserResources')
};

},{"./views/templates/Admin":25,"./views/templates/AdminItem":26,"./views/templates/Comic":27,"./views/templates/ComicManage":28,"./views/templates/ComicResources":29,"./views/templates/Header":30,"./views/templates/Home":31,"./views/templates/Login":32,"./views/templates/Toast":33,"./views/templates/User":34,"./views/templates/UserManage":35,"./views/templates/UserResources":36}],2:[function(require,module,exports){
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
	Toast: require('./views/Toast'),
	User: require('./views/User'),
	UserManage: require('./views/UserManage'),
	UserResources: require('./views/UserResources')
};

},{"./views/Admin":10,"./views/AdminItem":11,"./views/Comic":12,"./views/ComicManage":13,"./views/ComicResources":14,"./views/Header":15,"./views/Home":16,"./views/Login":17,"./views/Toast":18,"./views/User":19,"./views/UserManage":20,"./views/UserResources":21}],3:[function(require,module,exports){
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

},{"../../lib/MyObject":42}],5:[function(require,module,exports){
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

},{"../../../lib/MyObject":42,"../Xhr":4,"events":43}],9:[function(require,module,exports){
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
                    _this.views = {};
                    history.pushState({}, '', '/');
                    return Promise.resolve(_this.handle());
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

        var isComic = Boolean(path[0] && path.length === 1 && !/^(admin|comic)$/i.test(path[0]));
        var name = isComic ? 'Comic' : path[0] ? path[0].charAt(0).toUpperCase() + path[0].slice(1) : '';

        var view = this.Views[name] ? path[0] : 'home';

        if (isComic) {
            view = 'comic';
        }

        (view === this.currentView ? Promise.resolve() : Promise.all(Object.keys(this.views).map(function (view) {
            return _this2.views[view].hide();
        }))).then(function () {

            _this2.currentView = view;

            if (_this2.views[view]) return _this2.views[view].navigate(path);

            return Promise.resolve(_this2.views[view] = _this2.ViewFactory.create(view, {
                insertion: { value: { el: _this2.contentContainer } },
                path: { value: path, writable: true },
                templateOpts: { value: { readOnly: true } }
            }));
        }).catch(this.Error);
    },
    navigate: function navigate(location) {
        history.pushState({}, '', location);
        this.handle();
    }
}, { currentView: { value: '', writable: true }, views: { value: {}, writable: true } });

},{"../../lib/MyError":41,"./.ViewMap":2,"./factory/View":5,"./models/User":7}],10:[function(require,module,exports){
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

},{"./__proto__":22}],11:[function(require,module,exports){
'use strict';

module.exports = Object.assign({}, require('./__proto__'), {

    events: {
        container: 'click'
    },

    onContainerClick: function onContainerClick() {
        this.emit('navigate', '/admin/' + this.model.data.collection);
    }
});

},{"./__proto__":22}],12:[function(require,module,exports){
'use strict';

module.exports = Object.assign({}, require('./__proto__'), {

    events: {
        cancel: 'click',
        confirm: 'click',
        delete: 'click',
        edit: 'click',
        facebook: 'click',
        google: 'click',
        //store: 'click',
        image: 'click',
        twitter: 'click'
    },

    getLink: function getLink() {
        var prefix = encodeURIComponent('http://' + window.location.hostname + window.location.port);
        return prefix + '/' + (this.model.data.name || 'comic/' + this.model.data._id);
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
    onFacebookClick: function onFacebookClick() {
        window.open('https://www.facebook.com/sharer.php?u=' + this.getLink());
    },
    onStoreClick: function onStoreClick() {
        window.open('http://www.zazzle.com/api/create/at-238357470884685468?rf=238357470884685468&ax=DesignBlast&sr=250782469400013616&cg=196167085186428961&t__useQpc=false&ds=true&t__smart=true&continueUrl=http%3A%2F%2Fwww.zazzle.com%2Ftinyhanded&fwd=ProductPage&tc=&ic=&t_image1_iid=' + encodeURIComponent(this.getComic()));
    },
    onGoogleClick: function onGoogleClick() {
        window.open('https://plus.google.com/share?url=' + this.getLink());
    },
    onImageClick: function onImageClick() {
        this.emit('navigate', this.model.data.name ? '/' + this.model.data.name : '/comic/' + this.model.data._id);
    },
    onTwitterClick: function onTwitterClick() {
        window.open('https://www.twitter.com/share?url=' + this.getLink() + '&via=tinyhanded&text=Unpresidented');
    },
    postRender: function postRender() {
        if (this.model && this.model.data._id) {
            if (!this.model.data.context) {
                this.els.context.style.display = 'none';
            }
            return this;
        }

        var resource = this.path.length === 1 ? this.path[0] : 'comic/' + this.path[1];
        this.model = Object.create(this.Model, { resource: { value: resource, writable: true } });
        this.model.get().then(this.update.bind(this)).catch(this.Error);

        return this;
    },
    update: function update(comic) {
        if (comic === null) return this.emit('navigate', '/');

        this.model.data = comic;
        this.els.preContext.textContent = comic.preContext;
        this.els.postContext.textContent = comic.postContext;
        this.els.image.src = comic.image + '?' + new Date().getTime();

        if (!comic.context) {
            this.els.context.style.display = 'none';
        } else {
            this.els.context.src = comic.context;
            this.els.context.style.display = 'block';
        }
    }
});

},{"./__proto__":22}],13:[function(require,module,exports){
'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

module.exports = Object.assign({}, require('./__proto__'), {

    Toast: require('./Toast'),

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
            this.els.name.value = this.model.data.name || '';
            this.els.preview.src = this.model.data.image;
            this.els.contextPreview.src = this.model.data.context;
            this.els.preContext.value = this.model.data.preContext;
            this.els.postContext.value = this.model.data.postContext;
        } else {
            this.els.name.value = '';
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
                    name: _this3.els.name.value,
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
        }).catch(function (e) {
            _this3.Error(e);
        });
    },
    requestEdit: function requestEdit() {
        var _this4 = this;

        var data = { name: this.els.name.value };

        return (this.binaryFile ? this.Xhr({ method: 'PATCH', resource: 'file/' + this.model.data.image.split('/')[4], data: this.binaryFile, headers: { contentType: 'application/octet-stream' } }) : Promise.resolve()).then(function () {
            return _this4.Xhr({ method: 'PATCH', resource: 'comic/' + _this4.model.data._id, data: JSON.stringify(data) });
        }).then(function (response) {
            return _this4.hide().then(function () {
                return _this4.emit('edited', response);
            });
        }).catch(function (e) {
            _this4.Error(e);
        });
    }
});

},{"./Toast":18,"./__proto__":22}],14:[function(require,module,exports){
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

},{"./__proto__":22}],15:[function(require,module,exports){
'use strict';

module.exports = Object.assign({}, require('./__proto__'), {

    events: {
        logo: 'click'
    },

    onUser: function onUser() {
        return this;
    },
    onLogoClick: function onLogoClick() {
        this.emit('navigate', '/');
    },


    requiresLogin: false,

    signout: function signout() {

        document.cookie = window.cookieName + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';

        if (this.user.data._id) {
            this.user.data = {};
            this.emit('signout');
        }
    }
});

},{"./__proto__":22}],16:[function(require,module,exports){
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

},{"./__proto__":22}],17:[function(require,module,exports){
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

},{"./__proto__":22}],18:[function(require,module,exports){
'use strict';

module.exports = Object.create(Object.assign({}, require('./__proto__'), {
    constructor: function constructor() {
        return Object.assign(this, {
            els: {},
            slurp: { attr: 'data-js', view: 'data-view' },
            template: require('./templates/Toast')
        }).render();
    },
    factory: function factory(text) {
        var _this = this;

        this.els.content.textContent = text;
        return this.show().then(function () {
            return _this.hide();
        });
    },


    insertion: { el: document.querySelector('body') },

    name: 'Toast',

    postRender: function postRender() {

        return this.factory.bind(this);
    }
}), {}).constructor();

},{"./__proto__":22,"./templates/Toast":33}],19:[function(require,module,exports){
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

},{"./__proto__":22}],20:[function(require,module,exports){
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

},{"./__proto__":22}],21:[function(require,module,exports){
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

},{"./__proto__":22}],22:[function(require,module,exports){
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

},{"../../../lib/MyObject":42,"../Xhr":4,"../models/__proto__.js":8,"./lib/OptimizedResize":23,"./lib/Spin":24,"events":43}],23:[function(require,module,exports){
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

},{}],24:[function(require,module,exports){
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

},{}],25:[function(require,module,exports){
"use strict";

module.exports = function (p) {
  return "<div>\n<div>Admin</div>\n<div data-js=\"list\"></div>\n</div>";
};

},{}],26:[function(require,module,exports){
"use strict";

module.exports = function (p) {
  return "<div>" + p.collection + "</div>";
};

},{}],27:[function(require,module,exports){
'use strict';

module.exports = function (p) {
    return '<div>\n    <div class="header" data-js="header">\n        <div class="pre-context" data-js="preContext" >' + (p.preContext || '') + '</div>\n        <div><img data-js="context" class="context" src="' + (p.context || '') + '"/></div>\n        <div class="post-context" data-js="postContext" >' + (p.postContext || '') + '</div>\n        ' + (p._id && p.user._id && !p.opts.readOnly ? '<button class="delete" data-js="delete"></button>' : '') + '\n        ' + (p._id && p.user._id && !p.opts.readOnly ? '<button class="edit" data-js="edit"></button>' : '') + '\n    </div>\n    ' + (p._id && p.user._id && !p.opts.readOnly ? '<div class="confirm hidden" data-js="confirmDialog">\n               <span>Are you sure?</span>\n               <button data-js="confirm" type="button">Delete</button> \n               <button data-js="cancel" type="button">Cancel</button> \n           </div>' : '') + '\n    <div class="clearfix">\n        <div class="date">' + require('moment')(p.created).format('MM-DD-YYYY') + '</div>\n    </div>\n    <img class="image" data-js="image" src="' + (p.image ? p.image : '') + '"/>\n    ' + (p.opts.readOnly ? '<div class="clearfix">\n             <div class="share">\n                 ' + require('./lib/facebook') + '\n                 ' + require('./lib/twitter') + '\n                 ' + require('./lib/google') + '\n                 <a href="mailto:badhombre@tinyhanded.com">' + require('./lib/mail') + '</a>\n             </div>\n             <!-- <div class="store" data-js="store">Store</div> -->\n         </div>' : '') + '\n</div>';
};

},{"./lib/facebook":37,"./lib/google":38,"./lib/mail":39,"./lib/twitter":40,"moment":"moment"}],28:[function(require,module,exports){
"use strict";

module.exports = function (p) {
    return "<div>\n    <div data-js=\"header\"></div>\n    <div class=\"form-group\">\n       <label class=\"form-label\">name ( used in url )</label>\n       <input data-js=\"name\" type=\"text\"></input>\n    </div>\n    <div class=\"form-group\">\n       <label class=\"form-label\">pre context</label>\n       <input data-js=\"preContext\" type=\"text\"></input>\n    </div>\n    <div class=\"form-group\">\n       <label class=\"form-label\">context</label>\n        <div>\n            <div data-js=\"contextUpload\" class=\"upload\">\n                <span>Upload File</span>\n                <input type=\"file\" data-js=\"context\" />\n            </div>\n            <img class=\"preview\" data-js=\"contextPreview\" />\n        </div>\n    </div>\n    <div class=\"form-group\">\n       <label class=\"form-label\">post context</label>\n       <input data-js=\"postContext\" type=\"text\"></input>\n    </div>\n    <div class=\"form-group\">\n       <label class=\"form-label\">image</label>\n        <div>\n            <div data-js=\"upload\" class=\"upload\">\n                <span>Upload File</span>\n                <input type=\"file\" data-js=\"image\" />\n            </div>\n            <img class=\"preview\" data-js=\"preview\" />\n        </div>\n    </div>\n    <div class=\"button-row\">\n        <button data-js=\"submit\" type=\"button\">Submit</button>\n        <button data-js=\"cancel\" type=\"button\">Cancel</button>\n    </div>\n</div>";
};

},{}],29:[function(require,module,exports){
"use strict";

module.exports = function (p) {
    return "<div>\n    <div>\n        <div>Comics</div>\n        <button data-js=\"addBtn\" class=\"add\"></button>\n    </div>\n    <div data-js=\"list\"></div>\n</div>";
};

},{}],30:[function(require,module,exports){
"use strict";

module.exports = function (p) {
    return "<header>\n    <img data-js=\"logo\" src=\"/static/img/logo.png\" />\n</header>";
};

},{}],31:[function(require,module,exports){
"use strict";

module.exports = function (p) {
  return "<div></div>";
};

},{}],32:[function(require,module,exports){
"use strict";

module.exports = function (p) {
   return "<div>\n    <h1>Login</h1>\n    <div class=\"form-group\">\n       <label class=\"form-label\" for=\"username\">username</label>\n       <input data-js=\"username\" class=\"username\" type=\"text\"></input>\n    </div>\n    <div class=\"form-group\">\n       <label class=\"form-label\" for=\"password\">password</label>\n       <input data-js=\"password\" class=\"password\" type=\"password\"></input>\n    </div>\n    <div class=\"button-row\">\n        <button data-js=\"submit\" class=\"btn-ghost\" type=\"button\">Log In</button>\n    </div>\n</div>";
};

},{}],33:[function(require,module,exports){
"use strict";

module.exports = function () {
  return "<div class=\"hide\"><div data-js=\"content\"></div></div>";
};

},{}],34:[function(require,module,exports){
'use strict';

module.exports = function (p) {
    return '<div>\n    <div data-js="username">' + p.username + '</div>\n    ' + (p.user._id && !p.opts.readOnly ? '<button class="delete" data-js="delete"></button>' : '') + '\n    ' + (p.user._id === p._id ? '<button class="edit" data-js="edit"></button>' : '') + '\n    ' + (p.user._id && !p.opts.readOnly ? '<div class="confirm hidden" data-js="confirmDialog">\n           <span>Are you sure?</span>\n           <button data-js="confirm" type="button">Delete</button> \n           <button data-js="cancel" type="button">Cancel</button> \n       </div>' : '') + '\n</div>\n';
};

},{}],35:[function(require,module,exports){
"use strict";

module.exports = function (p) {
   return "<div>\n    <div data-js=\"title\"></div>\n    <div class=\"form-group\">\n       <label class=\"form-label\" for=\"username\">username</label>\n       <input data-js=\"username\" class=\"username\" type=\"text\"></input>\n    </div>\n    <div class=\"form-group\">\n       <label class=\"form-label\" for=\"password\">password</label>\n       <input data-js=\"password\" class=\"password\" type=\"password\"></input>\n    </div>\n    <div class=\"button-row\">\n        <button data-js=\"submit\" class=\"btn-ghost\" type=\"button\">Submit</button>\n        <button data-js=\"cancel\" class=\"btn-ghost\" type=\"button\">Cancel</button>\n    </div>\n</div>";
};

},{}],36:[function(require,module,exports){
"use strict";

module.exports = function (p) {
    return "<div>\n    <div>\n        <div>Users</div>\n        <button data-js=\"addBtn\" class=\"add\"></button>\n    </div>\n    <div data-js=\"list\"></div>\n</div>";
};

},{}],37:[function(require,module,exports){
"use strict";

module.exports = "<svg data-js=\"facebook\" enable-background=\"new 0 0 56.693 56.693\" height=\"56.693px\" id=\"Layer_1\" version=\"1.1\" viewBox=\"0 0 56.693 56.693\" width=\"56.693px\" xml:space=\"preserve\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\"><path d=\"M28.347,5.157c-13.6,0-24.625,11.027-24.625,24.625c0,13.6,11.025,24.623,24.625,24.623c13.6,0,24.625-11.023,24.625-24.623  C52.972,16.184,41.946,5.157,28.347,5.157z M34.864,29.679h-4.264c0,6.814,0,15.207,0,15.207h-6.32c0,0,0-8.307,0-15.207h-3.006  V24.31h3.006v-3.479c0-2.49,1.182-6.377,6.379-6.377l4.68,0.018v5.215c0,0-2.846,0-3.398,0c-0.555,0-1.34,0.277-1.34,1.461v3.163  h4.818L34.864,29.679z\"/></svg>";

},{}],38:[function(require,module,exports){
"use strict";

module.exports = "<svg data-js=\"google\" enable-background=\"new 0 0 56.693 56.693\" height=\"56.693px\" id=\"Layer_1\" version=\"1.1\" viewBox=\"0 0 56.693 56.693\" width=\"56.693px\" xml:space=\"preserve\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\"><g><path d=\"M23.761,27.96c0.629,0,1.16-0.248,1.57-0.717c0.645-0.732,0.928-1.936,0.76-3.215c-0.301-2.287-1.932-4.186-3.637-4.236   h-0.068c-0.604,0-1.141,0.246-1.551,0.715c-0.637,0.725-0.903,1.871-0.736,3.146c0.299,2.283,1.965,4.256,3.635,4.307H23.761z\"/><path d=\"M25.622,34.847c-0.168-0.113-0.342-0.232-0.521-0.355c-0.525-0.162-1.084-0.246-1.654-0.254h-0.072   c-2.625,0-4.929,1.592-4.929,3.406c0,1.971,1.972,3.518,4.491,3.518c3.322,0,5.006-1.145,5.006-3.404   c0-0.215-0.025-0.436-0.076-0.656C27.642,36.222,26.837,35.675,25.622,34.847z\"/><path d=\"M28.347,5.157c-13.601,0-24.625,11.023-24.625,24.623s11.025,24.625,24.625,24.625c13.598,0,24.623-11.025,24.623-24.625   S41.944,5.157,28.347,5.157z M26.106,43.179c-0.982,0.283-2.041,0.428-3.154,0.428c-1.238,0-2.43-0.143-3.54-0.424   c-2.15-0.541-3.74-1.57-4.48-2.895c-0.32-0.574-0.482-1.184-0.482-1.816c0-0.652,0.156-1.312,0.463-1.967   c1.18-2.51,4.283-4.197,7.722-4.197c0.035,0,0.068,0,0.1,0c-0.279-0.492-0.416-1.002-0.416-1.537c0-0.268,0.035-0.539,0.105-0.814   c-3.606-0.084-6.306-2.725-6.306-6.207c0-2.461,1.965-4.855,4.776-5.824c0.842-0.291,1.699-0.439,2.543-0.439h7.713   c0.264,0,0.494,0.17,0.576,0.42c0.084,0.252-0.008,0.525-0.221,0.68l-1.725,1.248c-0.104,0.074-0.229,0.115-0.357,0.115h-0.617   c0.799,0.955,1.266,2.316,1.266,3.848c0,1.691-0.855,3.289-2.41,4.506c-1.201,0.936-1.25,1.191-1.25,1.729   c0.016,0.295,0.854,1.252,1.775,1.904c2.152,1.523,2.953,3.014,2.953,5.508C31.14,40.04,29.163,42.292,26.106,43.179z    M43.528,29.948c0,0.334-0.273,0.605-0.607,0.605h-4.383v4.385c0,0.336-0.271,0.607-0.607,0.607h-1.248   c-0.336,0-0.607-0.271-0.607-0.607v-4.385H31.69c-0.332,0-0.605-0.271-0.605-0.605v-1.25c0-0.334,0.273-0.607,0.605-0.607h4.385   v-4.383c0-0.336,0.271-0.607,0.607-0.607h1.248c0.336,0,0.607,0.271,0.607,0.607v4.383h4.383c0.334,0,0.607,0.273,0.607,0.607   V29.948z\"/></g></svg>";

},{}],39:[function(require,module,exports){
"use strict";

module.exports = "<svg data-js=\"mail\" version=\"1.1\" id=\"Capa_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\"\n\t viewBox=\"0 0 14 13\" style=\"enable-background:new 0 0 14 13;\" xml:space=\"preserve\">\n\t<g>\n\t\t<path style=\"fill:#030104;\" d=\"M7,9L5.268,7.484l-4.952,4.245C0.496,11.896,0.739,12,1.007,12h11.986\n\t\t\tc0.267,0,0.509-0.104,0.688-0.271L8.732,7.484L7,9z\"/>\n\t\t<path style=\"fill:#030104;\" d=\"M13.684,2.271C13.504,2.103,13.262,2,12.993,2H1.007C0.74,2,0.498,2.104,0.318,2.273L7,8\n\t\t\tL13.684,2.271z\"/>\n\t\t<polygon style=\"fill:#030104;\" points=\"0,2.878 0,11.186 4.833,7.079 \t\t\"/>\n\t\t<polygon style=\"fill:#030104;\" points=\"9.167,7.079 14,11.186 14,2.875 \t\t\"/>\n\t</g>\n</svg>";

},{}],40:[function(require,module,exports){
"use strict";

module.exports = "<svg data-js=\"twitter\" enable-background=\"new 0 0 56.693 56.693\" height=\"56.693px\" id=\"Layer_1\" version=\"1.1\" viewBox=\"0 0 56.693 56.693\" width=\"56.693px\" xml:space=\"preserve\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\"><path d=\"M28.348,5.157c-13.6,0-24.625,11.027-24.625,24.625c0,13.6,11.025,24.623,24.625,24.623c13.6,0,24.623-11.023,24.623-24.623  C52.971,16.184,41.947,5.157,28.348,5.157z M40.752,24.817c0.013,0.266,0.018,0.533,0.018,0.803c0,8.201-6.242,17.656-17.656,17.656  c-3.504,0-6.767-1.027-9.513-2.787c0.486,0.057,0.979,0.086,1.48,0.086c2.908,0,5.584-0.992,7.707-2.656  c-2.715-0.051-5.006-1.846-5.796-4.311c0.378,0.074,0.767,0.111,1.167,0.111c0.566,0,1.114-0.074,1.635-0.217  c-2.84-0.57-4.979-3.08-4.979-6.084c0-0.027,0-0.053,0.001-0.08c0.836,0.465,1.793,0.744,2.811,0.777  c-1.666-1.115-2.761-3.012-2.761-5.166c0-1.137,0.306-2.204,0.84-3.12c3.061,3.754,7.634,6.225,12.792,6.483  c-0.106-0.453-0.161-0.928-0.161-1.414c0-3.426,2.778-6.205,6.206-6.205c1.785,0,3.397,0.754,4.529,1.959  c1.414-0.277,2.742-0.795,3.941-1.506c-0.465,1.45-1.448,2.666-2.73,3.433c1.257-0.15,2.453-0.484,3.565-0.977  C43.018,22.849,41.965,23.942,40.752,24.817z\"/></svg>";

},{}],41:[function(require,module,exports){
"use strict";

module.exports = function (err) {
  console.log(err.stack || err);
};

},{}],42:[function(require,module,exports){
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

},{"./MyError":41}],43:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJjbGllbnQvanMvLlRlbXBsYXRlTWFwLmpzIiwiY2xpZW50L2pzLy5WaWV3TWFwLmpzIiwiY2xpZW50L2pzLy5lbnYiLCJjbGllbnQvanMvWGhyLmpzIiwiY2xpZW50L2pzL2ZhY3RvcnkvVmlldy5qcyIsImNsaWVudC9qcy9tYWluLmpzIiwiY2xpZW50L2pzL21vZGVscy9Vc2VyLmpzIiwiY2xpZW50L2pzL21vZGVscy9fX3Byb3RvX18uanMiLCJjbGllbnQvanMvcm91dGVyLmpzIiwiY2xpZW50L2pzL3ZpZXdzL0FkbWluLmpzIiwiY2xpZW50L2pzL3ZpZXdzL0FkbWluSXRlbS5qcyIsImNsaWVudC9qcy92aWV3cy9Db21pYy5qcyIsImNsaWVudC9qcy92aWV3cy9Db21pY01hbmFnZS5qcyIsImNsaWVudC9qcy92aWV3cy9Db21pY1Jlc291cmNlcy5qcyIsImNsaWVudC9qcy92aWV3cy9IZWFkZXIuanMiLCJjbGllbnQvanMvdmlld3MvSG9tZS5qcyIsImNsaWVudC9qcy92aWV3cy9Mb2dpbi5qcyIsImNsaWVudC9qcy92aWV3cy9Ub2FzdC5qcyIsImNsaWVudC9qcy92aWV3cy9Vc2VyLmpzIiwiY2xpZW50L2pzL3ZpZXdzL1VzZXJNYW5hZ2UuanMiLCJjbGllbnQvanMvdmlld3MvVXNlclJlc291cmNlcy5qcyIsImNsaWVudC9qcy92aWV3cy9fX3Byb3RvX18uanMiLCJjbGllbnQvanMvdmlld3MvbGliL09wdGltaXplZFJlc2l6ZS5qcyIsImNsaWVudC9qcy92aWV3cy9saWIvU3Bpbi5qcyIsImNsaWVudC9qcy92aWV3cy90ZW1wbGF0ZXMvQWRtaW4uanMiLCJjbGllbnQvanMvdmlld3MvdGVtcGxhdGVzL0FkbWluSXRlbS5qcyIsImNsaWVudC9qcy92aWV3cy90ZW1wbGF0ZXMvQ29taWMuanMiLCJjbGllbnQvanMvdmlld3MvdGVtcGxhdGVzL0NvbWljTWFuYWdlLmpzIiwiY2xpZW50L2pzL3ZpZXdzL3RlbXBsYXRlcy9Db21pY1Jlc291cmNlcy5qcyIsImNsaWVudC9qcy92aWV3cy90ZW1wbGF0ZXMvSGVhZGVyLmpzIiwiY2xpZW50L2pzL3ZpZXdzL3RlbXBsYXRlcy9Ib21lLmpzIiwiY2xpZW50L2pzL3ZpZXdzL3RlbXBsYXRlcy9Mb2dpbi5qcyIsImNsaWVudC9qcy92aWV3cy90ZW1wbGF0ZXMvVG9hc3QuanMiLCJjbGllbnQvanMvdmlld3MvdGVtcGxhdGVzL1VzZXIuanMiLCJjbGllbnQvanMvdmlld3MvdGVtcGxhdGVzL1VzZXJNYW5hZ2UuanMiLCJjbGllbnQvanMvdmlld3MvdGVtcGxhdGVzL1VzZXJSZXNvdXJjZXMuanMiLCJjbGllbnQvanMvdmlld3MvdGVtcGxhdGVzL2xpYi9mYWNlYm9vay5qcyIsImNsaWVudC9qcy92aWV3cy90ZW1wbGF0ZXMvbGliL2dvb2dsZS5qcyIsImNsaWVudC9qcy92aWV3cy90ZW1wbGF0ZXMvbGliL21haWwuanMiLCJjbGllbnQvanMvdmlld3MvdGVtcGxhdGVzL2xpYi90d2l0dGVyLmpzIiwibGliL015RXJyb3IuanMiLCJsaWIvTXlPYmplY3QuanMiLCJub2RlX21vZHVsZXMvZXZlbnRzL2V2ZW50cy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUEsT0FBTyxPQUFQLEdBQWU7QUFDZCxRQUFPLFFBQVEseUJBQVIsQ0FETztBQUVkLFlBQVcsUUFBUSw2QkFBUixDQUZHO0FBR2QsUUFBTyxRQUFRLHlCQUFSLENBSE87QUFJZCxjQUFhLFFBQVEsK0JBQVIsQ0FKQztBQUtkLGlCQUFnQixRQUFRLGtDQUFSLENBTEY7QUFNZCxTQUFRLFFBQVEsMEJBQVIsQ0FOTTtBQU9kLE9BQU0sUUFBUSx3QkFBUixDQVBRO0FBUWQsUUFBTyxRQUFRLHlCQUFSLENBUk87QUFTZCxRQUFPLFFBQVEseUJBQVIsQ0FUTztBQVVkLE9BQU0sUUFBUSx3QkFBUixDQVZRO0FBV2QsYUFBWSxRQUFRLDhCQUFSLENBWEU7QUFZZCxnQkFBZSxR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O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJtb2R1bGUuZXhwb3J0cz17XG5cdEFkbWluOiByZXF1aXJlKCcuL3ZpZXdzL3RlbXBsYXRlcy9BZG1pbicpLFxuXHRBZG1pbkl0ZW06IHJlcXVpcmUoJy4vdmlld3MvdGVtcGxhdGVzL0FkbWluSXRlbScpLFxuXHRDb21pYzogcmVxdWlyZSgnLi92aWV3cy90ZW1wbGF0ZXMvQ29taWMnKSxcblx0Q29taWNNYW5hZ2U6IHJlcXVpcmUoJy4vdmlld3MvdGVtcGxhdGVzL0NvbWljTWFuYWdlJyksXG5cdENvbWljUmVzb3VyY2VzOiByZXF1aXJlKCcuL3ZpZXdzL3RlbXBsYXRlcy9Db21pY1Jlc291cmNlcycpLFxuXHRIZWFkZXI6IHJlcXVpcmUoJy4vdmlld3MvdGVtcGxhdGVzL0hlYWRlcicpLFxuXHRIb21lOiByZXF1aXJlKCcuL3ZpZXdzL3RlbXBsYXRlcy9Ib21lJyksXG5cdExvZ2luOiByZXF1aXJlKCcuL3ZpZXdzL3RlbXBsYXRlcy9Mb2dpbicpLFxuXHRUb2FzdDogcmVxdWlyZSgnLi92aWV3cy90ZW1wbGF0ZXMvVG9hc3QnKSxcblx0VXNlcjogcmVxdWlyZSgnLi92aWV3cy90ZW1wbGF0ZXMvVXNlcicpLFxuXHRVc2VyTWFuYWdlOiByZXF1aXJlKCcuL3ZpZXdzL3RlbXBsYXRlcy9Vc2VyTWFuYWdlJyksXG5cdFVzZXJSZXNvdXJjZXM6IHJlcXVpcmUoJy4vdmlld3MvdGVtcGxhdGVzL1VzZXJSZXNvdXJjZXMnKVxufSIsIm1vZHVsZS5leHBvcnRzPXtcblx0QWRtaW46IHJlcXVpcmUoJy4vdmlld3MvQWRtaW4nKSxcblx0QWRtaW5JdGVtOiByZXF1aXJlKCcuL3ZpZXdzL0FkbWluSXRlbScpLFxuXHRDb21pYzogcmVxdWlyZSgnLi92aWV3cy9Db21pYycpLFxuXHRDb21pY01hbmFnZTogcmVxdWlyZSgnLi92aWV3cy9Db21pY01hbmFnZScpLFxuXHRDb21pY1Jlc291cmNlczogcmVxdWlyZSgnLi92aWV3cy9Db21pY1Jlc291cmNlcycpLFxuXHRIZWFkZXI6IHJlcXVpcmUoJy4vdmlld3MvSGVhZGVyJyksXG5cdEhvbWU6IHJlcXVpcmUoJy4vdmlld3MvSG9tZScpLFxuXHRMb2dpbjogcmVxdWlyZSgnLi92aWV3cy9Mb2dpbicpLFxuXHRUb2FzdDogcmVxdWlyZSgnLi92aWV3cy9Ub2FzdCcpLFxuXHRVc2VyOiByZXF1aXJlKCcuL3ZpZXdzL1VzZXInKSxcblx0VXNlck1hbmFnZTogcmVxdWlyZSgnLi92aWV3cy9Vc2VyTWFuYWdlJyksXG5cdFVzZXJSZXNvdXJjZXM6IHJlcXVpcmUoJy4vdmlld3MvVXNlclJlc291cmNlcycpXG59Iiwid2luZG93LmNvb2tpZU5hbWUgPSAnY2hlZXRvamVzdXMnXG4iLCJtb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5jcmVhdGUoIE9iamVjdC5hc3NpZ24oIHt9LCByZXF1aXJlKCcuLi8uLi9saWIvTXlPYmplY3QnKSwge1xuXG4gICAgUmVxdWVzdDoge1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKCBkYXRhICkge1xuICAgICAgICAgICAgbGV0IHJlcSA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpXG5cbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSggKCByZXNvbHZlLCByZWplY3QgKSA9PiB7XG5cbiAgICAgICAgICAgICAgICByZXEub25sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIFsgNTAwLCA0MDQsIDQwMSBdLmluY2x1ZGVzKCB0aGlzLnN0YXR1cyApXG4gICAgICAgICAgICAgICAgICAgICAgICA/IHJlamVjdCggdGhpcy5yZXNwb25zZSApXG4gICAgICAgICAgICAgICAgICAgICAgICA6IHJlc29sdmUoIEpTT04ucGFyc2UodGhpcy5yZXNwb25zZSkgKVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmKCBkYXRhLm1ldGhvZCA9PT0gXCJnZXRcIiB8fCBkYXRhLm1ldGhvZCA9PT0gXCJvcHRpb25zXCIgKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBxcyA9IGRhdGEucXMgPyBgPyR7ZGF0YS5xc31gIDogJycgXG4gICAgICAgICAgICAgICAgICAgIHJlcS5vcGVuKCBkYXRhLm1ldGhvZCwgYC8ke2RhdGEucmVzb3VyY2V9JHtxc31gIClcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRIZWFkZXJzKCByZXEsIGRhdGEuaGVhZGVycyApXG4gICAgICAgICAgICAgICAgICAgIHJlcS5zZW5kKG51bGwpXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmVxLm9wZW4oIGRhdGEubWV0aG9kLCBgLyR7ZGF0YS5yZXNvdXJjZX1gLCB0cnVlKVxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldEhlYWRlcnMoIHJlcSwgZGF0YS5oZWFkZXJzIClcbiAgICAgICAgICAgICAgICAgICAgcmVxLnNlbmQoIGRhdGEuZGF0YSApXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSApXG4gICAgICAgIH0sXG5cbiAgICAgICAgcGxhaW5Fc2NhcGUoIHNUZXh0ICkge1xuICAgICAgICAgICAgLyogaG93IHNob3VsZCBJIHRyZWF0IGEgdGV4dC9wbGFpbiBmb3JtIGVuY29kaW5nPyB3aGF0IGNoYXJhY3RlcnMgYXJlIG5vdCBhbGxvd2VkPyB0aGlzIGlzIHdoYXQgSSBzdXBwb3NlLi4uOiAqL1xuICAgICAgICAgICAgLyogXCI0XFwzXFw3IC0gRWluc3RlaW4gc2FpZCBFPW1jMlwiIC0tLS0+IFwiNFxcXFwzXFxcXDdcXCAtXFwgRWluc3RlaW5cXCBzYWlkXFwgRVxcPW1jMlwiICovXG4gICAgICAgICAgICByZXR1cm4gc1RleHQucmVwbGFjZSgvW1xcc1xcPVxcXFxdL2csIFwiXFxcXCQmXCIpO1xuICAgICAgICB9LFxuXG4gICAgICAgIHNldEhlYWRlcnMoIHJlcSwgaGVhZGVycz17fSApIHtcbiAgICAgICAgICAgIHJlcS5zZXRSZXF1ZXN0SGVhZGVyKCBcIkFjY2VwdFwiLCBoZWFkZXJzLmFjY2VwdCB8fCAnYXBwbGljYXRpb24vanNvbicgKVxuICAgICAgICAgICAgcmVxLnNldFJlcXVlc3RIZWFkZXIoIFwiQ29udGVudC1UeXBlXCIsIGhlYWRlcnMuY29udGVudFR5cGUgfHwgJ3RleHQvcGxhaW4nIClcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBfZmFjdG9yeSggZGF0YSApIHtcbiAgICAgICAgcmV0dXJuIE9iamVjdC5jcmVhdGUoIHRoaXMuUmVxdWVzdCwgeyB9ICkuY29uc3RydWN0b3IoIGRhdGEgKVxuICAgIH0sXG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcblxuICAgICAgICBpZiggIVhNTEh0dHBSZXF1ZXN0LnByb3RvdHlwZS5zZW5kQXNCaW5hcnkgKSB7XG4gICAgICAgICAgWE1MSHR0cFJlcXVlc3QucHJvdG90eXBlLnNlbmRBc0JpbmFyeSA9IGZ1bmN0aW9uKHNEYXRhKSB7XG4gICAgICAgICAgICB2YXIgbkJ5dGVzID0gc0RhdGEubGVuZ3RoLCB1aThEYXRhID0gbmV3IFVpbnQ4QXJyYXkobkJ5dGVzKTtcbiAgICAgICAgICAgIGZvciAodmFyIG5JZHggPSAwOyBuSWR4IDwgbkJ5dGVzOyBuSWR4KyspIHtcbiAgICAgICAgICAgICAgdWk4RGF0YVtuSWR4XSA9IHNEYXRhLmNoYXJDb2RlQXQobklkeCkgJiAweGZmO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5zZW5kKHVpOERhdGEpO1xuICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcy5fZmFjdG9yeS5iaW5kKHRoaXMpXG4gICAgfVxuXG59ICksIHsgfSApLmNvbnN0cnVjdG9yKClcbiIsIm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmNyZWF0ZSgge1xuXG4gICAgY3JlYXRlKCBuYW1lLCBvcHRzICkge1xuICAgICAgICBjb25zdCBsb3dlciA9IG5hbWVcbiAgICAgICAgbmFtZSA9IG5hbWUuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBuYW1lLnNsaWNlKDEpXG4gICAgICAgIHJldHVybiBPYmplY3QuY3JlYXRlKFxuICAgICAgICAgICAgdGhpcy5WaWV3c1sgbmFtZSBdLFxuICAgICAgICAgICAgT2JqZWN0LmFzc2lnbigge1xuICAgICAgICAgICAgICAgIG5hbWU6IHsgdmFsdWU6IG5hbWUgfSxcbiAgICAgICAgICAgICAgICBmYWN0b3J5OiB7IHZhbHVlOiB0aGlzIH0sXG4gICAgICAgICAgICAgICAgdGVtcGxhdGU6IHsgdmFsdWU6IHRoaXMuVGVtcGxhdGVzWyBuYW1lIF0gfSxcbiAgICAgICAgICAgICAgICB1c2VyOiB7IHZhbHVlOiB0aGlzLlVzZXIgfVxuICAgICAgICAgICAgICAgIH0sIG9wdHMgKVxuICAgICAgICApLmNvbnN0cnVjdG9yKClcbiAgICAgICAgLm9uKCAnbmF2aWdhdGUnLCByb3V0ZSA9PiByZXF1aXJlKCcuLi9yb3V0ZXInKS5uYXZpZ2F0ZSggcm91dGUgKSApXG4gICAgICAgIC5vbiggJ2RlbGV0ZWQnLCAoKSA9PiBkZWxldGUgKHJlcXVpcmUoJy4uL3JvdXRlcicpKS52aWV3c1tuYW1lXSApXG4gICAgfSxcblxufSwge1xuICAgIFRlbXBsYXRlczogeyB2YWx1ZTogcmVxdWlyZSgnLi4vLlRlbXBsYXRlTWFwJykgfSxcbiAgICBVc2VyOiB7IHZhbHVlOiByZXF1aXJlKCcuLi9tb2RlbHMvVXNlcicgKSB9LFxuICAgIFZpZXdzOiB7IHZhbHVlOiByZXF1aXJlKCcuLi8uVmlld01hcCcpIH1cbn0gKVxuIiwid2luZG93Lm9ubG9hZCA9ICgpID0+IHtcbiAgICByZXF1aXJlKCcuLy5lbnYnKVxuICAgIHJlcXVpcmUoJy4vcm91dGVyJykuaW5pdGlhbGl6ZSgpXG59XG4iLCJtb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5jcmVhdGUoIHJlcXVpcmUoJy4vX19wcm90b19fLmpzJyksIHsgcmVzb3VyY2U6IHsgdmFsdWU6ICdtZScgfSB9IClcbiIsIm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmFzc2lnbiggeyB9LCByZXF1aXJlKCcuLi8uLi8uLi9saWIvTXlPYmplY3QnKSwgcmVxdWlyZSgnZXZlbnRzJykuRXZlbnRFbWl0dGVyLnByb3RvdHlwZSwge1xuXG4gICAgWGhyOiByZXF1aXJlKCcuLi9YaHInKSxcblxuICAgIGdldCggb3B0cz17IHF1ZXJ5Ont9IH0gKSB7XG4gICAgICAgIGlmKCBvcHRzLnF1ZXJ5IHx8IHRoaXMucGFnaW5hdGlvbiApIE9iamVjdC5hc3NpZ24oIG9wdHMucXVlcnksIHRoaXMucGFnaW5hdGlvbiApXG4gICAgICAgIHJldHVybiB0aGlzLlhociggeyBtZXRob2Q6IG9wdHMubWV0aG9kIHx8ICdnZXQnLCByZXNvdXJjZTogdGhpcy5yZXNvdXJjZSwgaGVhZGVyczogdGhpcy5oZWFkZXJzIHx8IHt9LCBxczogb3B0cy5xdWVyeSA/IEpTT04uc3RyaW5naWZ5KCBvcHRzLnF1ZXJ5ICkgOiB1bmRlZmluZWQgfSApXG4gICAgICAgIC50aGVuKCByZXNwb25zZSA9PiB7XG4gICAgICAgICAgICBpZiggIXRoaXMucGFnaW5hdGlvbiApIHJldHVybiBQcm9taXNlLnJlc29sdmUoIHRoaXMuZGF0YSA9IHJlc3BvbnNlIClcblxuICAgICAgICAgICAgaWYoICF0aGlzLmRhdGEgKSB0aGlzLmRhdGEgPSBbIF1cbiAgICAgICAgICAgIHRoaXMuZGF0YSA9IHRoaXMuZGF0YS5jb25jYXQocmVzcG9uc2UpXG4gICAgICAgICAgICB0aGlzLnBhZ2luYXRpb24uc2tpcCArPSB0aGlzLnBhZ2luYXRpb24ubGltaXRcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUocmVzcG9uc2UpXG4gICAgICAgIH0gKVxuICAgIH1cblxufSApXG4iLCJtb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5jcmVhdGUoIHtcblxuICAgIEVycm9yOiByZXF1aXJlKCcuLi8uLi9saWIvTXlFcnJvcicpLFxuICAgIFxuICAgIFVzZXI6IHJlcXVpcmUoJy4vbW9kZWxzL1VzZXInKSxcblxuICAgIFZpZXdGYWN0b3J5OiByZXF1aXJlKCcuL2ZhY3RvcnkvVmlldycpLFxuICAgIFxuICAgIFZpZXdzOiByZXF1aXJlKCcuLy5WaWV3TWFwJyksXG5cbiAgICBpbml0aWFsaXplKCkge1xuICAgICAgICB0aGlzLmNvbnRlbnRDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjY29udGVudCcpXG5cbiAgICAgICAgd2luZG93Lm9ucG9wc3RhdGUgPSB0aGlzLmhhbmRsZS5iaW5kKHRoaXMpXG5cbiAgICAgICAgdGhpcy5oZWFkZXIgPSB0aGlzLlZpZXdGYWN0b3J5LmNyZWF0ZSggJ2hlYWRlcicsIHsgaW5zZXJ0aW9uOiB7IHZhbHVlOiB7IGVsOiB0aGlzLmNvbnRlbnRDb250YWluZXIsIG1ldGhvZDogJ2luc2VydEJlZm9yZScgfSB9IH0gKVxuXG4gICAgICAgIHRoaXMuVXNlci5nZXQoKS50aGVuKCAoKSA9PlxuICAgICAgICBcbiAgICAgICAgICAgIHRoaXMuaGVhZGVyLm9uVXNlcigpXG4gICAgICAgICAgICAub24oICdzaWdub3V0JywgKCkgPT4gXG4gICAgICAgICAgICAgICAgUHJvbWlzZS5hbGwoIE9iamVjdC5rZXlzKCB0aGlzLnZpZXdzICkubWFwKCBuYW1lID0+IHRoaXMudmlld3NbIG5hbWUgXS5kZWxldGUoKSApIClcbiAgICAgICAgICAgICAgICAudGhlbiggKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnZpZXdzID0geyB9XG4gICAgICAgICAgICAgICAgICAgIGhpc3RvcnkucHVzaFN0YXRlKCB7fSwgJycsICcvJyApO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCB0aGlzLmhhbmRsZSgpIClcbiAgICAgICAgICAgICAgICB9IClcbiAgICAgICAgICAgICAgICAuY2F0Y2goIHRoaXMuRXJyb3IgKVxuICAgICAgICAgICAgKVxuXG4gICAgICAgIClcbiAgICAgICAgLmNhdGNoKCB0aGlzLkVycm9yIClcbiAgICAgICAgLnRoZW4oICgpID0+IHRoaXMuaGFuZGxlKCkgKVxuXG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgfSxcblxuICAgIGhhbmRsZSgpIHtcbiAgICAgICAgdGhpcy5oYW5kbGVyKCB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUuc3BsaXQoJy8nKS5zbGljZSgxKSApXG4gICAgfSxcblxuICAgIGhhbmRsZXIoIHBhdGggKSB7XG4gICAgICAgIGNvbnN0IGlzQ29taWMgPSBCb29sZWFuKCBwYXRoWzBdICYmIHBhdGgubGVuZ3RoID09PSAxICYmICghL14oYWRtaW58Y29taWMpJC9pLnRlc3QoIHBhdGhbMF0gKSkpXG4gICAgICAgIGNvbnN0IG5hbWUgPSBpc0NvbWljXG4gICAgICAgICAgICA/ICdDb21pYydcbiAgICAgICAgICAgIDogcGF0aFswXVxuICAgICAgICAgICAgICAgID8gcGF0aFswXS5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHBhdGhbMF0uc2xpY2UoMSlcbiAgICAgICAgICAgICAgICA6ICcnO1xuICAgICAgICBcbiAgICAgICAgbGV0IHZpZXcgPSB0aGlzLlZpZXdzW25hbWVdID8gcGF0aFswXSA6ICdob21lJztcbiAgICAgICAgXG4gICAgICAgIGlmKCBpc0NvbWljICkgeyB2aWV3ID0gJ2NvbWljJzsgfVxuXG4gICAgICAgICggKCB2aWV3ID09PSB0aGlzLmN1cnJlbnRWaWV3IClcbiAgICAgICAgICAgID8gUHJvbWlzZS5yZXNvbHZlKClcbiAgICAgICAgICAgIDogUHJvbWlzZS5hbGwoIE9iamVjdC5rZXlzKCB0aGlzLnZpZXdzICkubWFwKCB2aWV3ID0+IHRoaXMudmlld3NbIHZpZXcgXS5oaWRlKCkgKSApICkgXG4gICAgICAgIC50aGVuKCAoKSA9PiB7XG5cbiAgICAgICAgICAgIHRoaXMuY3VycmVudFZpZXcgPSB2aWV3XG5cbiAgICAgICAgICAgIGlmKCB0aGlzLnZpZXdzWyB2aWV3IF0gKSByZXR1cm4gdGhpcy52aWV3c1sgdmlldyBdLm5hdmlnYXRlKCBwYXRoIClcblxuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShcbiAgICAgICAgICAgICAgICB0aGlzLnZpZXdzWyB2aWV3IF0gPVxuICAgICAgICAgICAgICAgICAgICB0aGlzLlZpZXdGYWN0b3J5LmNyZWF0ZSggdmlldywge1xuICAgICAgICAgICAgICAgICAgICAgICAgaW5zZXJ0aW9uOiB7IHZhbHVlOiB7IGVsOiB0aGlzLmNvbnRlbnRDb250YWluZXIgfSB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgcGF0aDogeyB2YWx1ZTogcGF0aCwgd3JpdGFibGU6IHRydWUgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlT3B0czogeyB2YWx1ZTogeyByZWFkT25seTogdHJ1ZSB9IH1cbiAgICAgICAgICAgICAgICAgICAgfSApXG4gICAgICAgICAgICApXG4gICAgICAgIH0gKVxuICAgICAgICAuY2F0Y2goIHRoaXMuRXJyb3IgKVxuICAgIH0sXG5cbiAgICBuYXZpZ2F0ZSggbG9jYXRpb24gKSB7XG4gICAgICAgIGhpc3RvcnkucHVzaFN0YXRlKCB7fSwgJycsIGxvY2F0aW9uIClcbiAgICAgICAgdGhpcy5oYW5kbGUoKVxuICAgIH1cblxufSwgeyBjdXJyZW50VmlldzogeyB2YWx1ZTogJycsIHdyaXRhYmxlOiB0cnVlIH0sIHZpZXdzOiB7IHZhbHVlOiB7IH0gLCB3cml0YWJsZTogdHJ1ZSB9IH0gKVxuIiwibW9kdWxlLmV4cG9ydHMgPSBPYmplY3QuYXNzaWduKCB7fSwgcmVxdWlyZSgnLi9fX3Byb3RvX18nKSwge1xuXG4gICAgZGVsZXRlKCkge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5hbGwoIE9iamVjdC5rZXlzKCB0aGlzLnN1YlZpZXdzICkubWFwKCBzdWJWaWV3ID0+IHRoaXMuc3ViVmlld3NbIHN1YlZpZXcgXS5kZWxldGUoKSApIClcbiAgICAgICAgLnRoZW4oICgpID0+IHJlcXVpcmUoJy4vX19wcm90b19fJykuZGVsZXRlLmNhbGwodGhpcykgKVxuICAgIH0sXG5cbiAgICBuYXZpZ2F0ZSggcGF0aCApIHtcbiAgICAgICAgdGhpcy5wYXRoID0gcGF0aDtcblxuICAgICAgICByZXR1cm4gKCBwYXRoLmxlbmd0aCA9PT0gMSAmJiB0aGlzLmVscy5jb250YWluZXIuY2xhc3NMaXN0LmNvbnRhaW5zKCdoaWRlJykgKVxuICAgICAgICAgICAgPyBQcm9taXNlLmFsbCggT2JqZWN0LmtleXMoIHRoaXMuc3ViVmlld3MgKS5tYXAoIHZpZXcgPT4gdGhpcy5zdWJWaWV3c1sgdmlldyBdLmhpZGUoKSApICkudGhlbiggKCkgPT4gdGhpcy5zaG93KCkgKS5jYXRjaCggdGhpcy5FcnJvciApXG4gICAgICAgICAgICA6ICggdGhpcy5wYXRoLmxlbmd0aCA+IDEgKVxuICAgICAgICAgICAgICAgID8gKCB0aGlzLmVscy5jb250YWluZXIuY2xhc3NMaXN0LmNvbnRhaW5zKCdoaWRlJykgKVxuICAgICAgICAgICAgICAgICAgICA/IHRoaXMucmVuZGVyU3ViVmlldygpXG4gICAgICAgICAgICAgICAgICAgIDogdGhpcy5oaWRlKCkudGhlbiggKCkgPT4gdGhpcy5yZW5kZXJTdWJWaWV3KCkgKVxuICAgICAgICAgICAgICAgIDogUHJvbWlzZS5yZXNvbHZlKClcbiAgICB9LFxuXG4gICAgcG9zdFJlbmRlcigpIHtcbiAgICAgICAgdGhpcy52aWV3cyA9IHsgfVxuICAgICAgICB0aGlzLnN1YlZpZXdzID0geyB9XG5cbiAgICAgICAgaWYoIHRoaXMucGF0aC5sZW5ndGggPiAxICkge1xuICAgICAgICAgICAgdGhpcy5lbHMuY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoICdoaWRlJywgJ2hpZGRlbicgKVxuICAgICAgICAgICAgdGhpcy5yZW5kZXJTdWJWaWV3KClcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMub3B0aW9ucyA9IE9iamVjdC5jcmVhdGUoIHRoaXMuTW9kZWwsIHsgcmVzb3VyY2U6IHsgdmFsdWU6ICdhZG1pbicgfSB9IClcblxuICAgICAgICB0aGlzLm9wdGlvbnMuZ2V0KCB7IG1ldGhvZDogJ29wdGlvbnMnIH0gKVxuICAgICAgICAudGhlbiggKCkgPT5cbiAgICAgICAgICAgIHRoaXMub3B0aW9ucy5kYXRhLmZvckVhY2goIGNvbGxlY3Rpb24gPT5cbiAgICAgICAgICAgICAgICB0aGlzLnZpZXdzWyBjb2xsZWN0aW9uIF0gPSB0aGlzLmZhY3RvcnkuY3JlYXRlKFxuICAgICAgICAgICAgICAgICAgICAnQWRtaW5JdGVtJyxcbiAgICAgICAgICAgICAgICAgICAgeyBpbnNlcnRpb246IHsgdmFsdWU6IHsgZWw6IHRoaXMuZWxzLmxpc3QgfSB9LFxuICAgICAgICAgICAgICAgICAgICAgIG1vZGVsOiB7IHZhbHVlOiB7IGRhdGE6IHsgY29sbGVjdGlvbiB9IH0gfSB9XG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgKVxuICAgICAgICApXG4gICAgICAgIC5jYXRjaCggdGhpcy5FcnJvciApXG5cbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICB9LFxuXG4gICAgcmVuZGVyU3ViVmlldygpIHtcbiAgICAgICAgY29uc3Qgc3ViVmlld05hbWUgPSBgJHt0aGlzLmNhcGl0YWxpemVGaXJzdExldHRlcih0aGlzLnBhdGhbMV0pfVJlc291cmNlc2BcblxuICAgICAgICByZXR1cm4gdGhpcy5zdWJWaWV3c1sgc3ViVmlld05hbWUgXVxuICAgICAgICAgICAgPyB0aGlzLnN1YlZpZXdzWyBzdWJWaWV3TmFtZSBdLm9uTmF2aWdhdGlvbiggdGhpcy5wYXRoIClcbiAgICAgICAgICAgIDogdGhpcy5zdWJWaWV3c1sgc3ViVmlld05hbWUgXSA9IHRoaXMuZmFjdG9yeS5jcmVhdGUoIHN1YlZpZXdOYW1lLCB7IHBhdGg6IHsgdmFsdWU6IHRoaXMucGF0aCwgd3JpdGFibGU6IHRydWUgfSwgaW5zZXJ0aW9uOiB7IHZhbHVlOiB7IGVsOiB0aGlzLmVscy5jb250YWluZXIsIG1ldGhvZDogJ2luc2VydEJlZm9yZScgfSB9IH0gKVxuICAgIH0sXG5cbiAgICByZXF1aXJlc0xvZ2luOiB0cnVlXG59IClcbiIsIm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmFzc2lnbigge30sIHJlcXVpcmUoJy4vX19wcm90b19fJyksIHtcblxuICAgIGV2ZW50czoge1xuICAgICAgICBjb250YWluZXI6ICdjbGljaydcbiAgICB9LFxuXG4gICAgb25Db250YWluZXJDbGljaygpIHtcbiAgICAgICAgdGhpcy5lbWl0KCAnbmF2aWdhdGUnLCBgL2FkbWluLyR7dGhpcy5tb2RlbC5kYXRhLmNvbGxlY3Rpb259YCApXG4gICAgfVxufSApXG4iLCJtb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5hc3NpZ24oIHt9LCByZXF1aXJlKCcuL19fcHJvdG9fXycpLCB7XG5cbiAgICBldmVudHM6IHtcbiAgICAgICAgY2FuY2VsOiAnY2xpY2snLFxuICAgICAgICBjb25maXJtOiAnY2xpY2snLFxuICAgICAgICBkZWxldGU6ICdjbGljaycsXG4gICAgICAgIGVkaXQ6ICdjbGljaycsXG4gICAgICAgIGZhY2Vib29rOiAnY2xpY2snLFxuICAgICAgICBnb29nbGU6ICdjbGljaycsXG4gICAgICAgIC8vc3RvcmU6ICdjbGljaycsXG4gICAgICAgIGltYWdlOiAnY2xpY2snLFxuICAgICAgICB0d2l0dGVyOiAnY2xpY2snXG4gICAgfSxcblxuICAgIGdldExpbmsoKSB7XG4gICAgICAgIGNvbnN0IHByZWZpeCA9IGVuY29kZVVSSUNvbXBvbmVudChgaHR0cDovLyR7d2luZG93LmxvY2F0aW9uLmhvc3RuYW1lfSR7d2luZG93LmxvY2F0aW9uLnBvcnR9YClcbiAgICAgICAgcmV0dXJuIGAke3ByZWZpeH0vJHt0aGlzLm1vZGVsLmRhdGEubmFtZSB8fCAnY29taWMvJyArIHRoaXMubW9kZWwuZGF0YS5faWR9YFxuICAgIH0sXG5cbiAgICBnZXRDb21pYygpIHtcbiAgICAgICAgcmV0dXJuIGAke3dpbmRvdy5sb2NhdGlvbi5vcmlnaW59JHt0aGlzLm1vZGVsLmRhdGEuaW1hZ2V9YFxuICAgIH0sXG5cbiAgICBuYXZpZ2F0ZSggcGF0aCApIHtcbiAgICAgICAgdGhpcy5wYXRoID0gcGF0aFxuICAgICAgICB0aGlzLm1vZGVsLnJlc291cmNlID0gYGNvbWljLyR7dGhpcy5wYXRoWzFdfWBcblxuICAgICAgICB0aGlzLm1vZGVsLmdldCgpXG4gICAgICAgIC50aGVuKCBjb21pYyA9PiB7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZShjb21pYylcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNob3coKVxuICAgICAgICB9IClcbiAgICAgICAgLmNhdGNoKCB0aGlzLkVycm9yIClcbiAgICB9LFxuXG4gICAgb25DYW5jZWxDbGljaygpIHtcbiAgICAgICAgdGhpcy5lbHMuaGVhZGVyLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGRlbicpXG4gICAgICAgIHRoaXMuZWxzLmNvbmZpcm1EaWFsb2cuY2xhc3NMaXN0LmFkZCgnaGlkZGVuJylcbiAgICB9LFxuXG4gICAgb25Db25maXJtQ2xpY2soKSB7XG4gICAgICAgIHRoaXMuZW1pdCgnZGVsZXRlJylcbiAgICB9LFxuXG4gICAgb25EZWxldGVDbGljaygpIHtcbiAgICAgICAgaWYoIHRoaXMudXNlciAmJiB0aGlzLnVzZXIuZGF0YS5faWQgKSB7XG4gICAgICAgICAgICB0aGlzLmVscy5oZWFkZXIuY2xhc3NMaXN0LmFkZCgnaGlkZGVuJylcbiAgICAgICAgICAgIHRoaXMuZWxzLmNvbmZpcm1EaWFsb2cuY2xhc3NMaXN0LnJlbW92ZSgnaGlkZGVuJylcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBvbkVkaXRDbGljaygpIHtcbiAgICAgICAgaWYoIHRoaXMudXNlciAmJiB0aGlzLnVzZXIuZGF0YS5faWQgKSB0aGlzLmVtaXQoJ2VkaXQnKVxuICAgIH0sXG5cbiAgICBvbkZhY2Vib29rQ2xpY2soKSB7IHdpbmRvdy5vcGVuKCBgaHR0cHM6Ly93d3cuZmFjZWJvb2suY29tL3NoYXJlci5waHA/dT0ke3RoaXMuZ2V0TGluaygpfWAgKSB9LFxuXG4gICAgb25TdG9yZUNsaWNrKCkge1xuICAgICAgICB3aW5kb3cub3BlbihcbiAgICAgICAgICAgIGBodHRwOi8vd3d3LnphenpsZS5jb20vYXBpL2NyZWF0ZS9hdC0yMzgzNTc0NzA4ODQ2ODU0Njg/cmY9MjM4MzU3NDcwODg0Njg1NDY4JmF4PURlc2lnbkJsYXN0JnNyPTI1MDc4MjQ2OTQwMDAxMzYxNiZjZz0xOTYxNjcwODUxODY0Mjg5NjEmdF9fdXNlUXBjPWZhbHNlJmRzPXRydWUmdF9fc21hcnQ9dHJ1ZSZjb250aW51ZVVybD1odHRwJTNBJTJGJTJGd3d3LnphenpsZS5jb20lMkZ0aW55aGFuZGVkJmZ3ZD1Qcm9kdWN0UGFnZSZ0Yz0maWM9JnRfaW1hZ2UxX2lpZD0ke2VuY29kZVVSSUNvbXBvbmVudCh0aGlzLmdldENvbWljKCkpfWBcbiAgICAgICAgKVxuICAgIH0sXG4gICAgXG4gICAgb25Hb29nbGVDbGljaygpIHsgd2luZG93Lm9wZW4oIGBodHRwczovL3BsdXMuZ29vZ2xlLmNvbS9zaGFyZT91cmw9JHt0aGlzLmdldExpbmsoKX1gKSB9LFxuICAgIFxuICAgIG9uSW1hZ2VDbGljaygpIHsgdGhpcy5lbWl0KCAnbmF2aWdhdGUnLCAoIHRoaXMubW9kZWwuZGF0YS5uYW1lICkgPyBgLyR7dGhpcy5tb2RlbC5kYXRhLm5hbWV9YCA6IGAvY29taWMvJHt0aGlzLm1vZGVsLmRhdGEuX2lkfWAgKSB9LFxuXG4gICAgb25Ud2l0dGVyQ2xpY2soKSB7IHdpbmRvdy5vcGVuKCBgaHR0cHM6Ly93d3cudHdpdHRlci5jb20vc2hhcmU/dXJsPSR7dGhpcy5nZXRMaW5rKCl9JnZpYT10aW55aGFuZGVkJnRleHQ9VW5wcmVzaWRlbnRlZGAgKSB9LFxuXG4gICAgcG9zdFJlbmRlcigpIHtcbiAgICAgICAgaWYoIHRoaXMubW9kZWwgJiYgdGhpcy5tb2RlbC5kYXRhLl9pZCApIHtcbiAgICAgICAgICAgIGlmKCAhIHRoaXMubW9kZWwuZGF0YS5jb250ZXh0ICkgeyB0aGlzLmVscy5jb250ZXh0LnN0eWxlLmRpc3BsYXkgPSAnbm9uZScgfVxuICAgICAgICAgICAgcmV0dXJuIHRoaXNcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHJlc291cmNlID0gdGhpcy5wYXRoLmxlbmd0aCA9PT0gMSA/IHRoaXMucGF0aFswXSA6IGBjb21pYy8ke3RoaXMucGF0aFsgMSBdIH1gXG4gICAgICAgIHRoaXMubW9kZWwgPSBPYmplY3QuY3JlYXRlKCB0aGlzLk1vZGVsLCB7IHJlc291cmNlOiB7IHZhbHVlOiByZXNvdXJjZSwgd3JpdGFibGU6IHRydWUgfSB9IClcbiAgICAgICAgdGhpcy5tb2RlbC5nZXQoKVxuICAgICAgICAudGhlbiggdGhpcy51cGRhdGUuYmluZCh0aGlzKSApXG4gICAgICAgIC5jYXRjaCggdGhpcy5FcnJvciApXG5cbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICB9LFxuXG4gICAgdXBkYXRlKGNvbWljKSB7XG4gICAgICAgIGlmKCBjb21pYyA9PT0gbnVsbCApIHJldHVybiB0aGlzLmVtaXQoICduYXZpZ2F0ZScsICcvJyApXG5cbiAgICAgICAgdGhpcy5tb2RlbC5kYXRhID0gY29taWNcbiAgICAgICAgdGhpcy5lbHMucHJlQ29udGV4dC50ZXh0Q29udGVudCA9IGNvbWljLnByZUNvbnRleHRcbiAgICAgICAgdGhpcy5lbHMucG9zdENvbnRleHQudGV4dENvbnRlbnQgPSBjb21pYy5wb3N0Q29udGV4dFxuICAgICAgICB0aGlzLmVscy5pbWFnZS5zcmMgPSBgJHtjb21pYy5pbWFnZX0/JHtuZXcgRGF0ZSgpLmdldFRpbWUoKX1gXG5cbiAgICAgICAgaWYoICEgY29taWMuY29udGV4dCApIHsgdGhpcy5lbHMuY29udGV4dC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmVscy5jb250ZXh0LnNyYyA9IGNvbWljLmNvbnRleHRcbiAgICAgICAgICAgIHRoaXMuZWxzLmNvbnRleHQuc3R5bGUuZGlzcGxheSA9ICdibG9jaydcbiAgICAgICAgfVxuICAgIH1cbn0gKVxuIiwibW9kdWxlLmV4cG9ydHMgPSBPYmplY3QuYXNzaWduKCB7fSwgcmVxdWlyZSgnLi9fX3Byb3RvX18nKSwge1xuXG4gICAgVG9hc3Q6IHJlcXVpcmUoJy4vVG9hc3QnKSxcblxuICAgIGV2ZW50czoge1xuICAgICAgICBjYW5jZWw6ICdjbGljaycsXG4gICAgICAgIHN1Ym1pdDogJ2NsaWNrJ1xuICAgIH0sXG5cbiAgICBvbkNhbmNlbENsaWNrKCkgeyB0aGlzLmhpZGUoKS50aGVuKCAoKSA9PiB0aGlzLmVtaXQoJ2NhbmNlbGxlZCcpICkgfSxcbiAgICBcbiAgICBvblN1Ym1pdENsaWNrKCkge1xuICAgICAgICB0aGlzWyBgcmVxdWVzdCR7dGhpcy5jYXBpdGFsaXplRmlyc3RMZXR0ZXIoIHRoaXMudHlwZSApfWAgXSgpXG4gICAgICAgIC5jYXRjaCggdGhpcy5FcnJvciApXG4gICAgfSxcblxuICAgIG9uTmF2aWdhdGlvbiggdHlwZSwgY29taWMgKSB7XG4gICAgICAgIHRoaXMudHlwZSA9IHR5cGVcbiAgICAgICAgdGhpcy5tb2RlbC5kYXRhID0gY29taWNcbiAgICAgICBcbiAgICAgICAgdGhpcy5wb3B1bGF0ZSgpIFxuXG4gICAgICAgIGlmKCB0aGlzLmVscy5jb250YWluZXIuY2xhc3NMaXN0LmNvbnRhaW5zKCdoaWRlJykgKSB0aGlzLnNob3coKVxuICAgIH0sXG5cbiAgICBwb3B1bGF0ZSgpIHtcbiAgICAgICAgdGhpcy5lbHMuaGVhZGVyLnRleHRDb250ZW50ID0gYCR7dGhpcy5jYXBpdGFsaXplRmlyc3RMZXR0ZXIoIHRoaXMudHlwZSApfSBDb21pY2BcblxuICAgICAgICBpZiggT2JqZWN0LmtleXMoIHRoaXMubW9kZWwuZGF0YSApLmxlbmd0aCApIHtcbiAgICAgICAgICAgIHRoaXMuZWxzLm5hbWUudmFsdWUgPSB0aGlzLm1vZGVsLmRhdGEubmFtZSB8fCAnJ1xuICAgICAgICAgICAgdGhpcy5lbHMucHJldmlldy5zcmMgPSB0aGlzLm1vZGVsLmRhdGEuaW1hZ2VcbiAgICAgICAgICAgIHRoaXMuZWxzLmNvbnRleHRQcmV2aWV3LnNyYyA9IHRoaXMubW9kZWwuZGF0YS5jb250ZXh0XG4gICAgICAgICAgICB0aGlzLmVscy5wcmVDb250ZXh0LnZhbHVlID0gdGhpcy5tb2RlbC5kYXRhLnByZUNvbnRleHRcbiAgICAgICAgICAgIHRoaXMuZWxzLnBvc3RDb250ZXh0LnZhbHVlID0gdGhpcy5tb2RlbC5kYXRhLnBvc3RDb250ZXh0XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmVscy5uYW1lLnZhbHVlID0gJydcbiAgICAgICAgICAgIHRoaXMuZWxzLnByZXZpZXcuc3JjID0gJydcbiAgICAgICAgICAgIHRoaXMuZWxzLnByZUNvbnRleHQudmFsdWUgPSAnJ1xuICAgICAgICAgICAgdGhpcy5lbHMucG9zdENvbnRleHQudmFsdWUgPSAnJ1xuICAgICAgICAgICAgdGhpcy5lbHMuY29udGV4dFByZXZpZXcuc3JjID0gJydcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBwb3N0UmVuZGVyKCkge1xuICAgICAgICB0aGlzLnNwaW5uZXIgPSBuZXcgdGhpcy5TcGlubmVyKCB7XG4gICAgICAgICAgICBjb2xvcjogJyNmZmYnLFxuICAgICAgICAgICAgbGVuZ3RoOiAxNSxcbiAgICAgICAgICAgIHNjYWxlOiAwLjI1LFxuICAgICAgICAgICAgd2lkdGg6IDVcbiAgICAgICAgfSApLnNwaW4oKVxuXG4gICAgICAgIHRoaXMucG9wdWxhdGUoKVxuXG4gICAgICAgIHRoaXMuZWxzLmltYWdlLmFkZEV2ZW50TGlzdGVuZXIoICdjaGFuZ2UnLCBlID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGJhc2U2NFJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCksXG4gICAgICAgICAgICAgICAgICBiaW5hcnlSZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHRoaXMuZWxzLnVwbG9hZC5jbGFzc0xpc3QuYWRkKCdoYXMtc3Bpbm5lcicpXG4gICAgICAgICAgICB0aGlzLmVscy51cGxvYWQuYXBwZW5kQ2hpbGQoIHRoaXMuc3Bpbm5lci5zcGluKCkuZWwgKVxuXG4gICAgICAgICAgICBiYXNlNjRSZWFkZXIub25sb2FkID0gKCBldnQgKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5lbHMudXBsb2FkLmNsYXNzTGlzdC5yZW1vdmUoJ2hhcy1zcGlubmVyJylcbiAgICAgICAgICAgICAgICB0aGlzLnNwaW5uZXIuc3RvcCgpXG4gICAgICAgICAgICAgICAgdGhpcy5lbHMucHJldmlldy5zcmMgPSBldnQudGFyZ2V0LnJlc3VsdCBcbiAgICAgICAgICAgICAgICBiaW5hcnlSZWFkZXIub25sb2FkID0gZXZlbnQgPT4gdGhpcy5iaW5hcnlGaWxlID0gZXZlbnQudGFyZ2V0LnJlc3VsdFxuICAgICAgICAgICAgICAgIGJpbmFyeVJlYWRlci5yZWFkQXNBcnJheUJ1ZmZlciggZS50YXJnZXQuZmlsZXNbMF0gKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBiYXNlNjRSZWFkZXIucmVhZEFzRGF0YVVSTCggZS50YXJnZXQuZmlsZXNbMF0gKVxuICAgICAgICB9IClcblxuICAgICAgICB0aGlzLmVscy5jb250ZXh0LmFkZEV2ZW50TGlzdGVuZXIoICdjaGFuZ2UnLCBlID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGJhc2U2NFJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCksXG4gICAgICAgICAgICAgICAgICBiaW5hcnlSZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHRoaXMuZWxzLmNvbnRleHRVcGxvYWQuY2xhc3NMaXN0LmFkZCgnaGFzLXNwaW5uZXInKVxuICAgICAgICAgICAgdGhpcy5lbHMuY29udGV4dFVwbG9hZC5hcHBlbmRDaGlsZCggdGhpcy5zcGlubmVyLnNwaW4oKS5lbCApXG5cbiAgICAgICAgICAgIGJhc2U2NFJlYWRlci5vbmxvYWQgPSAoIGV2dCApID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmVscy51cGxvYWQuY2xhc3NMaXN0LnJlbW92ZSgnaGFzLXNwaW5uZXInKVxuICAgICAgICAgICAgICAgIHRoaXMuc3Bpbm5lci5zdG9wKClcbiAgICAgICAgICAgICAgICB0aGlzLmVscy5jb250ZXh0UHJldmlldy5zcmMgPSBldnQudGFyZ2V0LnJlc3VsdCBcbiAgICAgICAgICAgICAgICBiaW5hcnlSZWFkZXIub25sb2FkID0gZXZlbnQgPT4gdGhpcy5iaW5hcnlDb250ZXh0ID0gZXZlbnQudGFyZ2V0LnJlc3VsdFxuICAgICAgICAgICAgICAgIGJpbmFyeVJlYWRlci5yZWFkQXNBcnJheUJ1ZmZlciggZS50YXJnZXQuZmlsZXNbMF0gKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBiYXNlNjRSZWFkZXIucmVhZEFzRGF0YVVSTCggZS50YXJnZXQuZmlsZXNbMF0gKVxuICAgICAgICB9IClcbiAgICAgICAgICAgIFxuICAgICAgICByZXR1cm4gdGhpc1xuICAgIH0sXG5cbiAgICByZXF1ZXN0QWRkKCkge1xuICAgICAgICBpZiggIXRoaXMuYmluYXJ5RmlsZSApIHJldHVybiBQcm9taXNlLnJlc29sdmUoKVxuXG4gICAgICAgIGxldCB1cGxvYWRzID0gWyB0aGlzLlhociggeyBtZXRob2Q6ICdQT1NUJywgcmVzb3VyY2U6ICdmaWxlJywgZGF0YTogdGhpcy5iaW5hcnlGaWxlLCBoZWFkZXJzOiB7IGNvbnRlbnRUeXBlOiAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJyB9IH0gKSBdXG5cbiAgICAgICAgaWYoIHRoaXMuYmluYXJ5Q29udGV4dCApIHVwbG9hZHMucHVzaCggdGhpcy5YaHIoIHsgbWV0aG9kOiAnUE9TVCcsIHJlc291cmNlOiAnZmlsZScsIGRhdGE6IHRoaXMuYmluYXJ5Q29udGV4dCwgaGVhZGVyczogeyBjb250ZW50VHlwZTogJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbScgfSB9ICkgKVxuXG4gICAgICAgIHJldHVybiBQcm9taXNlLmFsbCggdXBsb2FkcyApXG4gICAgICAgIC50aGVuKCAoIFsgY29taWNSZXNwb25zZSwgY29udGV4dFJlc3BvbnNlIF0gKSA9PlxuICAgICAgICAgICAgdGhpcy5YaHIoIHtcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgICAgICAgICByZXNvdXJjZTogJ2NvbWljJyxcbiAgICAgICAgICAgICAgICBkYXRhOiBKU09OLnN0cmluZ2lmeSgge1xuICAgICAgICAgICAgICAgICAgICBuYW1lOiB0aGlzLmVscy5uYW1lLnZhbHVlLFxuICAgICAgICAgICAgICAgICAgICBpbWFnZTogY29taWNSZXNwb25zZS5wYXRoLFxuICAgICAgICAgICAgICAgICAgICBwcmVDb250ZXh0OiB0aGlzLmVscy5wcmVDb250ZXh0LnZhbHVlLFxuICAgICAgICAgICAgICAgICAgICBjb250ZXh0OiBjb250ZXh0UmVzcG9uc2UgPyBjb250ZXh0UmVzcG9uc2UucGF0aCA6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICAgICAgcG9zdENvbnRleHQ6IHRoaXMuZWxzLnBvc3RDb250ZXh0LnZhbHVlLFxuICAgICAgICAgICAgICAgICAgICBjcmVhdGVkOiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKClcbiAgICAgICAgICAgICAgICB9IClcbiAgICAgICAgICAgIH0gKVxuICAgICAgICApXG4gICAgICAgIC50aGVuKCByZXNwb25zZSA9PiB0aGlzLmhpZGUoKS50aGVuKCAoKSA9PiB0aGlzLmVtaXQoICdhZGRlZCcsIHJlc3BvbnNlICkgKSApXG4gICAgICAgIC5jYXRjaCggZSA9PiB7IHRoaXMuRXJyb3IoZSk7IH0gKVxuICAgIH0sXG5cbiAgICByZXF1ZXN0RWRpdCgpIHtcbiAgICAgICAgbGV0IGRhdGEgPSB7IG5hbWU6IHRoaXMuZWxzLm5hbWUudmFsdWUgfVxuICAgICAgICBcbiAgICAgICAgcmV0dXJuICggKCB0aGlzLmJpbmFyeUZpbGUgKVxuICAgICAgICAgICAgPyB0aGlzLlhociggeyBtZXRob2Q6ICdQQVRDSCcsIHJlc291cmNlOiBgZmlsZS8ke3RoaXMubW9kZWwuZGF0YS5pbWFnZS5zcGxpdCgnLycpWzRdfWAsIGRhdGE6IHRoaXMuYmluYXJ5RmlsZSwgaGVhZGVyczogeyBjb250ZW50VHlwZTogJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbScgfSB9IClcbiAgICAgICAgICAgIDogUHJvbWlzZS5yZXNvbHZlKCkgKVxuICAgICAgICAudGhlbiggKCkgPT4gdGhpcy5YaHIoIHsgbWV0aG9kOiAnUEFUQ0gnLCByZXNvdXJjZTogYGNvbWljLyR7dGhpcy5tb2RlbC5kYXRhLl9pZH1gLCBkYXRhOiBKU09OLnN0cmluZ2lmeSggZGF0YSApIH0gKSApXG4gICAgICAgIC50aGVuKCByZXNwb25zZSA9PiB0aGlzLmhpZGUoKS50aGVuKCAoKSA9PiB0aGlzLmVtaXQoICdlZGl0ZWQnLCByZXNwb25zZSApICkgKVxuICAgICAgICAuY2F0Y2goIGUgPT4geyB0aGlzLkVycm9yKGUpOyB9IClcbiAgICB9XG59IClcbiIsIm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmFzc2lnbigge30sIHJlcXVpcmUoJy4vX19wcm90b19fJyksIHtcblxuICAgIGNyZWF0ZUNvbWljVmlldyggY29taWMsIG9wdHM9e30gKSB7XG4gICAgICAgIHRoaXMudmlld3NbIGNvbWljLl9pZCBdID0gdGhpcy5mYWN0b3J5LmNyZWF0ZShcbiAgICAgICAgICAgICdDb21pYycsXG4gICAgICAgICAgICB7IGluc2VydGlvbjogb3B0cy5pbnNlcnRpb24gfHwgeyB2YWx1ZTogeyBlbDogdGhpcy5lbHMubGlzdCB9IH0sXG4gICAgICAgICAgICAgIG1vZGVsOiB7IHZhbHVlOiB7IGRhdGE6IGNvbWljIH0gfVxuICAgICAgICAgICAgfVxuICAgICAgICApXG5cbiAgICAgICAgdGhpcy52aWV3c1sgY29taWMuX2lkIF1cbiAgICAgICAgLm9uKCAnZWRpdCcsICgpID0+IHRoaXMuZW1pdCggJ25hdmlnYXRlJywgYC9hZG1pbi9jb21pYy9lZGl0LyR7Y29taWMuX2lkfWApIClcbiAgICAgICAgLm9uKCAnZGVsZXRlJywgKCkgPT5cbiAgICAgICAgICAgIHRoaXMuWGhyKCB7IG1ldGhvZDogJ2RlbGV0ZScsIHJlc291cmNlOiBgY29taWMvJHtjb21pYy5faWR9YCB9IClcbiAgICAgICAgICAgIC50aGVuKCAoKSA9PiB0aGlzLnZpZXdzWyBjb21pYy5faWQgXS5kZWxldGUoKSApXG4gICAgICAgICAgICAuY2F0Y2goIHRoaXMuRXJyb3IgKVxuICAgICAgICApXG4gICAgfSxcblxuICAgIGRlbGV0ZSgpIHtcbiAgICAgICAgcmV0dXJuICggKCB0aGlzLnZpZXdzLkNvbWljTWFuYWdlIClcbiAgICAgICAgICAgID8gdGhpcy52aWV3cy5Db21pY01hbmFnZS5kZWxldGUoKVxuICAgICAgICAgICAgOiBQcm9taXNlLnJlc29sdmUoKSApXG4gICAgICAgIC50aGVuKCAoKSA9PiByZXF1aXJlKCcuL19fcHJvdG9fXycpLmRlbGV0ZS5jYWxsKHRoaXMpIClcbiAgICB9LFxuXG4gICAgZXZlbnRzOiB7XG4gICAgICAgIGFkZEJ0bjogJ2NsaWNrJ1xuICAgIH0sXG5cbiAgICBmZXRjaEFuZERpc3BsYXkoKSB7XG4gICAgICAgIHRoaXMuZmV0Y2hpbmcgPSB0cnVlXG4gICAgICAgIHJldHVybiB0aGlzLmNvbWljcy5nZXQoKVxuICAgICAgICAudGhlbiggcmVzcG9uc2UgPT4ge1xuICAgICAgICAgICAgcmVzcG9uc2UuZm9yRWFjaCggY29taWMgPT4gdGhpcy5jcmVhdGVDb21pY1ZpZXcoY29taWMpIClcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodGhpcy5mZXRjaGluZyA9IGZhbHNlIClcbiAgICAgICAgfSApXG4gICAgfSxcblxuICAgIG1hbmFnZUNvbWljKCB0eXBlLCBjb21pYyApIHtcbiAgICAgICAgdGhpcy52aWV3cy5Db21pY01hbmFnZSBcbiAgICAgICAgICAgID8gdGhpcy52aWV3cy5Db21pY01hbmFnZS5vbk5hdmlnYXRpb24oIHR5cGUsIGNvbWljIClcbiAgICAgICAgICAgIDogdGhpcy52aWV3cy5Db21pY01hbmFnZSA9XG4gICAgICAgICAgICAgICAgdGhpcy5mYWN0b3J5LmNyZWF0ZSggJ0NvbWljTWFuYWdlJywgeyB0eXBlOiB7IHZhbHVlOiB0eXBlLCB3cml0YWJsZTogdHJ1ZSB9LCBtb2RlbDogeyB2YWx1ZTogeyBkYXRhOiBjb21pYyB8fCB7fSB9IH0sIGluc2VydGlvbjogeyB2YWx1ZTogeyBlbDogdGhpcy5lbHMuY29udGFpbmVyLCBtZXRob2Q6ICdpbnNlcnRCZWZvcmUnIH0gfSB9IClcbiAgICAgICAgICAgICAgICAub24oICdhZGRlZCcsIGNvbWljID0+IHsgdGhpcy5jcmVhdGVDb21pY1ZpZXcoY29taWMsIHsgaW5zZXJ0aW9uOiB7IHZhbHVlOiB7IGVsOiB0aGlzLmVscy5saXN0LmZpcnN0Q2hpbGQsIG1ldGhvZDogJ2luc2VydEJlZm9yZScgfSB9IH0gKTsgdGhpcy5lbWl0KCAnbmF2aWdhdGUnLCBgL2FkbWluL2NvbWljYCApOyB9IClcbiAgICAgICAgICAgICAgICAub24oICdjYW5jZWxsZWQnLCAoKSA9PiB0aGlzLmVtaXQoICduYXZpZ2F0ZScsIGAvYWRtaW4vY29taWNgICkgKVxuICAgICAgICAgICAgICAgIC5vbiggJ2VkaXRlZCcsIGNvbWljID0+IHsgdGhpcy52aWV3c1sgY29taWMuX2lkIF0udXBkYXRlKCBjb21pYyApOyB0aGlzLmVtaXQoICduYXZpZ2F0ZScsIGAvYWRtaW4vY29taWNgICk7IH0gKVxuICAgIH0sXG5cbiAgICBvbkFkZEJ0bkNsaWNrKCkgeyB0aGlzLmVtaXQoICduYXZpZ2F0ZScsIGAvYWRtaW4vY29taWMvYWRkYCApIH0sXG5cbiAgICBvbk5hdmlnYXRpb24oIHBhdGggKSB7XG4gICAgICAgIHRoaXMucGF0aCA9IHBhdGg7XG5cbiAgICAgICAgKCBwYXRoLmxlbmd0aCA9PT0gMiAmJiB0aGlzLmVscy5jb250YWluZXIuY2xhc3NMaXN0LmNvbnRhaW5zKCdoaWRlJykgKSBcbiAgICAgICAgICAgID8gdGhpcy52aWV3cy5Db21pY01hbmFnZSAmJiAhdGhpcy52aWV3cy5Db21pY01hbmFnZS5lbHMuY29udGFpbmVyLmNsYXNzTGlzdC5jb250YWlucygnaGlkZScpXG4gICAgICAgICAgICAgICAgPyB0aGlzLnZpZXdzLkNvbWljTWFuYWdlLmhpZGUoKS50aGVuKCAoKSA9PiB0aGlzLnNob3coKSApXG4gICAgICAgICAgICAgICAgOiB0aGlzLnNob3coKVxuICAgICAgICAgICAgOiBwYXRoLmxlbmd0aCA9PT0gM1xuICAgICAgICAgICAgICAgID8gdGhpcy5oaWRlKCkudGhlbiggKCkgPT4gdGhpcy5tYW5hZ2VDb21pYyggcGF0aFsyXSwgeyB9ICkgKVxuICAgICAgICAgICAgICAgIDogcGF0aC5sZW5ndGggPT09IDRcbiAgICAgICAgICAgICAgICAgICAgID8gdGhpcy5oaWRlKCkudGhlbiggKCkgPT4gdGhpcy5tYW5hZ2VDb21pYyggcGF0aFsyXSwgdGhpcy52aWV3c1sgcGF0aFszXSBdLm1vZGVsLmRhdGEgKSApXG4gICAgICAgICAgICAgICAgICAgICA6IHVuZGVmaW5lZFxuICAgIH0sXG5cbiAgICBvblNjcm9sbCggZSApIHtcbiAgICAgICAgaWYoIHRoaXMuZmV0Y2hpbmcgfHwgdGhpcy5pc0hpZGRlbigpICkgcmV0dXJuXG4gICAgICAgIGlmKCAoIHRoaXMuY29udGVudC5vZmZzZXRIZWlnaHQgLSAoIHdpbmRvdy5zY3JvbGxZICsgd2luZG93LmlubmVySGVpZ2h0ICkgKSA8IDEwMCApIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoIHRoaXMuZmV0Y2hBbmREaXNwbGF5LmJpbmQodGhpcykuY2F0Y2goIHRoaXMuRXJyb3IgKSApXG4gICAgfSxcblxuICAgIHBvc3RSZW5kZXIoKSB7XG4gICAgICAgIHRoaXMuY29udGVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNjb250ZW50JylcblxuICAgICAgICBpZiggdGhpcy5wYXRoLmxlbmd0aCA+IDIgKSB7XG4gICAgICAgICAgICB0aGlzLmVscy5jb250YWluZXIuY2xhc3NMaXN0LmFkZCggJ2hpZGRlbicsICdoaWRlJyApXG4gICAgICAgICAgICBpZiggdGhpcy5wYXRoWzJdID09PSBcImFkZFwiICkgeyB0aGlzLm1hbmFnZUNvbWljKCBcImFkZFwiLCB7IH0gKSB9XG4gICAgICAgICAgICBlbHNlIGlmKCB0aGlzLnBhdGhbMl0gPT09IFwiZWRpdFwiICYmIHRoaXMucGF0aFszXSApIHtcbiAgICAgICAgICAgICAgICB0aGlzLlhociggeyBtZXRob2Q6IFwiZ2V0XCIsIHJlc291cmNlOiBgY29taWMvJHt0aGlzLnBhdGhbM119YCB9IClcbiAgICAgICAgICAgICAgICAudGhlbiggcmVzcG9uc2UgPT4gdGhpcy5tYW5hZ2VDb21pYyggXCJlZGl0XCIsIHJlc3BvbnNlICkgKVxuICAgICAgICAgICAgICAgIC5jYXRjaCggZSA9PiB7IHRoaXMuRXJyb3IoZSk7IHRoaXMuZW1pdCggJ25hdmlnYXRlJywgYC9hZG1pbi9jb21pY2AgKSB9IClcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmKCB0aGlzLnBhdGgubGVuZ3RoID09PSAxICYmIHRoaXMudmlld3MuQ29taWNNYW5hZ2UgKSB7XG4gICAgICAgICAgICB0aGlzLnZpZXdzLkNvbWljTWFuYWdlLmhpZGUoKVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jb21pY3MgPSBPYmplY3QuY3JlYXRlKCB0aGlzLk1vZGVsLCB7IHBhZ2luYXRpb246IHsgdmFsdWU6IHsgc2tpcDogMCwgbGltaXQ6MTAsIHNvcnQ6IHsgY3JlYXRlZDogLTEgfSB9IH0sIHJlc291cmNlOiB7IHZhbHVlOiAnY29taWMnIH0gfSApXG4gICAgICAgIFxuICAgICAgICB0aGlzLmZldGNoQW5kRGlzcGxheSgpLmNhdGNoKCB0aGlzLkVycm9yIClcblxuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lciggJ3Njcm9sbCcsIGUgPT4gdGhpcy5vblNjcm9sbChlKSApXG5cbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICB9LFxuXG4gICAgcmVxdWlyZXNMb2dpbjogdHJ1ZVxufSApXG4iLCJtb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5hc3NpZ24oIHt9LCByZXF1aXJlKCcuL19fcHJvdG9fXycpLCB7XG5cbiAgICBldmVudHM6IHtcbiAgICAgICAgbG9nbzogJ2NsaWNrJ1xuICAgIH0sXG5cbiAgICBvblVzZXIoKSB7XG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgfSxcblxuICAgIG9uTG9nb0NsaWNrKCkge1xuICAgICAgICB0aGlzLmVtaXQoICduYXZpZ2F0ZScsICcvJyApXG4gICAgfSxcblxuICAgIHJlcXVpcmVzTG9naW46IGZhbHNlLFxuICAgIFxuICAgIHNpZ25vdXQoKSB7XG5cbiAgICAgICAgZG9jdW1lbnQuY29va2llID0gYCR7d2luZG93LmNvb2tpZU5hbWV9PTsgZXhwaXJlcz1UaHUsIDAxIEphbiAxOTcwIDAwOjAwOjAxIEdNVDtgO1xuXG4gICAgICAgIGlmKCB0aGlzLnVzZXIuZGF0YS5faWQgKSB7XG4gICAgICAgICAgICB0aGlzLnVzZXIuZGF0YSA9IHsgfVxuICAgICAgICAgICAgdGhpcy5lbWl0KCAnc2lnbm91dCcgKVxuICAgICAgICB9XG5cbiAgICB9XG5cbn0gKVxuIiwibW9kdWxlLmV4cG9ydHMgPSBPYmplY3QuYXNzaWduKCB7fSwgcmVxdWlyZSgnLi9fX3Byb3RvX18nKSwge1xuXG4gICAgZmV0Y2hBbmREaXNwbGF5KCkge1xuICAgICAgICB0aGlzLmZldGNoaW5nID0gdHJ1ZVxuICAgICAgICByZXR1cm4gdGhpcy5nZXREYXRhKClcbiAgICAgICAgLnRoZW4oIHJlc3BvbnNlID0+IHtcbiAgICAgICAgICAgIHJlc3BvbnNlLmZvckVhY2goIGNvbWljID0+XG4gICAgICAgICAgICAgICAgdGhpcy52aWV3c1sgY29taWMuX2lkIF0gPVxuICAgICAgICAgICAgICAgICAgICB0aGlzLmZhY3RvcnkuY3JlYXRlKCAnY29taWMnLCB7IGluc2VydGlvbjogeyB2YWx1ZTogeyBlbDogdGhpcy5lbHMuY29udGFpbmVyIH0gfSwgbW9kZWw6IHsgdmFsdWU6IHsgZGF0YTogY29taWMgfSB9LCB0ZW1wbGF0ZU9wdHM6IHsgdmFsdWU6IHsgcmVhZE9ubHk6IHRydWUgfSB9IH0gKVxuICAgICAgICAgICAgKVxuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh0aGlzLmZldGNoaW5nID0gZmFsc2UgKVxuICAgICAgICB9IClcbiAgICB9LFxuXG4gICAgZ2V0RGF0YSgpIHtcbiAgICAgICAgaWYoICF0aGlzLm1vZGVsICkgdGhpcy5tb2RlbCA9IE9iamVjdC5jcmVhdGUoIHRoaXMuTW9kZWwsIHsgcGFnaW5hdGlvbjogeyB2YWx1ZTogeyBza2lwOiAwLCBsaW1pdDoxMCwgc29ydDogeyBjcmVhdGVkOiAtMSB9IH0gfSwgcmVzb3VyY2U6IHsgdmFsdWU6ICdjb21pYycgfSB9IClcblxuICAgICAgICByZXR1cm4gdGhpcy5tb2RlbC5nZXQoKVxuICAgIH0sXG5cbiAgICBuYXZpZ2F0ZSgpIHtcbiAgICAgICAgdGhpcy5zaG93KClcbiAgICB9LFxuXG4gICAgb25TY3JvbGwoIGUgKSB7XG4gICAgICAgIGlmKCB0aGlzLmZldGNoaW5nICkgcmV0dXJuXG4gICAgICAgIGlmKCAoIHRoaXMuY29udGVudC5vZmZzZXRIZWlnaHQgLSAoIHdpbmRvdy5zY3JvbGxZICsgd2luZG93LmlubmVySGVpZ2h0ICkgKSA8IDEwMCApIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoIHRoaXMuZmV0Y2hBbmREaXNwbGF5LmJpbmQodGhpcykgKVxuICAgIH0sXG5cbiAgICBwb3N0UmVuZGVyKCkge1xuICAgICAgICB0aGlzLmNvbnRlbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjY29udGVudCcpXG4gICAgICAgIFxuICAgICAgICB0aGlzLmZldGNoQW5kRGlzcGxheSgpLmNhdGNoKCB0aGlzLkVycm9yIClcblxuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lciggJ3Njcm9sbCcsIGUgPT4gdGhpcy5vblNjcm9sbChlKSApXG5cbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICB9XG5cbn0gKVxuIiwibW9kdWxlLmV4cG9ydHMgPSBPYmplY3QuYXNzaWduKCB7fSwgcmVxdWlyZSgnLi9fX3Byb3RvX18nKSwge1xuICAgIFxuICAgIGV2ZW50czoge1xuICAgICAgICBzdWJtaXQ6ICdjbGljaydcbiAgICB9LFxuXG4gICAgb25TdWJtaXRDbGljaygpIHtcbiAgICAgICAgdGhpcy5YaHIoIHsgbWV0aG9kOiAncG9zdCcsIHJlc291cmNlOiAnYXV0aCcsIGRhdGE6IEpTT04uc3RyaW5naWZ5KCB7IHVzZXJuYW1lOiB0aGlzLmVscy51c2VybmFtZS52YWx1ZSwgcGFzc3dvcmQ6IHRoaXMuZWxzLnBhc3N3b3JkLnZhbHVlIH0gKSB9IClcbiAgICAgICAgLnRoZW4oICgpID0+IHRoaXMudXNlci5nZXQoKSApXG4gICAgICAgIC50aGVuKCAoKSA9PiB0aGlzLmhpZGUoKSApXG4gICAgICAgIC50aGVuKCAoKSA9PiBQcm9taXNlLnJlc29sdmUoIHRoaXMuZW1pdCggJ2xvZ2dlZEluJyApKSApXG4gICAgICAgIC5jYXRjaCggdGhpcy5FcnJvciApXG4gICAgfVxufSApXG4iLCJtb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5jcmVhdGUoIE9iamVjdC5hc3NpZ24oIHt9LCByZXF1aXJlKCcuL19fcHJvdG9fXycpLCB7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oIHRoaXMsIHtcbiAgICAgICAgICAgIGVsczogeyB9LFxuICAgICAgICAgICAgc2x1cnA6IHsgYXR0cjogJ2RhdGEtanMnLCB2aWV3OiAnZGF0YS12aWV3JyB9LFxuICAgICAgICAgICAgdGVtcGxhdGU6IHJlcXVpcmUoJy4vdGVtcGxhdGVzL1RvYXN0JylcbiAgICAgICAgfSApXG4gICAgICAgIC5yZW5kZXIoKVxuICAgIH0sXG5cbiAgICBmYWN0b3J5KCB0ZXh0ICkge1xuICAgICAgICB0aGlzLmVscy5jb250ZW50LnRleHRDb250ZW50ID0gdGV4dFxuICAgICAgICByZXR1cm4gdGhpcy5zaG93KCkudGhlbiggKCkgPT4gdGhpcy5oaWRlKCkgKVxuICAgIH0sXG5cbiAgICBpbnNlcnRpb246IHsgZWw6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2JvZHknKSB9LFxuXG4gICAgbmFtZTogJ1RvYXN0JyxcblxuICAgIHBvc3RSZW5kZXIoKSB7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuZmFjdG9yeS5iaW5kKHRoaXMpXG4gICAgfVxuICAgIFxufSApLCB7IH0gKS5jb25zdHJ1Y3RvcigpXG4iLCJtb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5hc3NpZ24oIHt9LCByZXF1aXJlKCcuL19fcHJvdG9fXycpLCB7XG5cbiAgICBldmVudHM6IHtcbiAgICAgICAgY2FuY2VsOiAnY2xpY2snLFxuICAgICAgICBjb25maXJtOiAnY2xpY2snLFxuICAgICAgICBkZWxldGU6ICdjbGljaycsXG4gICAgICAgIGVkaXQ6ICdjbGljaydcbiAgICB9LFxuXG4gICAgb25DYW5jZWxDbGljaygpIHtcbiAgICAgICAgdGhpcy5lbHMudXNlcm5hbWUuY2xhc3NMaXN0LnJlbW92ZSgnaGlkZGVuJylcbiAgICAgICAgdGhpcy5lbHMuY29uZmlybURpYWxvZy5jbGFzc0xpc3QuYWRkKCdoaWRkZW4nKVxuICAgIH0sXG5cbiAgICBvbkNvbmZpcm1DbGljaygpIHtcbiAgICAgICAgdGhpcy5lbWl0KCdkZWxldGUnKVxuICAgIH0sXG5cbiAgICBvbkRlbGV0ZUNsaWNrKCkge1xuICAgICAgICBpZiggdGhpcy51c2VyICYmIHRoaXMudXNlci5kYXRhLl9pZCApIHtcbiAgICAgICAgICAgIHRoaXMuZWxzLnVzZXJuYW1lLmNsYXNzTGlzdC5hZGQoJ2hpZGRlbicpXG4gICAgICAgICAgICB0aGlzLmVscy5jb25maXJtRGlhbG9nLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGRlbicpXG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgb25FZGl0Q2xpY2soKSB7XG4gICAgICAgIGlmKCB0aGlzLnVzZXIgJiYgdGhpcy51c2VyLmRhdGEuX2lkICkgdGhpcy5lbWl0KCdlZGl0JylcbiAgICB9LFxuXG4gICAgdXBkYXRlKHVzZXIpIHtcbiAgICAgICAgdGhpcy51c2VyLmRhdGEgPSB1c2VyXG4gICAgICAgIHRoaXMuZWxzLnVzZXJuYW1lLnRleHRDb250ZW50ID0gdXNlci51c2VybmFtZVxuICAgIH1cblxufSApXG4iLCJtb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5hc3NpZ24oIHt9LCByZXF1aXJlKCcuL19fcHJvdG9fXycpLCB7XG5cbiAgICBldmVudHM6IHtcbiAgICAgICAgY2FuY2VsOiAnY2xpY2snLFxuICAgICAgICBzdWJtaXQ6ICdjbGljaydcbiAgICB9LFxuXG4gICAgb25DYW5jZWxDbGljaygpIHsgdGhpcy5oaWRlKCkudGhlbiggKCkgPT4gdGhpcy5lbWl0KCdjYW5jZWxsZWQnKSApIH0sXG4gICAgXG4gICAgb25TdWJtaXRDbGljaygpIHtcbiAgICAgICAgdGhpc1sgYHJlcXVlc3Qke3RoaXMuY2FwaXRhbGl6ZUZpcnN0TGV0dGVyKCB0aGlzLnR5cGUgKX1gIF0oKVxuICAgICAgICAuY2F0Y2goIHRoaXMuRXJyb3IgKVxuICAgIH0sXG5cbiAgICBvbk5hdmlnYXRpb24oIHR5cGUsIGNvbWljICkge1xuICAgICAgICB0aGlzLnR5cGUgPSB0eXBlXG4gICAgICAgIHRoaXMubW9kZWwuZGF0YSA9IGNvbWljXG4gICAgICAgXG4gICAgICAgIHRoaXMucG9wdWxhdGUoKSBcbiAgICAgICAgXG4gICAgICAgIGlmKCB0aGlzLmVscy5jb250YWluZXIuY2xhc3NMaXN0LmNvbnRhaW5zKCdoaWRlJykgKSB0aGlzLnNob3coKVxuICAgIH0sXG5cbiAgICBwb3B1bGF0ZSgpIHtcbiAgICAgICAgdGhpcy5lbHMudGl0bGUudGV4dENvbnRlbnQgPSBgJHt0aGlzLmNhcGl0YWxpemVGaXJzdExldHRlciggdGhpcy50eXBlICl9IFVzZXJgXG5cbiAgICAgICAgdGhpcy5lbHMudXNlcm5hbWUudmFsdWUgPSBPYmplY3Qua2V5cyggdGhpcy5tb2RlbC5kYXRhICkubGVuZ3RoID8gdGhpcy5tb2RlbC5kYXRhLnVzZXJuYW1lIDogJydcbiAgICAgICAgdGhpcy5lbHMucGFzc3dvcmQudmFsdWUgPSAnJ1xuICAgIH0sXG5cbiAgICBwb3N0UmVuZGVyKCkge1xuICAgICAgICB0aGlzLnBvcHVsYXRlKCkgXG4gICAgICAgICAgICBcbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICB9LFxuXG4gICAgcmVxdWVzdEFkZCgpIHtcbiAgICAgICAgaWYoIHRoaXMuZWxzLnBhc3N3b3JkLnZhbHVlLmxlbmd0aCA9PT0gMCApIHJldHVyblxuICAgICAgICByZXR1cm4gdGhpcy5YaHIoIHsgbWV0aG9kOiAnUE9TVCcsIHJlc291cmNlOiAndXNlcicsIGRhdGE6IEpTT04uc3RyaW5naWZ5KCB7IHVzZXJuYW1lOiB0aGlzLmVscy51c2VybmFtZS52YWx1ZSwgcGFzc3dvcmQ6IHRoaXMuZWxzLnBhc3N3b3JkLnZhbHVlIH0gKSB9IClcbiAgICAgICAgLnRoZW4oIHJlc3BvbnNlID0+IHRoaXMuaGlkZSgpLnRoZW4oICgpID0+IHRoaXMuZW1pdCggJ2FkZGVkJywgeyBfaWQ6IHJlc3BvbnNlLl9pZCwgdXNlcm5hbWU6IHJlc3BvbnNlLnVzZXJuYW1lIH0gKSApIClcbiAgICB9LFxuXG4gICAgcmVxdWVzdEVkaXQoKSB7XG4gICAgICAgIGxldCBkYXRhID0geyB1c2VybmFtZTogdGhpcy5lbHMudXNlcm5hbWUudmFsdWUgfVxuXG4gICAgICAgIGlmKCB0aGlzLmVscy5wYXNzd29yZC52YWx1ZS5sZW5ndGggKSBkYXRhLnBhc3N3b3JkID0gdGhpcy5lbHMucGFzc3dvcmQudmFsdWVcbiAgICAgICAgcmV0dXJuIHRoaXMuWGhyKCB7IG1ldGhvZDogJ1BBVENIJywgcmVzb3VyY2U6IGB1c2VyLyR7dGhpcy51c2VyLmRhdGEuX2lkfWAsIGRhdGE6IEpTT04uc3RyaW5naWZ5KCBkYXRhICkgfSApXG4gICAgICAgIC50aGVuKCByZXNwb25zZSA9PiB0aGlzLmhpZGUoKS50aGVuKCAoKSA9PiB0aGlzLmVtaXQoICdlZGl0ZWQnLCB7IF9pZDogcmVzcG9uc2UuX2lkLCB1c2VybmFtZTogcmVzcG9uc2UudXNlcm5hbWUgfSApICkgKVxuICAgIH1cbn0gKVxuIiwibW9kdWxlLmV4cG9ydHMgPSBPYmplY3QuYXNzaWduKCB7fSwgcmVxdWlyZSgnLi9fX3Byb3RvX18nKSwge1xuXG4gICAgY3JlYXRlVXNlclZpZXcoIHVzZXIgKSB7XG4gICAgICAgIHRoaXMudmlld3NbIHVzZXIuX2lkIF0gPSB0aGlzLmZhY3RvcnkuY3JlYXRlKFxuICAgICAgICAgICAgJ1VzZXInLFxuICAgICAgICAgICAgeyBpbnNlcnRpb246IHsgdmFsdWU6IHsgZWw6IHRoaXMuZWxzLmxpc3QgfSB9LFxuICAgICAgICAgICAgICBtb2RlbDogeyB2YWx1ZTogeyBkYXRhOiB1c2VyIH0gfVxuICAgICAgICAgICAgfVxuICAgICAgICApXG5cbiAgICAgICAgdGhpcy52aWV3c1sgdXNlci5faWQgXVxuICAgICAgICAub24oICdlZGl0JywgKCkgPT4gdGhpcy5lbWl0KCAnbmF2aWdhdGUnLCBgL2FkbWluL3VzZXIvZWRpdC8ke3VzZXIuX2lkfWApIClcbiAgICAgICAgLm9uKCAnZGVsZXRlJywgKCkgPT5cbiAgICAgICAgICAgIHRoaXMuWGhyKCB7IG1ldGhvZDogJ2RlbGV0ZScsIHJlc291cmNlOiBgdXNlci8ke3VzZXIuX2lkfWAgfSApXG4gICAgICAgICAgICAudGhlbiggKCkgPT4gdGhpcy52aWV3c1sgdXNlci5faWQgXS5kZWxldGUoKSApXG4gICAgICAgICAgICAuY2F0Y2goIHRoaXMuRXJyb3IgKVxuICAgICAgICApXG4gICAgfSxcblxuICAgIGRlbGV0ZSgpIHtcbiAgICAgICAgcmV0dXJuICggKCB0aGlzLnZpZXdzLlVzZXJNYW5hZ2UgKVxuICAgICAgICAgICAgPyB0aGlzLnZpZXdzLlVzZXJNYW5hZ2UuZGVsZXRlKClcbiAgICAgICAgICAgIDogUHJvbWlzZS5yZXNvbHZlKCkgKVxuICAgICAgICAudGhlbiggKCkgPT4gcmVxdWlyZSgnLi9fX3Byb3RvX18nKS5kZWxldGUuY2FsbCh0aGlzKSApXG4gICAgfSxcblxuICAgIGV2ZW50czoge1xuICAgICAgICBhZGRCdG46ICdjbGljaydcbiAgICB9LFxuXG4gICAgbWFuYWdlVXNlciggdHlwZSwgdXNlciApIHtcbiAgICAgICAgdGhpcy52aWV3cy5Vc2VyTWFuYWdlIFxuICAgICAgICAgICAgPyB0aGlzLnZpZXdzLlVzZXJNYW5hZ2Uub25OYXZpZ2F0aW9uKCB0eXBlLCB1c2VyIClcbiAgICAgICAgICAgIDogdGhpcy52aWV3cy5Vc2VyTWFuYWdlID1cbiAgICAgICAgICAgICAgICB0aGlzLmZhY3RvcnkuY3JlYXRlKCAnVXNlck1hbmFnZScsIHsgdHlwZTogeyB2YWx1ZTogdHlwZSwgd3JpdGFibGU6IHRydWUgfSwgbW9kZWw6IHsgdmFsdWU6IHsgZGF0YTogdXNlciB8fCB7fSB9IH0sIGluc2VydGlvbjogeyB2YWx1ZTogeyBlbDogdGhpcy5lbHMuY29udGFpbmVyLCBtZXRob2Q6ICdpbnNlcnRCZWZvcmUnIH0gfSB9IClcbiAgICAgICAgICAgICAgICAgICAgLm9uKCAnYWRkZWQnLCB1c2VyID0+IHsgdGhpcy5jcmVhdGVVc2VyVmlldyh1c2VyKTsgdGhpcy5lbWl0KCAnbmF2aWdhdGUnLCBgL2FkbWluL3VzZXJgICk7IH0gKVxuICAgICAgICAgICAgICAgICAgICAub24oICdlZGl0ZWQnLCB1c2VyID0+IHsgdGhpcy52aWV3c1sgdXNlci5faWQgXS51cGRhdGUoIHVzZXIgKTsgdGhpcy5lbWl0KCAnbmF2aWdhdGUnLCBgL2FkbWluL3VzZXJgICk7IH0gKVxuICAgICAgICAgICAgICAgICAgICAub24oICdjYW5jZWxsZWQnLCAoKSA9PiB0aGlzLmVtaXQoICduYXZpZ2F0ZScsIGAvYWRtaW4vdXNlcmAgKSApXG4gICAgfSxcblxuICAgIG9uQWRkQnRuQ2xpY2soKSB7IHRoaXMuZW1pdCggJ25hdmlnYXRlJywgYC9hZG1pbi91c2VyL2FkZGAgKSB9LFxuXG4gICAgb25OYXZpZ2F0aW9uKCBwYXRoICkge1xuICAgICAgICB0aGlzLnBhdGggPSBwYXRoO1xuXG4gICAgICAgICggcGF0aC5sZW5ndGggPT09IDIgJiYgdGhpcy5lbHMuY29udGFpbmVyLmNsYXNzTGlzdC5jb250YWlucygnaGlkZScpICkgXG4gICAgICAgICAgICA/IHRoaXMudmlld3MuVXNlck1hbmFnZSAmJiAhdGhpcy52aWV3cy5Vc2VyTWFuYWdlLmVscy5jb250YWluZXIuY2xhc3NMaXN0LmNvbnRhaW5zKCdoaWRlJylcbiAgICAgICAgICAgICAgICA/IHRoaXMudmlld3MuVXNlck1hbmFnZS5oaWRlKCkudGhlbiggKCkgPT4gdGhpcy5zaG93KCkgKVxuICAgICAgICAgICAgICAgIDogdGhpcy5zaG93KClcbiAgICAgICAgICAgIDogcGF0aC5sZW5ndGggPT09IDNcbiAgICAgICAgICAgICAgICA/IHRoaXMuaGlkZSgpLnRoZW4oICgpID0+IHRoaXMubWFuYWdlVXNlciggcGF0aFsyXSwgeyB9ICkgKVxuICAgICAgICAgICAgICAgIDogcGF0aC5sZW5ndGggPT09IDRcbiAgICAgICAgICAgICAgICAgICAgID8gdGhpcy5oaWRlKCkudGhlbiggKCkgPT4gdGhpcy5tYW5hZ2VVc2VyKCBwYXRoWzJdLCB0aGlzLnZpZXdzWyBwYXRoWzNdIF0ubW9kZWwuZGF0YSApIClcbiAgICAgICAgICAgICAgICAgICAgIDogdW5kZWZpbmVkXG4gICAgfSxcblxuICAgIHBvc3RSZW5kZXIoKSB7XG5cbiAgICAgICAgaWYoIHRoaXMucGF0aC5sZW5ndGggPiAyICkge1xuICAgICAgICAgICAgdGhpcy5lbHMuY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoICdoaWRkZW4nLCAnaGlkZScgKVxuICAgICAgICAgICAgaWYoIHRoaXMucGF0aFsyXSA9PT0gXCJhZGRcIiApIHsgdGhpcy5tYW5hZ2VVc2VyKCBcImFkZFwiLCB7IH0gKSB9XG4gICAgICAgICAgICBlbHNlIGlmKCB0aGlzLnBhdGhbMl0gPT09IFwiZWRpdFwiICYmIHRoaXMucGF0aFszXSApIHtcbiAgICAgICAgICAgICAgICB0aGlzLlhociggeyBtZXRob2Q6IFwiZ2V0XCIsIHJlc291cmNlOiBgdXNlci8ke3RoaXMucGF0aFszXX1gIH0gKVxuICAgICAgICAgICAgICAgIC50aGVuKCByZXNwb25zZSA9PiB0aGlzLm1hbmFnZVVzZXIoIFwiZWRpdFwiLCByZXNwb25zZSApIClcbiAgICAgICAgICAgICAgICAuY2F0Y2goIGUgPT4geyB0aGlzLkVycm9yKGUpOyB0aGlzLmVtaXQoICduYXZpZ2F0ZScsIGAvYWRtaW4vdXNlcmAgKSB9IClcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmKCB0aGlzLnBhdGgubGVuZ3RoID09PSAxICYmIHRoaXMudmlld3MuVXNlck1hbmFnZSApIHtcbiAgICAgICAgICAgIHRoaXMudmlld3MuVXNlck1hbmFnZS5oaWRlKClcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMudXNlcnMgPSBPYmplY3QuY3JlYXRlKCB0aGlzLk1vZGVsLCB7IHJlc291cmNlOiB7IHZhbHVlOiAndXNlcicgfSB9IClcblxuICAgICAgICB0aGlzLnVzZXJzLmdldCgpXG4gICAgICAgIC50aGVuKCAoKSA9PiBQcm9taXNlLnJlc29sdmUoIHRoaXMudXNlcnMuZGF0YS5mb3JFYWNoKCB1c2VyID0+IHRoaXMuY3JlYXRlVXNlclZpZXcoIHVzZXIgKSApICkgKVxuICAgICAgICAuY2F0Y2goIHRoaXMuRXJyb3IgKVxuXG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgfSxcblxuICAgIHJlcXVpcmVzTG9naW46IHRydWVcbn0gKVxuIiwibW9kdWxlLmV4cG9ydHMgPSBPYmplY3QuYXNzaWduKCB7IH0sIHJlcXVpcmUoJy4uLy4uLy4uL2xpYi9NeU9iamVjdCcpLCByZXF1aXJlKCdldmVudHMnKS5FdmVudEVtaXR0ZXIucHJvdG90eXBlLCB7XG5cbiAgICBNb2RlbDogcmVxdWlyZSgnLi4vbW9kZWxzL19fcHJvdG9fXy5qcycpLFxuXG4gICAgT3B0aW1pemVkUmVzaXplOiByZXF1aXJlKCcuL2xpYi9PcHRpbWl6ZWRSZXNpemUnKSxcbiAgICBcbiAgICBTcGlubmVyOiByZXF1aXJlKCcuL2xpYi9TcGluJyksXG4gICAgXG4gICAgWGhyOiByZXF1aXJlKCcuLi9YaHInKSxcblxuICAgIGJpbmRFdmVudCgga2V5LCBldmVudCApIHtcbiAgICAgICAgdmFyIGVscyA9IEFycmF5LmlzQXJyYXkoIHRoaXMuZWxzWyBrZXkgXSApID8gdGhpcy5lbHNbIGtleSBdIDogWyB0aGlzLmVsc1sga2V5IF0gXVxuICAgICAgICBlbHMuZm9yRWFjaCggZWwgPT4gZWwuYWRkRXZlbnRMaXN0ZW5lciggZXZlbnQgfHwgJ2NsaWNrJywgZSA9PiB0aGlzWyBgb24ke3RoaXMuY2FwaXRhbGl6ZUZpcnN0TGV0dGVyKGtleSl9JHt0aGlzLmNhcGl0YWxpemVGaXJzdExldHRlcihldmVudCl9YCBdKCBlICkgKSApXG4gICAgfSxcblxuICAgIGNhcGl0YWxpemVGaXJzdExldHRlcjogc3RyaW5nID0+IHN0cmluZy5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHN0cmluZy5zbGljZSgxKSxcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuXG4gICAgICAgIGlmKCB0aGlzLnNpemUgKSB0aGlzLk9wdGltaXplZFJlc2l6ZS5hZGQoIHRoaXMuc2l6ZSApO1xuXG4gICAgICAgIGlmKCB0aGlzLnJlcXVpcmVzTG9naW4gJiYgKCF0aGlzLnVzZXIuZGF0YSB8fCAhdGhpcy51c2VyLmRhdGEuX2lkICkgKSByZXR1cm4gdGhpcy5oYW5kbGVMb2dpbigpXG5cbiAgICAgICAgaWYoIHRoaXMudXNlci5kYXRhICYmIHRoaXMudXNlci5kYXRhLmlkICYmIHRoaXMucmVxdWlyZXNSb2xlICYmICF0aGlzLmhhc1ByaXZpbGVnZXMoKSApIHJldHVybiB0aGlzLnNob3dOb0FjY2VzcygpXG4gICAgICAgIFxuICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbiggdGhpcywgeyBlbHM6IHsgfSwgc2x1cnA6IHsgYXR0cjogJ2RhdGEtanMnLCB2aWV3OiAnZGF0YS12aWV3JyB9LCB2aWV3czogeyB9IH0gKS5yZW5kZXIoKVxuICAgIH0sXG5cbiAgICBkZWxlZ2F0ZUV2ZW50cygga2V5LCBlbCApIHtcbiAgICAgICAgdmFyIHR5cGUgPSB0eXBlb2YgdGhpcy5ldmVudHNba2V5XVxuXG4gICAgICAgIGlmKCB0eXBlID09PSBcInN0cmluZ1wiICkgeyB0aGlzLmJpbmRFdmVudCgga2V5LCB0aGlzLmV2ZW50c1trZXldICkgfVxuICAgICAgICBlbHNlIGlmKCBBcnJheS5pc0FycmF5KCB0aGlzLmV2ZW50c1trZXldICkgKSB7XG4gICAgICAgICAgICB0aGlzLmV2ZW50c1sga2V5IF0uZm9yRWFjaCggZXZlbnRPYmogPT4gdGhpcy5iaW5kRXZlbnQoIGtleSwgZXZlbnRPYmouZXZlbnQgKSApXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmJpbmRFdmVudCgga2V5LCB0aGlzLmV2ZW50c1trZXldLmV2ZW50IClcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBkZWxldGUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmhpZGUoKVxuICAgICAgICAudGhlbiggKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5lbHMuY29udGFpbmVyLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoIHRoaXMuZWxzLmNvbnRhaW5lciApXG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCB0aGlzLmVtaXQoJ2RlbGV0ZWQnKSApXG4gICAgICAgIH0gKVxuICAgIH0sXG5cbiAgICBldmVudHM6IHt9LFxuXG4gICAgZ2V0RGF0YSgpIHtcbiAgICAgICAgaWYoICF0aGlzLm1vZGVsICkgdGhpcy5tb2RlbCA9IE9iamVjdC5jcmVhdGUoIHRoaXMuTW9kZWwsIHsgcmVzb3VyY2U6IHsgdmFsdWU6IHRoaXMubmFtZSB9IH0gKVxuXG4gICAgICAgIHJldHVybiB0aGlzLm1vZGVsLmdldCgpXG4gICAgfSxcblxuICAgIGdldFRlbXBsYXRlT3B0aW9ucygpIHtcbiAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oXG4gICAgICAgICAgICB7fSxcbiAgICAgICAgICAgICh0aGlzLm1vZGVsKSA/IHRoaXMubW9kZWwuZGF0YSA6IHt9ICxcbiAgICAgICAgICAgIHsgdXNlcjogKHRoaXMudXNlcikgPyB0aGlzLnVzZXIuZGF0YSA6IHt9IH0sXG4gICAgICAgICAgICB7IG9wdHM6ICh0aGlzLnRlbXBsYXRlT3B0cykgPyB0aGlzLnRlbXBsYXRlT3B0cyA6IHt9IH1cbiAgICAgICAgKVxuICAgIH0sXG5cbiAgICBoYW5kbGVMb2dpbigpIHtcbiAgICAgICAgdGhpcy5mYWN0b3J5LmNyZWF0ZSggJ2xvZ2luJywgeyBpbnNlcnRpb246IHsgdmFsdWU6IHsgZWw6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNjb250ZW50JykgfSB9IH0gKVxuICAgICAgICAgICAgLm9uY2UoIFwibG9nZ2VkSW5cIiwgKCkgPT4gdGhpcy5vbkxvZ2luKCkgKVxuXG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgfSxcblxuICAgIGhhc1ByaXZpbGVnZSgpIHtcbiAgICAgICAgKCB0aGlzLnJlcXVpcmVzUm9sZSAmJiAoIHRoaXMudXNlci5nZXQoJ3JvbGVzJykuZmluZCggcm9sZSA9PiByb2xlID09PSB0aGlzLnJlcXVpcmVzUm9sZSApID09PSBcInVuZGVmaW5lZFwiICkgKSA/IGZhbHNlIDogdHJ1ZVxuICAgIH0sXG5cbiAgICBoaWRlKCkge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoIHJlc29sdmUgPT4ge1xuICAgICAgICAgICAgaWYoICFkb2N1bWVudC5ib2R5LmNvbnRhaW5zKHRoaXMuZWxzLmNvbnRhaW5lcikgfHwgdGhpcy5pc0hpZGRlbigpICkgcmV0dXJuIHJlc29sdmUoKVxuICAgICAgICAgICAgdGhpcy5vbkhpZGRlblByb3h5ID0gZSA9PiB0aGlzLm9uSGlkZGVuKHJlc29sdmUpXG4gICAgICAgICAgICB0aGlzLmVscy5jb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lciggJ3RyYW5zaXRpb25lbmQnLCB0aGlzLm9uSGlkZGVuUHJveHkgKVxuICAgICAgICAgICAgdGhpcy5lbHMuY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ2hpZGUnKVxuICAgICAgICB9IClcbiAgICB9LFxuXG4gICAgaHRtbFRvRnJhZ21lbnQoIHN0ciApIHtcbiAgICAgICAgbGV0IHJhbmdlID0gZG9jdW1lbnQuY3JlYXRlUmFuZ2UoKTtcbiAgICAgICAgLy8gbWFrZSB0aGUgcGFyZW50IG9mIHRoZSBmaXJzdCBkaXYgaW4gdGhlIGRvY3VtZW50IGJlY29tZXMgdGhlIGNvbnRleHQgbm9kZVxuICAgICAgICByYW5nZS5zZWxlY3ROb2RlKGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiZGl2XCIpLml0ZW0oMCkpXG4gICAgICAgIHJldHVybiByYW5nZS5jcmVhdGVDb250ZXh0dWFsRnJhZ21lbnQoIHN0ciApXG4gICAgfSxcbiAgICBcbiAgICBpc0hpZGRlbigpIHsgcmV0dXJuIHRoaXMuZWxzLmNvbnRhaW5lci5jbGFzc0xpc3QuY29udGFpbnMoJ2hpZGRlbicpIH0sXG5cbiAgICBvbkhpZGRlbiggcmVzb2x2ZSApIHtcbiAgICAgICAgdGhpcy5lbHMuY29udGFpbmVyLnJlbW92ZUV2ZW50TGlzdGVuZXIoICd0cmFuc2l0aW9uZW5kJywgdGhpcy5vbkhpZGRlblByb3h5IClcbiAgICAgICAgdGhpcy5lbHMuY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ2hpZGRlbicpXG4gICAgICAgIHJlc29sdmUoIHRoaXMuZW1pdCgnaGlkZGVuJykgKVxuICAgIH0sXG5cbiAgICBvbkxvZ2luKCkge1xuICAgICAgICBPYmplY3QuYXNzaWduKCB0aGlzLCB7IGVsczogeyB9LCBzbHVycDogeyBhdHRyOiAnZGF0YS1qcycsIHZpZXc6ICdkYXRhLXZpZXcnIH0sIHZpZXdzOiB7IH0gfSApLnJlbmRlcigpXG4gICAgfSxcblxuICAgIG9uU2hvd24oIHJlc29sdmUgKSB7XG4gICAgICAgIHRoaXMuZWxzLmNvbnRhaW5lci5yZW1vdmVFdmVudExpc3RlbmVyKCAndHJhbnNpdGlvbmVuZCcsIHRoaXMub25TaG93blByb3h5IClcbiAgICAgICAgaWYoIHRoaXMuc2l6ZSApIHRoaXMuc2l6ZSgpXG4gICAgICAgIHJlc29sdmUoIHRoaXMuZW1pdCgnc2hvd24nKSApXG4gICAgfSxcblxuICAgIHNob3dOb0FjY2VzcygpIHtcbiAgICAgICAgYWxlcnQoXCJObyBwcml2aWxlZ2VzLCBzb25cIilcbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICB9LFxuXG4gICAgcG9zdFJlbmRlcigpIHsgcmV0dXJuIHRoaXMgfSxcblxuICAgIHJlbmRlcigpIHtcbiAgICAgICAgdGhpcy5zbHVycFRlbXBsYXRlKCB7IHRlbXBsYXRlOiB0aGlzLnRlbXBsYXRlKCB0aGlzLmdldFRlbXBsYXRlT3B0aW9ucygpICksIGluc2VydGlvbjogdGhpcy5pbnNlcnRpb24gfSApXG5cbiAgICAgICAgaWYoIHRoaXMuc2l6ZSApIHRoaXMuc2l6ZSgpXG5cbiAgICAgICAgcmV0dXJuIHRoaXMucmVuZGVyU3Vidmlld3MoKVxuICAgICAgICAgICAgICAgICAgIC5wb3N0UmVuZGVyKClcbiAgICB9LFxuXG4gICAgcmVuZGVyU3Vidmlld3MoKSB7XG4gICAgICAgIE9iamVjdC5rZXlzKCB0aGlzLlZpZXdzIHx8IFsgXSApLmZvckVhY2goIGtleSA9PiB7XG4gICAgICAgICAgICBpZiggdGhpcy5WaWV3c1sga2V5IF0uZWwgKSB7XG4gICAgICAgICAgICAgICAgbGV0IG9wdHMgPSB0aGlzLlZpZXdzWyBrZXkgXS5vcHRzXG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgb3B0cyA9ICggb3B0cyApXG4gICAgICAgICAgICAgICAgICAgID8gdHlwZW9mIG9wdHMgPT09IFwib2JqZWN0XCJcbiAgICAgICAgICAgICAgICAgICAgICAgID8gb3B0c1xuICAgICAgICAgICAgICAgICAgICAgICAgOiBvcHRzKClcbiAgICAgICAgICAgICAgICAgICAgOiB7fVxuXG4gICAgICAgICAgICAgICAgdGhpcy52aWV3c1sga2V5IF0gPSB0aGlzLmZhY3RvcnkuY3JlYXRlKCBrZXksIE9iamVjdC5hc3NpZ24oIHsgaW5zZXJ0aW9uOiB7IHZhbHVlOiB7IGVsOiB0aGlzLlZpZXdzWyBrZXkgXS5lbCwgbWV0aG9kOiAnaW5zZXJ0QmVmb3JlJyB9IH0gfSwgb3B0cyApIClcbiAgICAgICAgICAgICAgICB0aGlzLlZpZXdzWyBrZXkgXS5lbC5yZW1vdmUoKVxuICAgICAgICAgICAgICAgIHRoaXMuVmlld3NbIGtleSBdLmVsID0gdW5kZWZpbmVkXG4gICAgICAgICAgICB9XG4gICAgICAgIH0gKVxuXG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgfSxcblxuICAgIHNob3coIGR1cmF0aW9uICkge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoIHJlc29sdmUgPT4ge1xuICAgICAgICAgICAgdGhpcy5vblNob3duUHJveHkgPSBlID0+IHRoaXMub25TaG93bihyZXNvbHZlKVxuICAgICAgICAgICAgdGhpcy5lbHMuY29udGFpbmVyLmFkZEV2ZW50TGlzdGVuZXIoICd0cmFuc2l0aW9uZW5kJywgdGhpcy5vblNob3duUHJveHkgKVxuICAgICAgICAgICAgdGhpcy5lbHMuY29udGFpbmVyLmNsYXNzTGlzdC5yZW1vdmUoICdoaWRlJywgJ2hpZGRlbicgKVxuICAgICAgICB9IClcbiAgICB9LFxuXG4gICAgc2x1cnBFbCggZWwgKSB7XG4gICAgICAgIHZhciBrZXkgPSBlbC5nZXRBdHRyaWJ1dGUoIHRoaXMuc2x1cnAuYXR0ciApIHx8ICdjb250YWluZXInXG5cbiAgICAgICAgaWYoIGtleSA9PT0gJ2NvbnRhaW5lcicgKSBlbC5jbGFzc0xpc3QuYWRkKCB0aGlzLm5hbWUgKVxuXG4gICAgICAgIHRoaXMuZWxzWyBrZXkgXSA9IEFycmF5LmlzQXJyYXkoIHRoaXMuZWxzWyBrZXkgXSApXG4gICAgICAgICAgICA/IHRoaXMuZWxzWyBrZXkgXS5wdXNoKCBlbCApXG4gICAgICAgICAgICA6ICggdGhpcy5lbHNbIGtleSBdICE9PSB1bmRlZmluZWQgKVxuICAgICAgICAgICAgICAgID8gWyB0aGlzLmVsc1sga2V5IF0sIGVsIF1cbiAgICAgICAgICAgICAgICA6IGVsXG5cbiAgICAgICAgZWwucmVtb3ZlQXR0cmlidXRlKHRoaXMuc2x1cnAuYXR0cilcblxuICAgICAgICBpZiggdGhpcy5ldmVudHNbIGtleSBdICkgdGhpcy5kZWxlZ2F0ZUV2ZW50cygga2V5LCBlbCApXG4gICAgfSxcblxuICAgIHNsdXJwVGVtcGxhdGUoIG9wdGlvbnMgKSB7XG4gICAgICAgIHZhciBmcmFnbWVudCA9IHRoaXMuaHRtbFRvRnJhZ21lbnQoIG9wdGlvbnMudGVtcGxhdGUgKSxcbiAgICAgICAgICAgIHNlbGVjdG9yID0gYFske3RoaXMuc2x1cnAuYXR0cn1dYCxcbiAgICAgICAgICAgIHZpZXdTZWxlY3RvciA9IGBbJHt0aGlzLnNsdXJwLnZpZXd9XWBcblxuICAgICAgICB0aGlzLnNsdXJwRWwoIGZyYWdtZW50LnF1ZXJ5U2VsZWN0b3IoJyonKSApXG4gICAgICAgIGZyYWdtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoIGAke3NlbGVjdG9yfSwgJHt2aWV3U2VsZWN0b3J9YCApLmZvckVhY2goIGVsID0+XG4gICAgICAgICAgICAoIGVsLmhhc0F0dHJpYnV0ZSggdGhpcy5zbHVycC5hdHRyICkgKSBcbiAgICAgICAgICAgICAgICA/IHRoaXMuc2x1cnBFbCggZWwgKVxuICAgICAgICAgICAgICAgIDogdGhpcy5WaWV3c1sgZWwuZ2V0QXR0cmlidXRlKHRoaXMuc2x1cnAudmlldykgXS5lbCA9IGVsXG4gICAgICAgIClcbiAgICAgICAgICBcbiAgICAgICAgb3B0aW9ucy5pbnNlcnRpb24ubWV0aG9kID09PSAnaW5zZXJ0QmVmb3JlJ1xuICAgICAgICAgICAgPyBvcHRpb25zLmluc2VydGlvbi5lbC5wYXJlbnROb2RlLmluc2VydEJlZm9yZSggZnJhZ21lbnQsIG9wdGlvbnMuaW5zZXJ0aW9uLmVsIClcbiAgICAgICAgICAgIDogb3B0aW9ucy5pbnNlcnRpb24uZWxbIG9wdGlvbnMuaW5zZXJ0aW9uLm1ldGhvZCB8fCAnYXBwZW5kQ2hpbGQnIF0oIGZyYWdtZW50IClcblxuICAgICAgICByZXR1cm4gdGhpc1xuICAgIH0sXG5cbiAgICBpc01vdXNlT25FbCggZXZlbnQsIGVsICkge1xuXG4gICAgICAgIHZhciBlbE9mZnNldCA9IGVsLm9mZnNldCgpLFxuICAgICAgICAgICAgZWxIZWlnaHQgPSBlbC5vdXRlckhlaWdodCggdHJ1ZSApLFxuICAgICAgICAgICAgZWxXaWR0aCA9IGVsLm91dGVyV2lkdGgoIHRydWUgKVxuXG4gICAgICAgIGlmKCAoIGV2ZW50LnBhZ2VYIDwgZWxPZmZzZXQubGVmdCApIHx8XG4gICAgICAgICAgICAoIGV2ZW50LnBhZ2VYID4gKCBlbE9mZnNldC5sZWZ0ICsgZWxXaWR0aCApICkgfHxcbiAgICAgICAgICAgICggZXZlbnQucGFnZVkgPCBlbE9mZnNldC50b3AgKSB8fFxuICAgICAgICAgICAgKCBldmVudC5wYWdlWSA+ICggZWxPZmZzZXQudG9wICsgZWxIZWlnaHQgKSApICkge1xuXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdHJ1ZVxuICAgIH0sXG5cbiAgICByZXF1aXJlc0xvZ2luOiBmYWxzZSxcblxuICAgIC8vX190b0RvOiBodG1sLnJlcGxhY2UoLz5cXHMrPC9nLCc+PCcpXG59IClcbiIsIm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmNyZWF0ZSgge1xuXG4gICAgYWRkKGNhbGxiYWNrKSB7XG4gICAgICAgIGlmKCAhdGhpcy5jYWxsYmFja3MubGVuZ3RoICkgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHRoaXMub25SZXNpemUpXG4gICAgICAgIHRoaXMuY2FsbGJhY2tzLnB1c2goY2FsbGJhY2spXG4gICAgfSxcblxuICAgIG9uUmVzaXplKCkge1xuICAgICAgIGlmKCB0aGlzLnJ1bm5pbmcgKSByZXR1cm5cblxuICAgICAgICB0aGlzLnJ1bm5pbmcgPSB0cnVlXG4gICAgICAgIFxuICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lXG4gICAgICAgICAgICA/IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoIHRoaXMucnVuQ2FsbGJhY2tzIClcbiAgICAgICAgICAgIDogc2V0VGltZW91dCggdGhpcy5ydW5DYWxsYmFja3MsIDY2KVxuICAgIH0sXG5cbiAgICBydW5DYWxsYmFja3MoKSB7XG4gICAgICAgIHRoaXMuY2FsbGJhY2tzID0gdGhpcy5jYWxsYmFja3MuZmlsdGVyKCBjYWxsYmFjayA9PiBjYWxsYmFjaygpIClcbiAgICAgICAgdGhpcy5ydW5uaW5nID0gZmFsc2UgXG4gICAgfVxuXG59LCB7IGNhbGxiYWNrczogeyB2YWx1ZTogW10gfSwgcnVubmluZzogeyB2YWx1ZTogZmFsc2UgfSB9ICkuYWRkXG4iLCIvLyBodHRwOi8vc3Bpbi5qcy5vcmcvI3YyLjMuMlxuIWZ1bmN0aW9uKGEsYil7XCJvYmplY3RcIj09dHlwZW9mIG1vZHVsZSYmbW9kdWxlLmV4cG9ydHM/bW9kdWxlLmV4cG9ydHM9YigpOlwiZnVuY3Rpb25cIj09dHlwZW9mIGRlZmluZSYmZGVmaW5lLmFtZD9kZWZpbmUoYik6YS5TcGlubmVyPWIoKX0odGhpcyxmdW5jdGlvbigpe1widXNlIHN0cmljdFwiO2Z1bmN0aW9uIGEoYSxiKXt2YXIgYyxkPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoYXx8XCJkaXZcIik7Zm9yKGMgaW4gYilkW2NdPWJbY107cmV0dXJuIGR9ZnVuY3Rpb24gYihhKXtmb3IodmFyIGI9MSxjPWFyZ3VtZW50cy5sZW5ndGg7Yz5iO2IrKylhLmFwcGVuZENoaWxkKGFyZ3VtZW50c1tiXSk7cmV0dXJuIGF9ZnVuY3Rpb24gYyhhLGIsYyxkKXt2YXIgZT1bXCJvcGFjaXR5XCIsYix+figxMDAqYSksYyxkXS5qb2luKFwiLVwiKSxmPS4wMStjL2QqMTAwLGc9TWF0aC5tYXgoMS0oMS1hKS9iKigxMDAtZiksYSksaD1qLnN1YnN0cmluZygwLGouaW5kZXhPZihcIkFuaW1hdGlvblwiKSkudG9Mb3dlckNhc2UoKSxpPWgmJlwiLVwiK2grXCItXCJ8fFwiXCI7cmV0dXJuIG1bZV18fChrLmluc2VydFJ1bGUoXCJAXCIraStcImtleWZyYW1lcyBcIitlK1wiezAle29wYWNpdHk6XCIrZytcIn1cIitmK1wiJXtvcGFjaXR5OlwiK2ErXCJ9XCIrKGYrLjAxKStcIiV7b3BhY2l0eToxfVwiKyhmK2IpJTEwMCtcIiV7b3BhY2l0eTpcIithK1wifTEwMCV7b3BhY2l0eTpcIitnK1wifX1cIixrLmNzc1J1bGVzLmxlbmd0aCksbVtlXT0xKSxlfWZ1bmN0aW9uIGQoYSxiKXt2YXIgYyxkLGU9YS5zdHlsZTtpZihiPWIuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkrYi5zbGljZSgxKSx2b2lkIDAhPT1lW2JdKXJldHVybiBiO2ZvcihkPTA7ZDxsLmxlbmd0aDtkKyspaWYoYz1sW2RdK2Isdm9pZCAwIT09ZVtjXSlyZXR1cm4gY31mdW5jdGlvbiBlKGEsYil7Zm9yKHZhciBjIGluIGIpYS5zdHlsZVtkKGEsYyl8fGNdPWJbY107cmV0dXJuIGF9ZnVuY3Rpb24gZihhKXtmb3IodmFyIGI9MTtiPGFyZ3VtZW50cy5sZW5ndGg7YisrKXt2YXIgYz1hcmd1bWVudHNbYl07Zm9yKHZhciBkIGluIGMpdm9pZCAwPT09YVtkXSYmKGFbZF09Y1tkXSl9cmV0dXJuIGF9ZnVuY3Rpb24gZyhhLGIpe3JldHVyblwic3RyaW5nXCI9PXR5cGVvZiBhP2E6YVtiJWEubGVuZ3RoXX1mdW5jdGlvbiBoKGEpe3RoaXMub3B0cz1mKGF8fHt9LGguZGVmYXVsdHMsbil9ZnVuY3Rpb24gaSgpe2Z1bmN0aW9uIGMoYixjKXtyZXR1cm4gYShcIjxcIitiKycgeG1sbnM9XCJ1cm46c2NoZW1hcy1taWNyb3NvZnQuY29tOnZtbFwiIGNsYXNzPVwic3Bpbi12bWxcIj4nLGMpfWsuYWRkUnVsZShcIi5zcGluLXZtbFwiLFwiYmVoYXZpb3I6dXJsKCNkZWZhdWx0I1ZNTClcIiksaC5wcm90b3R5cGUubGluZXM9ZnVuY3Rpb24oYSxkKXtmdW5jdGlvbiBmKCl7cmV0dXJuIGUoYyhcImdyb3VwXCIse2Nvb3Jkc2l6ZTprK1wiIFwiK2ssY29vcmRvcmlnaW46LWorXCIgXCIrLWp9KSx7d2lkdGg6ayxoZWlnaHQ6a30pfWZ1bmN0aW9uIGgoYSxoLGkpe2IobSxiKGUoZigpLHtyb3RhdGlvbjozNjAvZC5saW5lcyphK1wiZGVnXCIsbGVmdDp+fmh9KSxiKGUoYyhcInJvdW5kcmVjdFwiLHthcmNzaXplOmQuY29ybmVyc30pLHt3aWR0aDpqLGhlaWdodDpkLnNjYWxlKmQud2lkdGgsbGVmdDpkLnNjYWxlKmQucmFkaXVzLHRvcDotZC5zY2FsZSpkLndpZHRoPj4xLGZpbHRlcjppfSksYyhcImZpbGxcIix7Y29sb3I6ZyhkLmNvbG9yLGEpLG9wYWNpdHk6ZC5vcGFjaXR5fSksYyhcInN0cm9rZVwiLHtvcGFjaXR5OjB9KSkpKX12YXIgaSxqPWQuc2NhbGUqKGQubGVuZ3RoK2Qud2lkdGgpLGs9MipkLnNjYWxlKmosbD0tKGQud2lkdGgrZC5sZW5ndGgpKmQuc2NhbGUqMitcInB4XCIsbT1lKGYoKSx7cG9zaXRpb246XCJhYnNvbHV0ZVwiLHRvcDpsLGxlZnQ6bH0pO2lmKGQuc2hhZG93KWZvcihpPTE7aTw9ZC5saW5lcztpKyspaChpLC0yLFwicHJvZ2lkOkRYSW1hZ2VUcmFuc2Zvcm0uTWljcm9zb2Z0LkJsdXIocGl4ZWxyYWRpdXM9MixtYWtlc2hhZG93PTEsc2hhZG93b3BhY2l0eT0uMylcIik7Zm9yKGk9MTtpPD1kLmxpbmVzO2krKyloKGkpO3JldHVybiBiKGEsbSl9LGgucHJvdG90eXBlLm9wYWNpdHk9ZnVuY3Rpb24oYSxiLGMsZCl7dmFyIGU9YS5maXJzdENoaWxkO2Q9ZC5zaGFkb3cmJmQubGluZXN8fDAsZSYmYitkPGUuY2hpbGROb2Rlcy5sZW5ndGgmJihlPWUuY2hpbGROb2Rlc1tiK2RdLGU9ZSYmZS5maXJzdENoaWxkLGU9ZSYmZS5maXJzdENoaWxkLGUmJihlLm9wYWNpdHk9YykpfX12YXIgaixrLGw9W1wid2Via2l0XCIsXCJNb3pcIixcIm1zXCIsXCJPXCJdLG09e30sbj17bGluZXM6MTIsbGVuZ3RoOjcsd2lkdGg6NSxyYWRpdXM6MTAsc2NhbGU6MSxjb3JuZXJzOjEsY29sb3I6XCIjMDAwXCIsb3BhY2l0eTouMjUscm90YXRlOjAsZGlyZWN0aW9uOjEsc3BlZWQ6MSx0cmFpbDoxMDAsZnBzOjIwLHpJbmRleDoyZTksY2xhc3NOYW1lOlwic3Bpbm5lclwiLHRvcDpcIjUwJVwiLGxlZnQ6XCI1MCVcIixzaGFkb3c6ITEsaHdhY2NlbDohMSxwb3NpdGlvbjpcImFic29sdXRlXCJ9O2lmKGguZGVmYXVsdHM9e30sZihoLnByb3RvdHlwZSx7c3BpbjpmdW5jdGlvbihiKXt0aGlzLnN0b3AoKTt2YXIgYz10aGlzLGQ9Yy5vcHRzLGY9Yy5lbD1hKG51bGwse2NsYXNzTmFtZTpkLmNsYXNzTmFtZX0pO2lmKGUoZix7cG9zaXRpb246ZC5wb3NpdGlvbix3aWR0aDowLHpJbmRleDpkLnpJbmRleCxsZWZ0OmQubGVmdCx0b3A6ZC50b3B9KSxiJiZiLmluc2VydEJlZm9yZShmLGIuZmlyc3RDaGlsZHx8bnVsbCksZi5zZXRBdHRyaWJ1dGUoXCJyb2xlXCIsXCJwcm9ncmVzc2JhclwiKSxjLmxpbmVzKGYsYy5vcHRzKSwhail7dmFyIGcsaD0wLGk9KGQubGluZXMtMSkqKDEtZC5kaXJlY3Rpb24pLzIsaz1kLmZwcyxsPWsvZC5zcGVlZCxtPSgxLWQub3BhY2l0eSkvKGwqZC50cmFpbC8xMDApLG49bC9kLmxpbmVzOyFmdW5jdGlvbiBvKCl7aCsrO2Zvcih2YXIgYT0wO2E8ZC5saW5lczthKyspZz1NYXRoLm1heCgxLShoKyhkLmxpbmVzLWEpKm4pJWwqbSxkLm9wYWNpdHkpLGMub3BhY2l0eShmLGEqZC5kaXJlY3Rpb24raSxnLGQpO2MudGltZW91dD1jLmVsJiZzZXRUaW1lb3V0KG8sfn4oMWUzL2spKX0oKX1yZXR1cm4gY30sc3RvcDpmdW5jdGlvbigpe3ZhciBhPXRoaXMuZWw7cmV0dXJuIGEmJihjbGVhclRpbWVvdXQodGhpcy50aW1lb3V0KSxhLnBhcmVudE5vZGUmJmEucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChhKSx0aGlzLmVsPXZvaWQgMCksdGhpc30sbGluZXM6ZnVuY3Rpb24oZCxmKXtmdW5jdGlvbiBoKGIsYyl7cmV0dXJuIGUoYSgpLHtwb3NpdGlvbjpcImFic29sdXRlXCIsd2lkdGg6Zi5zY2FsZSooZi5sZW5ndGgrZi53aWR0aCkrXCJweFwiLGhlaWdodDpmLnNjYWxlKmYud2lkdGgrXCJweFwiLGJhY2tncm91bmQ6Yixib3hTaGFkb3c6Yyx0cmFuc2Zvcm1PcmlnaW46XCJsZWZ0XCIsdHJhbnNmb3JtOlwicm90YXRlKFwiK35+KDM2MC9mLmxpbmVzKmsrZi5yb3RhdGUpK1wiZGVnKSB0cmFuc2xhdGUoXCIrZi5zY2FsZSpmLnJhZGl1cytcInB4LDApXCIsYm9yZGVyUmFkaXVzOihmLmNvcm5lcnMqZi5zY2FsZSpmLndpZHRoPj4xKStcInB4XCJ9KX1mb3IodmFyIGksaz0wLGw9KGYubGluZXMtMSkqKDEtZi5kaXJlY3Rpb24pLzI7azxmLmxpbmVzO2srKylpPWUoYSgpLHtwb3NpdGlvbjpcImFic29sdXRlXCIsdG9wOjErfihmLnNjYWxlKmYud2lkdGgvMikrXCJweFwiLHRyYW5zZm9ybTpmLmh3YWNjZWw/XCJ0cmFuc2xhdGUzZCgwLDAsMClcIjpcIlwiLG9wYWNpdHk6Zi5vcGFjaXR5LGFuaW1hdGlvbjpqJiZjKGYub3BhY2l0eSxmLnRyYWlsLGwraypmLmRpcmVjdGlvbixmLmxpbmVzKStcIiBcIisxL2Yuc3BlZWQrXCJzIGxpbmVhciBpbmZpbml0ZVwifSksZi5zaGFkb3cmJmIoaSxlKGgoXCIjMDAwXCIsXCIwIDAgNHB4ICMwMDBcIikse3RvcDpcIjJweFwifSkpLGIoZCxiKGksaChnKGYuY29sb3IsayksXCIwIDAgMXB4IHJnYmEoMCwwLDAsLjEpXCIpKSk7cmV0dXJuIGR9LG9wYWNpdHk6ZnVuY3Rpb24oYSxiLGMpe2I8YS5jaGlsZE5vZGVzLmxlbmd0aCYmKGEuY2hpbGROb2Rlc1tiXS5zdHlsZS5vcGFjaXR5PWMpfX0pLFwidW5kZWZpbmVkXCIhPXR5cGVvZiBkb2N1bWVudCl7az1mdW5jdGlvbigpe3ZhciBjPWEoXCJzdHlsZVwiLHt0eXBlOlwidGV4dC9jc3NcIn0pO3JldHVybiBiKGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiaGVhZFwiKVswXSxjKSxjLnNoZWV0fHxjLnN0eWxlU2hlZXR9KCk7dmFyIG89ZShhKFwiZ3JvdXBcIikse2JlaGF2aW9yOlwidXJsKCNkZWZhdWx0I1ZNTClcIn0pOyFkKG8sXCJ0cmFuc2Zvcm1cIikmJm8uYWRqP2koKTpqPWQobyxcImFuaW1hdGlvblwiKX1yZXR1cm4gaH0pOyIsIm1vZHVsZS5leHBvcnRzID0gcCA9PiBcbmA8ZGl2PlxuPGRpdj5BZG1pbjwvZGl2PlxuPGRpdiBkYXRhLWpzPVwibGlzdFwiPjwvZGl2PlxuPC9kaXY+YFxuIiwibW9kdWxlLmV4cG9ydHMgPSBwID0+IGA8ZGl2PiR7cC5jb2xsZWN0aW9ufTwvZGl2PmBcbiIsIm1vZHVsZS5leHBvcnRzID0gcCA9PiB7XG5yZXR1cm4gYDxkaXY+XG4gICAgPGRpdiBjbGFzcz1cImhlYWRlclwiIGRhdGEtanM9XCJoZWFkZXJcIj5cbiAgICAgICAgPGRpdiBjbGFzcz1cInByZS1jb250ZXh0XCIgZGF0YS1qcz1cInByZUNvbnRleHRcIiA+JHtwLnByZUNvbnRleHQgfHwgJyd9PC9kaXY+XG4gICAgICAgIDxkaXY+PGltZyBkYXRhLWpzPVwiY29udGV4dFwiIGNsYXNzPVwiY29udGV4dFwiIHNyYz1cIiR7cC5jb250ZXh0IHx8ICcnfVwiLz48L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzcz1cInBvc3QtY29udGV4dFwiIGRhdGEtanM9XCJwb3N0Q29udGV4dFwiID4ke3AucG9zdENvbnRleHQgfHwgJyd9PC9kaXY+XG4gICAgICAgICR7cC5faWQgJiYgcC51c2VyLl9pZCAmJiAhcC5vcHRzLnJlYWRPbmx5ID8gJzxidXR0b24gY2xhc3M9XCJkZWxldGVcIiBkYXRhLWpzPVwiZGVsZXRlXCI+PC9idXR0b24+JyA6ICcnfVxuICAgICAgICAke3AuX2lkICYmIHAudXNlci5faWQgJiYgIXAub3B0cy5yZWFkT25seSA/ICc8YnV0dG9uIGNsYXNzPVwiZWRpdFwiIGRhdGEtanM9XCJlZGl0XCI+PC9idXR0b24+JyA6ICcnfVxuICAgIDwvZGl2PlxuICAgICR7cC5faWQgJiYgcC51c2VyLl9pZCAmJiAhcC5vcHRzLnJlYWRPbmx5XG4gICAgICAgID8gYDxkaXYgY2xhc3M9XCJjb25maXJtIGhpZGRlblwiIGRhdGEtanM9XCJjb25maXJtRGlhbG9nXCI+XG4gICAgICAgICAgICAgICA8c3Bhbj5BcmUgeW91IHN1cmU/PC9zcGFuPlxuICAgICAgICAgICAgICAgPGJ1dHRvbiBkYXRhLWpzPVwiY29uZmlybVwiIHR5cGU9XCJidXR0b25cIj5EZWxldGU8L2J1dHRvbj4gXG4gICAgICAgICAgICAgICA8YnV0dG9uIGRhdGEtanM9XCJjYW5jZWxcIiB0eXBlPVwiYnV0dG9uXCI+Q2FuY2VsPC9idXR0b24+IFxuICAgICAgICAgICA8L2Rpdj5gXG4gICAgICAgIDogYGB9XG4gICAgPGRpdiBjbGFzcz1cImNsZWFyZml4XCI+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJkYXRlXCI+JHsocmVxdWlyZSgnbW9tZW50JykpKHAuY3JlYXRlZCkuZm9ybWF0KCdNTS1ERC1ZWVlZJyl9PC9kaXY+XG4gICAgPC9kaXY+XG4gICAgPGltZyBjbGFzcz1cImltYWdlXCIgZGF0YS1qcz1cImltYWdlXCIgc3JjPVwiJHtwLmltYWdlID8gcC5pbWFnZSA6ICcnfVwiLz5cbiAgICAke3Aub3B0cy5yZWFkT25seVxuICAgICAgICA/IGA8ZGl2IGNsYXNzPVwiY2xlYXJmaXhcIj5cbiAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwic2hhcmVcIj5cbiAgICAgICAgICAgICAgICAgJHtyZXF1aXJlKCcuL2xpYi9mYWNlYm9vaycpfVxuICAgICAgICAgICAgICAgICAke3JlcXVpcmUoJy4vbGliL3R3aXR0ZXInKX1cbiAgICAgICAgICAgICAgICAgJHtyZXF1aXJlKCcuL2xpYi9nb29nbGUnKX1cbiAgICAgICAgICAgICAgICAgPGEgaHJlZj1cIm1haWx0bzpiYWRob21icmVAdGlueWhhbmRlZC5jb21cIj4ke3JlcXVpcmUoJy4vbGliL21haWwnKX08L2E+XG4gICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgPCEtLSA8ZGl2IGNsYXNzPVwic3RvcmVcIiBkYXRhLWpzPVwic3RvcmVcIj5TdG9yZTwvZGl2PiAtLT5cbiAgICAgICAgIDwvZGl2PmBcbiAgICAgICAgOiBgYCB9XG48L2Rpdj5gXG59XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHAgPT5cbmA8ZGl2PlxuICAgIDxkaXYgZGF0YS1qcz1cImhlYWRlclwiPjwvZGl2PlxuICAgIDxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwXCI+XG4gICAgICAgPGxhYmVsIGNsYXNzPVwiZm9ybS1sYWJlbFwiPm5hbWUgKCB1c2VkIGluIHVybCApPC9sYWJlbD5cbiAgICAgICA8aW5wdXQgZGF0YS1qcz1cIm5hbWVcIiB0eXBlPVwidGV4dFwiPjwvaW5wdXQ+XG4gICAgPC9kaXY+XG4gICAgPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXBcIj5cbiAgICAgICA8bGFiZWwgY2xhc3M9XCJmb3JtLWxhYmVsXCI+cHJlIGNvbnRleHQ8L2xhYmVsPlxuICAgICAgIDxpbnB1dCBkYXRhLWpzPVwicHJlQ29udGV4dFwiIHR5cGU9XCJ0ZXh0XCI+PC9pbnB1dD5cbiAgICA8L2Rpdj5cbiAgICA8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cFwiPlxuICAgICAgIDxsYWJlbCBjbGFzcz1cImZvcm0tbGFiZWxcIj5jb250ZXh0PC9sYWJlbD5cbiAgICAgICAgPGRpdj5cbiAgICAgICAgICAgIDxkaXYgZGF0YS1qcz1cImNvbnRleHRVcGxvYWRcIiBjbGFzcz1cInVwbG9hZFwiPlxuICAgICAgICAgICAgICAgIDxzcGFuPlVwbG9hZCBGaWxlPC9zcGFuPlxuICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwiZmlsZVwiIGRhdGEtanM9XCJjb250ZXh0XCIgLz5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGltZyBjbGFzcz1cInByZXZpZXdcIiBkYXRhLWpzPVwiY29udGV4dFByZXZpZXdcIiAvPlxuICAgICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgICA8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cFwiPlxuICAgICAgIDxsYWJlbCBjbGFzcz1cImZvcm0tbGFiZWxcIj5wb3N0IGNvbnRleHQ8L2xhYmVsPlxuICAgICAgIDxpbnB1dCBkYXRhLWpzPVwicG9zdENvbnRleHRcIiB0eXBlPVwidGV4dFwiPjwvaW5wdXQ+XG4gICAgPC9kaXY+XG4gICAgPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXBcIj5cbiAgICAgICA8bGFiZWwgY2xhc3M9XCJmb3JtLWxhYmVsXCI+aW1hZ2U8L2xhYmVsPlxuICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgPGRpdiBkYXRhLWpzPVwidXBsb2FkXCIgY2xhc3M9XCJ1cGxvYWRcIj5cbiAgICAgICAgICAgICAgICA8c3Bhbj5VcGxvYWQgRmlsZTwvc3Bhbj5cbiAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cImZpbGVcIiBkYXRhLWpzPVwiaW1hZ2VcIiAvPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8aW1nIGNsYXNzPVwicHJldmlld1wiIGRhdGEtanM9XCJwcmV2aWV3XCIgLz5cbiAgICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gICAgPGRpdiBjbGFzcz1cImJ1dHRvbi1yb3dcIj5cbiAgICAgICAgPGJ1dHRvbiBkYXRhLWpzPVwic3VibWl0XCIgdHlwZT1cImJ1dHRvblwiPlN1Ym1pdDwvYnV0dG9uPlxuICAgICAgICA8YnV0dG9uIGRhdGEtanM9XCJjYW5jZWxcIiB0eXBlPVwiYnV0dG9uXCI+Q2FuY2VsPC9idXR0b24+XG4gICAgPC9kaXY+XG48L2Rpdj5gXG4iLCJtb2R1bGUuZXhwb3J0cyA9IHAgPT4gXG5gPGRpdj5cbiAgICA8ZGl2PlxuICAgICAgICA8ZGl2PkNvbWljczwvZGl2PlxuICAgICAgICA8YnV0dG9uIGRhdGEtanM9XCJhZGRCdG5cIiBjbGFzcz1cImFkZFwiPjwvYnV0dG9uPlxuICAgIDwvZGl2PlxuICAgIDxkaXYgZGF0YS1qcz1cImxpc3RcIj48L2Rpdj5cbjwvZGl2PmBcbiIsIm1vZHVsZS5leHBvcnRzID0gcCA9PiBgPGhlYWRlcj5cbiAgICA8aW1nIGRhdGEtanM9XCJsb2dvXCIgc3JjPVwiL3N0YXRpYy9pbWcvbG9nby5wbmdcIiAvPlxuPC9oZWFkZXI+YFxuIiwibW9kdWxlLmV4cG9ydHMgPSAoIHAgKSA9PiBgPGRpdj48L2Rpdj5gXG4iLCJtb2R1bGUuZXhwb3J0cyA9ICggcCApID0+XG5gPGRpdj5cbiAgICA8aDE+TG9naW48L2gxPlxuICAgIDxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwXCI+XG4gICAgICAgPGxhYmVsIGNsYXNzPVwiZm9ybS1sYWJlbFwiIGZvcj1cInVzZXJuYW1lXCI+dXNlcm5hbWU8L2xhYmVsPlxuICAgICAgIDxpbnB1dCBkYXRhLWpzPVwidXNlcm5hbWVcIiBjbGFzcz1cInVzZXJuYW1lXCIgdHlwZT1cInRleHRcIj48L2lucHV0PlxuICAgIDwvZGl2PlxuICAgIDxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwXCI+XG4gICAgICAgPGxhYmVsIGNsYXNzPVwiZm9ybS1sYWJlbFwiIGZvcj1cInBhc3N3b3JkXCI+cGFzc3dvcmQ8L2xhYmVsPlxuICAgICAgIDxpbnB1dCBkYXRhLWpzPVwicGFzc3dvcmRcIiBjbGFzcz1cInBhc3N3b3JkXCIgdHlwZT1cInBhc3N3b3JkXCI+PC9pbnB1dD5cbiAgICA8L2Rpdj5cbiAgICA8ZGl2IGNsYXNzPVwiYnV0dG9uLXJvd1wiPlxuICAgICAgICA8YnV0dG9uIGRhdGEtanM9XCJzdWJtaXRcIiBjbGFzcz1cImJ0bi1naG9zdFwiIHR5cGU9XCJidXR0b25cIj5Mb2cgSW48L2J1dHRvbj5cbiAgICA8L2Rpdj5cbjwvZGl2PmBcbiIsIm1vZHVsZS5leHBvcnRzID0gKCkgPT4gYDxkaXYgY2xhc3M9XCJoaWRlXCI+PGRpdiBkYXRhLWpzPVwiY29udGVudFwiPjwvZGl2PjwvZGl2PmBcbiIsIm1vZHVsZS5leHBvcnRzID0gcCA9PlxuYDxkaXY+XG4gICAgPGRpdiBkYXRhLWpzPVwidXNlcm5hbWVcIj4ke3AudXNlcm5hbWV9PC9kaXY+XG4gICAgJHtwLnVzZXIuX2lkICYmICFwLm9wdHMucmVhZE9ubHkgPyAnPGJ1dHRvbiBjbGFzcz1cImRlbGV0ZVwiIGRhdGEtanM9XCJkZWxldGVcIj48L2J1dHRvbj4nIDogJyd9XG4gICAgJHtwLnVzZXIuX2lkID09PSBwLl9pZCA/ICc8YnV0dG9uIGNsYXNzPVwiZWRpdFwiIGRhdGEtanM9XCJlZGl0XCI+PC9idXR0b24+JyA6ICcnfVxuICAgICR7cC51c2VyLl9pZCAmJiAhcC5vcHRzLnJlYWRPbmx5XG4gICAgPyBgPGRpdiBjbGFzcz1cImNvbmZpcm0gaGlkZGVuXCIgZGF0YS1qcz1cImNvbmZpcm1EaWFsb2dcIj5cbiAgICAgICAgICAgPHNwYW4+QXJlIHlvdSBzdXJlPzwvc3Bhbj5cbiAgICAgICAgICAgPGJ1dHRvbiBkYXRhLWpzPVwiY29uZmlybVwiIHR5cGU9XCJidXR0b25cIj5EZWxldGU8L2J1dHRvbj4gXG4gICAgICAgICAgIDxidXR0b24gZGF0YS1qcz1cImNhbmNlbFwiIHR5cGU9XCJidXR0b25cIj5DYW5jZWw8L2J1dHRvbj4gXG4gICAgICAgPC9kaXY+YFxuICAgIDogYGB9XG48L2Rpdj5cbmBcbiIsIm1vZHVsZS5leHBvcnRzID0gcCA9PlxuYDxkaXY+XG4gICAgPGRpdiBkYXRhLWpzPVwidGl0bGVcIj48L2Rpdj5cbiAgICA8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cFwiPlxuICAgICAgIDxsYWJlbCBjbGFzcz1cImZvcm0tbGFiZWxcIiBmb3I9XCJ1c2VybmFtZVwiPnVzZXJuYW1lPC9sYWJlbD5cbiAgICAgICA8aW5wdXQgZGF0YS1qcz1cInVzZXJuYW1lXCIgY2xhc3M9XCJ1c2VybmFtZVwiIHR5cGU9XCJ0ZXh0XCI+PC9pbnB1dD5cbiAgICA8L2Rpdj5cbiAgICA8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cFwiPlxuICAgICAgIDxsYWJlbCBjbGFzcz1cImZvcm0tbGFiZWxcIiBmb3I9XCJwYXNzd29yZFwiPnBhc3N3b3JkPC9sYWJlbD5cbiAgICAgICA8aW5wdXQgZGF0YS1qcz1cInBhc3N3b3JkXCIgY2xhc3M9XCJwYXNzd29yZFwiIHR5cGU9XCJwYXNzd29yZFwiPjwvaW5wdXQ+XG4gICAgPC9kaXY+XG4gICAgPGRpdiBjbGFzcz1cImJ1dHRvbi1yb3dcIj5cbiAgICAgICAgPGJ1dHRvbiBkYXRhLWpzPVwic3VibWl0XCIgY2xhc3M9XCJidG4tZ2hvc3RcIiB0eXBlPVwiYnV0dG9uXCI+U3VibWl0PC9idXR0b24+XG4gICAgICAgIDxidXR0b24gZGF0YS1qcz1cImNhbmNlbFwiIGNsYXNzPVwiYnRuLWdob3N0XCIgdHlwZT1cImJ1dHRvblwiPkNhbmNlbDwvYnV0dG9uPlxuICAgIDwvZGl2PlxuPC9kaXY+YFxuIiwibW9kdWxlLmV4cG9ydHMgPSBwID0+IFxuYDxkaXY+XG4gICAgPGRpdj5cbiAgICAgICAgPGRpdj5Vc2VyczwvZGl2PlxuICAgICAgICA8YnV0dG9uIGRhdGEtanM9XCJhZGRCdG5cIiBjbGFzcz1cImFkZFwiPjwvYnV0dG9uPlxuICAgIDwvZGl2PlxuICAgIDxkaXYgZGF0YS1qcz1cImxpc3RcIj48L2Rpdj5cbjwvZGl2PmBcbiIsIm1vZHVsZS5leHBvcnRzID0gYDxzdmcgZGF0YS1qcz1cImZhY2Vib29rXCIgZW5hYmxlLWJhY2tncm91bmQ9XCJuZXcgMCAwIDU2LjY5MyA1Ni42OTNcIiBoZWlnaHQ9XCI1Ni42OTNweFwiIGlkPVwiTGF5ZXJfMVwiIHZlcnNpb249XCIxLjFcIiB2aWV3Qm94PVwiMCAwIDU2LjY5MyA1Ni42OTNcIiB3aWR0aD1cIjU2LjY5M3B4XCIgeG1sOnNwYWNlPVwicHJlc2VydmVcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgeG1sbnM6eGxpbms9XCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rXCI+PHBhdGggZD1cIk0yOC4zNDcsNS4xNTdjLTEzLjYsMC0yNC42MjUsMTEuMDI3LTI0LjYyNSwyNC42MjVjMCwxMy42LDExLjAyNSwyNC42MjMsMjQuNjI1LDI0LjYyM2MxMy42LDAsMjQuNjI1LTExLjAyMywyNC42MjUtMjQuNjIzICBDNTIuOTcyLDE2LjE4NCw0MS45NDYsNS4xNTcsMjguMzQ3LDUuMTU3eiBNMzQuODY0LDI5LjY3OWgtNC4yNjRjMCw2LjgxNCwwLDE1LjIwNywwLDE1LjIwN2gtNi4zMmMwLDAsMC04LjMwNywwLTE1LjIwN2gtMy4wMDYgIFYyNC4zMWgzLjAwNnYtMy40NzljMC0yLjQ5LDEuMTgyLTYuMzc3LDYuMzc5LTYuMzc3bDQuNjgsMC4wMTh2NS4yMTVjMCwwLTIuODQ2LDAtMy4zOTgsMGMtMC41NTUsMC0xLjM0LDAuMjc3LTEuMzQsMS40NjF2My4xNjMgIGg0LjgxOEwzNC44NjQsMjkuNjc5elwiLz48L3N2Zz5gXG4iLCJtb2R1bGUuZXhwb3J0cz1gPHN2ZyBkYXRhLWpzPVwiZ29vZ2xlXCIgZW5hYmxlLWJhY2tncm91bmQ9XCJuZXcgMCAwIDU2LjY5MyA1Ni42OTNcIiBoZWlnaHQ9XCI1Ni42OTNweFwiIGlkPVwiTGF5ZXJfMVwiIHZlcnNpb249XCIxLjFcIiB2aWV3Qm94PVwiMCAwIDU2LjY5MyA1Ni42OTNcIiB3aWR0aD1cIjU2LjY5M3B4XCIgeG1sOnNwYWNlPVwicHJlc2VydmVcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgeG1sbnM6eGxpbms9XCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rXCI+PGc+PHBhdGggZD1cIk0yMy43NjEsMjcuOTZjMC42MjksMCwxLjE2LTAuMjQ4LDEuNTctMC43MTdjMC42NDUtMC43MzIsMC45MjgtMS45MzYsMC43Ni0zLjIxNWMtMC4zMDEtMi4yODctMS45MzItNC4xODYtMy42MzctNC4yMzYgICBoLTAuMDY4Yy0wLjYwNCwwLTEuMTQxLDAuMjQ2LTEuNTUxLDAuNzE1Yy0wLjYzNywwLjcyNS0wLjkwMywxLjg3MS0wLjczNiwzLjE0NmMwLjI5OSwyLjI4MywxLjk2NSw0LjI1NiwzLjYzNSw0LjMwN0gyMy43NjF6XCIvPjxwYXRoIGQ9XCJNMjUuNjIyLDM0Ljg0N2MtMC4xNjgtMC4xMTMtMC4zNDItMC4yMzItMC41MjEtMC4zNTVjLTAuNTI1LTAuMTYyLTEuMDg0LTAuMjQ2LTEuNjU0LTAuMjU0aC0wLjA3MiAgIGMtMi42MjUsMC00LjkyOSwxLjU5Mi00LjkyOSwzLjQwNmMwLDEuOTcxLDEuOTcyLDMuNTE4LDQuNDkxLDMuNTE4YzMuMzIyLDAsNS4wMDYtMS4xNDUsNS4wMDYtMy40MDQgICBjMC0wLjIxNS0wLjAyNS0wLjQzNi0wLjA3Ni0wLjY1NkMyNy42NDIsMzYuMjIyLDI2LjgzNywzNS42NzUsMjUuNjIyLDM0Ljg0N3pcIi8+PHBhdGggZD1cIk0yOC4zNDcsNS4xNTdjLTEzLjYwMSwwLTI0LjYyNSwxMS4wMjMtMjQuNjI1LDI0LjYyM3MxMS4wMjUsMjQuNjI1LDI0LjYyNSwyNC42MjVjMTMuNTk4LDAsMjQuNjIzLTExLjAyNSwyNC42MjMtMjQuNjI1ICAgUzQxLjk0NCw1LjE1NywyOC4zNDcsNS4xNTd6IE0yNi4xMDYsNDMuMTc5Yy0wLjk4MiwwLjI4My0yLjA0MSwwLjQyOC0zLjE1NCwwLjQyOGMtMS4yMzgsMC0yLjQzLTAuMTQzLTMuNTQtMC40MjQgICBjLTIuMTUtMC41NDEtMy43NC0xLjU3LTQuNDgtMi44OTVjLTAuMzItMC41NzQtMC40ODItMS4xODQtMC40ODItMS44MTZjMC0wLjY1MiwwLjE1Ni0xLjMxMiwwLjQ2My0xLjk2NyAgIGMxLjE4LTIuNTEsNC4yODMtNC4xOTcsNy43MjItNC4xOTdjMC4wMzUsMCwwLjA2OCwwLDAuMSwwYy0wLjI3OS0wLjQ5Mi0wLjQxNi0xLjAwMi0wLjQxNi0xLjUzN2MwLTAuMjY4LDAuMDM1LTAuNTM5LDAuMTA1LTAuODE0ICAgYy0zLjYwNi0wLjA4NC02LjMwNi0yLjcyNS02LjMwNi02LjIwN2MwLTIuNDYxLDEuOTY1LTQuODU1LDQuNzc2LTUuODI0YzAuODQyLTAuMjkxLDEuNjk5LTAuNDM5LDIuNTQzLTAuNDM5aDcuNzEzICAgYzAuMjY0LDAsMC40OTQsMC4xNywwLjU3NiwwLjQyYzAuMDg0LDAuMjUyLTAuMDA4LDAuNTI1LTAuMjIxLDAuNjhsLTEuNzI1LDEuMjQ4Yy0wLjEwNCwwLjA3NC0wLjIyOSwwLjExNS0wLjM1NywwLjExNWgtMC42MTcgICBjMC43OTksMC45NTUsMS4yNjYsMi4zMTYsMS4yNjYsMy44NDhjMCwxLjY5MS0wLjg1NSwzLjI4OS0yLjQxLDQuNTA2Yy0xLjIwMSwwLjkzNi0xLjI1LDEuMTkxLTEuMjUsMS43MjkgICBjMC4wMTYsMC4yOTUsMC44NTQsMS4yNTIsMS43NzUsMS45MDRjMi4xNTIsMS41MjMsMi45NTMsMy4wMTQsMi45NTMsNS41MDhDMzEuMTQsNDAuMDQsMjkuMTYzLDQyLjI5MiwyNi4xMDYsNDMuMTc5eiAgICBNNDMuNTI4LDI5Ljk0OGMwLDAuMzM0LTAuMjczLDAuNjA1LTAuNjA3LDAuNjA1aC00LjM4M3Y0LjM4NWMwLDAuMzM2LTAuMjcxLDAuNjA3LTAuNjA3LDAuNjA3aC0xLjI0OCAgIGMtMC4zMzYsMC0wLjYwNy0wLjI3MS0wLjYwNy0wLjYwN3YtNC4zODVIMzEuNjljLTAuMzMyLDAtMC42MDUtMC4yNzEtMC42MDUtMC42MDV2LTEuMjVjMC0wLjMzNCwwLjI3My0wLjYwNywwLjYwNS0wLjYwN2g0LjM4NSAgIHYtNC4zODNjMC0wLjMzNiwwLjI3MS0wLjYwNywwLjYwNy0wLjYwN2gxLjI0OGMwLjMzNiwwLDAuNjA3LDAuMjcxLDAuNjA3LDAuNjA3djQuMzgzaDQuMzgzYzAuMzM0LDAsMC42MDcsMC4yNzMsMC42MDcsMC42MDcgICBWMjkuOTQ4elwiLz48L2c+PC9zdmc+YFxuIiwibW9kdWxlLmV4cG9ydHMgPSBgPHN2ZyBkYXRhLWpzPVwibWFpbFwiIHZlcnNpb249XCIxLjFcIiBpZD1cIkNhcGFfMVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB4bWxuczp4bGluaz1cImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmtcIiB4PVwiMHB4XCIgeT1cIjBweFwiXHJcblx0IHZpZXdCb3g9XCIwIDAgMTQgMTNcIiBzdHlsZT1cImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMTQgMTM7XCIgeG1sOnNwYWNlPVwicHJlc2VydmVcIj5cclxuXHQ8Zz5cclxuXHRcdDxwYXRoIHN0eWxlPVwiZmlsbDojMDMwMTA0O1wiIGQ9XCJNNyw5TDUuMjY4LDcuNDg0bC00Ljk1Miw0LjI0NUMwLjQ5NiwxMS44OTYsMC43MzksMTIsMS4wMDcsMTJoMTEuOTg2XHJcblx0XHRcdGMwLjI2NywwLDAuNTA5LTAuMTA0LDAuNjg4LTAuMjcxTDguNzMyLDcuNDg0TDcsOXpcIi8+XHJcblx0XHQ8cGF0aCBzdHlsZT1cImZpbGw6IzAzMDEwNDtcIiBkPVwiTTEzLjY4NCwyLjI3MUMxMy41MDQsMi4xMDMsMTMuMjYyLDIsMTIuOTkzLDJIMS4wMDdDMC43NCwyLDAuNDk4LDIuMTA0LDAuMzE4LDIuMjczTDcsOFxyXG5cdFx0XHRMMTMuNjg0LDIuMjcxelwiLz5cclxuXHRcdDxwb2x5Z29uIHN0eWxlPVwiZmlsbDojMDMwMTA0O1wiIHBvaW50cz1cIjAsMi44NzggMCwxMS4xODYgNC44MzMsNy4wNzkgXHRcdFwiLz5cclxuXHRcdDxwb2x5Z29uIHN0eWxlPVwiZmlsbDojMDMwMTA0O1wiIHBvaW50cz1cIjkuMTY3LDcuMDc5IDE0LDExLjE4NiAxNCwyLjg3NSBcdFx0XCIvPlxyXG5cdDwvZz5cclxuPC9zdmc+YFxyXG4iLCJtb2R1bGUuZXhwb3J0cz1gPHN2ZyBkYXRhLWpzPVwidHdpdHRlclwiIGVuYWJsZS1iYWNrZ3JvdW5kPVwibmV3IDAgMCA1Ni42OTMgNTYuNjkzXCIgaGVpZ2h0PVwiNTYuNjkzcHhcIiBpZD1cIkxheWVyXzFcIiB2ZXJzaW9uPVwiMS4xXCIgdmlld0JveD1cIjAgMCA1Ni42OTMgNTYuNjkzXCIgd2lkdGg9XCI1Ni42OTNweFwiIHhtbDpzcGFjZT1cInByZXNlcnZlXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHhtbG5zOnhsaW5rPVwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1wiPjxwYXRoIGQ9XCJNMjguMzQ4LDUuMTU3Yy0xMy42LDAtMjQuNjI1LDExLjAyNy0yNC42MjUsMjQuNjI1YzAsMTMuNiwxMS4wMjUsMjQuNjIzLDI0LjYyNSwyNC42MjNjMTMuNiwwLDI0LjYyMy0xMS4wMjMsMjQuNjIzLTI0LjYyMyAgQzUyLjk3MSwxNi4xODQsNDEuOTQ3LDUuMTU3LDI4LjM0OCw1LjE1N3ogTTQwLjc1MiwyNC44MTdjMC4wMTMsMC4yNjYsMC4wMTgsMC41MzMsMC4wMTgsMC44MDNjMCw4LjIwMS02LjI0MiwxNy42NTYtMTcuNjU2LDE3LjY1NiAgYy0zLjUwNCwwLTYuNzY3LTEuMDI3LTkuNTEzLTIuNzg3YzAuNDg2LDAuMDU3LDAuOTc5LDAuMDg2LDEuNDgsMC4wODZjMi45MDgsMCw1LjU4NC0wLjk5Miw3LjcwNy0yLjY1NiAgYy0yLjcxNS0wLjA1MS01LjAwNi0xLjg0Ni01Ljc5Ni00LjMxMWMwLjM3OCwwLjA3NCwwLjc2NywwLjExMSwxLjE2NywwLjExMWMwLjU2NiwwLDEuMTE0LTAuMDc0LDEuNjM1LTAuMjE3ICBjLTIuODQtMC41Ny00Ljk3OS0zLjA4LTQuOTc5LTYuMDg0YzAtMC4wMjcsMC0wLjA1MywwLjAwMS0wLjA4YzAuODM2LDAuNDY1LDEuNzkzLDAuNzQ0LDIuODExLDAuNzc3ICBjLTEuNjY2LTEuMTE1LTIuNzYxLTMuMDEyLTIuNzYxLTUuMTY2YzAtMS4xMzcsMC4zMDYtMi4yMDQsMC44NC0zLjEyYzMuMDYxLDMuNzU0LDcuNjM0LDYuMjI1LDEyLjc5Miw2LjQ4MyAgYy0wLjEwNi0wLjQ1My0wLjE2MS0wLjkyOC0wLjE2MS0xLjQxNGMwLTMuNDI2LDIuNzc4LTYuMjA1LDYuMjA2LTYuMjA1YzEuNzg1LDAsMy4zOTcsMC43NTQsNC41MjksMS45NTkgIGMxLjQxNC0wLjI3NywyLjc0Mi0wLjc5NSwzLjk0MS0xLjUwNmMtMC40NjUsMS40NS0xLjQ0OCwyLjY2Ni0yLjczLDMuNDMzYzEuMjU3LTAuMTUsMi40NTMtMC40ODQsMy41NjUtMC45NzcgIEM0My4wMTgsMjIuODQ5LDQxLjk2NSwyMy45NDIsNDAuNzUyLDI0LjgxN3pcIi8+PC9zdmc+YFxuIiwibW9kdWxlLmV4cG9ydHMgPSBlcnIgPT4geyBjb25zb2xlLmxvZyggZXJyLnN0YWNrIHx8IGVyciApIH1cbiIsIm1vZHVsZS5leHBvcnRzID0ge1xuXG4gICAgRXJyb3I6IHJlcXVpcmUoJy4vTXlFcnJvcicpLFxuXG4gICAgUDogKCBmdW4sIGFyZ3M9WyBdLCB0aGlzQXJnICkgPT5cbiAgICAgICAgbmV3IFByb21pc2UoICggcmVzb2x2ZSwgcmVqZWN0ICkgPT4gUmVmbGVjdC5hcHBseSggZnVuLCB0aGlzQXJnIHx8IHRoaXMsIGFyZ3MuY29uY2F0KCAoIGUsIC4uLmNhbGxiYWNrICkgPT4gZSA/IHJlamVjdChlKSA6IHJlc29sdmUoY2FsbGJhY2spICkgKSApLFxuICAgIFxuICAgIGNvbnN0cnVjdG9yKCkgeyByZXR1cm4gdGhpcyB9XG59XG4iLCIvLyBDb3B5cmlnaHQgSm95ZW50LCBJbmMuIGFuZCBvdGhlciBOb2RlIGNvbnRyaWJ1dG9ycy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYVxuLy8gY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxuLy8gXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nXG4vLyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsXG4vLyBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0XG4vLyBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGVcbi8vIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4vLyBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTXG4vLyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4vLyBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOXG4vLyBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbi8vIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuLy8gT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuLy8gVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblxuZnVuY3Rpb24gRXZlbnRFbWl0dGVyKCkge1xuICB0aGlzLl9ldmVudHMgPSB0aGlzLl9ldmVudHMgfHwge307XG4gIHRoaXMuX21heExpc3RlbmVycyA9IHRoaXMuX21heExpc3RlbmVycyB8fCB1bmRlZmluZWQ7XG59XG5tb2R1bGUuZXhwb3J0cyA9IEV2ZW50RW1pdHRlcjtcblxuLy8gQmFja3dhcmRzLWNvbXBhdCB3aXRoIG5vZGUgMC4xMC54XG5FdmVudEVtaXR0ZXIuRXZlbnRFbWl0dGVyID0gRXZlbnRFbWl0dGVyO1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLl9ldmVudHMgPSB1bmRlZmluZWQ7XG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLl9tYXhMaXN0ZW5lcnMgPSB1bmRlZmluZWQ7XG5cbi8vIEJ5IGRlZmF1bHQgRXZlbnRFbWl0dGVycyB3aWxsIHByaW50IGEgd2FybmluZyBpZiBtb3JlIHRoYW4gMTAgbGlzdGVuZXJzIGFyZVxuLy8gYWRkZWQgdG8gaXQuIFRoaXMgaXMgYSB1c2VmdWwgZGVmYXVsdCB3aGljaCBoZWxwcyBmaW5kaW5nIG1lbW9yeSBsZWFrcy5cbkV2ZW50RW1pdHRlci5kZWZhdWx0TWF4TGlzdGVuZXJzID0gMTA7XG5cbi8vIE9idmlvdXNseSBub3QgYWxsIEVtaXR0ZXJzIHNob3VsZCBiZSBsaW1pdGVkIHRvIDEwLiBUaGlzIGZ1bmN0aW9uIGFsbG93c1xuLy8gdGhhdCB0byBiZSBpbmNyZWFzZWQuIFNldCB0byB6ZXJvIGZvciB1bmxpbWl0ZWQuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnNldE1heExpc3RlbmVycyA9IGZ1bmN0aW9uKG4pIHtcbiAgaWYgKCFpc051bWJlcihuKSB8fCBuIDwgMCB8fCBpc05hTihuKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ24gbXVzdCBiZSBhIHBvc2l0aXZlIG51bWJlcicpO1xuICB0aGlzLl9tYXhMaXN0ZW5lcnMgPSBuO1xuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuZW1pdCA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgdmFyIGVyLCBoYW5kbGVyLCBsZW4sIGFyZ3MsIGksIGxpc3RlbmVycztcblxuICBpZiAoIXRoaXMuX2V2ZW50cylcbiAgICB0aGlzLl9ldmVudHMgPSB7fTtcblxuICAvLyBJZiB0aGVyZSBpcyBubyAnZXJyb3InIGV2ZW50IGxpc3RlbmVyIHRoZW4gdGhyb3cuXG4gIGlmICh0eXBlID09PSAnZXJyb3InKSB7XG4gICAgaWYgKCF0aGlzLl9ldmVudHMuZXJyb3IgfHxcbiAgICAgICAgKGlzT2JqZWN0KHRoaXMuX2V2ZW50cy5lcnJvcikgJiYgIXRoaXMuX2V2ZW50cy5lcnJvci5sZW5ndGgpKSB7XG4gICAgICBlciA9IGFyZ3VtZW50c1sxXTtcbiAgICAgIGlmIChlciBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICAgIHRocm93IGVyOyAvLyBVbmhhbmRsZWQgJ2Vycm9yJyBldmVudFxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gQXQgbGVhc3QgZ2l2ZSBzb21lIGtpbmQgb2YgY29udGV4dCB0byB0aGUgdXNlclxuICAgICAgICB2YXIgZXJyID0gbmV3IEVycm9yKCdVbmNhdWdodCwgdW5zcGVjaWZpZWQgXCJlcnJvclwiIGV2ZW50LiAoJyArIGVyICsgJyknKTtcbiAgICAgICAgZXJyLmNvbnRleHQgPSBlcjtcbiAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGhhbmRsZXIgPSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgaWYgKGlzVW5kZWZpbmVkKGhhbmRsZXIpKVxuICAgIHJldHVybiBmYWxzZTtcblxuICBpZiAoaXNGdW5jdGlvbihoYW5kbGVyKSkge1xuICAgIHN3aXRjaCAoYXJndW1lbnRzLmxlbmd0aCkge1xuICAgICAgLy8gZmFzdCBjYXNlc1xuICAgICAgY2FzZSAxOlxuICAgICAgICBoYW5kbGVyLmNhbGwodGhpcyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAyOlxuICAgICAgICBoYW5kbGVyLmNhbGwodGhpcywgYXJndW1lbnRzWzFdKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDM6XG4gICAgICAgIGhhbmRsZXIuY2FsbCh0aGlzLCBhcmd1bWVudHNbMV0sIGFyZ3VtZW50c1syXSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgLy8gc2xvd2VyXG4gICAgICBkZWZhdWx0OlxuICAgICAgICBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcbiAgICAgICAgaGFuZGxlci5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICB9XG4gIH0gZWxzZSBpZiAoaXNPYmplY3QoaGFuZGxlcikpIHtcbiAgICBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcbiAgICBsaXN0ZW5lcnMgPSBoYW5kbGVyLnNsaWNlKCk7XG4gICAgbGVuID0gbGlzdGVuZXJzLmxlbmd0aDtcbiAgICBmb3IgKGkgPSAwOyBpIDwgbGVuOyBpKyspXG4gICAgICBsaXN0ZW5lcnNbaV0uYXBwbHkodGhpcywgYXJncyk7XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuYWRkTGlzdGVuZXIgPSBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuICB2YXIgbTtcblxuICBpZiAoIWlzRnVuY3Rpb24obGlzdGVuZXIpKVxuICAgIHRocm93IFR5cGVFcnJvcignbGlzdGVuZXIgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMpXG4gICAgdGhpcy5fZXZlbnRzID0ge307XG5cbiAgLy8gVG8gYXZvaWQgcmVjdXJzaW9uIGluIHRoZSBjYXNlIHRoYXQgdHlwZSA9PT0gXCJuZXdMaXN0ZW5lclwiISBCZWZvcmVcbiAgLy8gYWRkaW5nIGl0IHRvIHRoZSBsaXN0ZW5lcnMsIGZpcnN0IGVtaXQgXCJuZXdMaXN0ZW5lclwiLlxuICBpZiAodGhpcy5fZXZlbnRzLm5ld0xpc3RlbmVyKVxuICAgIHRoaXMuZW1pdCgnbmV3TGlzdGVuZXInLCB0eXBlLFxuICAgICAgICAgICAgICBpc0Z1bmN0aW9uKGxpc3RlbmVyLmxpc3RlbmVyKSA/XG4gICAgICAgICAgICAgIGxpc3RlbmVyLmxpc3RlbmVyIDogbGlzdGVuZXIpO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzW3R5cGVdKVxuICAgIC8vIE9wdGltaXplIHRoZSBjYXNlIG9mIG9uZSBsaXN0ZW5lci4gRG9uJ3QgbmVlZCB0aGUgZXh0cmEgYXJyYXkgb2JqZWN0LlxuICAgIHRoaXMuX2V2ZW50c1t0eXBlXSA9IGxpc3RlbmVyO1xuICBlbHNlIGlmIChpc09iamVjdCh0aGlzLl9ldmVudHNbdHlwZV0pKVxuICAgIC8vIElmIHdlJ3ZlIGFscmVhZHkgZ290IGFuIGFycmF5LCBqdXN0IGFwcGVuZC5cbiAgICB0aGlzLl9ldmVudHNbdHlwZV0ucHVzaChsaXN0ZW5lcik7XG4gIGVsc2VcbiAgICAvLyBBZGRpbmcgdGhlIHNlY29uZCBlbGVtZW50LCBuZWVkIHRvIGNoYW5nZSB0byBhcnJheS5cbiAgICB0aGlzLl9ldmVudHNbdHlwZV0gPSBbdGhpcy5fZXZlbnRzW3R5cGVdLCBsaXN0ZW5lcl07XG5cbiAgLy8gQ2hlY2sgZm9yIGxpc3RlbmVyIGxlYWtcbiAgaWYgKGlzT2JqZWN0KHRoaXMuX2V2ZW50c1t0eXBlXSkgJiYgIXRoaXMuX2V2ZW50c1t0eXBlXS53YXJuZWQpIHtcbiAgICBpZiAoIWlzVW5kZWZpbmVkKHRoaXMuX21heExpc3RlbmVycykpIHtcbiAgICAgIG0gPSB0aGlzLl9tYXhMaXN0ZW5lcnM7XG4gICAgfSBlbHNlIHtcbiAgICAgIG0gPSBFdmVudEVtaXR0ZXIuZGVmYXVsdE1heExpc3RlbmVycztcbiAgICB9XG5cbiAgICBpZiAobSAmJiBtID4gMCAmJiB0aGlzLl9ldmVudHNbdHlwZV0ubGVuZ3RoID4gbSkge1xuICAgICAgdGhpcy5fZXZlbnRzW3R5cGVdLndhcm5lZCA9IHRydWU7XG4gICAgICBjb25zb2xlLmVycm9yKCcobm9kZSkgd2FybmluZzogcG9zc2libGUgRXZlbnRFbWl0dGVyIG1lbW9yeSAnICtcbiAgICAgICAgICAgICAgICAgICAgJ2xlYWsgZGV0ZWN0ZWQuICVkIGxpc3RlbmVycyBhZGRlZC4gJyArXG4gICAgICAgICAgICAgICAgICAgICdVc2UgZW1pdHRlci5zZXRNYXhMaXN0ZW5lcnMoKSB0byBpbmNyZWFzZSBsaW1pdC4nLFxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9ldmVudHNbdHlwZV0ubGVuZ3RoKTtcbiAgICAgIGlmICh0eXBlb2YgY29uc29sZS50cmFjZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAvLyBub3Qgc3VwcG9ydGVkIGluIElFIDEwXG4gICAgICAgIGNvbnNvbGUudHJhY2UoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUub24gPSBFdmVudEVtaXR0ZXIucHJvdG90eXBlLmFkZExpc3RlbmVyO1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLm9uY2UgPSBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuICBpZiAoIWlzRnVuY3Rpb24obGlzdGVuZXIpKVxuICAgIHRocm93IFR5cGVFcnJvcignbGlzdGVuZXIgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG5cbiAgdmFyIGZpcmVkID0gZmFsc2U7XG5cbiAgZnVuY3Rpb24gZygpIHtcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGcpO1xuXG4gICAgaWYgKCFmaXJlZCkge1xuICAgICAgZmlyZWQgPSB0cnVlO1xuICAgICAgbGlzdGVuZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9XG4gIH1cblxuICBnLmxpc3RlbmVyID0gbGlzdGVuZXI7XG4gIHRoaXMub24odHlwZSwgZyk7XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vLyBlbWl0cyBhICdyZW1vdmVMaXN0ZW5lcicgZXZlbnQgaWZmIHRoZSBsaXN0ZW5lciB3YXMgcmVtb3ZlZFxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVMaXN0ZW5lciA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gIHZhciBsaXN0LCBwb3NpdGlvbiwgbGVuZ3RoLCBpO1xuXG4gIGlmICghaXNGdW5jdGlvbihsaXN0ZW5lcikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCdsaXN0ZW5lciBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcblxuICBpZiAoIXRoaXMuX2V2ZW50cyB8fCAhdGhpcy5fZXZlbnRzW3R5cGVdKVxuICAgIHJldHVybiB0aGlzO1xuXG4gIGxpc3QgPSB0aGlzLl9ldmVudHNbdHlwZV07XG4gIGxlbmd0aCA9IGxpc3QubGVuZ3RoO1xuICBwb3NpdGlvbiA9IC0xO1xuXG4gIGlmIChsaXN0ID09PSBsaXN0ZW5lciB8fFxuICAgICAgKGlzRnVuY3Rpb24obGlzdC5saXN0ZW5lcikgJiYgbGlzdC5saXN0ZW5lciA9PT0gbGlzdGVuZXIpKSB7XG4gICAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgICBpZiAodGhpcy5fZXZlbnRzLnJlbW92ZUxpc3RlbmVyKVxuICAgICAgdGhpcy5lbWl0KCdyZW1vdmVMaXN0ZW5lcicsIHR5cGUsIGxpc3RlbmVyKTtcblxuICB9IGVsc2UgaWYgKGlzT2JqZWN0KGxpc3QpKSB7XG4gICAgZm9yIChpID0gbGVuZ3RoOyBpLS0gPiAwOykge1xuICAgICAgaWYgKGxpc3RbaV0gPT09IGxpc3RlbmVyIHx8XG4gICAgICAgICAgKGxpc3RbaV0ubGlzdGVuZXIgJiYgbGlzdFtpXS5saXN0ZW5lciA9PT0gbGlzdGVuZXIpKSB7XG4gICAgICAgIHBvc2l0aW9uID0gaTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHBvc2l0aW9uIDwgMClcbiAgICAgIHJldHVybiB0aGlzO1xuXG4gICAgaWYgKGxpc3QubGVuZ3RoID09PSAxKSB7XG4gICAgICBsaXN0Lmxlbmd0aCA9IDA7XG4gICAgICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuICAgIH0gZWxzZSB7XG4gICAgICBsaXN0LnNwbGljZShwb3NpdGlvbiwgMSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX2V2ZW50cy5yZW1vdmVMaXN0ZW5lcilcbiAgICAgIHRoaXMuZW1pdCgncmVtb3ZlTGlzdGVuZXInLCB0eXBlLCBsaXN0ZW5lcik7XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUucmVtb3ZlQWxsTGlzdGVuZXJzID0gZnVuY3Rpb24odHlwZSkge1xuICB2YXIga2V5LCBsaXN0ZW5lcnM7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMpXG4gICAgcmV0dXJuIHRoaXM7XG5cbiAgLy8gbm90IGxpc3RlbmluZyBmb3IgcmVtb3ZlTGlzdGVuZXIsIG5vIG5lZWQgdG8gZW1pdFxuICBpZiAoIXRoaXMuX2V2ZW50cy5yZW1vdmVMaXN0ZW5lcikge1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKVxuICAgICAgdGhpcy5fZXZlbnRzID0ge307XG4gICAgZWxzZSBpZiAodGhpcy5fZXZlbnRzW3R5cGVdKVxuICAgICAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8vIGVtaXQgcmVtb3ZlTGlzdGVuZXIgZm9yIGFsbCBsaXN0ZW5lcnMgb24gYWxsIGV2ZW50c1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCkge1xuICAgIGZvciAoa2V5IGluIHRoaXMuX2V2ZW50cykge1xuICAgICAgaWYgKGtleSA9PT0gJ3JlbW92ZUxpc3RlbmVyJykgY29udGludWU7XG4gICAgICB0aGlzLnJlbW92ZUFsbExpc3RlbmVycyhrZXkpO1xuICAgIH1cbiAgICB0aGlzLnJlbW92ZUFsbExpc3RlbmVycygncmVtb3ZlTGlzdGVuZXInKTtcbiAgICB0aGlzLl9ldmVudHMgPSB7fTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGxpc3RlbmVycyA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcblxuICBpZiAoaXNGdW5jdGlvbihsaXN0ZW5lcnMpKSB7XG4gICAgdGhpcy5yZW1vdmVMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lcnMpO1xuICB9IGVsc2UgaWYgKGxpc3RlbmVycykge1xuICAgIC8vIExJRk8gb3JkZXJcbiAgICB3aGlsZSAobGlzdGVuZXJzLmxlbmd0aClcbiAgICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIodHlwZSwgbGlzdGVuZXJzW2xpc3RlbmVycy5sZW5ndGggLSAxXSk7XG4gIH1cbiAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcblxuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUubGlzdGVuZXJzID0gZnVuY3Rpb24odHlwZSkge1xuICB2YXIgcmV0O1xuICBpZiAoIXRoaXMuX2V2ZW50cyB8fCAhdGhpcy5fZXZlbnRzW3R5cGVdKVxuICAgIHJldCA9IFtdO1xuICBlbHNlIGlmIChpc0Z1bmN0aW9uKHRoaXMuX2V2ZW50c1t0eXBlXSkpXG4gICAgcmV0ID0gW3RoaXMuX2V2ZW50c1t0eXBlXV07XG4gIGVsc2VcbiAgICByZXQgPSB0aGlzLl9ldmVudHNbdHlwZV0uc2xpY2UoKTtcbiAgcmV0dXJuIHJldDtcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUubGlzdGVuZXJDb3VudCA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgaWYgKHRoaXMuX2V2ZW50cykge1xuICAgIHZhciBldmxpc3RlbmVyID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gICAgaWYgKGlzRnVuY3Rpb24oZXZsaXN0ZW5lcikpXG4gICAgICByZXR1cm4gMTtcbiAgICBlbHNlIGlmIChldmxpc3RlbmVyKVxuICAgICAgcmV0dXJuIGV2bGlzdGVuZXIubGVuZ3RoO1xuICB9XG4gIHJldHVybiAwO1xufTtcblxuRXZlbnRFbWl0dGVyLmxpc3RlbmVyQ291bnQgPSBmdW5jdGlvbihlbWl0dGVyLCB0eXBlKSB7XG4gIHJldHVybiBlbWl0dGVyLmxpc3RlbmVyQ291bnQodHlwZSk7XG59O1xuXG5mdW5jdGlvbiBpc0Z1bmN0aW9uKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ2Z1bmN0aW9uJztcbn1cblxuZnVuY3Rpb24gaXNOdW1iZXIoYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnbnVtYmVyJztcbn1cblxuZnVuY3Rpb24gaXNPYmplY3QoYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnb2JqZWN0JyAmJiBhcmcgIT09IG51bGw7XG59XG5cbmZ1bmN0aW9uIGlzVW5kZWZpbmVkKGFyZykge1xuICByZXR1cm4gYXJnID09PSB2b2lkIDA7XG59XG4iXX0=
