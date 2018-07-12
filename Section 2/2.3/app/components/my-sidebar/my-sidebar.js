export default class MySidebar extends HTMLElement {
    constructor() {
        super();
        const parser = new DOMParser();
        const templateStr = /*html*/`
        <template id="my-sidebar">
            <input type="text" id="friends-search-input" class="form-control rounded-0" placeholder="Search...">
            <ul class="list-group list-group-flush friend-list"></ul>
        </template>`;
        this.frndStore = {};
        this.template = parser.parseFromString(templateStr, "text/html");
    }

    connectedCallback() {
        this.render();
    }

    render() {
        const shadowTemplate = this.template.querySelector('template#my-sidebar').content.cloneNode(true);
        shadowTemplate.querySelector('#friends-search-input').addEventListener('input', (event) => {
            let searchText = event.target.value;
            let friendsData = this.getFriendsData();
            if(searchText) {
                searchText = searchText.toLowerCase();
                friendsData = friendsData.filter(friend => friend.name.toLowerCase().indexOf(searchText) !== -1);
            }
            this.renderFriends(friendsData);
        });
        this.appendChild(shadowTemplate);
    }

    setFriendsStore(frndStore) {
        this.frndStore = frndStore;
        this.renderFriends();
    }

    getFriendsData() {
        return this.frndStore.getAll();
    }

    renderFriends(friendsData) {
        friendsData = friendsData || this.getFriendsData();
        let friendsTemplate = '';
        friendsData.forEach((obj) => {
            friendsTemplate += `
            <li class="list-group-item list-group-item-info list-group-item-action friend-item">
                <span>${obj.name}</span>
            </li>`;
        });
        this.querySelector('ul.friend-list').innerHTML = friendsTemplate;
    }

    static register() {
        customElements.define('my-sidebar', this);
    }
}