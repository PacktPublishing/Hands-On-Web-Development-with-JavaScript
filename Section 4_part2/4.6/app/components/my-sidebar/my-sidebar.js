import './my-sidebar.scss';

export default class MySidebar extends HTMLElement {
    constructor() {
        super();
        const parser = new DOMParser();
        const templateStr = /*html*/`
        <template id="my-sidebar">
            <my-modal modal-title="Profile" primary-action="Okay" secondary-action="Close"></my-modal>
            <input type="text" id="friends-search-input" class="form-control rounded-0" placeholder="Search...">
            <div class="d-flex flex-row bg-dark align-items-center text-light">
                <span class="p-2">Add</span>
                <span id="add-group" class="oi oi-people link p-2"></span>
                <span id="filter-list" class="oi oi-people link p-2 ml-auto"></span>
                <span id="sort-list" class="oi oi-sort-ascending link p-2"></span>
            </div>
            <div id="new-group" class="bg-light flex-row align-items-center text-dark justify-content-between d-none">
                <input type="text" id="group-name" class="form-control rounded-0 w-75" placeholder="New group name..">
                <span id="save-group" class="oi oi-check link p-2 text-primary"></span>
                <span id="cancel-group" class="oi oi-x link p-2 text-secondary"></span>
            </div>
            <ul class="list-group list-group-flush friend-list"></ul>
            <ul class="list-group list-group-flush search-list d-none"></ul>
        </template>`;
        this.frndStore = {};
        this.template = parser.parseFromString(templateStr, "text/html");
    }

    getAllUsers() {
        return this.frndStore.getAllUsers();
    }

    render() {
        const shadowTemplate = this.template.querySelector('template#my-sidebar').content.cloneNode(true);
        shadowTemplate.querySelector('#friends-search-input').addEventListener('input', (event) => {
            let searchText = event.target.value;
            let friendsData = this.getFriendsData();
            let usersData = [];
            if(searchText) {
                searchText = searchText.toLowerCase();
                friendsData = friendsData.filter(friend => friend.name.toLowerCase().indexOf(searchText) !== -1);
                usersData = this.getAllUsers().filter(user => user.name.toLowerCase().indexOf(searchText) !== -1);
            }
            this.renderFriends(friendsData);
            this.renderSearchResults(usersData);
        });
        const newGroupEl = shadowTemplate.querySelector('#new-group');
        newGroupEl.querySelector('#save-group').addEventListener('click', (event) => {
            const inpGroup = newGroupEl.querySelector('#group-name');
            this.addGroup(inpGroup.value);
            newGroupEl.classList.remove('d-flex');
            newGroupEl.classList.add('d-none');
            inpGroup.value = '';
        });
        newGroupEl.querySelector('#cancel-group').addEventListener('click', (event) => {
            const inpGroup = newGroupEl.querySelector('#group-name');
            newGroupEl.classList.remove('d-flex');
            newGroupEl.classList.add('d-none');
            inpGroup.value = '';
        });
        shadowTemplate.querySelector('#add-group').addEventListener('click', (event) => {
            newGroupEl.classList.remove('d-none');
            newGroupEl.classList.add('d-flex');
        });
        shadowTemplate.querySelector('#sort-list').addEventListener('click', () => {
            this.toggleSort();
        });
        shadowTemplate.querySelector('#filter-list').addEventListener('click', () => {
            this.toggleFilter();
        });
        this.appendChild(shadowTemplate);
    }

    addGroup(name) {
        this.frndStore.addGroup(name);
        this.renderFriends();
    }

    setFriendsStore(frndStore) {
        this.frndStore = frndStore;
        this.render();
        this.renderFriends();
    }

    getFriendsData() {
        return this.frndStore.getAll();
    }

    getGroupsData() {
        return this.frndStore.getAllGroups();
    }

    addUserToGroup(grpid, userid) {
        this.frndStore.addUserToGroup(grpid, userid);
        this.emitSelectedEvent();
    }

