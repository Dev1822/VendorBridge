const RFQ = require('../models/RFQ');

const getRFQs = async (req, res) => {
    try {
        const rfqs = await RFQ.find().populate('createdBy', 'name email companyName').sort({ createdAt: -1 });
        res.json(rfqs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createRFQ = async (req, res) => {
    const { category, itemName, quantity, requiredDeliveryDate, specifications, specialNotes } = req.body;
    try {
        const rfq = await RFQ.create({
            category,
            itemName,
            quantity,
            requiredDeliveryDate,
            specifications,
            specialNotes,
            createdBy: req.user._id
        });
        res.status(201).json(rfq);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getRFQById = async (req, res) => {
    try {
        const rfq = await RFQ.findById(req.params.id).populate('createdBy', 'name email');
        if (rfq) res.json(rfq);
        else res.status(404).json({ message: 'RFQ not found' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const updateRFQStatus = async (req, res) => {
    try {
        const rfq = await RFQ.findById(req.params.id);
        if (rfq) {
            rfq.status = req.body.status || rfq.status;
            const updatedRFQ = await rfq.save();
            res.json(updatedRFQ);
        } else {
            res.status(404).json({ message: 'RFQ not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = { getRFQs, createRFQ, getRFQById, updateRFQStatus };
