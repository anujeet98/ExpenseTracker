const email = document.getElementById("email");
const password = document.getElementById("password");
const submitBtn = document.getElementById("submit");

//=====================================================================================================


submitBtn.addEventListener('click', getLogin);


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

        const response = await axios.post(`http://${process.env.BACKEND_HOST}:${process.env.APP_PORT}/user/login`, getLogin);
        if(response.status===201){
            localStorage.setItem("token",response.data.token);
            alert(response.data.message);
            clearUserForm();
            window.location.href = "expense.html";
        }
    }catch(err){
        if(err.response.status >= 401 && err.response.status<500){
            return alert(err.response.data.error);
        }
        document.body.innerHTML += `<div style="color:red">${err}: ${err.response.data.error}</div>`
    }
}



function clearUserForm(){
    email.value='';
    password.value='';
}
