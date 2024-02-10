const form = document.getElementById("ExpenseForm");
const pageContainerExpense = document.getElementById("pageContainer-expense");
const dynamicPage = document.getElementById("dynamicPage");
const expenseTable = document.getElementById("expense-tbody");

// Expense details
const amount = document.getElementById("amt");
const description = document.getElementById("descr");
const category = document.getElementById("cat");

let editing=false;
let editId;

const BACKEND_ADDRESS = 'http://www.expendease.work.gd';
const api = axios.create({
    baseURL: `${BACKEND_ADDRESS}`,
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response.status === 401) {
            alert('Token expired or unauthorized. Redirecting to login.');
            localStorage.removeItem('token');
            window.location.href = '/home.html';
        }
        return Promise.reject(error);
    }
);
//-----------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', ()=>{
    updateProfileName();
    membershipStatus();
    loadExpensePage();
});

form.addEventListener('submit',addExpense);
dynamicPage.addEventListener('change', ()=>{
    localStorage.setItem("ROWS_PER_PAGE", dynamicPage.value);
    getExpenses(1, localStorage.getItem("ROWS_PER_PAGE"));
});
document.getElementById('date-picker').addEventListener('change', ()=>{
    getExpenses(1,localStorage.getItem("ROWS_PER_PAGE") || 2);
});
//-------------------------------------------------------------------------------------------
function userLogout(){
    localStorage.removeItem('token');
    window.location.href = '/home.html';
}
function loadExpensePage(){
    document.querySelector('.expense').classList.remove('inactive');
    const rowsPerPage = localStorage.getItem("ROWS_PER_PAGE") || 2; 
    dynamicPage.value = rowsPerPage;
    getExpenses(1, rowsPerPage);
};

async function addExpense(e) {
    e.preventDefault();
    try{
        const rowsPerPage = localStorage.getItem("ROWS_PER_PAGE") || 2; 
        if(amount.value == '' || description.value == '' || category.value == ''){
            alert('Kindly fill all the fields');
        }
        else{
            let expenseObj = {
                amount : amount.value,
                description : description.value,
                category : category.value
            };
            if(editing===true){
                //Edit Product
                const response = await api.put(`/expense/`+editId, expenseObj, {headers: {"Authorization": localStorage.getItem("token")}});
                if(response.status === 201){
                    amount.value = '';
                    description.value = '';
                    category.value = '';
                    editing=false;
                    getExpenses(1, rowsPerPage);
                }
            }
            else{
                //Add New Product
                const response = await api.post(`/expense/`, expenseObj,  {headers: {"Authorization": localStorage.getItem("token")}});
                if(response.status===201){
                    amount.value = '';
                    description.value = '';
                    category.value = '';
                    getExpenses(1, rowsPerPage);
                }
            }
        }
    }
    catch(err){
        if (err.response)
            alert(err.response.data.error);
    }    
};

async function getExpenses(pageNo, rowsPerPage){
    let page = pageNo;
    try{
        editing=false;
        const selectedDate = document.getElementById('date-picker').value;
        const token = localStorage.getItem("token");
        const response = await api.get(`/expense/?page=${page}&rowsperpage=${rowsPerPage}&date=${selectedDate}`, {headers: {"Authorization":token}});
        if(response.status === 200){
            showExpenses(response.data.expenses);
            showPagination(response.data, pageContainerExpense);
        }
    }
    catch(err){
        if(err.response)     
            alert(err.response.data.error);
    }
}

async function deleteExpense(e,id){   
    try{
        // let itemSelect = e.target.parentElement;
        const rowsPerPage = localStorage.getItem("ROWS_PER_PAGE") || 2; 
        const response = await api.delete(`/expense/`+id, {headers: {"Authorization": localStorage.getItem("token")}});
        if(response.status === 204){
            getExpenses(1, rowsPerPage);
            return alert('Expense deleted..!!');
        }
    }
    catch(err){
        if(err.response) 
            alert(err.response.data.error);
    }
}

async function editExpense(e,id){
    try{
        let itemSelect = e.target.parentElement.parentElement;
        const token = localStorage.getItem("token");
        const response = await api.get(`/expense/`+id, {headers: {"Authorization":token}});
        if(response.status===200){
            let obj = response.data;
            amount.value = obj.amount;
            description.value = obj.description;
            category.value = obj.category;
            editing=true;
            editId=id;
            expenseTable.removeChild(itemSelect);
        }
    }
    catch(err){
        if(err.response) 
            alert(err.response.data.error);
    }
}



function showExpenses(res){
    expenseTable.innerHTML = "";
    for(let i=0; i< res.length; i++){
        let obj = res[i];

        const tr = document.createElement('tr');
        tr.className="expense";

        let tdAmount = document.createElement('td');
        tdAmount.innerHTML = obj.amount;
        tr.appendChild(tdAmount);

        let tdDescription = document.createElement('td');
        tdDescription.innerHTML = obj.description;
        tr.appendChild(tdDescription);

        let tdCategory = document.createElement('td');
        tdCategory.innerHTML = obj.category;
        tr.appendChild(tdCategory);

        // create delete button
        let delBtn = document.createElement("button");
        delBtn.className = "deleteExpense btn btn-danger w-100";
        delBtn.setAttribute("onclick",`deleteExpense(event,'${obj._id}')`);
        delBtn.appendChild(document.createTextNode("Delete"));

        let tdDeleteBtn = document.createElement('td');
        tdDeleteBtn.appendChild(delBtn);
        tr.appendChild(tdDeleteBtn);

        // create edit button
        let editBtn = document.createElement("button");
        editBtn.className = "editExpense btn btn-warning w-100";
        editBtn.setAttribute("onclick",`editExpense(event,'${obj._id}')`);
        editBtn.appendChild(document.createTextNode("Edit"));
        let tdEditBtn = document.createElement('td');
        tdEditBtn.appendChild(editBtn);
        tr.appendChild(tdEditBtn);

        // add new item to expense table
        expenseTable.appendChild(tr);
    }

    console.log('success');
}


function showPagination(res,container){
    const pageContainer = container
    pageContainer.innerHTML = "";
    if(res.hasPreviousPage)
        createPageButton(res.previousPage, container, false);
    createPageButton(res.currentPage, container, true);
    if(res.hasNextPage)
        createPageButton(res.nextPage, container, false);
}

function createPageButton(pageNo, container, isCurrentPage){
    const rowsPerPage = localStorage.getItem("ROWS_PER_PAGE") || 2; 

    const pageButton = document.createElement('button');
    pageButton.onclick = () => {
        if(container.id === 'pageContainer-expense')
            getExpenses(pageNo,rowsPerPage); 
        else
            getLeaderboard(pageNo);
    }
    pageButton.className = "pageBtn btn-sm fs-6 m-1 ";
    if(isCurrentPage)
        pageButton.classList.add('bg-dark-subtle');
    pageButton.appendChild(document.createTextNode(pageNo));

    container.appendChild(pageButton);
}

async function updateProfileName(){
    try{
        const response = await api.get(`/user/`, {headers: {"Authorization": localStorage.getItem("token")}});
        document.getElementById('profilename').innerText = response.data.username;
    }
    catch(err){
        if(err.response) 
            alert(err.response.data.error);
    }
}

function switchview(cb){
    //content child all display none
    const x = document.querySelectorAll('.content>div');
    x.forEach(item => item.classList.add('inactive'));
    cb();
}