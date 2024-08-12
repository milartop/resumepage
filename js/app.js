(() => {
    "use strict";
    const modules_flsModules = {};
    function isWebp() {
        function testWebP(callback) {
            let webP = new Image;
            webP.onload = webP.onerror = function() {
                callback(webP.height == 2);
            };
            webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
        }
        testWebP((function(support) {
            let className = support === true ? "webp" : "no-webp";
            document.documentElement.classList.add(className);
        }));
    }
    let bodyLockStatus = true;
    let bodyLockToggle = (delay = 500) => {
        if (document.documentElement.classList.contains("lock")) bodyUnlock(delay); else bodyLock(delay);
    };
    let bodyUnlock = (delay = 500) => {
        if (bodyLockStatus) {
            const lockPaddingElements = document.querySelectorAll("[data-lp]");
            setTimeout((() => {
                lockPaddingElements.forEach((lockPaddingElement => {
                    lockPaddingElement.style.paddingRight = "";
                }));
                document.body.style.paddingRight = "";
                document.documentElement.classList.remove("lock");
            }), delay);
            bodyLockStatus = false;
            setTimeout((function() {
                bodyLockStatus = true;
            }), delay);
        }
    };
    let bodyLock = (delay = 500) => {
        if (bodyLockStatus) {
            const lockPaddingElements = document.querySelectorAll("[data-lp]");
            const lockPaddingValue = window.innerWidth - document.body.offsetWidth + "px";
            lockPaddingElements.forEach((lockPaddingElement => {
                lockPaddingElement.style.paddingRight = lockPaddingValue;
            }));
            document.body.style.paddingRight = lockPaddingValue;
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
    function functions_FLS(message) {
        setTimeout((() => {
            if (window.FLS) console.log(message);
        }), 0);
    }
    function uniqArray(array) {
        return array.filter((function(item, index, self) {
            return self.indexOf(item) === index;
        }));
    }
    class ScrollWatcher {
        constructor(props) {
            let defaultConfig = {
                logging: true
            };
            this.config = Object.assign(defaultConfig, props);
            this.observer;
            !document.documentElement.classList.contains("watcher") ? this.scrollWatcherRun() : null;
        }
        scrollWatcherUpdate() {
            this.scrollWatcherRun();
        }
        scrollWatcherRun() {
            document.documentElement.classList.add("watcher");
            this.scrollWatcherConstructor(document.querySelectorAll("[data-watch]"));
        }
        scrollWatcherConstructor(items) {
            if (items.length) {
                this.scrollWatcherLogging(`Прокинувся, стежу за об'єктами (${items.length})...`);
                let uniqParams = uniqArray(Array.from(items).map((function(item) {
                    if (item.dataset.watch === "navigator" && !item.dataset.watchThreshold) {
                        let valueOfThreshold;
                        if (item.clientHeight > 2) {
                            valueOfThreshold = window.innerHeight / 2 / (item.clientHeight - 1);
                            if (valueOfThreshold > 1) valueOfThreshold = 1;
                        } else valueOfThreshold = 1;
                        item.setAttribute("data-watch-threshold", valueOfThreshold.toFixed(2));
                    }
                    return `${item.dataset.watchRoot ? item.dataset.watchRoot : null}|${item.dataset.watchMargin ? item.dataset.watchMargin : "0px"}|${item.dataset.watchThreshold ? item.dataset.watchThreshold : 0}`;
                })));
                uniqParams.forEach((uniqParam => {
                    let uniqParamArray = uniqParam.split("|");
                    let paramsWatch = {
                        root: uniqParamArray[0],
                        margin: uniqParamArray[1],
                        threshold: uniqParamArray[2]
                    };
                    let groupItems = Array.from(items).filter((function(item) {
                        let watchRoot = item.dataset.watchRoot ? item.dataset.watchRoot : null;
                        let watchMargin = item.dataset.watchMargin ? item.dataset.watchMargin : "0px";
                        let watchThreshold = item.dataset.watchThreshold ? item.dataset.watchThreshold : 0;
                        if (String(watchRoot) === paramsWatch.root && String(watchMargin) === paramsWatch.margin && String(watchThreshold) === paramsWatch.threshold) return item;
                    }));
                    let configWatcher = this.getScrollWatcherConfig(paramsWatch);
                    this.scrollWatcherInit(groupItems, configWatcher);
                }));
            } else this.scrollWatcherLogging("Сплю, немає об'єктів для стеження. ZzzZZzz");
        }
        getScrollWatcherConfig(paramsWatch) {
            let configWatcher = {};
            if (document.querySelector(paramsWatch.root)) configWatcher.root = document.querySelector(paramsWatch.root); else if (paramsWatch.root !== "null") this.scrollWatcherLogging(`Эмм... батьківського об'єкта ${paramsWatch.root} немає на сторінці`);
            configWatcher.rootMargin = paramsWatch.margin;
            if (paramsWatch.margin.indexOf("px") < 0 && paramsWatch.margin.indexOf("%") < 0) {
                this.scrollWatcherLogging(`йой, налаштування data-watch-margin потрібно задавати в PX або %`);
                return;
            }
            if (paramsWatch.threshold === "prx") {
                paramsWatch.threshold = [];
                for (let i = 0; i <= 1; i += .005) paramsWatch.threshold.push(i);
            } else paramsWatch.threshold = paramsWatch.threshold.split(",");
            configWatcher.threshold = paramsWatch.threshold;
            return configWatcher;
        }
        scrollWatcherCreate(configWatcher) {
            console.log(configWatcher);
            this.observer = new IntersectionObserver(((entries, observer) => {
                entries.forEach((entry => {
                    this.scrollWatcherCallback(entry, observer);
                }));
            }), configWatcher);
        }
        scrollWatcherInit(items, configWatcher) {
            this.scrollWatcherCreate(configWatcher);
            items.forEach((item => this.observer.observe(item)));
        }
        scrollWatcherIntersecting(entry, targetElement) {
            if (entry.isIntersecting) {
                !targetElement.classList.contains("_watcher-view") ? targetElement.classList.add("_watcher-view") : null;
                this.scrollWatcherLogging(`Я бачу ${targetElement.classList}, додав клас _watcher-view`);
            } else {
                targetElement.classList.contains("_watcher-view") ? targetElement.classList.remove("_watcher-view") : null;
                this.scrollWatcherLogging(`Я не бачу ${targetElement.classList}, прибрав клас _watcher-view`);
            }
        }
        scrollWatcherOff(targetElement, observer) {
            observer.unobserve(targetElement);
            this.scrollWatcherLogging(`Я перестав стежити за ${targetElement.classList}`);
        }
        scrollWatcherLogging(message) {
            this.config.logging ? functions_FLS(`[Спостерігач]: ${message}`) : null;
        }
        scrollWatcherCallback(entry, observer) {
            const targetElement = entry.target;
            this.scrollWatcherIntersecting(entry, targetElement);
            targetElement.hasAttribute("data-watch-once") && entry.isIntersecting ? this.scrollWatcherOff(targetElement, observer) : null;
            document.dispatchEvent(new CustomEvent("watcherCallback", {
                detail: {
                    entry
                }
            }));
        }
    }
    modules_flsModules.watcher = new ScrollWatcher({});
    let addWindowScrollEvent = false;
    function headerScroll() {
        addWindowScrollEvent = true;
        const header = document.querySelector(".header__wrap");
        const headerShow = header.hasAttribute("data-scroll-show");
        const headerShowTimer = header.dataset.scrollShow ? header.dataset.scrollShow : 500;
        const startPoint = header.dataset.scroll ? header.dataset.scroll : 1;
        let scrollDirection = 0;
        let timer;
        document.addEventListener("windowScroll", (function(e) {
            const scrollTop = window.scrollY;
            clearTimeout(timer);
            if (scrollTop >= startPoint) {
                !header.classList.contains("_header-scroll") ? header.classList.add("_header-scroll") : null;
                if (headerShow) {
                    if (scrollTop > scrollDirection) header.classList.contains("_header-show") ? header.classList.remove("_header-show") : null; else !header.classList.contains("_header-show") ? header.classList.add("_header-show") : null;
                    timer = setTimeout((() => {
                        !header.classList.contains("_header-show") ? header.classList.add("_header-show") : null;
                    }), headerShowTimer);
                }
            } else {
                header.classList.contains("_header-scroll") ? header.classList.remove("_header-scroll") : null;
                if (headerShow) header.classList.contains("_header-show") ? header.classList.remove("_header-show") : null;
            }
            scrollDirection = scrollTop <= 0 ? 0 : scrollTop;
        }));
    }
    setTimeout((() => {
        if (addWindowScrollEvent) {
            let windowScroll = new Event("windowScroll");
            window.addEventListener("scroll", (function(e) {
                document.dispatchEvent(windowScroll);
            }));
        }
    }), 0);
    class DynamicAdapt {
        constructor(type) {
            this.type = type;
        }
        init() {
            this.оbjects = [];
            this.daClassname = "_dynamic_adapt_";
            this.nodes = [ ...document.querySelectorAll("[data-da]") ];
            this.nodes.forEach((node => {
                const data = node.dataset.da.trim();
                const dataArray = data.split(",");
                const оbject = {};
                оbject.element = node;
                оbject.parent = node.parentNode;
                оbject.destination = document.querySelector(`${dataArray[0].trim()}`);
                оbject.breakpoint = dataArray[1] ? dataArray[1].trim() : "767.98";
                оbject.place = dataArray[2] ? dataArray[2].trim() : "last";
                оbject.index = this.indexInParent(оbject.parent, оbject.element);
                this.оbjects.push(оbject);
            }));
            this.arraySort(this.оbjects);
            this.mediaQueries = this.оbjects.map((({breakpoint}) => `(${this.type}-width: ${breakpoint / 16}em),${breakpoint}`)).filter(((item, index, self) => self.indexOf(item) === index));
            this.mediaQueries.forEach((media => {
                const mediaSplit = media.split(",");
                const matchMedia = window.matchMedia(mediaSplit[0]);
                const mediaBreakpoint = mediaSplit[1];
                const оbjectsFilter = this.оbjects.filter((({breakpoint}) => breakpoint === mediaBreakpoint));
                matchMedia.addEventListener("change", (() => {
                    this.mediaHandler(matchMedia, оbjectsFilter);
                }));
                this.mediaHandler(matchMedia, оbjectsFilter);
            }));
        }
        mediaHandler(matchMedia, оbjects) {
            if (matchMedia.matches) оbjects.forEach((оbject => {
                this.moveTo(оbject.place, оbject.element, оbject.destination);
            })); else оbjects.forEach((({parent, element, index}) => {
                if (element.classList.contains(this.daClassname)) this.moveBack(parent, element, index);
            }));
        }
        moveTo(place, element, destination) {
            element.classList.add(this.daClassname);
            if (place === "last" || place >= destination.children.length) {
                destination.append(element);
                return;
            }
            if (place === "first") {
                destination.prepend(element);
                return;
            }
            destination.children[place].before(element);
        }
        moveBack(parent, element, index) {
            element.classList.remove(this.daClassname);
            if (parent.children[index] !== void 0) parent.children[index].before(element); else parent.append(element);
        }
        indexInParent(parent, element) {
            return [ ...parent.children ].indexOf(element);
        }
        arraySort(arr) {
            if (this.type === "min") arr.sort(((a, b) => {
                if (a.breakpoint === b.breakpoint) {
                    if (a.place === b.place) return 0;
                    if (a.place === "first" || b.place === "last") return -1;
                    if (a.place === "last" || b.place === "first") return 1;
                    return 0;
                }
                return a.breakpoint - b.breakpoint;
            })); else {
                arr.sort(((a, b) => {
                    if (a.breakpoint === b.breakpoint) {
                        if (a.place === b.place) return 0;
                        if (a.place === "first" || b.place === "last") return 1;
                        if (a.place === "last" || b.place === "first") return -1;
                        return 0;
                    }
                    return b.breakpoint - a.breakpoint;
                }));
                return;
            }
        }
    }
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
        typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory() : typeof define === "function" && define.amd ? define(factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, 
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
                    this.value = damp(this.value, this.to, this.lerp * 60, deltaTime);
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
                const multiplierX = deltaMode === 1 ? LINE_HEIGHT : deltaMode === 2 ? this.windowWidth : 1;
                const multiplierY = deltaMode === 1 ? LINE_HEIGHT : deltaMode === 2 ? this.windowHeight : 1;
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
                    this.isTouching = event.type === "touchstart" || event.type === "touchmove";
                    const isTapToStop = this.options.syncTouch && isTouch && event.type === "touchstart" && !this.isStopped && !this.isLocked;
                    if (isTapToStop) {
                        this.reset();
                        return;
                    }
                    const isClick = deltaX === 0 && deltaY === 0;
                    const isUnknownGesture = this.options.gestureOrientation === "vertical" && deltaY === 0 || this.options.gestureOrientation === "horizontal" && deltaX === 0;
                    if (isClick || isUnknownGesture) return;
                    let composedPath = event.composedPath();
                    composedPath = composedPath.slice(0, composedPath.indexOf(this.rootElement));
                    const prevent = this.options.prevent;
                    if (!!composedPath.find((node => {
                        var _a, _b, _c, _d, _e;
                        return (typeof prevent === "function" ? prevent === null || prevent === void 0 ? void 0 : prevent(node) : prevent) || ((_a = node.hasAttribute) === null || _a === void 0 ? void 0 : _a.call(node, "data-lenis-prevent")) || isTouch && ((_b = node.hasAttribute) === null || _b === void 0 ? void 0 : _b.call(node, "data-lenis-prevent-touch")) || isWheel && ((_c = node.hasAttribute) === null || _c === void 0 ? void 0 : _c.call(node, "data-lenis-prevent-wheel")) || ((_d = node.classList) === null || _d === void 0 ? void 0 : _d.contains("lenis")) && !((_e = node.classList) === null || _e === void 0 ? void 0 : _e.contains("lenis-stopped"));
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
                    if (this.options.gestureOrientation === "both") delta = Math.abs(deltaY) > Math.abs(deltaX) ? deltaY : deltaX; else if (this.options.gestureOrientation === "horizontal") delta = deltaX;
                    const syncTouch = isTouch && this.options.syncTouch;
                    const isTouchEnd = isTouch && event.type === "touchend";
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
                    if (this.isScrolling === false || this.isScrolling === "native") {
                        const lastScroll = this.animatedScroll;
                        this.animatedScroll = this.targetScroll = this.actualScroll;
                        this.lastVelocity = this.velocity;
                        this.velocity = this.animatedScroll - lastScroll;
                        this.direction = Math.sign(this.animatedScroll - lastScroll);
                        this.isScrolling = "native";
                        this.emit();
                        if (this.velocity !== 0) this.__resetVelocityTimeout = setTimeout((() => {
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
                this.animate.advance(deltaTime * .001);
            }
            scrollTo(target, {offset = 0, immediate = false, lock = false, duration = this.options.duration, easing = this.options.easing, lerp = !duration && this.options.lerp, onStart, onComplete, force = false, programmatic = true, userData = {}} = {}) {
                if ((this.isStopped || this.isLocked) && !force) return;
                if ([ "top", "left", "start" ].includes(target)) target = 0; else if ([ "bottom", "right", "end" ].includes(target)) target = this.limit; else {
                    let node;
                    if (typeof target === "string") node = document.querySelector(target); else if (target === null || target === void 0 ? void 0 : target.nodeType) node = target;
                    if (node) {
                        if (this.options.wrapper !== window) {
                            const wrapperRect = this.options.wrapper.getBoundingClientRect();
                            offset -= this.isHorizontal ? wrapperRect.left : wrapperRect.top;
                        }
                        const rect = node.getBoundingClientRect();
                        target = (this.isHorizontal ? rect.left : rect.top) + this.animatedScroll;
                    }
                }
                if (typeof target !== "number") return;
                target += offset;
                target = Math.round(target);
                if (this.options.infinite) {
                    if (programmatic) this.targetScroll = this.animatedScroll = this.scroll;
                } else target = clamp(0, target, this.limit);
                if (immediate) {
                    this.animatedScroll = this.targetScroll = target;
                    this.setScroll(this.scroll);
                    this.reset();
                    onComplete === null || onComplete === void 0 ? void 0 : onComplete(this);
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
                        onStart === null || onStart === void 0 ? void 0 : onStart(this);
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
                            onComplete === null || onComplete === void 0 ? void 0 : onComplete(this);
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
                return this.options.orientation === "horizontal";
            }
            get actualScroll() {
                return this.isHorizontal ? this.rootElement.scrollLeft : this.rootElement.scrollTop;
            }
            get scroll() {
                return this.options.infinite ? modulo(this.animatedScroll, this.limit) : this.animatedScroll;
            }
            get progress() {
                return this.limit === 0 ? 1 : this.scroll / this.limit;
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
                return this.isScrolling === "smooth";
            }
            get className() {
                let className = "lenis";
                if (this.isStopped) className += " lenis-stopped";
                if (this.isLocked) className += " lenis-locked";
                if (this.isScrolling) className += " lenis-scrolling";
                if (this.isScrolling === "smooth") className += " lenis-smooth";
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
    isWebp();
    menuInit();
    headerScroll();
})();