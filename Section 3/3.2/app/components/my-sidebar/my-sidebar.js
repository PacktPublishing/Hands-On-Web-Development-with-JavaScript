export default class MySidebar extends HTMLElement {
    constructor() {
        super();
        const parser = new DOMParser();
        const templateStr = /*html*/`
        <template id="my-sidebar">
            <my-modal modal-title="Profile" primary-action="Okay" secondary-action="Close"></my-modal>
            <input type="text" id="friends-search-input" class="form-control rounded-0" placeholder="Search...">
            <ul class="list-group list-group-flush friend-list"></ul>
        </template>`;
        this.frndStore = {};
        this.template = parser.parseFromString(templateStr, "text/html");
    }

    connectedCallback() {
        if(!this.hasChildNodes())
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
            <li class="list-group-item list-group-item-info list-group-item-action friend-item" data-userid="${obj.userid}">
                <span class="oi oi-person link" data-userid="${obj.userid}"></span>
                <span>${obj.name}</span>
            </li>`;
        });
        const friendList = this.querySelector('ul.friend-list');
        friendList.innerHTML = friendsTemplate;
        const modal = this.querySelector('my-modal');
        friendList.querySelectorAll('span.oi.oi-person').forEach((el) =>{
            el.addEventListener('click', (event) => {
                const friendObj = friendsData.filter(obj => obj.userid === event.target.dataset.userid).pop();
                modal.setBody(`
                <h2>${friendObj.name}</h2>
                <label for="profile-age">Age: </label><span id="profile-age"> ${friendObj.age}</span>
                <label for="profile-location">Location: </label><span id="profile-location"> ${friendObj.location}</span>`);
                modal.open();
                event.preventDefault();
                event.stopPropagation();
            });
        });
        friendList.querySelectorAll('li').forEach(el => {
            el.addEventListener('click', (event) => {
                el.dispatchEvent(new CustomEvent('friend-selected', {
                    detail: {
                        userid: event.target.dataset.userid
                    },
                    bubbles: true
                }));
                event.preventDefault();
                event.stopPropagation();
            });
        })
    }

    init() {
        this.querySelector('ul li').click();
    }

    static register() {
        customElements.define('my-sidebar', this);
    }
}