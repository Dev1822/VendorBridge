const express = require('express');
const router = express.Router();
const { createInvoice, getInvoices, getMyInvoices } = require('../controllers/invoiceController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, authorize('Procurement Officer', 'Manager', 'Admin', 'Vendor'), createInvoice);
router.get('/', protect, authorize('Procurement Officer', 'Manager', 'Admin'), getInvoices);
router.get('/my', protect, authorize('Vendor'), getMyInvoices);

module.exports = router;
