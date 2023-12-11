const leaderboard = document.getElementById("leaderboard");
const premiumFeatures = document.getElementById("premiumFeatures");


viewLeaderBoard = () => {
    premiumFeatures.innerHTML += `<button id="leaderboardBtn" onclick="getLeaderboard(e)">Leaderboard</button>`;
}

async function getLeaderboard(e) {
    try{
        const response = await axios.get('http://localhost:9000/premium/leaderboard', {headers: {"Authorization": localStorage.getItem("token")}});
        if(response.status === 200){
            showLeaderBoard(response.data);
        }
    }
    catch(err){
        if(err.response.status>=401){
            alert(err.response.data.error);
        }
    }
}

function showLeaderBoard(data){
    leaderboard.innerHTML = "";
    leaderboard.innerHTML += "<div><h1>Leaderboard:</h1></div><br>";
    data.forEach((element,i) => {
        leaderboard.innerHTML += `<div><p></p>${i+1}] Username: ${element.username}; Total Expense: ${element.total_expense}</div><br>`;
    });
}