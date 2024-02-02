const { Decimal128 } = require('mongodb');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
    order_id: {
        type: String,
        required: true
    },
    payment_id: {
        type: String,
        default: null,
        required: false
    },
    order_status: {
        type: String,
        default: 'PENDING',
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});


module.exports = mongoose.model('Order', OrderSchema);