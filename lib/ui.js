/**
 * lib/ui.js
 * DOM / UI helpers for the Blue Carbon Ledger.
 * Depends on: lib/storage.js, config/constants.js
 */

/* ── Navigation ───────────────────────────────────────────── */

function navigate(pageId) {
    document.querySelectorAll('#main-content .content-page').forEach(page => {
        page.classList.remove('active');
        page.style.display = 'none';
    });
    const activePage = document.getElementById(pageId);
    if (activePage) {
        activePage.style.display = 'block';
        setTimeout(() => activePage.classList.add('active'), 10);
    }
}

/* ── Logout ───────────────────────────────────────────────── */

function logout() {
    document.getElementById('app-layout').style.display = 'none';
    document.getElementById('login-wrapper').style.display = 'flex';

    ['login-form', 'company-form', 'calculation-form',
        'transaction-form', 'verified-data-form'].forEach(id => {
            document.getElementById(id)?.reset();
        });

    navigate('');
}

/* ── Dashboard ────────────────────────────────────────────── */

function displayDashboard() {
    const companyList = document.getElementById('company-list');
    const dashboardMsg = document.getElementById('dashboard-message');
    companyList.innerHTML = '';

    const ledger = getCompanyData();
    const companyCodes = Object.keys(ledger);

    if (companyCodes.length === 0) {
        dashboardMsg.style.display = 'block';
        return;
    }

    dashboardMsg.style.display = 'none';
    companyCodes
        .sort((a, b) => ledger[b].totalCredits - ledger[a].totalCredits)
        .forEach(code => {
            const company = ledger[code];
            const listItem = document.createElement('div');
            listItem.className = 'history-item';
            listItem.innerHTML = `
                <div>
                    <strong class="d-block">${company.name}</strong>
                    <small class="text-muted">${code}</small>
                </div>
                <strong class="fs-5 text-success">${company.totalCredits.toFixed(2)} C</strong>
            `;
            companyList.appendChild(listItem);
        });
}

/* ── Transaction History ──────────────────────────────────── */

function displayTransactionHistory() {
    const txList = document.getElementById('transaction-history-list');
    const txMsg = document.getElementById('transaction-history-message');
    txList.innerHTML = '';

    const allTx = getTransactionHistoryData().sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    const ledger = getCompanyData();

    if (allTx.length === 0) {
        txMsg.style.display = 'block';
        return;
    }

    txMsg.style.display = 'none';
    allTx.forEach(tx => {
        const item = document.createElement('div');
        item.className = 'history-item';
        const txTime = new Date(tx.timestamp).toLocaleString();

        if (tx.type === 'credit_claim') {
            item.innerHTML = `
                <div>
                    <strong class="d-block">
                        <i class="bi bi-patch-plus-fill me-2" style="color:var(--primary-color);"></i> Credit Claim
                    </strong>
                    <small class="text-muted">
                        ${ledger[tx.company]?.name || 'Unknown'} (${tx.company}) &bull; ${txTime}
                    </small>
                </div>
                <strong class="text-success">+${tx.credits.toFixed(2)}</strong>`;
        } else if (tx.type === 'credit_transfer') {
            item.innerHTML = `
                <div>
                    <strong class="d-block">
                        <i class="bi bi-arrow-left-right me-2" style="color:var(--info-color);"></i> Credit Transfer
                    </strong>
                    <small class="text-muted">From: ${tx.from} &bull; To: ${tx.to} &bull; ${txTime}</small>
                </div>
                <strong class="text-danger">${tx.credits.toFixed(2)}</strong>`;
        }
        txList.appendChild(item);
    });
}

/* ── Plantation Data ──────────────────────────────────────── */

function displayVerifiedData() {
    const dataList = document.getElementById('verified-data-list');
    const dataMsg = document.getElementById('verified-data-message');
    dataList.innerHTML = '';

    const OXYGEN_PER_TREE_KG = APP_CONFIG.OXYGEN_PER_TREE_KG;
    let totalOxygen = 0;
    const allRecords = getVerifiedData().sort((a, b) => new Date(b.date) - new Date(a.date));

    if (allRecords.length === 0) {
        dataMsg.style.display = 'block';
        document.getElementById('total-oxygen-production').textContent = '0 kg/year';
        return;
    }

    dataMsg.style.display = 'none';
    allRecords.forEach(record => {
        const item = document.createElement('div');
        item.className = 'history-item';
        const vDate = new Date(record.date).toLocaleDateString();
        const oxygenRecord = record.trees * OXYGEN_PER_TREE_KG;
        totalOxygen += oxygenRecord;

        item.innerHTML = `
            <div>
                <strong class="d-block">
                    <i class="bi bi-file-earmark-check-fill me-2" style="color:var(--primary-color);"></i>
                    ${record.projectName}
                </strong>
                <small class="d-block text-muted">Location: ${record.location} &bull; Verified: ${vDate}</small>
                <small class="fw-semibold" style="color:var(--success-color);">
                    Est. O₂ Production: ${oxygenRecord.toLocaleString()} kg/year
                </small>
            </div>
            <strong class="fs-5 text-primary">${record.trees.toLocaleString()} Trees</strong>
        `;
        dataList.appendChild(item);
    });

    document.getElementById('total-oxygen-production').textContent =
        totalOxygen.toLocaleString() + ' kg/year';
}
