# VendorBridge 🌉

**VendorBridge** is a modern, high-performance B2B procurement and vendor management platform built for speed and transparency. Featuring a bold Neo-Brutalist design, VendorBridge streamlines the entire supply chain workflow from Request for Quotation (RFQ) to Purchase Order (PO) generation and Invoicing.

## 🚀 Features

- **Role-Based Workflows**: Tailored dashboards for Procurement Managers and Vendors.
- **Automated RFQs & Quotations**: Seamlessly request quotes, compare bids, and select winners.
- **Smart Approvals**: Built-in manager approval engine for high-value purchases.
- **Auto-PO Generation**: Instantly generate Purchase Orders as downloadable PDFs upon quotation approval.
- **Invoicing & Financials**: Track payments, pending invoices, and procurement spend.
- **Real-Time Analytics**: Dynamic dashboard visualizations for active RFQs, Pending Approvals, and Invoice metrics.
- **Comprehensive Audit Trail**: Track every action across the platform with our real-time Activity logger.
- **Neo-Brutalist UI**: An aggressive, high-contrast, modern user interface that breaks away from generic corporate design.

## 🛠️ Tech Stack

**Frontend:**
- React.js (Vite)
- Vanilla CSS (Custom Neo-Brutalist Design System)
- Axios & React Router

**Backend:**
- Node.js & Express.js
- MongoDB & Mongoose
- JSON Web Tokens (JWT) for Authentication
- PDFKit (for Automated Purchase Order generation)

## 💻 Running Locally

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed and a running [MongoDB](https://www.mongodb.com/) instance or Atlas cluster.

### 1. Clone the repository
```bash
git clone https://github.com/Dev1822/VendorBridge.git
cd VendorBridge
```

### 2. Setup the Backend
Open a terminal and navigate to the backend folder:
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` directory and add your variables:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
```
Start the backend server:
```bash
npm run dev
```

### 3. Setup the Frontend
Open a new terminal and navigate to the frontend folder:
```bash
cd frontend
npm install
```
Start the frontend development server:
```bash
npm run dev
```
