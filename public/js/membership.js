const premiumBtn = document.getElementById("premiumBtn");


premiumBtn.addEventListener('click', buyPremium);


async function buyPremium(e){
    try{
        const token = localStorage.getItem("token");
        const response = await axios.get('http://localhost:9000/purchase/premium-membership', {headers: {"Authorization":token}});

        if(response.status === 201){

            let options = {
                "key": response.data.key_id,
                "order_id": response.data.order.id,
                "handler": async function(response) {
                    const updateResponse = await axios.put('http://localhost:9000/purchase/update-membership',response ,{headers: {"Authorization":token}} );
                    console.log(updateResponse);
                    if(updateResponse.status === 204){
                        return alert('payment successful for premium membership');
                    }
                    else{
                        console.log("success",updateResponse.data.error);
                        //throw new Error(updateResponse.data.error);
                    }
                }
            }

            const rzpPayment = new Razorpay(options);
            rzpPayment.open();
            // e.preventDefault();

            rzpPayment.on('payment.failed', async ()=>{
                const updateResponse = await axios.put('http://localhost:9000/purchase/update-membership',{razorpay_order_id: response.data.order.id} ,{headers: {"Authorization":token}} );
                
                if(updateResponse.status === 204){
                    return alert("Payment failed. Please try again");
                }
                else{
                    console.log("fail",updateResponse.data.error);
                    //throw new Error(updateResponse.data.error);
                }
            });
        }
    }
    catch(err){
        console.log("error");
        alert(err.response.data.error);
    }
}