const express = require('express');
const router = express.Router();
const { getRFQs, createRFQ, getRFQById, updateRFQStatus } = require('../controllers/rfqController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getRFQs)
    .post(protect, authorize('Procurement Officer', 'Admin'), createRFQ);

router.route('/:id')
    .get(protect, getRFQById)
    .put(protect, authorize('Procurement Officer', 'Admin', 'Manager'), updateRFQStatus);

module.exports = router;
