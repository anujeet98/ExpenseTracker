const forgetPasswordForm = document.getElementById("forgetPasswordForm");
const email = document.getElementById("email");
forgetPasswordForm.addEventListener('submit',forgetPassword);
    
// document.addEventListener('DOMContentLoaded', (e)=>{});
const BACKEND_ADDRESS = '54.147.138.102:3000';

async function forgetPassword(e){
    try{
        e.preventDefault();
        if(email.value.length===0 || email.value===''){
            return alert('kindly fill your email');
        }
    
        const response = await axios.get(`http://${BACKEND_ADDRESS}/password/forgotpassword/${email.value}`);
        if(response.status === 200){
            alert(response.data.message);
        }
    }
    catch(err){
        if(err.response) 
            alert(err.response.data.error);
    }
}

