const mongoose = require('mongoose');

const quotationSchema = new mongoose.Schema({
    rfqId: { type: mongoose.Schema.Types.ObjectId, ref: 'RFQ', required: true },
    vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    itemsPricing: [{
        item: String,
        quantity: Number,
        unitPrice: Number,
        totalPrice: Number
    }],
    totalAmount: { type: Number, required: true },
    deliveryTimeline: { type: String, required: true },
    notes: { type: String },
    status: { 
        type: String, 
        enum: ['Submitted', 'Under Review', 'Approved', 'Rejected'], 
        default: 'Submitted' 
    },
    managerRemarks: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Quotation', quotationSchema);
