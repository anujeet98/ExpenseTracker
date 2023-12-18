const forgetPasswordForm = document.getElementById("forgetPasswordForm");
const email = document.getElementById("email");
forgetPasswordForm.addEventListener('submit',forgetPassword);
    
// document.addEventListener('DOMContentLoaded', (e)=>{});


async function forgetPassword(e){
    try{
        e.preventDefault();
        if(email.value.length===0 || email.value===''){
            return alert('kindly fill your email');
        }
    
        const response = await axios.get(`http://${process.env.BACKEND_HOST}:${process.env.APP_PORT}/password/forgotpassword/${email.value}`);
        if(response.status === 200){
            alert(response.data.message);
        }
    }
    catch(err){
        if(err.response) 
            alert(err.response.data.error);
    }
}

