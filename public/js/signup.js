const username = document.getElementById("username");
const email = document.getElementById("email");
const password = document.getElementById("password");
const submitBtn = document.getElementById("submit");

const BACKEND_ADDRESS = '54.234.60.93:3000';

//=====================================================================================================


submitBtn.addEventListener('click', postSignup);


//===================================================================================================



async function postSignup(event){
    event.preventDefault();
    try
    {
        if(username.value=='' || email.value==''|| password.value==''){
            return alert('please fill all the fields');
        }

        const signupObj = {
            username: username.value,
            email: email.value,
            password: password.value
        };
        const response = await axios.post(`http://${BACKEND_ADDRESS}/user/signup`, signupObj);
        if(response.status===201){
            alert('user created successfully.\nKindly login now..');
            clearUserForm();
            window.location.href = "login.html";
        }
    }catch(err){
        if (err.response) {
            document.body.innerHTML += `<div style="color:red">${err}: ${err.response.data.error}</div>`;
            return alert(err.response.data.error);
        }
    }
}



function clearUserForm(){
    username.value='';
    email.value='';
    password.value='';
}
