import Components from './components/components';
import FriendsStore from './data-stores/friends-store';
import MessagesStore from './data-stores/messages-store';
import Router from './utils/router';

function initApp() {
    Components.register();
    const frndStore = new FriendsStore();
    const msgStore = new MessagesStore();
    const router = new Router(['/support', '/about']);

    document.addEventListener('DOMContentLoaded', () => {
        const buzzAppEl = document.querySelector('buzz-app');
        router.subscribe(buzzAppEl.onRouteChange.bind(buzzAppEl));
        Promise.all([frndStore.loadData(), msgStore.loadData()]).then(() => {
            buzzAppEl.updateSidebar(frndStore);
            buzzAppEl.setMessagesStore(msgStore);
            buzzAppEl.init();
        })
    });
}

initApp();