import { API_URL } from '../config';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Reports = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchReports = async () => {
        const token = localStorage.getItem('token');
        try {
            const res = await axios.get(`${API_URL}/api/reports`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setData(res.data);
        } catch (error) {
            console.error("Error fetching reports", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReports();
    }, []);

    if (loading) return <div>Loading reports...</div>;
    if (!data) return <div>Error loading reports.</div>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 900, margin: 0 }}>Reports & analytics</h1>
                    <p style={{ margin: '0.5rem 0', opacity: 0.8 }}>Procurement Data Insights</p>
                </div>
                <div>
                    <select className="brutal-input" style={{ width: '200px' }}>
                        <option>All Time</option>
                        <option>This Quarter (Q3)</option>
                        <option>Last Quarter (Q2)</option>
                        <option>This Year (2025)</option>
                    </select>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '2rem', marginBottom: '3rem' }}>
                <div className="brutal-box" style={{ textAlign: 'center', borderColor: 'var(--primary)', borderBottomWidth: '6px' }}>
                    <p style={{ fontSize: '2.5rem', fontWeight: 900, margin: '0', color: 'var(--primary)' }}>${(data.totalSpend / 1000).toFixed(1)}K</p>
                    <p style={{ fontWeight: 'bold', margin: '0.5rem 0 0 0' }}>Total Spend</p>
                </div>
                
                <div className="brutal-box" style={{ textAlign: 'center', borderColor: 'var(--success)', borderBottomWidth: '6px' }}>
                    <p style={{ fontSize: '2.5rem', fontWeight: 900, margin: '0', color: 'var(--success)' }}>{data.totalPOs}</p>
                    <p style={{ fontWeight: 'bold', margin: '0.5rem 0 0 0' }}>POs Generated</p>
                </div>

                <div className="brutal-box" style={{ textAlign: 'center', borderColor: 'var(--secondary)', borderBottomWidth: '6px' }}>
                    <p style={{ fontSize: '2.5rem', fontWeight: 900, margin: '0', color: 'var(--secondary)' }}>{data.onTimeDelivery}%</p>
                    <p style={{ fontWeight: 'bold', margin: '0.5rem 0 0 0' }}>On-Time Delivery</p>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
                <div className="brutal-box">
                    <h3 style={{ borderBottom: '2px solid black', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>Spend by Category</h3>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {data.categoryData && data.categoryData.length > 0 ? data.categoryData.map((cat, idx) => {
                            const colors = ['var(--primary)', 'var(--success)', 'var(--secondary)', '#333'];
                            const color = colors[idx % colors.length];
                            return (
                                <div key={idx}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}><span>{cat.category}</span> <span>{cat.percentage}%</span></div>
                                    <div style={{ width: '100%', height: '12px', background: '#ccc', border: '1px solid black' }}>
                                        <div style={{ width: `${cat.percentage}%`, height: '100%', background: color }}></div>
                                    </div>
                                </div>
                            );
                        }) : <p>No category data available.</p>}
                    </div>
                </div>

                <div className="brutal-box">
                    <h3 style={{ borderBottom: '2px solid black', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>Top Vendors by Spend</h3>
                    <table className="brutal-table" style={{ width: '100%' }}>
                        <thead>
                            <tr>
                                <th>Vendor</th>
                                <th>Spend ($)</th>
                                <th>POs</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.topVendors && data.topVendors.length > 0 ? data.topVendors.map((v, idx) => (
                                <tr key={idx}>
                                    <td>{v.vendorName}</td>
                                    <td>${v.spend.toLocaleString()}</td>
                                    <td>{v.poCount}</td>
                                </tr>
                            )) : (
                                <tr><td colSpan="3" style={{ textAlign: 'center' }}>No vendor data available.</td></tr>
                            )}
                        </tbody>
                    </table>

                    <div style={{ marginTop: '2rem', height: '150px', display: 'flex', alignItems: 'flex-end', gap: '1rem', borderBottom: '2px solid black', paddingBottom: '0.5rem' }}>
                        {/* Mock Bar Chart */}
                        <div style={{ flex: 1, background: 'var(--primary)', height: '80%', border: '2px solid black', textAlign: 'center', color: 'white', fontWeight: 'bold', paddingTop: '0.5rem' }}>Jan</div>
                        <div style={{ flex: 1, background: 'var(--secondary)', height: '60%', border: '2px solid black', textAlign: 'center', fontWeight: 'bold', paddingTop: '0.5rem' }}>Feb</div>
                        <div style={{ flex: 1, background: 'var(--success)', height: '90%', border: '2px solid black', textAlign: 'center', color: 'white', fontWeight: 'bold', paddingTop: '0.5rem' }}>Mar</div>
                        <div style={{ flex: 1, background: '#fafafa', height: '40%', border: '2px solid black', textAlign: 'center', fontWeight: 'bold', paddingTop: '0.5rem' }}>Apr</div>
                        <div style={{ flex: 1, background: 'var(--primary)', height: '100%', border: '2px solid black', textAlign: 'center', color: 'white', fontWeight: 'bold', paddingTop: '0.5rem' }}>May</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reports;
