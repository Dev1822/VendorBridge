import { API_URL } from '../config';
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const RFQScreen = () => {
    const [rfqs, setRfqs] = useState([]);
    const [isCreating, setIsCreating] = useState(false);
    const { user } = useContext(AuthContext);

    const fetchRFQs = async () => {
        const token = localStorage.getItem('token');
        try {
            const res = await axios.get(`${API_URL}/api/rfqs`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setRfqs(res.data);
        } catch (error) {
            console.error("Error fetching RFQs", error);
        }
    };

    useEffect(() => {
        fetchRFQs();
    }, []);

    const handleCreateRFQ = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        
        try {
            await axios.post(`${API_URL}/api/rfqs`, data, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setIsCreating(false);
            fetchRFQs();
        } catch (error) {
            console.error(error);
        }
    };

    if (isCreating) {
        return (
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <div>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, margin: 0 }}>Create RFQ's</h1>
                        <p style={{ margin: '0.5rem 0', opacity: 0.8 }}>Open requests for quotations</p>
                    </div>
                    <button className="brutal-btn secondary" onClick={() => setIsCreating(false)}>Back to List</button>
                </div>

                <div className="brutal-box" style={{ padding: '2rem' }}>
                    {/* Visual Stepper */}
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginBottom: '3rem', opacity: 0.8 }}>
                        <div style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ background: 'black', color: 'white', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>1</span> Request Details
                        </div>
                        <div style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'gray' }}>
                            <span style={{ border: '2px solid gray', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>2</span> Add Items
                        </div>
                        <div style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'gray' }}>
                            <span style={{ border: '2px solid gray', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>3</span> Review & Send
                        </div>
                    </div>

                    <form onSubmit={handleCreateRFQ}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
                            {/* Left Column */}
                            <div>
                                <h3 style={{ borderBottom: '2px solid black', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>Item Details</h3>
                                <div className="form-group">
                                    <label>Category</label>
                                    <select name="category" className="brutal-input" required>
                                        <option value="IT Equipment">IT Equipment</option>
                                        <option value="Office Furniture">Office Furniture</option>
                                        <option value="Stationery">Stationery</option>
                                        <option value="Services">Services</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Item Name</label>
                                    <input type="text" name="itemName" className="brutal-input" placeholder="e.g. Dell XPS 15" required />
                                </div>
                                <div className="form-group">
                                    <label>Quantity</label>
                                    <input type="number" name="quantity" className="brutal-input" min="1" required />
                                </div>
                                <div className="form-group">
                                    <label>Required Delivery Date</label>
                                    <input type="date" name="requiredDeliveryDate" className="brutal-input" required />
                                </div>
                            </div>

                            {/* Right Column */}
                            <div>
                                <h3 style={{ borderBottom: '2px solid black', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>Additional Information</h3>
                                <div className="form-group">
                                    <label>Specifications</label>
                                    <textarea name="specifications" className="brutal-input" rows="4" placeholder="Detailed technical specs..."></textarea>
                                </div>
                                <div className="form-group">
                                    <label>Special Notes</label>
                                    <textarea name="specialNotes" className="brutal-input" rows="3" placeholder="Any special delivery instructions..."></textarea>
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '3rem', borderTop: '2px solid black', paddingTop: '2rem' }}>
                            <button type="submit" className="brutal-btn primary" style={{ fontSize: '1.2rem', padding: '1rem 2rem' }}>
                                Complete form & send to vendors
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 900, margin: 0 }}>RFQ's</h1>
                    <p style={{ margin: '0.5rem 0', opacity: 0.8 }}>Manage your Requests for Quotations</p>
                </div>
                {(user.role === 'Procurement Officer' || user.role === 'Admin') && (
                    <button className="brutal-btn primary" onClick={() => setIsCreating(true)}>+ Create RFQ</button>
                )}
            </div>

            <div className="brutal-box">
                <div className="brutal-table-container">
                    <table className="brutal-table">
                        <thead>
                            <tr>
                                <th>Item Name</th>
                                <th>Category</th>
                                <th>Qty</th>
                                <th>Deadline</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rfqs.map(rfq => (
                                <tr key={rfq._id}>
                                    <td><strong>{rfq.itemName}</strong></td>
                                    <td>{rfq.category}</td>
                                    <td>{rfq.quantity}</td>
                                    <td>{new Date(rfq.requiredDeliveryDate).toLocaleDateString()}</td>
                                    <td><span className={`brutal-badge ${rfq.status === 'Open' ? 'success' : 'warning'}`}>{rfq.status}</span></td>
                                    <td>
                                        <button className="brutal-btn secondary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}>View Details</button>
                                    </td>
                                </tr>
                            ))}
                            {rfqs.length === 0 && (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: 'center' }}>No RFQs found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default RFQScreen;
