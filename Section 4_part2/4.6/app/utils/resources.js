export default class Resources {
    constructor() {
        this.authUrl = '/users/authenticate';
        this.usersUrl = '/users';
        this.getFriendsUrl = '/associations/friends';
        this.associationsUrl = '/associations';
        this.imageUploadUrl = '/imageUpload';
    }

    postRequest(url, jsonObj, responseType) {
        return new Promise((resolve, reject) => {
            fetch(url, {
                body: JSON.stringify(jsonObj),
                headers: {
                    'content-type': 'application/json'
                },
                method: 'POST'
            })
            .then(response => {
                response[responseType]().then(data => {
                    response.ok ? resolve(data) : reject(data);
                });
            })
            .catch(err => {
                reject(err);
            });
        });
    }

    uploadFile(url, file) {
        var formData = new FormData();
        formData.append('fileUpload', file);
        return new Promise((resolve, reject) => {
            fetch(url, {
                body: formData,
                method: 'POST'
            })
            .then(response => {
                response.text().then(data => {
                    response.ok ? resolve(data) : reject(data);
                });
            })
            .catch(err => {
                reject(err);
            });
        });
    }

    getRequest(url, queryParams, responseType) {
        queryParams = queryParams === '' ? '' : `?${queryParams}`;
        return new Promise((resolve, reject) => {
            fetch(`${url}${queryParams}`, {
                method: 'GET'
            })
            .then(response => {
                response[responseType]().then(data => {
                    response.ok ? resolve(data) : reject(data);
                });
            })
            .catch(err => {
                reject(err);
            });
        });
    }

    authenticate(credentials) {
        return this.postRequest(this.authUrl, credentials, 'text');
    }
    
    registerUser(userObj) {
        return this.postRequest(this.usersUrl, userObj, 'text');
    }

    getFriends(userid) {
        return this.getRequest(this.getFriendsUrl, `userid=${userid}`,'json');
    }

    getAllUsers() {
        return this.getRequest(this.usersUrl, '', 'json');
    }

    addAssociation(associationObj) {
        return this.postRequest(this.associationsUrl, associationObj, 'json');
    }

    uploadImage(file) {
        return this.uploadFile(this.imageUploadUrl, file);
    }
}