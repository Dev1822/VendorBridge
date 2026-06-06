const PO = require('../models/PO');

const createPO = async (req, res) => {
    const { quotationId, vendorId, rfqId, totalAmount } = req.body;
    try {
        const po = await PO.create({
            poNumber: `PO-${Date.now()}`,
            quotationId, vendorId, rfqId, totalAmount, createdBy: req.user._id
        });
        res.status(201).json(po);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getPOs = async (req, res) => {
    try {
        const pos = await PO.find().populate('vendorId', 'firstName lastName companyName').populate('rfqId', 'itemName');
        res.json(pos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getMyPOs = async (req, res) => {
    try {
        const pos = await PO.find({ vendorId: req.user._id }).populate('rfqId', 'itemName');
        res.json(pos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createPO, getPOs, getMyPOs };
