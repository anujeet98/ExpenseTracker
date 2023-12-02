var form = document.getElementById("ExpenseForm");
var expenses = document.getElementById("expenses");

// Expense details
var amount = document.getElementById("amt");
var description = document.getElementById("descr");
var category = document.getElementById("cat");

let editing=false;
let editId;

// EventListers
form.addEventListener('submit',addExpense);
document.addEventListener('DOMContentLoaded', getExpenses);

//-------------------------------------------------------------------------------------------

function addExpense(e) {
    e.preventDefault();

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
            axios.put('http://localhost:9000/expenseApp/update-expense/'+editId, expenseObj)
            .then(result => {
                //add Expense to list
                amount.value = '';
                description.value = '';
                category.value = '';
                editing=false;
                updateNewExpense_Li(result.data.updatedExpenseDetail);
            })
            .catch(err => alert('Something went wrong while editing expense: '+err));
        }
        else{
            axios.post('http://localhost:9000/expenseApp/add-expense', expenseObj)
                .then(result => {
                    //add Expense to list
                    amount.value = '';
                    description.value = '';
                    category.value = '';
                    updateNewExpense_Li(result.data.newExpenseDetail);
                })
                .catch(err => alert('Something went wrong while adding expense: '+err));
        }
    }
};

function getExpenses(){
    editing=false;
    axios.get('http://localhost:9000/expenseApp/get-expenses')
    .then(response => {
        // expenses.innerHTML = '';
        showExpenses(response);
    })
    .catch(err=>{
        alert('Something went wrong while fetching expenses: '+err);
    })
}

function updateNewExpense_Li(result){
    let obj = result;

    let li = document.createElement('li');
    li.className = "expense";
    li.appendChild(document.createTextNode(obj.amount + " - " + obj.category + " - " + obj.description + "     "));
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

function deleteExpense(e,id){   
    let itemSelect = e.target.parentElement;
    axios.delete("http://localhost:9000/expenseApp/delete-expense/"+id)
    .then(()=>{
        expenses.removeChild(itemSelect);
        alert('Expense deleted..!!');
    })
    .catch(err => alert('Something went wrong while deleting expense: '+err));
}

function editExpense(e,id){
    let itemSelect = e.target.parentElement;
    axios.get("http://localhost:9000/expenseApp/get-expense/"+id)
    .then(res => {
        let obj = res.data;
        amount.value = obj.amount;
        description.value = obj.description;
        category.value = obj.category;
        editing=true;
        editId=id;
        expenses.removeChild(itemSelect);
    })
    .catch(err=> alert('Something went wrong while editing expense: '+err));
}

