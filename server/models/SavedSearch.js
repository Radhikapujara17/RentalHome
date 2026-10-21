const mongoose = require('mongoose');

const savedSearchSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  criteria: {
    locality: [String],
    bhk: [String],
    minPrice: Number,
    maxPrice: Number,
    waterSupplyType: String,
    foodPreference: String,
    zeroBrokerageOnly: Boolean
  },
  alertChannels: {
    whatsapp: { type: Boolean, default: true },
    email: { type: Boolean, default: true },
    webPush: { type: Boolean, default: true }
  },
  lastNotifiedListingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Property' }
}, { timestamps: true });

module.exports = mongoose.model('SavedSearch', savedSearchSchema);
