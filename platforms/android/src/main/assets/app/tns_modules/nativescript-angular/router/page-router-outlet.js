"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var async_1 = require('angular2/src/facade/async');
var lang_1 = require('angular2/src/facade/lang');
var collection_1 = require('angular2/src/facade/collection');
var core_1 = require('angular2/core');
var routerHooks = require('angular2/src/router/lifecycle/lifecycle_annotations');
var route_lifecycle_reflector_1 = require('angular2/src/router/lifecycle/route_lifecycle_reflector');
var router_1 = require('angular2/router');
var frame_1 = require("ui/frame");
var page_1 = require("ui/page");
var common_1 = require("./common");
var ns_location_strategy_1 = require("./ns-location-strategy");
var _resolveToTrue = async_1.PromiseWrapper.resolve(true);
/**
 * Reference Cache
 */
var RefCache = (function () {
    function RefCache() {
        this.cache = new Array();
    }
    RefCache.prototype.push = function (comp, router, pageShimRef) {
        this.cache.push({ componentRef: comp, router: router, pageShimRef: pageShimRef });
    };
    RefCache.prototype.pop = function () {
        return this.cache.pop();
    };
    RefCache.prototype.peek = function () {
        return this.cache[this.cache.length - 1];
    };
    return RefCache;
}());
/**
 * Page shim used for loadin compnenets when navigating
 */
var PageShim = (function () {
    function PageShim(element, loader) {
        this.element = element;
        this.loader = loader;
    }
    PageShim.prototype.loadComponent = function (componentType) {
        return this.loader.loadIntoLocation(componentType, this.element, 'loader');
    };
    PageShim = __decorate([
        core_1.Component({
            selector: 'nativescript-page-shim',
            template: "\n        <DetachedContainer>\n            <Placeholder #loader></Placeholder>\n        </DetachedContainer>\n        "
        }), 
        __metadata('design:paramtypes', [core_1.ElementRef, core_1.DynamicComponentLoader])
    ], PageShim);
    return PageShim;
}());
/**
 * A router outlet that does page navigation in NativeScript
 *
 * ## Use
 *
 * ```
 * <page-router-outlet></page-router-outlet>
 * ```
 */
