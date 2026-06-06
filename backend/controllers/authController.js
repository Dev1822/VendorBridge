const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

const registerUser = async (req, res) => {
    const { firstName, lastName, email, password, role, companyName, contactNumber, country, additionalInfo } = req.body;

    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({
            firstName,
            lastName,
            email,
            password,
            role,
            companyName,
            contactNumber,
            country,
            additionalInfo
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
                token: generateToken(user._id)
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (user && (await user.comparePassword(password))) {
            res.json({
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
                token: generateToken(user._id)
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID || 'your_google_client_id_here');

const googleAuth = async (req, res) => {
    const { token } = req.body;
    try {
        // If placeholder, skip real verification for demo purposes
        if (process.env.GOOGLE_CLIENT_ID === 'your_google_client_id_here' || !process.env.GOOGLE_CLIENT_ID) {
            // Mock a user
            const email = 'google_user@demo.com';
            let user = await User.findOne({ email });
            if (!user) {
                user = await User.create({ firstName: 'Google', lastName: 'User', email, password: 'mockedpassword123', role: 'Vendor' });
            }
            return res.json({ _id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email, role: user.role, token: generateToken(user._id) });
        }

        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        const { email, name } = payload;
        const nameParts = name ? name.split(' ') : ['Google', 'User'];
        const firstName = nameParts[0];
        const lastName = nameParts.slice(1).join(' ') || 'User';

        let user = await User.findOne({ email });
        if (!user) {
            // Auto register
            user = await User.create({ firstName, lastName, email, password: Date.now().toString(), role: 'Vendor' });
        }
        res.json({ _id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email, role: user.role, token: generateToken(user._id) });
    } catch (error) {
        res.status(401).json({ message: 'Google Authentication Failed' });
    }
};

module.exports = { registerUser, loginUser, getMe, googleAuth };
