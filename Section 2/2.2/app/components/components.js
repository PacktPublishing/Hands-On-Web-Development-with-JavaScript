import BuzzApp from './buzz-app/buzz-app';
import MyNav from './my-nav/my-nav';

export default class Components {
    static register() {
        MyNav.register();
        BuzzApp.register();
    }
}