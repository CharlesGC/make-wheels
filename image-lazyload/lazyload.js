/*
 * @Descripttion: 
 * @version: 
 * @Author: Charles Guo
 * @Date: 2020-12-13 14:27:00
 * @LastEditors: Charles Guo
 * @LastEditTime: 2020-12-14 00:41:57
 */
(function () {
    // 首先处理顶层对象
    /* 
        self 代表浏览器环境下的顶层对象
        global 代表node环境下的顶层对象
        否则使用this，最后返回个空对象
    */
    var root = (typeof self == 'object' && self.self == self && self) ||
        (typeof global == 'object' && global.global == global && global) ||
        this || {};

    // 修复 bind 函数
    Function.prototype.bind = Function.prototype.bind || function (context) {
        // 如果非函数调用bind返回一个错误
        if (typeof this !== "function") {
          throw new Error("Function.prototype.bind - what is trying to be bound is not callable");
        }
        // 保存 调用者
        var self = this;
        // 取到第一个参数
        var args = Array.prototype.slice.call(arguments, 1);

        var fNOP = function () {};

        var fBound = function () {
            // 这个时候的arguments是指bind返回的函数传入的参数
            var bindArgs = Array.prototype.slice.call(arguments);
            // 兼容函数返回值 即return 
            // 因为以new方式调用bind时，会将this指向实例，所以这里要指向调用者
            // 而以普通函数调用时this指向window 要指向我们要修改的那个obj即context
            self.apply(this instanceof fNOP ? this : context, args.concat(bindArgs));
        }

        fNOP.prototype = this.prototype;
        fBound.prototype = new fNOP(); // 这是一个fNOP的实例，所以fBound的实例的原型是调用者的构造函数
        return fBound;
    }

    var util = {
        // 这里虽然只接受一个参数，但剩余参数我们可以从arguments里面拿到
        extend: function(target) {
            for (var i = 1, len = arguments.length; i < len; i++) {
                for (var prop in arguments[i]) {
                    if (arguments[i].hasOwnProperty(prop)) {
                        target[prop] = arguments[i][prop]
                    }
                }
            }

            return target
        },
        addEvent: function(elem, type, fn) {
            if (document.addEventListener) {
                elem.addEventListener(type, fn, false);
                return fn;
            } else if (document.attachEvent) {
                var bound = function() {
                    return fn.apply(elem, arguments)
                }
                elem.attachEvent('on' + type, bound);
                return bound;
            }
        },
        removeEvent: function(elem, type, fn) {
        	if (document.removeEventListener) {
        		elem.removeEventListener(type, fn, false)
        	}
        	else {
        		elem.detachEvent("on" + type, fn)
        	}
        }
    }

    function Lazy(opts) {

        this.opts = util.extend({}, this.constructor.defaultOpts, opts)

        this.init();
    }

    Lazy.VERSION = '1.0.0';

    Lazy.defaultOpts = {
    	delay: 250,
        useDebounce: false
    }

    var proto = Lazy.prototype;

    proto.init = function() {

        this.calulateView();

        this.bindScrollEvent();

    };

    proto.calulateView = function() {

        this.view = {
            top: 0 - (parseInt(this.opts.top, 10) || 0),
            bottom: (root.innerHeight || document.documentElement.clientHeight) + (parseInt(this.opts.bottom, 10) || 0),
            left: 0 - (parseInt(this.opts.left, 10) || 0),
            right: (root.innerWidth || document.documentElement.clientWidth) + (parseInt(this.opts.right, 10) || 0)
        }

    };

    proto.bindScrollEvent = function() {
        var scrollEvent = util.addEvent(root, 'scroll', this.handleLazyLoad.bind(this))
        var loadEvent = util.addEvent(root, 'load', this.handleLazyLoad.bind(this))

        this.event = {
        	scrollEvent: scrollEvent,
        	loadEvent: loadEvent
        }
    };

   var timer = null;

    proto.handleLazyLoad = function() {
    	var self = this;

    	if (!this.opts.useDebounce && !!timer) {
    	    return;
    	}

        clearTimeout(timer);

        timer = setTimeout(function() {
            timer = null;
            self.render()
        }, this.opts.delay);
    };

    proto.isHidden = function(element) {
        return (element.offsetParent === null);
    };

    proto.checkInView = function(element) {
        if (this.isHidden(element)) {
            return false;
        }

        var rect = element.getBoundingClientRect();

        return (rect.right >= this.view.left && rect.bottom >= this.view.top && rect.left <= this.view.right && rect.top <= this.view.bottom);
    };

    proto.render = function() {
        var nodes = document.querySelectorAll('[data-lazy-src], [data-lazy-background]');
        var length = nodes.length;

        for (var i = 0; i < length; i++) {
            elem = nodes[i];
            if (this.checkInView(elem)) {

                if (elem.getAttribute('data-lazy-background') !== null) {
                    elem.style.backgroundImage = 'url(' + elem.getAttribute('data-lazy-background') + ')';
                } else if (elem.src !== (src = elem.getAttribute('data-lazy-src'))) {
                    elem.src = src;
                }

               	elem.removeAttribute('data-lazy-src');
                elem.removeAttribute('data-lazy-background');

                if (this.opts.onload && typeof this.opts.onload === 'function') {
                	this.opts.onload(elem);
                }
            }
        }

        if (!length) {
            this.unbindScrollEvent();
        }
    };

    proto.unbindScrollEvent = function(){
    	util.removeEvent(root, 'scroll', this.event.scrollEvent)
    	util.removeEvent(root, 'load', this.event.loadEvent)
    };

    if (typeof exports != 'undefined' && !exports.nodeType) {
        if (typeof module != 'undefined' && !module.nodeType && module.exports) {
            exports = module.exports = Lazy;
        }
        exports.Lazy = Lazy;
    } else {
        root.Lazy = Lazy;
    }
}());