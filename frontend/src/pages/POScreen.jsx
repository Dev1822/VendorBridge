import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

import { useNavigate } from 'react-router-dom';

const POScreen = () => {
    const [pos, setPos] = useState([]);
    const [selectedPO, setSelectedPO] = useState(null);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const fetchPOs = async () => {
        const token = localStorage.getItem('token');
        try {
            const url = user.role === 'Vendor' ? 'http://localhost:5000/api/pos/my' : 'http://localhost:5000/api/pos';
            const res = await axios.get(url, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPos(res.data);
        } catch (error) {
            console.error("Error fetching POs", error);
        }
    };

    useEffect(() => {
        fetchPOs();
    }, [user]);

    const handleGenerateInvoice = async (po) => {
        const token = localStorage.getItem('token');
        try {
            const tax = po.totalAmount * 0.125;
            await axios.post('http://localhost:5000/api/invoices', {
                poId: po._id,
                vendorId: po.vendorId?._id || po.vendorId,
                amount: po.totalAmount,
                taxAmount: tax,
                totalAmount: po.totalAmount + tax
            }, { headers: { Authorization: `Bearer ${token}` } });
            
            alert("Invoice successfully generated!");
            navigate('/invoices');
        } catch (error) {
            console.error(error);
            alert("Failed to generate invoice");
        }
    };

    const downloadPDF = (po) => {
        const doc = new jsPDF();
        
        // Header
        doc.setFontSize(24);
        doc.setFont("helvetica", "bold");
        doc.text("PURCHASE ORDER", 14, 25);
        
        // Company Info
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text("VendorBridge Corp.", 14, 35);
        doc.text("456 Tech Avenue, Silicon Valley", 14, 40);
        doc.text("procurement@vendorbridge.com", 14, 45);

        // PO Details
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text(`PO Number:`, 130, 35);
        doc.setFont("helvetica", "normal");
        doc.text(po.poNumber, 160, 35);
        
        doc.setFont("helvetica", "bold");
        doc.text(`Date:`, 130, 42);
        doc.setFont("helvetica", "normal");
        doc.text(new Date(po.createdAt).toLocaleDateString(), 160, 42);

        doc.setFont("helvetica", "bold");
        doc.text(`Status:`, 130, 49);
        doc.setFont("helvetica", "normal");
        doc.text(po.status || 'Generated', 160, 49);

        // Divider
        doc.setLineWidth(0.5);
        doc.line(14, 55, 196, 55);

        // Vendor Info
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text("Vendor Details:", 14, 65);
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text(`Company: ${po.vendorId?.companyName || 'N/A'}`, 14, 72);
        doc.text(`Contact: ${po.vendorId?.firstName || 'Vendor'} ${po.vendorId?.lastName || ''}`, 14, 77);

        // Table Data
        autoTable(doc, {
            startY: 90,
            head: [['Item Description', 'Quantity', 'Unit Price', 'Total']],
            body: [
                [
                    po.rfqId?.itemName || 'Requested Item', 
                    po.rfqId?.quantity || 1, 
                    `$${(po.totalAmount / (po.rfqId?.quantity || 1)).toLocaleString()}`, 
                    `$${po.totalAmount.toLocaleString()}`
                ]
            ],
            theme: 'grid',
            headStyles: { fillColor: [50, 50, 50] }
        });

        // Totals
        const finalY = doc.lastAutoTable.finalY || 120;
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text(`Grand Total: $${po.totalAmount.toLocaleString()}`, 130, finalY + 15);

        // Footer
        doc.setFontSize(10);
        doc.setFont("helvetica", "italic");
        doc.setTextColor(150);
        doc.text("This is a computer generated document. No signature is required.", 14, 280);

        doc.save(`${po.poNumber}.pdf`);
    };

    if (selectedPO) {
        return (
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <div>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, margin: 0 }}>Purchase Order & Invoice</h1>
                        <p style={{ margin: '0.5rem 0', opacity: 0.8 }}>PO {selectedPO.poNumber} auto generated after approval</p>
                    </div>
                    <button className="brutal-btn secondary" onClick={() => setSelectedPO(null)}>Back to List</button>
                </div>

                <div className="brutal-box" style={{ padding: '3rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid black', paddingBottom: '2rem', marginBottom: '2rem' }}>
                        <div>
                            <h2 style={{ fontSize: '2rem', margin: 0 }}>PO #{selectedPO.poNumber}</h2>
                            <p style={{ fontWeight: 'bold' }}>Date: {new Date(selectedPO.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button className="brutal-btn secondary" onClick={() => downloadPDF(selectedPO)}>Print PO</button>
                            <button className="brutal-btn primary" onClick={() => handleGenerateInvoice(selectedPO)}>Generate Invoice</button>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '3rem' }}>
                        <div>
                            <h3 style={{ borderBottom: '2px solid black', paddingBottom: '0.5rem' }}>From</h3>
                            <p><strong>Alpha Supplies</strong></p>
                            <p>123 Vendor Street, Industrial Park</p>
                            <p>Contact: alpha@vendor.com</p>
                            <p>Payment Terms: Net 30</p>
                        </div>
                        <div>
                            <h3 style={{ borderBottom: '2px solid black', paddingBottom: '0.5rem' }}>To</h3>
                            <p><strong>VendorBridge Corp</strong></p>
                            <p>456 Tech Avenue, Silicon Valley</p>
                            <p>Contact: procurement@vendorbridge.com</p>
                            <p>Delivery: 15 Aug 2025</p>
                        </div>
                    </div>

                    <table className="brutal-table">
                        <thead>
                            <tr>
                                <th>Item Name</th>
                                <th>Qty</th>
                                <th>Price</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{selectedPO.rfqId?.itemName || 'Office Furniture Q3'}</td>
                                <td>50</td>
                                <td>${(selectedPO.totalAmount / 50) || 90}</td>
                                <td>${selectedPO.totalAmount}</td>
                            </tr>
                        </tbody>
                    </table>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
                        <div style={{ width: '300px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}><span>Subtotal:</span> <span>${selectedPO.totalAmount - 500}</span></div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}><span>Taxes:</span> <span>$500</span></div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', borderTop: '2px solid black', paddingTop: '1rem', fontSize: '1.5rem', fontWeight: 900 }}>
                                <span>Total:</span> <span>${selectedPO.totalAmount}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <h1 style={{ marginBottom: '2rem', fontSize: '2.5rem', fontWeight: 900 }}>Purchase Orders</h1>
            <div className="brutal-box">
                <div className="brutal-table-container">
                    <table className="brutal-table">
                        <thead>
                            <tr>
                                <th>PO Number</th>
                                <th>RFQ</th>
                                <th>Vendor</th>
                                <th>Amount</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pos.map(po => (
                                <tr key={po._id}>
                                    <td><strong>{po.poNumber}</strong></td>
                                    <td>{po.rfqId?.itemName || po.rfqId?.title || 'N/A'}</td>
                                    <td>{po.vendorId?.firstName || po.vendorId?.name || 'N/A'}</td>
                                    <td>${po.totalAmount}</td>
                                    <td><span className="brutal-badge">{po.status}</span></td>
                                    <td>
                                        <button className="brutal-btn secondary" onClick={() => setSelectedPO(po)}>View Details</button>
                                    </td>
                                </tr>
                            ))}
                            {pos.length === 0 && (
                                <tr><td colSpan="6" style={{textAlign: 'center'}}>No Purchase Orders found.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default POScreen;
