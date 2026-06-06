import React from 'react';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
    const navigate = useNavigate();

    return (
        <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-color)', display: 'flex', flexDirection: 'column' }}>
            {/* Header */}
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem 3rem', borderBottom: '3px solid black', backgroundColor: 'var(--primary)' }}>
                <div style={{ fontSize: '2rem', fontWeight: 900 }}>VendorBridge</div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className="brutal-btn secondary" onClick={() => navigate('/login')}>Login</button>
                    <button className="brutal-btn" style={{ backgroundColor: 'white' }} onClick={() => navigate('/register')}>Register</button>
                </div>
            </header>

            {/* Hero Section */}
            <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem 2rem', textAlign: 'center' }}>
                <div style={{ maxWidth: '900px' }}>
                    <h1 style={{ fontSize: '5rem', fontWeight: 900, lineHeight: 1.1, marginBottom: '2rem', textTransform: 'uppercase' }}>
                        Procurement,<br />
                        <span style={{ backgroundColor: 'var(--secondary)', color: 'white', padding: '0 1rem', display: 'inline-block', transform: 'rotate(-2deg)', border: '4px solid black', boxShadow: '6px 6px 0px black' }}>Simplified.</span>
                    </h1>
                    <p style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '3rem', maxWidth: '700px', margin: '0 auto 3rem auto', opacity: 0.9 }}>
                        The brutalist, no-nonsense platform for automating RFQs, managing vendor bids, and generating purchase orders in seconds.
                    </p>
                    
                    <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center' }}>
                        <button className="brutal-btn" style={{ fontSize: '1.5rem', padding: '1rem 2.5rem', backgroundColor: 'var(--success)' }} onClick={() => navigate('/register')}>
                            Get Started
                        </button>
                        <button className="brutal-btn secondary" style={{ fontSize: '1.5rem', padding: '1rem 2.5rem' }} onClick={() => navigate('/login')}>
                            Vendor Login
                        </button>
                    </div>
                </div>

                {/* Features Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', width: '100%', maxWidth: '1200px', marginTop: '6rem' }}>
                    <div className="brutal-box" style={{ backgroundColor: 'var(--primary)', textAlign: 'left', transform: 'rotate(1deg)' }}>
                        <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '1rem', borderBottom: '3px solid black', paddingBottom: '0.5rem' }}>01. Publish RFQs</h2>
                        <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>Create Request for Quotations and broadcast them to your entire supplier network instantly.</p>
                    </div>
                    <div className="brutal-box" style={{ backgroundColor: 'var(--secondary)', color: 'white', textAlign: 'left', transform: 'rotate(-1deg)' }}>
                        <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '1rem', borderBottom: '3px solid white', paddingBottom: '0.5rem' }}>02. Review Bids</h2>
                        <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>Vendors submit competitive quotes. Managers review, compare, and approve the best deals.</p>
                    </div>
                    <div className="brutal-box" style={{ backgroundColor: 'var(--success)', textAlign: 'left', transform: 'rotate(1deg)' }}>
                        <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '1rem', borderBottom: '3px solid black', paddingBottom: '0.5rem' }}>03. Auto-PO</h2>
                        <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>The moment a quote is approved, VendorBridge auto-generates a legal Purchase Order PDF.</p>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer style={{ padding: '2rem', borderTop: '3px solid black', textAlign: 'center', fontWeight: 800, backgroundColor: 'white' }}>
                &copy; 2026 VendorBridge Corp. Built for the Hackathon.
            </footer>
        </div>
    );
};

export default Landing;
