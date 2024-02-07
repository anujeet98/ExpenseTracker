const { Decimal128 } = require('mongodb');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    is_premium: {
        type: Boolean,
        default: false,
        required: true
    },
    total_expense: {
        type: Number,
        default: 0,
        required: true
    }
});


module.exports = mongoose.model('User', UserSchema);