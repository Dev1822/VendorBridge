import { API_URL } from '../config';
import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            navigate('/');
        } catch (err) {
            setError('Invalid credentials');
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            const res = await axios.post(`${API_URL}/api/auth/google`, {
                token: credentialResponse.credential
            });
            localStorage.setItem('token', res.data.token);
            window.location.href = '/';
        } catch (err) {
            setError('Google Authentication Failed');
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: 'var(--bg-color)' }}>
            <div className="brutal-box" style={{ width: '100%', maxWidth: '400px' }}>
                <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '3px solid black', paddingBottom: '0.5rem' }}>
                    <h2 style={{ fontSize: '1.5rem', margin: 0 }}>VendorBridge Login</h2>
                    <button className="brutal-btn secondary" style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem' }} onClick={() => navigate('/landing')}>Back</button>
                </div>
                {error && <div className="brutal-badge danger" style={{ marginBottom: '1rem', display: 'block' }}>{error}</div>}
                
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email</label>
                        <input 
                            type="email" 
                            className="brutal-input" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input 
                            type="password" 
                            className="brutal-input" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                        />
                    </div>
                    <button type="submit" className="brutal-btn" style={{ width: '100%', justifyContent: 'center', marginBottom: '1rem' }}>
                        LOGIN TO PORTAL
                    </button>
                </form>

                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
                    <GoogleLogin 
                        onSuccess={handleGoogleSuccess}
                        onError={() => setError('Google Authentication Failed')}
                    />
                </div>

                <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                    <p>Don't have an account? <Link to="/register" style={{ fontWeight: 'bold', color: 'var(--secondary)' }}>Register</Link></p>
                </div>

                <div style={{ textAlign: 'center' }}>
                    <p>Demo Accounts:</p>
                    <small>admin@vendorbridge.com | vendor@vendorbridge.com</small>
                    <br/>
                    <small>Password: password123</small>
                </div>
            </div>
        </div>
    );
};

export default Login;
