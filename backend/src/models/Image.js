const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
  projectId: {
    type: Schema.Types.ObjectId,
    ref: 'Project',
    required: [true, 'Project ID is required']
  },
  filename: {
    type: String,
    required: [true, 'Filename is required']
  },
  originalName: {
    type: String,
    required: [true, 'Original filename is required']
  },
  path: {
    type: String,
    required: [true, 'File path is required']
  },
  url: {
    type: String,
    required: [true, 'File URL is required']
  },
  mimeType: {
    type: String,
    required: [true, 'MIME type is required'],
    enum: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp']
  },
  size: {
    type: Number,
    required: [true, 'File size is required']
  },
  dimensions: {
    width: {
      type: Number,
      required: [true, 'Image width is required']
    },
    height: {
      type: Number,
      required: [true, 'Image height is required']
    }
  },
  metadata: {
    uploadedBy: String,
    uploadSource: {
      type: String,
      enum: ['web', 'api', 'bulk'],
      default: 'web'
    },
    processingStatus: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed'],
      default: 'pending'
    },
    aiAnalysisStatus: {
      type: String,
      enum: ['pending', 'analyzing', 'completed', 'failed', 'skipped'],
      default: 'pending'
    }
  },
  aiAnalysis: {
    provider: String,
    model: String,
    analysisId: String,
    completedAt: Date,
    error: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Update the updatedAt field before saving
ImageSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Indexes for better query performance
ImageSchema.index({ projectId: 1, createdAt: -1 });
ImageSchema.index({ 'metadata.processingStatus': 1 });
ImageSchema.index({ 'metadata.aiAnalysisStatus': 1 });

// Virtual for feedback count
ImageSchema.virtual('feedbackCount', {
  ref: 'Feedback',
  localField: '_id',
  foreignField: 'imageId',
  count: true
});

// Ensure virtual fields are serialized
ImageSchema.set('toJSON', { virtuals: true });
ImageSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Image', ImageSchema);
