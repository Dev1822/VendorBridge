const PO = require('../models/PO');
const RFQ = require('../models/RFQ');

const getReports = async (req, res) => {
    try {
        const { role, _id } = req.user;

        // Base match for vendor vs internal
        const matchStage = role === 'Vendor' ? { vendorId: _id } : {};

        // 1. Total Spend & PO Count
        const spendStats = await PO.aggregate([
            { $match: matchStage },
            {
                $group: {
                    _id: null,
                    totalSpend: { $sum: "$totalAmount" },
                    poCount: { $sum: 1 }
                }
            }
        ]);

        const totalSpend = spendStats.length > 0 ? spendStats[0].totalSpend : 0;
        const totalPOs = spendStats.length > 0 ? spendStats[0].poCount : 0;

        // 2. Spend by Category
        // We need to join with RFQ to get the category
        const categoryStats = await PO.aggregate([
            { $match: matchStage },
            {
                $lookup: {
                    from: "rfqs",
                    localField: "rfqId",
                    foreignField: "_id",
                    as: "rfq"
                }
            },
            { $unwind: "$rfq" },
            {
                $group: {
                    _id: "$rfq.category",
                    spend: { $sum: "$totalAmount" }
                }
            },
            { $sort: { spend: -1 } }
        ]);

        // Calculate percentages
        const categoryData = categoryStats.map(cat => ({
            category: cat._id || 'Uncategorized',
            spend: cat.spend,
            percentage: totalSpend > 0 ? Math.round((cat.spend / totalSpend) * 100) : 0
        }));

        // 3. Top Vendors
        let topVendors = [];
        if (role !== 'Vendor') {
            topVendors = await PO.aggregate([
                {
                    $group: {
                        _id: "$vendorId",
                        spend: { $sum: "$totalAmount" },
                        poCount: { $sum: 1 }
                    }
                },
                { $sort: { spend: -1 } },
                { $limit: 5 },
                {
                    $lookup: {
                        from: "users",
                        localField: "_id",
                        foreignField: "_id",
                        as: "vendor"
                    }
                },
                { $unwind: "$vendor" },
                {
                    $project: {
                        vendorName: { $ifNull: ["$vendor.companyName", { $concat: ["$vendor.firstName", " ", "$vendor.lastName"] }] },
                        spend: 1,
                        poCount: 1
                    }
                }
            ]);
        }

        res.json({
            totalSpend,
            totalPOs,
            onTimeDelivery: 98, // Mock metric
            categoryData,
            topVendors
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getReports };
