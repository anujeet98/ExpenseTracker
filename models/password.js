const { UUID } = require('mongodb');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uuid = require('uuid');

const PasswordSchema = new Schema({
    _id: {
        type: UUID,
        default: () => randomUUID(),
        required: true
    },
    active: {
        type: Boolean,
        default: true,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

module.exports = mongoose.model('Password', PasswordSchema);