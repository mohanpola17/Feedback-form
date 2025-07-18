const mongoose = require('mongoose');

const ResponseSchema = new mongoose.Schema({
  form: { type: mongoose.Schema.Types.ObjectId, ref: 'Form', required: true },
  answers: [{ type: mongoose.Schema.Types.Mixed, required: true }],
}, { timestamps: true });

module.exports = mongoose.model('Response', ResponseSchema); 