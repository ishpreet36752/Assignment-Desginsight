const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  feedbackId: {
    type: Schema.Types.ObjectId,
    ref: 'Feedback',
    required: [true, 'Feedback ID is required']
  },
  parentCommentId: {
    type: Schema.Types.ObjectId,
    ref: 'Comment',
    default: null // null for top-level comments
  },
  author: {
    type: String, // For now, simple string. Later can be ObjectId ref to User
    required: [true, 'Author is required']
  },
  content: {
    type: String,
    required: [true, 'Comment content is required'],
    trim: true,
    maxlength: [2000, 'Comment cannot exceed 2000 characters']
  },
  status: {
    type: String,
    enum: ['active', 'deleted', 'edited'],
    default: 'active'
  },
  editedAt: Date,
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
CommentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Indexes for better query performance
CommentSchema.index({ feedbackId: 1, createdAt: 1 });
CommentSchema.index({ parentCommentId: 1, createdAt: 1 });
CommentSchema.index({ author: 1, createdAt: -1 });

// Virtual for reply count
CommentSchema.virtual('replyCount', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'parentCommentId',
  count: true
});

// Ensure virtual fields are serialized
CommentSchema.set('toJSON', { virtuals: true });
CommentSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Comment', CommentSchema);
