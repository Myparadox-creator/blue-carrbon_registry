# Blue Carbon Registry (SIHPS25038)

Blue Carbon Registry is a blockchain prototype that immutably records coastal and marine carbon sequestration activities (plantations, projects, dates, measurements) and tokenizes verified carbon credits for transparent transfer and trade.

This repository demonstrates how planting data and project metadata can be stored on-chain and how carbon credits can be issued as transferable tokens — enabling auditable, verifiable carbon accounting for blue carbon projects.

---

## Key features

- Immutable on-chain storage of plantation and project metadata
- Tokenization of carbon credits for traceable transfers and settlements
- Transparent audit trail for project lifecycle events (planting, verification, issuance)
- Extensible smart contract design suitable for integration with off-chain verification systems

---

## Why this matters

Blue carbon ecosystems (mangroves, seagrasses, saltmarshes) are high-value carbon sinks. A transparent, tamper-resistant registry increases trust between project developers, verifiers, and buyers by making the provenance and issuance history of carbon credits auditable on a public ledger.

---

## How it works (high level)

1. Project registration: Projects and plantations are recorded on-chain with essential metadata (location, species, start date, owner).
2. Measurement & verification: Quantified sequestration results (from off-chain measurements or oracles) are associated with registered projects.
3. Issuance: Verified sequestration is converted to on-chain carbon credit tokens.
4. Transfer & retirement: Credits can be transferred between accounts, or retired to reflect real-world retirement of emissions reductions.

---

## Tech stack (suggested)

- Smart contracts: Solidity (Ethereum-compatible networks)
- Development tools: Hardhat or Truffle
- Token standards: ERC-20/ERC-1155/ERC-721 depending on whether credits are fungible, batchable, or unique
- Storage: On-chain metadata for provenance; optionally IPFS for large documents or certificates
- Verification: Off-chain oracles or integrations with third-party verifiers

---

## Getting started

Prerequisites
- Node.js (LTS)
- npm or yarn
- Hardhat or Truffle (depending on your preferred workflow)
- An Ethereum-compatible wallet and testnet funds for deployment

Quick setup (example using Hardhat)
```bash
# install
npm install

# run tests
npx hardhat test

# compile
npx hardhat compile

# deploy to local network
npx hardhat node
npx hardhat run scripts/deploy.js --network localhost
```

Example usage (conceptual)
- Register a project:
  - call ProjectRegistry.createProject(name, location, owner, metadataURI)
- Add a plantation record:
  - call PlantationManager.recordPlantation(projectId, species, area, date, notes)
- Issue credits (after verification):
  - call CreditToken.issue(projectId, beneficiary, amount)
- Transfer credits:
  - standard token transfer functions (transfer, transferFrom)
- Retire credits:
  - call CreditToken.retire(tokenId or amount) to lock and mark credits as retired

(Adapt the exact function names to your contract interfaces.)

---

## Data model (recommended fields)

- Project: id, name, owner, location (geo), start_date, metadata_uri, status
- Plantation: id, project_id, species, area_hectares, planted_date, measured_carbon
- Verification: id, project_id, verifier, date, report_uri, verified_amount
- Credit Token: project_id, issue_date, amount, token_id (if non-fungible), status (active/retired)

---

## Security & auditing

- Use established OpenZeppelin libraries for access control and token standards.
- Write and run comprehensive unit and integration tests (including edge cases).
- Consider third-party audits for production deployments and careful management of privileged roles (minter, pauser).

---

## Contributing

Contributions are welcome — whether it's bug fixes, tests, new features, or documentation improvements.

Suggested workflow:
1. Fork the repo
2. Create a feature branch: git checkout -b feat/awesome-change
3. Add tests and documentation
4. Open a pull request describing the change

Please follow conventional commits and include tests for new behavior.

---

## Roadmap (ideas)

- Add on-chain verification workflows with oracle integration
- Support multiple token standards and retirement tracking
- Off-chain dashboard for visualizing project history and token flows
- Integration with third-party certification bodies for automated verification

---

## License

Specify your preferred license (e.g., MIT, Apache-2.0). If none selected yet, add a LICENSE file and update this section.

---

## Contact

Maintainer: Myparadox-creator  
Repository: Myparadox-creator/blue-carrbon_registry

For questions or collaboration ideas, open an issue or create a pull request.

---
Prototype | For research and demonstration purposes — not audited for production use.
