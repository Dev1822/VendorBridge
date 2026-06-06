import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [stats, setStats] = useState({ activeRfqs: 0, pendingApprovals: 0, monthlySpend: 0, activeInvoices: 0 });
    const [activity, setActivity] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            const token = localStorage.getItem('token');
            try {
                const res = await axios.get('http://localhost:5000/api/dashboard', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setStats(res.data.stats);
                setActivity(res.data.activity);
            } catch (error) {
                console.error("Error fetching dashboard stats", error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchDashboardData();
        }
    }, [user]);

    if (loading) return <div>Loading dashboard...</div>;

    const displayName = user.firstName || user.name || '';

    return (
        <div>
            <h1 style={{ marginBottom: '2rem', fontSize: '2.5rem', fontWeight: 900 }}>Welcome back, {displayName}! - VendorBridge Dashboard</h1>
            
            {/* 4 Cards Layout */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
                <div className="brutal-box" style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '3rem', fontWeight: 900, margin: '0' }}>{stats.activeRfqs}</p>
                    <p style={{ fontWeight: 'bold', margin: '0.5rem 0 0 0' }}>Active RFQs</p>
                </div>
                
                <div className="brutal-box" style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '3rem', fontWeight: 900, margin: '0' }}>{stats.pendingApprovals}</p>
                    <p style={{ fontWeight: 'bold', margin: '0.5rem 0 0 0' }}>Pending Approvals</p>
                </div>

                <div className="brutal-box" style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '3rem', fontWeight: 900, margin: '0' }}>${stats.monthlySpend.toLocaleString()}</p>
                    <p style={{ fontWeight: 'bold', margin: '0.5rem 0 0 0' }}>Monthly Spend</p>
                </div>

                <div className="brutal-box" style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '3rem', fontWeight: 900, margin: '0' }}>{stats.activeInvoices}</p>
                    <p style={{ fontWeight: 'bold', margin: '0.5rem 0 0 0' }}>Active Invoices</p>
                </div>
            </div>

            {/* Bottom Layout: Table and Chart */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                {/* Recent Actions Table */}
                <div className="brutal-box">
                    <h3 style={{ marginBottom: '1rem', borderBottom: '2px solid black', paddingBottom: '0.5rem' }}>Recent Actions</h3>
                    <div className="brutal-table-container">
                        <table className="brutal-table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {activity.length > 0 ? activity.map((act, idx) => (
                                    <tr key={idx}>
                                        <td style={{ whiteSpace: 'nowrap' }}>{new Date(act.date).toLocaleDateString()}</td>
                                        <td>{act.text}</td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan="2" style={{ textAlign: 'center' }}>No recent activity.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Chart */}
                <div className="brutal-box" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0f0f0' }}>
                    <h3 style={{ marginBottom: '1rem' }}>Analytics Overview</h3>
                    {(() => {
                        const total = (stats.activeRfqs || 0) + (stats.pendingApprovals || 0) + (stats.activeInvoices || 0);
                        const rfqPct = total > 0 ? ((stats.activeRfqs || 0) / total) * 100 : 0;
                        const approvalPct = total > 0 ? ((stats.pendingApprovals || 0) / total) * 100 : 0;
                        
                        const rfqStop = rfqPct;
                        const approvalStop = rfqPct + approvalPct;

                        const conicGradient = total === 0 
                            ? 'conic-gradient(#ccc 0% 100%)' 
                            : `conic-gradient(var(--primary) 0% ${rfqStop}%, var(--secondary) ${rfqStop}% ${approvalStop}%, var(--success) ${approvalStop}% 100%)`;

                        return <div style={{ width: '150px', height: '150px', borderRadius: '50%', background: conicGradient, border: '3px solid black', boxShadow: '4px 4px 0px black' }}></div>;
                    })()}
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', fontSize: '0.8rem', fontWeight: 'bold' }}>
                        <span style={{ color: 'var(--primary)' }}>■ Active RFQs ({stats.activeRfqs || 0})</span>
                        <span style={{ color: 'var(--secondary)' }}>■ Pending Approvals ({stats.pendingApprovals || 0})</span>
                        <span style={{ color: 'var(--success)' }}>■ Active Invoices ({stats.activeInvoices || 0})</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
