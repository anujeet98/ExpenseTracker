const leaderboardContainer = document.getElementById("leaderboardContainer");
const leaderBoardTable = document.getElementById("leaderBoardTable");
const premiumFeatures = document.getElementById("premiumFeatures");
const leaderboardHeader = document.getElementById('leaderboardHeader');

const viewPremiumFeatures = () => {
    showLeaderBoardBtn();
    showReportDownloadBtn();
    showChartsBtn();
}

function showLeaderBoardBtn () {
    premiumFeatures.innerHTML += `<li class="nav-item"><a class="nav-link" id="leaderboardBtn" href="#" onclick="getLeaderboard()">Leaderboard</a></li>`;
}

async function getLeaderboard() {
    try{
        const response = await axios.get(`http://${BACKEND_ADDRESS}/premium/leaderboard`, {headers: {"Authorization": localStorage.getItem("token")}});
        if(response.status === 200){
            showLeaderBoard(response.data);
        }
    }
    catch(err){
        if(err.response){
            alert(err.response.data.error);
        }
    }
}

function showLeaderBoard(data){

    leaderBoardTable.innerHTML="";
    leaderboardHeader.innerHTML="";

    leaderboardHeader.innerHTML += "<h1>Leaderboard:</h1><br>";
    const tr = document.createElement('tr');

    const thUsername = document.createElement('th');
    thUsername.innerText = 'Username';

    const thExpense = document.createElement('th');
    thExpense.innerText = 'Total Expense';

    tr.appendChild(thUsername);
    tr.appendChild(thExpense);
    leaderBoardTable.appendChild(tr);


    data.forEach((element,i) => {
        const trUser = document.createElement('tr');
        trUser.className="user";

        let tdUser = document.createElement('td');
        tdUser.innerHTML = element.username;

        let tdExpense = document.createElement('td');
        tdExpense.innerHTML = element.total_expense;

        trUser.appendChild(tdUser);
        trUser.appendChild(tdExpense);
        leaderBoardTable.appendChild(trUser);
    });


}


//-------------------------------------------------------------------------------------------------------------------

function showReportDownloadBtn(){
    premiumFeatures.innerHTML += `<li class="nav-item"><a class="nav-link" id="reportDownloadBtn" href="#" onclick="downloadReport()">Download Report</a></li>`;
}

async function downloadReport(){
    try{
        const response = await axios.get(`http://${BACKEND_ADDRESS}/premium/download/`, {headers: {"Authorization": localStorage.getItem("token")}});
        if(response.status===201){
            const a = document.createElement('a');
            a.href = response.data.reportURL;
            a.download = 'expenseReport.csv';
            a.click();
        }
    }
    catch(err){
        if(err.response) 
            alert(err.response.data.error);
    }
}


// -----------------------------------------------------------------------------------------------------------------
function showChartsBtn(){
    premiumFeatures.innerHTML += `<li class="nav-item"><a class="nav-link" id="chartsBtn" href="#" onclick="charts()">Charts</a></li>`;
}