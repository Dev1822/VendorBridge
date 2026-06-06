import { API_URL } from '../config';
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const QuotationScreen = () => {
    const { user } = useContext(AuthContext);
    const [selectedRFQ, setSelectedRFQ] = useState('RFQ-2025');
    
    const [rfqs, setRfqs] = useState([]);
    
    // Vendor State
    const [unitPrice, setUnitPrice] = useState('');
    const [deliveryDate, setDeliveryDate] = useState('');

    useEffect(() => {
        const fetchRFQs = async () => {
            const token = localStorage.getItem('token');
            try {
                const res = await axios.get(`${API_URL}/api/rfqs`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setRfqs(res.data);
                if (res.data.length > 0) setSelectedRFQ(res.data[0]._id);
            } catch (error) {
                console.error("Error fetching RFQs", error);
            }
        };
        if (user.role === 'Vendor') fetchRFQs();
    }, [user.role]);

    const handleSubmit = () => {
        alert("Quotation successfully submitted for review!");
        setUnitPrice('');
        setDeliveryDate('');
    };

    if (user.role === 'Vendor') {
        const selected = rfqs.find(r => r._id === selectedRFQ);

        return (
            <div>
                <div style={{ marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 900, margin: 0 }}>Submit Quotations</h1>
                    <p style={{ margin: '0.5rem 0', opacity: 0.8 }}>Submit your best bids for open RFQs</p>
                </div>

                <div className="brutal-box">
                    <div style={{ marginBottom: '2rem' }}>
                        <label style={{ fontWeight: 'bold' }}>Select RFQ to view/submit:</label>
                        <select className="brutal-input" style={{ width: '100%', marginTop: '0.5rem' }} value={selectedRFQ} onChange={(e) => setSelectedRFQ(e.target.value)}>
                            {rfqs.map(rfq => (
                                <option key={rfq._id} value={rfq._id}>{rfq.itemName} - {rfq.category}</option>
                            ))}
                            {rfqs.length === 0 && <option>No active RFQs available</option>}
                        </select>
                    </div>

                    {selected && (
                        <div className="brutal-table-container">
                            <table className="brutal-table">
                                <thead>
                                    <tr>
                                        <th>Item Description</th>
                                        <th>Qty</th>
                                        <th>Unit Price</th>
                                        <th>Total Price</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>{selected.itemName}</td>
                                        <td>{selected.quantity}</td>
                                        <td><input type="number" className="brutal-input" style={{ width: '100px' }} value={unitPrice} onChange={e => setUnitPrice(e.target.value)} placeholder="$" /></td>
                                        <td>${unitPrice ? (unitPrice * selected.quantity).toLocaleString() : '0'}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    )}

                    <div style={{ display: 'flex', gap: '2rem', marginTop: '2rem' }}>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label>Delivery Date</label>
                            <input type="date" className="brutal-input" value={deliveryDate} onChange={e => setDeliveryDate(e.target.value)} />
                        </div>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label>Additional Notes</label>
                            <input type="text" className="brutal-input" placeholder="Any comments..." />
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2rem', borderTop: '2px solid black', paddingTop: '1rem' }}>
                        <div>
                            <p style={{ margin: 0 }}>Total Amount: <strong>${(unitPrice && selected) ? (unitPrice * selected.quantity).toLocaleString() : '0'}</strong></p>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button className="brutal-btn danger" onClick={() => {setUnitPrice(''); setDeliveryDate('');}}>Cancel</button>
                            <button className="brutal-btn primary" onClick={handleSubmit}>Submit Quotation</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Procurement Officer State
    const [procRfqs, setProcRfqs] = useState([]);
    const [selectedProcRfq, setSelectedProcRfq] = useState('');
    const [quotations, setQuotations] = useState([]);

    useEffect(() => {
        const fetchProcData = async () => {
            const token = localStorage.getItem('token');
            try {
                const rfqsRes = await axios.get(`${API_URL}/api/rfqs`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setProcRfqs(rfqsRes.data);
                if (rfqsRes.data.length > 0) setSelectedProcRfq(rfqsRes.data[0]._id);
            } catch (error) {
                console.error("Error fetching RFQs", error);
            }
        };
        if (user.role !== 'Vendor') fetchProcData();
    }, [user.role]);

    useEffect(() => {
        if (!selectedProcRfq || user.role === 'Vendor') return;
        const fetchQuotes = async () => {
            const token = localStorage.getItem('token');
            try {
                const res = await axios.get(`${API_URL}/api/quotations/rfq/${selectedProcRfq}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setQuotations(res.data);
            } catch (error) {
                console.error("Error fetching quotations", error);
            }
        };
        fetchQuotes();
    }, [selectedProcRfq, user.role]);

    const handleVendorSubmit = async () => {
        const token = localStorage.getItem('token');
        const selected = rfqs.find(r => r._id === selectedRFQ);
        try {
            await axios.post(`${API_URL}/api/quotations`, {
                rfqId: selectedRFQ,
                itemsPricing: [{ itemName: selected.itemName, unitPrice: unitPrice, quantity: selected.quantity }],
                totalAmount: unitPrice * selected.quantity,
                deliveryTimeline: deliveryDate || '14 days'
            }, { headers: { Authorization: `Bearer ${token}` } });
            alert("Quotation successfully submitted for review!");
            setUnitPrice('');
            setDeliveryDate('');
        } catch (e) { console.error(e); alert("Failed to submit quotation"); }
    };

    if (user.role === 'Vendor') {
        const selected = rfqs.find(r => r._id === selectedRFQ);

        return (
            <div>
                <div style={{ marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 900, margin: 0 }}>Submit Quotations</h1>
                    <p style={{ margin: '0.5rem 0', opacity: 0.8 }}>Submit your best bids for open RFQs</p>
                </div>

                <div className="brutal-box">
                    <div style={{ marginBottom: '2rem' }}>
                        <label style={{ fontWeight: 'bold' }}>Select RFQ to view/submit:</label>
                        <select className="brutal-input" style={{ width: '100%', marginTop: '0.5rem' }} value={selectedRFQ} onChange={(e) => setSelectedRFQ(e.target.value)}>
                            {rfqs.map(rfq => (
                                <option key={rfq._id} value={rfq._id}>{rfq.itemName} - {rfq.category}</option>
                            ))}
                            {rfqs.length === 0 && <option>No active RFQs available</option>}
                        </select>
                    </div>

                    {selected && (
                        <div className="brutal-table-container">
                            <table className="brutal-table">
                                <thead>
                                    <tr>
                                        <th>Item Description</th>
                                        <th>Qty</th>
                                        <th>Unit Price</th>
                                        <th>Total Price</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>{selected.itemName}</td>
                                        <td>{selected.quantity}</td>
                                        <td><input type="number" className="brutal-input" style={{ width: '100px' }} value={unitPrice} onChange={e => setUnitPrice(e.target.value)} placeholder="$" /></td>
                                        <td>${unitPrice ? (unitPrice * selected.quantity).toLocaleString() : '0'}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    )}

                    <div style={{ display: 'flex', gap: '2rem', marginTop: '2rem' }}>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label>Delivery Date</label>
                            <input type="date" className="brutal-input" value={deliveryDate} onChange={e => setDeliveryDate(e.target.value)} />
                        </div>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label>Additional Notes</label>
                            <input type="text" className="brutal-input" placeholder="Any comments..." />
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2rem', borderTop: '2px solid black', paddingTop: '1rem' }}>
                        <div>
                            <p style={{ margin: 0 }}>Total Amount: <strong>${(unitPrice && selected) ? (unitPrice * selected.quantity).toLocaleString() : '0'}</strong></p>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button className="brutal-btn danger" onClick={() => {setUnitPrice(''); setDeliveryDate('');}}>Cancel</button>
                            <button className="brutal-btn primary" onClick={handleVendorSubmit}>Submit Quotation</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Procurement Officer / Manager View (Screen 7 Comparison)
    const activeProcRfqObj = procRfqs.find(r => r._id === selectedProcRfq);

    const handleAcceptQuote = async (quoteId) => {
        const token = localStorage.getItem('token');
        try {
            await axios.put(`${API_URL}/api/quotations/${quoteId}`, {
                status: 'Under Review'
            }, { headers: { Authorization: `Bearer ${token}` } });
            
            // Update local state to reflect change instantly
            setQuotations(quotations.map(q => q._id === quoteId ? { ...q, status: 'Under Review' } : q));
            alert("Quotation successfully recommended to Manager for Final Approval!");
        } catch (error) {
            console.error("Error accepting quote", error);
            alert("Failed to accept quotation");
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 900, margin: 0 }}>Quotation Comparison</h1>
                    <p style={{ margin: '0.5rem 0', opacity: 0.8 }}>Compare incoming vendor bids</p>
                </div>
                <div style={{ width: '300px' }}>
                    <select className="brutal-input" value={selectedProcRfq} onChange={(e) => setSelectedProcRfq(e.target.value)}>
                        {procRfqs.map(rfq => (
                            <option key={rfq._id} value={rfq._id}>{rfq.itemName}</option>
                        ))}
                    </select>
                </div>
            </div>

            {quotations.length === 0 ? (
                <div className="brutal-box" style={{ textAlign: 'center', padding: '3rem' }}>
                    <h3>No quotations received for this RFQ yet.</h3>
                </div>
            ) : (
                <div className="brutal-box" style={{ display: 'flex', overflowX: 'auto', gap: '1rem' }}>
                    <div style={{ borderRight: '2px solid black', paddingRight: '1rem', minWidth: '200px' }}>
                        <h3 style={{ borderBottom: '2px solid black', paddingBottom: '0.5rem' }}>Quotation Details</h3>
                        <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', fontWeight: 'bold' }}>
                            <div>Vendor Name</div>
                            <div>Total Price</div>
                            <div>Delivery Time</div>
                            <div>Status</div>
                        </div>
                    </div>

                    {quotations.map((quote, idx) => (
                        <div key={quote._id} style={{ 
                            border: idx === 0 ? '3px solid var(--success)' : '2px solid black', 
                            backgroundColor: idx === 0 ? '#e6ffe6' : 'transparent',
                            padding: '1rem', 
                            minWidth: '250px',
                            position: 'relative' 
                        }}>
                            {idx === 0 && <div style={{ position: 'absolute', top: '-15px', left: '50%', transform: 'translateX(-50%)', background: 'var(--success)', color: 'white', padding: '0.2rem 1rem', fontWeight: 'bold', fontSize: '0.8rem', border: '2px solid black' }}>Best Option</div>}
                            <h3 style={{ borderBottom: '2px solid black', paddingBottom: '0.5rem', textAlign: 'center' }}>
                                {quote.vendorId?.companyName || quote.vendorId?.name || `Vendor ${idx + 1}`}
                            </h3>
                            <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'center' }}>
                                <div>{quote.vendorId?.firstName || 'Vendor'} {quote.vendorId?.lastName || ''}</div>
                                <div style={{ fontSize: '1.5rem', fontWeight: 900, color: idx === 0 ? 'var(--success)' : 'black' }}>
                                    ${quote.totalAmount?.toLocaleString() || '0'}
                                </div>
                                <div>{isNaN(new Date(quote.deliveryTimeline).getTime()) ? quote.deliveryTimeline : new Date(quote.deliveryTimeline).toLocaleDateString()}</div>
                                <div>{quote.status}</div>
                            </div>
                            <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                                <button 
                                    className={idx === 0 ? "brutal-btn" : "brutal-btn secondary"} 
                                    style={{ width: '100%', ...(idx === 0 ? {background: 'var(--success)', color: 'white'} : {}) }}
                                    onClick={() => idx === 0 ? handleAcceptQuote(quote._id) : alert('You must recommend the Best Option or negotiate with the vendor.')}
                                    disabled={quote.status === 'Under Review'}
                                >
                                    {quote.status === 'Under Review' ? 'Recommended' : (idx === 0 ? 'Accept Quotation' : 'View Details')}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default QuotationScreen;
