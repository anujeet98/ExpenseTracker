const leaderboardContainer = document.getElementById("leaderboardContainer");
const leaderBoardTable = document.getElementById("leaderboard-tbody");
const premiumFeatures = document.getElementById("premiumFeatures");
const leaderboardHeader = document.getElementById('leaderboardHeader');
const pageContainerLeaderBoard = document.getElementById('pageContainer-leaderboard');

let CURR_TIME_PERIOD = 'All Time';
const timeLineCode = Object.freeze({ 
    'All Time': 0, 
    'Yearly': 1, 
    'Monthly': 2, 
}); 

const laodPremiumFeatures = () => {
    showLeaderBoardBtn();
    showReportDownloadBtn();
}

function getCurrentMonth(){
    var datePicker = document.getElementById('datePicker');
    var date = new Date();
    var month = "0" + (date.getMonth() + 1);
    datePicker.value = (date.getFullYear() + "-" + (month.slice(-2)));
}

function showChart(xval, yval, chartId, chartType, displayLegend){
    const canvas = document.getElementById(chartId);
    canvas.innerHTML = "";
    var xValues = xval;
    var yValues = yval;
    var barColors = randomColor({ count: xval.length, luminosity: 'bright' });
    new Chart(chartId, {
    type: chartType,
    data: {
        labels: xValues,
        datasets: [{
        backgroundColor: barColors,
        data: yValues,
        borderWidth: 0,
        }]
    },
    options: {
        title: {
        display: true,
        // text: ""
        },
        legend: {
            display: displayLegend,
            position: 'right',
        }
    }
    });
}

function showLeaderBoardBtn () {
    premiumFeatures.innerHTML += `<li class="nav-item"><a class="nav-link" id="leaderboardBtn" href="#" onclick="switchview(loadLeaderBoardPage)">Leaderboard</a></li>`;
}
function showReportDownloadBtn(){
    premiumFeatures.innerHTML += `<li class="nav-item"><a class="nav-link" id="reportDownloadBtn" href="#" onclick="switchview(loadReportPage);">Download Report</a></li>`;
}

//---------------------------------------------------------------------------------------------------------------------------

function loadLeaderBoardPage(){
    document.querySelector('.leaderboard').classList.remove('inactive');
    getLeaderboard(1);
    getUserStats();
}

function loadReportPage(){
    document.querySelector('.report').classList.remove('inactive');
    getCurrentMonth();
    generatereport();
}

