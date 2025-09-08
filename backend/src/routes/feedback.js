const express = require('express');
const Feedback = require('../models/Feedback');
const Comment = require('../models/Comment');
const { authenticateToken } = require('../middlewares/auth');

const router = express.Router();

/**
 * Get feedback for an image with filtering
 * GET /api/feedback/:imageId
 */
router.get('/:imageId', authenticateToken, async (req, res) => {
  try {
    const { imageId } = req.params;
    console.log('🔍 Feedback route called for imageId:', imageId);
    const { 
      role, 
      category, 
      severity, 
      status = 'active',
      limit = 50,
      offset = 0 
    } = req.query;

    // Build query
    let query = { imageId, status };
    
    if (role && ['designer', 'reviewer', 'productManager', 'developer'].includes(role)) {
      query.targetRoles = role;
    }
    
    if (category && ['accessibility', 'visualHierarchy', 'contentCopy', 'uxPatterns'].includes(category)) {
      query.category = category;
    }
    
    if (severity && ['high', 'medium', 'low'].includes(severity)) {
      query.severity = severity;
    }

    console.log('🔍 Searching for feedback with query:', query);
    
    const feedback = await Feedback.find(query)
      .sort({ severity: -1, createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(offset));

    const totalCount = await Feedback.countDocuments(query);
    
    console.log('📊 Found', feedback.length, 'feedback items out of', totalCount, 'total');

    res.json({
      success: true,
      feedback,
      pagination: {
        total: totalCount,
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: totalCount > parseInt(offset) + parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Get feedback error:', error);
    res.status(500).json({ 
      error: 'Failed to retrieve feedback', 
      details: error.message 
    });
  }
});

/**
 * Update feedback status
 * PUT /api/feedback/:feedbackId
 */
router.put('/:feedbackId', authenticateToken, async (req, res) => {
  try {
    const { feedbackId } = req.params;
    const { status, tags } = req.body;

    const feedback = await Feedback.findById(feedbackId);
    if (!feedback) {
      return res.status(404).json({ error: 'Feedback not found' });
    }

    // Update fields
    if (status && ['active', 'resolved', 'dismissed'].includes(status)) {
      feedback.status = status;
    }
    
    if (tags && Array.isArray(tags)) {
      feedback.tags = tags;
    }

    await feedback.save();

    res.json({
      success: true,
      feedback: {
        id: feedback._id,
        status: feedback.status,
        tags: feedback.tags,
        updatedAt: feedback.updatedAt
      }
    });

  } catch (error) {
    console.error('Update feedback error:', error);
    res.status(500).json({ 
      error: 'Failed to update feedback', 
      details: error.message 
    });
  }
});

/**
 * Add comment to feedback
 * POST /api/feedback/:feedbackId/comments
 */
router.post('/:feedbackId/comments', authenticateToken, async (req, res) => {
  try {
    const { feedbackId } = req.params;
    const { content, author, parentCommentId } = req.body;

    if (!content || !author) {
      return res.status(400).json({ 
        error: 'Content and author are required' 
      });
    }

    // Verify feedback exists
    const feedback = await Feedback.findById(feedbackId);
    if (!feedback) {
      return res.status(404).json({ error: 'Feedback not found' });
    }

    // If parentCommentId is provided, verify parent comment exists
    if (parentCommentId) {
      const parentComment = await Comment.findById(parentCommentId);
      if (!parentComment) {
        return res.status(404).json({ error: 'Parent comment not found' });
      }
    }

    const comment = new Comment({
      feedbackId,
      parentCommentId: parentCommentId || null,
      author,
      content
    });

    await comment.save();

    res.status(201).json({
      success: true,
      comment: {
        id: comment._id,
        feedbackId: comment.feedbackId,
        parentCommentId: comment.parentCommentId,
        author: comment.author,
        content: comment.content,
        createdAt: comment.createdAt
      }
    });

  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ 
      error: 'Failed to add comment', 
      details: error.message 
    });
  }
});

/**
 * Get comments for feedback
 * GET /api/feedback/:feedbackId/comments
 */
router.get('/:feedbackId/comments', authenticateToken, async (req, res) => {
  try {
    const { feedbackId } = req.params;
    const { limit = 50, offset = 0 } = req.query;

    // Verify feedback exists
    const feedback = await Feedback.findById(feedbackId);
    if (!feedback) {
      return res.status(404).json({ error: 'Feedback not found' });
    }

    const comments = await Comment.find({ 
      feedbackId, 
      status: 'active' 
    })
      .sort({ createdAt: 1 })
      .limit(parseInt(limit))
      .skip(parseInt(offset));

    const totalCount = await Comment.countDocuments({ 
      feedbackId, 
      status: 'active' 
    });

    res.json({
      success: true,
      comments,
      pagination: {
        total: totalCount,
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: totalCount > parseInt(offset) + parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({ 
      error: 'Failed to retrieve comments', 
      details: error.message 
    });
  }
});

/**
 * Update comment
 * PUT /api/feedback/comments/:commentId
 */
router.put('/comments/:commentId', authenticateToken, async (req, res) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    comment.content = content;
    comment.status = 'edited';
    comment.editedAt = new Date();

    await comment.save();

    res.json({
      success: true,
      comment: {
        id: comment._id,
        content: comment.content,
        status: comment.status,
        editedAt: comment.editedAt,
        updatedAt: comment.updatedAt
      }
    });

  } catch (error) {
    console.error('Update comment error:', error);
    res.status(500).json({ 
      error: 'Failed to update comment', 
      details: error.message 
    });
  }
});

/**
 * Delete comment
 * DELETE /api/feedback/comments/:commentId
 */
router.delete('/comments/:commentId', authenticateToken, async (req, res) => {
  try {
    const { commentId } = req.params;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    comment.status = 'deleted';
    await comment.save();

    res.json({
      success: true,
      message: 'Comment deleted successfully'
    });

  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({ 
      error: 'Failed to delete comment', 
      details: error.message 
    });
  }
});

module.exports = router;
