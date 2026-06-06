const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', protect, authorize('Admin', 'Procurement Officer', 'Manager'), async (req, res) => {
    try {
        const vendors = await User.find({ role: 'Vendor' }).select('-password');
        res.json(vendors);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
