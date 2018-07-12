import BuzzApp from './buzz-app/buzz-app';
import MyNav from './my-nav/my-nav';
import MySidebar from './my-sidebar/my-sidebar';

export default class Components {
    static register() {
        MyNav.register();
        MySidebar.register();
        BuzzApp.register();
    }
}