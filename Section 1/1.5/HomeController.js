export default class HomeController {
    constructor(userstore) {
        this.users = userstore;
    }

    changeName() {
        const msgEl = document.querySelector('#welcomeMessage');
        const inputEl = document.querySelector('input[name="name"]');
        msgEl.textContent = inputEl.value === '' ? 'Hello!' : `Hello, ${inputEl.value}!`;
    }
    
    renderUsers() {
        const userDataArr = this.users.getAll();
        const tableEl = document.querySelector('#userData');
        let tableKeys = [];
        let tableTemplate = '';
    
        /**Table Header */
        tableTemplate += '<thead class="thead-dark"><tr>';
        for(let key in userDataArr[0]) {
            tableTemplate += `<th>${key}</th>`;
            tableKeys.push(key);
        }
        tableTemplate += '</tr></thead>';
    
        /**Table Body */
        tableTemplate += '<tbody>';
        userDataArr.forEach(userObj => {
           tableTemplate += '<tr>';
           tableKeys.forEach(key => {
               tableTemplate += `<td>${userObj[key]}</td>`;
           }) 
           tableTemplate += '</tr>';
        });
        tableTemplate += '</tbody>';
    
        tableEl.innerHTML = tableTemplate;
    }
    
    addUser() {
        const inputEl = document.querySelector('input[name="name"]');
        if(inputEl.value !== '') {
            this.users.add({
                name: inputEl.value,
                age: 18,
                location: 'Bangalore'
            });
        }
        this.renderUsers();
    }

    show() {
        const welcomeContent = document.querySelector('#welcomeContent');
        welcomeContent.classList.remove('d-none');
        this.renderUsers();
    }
}