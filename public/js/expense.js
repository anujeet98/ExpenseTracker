const form = document.getElementById("ExpenseForm");
const expenses = document.getElementById("expenses");


// Expense details
const amount = document.getElementById("amt");
const description = document.getElementById("descr");
const category = document.getElementById("cat");

let editing=false;
let editId;

// EventListers
form.addEventListener('submit',addExpense);
document.addEventListener('DOMContentLoaded', getExpenses);

//-------------------------------------------------------------------------------------------

async function addExpense(e) {
    e.preventDefault();
    try{
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
                const response = await axios.put('http://localhost:9000/expense/update-expense/'+editId, expenseObj, {headers: {"Authorization": localStorage.getItem("token")}});
                if(response.status === 201){
                    amount.value = '';
                    description.value = '';
                    category.value = '';
                    editing=false;
                    updateNewExpense_Li(response.data.updatedExpenseDetail);
                }
            }
            else{
                //Add New Product
                const response = await axios.post('http://localhost:9000/expense/add-expense', expenseObj,  {headers: {"Authorization": localStorage.getItem("token")}});
                if(response.status===201){
                    amount.value = '';
                    description.value = '';
                    category.value = '';
                    updateNewExpense_Li(response.data.newExpenseDetail);
                }
            }
        }
    }
    catch(err){
        alert(err.response.data.error);
    }    
};

async function getExpenses(){
    let response;
    try{
        editing=false;
        const token = localStorage.getItem("token");
        const response = await axios.get('http://localhost:9000/expense/get-expenses', {headers: {"Authorization":token}});
        if(response.status === 200)
            showExpenses(response);
    }
    catch(err){
        alert(err.response.data.error);
    }
}

async function deleteExpense(e,id){   
    try{
        let itemSelect = e.target.parentElement;
        const response = await axios.delete("http://localhost:9000/expense/delete-expense/"+id, {headers: {"Authorization": localStorage.getItem("token")}});
        if(response.status === 204){
            expenses.removeChild(itemSelect);
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
        const response = await axios.get("http://localhost:9000/expense/get-expense/"+id, {headers: {"Authorization":token}});
        if(response.status===200){
            let obj = response.data;
            amount.value = obj.amount;
            description.value = obj.description;
            category.value = obj.category;
            editing=true;
            editId=id;
            expenses.removeChild(itemSelect);
        }
    }
    catch(err){
        alert(err.response.data.error);
    }
}



function updateNewExpense_Li(result){
    let obj = result;

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
    expenses.appendChild(li);
    // console.log(obj);
}

function showExpenses(res){
    for(let i=0; i< res.data.length; i++){
        let obj = res.data[i];

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
        expenses.appendChild(li);
        // console.log(obj);
    }

    console.log('success');
}