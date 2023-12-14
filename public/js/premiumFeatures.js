const leaderboard = document.getElementById("leaderboard");
const premiumFeatures = document.getElementById("premiumFeatures");

viewPremiumFeatures = () => {
    showLeaderBoardBtn();
    showReportDownloadBtn();
}

function showLeaderBoardBtn () {
    premiumFeatures.innerHTML += `<button id="leaderboardBtn" onclick="getLeaderboard()" style="margin: 1% 1%;">Leaderboard</button>`;
}

async function getLeaderboard() {
    try{
        const response = await axios.get('http://localhost:9000/premium/leaderboard', {headers: {"Authorization": localStorage.getItem("token")}});
        if(response.status === 200){
            console.log(response)
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


//-------------------------------------------------------------------------------------------------------------------

function showReportDownloadBtn(){
    premiumFeatures.innerHTML += `<button id="reportDownloadBtn" onclick="downloadReport()" style="margin: 1% 1%;">Download Report</button>`;
}

async function downloadReport(){
    try{
        const response = {status: 201, data: {reportURL: "https://drive.google.com/file/d/1ahCPosLSELYrQFLpWzHoIZS4pPMu2e13/view?usp=drive_link"}};//await axios.get('http://localhost:9000/download/', {headers: {"Authorization":token}});
        console.log('hello');
        if(response.status===201){
            const a = document.createElement('a');
            a.href = response.data.reportURL;
            a.download = 'expenseReport.csv';
            a.click();
        }
        else{
            throw new Error(response.data.message);
        }
    }
    catch(err){
        // alert(err.response.data.error);
    }
}