const express = require('express');
const router = express.Router();
const { createPO, getPOs, getMyPOs } = require('../controllers/poController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, authorize('Procurement Officer', 'Admin'), createPO);
router.get('/', protect, authorize('Procurement Officer', 'Manager', 'Admin'), getPOs);
router.get('/my', protect, authorize('Vendor'), getMyPOs);

module.exports = router;
