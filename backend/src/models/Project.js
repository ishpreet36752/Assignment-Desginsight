const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProjectSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Project name is required'],
    trim: true,
    maxlength: [100, 'Project name cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  owner: {
    type: String, // For now, simple string. Later can be ObjectId ref to User
    required: [true, 'Project owner is required']
  },
  status: {
    type: String,
    enum: ['active', 'archived', 'completed'],
    default: 'active'
  },
  settings: {
    aiProvider: {
      type: String,
      enum: ['openai', 'openrouter', 'anthropic', 'google', 'huggingface'],
      default: 'openrouter'
    },
    analysisCategories: {
      accessibility: { type: Boolean, default: true },
      visualHierarchy: { type: Boolean, default: true },
      contentCopy: { type: Boolean, default: true },
      uxPatterns: { type: Boolean, default: true }
    }
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
ProjectSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for better query performance
ProjectSchema.index({ owner: 1, status: 1 });
ProjectSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Project', ProjectSchema);
