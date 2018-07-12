import Resources from '../utils/resources';

export default class FriendsStore {
    constructor(authInstance) {
        this.friendsData = [];
        this.allUsers = [];
        this.auth = authInstance;
        this.resources = new Resources();
    }

    loadFriendsData() {
        return new Promise((resolve, reject) => {
            this.resources.getFriends(this.auth.getAuthUser())
            .then(response => {
                this.friendsData = response;
                resolve(response);
            })
            .catch(err => {
                console.error(err);
                reject(err);
            });
        });
    }

    loadUsersData() {
        return new Promise((resolve, reject) => {
            this.resources.getAllUsers()
            .then(response => {
                this.allUsers = response;
                this.self = this.allUsers.filter(obj => obj.userid === this.auth.getAuthUser()).pop();
                resolve(response);
            })
            .catch(err => {
                console.error(err);
                reject(err);
            });
        });
    }

    getAuthUser() {
        return this.getAnyUserById(this.auth.getAuthUser());
    }

    getAllUsers() {
        const friendsIds = this.getAllFriends().map(obj => obj.userid);
        friendsIds.push(this.auth.getAuthUser());
        return this.allUsers.filter(obj => friendsIds.indexOf(obj.userid) === -1);
    }

    getAllFriends() {
        return this.friendsData.filter(obj => obj.type === 'user');
    }

    getAllGroups() {
        return this.friendsData.filter(obj => obj.type === 'group');
    }

    getAll() {
        return this.friendsData;
    }

    getAnyUserById(id) {
        return this.allUsers.filter(obj => obj.userid === id).pop();
    }

    getById(id) {
        return this.friendsData.filter(obj => obj.userid === id).pop();
    }

    isGroup(id) {
        return this.getAllGroups().filter(obj => obj.userid === id).length > 0;
    }

    addFriend(userid) {
        const idx = this.allUsers.map(obj => obj.userid).indexOf(userid);
        const user = this.allUsers.slice(idx, idx+1).pop();
        user.type = 'user';
        this.friendsData.push(user);
        this.resources.addAssociation({
            userid: this.auth.getAuthUser(),
            associationId: userid,
            type: 'user'
        })
        .catch(err => {
            console.error(err);
        });
    }

    addGroup(grpId) {
        const grp = this.getById(grpId);
        if(!grp) {
            this.friendsData.push({
                name: grpId,
                userid: grpId,
                type: 'group',
                friendList: [this.auth.getAuthUser()]
            });
            this.resources.addAssociation({
                userid: this.auth.getAuthUser(),
                associationId: grpId,
                type: 'group'
            })
            .catch(err => {
                console.error(err);
            });
        }
    }

    addUserToGroup(grpId, userid) {
        const grp = this.getById(grpId);
        if(grp.friendList.indexOf(userid) === -1) {
            grp.friendList.push(userid);
            this.resources.addAssociation({
                userid: userid,
                associationId: grpId,
                type: 'group'
            })
            .catch(err => {
                console.error(err);
            });
        }
    }

    moveUp(id) {
        const idx = this.friendsData.map(obj => obj.userid).indexOf(id);
        const tmpList = this.friendsData.filter(obj => obj.userid !== id);
        const reorderedList = [
            ...tmpList.slice(0,idx-1),
            this.friendsData[idx],
            ...tmpList.slice(idx-1)
        ];
        this.friendsData = reorderedList;
    }

    moveDown(id) {
        const idx = this.friendsData.map(obj => obj.userid).indexOf(id);
        const tmpList = this.friendsData.filter(obj => obj.userid !== id);
        const reorderedList = [
            ...tmpList.slice(0,idx+1),
            this.friendsData[idx],
            ...tmpList.slice(idx+1)
        ];
        this.friendsData = reorderedList;
    }

    sortList(order) {
        let compareFn;
        if(order === 'ascending') {
            compareFn = (a, b) => {
                return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
            }
        }
        else {
            compareFn = (a, b) => {
                return b.name.toLowerCase().localeCompare(a.name.toLowerCase());
            }
        }
        this.friendsData.sort(compareFn);
    }
}