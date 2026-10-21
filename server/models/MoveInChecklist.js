const mongoose = require('mongoose');

const moveInChecklistSchema = new mongoose.Schema({
  property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
  tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  inspectionDate: { type: Date, default: Date.now },
  rooms: [{
    roomName: { type: String, required: true },
    itemsCondition: [{
      item: String,
      status: { type: String, enum: ['Excellent', 'Good', 'Scratched/Stained', 'Damaged'], default: 'Good' },
      remarks: String,
      photos: [String]
    }]
  }],
  isTenantSigned: { type: Boolean, default: false },
  isOwnerSigned: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('MoveInChecklist', moveInChecklistSchema);
