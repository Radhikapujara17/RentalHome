const mongoose = require('mongoose');

const visitRequestSchema = new mongoose.Schema({
  property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true, index: true },
  tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  preferredDate: { type: Date, required: true },
  timeSlot: { 
    type: String, 
    enum: [
      'Morning: 10:00 AM - 12:00 PM', 
      'Afternoon: 02:00 PM - 04:00 PM', 
      'Evening: 05:00 PM - 07:00 PM'
    ], 
    default: 'Evening: 05:00 PM - 07:00 PM',
    required: true 
  },
  tenantNote: String,
  status: { 
    type: String, 
    enum: ['pending', 'accepted', 'rescheduled', 'declined', 'completed', 'cancelled'], 
    default: 'pending' 
  },
  ownerCounterDate: Date,
  ownerCounterSlot: String,
  visitPassCode: { type: String, unique: true },
  
  // Post-visit feedback
  feedbackCompleted: { type: Boolean, default: false },
  didTenantVisit: Boolean,
  propertyAsDescribedRating: { type: Number, min: 1, max: 5 },
  feedbackComments: String
}, { timestamps: true });

visitRequestSchema.pre('validate', function(next) {
  if (!this.visitPassCode) {
    this.visitPassCode = 'VP-' + Math.floor(1000 + Math.random() * 9000);
  }
  next();
});

module.exports = mongoose.model('VisitRequest', visitRequestSchema);
