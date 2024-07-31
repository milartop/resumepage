(() => {
    "use strict";
    function isWebp() {
        function testWebP(callback) {
            let webP = new Image;
            webP.onload = webP.onerror = function() {
                callback(2 == webP.height);
            };
            webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
        }
        testWebP((function(support) {
            let className = true === support ? "webp" : "no-webp";
            document.documentElement.classList.add(className);
        }));
    }
    let bodyLockStatus = true;
    let bodyLockToggle = (delay = 500) => {
        if (document.documentElement.classList.contains("lock")) bodyUnlock(delay); else bodyLock(delay);
    };
    let bodyUnlock = (delay = 500) => {
        let body = document.querySelector("body");
        if (bodyLockStatus) {
            let lock_padding = document.querySelectorAll("[data-lp]");
            setTimeout((() => {
                for (let index = 0; index < lock_padding.length; index++) {
                    const el = lock_padding[index];
                    el.style.paddingRight = "0px";
                }
                body.style.paddingRight = "0px";
                document.documentElement.classList.remove("lock");
            }), delay);
            bodyLockStatus = false;
            setTimeout((function() {
                bodyLockStatus = true;
            }), delay);
        }
    };
    let bodyLock = (delay = 500) => {
        let body = document.querySelector("body");
        if (bodyLockStatus) {
            let lock_padding = document.querySelectorAll("[data-lp]");
            for (let index = 0; index < lock_padding.length; index++) {
                const el = lock_padding[index];
                el.style.paddingRight = window.innerWidth - document.querySelector(".wrapper").offsetWidth + "px";
            }
            body.style.paddingRight = window.innerWidth - document.querySelector(".wrapper").offsetWidth + "px";
            document.documentElement.classList.add("lock");
            bodyLockStatus = false;
            setTimeout((function() {
                bodyLockStatus = true;
            }), delay);
        }
    };
    function menuInit() {
        if (document.querySelector(".icon-menu")) document.addEventListener("click", (function(e) {
            if (bodyLockStatus && e.target.closest(".icon-menu")) {
                bodyLockToggle();
                document.documentElement.classList.toggle("menu-open");
            }
        }));
    }
    let addWindowScrollEvent = false;
    setTimeout((() => {
        if (addWindowScrollEvent) {
            let windowScroll = new Event("windowScroll");
            window.addEventListener("scroll", (function(e) {
                document.dispatchEvent(windowScroll);
            }));
        }
    }), 0);
    function DynamicAdapt(type) {
        this.type = type;
    }
    DynamicAdapt.prototype.init = function() {
        const _this = this;
        this.оbjects = [];
        this.daClassname = "_dynamic_adapt_";
        this.nodes = document.querySelectorAll("[data-da]");
        for (let i = 0; i < this.nodes.length; i++) {
            const node = this.nodes[i];
            const data = node.dataset.da.trim();
            const dataArray = data.split(",");
            const оbject = {};
            оbject.element = node;
            оbject.parent = node.parentNode;
            оbject.destination = document.querySelector(dataArray[0].trim());
            оbject.breakpoint = dataArray[1] ? dataArray[1].trim() : "767";
            оbject.place = dataArray[2] ? dataArray[2].trim() : "last";
            оbject.index = this.indexInParent(оbject.parent, оbject.element);
            this.оbjects.push(оbject);
        }
        this.arraySort(this.оbjects);
        this.mediaQueries = Array.prototype.map.call(this.оbjects, (function(item) {
            return "(" + this.type + "-width: " + item.breakpoint + "px)," + item.breakpoint;
        }), this);
        this.mediaQueries = Array.prototype.filter.call(this.mediaQueries, (function(item, index, self) {
            return Array.prototype.indexOf.call(self, item) === index;
        }));
        for (let i = 0; i < this.mediaQueries.length; i++) {
            const media = this.mediaQueries[i];
            const mediaSplit = String.prototype.split.call(media, ",");
            const matchMedia = window.matchMedia(mediaSplit[0]);
            const mediaBreakpoint = mediaSplit[1];
            const оbjectsFilter = Array.prototype.filter.call(this.оbjects, (function(item) {
                return item.breakpoint === mediaBreakpoint;
            }));
            matchMedia.addListener((function() {
                _this.mediaHandler(matchMedia, оbjectsFilter);
            }));
            this.mediaHandler(matchMedia, оbjectsFilter);
        }
    };
    DynamicAdapt.prototype.mediaHandler = function(matchMedia, оbjects) {
        if (matchMedia.matches) for (let i = 0; i < оbjects.length; i++) {
            const оbject = оbjects[i];
            оbject.index = this.indexInParent(оbject.parent, оbject.element);
            this.moveTo(оbject.place, оbject.element, оbject.destination);
        } else for (let i = оbjects.length - 1; i >= 0; i--) {
            const оbject = оbjects[i];
            if (оbject.element.classList.contains(this.daClassname)) this.moveBack(оbject.parent, оbject.element, оbject.index);
        }
    };
    DynamicAdapt.prototype.moveTo = function(place, element, destination) {
        element.classList.add(this.daClassname);
        if ("last" === place || place >= destination.children.length) {
            destination.insertAdjacentElement("beforeend", element);
            return;
        }
        if ("first" === place) {
            destination.insertAdjacentElement("afterbegin", element);
            return;
        }
        destination.children[place].insertAdjacentElement("beforebegin", element);
    };
    DynamicAdapt.prototype.moveBack = function(parent, element, index) {
        element.classList.remove(this.daClassname);
        if (void 0 !== parent.children[index]) parent.children[index].insertAdjacentElement("beforebegin", element); else parent.insertAdjacentElement("beforeend", element);
    };
    DynamicAdapt.prototype.indexInParent = function(parent, element) {
        const array = Array.prototype.slice.call(parent.children);
        return Array.prototype.indexOf.call(array, element);
    };
    DynamicAdapt.prototype.arraySort = function(arr) {
        if ("min" === this.type) Array.prototype.sort.call(arr, (function(a, b) {
            if (a.breakpoint === b.breakpoint) {
                if (a.place === b.place) return 0;
                if ("first" === a.place || "last" === b.place) return -1;
                if ("last" === a.place || "first" === b.place) return 1;
                return a.place - b.place;
            }
            return a.breakpoint - b.breakpoint;
        })); else {
            Array.prototype.sort.call(arr, (function(a, b) {
                if (a.breakpoint === b.breakpoint) {
                    if (a.place === b.place) return 0;
                    if ("first" === a.place || "last" === b.place) return 1;
                    if ("last" === a.place || "first" === b.place) return -1;
                    return b.place - a.place;
                }
                return b.breakpoint - a.breakpoint;
            }));
            return;
        }
    };
    const da = new DynamicAdapt("max");
    da.init();
    let portfolioLayer = document.querySelectorAll(".portfolio__layer");
    function parallax(event) {
        portfolioLayer.forEach((element => {
            let speed = element.getAttribute("data-speed");
            element.style.transform = `translate(${event.clientX * speed / 1200}px, ${event.clientY * speed / 1200}px)`;
        }));
    }
    document.addEventListener("mousemove", parallax);
    let len = 0;
    let speed = 1;
    let delay = 0;
    const paths = document.querySelectorAll(".anime__title-path");
    const svgImg = document.querySelector(".anime__title");
    const svgMask = document.querySelector(".anime__title-mask");
    const pathSurname = document.querySelectorAll(".anime__path-surname");
    const svgSurname = document.querySelector(".anime__title-surname");
    const maskSurname = document.querySelector(".anime__mask-surname");
    setTimeout((() => {
        svgImg.style.opacity = 1;
        paths.forEach((element => {
            let elementLen = element.getTotalLength();
            len += elementLen;
        }));
        paths.forEach((element => {
            let elementLen = element.getTotalLength();
            let duration = elementLen / len * speed;
            element.style.animationDuration = `${duration}s`;
            element.style.animationDelay = `${delay}s`;
            element.style.animationName = `svgpath`;
            element.style.strokeLinecap = `square`;
            element.setAttribute("stroke-dasharray", elementLen);
            element.setAttribute("stroke-dashoffset", elementLen);
            delay += duration + .1;
        }));
    }), 1e3);
    setTimeout((() => {
        svgImg.style.fill = "#fff";
        svgImg.style.transition = "all 2s ease";
        svgMask.style.fill = "#fff";
        svgMask.style.transition = "all 2s ease";
    }), 6400);
    setTimeout((() => {
        svgSurname.style.opacity = 1;
        pathSurname.forEach((element => {
            let elementLen = element.getTotalLength();
            len += elementLen;
        }));
        pathSurname.forEach((element => {
            let elementLen = element.getTotalLength();
            let duration = elementLen / len * speed;
            element.style.animationDuration = `${duration}s`;
            element.style.animationDelay = `${delay}s`;
            element.style.animationName = `svgpathsurname`;
            element.style.strokeLinecap = `square`;
            element.setAttribute("stroke-dasharray", elementLen);
            element.setAttribute("stroke-dashoffset", elementLen);
            delay += duration + .2;
        }));
    }), 1e3);
    setTimeout((() => {
        svgSurname.style.fill = "#fff";
        svgSurname.style.transition = "all 3s ease";
        maskSurname.style.fill = "#fff";
        maskSurname.style.transition = "all 3s ease";
    }), 6400);
    let footerContact = document.querySelector(".footer__block-title");
    function elementInViewportCnt(elem) {
        let bounds = elem.getBoundingClientRect();
        return bounds.top + bounds.height > 0 && window.innerHeight - bounds.top > 0 && bounds.left + bounds.width > 0 && window.innerWidth - bounds.left > 0;
    }
    document.addEventListener("scroll", (e => {
        let elem = document.querySelector(".footer__block-title-js");
        let inViewport = elementInViewportCnt(elem);
        if (inViewport) footerContact.classList.add("footer__block-title-activ"); else footerContact.classList.remove("footer__block-title-activ");
    }));
    let headerWrapLi = document.querySelectorAll(".header__wrap-li");
    let portfolioLink = document.querySelectorAll(".portfolio-link");
    headerWrapLi.forEach((function(sap) {
        sap.addEventListener("click", (function() {
            document.documentElement.classList.remove("menu-open");
            document.documentElement.classList.remove("lock");
        }));
    }));
    portfolioLink.forEach((function(sab) {
        sab.addEventListener("click", (function() {
            document.documentElement.classList.remove("menu-open");
            document.documentElement.classList.remove("lock");
        }));
    }));
    (function(global, factory) {
        "object" === typeof exports && "undefined" !== typeof module ? module.exports = factory() : "function" === typeof define && define.amd ? define(factory) : (global = "undefined" !== typeof globalThis ? globalThis : global || self, 
        global.Lenis = factory());
    })(void 0, (function() {
        "use strict";
        var version = "1.1.2";
        function clamp(min, input, max) {
            return Math.max(min, Math.min(input, max));
        }
        function lerp(x, y, t) {
            return (1 - t) * x + t * y;
        }
        function damp(x, y, lambda, dt) {
            return lerp(x, y, 1 - Math.exp(-lambda * dt));
        }
        function modulo(n, d) {
            return (n % d + d) % d;
        }
        class Animate {
            advance(deltaTime) {
                if (!this.isRunning) return;
                let completed = false;
                if (this.lerp) {
                    this.value = damp(this.value, this.to, 60 * this.lerp, deltaTime);
                    if (Math.round(this.value) === this.to) {
                        this.value = this.to;
                        completed = true;
                    }
                } else {
                    this.currentTime += deltaTime;
                    const linearProgress = clamp(0, this.currentTime / this.duration, 1);
                    completed = linearProgress >= 1;
                    const easedProgress = completed ? 1 : this.easing(linearProgress);
                    this.value = this.from + (this.to - this.from) * easedProgress;
                }
                if (completed) this.stop();
                this.onUpdate?.(this.value, completed);
            }
            stop() {
                this.isRunning = false;
            }
            fromTo(from, to, {lerp = .1, duration = 1, easing = t => t, onStart, onUpdate}) {
                this.from = this.value = from;
                this.to = to;
                this.lerp = lerp;
                this.duration = duration;
                this.easing = easing;
                this.currentTime = 0;
                this.isRunning = true;
                onStart?.();
                this.onUpdate = onUpdate;
            }
        }
        function debounce(callback, delay) {
            let timer;
            return function() {
                let args = arguments;
                let context = this;
                clearTimeout(timer);
                timer = setTimeout((function() {
                    callback.apply(context, args);
                }), delay);
            };
        }
        class Dimensions {
            constructor({wrapper, content, autoResize = true, debounce: debounceValue = 250} = {}) {
                this.wrapper = wrapper;
                this.content = content;
                if (autoResize) {
                    this.debouncedResize = debounce(this.resize, debounceValue);
                    if (this.wrapper === window) window.addEventListener("resize", this.debouncedResize, false); else {
                        this.wrapperResizeObserver = new ResizeObserver(this.debouncedResize);
                        this.wrapperResizeObserver.observe(this.wrapper);
                    }
                    this.contentResizeObserver = new ResizeObserver(this.debouncedResize);
                    this.contentResizeObserver.observe(this.content);
                }
                this.resize();
            }
            destroy() {
                this.wrapperResizeObserver?.disconnect();
                this.contentResizeObserver?.disconnect();
                window.removeEventListener("resize", this.debouncedResize, false);
            }
            resize=() => {
                this.onWrapperResize();
                this.onContentResize();
            };
            onWrapperResize=() => {
                if (this.wrapper === window) {
                    this.width = window.innerWidth;
                    this.height = window.innerHeight;
                } else {
                    this.width = this.wrapper.clientWidth;
                    this.height = this.wrapper.clientHeight;
                }
            };
            onContentResize=() => {
                if (this.wrapper === window) {
                    this.scrollHeight = this.content.scrollHeight;
                    this.scrollWidth = this.content.scrollWidth;
                } else {
                    this.scrollHeight = this.wrapper.scrollHeight;
                    this.scrollWidth = this.wrapper.scrollWidth;
                }
            };
            get limit() {
                return {
                    x: this.scrollWidth - this.width,
                    y: this.scrollHeight - this.height
                };
            }
        }
        class Emitter {
            constructor() {
                this.events = {};
            }
            emit(event, ...args) {
                let callbacks = this.events[event] || [];
                for (let i = 0, length = callbacks.length; i < length; i++) callbacks[i](...args);
            }
            on(event, cb) {
                this.events[event]?.push(cb) || (this.events[event] = [ cb ]);
                return () => {
                    this.events[event] = this.events[event]?.filter((i => cb !== i));
                };
            }
            off(event, callback) {
                this.events[event] = this.events[event]?.filter((i => callback !== i));
            }
            destroy() {
                this.events = {};
            }
        }
        const LINE_HEIGHT = 100 / 6;
        class VirtualScroll {
            constructor(element, {wheelMultiplier = 1, touchMultiplier = 1}) {
                this.element = element;
                this.wheelMultiplier = wheelMultiplier;
                this.touchMultiplier = touchMultiplier;
                this.touchStart = {
                    x: null,
                    y: null
                };
                this.emitter = new Emitter;
                window.addEventListener("resize", this.onWindowResize, false);
                this.onWindowResize();
                this.element.addEventListener("wheel", this.onWheel, {
                    passive: false
                });
                this.element.addEventListener("touchstart", this.onTouchStart, {
                    passive: false
                });
                this.element.addEventListener("touchmove", this.onTouchMove, {
                    passive: false
                });
                this.element.addEventListener("touchend", this.onTouchEnd, {
                    passive: false
                });
            }
            on(event, callback) {
                return this.emitter.on(event, callback);
            }
            destroy() {
                this.emitter.destroy();
                window.removeEventListener("resize", this.onWindowResize, false);
                this.element.removeEventListener("wheel", this.onWheel, {
                    passive: false
                });
                this.element.removeEventListener("touchstart", this.onTouchStart, {
                    passive: false
                });
                this.element.removeEventListener("touchmove", this.onTouchMove, {
                    passive: false
                });
                this.element.removeEventListener("touchend", this.onTouchEnd, {
                    passive: false
                });
            }
            onTouchStart=event => {
                const {clientX, clientY} = event.targetTouches ? event.targetTouches[0] : event;
                this.touchStart.x = clientX;
                this.touchStart.y = clientY;
                this.lastDelta = {
                    x: 0,
                    y: 0
                };
                this.emitter.emit("scroll", {
                    deltaX: 0,
                    deltaY: 0,
                    event
                });
            };
            onTouchMove=event => {
                const {clientX, clientY} = event.targetTouches ? event.targetTouches[0] : event;
                const deltaX = -(clientX - this.touchStart.x) * this.touchMultiplier;
                const deltaY = -(clientY - this.touchStart.y) * this.touchMultiplier;
                this.touchStart.x = clientX;
                this.touchStart.y = clientY;
                this.lastDelta = {
                    x: deltaX,
                    y: deltaY
                };
                this.emitter.emit("scroll", {
                    deltaX,
                    deltaY,
                    event
                });
            };
            onTouchEnd=event => {
                this.emitter.emit("scroll", {
                    deltaX: this.lastDelta.x,
                    deltaY: this.lastDelta.y,
                    event
                });
            };
            onWheel=event => {
                let {deltaX, deltaY, deltaMode} = event;
                const multiplierX = 1 === deltaMode ? LINE_HEIGHT : 2 === deltaMode ? this.windowWidth : 1;
                const multiplierY = 1 === deltaMode ? LINE_HEIGHT : 2 === deltaMode ? this.windowHeight : 1;
                deltaX *= multiplierX;
                deltaY *= multiplierY;
                deltaX *= this.wheelMultiplier;
                deltaY *= this.wheelMultiplier;
                this.emitter.emit("scroll", {
                    deltaX,
                    deltaY,
                    event
                });
            };
            onWindowResize=() => {
                this.windowWidth = window.innerWidth;
                this.windowHeight = window.innerHeight;
            };
        }
        class Lenis {
            constructor({wrapper = window, content = document.documentElement, wheelEventsTarget = wrapper, eventsTarget = wheelEventsTarget, smoothWheel = true, syncTouch = false, syncTouchLerp = .075, touchInertiaMultiplier = 35, duration, easing = t => Math.min(1, 1.001 - Math.pow(2, -10 * t)), lerp = !duration && .1, infinite = false, orientation = "vertical", gestureOrientation = "vertical", touchMultiplier = 1, wheelMultiplier = 1, autoResize = true, prevent = false, __experimental__naiveDimensions = false} = {}) {
                this.__isScrolling = false;
                this.__isStopped = false;
                this.__isLocked = false;
                this.onVirtualScroll = ({deltaX, deltaY, event}) => {
                    if (event.ctrlKey) return;
                    const isTouch = event.type.includes("touch");
                    const isWheel = event.type.includes("wheel");
                    this.isTouching = "touchstart" === event.type || "touchmove" === event.type;
                    const isTapToStop = this.options.syncTouch && isTouch && "touchstart" === event.type && !this.isStopped && !this.isLocked;
                    if (isTapToStop) {
                        this.reset();
                        return;
                    }
                    const isClick = 0 === deltaX && 0 === deltaY;
                    const isUnknownGesture = "vertical" === this.options.gestureOrientation && 0 === deltaY || "horizontal" === this.options.gestureOrientation && 0 === deltaX;
                    if (isClick || isUnknownGesture) return;
                    let composedPath = event.composedPath();
                    composedPath = composedPath.slice(0, composedPath.indexOf(this.rootElement));
                    const prevent = this.options.prevent;
                    if (!!composedPath.find((node => {
                        var _a, _b, _c, _d, _e;
                        return ("function" === typeof prevent ? null === prevent || void 0 === prevent ? void 0 : prevent(node) : prevent) || (null === (_a = node.hasAttribute) || void 0 === _a ? void 0 : _a.call(node, "data-lenis-prevent")) || isTouch && (null === (_b = node.hasAttribute) || void 0 === _b ? void 0 : _b.call(node, "data-lenis-prevent-touch")) || isWheel && (null === (_c = node.hasAttribute) || void 0 === _c ? void 0 : _c.call(node, "data-lenis-prevent-wheel")) || (null === (_d = node.classList) || void 0 === _d ? void 0 : _d.contains("lenis")) && !(null === (_e = node.classList) || void 0 === _e ? void 0 : _e.contains("lenis-stopped"));
                    }))) return;
                    if (this.isStopped || this.isLocked) {
                        event.preventDefault();
                        return;
                    }
                    const isSmooth = this.options.syncTouch && isTouch || this.options.smoothWheel && isWheel;
                    if (!isSmooth) {
                        this.isScrolling = "native";
                        this.animate.stop();
                        return;
                    }
                    event.preventDefault();
                    let delta = deltaY;
                    if ("both" === this.options.gestureOrientation) delta = Math.abs(deltaY) > Math.abs(deltaX) ? deltaY : deltaX; else if ("horizontal" === this.options.gestureOrientation) delta = deltaX;
                    const syncTouch = isTouch && this.options.syncTouch;
                    const isTouchEnd = isTouch && "touchend" === event.type;
                    const hasTouchInertia = isTouchEnd && Math.abs(delta) > 5;
                    if (hasTouchInertia) delta = this.velocity * this.options.touchInertiaMultiplier;
                    this.scrollTo(this.targetScroll + delta, Object.assign({
                        programmatic: false
                    }, syncTouch ? {
                        lerp: hasTouchInertia ? this.options.syncTouchLerp : 1
                    } : {
                        lerp: this.options.lerp,
                        duration: this.options.duration,
                        easing: this.options.easing
                    }));
                };
                this.onNativeScroll = () => {
                    clearTimeout(this.__resetVelocityTimeout);
                    delete this.__resetVelocityTimeout;
                    if (this.__preventNextNativeScrollEvent) {
                        delete this.__preventNextNativeScrollEvent;
                        return;
                    }
                    if (false === this.isScrolling || "native" === this.isScrolling) {
                        const lastScroll = this.animatedScroll;
                        this.animatedScroll = this.targetScroll = this.actualScroll;
                        this.lastVelocity = this.velocity;
                        this.velocity = this.animatedScroll - lastScroll;
                        this.direction = Math.sign(this.animatedScroll - lastScroll);
                        this.isScrolling = "native";
                        this.emit();
                        if (0 !== this.velocity) this.__resetVelocityTimeout = setTimeout((() => {
                            this.lastVelocity = this.velocity;
                            this.velocity = 0;
                            this.isScrolling = false;
                            this.emit();
                        }), 400);
                    }
                };
                window.lenisVersion = version;
                if (wrapper === document.documentElement || wrapper === document.body) wrapper = window;
                this.options = {
                    wrapper,
                    content,
                    wheelEventsTarget,
                    eventsTarget,
                    smoothWheel,
                    syncTouch,
                    syncTouchLerp,
                    touchInertiaMultiplier,
                    duration,
                    easing,
                    lerp,
                    infinite,
                    gestureOrientation,
                    orientation,
                    touchMultiplier,
                    wheelMultiplier,
                    autoResize,
                    prevent,
                    __experimental__naiveDimensions
                };
                this.animate = new Animate;
                this.emitter = new Emitter;
                this.dimensions = new Dimensions({
                    wrapper,
                    content,
                    autoResize
                });
                this.updateClassName();
                this.userData = {};
                this.time = 0;
                this.velocity = this.lastVelocity = 0;
                this.isLocked = false;
                this.isStopped = false;
                this.isScrolling = false;
                this.targetScroll = this.animatedScroll = this.actualScroll;
                this.options.wrapper.addEventListener("scroll", this.onNativeScroll, false);
                this.virtualScroll = new VirtualScroll(eventsTarget, {
                    touchMultiplier,
                    wheelMultiplier
                });
                this.virtualScroll.on("scroll", this.onVirtualScroll);
            }
            destroy() {
                this.emitter.destroy();
                this.options.wrapper.removeEventListener("scroll", this.onNativeScroll, false);
                this.virtualScroll.destroy();
                this.dimensions.destroy();
                this.cleanUpClassName();
            }
            on(event, callback) {
                return this.emitter.on(event, callback);
            }
            off(event, callback) {
                return this.emitter.off(event, callback);
            }
            setScroll(scroll) {
                if (this.isHorizontal) this.rootElement.scrollLeft = scroll; else this.rootElement.scrollTop = scroll;
            }
            resize() {
                this.dimensions.resize();
            }
            emit({userData = {}} = {}) {
                this.userData = userData;
                this.emitter.emit("scroll", this);
                this.userData = {};
            }
            reset() {
                this.isLocked = false;
                this.isScrolling = false;
                this.animatedScroll = this.targetScroll = this.actualScroll;
                this.lastVelocity = this.velocity = 0;
                this.animate.stop();
            }
            start() {
                if (!this.isStopped) return;
                this.isStopped = false;
                this.reset();
            }
            stop() {
                if (this.isStopped) return;
                this.isStopped = true;
                this.animate.stop();
                this.reset();
            }
            raf(time) {
                const deltaTime = time - (this.time || time);
                this.time = time;
                this.animate.advance(.001 * deltaTime);
            }
            scrollTo(target, {offset = 0, immediate = false, lock = false, duration = this.options.duration, easing = this.options.easing, lerp = !duration && this.options.lerp, onStart, onComplete, force = false, programmatic = true, userData = {}} = {}) {
                if ((this.isStopped || this.isLocked) && !force) return;
                if ([ "top", "left", "start" ].includes(target)) target = 0; else if ([ "bottom", "right", "end" ].includes(target)) target = this.limit; else {
                    let node;
                    if ("string" === typeof target) node = document.querySelector(target); else if (null === target || void 0 === target ? void 0 : target.nodeType) node = target;
                    if (node) {
                        if (this.options.wrapper !== window) {
                            const wrapperRect = this.options.wrapper.getBoundingClientRect();
                            offset -= this.isHorizontal ? wrapperRect.left : wrapperRect.top;
                        }
                        const rect = node.getBoundingClientRect();
                        target = (this.isHorizontal ? rect.left : rect.top) + this.animatedScroll;
                    }
                }
                if ("number" !== typeof target) return;
                target += offset;
                target = Math.round(target);
                if (this.options.infinite) {
                    if (programmatic) this.targetScroll = this.animatedScroll = this.scroll;
                } else target = clamp(0, target, this.limit);
                if (immediate) {
                    this.animatedScroll = this.targetScroll = target;
                    this.setScroll(this.scroll);
                    this.reset();
                    null === onComplete || void 0 === onComplete ? void 0 : onComplete(this);
                    return;
                }
                if (target === this.targetScroll) return;
                if (!programmatic) this.targetScroll = target;
                this.animate.fromTo(this.animatedScroll, target, {
                    duration,
                    easing,
                    lerp,
                    onStart: () => {
                        if (lock) this.isLocked = true;
                        this.isScrolling = "smooth";
                        null === onStart || void 0 === onStart ? void 0 : onStart(this);
                    },
                    onUpdate: (value, completed) => {
                        this.isScrolling = "smooth";
                        this.lastVelocity = this.velocity;
                        this.velocity = value - this.animatedScroll;
                        this.direction = Math.sign(this.velocity);
                        this.animatedScroll = value;
                        this.setScroll(this.scroll);
                        if (programmatic) this.targetScroll = value;
                        if (!completed) this.emit({
                            userData
                        });
                        if (completed) {
                            this.reset();
                            this.emit({
                                userData
                            });
                            null === onComplete || void 0 === onComplete ? void 0 : onComplete(this);
                            this.__preventNextNativeScrollEvent = true;
                        }
                    }
                });
            }
            get rootElement() {
                return this.options.wrapper === window ? document.documentElement : this.options.wrapper;
            }
            get limit() {
                if (this.options.__experimental__naiveDimensions) if (this.isHorizontal) return this.rootElement.scrollWidth - this.rootElement.clientWidth; else return this.rootElement.scrollHeight - this.rootElement.clientHeight; else return this.dimensions.limit[this.isHorizontal ? "x" : "y"];
            }
            get isHorizontal() {
                return "horizontal" === this.options.orientation;
            }
            get actualScroll() {
                return this.isHorizontal ? this.rootElement.scrollLeft : this.rootElement.scrollTop;
            }
            get scroll() {
                return this.options.infinite ? modulo(this.animatedScroll, this.limit) : this.animatedScroll;
            }
            get progress() {
                return 0 === this.limit ? 1 : this.scroll / this.limit;
            }
            get isScrolling() {
                return this.__isScrolling;
            }
            set isScrolling(value) {
                if (this.__isScrolling !== value) {
                    this.__isScrolling = value;
                    this.updateClassName();
                }
            }
            get isStopped() {
                return this.__isStopped;
            }
            set isStopped(value) {
                if (this.__isStopped !== value) {
                    this.__isStopped = value;
                    this.updateClassName();
                }
            }
            get isLocked() {
                return this.__isLocked;
            }
            set isLocked(value) {
                if (this.__isLocked !== value) {
                    this.__isLocked = value;
                    this.updateClassName();
                }
            }
            get isSmooth() {
                return "smooth" === this.isScrolling;
            }
            get className() {
                let className = "lenis";
                if (this.isStopped) className += " lenis-stopped";
                if (this.isLocked) className += " lenis-locked";
                if (this.isScrolling) className += " lenis-scrolling";
                if ("smooth" === this.isScrolling) className += " lenis-smooth";
                return className;
            }
            updateClassName() {
                this.cleanUpClassName();
                this.rootElement.className = `${this.rootElement.className} ${this.className}`.trim();
            }
            cleanUpClassName() {
                this.rootElement.className = this.rootElement.className.replace(/lenis(-\w+)?/g, "").trim();
            }
        }
        return Lenis;
    }));
    const lenis = new Lenis;
    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    document.querySelectorAll(".header__wrap-items").forEach((anchor => {
        anchor.addEventListener("click", (function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute("href"));
            lenis.scrollTo(target, {
                offset: 0,
                duration: .5,
                easing: t => t
            });
        }));
    }));
    window["FLS"] = false;
    isWebp();
    menuInit();
})();