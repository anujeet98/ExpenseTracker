const form = document.getElementById("ExpenseForm");
const expensesContainer = document.getElementById("expensesContainer");
const pageContainer = document.getElementById("pageContainer");
const dynamicPage = document.getElementById("dynamicPage");


// Expense details
const amount = document.getElementById("amt");
const description = document.getElementById("descr");
const category = document.getElementById("cat");


// EventListers
form.addEventListener('submit',addExpense);
dynamicPage.addEventListener('change', ()=>{
    localStorage.setItem("ROWS_PER_PAGE", dynamicPage.value);
    getExpenses(1, localStorage.getItem("ROWS_PER_PAGE"));
})
document.addEventListener('DOMContentLoaded', ()=>{
    const rowsPerPage = localStorage.getItem("ROWS_PER_PAGE") || 2; 
    dynamicPage.value = rowsPerPage;
    getExpenses(1, rowsPerPage);
});

let editing=false;
let editId;

//-------------------------------------------------------------------------------------------

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
                const response = await axios.put(`http://${process.env.BACKEND_HOST}:${process.env.APP_PORT}/expense/update-expense/`+editId, expenseObj, {headers: {"Authorization": localStorage.getItem("token")}});
                if(response.status === 201){
                    amount.value = '';
                    description.value = '';
                    category.value = '';
                    editing=false;
                    getExpenses(1, rowsPerPage);
                    // updateNewExpense_Li(response.data.updatedExpenseDetail);
                }
            }
            else{
                //Add New Product
                const response = await axios.post(`http://${process.env.BACKEND_HOST}:${process.env.APP_PORT}/expense/add-expense`, expenseObj,  {headers: {"Authorization": localStorage.getItem("token")}});
                if(response.status===201){
                    amount.value = '';
                    description.value = '';
                    category.value = '';
                    getExpenses(1, rowsPerPage);
                    // updateNewExpense_Li(response.data.newExpenseDetail);
                }
            }
        }
    }
    catch(err){
        alert(err.response.data.error);
    }    
};

async function getExpenses(pageNo, rowsPerPage){
    let page = pageNo;
    try{
        editing=false;
        const token = localStorage.getItem("token");
        const response = await axios.get(`http://${process.env.BACKEND_HOST}:${process.env.APP_PORT}/get-expenses?page=${page}&rowsperpage=${rowsPerPage}`, {headers: {"Authorization":token}});
        if(response.status === 200){
            showExpenses(response.data.expenses);
            showPagination(response.data);
        }
    }
    catch(err){
        if(err.response)     
            alert(err.response.data.error);
    }
}

async function deleteExpense(e,id){   
    try{
        let itemSelect = e.target.parentElement;
        const rowsPerPage = localStorage.getItem("ROWS_PER_PAGE") || 2; 
        const response = await axios.delete(`http://${process.env.BACKEND_HOST}:${process.env.APP_PORT}/expense/delete-expense/`+id, {headers: {"Authorization": localStorage.getItem("token")}});
        if(response.status === 204){
            // expensesContainer.removeChild(itemSelect);
            getExpenses(1, rowsPerPage);
            return alert('Expense deleted..!!');
        }
    }
    catch(err){
        alert(err.response.data.error);
    }
}

async function editExpense(e,id){
    try{
        let itemSelect = e.target.parentElement;
        const token = localStorage.getItem("token");
        const response = await axios.get(`http://${process.env.BACKEND_HOST}:${process.env.APP_PORT}/expense/get-expense/`+id, {headers: {"Authorization":token}});
        if(response.status===200){
            let obj = response.data;
            amount.value = obj.amount;
            description.value = obj.description;
            category.value = obj.category;
            editing=true;
            editId=id;
            expensesContainer.removeChild(itemSelect);
        }
    }
    catch(err){
        alert(err.response.data.error);
    }
}



function showExpenses(res){
    expensesContainer.innerHTML = "";
    for(let i=0; i< res.length; i++){
        let obj = res[i];
        

        let li = document.createElement('li');
        li.className = "expense";
        li.appendChild(document.createTextNode(obj.amount + " - " + obj.description + " - " + obj.category + "     "));
        li.appendChild(document.createElement("span"))

        // create delete button
        let delBtn = document.createElement("button");
        delBtn.className = "deleteExpense";
        delBtn.setAttribute("onclick",`deleteExpense(event,'${obj.id}')`);
        delBtn.appendChild(document.createTextNode("Delete Expense"));
        li.appendChild(delBtn);
        li.appendChild(document.createTextNode("  "));

        // create edit button
        let editBtn = document.createElement("button");
        editBtn.className = "editExpense";
        editBtn.setAttribute("onclick",`editExpense(event,'${obj.id}')`);
        editBtn.appendChild(document.createTextNode("Edit Expense"));
        li.appendChild(editBtn);

        // add new list item to expense UL
        expensesContainer.appendChild(li);
        // console.log(obj);
    }

    console.log('success');
}


function showPagination(res){
    pageContainer.innerHTML = "";
    if(res.hasPreviousPage)
        createPageButton(res.previousPage, false);
    createPageButton(res.currentPage, true);
    if(res.hasNextPage)
        createPageButton(res.nextPage, false);
}

function createPageButton(pageNo, isCurrentPage){
    const rowsPerPage = localStorage.getItem("ROWS_PER_PAGE") || 2; 

    const pageButton = document.createElement('button');
    pageButton.onclick = () => {
        getExpenses(pageNo,rowsPerPage); 
    }
    pageButton.className = "pageBtn";
    pageButton.appendChild(document.createTextNode(pageNo));

    pageContainer.appendChild(pageButton);
}