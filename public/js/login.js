const username = document.getElementById("username");
const email = document.getElementById("email");
const password = document.getElementById("password");
const submitBtn = document.getElementById("submit");

//=====================================================================================================


submitBtn.addEventListener('click', postSignup);


//===================================================================================================



function postSignup(event){
    event.preventDefault();

    if(username.value=='' || email.value==''|| password.value==''){
        return alert('please fill all the fields');
    }

    const signupObj = {
        username: username.value,
        email: email.value,
        password: password.value
    };

    axios.post('http://localhost:8000/user/signup', signupObj)
        .then()
        .catch(err=>console.log(err));
}
