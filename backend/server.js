const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/authRoutes');
const rfqRoutes = require('./routes/rfqRoutes');
const poRoutes = require('./routes/poRoutes');
const invoiceRoutes = require('./routes/invoiceRoutes');
const vendorRoutes = require('./routes/vendorRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const quotationRoutes = require('./routes/quotationRoutes');
const activityRoutes = require('./routes/activityRoutes');
const reportRoutes = require('./routes/reportRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/rfqs', rfqRoutes);
app.use('/api/pos', poRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/quotations', quotationRoutes);
app.use('/api/activity', activityRoutes);
app.use('/api/reports', reportRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB Connected to VendorBridge'))
.catch(err => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
