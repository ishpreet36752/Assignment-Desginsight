const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  imageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Image',
    required: true
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['accessibility', 'visualHierarchy', 'contentCopy', 'uxPatterns', 'general']
  },
  severity: {
    type: String,
    required: true,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  recommendation: {
    type: String,
    required: true,
    trim: true
  },
  coordinates: {
    x: { type: Number, required: true, min: 0 },
    y: { type: Number, required: true, min: 0 },
    width: { type: Number, required: true, min: 1 },
    height: { type: Number, required: true, min: 1 }
  },
  targetRoles: [{
    type: String,
    enum: ['designer', 'reviewer', 'productManager', 'developer'],
    default: ['designer']
  }],
  source: {
    type: String,
    enum: ['ai', 'human'],
    default: 'ai'
  },
  author: {
    type: String,
    required: false,
    default: 'ai-system'
  },
  status: {
    type: String,
    enum: ['active', 'resolved', 'dismissed'],
    default: 'active'
  },
  tags: [{
    type: String,
    trim: true
  }],
  aiMetadata: {
    provider: String,
    model: String,
    confidence: Number,
    analysisId: String,
    timestamp: Date,
    error: String
  }
}, {
  timestamps: true
});

// Virtual for comment count
feedbackSchema.virtual('commentCount', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'feedbackId',
  count: true
});

// Index for efficient queries
feedbackSchema.index({ imageId: 1, status: 1 });
feedbackSchema.index({ projectId: 1, category: 1 });
feedbackSchema.index({ targetRoles: 1 });

module.exports = mongoose.model('Feedback', feedbackSchema);
