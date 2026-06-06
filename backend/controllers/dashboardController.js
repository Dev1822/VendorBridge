const RFQ = require('../models/RFQ');
const Quotation = require('../models/Quotation');
const PO = require('../models/PO');
const Invoice = require('../models/Invoice');

const getDashboardStats = async (req, res) => {
    try {
        const { role, _id } = req.user;
        let stats = { activeRfqs: 0, pendingApprovals: 0, monthlySpend: 0, activeInvoices: 0 };
        let activity = [];

        // Simplified for hackathon: return system-wide stats or tailored stats
        if (role === 'Vendor') {
            stats.activeRfqs = await RFQ.countDocuments({ status: 'Open' });
            stats.pendingApprovals = await Quotation.countDocuments({ vendorId: _id, status: 'Under Review' });
            stats.activeInvoices = await Invoice.countDocuments({ vendorId: _id, status: 'Pending' });
            
            stats.totalRfqs = await RFQ.countDocuments({});
            stats.totalQuotes = await Quotation.countDocuments({ vendorId: _id });
            stats.totalPOs = await PO.countDocuments({ vendorId: _id });

            const pos = await PO.find({ vendorId: _id });
            stats.monthlySpend = pos.reduce((sum, po) => sum + po.totalAmount, 0);

            const recentPos = await PO.find({ vendorId: _id }).sort({ createdAt: -1 }).limit(3);
            activity = recentPos.map(p => ({
                text: `Purchase Order ${p.poNumber} assigned to you.`,
                date: p.createdAt
            }));

        } else {
            stats.activeRfqs = await RFQ.countDocuments({ status: 'Open' });
            stats.pendingApprovals = await Quotation.countDocuments({ status: 'Under Review' });
            stats.activeInvoices = await Invoice.countDocuments({ status: 'Pending' });
            
            stats.totalRfqs = await RFQ.countDocuments();
            stats.totalQuotes = await Quotation.countDocuments();
            stats.totalPOs = await PO.countDocuments();

            const pos = await PO.find();
            stats.monthlySpend = pos.reduce((sum, po) => sum + po.totalAmount, 0);

            const recentRfqs = await RFQ.find().sort({ createdAt: -1 }).limit(4).populate('createdBy', 'firstName lastName');
            activity = recentRfqs.map(r => ({
                text: `New RFQ "${r.itemName}" created by ${r.createdBy?.firstName || 'user'}.`,
                date: r.createdAt
            }));
        }

        res.json({ stats, activity });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getDashboardStats };
