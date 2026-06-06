import { API_URL } from '../config';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const VendorScreen = () => {
    const [vendors, setVendors] = useState([]);
    const [filter, setFilter] = useState('All');

    useEffect(() => {
        const fetchVendors = async () => {
            const token = localStorage.getItem('token');
            try {
                const res = await axios.get(`${API_URL}/api/vendors`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setVendors(res.data);
            } catch (error) {
                console.error("Error fetching vendors", error);
            }
        };
        fetchVendors();
    }, []);

    const filteredVendors = filter === 'All' ? vendors : vendors.filter(v => v.status === filter);

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 900, margin: 0 }}>Vendors</h1>
                    <p style={{ margin: '0.5rem 0', opacity: 0.8 }}>Manage Supplier profiles and registrations</p>
                </div>
                <button className="brutal-btn primary">+ Add vendor</button>
            </div>

            <div className="brutal-box">
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', borderBottom: '2px solid black', paddingBottom: '1rem' }}>
                    <button className={`brutal-btn ${filter === 'All' ? 'primary' : 'secondary'}`} onClick={() => setFilter('All')}>All</button>
                    <button className={`brutal-btn ${filter === 'Active' ? 'primary' : 'secondary'}`} onClick={() => setFilter('Active')}>Approved</button>
                    <button className={`brutal-btn ${filter === 'Pending' ? 'primary' : 'secondary'}`} onClick={() => setFilter('Pending')}>Pending</button>
                    <button className={`brutal-btn ${filter === 'Rejected' ? 'primary' : 'secondary'}`} onClick={() => setFilter('Rejected')}>Rejected</button>
                </div>

                <div className="brutal-table-container">
                    <table className="brutal-table">
                        <thead>
                            <tr>
                                <th>Vendor Name</th>
                                <th>Category</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredVendors.map(vendor => (
                                <tr key={vendor._id}>
                                    <td><strong>{vendor.companyName || `${vendor.firstName} ${vendor.lastName}`}</strong></td>
                                    <td>General Supplier</td> {/* Placeholder Category */}
                                    <td>
                                        <span className={`brutal-badge ${vendor.status === 'Active' ? 'success' : vendor.status === 'Rejected' ? 'danger' : 'warning'}`}>
                                            {vendor.status === 'Active' ? 'Approved' : vendor.status}
                                        </span>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button className="brutal-btn secondary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}>View</button>
                                            <button className="brutal-btn primary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}>Edit</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredVendors.length === 0 && (
                                <tr>
                                    <td colSpan="4" style={{ textAlign: 'center' }}>No vendors found for this status.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default VendorScreen;
