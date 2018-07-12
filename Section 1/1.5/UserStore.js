export default class Users {
    constructor() {
        this.users = [
            {
                name: 'John',
                age: 21,
                location: 'Bangalore'
            },
            {
                name: 'Lily',
                age: 20,
                location: 'Mumbai'
            }
        ];
    }

    getAll() {
        return this.users;
    }

    add(userObj) {
        this.users.push(userObj);
    }
}