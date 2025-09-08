const request = require('supertest');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const app = require('../../server');
const Project = require('../../models/Project');
const Image = require('../../models/Image');
const Feedback = require('../../models/Feedback');
const Comment = require('../../models/Comment');
const User = require('../../models/User');

describe('Feedback API', () => {
  let authToken;
  let testUser;
  let testProject;
  let testImage;
  let testFeedback;

  beforeAll(async () => {
    // Create test user
    testUser = new User({
      name: 'Test User',
      email: 'test@example.com',
      password: 'hashedpassword'
    });
    await testUser.save();

    // Generate auth token
    authToken = jwt.sign(
      { userId: testUser._id, email: testUser.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Create test project
    testProject = new Project({
      name: 'Test Project',
      description: 'A test project',
      owner: testUser._id
    });
    await testProject.save();

    // Create test image
    testImage = new Image({
      filename: 'test-image.jpg',
      originalName: 'test-image.jpg',
      url: 'https://example.com/test-image.jpg',
      projectId: testProject._id,
      uploadedBy: testUser._id,
      dimensions: { width: 1920, height: 1080 }
    });
    await testImage.save();

    // Create test feedback
    testFeedback = new Feedback({
      imageId: testImage._id,
      projectId: testProject._id,
      category: 'visualHierarchy',
      severity: 'medium',
      title: 'Test Feedback',
      description: 'This is a test feedback item',
      coordinates: { x: 100, y: 200 },
      targetRoles: ['designer'],
      author: 'ai-system'
    });
    await testFeedback.save();
  });

  describe('GET /api/feedback/:imageId', () => {
    it('should get feedback for an image', async () => {
      const response = await request(app)
        .get(`/api/feedback/${testImage._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.feedback).toHaveLength(1);
      expect(response.body.feedback[0].title).toBe('Test Feedback');
    });

    it('should require authentication', async () => {
      await request(app)
        .get(`/api/feedback/${testImage._id}`)
        .expect(401);
    });

    it('should return 404 for non-existent image', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      await request(app)
        .get(`/api/feedback/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });
  });

  describe('POST /api/feedback/:feedbackId/comments', () => {
    it('should add a comment to feedback', async () => {
      const commentData = {
        content: 'This is a test comment',
        author: 'Test User'
      };

      const response = await request(app)
        .post(`/api/feedback/${testFeedback._id}/comments`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(commentData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.comment.content).toBe(commentData.content);
      expect(response.body.comment.author).toBe(commentData.author);
    });

    it('should validate required fields', async () => {
      await request(app)
        .post(`/api/feedback/${testFeedback._id}/comments`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({})
        .expect(400);
    });
  });

  describe('GET /api/feedback/:feedbackId/comments', () => {
    it('should get comments for feedback', async () => {
      // Create test comment
      const comment = new Comment({
        feedbackId: testFeedback._id,
        author: 'Test User',
        content: 'Test comment content'
      });
      await comment.save();

      const response = await request(app)
        .get(`/api/feedback/${testFeedback._id}/comments`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.comments).toHaveLength(1);
      expect(response.body.comments[0].content).toBe('Test comment content');
    });
  });

  describe('POST /api/feedback/:feedbackId/comments (nested replies)', () => {
    it('should create nested replies', async () => {
      // Create parent comment
      const parentComment = new Comment({
        feedbackId: testFeedback._id,
        author: 'Parent User',
        content: 'Parent comment'
      });
      await parentComment.save();

      // Create reply
      const replyData = {
        content: 'This is a reply',
        author: 'Reply User',
        parentCommentId: parentComment._id
      };

      const response = await request(app)
        .post(`/api/feedback/${testFeedback._id}/comments`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(replyData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.comment.parentCommentId).toBe(parentComment._id.toString());
    });
  });

  describe('PUT /api/comments/:commentId', () => {
    it('should update a comment', async () => {
      const comment = new Comment({
        feedbackId: testFeedback._id,
        author: 'Test User',
        content: 'Original content'
      });
      await comment.save();

      const updateData = {
        content: 'Updated content'
      };

      const response = await request(app)
        .put(`/api/comments/${comment._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.comment.content).toBe('Updated content');
    });
  });

  describe('DELETE /api/comments/:commentId', () => {
    it('should delete a comment', async () => {
      const comment = new Comment({
        feedbackId: testFeedback._id,
        author: 'Test User',
        content: 'To be deleted'
      });
      await comment.save();

      const response = await request(app)
        .delete(`/api/comments/${comment._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);

      // Verify comment is deleted
      const deletedComment = await Comment.findById(comment._id);
      expect(deletedComment).toBeNull();
    });
  });
});
