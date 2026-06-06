const mongoose = require('mongoose');

const poSchema = new mongoose.Schema({
    poNumber: { type: String, required: true, unique: true },
    quotationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quotation', required: true },
    vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    rfqId: { type: mongoose.Schema.Types.ObjectId, ref: 'RFQ', required: true },
    totalAmount: { type: Number, required: true },
    status: { type: String, enum: ['Generated', 'Sent', 'Accepted'], default: 'Generated' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('PO', poSchema);
