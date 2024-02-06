const premiumTag = document.getElementById("premiumTag");
const headerTop = document.getElementById("header-top");


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
        laodPremiumFeatures();
    }
    else{
        premiumTag.style.visibility = 'hidden';

        const buyBtn = document.createElement('button');
        buyBtn.classList.add(['btn', 'btn-primary'])
        buyBtn.appendChild(document.createTextNode('Become Premium member'));
        buyBtn.setAttribute("id", "premiumBtn");
        buyBtn.onclick = ()=>{
            buyPremium();
        };
        document.getElementById('premiumFeatures').appendChild(buyBtn);
    }
};



async function buyPremium(e){
    try{
        const token = localStorage.getItem("token");
        const response = await api.get(`/purchase/premium-membership`, {headers: {"Authorization":token}});

        if(response.status === 201){

            let options = {
                "key": response.data.key_id,
                "order_id": response.data.order.id,
                "handler": async function(response) {
                    try{
                        const updateResponse = await api.put(`/purchase/update-membership`,response ,{headers: {"Authorization":token}} );
                        if(updateResponse.status === 200){
                            //add ispremium token in LS
                            localStorage.setItem("token",updateResponse.data.token);
                            document.getElementById('premiumFeatures').removeChild(document.getElementById('premiumBtn'));
                            membershipStatus();
                            return alert('payment successful for premium membership');
                        }
                    }
                    catch(err){
                        if(err.response) 
                            return alert(err.response.data.error);
                    }
                }
            }

            const rzpPayment = new Razorpay(options);
            rzpPayment.open();
            // e.preventDefault();

            rzpPayment.on('payment.failed', async ()=>{
                try{
                    await api.put(`/purchase/update-membership`,{razorpay_order_id: response.data.order.id} ,{headers: {"Authorization":token}} );
                }
                catch(err){
                    if(err.response) 
                        alert(err.response.data.error);
                }
            });
        }
    }
    catch(err){
        if(err.response) 
            alert(err.response.data.error);
    }
}