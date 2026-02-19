/**
 * config/constants.js
 * Central configuration file for the Blue Carbon Ledger app.
 * Edit values here to update them across the entire application.
 */

const APP_CONFIG = {
    // Auth
    LOGIN_USER: '12345',
    LOGIN_PASS: '12345',

    // Plantation
    OXYGEN_PER_TREE_KG: 118, // kg of O₂ produced per tree per year

    // Emission factors
    EMISSION_FACTORS: {
        electricity: 0.58,  // kg CO₂ per kWh
        waste: 0.57,  // kg CO₂ per kg of waste
    },

    // localStorage keys
    STORAGE_KEYS: {
        ledger: 'carbonCreditLedger',
        transaction: 'transactionHistory',
        verified: 'verifiedData',
    },
};
