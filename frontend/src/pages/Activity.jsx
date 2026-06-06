import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Activity = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');

    const fetchActivity = async () => {
        const token = localStorage.getItem('token');
        try {
            const res = await axios.get('http://localhost:5000/api/activity', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setEvents(res.data);
        } catch (error) {
            console.error("Error fetching activity", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchActivity();
    }, []);

    const getColor = (type) => {
        if (type === 'PO') return 'var(--success)';
        if (type === 'QUOTATION') return 'var(--primary)';
        if (type === 'RFQ') return 'white';
        return '#ccc';
    };

    const filteredEvents = events.filter(ev => filter === 'All' || ev.type === filter);

    return (
        <div>
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 900, margin: 0 }}>Activity & Logs</h1>
                <p style={{ margin: '0.5rem 0', opacity: 0.8 }}>Procurement audit trail</p>
            </div>

            <div className="brutal-box">
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '2px solid black', paddingBottom: '1rem' }}>
                    <button className={`brutal-btn ${filter === 'All' ? 'primary' : 'secondary'}`} onClick={() => setFilter('All')}>All</button>
                    <button className={`brutal-btn ${filter === 'RFQ' ? 'primary' : 'secondary'}`} onClick={() => setFilter('RFQ')}>RFQs</button>
                    <button className={`brutal-btn ${filter === 'QUOTATION' ? 'primary' : 'secondary'}`} onClick={() => setFilter('QUOTATION')}>Approvals</button>
                    <button className={`brutal-btn ${filter === 'PO' ? 'primary' : 'secondary'}`} onClick={() => setFilter('PO')}>POs</button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingLeft: '1rem', borderLeft: '4px solid black', marginLeft: '1rem' }}>
                    
                    {loading ? <p>Loading activity...</p> : filteredEvents.length === 0 ? <p>No activity recorded yet.</p> : filteredEvents.map(ev => (
                        <div key={`${ev.type}-${ev._id}`} style={{ position: 'relative' }}>
                            <div style={{ position: 'absolute', left: '-22px', top: '0', width: '12px', height: '12px', background: getColor(ev.type), borderRadius: '50%', border: '2px solid black' }}></div>
                            <p style={{ margin: '0 0 0.5rem 0', fontWeight: 'bold' }}>{ev.title}</p>
                            <small style={{ opacity: 0.7 }}>{new Date(ev.date).toLocaleString()} • by {ev.actor}</small>
                        </div>
                    ))}

                </div>
            </div>
        </div>
    );
};

export default Activity;
