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
        this.addEventListener('friend-selected', (event) => {
            this.updateChatWindow(event.detail.userid);
            event.preventDefault();
            event.stopPropagation();
        });
    }

    connectedCallback() {
        this.render();
    }

    render() {
        const shadowTemplate = this.template.querySelector('template#buzz-app').content.cloneNode(true);
        const navbarBrand = shadowTemplate.querySelector('my-nav');
        navbarBrand.setAttribute('brand-name', this.getAttribute('brand-name'));
        navbarBrand.setAttribute('href', this.getAttribute('href'));
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

    onRouteChange(newRoute, oldRoute) {
        if(newRoute === '/support') {
            this.renderSupport();
        }
        else if(newRoute === '/') {
            this.showSidebar();
            this.showChat();
        } 
    }

    renderSupport() {
        this.hideSidebar();
        this.hideChat();
        this.querySelector('.col-md-9').innerHTML = /*html*/`
        <div class="col-md-8 offset-md-2 my-3 card text-center">
            <div class="card-header">
                Support
            </div>
            <div class="card-body">
                <p class="card-text"><span>support@buzz.app </span><span>+9-876-543-210</span></p>
            </div>
        </div>
        `;
    }

    hideSidebar() {
        this.sidebarNode = this.querySelector('my-sidebar');
        this.querySelector('.col-md-3').removeChild(this.sidebarNode);
    }

    showSidebar() {
        if(this.sidebarNode)
            this.querySelector('.col-md-3').appendChild(this.sidebarNode);
    }

    hideChat() {
        this.chatNode = this.querySelector('my-chat');
        this.querySelector('.col-md-9').removeChild(this.chatNode);
    }

    showChat() {
        if(this.chatNode) {
            const rightDiv = this.querySelector('.col-md-9');
            rightDiv.innerHTML = '';
            rightDiv.appendChild(this.chatNode);
        }
    }

    static register() {
        customElements.define('buzz-app', this);
    }
}