import Users from './UserStore';
import HomeController from './HomeController';
import RegistrationController from './RegistrationController';

const users = new Users();
const HomeCtrl = new HomeController(users);
const RegCtrl = new RegistrationController(users, HomeCtrl.show.bind(HomeCtrl));

document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('input[name="name"]').addEventListener('input', HomeCtrl.changeName.bind(HomeCtrl));

    document.querySelector('#welcomeContent button').addEventListener('click', HomeCtrl.addUser.bind(HomeCtrl));

    document.querySelector('form[name="registration-form"] button').addEventListener('click', RegCtrl.submitForm.bind(RegCtrl));
});