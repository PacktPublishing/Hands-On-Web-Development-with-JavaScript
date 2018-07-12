import Components from './components/components';
import FriendsStore from './data-stores/friends-store';

Components.register();

const frndStore = new FriendsStore();

document.addEventListener('DOMContentLoaded', () => {
    frndStore.loadData().then(() => {
        document.querySelector('buzz-app').updateSidebar(frndStore);
    });
});