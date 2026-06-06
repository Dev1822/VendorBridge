const Quotation = require('../models/Quotation');
const RFQ = require('../models/RFQ');

const submitQuotation = async (req, res) => {
    const { rfqId, itemsPricing, totalAmount, deliveryTimeline, notes } = req.body;
    try {
        const quote = await Quotation.create({
            rfqId, vendorId: req.user._id, itemsPricing, totalAmount, deliveryTimeline, notes
        });
        res.status(201).json(quote);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getQuotationsForRFQ = async (req, res) => {
    try {
        const quotes = await Quotation.find({ rfqId: req.params.rfqId }).populate('vendorId', 'firstName lastName companyName');
        res.json(quotes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getMyQuotations = async (req, res) => {
    try {
        const quotes = await Quotation.find({ vendorId: req.user._id }).populate('rfqId', 'title status');
        res.json(quotes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateQuotationStatus = async (req, res) => {
    const { status, managerRemarks } = req.body;
    try {
        const quote = await Quotation.findById(req.params.id);
        if (quote) {
            quote.status = status || quote.status;
            if (managerRemarks) quote.managerRemarks = managerRemarks;
            const updated = await quote.save();
            
            if (status === 'Approved') {
                const PO = require('../models/PO');
                await PO.create({
                    poNumber: `PO-${Date.now()}`,
                    quotationId: quote._id,
                    vendorId: quote.vendorId,
                    rfqId: quote.rfqId,
                    totalAmount: quote.totalAmount,
                    createdBy: req.user._id
                });
            }

            res.json(updated);
        } else {
            res.status(404).json({ message: 'Quotation not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getPendingQuotations = async (req, res) => {
    try {
        const quotes = await Quotation.find({ status: 'Under Review' })
            .populate('vendorId', 'firstName lastName companyName')
            .populate('rfqId', 'itemName category quantity');
        res.json(quotes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { submitQuotation, getQuotationsForRFQ, getMyQuotations, updateQuotationStatus, getPendingQuotations };
