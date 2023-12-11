const leaderboard = document.getElementById("leaderboard");
const leaderboardBtn = document.getElementById("leaderboardBtn");


leaderboardBtn.addEventListener('click',getLeaderboard);


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