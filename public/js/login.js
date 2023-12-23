const email = document.getElementById("email");
const password = document.getElementById("password");
const submitBtn = document.getElementById("submit");
// const alertContainer = document.getElementById("alertContainer");
// const messageAlert = document.getElementById("messageAlert");
// const errorAlert = document.getElementById("errorAlert");


//=====================================================================================================


submitBtn.addEventListener('click', getLogin);

const BACKEND_ADDRESS = '54.147.138.102:3000';
//===================================================================================================



async function getLogin(event){
    event.preventDefault();
    try
    {
        if(email.value==''|| password.value==''){
            // return pushAlert('please fill all the fields', 'error');
            return alert('please fill all the fields');
        }

        const getLogin = {
            email: email.value,
            password: password.value
        };

        const response = await axios.post(`http://${BACKEND_ADDRESS}/user/login`, getLogin);
        if(response.status===201){
            localStorage.setItem("token",response.data.token);
            // pushAlert(response.data.message, 'message');
            alert(response.data.message);
            clearUserForm();
            window.location.href = "expense.html";
        }
    }catch(err){
        if(err.response){
            document.body.innerHTML += `<div style="color:red">${err}: ${err.response.data.error}</div>`
            return alert(err.response.data.error);
            // return pushAlert(err.response.data.error, 'error');
        }
    }
}



function clearUserForm(){
    email.value='';
    password.value='';
}






function pushAlert(alert, status){
    if(status=='message'){
        messageAlert.innerHTML = alert;
        messageAlert.style.visibility = 'visible';
    }
    else if(status=='error'){
        errorAlert.innerHTML = alert;  
        errorAlert.style.visibility = 'visible';
    }
         
    alertContainer.style.display = 'flex';

    setTimeout(()=>{
        messageAlert.innerHTML='';
        errorAlert.innerHTML='';
        messageAlert.style.visibility = 'hidden';
        errorAlert.style.visibility = 'hidden';
        alertContainer.style.display = 'none';
    },1000);
}