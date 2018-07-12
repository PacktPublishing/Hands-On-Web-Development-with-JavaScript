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
                    location: "Bengaluru"
                },
                {
                    name: 'Cathy',
                    userid: 'cathy',
                    age: 22,
                    location: "Bengaluru"
                },
                {
                    name: 'Rama',
                    userid: 'rama3',
                    age: 22,
                    location: "Bengaluru"
                }
            ];
            resolve(this.friendsData);
        });
    }

    getAll() {
        return this.friendsData;
    }
}