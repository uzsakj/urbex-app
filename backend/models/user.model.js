const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, 'Username is required'],
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: [6, 'Password should be at least 6 characters'],
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true, // Automatically adds createdAt and updatedAt fields
    }
);

// Hash password before saving a new user
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next(); // Only hash the password if it's been modified
    try {
        const salt = await bcrypt.genSalt(10); // Generate salt with rounds of 10
        this.password = await bcrypt.hash(this.password, salt); // Hash the password
        next();
    } catch (error) {
        next(error); // Pass errors to the next middleware
    }
});

// Method to compare password for login
userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password); // Compare given password with stored hash
};

// Create and export the User model
const User = mongoose.model('User', userSchema);

module.exports = User;
