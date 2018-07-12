import Components from './components/components';
import FriendsStore from './data-stores/friends-store';
import MessagesStore from './data-stores/messages-store';
import Router from './utils/router';
import Authentication from './utils/authentication';

const router = new Router(['/app', '/app/support', '/app/about']);
const auth = new Authentication();

function initApp() {
    Components.register();
    router.subscribe(onRouteChange);
    document.addEventListener('DOMContentLoaded', () => {
        showLogin();
    });
}

function onRouteChange(newRoute, oldRoute) {
    if(newRoute.startsWith('/app')) {
        if(auth.isAuthenticated())
            showBuzzApp();
        else
            window.location.hash = '#/';
    }
    else if(newRoute === '/') {
        showLogin();
    }
}

function showBuzzApp() {
    const frndStore = new FriendsStore(auth);
    const msgStore = new MessagesStore(auth);
    document.querySelector('#main-content').innerHTML = '<buzz-app brand-name="BuzzApp />" href="#/"></buzz-app>';
    const buzzAppEl = document.querySelector('buzz-app');
    router.subscribe(buzzAppEl.onRouteChange.bind(buzzAppEl));
    Promise.all([frndStore.loadFriendsData(), frndStore.loadUsersData(), msgStore.loadData()]).then(() => {
        buzzAppEl.updateSidebar(frndStore);
        buzzAppEl.setStores(msgStore, frndStore);
        buzzAppEl.init();
    });
}

function showLogin() {
    const mainContent = document.querySelector('#main-content');
    mainContent.innerHTML = '<my-login></my-login>';
    mainContent.querySelector('my-login').setAuthService(auth);
    window.location.hash = '#/';
}

initApp();