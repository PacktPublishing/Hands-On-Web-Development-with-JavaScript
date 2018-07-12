export default class Router {
    constructor(routes, defaultRoute = '/') {
        this.routes = routes;
        this.routes.push(defaultRoute);
        this.defaultRoute = defaultRoute;
        // buzz.app/#/support => /support
        this.lastRoute = window.location.hash.substr(1);
        this.callbacks = [];
        window.addEventListener('hashchange', this.onRouteChange.bind(this));
    }

    onRouteChange(event) {
        const currRoute = window.location.hash.substr(1);
        const lastRoute = this.lastRoute;
        if(this.routes.indexOf(currRoute) === -1) {
            window.location.hash = `#${lastRoute}`;
        }
        else if(currRoute !== lastRoute) {
            this.callbacks.forEach(fn => {
                fn(currRoute, lastRoute);
            });
            this.lastRoute = currRoute;
        }
    }

    subscribe(callbackFn) {
        if(this.callbacks.indexOf(callbackFn) === -1)  {
            this.callbacks.push(callbackFn);
        }
    }

    unsubscribe(callbackFn) {
        const idx = this.callbacks.indexOf(callbackFn);
        if(idx !== -1) {
            this.callbacks.splice(idx, 1);
        }
    }
}