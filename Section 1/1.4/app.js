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

function getAgeFromDOB(dobStr) {
    const currDate = new Date();
    const dob = new Date(dobStr);
    return Math.floor((currDate - dob) / (1000 * 60 * 60 * 24 * 365));
}

function submitForm(event) {
    const formEl = document.querySelector('form[name="registration-form"]');
    if(formEl.checkValidity() && validateAge()) {
        registerUser({
            name: document.querySelector('#fullName').value,
            age: getAgeFromDOB(document.querySelector('#dob').value),
            location: document.querySelector('#location').value
        });
    }
    else {
        formEl.classList.remove('needs-validation');
        formEl.classList.add('was-validated');
    }
    event.preventDefault();
    event.stopPropagation();
}

function registerUser(userObj) {
    userDataArr.push(userObj);
    const formEl = document.querySelector('form[name="registration-form"]');
    formEl.classList.add('d-none');
    const welcomeContent = document.querySelector('#welcomeContent');
    welcomeContent.classList.remove('d-none');
    renderUsers();
}

function validateAge() {
    const dobEl = document.querySelector('#dob');
    const age = getAgeFromDOB(dobEl.value);
    if(age > 30 || age < 15) {
        dobEl.classList.remove('is-valid');
        dobEl.classList.add('is-invalid');
        return false;
    }
    else {
        dobEl.classList.remove('is-invalid');
        dobEl.classList.add('is-valid');
        return true;
    }
}