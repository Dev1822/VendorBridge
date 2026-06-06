import React, { useContext } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LayoutDashboard, Users, FileText, ShoppingCart, LogOut, CheckSquare } from 'lucide-react';

const Layout = () => {
    const { user, logout } = useContext(AuthContext);
    const location = useLocation();

    if (!user) return null;

    return (
        <div className="app-container">
            <aside className="sidebar">
                <div className="sidebar-header">
                    <h2>VendorBridge</h2>
                    {user && <p style={{ fontSize: '0.8rem', opacity: 0.8 }}>{user.firstName} | {user.role}</p>}
                </div>
                <nav className="sidebar-nav">
                    <Link to="/" className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}>
                        <LayoutDashboard size={20} /> Dashboard
                    </Link>
                    
                    {(user.role !== 'Vendor') && (
                        <Link to="/vendors" className={`nav-item ${location.pathname === '/vendors' ? 'active' : ''}`}>
                            <Users size={20} /> Vendors
                        </Link>
                    )}
                    
                    <Link to="/rfqs" className={`nav-item ${location.pathname.includes('/rfqs') ? 'active' : ''}`}>
                        <FileText size={20} /> RFQ's
                    </Link>
                    
                    <Link to="/quotations" className={`nav-item ${location.pathname.includes('/quotations') ? 'active' : ''}`}>
                        <CheckSquare size={20} /> Operations
                    </Link>
                    
                    {(user.role === 'Manager' || user.role === 'Admin') && (
                        <Link to="/approvals" className={`nav-item ${location.pathname.includes('/approvals') ? 'active' : ''}`}>
                            <CheckSquare size={20} /> Approvals
                        </Link>
                    )}
                    
                    <Link to="/pos" className={`nav-item ${location.pathname.includes('/pos') ? 'active' : ''}`}>
                        <ShoppingCart size={20} /> Purchase orders
                    </Link>

                    <Link to="/invoices" className={`nav-item ${location.pathname.includes('/invoices') ? 'active' : ''}`}>
                        <FileText size={20} /> Invoices
                    </Link>

                    {(user.role === 'Admin' || user.role === 'Procurement Officer' || user.role === 'Manager') && (
                        <Link to="/reports" className={`nav-item ${location.pathname.includes('/reports') ? 'active' : ''}`}>
                            <FileText size={20} /> Reports
                        </Link>
                    )}

                    <Link to="/activity" className={`nav-item ${location.pathname.includes('/activity') ? 'active' : ''}`}>
                        <FileText size={20} /> Activity
                    </Link>
                </nav>
            </aside>
            <main className="main-content">
                <header className="topbar">
                    <div>
                        <span className="brutal-badge warning" style={{ marginRight: '1rem' }}>{user.role}</span>
                        <strong>{user.firstName || user.name}</strong>
                    </div>
                    <button className="brutal-btn secondary" onClick={logout}>
                        <LogOut size={16} /> Logout
                    </button>
                </header>
                <div className="page-content">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Layout;
