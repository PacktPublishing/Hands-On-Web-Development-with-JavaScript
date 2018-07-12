export default class BuzzApp extends HTMLElement {
    constructor() {
        super();
        const templateStr = /*html*/`
        <template id="buzz-app">
            <div class="col-md-3 bg-dark p-0 scrollable float-left">
                <my-nav></my-nav>
                <my-sidebar></my-sidebar>
            </div>
            <div class="col-md-9 bg-secondary p-0 scrollable">
                <my-chat></my-chat>
            </div>
        </template>`;
        const parser = new DOMParser();
        this.template = parser.parseFromString(templateStr, "text/html");
    }

    connectedCallback() {
        this.render();
    }

    render() {
        const shadowTemplate = this.template.querySelector('template#buzz-app').content.cloneNode(true);
        const navbarBrand = shadowTemplate.querySelector('my-nav');
        navbarBrand.setAttribute('brand-name', this.getAttribute('brand-name'));
        navbarBrand.setAttribute('href', this.getAttribute('href'));
        this.addEventListener('friend-selected', (event) => {
            this.updateChatWindow(event.detail.userid);
            event.preventDefault();
            event.stopPropagation();
        });
        this.appendChild(shadowTemplate);
    }

    updateSidebar(frndStore) {
        this.querySelector('my-sidebar').setFriendsStore(frndStore);
    }

    setMessagesStore(msgStore) {
        this.querySelector('my-chat').setMessagesStore(msgStore);
    }

    updateChatWindow(userId) {
        this.querySelector('my-chat').renderMessagesForFriend(userId);
    }

    init() {
        this.querySelector('my-sidebar').init();
    }

    static register() {
        customElements.define('buzz-app', this);
    }
}