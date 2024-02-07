const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DownloadSchema = new Schema({
    download_url: {
        type: String,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
});


module.exports = mongoose.model('Download', DownloadSchema);