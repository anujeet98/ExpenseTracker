const email = document.getElementById("email");
const password = document.getElementById("password");
const submitBtn = document.getElementById("submit");

//=====================================================================================================


submitBtn.addEventListener('click', getLogin);

const BACKEND_ADDRESS = '54.234.60.93:3000';
//===================================================================================================



async function getLogin(event){
    event.preventDefault();
    try
    {
        if(email.value==''|| password.value==''){
            return alert('please fill all the fields');
        }

        const getLogin = {
            email: email.value,
            password: password.value
        };

        const response = await axios.post(`http://${BACKEND_ADDRESS}/user/login`, getLogin);
        if(response.status===201){
            localStorage.setItem("token",response.data.token);
            alert(response.data.message);
            clearUserForm();
            window.location.href = "expense.html";
        }
    }catch(err){
        if(err.response){
            document.body.innerHTML += `<div style="color:red">${err}: ${err.response.data.error}</div>`
            return alert(err.response.data.error);
        }
    }
}



function clearUserForm(){
    email.value='';
    password.value='';
}
