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
    // Update localStorage
    updateToLS(getLocalDataAsObject(), typeInput, detailsInput, amountInput, formatTime());
    // Show Balance info in page
    showBalance(getLocalDataAsObject());
    showStatements(getLocalDataAsObject());
}
/*****************************************
 * When Clear Button Triggered
 * **************************** ********/
statementClear.addEventListener('click', clearTransaction);
function clearTransaction() {
    let promptMessage = confirm('Do You Want To Clear All Transaction History?');
    if (promptMessage) {
        if (localStorage.getItem("eWallet"))
            localStorage.removeItem("eWallet");
        clearInput();

        onLoadPage();
    }
}
/*************************************
 * onLoad Page Function
 * Methods Executed when page is opened or reloaded
 * ********************************* */
let onLoadPage = () => {
    displayInputError(0);
    clearInput();
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
 * Get Key From Local Storage
 * ************************************ */
let getLocalStorage = () => {
    if (!localStorage.getItem("eWallet")) {
        localStorage.setItem('eWallet', "[]");
    }
    return localStorage.getItem("eWallet");
}
/*****************************************
 * Set Values to Local Storage
 * ************************************ */
let updateToLS = (eWalletAsArray, transactionType, details, amount, transactionTime) => {
    let type = (transactionType == 1) ? '+' : '-';
    let walletObj = { type, details, amount, transactionTime };
    eWalletAsArray.unshift(walletObj);
    localStorage.setItem('eWallet', JSON.stringify(eWalletAsArray));
}
/******************************************
 * Show Balance and Transaction History
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
/******************************************
 * Text Formatting Section
 * ************************** *************/
let formatAmount = amount => {
    return amount.toLocaleString();
}
let formatTime = () => {
    // Set Format as Sep 09, 02:07 AM
    const timeNow = new Date().toLocaleTimeString('us', {
        month: "short",
        day: "2-digit",
        minute: "2-digit",
        hour: "2-digit"
    });
    // Get Format like 09 Sep, 02:07 AM
    let hourMinute = timeNow.split(',')[1];
    let day = timeNow.split(',')[0].split(' ')[0];
    let month = timeNow.split(',')[0].split(' ')[1];
    [day, month] = [month, day];
    return `${day} ${month}, ${hourMinute}`;
}

// Function Calls when Page is opened
onLoadPage();
