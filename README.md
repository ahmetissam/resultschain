# ResultsChain

<p align="center">
  <img src="https://img.shields.io/github/license/Buzz-brain/resultschain?style=flat-square" alt="License" />
  <img src="https://img.shields.io/github/languages/top/Buzz-brain/resultschain?style=flat-square" alt="Top Language" />
  <img src="https://img.shields.io/github/deployments/Buzz-brain/resultschain/vercel?style=flat-square" alt="Vercel Deployment" />
</p>

---

## 📚 What is ResultsChain?

**ResultsChain** is a blockchain-powered results approval web app for universities. It secures, streamlines, and audits the entire process of student result approvals, moving away from error-prone spreadsheets and paper to a transparent, tamper-proof digital workflow.

---

## 🏆 Why ResultsChain?

Traditional result processing is slow, manual, and vulnerable to manipulation. ResultsChain solves this by:
- Enforcing a fixed approval ladder (Adviser → HOD → Dean → DVC → VC)
- Recording every action immutably on the blockchain
- Providing real-time status and a full audit trail
- Ensuring only authorized roles can act at each step

---

## 🔗 How It Works (End-to-End)

1. **Submission:** Adviser submits results via the web app.
2. **Smart Contracts:** Blockchain enforces role-based access and sequential approvals.
3. **Approval Chain:** Each officer (HOD, Dean, DVC, VC) can approve or reject; every action is time-stamped and immutable.
4. **Finalization:** VC approval finalizes the result, permanently recording it on-chain.
5. **Transparency:** Users see clear statuses and a tamper-proof audit log.

**RBAC** (Role-Based Access Control) is enforced at the smart contract level, preventing skipped steps and unauthorized actions.

---

## 🛠️ Tech Stack
- **Frontend:** React, TypeScript, Vite, Zustand, Tailwind CSS, Recharts
- **Blockchain:** Solidity smart contracts, Permissioned Ethereum (Ganache)
- **Web3 Integration:** Ethers.js or Web3.js, MetaMask for identity/signing
- **Security:** Sensitive data off-chain, hashes on-chain for integrity

---

## ✨ Features
- Secure login & role-based access
- Results submission and sequential approval
- Immutable, auditable storage of every action
- Real-time status and feedback for users
- Usable by non-technical staff
- Full UI for all roles (Adviser, HOD, Dean, DVC, VC)

---

## 📁 Project Structure
```text
src/
├── components/
│   ├── admin/
│   ├── audit/
│   ├── dashboard/
│   ├── layout/
│   ├── results/
│   ├── settings/
│   └── ui/
├── hooks/
├── lib/
├── pages/
├── store/
└── types/
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn
- Ganache (for local blockchain)

### Installation
```sh
npm install
```

### Development
```sh
npm run dev
```

### Build
```sh
npm run build
```

### Lint
```sh
npm run lint
```

---

## 🚢 Deployment

Deploy seamlessly to [Vercel](https://vercel.com/) or any static hosting platform.

---

## 💡 Why Blockchain?

Blockchain provides:
- **Immutability:** No silent edits—every change is visible and permanent.
- **Auditability:** Every step is traceable and time-stamped.
- **Decentralized Verification:** Fits the institutional approval chain perfectly.

---

## ⚠️ Current Limits
- Prototype only (no live student data)
- Not yet integrated with real school systems
- Local blockchain and mock data for demonstration

---

## 🤝 Contributing

Contributions are welcome! Please open an issue to discuss major changes before submitting a pull request.

---

## 📄 License

This project is licensed under the MIT License.

---

## 📬 Contact

For questions or feedback, please open an issue or reach out via GitHub Discussions.

---

## 📝 One-Sentence Pitch

A role-driven results-approval system where each academic officer approves in sequence, and the blockchain acts like a permanent CCTV for the entire process—making tampering obvious, approvals faster, and accountability automatic.
