const mongoose = require('mongoose');

const rfqSchema = new mongoose.Schema({
    category: { type: String, required: true },
    itemName: { type: String, required: true },
    quantity: { type: Number, required: true },
    requiredDeliveryDate: { type: Date, required: true },
    specifications: { type: String },
    specialNotes: { type: String },
    status: { type: String, enum: ['Open', 'Closed', 'Awarded'], default: 'Open' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('RFQ', rfqSchema);
