const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const seedUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        // Clear existing
        // await User.deleteMany();

        const users = [
            {
                name: 'Admin User',
                email: 'admin@vendorbridge.com',
                password: 'password123',
                role: 'Admin'
            },
            {
                name: 'Vendor Company A',
                email: 'vendor@vendorbridge.com',
                password: 'password123',
                role: 'Vendor',
                companyName: 'Vendor Company A',
                gstNumber: 'GST12345678'
            },
            {
                name: 'Procurement Officer Bob',
                email: 'po@vendorbridge.com',
                password: 'password123',
                role: 'Procurement Officer'
            },
            {
                name: 'Manager Alice',
                email: 'manager@vendorbridge.com',
                password: 'password123',
                role: 'Manager'
            }
        ];

        for (let u of users) {
            const exists = await User.findOne({ email: u.email });
            if (!exists) {
                await User.create(u);
                console.log(`Created user: ${u.email}`);
            }
        }

        console.log('Database Seeding Completed!');
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

seedUsers();
