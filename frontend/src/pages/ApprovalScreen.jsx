import { API_URL } from '../config';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ApprovalScreen = () => {
    const [pendingQuotes, setPendingQuotes] = useState([]);
    const [selectedQuoteIdx, setSelectedQuoteIdx] = useState(0);

    const fetchPending = async () => {
        const token = localStorage.getItem('token');
        try {
            const res = await axios.get(`${API_URL}/api/quotations/pending`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPendingQuotes(res.data);
        } catch (error) {
            console.error("Error fetching pending quotes", error);
        }
    };

    useEffect(() => {
        fetchPending();
    }, []);

    const handleApprove = async (quoteId) => {
        const token = localStorage.getItem('token');
        try {
            await axios.put(`${API_URL}/api/quotations/${quoteId}`, {
                status: 'Approved'
            }, { headers: { Authorization: `Bearer ${token}` } });
            alert("Quotation Approved! Purchase Order will be generated.");
            fetchPending();
        } catch (error) {
            console.error(error);
            alert("Failed to approve quotation");
        }
    };

    if (pendingQuotes.length === 0) {
        return (
            <div>
                <div style={{ marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 900, margin: 0 }}>Approval Workflow</h1>
                    <p style={{ margin: '0.5rem 0', opacity: 0.8 }}>No quotations currently waiting for Manager approval.</p>
                </div>
            </div>
        );
    }

    const currentQuote = pendingQuotes[selectedQuoteIdx];

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 900, margin: 0 }}>Approval Workflow</h1>
                    <p style={{ margin: '0.5rem 0', opacity: 0.8 }}>Review recommended bids and grant final financial approval</p>
                </div>
                {pendingQuotes.length > 1 && (
                    <div style={{ width: '300px' }}>
                        <select className="brutal-input" value={selectedQuoteIdx} onChange={(e) => setSelectedQuoteIdx(parseInt(e.target.value))}>
                            {pendingQuotes.map((q, idx) => (
                                <option key={q._id} value={idx}>{q.rfqId?.itemName} - {q.vendorId?.companyName || q.vendorId?.firstName}</option>
                            ))}
                        </select>
                    </div>
                )}
            </div>

            <div className="brutal-box" style={{ padding: '3rem' }}>
                {/* Visual Stepper */}
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginBottom: '4rem' }}>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ background: 'var(--success)', color: 'white', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid black', fontWeight: 'bold' }}>✓</div>
                        <span style={{ fontWeight: 'bold' }}>Requested</span>
                    </div>

                    <div style={{ height: '4px', background: 'black', width: '100px', marginBottom: '1.5rem' }}></div>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ background: 'var(--primary)', color: 'black', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid black', fontWeight: 'bold', fontSize: '1.2rem' }}>2</div>
                        <span style={{ fontWeight: 'bold' }}>Under Review</span>
                    </div>

                    <div style={{ height: '4px', background: '#ccc', width: '100px', marginBottom: '1.5rem' }}></div>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', opacity: 0.5 }}>
                        <div style={{ background: 'white', color: 'black', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid black', fontWeight: 'bold', fontSize: '1.2rem' }}>3</div>
                        <span style={{ fontWeight: 'bold' }}>PO generated</span>
                    </div>

                </div>

                {/* Details Card */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', border: '2px solid black', padding: '2rem', backgroundColor: '#fafafa' }}>
                    <div>
                        <h3 style={{ marginBottom: '1rem', borderBottom: '2px solid black', paddingBottom: '0.5rem' }}>Request Details</h3>
                        <p><strong>Item:</strong> {currentQuote.rfqId?.itemName}</p>
                        <p><strong>Category:</strong> {currentQuote.rfqId?.category}</p>
                        <p><strong>Vendor:</strong> {currentQuote.vendorId?.companyName || `${currentQuote.vendorId?.firstName} ${currentQuote.vendorId?.lastName}`}</p>
                        <p><strong>Date Submitted:</strong> {new Date(currentQuote.createdAt).toLocaleDateString()}</p>
                        <p><strong>Delivery:</strong> {currentQuote.deliveryTimeline}</p>
                    </div>
                    <div>
                        <h3 style={{ marginBottom: '1rem', borderBottom: '2px solid black', paddingBottom: '0.5rem' }}>Financial Summary</h3>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}><span>Subtotal:</span> <span>${currentQuote.totalAmount?.toLocaleString()}</span></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}><span>Taxes (0%):</span> <span>$0</span></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', borderTop: '2px solid black', paddingTop: '1rem', fontSize: '1.5rem', fontWeight: 900 }}>
                            <span>Total:</span> <span style={{ color: 'var(--success)' }}>${currentQuote.totalAmount?.toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '3rem' }}>
                    <button className="brutal-btn danger" style={{ padding: '1rem 3rem', fontSize: '1.2rem' }}>Reject</button>
                    <button className="brutal-btn success" style={{ padding: '1rem 3rem', fontSize: '1.2rem' }} onClick={() => handleApprove(currentQuote._id)}>Approve & Generate PO</button>
                </div>

            </div>
        </div>
    );
};

export default ApprovalScreen;
