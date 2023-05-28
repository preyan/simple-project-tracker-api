const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true,'Please provide a username'],
        min: [3,'Username must be at least 3 characters long'],
        max: [20,'Username must not be more than 20 characters long'],
        unique: [true,'Username already exists'],
    },
    password: {
        type: String,
        required: [true,'Please provide a password'],
        min: [6,'Password must be at least 6 characters long'],
    },
    roles: [{
        type: String,
        enum: ['user','admin'],
        default: 'user',
    }],
    active: {
        type: Boolean,
        default: true,
    },
})

module.exports = mongoose.model('User',UserSchema);