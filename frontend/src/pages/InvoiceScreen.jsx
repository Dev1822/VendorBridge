import { API_URL } from '../config';
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const InvoiceScreen = () => {
    const [invoices, setInvoices] = useState([]);
    const { user } = useContext(AuthContext);

    const fetchInvoices = async () => {
        const token = localStorage.getItem('token');
        try {
            const url = user.role === 'Vendor' ? `${API_URL}/api/invoices/my` : `${API_URL}/api/invoices`;
            const res = await axios.get(url, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setInvoices(res.data);
        } catch (error) {
            console.error("Error fetching Invoices", error);
        }
    };

    useEffect(() => {
        fetchInvoices();
    }, [user]);

    const printInvoice = (inv) => {
        const doc = new jsPDF();
        
        // Header
        doc.setFontSize(24);
        doc.setFont("helvetica", "bold");
        doc.text("TAX INVOICE", 14, 25);
        
        // Company Info (Vendor issues the invoice)
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text(inv.vendorId?.companyName || "Vendor Company", 14, 35);
        doc.text(`Contact: ${inv.vendorId?.firstName || 'Vendor'} ${inv.vendorId?.lastName || ''}`, 14, 40);

        // Invoice Details
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text(`Invoice No:`, 130, 35);
        doc.setFont("helvetica", "normal");
        doc.text(inv.invoiceNumber, 160, 35);
        
        doc.setFont("helvetica", "bold");
        doc.text(`Date:`, 130, 42);
        doc.setFont("helvetica", "normal");
        doc.text(new Date(inv.createdAt).toLocaleDateString(), 160, 42);

        doc.setFont("helvetica", "bold");
        doc.text(`Status:`, 130, 49);
        doc.setFont("helvetica", "normal");
        doc.text(inv.status || 'Pending Payment', 160, 49);

        // Divider
        doc.setLineWidth(0.5);
        doc.line(14, 55, 196, 55);

        // Bill To
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text("Bill To:", 14, 65);
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text("VendorBridge Corp.", 14, 72);
        doc.text("456 Tech Avenue, Silicon Valley", 14, 77);
        doc.text("procurement@vendorbridge.com", 14, 82);

        // Table Data
        autoTable(doc, {
            startY: 95,
            head: [['Description', 'PO Reference', 'Subtotal', 'Tax', 'Total']],
            body: [
                [
                    'Fulfillment of Purchase Order', 
                    inv.poId?.poNumber || 'N/A', 
                    `$${inv.amount.toLocaleString()}`, 
                    `$${inv.taxAmount.toLocaleString()}`, 
                    `$${inv.totalAmount.toLocaleString()}`
                ]
            ],
            theme: 'grid',
            headStyles: { fillColor: [50, 50, 50] }
        });

        // Totals
        const finalY = doc.lastAutoTable.finalY || 120;
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text(`Total Due: $${inv.totalAmount.toLocaleString()}`, 130, finalY + 15);

        // Footer
        doc.setFontSize(10);
        doc.setFont("helvetica", "italic");
        doc.setTextColor(150);
        doc.text("Please remit payment within 30 days. Thank you for your business!", 14, 280);

        doc.autoPrint();
        window.open(doc.output('bloburl'), '_blank');
    };

    return (
        <div>
            <h1 style={{ marginBottom: '2rem' }}>Invoices</h1>
            <div className="brutal-box">
                <div className="brutal-table-container">
                    <table className="brutal-table">
                        <thead>
                            <tr>
                                <th>Invoice Number</th>
                                <th>PO Number</th>
                                <th>Amount</th>
                                <th>Tax</th>
                                <th>Total</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {invoices.map(inv => (
                                <tr key={inv._id}>
                                    <td><strong>{inv.invoiceNumber}</strong></td>
                                    <td>{inv.poId?.poNumber || 'N/A'}</td>
                                    <td>${inv.amount}</td>
                                    <td>${inv.taxAmount}</td>
                                    <td><strong>${inv.totalAmount}</strong></td>
                                    <td><span className={`brutal-badge ${inv.status === 'Paid' ? 'success' : 'warning'}`}>{inv.status}</span></td>
                                    <td style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button className="brutal-btn secondary" onClick={() => printInvoice(inv)}>Print PDF</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default InvoiceScreen;
