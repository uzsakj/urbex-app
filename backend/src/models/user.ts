import mongoose, { Document, ObjectId, Schema } from "mongoose";
import crypto from 'crypto';
export interface IUser extends Document {
    username: string;
    email: string;
    setPassword: (password: string) => void;
    validatePassword: (password: string) => boolean;
    createdAt: Date;
    updatedAt: Date;
}

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
        passwordHash: {
            type: String,
            required: true
        },
        passwordSalt: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
        updatedAt: {
            type: Date,
            default: Date.now,
        },
    }
);

userSchema.methods.setPassword = function (password: string) {
    this.passwordSalt = crypto.randomBytes(16).toString('hex');

    this.passwordHash = crypto.pbkdf2Sync(password, this.passwordSalt, 1000, 64, 'sha512').toString('hex');

    return;
}

userSchema.methods.validatePassword = function (password: string) {
    const hash = crypto.pbkdf2Sync(password, this.passwordSalt, 1000, 64, 'sha512').toString('hex');

    return this.passwordHash === hash;
}

export default mongoose.model<IUser>("User", userSchema);