const premiumBtn = document.getElementById("premiumBtn");
const premiumTag = document.getElementById("premiumTag");


premiumBtn.addEventListener('click', buyPremium);
document.addEventListener('DOMContentLoaded', membershipStatus);

function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

function membershipStatus() {
    const decoded = parseJwt(localStorage.getItem("token"));
    if(decoded.isPremium === true){
        premiumTag.style.visibility = 'visible';
        premiumBtn.style.visibility = 'hidden';
        viewLeaderBoard();
    }
    else{
        premiumTag.style.visibility = 'hidden';
        premiumBtn.style.visibility = 'visible';
    }
};



async function buyPremium(e){
    try{
        const token = localStorage.getItem("token");
        const response = await axios.get('http://localhost:9000/purchase/premium-membership', {headers: {"Authorization":token}});

        if(response.status === 201){

            let options = {
                "key": response.data.key_id,
                "order_id": response.data.order.id,
                "handler": async function(response) {
                    try{
                        const updateResponse = await axios.put('http://localhost:9000/purchase/update-membership',response ,{headers: {"Authorization":token}} );
                        console.log(updateResponse);
                        if(updateResponse.status === 200){
                            //add ispremium token in LS
                            localStorage.setItem("token",updateResponse.data.token);
                            membershipStatus();
                            return alert('payment successful for premium membership');
                        }
                    }
                    catch(err){
                        return alert(err.response.data.error);
                    }
                }
            }

            const rzpPayment = new Razorpay(options);
            rzpPayment.open();
            // e.preventDefault();

            rzpPayment.on('payment.failed', async ()=>{
                try{
                    await axios.put('http://localhost:9000/purchase/update-membership',{razorpay_order_id: response.data.order.id} ,{headers: {"Authorization":token}} );
                }
                catch(err){
                    alert(err.response.data.error);
                }
            });
        }
    }
    catch(err){
        alert(err.response.data.error);
    }
}