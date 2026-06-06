const express = require('express');
const router = express.Router();
const { submitQuotation, getQuotationsForRFQ, getMyQuotations, updateQuotationStatus, getPendingQuotations } = require('../controllers/quotationController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, authorize('Vendor'), submitQuotation);
router.get('/my', protect, authorize('Vendor'), getMyQuotations);
router.get('/pending', protect, authorize('Manager', 'Admin'), getPendingQuotations);
router.get('/rfq/:rfqId', protect, authorize('Procurement Officer', 'Manager', 'Admin'), getQuotationsForRFQ);
router.put('/:id', protect, authorize('Procurement Officer', 'Manager', 'Admin'), updateQuotationStatus);

module.exports = router;
