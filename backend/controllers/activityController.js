const RFQ = require('../models/RFQ');
const Quotation = require('../models/Quotation');
const PO = require('../models/PO');

const getActivityFeed = async (req, res) => {
    try {
        const { role, _id } = req.user;
        let events = [];

        // Fetch RFQs
        let rfqs = [];
        if (role === 'Vendor') {
            rfqs = await RFQ.find({ status: 'Open' }).populate('createdBy', 'firstName lastName companyName');
        } else {
            rfqs = await RFQ.find().populate('createdBy', 'firstName lastName companyName');
        }

        rfqs.forEach(r => {
            events.push({
                _id: r._id,
                type: 'RFQ',
                title: `RFQ "${r.itemName}" published`,
                actor: r.createdBy?.companyName || `${r.createdBy?.firstName} ${r.createdBy?.lastName}`,
                date: r.createdAt
            });
        });

        // Fetch Quotes
        let quotes = [];
        if (role === 'Vendor') {
            quotes = await Quotation.find({ vendorId: _id }).populate('vendorId', 'firstName lastName companyName');
        } else {
            quotes = await Quotation.find().populate('vendorId', 'firstName lastName companyName');
        }

        quotes.forEach(q => {
            events.push({
                _id: q._id,
                type: 'QUOTATION',
                title: `Quotation ${q.status.toLowerCase()}`,
                actor: q.vendorId?.companyName || `${q.vendorId?.firstName} ${q.vendorId?.lastName}`,
                date: q.updatedAt || q.createdAt
            });
        });

        // Fetch POs
        let pos = [];
        if (role === 'Vendor') {
            pos = await PO.find({ vendorId: _id }).populate('createdBy', 'firstName lastName');
        } else {
            pos = await PO.find().populate('vendorId', 'firstName lastName companyName').populate('createdBy', 'firstName lastName');
        }

        pos.forEach(p => {
            const vendorName = p.vendorId?.companyName || p.vendorId?.firstName || 'Vendor';
            events.push({
                _id: p._id,
                type: 'PO',
                title: `Purchase Order ${p.poNumber} created for ${vendorName}`,
                actor: p.createdBy?.firstName ? `${p.createdBy.firstName} ${p.createdBy.lastName}` : 'System',
                date: p.createdAt
            });
        });

        // Sort events chronologically descending
        events.sort((a, b) => new Date(b.date) - new Date(a.date));

        res.json(events);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getActivityFeed };