async function getLeaderboard(pageNo, event) {
    try{
        if(event){
            CURR_TIME_PERIOD = event.target.textContent;
        }
        const response = await api.get(`/premium/leaderboard?timelinecode=${timeLineCode[CURR_TIME_PERIOD]}&page=${pageNo}&rowsperpage=10`, {headers: {"Authorization": localStorage.getItem("token")}});
        if(response.status === 200){
            showLeaderBoard(response.data.leaderboard);
            showPagination(response.data, pageContainerLeaderBoard);
            if(pageNo === 1){
                const res = response.data.leaderboard;
                let xValues = res.filter((resObj, index) => index<res.length && index<=10).map(resObj => resObj.username);
                let yValues = res.filter((resObj, index) => index<res.length && index<=10).map(resObj => resObj.total_expense);
                showChart(xValues, yValues, 'myChart', 'bar', false);
            }
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
    
    data.forEach((element,i) => {
        const trUser = document.createElement('tr');
        trUser.className="user";

        let tdRank = document.createElement('td');
        tdRank.innerHTML = i+1;

        let tdUser = document.createElement('td');
        tdUser.innerHTML = element.username;

        let tdExpense = document.createElement('td');
        tdExpense.innerHTML = element.total_expense;

        trUser.appendChild(tdRank);
        trUser.appendChild(tdUser);
        trUser.appendChild(tdExpense);
        leaderBoardTable.appendChild(trUser);
    });


}


//-------------------------------------------------------------------------------------------------------------------

async function downloadReport(){
    try{
        const picker = document.querySelector('.datepickercontainer input');
        if(!picker.value)
            return alert('select month/year to generate report');
        
        const datetype = picker.name;
        const datevalue = picker.value;
        
        if(datetype==='year' && (datevalue>2100 || datevalue<2000))
            return alert('select year between 2000-2100');

        const response = await api.get(`/premium/download/?datetype=${datetype}&datevalue=${datevalue}`, {headers: {"Authorization": localStorage.getItem("token")}});
        if(response.status===201){
            console.log(document.getElementById('iframe'));
            document.getElementById('iframe').setAttribute('src','https://docs.google.com/viewer?url='+response.data.reportURL+'&embedded=true');
            // document.getElementById('iframe').setAttribute('src','https://view.officeapps.live.com/op/embed.aspx?src='+response.data.reportURL);
            
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

function toggle_date(event){
    const picker = document.querySelector('.datepickercontainer');
    picker.innerHTML = "";
    if(event.target.id==='yearly'){
        picker.innerHTML += `
           <label for="datePicker">Select Year:</label>
           <input type="number" class="form-control" id="yearPicker" name="year" min="1900" max="2100" required>
        `;
    }
    else{
        picker.innerHTML += `
           <label for="datePicker">Select Month:</label>
           <input type="month" class="form-control" id="datePicker" name="month" required>
        `;
    }
}

function generatereport(){
    const picker = document.querySelector('.datepickercontainer input');
    if(!picker.value)
        return alert('select month/year to generate report');
    
    const datetype = picker.name;
    const datevalue = picker.value;
    
    if(datetype==='year' && (datevalue>2100 || datevalue<2000))
        return alert('select year between 2000-2100');

    generateCategoryAggr(datetype, datevalue);
    generateExpenseAggr(datetype, datevalue);
    // downloadReport(datetype, datevalue);
}

async function generateCategoryAggr(datetype, datevalue){
    try{
        const response = await api.get(`/premium/report/category?datetype=${datetype}&datevalue=${datevalue}`, {headers: {"Authorization": localStorage.getItem("token")}});
        let total = 0;
        const xval = response.data.map(item => item.category);
        const yval = response.data.map(item => {
            total+=item.total_expense;
            return item.total_expense;
        });
        const chartId = 'piechart';
        const chartType = 'doughnut';

        showChart(xval, yval, chartId, chartType, true);
        document.getElementById('totalexpense').innerText = `Total spending: ₹${total}`;
    }
    catch(err){
        if(err.response){
            alert(err.response.data.error);
        }
    }
}

async function generateExpenseAggr(datetype, datevalue){
    try{
        const response = await api.get(`/premium/report/timeline?datetype=${datetype}&datevalue=${datevalue}`, {headers: {"Authorization": localStorage.getItem("token")}});
        let xval = [];
        let yval = [];
        if(datetype==='year'){
            xval = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'Spetember', 'October', 'November', 'December'];
            yval = new Array(12).fill(0);     
            for(let item of response.data){
                yval[item.month-1] = item.total_expense;
            }
        }
        if(datetype === 'month'){
            yval = new Array(31).fill(0); 
            for(let i=1 ; i<=31; i++)
                xval.push('day '+i);
            for(let item of response.data){
                yval[item.day-1] = item.total_expense;
            }
        }
        showChart(xval, yval,'linechart', 'line', false);
    }
    catch(err){
        if(err.response){
            alert(err.response.data.error);
        }
    }
}


// ----------------------------------------------------------------------------------------------------------------------



async function getUserStats(event){
    try{
        if(event){
            CURR_TIME_PERIOD = event.target.textContent;
        }
        const response = await api.get(`/user?timelinecode=${timeLineCode[CURR_TIME_PERIOD]}`, {headers: {"Authorization": localStorage.getItem("token")}});
        document.getElementById('user-expense-total').innerHTML = `total spendings: ${response.data.filtered_expense}`;
    }
    catch(err){
        if(err.response) 
            alert(err.response.data.error);
    }
}