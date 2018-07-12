export default class FriendsStore {
    constructor() {
        this.friendsData = [];
    }

    loadData() {
        return new Promise((resolve, reject) => {
            this.friendsData = [
                {
                    name: 'John',
                    userid: 'john4'
                },
                {
                    name: 'Cathy',
                    userid: 'cathy'
                },
                {
                    name: 'Rama',
                    userid: 'rama3'
                }
            ];
            resolve(this.friendsData);
        });
    }

    getAll() {
        return this.friendsData;
    }
}