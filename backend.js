

var form = document.getElementById("ExpenseForm");
var expenses = document.getElementById("expenses");
var deleteExp = document.getElementsByClassName("deleteExpense");

// Expense details
var amount = document.getElementById("amt");
var description = document.getElementById("descr");
var category = document.getElementById("cat");


// EventListers
form.addEventListener('submit',addExpense);
document.addEventListener('DOMContentLoaded', refreshExpenses);
expenses.addEventListener('click', alterItems);




function addExpense(e){
    e.preventDefault();

    let expenseObj = {
        amt : amount.value,
        descr : description.value,
        cat : category.value
    };

    localStorage.setItem("Expense"+localStorage.length, JSON.stringify(expenseObj));
    alert("Expense Added");

    window.location.reload();
    refreshExpenses();
}


function refreshExpenses(){
    for(let i=0 ; i<localStorage.length ; i++){
        let expenseObj = JSON.parse(localStorage.getItem(localStorage.key(i)));
        console.log(expenseObj);

        // create list element
        let li = document.createElement("li");
        li.className = "exp";
        li.setAttribute("itemDescr",localStorage.key(i));
        li.appendChild(document.createTextNode(expenseObj.amt + " - " + expenseObj.cat + " - " + expenseObj.descr + "     "));
        li.appendChild(document.createElement("span"))

        // create delete button
        let delBtn = document.createElement("button");
        delBtn.className = "deleteExpense";
        delBtn.appendChild(document.createTextNode("Delete Expense"));
        li.appendChild(delBtn);
        li.appendChild(document.createTextNode("  "));

        // create edit button
        let editBtn = document.createElement("button");
        editBtn.className = "editExpense";
        editBtn.appendChild(document.createTextNode("Edit Expense"));
        li.appendChild(editBtn);

        // add new list item to expense UL
        expenses.appendChild(li);

        // clear the form
        // amount.value = "";
        // description.value = "";

    }
}


function alterItems(e){
    let itemSelect = e.target.parentElement;
    if(e.target.classList.contains("deleteExpense")){
        localStorage.removeItem(itemSelect.getAttribute("itemDescr"));
        expenses.removeChild(itemSelect);
    }
    else if(e.target.classList.contains("editExpense")){
        
        // populate the form using local storage values
        amount.value = JSON.parse(localStorage.getItem(itemSelect.getAttribute("itemDescr"))).amt;
        description.value = JSON.parse(localStorage.getItem(itemSelect.getAttribute("itemDescr"))).descr;
        category.value = JSON.parse(localStorage.getItem(itemSelect.getAttribute("itemDescr"))).cat;

        // remove the item from local storage and the ui
        localStorage.removeItem(e.target.parentElement.getAttribute("itemDescr"));
        expenses.removeChild(e.target.parentElement);
    }
}