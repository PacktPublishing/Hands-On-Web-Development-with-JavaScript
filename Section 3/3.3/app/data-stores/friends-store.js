export default class FriendsStore {
    constructor() {
        this.friendsData = [];
    }

    loadData() {
        return new Promise((resolve, reject) => {
            this.friendsData = [
                {
                    name: 'John',
                    userid: 'john4',
                    age: 22,
                    location: "Bengaluru",
                    type: "user"
                },
                {
                    name: 'Cathy',
                    userid: 'cathy',
                    age: 22,
                    location: "Bengaluru",
                    type: "user"
                },
                {
                    name: 'Rama',
                    userid: 'rama3',
                    age: 22,
                    location: "Bengaluru",
                    type: "user"
                }
            ];
            resolve(this.friendsData);
        });
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

    getById(name) {
        return this.friendsData.filter(obj => obj.userid === name).pop();
    }

    isGroup(id) {
        return this.getAllGroups().filter(obj => obj.userid === id).length > 0;
    }

    addGroup(grpId) {
        const grp = this.getById(grpId);
        if(!grp) {
            this.friendsData.push({
                name: grpId,
                userid: grpId,
                type: 'group',
                friendList: []
            });
        }
    }

    addUserToGroup(grpId, userid) {
        const grp = this.getById(grpId);
        if(grp.friendList.indexOf(userid) === -1)
            grp.friendList.push(userid);
    }
}