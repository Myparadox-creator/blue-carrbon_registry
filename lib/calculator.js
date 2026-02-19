/**
 * lib/calculator.js
 * Carbon footprint & credit calculation logic.
 * Depends on: config/constants.js (APP_CONFIG.EMISSION_FACTORS)
 */

/**
 * Calculates carbon credits based on activity inputs.
 *
 * @param {number} electricity   - Monthly electricity consumption in kWh
 * @param {number} transport     - Annual transport emissions in kg CO₂e
 * @param {number} waste         - Monthly waste generated in kg
 * @returns {string}             - Carbon credits (tonnes CO₂e), fixed to 2 decimal places
 */
function calculateCredits(electricity, transport, waste) {
    const { electricity: elFactor, waste: wFactor } = APP_CONFIG.EMISSION_FACTORS;

    const annualElectricity = electricity * 12 * elFactor;   // kWh → kg CO₂/year
    const annualWaste = waste * 12 * wFactor;    // kg waste → kg CO₂/year
    const carbonFootprint = annualElectricity + transport + annualWaste; // kg CO₂/year

    return (carbonFootprint / 1000).toFixed(2); // convert to tonnes
}
