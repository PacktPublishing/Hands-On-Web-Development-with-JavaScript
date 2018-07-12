import BuzzApp from './buzz-app/buzz-app';
import MyNav from './my-nav/my-nav';
import MySidebar from './my-sidebar/my-sidebar';
import MyModal from './my-modal/my-modal';

export default class Components {
    static register() {
        MyNav.register();
        MyModal.register();
        MySidebar.register();
        BuzzApp.register();
    }
}