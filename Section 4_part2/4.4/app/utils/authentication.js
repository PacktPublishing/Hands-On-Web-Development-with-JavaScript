export default class Authentication {
    constructor() {
        this.authenticatedUser = null;
    }

    setAuthUser(user) {
        this.authenticatedUser = user;
    }

    getAuthUser() {
        return this.authenticatedUser;
    }

    isAuthenticated() {
        return !!this.authenticatedUser;
    }
}