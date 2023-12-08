const username = document.getElementById("username");
const email = document.getElementById("email");
const password = document.getElementById("password");
const submitBtn = document.getElementById("submit");

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

        const response = await axios.post('http://localhost:9000/user/signup', signupObj);
        if(response.status===201){
            alert('user created successfully');
            clearUserForm();
            
        }
    }catch(err){
        if(err.response.status===400){
            return alert(err.response.data.error);
        }
        document.body.innerHTML += `<div style="color:red">${err}: ${err.response.data.error}</div>`
    }
}



function clearUserForm(){
    username.value='';
    email.value='';
    password.value='';
}
