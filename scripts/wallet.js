/*************************
 * Get Common Element Path 
 * ********************* */
const header = document.getElementById('header');
const totalBalance = document.getElementById('totalBalance');
const totalIncome = document.getElementById('totalIncome');
const totalExpenses = document.getElementById('totalExpenses');
const transactionType = document.getElementById('transactionType');
const transactionDetails = document.getElementById('transactionDetails');
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
        if (localStorage.getItem("eWallet")) localStorage.removeItem("eWallet");
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
    let detailsInput = transactionDetails.value;
    let amountInput = parseInt(transactionAmount.value);
    if (!detailsInput || amountInput <= 0) {
        // Show Error 
        displayInputError(1);
        return;
    }
    // Hide Error 
    displayInputError(0);
    // Clear Input Fields 
    clearInput();
    // Update localStorage Statement Key
    updateToLS(getLocalDataAsObject(), typeInput, detailsInput, amountInput, new Date().toDateString());
    // Update Page Balance and Statement Section 
    showBalance(getLocalDataAsObject());
    showStatements(getLocalDataAsObject());
}
/*************************************
 * onLoad Page Function
 * ********************************* */
let onLoadPage = () => {
    // Disable Display Error Message
    displayInputError(0);
    // Display Data from localStorage to Page
    showBalance(getLocalDataAsObject());
    showStatements(getLocalDataAsObject());
}
/*************************************
 * Clear Input fields
 * ********************************* */
let clearInput = () => {
    transactionType.value = 1;
    transactionDetails.value = '';
    transactionAmount.value = '';
}
/*****************************************
 * Get Item as object From Local Storage
 * ************************************ */
let getLocalDataAsObject = () => {
    return JSON.parse(getLocalStorage());
}
/*****************************************
 * Get Item From Local Storage
 * ************************************ */
let getLocalStorage = () => {
    if (!localStorage.getItem("eWallet")) {
        localStorage.setItem('eWallet', "[]");
    }
    return localStorage.getItem("eWallet");
}
let updateToLS = (eWalletAsArray, transactionType, details, amount, transactionTime) => {
    let type = (transactionType == 1) ? '+' : '-';
    let walletObj = { type, details, amount, transactionTime };
    eWalletAsArray.unshift(walletObj);
    localStorage.setItem('eWallet', JSON.stringify(eWalletAsArray));
}
/******************************************
 * Update Page Information for 
 * Balance and Transaction History
 * ************************************* */
let showBalance = eWalletAsArray => {
    let income = eWalletAsArray.filter(wallet => wallet.type === '+').reduce((sum, item) => sum += item.amount, 0);
    let expense = eWalletAsArray.filter(wallet => wallet.type === '-').reduce((sum, item) => sum += item.amount, 0);
    let balance = income - expense;

    balance <= 0 ?
        `${header.classList.toggle("bg-danger", true)} ${header.classList.toggle("bg-success", false)}`
        : `${header.classList.toggle("bg-danger", false)} ${header.classList.toggle("bg-success", true)}`;

    totalBalance.innerText = formatAmount(balance);
    totalIncome.innerText = formatAmount(income);
    totalExpenses.innerText = formatAmount(expense);
}
let showStatements = eWalletAsArray => {
    transactionHistory.innerHTML = "";
    eWalletAsArray.forEach(statement => {
        let listItem = document.createElement('li');
        listItem.className = "list-group-item list-group-item-action text-break";
        listItem.innerHTML = `
            <div class="d-flex flex-column flex-sm-row justify-content-between">
                <h5 class="mb-1 fw-bold">${statement.details}</h5>
                <small class="${statement.type === '+' ? `text-success` : `text-danger`} fw-bold fs-3">${statement.type + '$' + formatAmount(statement.amount)}</small>
            </div>
            <small class="text-muted">${statement?.transactionTime}</small>
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
let formatAmount = amount => {
    return amount.toLocaleString();
}
// Function Calls when Page is opened
onLoadPage();
