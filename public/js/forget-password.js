const forgetPasswordForm = document.getElementById("forgetPasswordForm");
const email = document.getElementById("email");
forgetPasswordForm.addEventListener('submit',forgetPassword);
    
document.addEventListener('DOMContentLoaded', (e)=>{});


async function forgetPassword(e){
    try{
        e.preventDefault();
        if(email.value.length===0 || email.value===''){
            return alert('kindly fill your email');
        }
    
        const response = await axios.get(`http://localhost:9000/password/forgotpassword/${email.value}`);
        if(response.status === 200){
            alert(response.data.message);
        }
    }
    catch(err){
        alert(err.response.data.error);
    }
}

