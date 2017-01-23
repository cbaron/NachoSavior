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

        var name = path[0] ? path[0].charAt(0).toUpperCase() + path[0].slice(1) : '',
            view = this.Views[name] ? path[0] : 'home';

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
        title: 'click',
        twitter: 'click'
    },

    getLink: function getLink() {
        return encodeURIComponent(window.location.origin) + '/comic/' + this.model.data._id;
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
    onTitleClick: function onTitleClick() {
        this.emit('navigate', '/comic/' + this.model.data._id);
    },
    onTwitterClick: function onTwitterClick() {
        window.open('https://www.twitter.com/share?url=' + this.getLink() + '&via=tinyhanded&text=' + encodeURIComponent(this.model.data.title));
    },
    postRender: function postRender() {
        if (this.model && this.model.data._id) {
            if (!this.model.data.context) {
                this.els.context.style.display = 'none';
            }
            return this;
        }

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
        }).catch(function (e) {
            _this3.Error(e);_this3.Toast('Fail');
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
        }).catch(function (e) {
            _this4.Error(e);_this4.Toast('Fail');
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
        //logo: 'click'
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
    return '<div>\n    <div class="header" data-js="header">\n        <div class="title" data-js="title" >' + (p.title || '') + '</div>\n        <div class="pre-context" data-js="preContext" >' + (p.preContext || '') + '</div>\n        <div><img data-js="context" class="context" src="' + (p.context || '') + '"/></div>\n        <div class="post-context" data-js="postContext" >' + (p.postContext || '') + '</div>\n        ' + (p._id && p.user._id && !p.opts.readOnly ? '<button class="delete" data-js="delete"></button>' : '') + '\n        ' + (p._id && p.user._id && !p.opts.readOnly ? '<button class="edit" data-js="edit"></button>' : '') + '\n    </div>\n    ' + (p._id && p.user._id && !p.opts.readOnly ? '<div class="confirm hidden" data-js="confirmDialog">\n               <span>Are you sure?</span>\n               <button data-js="confirm" type="button">Delete</button> \n               <button data-js="cancel" type="button">Cancel</button> \n           </div>' : '') + '\n    <div class="clearfix">\n        <div class="date">' + require('moment')(p.created).format('MM-DD-YYYY') + '</div>\n    </div>\n    <img data-js="image" src="' + (p.image ? p.image : '') + '"/>\n    ' + (p.opts.readOnly ? '<div class="clearfix">\n             <div class="share">\n                 ' + require('./lib/facebook') + '\n                 ' + require('./lib/twitter') + '\n                 ' + require('./lib/google') + '\n                 <a href="mailto:badhombre@tinyhanded.com">' + require('./lib/mail') + '</a>\n             </div>\n             <!-- <div class="store" data-js="store">Store</div> -->\n         </div>' : '') + '\n</div>';
};

},{"./lib/facebook":37,"./lib/google":38,"./lib/mail":39,"./lib/twitter":40,"moment":"moment"}],28:[function(require,module,exports){
"use strict";

module.exports = function (p) {
    return "<div>\n    <div data-js=\"header\"></div>\n    <div class=\"form-group\">\n       <label class=\"form-label\">title</label>\n       <input data-js=\"title\" type=\"text\"></input>\n    </div>\n    <div class=\"form-group\">\n       <label class=\"form-label\">pre context</label>\n       <input data-js=\"preContext\" type=\"text\"></input>\n    </div>\n    <div class=\"form-group\">\n       <label class=\"form-label\">context</label>\n        <div>\n            <div data-js=\"contextUpload\" class=\"upload\">\n                <span>Upload File</span>\n                <input type=\"file\" data-js=\"context\" />\n            </div>\n            <img class=\"preview\" data-js=\"contextPreview\" />\n        </div>\n    </div>\n    <div class=\"form-group\">\n       <label class=\"form-label\">post context</label>\n       <input data-js=\"postContext\" type=\"text\"></input>\n    </div>\n    <div class=\"form-group\">\n       <label class=\"form-label\">image</label>\n        <div>\n            <div data-js=\"upload\" class=\"upload\">\n                <span>Upload File</span>\n                <input type=\"file\" data-js=\"image\" />\n            </div>\n            <img class=\"preview\" data-js=\"preview\" />\n        </div>\n    </div>\n    <div class=\"button-row\">\n        <button data-js=\"submit\" type=\"button\">Submit</button>\n        <button data-js=\"cancel\" type=\"button\">Cancel</button>\n    </div>\n</div>";
};

},{}],29:[function(require,module,exports){
"use strict";

module.exports = function (p) {
    return "<div>\n    <div>\n        <div>Comics</div>\n        <button data-js=\"addBtn\" class=\"add\"></button>\n    </div>\n    <div data-js=\"list\"></div>\n</div>";
};

},{}],30:[function(require,module,exports){
"use strict";

module.exports = function (p) {
    return "<header>\n    <img src=\"/static/img/logo.png\" />\n</header>";
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJjbGllbnQvanMvLlRlbXBsYXRlTWFwLmpzIiwiY2xpZW50L2pzLy5WaWV3TWFwLmpzIiwiY2xpZW50L2pzLy5lbnYiLCJjbGllbnQvanMvWGhyLmpzIiwiY2xpZW50L2pzL2ZhY3RvcnkvVmlldy5qcyIsImNsaWVudC9qcy9tYWluLmpzIiwiY2xpZW50L2pzL21vZGVscy9Vc2VyLmpzIiwiY2xpZW50L2pzL21vZGVscy9fX3Byb3RvX18uanMiLCJjbGllbnQvanMvcm91dGVyLmpzIiwiY2xpZW50L2pzL3ZpZXdzL0FkbWluLmpzIiwiY2xpZW50L2pzL3ZpZXdzL0FkbWluSXRlbS5qcyIsImNsaWVudC9qcy92aWV3cy9Db21pYy5qcyIsImNsaWVudC9qcy92aWV3cy9Db21pY01hbmFnZS5qcyIsImNsaWVudC9qcy92aWV3cy9Db21pY1Jlc291cmNlcy5qcyIsImNsaWVudC9qcy92aWV3cy9IZWFkZXIuanMiLCJjbGllbnQvanMvdmlld3MvSG9tZS5qcyIsImNsaWVudC9qcy92aWV3cy9Mb2dpbi5qcyIsImNsaWVudC9qcy92aWV3cy9Ub2FzdC5qcyIsImNsaWVudC9qcy92aWV3cy9Vc2VyLmpzIiwiY2xpZW50L2pzL3ZpZXdzL1VzZXJNYW5hZ2UuanMiLCJjbGllbnQvanMvdmlld3MvVXNlclJlc291cmNlcy5qcyIsImNsaWVudC9qcy92aWV3cy9fX3Byb3RvX18uanMiLCJjbGllbnQvanMvdmlld3MvbGliL09wdGltaXplZFJlc2l6ZS5qcyIsImNsaWVudC9qcy92aWV3cy9saWIvU3Bpbi5qcyIsImNsaWVudC9qcy92aWV3cy90ZW1wbGF0ZXMvQWRtaW4uanMiLCJjbGllbnQvanMvdmlld3MvdGVtcGxhdGVzL0FkbWluSXRlbS5qcyIsImNsaWVudC9qcy92aWV3cy90ZW1wbGF0ZXMvQ29taWMuanMiLCJjbGllbnQvanMvdmlld3MvdGVtcGxhdGVzL0NvbWljTWFuYWdlLmpzIiwiY2xpZW50L2pzL3ZpZXdzL3RlbXBsYXRlcy9Db21pY1Jlc291cmNlcy5qcyIsImNsaWVudC9qcy92aWV3cy90ZW1wbGF0ZXMvSGVhZGVyLmpzIiwiY2xpZW50L2pzL3ZpZXdzL3RlbXBsYXRlcy9Ib21lLmpzIiwiY2xpZW50L2pzL3ZpZXdzL3RlbXBsYXRlcy9Mb2dpbi5qcyIsImNsaWVudC9qcy92aWV3cy90ZW1wbGF0ZXMvVG9hc3QuanMiLCJjbGllbnQvanMvdmlld3MvdGVtcGxhdGVzL1VzZXIuanMiLCJjbGllbnQvanMvdmlld3MvdGVtcGxhdGVzL1VzZXJNYW5hZ2UuanMiLCJjbGllbnQvanMvdmlld3MvdGVtcGxhdGVzL1VzZXJSZXNvdXJjZXMuanMiLCJjbGllbnQvanMvdmlld3MvdGVtcGxhdGVzL2xpYi9mYWNlYm9vay5qcyIsImNsaWVudC9qcy92aWV3cy90ZW1wbGF0ZXMvbGliL2dvb2dsZS5qcyIsImNsaWVudC9qcy92aWV3cy90ZW1wbGF0ZXMvbGliL21haWwuanMiLCJjbGllbnQvanMvdmlld3MvdGVtcGxhdGVzL2xpYi90d2l0dGVyLmpzIiwibGliL015RXJyb3IuanMiLCJsaWIvTXlPYmplY3QuanMiLCJub2RlX21vZHVsZXMvZXZlbnRzL2V2ZW50cy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUEsT0FBTyxPQUFQLEdBQWU7QUFDZCxRQUFPLFFBQVEseUJBQVIsQ0FETztBQUVkLFlBQVcsUUFBUSw2QkFBUixDQUZHO0FBR2QsUUFBTyxRQUFRLHlCQUFSLENBSE87QUFJZCxjQUFhLFFBQVEsK0JBQVIsQ0FKQztBQUtkLGlCQUFnQixRQUFRLGtDQUFSLENBTEY7QUFNZCxTQUFRLFFBQVEsMEJBQVIsQ0FOTTtBQU9kLE9BQU0sUUFBUSx3QkFBUixDQVBRO0FBUWQsUUFBTyxRQUFRLHlCQUFSLENBUk87QUFTZCxRQUFPLFFBQVEseUJBQVIsQ0FUTztBQVVkLE9BQU0sUUFBUSx3QkFBUixDQVZRO0FBV2QsYUFBWSxRQUFRLDhCQUFSLENBWEU7QUFZZCxnQkFBZSxR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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJtb2R1bGUuZXhwb3J0cz17XG5cdEFkbWluOiByZXF1aXJlKCcuL3ZpZXdzL3RlbXBsYXRlcy9BZG1pbicpLFxuXHRBZG1pbkl0ZW06IHJlcXVpcmUoJy4vdmlld3MvdGVtcGxhdGVzL0FkbWluSXRlbScpLFxuXHRDb21pYzogcmVxdWlyZSgnLi92aWV3cy90ZW1wbGF0ZXMvQ29taWMnKSxcblx0Q29taWNNYW5hZ2U6IHJlcXVpcmUoJy4vdmlld3MvdGVtcGxhdGVzL0NvbWljTWFuYWdlJyksXG5cdENvbWljUmVzb3VyY2VzOiByZXF1aXJlKCcuL3ZpZXdzL3RlbXBsYXRlcy9Db21pY1Jlc291cmNlcycpLFxuXHRIZWFkZXI6IHJlcXVpcmUoJy4vdmlld3MvdGVtcGxhdGVzL0hlYWRlcicpLFxuXHRIb21lOiByZXF1aXJlKCcuL3ZpZXdzL3RlbXBsYXRlcy9Ib21lJyksXG5cdExvZ2luOiByZXF1aXJlKCcuL3ZpZXdzL3RlbXBsYXRlcy9Mb2dpbicpLFxuXHRUb2FzdDogcmVxdWlyZSgnLi92aWV3cy90ZW1wbGF0ZXMvVG9hc3QnKSxcblx0VXNlcjogcmVxdWlyZSgnLi92aWV3cy90ZW1wbGF0ZXMvVXNlcicpLFxuXHRVc2VyTWFuYWdlOiByZXF1aXJlKCcuL3ZpZXdzL3RlbXBsYXRlcy9Vc2VyTWFuYWdlJyksXG5cdFVzZXJSZXNvdXJjZXM6IHJlcXVpcmUoJy4vdmlld3MvdGVtcGxhdGVzL1VzZXJSZXNvdXJjZXMnKVxufSIsIm1vZHVsZS5leHBvcnRzPXtcblx0QWRtaW46IHJlcXVpcmUoJy4vdmlld3MvQWRtaW4nKSxcblx0QWRtaW5JdGVtOiByZXF1aXJlKCcuL3ZpZXdzL0FkbWluSXRlbScpLFxuXHRDb21pYzogcmVxdWlyZSgnLi92aWV3cy9Db21pYycpLFxuXHRDb21pY01hbmFnZTogcmVxdWlyZSgnLi92aWV3cy9Db21pY01hbmFnZScpLFxuXHRDb21pY1Jlc291cmNlczogcmVxdWlyZSgnLi92aWV3cy9Db21pY1Jlc291cmNlcycpLFxuXHRIZWFkZXI6IHJlcXVpcmUoJy4vdmlld3MvSGVhZGVyJyksXG5cdEhvbWU6IHJlcXVpcmUoJy4vdmlld3MvSG9tZScpLFxuXHRMb2dpbjogcmVxdWlyZSgnLi92aWV3cy9Mb2dpbicpLFxuXHRUb2FzdDogcmVxdWlyZSgnLi92aWV3cy9Ub2FzdCcpLFxuXHRVc2VyOiByZXF1aXJlKCcuL3ZpZXdzL1VzZXInKSxcblx0VXNlck1hbmFnZTogcmVxdWlyZSgnLi92aWV3cy9Vc2VyTWFuYWdlJyksXG5cdFVzZXJSZXNvdXJjZXM6IHJlcXVpcmUoJy4vdmlld3MvVXNlclJlc291cmNlcycpXG59Iiwid2luZG93LmNvb2tpZU5hbWUgPSAnY2hlZXRvamVzdXMnXG4iLCJtb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5jcmVhdGUoIE9iamVjdC5hc3NpZ24oIHt9LCByZXF1aXJlKCcuLi8uLi9saWIvTXlPYmplY3QnKSwge1xuXG4gICAgUmVxdWVzdDoge1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKCBkYXRhICkge1xuICAgICAgICAgICAgbGV0IHJlcSA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpXG5cbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSggKCByZXNvbHZlLCByZWplY3QgKSA9PiB7XG5cbiAgICAgICAgICAgICAgICByZXEub25sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIFsgNTAwLCA0MDQsIDQwMSBdLmluY2x1ZGVzKCB0aGlzLnN0YXR1cyApXG4gICAgICAgICAgICAgICAgICAgICAgICA/IHJlamVjdCggdGhpcy5yZXNwb25zZSApXG4gICAgICAgICAgICAgICAgICAgICAgICA6IHJlc29sdmUoIEpTT04ucGFyc2UodGhpcy5yZXNwb25zZSkgKVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmKCBkYXRhLm1ldGhvZCA9PT0gXCJnZXRcIiB8fCBkYXRhLm1ldGhvZCA9PT0gXCJvcHRpb25zXCIgKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBxcyA9IGRhdGEucXMgPyBgPyR7ZGF0YS5xc31gIDogJycgXG4gICAgICAgICAgICAgICAgICAgIHJlcS5vcGVuKCBkYXRhLm1ldGhvZCwgYC8ke2RhdGEucmVzb3VyY2V9JHtxc31gIClcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRIZWFkZXJzKCByZXEsIGRhdGEuaGVhZGVycyApXG4gICAgICAgICAgICAgICAgICAgIHJlcS5zZW5kKG51bGwpXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmVxLm9wZW4oIGRhdGEubWV0aG9kLCBgLyR7ZGF0YS5yZXNvdXJjZX1gLCB0cnVlKVxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldEhlYWRlcnMoIHJlcSwgZGF0YS5oZWFkZXJzIClcbiAgICAgICAgICAgICAgICAgICAgcmVxLnNlbmQoIGRhdGEuZGF0YSApXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSApXG4gICAgICAgIH0sXG5cbiAgICAgICAgcGxhaW5Fc2NhcGUoIHNUZXh0ICkge1xuICAgICAgICAgICAgLyogaG93IHNob3VsZCBJIHRyZWF0IGEgdGV4dC9wbGFpbiBmb3JtIGVuY29kaW5nPyB3aGF0IGNoYXJhY3RlcnMgYXJlIG5vdCBhbGxvd2VkPyB0aGlzIGlzIHdoYXQgSSBzdXBwb3NlLi4uOiAqL1xuICAgICAgICAgICAgLyogXCI0XFwzXFw3IC0gRWluc3RlaW4gc2FpZCBFPW1jMlwiIC0tLS0+IFwiNFxcXFwzXFxcXDdcXCAtXFwgRWluc3RlaW5cXCBzYWlkXFwgRVxcPW1jMlwiICovXG4gICAgICAgICAgICByZXR1cm4gc1RleHQucmVwbGFjZSgvW1xcc1xcPVxcXFxdL2csIFwiXFxcXCQmXCIpO1xuICAgICAgICB9LFxuXG4gICAgICAgIHNldEhlYWRlcnMoIHJlcSwgaGVhZGVycz17fSApIHtcbiAgICAgICAgICAgIHJlcS5zZXRSZXF1ZXN0SGVhZGVyKCBcIkFjY2VwdFwiLCBoZWFkZXJzLmFjY2VwdCB8fCAnYXBwbGljYXRpb24vanNvbicgKVxuICAgICAgICAgICAgcmVxLnNldFJlcXVlc3RIZWFkZXIoIFwiQ29udGVudC1UeXBlXCIsIGhlYWRlcnMuY29udGVudFR5cGUgfHwgJ3RleHQvcGxhaW4nIClcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBfZmFjdG9yeSggZGF0YSApIHtcbiAgICAgICAgcmV0dXJuIE9iamVjdC5jcmVhdGUoIHRoaXMuUmVxdWVzdCwgeyB9ICkuY29uc3RydWN0b3IoIGRhdGEgKVxuICAgIH0sXG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcblxuICAgICAgICBpZiggIVhNTEh0dHBSZXF1ZXN0LnByb3RvdHlwZS5zZW5kQXNCaW5hcnkgKSB7XG4gICAgICAgICAgWE1MSHR0cFJlcXVlc3QucHJvdG90eXBlLnNlbmRBc0JpbmFyeSA9IGZ1bmN0aW9uKHNEYXRhKSB7XG4gICAgICAgICAgICB2YXIgbkJ5dGVzID0gc0RhdGEubGVuZ3RoLCB1aThEYXRhID0gbmV3IFVpbnQ4QXJyYXkobkJ5dGVzKTtcbiAgICAgICAgICAgIGZvciAodmFyIG5JZHggPSAwOyBuSWR4IDwgbkJ5dGVzOyBuSWR4KyspIHtcbiAgICAgICAgICAgICAgdWk4RGF0YVtuSWR4XSA9IHNEYXRhLmNoYXJDb2RlQXQobklkeCkgJiAweGZmO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5zZW5kKHVpOERhdGEpO1xuICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcy5fZmFjdG9yeS5iaW5kKHRoaXMpXG4gICAgfVxuXG59ICksIHsgfSApLmNvbnN0cnVjdG9yKClcbiIsIm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmNyZWF0ZSgge1xuXG4gICAgY3JlYXRlKCBuYW1lLCBvcHRzICkge1xuICAgICAgICBjb25zdCBsb3dlciA9IG5hbWVcbiAgICAgICAgbmFtZSA9IG5hbWUuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBuYW1lLnNsaWNlKDEpXG4gICAgICAgIHJldHVybiBPYmplY3QuY3JlYXRlKFxuICAgICAgICAgICAgdGhpcy5WaWV3c1sgbmFtZSBdLFxuICAgICAgICAgICAgT2JqZWN0LmFzc2lnbigge1xuICAgICAgICAgICAgICAgIG5hbWU6IHsgdmFsdWU6IG5hbWUgfSxcbiAgICAgICAgICAgICAgICBmYWN0b3J5OiB7IHZhbHVlOiB0aGlzIH0sXG4gICAgICAgICAgICAgICAgdGVtcGxhdGU6IHsgdmFsdWU6IHRoaXMuVGVtcGxhdGVzWyBuYW1lIF0gfSxcbiAgICAgICAgICAgICAgICB1c2VyOiB7IHZhbHVlOiB0aGlzLlVzZXIgfVxuICAgICAgICAgICAgICAgIH0sIG9wdHMgKVxuICAgICAgICApLmNvbnN0cnVjdG9yKClcbiAgICAgICAgLm9uKCAnbmF2aWdhdGUnLCByb3V0ZSA9PiByZXF1aXJlKCcuLi9yb3V0ZXInKS5uYXZpZ2F0ZSggcm91dGUgKSApXG4gICAgICAgIC5vbiggJ2RlbGV0ZWQnLCAoKSA9PiBkZWxldGUgKHJlcXVpcmUoJy4uL3JvdXRlcicpKS52aWV3c1tuYW1lXSApXG4gICAgfSxcblxufSwge1xuICAgIFRlbXBsYXRlczogeyB2YWx1ZTogcmVxdWlyZSgnLi4vLlRlbXBsYXRlTWFwJykgfSxcbiAgICBVc2VyOiB7IHZhbHVlOiByZXF1aXJlKCcuLi9tb2RlbHMvVXNlcicgKSB9LFxuICAgIFZpZXdzOiB7IHZhbHVlOiByZXF1aXJlKCcuLi8uVmlld01hcCcpIH1cbn0gKVxuIiwid2luZG93Lm9ubG9hZCA9ICgpID0+IHtcbiAgICByZXF1aXJlKCcuLy5lbnYnKVxuICAgIHJlcXVpcmUoJy4vcm91dGVyJykuaW5pdGlhbGl6ZSgpXG59XG4iLCJtb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5jcmVhdGUoIHJlcXVpcmUoJy4vX19wcm90b19fLmpzJyksIHsgcmVzb3VyY2U6IHsgdmFsdWU6ICdtZScgfSB9IClcbiIsIm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmFzc2lnbiggeyB9LCByZXF1aXJlKCcuLi8uLi8uLi9saWIvTXlPYmplY3QnKSwgcmVxdWlyZSgnZXZlbnRzJykuRXZlbnRFbWl0dGVyLnByb3RvdHlwZSwge1xuXG4gICAgWGhyOiByZXF1aXJlKCcuLi9YaHInKSxcblxuICAgIGdldCggb3B0cz17IHF1ZXJ5Ont9IH0gKSB7XG4gICAgICAgIGlmKCBvcHRzLnF1ZXJ5IHx8IHRoaXMucGFnaW5hdGlvbiApIE9iamVjdC5hc3NpZ24oIG9wdHMucXVlcnksIHRoaXMucGFnaW5hdGlvbiApXG4gICAgICAgIHJldHVybiB0aGlzLlhociggeyBtZXRob2Q6IG9wdHMubWV0aG9kIHx8ICdnZXQnLCByZXNvdXJjZTogdGhpcy5yZXNvdXJjZSwgaGVhZGVyczogdGhpcy5oZWFkZXJzIHx8IHt9LCBxczogb3B0cy5xdWVyeSA/IEpTT04uc3RyaW5naWZ5KCBvcHRzLnF1ZXJ5ICkgOiB1bmRlZmluZWQgfSApXG4gICAgICAgIC50aGVuKCByZXNwb25zZSA9PiB7XG4gICAgICAgICAgICBpZiggIXRoaXMucGFnaW5hdGlvbiApIHJldHVybiBQcm9taXNlLnJlc29sdmUoIHRoaXMuZGF0YSA9IHJlc3BvbnNlIClcblxuICAgICAgICAgICAgaWYoICF0aGlzLmRhdGEgKSB0aGlzLmRhdGEgPSBbIF1cbiAgICAgICAgICAgIHRoaXMuZGF0YSA9IHRoaXMuZGF0YS5jb25jYXQocmVzcG9uc2UpXG4gICAgICAgICAgICB0aGlzLnBhZ2luYXRpb24uc2tpcCArPSB0aGlzLnBhZ2luYXRpb24ubGltaXRcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUocmVzcG9uc2UpXG4gICAgICAgIH0gKVxuICAgIH1cblxufSApXG4iLCJtb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5jcmVhdGUoIHtcblxuICAgIEVycm9yOiByZXF1aXJlKCcuLi8uLi9saWIvTXlFcnJvcicpLFxuICAgIFxuICAgIFVzZXI6IHJlcXVpcmUoJy4vbW9kZWxzL1VzZXInKSxcblxuICAgIFZpZXdGYWN0b3J5OiByZXF1aXJlKCcuL2ZhY3RvcnkvVmlldycpLFxuICAgIFxuICAgIFZpZXdzOiByZXF1aXJlKCcuLy5WaWV3TWFwJyksXG5cbiAgICBpbml0aWFsaXplKCkge1xuICAgICAgICB0aGlzLmNvbnRlbnRDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjY29udGVudCcpXG5cbiAgICAgICAgd2luZG93Lm9ucG9wc3RhdGUgPSB0aGlzLmhhbmRsZS5iaW5kKHRoaXMpXG5cbiAgICAgICAgdGhpcy5oZWFkZXIgPSB0aGlzLlZpZXdGYWN0b3J5LmNyZWF0ZSggJ2hlYWRlcicsIHsgaW5zZXJ0aW9uOiB7IHZhbHVlOiB7IGVsOiB0aGlzLmNvbnRlbnRDb250YWluZXIsIG1ldGhvZDogJ2luc2VydEJlZm9yZScgfSB9IH0gKVxuXG4gICAgICAgIHRoaXMuVXNlci5nZXQoKS50aGVuKCAoKSA9PlxuICAgICAgICBcbiAgICAgICAgICAgIHRoaXMuaGVhZGVyLm9uVXNlcigpXG4gICAgICAgICAgICAub24oICdzaWdub3V0JywgKCkgPT4gXG4gICAgICAgICAgICAgICAgUHJvbWlzZS5hbGwoIE9iamVjdC5rZXlzKCB0aGlzLnZpZXdzICkubWFwKCBuYW1lID0+IHRoaXMudmlld3NbIG5hbWUgXS5kZWxldGUoKSApIClcbiAgICAgICAgICAgICAgICAudGhlbiggKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnZpZXdzID0geyB9XG4gICAgICAgICAgICAgICAgICAgIGhpc3RvcnkucHVzaFN0YXRlKCB7fSwgJycsICcvJyApO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCB0aGlzLmhhbmRsZSgpIClcbiAgICAgICAgICAgICAgICB9IClcbiAgICAgICAgICAgICAgICAuY2F0Y2goIHRoaXMuRXJyb3IgKVxuICAgICAgICAgICAgKVxuXG4gICAgICAgIClcbiAgICAgICAgLmNhdGNoKCB0aGlzLkVycm9yIClcbiAgICAgICAgLnRoZW4oICgpID0+IHRoaXMuaGFuZGxlKCkgKVxuXG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgfSxcblxuICAgIGhhbmRsZSgpIHtcbiAgICAgICAgdGhpcy5oYW5kbGVyKCB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUuc3BsaXQoJy8nKS5zbGljZSgxKSApXG4gICAgfSxcblxuICAgIGhhbmRsZXIoIHBhdGggKSB7XG4gICAgICAgIGNvbnN0IG5hbWUgPSBwYXRoWzBdID8gcGF0aFswXS5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHBhdGhbMF0uc2xpY2UoMSkgOiAnJyxcbiAgICAgICAgICAgICAgdmlldyA9IHRoaXMuVmlld3NbbmFtZV0gPyBwYXRoWzBdIDogJ2hvbWUnO1xuXG4gICAgICAgICggKCB2aWV3ID09PSB0aGlzLmN1cnJlbnRWaWV3IClcbiAgICAgICAgICAgID8gUHJvbWlzZS5yZXNvbHZlKClcbiAgICAgICAgICAgIDogUHJvbWlzZS5hbGwoIE9iamVjdC5rZXlzKCB0aGlzLnZpZXdzICkubWFwKCB2aWV3ID0+IHRoaXMudmlld3NbIHZpZXcgXS5oaWRlKCkgKSApICkgXG4gICAgICAgIC50aGVuKCAoKSA9PiB7XG5cbiAgICAgICAgICAgIHRoaXMuY3VycmVudFZpZXcgPSB2aWV3XG5cbiAgICAgICAgICAgIGlmKCB0aGlzLnZpZXdzWyB2aWV3IF0gKSByZXR1cm4gdGhpcy52aWV3c1sgdmlldyBdLm5hdmlnYXRlKCBwYXRoIClcblxuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShcbiAgICAgICAgICAgICAgICB0aGlzLnZpZXdzWyB2aWV3IF0gPVxuICAgICAgICAgICAgICAgICAgICB0aGlzLlZpZXdGYWN0b3J5LmNyZWF0ZSggdmlldywge1xuICAgICAgICAgICAgICAgICAgICAgICAgaW5zZXJ0aW9uOiB7IHZhbHVlOiB7IGVsOiB0aGlzLmNvbnRlbnRDb250YWluZXIgfSB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgcGF0aDogeyB2YWx1ZTogcGF0aCwgd3JpdGFibGU6IHRydWUgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlT3B0czogeyB2YWx1ZTogeyByZWFkT25seTogdHJ1ZSB9IH1cbiAgICAgICAgICAgICAgICAgICAgfSApXG4gICAgICAgICAgICApXG4gICAgICAgIH0gKVxuICAgICAgICAuY2F0Y2goIHRoaXMuRXJyb3IgKVxuICAgIH0sXG5cbiAgICBuYXZpZ2F0ZSggbG9jYXRpb24gKSB7XG4gICAgICAgIGhpc3RvcnkucHVzaFN0YXRlKCB7fSwgJycsIGxvY2F0aW9uIClcbiAgICAgICAgdGhpcy5oYW5kbGUoKVxuICAgIH1cblxufSwgeyBjdXJyZW50VmlldzogeyB2YWx1ZTogJycsIHdyaXRhYmxlOiB0cnVlIH0sIHZpZXdzOiB7IHZhbHVlOiB7IH0gLCB3cml0YWJsZTogdHJ1ZSB9IH0gKVxuIiwibW9kdWxlLmV4cG9ydHMgPSBPYmplY3QuYXNzaWduKCB7fSwgcmVxdWlyZSgnLi9fX3Byb3RvX18nKSwge1xuXG4gICAgZGVsZXRlKCkge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5hbGwoIE9iamVjdC5rZXlzKCB0aGlzLnN1YlZpZXdzICkubWFwKCBzdWJWaWV3ID0+IHRoaXMuc3ViVmlld3NbIHN1YlZpZXcgXS5kZWxldGUoKSApIClcbiAgICAgICAgLnRoZW4oICgpID0+IHJlcXVpcmUoJy4vX19wcm90b19fJykuZGVsZXRlLmNhbGwodGhpcykgKVxuICAgIH0sXG5cbiAgICBuYXZpZ2F0ZSggcGF0aCApIHtcbiAgICAgICAgdGhpcy5wYXRoID0gcGF0aDtcblxuICAgICAgICByZXR1cm4gKCBwYXRoLmxlbmd0aCA9PT0gMSAmJiB0aGlzLmVscy5jb250YWluZXIuY2xhc3NMaXN0LmNvbnRhaW5zKCdoaWRlJykgKVxuICAgICAgICAgICAgPyBQcm9taXNlLmFsbCggT2JqZWN0LmtleXMoIHRoaXMuc3ViVmlld3MgKS5tYXAoIHZpZXcgPT4gdGhpcy5zdWJWaWV3c1sgdmlldyBdLmhpZGUoKSApICkudGhlbiggKCkgPT4gdGhpcy5zaG93KCkgKS5jYXRjaCggdGhpcy5FcnJvciApXG4gICAgICAgICAgICA6ICggdGhpcy5wYXRoLmxlbmd0aCA+IDEgKVxuICAgICAgICAgICAgICAgID8gKCB0aGlzLmVscy5jb250YWluZXIuY2xhc3NMaXN0LmNvbnRhaW5zKCdoaWRlJykgKVxuICAgICAgICAgICAgICAgICAgICA/IHRoaXMucmVuZGVyU3ViVmlldygpXG4gICAgICAgICAgICAgICAgICAgIDogdGhpcy5oaWRlKCkudGhlbiggKCkgPT4gdGhpcy5yZW5kZXJTdWJWaWV3KCkgKVxuICAgICAgICAgICAgICAgIDogUHJvbWlzZS5yZXNvbHZlKClcbiAgICB9LFxuXG4gICAgcG9zdFJlbmRlcigpIHtcbiAgICAgICAgdGhpcy52aWV3cyA9IHsgfVxuICAgICAgICB0aGlzLnN1YlZpZXdzID0geyB9XG5cbiAgICAgICAgaWYoIHRoaXMucGF0aC5sZW5ndGggPiAxICkge1xuICAgICAgICAgICAgdGhpcy5lbHMuY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoICdoaWRlJywgJ2hpZGRlbicgKVxuICAgICAgICAgICAgdGhpcy5yZW5kZXJTdWJWaWV3KClcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMub3B0aW9ucyA9IE9iamVjdC5jcmVhdGUoIHRoaXMuTW9kZWwsIHsgcmVzb3VyY2U6IHsgdmFsdWU6ICdhZG1pbicgfSB9IClcblxuICAgICAgICB0aGlzLm9wdGlvbnMuZ2V0KCB7IG1ldGhvZDogJ29wdGlvbnMnIH0gKVxuICAgICAgICAudGhlbiggKCkgPT5cbiAgICAgICAgICAgIHRoaXMub3B0aW9ucy5kYXRhLmZvckVhY2goIGNvbGxlY3Rpb24gPT5cbiAgICAgICAgICAgICAgICB0aGlzLnZpZXdzWyBjb2xsZWN0aW9uIF0gPSB0aGlzLmZhY3RvcnkuY3JlYXRlKFxuICAgICAgICAgICAgICAgICAgICAnQWRtaW5JdGVtJyxcbiAgICAgICAgICAgICAgICAgICAgeyBpbnNlcnRpb246IHsgdmFsdWU6IHsgZWw6IHRoaXMuZWxzLmxpc3QgfSB9LFxuICAgICAgICAgICAgICAgICAgICAgIG1vZGVsOiB7IHZhbHVlOiB7IGRhdGE6IHsgY29sbGVjdGlvbiB9IH0gfSB9XG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgKVxuICAgICAgICApXG4gICAgICAgIC5jYXRjaCggdGhpcy5FcnJvciApXG5cbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICB9LFxuXG4gICAgcmVuZGVyU3ViVmlldygpIHtcbiAgICAgICAgY29uc3Qgc3ViVmlld05hbWUgPSBgJHt0aGlzLmNhcGl0YWxpemVGaXJzdExldHRlcih0aGlzLnBhdGhbMV0pfVJlc291cmNlc2BcblxuICAgICAgICByZXR1cm4gdGhpcy5zdWJWaWV3c1sgc3ViVmlld05hbWUgXVxuICAgICAgICAgICAgPyB0aGlzLnN1YlZpZXdzWyBzdWJWaWV3TmFtZSBdLm9uTmF2aWdhdGlvbiggdGhpcy5wYXRoIClcbiAgICAgICAgICAgIDogdGhpcy5zdWJWaWV3c1sgc3ViVmlld05hbWUgXSA9IHRoaXMuZmFjdG9yeS5jcmVhdGUoIHN1YlZpZXdOYW1lLCB7IHBhdGg6IHsgdmFsdWU6IHRoaXMucGF0aCwgd3JpdGFibGU6IHRydWUgfSwgaW5zZXJ0aW9uOiB7IHZhbHVlOiB7IGVsOiB0aGlzLmVscy5jb250YWluZXIsIG1ldGhvZDogJ2luc2VydEJlZm9yZScgfSB9IH0gKVxuICAgIH0sXG5cbiAgICByZXF1aXJlc0xvZ2luOiB0cnVlXG59IClcbiIsIm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmFzc2lnbigge30sIHJlcXVpcmUoJy4vX19wcm90b19fJyksIHtcblxuICAgIGV2ZW50czoge1xuICAgICAgICBjb250YWluZXI6ICdjbGljaydcbiAgICB9LFxuXG4gICAgb25Db250YWluZXJDbGljaygpIHtcbiAgICAgICAgdGhpcy5lbWl0KCAnbmF2aWdhdGUnLCBgL2FkbWluLyR7dGhpcy5tb2RlbC5kYXRhLmNvbGxlY3Rpb259YCApXG4gICAgfVxufSApXG4iLCJtb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5hc3NpZ24oIHt9LCByZXF1aXJlKCcuL19fcHJvdG9fXycpLCB7XG5cbiAgICBldmVudHM6IHtcbiAgICAgICAgY2FuY2VsOiAnY2xpY2snLFxuICAgICAgICBjb25maXJtOiAnY2xpY2snLFxuICAgICAgICBkZWxldGU6ICdjbGljaycsXG4gICAgICAgIGVkaXQ6ICdjbGljaycsXG4gICAgICAgIGZhY2Vib29rOiAnY2xpY2snLFxuICAgICAgICBnb29nbGU6ICdjbGljaycsXG4gICAgICAgIC8vc3RvcmU6ICdjbGljaycsXG4gICAgICAgIHRpdGxlOiAnY2xpY2snLFxuICAgICAgICB0d2l0dGVyOiAnY2xpY2snXG4gICAgfSxcblxuICAgIGdldExpbmsoKSB7XG4gICAgICAgIHJldHVybiBgJHtlbmNvZGVVUklDb21wb25lbnQod2luZG93LmxvY2F0aW9uLm9yaWdpbil9L2NvbWljLyR7dGhpcy5tb2RlbC5kYXRhLl9pZH1gXG4gICAgfSxcblxuICAgIGdldENvbWljKCkge1xuICAgICAgICByZXR1cm4gYCR7d2luZG93LmxvY2F0aW9uLm9yaWdpbn0ke3RoaXMubW9kZWwuZGF0YS5pbWFnZX1gXG4gICAgfSxcblxuICAgIG5hdmlnYXRlKCBwYXRoICkge1xuICAgICAgICB0aGlzLnBhdGggPSBwYXRoXG4gICAgICAgIHRoaXMubW9kZWwucmVzb3VyY2UgPSBgY29taWMvJHt0aGlzLnBhdGhbMV19YFxuXG4gICAgICAgIHRoaXMubW9kZWwuZ2V0KClcbiAgICAgICAgLnRoZW4oIGNvbWljID0+IHtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlKGNvbWljKVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2hvdygpXG4gICAgICAgIH0gKVxuICAgICAgICAuY2F0Y2goIHRoaXMuRXJyb3IgKVxuICAgIH0sXG5cbiAgICBvbkNhbmNlbENsaWNrKCkge1xuICAgICAgICB0aGlzLmVscy5oZWFkZXIuY2xhc3NMaXN0LnJlbW92ZSgnaGlkZGVuJylcbiAgICAgICAgdGhpcy5lbHMuY29uZmlybURpYWxvZy5jbGFzc0xpc3QuYWRkKCdoaWRkZW4nKVxuICAgIH0sXG5cbiAgICBvbkNvbmZpcm1DbGljaygpIHtcbiAgICAgICAgdGhpcy5lbWl0KCdkZWxldGUnKVxuICAgIH0sXG5cbiAgICBvbkRlbGV0ZUNsaWNrKCkge1xuICAgICAgICBpZiggdGhpcy51c2VyICYmIHRoaXMudXNlci5kYXRhLl9pZCApIHtcbiAgICAgICAgICAgIHRoaXMuZWxzLmhlYWRlci5jbGFzc0xpc3QuYWRkKCdoaWRkZW4nKVxuICAgICAgICAgICAgdGhpcy5lbHMuY29uZmlybURpYWxvZy5jbGFzc0xpc3QucmVtb3ZlKCdoaWRkZW4nKVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIG9uRWRpdENsaWNrKCkge1xuICAgICAgICBpZiggdGhpcy51c2VyICYmIHRoaXMudXNlci5kYXRhLl9pZCApIHRoaXMuZW1pdCgnZWRpdCcpXG4gICAgfSxcblxuICAgIG9uRmFjZWJvb2tDbGljaygpIHsgd2luZG93Lm9wZW4oIGBodHRwczovL3d3dy5mYWNlYm9vay5jb20vc2hhcmVyLnBocD91PSR7dGhpcy5nZXRMaW5rKCl9YCApIH0sXG5cbiAgICBvblN0b3JlQ2xpY2soKSB7XG4gICAgICAgIHdpbmRvdy5vcGVuKFxuICAgICAgICAgICAgYGh0dHA6Ly93d3cuemF6emxlLmNvbS9hcGkvY3JlYXRlL2F0LTIzODM1NzQ3MDg4NDY4NTQ2OD9yZj0yMzgzNTc0NzA4ODQ2ODU0NjgmYXg9RGVzaWduQmxhc3Qmc3I9MjUwNzgyNDY5NDAwMDEzNjE2JmNnPTE5NjE2NzA4NTE4NjQyODk2MSZ0X191c2VRcGM9ZmFsc2UmZHM9dHJ1ZSZ0X19zbWFydD10cnVlJmNvbnRpbnVlVXJsPWh0dHAlM0ElMkYlMkZ3d3cuemF6emxlLmNvbSUyRnRpbnloYW5kZWQmZndkPVByb2R1Y3RQYWdlJnRjPSZpYz0mdF9pbWFnZTFfaWlkPSR7ZW5jb2RlVVJJQ29tcG9uZW50KHRoaXMuZ2V0Q29taWMoKSl9YFxuICAgICAgICApXG4gICAgfSxcbiAgICBcbiAgICBvbkdvb2dsZUNsaWNrKCkgeyB3aW5kb3cub3BlbiggYGh0dHBzOi8vcGx1cy5nb29nbGUuY29tL3NoYXJlP3VybD0ke3RoaXMuZ2V0TGluaygpfWApIH0sXG4gICAgXG4gICAgb25UaXRsZUNsaWNrKCkgeyB0aGlzLmVtaXQoICduYXZpZ2F0ZScsIGAvY29taWMvJHt0aGlzLm1vZGVsLmRhdGEuX2lkfWAgKSB9LFxuXG4gICAgb25Ud2l0dGVyQ2xpY2soKSB7IHdpbmRvdy5vcGVuKCBgaHR0cHM6Ly93d3cudHdpdHRlci5jb20vc2hhcmU/dXJsPSR7dGhpcy5nZXRMaW5rKCl9JnZpYT10aW55aGFuZGVkJnRleHQ9JHtlbmNvZGVVUklDb21wb25lbnQodGhpcy5tb2RlbC5kYXRhLnRpdGxlKX1gICkgfSxcblxuICAgIHBvc3RSZW5kZXIoKSB7XG4gICAgICAgIGlmKCB0aGlzLm1vZGVsICYmIHRoaXMubW9kZWwuZGF0YS5faWQgKSB7XG4gICAgICAgICAgICBpZiggISB0aGlzLm1vZGVsLmRhdGEuY29udGV4dCApIHsgdGhpcy5lbHMuY29udGV4dC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzXG4gICAgICAgIH1cblxuICAgICAgICBpZiggdGhpcy5wYXRoLmxlbmd0aCAhPT0gMiApIHsgdGhpcy5lbWl0KCAnbmF2aWdhdGUnLCAnJyApOyByZXR1cm4gdGhpcyB9XG5cbiAgICAgICAgdGhpcy5tb2RlbCA9IE9iamVjdC5jcmVhdGUoIHRoaXMuTW9kZWwsIHsgcmVzb3VyY2U6IHsgdmFsdWU6IGBjb21pYy8ke3RoaXMucGF0aFsxXX1gLCB3cml0YWJsZTogdHJ1ZSB9IH0gKVxuICAgICAgICB0aGlzLm1vZGVsLmdldCgpXG4gICAgICAgIC50aGVuKCB0aGlzLnVwZGF0ZS5iaW5kKHRoaXMpIClcbiAgICAgICAgLmNhdGNoKCB0aGlzLkVycm9yIClcblxuICAgICAgICByZXR1cm4gdGhpc1xuICAgIH0sXG5cbiAgICB1cGRhdGUoY29taWMpIHtcbiAgICAgICAgdGhpcy5tb2RlbC5kYXRhID0gY29taWNcbiAgICAgICAgdGhpcy5lbHMudGl0bGUudGV4dENvbnRlbnQgPSBjb21pYy50aXRsZVxuICAgICAgICB0aGlzLmVscy5wcmVDb250ZXh0LnRleHRDb250ZW50ID0gY29taWMucHJlQ29udGV4dFxuICAgICAgICB0aGlzLmVscy5wb3N0Q29udGV4dC50ZXh0Q29udGVudCA9IGNvbWljLnBvc3RDb250ZXh0XG4gICAgICAgIHRoaXMuZWxzLmltYWdlLnNyYyA9IGAke2NvbWljLmltYWdlfT8ke25ldyBEYXRlKCkuZ2V0VGltZSgpfWBcblxuICAgICAgICBpZiggISBjb21pYy5jb250ZXh0ICkgeyB0aGlzLmVscy5jb250ZXh0LnN0eWxlLmRpc3BsYXkgPSAnbm9uZScgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuZWxzLmNvbnRleHQuc3JjID0gY29taWMuY29udGV4dFxuICAgICAgICAgICAgdGhpcy5lbHMuY29udGV4dC5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJ1xuICAgICAgICB9XG4gICAgfVxufSApXG4iLCJtb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5hc3NpZ24oIHt9LCByZXF1aXJlKCcuL19fcHJvdG9fXycpLCB7XG5cbiAgICBUb2FzdDogcmVxdWlyZSgnLi9Ub2FzdCcpLFxuXG4gICAgZXZlbnRzOiB7XG4gICAgICAgIGNhbmNlbDogJ2NsaWNrJyxcbiAgICAgICAgc3VibWl0OiAnY2xpY2snXG4gICAgfSxcblxuICAgIG9uQ2FuY2VsQ2xpY2soKSB7IHRoaXMuaGlkZSgpLnRoZW4oICgpID0+IHRoaXMuZW1pdCgnY2FuY2VsbGVkJykgKSB9LFxuICAgIFxuICAgIG9uU3VibWl0Q2xpY2soKSB7XG4gICAgICAgIHRoaXNbIGByZXF1ZXN0JHt0aGlzLmNhcGl0YWxpemVGaXJzdExldHRlciggdGhpcy50eXBlICl9YCBdKClcbiAgICAgICAgLmNhdGNoKCB0aGlzLkVycm9yIClcbiAgICB9LFxuXG4gICAgb25OYXZpZ2F0aW9uKCB0eXBlLCBjb21pYyApIHtcbiAgICAgICAgdGhpcy50eXBlID0gdHlwZVxuICAgICAgICB0aGlzLm1vZGVsLmRhdGEgPSBjb21pY1xuICAgICAgIFxuICAgICAgICB0aGlzLnBvcHVsYXRlKCkgXG5cbiAgICAgICAgaWYoIHRoaXMuZWxzLmNvbnRhaW5lci5jbGFzc0xpc3QuY29udGFpbnMoJ2hpZGUnKSApIHRoaXMuc2hvdygpXG4gICAgfSxcblxuICAgIHBvcHVsYXRlKCkge1xuICAgICAgICB0aGlzLmVscy5oZWFkZXIudGV4dENvbnRlbnQgPSBgJHt0aGlzLmNhcGl0YWxpemVGaXJzdExldHRlciggdGhpcy50eXBlICl9IENvbWljYFxuXG4gICAgICAgIGlmKCBPYmplY3Qua2V5cyggdGhpcy5tb2RlbC5kYXRhICkubGVuZ3RoICkge1xuICAgICAgICAgICAgdGhpcy5lbHMudGl0bGUudmFsdWUgPSB0aGlzLm1vZGVsLmRhdGEudGl0bGUgfHwgJydcbiAgICAgICAgICAgIHRoaXMuZWxzLnByZXZpZXcuc3JjID0gdGhpcy5tb2RlbC5kYXRhLmltYWdlXG4gICAgICAgICAgICB0aGlzLmVscy5jb250ZXh0UHJldmlldy5zcmMgPSB0aGlzLm1vZGVsLmRhdGEuY29udGV4dFxuICAgICAgICAgICAgdGhpcy5lbHMucHJlQ29udGV4dC52YWx1ZSA9IHRoaXMubW9kZWwuZGF0YS5wcmVDb250ZXh0XG4gICAgICAgICAgICB0aGlzLmVscy5wb3N0Q29udGV4dC52YWx1ZSA9IHRoaXMubW9kZWwuZGF0YS5wb3N0Q29udGV4dFxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5lbHMudGl0bGUudmFsdWUgPSAnJ1xuICAgICAgICAgICAgdGhpcy5lbHMucHJldmlldy5zcmMgPSAnJ1xuICAgICAgICAgICAgdGhpcy5lbHMucHJlQ29udGV4dC52YWx1ZSA9ICcnXG4gICAgICAgICAgICB0aGlzLmVscy5wb3N0Q29udGV4dC52YWx1ZSA9ICcnXG4gICAgICAgICAgICB0aGlzLmVscy5jb250ZXh0UHJldmlldy5zcmMgPSAnJ1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIHBvc3RSZW5kZXIoKSB7XG4gICAgICAgIHRoaXMuc3Bpbm5lciA9IG5ldyB0aGlzLlNwaW5uZXIoIHtcbiAgICAgICAgICAgIGNvbG9yOiAnI2ZmZicsXG4gICAgICAgICAgICBsZW5ndGg6IDE1LFxuICAgICAgICAgICAgc2NhbGU6IDAuMjUsXG4gICAgICAgICAgICB3aWR0aDogNVxuICAgICAgICB9ICkuc3BpbigpXG5cbiAgICAgICAgdGhpcy5wb3B1bGF0ZSgpXG5cbiAgICAgICAgdGhpcy5lbHMuaW1hZ2UuYWRkRXZlbnRMaXN0ZW5lciggJ2NoYW5nZScsIGUgPT4ge1xuICAgICAgICAgICAgY29uc3QgYmFzZTY0UmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKSxcbiAgICAgICAgICAgICAgICAgIGJpbmFyeVJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKClcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdGhpcy5lbHMudXBsb2FkLmNsYXNzTGlzdC5hZGQoJ2hhcy1zcGlubmVyJylcbiAgICAgICAgICAgIHRoaXMuZWxzLnVwbG9hZC5hcHBlbmRDaGlsZCggdGhpcy5zcGlubmVyLnNwaW4oKS5lbCApXG5cbiAgICAgICAgICAgIGJhc2U2NFJlYWRlci5vbmxvYWQgPSAoIGV2dCApID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmVscy51cGxvYWQuY2xhc3NMaXN0LnJlbW92ZSgnaGFzLXNwaW5uZXInKVxuICAgICAgICAgICAgICAgIHRoaXMuc3Bpbm5lci5zdG9wKClcbiAgICAgICAgICAgICAgICB0aGlzLmVscy5wcmV2aWV3LnNyYyA9IGV2dC50YXJnZXQucmVzdWx0IFxuICAgICAgICAgICAgICAgIGJpbmFyeVJlYWRlci5vbmxvYWQgPSBldmVudCA9PiB0aGlzLmJpbmFyeUZpbGUgPSBldmVudC50YXJnZXQucmVzdWx0XG4gICAgICAgICAgICAgICAgYmluYXJ5UmVhZGVyLnJlYWRBc0FycmF5QnVmZmVyKCBlLnRhcmdldC5maWxlc1swXSApXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGJhc2U2NFJlYWRlci5yZWFkQXNEYXRhVVJMKCBlLnRhcmdldC5maWxlc1swXSApXG4gICAgICAgIH0gKVxuXG4gICAgICAgIHRoaXMuZWxzLmNvbnRleHQuYWRkRXZlbnRMaXN0ZW5lciggJ2NoYW5nZScsIGUgPT4ge1xuICAgICAgICAgICAgY29uc3QgYmFzZTY0UmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKSxcbiAgICAgICAgICAgICAgICAgIGJpbmFyeVJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKClcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdGhpcy5lbHMuY29udGV4dFVwbG9hZC5jbGFzc0xpc3QuYWRkKCdoYXMtc3Bpbm5lcicpXG4gICAgICAgICAgICB0aGlzLmVscy5jb250ZXh0VXBsb2FkLmFwcGVuZENoaWxkKCB0aGlzLnNwaW5uZXIuc3BpbigpLmVsIClcblxuICAgICAgICAgICAgYmFzZTY0UmVhZGVyLm9ubG9hZCA9ICggZXZ0ICkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuZWxzLnVwbG9hZC5jbGFzc0xpc3QucmVtb3ZlKCdoYXMtc3Bpbm5lcicpXG4gICAgICAgICAgICAgICAgdGhpcy5zcGlubmVyLnN0b3AoKVxuICAgICAgICAgICAgICAgIHRoaXMuZWxzLmNvbnRleHRQcmV2aWV3LnNyYyA9IGV2dC50YXJnZXQucmVzdWx0IFxuICAgICAgICAgICAgICAgIGJpbmFyeVJlYWRlci5vbmxvYWQgPSBldmVudCA9PiB0aGlzLmJpbmFyeUNvbnRleHQgPSBldmVudC50YXJnZXQucmVzdWx0XG4gICAgICAgICAgICAgICAgYmluYXJ5UmVhZGVyLnJlYWRBc0FycmF5QnVmZmVyKCBlLnRhcmdldC5maWxlc1swXSApXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGJhc2U2NFJlYWRlci5yZWFkQXNEYXRhVVJMKCBlLnRhcmdldC5maWxlc1swXSApXG4gICAgICAgIH0gKVxuICAgICAgICAgICAgXG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgfSxcblxuICAgIHJlcXVlc3RBZGQoKSB7XG4gICAgICAgIGlmKCAhdGhpcy5iaW5hcnlGaWxlICkgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpXG5cbiAgICAgICAgbGV0IHVwbG9hZHMgPSBbIHRoaXMuWGhyKCB7IG1ldGhvZDogJ1BPU1QnLCByZXNvdXJjZTogJ2ZpbGUnLCBkYXRhOiB0aGlzLmJpbmFyeUZpbGUsIGhlYWRlcnM6IHsgY29udGVudFR5cGU6ICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nIH0gfSApIF1cblxuICAgICAgICBpZiggdGhpcy5iaW5hcnlDb250ZXh0ICkgdXBsb2Fkcy5wdXNoKCB0aGlzLlhociggeyBtZXRob2Q6ICdQT1NUJywgcmVzb3VyY2U6ICdmaWxlJywgZGF0YTogdGhpcy5iaW5hcnlDb250ZXh0LCBoZWFkZXJzOiB7IGNvbnRlbnRUeXBlOiAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJyB9IH0gKSApXG5cbiAgICAgICAgcmV0dXJuIFByb21pc2UuYWxsKCB1cGxvYWRzIClcbiAgICAgICAgLnRoZW4oICggWyBjb21pY1Jlc3BvbnNlLCBjb250ZXh0UmVzcG9uc2UgXSApID0+XG4gICAgICAgICAgICB0aGlzLlhocigge1xuICAgICAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICAgICAgICAgIHJlc291cmNlOiAnY29taWMnLFxuICAgICAgICAgICAgICAgIGRhdGE6IEpTT04uc3RyaW5naWZ5KCB7XG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiB0aGlzLmVscy50aXRsZS52YWx1ZSxcbiAgICAgICAgICAgICAgICAgICAgaW1hZ2U6IGNvbWljUmVzcG9uc2UucGF0aCxcbiAgICAgICAgICAgICAgICAgICAgcHJlQ29udGV4dDogdGhpcy5lbHMucHJlQ29udGV4dC52YWx1ZSxcbiAgICAgICAgICAgICAgICAgICAgY29udGV4dDogY29udGV4dFJlc3BvbnNlID8gY29udGV4dFJlc3BvbnNlLnBhdGggOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgICAgIHBvc3RDb250ZXh0OiB0aGlzLmVscy5wb3N0Q29udGV4dC52YWx1ZSxcbiAgICAgICAgICAgICAgICAgICAgY3JlYXRlZDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpXG4gICAgICAgICAgICAgICAgfSApXG4gICAgICAgICAgICB9IClcbiAgICAgICAgKVxuICAgICAgICAudGhlbiggcmVzcG9uc2UgPT4gdGhpcy5oaWRlKCkudGhlbiggKCkgPT4gdGhpcy5lbWl0KCAnYWRkZWQnLCByZXNwb25zZSApICkgKVxuICAgICAgICAuY2F0Y2goIGUgPT4geyB0aGlzLkVycm9yKGUpOyB0aGlzLlRvYXN0KCAnRmFpbCcgKSB9IClcbiAgICB9LFxuXG4gICAgcmVxdWVzdEVkaXQoKSB7XG4gICAgICAgIGxldCBkYXRhID0geyB0aXRsZTogdGhpcy5lbHMudGl0bGUudmFsdWUgfVxuICAgICAgICBcbiAgICAgICAgcmV0dXJuICggKCB0aGlzLmJpbmFyeUZpbGUgKVxuICAgICAgICAgICAgPyB0aGlzLlhociggeyBtZXRob2Q6ICdQQVRDSCcsIHJlc291cmNlOiBgZmlsZS8ke3RoaXMubW9kZWwuZGF0YS5pbWFnZS5zcGxpdCgnLycpWzRdfWAsIGRhdGE6IHRoaXMuYmluYXJ5RmlsZSwgaGVhZGVyczogeyBjb250ZW50VHlwZTogJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbScgfSB9IClcbiAgICAgICAgICAgIDogUHJvbWlzZS5yZXNvbHZlKCkgKVxuICAgICAgICAudGhlbiggKCkgPT4gdGhpcy5YaHIoIHsgbWV0aG9kOiAnUEFUQ0gnLCByZXNvdXJjZTogYGNvbWljLyR7dGhpcy5tb2RlbC5kYXRhLl9pZH1gLCBkYXRhOiBKU09OLnN0cmluZ2lmeSggZGF0YSApIH0gKSApXG4gICAgICAgIC50aGVuKCByZXNwb25zZSA9PiB0aGlzLmhpZGUoKS50aGVuKCAoKSA9PiB0aGlzLmVtaXQoICdlZGl0ZWQnLCByZXNwb25zZSApICkgKVxuICAgICAgICAuY2F0Y2goIGUgPT4geyB0aGlzLkVycm9yKGUpOyB0aGlzLlRvYXN0KCAnRmFpbCcgKSB9IClcbiAgICB9XG59IClcbiIsIm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmFzc2lnbigge30sIHJlcXVpcmUoJy4vX19wcm90b19fJyksIHtcblxuICAgIGNyZWF0ZUNvbWljVmlldyggY29taWMsIG9wdHM9e30gKSB7XG4gICAgICAgIHRoaXMudmlld3NbIGNvbWljLl9pZCBdID0gdGhpcy5mYWN0b3J5LmNyZWF0ZShcbiAgICAgICAgICAgICdDb21pYycsXG4gICAgICAgICAgICB7IGluc2VydGlvbjogb3B0cy5pbnNlcnRpb24gfHwgeyB2YWx1ZTogeyBlbDogdGhpcy5lbHMubGlzdCB9IH0sXG4gICAgICAgICAgICAgIG1vZGVsOiB7IHZhbHVlOiB7IGRhdGE6IGNvbWljIH0gfVxuICAgICAgICAgICAgfVxuICAgICAgICApXG5cbiAgICAgICAgdGhpcy52aWV3c1sgY29taWMuX2lkIF1cbiAgICAgICAgLm9uKCAnZWRpdCcsICgpID0+IHRoaXMuZW1pdCggJ25hdmlnYXRlJywgYC9hZG1pbi9jb21pYy9lZGl0LyR7Y29taWMuX2lkfWApIClcbiAgICAgICAgLm9uKCAnZGVsZXRlJywgKCkgPT5cbiAgICAgICAgICAgIHRoaXMuWGhyKCB7IG1ldGhvZDogJ2RlbGV0ZScsIHJlc291cmNlOiBgY29taWMvJHtjb21pYy5faWR9YCB9IClcbiAgICAgICAgICAgIC50aGVuKCAoKSA9PiB0aGlzLnZpZXdzWyBjb21pYy5faWQgXS5kZWxldGUoKSApXG4gICAgICAgICAgICAuY2F0Y2goIHRoaXMuRXJyb3IgKVxuICAgICAgICApXG4gICAgfSxcblxuICAgIGRlbGV0ZSgpIHtcbiAgICAgICAgcmV0dXJuICggKCB0aGlzLnZpZXdzLkNvbWljTWFuYWdlIClcbiAgICAgICAgICAgID8gdGhpcy52aWV3cy5Db21pY01hbmFnZS5kZWxldGUoKVxuICAgICAgICAgICAgOiBQcm9taXNlLnJlc29sdmUoKSApXG4gICAgICAgIC50aGVuKCAoKSA9PiByZXF1aXJlKCcuL19fcHJvdG9fXycpLmRlbGV0ZS5jYWxsKHRoaXMpIClcbiAgICB9LFxuXG4gICAgZXZlbnRzOiB7XG4gICAgICAgIGFkZEJ0bjogJ2NsaWNrJ1xuICAgIH0sXG5cbiAgICBmZXRjaEFuZERpc3BsYXkoKSB7XG4gICAgICAgIHRoaXMuZmV0Y2hpbmcgPSB0cnVlXG4gICAgICAgIHJldHVybiB0aGlzLmNvbWljcy5nZXQoKVxuICAgICAgICAudGhlbiggcmVzcG9uc2UgPT4ge1xuICAgICAgICAgICAgcmVzcG9uc2UuZm9yRWFjaCggY29taWMgPT4gdGhpcy5jcmVhdGVDb21pY1ZpZXcoY29taWMpIClcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodGhpcy5mZXRjaGluZyA9IGZhbHNlIClcbiAgICAgICAgfSApXG4gICAgfSxcblxuICAgIG1hbmFnZUNvbWljKCB0eXBlLCBjb21pYyApIHtcbiAgICAgICAgdGhpcy52aWV3cy5Db21pY01hbmFnZSBcbiAgICAgICAgICAgID8gdGhpcy52aWV3cy5Db21pY01hbmFnZS5vbk5hdmlnYXRpb24oIHR5cGUsIGNvbWljIClcbiAgICAgICAgICAgIDogdGhpcy52aWV3cy5Db21pY01hbmFnZSA9XG4gICAgICAgICAgICAgICAgdGhpcy5mYWN0b3J5LmNyZWF0ZSggJ0NvbWljTWFuYWdlJywgeyB0eXBlOiB7IHZhbHVlOiB0eXBlLCB3cml0YWJsZTogdHJ1ZSB9LCBtb2RlbDogeyB2YWx1ZTogeyBkYXRhOiBjb21pYyB8fCB7fSB9IH0sIGluc2VydGlvbjogeyB2YWx1ZTogeyBlbDogdGhpcy5lbHMuY29udGFpbmVyLCBtZXRob2Q6ICdpbnNlcnRCZWZvcmUnIH0gfSB9IClcbiAgICAgICAgICAgICAgICAub24oICdhZGRlZCcsIGNvbWljID0+IHsgdGhpcy5jcmVhdGVDb21pY1ZpZXcoY29taWMsIHsgaW5zZXJ0aW9uOiB7IHZhbHVlOiB7IGVsOiB0aGlzLmVscy5saXN0LmZpcnN0Q2hpbGQsIG1ldGhvZDogJ2luc2VydEJlZm9yZScgfSB9IH0gKTsgdGhpcy5lbWl0KCAnbmF2aWdhdGUnLCBgL2FkbWluL2NvbWljYCApOyB9IClcbiAgICAgICAgICAgICAgICAub24oICdjYW5jZWxsZWQnLCAoKSA9PiB0aGlzLmVtaXQoICduYXZpZ2F0ZScsIGAvYWRtaW4vY29taWNgICkgKVxuICAgICAgICAgICAgICAgIC5vbiggJ2VkaXRlZCcsIGNvbWljID0+IHsgdGhpcy52aWV3c1sgY29taWMuX2lkIF0udXBkYXRlKCBjb21pYyApOyB0aGlzLmVtaXQoICduYXZpZ2F0ZScsIGAvYWRtaW4vY29taWNgICk7IH0gKVxuICAgIH0sXG5cbiAgICBvbkFkZEJ0bkNsaWNrKCkgeyB0aGlzLmVtaXQoICduYXZpZ2F0ZScsIGAvYWRtaW4vY29taWMvYWRkYCApIH0sXG5cbiAgICBvbk5hdmlnYXRpb24oIHBhdGggKSB7XG4gICAgICAgIHRoaXMucGF0aCA9IHBhdGg7XG5cbiAgICAgICAgKCBwYXRoLmxlbmd0aCA9PT0gMiAmJiB0aGlzLmVscy5jb250YWluZXIuY2xhc3NMaXN0LmNvbnRhaW5zKCdoaWRlJykgKSBcbiAgICAgICAgICAgID8gdGhpcy52aWV3cy5Db21pY01hbmFnZSAmJiAhdGhpcy52aWV3cy5Db21pY01hbmFnZS5lbHMuY29udGFpbmVyLmNsYXNzTGlzdC5jb250YWlucygnaGlkZScpXG4gICAgICAgICAgICAgICAgPyB0aGlzLnZpZXdzLkNvbWljTWFuYWdlLmhpZGUoKS50aGVuKCAoKSA9PiB0aGlzLnNob3coKSApXG4gICAgICAgICAgICAgICAgOiB0aGlzLnNob3coKVxuICAgICAgICAgICAgOiBwYXRoLmxlbmd0aCA9PT0gM1xuICAgICAgICAgICAgICAgID8gdGhpcy5oaWRlKCkudGhlbiggKCkgPT4gdGhpcy5tYW5hZ2VDb21pYyggcGF0aFsyXSwgeyB9ICkgKVxuICAgICAgICAgICAgICAgIDogcGF0aC5sZW5ndGggPT09IDRcbiAgICAgICAgICAgICAgICAgICAgID8gdGhpcy5oaWRlKCkudGhlbiggKCkgPT4gdGhpcy5tYW5hZ2VDb21pYyggcGF0aFsyXSwgdGhpcy52aWV3c1sgcGF0aFszXSBdLm1vZGVsLmRhdGEgKSApXG4gICAgICAgICAgICAgICAgICAgICA6IHVuZGVmaW5lZFxuICAgIH0sXG5cbiAgICBvblNjcm9sbCggZSApIHtcbiAgICAgICAgaWYoIHRoaXMuZmV0Y2hpbmcgfHwgdGhpcy5pc0hpZGRlbigpICkgcmV0dXJuXG4gICAgICAgIGlmKCAoIHRoaXMuY29udGVudC5vZmZzZXRIZWlnaHQgLSAoIHdpbmRvdy5zY3JvbGxZICsgd2luZG93LmlubmVySGVpZ2h0ICkgKSA8IDEwMCApIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoIHRoaXMuZmV0Y2hBbmREaXNwbGF5LmJpbmQodGhpcykuY2F0Y2goIHRoaXMuRXJyb3IgKSApXG4gICAgfSxcblxuICAgIHBvc3RSZW5kZXIoKSB7XG4gICAgICAgIHRoaXMuY29udGVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNjb250ZW50JylcblxuICAgICAgICBpZiggdGhpcy5wYXRoLmxlbmd0aCA+IDIgKSB7XG4gICAgICAgICAgICB0aGlzLmVscy5jb250YWluZXIuY2xhc3NMaXN0LmFkZCggJ2hpZGRlbicsICdoaWRlJyApXG4gICAgICAgICAgICBpZiggdGhpcy5wYXRoWzJdID09PSBcImFkZFwiICkgeyB0aGlzLm1hbmFnZUNvbWljKCBcImFkZFwiLCB7IH0gKSB9XG4gICAgICAgICAgICBlbHNlIGlmKCB0aGlzLnBhdGhbMl0gPT09IFwiZWRpdFwiICYmIHRoaXMucGF0aFszXSApIHtcbiAgICAgICAgICAgICAgICB0aGlzLlhociggeyBtZXRob2Q6IFwiZ2V0XCIsIHJlc291cmNlOiBgY29taWMvJHt0aGlzLnBhdGhbM119YCB9IClcbiAgICAgICAgICAgICAgICAudGhlbiggcmVzcG9uc2UgPT4gdGhpcy5tYW5hZ2VDb21pYyggXCJlZGl0XCIsIHJlc3BvbnNlICkgKVxuICAgICAgICAgICAgICAgIC5jYXRjaCggZSA9PiB7IHRoaXMuRXJyb3IoZSk7IHRoaXMuZW1pdCggJ25hdmlnYXRlJywgYC9hZG1pbi9jb21pY2AgKSB9IClcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmKCB0aGlzLnBhdGgubGVuZ3RoID09PSAxICYmIHRoaXMudmlld3MuQ29taWNNYW5hZ2UgKSB7XG4gICAgICAgICAgICB0aGlzLnZpZXdzLkNvbWljTWFuYWdlLmhpZGUoKVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jb21pY3MgPSBPYmplY3QuY3JlYXRlKCB0aGlzLk1vZGVsLCB7IHBhZ2luYXRpb246IHsgdmFsdWU6IHsgc2tpcDogMCwgbGltaXQ6MTAsIHNvcnQ6IHsgY3JlYXRlZDogLTEgfSB9IH0sIHJlc291cmNlOiB7IHZhbHVlOiAnY29taWMnIH0gfSApXG4gICAgICAgIFxuICAgICAgICB0aGlzLmZldGNoQW5kRGlzcGxheSgpLmNhdGNoKCB0aGlzLkVycm9yIClcblxuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lciggJ3Njcm9sbCcsIGUgPT4gdGhpcy5vblNjcm9sbChlKSApXG5cbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICB9LFxuXG4gICAgcmVxdWlyZXNMb2dpbjogdHJ1ZVxufSApXG4iLCJtb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5hc3NpZ24oIHt9LCByZXF1aXJlKCcuL19fcHJvdG9fXycpLCB7XG5cbiAgICBldmVudHM6IHtcbiAgICAgICAgLy9sb2dvOiAnY2xpY2snXG4gICAgfSxcblxuICAgIG9uVXNlcigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICB9LFxuXG4gICAgb25Mb2dvQ2xpY2soKSB7XG4gICAgICAgIHRoaXMuc2lnbm91dCgpXG4gICAgfSxcblxuICAgIHJlcXVpcmVzTG9naW46IGZhbHNlLFxuICAgIFxuICAgIHNpZ25vdXQoKSB7XG5cbiAgICAgICAgZG9jdW1lbnQuY29va2llID0gYCR7d2luZG93LmNvb2tpZU5hbWV9PTsgZXhwaXJlcz1UaHUsIDAxIEphbiAxOTcwIDAwOjAwOjAxIEdNVDtgO1xuXG4gICAgICAgIGlmKCB0aGlzLnVzZXIuZGF0YS5faWQgKSB7XG4gICAgICAgICAgICB0aGlzLnVzZXIuZGF0YSA9IHsgfVxuICAgICAgICAgICAgdGhpcy5lbWl0KCAnc2lnbm91dCcgKVxuICAgICAgICB9XG5cbiAgICB9XG5cbn0gKVxuIiwibW9kdWxlLmV4cG9ydHMgPSBPYmplY3QuYXNzaWduKCB7fSwgcmVxdWlyZSgnLi9fX3Byb3RvX18nKSwge1xuXG4gICAgZmV0Y2hBbmREaXNwbGF5KCkge1xuICAgICAgICB0aGlzLmZldGNoaW5nID0gdHJ1ZVxuICAgICAgICByZXR1cm4gdGhpcy5nZXREYXRhKClcbiAgICAgICAgLnRoZW4oIHJlc3BvbnNlID0+IHtcbiAgICAgICAgICAgIHJlc3BvbnNlLmZvckVhY2goIGNvbWljID0+XG4gICAgICAgICAgICAgICAgdGhpcy52aWV3c1sgY29taWMuX2lkIF0gPVxuICAgICAgICAgICAgICAgICAgICB0aGlzLmZhY3RvcnkuY3JlYXRlKCAnY29taWMnLCB7IGluc2VydGlvbjogeyB2YWx1ZTogeyBlbDogdGhpcy5lbHMuY29udGFpbmVyIH0gfSwgbW9kZWw6IHsgdmFsdWU6IHsgZGF0YTogY29taWMgfSB9LCB0ZW1wbGF0ZU9wdHM6IHsgdmFsdWU6IHsgcmVhZE9ubHk6IHRydWUgfSB9IH0gKVxuICAgICAgICAgICAgKVxuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh0aGlzLmZldGNoaW5nID0gZmFsc2UgKVxuICAgICAgICB9IClcbiAgICB9LFxuXG4gICAgZ2V0RGF0YSgpIHtcbiAgICAgICAgaWYoICF0aGlzLm1vZGVsICkgdGhpcy5tb2RlbCA9IE9iamVjdC5jcmVhdGUoIHRoaXMuTW9kZWwsIHsgcGFnaW5hdGlvbjogeyB2YWx1ZTogeyBza2lwOiAwLCBsaW1pdDoxMCwgc29ydDogeyBjcmVhdGVkOiAtMSB9IH0gfSwgcmVzb3VyY2U6IHsgdmFsdWU6ICdjb21pYycgfSB9IClcblxuICAgICAgICByZXR1cm4gdGhpcy5tb2RlbC5nZXQoKVxuICAgIH0sXG5cbiAgICBuYXZpZ2F0ZSgpIHtcbiAgICAgICAgdGhpcy5zaG93KClcbiAgICB9LFxuXG4gICAgb25TY3JvbGwoIGUgKSB7XG4gICAgICAgIGlmKCB0aGlzLmZldGNoaW5nICkgcmV0dXJuXG4gICAgICAgIGlmKCAoIHRoaXMuY29udGVudC5vZmZzZXRIZWlnaHQgLSAoIHdpbmRvdy5zY3JvbGxZICsgd2luZG93LmlubmVySGVpZ2h0ICkgKSA8IDEwMCApIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoIHRoaXMuZmV0Y2hBbmREaXNwbGF5LmJpbmQodGhpcykgKVxuICAgIH0sXG5cbiAgICBwb3N0UmVuZGVyKCkge1xuICAgICAgICB0aGlzLmNvbnRlbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjY29udGVudCcpXG4gICAgICAgIFxuICAgICAgICB0aGlzLmZldGNoQW5kRGlzcGxheSgpLmNhdGNoKCB0aGlzLkVycm9yIClcblxuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lciggJ3Njcm9sbCcsIGUgPT4gdGhpcy5vblNjcm9sbChlKSApXG5cbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICB9XG5cbn0gKVxuIiwibW9kdWxlLmV4cG9ydHMgPSBPYmplY3QuYXNzaWduKCB7fSwgcmVxdWlyZSgnLi9fX3Byb3RvX18nKSwge1xuICAgIFxuICAgIGV2ZW50czoge1xuICAgICAgICBzdWJtaXQ6ICdjbGljaydcbiAgICB9LFxuXG4gICAgb25TdWJtaXRDbGljaygpIHtcbiAgICAgICAgdGhpcy5YaHIoIHsgbWV0aG9kOiAncG9zdCcsIHJlc291cmNlOiAnYXV0aCcsIGRhdGE6IEpTT04uc3RyaW5naWZ5KCB7IHVzZXJuYW1lOiB0aGlzLmVscy51c2VybmFtZS52YWx1ZSwgcGFzc3dvcmQ6IHRoaXMuZWxzLnBhc3N3b3JkLnZhbHVlIH0gKSB9IClcbiAgICAgICAgLnRoZW4oICgpID0+IHRoaXMudXNlci5nZXQoKSApXG4gICAgICAgIC50aGVuKCAoKSA9PiB0aGlzLmhpZGUoKSApXG4gICAgICAgIC50aGVuKCAoKSA9PiBQcm9taXNlLnJlc29sdmUoIHRoaXMuZW1pdCggJ2xvZ2dlZEluJyApKSApXG4gICAgICAgIC5jYXRjaCggdGhpcy5FcnJvciApXG4gICAgfVxufSApXG4iLCJtb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5jcmVhdGUoIE9iamVjdC5hc3NpZ24oIHt9LCByZXF1aXJlKCcuL19fcHJvdG9fXycpLCB7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oIHRoaXMsIHtcbiAgICAgICAgICAgIGVsczogeyB9LFxuICAgICAgICAgICAgc2x1cnA6IHsgYXR0cjogJ2RhdGEtanMnLCB2aWV3OiAnZGF0YS12aWV3JyB9LFxuICAgICAgICAgICAgdGVtcGxhdGU6IHJlcXVpcmUoJy4vdGVtcGxhdGVzL1RvYXN0JylcbiAgICAgICAgfSApXG4gICAgICAgIC5yZW5kZXIoKVxuICAgIH0sXG5cbiAgICBmYWN0b3J5KCB0ZXh0ICkge1xuICAgICAgICB0aGlzLmVscy5jb250ZW50LnRleHRDb250ZW50ID0gdGV4dFxuICAgICAgICByZXR1cm4gdGhpcy5zaG93KCkudGhlbiggKCkgPT4gdGhpcy5oaWRlKCkgKVxuICAgIH0sXG5cbiAgICBpbnNlcnRpb246IHsgZWw6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2JvZHknKSB9LFxuXG4gICAgbmFtZTogJ1RvYXN0JyxcblxuICAgIHBvc3RSZW5kZXIoKSB7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuZmFjdG9yeS5iaW5kKHRoaXMpXG4gICAgfVxuICAgIFxufSApLCB7IH0gKS5jb25zdHJ1Y3RvcigpXG4iLCJtb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5hc3NpZ24oIHt9LCByZXF1aXJlKCcuL19fcHJvdG9fXycpLCB7XG5cbiAgICBldmVudHM6IHtcbiAgICAgICAgY2FuY2VsOiAnY2xpY2snLFxuICAgICAgICBjb25maXJtOiAnY2xpY2snLFxuICAgICAgICBkZWxldGU6ICdjbGljaycsXG4gICAgICAgIGVkaXQ6ICdjbGljaydcbiAgICB9LFxuXG4gICAgb25DYW5jZWxDbGljaygpIHtcbiAgICAgICAgdGhpcy5lbHMudXNlcm5hbWUuY2xhc3NMaXN0LnJlbW92ZSgnaGlkZGVuJylcbiAgICAgICAgdGhpcy5lbHMuY29uZmlybURpYWxvZy5jbGFzc0xpc3QuYWRkKCdoaWRkZW4nKVxuICAgIH0sXG5cbiAgICBvbkNvbmZpcm1DbGljaygpIHtcbiAgICAgICAgdGhpcy5lbWl0KCdkZWxldGUnKVxuICAgIH0sXG5cbiAgICBvbkRlbGV0ZUNsaWNrKCkge1xuICAgICAgICBpZiggdGhpcy51c2VyICYmIHRoaXMudXNlci5kYXRhLl9pZCApIHtcbiAgICAgICAgICAgIHRoaXMuZWxzLnVzZXJuYW1lLmNsYXNzTGlzdC5hZGQoJ2hpZGRlbicpXG4gICAgICAgICAgICB0aGlzLmVscy5jb25maXJtRGlhbG9nLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGRlbicpXG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgb25FZGl0Q2xpY2soKSB7XG4gICAgICAgIGlmKCB0aGlzLnVzZXIgJiYgdGhpcy51c2VyLmRhdGEuX2lkICkgdGhpcy5lbWl0KCdlZGl0JylcbiAgICB9LFxuXG4gICAgdXBkYXRlKHVzZXIpIHtcbiAgICAgICAgdGhpcy51c2VyLmRhdGEgPSB1c2VyXG4gICAgICAgIHRoaXMuZWxzLnVzZXJuYW1lLnRleHRDb250ZW50ID0gdXNlci51c2VybmFtZVxuICAgIH1cblxufSApXG4iLCJtb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5hc3NpZ24oIHt9LCByZXF1aXJlKCcuL19fcHJvdG9fXycpLCB7XG5cbiAgICBldmVudHM6IHtcbiAgICAgICAgY2FuY2VsOiAnY2xpY2snLFxuICAgICAgICBzdWJtaXQ6ICdjbGljaydcbiAgICB9LFxuXG4gICAgb25DYW5jZWxDbGljaygpIHsgdGhpcy5oaWRlKCkudGhlbiggKCkgPT4gdGhpcy5lbWl0KCdjYW5jZWxsZWQnKSApIH0sXG4gICAgXG4gICAgb25TdWJtaXRDbGljaygpIHtcbiAgICAgICAgdGhpc1sgYHJlcXVlc3Qke3RoaXMuY2FwaXRhbGl6ZUZpcnN0TGV0dGVyKCB0aGlzLnR5cGUgKX1gIF0oKVxuICAgICAgICAuY2F0Y2goIHRoaXMuRXJyb3IgKVxuICAgIH0sXG5cbiAgICBvbk5hdmlnYXRpb24oIHR5cGUsIGNvbWljICkge1xuICAgICAgICB0aGlzLnR5cGUgPSB0eXBlXG4gICAgICAgIHRoaXMubW9kZWwuZGF0YSA9IGNvbWljXG4gICAgICAgXG4gICAgICAgIHRoaXMucG9wdWxhdGUoKSBcbiAgICAgICAgXG4gICAgICAgIGlmKCB0aGlzLmVscy5jb250YWluZXIuY2xhc3NMaXN0LmNvbnRhaW5zKCdoaWRlJykgKSB0aGlzLnNob3coKVxuICAgIH0sXG5cbiAgICBwb3B1bGF0ZSgpIHtcbiAgICAgICAgdGhpcy5lbHMudGl0bGUudGV4dENvbnRlbnQgPSBgJHt0aGlzLmNhcGl0YWxpemVGaXJzdExldHRlciggdGhpcy50eXBlICl9IFVzZXJgXG5cbiAgICAgICAgdGhpcy5lbHMudXNlcm5hbWUudmFsdWUgPSBPYmplY3Qua2V5cyggdGhpcy5tb2RlbC5kYXRhICkubGVuZ3RoID8gdGhpcy5tb2RlbC5kYXRhLnVzZXJuYW1lIDogJydcbiAgICAgICAgdGhpcy5lbHMucGFzc3dvcmQudmFsdWUgPSAnJ1xuICAgIH0sXG5cbiAgICBwb3N0UmVuZGVyKCkge1xuICAgICAgICB0aGlzLnBvcHVsYXRlKCkgXG4gICAgICAgICAgICBcbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICB9LFxuXG4gICAgcmVxdWVzdEFkZCgpIHtcbiAgICAgICAgaWYoIHRoaXMuZWxzLnBhc3N3b3JkLnZhbHVlLmxlbmd0aCA9PT0gMCApIHJldHVyblxuICAgICAgICByZXR1cm4gdGhpcy5YaHIoIHsgbWV0aG9kOiAnUE9TVCcsIHJlc291cmNlOiAndXNlcicsIGRhdGE6IEpTT04uc3RyaW5naWZ5KCB7IHVzZXJuYW1lOiB0aGlzLmVscy51c2VybmFtZS52YWx1ZSwgcGFzc3dvcmQ6IHRoaXMuZWxzLnBhc3N3b3JkLnZhbHVlIH0gKSB9IClcbiAgICAgICAgLnRoZW4oIHJlc3BvbnNlID0+IHRoaXMuaGlkZSgpLnRoZW4oICgpID0+IHRoaXMuZW1pdCggJ2FkZGVkJywgeyBfaWQ6IHJlc3BvbnNlLl9pZCwgdXNlcm5hbWU6IHJlc3BvbnNlLnVzZXJuYW1lIH0gKSApIClcbiAgICB9LFxuXG4gICAgcmVxdWVzdEVkaXQoKSB7XG4gICAgICAgIGxldCBkYXRhID0geyB1c2VybmFtZTogdGhpcy5lbHMudXNlcm5hbWUudmFsdWUgfVxuXG4gICAgICAgIGlmKCB0aGlzLmVscy5wYXNzd29yZC52YWx1ZS5sZW5ndGggKSBkYXRhLnBhc3N3b3JkID0gdGhpcy5lbHMucGFzc3dvcmQudmFsdWVcbiAgICAgICAgcmV0dXJuIHRoaXMuWGhyKCB7IG1ldGhvZDogJ1BBVENIJywgcmVzb3VyY2U6IGB1c2VyLyR7dGhpcy51c2VyLmRhdGEuX2lkfWAsIGRhdGE6IEpTT04uc3RyaW5naWZ5KCBkYXRhICkgfSApXG4gICAgICAgIC50aGVuKCByZXNwb25zZSA9PiB0aGlzLmhpZGUoKS50aGVuKCAoKSA9PiB0aGlzLmVtaXQoICdlZGl0ZWQnLCB7IF9pZDogcmVzcG9uc2UuX2lkLCB1c2VybmFtZTogcmVzcG9uc2UudXNlcm5hbWUgfSApICkgKVxuICAgIH1cbn0gKVxuIiwibW9kdWxlLmV4cG9ydHMgPSBPYmplY3QuYXNzaWduKCB7fSwgcmVxdWlyZSgnLi9fX3Byb3RvX18nKSwge1xuXG4gICAgY3JlYXRlVXNlclZpZXcoIHVzZXIgKSB7XG4gICAgICAgIHRoaXMudmlld3NbIHVzZXIuX2lkIF0gPSB0aGlzLmZhY3RvcnkuY3JlYXRlKFxuICAgICAgICAgICAgJ1VzZXInLFxuICAgICAgICAgICAgeyBpbnNlcnRpb246IHsgdmFsdWU6IHsgZWw6IHRoaXMuZWxzLmxpc3QgfSB9LFxuICAgICAgICAgICAgICBtb2RlbDogeyB2YWx1ZTogeyBkYXRhOiB1c2VyIH0gfVxuICAgICAgICAgICAgfVxuICAgICAgICApXG5cbiAgICAgICAgdGhpcy52aWV3c1sgdXNlci5faWQgXVxuICAgICAgICAub24oICdlZGl0JywgKCkgPT4gdGhpcy5lbWl0KCAnbmF2aWdhdGUnLCBgL2FkbWluL3VzZXIvZWRpdC8ke3VzZXIuX2lkfWApIClcbiAgICAgICAgLm9uKCAnZGVsZXRlJywgKCkgPT5cbiAgICAgICAgICAgIHRoaXMuWGhyKCB7IG1ldGhvZDogJ2RlbGV0ZScsIHJlc291cmNlOiBgdXNlci8ke3VzZXIuX2lkfWAgfSApXG4gICAgICAgICAgICAudGhlbiggKCkgPT4gdGhpcy52aWV3c1sgdXNlci5faWQgXS5kZWxldGUoKSApXG4gICAgICAgICAgICAuY2F0Y2goIHRoaXMuRXJyb3IgKVxuICAgICAgICApXG4gICAgfSxcblxuICAgIGRlbGV0ZSgpIHtcbiAgICAgICAgcmV0dXJuICggKCB0aGlzLnZpZXdzLlVzZXJNYW5hZ2UgKVxuICAgICAgICAgICAgPyB0aGlzLnZpZXdzLlVzZXJNYW5hZ2UuZGVsZXRlKClcbiAgICAgICAgICAgIDogUHJvbWlzZS5yZXNvbHZlKCkgKVxuICAgICAgICAudGhlbiggKCkgPT4gcmVxdWlyZSgnLi9fX3Byb3RvX18nKS5kZWxldGUuY2FsbCh0aGlzKSApXG4gICAgfSxcblxuICAgIGV2ZW50czoge1xuICAgICAgICBhZGRCdG46ICdjbGljaydcbiAgICB9LFxuXG4gICAgbWFuYWdlVXNlciggdHlwZSwgdXNlciApIHtcbiAgICAgICAgdGhpcy52aWV3cy5Vc2VyTWFuYWdlIFxuICAgICAgICAgICAgPyB0aGlzLnZpZXdzLlVzZXJNYW5hZ2Uub25OYXZpZ2F0aW9uKCB0eXBlLCB1c2VyIClcbiAgICAgICAgICAgIDogdGhpcy52aWV3cy5Vc2VyTWFuYWdlID1cbiAgICAgICAgICAgICAgICB0aGlzLmZhY3RvcnkuY3JlYXRlKCAnVXNlck1hbmFnZScsIHsgdHlwZTogeyB2YWx1ZTogdHlwZSwgd3JpdGFibGU6IHRydWUgfSwgbW9kZWw6IHsgdmFsdWU6IHsgZGF0YTogdXNlciB8fCB7fSB9IH0sIGluc2VydGlvbjogeyB2YWx1ZTogeyBlbDogdGhpcy5lbHMuY29udGFpbmVyLCBtZXRob2Q6ICdpbnNlcnRCZWZvcmUnIH0gfSB9IClcbiAgICAgICAgICAgICAgICAgICAgLm9uKCAnYWRkZWQnLCB1c2VyID0+IHsgdGhpcy5jcmVhdGVVc2VyVmlldyh1c2VyKTsgdGhpcy5lbWl0KCAnbmF2aWdhdGUnLCBgL2FkbWluL3VzZXJgICk7IH0gKVxuICAgICAgICAgICAgICAgICAgICAub24oICdlZGl0ZWQnLCB1c2VyID0+IHsgdGhpcy52aWV3c1sgdXNlci5faWQgXS51cGRhdGUoIHVzZXIgKTsgdGhpcy5lbWl0KCAnbmF2aWdhdGUnLCBgL2FkbWluL3VzZXJgICk7IH0gKVxuICAgICAgICAgICAgICAgICAgICAub24oICdjYW5jZWxsZWQnLCAoKSA9PiB0aGlzLmVtaXQoICduYXZpZ2F0ZScsIGAvYWRtaW4vdXNlcmAgKSApXG4gICAgfSxcblxuICAgIG9uQWRkQnRuQ2xpY2soKSB7IHRoaXMuZW1pdCggJ25hdmlnYXRlJywgYC9hZG1pbi91c2VyL2FkZGAgKSB9LFxuXG4gICAgb25OYXZpZ2F0aW9uKCBwYXRoICkge1xuICAgICAgICB0aGlzLnBhdGggPSBwYXRoO1xuXG4gICAgICAgICggcGF0aC5sZW5ndGggPT09IDIgJiYgdGhpcy5lbHMuY29udGFpbmVyLmNsYXNzTGlzdC5jb250YWlucygnaGlkZScpICkgXG4gICAgICAgICAgICA/IHRoaXMudmlld3MuVXNlck1hbmFnZSAmJiAhdGhpcy52aWV3cy5Vc2VyTWFuYWdlLmVscy5jb250YWluZXIuY2xhc3NMaXN0LmNvbnRhaW5zKCdoaWRlJylcbiAgICAgICAgICAgICAgICA/IHRoaXMudmlld3MuVXNlck1hbmFnZS5oaWRlKCkudGhlbiggKCkgPT4gdGhpcy5zaG93KCkgKVxuICAgICAgICAgICAgICAgIDogdGhpcy5zaG93KClcbiAgICAgICAgICAgIDogcGF0aC5sZW5ndGggPT09IDNcbiAgICAgICAgICAgICAgICA/IHRoaXMuaGlkZSgpLnRoZW4oICgpID0+IHRoaXMubWFuYWdlVXNlciggcGF0aFsyXSwgeyB9ICkgKVxuICAgICAgICAgICAgICAgIDogcGF0aC5sZW5ndGggPT09IDRcbiAgICAgICAgICAgICAgICAgICAgID8gdGhpcy5oaWRlKCkudGhlbiggKCkgPT4gdGhpcy5tYW5hZ2VVc2VyKCBwYXRoWzJdLCB0aGlzLnZpZXdzWyBwYXRoWzNdIF0ubW9kZWwuZGF0YSApIClcbiAgICAgICAgICAgICAgICAgICAgIDogdW5kZWZpbmVkXG4gICAgfSxcblxuICAgIHBvc3RSZW5kZXIoKSB7XG5cbiAgICAgICAgaWYoIHRoaXMucGF0aC5sZW5ndGggPiAyICkge1xuICAgICAgICAgICAgdGhpcy5lbHMuY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoICdoaWRkZW4nLCAnaGlkZScgKVxuICAgICAgICAgICAgaWYoIHRoaXMucGF0aFsyXSA9PT0gXCJhZGRcIiApIHsgdGhpcy5tYW5hZ2VVc2VyKCBcImFkZFwiLCB7IH0gKSB9XG4gICAgICAgICAgICBlbHNlIGlmKCB0aGlzLnBhdGhbMl0gPT09IFwiZWRpdFwiICYmIHRoaXMucGF0aFszXSApIHtcbiAgICAgICAgICAgICAgICB0aGlzLlhociggeyBtZXRob2Q6IFwiZ2V0XCIsIHJlc291cmNlOiBgdXNlci8ke3RoaXMucGF0aFszXX1gIH0gKVxuICAgICAgICAgICAgICAgIC50aGVuKCByZXNwb25zZSA9PiB0aGlzLm1hbmFnZVVzZXIoIFwiZWRpdFwiLCByZXNwb25zZSApIClcbiAgICAgICAgICAgICAgICAuY2F0Y2goIGUgPT4geyB0aGlzLkVycm9yKGUpOyB0aGlzLmVtaXQoICduYXZpZ2F0ZScsIGAvYWRtaW4vdXNlcmAgKSB9IClcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmKCB0aGlzLnBhdGgubGVuZ3RoID09PSAxICYmIHRoaXMudmlld3MuVXNlck1hbmFnZSApIHtcbiAgICAgICAgICAgIHRoaXMudmlld3MuVXNlck1hbmFnZS5oaWRlKClcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMudXNlcnMgPSBPYmplY3QuY3JlYXRlKCB0aGlzLk1vZGVsLCB7IHJlc291cmNlOiB7IHZhbHVlOiAndXNlcicgfSB9IClcblxuICAgICAgICB0aGlzLnVzZXJzLmdldCgpXG4gICAgICAgIC50aGVuKCAoKSA9PiBQcm9taXNlLnJlc29sdmUoIHRoaXMudXNlcnMuZGF0YS5mb3JFYWNoKCB1c2VyID0+IHRoaXMuY3JlYXRlVXNlclZpZXcoIHVzZXIgKSApICkgKVxuICAgICAgICAuY2F0Y2goIHRoaXMuRXJyb3IgKVxuXG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgfSxcblxuICAgIHJlcXVpcmVzTG9naW46IHRydWVcbn0gKVxuIiwibW9kdWxlLmV4cG9ydHMgPSBPYmplY3QuYXNzaWduKCB7IH0sIHJlcXVpcmUoJy4uLy4uLy4uL2xpYi9NeU9iamVjdCcpLCByZXF1aXJlKCdldmVudHMnKS5FdmVudEVtaXR0ZXIucHJvdG90eXBlLCB7XG5cbiAgICBNb2RlbDogcmVxdWlyZSgnLi4vbW9kZWxzL19fcHJvdG9fXy5qcycpLFxuXG4gICAgT3B0aW1pemVkUmVzaXplOiByZXF1aXJlKCcuL2xpYi9PcHRpbWl6ZWRSZXNpemUnKSxcbiAgICBcbiAgICBTcGlubmVyOiByZXF1aXJlKCcuL2xpYi9TcGluJyksXG4gICAgXG4gICAgWGhyOiByZXF1aXJlKCcuLi9YaHInKSxcblxuICAgIGJpbmRFdmVudCgga2V5LCBldmVudCApIHtcbiAgICAgICAgdmFyIGVscyA9IEFycmF5LmlzQXJyYXkoIHRoaXMuZWxzWyBrZXkgXSApID8gdGhpcy5lbHNbIGtleSBdIDogWyB0aGlzLmVsc1sga2V5IF0gXVxuICAgICAgICBlbHMuZm9yRWFjaCggZWwgPT4gZWwuYWRkRXZlbnRMaXN0ZW5lciggZXZlbnQgfHwgJ2NsaWNrJywgZSA9PiB0aGlzWyBgb24ke3RoaXMuY2FwaXRhbGl6ZUZpcnN0TGV0dGVyKGtleSl9JHt0aGlzLmNhcGl0YWxpemVGaXJzdExldHRlcihldmVudCl9YCBdKCBlICkgKSApXG4gICAgfSxcblxuICAgIGNhcGl0YWxpemVGaXJzdExldHRlcjogc3RyaW5nID0+IHN0cmluZy5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHN0cmluZy5zbGljZSgxKSxcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuXG4gICAgICAgIGlmKCB0aGlzLnNpemUgKSB0aGlzLk9wdGltaXplZFJlc2l6ZS5hZGQoIHRoaXMuc2l6ZSApO1xuXG4gICAgICAgIGlmKCB0aGlzLnJlcXVpcmVzTG9naW4gJiYgKCF0aGlzLnVzZXIuZGF0YSB8fCAhdGhpcy51c2VyLmRhdGEuX2lkICkgKSByZXR1cm4gdGhpcy5oYW5kbGVMb2dpbigpXG5cbiAgICAgICAgaWYoIHRoaXMudXNlci5kYXRhICYmIHRoaXMudXNlci5kYXRhLmlkICYmIHRoaXMucmVxdWlyZXNSb2xlICYmICF0aGlzLmhhc1ByaXZpbGVnZXMoKSApIHJldHVybiB0aGlzLnNob3dOb0FjY2VzcygpXG4gICAgICAgIFxuICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbiggdGhpcywgeyBlbHM6IHsgfSwgc2x1cnA6IHsgYXR0cjogJ2RhdGEtanMnLCB2aWV3OiAnZGF0YS12aWV3JyB9LCB2aWV3czogeyB9IH0gKS5yZW5kZXIoKVxuICAgIH0sXG5cbiAgICBkZWxlZ2F0ZUV2ZW50cygga2V5LCBlbCApIHtcbiAgICAgICAgdmFyIHR5cGUgPSB0eXBlb2YgdGhpcy5ldmVudHNba2V5XVxuXG4gICAgICAgIGlmKCB0eXBlID09PSBcInN0cmluZ1wiICkgeyB0aGlzLmJpbmRFdmVudCgga2V5LCB0aGlzLmV2ZW50c1trZXldICkgfVxuICAgICAgICBlbHNlIGlmKCBBcnJheS5pc0FycmF5KCB0aGlzLmV2ZW50c1trZXldICkgKSB7XG4gICAgICAgICAgICB0aGlzLmV2ZW50c1sga2V5IF0uZm9yRWFjaCggZXZlbnRPYmogPT4gdGhpcy5iaW5kRXZlbnQoIGtleSwgZXZlbnRPYmouZXZlbnQgKSApXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmJpbmRFdmVudCgga2V5LCB0aGlzLmV2ZW50c1trZXldLmV2ZW50IClcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBkZWxldGUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmhpZGUoKVxuICAgICAgICAudGhlbiggKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5lbHMuY29udGFpbmVyLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoIHRoaXMuZWxzLmNvbnRhaW5lciApXG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCB0aGlzLmVtaXQoJ2RlbGV0ZWQnKSApXG4gICAgICAgIH0gKVxuICAgIH0sXG5cbiAgICBldmVudHM6IHt9LFxuXG4gICAgZ2V0RGF0YSgpIHtcbiAgICAgICAgaWYoICF0aGlzLm1vZGVsICkgdGhpcy5tb2RlbCA9IE9iamVjdC5jcmVhdGUoIHRoaXMuTW9kZWwsIHsgcmVzb3VyY2U6IHsgdmFsdWU6IHRoaXMubmFtZSB9IH0gKVxuXG4gICAgICAgIHJldHVybiB0aGlzLm1vZGVsLmdldCgpXG4gICAgfSxcblxuICAgIGdldFRlbXBsYXRlT3B0aW9ucygpIHtcbiAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oXG4gICAgICAgICAgICB7fSxcbiAgICAgICAgICAgICh0aGlzLm1vZGVsKSA/IHRoaXMubW9kZWwuZGF0YSA6IHt9ICxcbiAgICAgICAgICAgIHsgdXNlcjogKHRoaXMudXNlcikgPyB0aGlzLnVzZXIuZGF0YSA6IHt9IH0sXG4gICAgICAgICAgICB7IG9wdHM6ICh0aGlzLnRlbXBsYXRlT3B0cykgPyB0aGlzLnRlbXBsYXRlT3B0cyA6IHt9IH1cbiAgICAgICAgKVxuICAgIH0sXG5cbiAgICBoYW5kbGVMb2dpbigpIHtcbiAgICAgICAgdGhpcy5mYWN0b3J5LmNyZWF0ZSggJ2xvZ2luJywgeyBpbnNlcnRpb246IHsgdmFsdWU6IHsgZWw6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNjb250ZW50JykgfSB9IH0gKVxuICAgICAgICAgICAgLm9uY2UoIFwibG9nZ2VkSW5cIiwgKCkgPT4gdGhpcy5vbkxvZ2luKCkgKVxuXG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgfSxcblxuICAgIGhhc1ByaXZpbGVnZSgpIHtcbiAgICAgICAgKCB0aGlzLnJlcXVpcmVzUm9sZSAmJiAoIHRoaXMudXNlci5nZXQoJ3JvbGVzJykuZmluZCggcm9sZSA9PiByb2xlID09PSB0aGlzLnJlcXVpcmVzUm9sZSApID09PSBcInVuZGVmaW5lZFwiICkgKSA/IGZhbHNlIDogdHJ1ZVxuICAgIH0sXG5cbiAgICBoaWRlKCkge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoIHJlc29sdmUgPT4ge1xuICAgICAgICAgICAgaWYoICFkb2N1bWVudC5ib2R5LmNvbnRhaW5zKHRoaXMuZWxzLmNvbnRhaW5lcikgfHwgdGhpcy5pc0hpZGRlbigpICkgcmV0dXJuIHJlc29sdmUoKVxuICAgICAgICAgICAgdGhpcy5vbkhpZGRlblByb3h5ID0gZSA9PiB0aGlzLm9uSGlkZGVuKHJlc29sdmUpXG4gICAgICAgICAgICB0aGlzLmVscy5jb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lciggJ3RyYW5zaXRpb25lbmQnLCB0aGlzLm9uSGlkZGVuUHJveHkgKVxuICAgICAgICAgICAgdGhpcy5lbHMuY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ2hpZGUnKVxuICAgICAgICB9IClcbiAgICB9LFxuXG4gICAgaHRtbFRvRnJhZ21lbnQoIHN0ciApIHtcbiAgICAgICAgbGV0IHJhbmdlID0gZG9jdW1lbnQuY3JlYXRlUmFuZ2UoKTtcbiAgICAgICAgLy8gbWFrZSB0aGUgcGFyZW50IG9mIHRoZSBmaXJzdCBkaXYgaW4gdGhlIGRvY3VtZW50IGJlY29tZXMgdGhlIGNvbnRleHQgbm9kZVxuICAgICAgICByYW5nZS5zZWxlY3ROb2RlKGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiZGl2XCIpLml0ZW0oMCkpXG4gICAgICAgIHJldHVybiByYW5nZS5jcmVhdGVDb250ZXh0dWFsRnJhZ21lbnQoIHN0ciApXG4gICAgfSxcbiAgICBcbiAgICBpc0hpZGRlbigpIHsgcmV0dXJuIHRoaXMuZWxzLmNvbnRhaW5lci5jbGFzc0xpc3QuY29udGFpbnMoJ2hpZGRlbicpIH0sXG5cbiAgICBvbkhpZGRlbiggcmVzb2x2ZSApIHtcbiAgICAgICAgdGhpcy5lbHMuY29udGFpbmVyLnJlbW92ZUV2ZW50TGlzdGVuZXIoICd0cmFuc2l0aW9uZW5kJywgdGhpcy5vbkhpZGRlblByb3h5IClcbiAgICAgICAgdGhpcy5lbHMuY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ2hpZGRlbicpXG4gICAgICAgIHJlc29sdmUoIHRoaXMuZW1pdCgnaGlkZGVuJykgKVxuICAgIH0sXG5cbiAgICBvbkxvZ2luKCkge1xuICAgICAgICBPYmplY3QuYXNzaWduKCB0aGlzLCB7IGVsczogeyB9LCBzbHVycDogeyBhdHRyOiAnZGF0YS1qcycsIHZpZXc6ICdkYXRhLXZpZXcnIH0sIHZpZXdzOiB7IH0gfSApLnJlbmRlcigpXG4gICAgfSxcblxuICAgIG9uU2hvd24oIHJlc29sdmUgKSB7XG4gICAgICAgIHRoaXMuZWxzLmNvbnRhaW5lci5yZW1vdmVFdmVudExpc3RlbmVyKCAndHJhbnNpdGlvbmVuZCcsIHRoaXMub25TaG93blByb3h5IClcbiAgICAgICAgaWYoIHRoaXMuc2l6ZSApIHRoaXMuc2l6ZSgpXG4gICAgICAgIHJlc29sdmUoIHRoaXMuZW1pdCgnc2hvd24nKSApXG4gICAgfSxcblxuICAgIHNob3dOb0FjY2VzcygpIHtcbiAgICAgICAgYWxlcnQoXCJObyBwcml2aWxlZ2VzLCBzb25cIilcbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICB9LFxuXG4gICAgcG9zdFJlbmRlcigpIHsgcmV0dXJuIHRoaXMgfSxcblxuICAgIHJlbmRlcigpIHtcbiAgICAgICAgdGhpcy5zbHVycFRlbXBsYXRlKCB7IHRlbXBsYXRlOiB0aGlzLnRlbXBsYXRlKCB0aGlzLmdldFRlbXBsYXRlT3B0aW9ucygpICksIGluc2VydGlvbjogdGhpcy5pbnNlcnRpb24gfSApXG5cbiAgICAgICAgaWYoIHRoaXMuc2l6ZSApIHRoaXMuc2l6ZSgpXG5cbiAgICAgICAgcmV0dXJuIHRoaXMucmVuZGVyU3Vidmlld3MoKVxuICAgICAgICAgICAgICAgICAgIC5wb3N0UmVuZGVyKClcbiAgICB9LFxuXG4gICAgcmVuZGVyU3Vidmlld3MoKSB7XG4gICAgICAgIE9iamVjdC5rZXlzKCB0aGlzLlZpZXdzIHx8IFsgXSApLmZvckVhY2goIGtleSA9PiB7XG4gICAgICAgICAgICBpZiggdGhpcy5WaWV3c1sga2V5IF0uZWwgKSB7XG4gICAgICAgICAgICAgICAgbGV0IG9wdHMgPSB0aGlzLlZpZXdzWyBrZXkgXS5vcHRzXG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgb3B0cyA9ICggb3B0cyApXG4gICAgICAgICAgICAgICAgICAgID8gdHlwZW9mIG9wdHMgPT09IFwib2JqZWN0XCJcbiAgICAgICAgICAgICAgICAgICAgICAgID8gb3B0c1xuICAgICAgICAgICAgICAgICAgICAgICAgOiBvcHRzKClcbiAgICAgICAgICAgICAgICAgICAgOiB7fVxuXG4gICAgICAgICAgICAgICAgdGhpcy52aWV3c1sga2V5IF0gPSB0aGlzLmZhY3RvcnkuY3JlYXRlKCBrZXksIE9iamVjdC5hc3NpZ24oIHsgaW5zZXJ0aW9uOiB7IHZhbHVlOiB7IGVsOiB0aGlzLlZpZXdzWyBrZXkgXS5lbCwgbWV0aG9kOiAnaW5zZXJ0QmVmb3JlJyB9IH0gfSwgb3B0cyApIClcbiAgICAgICAgICAgICAgICB0aGlzLlZpZXdzWyBrZXkgXS5lbC5yZW1vdmUoKVxuICAgICAgICAgICAgICAgIHRoaXMuVmlld3NbIGtleSBdLmVsID0gdW5kZWZpbmVkXG4gICAgICAgICAgICB9XG4gICAgICAgIH0gKVxuXG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgfSxcblxuICAgIHNob3coIGR1cmF0aW9uICkge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoIHJlc29sdmUgPT4ge1xuICAgICAgICAgICAgdGhpcy5vblNob3duUHJveHkgPSBlID0+IHRoaXMub25TaG93bihyZXNvbHZlKVxuICAgICAgICAgICAgdGhpcy5lbHMuY29udGFpbmVyLmFkZEV2ZW50TGlzdGVuZXIoICd0cmFuc2l0aW9uZW5kJywgdGhpcy5vblNob3duUHJveHkgKVxuICAgICAgICAgICAgdGhpcy5lbHMuY29udGFpbmVyLmNsYXNzTGlzdC5yZW1vdmUoICdoaWRlJywgJ2hpZGRlbicgKVxuICAgICAgICB9IClcbiAgICB9LFxuXG4gICAgc2x1cnBFbCggZWwgKSB7XG4gICAgICAgIHZhciBrZXkgPSBlbC5nZXRBdHRyaWJ1dGUoIHRoaXMuc2x1cnAuYXR0ciApIHx8ICdjb250YWluZXInXG5cbiAgICAgICAgaWYoIGtleSA9PT0gJ2NvbnRhaW5lcicgKSBlbC5jbGFzc0xpc3QuYWRkKCB0aGlzLm5hbWUgKVxuXG4gICAgICAgIHRoaXMuZWxzWyBrZXkgXSA9IEFycmF5LmlzQXJyYXkoIHRoaXMuZWxzWyBrZXkgXSApXG4gICAgICAgICAgICA/IHRoaXMuZWxzWyBrZXkgXS5wdXNoKCBlbCApXG4gICAgICAgICAgICA6ICggdGhpcy5lbHNbIGtleSBdICE9PSB1bmRlZmluZWQgKVxuICAgICAgICAgICAgICAgID8gWyB0aGlzLmVsc1sga2V5IF0sIGVsIF1cbiAgICAgICAgICAgICAgICA6IGVsXG5cbiAgICAgICAgZWwucmVtb3ZlQXR0cmlidXRlKHRoaXMuc2x1cnAuYXR0cilcblxuICAgICAgICBpZiggdGhpcy5ldmVudHNbIGtleSBdICkgdGhpcy5kZWxlZ2F0ZUV2ZW50cygga2V5LCBlbCApXG4gICAgfSxcblxuICAgIHNsdXJwVGVtcGxhdGUoIG9wdGlvbnMgKSB7XG4gICAgICAgIHZhciBmcmFnbWVudCA9IHRoaXMuaHRtbFRvRnJhZ21lbnQoIG9wdGlvbnMudGVtcGxhdGUgKSxcbiAgICAgICAgICAgIHNlbGVjdG9yID0gYFske3RoaXMuc2x1cnAuYXR0cn1dYCxcbiAgICAgICAgICAgIHZpZXdTZWxlY3RvciA9IGBbJHt0aGlzLnNsdXJwLnZpZXd9XWBcblxuICAgICAgICB0aGlzLnNsdXJwRWwoIGZyYWdtZW50LnF1ZXJ5U2VsZWN0b3IoJyonKSApXG4gICAgICAgIGZyYWdtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoIGAke3NlbGVjdG9yfSwgJHt2aWV3U2VsZWN0b3J9YCApLmZvckVhY2goIGVsID0+XG4gICAgICAgICAgICAoIGVsLmhhc0F0dHJpYnV0ZSggdGhpcy5zbHVycC5hdHRyICkgKSBcbiAgICAgICAgICAgICAgICA/IHRoaXMuc2x1cnBFbCggZWwgKVxuICAgICAgICAgICAgICAgIDogdGhpcy5WaWV3c1sgZWwuZ2V0QXR0cmlidXRlKHRoaXMuc2x1cnAudmlldykgXS5lbCA9IGVsXG4gICAgICAgIClcbiAgICAgICAgICBcbiAgICAgICAgb3B0aW9ucy5pbnNlcnRpb24ubWV0aG9kID09PSAnaW5zZXJ0QmVmb3JlJ1xuICAgICAgICAgICAgPyBvcHRpb25zLmluc2VydGlvbi5lbC5wYXJlbnROb2RlLmluc2VydEJlZm9yZSggZnJhZ21lbnQsIG9wdGlvbnMuaW5zZXJ0aW9uLmVsIClcbiAgICAgICAgICAgIDogb3B0aW9ucy5pbnNlcnRpb24uZWxbIG9wdGlvbnMuaW5zZXJ0aW9uLm1ldGhvZCB8fCAnYXBwZW5kQ2hpbGQnIF0oIGZyYWdtZW50IClcblxuICAgICAgICByZXR1cm4gdGhpc1xuICAgIH0sXG5cbiAgICBpc01vdXNlT25FbCggZXZlbnQsIGVsICkge1xuXG4gICAgICAgIHZhciBlbE9mZnNldCA9IGVsLm9mZnNldCgpLFxuICAgICAgICAgICAgZWxIZWlnaHQgPSBlbC5vdXRlckhlaWdodCggdHJ1ZSApLFxuICAgICAgICAgICAgZWxXaWR0aCA9IGVsLm91dGVyV2lkdGgoIHRydWUgKVxuXG4gICAgICAgIGlmKCAoIGV2ZW50LnBhZ2VYIDwgZWxPZmZzZXQubGVmdCApIHx8XG4gICAgICAgICAgICAoIGV2ZW50LnBhZ2VYID4gKCBlbE9mZnNldC5sZWZ0ICsgZWxXaWR0aCApICkgfHxcbiAgICAgICAgICAgICggZXZlbnQucGFnZVkgPCBlbE9mZnNldC50b3AgKSB8fFxuICAgICAgICAgICAgKCBldmVudC5wYWdlWSA+ICggZWxPZmZzZXQudG9wICsgZWxIZWlnaHQgKSApICkge1xuXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdHJ1ZVxuICAgIH0sXG5cbiAgICByZXF1aXJlc0xvZ2luOiBmYWxzZSxcblxuICAgIC8vX190b0RvOiBodG1sLnJlcGxhY2UoLz5cXHMrPC9nLCc+PCcpXG59IClcbiIsIm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmNyZWF0ZSgge1xuXG4gICAgYWRkKGNhbGxiYWNrKSB7XG4gICAgICAgIGlmKCAhdGhpcy5jYWxsYmFja3MubGVuZ3RoICkgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHRoaXMub25SZXNpemUpXG4gICAgICAgIHRoaXMuY2FsbGJhY2tzLnB1c2goY2FsbGJhY2spXG4gICAgfSxcblxuICAgIG9uUmVzaXplKCkge1xuICAgICAgIGlmKCB0aGlzLnJ1bm5pbmcgKSByZXR1cm5cblxuICAgICAgICB0aGlzLnJ1bm5pbmcgPSB0cnVlXG4gICAgICAgIFxuICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lXG4gICAgICAgICAgICA/IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoIHRoaXMucnVuQ2FsbGJhY2tzIClcbiAgICAgICAgICAgIDogc2V0VGltZW91dCggdGhpcy5ydW5DYWxsYmFja3MsIDY2KVxuICAgIH0sXG5cbiAgICBydW5DYWxsYmFja3MoKSB7XG4gICAgICAgIHRoaXMuY2FsbGJhY2tzID0gdGhpcy5jYWxsYmFja3MuZmlsdGVyKCBjYWxsYmFjayA9PiBjYWxsYmFjaygpIClcbiAgICAgICAgdGhpcy5ydW5uaW5nID0gZmFsc2UgXG4gICAgfVxuXG59LCB7IGNhbGxiYWNrczogeyB2YWx1ZTogW10gfSwgcnVubmluZzogeyB2YWx1ZTogZmFsc2UgfSB9ICkuYWRkXG4iLCIvLyBodHRwOi8vc3Bpbi5qcy5vcmcvI3YyLjMuMlxuIWZ1bmN0aW9uKGEsYil7XCJvYmplY3RcIj09dHlwZW9mIG1vZHVsZSYmbW9kdWxlLmV4cG9ydHM/bW9kdWxlLmV4cG9ydHM9YigpOlwiZnVuY3Rpb25cIj09dHlwZW9mIGRlZmluZSYmZGVmaW5lLmFtZD9kZWZpbmUoYik6YS5TcGlubmVyPWIoKX0odGhpcyxmdW5jdGlvbigpe1widXNlIHN0cmljdFwiO2Z1bmN0aW9uIGEoYSxiKXt2YXIgYyxkPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoYXx8XCJkaXZcIik7Zm9yKGMgaW4gYilkW2NdPWJbY107cmV0dXJuIGR9ZnVuY3Rpb24gYihhKXtmb3IodmFyIGI9MSxjPWFyZ3VtZW50cy5sZW5ndGg7Yz5iO2IrKylhLmFwcGVuZENoaWxkKGFyZ3VtZW50c1tiXSk7cmV0dXJuIGF9ZnVuY3Rpb24gYyhhLGIsYyxkKXt2YXIgZT1bXCJvcGFjaXR5XCIsYix+figxMDAqYSksYyxkXS5qb2luKFwiLVwiKSxmPS4wMStjL2QqMTAwLGc9TWF0aC5tYXgoMS0oMS1hKS9iKigxMDAtZiksYSksaD1qLnN1YnN0cmluZygwLGouaW5kZXhPZihcIkFuaW1hdGlvblwiKSkudG9Mb3dlckNhc2UoKSxpPWgmJlwiLVwiK2grXCItXCJ8fFwiXCI7cmV0dXJuIG1bZV18fChrLmluc2VydFJ1bGUoXCJAXCIraStcImtleWZyYW1lcyBcIitlK1wiezAle29wYWNpdHk6XCIrZytcIn1cIitmK1wiJXtvcGFjaXR5OlwiK2ErXCJ9XCIrKGYrLjAxKStcIiV7b3BhY2l0eToxfVwiKyhmK2IpJTEwMCtcIiV7b3BhY2l0eTpcIithK1wifTEwMCV7b3BhY2l0eTpcIitnK1wifX1cIixrLmNzc1J1bGVzLmxlbmd0aCksbVtlXT0xKSxlfWZ1bmN0aW9uIGQoYSxiKXt2YXIgYyxkLGU9YS5zdHlsZTtpZihiPWIuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkrYi5zbGljZSgxKSx2b2lkIDAhPT1lW2JdKXJldHVybiBiO2ZvcihkPTA7ZDxsLmxlbmd0aDtkKyspaWYoYz1sW2RdK2Isdm9pZCAwIT09ZVtjXSlyZXR1cm4gY31mdW5jdGlvbiBlKGEsYil7Zm9yKHZhciBjIGluIGIpYS5zdHlsZVtkKGEsYyl8fGNdPWJbY107cmV0dXJuIGF9ZnVuY3Rpb24gZihhKXtmb3IodmFyIGI9MTtiPGFyZ3VtZW50cy5sZW5ndGg7YisrKXt2YXIgYz1hcmd1bWVudHNbYl07Zm9yKHZhciBkIGluIGMpdm9pZCAwPT09YVtkXSYmKGFbZF09Y1tkXSl9cmV0dXJuIGF9ZnVuY3Rpb24gZyhhLGIpe3JldHVyblwic3RyaW5nXCI9PXR5cGVvZiBhP2E6YVtiJWEubGVuZ3RoXX1mdW5jdGlvbiBoKGEpe3RoaXMub3B0cz1mKGF8fHt9LGguZGVmYXVsdHMsbil9ZnVuY3Rpb24gaSgpe2Z1bmN0aW9uIGMoYixjKXtyZXR1cm4gYShcIjxcIitiKycgeG1sbnM9XCJ1cm46c2NoZW1hcy1taWNyb3NvZnQuY29tOnZtbFwiIGNsYXNzPVwic3Bpbi12bWxcIj4nLGMpfWsuYWRkUnVsZShcIi5zcGluLXZtbFwiLFwiYmVoYXZpb3I6dXJsKCNkZWZhdWx0I1ZNTClcIiksaC5wcm90b3R5cGUubGluZXM9ZnVuY3Rpb24oYSxkKXtmdW5jdGlvbiBmKCl7cmV0dXJuIGUoYyhcImdyb3VwXCIse2Nvb3Jkc2l6ZTprK1wiIFwiK2ssY29vcmRvcmlnaW46LWorXCIgXCIrLWp9KSx7d2lkdGg6ayxoZWlnaHQ6a30pfWZ1bmN0aW9uIGgoYSxoLGkpe2IobSxiKGUoZigpLHtyb3RhdGlvbjozNjAvZC5saW5lcyphK1wiZGVnXCIsbGVmdDp+fmh9KSxiKGUoYyhcInJvdW5kcmVjdFwiLHthcmNzaXplOmQuY29ybmVyc30pLHt3aWR0aDpqLGhlaWdodDpkLnNjYWxlKmQud2lkdGgsbGVmdDpkLnNjYWxlKmQucmFkaXVzLHRvcDotZC5zY2FsZSpkLndpZHRoPj4xLGZpbHRlcjppfSksYyhcImZpbGxcIix7Y29sb3I6ZyhkLmNvbG9yLGEpLG9wYWNpdHk6ZC5vcGFjaXR5fSksYyhcInN0cm9rZVwiLHtvcGFjaXR5OjB9KSkpKX12YXIgaSxqPWQuc2NhbGUqKGQubGVuZ3RoK2Qud2lkdGgpLGs9MipkLnNjYWxlKmosbD0tKGQud2lkdGgrZC5sZW5ndGgpKmQuc2NhbGUqMitcInB4XCIsbT1lKGYoKSx7cG9zaXRpb246XCJhYnNvbHV0ZVwiLHRvcDpsLGxlZnQ6bH0pO2lmKGQuc2hhZG93KWZvcihpPTE7aTw9ZC5saW5lcztpKyspaChpLC0yLFwicHJvZ2lkOkRYSW1hZ2VUcmFuc2Zvcm0uTWljcm9zb2Z0LkJsdXIocGl4ZWxyYWRpdXM9MixtYWtlc2hhZG93PTEsc2hhZG93b3BhY2l0eT0uMylcIik7Zm9yKGk9MTtpPD1kLmxpbmVzO2krKyloKGkpO3JldHVybiBiKGEsbSl9LGgucHJvdG90eXBlLm9wYWNpdHk9ZnVuY3Rpb24oYSxiLGMsZCl7dmFyIGU9YS5maXJzdENoaWxkO2Q9ZC5zaGFkb3cmJmQubGluZXN8fDAsZSYmYitkPGUuY2hpbGROb2Rlcy5sZW5ndGgmJihlPWUuY2hpbGROb2Rlc1tiK2RdLGU9ZSYmZS5maXJzdENoaWxkLGU9ZSYmZS5maXJzdENoaWxkLGUmJihlLm9wYWNpdHk9YykpfX12YXIgaixrLGw9W1wid2Via2l0XCIsXCJNb3pcIixcIm1zXCIsXCJPXCJdLG09e30sbj17bGluZXM6MTIsbGVuZ3RoOjcsd2lkdGg6NSxyYWRpdXM6MTAsc2NhbGU6MSxjb3JuZXJzOjEsY29sb3I6XCIjMDAwXCIsb3BhY2l0eTouMjUscm90YXRlOjAsZGlyZWN0aW9uOjEsc3BlZWQ6MSx0cmFpbDoxMDAsZnBzOjIwLHpJbmRleDoyZTksY2xhc3NOYW1lOlwic3Bpbm5lclwiLHRvcDpcIjUwJVwiLGxlZnQ6XCI1MCVcIixzaGFkb3c6ITEsaHdhY2NlbDohMSxwb3NpdGlvbjpcImFic29sdXRlXCJ9O2lmKGguZGVmYXVsdHM9e30sZihoLnByb3RvdHlwZSx7c3BpbjpmdW5jdGlvbihiKXt0aGlzLnN0b3AoKTt2YXIgYz10aGlzLGQ9Yy5vcHRzLGY9Yy5lbD1hKG51bGwse2NsYXNzTmFtZTpkLmNsYXNzTmFtZX0pO2lmKGUoZix7cG9zaXRpb246ZC5wb3NpdGlvbix3aWR0aDowLHpJbmRleDpkLnpJbmRleCxsZWZ0OmQubGVmdCx0b3A6ZC50b3B9KSxiJiZiLmluc2VydEJlZm9yZShmLGIuZmlyc3RDaGlsZHx8bnVsbCksZi5zZXRBdHRyaWJ1dGUoXCJyb2xlXCIsXCJwcm9ncmVzc2JhclwiKSxjLmxpbmVzKGYsYy5vcHRzKSwhail7dmFyIGcsaD0wLGk9KGQubGluZXMtMSkqKDEtZC5kaXJlY3Rpb24pLzIsaz1kLmZwcyxsPWsvZC5zcGVlZCxtPSgxLWQub3BhY2l0eSkvKGwqZC50cmFpbC8xMDApLG49bC9kLmxpbmVzOyFmdW5jdGlvbiBvKCl7aCsrO2Zvcih2YXIgYT0wO2E8ZC5saW5lczthKyspZz1NYXRoLm1heCgxLShoKyhkLmxpbmVzLWEpKm4pJWwqbSxkLm9wYWNpdHkpLGMub3BhY2l0eShmLGEqZC5kaXJlY3Rpb24raSxnLGQpO2MudGltZW91dD1jLmVsJiZzZXRUaW1lb3V0KG8sfn4oMWUzL2spKX0oKX1yZXR1cm4gY30sc3RvcDpmdW5jdGlvbigpe3ZhciBhPXRoaXMuZWw7cmV0dXJuIGEmJihjbGVhclRpbWVvdXQodGhpcy50aW1lb3V0KSxhLnBhcmVudE5vZGUmJmEucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChhKSx0aGlzLmVsPXZvaWQgMCksdGhpc30sbGluZXM6ZnVuY3Rpb24oZCxmKXtmdW5jdGlvbiBoKGIsYyl7cmV0dXJuIGUoYSgpLHtwb3NpdGlvbjpcImFic29sdXRlXCIsd2lkdGg6Zi5zY2FsZSooZi5sZW5ndGgrZi53aWR0aCkrXCJweFwiLGhlaWdodDpmLnNjYWxlKmYud2lkdGgrXCJweFwiLGJhY2tncm91bmQ6Yixib3hTaGFkb3c6Yyx0cmFuc2Zvcm1PcmlnaW46XCJsZWZ0XCIsdHJhbnNmb3JtOlwicm90YXRlKFwiK35+KDM2MC9mLmxpbmVzKmsrZi5yb3RhdGUpK1wiZGVnKSB0cmFuc2xhdGUoXCIrZi5zY2FsZSpmLnJhZGl1cytcInB4LDApXCIsYm9yZGVyUmFkaXVzOihmLmNvcm5lcnMqZi5zY2FsZSpmLndpZHRoPj4xKStcInB4XCJ9KX1mb3IodmFyIGksaz0wLGw9KGYubGluZXMtMSkqKDEtZi5kaXJlY3Rpb24pLzI7azxmLmxpbmVzO2srKylpPWUoYSgpLHtwb3NpdGlvbjpcImFic29sdXRlXCIsdG9wOjErfihmLnNjYWxlKmYud2lkdGgvMikrXCJweFwiLHRyYW5zZm9ybTpmLmh3YWNjZWw/XCJ0cmFuc2xhdGUzZCgwLDAsMClcIjpcIlwiLG9wYWNpdHk6Zi5vcGFjaXR5LGFuaW1hdGlvbjpqJiZjKGYub3BhY2l0eSxmLnRyYWlsLGwraypmLmRpcmVjdGlvbixmLmxpbmVzKStcIiBcIisxL2Yuc3BlZWQrXCJzIGxpbmVhciBpbmZpbml0ZVwifSksZi5zaGFkb3cmJmIoaSxlKGgoXCIjMDAwXCIsXCIwIDAgNHB4ICMwMDBcIikse3RvcDpcIjJweFwifSkpLGIoZCxiKGksaChnKGYuY29sb3IsayksXCIwIDAgMXB4IHJnYmEoMCwwLDAsLjEpXCIpKSk7cmV0dXJuIGR9LG9wYWNpdHk6ZnVuY3Rpb24oYSxiLGMpe2I8YS5jaGlsZE5vZGVzLmxlbmd0aCYmKGEuY2hpbGROb2Rlc1tiXS5zdHlsZS5vcGFjaXR5PWMpfX0pLFwidW5kZWZpbmVkXCIhPXR5cGVvZiBkb2N1bWVudCl7az1mdW5jdGlvbigpe3ZhciBjPWEoXCJzdHlsZVwiLHt0eXBlOlwidGV4dC9jc3NcIn0pO3JldHVybiBiKGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiaGVhZFwiKVswXSxjKSxjLnNoZWV0fHxjLnN0eWxlU2hlZXR9KCk7dmFyIG89ZShhKFwiZ3JvdXBcIikse2JlaGF2aW9yOlwidXJsKCNkZWZhdWx0I1ZNTClcIn0pOyFkKG8sXCJ0cmFuc2Zvcm1cIikmJm8uYWRqP2koKTpqPWQobyxcImFuaW1hdGlvblwiKX1yZXR1cm4gaH0pOyIsIm1vZHVsZS5leHBvcnRzID0gcCA9PiBcbmA8ZGl2PlxuPGRpdj5BZG1pbjwvZGl2PlxuPGRpdiBkYXRhLWpzPVwibGlzdFwiPjwvZGl2PlxuPC9kaXY+YFxuIiwibW9kdWxlLmV4cG9ydHMgPSBwID0+IGA8ZGl2PiR7cC5jb2xsZWN0aW9ufTwvZGl2PmBcbiIsIm1vZHVsZS5leHBvcnRzID0gcCA9PiB7XG5yZXR1cm4gYDxkaXY+XG4gICAgPGRpdiBjbGFzcz1cImhlYWRlclwiIGRhdGEtanM9XCJoZWFkZXJcIj5cbiAgICAgICAgPGRpdiBjbGFzcz1cInRpdGxlXCIgZGF0YS1qcz1cInRpdGxlXCIgPiR7cC50aXRsZSB8fCAnJ308L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzcz1cInByZS1jb250ZXh0XCIgZGF0YS1qcz1cInByZUNvbnRleHRcIiA+JHtwLnByZUNvbnRleHQgfHwgJyd9PC9kaXY+XG4gICAgICAgIDxkaXY+PGltZyBkYXRhLWpzPVwiY29udGV4dFwiIGNsYXNzPVwiY29udGV4dFwiIHNyYz1cIiR7cC5jb250ZXh0IHx8ICcnfVwiLz48L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzcz1cInBvc3QtY29udGV4dFwiIGRhdGEtanM9XCJwb3N0Q29udGV4dFwiID4ke3AucG9zdENvbnRleHQgfHwgJyd9PC9kaXY+XG4gICAgICAgICR7cC5faWQgJiYgcC51c2VyLl9pZCAmJiAhcC5vcHRzLnJlYWRPbmx5ID8gJzxidXR0b24gY2xhc3M9XCJkZWxldGVcIiBkYXRhLWpzPVwiZGVsZXRlXCI+PC9idXR0b24+JyA6ICcnfVxuICAgICAgICAke3AuX2lkICYmIHAudXNlci5faWQgJiYgIXAub3B0cy5yZWFkT25seSA/ICc8YnV0dG9uIGNsYXNzPVwiZWRpdFwiIGRhdGEtanM9XCJlZGl0XCI+PC9idXR0b24+JyA6ICcnfVxuICAgIDwvZGl2PlxuICAgICR7cC5faWQgJiYgcC51c2VyLl9pZCAmJiAhcC5vcHRzLnJlYWRPbmx5XG4gICAgICAgID8gYDxkaXYgY2xhc3M9XCJjb25maXJtIGhpZGRlblwiIGRhdGEtanM9XCJjb25maXJtRGlhbG9nXCI+XG4gICAgICAgICAgICAgICA8c3Bhbj5BcmUgeW91IHN1cmU/PC9zcGFuPlxuICAgICAgICAgICAgICAgPGJ1dHRvbiBkYXRhLWpzPVwiY29uZmlybVwiIHR5cGU9XCJidXR0b25cIj5EZWxldGU8L2J1dHRvbj4gXG4gICAgICAgICAgICAgICA8YnV0dG9uIGRhdGEtanM9XCJjYW5jZWxcIiB0eXBlPVwiYnV0dG9uXCI+Q2FuY2VsPC9idXR0b24+IFxuICAgICAgICAgICA8L2Rpdj5gXG4gICAgICAgIDogYGB9XG4gICAgPGRpdiBjbGFzcz1cImNsZWFyZml4XCI+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJkYXRlXCI+JHsocmVxdWlyZSgnbW9tZW50JykpKHAuY3JlYXRlZCkuZm9ybWF0KCdNTS1ERC1ZWVlZJyl9PC9kaXY+XG4gICAgPC9kaXY+XG4gICAgPGltZyBkYXRhLWpzPVwiaW1hZ2VcIiBzcmM9XCIke3AuaW1hZ2UgPyBwLmltYWdlIDogJyd9XCIvPlxuICAgICR7cC5vcHRzLnJlYWRPbmx5XG4gICAgICAgID8gYDxkaXYgY2xhc3M9XCJjbGVhcmZpeFwiPlxuICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJzaGFyZVwiPlxuICAgICAgICAgICAgICAgICAke3JlcXVpcmUoJy4vbGliL2ZhY2Vib29rJyl9XG4gICAgICAgICAgICAgICAgICR7cmVxdWlyZSgnLi9saWIvdHdpdHRlcicpfVxuICAgICAgICAgICAgICAgICAke3JlcXVpcmUoJy4vbGliL2dvb2dsZScpfVxuICAgICAgICAgICAgICAgICA8YSBocmVmPVwibWFpbHRvOmJhZGhvbWJyZUB0aW55aGFuZGVkLmNvbVwiPiR7cmVxdWlyZSgnLi9saWIvbWFpbCcpfTwvYT5cbiAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICA8IS0tIDxkaXYgY2xhc3M9XCJzdG9yZVwiIGRhdGEtanM9XCJzdG9yZVwiPlN0b3JlPC9kaXY+IC0tPlxuICAgICAgICAgPC9kaXY+YFxuICAgICAgICA6IGBgIH1cbjwvZGl2PmBcbn1cbiIsIm1vZHVsZS5leHBvcnRzID0gcCA9PlxuYDxkaXY+XG4gICAgPGRpdiBkYXRhLWpzPVwiaGVhZGVyXCI+PC9kaXY+XG4gICAgPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXBcIj5cbiAgICAgICA8bGFiZWwgY2xhc3M9XCJmb3JtLWxhYmVsXCI+dGl0bGU8L2xhYmVsPlxuICAgICAgIDxpbnB1dCBkYXRhLWpzPVwidGl0bGVcIiB0eXBlPVwidGV4dFwiPjwvaW5wdXQ+XG4gICAgPC9kaXY+XG4gICAgPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXBcIj5cbiAgICAgICA8bGFiZWwgY2xhc3M9XCJmb3JtLWxhYmVsXCI+cHJlIGNvbnRleHQ8L2xhYmVsPlxuICAgICAgIDxpbnB1dCBkYXRhLWpzPVwicHJlQ29udGV4dFwiIHR5cGU9XCJ0ZXh0XCI+PC9pbnB1dD5cbiAgICA8L2Rpdj5cbiAgICA8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cFwiPlxuICAgICAgIDxsYWJlbCBjbGFzcz1cImZvcm0tbGFiZWxcIj5jb250ZXh0PC9sYWJlbD5cbiAgICAgICAgPGRpdj5cbiAgICAgICAgICAgIDxkaXYgZGF0YS1qcz1cImNvbnRleHRVcGxvYWRcIiBjbGFzcz1cInVwbG9hZFwiPlxuICAgICAgICAgICAgICAgIDxzcGFuPlVwbG9hZCBGaWxlPC9zcGFuPlxuICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwiZmlsZVwiIGRhdGEtanM9XCJjb250ZXh0XCIgLz5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGltZyBjbGFzcz1cInByZXZpZXdcIiBkYXRhLWpzPVwiY29udGV4dFByZXZpZXdcIiAvPlxuICAgICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgICA8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cFwiPlxuICAgICAgIDxsYWJlbCBjbGFzcz1cImZvcm0tbGFiZWxcIj5wb3N0IGNvbnRleHQ8L2xhYmVsPlxuICAgICAgIDxpbnB1dCBkYXRhLWpzPVwicG9zdENvbnRleHRcIiB0eXBlPVwidGV4dFwiPjwvaW5wdXQ+XG4gICAgPC9kaXY+XG4gICAgPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXBcIj5cbiAgICAgICA8bGFiZWwgY2xhc3M9XCJmb3JtLWxhYmVsXCI+aW1hZ2U8L2xhYmVsPlxuICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgPGRpdiBkYXRhLWpzPVwidXBsb2FkXCIgY2xhc3M9XCJ1cGxvYWRcIj5cbiAgICAgICAgICAgICAgICA8c3Bhbj5VcGxvYWQgRmlsZTwvc3Bhbj5cbiAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cImZpbGVcIiBkYXRhLWpzPVwiaW1hZ2VcIiAvPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8aW1nIGNsYXNzPVwicHJldmlld1wiIGRhdGEtanM9XCJwcmV2aWV3XCIgLz5cbiAgICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gICAgPGRpdiBjbGFzcz1cImJ1dHRvbi1yb3dcIj5cbiAgICAgICAgPGJ1dHRvbiBkYXRhLWpzPVwic3VibWl0XCIgdHlwZT1cImJ1dHRvblwiPlN1Ym1pdDwvYnV0dG9uPlxuICAgICAgICA8YnV0dG9uIGRhdGEtanM9XCJjYW5jZWxcIiB0eXBlPVwiYnV0dG9uXCI+Q2FuY2VsPC9idXR0b24+XG4gICAgPC9kaXY+XG48L2Rpdj5gXG4iLCJtb2R1bGUuZXhwb3J0cyA9IHAgPT4gXG5gPGRpdj5cbiAgICA8ZGl2PlxuICAgICAgICA8ZGl2PkNvbWljczwvZGl2PlxuICAgICAgICA8YnV0dG9uIGRhdGEtanM9XCJhZGRCdG5cIiBjbGFzcz1cImFkZFwiPjwvYnV0dG9uPlxuICAgIDwvZGl2PlxuICAgIDxkaXYgZGF0YS1qcz1cImxpc3RcIj48L2Rpdj5cbjwvZGl2PmBcbiIsIm1vZHVsZS5leHBvcnRzID0gcCA9PiBgPGhlYWRlcj5cbiAgICA8aW1nIHNyYz1cIi9zdGF0aWMvaW1nL2xvZ28ucG5nXCIgLz5cbjwvaGVhZGVyPmBcbiIsIm1vZHVsZS5leHBvcnRzID0gKCBwICkgPT4gYDxkaXY+PC9kaXY+YFxuIiwibW9kdWxlLmV4cG9ydHMgPSAoIHAgKSA9PlxuYDxkaXY+XG4gICAgPGgxPkxvZ2luPC9oMT5cbiAgICA8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cFwiPlxuICAgICAgIDxsYWJlbCBjbGFzcz1cImZvcm0tbGFiZWxcIiBmb3I9XCJ1c2VybmFtZVwiPnVzZXJuYW1lPC9sYWJlbD5cbiAgICAgICA8aW5wdXQgZGF0YS1qcz1cInVzZXJuYW1lXCIgY2xhc3M9XCJ1c2VybmFtZVwiIHR5cGU9XCJ0ZXh0XCI+PC9pbnB1dD5cbiAgICA8L2Rpdj5cbiAgICA8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cFwiPlxuICAgICAgIDxsYWJlbCBjbGFzcz1cImZvcm0tbGFiZWxcIiBmb3I9XCJwYXNzd29yZFwiPnBhc3N3b3JkPC9sYWJlbD5cbiAgICAgICA8aW5wdXQgZGF0YS1qcz1cInBhc3N3b3JkXCIgY2xhc3M9XCJwYXNzd29yZFwiIHR5cGU9XCJwYXNzd29yZFwiPjwvaW5wdXQ+XG4gICAgPC9kaXY+XG4gICAgPGRpdiBjbGFzcz1cImJ1dHRvbi1yb3dcIj5cbiAgICAgICAgPGJ1dHRvbiBkYXRhLWpzPVwic3VibWl0XCIgY2xhc3M9XCJidG4tZ2hvc3RcIiB0eXBlPVwiYnV0dG9uXCI+TG9nIEluPC9idXR0b24+XG4gICAgPC9kaXY+XG48L2Rpdj5gXG4iLCJtb2R1bGUuZXhwb3J0cyA9ICgpID0+IGA8ZGl2IGNsYXNzPVwiaGlkZVwiPjxkaXYgZGF0YS1qcz1cImNvbnRlbnRcIj48L2Rpdj48L2Rpdj5gXG4iLCJtb2R1bGUuZXhwb3J0cyA9IHAgPT5cbmA8ZGl2PlxuICAgIDxkaXYgZGF0YS1qcz1cInVzZXJuYW1lXCI+JHtwLnVzZXJuYW1lfTwvZGl2PlxuICAgICR7cC51c2VyLl9pZCAmJiAhcC5vcHRzLnJlYWRPbmx5ID8gJzxidXR0b24gY2xhc3M9XCJkZWxldGVcIiBkYXRhLWpzPVwiZGVsZXRlXCI+PC9idXR0b24+JyA6ICcnfVxuICAgICR7cC51c2VyLl9pZCA9PT0gcC5faWQgPyAnPGJ1dHRvbiBjbGFzcz1cImVkaXRcIiBkYXRhLWpzPVwiZWRpdFwiPjwvYnV0dG9uPicgOiAnJ31cbiAgICAke3AudXNlci5faWQgJiYgIXAub3B0cy5yZWFkT25seVxuICAgID8gYDxkaXYgY2xhc3M9XCJjb25maXJtIGhpZGRlblwiIGRhdGEtanM9XCJjb25maXJtRGlhbG9nXCI+XG4gICAgICAgICAgIDxzcGFuPkFyZSB5b3Ugc3VyZT88L3NwYW4+XG4gICAgICAgICAgIDxidXR0b24gZGF0YS1qcz1cImNvbmZpcm1cIiB0eXBlPVwiYnV0dG9uXCI+RGVsZXRlPC9idXR0b24+IFxuICAgICAgICAgICA8YnV0dG9uIGRhdGEtanM9XCJjYW5jZWxcIiB0eXBlPVwiYnV0dG9uXCI+Q2FuY2VsPC9idXR0b24+IFxuICAgICAgIDwvZGl2PmBcbiAgICA6IGBgfVxuPC9kaXY+XG5gXG4iLCJtb2R1bGUuZXhwb3J0cyA9IHAgPT5cbmA8ZGl2PlxuICAgIDxkaXYgZGF0YS1qcz1cInRpdGxlXCI+PC9kaXY+XG4gICAgPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXBcIj5cbiAgICAgICA8bGFiZWwgY2xhc3M9XCJmb3JtLWxhYmVsXCIgZm9yPVwidXNlcm5hbWVcIj51c2VybmFtZTwvbGFiZWw+XG4gICAgICAgPGlucHV0IGRhdGEtanM9XCJ1c2VybmFtZVwiIGNsYXNzPVwidXNlcm5hbWVcIiB0eXBlPVwidGV4dFwiPjwvaW5wdXQ+XG4gICAgPC9kaXY+XG4gICAgPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXBcIj5cbiAgICAgICA8bGFiZWwgY2xhc3M9XCJmb3JtLWxhYmVsXCIgZm9yPVwicGFzc3dvcmRcIj5wYXNzd29yZDwvbGFiZWw+XG4gICAgICAgPGlucHV0IGRhdGEtanM9XCJwYXNzd29yZFwiIGNsYXNzPVwicGFzc3dvcmRcIiB0eXBlPVwicGFzc3dvcmRcIj48L2lucHV0PlxuICAgIDwvZGl2PlxuICAgIDxkaXYgY2xhc3M9XCJidXR0b24tcm93XCI+XG4gICAgICAgIDxidXR0b24gZGF0YS1qcz1cInN1Ym1pdFwiIGNsYXNzPVwiYnRuLWdob3N0XCIgdHlwZT1cImJ1dHRvblwiPlN1Ym1pdDwvYnV0dG9uPlxuICAgICAgICA8YnV0dG9uIGRhdGEtanM9XCJjYW5jZWxcIiBjbGFzcz1cImJ0bi1naG9zdFwiIHR5cGU9XCJidXR0b25cIj5DYW5jZWw8L2J1dHRvbj5cbiAgICA8L2Rpdj5cbjwvZGl2PmBcbiIsIm1vZHVsZS5leHBvcnRzID0gcCA9PiBcbmA8ZGl2PlxuICAgIDxkaXY+XG4gICAgICAgIDxkaXY+VXNlcnM8L2Rpdj5cbiAgICAgICAgPGJ1dHRvbiBkYXRhLWpzPVwiYWRkQnRuXCIgY2xhc3M9XCJhZGRcIj48L2J1dHRvbj5cbiAgICA8L2Rpdj5cbiAgICA8ZGl2IGRhdGEtanM9XCJsaXN0XCI+PC9kaXY+XG48L2Rpdj5gXG4iLCJtb2R1bGUuZXhwb3J0cyA9IGA8c3ZnIGRhdGEtanM9XCJmYWNlYm9va1wiIGVuYWJsZS1iYWNrZ3JvdW5kPVwibmV3IDAgMCA1Ni42OTMgNTYuNjkzXCIgaGVpZ2h0PVwiNTYuNjkzcHhcIiBpZD1cIkxheWVyXzFcIiB2ZXJzaW9uPVwiMS4xXCIgdmlld0JveD1cIjAgMCA1Ni42OTMgNTYuNjkzXCIgd2lkdGg9XCI1Ni42OTNweFwiIHhtbDpzcGFjZT1cInByZXNlcnZlXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHhtbG5zOnhsaW5rPVwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1wiPjxwYXRoIGQ9XCJNMjguMzQ3LDUuMTU3Yy0xMy42LDAtMjQuNjI1LDExLjAyNy0yNC42MjUsMjQuNjI1YzAsMTMuNiwxMS4wMjUsMjQuNjIzLDI0LjYyNSwyNC42MjNjMTMuNiwwLDI0LjYyNS0xMS4wMjMsMjQuNjI1LTI0LjYyMyAgQzUyLjk3MiwxNi4xODQsNDEuOTQ2LDUuMTU3LDI4LjM0Nyw1LjE1N3ogTTM0Ljg2NCwyOS42NzloLTQuMjY0YzAsNi44MTQsMCwxNS4yMDcsMCwxNS4yMDdoLTYuMzJjMCwwLDAtOC4zMDcsMC0xNS4yMDdoLTMuMDA2ICBWMjQuMzFoMy4wMDZ2LTMuNDc5YzAtMi40OSwxLjE4Mi02LjM3Nyw2LjM3OS02LjM3N2w0LjY4LDAuMDE4djUuMjE1YzAsMC0yLjg0NiwwLTMuMzk4LDBjLTAuNTU1LDAtMS4zNCwwLjI3Ny0xLjM0LDEuNDYxdjMuMTYzICBoNC44MThMMzQuODY0LDI5LjY3OXpcIi8+PC9zdmc+YFxuIiwibW9kdWxlLmV4cG9ydHM9YDxzdmcgZGF0YS1qcz1cImdvb2dsZVwiIGVuYWJsZS1iYWNrZ3JvdW5kPVwibmV3IDAgMCA1Ni42OTMgNTYuNjkzXCIgaGVpZ2h0PVwiNTYuNjkzcHhcIiBpZD1cIkxheWVyXzFcIiB2ZXJzaW9uPVwiMS4xXCIgdmlld0JveD1cIjAgMCA1Ni42OTMgNTYuNjkzXCIgd2lkdGg9XCI1Ni42OTNweFwiIHhtbDpzcGFjZT1cInByZXNlcnZlXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHhtbG5zOnhsaW5rPVwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1wiPjxnPjxwYXRoIGQ9XCJNMjMuNzYxLDI3Ljk2YzAuNjI5LDAsMS4xNi0wLjI0OCwxLjU3LTAuNzE3YzAuNjQ1LTAuNzMyLDAuOTI4LTEuOTM2LDAuNzYtMy4yMTVjLTAuMzAxLTIuMjg3LTEuOTMyLTQuMTg2LTMuNjM3LTQuMjM2ICAgaC0wLjA2OGMtMC42MDQsMC0xLjE0MSwwLjI0Ni0xLjU1MSwwLjcxNWMtMC42MzcsMC43MjUtMC45MDMsMS44NzEtMC43MzYsMy4xNDZjMC4yOTksMi4yODMsMS45NjUsNC4yNTYsMy42MzUsNC4zMDdIMjMuNzYxelwiLz48cGF0aCBkPVwiTTI1LjYyMiwzNC44NDdjLTAuMTY4LTAuMTEzLTAuMzQyLTAuMjMyLTAuNTIxLTAuMzU1Yy0wLjUyNS0wLjE2Mi0xLjA4NC0wLjI0Ni0xLjY1NC0wLjI1NGgtMC4wNzIgICBjLTIuNjI1LDAtNC45MjksMS41OTItNC45MjksMy40MDZjMCwxLjk3MSwxLjk3MiwzLjUxOCw0LjQ5MSwzLjUxOGMzLjMyMiwwLDUuMDA2LTEuMTQ1LDUuMDA2LTMuNDA0ICAgYzAtMC4yMTUtMC4wMjUtMC40MzYtMC4wNzYtMC42NTZDMjcuNjQyLDM2LjIyMiwyNi44MzcsMzUuNjc1LDI1LjYyMiwzNC44NDd6XCIvPjxwYXRoIGQ9XCJNMjguMzQ3LDUuMTU3Yy0xMy42MDEsMC0yNC42MjUsMTEuMDIzLTI0LjYyNSwyNC42MjNzMTEuMDI1LDI0LjYyNSwyNC42MjUsMjQuNjI1YzEzLjU5OCwwLDI0LjYyMy0xMS4wMjUsMjQuNjIzLTI0LjYyNSAgIFM0MS45NDQsNS4xNTcsMjguMzQ3LDUuMTU3eiBNMjYuMTA2LDQzLjE3OWMtMC45ODIsMC4yODMtMi4wNDEsMC40MjgtMy4xNTQsMC40MjhjLTEuMjM4LDAtMi40My0wLjE0My0zLjU0LTAuNDI0ICAgYy0yLjE1LTAuNTQxLTMuNzQtMS41Ny00LjQ4LTIuODk1Yy0wLjMyLTAuNTc0LTAuNDgyLTEuMTg0LTAuNDgyLTEuODE2YzAtMC42NTIsMC4xNTYtMS4zMTIsMC40NjMtMS45NjcgICBjMS4xOC0yLjUxLDQuMjgzLTQuMTk3LDcuNzIyLTQuMTk3YzAuMDM1LDAsMC4wNjgsMCwwLjEsMGMtMC4yNzktMC40OTItMC40MTYtMS4wMDItMC40MTYtMS41MzdjMC0wLjI2OCwwLjAzNS0wLjUzOSwwLjEwNS0wLjgxNCAgIGMtMy42MDYtMC4wODQtNi4zMDYtMi43MjUtNi4zMDYtNi4yMDdjMC0yLjQ2MSwxLjk2NS00Ljg1NSw0Ljc3Ni01LjgyNGMwLjg0Mi0wLjI5MSwxLjY5OS0wLjQzOSwyLjU0My0wLjQzOWg3LjcxMyAgIGMwLjI2NCwwLDAuNDk0LDAuMTcsMC41NzYsMC40MmMwLjA4NCwwLjI1Mi0wLjAwOCwwLjUyNS0wLjIyMSwwLjY4bC0xLjcyNSwxLjI0OGMtMC4xMDQsMC4wNzQtMC4yMjksMC4xMTUtMC4zNTcsMC4xMTVoLTAuNjE3ICAgYzAuNzk5LDAuOTU1LDEuMjY2LDIuMzE2LDEuMjY2LDMuODQ4YzAsMS42OTEtMC44NTUsMy4yODktMi40MSw0LjUwNmMtMS4yMDEsMC45MzYtMS4yNSwxLjE5MS0xLjI1LDEuNzI5ICAgYzAuMDE2LDAuMjk1LDAuODU0LDEuMjUyLDEuNzc1LDEuOTA0YzIuMTUyLDEuNTIzLDIuOTUzLDMuMDE0LDIuOTUzLDUuNTA4QzMxLjE0LDQwLjA0LDI5LjE2Myw0Mi4yOTIsMjYuMTA2LDQzLjE3OXogICAgTTQzLjUyOCwyOS45NDhjMCwwLjMzNC0wLjI3MywwLjYwNS0wLjYwNywwLjYwNWgtNC4zODN2NC4zODVjMCwwLjMzNi0wLjI3MSwwLjYwNy0wLjYwNywwLjYwN2gtMS4yNDggICBjLTAuMzM2LDAtMC42MDctMC4yNzEtMC42MDctMC42MDd2LTQuMzg1SDMxLjY5Yy0wLjMzMiwwLTAuNjA1LTAuMjcxLTAuNjA1LTAuNjA1di0xLjI1YzAtMC4zMzQsMC4yNzMtMC42MDcsMC42MDUtMC42MDdoNC4zODUgICB2LTQuMzgzYzAtMC4zMzYsMC4yNzEtMC42MDcsMC42MDctMC42MDdoMS4yNDhjMC4zMzYsMCwwLjYwNywwLjI3MSwwLjYwNywwLjYwN3Y0LjM4M2g0LjM4M2MwLjMzNCwwLDAuNjA3LDAuMjczLDAuNjA3LDAuNjA3ICAgVjI5Ljk0OHpcIi8+PC9nPjwvc3ZnPmBcbiIsIm1vZHVsZS5leHBvcnRzID0gYDxzdmcgZGF0YS1qcz1cIm1haWxcIiB2ZXJzaW9uPVwiMS4xXCIgaWQ9XCJDYXBhXzFcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgeG1sbnM6eGxpbms9XCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rXCIgeD1cIjBweFwiIHk9XCIwcHhcIlxyXG5cdCB2aWV3Qm94PVwiMCAwIDE0IDEzXCIgc3R5bGU9XCJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDE0IDEzO1wiIHhtbDpzcGFjZT1cInByZXNlcnZlXCI+XHJcblx0PGc+XHJcblx0XHQ8cGF0aCBzdHlsZT1cImZpbGw6IzAzMDEwNDtcIiBkPVwiTTcsOUw1LjI2OCw3LjQ4NGwtNC45NTIsNC4yNDVDMC40OTYsMTEuODk2LDAuNzM5LDEyLDEuMDA3LDEyaDExLjk4NlxyXG5cdFx0XHRjMC4yNjcsMCwwLjUwOS0wLjEwNCwwLjY4OC0wLjI3MUw4LjczMiw3LjQ4NEw3LDl6XCIvPlxyXG5cdFx0PHBhdGggc3R5bGU9XCJmaWxsOiMwMzAxMDQ7XCIgZD1cIk0xMy42ODQsMi4yNzFDMTMuNTA0LDIuMTAzLDEzLjI2MiwyLDEyLjk5MywySDEuMDA3QzAuNzQsMiwwLjQ5OCwyLjEwNCwwLjMxOCwyLjI3M0w3LDhcclxuXHRcdFx0TDEzLjY4NCwyLjI3MXpcIi8+XHJcblx0XHQ8cG9seWdvbiBzdHlsZT1cImZpbGw6IzAzMDEwNDtcIiBwb2ludHM9XCIwLDIuODc4IDAsMTEuMTg2IDQuODMzLDcuMDc5IFx0XHRcIi8+XHJcblx0XHQ8cG9seWdvbiBzdHlsZT1cImZpbGw6IzAzMDEwNDtcIiBwb2ludHM9XCI5LjE2Nyw3LjA3OSAxNCwxMS4xODYgMTQsMi44NzUgXHRcdFwiLz5cclxuXHQ8L2c+XHJcbjwvc3ZnPmBcclxuIiwibW9kdWxlLmV4cG9ydHM9YDxzdmcgZGF0YS1qcz1cInR3aXR0ZXJcIiBlbmFibGUtYmFja2dyb3VuZD1cIm5ldyAwIDAgNTYuNjkzIDU2LjY5M1wiIGhlaWdodD1cIjU2LjY5M3B4XCIgaWQ9XCJMYXllcl8xXCIgdmVyc2lvbj1cIjEuMVwiIHZpZXdCb3g9XCIwIDAgNTYuNjkzIDU2LjY5M1wiIHdpZHRoPVwiNTYuNjkzcHhcIiB4bWw6c3BhY2U9XCJwcmVzZXJ2ZVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB4bWxuczp4bGluaz1cImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmtcIj48cGF0aCBkPVwiTTI4LjM0OCw1LjE1N2MtMTMuNiwwLTI0LjYyNSwxMS4wMjctMjQuNjI1LDI0LjYyNWMwLDEzLjYsMTEuMDI1LDI0LjYyMywyNC42MjUsMjQuNjIzYzEzLjYsMCwyNC42MjMtMTEuMDIzLDI0LjYyMy0yNC42MjMgIEM1Mi45NzEsMTYuMTg0LDQxLjk0Nyw1LjE1NywyOC4zNDgsNS4xNTd6IE00MC43NTIsMjQuODE3YzAuMDEzLDAuMjY2LDAuMDE4LDAuNTMzLDAuMDE4LDAuODAzYzAsOC4yMDEtNi4yNDIsMTcuNjU2LTE3LjY1NiwxNy42NTYgIGMtMy41MDQsMC02Ljc2Ny0xLjAyNy05LjUxMy0yLjc4N2MwLjQ4NiwwLjA1NywwLjk3OSwwLjA4NiwxLjQ4LDAuMDg2YzIuOTA4LDAsNS41ODQtMC45OTIsNy43MDctMi42NTYgIGMtMi43MTUtMC4wNTEtNS4wMDYtMS44NDYtNS43OTYtNC4zMTFjMC4zNzgsMC4wNzQsMC43NjcsMC4xMTEsMS4xNjcsMC4xMTFjMC41NjYsMCwxLjExNC0wLjA3NCwxLjYzNS0wLjIxNyAgYy0yLjg0LTAuNTctNC45NzktMy4wOC00Ljk3OS02LjA4NGMwLTAuMDI3LDAtMC4wNTMsMC4wMDEtMC4wOGMwLjgzNiwwLjQ2NSwxLjc5MywwLjc0NCwyLjgxMSwwLjc3NyAgYy0xLjY2Ni0xLjExNS0yLjc2MS0zLjAxMi0yLjc2MS01LjE2NmMwLTEuMTM3LDAuMzA2LTIuMjA0LDAuODQtMy4xMmMzLjA2MSwzLjc1NCw3LjYzNCw2LjIyNSwxMi43OTIsNi40ODMgIGMtMC4xMDYtMC40NTMtMC4xNjEtMC45MjgtMC4xNjEtMS40MTRjMC0zLjQyNiwyLjc3OC02LjIwNSw2LjIwNi02LjIwNWMxLjc4NSwwLDMuMzk3LDAuNzU0LDQuNTI5LDEuOTU5ICBjMS40MTQtMC4yNzcsMi43NDItMC43OTUsMy45NDEtMS41MDZjLTAuNDY1LDEuNDUtMS40NDgsMi42NjYtMi43MywzLjQzM2MxLjI1Ny0wLjE1LDIuNDUzLTAuNDg0LDMuNTY1LTAuOTc3ICBDNDMuMDE4LDIyLjg0OSw0MS45NjUsMjMuOTQyLDQwLjc1MiwyNC44MTd6XCIvPjwvc3ZnPmBcbiIsIm1vZHVsZS5leHBvcnRzID0gZXJyID0+IHsgY29uc29sZS5sb2coIGVyci5zdGFjayB8fCBlcnIgKSB9XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcblxuICAgIEVycm9yOiByZXF1aXJlKCcuL015RXJyb3InKSxcblxuICAgIFA6ICggZnVuLCBhcmdzPVsgXSwgdGhpc0FyZyApID0+XG4gICAgICAgIG5ldyBQcm9taXNlKCAoIHJlc29sdmUsIHJlamVjdCApID0+IFJlZmxlY3QuYXBwbHkoIGZ1biwgdGhpc0FyZyB8fCB0aGlzLCBhcmdzLmNvbmNhdCggKCBlLCAuLi5jYWxsYmFjayApID0+IGUgPyByZWplY3QoZSkgOiByZXNvbHZlKGNhbGxiYWNrKSApICkgKSxcbiAgICBcbiAgICBjb25zdHJ1Y3RvcigpIHsgcmV0dXJuIHRoaXMgfVxufVxuIiwiLy8gQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgb3RoZXIgTm9kZSBjb250cmlidXRvcnMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbi8vIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbi8vIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuLy8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuLy8gZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdFxuLy8gcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlXG4vLyBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuLy8gaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuLy8gT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTlxuLy8gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4vLyBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1Jcbi8vIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbi8vIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbmZ1bmN0aW9uIEV2ZW50RW1pdHRlcigpIHtcbiAgdGhpcy5fZXZlbnRzID0gdGhpcy5fZXZlbnRzIHx8IHt9O1xuICB0aGlzLl9tYXhMaXN0ZW5lcnMgPSB0aGlzLl9tYXhMaXN0ZW5lcnMgfHwgdW5kZWZpbmVkO1xufVxubW9kdWxlLmV4cG9ydHMgPSBFdmVudEVtaXR0ZXI7XG5cbi8vIEJhY2t3YXJkcy1jb21wYXQgd2l0aCBub2RlIDAuMTAueFxuRXZlbnRFbWl0dGVyLkV2ZW50RW1pdHRlciA9IEV2ZW50RW1pdHRlcjtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5fZXZlbnRzID0gdW5kZWZpbmVkO1xuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5fbWF4TGlzdGVuZXJzID0gdW5kZWZpbmVkO1xuXG4vLyBCeSBkZWZhdWx0IEV2ZW50RW1pdHRlcnMgd2lsbCBwcmludCBhIHdhcm5pbmcgaWYgbW9yZSB0aGFuIDEwIGxpc3RlbmVycyBhcmVcbi8vIGFkZGVkIHRvIGl0LiBUaGlzIGlzIGEgdXNlZnVsIGRlZmF1bHQgd2hpY2ggaGVscHMgZmluZGluZyBtZW1vcnkgbGVha3MuXG5FdmVudEVtaXR0ZXIuZGVmYXVsdE1heExpc3RlbmVycyA9IDEwO1xuXG4vLyBPYnZpb3VzbHkgbm90IGFsbCBFbWl0dGVycyBzaG91bGQgYmUgbGltaXRlZCB0byAxMC4gVGhpcyBmdW5jdGlvbiBhbGxvd3Ncbi8vIHRoYXQgdG8gYmUgaW5jcmVhc2VkLiBTZXQgdG8gemVybyBmb3IgdW5saW1pdGVkLlxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5zZXRNYXhMaXN0ZW5lcnMgPSBmdW5jdGlvbihuKSB7XG4gIGlmICghaXNOdW1iZXIobikgfHwgbiA8IDAgfHwgaXNOYU4obikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCduIG11c3QgYmUgYSBwb3NpdGl2ZSBudW1iZXInKTtcbiAgdGhpcy5fbWF4TGlzdGVuZXJzID0gbjtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmVtaXQgPSBmdW5jdGlvbih0eXBlKSB7XG4gIHZhciBlciwgaGFuZGxlciwgbGVuLCBhcmdzLCBpLCBsaXN0ZW5lcnM7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMpXG4gICAgdGhpcy5fZXZlbnRzID0ge307XG5cbiAgLy8gSWYgdGhlcmUgaXMgbm8gJ2Vycm9yJyBldmVudCBsaXN0ZW5lciB0aGVuIHRocm93LlxuICBpZiAodHlwZSA9PT0gJ2Vycm9yJykge1xuICAgIGlmICghdGhpcy5fZXZlbnRzLmVycm9yIHx8XG4gICAgICAgIChpc09iamVjdCh0aGlzLl9ldmVudHMuZXJyb3IpICYmICF0aGlzLl9ldmVudHMuZXJyb3IubGVuZ3RoKSkge1xuICAgICAgZXIgPSBhcmd1bWVudHNbMV07XG4gICAgICBpZiAoZXIgaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgICB0aHJvdyBlcjsgLy8gVW5oYW5kbGVkICdlcnJvcicgZXZlbnRcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIEF0IGxlYXN0IGdpdmUgc29tZSBraW5kIG9mIGNvbnRleHQgdG8gdGhlIHVzZXJcbiAgICAgICAgdmFyIGVyciA9IG5ldyBFcnJvcignVW5jYXVnaHQsIHVuc3BlY2lmaWVkIFwiZXJyb3JcIiBldmVudC4gKCcgKyBlciArICcpJyk7XG4gICAgICAgIGVyci5jb250ZXh0ID0gZXI7XG4gICAgICAgIHRocm93IGVycjtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBoYW5kbGVyID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gIGlmIChpc1VuZGVmaW5lZChoYW5kbGVyKSlcbiAgICByZXR1cm4gZmFsc2U7XG5cbiAgaWYgKGlzRnVuY3Rpb24oaGFuZGxlcikpIHtcbiAgICBzd2l0Y2ggKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgIC8vIGZhc3QgY2FzZXNcbiAgICAgIGNhc2UgMTpcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMjpcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMsIGFyZ3VtZW50c1sxXSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAzOlxuICAgICAgICBoYW5kbGVyLmNhbGwodGhpcywgYXJndW1lbnRzWzFdLCBhcmd1bWVudHNbMl0pO1xuICAgICAgICBicmVhaztcbiAgICAgIC8vIHNsb3dlclxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG4gICAgICAgIGhhbmRsZXIuYXBwbHkodGhpcywgYXJncyk7XG4gICAgfVxuICB9IGVsc2UgaWYgKGlzT2JqZWN0KGhhbmRsZXIpKSB7XG4gICAgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG4gICAgbGlzdGVuZXJzID0gaGFuZGxlci5zbGljZSgpO1xuICAgIGxlbiA9IGxpc3RlbmVycy5sZW5ndGg7XG4gICAgZm9yIChpID0gMDsgaSA8IGxlbjsgaSsrKVxuICAgICAgbGlzdGVuZXJzW2ldLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmFkZExpc3RlbmVyID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgdmFyIG07XG5cbiAgaWYgKCFpc0Z1bmN0aW9uKGxpc3RlbmVyKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ2xpc3RlbmVyIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzKVxuICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuXG4gIC8vIFRvIGF2b2lkIHJlY3Vyc2lvbiBpbiB0aGUgY2FzZSB0aGF0IHR5cGUgPT09IFwibmV3TGlzdGVuZXJcIiEgQmVmb3JlXG4gIC8vIGFkZGluZyBpdCB0byB0aGUgbGlzdGVuZXJzLCBmaXJzdCBlbWl0IFwibmV3TGlzdGVuZXJcIi5cbiAgaWYgKHRoaXMuX2V2ZW50cy5uZXdMaXN0ZW5lcilcbiAgICB0aGlzLmVtaXQoJ25ld0xpc3RlbmVyJywgdHlwZSxcbiAgICAgICAgICAgICAgaXNGdW5jdGlvbihsaXN0ZW5lci5saXN0ZW5lcikgP1xuICAgICAgICAgICAgICBsaXN0ZW5lci5saXN0ZW5lciA6IGxpc3RlbmVyKTtcblxuICBpZiAoIXRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICAvLyBPcHRpbWl6ZSB0aGUgY2FzZSBvZiBvbmUgbGlzdGVuZXIuIERvbid0IG5lZWQgdGhlIGV4dHJhIGFycmF5IG9iamVjdC5cbiAgICB0aGlzLl9ldmVudHNbdHlwZV0gPSBsaXN0ZW5lcjtcbiAgZWxzZSBpZiAoaXNPYmplY3QodGhpcy5fZXZlbnRzW3R5cGVdKSlcbiAgICAvLyBJZiB3ZSd2ZSBhbHJlYWR5IGdvdCBhbiBhcnJheSwganVzdCBhcHBlbmQuXG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdLnB1c2gobGlzdGVuZXIpO1xuICBlbHNlXG4gICAgLy8gQWRkaW5nIHRoZSBzZWNvbmQgZWxlbWVudCwgbmVlZCB0byBjaGFuZ2UgdG8gYXJyYXkuXG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdID0gW3RoaXMuX2V2ZW50c1t0eXBlXSwgbGlzdGVuZXJdO1xuXG4gIC8vIENoZWNrIGZvciBsaXN0ZW5lciBsZWFrXG4gIGlmIChpc09iamVjdCh0aGlzLl9ldmVudHNbdHlwZV0pICYmICF0aGlzLl9ldmVudHNbdHlwZV0ud2FybmVkKSB7XG4gICAgaWYgKCFpc1VuZGVmaW5lZCh0aGlzLl9tYXhMaXN0ZW5lcnMpKSB7XG4gICAgICBtID0gdGhpcy5fbWF4TGlzdGVuZXJzO1xuICAgIH0gZWxzZSB7XG4gICAgICBtID0gRXZlbnRFbWl0dGVyLmRlZmF1bHRNYXhMaXN0ZW5lcnM7XG4gICAgfVxuXG4gICAgaWYgKG0gJiYgbSA+IDAgJiYgdGhpcy5fZXZlbnRzW3R5cGVdLmxlbmd0aCA+IG0pIHtcbiAgICAgIHRoaXMuX2V2ZW50c1t0eXBlXS53YXJuZWQgPSB0cnVlO1xuICAgICAgY29uc29sZS5lcnJvcignKG5vZGUpIHdhcm5pbmc6IHBvc3NpYmxlIEV2ZW50RW1pdHRlciBtZW1vcnkgJyArXG4gICAgICAgICAgICAgICAgICAgICdsZWFrIGRldGVjdGVkLiAlZCBsaXN0ZW5lcnMgYWRkZWQuICcgK1xuICAgICAgICAgICAgICAgICAgICAnVXNlIGVtaXR0ZXIuc2V0TWF4TGlzdGVuZXJzKCkgdG8gaW5jcmVhc2UgbGltaXQuJyxcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZXZlbnRzW3R5cGVdLmxlbmd0aCk7XG4gICAgICBpZiAodHlwZW9mIGNvbnNvbGUudHJhY2UgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgLy8gbm90IHN1cHBvcnRlZCBpbiBJRSAxMFxuICAgICAgICBjb25zb2xlLnRyYWNlKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLm9uID0gRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5hZGRMaXN0ZW5lcjtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbmNlID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgaWYgKCFpc0Z1bmN0aW9uKGxpc3RlbmVyKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ2xpc3RlbmVyIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuXG4gIHZhciBmaXJlZCA9IGZhbHNlO1xuXG4gIGZ1bmN0aW9uIGcoKSB7XG4gICAgdGhpcy5yZW1vdmVMaXN0ZW5lcih0eXBlLCBnKTtcblxuICAgIGlmICghZmlyZWQpIHtcbiAgICAgIGZpcmVkID0gdHJ1ZTtcbiAgICAgIGxpc3RlbmVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfVxuICB9XG5cbiAgZy5saXN0ZW5lciA9IGxpc3RlbmVyO1xuICB0aGlzLm9uKHR5cGUsIGcpO1xuXG4gIHJldHVybiB0aGlzO1xufTtcblxuLy8gZW1pdHMgYSAncmVtb3ZlTGlzdGVuZXInIGV2ZW50IGlmZiB0aGUgbGlzdGVuZXIgd2FzIHJlbW92ZWRcbkV2ZW50RW1pdHRlci5wcm90b3R5cGUucmVtb3ZlTGlzdGVuZXIgPSBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuICB2YXIgbGlzdCwgcG9zaXRpb24sIGxlbmd0aCwgaTtcblxuICBpZiAoIWlzRnVuY3Rpb24obGlzdGVuZXIpKVxuICAgIHRocm93IFR5cGVFcnJvcignbGlzdGVuZXIgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMgfHwgIXRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICByZXR1cm4gdGhpcztcblxuICBsaXN0ID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuICBsZW5ndGggPSBsaXN0Lmxlbmd0aDtcbiAgcG9zaXRpb24gPSAtMTtcblxuICBpZiAobGlzdCA9PT0gbGlzdGVuZXIgfHxcbiAgICAgIChpc0Z1bmN0aW9uKGxpc3QubGlzdGVuZXIpICYmIGxpc3QubGlzdGVuZXIgPT09IGxpc3RlbmVyKSkge1xuICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG4gICAgaWYgKHRoaXMuX2V2ZW50cy5yZW1vdmVMaXN0ZW5lcilcbiAgICAgIHRoaXMuZW1pdCgncmVtb3ZlTGlzdGVuZXInLCB0eXBlLCBsaXN0ZW5lcik7XG5cbiAgfSBlbHNlIGlmIChpc09iamVjdChsaXN0KSkge1xuICAgIGZvciAoaSA9IGxlbmd0aDsgaS0tID4gMDspIHtcbiAgICAgIGlmIChsaXN0W2ldID09PSBsaXN0ZW5lciB8fFxuICAgICAgICAgIChsaXN0W2ldLmxpc3RlbmVyICYmIGxpc3RbaV0ubGlzdGVuZXIgPT09IGxpc3RlbmVyKSkge1xuICAgICAgICBwb3NpdGlvbiA9IGk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChwb3NpdGlvbiA8IDApXG4gICAgICByZXR1cm4gdGhpcztcblxuICAgIGlmIChsaXN0Lmxlbmd0aCA9PT0gMSkge1xuICAgICAgbGlzdC5sZW5ndGggPSAwO1xuICAgICAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgICB9IGVsc2Uge1xuICAgICAgbGlzdC5zcGxpY2UocG9zaXRpb24sIDEpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9ldmVudHMucmVtb3ZlTGlzdGVuZXIpXG4gICAgICB0aGlzLmVtaXQoJ3JlbW92ZUxpc3RlbmVyJywgdHlwZSwgbGlzdGVuZXIpO1xuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUFsbExpc3RlbmVycyA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgdmFyIGtleSwgbGlzdGVuZXJzO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzKVxuICAgIHJldHVybiB0aGlzO1xuXG4gIC8vIG5vdCBsaXN0ZW5pbmcgZm9yIHJlbW92ZUxpc3RlbmVyLCBubyBuZWVkIHRvIGVtaXRcbiAgaWYgKCF0aGlzLl9ldmVudHMucmVtb3ZlTGlzdGVuZXIpIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMClcbiAgICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuICAgIGVsc2UgaWYgKHRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvLyBlbWl0IHJlbW92ZUxpc3RlbmVyIGZvciBhbGwgbGlzdGVuZXJzIG9uIGFsbCBldmVudHNcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApIHtcbiAgICBmb3IgKGtleSBpbiB0aGlzLl9ldmVudHMpIHtcbiAgICAgIGlmIChrZXkgPT09ICdyZW1vdmVMaXN0ZW5lcicpIGNvbnRpbnVlO1xuICAgICAgdGhpcy5yZW1vdmVBbGxMaXN0ZW5lcnMoa2V5KTtcbiAgICB9XG4gICAgdGhpcy5yZW1vdmVBbGxMaXN0ZW5lcnMoJ3JlbW92ZUxpc3RlbmVyJyk7XG4gICAgdGhpcy5fZXZlbnRzID0ge307XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBsaXN0ZW5lcnMgPSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgaWYgKGlzRnVuY3Rpb24obGlzdGVuZXJzKSkge1xuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIodHlwZSwgbGlzdGVuZXJzKTtcbiAgfSBlbHNlIGlmIChsaXN0ZW5lcnMpIHtcbiAgICAvLyBMSUZPIG9yZGVyXG4gICAgd2hpbGUgKGxpc3RlbmVycy5sZW5ndGgpXG4gICAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGxpc3RlbmVyc1tsaXN0ZW5lcnMubGVuZ3RoIC0gMV0pO1xuICB9XG4gIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmxpc3RlbmVycyA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgdmFyIHJldDtcbiAgaWYgKCF0aGlzLl9ldmVudHMgfHwgIXRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICByZXQgPSBbXTtcbiAgZWxzZSBpZiAoaXNGdW5jdGlvbih0aGlzLl9ldmVudHNbdHlwZV0pKVxuICAgIHJldCA9IFt0aGlzLl9ldmVudHNbdHlwZV1dO1xuICBlbHNlXG4gICAgcmV0ID0gdGhpcy5fZXZlbnRzW3R5cGVdLnNsaWNlKCk7XG4gIHJldHVybiByZXQ7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmxpc3RlbmVyQ291bnQgPSBmdW5jdGlvbih0eXBlKSB7XG4gIGlmICh0aGlzLl9ldmVudHMpIHtcbiAgICB2YXIgZXZsaXN0ZW5lciA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcblxuICAgIGlmIChpc0Z1bmN0aW9uKGV2bGlzdGVuZXIpKVxuICAgICAgcmV0dXJuIDE7XG4gICAgZWxzZSBpZiAoZXZsaXN0ZW5lcilcbiAgICAgIHJldHVybiBldmxpc3RlbmVyLmxlbmd0aDtcbiAgfVxuICByZXR1cm4gMDtcbn07XG5cbkV2ZW50RW1pdHRlci5saXN0ZW5lckNvdW50ID0gZnVuY3Rpb24oZW1pdHRlciwgdHlwZSkge1xuICByZXR1cm4gZW1pdHRlci5saXN0ZW5lckNvdW50KHR5cGUpO1xufTtcblxuZnVuY3Rpb24gaXNGdW5jdGlvbihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdmdW5jdGlvbic7XG59XG5cbmZ1bmN0aW9uIGlzTnVtYmVyKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ251bWJlcic7XG59XG5cbmZ1bmN0aW9uIGlzT2JqZWN0KGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ29iamVjdCcgJiYgYXJnICE9PSBudWxsO1xufVxuXG5mdW5jdGlvbiBpc1VuZGVmaW5lZChhcmcpIHtcbiAgcmV0dXJuIGFyZyA9PT0gdm9pZCAwO1xufVxuIl19
