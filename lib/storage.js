/**
 * lib/storage.js
 * All localStorage read/write helpers for the Blue Carbon Ledger.
 * Depends on: config/constants.js (APP_CONFIG.STORAGE_KEYS)
 */

/* ── Readers ──────────────────────────────────────────────── */

function getCompanyData() {
    return JSON.parse(localStorage.getItem(APP_CONFIG.STORAGE_KEYS.ledger) || '{}');
}

function getTransactionHistoryData() {
    return JSON.parse(localStorage.getItem(APP_CONFIG.STORAGE_KEYS.transaction) || '[]');
}

function getVerifiedData() {
    return JSON.parse(localStorage.getItem(APP_CONFIG.STORAGE_KEYS.verified) || '[]');
}

/* ── Writers ──────────────────────────────────────────────── */

function saveCompanyData(data) {
    try {
        localStorage.setItem(APP_CONFIG.STORAGE_KEYS.ledger, JSON.stringify(data));
        return true;
    } catch (error) {
        console.error('Failed to save company data:', error);
        return false;
    }
}

function saveTransactionHistoryData(data) {
    try {
        localStorage.setItem(APP_CONFIG.STORAGE_KEYS.transaction, JSON.stringify(data));
        return true;
    } catch (error) {
        console.error('Failed to save transaction history:', error);
        return false;
    }
}

function saveVerifiedData(data) {
    try {
        localStorage.setItem(APP_CONFIG.STORAGE_KEYS.verified, JSON.stringify(data));
        return true;
    } catch (error) {
        console.error('Failed to save verified data:', error);
        return false;
    }
}
