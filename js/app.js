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
    let skillsIcon = document.querySelector(".skills__icon");
    function elementInViewport(el) {
        let bounds = el.getBoundingClientRect();
        return bounds.top + bounds.height > 0 && window.innerHeight - bounds.top > 0 && bounds.left + bounds.width > 0 && window.innerWidth - bounds.left > 0;
    }
    document.addEventListener("scroll", (e => {
        let el = document.querySelector(".skills__icon-item-js");
        let inViewport = elementInViewport(el);
        if (inViewport) skillsIcon.classList.add("skills__icon-active"); else skillsIcon.classList.remove("skills__icon-active");
    }));
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
    window["FLS"] = false;
    isWebp();
    menuInit();
})();