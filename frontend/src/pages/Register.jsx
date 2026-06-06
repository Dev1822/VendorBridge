import { API_URL } from '../config';
import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';

const Register = () => {
    const [formData, setFormData] = useState({
        firstName: '', lastName: '', email: '', password: '', role: 'Vendor',
        contactNumber: '', companyName: '', country: '', additionalInfo: ''
    });
    const [error, setError] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${API_URL}/api/auth/register`, formData);
            localStorage.setItem('token', res.data.token);
            window.location.href = '/'; 
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
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
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: 'var(--bg-color)', padding: '2rem' }}>
            <div className="brutal-box" style={{ width: '100%', maxWidth: '600px' }}>
                <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '3px solid black', paddingBottom: '0.5rem' }}>
                    <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Register</h2>
                    <button className="brutal-btn secondary" style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem' }} onClick={() => navigate('/landing')}>Back</button>
                </div>
                {error && <div className="brutal-badge danger" style={{ marginBottom: '1rem', display: 'block' }}>{error}</div>}
                
                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="form-group">
                            <label>First Name</label>
                            <input type="text" name="firstName" className="brutal-input" value={formData.firstName} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>Last Name</label>
                            <input type="text" name="lastName" className="brutal-input" value={formData.lastName} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>Email Address</label>
                            <input type="email" name="email" className="brutal-input" value={formData.email} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>Phone Number</label>
                            <input type="text" name="contactNumber" className="brutal-input" value={formData.contactNumber} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>Password</label>
                            <input type="password" name="password" className="brutal-input" value={formData.password} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>Role</label>
                            <select name="role" className="brutal-input" value={formData.role} onChange={handleChange}>
                                <option value="Vendor">Vendor</option>
                                <option value="Procurement Officer">Procurement Officer</option>
                                <option value="Manager">Manager</option>
                                <option value="Admin">Admin</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Company</label>
                            <input type="text" name="companyName" className="brutal-input" value={formData.companyName} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>Country</label>
                            <input type="text" name="country" className="brutal-input" value={formData.country} onChange={handleChange} />
                        </div>
                    </div>

                    <div className="form-group" style={{ marginTop: '1rem' }}>
                        <label>Additional Information...</label>
                        <textarea name="additionalInfo" className="brutal-input" style={{ minHeight: '100px' }} value={formData.additionalInfo} onChange={handleChange} />
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
                        <button type="submit" className="brutal-btn" style={{ width: '200px', justifyContent: 'center' }}>
                            Register
                        </button>
                    </div>
                </form>

                <div style={{ display: 'flex', justifyContent: 'center', margin: '2rem 0 1rem 0' }}>
                    <GoogleLogin 
                        onSuccess={handleGoogleSuccess}
                        onError={() => setError('Google Authentication Failed')}
                    />
                </div>

                <div style={{ textAlign: 'center' }}>
                    <p>Already have an account? <Link to="/login" style={{ fontWeight: 'bold', color: 'var(--secondary)' }}>Log In</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Register;