var PageRouterOutlet = (function (_super) {
    __extends(PageRouterOutlet, _super);
    function PageRouterOutlet(elementRef, loader, parentRouter, nameAttr, location) {
        _super.call(this, elementRef, loader, parentRouter, nameAttr);
        this.elementRef = elementRef;
        this.loader = loader;
        this.parentRouter = parentRouter;
        this.location = location;
        this.isInitalPage = true;
        this.refCache = new RefCache();
        this.componentRef = null;
        this.currentInstruction = null;
    }
    /**
     * Called by the Router to instantiate a new component during the commit phase of a navigation.
     * This method in turn is responsible for calling the `routerOnActivate` hook of its child.
     */
    PageRouterOutlet.prototype.activate = function (nextInstruction) {
        this.log("activate", nextInstruction);
        var previousInstruction = this.currentInstruction;
        this.currentInstruction = nextInstruction;
        if (this.location.isPageNavigatingBack()) {
            return this.activateOnGoBack(nextInstruction, previousInstruction);
        }
        else {
            return this.activateOnGoForward(nextInstruction, previousInstruction);
        }
    };
    PageRouterOutlet.prototype.activateOnGoBack = function (nextInstruction, previousInstruction) {
        common_1.log("PageRouterOutlet.activate() - Back naviation, so load from cache: " + nextInstruction.componentType.name);
        this.location.finishBackPageNavigation();
        // Get Component form ref and just call the activate hook
        var cacheItem = this.refCache.peek();
        this.componentRef = cacheItem.componentRef;
        this.replaceChildRouter(cacheItem.router);
        if (route_lifecycle_reflector_1.hasLifecycleHook(routerHooks.routerOnActivate, this.componentRef.componentType)) {
            return this.componentRef.instance
                .routerOnActivate(nextInstruction, previousInstruction);
        }
    };
    PageRouterOutlet.prototype.activateOnGoForward = function (nextInstruction, previousInstruction) {
        var _this = this;
        var componentType = nextInstruction.componentType;
        var resultPromise;
        var pageShimRef = undefined;
        var childRouter = this.parentRouter.childRouter(componentType);
        var providersArray = [
            core_1.provide(router_1.RouteData, { useValue: nextInstruction.routeData }),
            core_1.provide(router_1.RouteParams, { useValue: new router_1.RouteParams(nextInstruction.params) }),
            core_1.provide(router_1.Router, { useValue: childRouter }),
        ];
        if (this.isInitalPage) {
            common_1.log("PageRouterOutlet.activate() inital page - just load component: " + componentType.name);
            this.isInitalPage = false;
            resultPromise = this.loader.loadNextToLocation(componentType, this.elementRef, core_1.Injector.resolve(providersArray));
        }
        else {
            common_1.log("PageRouterOutlet.activate() forward navigation - create page shim in the loader container: " + componentType.name);
            var page_2 = new page_1.Page();
            providersArray.push(core_1.provide(page_1.Page, { useValue: page_2 }));
            resultPromise = this.loader.loadIntoLocation(PageShim, this.elementRef, "loader", core_1.Injector.resolve(providersArray))
                .then(function (pageComponentRef) {
                pageShimRef = pageComponentRef;
                return pageShimRef.instance.loadComponent(componentType);
            })
                .then(function (actualCoponenetRef) {
                return _this.loadComponentInPage(page_2, actualCoponenetRef);
            });
        }
        return resultPromise.then(function (componentRef) {
            _this.componentRef = componentRef;
            _this.refCache.push(componentRef, childRouter, pageShimRef);
            if (route_lifecycle_reflector_1.hasLifecycleHook(routerHooks.routerOnActivate, componentType)) {
                return _this.componentRef.instance
                    .routerOnActivate(nextInstruction, previousInstruction);
            }
        });
    };
    PageRouterOutlet.prototype.loadComponentInPage = function (page, componentRef) {
        var _this = this;
        //Component loaded. Find its root native view.
        var componenetView = componentRef.location.nativeElement;
        //Remove it from original native parent.
        if (componenetView.parent) {
            componenetView.parent.removeChild(componenetView);
        }
        //Add it to the new page
        page.content = componenetView;
        this.location.navigateToNewPage();
        return new Promise(function (resolve, reject) {
            page.on('navigatedTo', function () {
                // Finish activation when page is fully navigated to.
                resolve(componentRef);
            });
            page.on('navigatingFrom', global.zone.bind(function (args) {
                if (args.isBackNavigation) {
                    _this.location.beginBackPageNavigation();
                    _this.location.back();
                }
            }));
            frame_1.topmost().navigate({
                animated: true,
                create: function () { return page; }
            });
        });
    };
    /**
     * Called by the {@link Router} when an outlet disposes of a component's contents.
     * This method in turn is responsible for calling the `routerOnDeactivate` hook of its child.
     */
    PageRouterOutlet.prototype.deactivate = function (nextInstruction) {
        var _this = this;
        this.log("deactivate", nextInstruction);
        var instruction = this.currentInstruction;
        var next = _resolveToTrue;
        if (lang_1.isPresent(this.componentRef) &&
            lang_1.isPresent(instruction) &&
            route_lifecycle_reflector_1.hasLifecycleHook(routerHooks.routerOnDeactivate, this.componentRef.componentType)) {
            next = async_1.PromiseWrapper.resolve(this.componentRef.instance.routerOnDeactivate(nextInstruction, this.currentInstruction));
        }
        if (this.location.isPageNavigatingBack()) {
            common_1.log("PageRouterOutlet.deactivate() while going back - should dispose: " + instruction.componentType.name);
            return next.then(function (_) {
                var popedItem = _this.refCache.pop();
                var popedRef = popedItem.componentRef;
                if (_this.componentRef !== popedRef) {
                    throw new Error("Current componentRef is different for cached componentRef");
                }
                if (lang_1.isPresent(_this.componentRef)) {
                    _this.componentRef.dispose();
                    _this.componentRef = null;
                }
                if (lang_1.isPresent(popedItem.pageShimRef)) {
                    popedItem.pageShimRef.dispose();
                }
            });
        }
        else {
            return next;
        }
    };
    /**
     * Called by the {@link Router} during recognition phase of a navigation.
     * PageRouterOutlet will aways return true as cancelling navigation
     * is currently not supported in NativeScript.
     */
    PageRouterOutlet.prototype.routerCanDeactivate = function (nextInstruction) {
        this.log("routerCanDeactivate", nextInstruction);
        return _resolveToTrue;
    };
    /**
     * Called by the {@link Router} during recognition phase of a navigation.
     *
     * If the new child component has a different Type than the existing child component,
     * this will resolve to `false`. You can't reuse an old component when the new component
     * is of a different Type.
     *
     * Otherwise, this method delegates to the child component's `routerCanReuse` hook if it exists,
     * or resolves to true if the hook is not present and params are equal.
     */
    PageRouterOutlet.prototype.routerCanReuse = function (nextInstruction) {
        this.log("routerCanReuse", nextInstruction);
        var result;
        if (lang_1.isBlank(this.currentInstruction) || this.currentInstruction.componentType != nextInstruction.componentType) {
            result = false;
        }
        else if (route_lifecycle_reflector_1.hasLifecycleHook(routerHooks.routerCanReuse, this.currentInstruction.componentType)) {
            result = this.componentRef.instance
                .routerCanReuse(nextInstruction, this.currentInstruction);
        }
        else {
            result = nextInstruction == this.currentInstruction ||
                (lang_1.isPresent(nextInstruction.params) && lang_1.isPresent(this.currentInstruction.params) &&
                    collection_1.StringMapWrapper.equals(nextInstruction.params, this.currentInstruction.params));
        }
        common_1.log("PageRouterOutlet.routerCanReuse(): " + result);
        return async_1.PromiseWrapper.resolve(result);
    };
    /**
     * Called by the {@link Router} during recognition phase of a navigation.
     *
     * If this resolves to `false`, the given navigation is cancelled.
     *
     * This method delegates to the child component's `routerCanDeactivate` hook if it exists,
     * and otherwise resolves to true.
     */
    PageRouterOutlet.prototype.reuse = function (nextInstruction) {
        var previousInstruction = this.currentInstruction;
        this.currentInstruction = nextInstruction;
        if (lang_1.isBlank(this.componentRef)) {
            throw new Error("Cannot reuse an outlet that does not contain a component.");
        }
        return async_1.PromiseWrapper.resolve(route_lifecycle_reflector_1.hasLifecycleHook(routerHooks.routerOnReuse, this.componentRef.componentType) ?
            this.componentRef.instance.routerOnReuse(nextInstruction, previousInstruction) : true);
    };
    PageRouterOutlet.prototype.replaceChildRouter = function (childRouter) {
        // HACKY HACKY HACKY
        // When navigationg back - we need to set the child router of
        // our router - with the one we have created for the previosus page.
        // Otherwise router-outlets inside that page wont't work.
        // Curretly there is no other way to do that (parentRouter.childRouter() will create ne router).
        this.parentRouter["_childRouter"] = childRouter;
    };
    PageRouterOutlet.prototype.log = function (method, nextInstruction) {
        common_1.log("PageRouterOutlet." + method + " isBack: " + this.location.isPageNavigatingBack() + " nextUrl: " + nextInstruction.urlPath);
    };
    PageRouterOutlet = __decorate([
        core_1.Component({
            selector: 'page-router-outlet',
            template: "\n        <DetachedContainer>\n            <Placeholder #loader></Placeholder>\n        </DetachedContainer>"
        }),
        __param(3, core_1.Attribute('name')), 
        __metadata('design:paramtypes', [core_1.ElementRef, core_1.DynamicComponentLoader, router_1.Router, String, ns_location_strategy_1.NSLocationStrategy])
    ], PageRouterOutlet);
    return PageRouterOutlet;
}(router_1.RouterOutlet));
exports.PageRouterOutlet = PageRouterOutlet;
//# sourceMappingURL=page-router-outlet.js.map