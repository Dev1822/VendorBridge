const Invoice = require('../models/Invoice');

const createInvoice = async (req, res) => {
    const { poId, vendorId, amount, taxAmount, totalAmount } = req.body;
    try {
        const invoice = await Invoice.create({
            invoiceNumber: `INV-${Date.now()}`,
            poId, vendorId, amount, taxAmount, totalAmount, createdBy: req.user._id
        });
        res.status(201).json(invoice);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getInvoices = async (req, res) => {
    try {
        const invoices = await Invoice.find().populate('vendorId', 'firstName lastName companyName').populate('poId', 'poNumber');
        res.json(invoices);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getMyInvoices = async (req, res) => {
    try {
        const invoices = await Invoice.find({ vendorId: req.user._id }).populate('poId', 'poNumber');
        res.json(invoices);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createInvoice, getInvoices, getMyInvoices };
