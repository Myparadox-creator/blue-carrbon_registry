# Blue Carbon Ledger

A browser-based carbon credit management dashboard for tracking company footprints, transferring credits, and logging plantation data — all stored locally via `localStorage`.

---

## 🚀 Getting Started

No build step or server required. Simply open `index.html` in any modern browser:

```
Double-click index.html
```

Or use VS Code's **Live Server** extension for auto-reload during development.

---

## 🔑 Login Credentials

| Field    | Value   |
|----------|---------|
| Username | `12345` |
| Password | `12345` |

> Credentials can be changed in `config/constants.js` → `APP_CONFIG.LOGIN_USER / LOGIN_PASS`.

---

## 📁 Project Structure

```
Blue carbon/
│
├── index.html              # App entry point
├── .gitignore
├── README.md
│
├── assets/
│   ├── css/
│   │   └── style.css       # All custom styles
│   ├── js/
│   │   └── script.js       # Event handlers & app flow
│   └── images/             # Logos / icons (future use)
│
├── lib/
│   ├── storage.js          # localStorage read/write helpers
│   ├── calculator.js       # Carbon footprint formula
│   └── ui.js               # navigate(), displayDashboard(), etc.
│
└── config/
    └── constants.js        # Emission factors, storage keys, credentials
```

---

## ⚙️ Key Configuration (`config/constants.js`)

| Constant | Default | Description |
|---|---|---|
| `EMISSION_FACTORS.electricity` | `0.58` | kg CO₂ per kWh |
| `EMISSION_FACTORS.waste` | `0.57` | kg CO₂ per kg waste |
| `OXYGEN_PER_TREE_KG` | `118` | kg O₂ produced per tree/year |

---

## 📦 External Dependencies (CDN)

| Library | Version | Purpose |
|---|---|---|
| Bootstrap | 5.3.3 | UI components & layout |
| Bootstrap Icons | 1.11.3 | Icon set |
| Ethers.js | 5.7.0 | Blockchain / wallet (simulated) |
| Google Fonts (Inter) | — | Typography |
