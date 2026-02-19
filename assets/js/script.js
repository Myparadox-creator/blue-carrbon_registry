/**
 * assets/js/script.js
 * Main application logic for the Blue Carbon Ledger.
 *
 * Dependencies (loaded before this file in index.html):
 *   - config/constants.js
 *   - lib/storage.js
 *   - lib/calculator.js
 *   - lib/ui.js
 */

let calculatedCredits = 0;
let companyName = '';
let uniqueCode = '';

/* ── Login ────────────────────────────────────────────────── */
document.getElementById('login-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;
    const loginMsg = document.getElementById('login-message');

    if (user === APP_CONFIG.LOGIN_USER && pass === APP_CONFIG.LOGIN_PASS) {
        loginMsg.style.display = 'none';
        document.getElementById('login-wrapper').style.display = 'none';
        document.getElementById('app-layout').style.display = 'flex';
        displayDashboard();
        navigate('history-page');
    } else {
        loginMsg.textContent = `Invalid credentials. Please use "${APP_CONFIG.LOGIN_USER}" for both fields.`;
        loginMsg.style.display = 'block';
    }
});

/* ── Company Form ─────────────────────────────────────────── */
document.getElementById('company-form').addEventListener('submit', function (e) {
    e.preventDefault();
    companyName = document.getElementById('company-name').value;
    uniqueCode = document.getElementById('unique-code').value.toUpperCase();
    navigate('calculation-page');
});

/* ── Calculation Form ─────────────────────────────────────── */
document.getElementById('calculation-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const electricity = parseFloat(document.getElementById('electricity').value) || 0;
    const transport = parseFloat(document.getElementById('transport').value) || 0;
    const waste = parseFloat(document.getElementById('waste').value) || 0;

    calculatedCredits = calculateCredits(electricity, transport, waste);
    document.getElementById('credit-value').textContent = calculatedCredits + ' Credits';

    setTimeout(() => navigate('metamask-page'), 500);
});

/* ── MetaMask (Simulated) ─────────────────────────────────── */
async function connectMetaMask() {
    const statusIndicator = document.getElementById('metamask-status');
    const statusText = document.getElementById('metamask-text');
    const claimBtn = document.getElementById('claim-credits-btn');
    const messageEl = document.getElementById('metamask-message');

    messageEl.className = 'text-center mt-3 text-info';
    messageEl.innerHTML = '<div class="spinner-border spinner-border-sm" role="status"></div> Connecting to MetaMask...';
    messageEl.style.display = 'block';

    setTimeout(() => {
        const simulatedAddress = '0x89D24A6b4CcB1B6fAA2625fE562bDD9a23260359';
        statusIndicator.className = 'metamask-status-indicator connected';
        statusText.textContent = 'Connected';
        claimBtn.disabled = false;
        messageEl.className = 'text-center mt-3 text-success';
        messageEl.innerHTML = `<i class="bi bi-check-circle-fill"></i> Wallet connected: ${simulatedAddress.substring(0, 6)}...${simulatedAddress.slice(-4)}`;
    }, 1500);
}

document.getElementById('connect-metamask-btn').addEventListener('click', connectMetaMask);

document.getElementById('claim-credits-btn').addEventListener('click', () => {
    const messageEl = document.getElementById('metamask-message');
    messageEl.style.display = 'block';
    messageEl.className = 'text-center mt-3 text-info';
    messageEl.innerHTML = '<div class="spinner-border spinner-border-sm" role="status"></div> Proposing transaction...';

    setTimeout(() => {
        messageEl.className = 'text-center mt-3 text-success';
        messageEl.innerHTML = '<i class="bi bi-check-circle-fill"></i> Transaction confirmed on chain!';
        document.getElementById('claim-credits-btn').disabled = true;
        setTimeout(() => navigate('result-page'), 1500);
    }, 2500);
});

/* ── Save Data ────────────────────────────────────────────── */
function saveData() {
    if (!uniqueCode || !companyName) {
        alert('Company details are missing. Please start a new calculation.');
        return;
    }

    const ledger = getCompanyData();
    const transactionHistory = getTransactionHistoryData();

    if (!ledger[uniqueCode]) {
        ledger[uniqueCode] = { name: companyName, totalCredits: 0 };
    }

    const creditsToSave = parseFloat(calculatedCredits);
    ledger[uniqueCode].totalCredits += creditsToSave;

    transactionHistory.push({
        type: 'credit_claim',
        credits: creditsToSave,
        company: uniqueCode,
        timestamp: new Date().toISOString(),
    });

    if (saveCompanyData(ledger) && saveTransactionHistoryData(transactionHistory)) {
        alert('Data saved successfully!');
        displayDashboard();
        navigate('history-page');
    } else {
        alert('Failed to save data. Please try again.');
    }
}

/* ── Transfer Credits ─────────────────────────────────────── */
document.getElementById('transaction-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const sellerCode = document.getElementById('seller-code').value.toUpperCase();
    const buyerCode = document.getElementById('buyer-code').value.toUpperCase();
    const creditAmount = parseFloat(document.getElementById('credit-amount').value) || 0;
    const txMsg = document.getElementById('transaction-message');

    const showMsg = (msg, type) => {
        txMsg.textContent = msg;
        txMsg.className = `text-center mt-3 text-${type}`;
        txMsg.style.display = 'block';
    };

    const ledger = getCompanyData();
    const transactionHistory = getTransactionHistoryData();

    if (creditAmount <= 0) return showMsg('Credit amount must be positive.', 'danger');
    if (sellerCode === buyerCode) return showMsg('Seller and buyer cannot be the same.', 'danger');
    if (!ledger[sellerCode] || !ledger[buyerCode]) return showMsg('Invalid company code(s).', 'danger');
    if (ledger[sellerCode].totalCredits < creditAmount) return showMsg('Insufficient funds.', 'danger');

    ledger[sellerCode].totalCredits -= creditAmount;
    ledger[buyerCode].totalCredits += creditAmount;

    transactionHistory.push({
        type: 'credit_transfer',
        credits: creditAmount,
        from: sellerCode,
        to: buyerCode,
        timestamp: new Date().toISOString(),
    });

    if (saveCompanyData(ledger) && saveTransactionHistoryData(transactionHistory)) {
        showMsg('Transaction successful!', 'success');
        document.getElementById('transaction-form').reset();
    } else {
        ledger[sellerCode].totalCredits += creditAmount;
        ledger[buyerCode].totalCredits -= creditAmount;
        showMsg('Transaction failed. Please try again.', 'danger');
    }
});

/* ── Plantation Data Form ─────────────────────────────────── */
document.getElementById('verified-data-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const newRecord = {
        projectName: document.getElementById('project-name').value,
        location: document.getElementById('project-location').value,
        trees: parseInt(document.getElementById('trees-planted').value, 10),
        date: document.getElementById('verification-date').value,
        timestamp: new Date().toISOString(),
    };

    const verifiedData = getVerifiedData();
    verifiedData.push(newRecord);

    if (saveVerifiedData(verifiedData)) {
        alert('Record saved successfully!');
        document.getElementById('verified-data-form').reset();
        displayVerifiedData();
    } else {
        alert('Failed to save the record.');
    }
});
