let users = [];
let guest = false;

async function init() { }

async function register(event) {
    event.preventDefault();

    const partialUser = grabFormData();
    // fetchUsers();
    // users.push(formdata);
    // setUsers();
    debugger
    try {
        //register user with formdata - checking done already- in HOPE
        const res = await registerUser(partialUser);
        clearForm();
        successSignUpPopup();
        renderLoginWindow();
    } catch (error) {
        console.error(error);
    }

}

async function fetchUsers() {
    users = JSON.parse(await getItem('users'));
}

async function setUsers() {
    users = JSON.parse(await setItem('users'));
}

function clearForm() {
    document.getElementById('SignUpForm').reset();
}

function grabFormData() {
    let mailInput = document.getElementById("registerMailInput");
    let userName = document.getElementById("registerUserName");
    let firstName = document.getElementById("registerFirstName");
    let registerPassword = document.getElementById("registerPassword");

    return {
        "email": mailInput.value,
        "username": userName.value,
        "password": registerPassword.value,
        "firstname": firstName.value
    }
}


async function loadUsers() {
    try {
        users = JSON.parse(await getItem('users'));
    } catch (e) {
        console.error('Loading error:', e);
    }
}

async function checkLogin(event) {
    event.preventDefault();

    guest = false;
    localStorage.setItem('guest', 'guest');

    const username = document.getElementById('usernameLoginField').value;
    const password = document.getElementById('passwordLoginField').value;

    const loginUser = {
        'username': username,
        'password': password
    };
    try {
        const data = await logUserin(loginUser)
        user = data.user;
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('guest', false);
        localStorage.setItem('user', JSON.stringify(user));
        greetUserInSummary(user.username);
        window.location.href = "summary.html";
    } catch (error) {
        console.error('Could not login. ', error);
        userNameOrPasswordIncorrect();
    }
}

function userNameOrPasswordIncorrect() {
    let invalidText = document.getElementById('invalidText');
    invalidText.innerHTML = `Wrong Username or Password!`;
}

//find current logged in User functions

function findUserNameByEmail(email) {
    const user = users.find(user => user.email === email);
    return user ? user.name : null;
}

async function greetUserInSummary(email) {
    const loggedInEmail = email;
    const name = findUserNameByEmail(loggedInEmail);
    localStorage.setItem("username", name);
}

//sign Up Logic

function openWithGuestLogin() {
    // guest = true;
    // localStorage.setItem('guest', JSON.stringify(guest));
    // window.location.href = "summary.html";
}

function registeredLogin() {
    window.location.href = "index.html";
}

//password validation in SignUp

function checkPasswords() {
    let userName = document.getElementById('registerUserName').value;
    let userMail = document.getElementById('registerMailInput').value;
    let signUpPassword = document.getElementById('registerPassword').value;
    let signUpConfirmPassword = document.getElementById('confirmPassword').value;
    let signUpButton = document.getElementById('signUpButton');
    let passwordsFalse = document.getElementById('signUpPasswordCheckText');
    if (signUpPassword == signUpConfirmPassword && userName.length > 0 && userMail.length > 0) {
        signUpButton.disabled = false;
        passwordsFalse.innerHTML = '';
    } else {
        passwordsFalse.innerHTML = `Passwords does not match`;
        signUpButton.disabled = true;
    }
}

// pop up

function successSignUpPopup() {
    const popupContainer = document.getElementById('successRegistration');
    popupContainer.classList.remove('d-none');
    setTimeout(function () {
        popupContainer.classList.add('d-none');
    }, 4500);
}

/* function showLoginTimeout() {
  setTimeout(function() {
    renderLoginWindow();
  }, 1500);
} */