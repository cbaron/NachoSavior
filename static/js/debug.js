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
                path: { value: path, writable: true },
                templateOpts: { value: { readOnly: true } }
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
        store: 'click',
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
        window.open('https://plus.google.com/share?url={' + this.getLink() + '}');
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
    return '<div>\n    <div class="header" data-js="header">\n        <div class="title" data-js="title" >' + (p.title || '') + '</div>\n        <div class="pre-context" data-js="preContext" >' + (p.preContext || '') + '</div>\n        <div><img data-js="context" class="context" src="' + (p.context || '') + '"/></div>\n        <div class="post-context" data-js="postContext" >' + (p.postContext || '') + '</div>\n        ' + (p._id && p.user._id && !p.opts.readOnly ? '<button class="delete" data-js="delete"></button>' : '') + '\n        ' + (p._id && p.user._id && !p.opts.readOnly ? '<button class="edit" data-js="edit"></button>' : '') + '\n    </div>\n    ' + (p._id && p.user._id && !p.opts.readOnly ? '<div class="confirm hidden" data-js="confirmDialog">\n               <span>Are you sure?</span>\n               <button data-js="confirm" type="button">Delete</button> \n               <button data-js="cancel" type="button">Cancel</button> \n           </div>' : '') + '\n    <div class="clearfix">\n        <div class="date">' + require('moment')(p.created).format('MM-DD-YYYY') + '</div>\n    </div>\n    <img data-js="image" src="' + (p.image ? p.image : '') + '"/>\n    ' + (p.opts.readOnly ? '<div class="clearfix">\n             <div class="share">\n                 ' + require('./lib/facebook') + '\n                 ' + require('./lib/twitter') + '\n                 ' + require('./lib/google') + '\n             </div>\n             <div class="store" data-js="store">Store</div>\n         </div>' : '') + '\n</div>';
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJjbGllbnQvanMvLlRlbXBsYXRlTWFwLmpzIiwiY2xpZW50L2pzLy5WaWV3TWFwLmpzIiwiY2xpZW50L2pzLy5lbnYiLCJjbGllbnQvanMvWGhyLmpzIiwiY2xpZW50L2pzL2ZhY3RvcnkvVmlldy5qcyIsImNsaWVudC9qcy9tYWluLmpzIiwiY2xpZW50L2pzL21vZGVscy9Vc2VyLmpzIiwiY2xpZW50L2pzL21vZGVscy9fX3Byb3RvX18uanMiLCJjbGllbnQvanMvcm91dGVyLmpzIiwiY2xpZW50L2pzL3ZpZXdzL0FkbWluLmpzIiwiY2xpZW50L2pzL3ZpZXdzL0FkbWluSXRlbS5qcyIsImNsaWVudC9qcy92aWV3cy9Db21pYy5qcyIsImNsaWVudC9qcy92aWV3cy9Db21pY01hbmFnZS5qcyIsImNsaWVudC9qcy92aWV3cy9Db21pY1Jlc291cmNlcy5qcyIsImNsaWVudC9qcy92aWV3cy9IZWFkZXIuanMiLCJjbGllbnQvanMvdmlld3MvSG9tZS5qcyIsImNsaWVudC9qcy92aWV3cy9Mb2dpbi5qcyIsImNsaWVudC9qcy92aWV3cy9Vc2VyLmpzIiwiY2xpZW50L2pzL3ZpZXdzL1VzZXJNYW5hZ2UuanMiLCJjbGllbnQvanMvdmlld3MvVXNlclJlc291cmNlcy5qcyIsImNsaWVudC9qcy92aWV3cy9fX3Byb3RvX18uanMiLCJjbGllbnQvanMvdmlld3MvbGliL09wdGltaXplZFJlc2l6ZS5qcyIsImNsaWVudC9qcy92aWV3cy9saWIvU3Bpbi5qcyIsImNsaWVudC9qcy92aWV3cy90ZW1wbGF0ZXMvQWRtaW4uanMiLCJjbGllbnQvanMvdmlld3MvdGVtcGxhdGVzL0FkbWluSXRlbS5qcyIsImNsaWVudC9qcy92aWV3cy90ZW1wbGF0ZXMvQ29taWMuanMiLCJjbGllbnQvanMvdmlld3MvdGVtcGxhdGVzL0NvbWljTWFuYWdlLmpzIiwiY2xpZW50L2pzL3ZpZXdzL3RlbXBsYXRlcy9Db21pY1Jlc291cmNlcy5qcyIsImNsaWVudC9qcy92aWV3cy90ZW1wbGF0ZXMvSGVhZGVyLmpzIiwiY2xpZW50L2pzL3ZpZXdzL3RlbXBsYXRlcy9Ib21lLmpzIiwiY2xpZW50L2pzL3ZpZXdzL3RlbXBsYXRlcy9Mb2dpbi5qcyIsImNsaWVudC9qcy92aWV3cy90ZW1wbGF0ZXMvVXNlci5qcyIsImNsaWVudC9qcy92aWV3cy90ZW1wbGF0ZXMvVXNlck1hbmFnZS5qcyIsImNsaWVudC9qcy92aWV3cy90ZW1wbGF0ZXMvVXNlclJlc291cmNlcy5qcyIsImNsaWVudC9qcy92aWV3cy90ZW1wbGF0ZXMvbGliL2ZhY2Vib29rLmpzIiwiY2xpZW50L2pzL3ZpZXdzL3RlbXBsYXRlcy9saWIvZ29vZ2xlLmpzIiwiY2xpZW50L2pzL3ZpZXdzL3RlbXBsYXRlcy9saWIvdHdpdHRlci5qcyIsImxpYi9NeUVycm9yLmpzIiwibGliL015T2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2V2ZW50cy9ldmVudHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBLE9BQU8sT0FBUCxHQUFlO0FBQ2QsUUFBTyxRQUFRLHlCQUFSLENBRE87QUFFZCxZQUFXLFFBQVEsNkJBQVIsQ0FGRztBQUdkLFFBQU8sUUFBUSx5QkFBUixDQUhPO0FBSWQsY0FBYSxRQUFRLCtCQUFSLENBSkM7QUFLZCxpQkFBZ0IsUUFBUSxrQ0FBUixDQUxGO0FBTWQsU0FBUSxRQUFRLDBCQUFSLENBTk07QUFPZCxPQUFNLFFBQVEsd0JBQVIsQ0FQUTtBQVFkLFFBQU8sUUFBUSx5QkFBUixDQVJPO0FBU2QsT0FBTSxRQUFRLHdCQUFSLENBVFE7QUFVZCxhQUFZLFFBQVEsOEJBQVIsQ0FWRTtBQVdkLGdCQUFlLFFBQVEsaUNBQVI7QUFYRCxDQUFmOzs7OztBQ0FBLE9BQU8sT0FBUCxHQUFlO0FBQ2QsUUFBTyxRQUFRLGVBQVIsQ0FETztBQUVkLFlBQVcsUUFBUSxtQkFBUixDQUZHO0FBR2QsUUFBTyxRQUFRLGVBQVIsQ0FITztBQUlkLGNBQWEs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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJtb2R1bGUuZXhwb3J0cz17XG5cdEFkbWluOiByZXF1aXJlKCcuL3ZpZXdzL3RlbXBsYXRlcy9BZG1pbicpLFxuXHRBZG1pbkl0ZW06IHJlcXVpcmUoJy4vdmlld3MvdGVtcGxhdGVzL0FkbWluSXRlbScpLFxuXHRDb21pYzogcmVxdWlyZSgnLi92aWV3cy90ZW1wbGF0ZXMvQ29taWMnKSxcblx0Q29taWNNYW5hZ2U6IHJlcXVpcmUoJy4vdmlld3MvdGVtcGxhdGVzL0NvbWljTWFuYWdlJyksXG5cdENvbWljUmVzb3VyY2VzOiByZXF1aXJlKCcuL3ZpZXdzL3RlbXBsYXRlcy9Db21pY1Jlc291cmNlcycpLFxuXHRIZWFkZXI6IHJlcXVpcmUoJy4vdmlld3MvdGVtcGxhdGVzL0hlYWRlcicpLFxuXHRIb21lOiByZXF1aXJlKCcuL3ZpZXdzL3RlbXBsYXRlcy9Ib21lJyksXG5cdExvZ2luOiByZXF1aXJlKCcuL3ZpZXdzL3RlbXBsYXRlcy9Mb2dpbicpLFxuXHRVc2VyOiByZXF1aXJlKCcuL3ZpZXdzL3RlbXBsYXRlcy9Vc2VyJyksXG5cdFVzZXJNYW5hZ2U6IHJlcXVpcmUoJy4vdmlld3MvdGVtcGxhdGVzL1VzZXJNYW5hZ2UnKSxcblx0VXNlclJlc291cmNlczogcmVxdWlyZSgnLi92aWV3cy90ZW1wbGF0ZXMvVXNlclJlc291cmNlcycpXG59IiwibW9kdWxlLmV4cG9ydHM9e1xuXHRBZG1pbjogcmVxdWlyZSgnLi92aWV3cy9BZG1pbicpLFxuXHRBZG1pbkl0ZW06IHJlcXVpcmUoJy4vdmlld3MvQWRtaW5JdGVtJyksXG5cdENvbWljOiByZXF1aXJlKCcuL3ZpZXdzL0NvbWljJyksXG5cdENvbWljTWFuYWdlOiByZXF1aXJlKCcuL3ZpZXdzL0NvbWljTWFuYWdlJyksXG5cdENvbWljUmVzb3VyY2VzOiByZXF1aXJlKCcuL3ZpZXdzL0NvbWljUmVzb3VyY2VzJyksXG5cdEhlYWRlcjogcmVxdWlyZSgnLi92aWV3cy9IZWFkZXInKSxcblx0SG9tZTogcmVxdWlyZSgnLi92aWV3cy9Ib21lJyksXG5cdExvZ2luOiByZXF1aXJlKCcuL3ZpZXdzL0xvZ2luJyksXG5cdFVzZXI6IHJlcXVpcmUoJy4vdmlld3MvVXNlcicpLFxuXHRVc2VyTWFuYWdlOiByZXF1aXJlKCcuL3ZpZXdzL1VzZXJNYW5hZ2UnKSxcblx0VXNlclJlc291cmNlczogcmVxdWlyZSgnLi92aWV3cy9Vc2VyUmVzb3VyY2VzJylcbn0iLCJ3aW5kb3cuY29va2llTmFtZSA9ICdjaGVldG9qZXN1cydcbiIsIm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmNyZWF0ZSggT2JqZWN0LmFzc2lnbigge30sIHJlcXVpcmUoJy4uLy4uL2xpYi9NeU9iamVjdCcpLCB7XG5cbiAgICBSZXF1ZXN0OiB7XG5cbiAgICAgICAgY29uc3RydWN0b3IoIGRhdGEgKSB7XG4gICAgICAgICAgICBsZXQgcmVxID0gbmV3IFhNTEh0dHBSZXF1ZXN0KClcblxuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKCAoIHJlc29sdmUsIHJlamVjdCApID0+IHtcblxuICAgICAgICAgICAgICAgIHJlcS5vbmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgWyA1MDAsIDQwNCwgNDAxIF0uaW5jbHVkZXMoIHRoaXMuc3RhdHVzIClcbiAgICAgICAgICAgICAgICAgICAgICAgID8gcmVqZWN0KCB0aGlzLnJlc3BvbnNlIClcbiAgICAgICAgICAgICAgICAgICAgICAgIDogcmVzb2x2ZSggSlNPTi5wYXJzZSh0aGlzLnJlc3BvbnNlKSApXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYoIGRhdGEubWV0aG9kID09PSBcImdldFwiIHx8IGRhdGEubWV0aG9kID09PSBcIm9wdGlvbnNcIiApIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHFzID0gZGF0YS5xcyA/IGA/JHtkYXRhLnFzfWAgOiAnJyBcbiAgICAgICAgICAgICAgICAgICAgcmVxLm9wZW4oIGRhdGEubWV0aG9kLCBgLyR7ZGF0YS5yZXNvdXJjZX0ke3FzfWAgKVxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldEhlYWRlcnMoIHJlcSwgZGF0YS5oZWFkZXJzIClcbiAgICAgICAgICAgICAgICAgICAgcmVxLnNlbmQobnVsbClcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXEub3BlbiggZGF0YS5tZXRob2QsIGAvJHtkYXRhLnJlc291cmNlfWAsIHRydWUpXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0SGVhZGVycyggcmVxLCBkYXRhLmhlYWRlcnMgKVxuICAgICAgICAgICAgICAgICAgICByZXEuc2VuZCggZGF0YS5kYXRhIClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IClcbiAgICAgICAgfSxcblxuICAgICAgICBwbGFpbkVzY2FwZSggc1RleHQgKSB7XG4gICAgICAgICAgICAvKiBob3cgc2hvdWxkIEkgdHJlYXQgYSB0ZXh0L3BsYWluIGZvcm0gZW5jb2Rpbmc/IHdoYXQgY2hhcmFjdGVycyBhcmUgbm90IGFsbG93ZWQ/IHRoaXMgaXMgd2hhdCBJIHN1cHBvc2UuLi46ICovXG4gICAgICAgICAgICAvKiBcIjRcXDNcXDcgLSBFaW5zdGVpbiBzYWlkIEU9bWMyXCIgLS0tLT4gXCI0XFxcXDNcXFxcN1xcIC1cXCBFaW5zdGVpblxcIHNhaWRcXCBFXFw9bWMyXCIgKi9cbiAgICAgICAgICAgIHJldHVybiBzVGV4dC5yZXBsYWNlKC9bXFxzXFw9XFxcXF0vZywgXCJcXFxcJCZcIik7XG4gICAgICAgIH0sXG5cbiAgICAgICAgc2V0SGVhZGVycyggcmVxLCBoZWFkZXJzPXt9ICkge1xuICAgICAgICAgICAgcmVxLnNldFJlcXVlc3RIZWFkZXIoIFwiQWNjZXB0XCIsIGhlYWRlcnMuYWNjZXB0IHx8ICdhcHBsaWNhdGlvbi9qc29uJyApXG4gICAgICAgICAgICByZXEuc2V0UmVxdWVzdEhlYWRlciggXCJDb250ZW50LVR5cGVcIiwgaGVhZGVycy5jb250ZW50VHlwZSB8fCAndGV4dC9wbGFpbicgKVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIF9mYWN0b3J5KCBkYXRhICkge1xuICAgICAgICByZXR1cm4gT2JqZWN0LmNyZWF0ZSggdGhpcy5SZXF1ZXN0LCB7IH0gKS5jb25zdHJ1Y3RvciggZGF0YSApXG4gICAgfSxcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuXG4gICAgICAgIGlmKCAhWE1MSHR0cFJlcXVlc3QucHJvdG90eXBlLnNlbmRBc0JpbmFyeSApIHtcbiAgICAgICAgICBYTUxIdHRwUmVxdWVzdC5wcm90b3R5cGUuc2VuZEFzQmluYXJ5ID0gZnVuY3Rpb24oc0RhdGEpIHtcbiAgICAgICAgICAgIHZhciBuQnl0ZXMgPSBzRGF0YS5sZW5ndGgsIHVpOERhdGEgPSBuZXcgVWludDhBcnJheShuQnl0ZXMpO1xuICAgICAgICAgICAgZm9yICh2YXIgbklkeCA9IDA7IG5JZHggPCBuQnl0ZXM7IG5JZHgrKykge1xuICAgICAgICAgICAgICB1aThEYXRhW25JZHhdID0gc0RhdGEuY2hhckNvZGVBdChuSWR4KSAmIDB4ZmY7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnNlbmQodWk4RGF0YSk7XG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLl9mYWN0b3J5LmJpbmQodGhpcylcbiAgICB9XG5cbn0gKSwgeyB9ICkuY29uc3RydWN0b3IoKVxuIiwibW9kdWxlLmV4cG9ydHMgPSBPYmplY3QuY3JlYXRlKCB7XG5cbiAgICBjcmVhdGUoIG5hbWUsIG9wdHMgKSB7XG4gICAgICAgIGNvbnN0IGxvd2VyID0gbmFtZVxuICAgICAgICBuYW1lID0gbmFtZS5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIG5hbWUuc2xpY2UoMSlcbiAgICAgICAgcmV0dXJuIE9iamVjdC5jcmVhdGUoXG4gICAgICAgICAgICB0aGlzLlZpZXdzWyBuYW1lIF0sXG4gICAgICAgICAgICBPYmplY3QuYXNzaWduKCB7XG4gICAgICAgICAgICAgICAgbmFtZTogeyB2YWx1ZTogbmFtZSB9LFxuICAgICAgICAgICAgICAgIGZhY3Rvcnk6IHsgdmFsdWU6IHRoaXMgfSxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogeyB2YWx1ZTogdGhpcy5UZW1wbGF0ZXNbIG5hbWUgXSB9LFxuICAgICAgICAgICAgICAgIHVzZXI6IHsgdmFsdWU6IHRoaXMuVXNlciB9XG4gICAgICAgICAgICAgICAgfSwgb3B0cyApXG4gICAgICAgICkuY29uc3RydWN0b3IoKVxuICAgICAgICAub24oICduYXZpZ2F0ZScsIHJvdXRlID0+IHJlcXVpcmUoJy4uL3JvdXRlcicpLm5hdmlnYXRlKCByb3V0ZSApIClcbiAgICAgICAgLm9uKCAnZGVsZXRlZCcsICgpID0+IGRlbGV0ZSAocmVxdWlyZSgnLi4vcm91dGVyJykpLnZpZXdzW25hbWVdIClcbiAgICB9LFxuXG59LCB7XG4gICAgVGVtcGxhdGVzOiB7IHZhbHVlOiByZXF1aXJlKCcuLi8uVGVtcGxhdGVNYXAnKSB9LFxuICAgIFVzZXI6IHsgdmFsdWU6IHJlcXVpcmUoJy4uL21vZGVscy9Vc2VyJyApIH0sXG4gICAgVmlld3M6IHsgdmFsdWU6IHJlcXVpcmUoJy4uLy5WaWV3TWFwJykgfVxufSApXG4iLCJ3aW5kb3cub25sb2FkID0gKCkgPT4ge1xuICAgIHJlcXVpcmUoJy4vLmVudicpXG4gICAgcmVxdWlyZSgnLi9yb3V0ZXInKS5pbml0aWFsaXplKClcbn1cbiIsIm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmNyZWF0ZSggcmVxdWlyZSgnLi9fX3Byb3RvX18uanMnKSwgeyByZXNvdXJjZTogeyB2YWx1ZTogJ21lJyB9IH0gKVxuIiwibW9kdWxlLmV4cG9ydHMgPSBPYmplY3QuYXNzaWduKCB7IH0sIHJlcXVpcmUoJy4uLy4uLy4uL2xpYi9NeU9iamVjdCcpLCByZXF1aXJlKCdldmVudHMnKS5FdmVudEVtaXR0ZXIucHJvdG90eXBlLCB7XG5cbiAgICBYaHI6IHJlcXVpcmUoJy4uL1hocicpLFxuXG4gICAgZ2V0KCBvcHRzPXsgcXVlcnk6e30gfSApIHtcbiAgICAgICAgaWYoIG9wdHMucXVlcnkgfHwgdGhpcy5wYWdpbmF0aW9uICkgT2JqZWN0LmFzc2lnbiggb3B0cy5xdWVyeSwgdGhpcy5wYWdpbmF0aW9uIClcbiAgICAgICAgcmV0dXJuIHRoaXMuWGhyKCB7IG1ldGhvZDogb3B0cy5tZXRob2QgfHwgJ2dldCcsIHJlc291cmNlOiB0aGlzLnJlc291cmNlLCBoZWFkZXJzOiB0aGlzLmhlYWRlcnMgfHwge30sIHFzOiBvcHRzLnF1ZXJ5ID8gSlNPTi5zdHJpbmdpZnkoIG9wdHMucXVlcnkgKSA6IHVuZGVmaW5lZCB9IClcbiAgICAgICAgLnRoZW4oIHJlc3BvbnNlID0+IHtcbiAgICAgICAgICAgIGlmKCAhdGhpcy5wYWdpbmF0aW9uICkgcmV0dXJuIFByb21pc2UucmVzb2x2ZSggdGhpcy5kYXRhID0gcmVzcG9uc2UgKVxuXG4gICAgICAgICAgICBpZiggIXRoaXMuZGF0YSApIHRoaXMuZGF0YSA9IFsgXVxuICAgICAgICAgICAgdGhpcy5kYXRhID0gdGhpcy5kYXRhLmNvbmNhdChyZXNwb25zZSlcbiAgICAgICAgICAgIHRoaXMucGFnaW5hdGlvbi5za2lwICs9IHRoaXMucGFnaW5hdGlvbi5saW1pdFxuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShyZXNwb25zZSlcbiAgICAgICAgfSApXG4gICAgfVxuXG59IClcbiIsIm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmNyZWF0ZSgge1xuXG4gICAgRXJyb3I6IHJlcXVpcmUoJy4uLy4uL2xpYi9NeUVycm9yJyksXG4gICAgXG4gICAgVXNlcjogcmVxdWlyZSgnLi9tb2RlbHMvVXNlcicpLFxuXG4gICAgVmlld0ZhY3Rvcnk6IHJlcXVpcmUoJy4vZmFjdG9yeS9WaWV3JyksXG4gICAgXG4gICAgVmlld3M6IHJlcXVpcmUoJy4vLlZpZXdNYXAnKSxcblxuICAgIGluaXRpYWxpemUoKSB7XG4gICAgICAgIHRoaXMuY29udGVudENvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNjb250ZW50JylcblxuICAgICAgICB3aW5kb3cub25wb3BzdGF0ZSA9IHRoaXMuaGFuZGxlLmJpbmQodGhpcylcblxuICAgICAgICB0aGlzLmhlYWRlciA9IHRoaXMuVmlld0ZhY3RvcnkuY3JlYXRlKCAnaGVhZGVyJywgeyBpbnNlcnRpb246IHsgdmFsdWU6IHsgZWw6IHRoaXMuY29udGVudENvbnRhaW5lciwgbWV0aG9kOiAnaW5zZXJ0QmVmb3JlJyB9IH0gfSApXG5cbiAgICAgICAgdGhpcy5Vc2VyLmdldCgpLnRoZW4oICgpID0+XG4gICAgICAgIFxuICAgICAgICAgICAgdGhpcy5oZWFkZXIub25Vc2VyKClcbiAgICAgICAgICAgIC5vbiggJ3NpZ25vdXQnLCAoKSA9PiBcbiAgICAgICAgICAgICAgICBQcm9taXNlLmFsbCggT2JqZWN0LmtleXMoIHRoaXMudmlld3MgKS5tYXAoIG5hbWUgPT4gdGhpcy52aWV3c1sgbmFtZSBdLmRlbGV0ZSgpICkgKVxuICAgICAgICAgICAgICAgIC50aGVuKCAoKSA9PiB0aGlzLmhlYWRlci5lbWl0KCAnbmF2aWdhdGUnLCAnLycgKSApXG4gICAgICAgICAgICAgICAgLmNhdGNoKCB0aGlzLkVycm9yIClcbiAgICAgICAgICAgIClcblxuICAgICAgICApXG4gICAgICAgIC5jYXRjaCggdGhpcy5FcnJvciApXG4gICAgICAgIC50aGVuKCAoKSA9PiB0aGlzLmhhbmRsZSgpIClcblxuICAgICAgICByZXR1cm4gdGhpc1xuICAgIH0sXG5cbiAgICBoYW5kbGUoKSB7XG4gICAgICAgIHRoaXMuaGFuZGxlciggd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lLnNwbGl0KCcvJykuc2xpY2UoMSkgKVxuICAgIH0sXG5cbiAgICBoYW5kbGVyKCBwYXRoICkge1xuICAgICAgICBjb25zdCBuYW1lID0gcGF0aFswXSA/IHBhdGhbMF0uY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBwYXRoWzBdLnNsaWNlKDEpIDogJycsXG4gICAgICAgICAgICAgIHZpZXcgPSB0aGlzLlZpZXdzW25hbWVdID8gcGF0aFswXSA6ICdob21lJztcblxuICAgICAgICAoICggdmlldyA9PT0gdGhpcy5jdXJyZW50VmlldyApXG4gICAgICAgICAgICA/IFByb21pc2UucmVzb2x2ZSgpXG4gICAgICAgICAgICA6IFByb21pc2UuYWxsKCBPYmplY3Qua2V5cyggdGhpcy52aWV3cyApLm1hcCggdmlldyA9PiB0aGlzLnZpZXdzWyB2aWV3IF0uaGlkZSgpICkgKSApIFxuICAgICAgICAudGhlbiggKCkgPT4ge1xuXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRWaWV3ID0gdmlld1xuXG4gICAgICAgICAgICBpZiggdGhpcy52aWV3c1sgdmlldyBdICkgcmV0dXJuIHRoaXMudmlld3NbIHZpZXcgXS5uYXZpZ2F0ZSggcGF0aCApXG5cbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoXG4gICAgICAgICAgICAgICAgdGhpcy52aWV3c1sgdmlldyBdID1cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5WaWV3RmFjdG9yeS5jcmVhdGUoIHZpZXcsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGluc2VydGlvbjogeyB2YWx1ZTogeyBlbDogdGhpcy5jb250ZW50Q29udGFpbmVyIH0gfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhdGg6IHsgdmFsdWU6IHBhdGgsIHdyaXRhYmxlOiB0cnVlIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZU9wdHM6IHsgdmFsdWU6IHsgcmVhZE9ubHk6IHRydWUgfSB9XG4gICAgICAgICAgICAgICAgICAgIH0gKVxuICAgICAgICAgICAgKVxuICAgICAgICB9IClcbiAgICAgICAgLmNhdGNoKCB0aGlzLkVycm9yIClcbiAgICB9LFxuXG4gICAgbmF2aWdhdGUoIGxvY2F0aW9uICkge1xuICAgICAgICBoaXN0b3J5LnB1c2hTdGF0ZSgge30sICcnLCBsb2NhdGlvbiApXG4gICAgICAgIHRoaXMuaGFuZGxlKClcbiAgICB9XG5cbn0sIHsgY3VycmVudFZpZXc6IHsgdmFsdWU6ICcnLCB3cml0YWJsZTogdHJ1ZSB9LCB2aWV3czogeyB2YWx1ZTogeyB9IH0gfSApXG4iLCJtb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5hc3NpZ24oIHt9LCByZXF1aXJlKCcuL19fcHJvdG9fXycpLCB7XG5cbiAgICBkZWxldGUoKSB7XG4gICAgICAgIHJldHVybiBQcm9taXNlLmFsbCggT2JqZWN0LmtleXMoIHRoaXMuc3ViVmlld3MgKS5tYXAoIHN1YlZpZXcgPT4gdGhpcy5zdWJWaWV3c1sgc3ViVmlldyBdLmRlbGV0ZSgpICkgKVxuICAgICAgICAudGhlbiggKCkgPT4gcmVxdWlyZSgnLi9fX3Byb3RvX18nKS5kZWxldGUuY2FsbCh0aGlzKSApXG4gICAgfSxcblxuICAgIG5hdmlnYXRlKCBwYXRoICkge1xuICAgICAgICB0aGlzLnBhdGggPSBwYXRoO1xuXG4gICAgICAgIHJldHVybiAoIHBhdGgubGVuZ3RoID09PSAxICYmIHRoaXMuZWxzLmNvbnRhaW5lci5jbGFzc0xpc3QuY29udGFpbnMoJ2hpZGUnKSApXG4gICAgICAgICAgICA/IFByb21pc2UuYWxsKCBPYmplY3Qua2V5cyggdGhpcy5zdWJWaWV3cyApLm1hcCggdmlldyA9PiB0aGlzLnN1YlZpZXdzWyB2aWV3IF0uaGlkZSgpICkgKS50aGVuKCAoKSA9PiB0aGlzLnNob3coKSApLmNhdGNoKCB0aGlzLkVycm9yIClcbiAgICAgICAgICAgIDogKCB0aGlzLnBhdGgubGVuZ3RoID4gMSApXG4gICAgICAgICAgICAgICAgPyAoIHRoaXMuZWxzLmNvbnRhaW5lci5jbGFzc0xpc3QuY29udGFpbnMoJ2hpZGUnKSApXG4gICAgICAgICAgICAgICAgICAgID8gdGhpcy5yZW5kZXJTdWJWaWV3KClcbiAgICAgICAgICAgICAgICAgICAgOiB0aGlzLmhpZGUoKS50aGVuKCAoKSA9PiB0aGlzLnJlbmRlclN1YlZpZXcoKSApXG4gICAgICAgICAgICAgICAgOiBQcm9taXNlLnJlc29sdmUoKVxuICAgIH0sXG5cbiAgICBwb3N0UmVuZGVyKCkge1xuICAgICAgICB0aGlzLnZpZXdzID0geyB9XG4gICAgICAgIHRoaXMuc3ViVmlld3MgPSB7IH1cblxuICAgICAgICBpZiggdGhpcy5wYXRoLmxlbmd0aCA+IDEgKSB7XG4gICAgICAgICAgICB0aGlzLmVscy5jb250YWluZXIuY2xhc3NMaXN0LmFkZCggJ2hpZGUnLCAnaGlkZGVuJyApXG4gICAgICAgICAgICB0aGlzLnJlbmRlclN1YlZpZXcoKVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5vcHRpb25zID0gT2JqZWN0LmNyZWF0ZSggdGhpcy5Nb2RlbCwgeyByZXNvdXJjZTogeyB2YWx1ZTogJ2FkbWluJyB9IH0gKVxuXG4gICAgICAgIHRoaXMub3B0aW9ucy5nZXQoIHsgbWV0aG9kOiAnb3B0aW9ucycgfSApXG4gICAgICAgIC50aGVuKCAoKSA9PlxuICAgICAgICAgICAgdGhpcy5vcHRpb25zLmRhdGEuZm9yRWFjaCggY29sbGVjdGlvbiA9PlxuICAgICAgICAgICAgICAgIHRoaXMudmlld3NbIGNvbGxlY3Rpb24gXSA9IHRoaXMuZmFjdG9yeS5jcmVhdGUoXG4gICAgICAgICAgICAgICAgICAgICdBZG1pbkl0ZW0nLFxuICAgICAgICAgICAgICAgICAgICB7IGluc2VydGlvbjogeyB2YWx1ZTogeyBlbDogdGhpcy5lbHMubGlzdCB9IH0sXG4gICAgICAgICAgICAgICAgICAgICAgbW9kZWw6IHsgdmFsdWU6IHsgZGF0YTogeyBjb2xsZWN0aW9uIH0gfSB9IH1cbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICApXG4gICAgICAgIClcbiAgICAgICAgLmNhdGNoKCB0aGlzLkVycm9yIClcblxuICAgICAgICByZXR1cm4gdGhpc1xuICAgIH0sXG5cbiAgICByZW5kZXJTdWJWaWV3KCkge1xuICAgICAgICBjb25zdCBzdWJWaWV3TmFtZSA9IGAke3RoaXMuY2FwaXRhbGl6ZUZpcnN0TGV0dGVyKHRoaXMucGF0aFsxXSl9UmVzb3VyY2VzYFxuXG4gICAgICAgIHJldHVybiB0aGlzLnN1YlZpZXdzWyBzdWJWaWV3TmFtZSBdXG4gICAgICAgICAgICA/IHRoaXMuc3ViVmlld3NbIHN1YlZpZXdOYW1lIF0ub25OYXZpZ2F0aW9uKCB0aGlzLnBhdGggKVxuICAgICAgICAgICAgOiB0aGlzLnN1YlZpZXdzWyBzdWJWaWV3TmFtZSBdID0gdGhpcy5mYWN0b3J5LmNyZWF0ZSggc3ViVmlld05hbWUsIHsgcGF0aDogeyB2YWx1ZTogdGhpcy5wYXRoLCB3cml0YWJsZTogdHJ1ZSB9LCBpbnNlcnRpb246IHsgdmFsdWU6IHsgZWw6IHRoaXMuZWxzLmNvbnRhaW5lciwgbWV0aG9kOiAnaW5zZXJ0QmVmb3JlJyB9IH0gfSApXG4gICAgfSxcblxuICAgIHJlcXVpcmVzTG9naW46IHRydWVcbn0gKVxuIiwibW9kdWxlLmV4cG9ydHMgPSBPYmplY3QuYXNzaWduKCB7fSwgcmVxdWlyZSgnLi9fX3Byb3RvX18nKSwge1xuXG4gICAgZXZlbnRzOiB7XG4gICAgICAgIGNvbnRhaW5lcjogJ2NsaWNrJ1xuICAgIH0sXG5cbiAgICBvbkNvbnRhaW5lckNsaWNrKCkge1xuICAgICAgICB0aGlzLmVtaXQoICduYXZpZ2F0ZScsIGAvYWRtaW4vJHt0aGlzLm1vZGVsLmRhdGEuY29sbGVjdGlvbn1gIClcbiAgICB9XG59IClcbiIsIm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmFzc2lnbigge30sIHJlcXVpcmUoJy4vX19wcm90b19fJyksIHtcblxuICAgIGV2ZW50czoge1xuICAgICAgICBjYW5jZWw6ICdjbGljaycsXG4gICAgICAgIGNvbmZpcm06ICdjbGljaycsXG4gICAgICAgIGRlbGV0ZTogJ2NsaWNrJyxcbiAgICAgICAgZWRpdDogJ2NsaWNrJyxcbiAgICAgICAgZmFjZWJvb2s6ICdjbGljaycsXG4gICAgICAgIGdvb2dsZTogJ2NsaWNrJyxcbiAgICAgICAgc3RvcmU6ICdjbGljaycsXG4gICAgICAgIHRpdGxlOiAnY2xpY2snLFxuICAgICAgICB0d2l0dGVyOiAnY2xpY2snXG4gICAgfSxcblxuICAgIGdldExpbmsoKSB7XG4gICAgICAgIHJldHVybiBgJHtlbmNvZGVVUklDb21wb25lbnQod2luZG93LmxvY2F0aW9uLm9yaWdpbil9L2NvbWljLyR7dGhpcy5tb2RlbC5kYXRhLl9pZH1gXG4gICAgfSxcblxuICAgIGdldENvbWljKCkge1xuICAgICAgICByZXR1cm4gYCR7d2luZG93LmxvY2F0aW9uLm9yaWdpbn0ke3RoaXMubW9kZWwuZGF0YS5pbWFnZX1gXG4gICAgfSxcblxuICAgIG5hdmlnYXRlKCBwYXRoICkge1xuICAgICAgICB0aGlzLnBhdGggPSBwYXRoXG4gICAgICAgIHRoaXMubW9kZWwucmVzb3VyY2UgPSBgY29taWMvJHt0aGlzLnBhdGhbMV19YFxuXG4gICAgICAgIHRoaXMubW9kZWwuZ2V0KClcbiAgICAgICAgLnRoZW4oIGNvbWljID0+IHtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlKGNvbWljKVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2hvdygpXG4gICAgICAgIH0gKVxuICAgICAgICAuY2F0Y2goIHRoaXMuRXJyb3IgKVxuICAgIH0sXG5cbiAgICBvbkNhbmNlbENsaWNrKCkge1xuICAgICAgICB0aGlzLmVscy5oZWFkZXIuY2xhc3NMaXN0LnJlbW92ZSgnaGlkZGVuJylcbiAgICAgICAgdGhpcy5lbHMuY29uZmlybURpYWxvZy5jbGFzc0xpc3QuYWRkKCdoaWRkZW4nKVxuICAgIH0sXG5cbiAgICBvbkNvbmZpcm1DbGljaygpIHtcbiAgICAgICAgdGhpcy5lbWl0KCdkZWxldGUnKVxuICAgIH0sXG5cbiAgICBvbkRlbGV0ZUNsaWNrKCkge1xuICAgICAgICBpZiggdGhpcy51c2VyICYmIHRoaXMudXNlci5kYXRhLl9pZCApIHtcbiAgICAgICAgICAgIHRoaXMuZWxzLmhlYWRlci5jbGFzc0xpc3QuYWRkKCdoaWRkZW4nKVxuICAgICAgICAgICAgdGhpcy5lbHMuY29uZmlybURpYWxvZy5jbGFzc0xpc3QucmVtb3ZlKCdoaWRkZW4nKVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIG9uRWRpdENsaWNrKCkge1xuICAgICAgICBpZiggdGhpcy51c2VyICYmIHRoaXMudXNlci5kYXRhLl9pZCApIHRoaXMuZW1pdCgnZWRpdCcpXG4gICAgfSxcblxuICAgIG9uRmFjZWJvb2tDbGljaygpIHsgd2luZG93Lm9wZW4oIGBodHRwczovL3d3dy5mYWNlYm9vay5jb20vc2hhcmVyLnBocD91PSR7dGhpcy5nZXRMaW5rKCl9YCApIH0sXG5cbiAgICBvblN0b3JlQ2xpY2soKSB7XG4gICAgICAgIHdpbmRvdy5vcGVuKFxuICAgICAgICAgICAgYGh0dHA6Ly93d3cuemF6emxlLmNvbS9hcGkvY3JlYXRlL2F0LTIzODM1NzQ3MDg4NDY4NTQ2OD9yZj0yMzgzNTc0NzA4ODQ2ODU0NjgmYXg9RGVzaWduQmxhc3Qmc3I9MjUwNzgyNDY5NDAwMDEzNjE2JmNnPTE5NjE2NzA4NTE4NjQyODk2MSZ0X191c2VRcGM9ZmFsc2UmZHM9dHJ1ZSZ0X19zbWFydD10cnVlJmNvbnRpbnVlVXJsPWh0dHAlM0ElMkYlMkZ3d3cuemF6emxlLmNvbSUyRnRpbnloYW5kZWQmZndkPVByb2R1Y3RQYWdlJnRjPSZpYz0mdF9pbWFnZTFfaWlkPSR7ZW5jb2RlVVJJQ29tcG9uZW50KHRoaXMuZ2V0Q29taWMoKSl9YFxuICAgICAgICApXG4gICAgfSxcbiAgICBcbiAgICBvbkdvb2dsZUNsaWNrKCkgeyB3aW5kb3cub3BlbiggYGh0dHBzOi8vcGx1cy5nb29nbGUuY29tL3NoYXJlP3VybD17JHt0aGlzLmdldExpbmsoKX19YCkgfSxcbiAgICBcbiAgICBvblRpdGxlQ2xpY2soKSB7IHRoaXMuZW1pdCggJ25hdmlnYXRlJywgYC9jb21pYy8ke3RoaXMubW9kZWwuZGF0YS5faWR9YCApIH0sXG5cbiAgICBvblR3aXR0ZXJDbGljaygpIHsgd2luZG93Lm9wZW4oIGBodHRwczovL3d3dy50d2l0dGVyLmNvbS9zaGFyZT91cmw9JHt0aGlzLmdldExpbmsoKX0mdmlhPXRpbnloYW5kZWQmdGV4dD0ke2VuY29kZVVSSUNvbXBvbmVudCh0aGlzLm1vZGVsLmRhdGEudGl0bGUpfWAgKSB9LFxuXG4gICAgcG9zdFJlbmRlcigpIHtcbiAgICAgICAgaWYoIHRoaXMubW9kZWwgJiYgdGhpcy5tb2RlbC5kYXRhLl9pZCApIHtcbiAgICAgICAgICAgIGlmKCAhIHRoaXMubW9kZWwuZGF0YS5jb250ZXh0ICkgeyB0aGlzLmVscy5jb250ZXh0LnN0eWxlLmRpc3BsYXkgPSAnbm9uZScgfVxuICAgICAgICAgICAgcmV0dXJuIHRoaXNcbiAgICAgICAgfVxuXG4gICAgICAgIGlmKCB0aGlzLnBhdGgubGVuZ3RoICE9PSAyICkgeyB0aGlzLmVtaXQoICduYXZpZ2F0ZScsICcnICk7IHJldHVybiB0aGlzIH1cblxuICAgICAgICB0aGlzLm1vZGVsID0gT2JqZWN0LmNyZWF0ZSggdGhpcy5Nb2RlbCwgeyByZXNvdXJjZTogeyB2YWx1ZTogYGNvbWljLyR7dGhpcy5wYXRoWzFdfWAsIHdyaXRhYmxlOiB0cnVlIH0gfSApXG4gICAgICAgIHRoaXMubW9kZWwuZ2V0KClcbiAgICAgICAgLnRoZW4oIHRoaXMudXBkYXRlLmJpbmQodGhpcykgKVxuICAgICAgICAuY2F0Y2goIHRoaXMuRXJyb3IgKVxuXG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgfSxcblxuICAgIHVwZGF0ZShjb21pYykge1xuICAgICAgICB0aGlzLm1vZGVsLmRhdGEgPSBjb21pY1xuICAgICAgICB0aGlzLmVscy50aXRsZS50ZXh0Q29udGVudCA9IGNvbWljLnRpdGxlXG4gICAgICAgIHRoaXMuZWxzLnByZUNvbnRleHQudGV4dENvbnRlbnQgPSBjb21pYy5wcmVDb250ZXh0XG4gICAgICAgIHRoaXMuZWxzLnBvc3RDb250ZXh0LnRleHRDb250ZW50ID0gY29taWMucG9zdENvbnRleHRcbiAgICAgICAgdGhpcy5lbHMuaW1hZ2Uuc3JjID0gYCR7Y29taWMuaW1hZ2V9PyR7bmV3IERhdGUoKS5nZXRUaW1lKCl9YFxuXG4gICAgICAgIGlmKCAhIGNvbWljLmNvbnRleHQgKSB7IHRoaXMuZWxzLmNvbnRleHQuc3R5bGUuZGlzcGxheSA9ICdub25lJyB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5lbHMuY29udGV4dC5zcmMgPSBjb21pYy5jb250ZXh0XG4gICAgICAgICAgICB0aGlzLmVscy5jb250ZXh0LnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snXG4gICAgICAgIH1cbiAgICB9XG59IClcbiIsIm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmFzc2lnbigge30sIHJlcXVpcmUoJy4vX19wcm90b19fJyksIHtcblxuICAgIGV2ZW50czoge1xuICAgICAgICBjYW5jZWw6ICdjbGljaycsXG4gICAgICAgIHN1Ym1pdDogJ2NsaWNrJ1xuICAgIH0sXG5cbiAgICBvbkNhbmNlbENsaWNrKCkgeyB0aGlzLmhpZGUoKS50aGVuKCAoKSA9PiB0aGlzLmVtaXQoJ2NhbmNlbGxlZCcpICkgfSxcbiAgICBcbiAgICBvblN1Ym1pdENsaWNrKCkge1xuICAgICAgICB0aGlzWyBgcmVxdWVzdCR7dGhpcy5jYXBpdGFsaXplRmlyc3RMZXR0ZXIoIHRoaXMudHlwZSApfWAgXSgpXG4gICAgICAgIC5jYXRjaCggdGhpcy5FcnJvciApXG4gICAgfSxcblxuICAgIG9uTmF2aWdhdGlvbiggdHlwZSwgY29taWMgKSB7XG4gICAgICAgIHRoaXMudHlwZSA9IHR5cGVcbiAgICAgICAgdGhpcy5tb2RlbC5kYXRhID0gY29taWNcbiAgICAgICBcbiAgICAgICAgdGhpcy5wb3B1bGF0ZSgpIFxuXG4gICAgICAgIGlmKCB0aGlzLmVscy5jb250YWluZXIuY2xhc3NMaXN0LmNvbnRhaW5zKCdoaWRlJykgKSB0aGlzLnNob3coKVxuICAgIH0sXG5cbiAgICBwb3B1bGF0ZSgpIHtcbiAgICAgICAgdGhpcy5lbHMuaGVhZGVyLnRleHRDb250ZW50ID0gYCR7dGhpcy5jYXBpdGFsaXplRmlyc3RMZXR0ZXIoIHRoaXMudHlwZSApfSBDb21pY2BcblxuICAgICAgICBpZiggT2JqZWN0LmtleXMoIHRoaXMubW9kZWwuZGF0YSApLmxlbmd0aCApIHtcbiAgICAgICAgICAgIHRoaXMuZWxzLnRpdGxlLnZhbHVlID0gdGhpcy5tb2RlbC5kYXRhLnRpdGxlIHx8ICcnXG4gICAgICAgICAgICB0aGlzLmVscy5wcmV2aWV3LnNyYyA9IHRoaXMubW9kZWwuZGF0YS5pbWFnZVxuICAgICAgICAgICAgdGhpcy5lbHMuY29udGV4dFByZXZpZXcuc3JjID0gdGhpcy5tb2RlbC5kYXRhLmNvbnRleHRcbiAgICAgICAgICAgIHRoaXMuZWxzLnByZUNvbnRleHQudmFsdWUgPSB0aGlzLm1vZGVsLmRhdGEucHJlQ29udGV4dFxuICAgICAgICAgICAgdGhpcy5lbHMucG9zdENvbnRleHQudmFsdWUgPSB0aGlzLm1vZGVsLmRhdGEucG9zdENvbnRleHRcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuZWxzLnRpdGxlLnZhbHVlID0gJydcbiAgICAgICAgICAgIHRoaXMuZWxzLnByZXZpZXcuc3JjID0gJydcbiAgICAgICAgICAgIHRoaXMuZWxzLnByZUNvbnRleHQudmFsdWUgPSAnJ1xuICAgICAgICAgICAgdGhpcy5lbHMucG9zdENvbnRleHQudmFsdWUgPSAnJ1xuICAgICAgICAgICAgdGhpcy5lbHMuY29udGV4dFByZXZpZXcuc3JjID0gJydcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBwb3N0UmVuZGVyKCkge1xuICAgICAgICB0aGlzLnNwaW5uZXIgPSBuZXcgdGhpcy5TcGlubmVyKCB7XG4gICAgICAgICAgICBjb2xvcjogJyNmZmYnLFxuICAgICAgICAgICAgbGVuZ3RoOiAxNSxcbiAgICAgICAgICAgIHNjYWxlOiAwLjI1LFxuICAgICAgICAgICAgd2lkdGg6IDVcbiAgICAgICAgfSApLnNwaW4oKVxuXG4gICAgICAgIHRoaXMucG9wdWxhdGUoKVxuXG4gICAgICAgIHRoaXMuZWxzLmltYWdlLmFkZEV2ZW50TGlzdGVuZXIoICdjaGFuZ2UnLCBlID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGJhc2U2NFJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCksXG4gICAgICAgICAgICAgICAgICBiaW5hcnlSZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHRoaXMuZWxzLnVwbG9hZC5jbGFzc0xpc3QuYWRkKCdoYXMtc3Bpbm5lcicpXG4gICAgICAgICAgICB0aGlzLmVscy51cGxvYWQuYXBwZW5kQ2hpbGQoIHRoaXMuc3Bpbm5lci5zcGluKCkuZWwgKVxuXG4gICAgICAgICAgICBiYXNlNjRSZWFkZXIub25sb2FkID0gKCBldnQgKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5lbHMudXBsb2FkLmNsYXNzTGlzdC5yZW1vdmUoJ2hhcy1zcGlubmVyJylcbiAgICAgICAgICAgICAgICB0aGlzLnNwaW5uZXIuc3RvcCgpXG4gICAgICAgICAgICAgICAgdGhpcy5lbHMucHJldmlldy5zcmMgPSBldnQudGFyZ2V0LnJlc3VsdCBcbiAgICAgICAgICAgICAgICBiaW5hcnlSZWFkZXIub25sb2FkID0gZXZlbnQgPT4gdGhpcy5iaW5hcnlGaWxlID0gZXZlbnQudGFyZ2V0LnJlc3VsdFxuICAgICAgICAgICAgICAgIGJpbmFyeVJlYWRlci5yZWFkQXNBcnJheUJ1ZmZlciggZS50YXJnZXQuZmlsZXNbMF0gKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBiYXNlNjRSZWFkZXIucmVhZEFzRGF0YVVSTCggZS50YXJnZXQuZmlsZXNbMF0gKVxuICAgICAgICB9IClcblxuICAgICAgICB0aGlzLmVscy5jb250ZXh0LmFkZEV2ZW50TGlzdGVuZXIoICdjaGFuZ2UnLCBlID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGJhc2U2NFJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCksXG4gICAgICAgICAgICAgICAgICBiaW5hcnlSZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHRoaXMuZWxzLmNvbnRleHRVcGxvYWQuY2xhc3NMaXN0LmFkZCgnaGFzLXNwaW5uZXInKVxuICAgICAgICAgICAgdGhpcy5lbHMuY29udGV4dFVwbG9hZC5hcHBlbmRDaGlsZCggdGhpcy5zcGlubmVyLnNwaW4oKS5lbCApXG5cbiAgICAgICAgICAgIGJhc2U2NFJlYWRlci5vbmxvYWQgPSAoIGV2dCApID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmVscy51cGxvYWQuY2xhc3NMaXN0LnJlbW92ZSgnaGFzLXNwaW5uZXInKVxuICAgICAgICAgICAgICAgIHRoaXMuc3Bpbm5lci5zdG9wKClcbiAgICAgICAgICAgICAgICB0aGlzLmVscy5jb250ZXh0UHJldmlldy5zcmMgPSBldnQudGFyZ2V0LnJlc3VsdCBcbiAgICAgICAgICAgICAgICBiaW5hcnlSZWFkZXIub25sb2FkID0gZXZlbnQgPT4gdGhpcy5iaW5hcnlDb250ZXh0ID0gZXZlbnQudGFyZ2V0LnJlc3VsdFxuICAgICAgICAgICAgICAgIGJpbmFyeVJlYWRlci5yZWFkQXNBcnJheUJ1ZmZlciggZS50YXJnZXQuZmlsZXNbMF0gKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBiYXNlNjRSZWFkZXIucmVhZEFzRGF0YVVSTCggZS50YXJnZXQuZmlsZXNbMF0gKVxuICAgICAgICB9IClcbiAgICAgICAgICAgIFxuICAgICAgICByZXR1cm4gdGhpc1xuICAgIH0sXG5cbiAgICByZXF1ZXN0QWRkKCkge1xuICAgICAgICBpZiggIXRoaXMuYmluYXJ5RmlsZSApIHJldHVybiBQcm9taXNlLnJlc29sdmUoKVxuXG4gICAgICAgIGxldCB1cGxvYWRzID0gWyB0aGlzLlhociggeyBtZXRob2Q6ICdQT1NUJywgcmVzb3VyY2U6ICdmaWxlJywgZGF0YTogdGhpcy5iaW5hcnlGaWxlLCBoZWFkZXJzOiB7IGNvbnRlbnRUeXBlOiAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJyB9IH0gKSBdXG5cbiAgICAgICAgaWYoIHRoaXMuYmluYXJ5Q29udGV4dCApIHVwbG9hZHMucHVzaCggdGhpcy5YaHIoIHsgbWV0aG9kOiAnUE9TVCcsIHJlc291cmNlOiAnZmlsZScsIGRhdGE6IHRoaXMuYmluYXJ5Q29udGV4dCwgaGVhZGVyczogeyBjb250ZW50VHlwZTogJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbScgfSB9ICkgKVxuXG4gICAgICAgIHJldHVybiBQcm9taXNlLmFsbCggdXBsb2FkcyApXG4gICAgICAgIC50aGVuKCAoIFsgY29taWNSZXNwb25zZSwgY29udGV4dFJlc3BvbnNlIF0gKSA9PlxuICAgICAgICAgICAgdGhpcy5YaHIoIHtcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgICAgICAgICByZXNvdXJjZTogJ2NvbWljJyxcbiAgICAgICAgICAgICAgICBkYXRhOiBKU09OLnN0cmluZ2lmeSgge1xuICAgICAgICAgICAgICAgICAgICB0aXRsZTogdGhpcy5lbHMudGl0bGUudmFsdWUsXG4gICAgICAgICAgICAgICAgICAgIGltYWdlOiBjb21pY1Jlc3BvbnNlLnBhdGgsXG4gICAgICAgICAgICAgICAgICAgIHByZUNvbnRleHQ6IHRoaXMuZWxzLnByZUNvbnRleHQudmFsdWUsXG4gICAgICAgICAgICAgICAgICAgIGNvbnRleHQ6IGNvbnRleHRSZXNwb25zZSA/IGNvbnRleHRSZXNwb25zZS5wYXRoIDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgICAgICBwb3N0Q29udGV4dDogdGhpcy5lbHMucG9zdENvbnRleHQudmFsdWUsXG4gICAgICAgICAgICAgICAgICAgIGNyZWF0ZWQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKVxuICAgICAgICAgICAgICAgIH0gKVxuICAgICAgICAgICAgfSApXG4gICAgICAgIClcbiAgICAgICAgLnRoZW4oIHJlc3BvbnNlID0+IHRoaXMuaGlkZSgpLnRoZW4oICgpID0+IHRoaXMuZW1pdCggJ2FkZGVkJywgcmVzcG9uc2UgKSApIClcbiAgICB9LFxuXG4gICAgcmVxdWVzdEVkaXQoKSB7XG4gICAgICAgIGxldCBkYXRhID0geyB0aXRsZTogdGhpcy5lbHMudGl0bGUudmFsdWUgfVxuICAgICAgICBcbiAgICAgICAgcmV0dXJuICggKCB0aGlzLmJpbmFyeUZpbGUgKVxuICAgICAgICAgICAgPyB0aGlzLlhociggeyBtZXRob2Q6ICdQQVRDSCcsIHJlc291cmNlOiBgZmlsZS8ke3RoaXMubW9kZWwuZGF0YS5pbWFnZS5zcGxpdCgnLycpWzRdfWAsIGRhdGE6IHRoaXMuYmluYXJ5RmlsZSwgaGVhZGVyczogeyBjb250ZW50VHlwZTogJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbScgfSB9IClcbiAgICAgICAgICAgIDogUHJvbWlzZS5yZXNvbHZlKCkgKVxuICAgICAgICAudGhlbiggKCkgPT4gdGhpcy5YaHIoIHsgbWV0aG9kOiAnUEFUQ0gnLCByZXNvdXJjZTogYGNvbWljLyR7dGhpcy5tb2RlbC5kYXRhLl9pZH1gLCBkYXRhOiBKU09OLnN0cmluZ2lmeSggZGF0YSApIH0gKSApXG4gICAgICAgIC50aGVuKCByZXNwb25zZSA9PiB0aGlzLmhpZGUoKS50aGVuKCAoKSA9PiB0aGlzLmVtaXQoICdlZGl0ZWQnLCByZXNwb25zZSApICkgKVxuICAgIH1cbn0gKVxuIiwibW9kdWxlLmV4cG9ydHMgPSBPYmplY3QuYXNzaWduKCB7fSwgcmVxdWlyZSgnLi9fX3Byb3RvX18nKSwge1xuXG4gICAgY3JlYXRlQ29taWNWaWV3KCBjb21pYywgb3B0cz17fSApIHtcbiAgICAgICAgdGhpcy52aWV3c1sgY29taWMuX2lkIF0gPSB0aGlzLmZhY3RvcnkuY3JlYXRlKFxuICAgICAgICAgICAgJ0NvbWljJyxcbiAgICAgICAgICAgIHsgaW5zZXJ0aW9uOiBvcHRzLmluc2VydGlvbiB8fCB7IHZhbHVlOiB7IGVsOiB0aGlzLmVscy5saXN0IH0gfSxcbiAgICAgICAgICAgICAgbW9kZWw6IHsgdmFsdWU6IHsgZGF0YTogY29taWMgfSB9XG4gICAgICAgICAgICB9XG4gICAgICAgIClcblxuICAgICAgICB0aGlzLnZpZXdzWyBjb21pYy5faWQgXVxuICAgICAgICAub24oICdlZGl0JywgKCkgPT4gdGhpcy5lbWl0KCAnbmF2aWdhdGUnLCBgL2FkbWluL2NvbWljL2VkaXQvJHtjb21pYy5faWR9YCkgKVxuICAgICAgICAub24oICdkZWxldGUnLCAoKSA9PlxuICAgICAgICAgICAgdGhpcy5YaHIoIHsgbWV0aG9kOiAnZGVsZXRlJywgcmVzb3VyY2U6IGBjb21pYy8ke2NvbWljLl9pZH1gIH0gKVxuICAgICAgICAgICAgLnRoZW4oICgpID0+IHRoaXMudmlld3NbIGNvbWljLl9pZCBdLmRlbGV0ZSgpIClcbiAgICAgICAgICAgIC5jYXRjaCggdGhpcy5FcnJvciApXG4gICAgICAgIClcbiAgICB9LFxuXG4gICAgZGVsZXRlKCkge1xuICAgICAgICByZXR1cm4gKCAoIHRoaXMudmlld3MuQ29taWNNYW5hZ2UgKVxuICAgICAgICAgICAgPyB0aGlzLnZpZXdzLkNvbWljTWFuYWdlLmRlbGV0ZSgpXG4gICAgICAgICAgICA6IFByb21pc2UucmVzb2x2ZSgpIClcbiAgICAgICAgLnRoZW4oICgpID0+IHJlcXVpcmUoJy4vX19wcm90b19fJykuZGVsZXRlLmNhbGwodGhpcykgKVxuICAgIH0sXG5cbiAgICBldmVudHM6IHtcbiAgICAgICAgYWRkQnRuOiAnY2xpY2snXG4gICAgfSxcblxuICAgIGZldGNoQW5kRGlzcGxheSgpIHtcbiAgICAgICAgdGhpcy5mZXRjaGluZyA9IHRydWVcbiAgICAgICAgcmV0dXJuIHRoaXMuY29taWNzLmdldCgpXG4gICAgICAgIC50aGVuKCByZXNwb25zZSA9PiB7XG4gICAgICAgICAgICByZXNwb25zZS5mb3JFYWNoKCBjb21pYyA9PiB0aGlzLmNyZWF0ZUNvbWljVmlldyhjb21pYykgKVxuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh0aGlzLmZldGNoaW5nID0gZmFsc2UgKVxuICAgICAgICB9IClcbiAgICB9LFxuXG4gICAgbWFuYWdlQ29taWMoIHR5cGUsIGNvbWljICkge1xuICAgICAgICB0aGlzLnZpZXdzLkNvbWljTWFuYWdlIFxuICAgICAgICAgICAgPyB0aGlzLnZpZXdzLkNvbWljTWFuYWdlLm9uTmF2aWdhdGlvbiggdHlwZSwgY29taWMgKVxuICAgICAgICAgICAgOiB0aGlzLnZpZXdzLkNvbWljTWFuYWdlID1cbiAgICAgICAgICAgICAgICB0aGlzLmZhY3RvcnkuY3JlYXRlKCAnQ29taWNNYW5hZ2UnLCB7IHR5cGU6IHsgdmFsdWU6IHR5cGUsIHdyaXRhYmxlOiB0cnVlIH0sIG1vZGVsOiB7IHZhbHVlOiB7IGRhdGE6IGNvbWljIHx8IHt9IH0gfSwgaW5zZXJ0aW9uOiB7IHZhbHVlOiB7IGVsOiB0aGlzLmVscy5jb250YWluZXIsIG1ldGhvZDogJ2luc2VydEJlZm9yZScgfSB9IH0gKVxuICAgICAgICAgICAgICAgIC5vbiggJ2FkZGVkJywgY29taWMgPT4geyB0aGlzLmNyZWF0ZUNvbWljVmlldyhjb21pYywgeyBpbnNlcnRpb246IHsgdmFsdWU6IHsgZWw6IHRoaXMuZWxzLmxpc3QuZmlyc3RDaGlsZCwgbWV0aG9kOiAnaW5zZXJ0QmVmb3JlJyB9IH0gfSApOyB0aGlzLmVtaXQoICduYXZpZ2F0ZScsIGAvYWRtaW4vY29taWNgICk7IH0gKVxuICAgICAgICAgICAgICAgIC5vbiggJ2NhbmNlbGxlZCcsICgpID0+IHRoaXMuZW1pdCggJ25hdmlnYXRlJywgYC9hZG1pbi9jb21pY2AgKSApXG4gICAgICAgICAgICAgICAgLm9uKCAnZWRpdGVkJywgY29taWMgPT4geyB0aGlzLnZpZXdzWyBjb21pYy5faWQgXS51cGRhdGUoIGNvbWljICk7IHRoaXMuZW1pdCggJ25hdmlnYXRlJywgYC9hZG1pbi9jb21pY2AgKTsgfSApXG4gICAgfSxcblxuICAgIG9uQWRkQnRuQ2xpY2soKSB7IHRoaXMuZW1pdCggJ25hdmlnYXRlJywgYC9hZG1pbi9jb21pYy9hZGRgICkgfSxcblxuICAgIG9uTmF2aWdhdGlvbiggcGF0aCApIHtcbiAgICAgICAgdGhpcy5wYXRoID0gcGF0aDtcblxuICAgICAgICAoIHBhdGgubGVuZ3RoID09PSAyICYmIHRoaXMuZWxzLmNvbnRhaW5lci5jbGFzc0xpc3QuY29udGFpbnMoJ2hpZGUnKSApIFxuICAgICAgICAgICAgPyB0aGlzLnZpZXdzLkNvbWljTWFuYWdlICYmICF0aGlzLnZpZXdzLkNvbWljTWFuYWdlLmVscy5jb250YWluZXIuY2xhc3NMaXN0LmNvbnRhaW5zKCdoaWRlJylcbiAgICAgICAgICAgICAgICA/IHRoaXMudmlld3MuQ29taWNNYW5hZ2UuaGlkZSgpLnRoZW4oICgpID0+IHRoaXMuc2hvdygpIClcbiAgICAgICAgICAgICAgICA6IHRoaXMuc2hvdygpXG4gICAgICAgICAgICA6IHBhdGgubGVuZ3RoID09PSAzXG4gICAgICAgICAgICAgICAgPyB0aGlzLmhpZGUoKS50aGVuKCAoKSA9PiB0aGlzLm1hbmFnZUNvbWljKCBwYXRoWzJdLCB7IH0gKSApXG4gICAgICAgICAgICAgICAgOiBwYXRoLmxlbmd0aCA9PT0gNFxuICAgICAgICAgICAgICAgICAgICAgPyB0aGlzLmhpZGUoKS50aGVuKCAoKSA9PiB0aGlzLm1hbmFnZUNvbWljKCBwYXRoWzJdLCB0aGlzLnZpZXdzWyBwYXRoWzNdIF0ubW9kZWwuZGF0YSApIClcbiAgICAgICAgICAgICAgICAgICAgIDogdW5kZWZpbmVkXG4gICAgfSxcblxuICAgIG9uU2Nyb2xsKCBlICkge1xuICAgICAgICBpZiggdGhpcy5mZXRjaGluZyB8fCB0aGlzLmlzSGlkZGVuKCkgKSByZXR1cm5cbiAgICAgICAgaWYoICggdGhpcy5jb250ZW50Lm9mZnNldEhlaWdodCAtICggd2luZG93LnNjcm9sbFkgKyB3aW5kb3cuaW5uZXJIZWlnaHQgKSApIDwgMTAwICkgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSggdGhpcy5mZXRjaEFuZERpc3BsYXkuYmluZCh0aGlzKS5jYXRjaCggdGhpcy5FcnJvciApIClcbiAgICB9LFxuXG4gICAgcG9zdFJlbmRlcigpIHtcbiAgICAgICAgdGhpcy5jb250ZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2NvbnRlbnQnKVxuXG4gICAgICAgIGlmKCB0aGlzLnBhdGgubGVuZ3RoID4gMiApIHtcbiAgICAgICAgICAgIHRoaXMuZWxzLmNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCAnaGlkZGVuJywgJ2hpZGUnIClcbiAgICAgICAgICAgIGlmKCB0aGlzLnBhdGhbMl0gPT09IFwiYWRkXCIgKSB7IHRoaXMubWFuYWdlQ29taWMoIFwiYWRkXCIsIHsgfSApIH1cbiAgICAgICAgICAgIGVsc2UgaWYoIHRoaXMucGF0aFsyXSA9PT0gXCJlZGl0XCIgJiYgdGhpcy5wYXRoWzNdICkge1xuICAgICAgICAgICAgICAgIHRoaXMuWGhyKCB7IG1ldGhvZDogXCJnZXRcIiwgcmVzb3VyY2U6IGBjb21pYy8ke3RoaXMucGF0aFszXX1gIH0gKVxuICAgICAgICAgICAgICAgIC50aGVuKCByZXNwb25zZSA9PiB0aGlzLm1hbmFnZUNvbWljKCBcImVkaXRcIiwgcmVzcG9uc2UgKSApXG4gICAgICAgICAgICAgICAgLmNhdGNoKCBlID0+IHsgdGhpcy5FcnJvcihlKTsgdGhpcy5lbWl0KCAnbmF2aWdhdGUnLCBgL2FkbWluL2NvbWljYCApIH0gKVxuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYoIHRoaXMucGF0aC5sZW5ndGggPT09IDEgJiYgdGhpcy52aWV3cy5Db21pY01hbmFnZSApIHtcbiAgICAgICAgICAgIHRoaXMudmlld3MuQ29taWNNYW5hZ2UuaGlkZSgpXG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmNvbWljcyA9IE9iamVjdC5jcmVhdGUoIHRoaXMuTW9kZWwsIHsgcGFnaW5hdGlvbjogeyB2YWx1ZTogeyBza2lwOiAwLCBsaW1pdDoxMCwgc29ydDogeyBjcmVhdGVkOiAtMSB9IH0gfSwgcmVzb3VyY2U6IHsgdmFsdWU6ICdjb21pYycgfSB9IClcbiAgICAgICAgXG4gICAgICAgIHRoaXMuZmV0Y2hBbmREaXNwbGF5KCkuY2F0Y2goIHRoaXMuRXJyb3IgKVxuXG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCAnc2Nyb2xsJywgZSA9PiB0aGlzLm9uU2Nyb2xsKGUpIClcblxuICAgICAgICByZXR1cm4gdGhpc1xuICAgIH0sXG5cbiAgICByZXF1aXJlc0xvZ2luOiB0cnVlXG59IClcbiIsIm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmFzc2lnbigge30sIHJlcXVpcmUoJy4vX19wcm90b19fJyksIHtcblxuICAgIGV2ZW50czoge1xuICAgICAgICBsb2dvOiAnY2xpY2snXG4gICAgfSxcblxuICAgIG9uVXNlcigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICB9LFxuXG4gICAgb25Mb2dvQ2xpY2soKSB7XG4gICAgICAgIHRoaXMuc2lnbm91dCgpXG4gICAgfSxcblxuICAgIHJlcXVpcmVzTG9naW46IGZhbHNlLFxuICAgIFxuICAgIHNpZ25vdXQoKSB7XG5cbiAgICAgICAgZG9jdW1lbnQuY29va2llID0gYCR7d2luZG93LmNvb2tpZU5hbWV9PTsgZXhwaXJlcz1UaHUsIDAxIEphbiAxOTcwIDAwOjAwOjAxIEdNVDtgO1xuXG4gICAgICAgIHRoaXMudXNlci5kYXRhID0geyB9XG5cbiAgICAgICAgdGhpcy5lbWl0KCAnc2lnbm91dCcgKVxuXG4gICAgfVxuXG59IClcbiIsIm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmFzc2lnbigge30sIHJlcXVpcmUoJy4vX19wcm90b19fJyksIHtcblxuICAgIGZldGNoQW5kRGlzcGxheSgpIHtcbiAgICAgICAgdGhpcy5mZXRjaGluZyA9IHRydWVcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0RGF0YSgpXG4gICAgICAgIC50aGVuKCByZXNwb25zZSA9PiB7XG4gICAgICAgICAgICByZXNwb25zZS5mb3JFYWNoKCBjb21pYyA9PlxuICAgICAgICAgICAgICAgIHRoaXMudmlld3NbIGNvbWljLl9pZCBdID1cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5mYWN0b3J5LmNyZWF0ZSggJ2NvbWljJywgeyBpbnNlcnRpb246IHsgdmFsdWU6IHsgZWw6IHRoaXMuZWxzLmNvbnRhaW5lciB9IH0sIG1vZGVsOiB7IHZhbHVlOiB7IGRhdGE6IGNvbWljIH0gfSwgdGVtcGxhdGVPcHRzOiB7IHZhbHVlOiB7IHJlYWRPbmx5OiB0cnVlIH0gfSB9IClcbiAgICAgICAgICAgIClcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodGhpcy5mZXRjaGluZyA9IGZhbHNlIClcbiAgICAgICAgfSApXG4gICAgfSxcblxuICAgIGdldERhdGEoKSB7XG4gICAgICAgIGlmKCAhdGhpcy5tb2RlbCApIHRoaXMubW9kZWwgPSBPYmplY3QuY3JlYXRlKCB0aGlzLk1vZGVsLCB7IHBhZ2luYXRpb246IHsgdmFsdWU6IHsgc2tpcDogMCwgbGltaXQ6MTAsIHNvcnQ6IHsgY3JlYXRlZDogLTEgfSB9IH0sIHJlc291cmNlOiB7IHZhbHVlOiAnY29taWMnIH0gfSApXG5cbiAgICAgICAgcmV0dXJuIHRoaXMubW9kZWwuZ2V0KClcbiAgICB9LFxuXG4gICAgbmF2aWdhdGUoKSB7XG4gICAgICAgIHRoaXMuc2hvdygpXG4gICAgfSxcblxuICAgIG9uU2Nyb2xsKCBlICkge1xuICAgICAgICBpZiggdGhpcy5mZXRjaGluZyApIHJldHVyblxuICAgICAgICBpZiggKCB0aGlzLmNvbnRlbnQub2Zmc2V0SGVpZ2h0IC0gKCB3aW5kb3cuc2Nyb2xsWSArIHdpbmRvdy5pbm5lckhlaWdodCApICkgPCAxMDAgKSB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCB0aGlzLmZldGNoQW5kRGlzcGxheS5iaW5kKHRoaXMpIClcbiAgICB9LFxuXG4gICAgcG9zdFJlbmRlcigpIHtcbiAgICAgICAgdGhpcy5jb250ZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2NvbnRlbnQnKVxuICAgICAgICBcbiAgICAgICAgdGhpcy5mZXRjaEFuZERpc3BsYXkoKS5jYXRjaCggdGhpcy5FcnJvciApXG5cbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoICdzY3JvbGwnLCBlID0+IHRoaXMub25TY3JvbGwoZSkgKVxuXG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgfVxuXG59IClcbiIsIm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmFzc2lnbigge30sIHJlcXVpcmUoJy4vX19wcm90b19fJyksIHtcbiAgICBcbiAgICBldmVudHM6IHtcbiAgICAgICAgc3VibWl0OiAnY2xpY2snXG4gICAgfSxcblxuICAgIG9uU3VibWl0Q2xpY2soKSB7XG4gICAgICAgIHRoaXMuWGhyKCB7IG1ldGhvZDogJ3Bvc3QnLCByZXNvdXJjZTogJ2F1dGgnLCBkYXRhOiBKU09OLnN0cmluZ2lmeSggeyB1c2VybmFtZTogdGhpcy5lbHMudXNlcm5hbWUudmFsdWUsIHBhc3N3b3JkOiB0aGlzLmVscy5wYXNzd29yZC52YWx1ZSB9ICkgfSApXG4gICAgICAgIC50aGVuKCAoKSA9PiB0aGlzLnVzZXIuZ2V0KCkgKVxuICAgICAgICAudGhlbiggKCkgPT4gdGhpcy5oaWRlKCkgKVxuICAgICAgICAudGhlbiggKCkgPT4gUHJvbWlzZS5yZXNvbHZlKCB0aGlzLmVtaXQoICdsb2dnZWRJbicgKSkgKVxuICAgICAgICAuY2F0Y2goIHRoaXMuRXJyb3IgKVxuICAgIH1cbn0gKVxuIiwibW9kdWxlLmV4cG9ydHMgPSBPYmplY3QuYXNzaWduKCB7fSwgcmVxdWlyZSgnLi9fX3Byb3RvX18nKSwge1xuXG4gICAgZXZlbnRzOiB7XG4gICAgICAgIGNhbmNlbDogJ2NsaWNrJyxcbiAgICAgICAgY29uZmlybTogJ2NsaWNrJyxcbiAgICAgICAgZGVsZXRlOiAnY2xpY2snLFxuICAgICAgICBlZGl0OiAnY2xpY2snXG4gICAgfSxcblxuICAgIG9uQ2FuY2VsQ2xpY2soKSB7XG4gICAgICAgIHRoaXMuZWxzLnVzZXJuYW1lLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGRlbicpXG4gICAgICAgIHRoaXMuZWxzLmNvbmZpcm1EaWFsb2cuY2xhc3NMaXN0LmFkZCgnaGlkZGVuJylcbiAgICB9LFxuXG4gICAgb25Db25maXJtQ2xpY2soKSB7XG4gICAgICAgIHRoaXMuZW1pdCgnZGVsZXRlJylcbiAgICB9LFxuXG4gICAgb25EZWxldGVDbGljaygpIHtcbiAgICAgICAgaWYoIHRoaXMudXNlciAmJiB0aGlzLnVzZXIuZGF0YS5faWQgKSB7XG4gICAgICAgICAgICB0aGlzLmVscy51c2VybmFtZS5jbGFzc0xpc3QuYWRkKCdoaWRkZW4nKVxuICAgICAgICAgICAgdGhpcy5lbHMuY29uZmlybURpYWxvZy5jbGFzc0xpc3QucmVtb3ZlKCdoaWRkZW4nKVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIG9uRWRpdENsaWNrKCkge1xuICAgICAgICBpZiggdGhpcy51c2VyICYmIHRoaXMudXNlci5kYXRhLl9pZCApIHRoaXMuZW1pdCgnZWRpdCcpXG4gICAgfSxcblxuICAgIHVwZGF0ZSh1c2VyKSB7XG4gICAgICAgIHRoaXMudXNlci5kYXRhID0gdXNlclxuICAgICAgICB0aGlzLmVscy51c2VybmFtZS50ZXh0Q29udGVudCA9IHVzZXIudXNlcm5hbWVcbiAgICB9XG5cbn0gKVxuIiwibW9kdWxlLmV4cG9ydHMgPSBPYmplY3QuYXNzaWduKCB7fSwgcmVxdWlyZSgnLi9fX3Byb3RvX18nKSwge1xuXG4gICAgZXZlbnRzOiB7XG4gICAgICAgIGNhbmNlbDogJ2NsaWNrJyxcbiAgICAgICAgc3VibWl0OiAnY2xpY2snXG4gICAgfSxcblxuICAgIG9uQ2FuY2VsQ2xpY2soKSB7IHRoaXMuaGlkZSgpLnRoZW4oICgpID0+IHRoaXMuZW1pdCgnY2FuY2VsbGVkJykgKSB9LFxuICAgIFxuICAgIG9uU3VibWl0Q2xpY2soKSB7XG4gICAgICAgIHRoaXNbIGByZXF1ZXN0JHt0aGlzLmNhcGl0YWxpemVGaXJzdExldHRlciggdGhpcy50eXBlICl9YCBdKClcbiAgICAgICAgLmNhdGNoKCB0aGlzLkVycm9yIClcbiAgICB9LFxuXG4gICAgb25OYXZpZ2F0aW9uKCB0eXBlLCBjb21pYyApIHtcbiAgICAgICAgdGhpcy50eXBlID0gdHlwZVxuICAgICAgICB0aGlzLm1vZGVsLmRhdGEgPSBjb21pY1xuICAgICAgIFxuICAgICAgICB0aGlzLnBvcHVsYXRlKCkgXG4gICAgICAgIFxuICAgICAgICBpZiggdGhpcy5lbHMuY29udGFpbmVyLmNsYXNzTGlzdC5jb250YWlucygnaGlkZScpICkgdGhpcy5zaG93KClcbiAgICB9LFxuXG4gICAgcG9wdWxhdGUoKSB7XG4gICAgICAgIHRoaXMuZWxzLnRpdGxlLnRleHRDb250ZW50ID0gYCR7dGhpcy5jYXBpdGFsaXplRmlyc3RMZXR0ZXIoIHRoaXMudHlwZSApfSBVc2VyYFxuXG4gICAgICAgIHRoaXMuZWxzLnVzZXJuYW1lLnZhbHVlID0gT2JqZWN0LmtleXMoIHRoaXMubW9kZWwuZGF0YSApLmxlbmd0aCA/IHRoaXMubW9kZWwuZGF0YS51c2VybmFtZSA6ICcnXG4gICAgICAgIHRoaXMuZWxzLnBhc3N3b3JkLnZhbHVlID0gJydcbiAgICB9LFxuXG4gICAgcG9zdFJlbmRlcigpIHtcbiAgICAgICAgdGhpcy5wb3B1bGF0ZSgpIFxuICAgICAgICAgICAgXG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgfSxcblxuICAgIHJlcXVlc3RBZGQoKSB7XG4gICAgICAgIGlmKCB0aGlzLmVscy5wYXNzd29yZC52YWx1ZS5sZW5ndGggPT09IDAgKSByZXR1cm5cbiAgICAgICAgcmV0dXJuIHRoaXMuWGhyKCB7IG1ldGhvZDogJ1BPU1QnLCByZXNvdXJjZTogJ3VzZXInLCBkYXRhOiBKU09OLnN0cmluZ2lmeSggeyB1c2VybmFtZTogdGhpcy5lbHMudXNlcm5hbWUudmFsdWUsIHBhc3N3b3JkOiB0aGlzLmVscy5wYXNzd29yZC52YWx1ZSB9ICkgfSApXG4gICAgICAgIC50aGVuKCByZXNwb25zZSA9PiB0aGlzLmhpZGUoKS50aGVuKCAoKSA9PiB0aGlzLmVtaXQoICdhZGRlZCcsIHsgX2lkOiByZXNwb25zZS5faWQsIHVzZXJuYW1lOiByZXNwb25zZS51c2VybmFtZSB9ICkgKSApXG4gICAgfSxcblxuICAgIHJlcXVlc3RFZGl0KCkge1xuICAgICAgICBsZXQgZGF0YSA9IHsgdXNlcm5hbWU6IHRoaXMuZWxzLnVzZXJuYW1lLnZhbHVlIH1cblxuICAgICAgICBpZiggdGhpcy5lbHMucGFzc3dvcmQudmFsdWUubGVuZ3RoICkgZGF0YS5wYXNzd29yZCA9IHRoaXMuZWxzLnBhc3N3b3JkLnZhbHVlXG4gICAgICAgIHJldHVybiB0aGlzLlhociggeyBtZXRob2Q6ICdQQVRDSCcsIHJlc291cmNlOiBgdXNlci8ke3RoaXMudXNlci5kYXRhLl9pZH1gLCBkYXRhOiBKU09OLnN0cmluZ2lmeSggZGF0YSApIH0gKVxuICAgICAgICAudGhlbiggcmVzcG9uc2UgPT4gdGhpcy5oaWRlKCkudGhlbiggKCkgPT4gdGhpcy5lbWl0KCAnZWRpdGVkJywgeyBfaWQ6IHJlc3BvbnNlLl9pZCwgdXNlcm5hbWU6IHJlc3BvbnNlLnVzZXJuYW1lIH0gKSApIClcbiAgICB9XG59IClcbiIsIm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmFzc2lnbigge30sIHJlcXVpcmUoJy4vX19wcm90b19fJyksIHtcblxuICAgIGNyZWF0ZVVzZXJWaWV3KCB1c2VyICkge1xuICAgICAgICB0aGlzLnZpZXdzWyB1c2VyLl9pZCBdID0gdGhpcy5mYWN0b3J5LmNyZWF0ZShcbiAgICAgICAgICAgICdVc2VyJyxcbiAgICAgICAgICAgIHsgaW5zZXJ0aW9uOiB7IHZhbHVlOiB7IGVsOiB0aGlzLmVscy5saXN0IH0gfSxcbiAgICAgICAgICAgICAgbW9kZWw6IHsgdmFsdWU6IHsgZGF0YTogdXNlciB9IH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgKVxuXG4gICAgICAgIHRoaXMudmlld3NbIHVzZXIuX2lkIF1cbiAgICAgICAgLm9uKCAnZWRpdCcsICgpID0+IHRoaXMuZW1pdCggJ25hdmlnYXRlJywgYC9hZG1pbi91c2VyL2VkaXQvJHt1c2VyLl9pZH1gKSApXG4gICAgICAgIC5vbiggJ2RlbGV0ZScsICgpID0+XG4gICAgICAgICAgICB0aGlzLlhociggeyBtZXRob2Q6ICdkZWxldGUnLCByZXNvdXJjZTogYHVzZXIvJHt1c2VyLl9pZH1gIH0gKVxuICAgICAgICAgICAgLnRoZW4oICgpID0+IHRoaXMudmlld3NbIHVzZXIuX2lkIF0uZGVsZXRlKCkgKVxuICAgICAgICAgICAgLmNhdGNoKCB0aGlzLkVycm9yIClcbiAgICAgICAgKVxuICAgIH0sXG5cbiAgICBkZWxldGUoKSB7XG4gICAgICAgIHJldHVybiAoICggdGhpcy52aWV3cy5Vc2VyTWFuYWdlIClcbiAgICAgICAgICAgID8gdGhpcy52aWV3cy5Vc2VyTWFuYWdlLmRlbGV0ZSgpXG4gICAgICAgICAgICA6IFByb21pc2UucmVzb2x2ZSgpIClcbiAgICAgICAgLnRoZW4oICgpID0+IHJlcXVpcmUoJy4vX19wcm90b19fJykuZGVsZXRlLmNhbGwodGhpcykgKVxuICAgIH0sXG5cbiAgICBldmVudHM6IHtcbiAgICAgICAgYWRkQnRuOiAnY2xpY2snXG4gICAgfSxcblxuICAgIG1hbmFnZVVzZXIoIHR5cGUsIHVzZXIgKSB7XG4gICAgICAgIHRoaXMudmlld3MuVXNlck1hbmFnZSBcbiAgICAgICAgICAgID8gdGhpcy52aWV3cy5Vc2VyTWFuYWdlLm9uTmF2aWdhdGlvbiggdHlwZSwgdXNlciApXG4gICAgICAgICAgICA6IHRoaXMudmlld3MuVXNlck1hbmFnZSA9XG4gICAgICAgICAgICAgICAgdGhpcy5mYWN0b3J5LmNyZWF0ZSggJ1VzZXJNYW5hZ2UnLCB7IHR5cGU6IHsgdmFsdWU6IHR5cGUsIHdyaXRhYmxlOiB0cnVlIH0sIG1vZGVsOiB7IHZhbHVlOiB7IGRhdGE6IHVzZXIgfHwge30gfSB9LCBpbnNlcnRpb246IHsgdmFsdWU6IHsgZWw6IHRoaXMuZWxzLmNvbnRhaW5lciwgbWV0aG9kOiAnaW5zZXJ0QmVmb3JlJyB9IH0gfSApXG4gICAgICAgICAgICAgICAgICAgIC5vbiggJ2FkZGVkJywgdXNlciA9PiB7IHRoaXMuY3JlYXRlVXNlclZpZXcodXNlcik7IHRoaXMuZW1pdCggJ25hdmlnYXRlJywgYC9hZG1pbi91c2VyYCApOyB9IClcbiAgICAgICAgICAgICAgICAgICAgLm9uKCAnZWRpdGVkJywgdXNlciA9PiB7IHRoaXMudmlld3NbIHVzZXIuX2lkIF0udXBkYXRlKCB1c2VyICk7IHRoaXMuZW1pdCggJ25hdmlnYXRlJywgYC9hZG1pbi91c2VyYCApOyB9IClcbiAgICAgICAgICAgICAgICAgICAgLm9uKCAnY2FuY2VsbGVkJywgKCkgPT4gdGhpcy5lbWl0KCAnbmF2aWdhdGUnLCBgL2FkbWluL3VzZXJgICkgKVxuICAgIH0sXG5cbiAgICBvbkFkZEJ0bkNsaWNrKCkgeyB0aGlzLmVtaXQoICduYXZpZ2F0ZScsIGAvYWRtaW4vdXNlci9hZGRgICkgfSxcblxuICAgIG9uTmF2aWdhdGlvbiggcGF0aCApIHtcbiAgICAgICAgdGhpcy5wYXRoID0gcGF0aDtcblxuICAgICAgICAoIHBhdGgubGVuZ3RoID09PSAyICYmIHRoaXMuZWxzLmNvbnRhaW5lci5jbGFzc0xpc3QuY29udGFpbnMoJ2hpZGUnKSApIFxuICAgICAgICAgICAgPyB0aGlzLnZpZXdzLlVzZXJNYW5hZ2UgJiYgIXRoaXMudmlld3MuVXNlck1hbmFnZS5lbHMuY29udGFpbmVyLmNsYXNzTGlzdC5jb250YWlucygnaGlkZScpXG4gICAgICAgICAgICAgICAgPyB0aGlzLnZpZXdzLlVzZXJNYW5hZ2UuaGlkZSgpLnRoZW4oICgpID0+IHRoaXMuc2hvdygpIClcbiAgICAgICAgICAgICAgICA6IHRoaXMuc2hvdygpXG4gICAgICAgICAgICA6IHBhdGgubGVuZ3RoID09PSAzXG4gICAgICAgICAgICAgICAgPyB0aGlzLmhpZGUoKS50aGVuKCAoKSA9PiB0aGlzLm1hbmFnZVVzZXIoIHBhdGhbMl0sIHsgfSApIClcbiAgICAgICAgICAgICAgICA6IHBhdGgubGVuZ3RoID09PSA0XG4gICAgICAgICAgICAgICAgICAgICA/IHRoaXMuaGlkZSgpLnRoZW4oICgpID0+IHRoaXMubWFuYWdlVXNlciggcGF0aFsyXSwgdGhpcy52aWV3c1sgcGF0aFszXSBdLm1vZGVsLmRhdGEgKSApXG4gICAgICAgICAgICAgICAgICAgICA6IHVuZGVmaW5lZFxuICAgIH0sXG5cbiAgICBwb3N0UmVuZGVyKCkge1xuXG4gICAgICAgIGlmKCB0aGlzLnBhdGgubGVuZ3RoID4gMiApIHtcbiAgICAgICAgICAgIHRoaXMuZWxzLmNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCAnaGlkZGVuJywgJ2hpZGUnIClcbiAgICAgICAgICAgIGlmKCB0aGlzLnBhdGhbMl0gPT09IFwiYWRkXCIgKSB7IHRoaXMubWFuYWdlVXNlciggXCJhZGRcIiwgeyB9ICkgfVxuICAgICAgICAgICAgZWxzZSBpZiggdGhpcy5wYXRoWzJdID09PSBcImVkaXRcIiAmJiB0aGlzLnBhdGhbM10gKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5YaHIoIHsgbWV0aG9kOiBcImdldFwiLCByZXNvdXJjZTogYHVzZXIvJHt0aGlzLnBhdGhbM119YCB9IClcbiAgICAgICAgICAgICAgICAudGhlbiggcmVzcG9uc2UgPT4gdGhpcy5tYW5hZ2VVc2VyKCBcImVkaXRcIiwgcmVzcG9uc2UgKSApXG4gICAgICAgICAgICAgICAgLmNhdGNoKCBlID0+IHsgdGhpcy5FcnJvcihlKTsgdGhpcy5lbWl0KCAnbmF2aWdhdGUnLCBgL2FkbWluL3VzZXJgICkgfSApXG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiggdGhpcy5wYXRoLmxlbmd0aCA9PT0gMSAmJiB0aGlzLnZpZXdzLlVzZXJNYW5hZ2UgKSB7XG4gICAgICAgICAgICB0aGlzLnZpZXdzLlVzZXJNYW5hZ2UuaGlkZSgpXG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnVzZXJzID0gT2JqZWN0LmNyZWF0ZSggdGhpcy5Nb2RlbCwgeyByZXNvdXJjZTogeyB2YWx1ZTogJ3VzZXInIH0gfSApXG5cbiAgICAgICAgdGhpcy51c2Vycy5nZXQoKVxuICAgICAgICAudGhlbiggKCkgPT4gUHJvbWlzZS5yZXNvbHZlKCB0aGlzLnVzZXJzLmRhdGEuZm9yRWFjaCggdXNlciA9PiB0aGlzLmNyZWF0ZVVzZXJWaWV3KCB1c2VyICkgKSApIClcbiAgICAgICAgLmNhdGNoKCB0aGlzLkVycm9yIClcblxuICAgICAgICByZXR1cm4gdGhpc1xuICAgIH0sXG5cbiAgICByZXF1aXJlc0xvZ2luOiB0cnVlXG59IClcbiIsIm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmFzc2lnbiggeyB9LCByZXF1aXJlKCcuLi8uLi8uLi9saWIvTXlPYmplY3QnKSwgcmVxdWlyZSgnZXZlbnRzJykuRXZlbnRFbWl0dGVyLnByb3RvdHlwZSwge1xuXG4gICAgTW9kZWw6IHJlcXVpcmUoJy4uL21vZGVscy9fX3Byb3RvX18uanMnKSxcblxuICAgIE9wdGltaXplZFJlc2l6ZTogcmVxdWlyZSgnLi9saWIvT3B0aW1pemVkUmVzaXplJyksXG4gICAgXG4gICAgU3Bpbm5lcjogcmVxdWlyZSgnLi9saWIvU3BpbicpLFxuICAgIFxuICAgIFhocjogcmVxdWlyZSgnLi4vWGhyJyksXG5cbiAgICBiaW5kRXZlbnQoIGtleSwgZXZlbnQgKSB7XG4gICAgICAgIHZhciBlbHMgPSBBcnJheS5pc0FycmF5KCB0aGlzLmVsc1sga2V5IF0gKSA/IHRoaXMuZWxzWyBrZXkgXSA6IFsgdGhpcy5lbHNbIGtleSBdIF1cbiAgICAgICAgZWxzLmZvckVhY2goIGVsID0+IGVsLmFkZEV2ZW50TGlzdGVuZXIoIGV2ZW50IHx8ICdjbGljaycsIGUgPT4gdGhpc1sgYG9uJHt0aGlzLmNhcGl0YWxpemVGaXJzdExldHRlcihrZXkpfSR7dGhpcy5jYXBpdGFsaXplRmlyc3RMZXR0ZXIoZXZlbnQpfWAgXSggZSApICkgKVxuICAgIH0sXG5cbiAgICBjYXBpdGFsaXplRmlyc3RMZXR0ZXI6IHN0cmluZyA9PiBzdHJpbmcuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBzdHJpbmcuc2xpY2UoMSksXG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcblxuICAgICAgICBpZiggdGhpcy5zaXplICkgdGhpcy5PcHRpbWl6ZWRSZXNpemUuYWRkKCB0aGlzLnNpemUgKTtcblxuICAgICAgICBpZiggdGhpcy5yZXF1aXJlc0xvZ2luICYmICghdGhpcy51c2VyLmRhdGEgfHwgIXRoaXMudXNlci5kYXRhLl9pZCApICkgcmV0dXJuIHRoaXMuaGFuZGxlTG9naW4oKVxuXG4gICAgICAgIGlmKCB0aGlzLnVzZXIuZGF0YSAmJiB0aGlzLnVzZXIuZGF0YS5pZCAmJiB0aGlzLnJlcXVpcmVzUm9sZSAmJiAhdGhpcy5oYXNQcml2aWxlZ2VzKCkgKSByZXR1cm4gdGhpcy5zaG93Tm9BY2Nlc3MoKVxuICAgICAgICBcbiAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oIHRoaXMsIHsgZWxzOiB7IH0sIHNsdXJwOiB7IGF0dHI6ICdkYXRhLWpzJywgdmlldzogJ2RhdGEtdmlldycgfSwgdmlld3M6IHsgfSB9ICkucmVuZGVyKClcbiAgICB9LFxuXG4gICAgZGVsZWdhdGVFdmVudHMoIGtleSwgZWwgKSB7XG4gICAgICAgIHZhciB0eXBlID0gdHlwZW9mIHRoaXMuZXZlbnRzW2tleV1cblxuICAgICAgICBpZiggdHlwZSA9PT0gXCJzdHJpbmdcIiApIHsgdGhpcy5iaW5kRXZlbnQoIGtleSwgdGhpcy5ldmVudHNba2V5XSApIH1cbiAgICAgICAgZWxzZSBpZiggQXJyYXkuaXNBcnJheSggdGhpcy5ldmVudHNba2V5XSApICkge1xuICAgICAgICAgICAgdGhpcy5ldmVudHNbIGtleSBdLmZvckVhY2goIGV2ZW50T2JqID0+IHRoaXMuYmluZEV2ZW50KCBrZXksIGV2ZW50T2JqLmV2ZW50ICkgKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5iaW5kRXZlbnQoIGtleSwgdGhpcy5ldmVudHNba2V5XS5ldmVudCApXG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgZGVsZXRlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5oaWRlKClcbiAgICAgICAgLnRoZW4oICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZWxzLmNvbnRhaW5lci5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKCB0aGlzLmVscy5jb250YWluZXIgKVxuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSggdGhpcy5lbWl0KCdkZWxldGVkJykgKVxuICAgICAgICB9IClcbiAgICB9LFxuXG4gICAgZXZlbnRzOiB7fSxcblxuICAgIGdldERhdGEoKSB7XG4gICAgICAgIGlmKCAhdGhpcy5tb2RlbCApIHRoaXMubW9kZWwgPSBPYmplY3QuY3JlYXRlKCB0aGlzLk1vZGVsLCB7IHJlc291cmNlOiB7IHZhbHVlOiB0aGlzLm5hbWUgfSB9IClcblxuICAgICAgICByZXR1cm4gdGhpcy5tb2RlbC5nZXQoKVxuICAgIH0sXG5cbiAgICBnZXRUZW1wbGF0ZU9wdGlvbnMoKSB7XG4gICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKFxuICAgICAgICAgICAge30sXG4gICAgICAgICAgICAodGhpcy5tb2RlbCkgPyB0aGlzLm1vZGVsLmRhdGEgOiB7fSAsXG4gICAgICAgICAgICB7IHVzZXI6ICh0aGlzLnVzZXIpID8gdGhpcy51c2VyLmRhdGEgOiB7fSB9LFxuICAgICAgICAgICAgeyBvcHRzOiAodGhpcy50ZW1wbGF0ZU9wdHMpID8gdGhpcy50ZW1wbGF0ZU9wdHMgOiB7fSB9XG4gICAgICAgIClcbiAgICB9LFxuXG4gICAgaGFuZGxlTG9naW4oKSB7XG4gICAgICAgIHRoaXMuZmFjdG9yeS5jcmVhdGUoICdsb2dpbicsIHsgaW5zZXJ0aW9uOiB7IHZhbHVlOiB7IGVsOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjY29udGVudCcpIH0gfSB9IClcbiAgICAgICAgICAgIC5vbmNlKCBcImxvZ2dlZEluXCIsICgpID0+IHRoaXMub25Mb2dpbigpIClcblxuICAgICAgICByZXR1cm4gdGhpc1xuICAgIH0sXG5cbiAgICBoYXNQcml2aWxlZ2UoKSB7XG4gICAgICAgICggdGhpcy5yZXF1aXJlc1JvbGUgJiYgKCB0aGlzLnVzZXIuZ2V0KCdyb2xlcycpLmZpbmQoIHJvbGUgPT4gcm9sZSA9PT0gdGhpcy5yZXF1aXJlc1JvbGUgKSA9PT0gXCJ1bmRlZmluZWRcIiApICkgPyBmYWxzZSA6IHRydWVcbiAgICB9LFxuXG4gICAgaGlkZSgpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKCByZXNvbHZlID0+IHtcbiAgICAgICAgICAgIGlmKCAhZG9jdW1lbnQuYm9keS5jb250YWlucyh0aGlzLmVscy5jb250YWluZXIpIHx8IHRoaXMuaXNIaWRkZW4oKSApIHJldHVybiByZXNvbHZlKClcbiAgICAgICAgICAgIHRoaXMub25IaWRkZW5Qcm94eSA9IGUgPT4gdGhpcy5vbkhpZGRlbihyZXNvbHZlKVxuICAgICAgICAgICAgdGhpcy5lbHMuY29udGFpbmVyLmFkZEV2ZW50TGlzdGVuZXIoICd0cmFuc2l0aW9uZW5kJywgdGhpcy5vbkhpZGRlblByb3h5IClcbiAgICAgICAgICAgIHRoaXMuZWxzLmNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCdoaWRlJylcbiAgICAgICAgfSApXG4gICAgfSxcblxuICAgIGh0bWxUb0ZyYWdtZW50KCBzdHIgKSB7XG4gICAgICAgIGxldCByYW5nZSA9IGRvY3VtZW50LmNyZWF0ZVJhbmdlKCk7XG4gICAgICAgIC8vIG1ha2UgdGhlIHBhcmVudCBvZiB0aGUgZmlyc3QgZGl2IGluIHRoZSBkb2N1bWVudCBiZWNvbWVzIHRoZSBjb250ZXh0IG5vZGVcbiAgICAgICAgcmFuZ2Uuc2VsZWN0Tm9kZShkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcImRpdlwiKS5pdGVtKDApKVxuICAgICAgICByZXR1cm4gcmFuZ2UuY3JlYXRlQ29udGV4dHVhbEZyYWdtZW50KCBzdHIgKVxuICAgIH0sXG4gICAgXG4gICAgaXNIaWRkZW4oKSB7IHJldHVybiB0aGlzLmVscy5jb250YWluZXIuY2xhc3NMaXN0LmNvbnRhaW5zKCdoaWRkZW4nKSB9LFxuXG4gICAgb25IaWRkZW4oIHJlc29sdmUgKSB7XG4gICAgICAgIHRoaXMuZWxzLmNvbnRhaW5lci5yZW1vdmVFdmVudExpc3RlbmVyKCAndHJhbnNpdGlvbmVuZCcsIHRoaXMub25IaWRkZW5Qcm94eSApXG4gICAgICAgIHRoaXMuZWxzLmNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCdoaWRkZW4nKVxuICAgICAgICByZXNvbHZlKCB0aGlzLmVtaXQoJ2hpZGRlbicpIClcbiAgICB9LFxuXG4gICAgb25Mb2dpbigpIHtcbiAgICAgICAgT2JqZWN0LmFzc2lnbiggdGhpcywgeyBlbHM6IHsgfSwgc2x1cnA6IHsgYXR0cjogJ2RhdGEtanMnLCB2aWV3OiAnZGF0YS12aWV3JyB9LCB2aWV3czogeyB9IH0gKS5yZW5kZXIoKVxuICAgIH0sXG5cbiAgICBvblNob3duKCByZXNvbHZlICkge1xuICAgICAgICB0aGlzLmVscy5jb250YWluZXIucmVtb3ZlRXZlbnRMaXN0ZW5lciggJ3RyYW5zaXRpb25lbmQnLCB0aGlzLm9uU2hvd25Qcm94eSApXG4gICAgICAgIGlmKCB0aGlzLnNpemUgKSB0aGlzLnNpemUoKVxuICAgICAgICByZXNvbHZlKCB0aGlzLmVtaXQoJ3Nob3duJykgKVxuICAgIH0sXG5cbiAgICBzaG93Tm9BY2Nlc3MoKSB7XG4gICAgICAgIGFsZXJ0KFwiTm8gcHJpdmlsZWdlcywgc29uXCIpXG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgfSxcblxuICAgIHBvc3RSZW5kZXIoKSB7IHJldHVybiB0aGlzIH0sXG5cbiAgICByZW5kZXIoKSB7XG4gICAgICAgIHRoaXMuc2x1cnBUZW1wbGF0ZSggeyB0ZW1wbGF0ZTogdGhpcy50ZW1wbGF0ZSggdGhpcy5nZXRUZW1wbGF0ZU9wdGlvbnMoKSApLCBpbnNlcnRpb246IHRoaXMuaW5zZXJ0aW9uIH0gKVxuXG4gICAgICAgIGlmKCB0aGlzLnNpemUgKSB0aGlzLnNpemUoKVxuXG4gICAgICAgIHJldHVybiB0aGlzLnJlbmRlclN1YnZpZXdzKClcbiAgICAgICAgICAgICAgICAgICAucG9zdFJlbmRlcigpXG4gICAgfSxcblxuICAgIHJlbmRlclN1YnZpZXdzKCkge1xuICAgICAgICBPYmplY3Qua2V5cyggdGhpcy5WaWV3cyB8fCBbIF0gKS5mb3JFYWNoKCBrZXkgPT4ge1xuICAgICAgICAgICAgaWYoIHRoaXMuVmlld3NbIGtleSBdLmVsICkge1xuICAgICAgICAgICAgICAgIGxldCBvcHRzID0gdGhpcy5WaWV3c1sga2V5IF0ub3B0c1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIG9wdHMgPSAoIG9wdHMgKVxuICAgICAgICAgICAgICAgICAgICA/IHR5cGVvZiBvcHRzID09PSBcIm9iamVjdFwiXG4gICAgICAgICAgICAgICAgICAgICAgICA/IG9wdHNcbiAgICAgICAgICAgICAgICAgICAgICAgIDogb3B0cygpXG4gICAgICAgICAgICAgICAgICAgIDoge31cblxuICAgICAgICAgICAgICAgIHRoaXMudmlld3NbIGtleSBdID0gdGhpcy5mYWN0b3J5LmNyZWF0ZSgga2V5LCBPYmplY3QuYXNzaWduKCB7IGluc2VydGlvbjogeyB2YWx1ZTogeyBlbDogdGhpcy5WaWV3c1sga2V5IF0uZWwsIG1ldGhvZDogJ2luc2VydEJlZm9yZScgfSB9IH0sIG9wdHMgKSApXG4gICAgICAgICAgICAgICAgdGhpcy5WaWV3c1sga2V5IF0uZWwucmVtb3ZlKClcbiAgICAgICAgICAgICAgICB0aGlzLlZpZXdzWyBrZXkgXS5lbCA9IHVuZGVmaW5lZFxuICAgICAgICAgICAgfVxuICAgICAgICB9IClcblxuICAgICAgICByZXR1cm4gdGhpc1xuICAgIH0sXG5cbiAgICBzaG93KCBkdXJhdGlvbiApIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKCByZXNvbHZlID0+IHtcbiAgICAgICAgICAgIHRoaXMub25TaG93blByb3h5ID0gZSA9PiB0aGlzLm9uU2hvd24ocmVzb2x2ZSlcbiAgICAgICAgICAgIHRoaXMuZWxzLmNvbnRhaW5lci5hZGRFdmVudExpc3RlbmVyKCAndHJhbnNpdGlvbmVuZCcsIHRoaXMub25TaG93blByb3h5IClcbiAgICAgICAgICAgIHRoaXMuZWxzLmNvbnRhaW5lci5jbGFzc0xpc3QucmVtb3ZlKCAnaGlkZScsICdoaWRkZW4nIClcbiAgICAgICAgfSApXG4gICAgfSxcblxuICAgIHNsdXJwRWwoIGVsICkge1xuICAgICAgICB2YXIga2V5ID0gZWwuZ2V0QXR0cmlidXRlKCB0aGlzLnNsdXJwLmF0dHIgKSB8fCAnY29udGFpbmVyJ1xuXG4gICAgICAgIGlmKCBrZXkgPT09ICdjb250YWluZXInICkgZWwuY2xhc3NMaXN0LmFkZCggdGhpcy5uYW1lIClcblxuICAgICAgICB0aGlzLmVsc1sga2V5IF0gPSBBcnJheS5pc0FycmF5KCB0aGlzLmVsc1sga2V5IF0gKVxuICAgICAgICAgICAgPyB0aGlzLmVsc1sga2V5IF0ucHVzaCggZWwgKVxuICAgICAgICAgICAgOiAoIHRoaXMuZWxzWyBrZXkgXSAhPT0gdW5kZWZpbmVkIClcbiAgICAgICAgICAgICAgICA/IFsgdGhpcy5lbHNbIGtleSBdLCBlbCBdXG4gICAgICAgICAgICAgICAgOiBlbFxuXG4gICAgICAgIGVsLnJlbW92ZUF0dHJpYnV0ZSh0aGlzLnNsdXJwLmF0dHIpXG5cbiAgICAgICAgaWYoIHRoaXMuZXZlbnRzWyBrZXkgXSApIHRoaXMuZGVsZWdhdGVFdmVudHMoIGtleSwgZWwgKVxuICAgIH0sXG5cbiAgICBzbHVycFRlbXBsYXRlKCBvcHRpb25zICkge1xuICAgICAgICB2YXIgZnJhZ21lbnQgPSB0aGlzLmh0bWxUb0ZyYWdtZW50KCBvcHRpb25zLnRlbXBsYXRlICksXG4gICAgICAgICAgICBzZWxlY3RvciA9IGBbJHt0aGlzLnNsdXJwLmF0dHJ9XWAsXG4gICAgICAgICAgICB2aWV3U2VsZWN0b3IgPSBgWyR7dGhpcy5zbHVycC52aWV3fV1gXG5cbiAgICAgICAgdGhpcy5zbHVycEVsKCBmcmFnbWVudC5xdWVyeVNlbGVjdG9yKCcqJykgKVxuICAgICAgICBmcmFnbWVudC5xdWVyeVNlbGVjdG9yQWxsKCBgJHtzZWxlY3Rvcn0sICR7dmlld1NlbGVjdG9yfWAgKS5mb3JFYWNoKCBlbCA9PlxuICAgICAgICAgICAgKCBlbC5oYXNBdHRyaWJ1dGUoIHRoaXMuc2x1cnAuYXR0ciApICkgXG4gICAgICAgICAgICAgICAgPyB0aGlzLnNsdXJwRWwoIGVsIClcbiAgICAgICAgICAgICAgICA6IHRoaXMuVmlld3NbIGVsLmdldEF0dHJpYnV0ZSh0aGlzLnNsdXJwLnZpZXcpIF0uZWwgPSBlbFxuICAgICAgICApXG4gICAgICAgICAgXG4gICAgICAgIG9wdGlvbnMuaW5zZXJ0aW9uLm1ldGhvZCA9PT0gJ2luc2VydEJlZm9yZSdcbiAgICAgICAgICAgID8gb3B0aW9ucy5pbnNlcnRpb24uZWwucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoIGZyYWdtZW50LCBvcHRpb25zLmluc2VydGlvbi5lbCApXG4gICAgICAgICAgICA6IG9wdGlvbnMuaW5zZXJ0aW9uLmVsWyBvcHRpb25zLmluc2VydGlvbi5tZXRob2QgfHwgJ2FwcGVuZENoaWxkJyBdKCBmcmFnbWVudCApXG5cbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICB9LFxuXG4gICAgaXNNb3VzZU9uRWwoIGV2ZW50LCBlbCApIHtcblxuICAgICAgICB2YXIgZWxPZmZzZXQgPSBlbC5vZmZzZXQoKSxcbiAgICAgICAgICAgIGVsSGVpZ2h0ID0gZWwub3V0ZXJIZWlnaHQoIHRydWUgKSxcbiAgICAgICAgICAgIGVsV2lkdGggPSBlbC5vdXRlcldpZHRoKCB0cnVlIClcblxuICAgICAgICBpZiggKCBldmVudC5wYWdlWCA8IGVsT2Zmc2V0LmxlZnQgKSB8fFxuICAgICAgICAgICAgKCBldmVudC5wYWdlWCA+ICggZWxPZmZzZXQubGVmdCArIGVsV2lkdGggKSApIHx8XG4gICAgICAgICAgICAoIGV2ZW50LnBhZ2VZIDwgZWxPZmZzZXQudG9wICkgfHxcbiAgICAgICAgICAgICggZXZlbnQucGFnZVkgPiAoIGVsT2Zmc2V0LnRvcCArIGVsSGVpZ2h0ICkgKSApIHtcblxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRydWVcbiAgICB9LFxuXG4gICAgcmVxdWlyZXNMb2dpbjogZmFsc2UsXG5cbiAgICAvL19fdG9EbzogaHRtbC5yZXBsYWNlKC8+XFxzKzwvZywnPjwnKVxufSApXG4iLCJtb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5jcmVhdGUoIHtcblxuICAgIGFkZChjYWxsYmFjaykge1xuICAgICAgICBpZiggIXRoaXMuY2FsbGJhY2tzLmxlbmd0aCApIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCB0aGlzLm9uUmVzaXplKVxuICAgICAgICB0aGlzLmNhbGxiYWNrcy5wdXNoKGNhbGxiYWNrKVxuICAgIH0sXG5cbiAgICBvblJlc2l6ZSgpIHtcbiAgICAgICBpZiggdGhpcy5ydW5uaW5nICkgcmV0dXJuXG5cbiAgICAgICAgdGhpcy5ydW5uaW5nID0gdHJ1ZVxuICAgICAgICBcbiAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZVxuICAgICAgICAgICAgPyB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCB0aGlzLnJ1bkNhbGxiYWNrcyApXG4gICAgICAgICAgICA6IHNldFRpbWVvdXQoIHRoaXMucnVuQ2FsbGJhY2tzLCA2NilcbiAgICB9LFxuXG4gICAgcnVuQ2FsbGJhY2tzKCkge1xuICAgICAgICB0aGlzLmNhbGxiYWNrcyA9IHRoaXMuY2FsbGJhY2tzLmZpbHRlciggY2FsbGJhY2sgPT4gY2FsbGJhY2soKSApXG4gICAgICAgIHRoaXMucnVubmluZyA9IGZhbHNlIFxuICAgIH1cblxufSwgeyBjYWxsYmFja3M6IHsgdmFsdWU6IFtdIH0sIHJ1bm5pbmc6IHsgdmFsdWU6IGZhbHNlIH0gfSApLmFkZFxuIiwiLy8gaHR0cDovL3NwaW4uanMub3JnLyN2Mi4zLjJcbiFmdW5jdGlvbihhLGIpe1wib2JqZWN0XCI9PXR5cGVvZiBtb2R1bGUmJm1vZHVsZS5leHBvcnRzP21vZHVsZS5leHBvcnRzPWIoKTpcImZ1bmN0aW9uXCI9PXR5cGVvZiBkZWZpbmUmJmRlZmluZS5hbWQ/ZGVmaW5lKGIpOmEuU3Bpbm5lcj1iKCl9KHRoaXMsZnVuY3Rpb24oKXtcInVzZSBzdHJpY3RcIjtmdW5jdGlvbiBhKGEsYil7dmFyIGMsZD1kb2N1bWVudC5jcmVhdGVFbGVtZW50KGF8fFwiZGl2XCIpO2ZvcihjIGluIGIpZFtjXT1iW2NdO3JldHVybiBkfWZ1bmN0aW9uIGIoYSl7Zm9yKHZhciBiPTEsYz1hcmd1bWVudHMubGVuZ3RoO2M+YjtiKyspYS5hcHBlbmRDaGlsZChhcmd1bWVudHNbYl0pO3JldHVybiBhfWZ1bmN0aW9uIGMoYSxiLGMsZCl7dmFyIGU9W1wib3BhY2l0eVwiLGIsfn4oMTAwKmEpLGMsZF0uam9pbihcIi1cIiksZj0uMDErYy9kKjEwMCxnPU1hdGgubWF4KDEtKDEtYSkvYiooMTAwLWYpLGEpLGg9ai5zdWJzdHJpbmcoMCxqLmluZGV4T2YoXCJBbmltYXRpb25cIikpLnRvTG93ZXJDYXNlKCksaT1oJiZcIi1cIitoK1wiLVwifHxcIlwiO3JldHVybiBtW2VdfHwoay5pbnNlcnRSdWxlKFwiQFwiK2krXCJrZXlmcmFtZXMgXCIrZStcInswJXtvcGFjaXR5OlwiK2crXCJ9XCIrZitcIiV7b3BhY2l0eTpcIithK1wifVwiKyhmKy4wMSkrXCIle29wYWNpdHk6MX1cIisoZitiKSUxMDArXCIle29wYWNpdHk6XCIrYStcIn0xMDAle29wYWNpdHk6XCIrZytcIn19XCIsay5jc3NSdWxlcy5sZW5ndGgpLG1bZV09MSksZX1mdW5jdGlvbiBkKGEsYil7dmFyIGMsZCxlPWEuc3R5bGU7aWYoYj1iLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpK2Iuc2xpY2UoMSksdm9pZCAwIT09ZVtiXSlyZXR1cm4gYjtmb3IoZD0wO2Q8bC5sZW5ndGg7ZCsrKWlmKGM9bFtkXStiLHZvaWQgMCE9PWVbY10pcmV0dXJuIGN9ZnVuY3Rpb24gZShhLGIpe2Zvcih2YXIgYyBpbiBiKWEuc3R5bGVbZChhLGMpfHxjXT1iW2NdO3JldHVybiBhfWZ1bmN0aW9uIGYoYSl7Zm9yKHZhciBiPTE7Yjxhcmd1bWVudHMubGVuZ3RoO2IrKyl7dmFyIGM9YXJndW1lbnRzW2JdO2Zvcih2YXIgZCBpbiBjKXZvaWQgMD09PWFbZF0mJihhW2RdPWNbZF0pfXJldHVybiBhfWZ1bmN0aW9uIGcoYSxiKXtyZXR1cm5cInN0cmluZ1wiPT10eXBlb2YgYT9hOmFbYiVhLmxlbmd0aF19ZnVuY3Rpb24gaChhKXt0aGlzLm9wdHM9ZihhfHx7fSxoLmRlZmF1bHRzLG4pfWZ1bmN0aW9uIGkoKXtmdW5jdGlvbiBjKGIsYyl7cmV0dXJuIGEoXCI8XCIrYisnIHhtbG5zPVwidXJuOnNjaGVtYXMtbWljcm9zb2Z0LmNvbTp2bWxcIiBjbGFzcz1cInNwaW4tdm1sXCI+JyxjKX1rLmFkZFJ1bGUoXCIuc3Bpbi12bWxcIixcImJlaGF2aW9yOnVybCgjZGVmYXVsdCNWTUwpXCIpLGgucHJvdG90eXBlLmxpbmVzPWZ1bmN0aW9uKGEsZCl7ZnVuY3Rpb24gZigpe3JldHVybiBlKGMoXCJncm91cFwiLHtjb29yZHNpemU6aytcIiBcIitrLGNvb3Jkb3JpZ2luOi1qK1wiIFwiKy1qfSkse3dpZHRoOmssaGVpZ2h0Omt9KX1mdW5jdGlvbiBoKGEsaCxpKXtiKG0sYihlKGYoKSx7cm90YXRpb246MzYwL2QubGluZXMqYStcImRlZ1wiLGxlZnQ6fn5ofSksYihlKGMoXCJyb3VuZHJlY3RcIix7YXJjc2l6ZTpkLmNvcm5lcnN9KSx7d2lkdGg6aixoZWlnaHQ6ZC5zY2FsZSpkLndpZHRoLGxlZnQ6ZC5zY2FsZSpkLnJhZGl1cyx0b3A6LWQuc2NhbGUqZC53aWR0aD4+MSxmaWx0ZXI6aX0pLGMoXCJmaWxsXCIse2NvbG9yOmcoZC5jb2xvcixhKSxvcGFjaXR5OmQub3BhY2l0eX0pLGMoXCJzdHJva2VcIix7b3BhY2l0eTowfSkpKSl9dmFyIGksaj1kLnNjYWxlKihkLmxlbmd0aCtkLndpZHRoKSxrPTIqZC5zY2FsZSpqLGw9LShkLndpZHRoK2QubGVuZ3RoKSpkLnNjYWxlKjIrXCJweFwiLG09ZShmKCkse3Bvc2l0aW9uOlwiYWJzb2x1dGVcIix0b3A6bCxsZWZ0Omx9KTtpZihkLnNoYWRvdylmb3IoaT0xO2k8PWQubGluZXM7aSsrKWgoaSwtMixcInByb2dpZDpEWEltYWdlVHJhbnNmb3JtLk1pY3Jvc29mdC5CbHVyKHBpeGVscmFkaXVzPTIsbWFrZXNoYWRvdz0xLHNoYWRvd29wYWNpdHk9LjMpXCIpO2ZvcihpPTE7aTw9ZC5saW5lcztpKyspaChpKTtyZXR1cm4gYihhLG0pfSxoLnByb3RvdHlwZS5vcGFjaXR5PWZ1bmN0aW9uKGEsYixjLGQpe3ZhciBlPWEuZmlyc3RDaGlsZDtkPWQuc2hhZG93JiZkLmxpbmVzfHwwLGUmJmIrZDxlLmNoaWxkTm9kZXMubGVuZ3RoJiYoZT1lLmNoaWxkTm9kZXNbYitkXSxlPWUmJmUuZmlyc3RDaGlsZCxlPWUmJmUuZmlyc3RDaGlsZCxlJiYoZS5vcGFjaXR5PWMpKX19dmFyIGosayxsPVtcIndlYmtpdFwiLFwiTW96XCIsXCJtc1wiLFwiT1wiXSxtPXt9LG49e2xpbmVzOjEyLGxlbmd0aDo3LHdpZHRoOjUscmFkaXVzOjEwLHNjYWxlOjEsY29ybmVyczoxLGNvbG9yOlwiIzAwMFwiLG9wYWNpdHk6LjI1LHJvdGF0ZTowLGRpcmVjdGlvbjoxLHNwZWVkOjEsdHJhaWw6MTAwLGZwczoyMCx6SW5kZXg6MmU5LGNsYXNzTmFtZTpcInNwaW5uZXJcIix0b3A6XCI1MCVcIixsZWZ0OlwiNTAlXCIsc2hhZG93OiExLGh3YWNjZWw6ITEscG9zaXRpb246XCJhYnNvbHV0ZVwifTtpZihoLmRlZmF1bHRzPXt9LGYoaC5wcm90b3R5cGUse3NwaW46ZnVuY3Rpb24oYil7dGhpcy5zdG9wKCk7dmFyIGM9dGhpcyxkPWMub3B0cyxmPWMuZWw9YShudWxsLHtjbGFzc05hbWU6ZC5jbGFzc05hbWV9KTtpZihlKGYse3Bvc2l0aW9uOmQucG9zaXRpb24sd2lkdGg6MCx6SW5kZXg6ZC56SW5kZXgsbGVmdDpkLmxlZnQsdG9wOmQudG9wfSksYiYmYi5pbnNlcnRCZWZvcmUoZixiLmZpcnN0Q2hpbGR8fG51bGwpLGYuc2V0QXR0cmlidXRlKFwicm9sZVwiLFwicHJvZ3Jlc3NiYXJcIiksYy5saW5lcyhmLGMub3B0cyksIWope3ZhciBnLGg9MCxpPShkLmxpbmVzLTEpKigxLWQuZGlyZWN0aW9uKS8yLGs9ZC5mcHMsbD1rL2Quc3BlZWQsbT0oMS1kLm9wYWNpdHkpLyhsKmQudHJhaWwvMTAwKSxuPWwvZC5saW5lczshZnVuY3Rpb24gbygpe2grKztmb3IodmFyIGE9MDthPGQubGluZXM7YSsrKWc9TWF0aC5tYXgoMS0oaCsoZC5saW5lcy1hKSpuKSVsKm0sZC5vcGFjaXR5KSxjLm9wYWNpdHkoZixhKmQuZGlyZWN0aW9uK2ksZyxkKTtjLnRpbWVvdXQ9Yy5lbCYmc2V0VGltZW91dChvLH5+KDFlMy9rKSl9KCl9cmV0dXJuIGN9LHN0b3A6ZnVuY3Rpb24oKXt2YXIgYT10aGlzLmVsO3JldHVybiBhJiYoY2xlYXJUaW1lb3V0KHRoaXMudGltZW91dCksYS5wYXJlbnROb2RlJiZhLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoYSksdGhpcy5lbD12b2lkIDApLHRoaXN9LGxpbmVzOmZ1bmN0aW9uKGQsZil7ZnVuY3Rpb24gaChiLGMpe3JldHVybiBlKGEoKSx7cG9zaXRpb246XCJhYnNvbHV0ZVwiLHdpZHRoOmYuc2NhbGUqKGYubGVuZ3RoK2Yud2lkdGgpK1wicHhcIixoZWlnaHQ6Zi5zY2FsZSpmLndpZHRoK1wicHhcIixiYWNrZ3JvdW5kOmIsYm94U2hhZG93OmMsdHJhbnNmb3JtT3JpZ2luOlwibGVmdFwiLHRyYW5zZm9ybTpcInJvdGF0ZShcIit+figzNjAvZi5saW5lcyprK2Yucm90YXRlKStcImRlZykgdHJhbnNsYXRlKFwiK2Yuc2NhbGUqZi5yYWRpdXMrXCJweCwwKVwiLGJvcmRlclJhZGl1czooZi5jb3JuZXJzKmYuc2NhbGUqZi53aWR0aD4+MSkrXCJweFwifSl9Zm9yKHZhciBpLGs9MCxsPShmLmxpbmVzLTEpKigxLWYuZGlyZWN0aW9uKS8yO2s8Zi5saW5lcztrKyspaT1lKGEoKSx7cG9zaXRpb246XCJhYnNvbHV0ZVwiLHRvcDoxK34oZi5zY2FsZSpmLndpZHRoLzIpK1wicHhcIix0cmFuc2Zvcm06Zi5od2FjY2VsP1widHJhbnNsYXRlM2QoMCwwLDApXCI6XCJcIixvcGFjaXR5OmYub3BhY2l0eSxhbmltYXRpb246aiYmYyhmLm9wYWNpdHksZi50cmFpbCxsK2sqZi5kaXJlY3Rpb24sZi5saW5lcykrXCIgXCIrMS9mLnNwZWVkK1wicyBsaW5lYXIgaW5maW5pdGVcIn0pLGYuc2hhZG93JiZiKGksZShoKFwiIzAwMFwiLFwiMCAwIDRweCAjMDAwXCIpLHt0b3A6XCIycHhcIn0pKSxiKGQsYihpLGgoZyhmLmNvbG9yLGspLFwiMCAwIDFweCByZ2JhKDAsMCwwLC4xKVwiKSkpO3JldHVybiBkfSxvcGFjaXR5OmZ1bmN0aW9uKGEsYixjKXtiPGEuY2hpbGROb2Rlcy5sZW5ndGgmJihhLmNoaWxkTm9kZXNbYl0uc3R5bGUub3BhY2l0eT1jKX19KSxcInVuZGVmaW5lZFwiIT10eXBlb2YgZG9jdW1lbnQpe2s9ZnVuY3Rpb24oKXt2YXIgYz1hKFwic3R5bGVcIix7dHlwZTpcInRleHQvY3NzXCJ9KTtyZXR1cm4gYihkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcImhlYWRcIilbMF0sYyksYy5zaGVldHx8Yy5zdHlsZVNoZWV0fSgpO3ZhciBvPWUoYShcImdyb3VwXCIpLHtiZWhhdmlvcjpcInVybCgjZGVmYXVsdCNWTUwpXCJ9KTshZChvLFwidHJhbnNmb3JtXCIpJiZvLmFkaj9pKCk6aj1kKG8sXCJhbmltYXRpb25cIil9cmV0dXJuIGh9KTsiLCJtb2R1bGUuZXhwb3J0cyA9IHAgPT4gXG5gPGRpdj5cbjxkaXY+QWRtaW48L2Rpdj5cbjxkaXYgZGF0YS1qcz1cImxpc3RcIj48L2Rpdj5cbjwvZGl2PmBcbiIsIm1vZHVsZS5leHBvcnRzID0gcCA9PiBgPGRpdj4ke3AuY29sbGVjdGlvbn08L2Rpdj5gXG4iLCJtb2R1bGUuZXhwb3J0cyA9IHAgPT4ge1xucmV0dXJuIGA8ZGl2PlxuICAgIDxkaXYgY2xhc3M9XCJoZWFkZXJcIiBkYXRhLWpzPVwiaGVhZGVyXCI+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJ0aXRsZVwiIGRhdGEtanM9XCJ0aXRsZVwiID4ke3AudGl0bGUgfHwgJyd9PC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJwcmUtY29udGV4dFwiIGRhdGEtanM9XCJwcmVDb250ZXh0XCIgPiR7cC5wcmVDb250ZXh0IHx8ICcnfTwvZGl2PlxuICAgICAgICA8ZGl2PjxpbWcgZGF0YS1qcz1cImNvbnRleHRcIiBjbGFzcz1cImNvbnRleHRcIiBzcmM9XCIke3AuY29udGV4dCB8fCAnJ31cIi8+PC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJwb3N0LWNvbnRleHRcIiBkYXRhLWpzPVwicG9zdENvbnRleHRcIiA+JHtwLnBvc3RDb250ZXh0IHx8ICcnfTwvZGl2PlxuICAgICAgICAke3AuX2lkICYmIHAudXNlci5faWQgJiYgIXAub3B0cy5yZWFkT25seSA/ICc8YnV0dG9uIGNsYXNzPVwiZGVsZXRlXCIgZGF0YS1qcz1cImRlbGV0ZVwiPjwvYnV0dG9uPicgOiAnJ31cbiAgICAgICAgJHtwLl9pZCAmJiBwLnVzZXIuX2lkICYmICFwLm9wdHMucmVhZE9ubHkgPyAnPGJ1dHRvbiBjbGFzcz1cImVkaXRcIiBkYXRhLWpzPVwiZWRpdFwiPjwvYnV0dG9uPicgOiAnJ31cbiAgICA8L2Rpdj5cbiAgICAke3AuX2lkICYmIHAudXNlci5faWQgJiYgIXAub3B0cy5yZWFkT25seVxuICAgICAgICA/IGA8ZGl2IGNsYXNzPVwiY29uZmlybSBoaWRkZW5cIiBkYXRhLWpzPVwiY29uZmlybURpYWxvZ1wiPlxuICAgICAgICAgICAgICAgPHNwYW4+QXJlIHlvdSBzdXJlPzwvc3Bhbj5cbiAgICAgICAgICAgICAgIDxidXR0b24gZGF0YS1qcz1cImNvbmZpcm1cIiB0eXBlPVwiYnV0dG9uXCI+RGVsZXRlPC9idXR0b24+IFxuICAgICAgICAgICAgICAgPGJ1dHRvbiBkYXRhLWpzPVwiY2FuY2VsXCIgdHlwZT1cImJ1dHRvblwiPkNhbmNlbDwvYnV0dG9uPiBcbiAgICAgICAgICAgPC9kaXY+YFxuICAgICAgICA6IGBgfVxuICAgIDxkaXYgY2xhc3M9XCJjbGVhcmZpeFwiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwiZGF0ZVwiPiR7KHJlcXVpcmUoJ21vbWVudCcpKShwLmNyZWF0ZWQpLmZvcm1hdCgnTU0tREQtWVlZWScpfTwvZGl2PlxuICAgIDwvZGl2PlxuICAgIDxpbWcgZGF0YS1qcz1cImltYWdlXCIgc3JjPVwiJHtwLmltYWdlID8gcC5pbWFnZSA6ICcnfVwiLz5cbiAgICAke3Aub3B0cy5yZWFkT25seVxuICAgICAgICA/IGA8ZGl2IGNsYXNzPVwiY2xlYXJmaXhcIj5cbiAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwic2hhcmVcIj5cbiAgICAgICAgICAgICAgICAgJHtyZXF1aXJlKCcuL2xpYi9mYWNlYm9vaycpfVxuICAgICAgICAgICAgICAgICAke3JlcXVpcmUoJy4vbGliL3R3aXR0ZXInKX1cbiAgICAgICAgICAgICAgICAgJHtyZXF1aXJlKCcuL2xpYi9nb29nbGUnKX1cbiAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwic3RvcmVcIiBkYXRhLWpzPVwic3RvcmVcIj5TdG9yZTwvZGl2PlxuICAgICAgICAgPC9kaXY+YFxuICAgICAgICA6IGBgIH1cbjwvZGl2PmBcbn1cbiIsIm1vZHVsZS5leHBvcnRzID0gcCA9PlxuYDxkaXY+XG4gICAgPGRpdiBkYXRhLWpzPVwiaGVhZGVyXCI+PC9kaXY+XG4gICAgPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXBcIj5cbiAgICAgICA8bGFiZWwgY2xhc3M9XCJmb3JtLWxhYmVsXCI+dGl0bGU8L2xhYmVsPlxuICAgICAgIDxpbnB1dCBkYXRhLWpzPVwidGl0bGVcIiB0eXBlPVwidGV4dFwiPjwvaW5wdXQ+XG4gICAgPC9kaXY+XG4gICAgPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXBcIj5cbiAgICAgICA8bGFiZWwgY2xhc3M9XCJmb3JtLWxhYmVsXCI+cHJlIGNvbnRleHQ8L2xhYmVsPlxuICAgICAgIDxpbnB1dCBkYXRhLWpzPVwicHJlQ29udGV4dFwiIHR5cGU9XCJ0ZXh0XCI+PC9pbnB1dD5cbiAgICA8L2Rpdj5cbiAgICA8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cFwiPlxuICAgICAgIDxsYWJlbCBjbGFzcz1cImZvcm0tbGFiZWxcIj5jb250ZXh0PC9sYWJlbD5cbiAgICAgICAgPGRpdj5cbiAgICAgICAgICAgIDxkaXYgZGF0YS1qcz1cImNvbnRleHRVcGxvYWRcIiBjbGFzcz1cInVwbG9hZFwiPlxuICAgICAgICAgICAgICAgIDxzcGFuPlVwbG9hZCBGaWxlPC9zcGFuPlxuICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwiZmlsZVwiIGRhdGEtanM9XCJjb250ZXh0XCIgLz5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGltZyBjbGFzcz1cInByZXZpZXdcIiBkYXRhLWpzPVwiY29udGV4dFByZXZpZXdcIiAvPlxuICAgICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgICA8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cFwiPlxuICAgICAgIDxsYWJlbCBjbGFzcz1cImZvcm0tbGFiZWxcIj5wb3N0IGNvbnRleHQ8L2xhYmVsPlxuICAgICAgIDxpbnB1dCBkYXRhLWpzPVwicG9zdENvbnRleHRcIiB0eXBlPVwidGV4dFwiPjwvaW5wdXQ+XG4gICAgPC9kaXY+XG4gICAgPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXBcIj5cbiAgICAgICA8bGFiZWwgY2xhc3M9XCJmb3JtLWxhYmVsXCI+aW1hZ2U8L2xhYmVsPlxuICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgPGRpdiBkYXRhLWpzPVwidXBsb2FkXCIgY2xhc3M9XCJ1cGxvYWRcIj5cbiAgICAgICAgICAgICAgICA8c3Bhbj5VcGxvYWQgRmlsZTwvc3Bhbj5cbiAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cImZpbGVcIiBkYXRhLWpzPVwiaW1hZ2VcIiAvPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8aW1nIGNsYXNzPVwicHJldmlld1wiIGRhdGEtanM9XCJwcmV2aWV3XCIgLz5cbiAgICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gICAgPGRpdiBjbGFzcz1cImJ1dHRvbi1yb3dcIj5cbiAgICAgICAgPGJ1dHRvbiBkYXRhLWpzPVwic3VibWl0XCIgdHlwZT1cImJ1dHRvblwiPlN1Ym1pdDwvYnV0dG9uPlxuICAgICAgICA8YnV0dG9uIGRhdGEtanM9XCJjYW5jZWxcIiB0eXBlPVwiYnV0dG9uXCI+Q2FuY2VsPC9idXR0b24+XG4gICAgPC9kaXY+XG48L2Rpdj5gXG4iLCJtb2R1bGUuZXhwb3J0cyA9IHAgPT4gXG5gPGRpdj5cbiAgICA8ZGl2PlxuICAgICAgICA8ZGl2PkNvbWljczwvZGl2PlxuICAgICAgICA8YnV0dG9uIGRhdGEtanM9XCJhZGRCdG5cIiBjbGFzcz1cImFkZFwiPjwvYnV0dG9uPlxuICAgIDwvZGl2PlxuICAgIDxkaXYgZGF0YS1qcz1cImxpc3RcIj48L2Rpdj5cbjwvZGl2PmBcbiIsIm1vZHVsZS5leHBvcnRzID0gcCA9PiBgPGhlYWRlcj5cbiAgICA8dWw+Jm5ic3A7XG4gICAgPC91bD5cbiAgICA8c3Bhbj5UaW55IEhhbmRlZDwvc3Bhbj5cbiAgICA8aW1nIGRhdGEtanM9XCJsb2dvXCIgc3JjPVwiL3N0YXRpYy9pbWcvdGlueUhhbmRlZC5qcGdcIiAvPlxuPC9oZWFkZXI+YFxuIiwibW9kdWxlLmV4cG9ydHMgPSAoIHAgKSA9PiBgPGRpdj48L2Rpdj5gXG4iLCJtb2R1bGUuZXhwb3J0cyA9ICggcCApID0+XG5gPGRpdj5cbiAgICA8aDE+TG9naW48L2gxPlxuICAgIDxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwXCI+XG4gICAgICAgPGxhYmVsIGNsYXNzPVwiZm9ybS1sYWJlbFwiIGZvcj1cInVzZXJuYW1lXCI+dXNlcm5hbWU8L2xhYmVsPlxuICAgICAgIDxpbnB1dCBkYXRhLWpzPVwidXNlcm5hbWVcIiBjbGFzcz1cInVzZXJuYW1lXCIgdHlwZT1cInRleHRcIj48L2lucHV0PlxuICAgIDwvZGl2PlxuICAgIDxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwXCI+XG4gICAgICAgPGxhYmVsIGNsYXNzPVwiZm9ybS1sYWJlbFwiIGZvcj1cInBhc3N3b3JkXCI+cGFzc3dvcmQ8L2xhYmVsPlxuICAgICAgIDxpbnB1dCBkYXRhLWpzPVwicGFzc3dvcmRcIiBjbGFzcz1cInBhc3N3b3JkXCIgdHlwZT1cInBhc3N3b3JkXCI+PC9pbnB1dD5cbiAgICA8L2Rpdj5cbiAgICA8ZGl2IGNsYXNzPVwiYnV0dG9uLXJvd1wiPlxuICAgICAgICA8YnV0dG9uIGRhdGEtanM9XCJzdWJtaXRcIiBjbGFzcz1cImJ0bi1naG9zdFwiIHR5cGU9XCJidXR0b25cIj5Mb2cgSW48L2J1dHRvbj5cbiAgICA8L2Rpdj5cbjwvZGl2PmBcbiIsIm1vZHVsZS5leHBvcnRzID0gcCA9PlxuYDxkaXY+XG4gICAgPGRpdiBkYXRhLWpzPVwidXNlcm5hbWVcIj4ke3AudXNlcm5hbWV9PC9kaXY+XG4gICAgJHtwLnVzZXIuX2lkICYmICFwLm9wdHMucmVhZE9ubHkgPyAnPGJ1dHRvbiBjbGFzcz1cImRlbGV0ZVwiIGRhdGEtanM9XCJkZWxldGVcIj48L2J1dHRvbj4nIDogJyd9XG4gICAgJHtwLnVzZXIuX2lkID09PSBwLl9pZCA/ICc8YnV0dG9uIGNsYXNzPVwiZWRpdFwiIGRhdGEtanM9XCJlZGl0XCI+PC9idXR0b24+JyA6ICcnfVxuICAgICR7cC51c2VyLl9pZCAmJiAhcC5vcHRzLnJlYWRPbmx5XG4gICAgPyBgPGRpdiBjbGFzcz1cImNvbmZpcm0gaGlkZGVuXCIgZGF0YS1qcz1cImNvbmZpcm1EaWFsb2dcIj5cbiAgICAgICAgICAgPHNwYW4+QXJlIHlvdSBzdXJlPzwvc3Bhbj5cbiAgICAgICAgICAgPGJ1dHRvbiBkYXRhLWpzPVwiY29uZmlybVwiIHR5cGU9XCJidXR0b25cIj5EZWxldGU8L2J1dHRvbj4gXG4gICAgICAgICAgIDxidXR0b24gZGF0YS1qcz1cImNhbmNlbFwiIHR5cGU9XCJidXR0b25cIj5DYW5jZWw8L2J1dHRvbj4gXG4gICAgICAgPC9kaXY+YFxuICAgIDogYGB9XG48L2Rpdj5cbmBcbiIsIm1vZHVsZS5leHBvcnRzID0gcCA9PlxuYDxkaXY+XG4gICAgPGRpdiBkYXRhLWpzPVwidGl0bGVcIj48L2Rpdj5cbiAgICA8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cFwiPlxuICAgICAgIDxsYWJlbCBjbGFzcz1cImZvcm0tbGFiZWxcIiBmb3I9XCJ1c2VybmFtZVwiPnVzZXJuYW1lPC9sYWJlbD5cbiAgICAgICA8aW5wdXQgZGF0YS1qcz1cInVzZXJuYW1lXCIgY2xhc3M9XCJ1c2VybmFtZVwiIHR5cGU9XCJ0ZXh0XCI+PC9pbnB1dD5cbiAgICA8L2Rpdj5cbiAgICA8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cFwiPlxuICAgICAgIDxsYWJlbCBjbGFzcz1cImZvcm0tbGFiZWxcIiBmb3I9XCJwYXNzd29yZFwiPnBhc3N3b3JkPC9sYWJlbD5cbiAgICAgICA8aW5wdXQgZGF0YS1qcz1cInBhc3N3b3JkXCIgY2xhc3M9XCJwYXNzd29yZFwiIHR5cGU9XCJwYXNzd29yZFwiPjwvaW5wdXQ+XG4gICAgPC9kaXY+XG4gICAgPGRpdiBjbGFzcz1cImJ1dHRvbi1yb3dcIj5cbiAgICAgICAgPGJ1dHRvbiBkYXRhLWpzPVwic3VibWl0XCIgY2xhc3M9XCJidG4tZ2hvc3RcIiB0eXBlPVwiYnV0dG9uXCI+U3VibWl0PC9idXR0b24+XG4gICAgICAgIDxidXR0b24gZGF0YS1qcz1cImNhbmNlbFwiIGNsYXNzPVwiYnRuLWdob3N0XCIgdHlwZT1cImJ1dHRvblwiPkNhbmNlbDwvYnV0dG9uPlxuICAgIDwvZGl2PlxuPC9kaXY+YFxuIiwibW9kdWxlLmV4cG9ydHMgPSBwID0+IFxuYDxkaXY+XG4gICAgPGRpdj5cbiAgICAgICAgPGRpdj5Vc2VyczwvZGl2PlxuICAgICAgICA8YnV0dG9uIGRhdGEtanM9XCJhZGRCdG5cIiBjbGFzcz1cImFkZFwiPjwvYnV0dG9uPlxuICAgIDwvZGl2PlxuICAgIDxkaXYgZGF0YS1qcz1cImxpc3RcIj48L2Rpdj5cbjwvZGl2PmBcbiIsIm1vZHVsZS5leHBvcnRzID0gYDxzdmcgZGF0YS1qcz1cImZhY2Vib29rXCIgZW5hYmxlLWJhY2tncm91bmQ9XCJuZXcgMCAwIDU2LjY5MyA1Ni42OTNcIiBoZWlnaHQ9XCI1Ni42OTNweFwiIGlkPVwiTGF5ZXJfMVwiIHZlcnNpb249XCIxLjFcIiB2aWV3Qm94PVwiMCAwIDU2LjY5MyA1Ni42OTNcIiB3aWR0aD1cIjU2LjY5M3B4XCIgeG1sOnNwYWNlPVwicHJlc2VydmVcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgeG1sbnM6eGxpbms9XCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rXCI+PHBhdGggZD1cIk0yOC4zNDcsNS4xNTdjLTEzLjYsMC0yNC42MjUsMTEuMDI3LTI0LjYyNSwyNC42MjVjMCwxMy42LDExLjAyNSwyNC42MjMsMjQuNjI1LDI0LjYyM2MxMy42LDAsMjQuNjI1LTExLjAyMywyNC42MjUtMjQuNjIzICBDNTIuOTcyLDE2LjE4NCw0MS45NDYsNS4xNTcsMjguMzQ3LDUuMTU3eiBNMzQuODY0LDI5LjY3OWgtNC4yNjRjMCw2LjgxNCwwLDE1LjIwNywwLDE1LjIwN2gtNi4zMmMwLDAsMC04LjMwNywwLTE1LjIwN2gtMy4wMDYgIFYyNC4zMWgzLjAwNnYtMy40NzljMC0yLjQ5LDEuMTgyLTYuMzc3LDYuMzc5LTYuMzc3bDQuNjgsMC4wMTh2NS4yMTVjMCwwLTIuODQ2LDAtMy4zOTgsMGMtMC41NTUsMC0xLjM0LDAuMjc3LTEuMzQsMS40NjF2My4xNjMgIGg0LjgxOEwzNC44NjQsMjkuNjc5elwiLz48L3N2Zz5gXG4iLCJtb2R1bGUuZXhwb3J0cz1gPHN2ZyBkYXRhLWpzPVwiZ29vZ2xlXCIgZW5hYmxlLWJhY2tncm91bmQ9XCJuZXcgMCAwIDU2LjY5MyA1Ni42OTNcIiBoZWlnaHQ9XCI1Ni42OTNweFwiIGlkPVwiTGF5ZXJfMVwiIHZlcnNpb249XCIxLjFcIiB2aWV3Qm94PVwiMCAwIDU2LjY5MyA1Ni42OTNcIiB3aWR0aD1cIjU2LjY5M3B4XCIgeG1sOnNwYWNlPVwicHJlc2VydmVcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgeG1sbnM6eGxpbms9XCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rXCI+PGc+PHBhdGggZD1cIk0yMy43NjEsMjcuOTZjMC42MjksMCwxLjE2LTAuMjQ4LDEuNTctMC43MTdjMC42NDUtMC43MzIsMC45MjgtMS45MzYsMC43Ni0zLjIxNWMtMC4zMDEtMi4yODctMS45MzItNC4xODYtMy42MzctNC4yMzYgICBoLTAuMDY4Yy0wLjYwNCwwLTEuMTQxLDAuMjQ2LTEuNTUxLDAuNzE1Yy0wLjYzNywwLjcyNS0wLjkwMywxLjg3MS0wLjczNiwzLjE0NmMwLjI5OSwyLjI4MywxLjk2NSw0LjI1NiwzLjYzNSw0LjMwN0gyMy43NjF6XCIvPjxwYXRoIGQ9XCJNMjUuNjIyLDM0Ljg0N2MtMC4xNjgtMC4xMTMtMC4zNDItMC4yMzItMC41MjEtMC4zNTVjLTAuNTI1LTAuMTYyLTEuMDg0LTAuMjQ2LTEuNjU0LTAuMjU0aC0wLjA3MiAgIGMtMi42MjUsMC00LjkyOSwxLjU5Mi00LjkyOSwzLjQwNmMwLDEuOTcxLDEuOTcyLDMuNTE4LDQuNDkxLDMuNTE4YzMuMzIyLDAsNS4wMDYtMS4xNDUsNS4wMDYtMy40MDQgICBjMC0wLjIxNS0wLjAyNS0wLjQzNi0wLjA3Ni0wLjY1NkMyNy42NDIsMzYuMjIyLDI2LjgzNywzNS42NzUsMjUuNjIyLDM0Ljg0N3pcIi8+PHBhdGggZD1cIk0yOC4zNDcsNS4xNTdjLTEzLjYwMSwwLTI0LjYyNSwxMS4wMjMtMjQuNjI1LDI0LjYyM3MxMS4wMjUsMjQuNjI1LDI0LjYyNSwyNC42MjVjMTMuNTk4LDAsMjQuNjIzLTExLjAyNSwyNC42MjMtMjQuNjI1ICAgUzQxLjk0NCw1LjE1NywyOC4zNDcsNS4xNTd6IE0yNi4xMDYsNDMuMTc5Yy0wLjk4MiwwLjI4My0yLjA0MSwwLjQyOC0zLjE1NCwwLjQyOGMtMS4yMzgsMC0yLjQzLTAuMTQzLTMuNTQtMC40MjQgICBjLTIuMTUtMC41NDEtMy43NC0xLjU3LTQuNDgtMi44OTVjLTAuMzItMC41NzQtMC40ODItMS4xODQtMC40ODItMS44MTZjMC0wLjY1MiwwLjE1Ni0xLjMxMiwwLjQ2My0xLjk2NyAgIGMxLjE4LTIuNTEsNC4yODMtNC4xOTcsNy43MjItNC4xOTdjMC4wMzUsMCwwLjA2OCwwLDAuMSwwYy0wLjI3OS0wLjQ5Mi0wLjQxNi0xLjAwMi0wLjQxNi0xLjUzN2MwLTAuMjY4LDAuMDM1LTAuNTM5LDAuMTA1LTAuODE0ICAgYy0zLjYwNi0wLjA4NC02LjMwNi0yLjcyNS02LjMwNi02LjIwN2MwLTIuNDYxLDEuOTY1LTQuODU1LDQuNzc2LTUuODI0YzAuODQyLTAuMjkxLDEuNjk5LTAuNDM5LDIuNTQzLTAuNDM5aDcuNzEzICAgYzAuMjY0LDAsMC40OTQsMC4xNywwLjU3NiwwLjQyYzAuMDg0LDAuMjUyLTAuMDA4LDAuNTI1LTAuMjIxLDAuNjhsLTEuNzI1LDEuMjQ4Yy0wLjEwNCwwLjA3NC0wLjIyOSwwLjExNS0wLjM1NywwLjExNWgtMC42MTcgICBjMC43OTksMC45NTUsMS4yNjYsMi4zMTYsMS4yNjYsMy44NDhjMCwxLjY5MS0wLjg1NSwzLjI4OS0yLjQxLDQuNTA2Yy0xLjIwMSwwLjkzNi0xLjI1LDEuMTkxLTEuMjUsMS43MjkgICBjMC4wMTYsMC4yOTUsMC44NTQsMS4yNTIsMS43NzUsMS45MDRjMi4xNTIsMS41MjMsMi45NTMsMy4wMTQsMi45NTMsNS41MDhDMzEuMTQsNDAuMDQsMjkuMTYzLDQyLjI5MiwyNi4xMDYsNDMuMTc5eiAgICBNNDMuNTI4LDI5Ljk0OGMwLDAuMzM0LTAuMjczLDAuNjA1LTAuNjA3LDAuNjA1aC00LjM4M3Y0LjM4NWMwLDAuMzM2LTAuMjcxLDAuNjA3LTAuNjA3LDAuNjA3aC0xLjI0OCAgIGMtMC4zMzYsMC0wLjYwNy0wLjI3MS0wLjYwNy0wLjYwN3YtNC4zODVIMzEuNjljLTAuMzMyLDAtMC42MDUtMC4yNzEtMC42MDUtMC42MDV2LTEuMjVjMC0wLjMzNCwwLjI3My0wLjYwNywwLjYwNS0wLjYwN2g0LjM4NSAgIHYtNC4zODNjMC0wLjMzNiwwLjI3MS0wLjYwNywwLjYwNy0wLjYwN2gxLjI0OGMwLjMzNiwwLDAuNjA3LDAuMjcxLDAuNjA3LDAuNjA3djQuMzgzaDQuMzgzYzAuMzM0LDAsMC42MDcsMC4yNzMsMC42MDcsMC42MDcgICBWMjkuOTQ4elwiLz48L2c+PC9zdmc+YFxuIiwibW9kdWxlLmV4cG9ydHM9YDxzdmcgZGF0YS1qcz1cInR3aXR0ZXJcIiBlbmFibGUtYmFja2dyb3VuZD1cIm5ldyAwIDAgNTYuNjkzIDU2LjY5M1wiIGhlaWdodD1cIjU2LjY5M3B4XCIgaWQ9XCJMYXllcl8xXCIgdmVyc2lvbj1cIjEuMVwiIHZpZXdCb3g9XCIwIDAgNTYuNjkzIDU2LjY5M1wiIHdpZHRoPVwiNTYuNjkzcHhcIiB4bWw6c3BhY2U9XCJwcmVzZXJ2ZVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB4bWxuczp4bGluaz1cImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmtcIj48cGF0aCBkPVwiTTI4LjM0OCw1LjE1N2MtMTMuNiwwLTI0LjYyNSwxMS4wMjctMjQuNjI1LDI0LjYyNWMwLDEzLjYsMTEuMDI1LDI0LjYyMywyNC42MjUsMjQuNjIzYzEzLjYsMCwyNC42MjMtMTEuMDIzLDI0LjYyMy0yNC42MjMgIEM1Mi45NzEsMTYuMTg0LDQxLjk0Nyw1LjE1NywyOC4zNDgsNS4xNTd6IE00MC43NTIsMjQuODE3YzAuMDEzLDAuMjY2LDAuMDE4LDAuNTMzLDAuMDE4LDAuODAzYzAsOC4yMDEtNi4yNDIsMTcuNjU2LTE3LjY1NiwxNy42NTYgIGMtMy41MDQsMC02Ljc2Ny0xLjAyNy05LjUxMy0yLjc4N2MwLjQ4NiwwLjA1NywwLjk3OSwwLjA4NiwxLjQ4LDAuMDg2YzIuOTA4LDAsNS41ODQtMC45OTIsNy43MDctMi42NTYgIGMtMi43MTUtMC4wNTEtNS4wMDYtMS44NDYtNS43OTYtNC4zMTFjMC4zNzgsMC4wNzQsMC43NjcsMC4xMTEsMS4xNjcsMC4xMTFjMC41NjYsMCwxLjExNC0wLjA3NCwxLjYzNS0wLjIxNyAgYy0yLjg0LTAuNTctNC45NzktMy4wOC00Ljk3OS02LjA4NGMwLTAuMDI3LDAtMC4wNTMsMC4wMDEtMC4wOGMwLjgzNiwwLjQ2NSwxLjc5MywwLjc0NCwyLjgxMSwwLjc3NyAgYy0xLjY2Ni0xLjExNS0yLjc2MS0zLjAxMi0yLjc2MS01LjE2NmMwLTEuMTM3LDAuMzA2LTIuMjA0LDAuODQtMy4xMmMzLjA2MSwzLjc1NCw3LjYzNCw2LjIyNSwxMi43OTIsNi40ODMgIGMtMC4xMDYtMC40NTMtMC4xNjEtMC45MjgtMC4xNjEtMS40MTRjMC0zLjQyNiwyLjc3OC02LjIwNSw2LjIwNi02LjIwNWMxLjc4NSwwLDMuMzk3LDAuNzU0LDQuNTI5LDEuOTU5ICBjMS40MTQtMC4yNzcsMi43NDItMC43OTUsMy45NDEtMS41MDZjLTAuNDY1LDEuNDUtMS40NDgsMi42NjYtMi43MywzLjQzM2MxLjI1Ny0wLjE1LDIuNDUzLTAuNDg0LDMuNTY1LTAuOTc3ICBDNDMuMDE4LDIyLjg0OSw0MS45NjUsMjMuOTQyLDQwLjc1MiwyNC44MTd6XCIvPjwvc3ZnPmBcbiIsIm1vZHVsZS5leHBvcnRzID0gZXJyID0+IHsgY29uc29sZS5sb2coIGVyci5zdGFjayB8fCBlcnIgKSB9XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcblxuICAgIEVycm9yOiByZXF1aXJlKCcuL015RXJyb3InKSxcblxuICAgIFA6ICggZnVuLCBhcmdzPVsgXSwgdGhpc0FyZyApID0+XG4gICAgICAgIG5ldyBQcm9taXNlKCAoIHJlc29sdmUsIHJlamVjdCApID0+IFJlZmxlY3QuYXBwbHkoIGZ1biwgdGhpc0FyZyB8fCB0aGlzLCBhcmdzLmNvbmNhdCggKCBlLCAuLi5jYWxsYmFjayApID0+IGUgPyByZWplY3QoZSkgOiByZXNvbHZlKGNhbGxiYWNrKSApICkgKSxcbiAgICBcbiAgICBjb25zdHJ1Y3RvcigpIHsgcmV0dXJuIHRoaXMgfVxufVxuIiwiLy8gQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgb3RoZXIgTm9kZSBjb250cmlidXRvcnMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbi8vIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbi8vIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuLy8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuLy8gZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdFxuLy8gcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlXG4vLyBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuLy8gaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuLy8gT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTlxuLy8gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4vLyBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1Jcbi8vIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbi8vIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbmZ1bmN0aW9uIEV2ZW50RW1pdHRlcigpIHtcbiAgdGhpcy5fZXZlbnRzID0gdGhpcy5fZXZlbnRzIHx8IHt9O1xuICB0aGlzLl9tYXhMaXN0ZW5lcnMgPSB0aGlzLl9tYXhMaXN0ZW5lcnMgfHwgdW5kZWZpbmVkO1xufVxubW9kdWxlLmV4cG9ydHMgPSBFdmVudEVtaXR0ZXI7XG5cbi8vIEJhY2t3YXJkcy1jb21wYXQgd2l0aCBub2RlIDAuMTAueFxuRXZlbnRFbWl0dGVyLkV2ZW50RW1pdHRlciA9IEV2ZW50RW1pdHRlcjtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5fZXZlbnRzID0gdW5kZWZpbmVkO1xuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5fbWF4TGlzdGVuZXJzID0gdW5kZWZpbmVkO1xuXG4vLyBCeSBkZWZhdWx0IEV2ZW50RW1pdHRlcnMgd2lsbCBwcmludCBhIHdhcm5pbmcgaWYgbW9yZSB0aGFuIDEwIGxpc3RlbmVycyBhcmVcbi8vIGFkZGVkIHRvIGl0LiBUaGlzIGlzIGEgdXNlZnVsIGRlZmF1bHQgd2hpY2ggaGVscHMgZmluZGluZyBtZW1vcnkgbGVha3MuXG5FdmVudEVtaXR0ZXIuZGVmYXVsdE1heExpc3RlbmVycyA9IDEwO1xuXG4vLyBPYnZpb3VzbHkgbm90IGFsbCBFbWl0dGVycyBzaG91bGQgYmUgbGltaXRlZCB0byAxMC4gVGhpcyBmdW5jdGlvbiBhbGxvd3Ncbi8vIHRoYXQgdG8gYmUgaW5jcmVhc2VkLiBTZXQgdG8gemVybyBmb3IgdW5saW1pdGVkLlxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5zZXRNYXhMaXN0ZW5lcnMgPSBmdW5jdGlvbihuKSB7XG4gIGlmICghaXNOdW1iZXIobikgfHwgbiA8IDAgfHwgaXNOYU4obikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCduIG11c3QgYmUgYSBwb3NpdGl2ZSBudW1iZXInKTtcbiAgdGhpcy5fbWF4TGlzdGVuZXJzID0gbjtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmVtaXQgPSBmdW5jdGlvbih0eXBlKSB7XG4gIHZhciBlciwgaGFuZGxlciwgbGVuLCBhcmdzLCBpLCBsaXN0ZW5lcnM7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMpXG4gICAgdGhpcy5fZXZlbnRzID0ge307XG5cbiAgLy8gSWYgdGhlcmUgaXMgbm8gJ2Vycm9yJyBldmVudCBsaXN0ZW5lciB0aGVuIHRocm93LlxuICBpZiAodHlwZSA9PT0gJ2Vycm9yJykge1xuICAgIGlmICghdGhpcy5fZXZlbnRzLmVycm9yIHx8XG4gICAgICAgIChpc09iamVjdCh0aGlzLl9ldmVudHMuZXJyb3IpICYmICF0aGlzLl9ldmVudHMuZXJyb3IubGVuZ3RoKSkge1xuICAgICAgZXIgPSBhcmd1bWVudHNbMV07XG4gICAgICBpZiAoZXIgaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgICB0aHJvdyBlcjsgLy8gVW5oYW5kbGVkICdlcnJvcicgZXZlbnRcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIEF0IGxlYXN0IGdpdmUgc29tZSBraW5kIG9mIGNvbnRleHQgdG8gdGhlIHVzZXJcbiAgICAgICAgdmFyIGVyciA9IG5ldyBFcnJvcignVW5jYXVnaHQsIHVuc3BlY2lmaWVkIFwiZXJyb3JcIiBldmVudC4gKCcgKyBlciArICcpJyk7XG4gICAgICAgIGVyci5jb250ZXh0ID0gZXI7XG4gICAgICAgIHRocm93IGVycjtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBoYW5kbGVyID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gIGlmIChpc1VuZGVmaW5lZChoYW5kbGVyKSlcbiAgICByZXR1cm4gZmFsc2U7XG5cbiAgaWYgKGlzRnVuY3Rpb24oaGFuZGxlcikpIHtcbiAgICBzd2l0Y2ggKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgIC8vIGZhc3QgY2FzZXNcbiAgICAgIGNhc2UgMTpcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMjpcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMsIGFyZ3VtZW50c1sxXSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAzOlxuICAgICAgICBoYW5kbGVyLmNhbGwodGhpcywgYXJndW1lbnRzWzFdLCBhcmd1bWVudHNbMl0pO1xuICAgICAgICBicmVhaztcbiAgICAgIC8vIHNsb3dlclxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG4gICAgICAgIGhhbmRsZXIuYXBwbHkodGhpcywgYXJncyk7XG4gICAgfVxuICB9IGVsc2UgaWYgKGlzT2JqZWN0KGhhbmRsZXIpKSB7XG4gICAgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG4gICAgbGlzdGVuZXJzID0gaGFuZGxlci5zbGljZSgpO1xuICAgIGxlbiA9IGxpc3RlbmVycy5sZW5ndGg7XG4gICAgZm9yIChpID0gMDsgaSA8IGxlbjsgaSsrKVxuICAgICAgbGlzdGVuZXJzW2ldLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmFkZExpc3RlbmVyID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgdmFyIG07XG5cbiAgaWYgKCFpc0Z1bmN0aW9uKGxpc3RlbmVyKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ2xpc3RlbmVyIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzKVxuICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuXG4gIC8vIFRvIGF2b2lkIHJlY3Vyc2lvbiBpbiB0aGUgY2FzZSB0aGF0IHR5cGUgPT09IFwibmV3TGlzdGVuZXJcIiEgQmVmb3JlXG4gIC8vIGFkZGluZyBpdCB0byB0aGUgbGlzdGVuZXJzLCBmaXJzdCBlbWl0IFwibmV3TGlzdGVuZXJcIi5cbiAgaWYgKHRoaXMuX2V2ZW50cy5uZXdMaXN0ZW5lcilcbiAgICB0aGlzLmVtaXQoJ25ld0xpc3RlbmVyJywgdHlwZSxcbiAgICAgICAgICAgICAgaXNGdW5jdGlvbihsaXN0ZW5lci5saXN0ZW5lcikgP1xuICAgICAgICAgICAgICBsaXN0ZW5lci5saXN0ZW5lciA6IGxpc3RlbmVyKTtcblxuICBpZiAoIXRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICAvLyBPcHRpbWl6ZSB0aGUgY2FzZSBvZiBvbmUgbGlzdGVuZXIuIERvbid0IG5lZWQgdGhlIGV4dHJhIGFycmF5IG9iamVjdC5cbiAgICB0aGlzLl9ldmVudHNbdHlwZV0gPSBsaXN0ZW5lcjtcbiAgZWxzZSBpZiAoaXNPYmplY3QodGhpcy5fZXZlbnRzW3R5cGVdKSlcbiAgICAvLyBJZiB3ZSd2ZSBhbHJlYWR5IGdvdCBhbiBhcnJheSwganVzdCBhcHBlbmQuXG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdLnB1c2gobGlzdGVuZXIpO1xuICBlbHNlXG4gICAgLy8gQWRkaW5nIHRoZSBzZWNvbmQgZWxlbWVudCwgbmVlZCB0byBjaGFuZ2UgdG8gYXJyYXkuXG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdID0gW3RoaXMuX2V2ZW50c1t0eXBlXSwgbGlzdGVuZXJdO1xuXG4gIC8vIENoZWNrIGZvciBsaXN0ZW5lciBsZWFrXG4gIGlmIChpc09iamVjdCh0aGlzLl9ldmVudHNbdHlwZV0pICYmICF0aGlzLl9ldmVudHNbdHlwZV0ud2FybmVkKSB7XG4gICAgaWYgKCFpc1VuZGVmaW5lZCh0aGlzLl9tYXhMaXN0ZW5lcnMpKSB7XG4gICAgICBtID0gdGhpcy5fbWF4TGlzdGVuZXJzO1xuICAgIH0gZWxzZSB7XG4gICAgICBtID0gRXZlbnRFbWl0dGVyLmRlZmF1bHRNYXhMaXN0ZW5lcnM7XG4gICAgfVxuXG4gICAgaWYgKG0gJiYgbSA+IDAgJiYgdGhpcy5fZXZlbnRzW3R5cGVdLmxlbmd0aCA+IG0pIHtcbiAgICAgIHRoaXMuX2V2ZW50c1t0eXBlXS53YXJuZWQgPSB0cnVlO1xuICAgICAgY29uc29sZS5lcnJvcignKG5vZGUpIHdhcm5pbmc6IHBvc3NpYmxlIEV2ZW50RW1pdHRlciBtZW1vcnkgJyArXG4gICAgICAgICAgICAgICAgICAgICdsZWFrIGRldGVjdGVkLiAlZCBsaXN0ZW5lcnMgYWRkZWQuICcgK1xuICAgICAgICAgICAgICAgICAgICAnVXNlIGVtaXR0ZXIuc2V0TWF4TGlzdGVuZXJzKCkgdG8gaW5jcmVhc2UgbGltaXQuJyxcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZXZlbnRzW3R5cGVdLmxlbmd0aCk7XG4gICAgICBpZiAodHlwZW9mIGNvbnNvbGUudHJhY2UgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgLy8gbm90IHN1cHBvcnRlZCBpbiBJRSAxMFxuICAgICAgICBjb25zb2xlLnRyYWNlKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLm9uID0gRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5hZGRMaXN0ZW5lcjtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbmNlID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgaWYgKCFpc0Z1bmN0aW9uKGxpc3RlbmVyKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ2xpc3RlbmVyIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuXG4gIHZhciBmaXJlZCA9IGZhbHNlO1xuXG4gIGZ1bmN0aW9uIGcoKSB7XG4gICAgdGhpcy5yZW1vdmVMaXN0ZW5lcih0eXBlLCBnKTtcblxuICAgIGlmICghZmlyZWQpIHtcbiAgICAgIGZpcmVkID0gdHJ1ZTtcbiAgICAgIGxpc3RlbmVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfVxuICB9XG5cbiAgZy5saXN0ZW5lciA9IGxpc3RlbmVyO1xuICB0aGlzLm9uKHR5cGUsIGcpO1xuXG4gIHJldHVybiB0aGlzO1xufTtcblxuLy8gZW1pdHMgYSAncmVtb3ZlTGlzdGVuZXInIGV2ZW50IGlmZiB0aGUgbGlzdGVuZXIgd2FzIHJlbW92ZWRcbkV2ZW50RW1pdHRlci5wcm90b3R5cGUucmVtb3ZlTGlzdGVuZXIgPSBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuICB2YXIgbGlzdCwgcG9zaXRpb24sIGxlbmd0aCwgaTtcblxuICBpZiAoIWlzRnVuY3Rpb24obGlzdGVuZXIpKVxuICAgIHRocm93IFR5cGVFcnJvcignbGlzdGVuZXIgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMgfHwgIXRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICByZXR1cm4gdGhpcztcblxuICBsaXN0ID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuICBsZW5ndGggPSBsaXN0Lmxlbmd0aDtcbiAgcG9zaXRpb24gPSAtMTtcblxuICBpZiAobGlzdCA9PT0gbGlzdGVuZXIgfHxcbiAgICAgIChpc0Z1bmN0aW9uKGxpc3QubGlzdGVuZXIpICYmIGxpc3QubGlzdGVuZXIgPT09IGxpc3RlbmVyKSkge1xuICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG4gICAgaWYgKHRoaXMuX2V2ZW50cy5yZW1vdmVMaXN0ZW5lcilcbiAgICAgIHRoaXMuZW1pdCgncmVtb3ZlTGlzdGVuZXInLCB0eXBlLCBsaXN0ZW5lcik7XG5cbiAgfSBlbHNlIGlmIChpc09iamVjdChsaXN0KSkge1xuICAgIGZvciAoaSA9IGxlbmd0aDsgaS0tID4gMDspIHtcbiAgICAgIGlmIChsaXN0W2ldID09PSBsaXN0ZW5lciB8fFxuICAgICAgICAgIChsaXN0W2ldLmxpc3RlbmVyICYmIGxpc3RbaV0ubGlzdGVuZXIgPT09IGxpc3RlbmVyKSkge1xuICAgICAgICBwb3NpdGlvbiA9IGk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChwb3NpdGlvbiA8IDApXG4gICAgICByZXR1cm4gdGhpcztcblxuICAgIGlmIChsaXN0Lmxlbmd0aCA9PT0gMSkge1xuICAgICAgbGlzdC5sZW5ndGggPSAwO1xuICAgICAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgICB9IGVsc2Uge1xuICAgICAgbGlzdC5zcGxpY2UocG9zaXRpb24sIDEpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9ldmVudHMucmVtb3ZlTGlzdGVuZXIpXG4gICAgICB0aGlzLmVtaXQoJ3JlbW92ZUxpc3RlbmVyJywgdHlwZSwgbGlzdGVuZXIpO1xuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUFsbExpc3RlbmVycyA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgdmFyIGtleSwgbGlzdGVuZXJzO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzKVxuICAgIHJldHVybiB0aGlzO1xuXG4gIC8vIG5vdCBsaXN0ZW5pbmcgZm9yIHJlbW92ZUxpc3RlbmVyLCBubyBuZWVkIHRvIGVtaXRcbiAgaWYgKCF0aGlzLl9ldmVudHMucmVtb3ZlTGlzdGVuZXIpIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMClcbiAgICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuICAgIGVsc2UgaWYgKHRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvLyBlbWl0IHJlbW92ZUxpc3RlbmVyIGZvciBhbGwgbGlzdGVuZXJzIG9uIGFsbCBldmVudHNcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApIHtcbiAgICBmb3IgKGtleSBpbiB0aGlzLl9ldmVudHMpIHtcbiAgICAgIGlmIChrZXkgPT09ICdyZW1vdmVMaXN0ZW5lcicpIGNvbnRpbnVlO1xuICAgICAgdGhpcy5yZW1vdmVBbGxMaXN0ZW5lcnMoa2V5KTtcbiAgICB9XG4gICAgdGhpcy5yZW1vdmVBbGxMaXN0ZW5lcnMoJ3JlbW92ZUxpc3RlbmVyJyk7XG4gICAgdGhpcy5fZXZlbnRzID0ge307XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBsaXN0ZW5lcnMgPSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgaWYgKGlzRnVuY3Rpb24obGlzdGVuZXJzKSkge1xuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIodHlwZSwgbGlzdGVuZXJzKTtcbiAgfSBlbHNlIGlmIChsaXN0ZW5lcnMpIHtcbiAgICAvLyBMSUZPIG9yZGVyXG4gICAgd2hpbGUgKGxpc3RlbmVycy5sZW5ndGgpXG4gICAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGxpc3RlbmVyc1tsaXN0ZW5lcnMubGVuZ3RoIC0gMV0pO1xuICB9XG4gIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmxpc3RlbmVycyA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgdmFyIHJldDtcbiAgaWYgKCF0aGlzLl9ldmVudHMgfHwgIXRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICByZXQgPSBbXTtcbiAgZWxzZSBpZiAoaXNGdW5jdGlvbih0aGlzLl9ldmVudHNbdHlwZV0pKVxuICAgIHJldCA9IFt0aGlzLl9ldmVudHNbdHlwZV1dO1xuICBlbHNlXG4gICAgcmV0ID0gdGhpcy5fZXZlbnRzW3R5cGVdLnNsaWNlKCk7XG4gIHJldHVybiByZXQ7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmxpc3RlbmVyQ291bnQgPSBmdW5jdGlvbih0eXBlKSB7XG4gIGlmICh0aGlzLl9ldmVudHMpIHtcbiAgICB2YXIgZXZsaXN0ZW5lciA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcblxuICAgIGlmIChpc0Z1bmN0aW9uKGV2bGlzdGVuZXIpKVxuICAgICAgcmV0dXJuIDE7XG4gICAgZWxzZSBpZiAoZXZsaXN0ZW5lcilcbiAgICAgIHJldHVybiBldmxpc3RlbmVyLmxlbmd0aDtcbiAgfVxuICByZXR1cm4gMDtcbn07XG5cbkV2ZW50RW1pdHRlci5saXN0ZW5lckNvdW50ID0gZnVuY3Rpb24oZW1pdHRlciwgdHlwZSkge1xuICByZXR1cm4gZW1pdHRlci5saXN0ZW5lckNvdW50KHR5cGUpO1xufTtcblxuZnVuY3Rpb24gaXNGdW5jdGlvbihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdmdW5jdGlvbic7XG59XG5cbmZ1bmN0aW9uIGlzTnVtYmVyKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ251bWJlcic7XG59XG5cbmZ1bmN0aW9uIGlzT2JqZWN0KGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ29iamVjdCcgJiYgYXJnICE9PSBudWxsO1xufVxuXG5mdW5jdGlvbiBpc1VuZGVmaW5lZChhcmcpIHtcbiAgcmV0dXJuIGFyZyA9PT0gdm9pZCAwO1xufVxuIl19
