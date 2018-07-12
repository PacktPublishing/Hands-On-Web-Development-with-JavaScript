const userDataArr = [
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

function changeName() {
    const msgEl = document.querySelector('#welcomeMessage');
    const inputEl = document.querySelector('input[name="name"]');
    msgEl.textContent = inputEl.value === '' ? 'Hello!' : `Hello, ${inputEl.value}!`;
}

function changeTextColor(textClass) {
    const msgEl = document.querySelector('#welcomeMessage');
    ['text-primary', 'text-success', 'text-danger'].forEach(tClass => {
        msgEl.classList.remove(tClass);
    });
    msgEl.classList.add(textClass);
}

function renderUsers() {
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

function addUser() {
    const inputEl = document.querySelector('input[name="name"]');
    if(inputEl.value !== '') {
        userDataArr.push({
            name: inputEl.value,
            age: 18,
            location: 'Bangalore'
        });
    }
    renderUsers();
}

document.addEventListener('DOMContentLoaded', renderUsers);