/*************************
 * Get Common Element Path 
 * ********************* */
const header = document.getElementById('header');
const totalBalance = document.getElementById('totalBalance');
const totalIncome = document.getElementById('totalIncome');
const totalExpenses = document.getElementById('totalExpenses');
const transactionType = document.getElementById('transactionType');
const transactionNote = document.getElementById('transactionNote');
const transactionAmount = document.getElementById('transactionAmount');
const transactionSubmit = document.getElementById('transactionSubmit');
const transactionHistory = document.getElementById('transactionHistory');
const inputError = document.getElementById('inputError');
const statementClear = document.getElementById('statementClear');

/*****************************************
 * When Clear Button Triggered
 * **************************** ********/
statementClear.addEventListener('click', clearTransaction);
function clearTransaction() {
    let promptMessage = confirm('Do You Want To Clear All Transaction History?');
    if (promptMessage) {
        if (localStorage.getItem("wallet")) localStorage.removeItem("wallet");
        if (localStorage.getItem("statement")) localStorage.removeItem("statement");
        clearInput();
        onLoadPage();
    }
}
/********************************************
 * When Submit Button Triggered
 * **************************************** */
transactionSubmit.addEventListener('click', invokeTransaction);
function invokeTransaction() {
    // Get inputs and Validate
    let typeInput = parseInt(transactionType.value);
    let noteInput = transactionNote.value;
    let amountInput = parseInt(transactionAmount.value);
    if (!noteInput || amountInput <= 0) {
        // Show Error 
        displayInputError(1);
        return;
    }
    // Hide Error 
    displayInputError(0);
    // Clear Input Fields 
    clearInput();
    // Update localStorage Statement Key
    updateStatement(getLocalAsObject().statementParse, typeInput, amountInput, noteInput, new Date().toUTCString());
    // Update localStorage Wallet Key 
    updateWallet(getLocalAsObject().walletParse, typeInput, amountInput);
    // Update Page Balance and Statement Section 
    balanceSectionUpdate(getLocalAsObject().walletParse);
    statementSectionUpdate(getLocalAsObject().statementParse);
}
/*************************************
 * onLoad Page Function
 * ********************************* */
let onLoadPage = () => {
    // Disable Display Error Message
    displayInputError(0);
    // Display Data from localStorage to Page
    balanceSectionUpdate(getLocalAsObject().walletParse);
    statementSectionUpdate(getLocalAsObject().statementParse);
}
/*************************************
 * Clear Input fields
 * ********************************* */
let clearInput = () => {
    transactionType.value = 1;
    transactionNote.value = '';
    transactionAmount.value = '';
}
/*****************************************
 * Get Item as object From Local Storage
 * ************************************ */
let getLocalAsObject = () => {
    return {
        walletParse: JSON.parse(getWallet()),
        statementParse: JSON.parse(getStatement())
    }
}
/*****************************************
 * Get Item as JSON Stringify From Local Storage
 * ************************************ */
let getWallet = () => {
    if (localStorage.getItem("wallet"))
        return localStorage.getItem("wallet");
    else {
        const walletInfo = {
            income: 0,
            expense: 0,
            balance: 0
        };
        localStorage.setItem('wallet', JSON.stringify(walletInfo));
        return localStorage.getItem("wallet");
    }
}
let getStatement = () => {
    if (localStorage.getItem("statement"))
        return localStorage.getItem("statement");
    else {
        const statementInfo = [];
        localStorage.setItem('statement', JSON.stringify(statementInfo));
        return localStorage.getItem("statement");
    }
}
/*****************************************
 * Update Local Storage
 * ************************************* */
let updateWallet = (walletObj, actionType, amountGiven) => {
    if (actionType) {
        walletObj.income += amountGiven;
        walletObj.balance = walletObj.income - walletObj.expense;
    }
    else {
        walletObj.expense += amountGiven;
        walletObj.balance = walletObj.income - walletObj.expense;
    }
    localStorage.setItem('wallet', JSON.stringify(walletObj));
    // return walletObj;
}
let updateStatement = (statementsArray, typeTransaction, amountRequest, textSummary, triggerTime) => {
    let statementObj = {};
    statementObj.summary = textSummary;
    statementObj.time = triggerTime;
    statementObj.amount = amountRequest;
    statementObj.type = typeTransaction == 1 ? '+' : '-';
    statementsArray.unshift(statementObj);
    localStorage.setItem('statement', JSON.stringify(statementsArray));
    // return statementsArray;
}
/******************************************
 * Update Page Information for 
 * Balance and Transaction History
 * ************************************* */
let balanceSectionUpdate = walletObj => {
    let { income, expense, balance } = walletObj;
    balance <= 0 ?
        `${header.classList.toggle("bg-danger", true)} ${header.classList.toggle("bg-success", false)}`
        : `${header.classList.toggle("bg-danger", false)} ${header.classList.toggle("bg-success", true)}`;
    totalBalance.innerText = balance;
    totalIncome.innerText = income;
    totalExpenses.innerText = expense;
}
let statementSectionUpdate = statementsArray => {
    transactionHistory.innerHTML = "";
    statementsArray.forEach(statement => {
        let listItem = document.createElement('li');
        listItem.className = "list-group-item list-group-item-action text-break";
        listItem.innerHTML = `
            <div class="d-flex flex-column flex-sm-row justify-content-between">
                <h5 class="mb-1 fw-bold">${statement.summary}</h5>
                <small class="${statement.type === '+' ? `text-success` : `text-danger`} fw-bold fs-3">${statement.type + '$' + statement.amount}</small>
            </div>
            <small class="text-muted">${statement.time}</small>
            `
        transactionHistory.appendChild(listItem);
    });
}
/*****************************************
 * Error Displayed Section
 * ************************************* */
let displayInputError = (isDisplayed) => {
    if (isDisplayed) {
        inputError.classList.toggle('d-none', false)
    }
    else {
        inputError.classList.toggle('d-none', true)
    }
}
// Function Calls when Page is opened
onLoadPage();
