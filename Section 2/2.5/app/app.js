import Components from './components/components';
import FriendsStore from './data-stores/friends-store';
import MessagesStore from './data-stores/messages-store';

function initApp() {
    Components.register();
    const frndStore = new FriendsStore();
    const msgStore = new MessagesStore();

    document.addEventListener('DOMContentLoaded', () => {
        Promise.all([frndStore.loadData(), msgStore.loadData()]).then(() => {
            const buzzAppEl = document.querySelector('buzz-app');
            buzzAppEl.updateSidebar(frndStore);
            buzzAppEl.setMessagesStore(msgStore);
            buzzAppEl.init();
        })
    });
}

initApp();