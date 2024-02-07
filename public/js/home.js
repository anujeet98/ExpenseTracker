const username = document.getElementById("username");
const email = document.getElementById("email");
const emailSignin = document.getElementById("email-signin");
const phone = document.getElementById("phone");
// const password = document.getElementById("password");
const passwordSignIn = document.getElementById("password-signin");
const passwordSignUp = document.getElementById("password-signup");
const forgetEmail = document.getElementById("fg-email")
const signupBtn =  document.getElementById("signup");
const signinBtn = document.getElementById("signin");
const resetPsswdBtn = document.getElementById('resetpsswd');
const formWindow = document.getElementById('form');
const BACKEND_ADDRESS = 'http://34.229.158.3:80';

if(signupBtn)
    signupBtn.addEventListener("click", signup);
if(signinBtn)
    signinBtn.addEventListener("click", signin);
if(resetPsswdBtn)
    resetPsswdBtn.addEventListener('click', forgetPassword);


function ValidateEmail(input) {
    var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (input.value.match(validRegex)) {
        return true;
    } else {
        return false;
    }
}
function validatePhone(input){
    var validRegex = /^(\+\d{1,2}\s?)?1?\-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
    if (input.value.match(validRegex)) {
        return true;
    } else {
        return false;
    }
}


function toggleForm(event) {
    for(const child of formWindow.children){
        if(!child.classList.contains('inactive')){
            child.classList.toggle('inactive');
            break;
        }
    }
    if(!event)
        return document.getElementById('sign-in').classList.toggle('inactive');
    document.getElementById(event.target.getAttribute('formid')).classList.toggle('inactive');
}


async function signup(event){
    try{
        event.preventDefault();
        if(username.value==='' || email.value==='' || passwordSignUp.value==='')
            return alert('Please enter all the fields');
        if(!ValidateEmail(email))
            return alert('Please enter a valid email');
        const reqObj = {
            username: username.value,
            email: email.value,
            password: passwordSignUp.value,
        }
        username.value = '';
        passwordSignUp.value = '';
        email.value = '';

        const response = await axios.post(`${BACKEND_ADDRESS}/user/signup`, reqObj);
        if(response.status === 201){
            alert(response.data.message);
            // window.location.href = "sign-in.html";
            toggleForm();
        }
    }
    catch(err){
        if(err.response)
            return alert(err.response.data.error);
        return alert(err);
    }

}



async function signin(event){
    try{
        event.preventDefault();
        if(emailSignin.value==='' || passwordSignIn.value===''){
            return alert('Please enter all the fields');
        }

        const reqObj = {
            email: emailSignin.value,
            password: passwordSignIn.value,
        }
        passwordSignIn.value = '';
        emailSignin.value = '';

        const response = await axios.post(`${BACKEND_ADDRESS}/user/signin`, reqObj);
        if(response.status === 201){
            localStorage.removeItem('savedmessages');
            localStorage.setItem('token', response.data.token);
            alert(response.data.message);
            window.location.href = "expense.html";
        }
    }
    catch(err){
        if(err.response)
            return alert(err.response.data.error);
        return alert(err);
    }

}

async function forgetPassword(e){
    try{
        e.preventDefault();
        if(forgetEmail.value.length===0 || forgetEmail.value===''){
            return alert('kindly fill your email');
        }
    
        const response = await axios.get(`${BACKEND_ADDRESS}/password/forget/${forgetEmail.value}`);
        if(response.status === 200){
            alert(response.data.message);
        }
    }
    catch(err){
        if(err.response) 
            alert(err.response.data.error);
    }
}