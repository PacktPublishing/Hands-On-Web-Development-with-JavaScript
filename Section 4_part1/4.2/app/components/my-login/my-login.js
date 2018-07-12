import Resources from '../../utils/resources';

export default class MyLogin extends HTMLElement {
    constructor() {
        super();
        const templateStr = /*html*/`
        <template id="my-login">
            <form name="registration-form" class="col-md-6 mx-auto needs-validation">
                <h2 class="text-center text-success my-4" id="form-heading">BuzzApp Registration</h2>
                <div class="form-group" id="input-name">
                    <label for="fullName">Name</label>
                    <input type="text" class="form-control" id="fullName" placeholder="Enter your name" pattern="[a-zA-Z ]+" max-length=20 min-length=5 required>
                    <div class="invalid-feedback">
                        Please fill name.
                    </div>
                </div>
                <div class="form-group" id="input-username">
                    <label for="username">Username</label>
                    <input type="text" class="form-control" id="username" placeholder="Username" pattern="[a-zA-Z]+" max-length=16 min-length=4 required>
                    <div class="invalid-feedback">
                        Please fill username.
                    </div>
                </div>
                <div class="form-group" id="input-password">
                    <label for="password">Password</label>
                    <input type="password" class="form-control" id="password" placeholder="Password" pattern="(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#\$%]).{8,16}" required>
                    <div class="invalid-feedback">
                        Please use a valid password.
                    </div>
                </div>
                <div class="form-group" id="input-dob">
                    <label for="exampleDOB1">DOB</label>
                    <input type="date" class="form-control" id="dob" placeholder="YYYY-MM-DD" pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}" min="1980-01-01" max="1998-01-01" required>
                    <div class="invalid-feedback">
                        Please fill DOB.
                    </div>
                </div>
                <div class="form-group" id="input-location">
                    <label for="location">Country</label>
                    <select id="location" class="custom-select" required>
                        <option value="">--Select One--</option>
                        <option value="India">India</option>
                        <option value="Australia">Australia</option>
                        <option value="US">US</option>
                        <option value="Russia">Russia</option>
                    </select>
                    <div class="invalid-feedback">
                        Please select location.
                    </div>
                </div>
                <button id="submit-form-button" class="btn btn-primary">Register</button>
                <a id="goto-login" href="#">Already a member?</a>
            </form>
        </template>`;
        const parser = new DOMParser();
        this.template = parser.parseFromString(templateStr, "text/html");
        this.isLoginDisplayed = false; 
        this.resources = new Resources();
    }

    connectedCallback() {
        this.render();
    }

    render() {
        const shadowTemplate = this.template.querySelector('template#my-login').content.cloneNode(true);
        shadowTemplate.querySelector('#submit-form-button').addEventListener('click', this.submitForm.bind(this));
        shadowTemplate.querySelector('#goto-login').addEventListener('click', this.toggleLogin.bind(this));
        this.appendChild(shadowTemplate);
    }

    toggleLogin(event) {
        this.isLoginDisplayed = !this.isLoginDisplayed;
        if(this.isLoginDisplayed) {
            const itemsToBeRemoved = ['input-name', 'input-dob', 'input-location'];
            const formEl = this.querySelector("form[name='registration-form']");
            itemsToBeRemoved.forEach(item => {
                formEl.removeChild(formEl.querySelector(`#${item}`));
            });
            formEl.querySelector('#form-heading').textContent = 'BuzzApp Login';
            formEl.querySelector('#submit-form-button').textContent = 'Login';
            formEl.querySelector('#goto-login').textContent = 'New User?';
        }
        else {
            this.innerHTML = '';
            this.render();
        }
        event.preventDefault();
        event.stopPropagation();
    } 

    submitForm(event) {
        const formEl = this.querySelector("form[name='registration-form']");
        if(this.isLoginDisplayed) {
            const credentials = {
                password: formEl.querySelector('#password').value,
                userid: formEl.querySelector('#username').value
            };
            this.loginUser(credentials);
        }
        else {
            formEl.classList.remove('needs-validation');
            formEl.classList.add('was-validated');
            if(formEl.checkValidity()) {
                const userObj = {
                    name: formEl.querySelector('#fullName').value,
                    dob: formEl.querySelector('#dob').value,
                    password: formEl.querySelector('#password').value,
                    userid: formEl.querySelector('#username').value,
                    location: formEl.querySelector('#location').value
                };
                this.registerUser(userObj);
            }
        }
        event.preventDefault();
        event.stopPropagation();
    }

    registerUser(userObj) {
        this.resources.registerUser(userObj).then(authUser => {
            this.authService.setAuthUser(authUser);
            window.location.hash = '#/app';            
        }).catch(err => {
            console.error(err);
        });
    }

    loginUser(credentials) {
        this.resources.authenticate(credentials).then(authUser => {
            this.authService.setAuthUser(authUser);
            window.location.hash = '#/app';
        }).catch(err => {
            console.error(err);
        });
    }

    setAuthService(auth) {
        this.authService = auth;
    }

    static register() {
        customElements.define('my-login', this);
    }
}