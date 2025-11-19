const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
Date: { type: String, required: true },
Store: { type: String },
Item: { type: String },
Amount: { type: String },
Category: { type: String },
payment_source: { type: String },
InputDate: { type: String },
InputTime: { type: String }
}, { collection: '780207093' });

module.exports = mongoose.model('notes', NoteSchema);