    renderFriends(friendsData) {
        friendsData = friendsData || this.getFriendsData();
        let friendsTemplate = '';
        const groupsData = this.getGroupsData();
        let addGroupsTemplate = '';
        groupsData.forEach(grp => {
            addGroupsTemplate += `<a class="dropdown-item" data-groupid="${grp.userid}">${grp.name}</a>`;
        });
        const moveUpTemplate = (userid, idx) => idx !== 0 ? `<span class="oi oi-caret-top reorder-icon" data-userid="${userid}"></span>` : '';

        const moveDownTemplate = (userid, idx) => idx !== friendsData.length-1 ? `<span class="oi oi-caret-bottom reorder-icon" data-userid="${userid}"></span>` : '';

        friendsData.forEach((obj, idx) => {
            const icon = obj.type === 'user' ? 'oi-person' : 'oi-people';
            const addToIcon = obj.type === 'user' && groupsData.length > 0 ? `
            <div class="drop-left float-right" data-userid="${obj.userid}">
                <span class="oi oi-plus"></span>
                <div class="dropdown-menu">
                    ${addGroupsTemplate}
                </div>
            </div>
            ` : '';
            friendsTemplate += `
            <li class="list-group-item list-group-item-info list-group-item-action friend-item" draggable="true" data-userid="${obj.userid}">
                ${moveUpTemplate(obj.userid, idx)}
                ${moveDownTemplate(obj.userid, idx)}
                <span class="oi ${icon} link" data-userid="${obj.userid}"></span>
                <span>${obj.name}</span>
                ${addToIcon}
            </li>`;
        });
        const friendList = this.querySelector('ul.friend-list');
        friendList.innerHTML = friendsTemplate;
        const modal = this.querySelector('my-modal');
        this.querySelectorAll('div.drop-left').forEach(el => {
            el.addEventListener('mouseover', (event) => {
                el.querySelector('.dropdown-menu').classList.add('show');
            });
            el.addEventListener('mouseout', (event) => {
                el.querySelector('.dropdown-menu').classList.remove('show');
            });
            el.querySelectorAll('.dropdown-item').forEach(ddEl => {
                ddEl.addEventListener('click', (event) => {
                    this.addUserToGroup(ddEl.dataset.groupid, el.dataset.userid);
                    event.preventDefault();
                    event.stopPropagation();
                });
            });
        });
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
                this.selectedFriend = event.currentTarget.dataset.userid;
                this.emitSelectedEvent();
                event.preventDefault();
                event.stopPropagation();
            });
        });
        friendList.querySelectorAll('span.oi.oi-caret-top').forEach(el => {
            el.addEventListener('click', event => {
                this.moveItemUp(event.target.dataset.userid);
                event.preventDefault();
                event.stopPropagation();
            });
        });
        friendList.querySelectorAll('span.oi.oi-caret-bottom').forEach(el => {
            el.addEventListener('click', event => {
                this.moveItemDown(event.target.dataset.userid);
                event.preventDefault();
                event.stopPropagation();
            });
        });
    }

    renderSearchResults(usersData) {
        let usersTemplate = `<div class="dropdown-divider"></div>`;
        const searchList = this.querySelector('ul.search-list');
        if(usersData.length === 0) {
            searchList.classList.add('d-none');
        }
        else {
            usersData.forEach(obj => {
                usersTemplate += `
                <li class="list-group-item list-group-item-info list-group-item-action friend-item" draggable="true" data-userid="${obj.userid}">
                    <span class="oi oi-person link" data-userid="${obj.userid}"></span>
                    <span>${obj.name}</span>
                    <span class="oi oi-plus float-right" data-userid="${obj.userid}"></span>
                </li>`;
            });
            searchList.innerHTML = usersTemplate;
            searchList.querySelectorAll('span.oi.oi-person').forEach((el) =>{
                el.addEventListener('click', (event) => {
                    const userObj = usersData.filter(obj => obj.userid === event.target.dataset.userid).pop();
                    modal.setBody(`
                    <h2>${userObj.name}</h2>
                    <label for="profile-age">Age: </label><span id="profile-age"> ${userObj.age}</span>
                    <label for="profile-location">Location: </label><span id="profile-location"> ${userObj.location}</span>`);
                    modal.open();
                    event.preventDefault();
                    event.stopPropagation();
                });
            });
            searchList.querySelectorAll('span.oi.oi-plus').forEach((el) =>{
                el.addEventListener('click', (event) => {
                    this.addFriend(event.target.dataset.userid);
                    event.preventDefault();
                    event.stopPropagation();
                });
            });
            searchList.classList.remove('d-none');
        }        
    }

    addFriend(userid) {
        this.frndStore.addFriend(userid);
        this.renderFriends();
    }

    moveItemUp(id) {
        this.frndStore.moveUp(id);
        this.renderFriends();
    }

    moveItemDown(id) {
        this.frndStore.moveDown(id);
        this.renderFriends();
    }

    toggleSort() {
        this.sortOrder = this.sortOrder ? false : true;
        const sortEl = this.querySelector('#sort-list');
        sortEl.classList.remove(this.sortOrder ? 'oi-sort-ascending' : 'oi-sort-descending');
        sortEl.classList.add(this.sortOrder ? 'oi-sort-descending' : 'oi-sort-ascending');
        this.frndStore.sortList(this.sortOrder ? 'ascending' : 'descending');
        this.renderFriends();
    }

    toggleFilter() {
        this.onlyGroups = this.onlyGroups ? false : true;
        if(this.onlyGroups) {
            this.renderFriends(this.frndStore.getAllGroups());
        }
        else {
            this.renderFriends();
        }
    }

    emitSelectedEvent() {
        this.dispatchEvent(new CustomEvent('friend-selected', {
            detail: {
                userid: this.selectedFriend
            },
            bubbles: true
        }));
    }

    init() {
        const firstListItem = this.querySelector('ul.friend-list li');
        if(firstListItem)
            firstListItem.click();
    }

    static register() {
        customElements.define('my-sidebar', this);
    }
}