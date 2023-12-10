const premiumBtn = document.getElementById("premiumBtn");


premiumBtn.addEventListener('click', buyPremium);


async function buyPremium(e){
    try{
        const token = localStorage.getItem("token");
        const response = await axios.get('http://localhost:9000/purchase/premium-membership', {headers: {"Authorization":token}});
        if(response.status === 201){
            console.log(response);

            let options = {
                "key": response.data.key_id,
                "order_id": response.data.order.id,
                "handler": async function(response) {
                    await axios.put('http://localhost:9000/purchase/update-membership',response.status="success" ,{headers: {"Authorization":token}} );
                    console.log(response);
                    alert('payment successful for premium membership');
                }
            }

            const rzpPayment = new Razorpay(options);
            rzpPayment.open();
            // e.preventDefault();

            rzpPayment.on('payment.failed', async (response)=>{
                console.log(response);
                await axios.put('http://localhost:9000/purchase/update-membership',response ,{headers: {"Authorization":token}} );
                alert("Payment failed. Please try again");
            });
        }
    }
    catch(err){
        alert(err.resonse.data.error);
    }
}