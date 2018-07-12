export default class RegistrationController {
    constructor(userstore, showHome) {
        this.users = userstore;
        this.showHome = showHome;
    }

    getAgeFromDOB(dobStr) {
        const currDate = new Date();
        const dob = new Date(dobStr);
        return Math.floor((currDate - dob) / (1000 * 60 * 60 * 24 * 365));
    }
    
    submitForm(event) {
        const formEl = document.querySelector('form[name="registration-form"]');
        if(formEl.checkValidity()) {
            this.registerUser({
                name: document.querySelector('#fullName').value,
                age: this.getAgeFromDOB(document.querySelector('#dob').value),
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
    
    registerUser(userObj) {
        this.users.add(userObj);
        const formEl = document.querySelector('form[name="registration-form"]');
        formEl.classList.add('d-none');
        this.showHome();
    }
}