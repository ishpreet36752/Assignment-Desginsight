const request = require('supertest');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const app = require('../../server');
const Project = require('../../models/Project');
const User = require('../../models/User');

describe('Projects API', () => {
  let authToken;
  let testUser;

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
  });

  describe('POST /api/projects', () => {
    it('should create a new project', async () => {
      const projectData = {
        name: 'Test Project',
        description: 'A test project for design feedback'
      };

      const response = await request(app)
        .post('/api/projects')
        .set('Authorization', `Bearer ${authToken}`)
        .send(projectData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.project.name).toBe(projectData.name);
      expect(response.body.project.description).toBe(projectData.description);
      expect(response.body.project.owner).toBe(testUser._id.toString());
    });

    it('should require authentication', async () => {
      const projectData = {
        name: 'Test Project',
        description: 'A test project'
      };

      await request(app)
        .post('/api/projects')
        .send(projectData)
        .expect(401);
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/projects')
        .set('Authorization', `Bearer ${authToken}`)
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/projects', () => {
    it('should get all projects for authenticated user', async () => {
      // Create test projects
      const project1 = new Project({
        name: 'Project 1',
        description: 'First project',
        owner: testUser._id
      });
      const project2 = new Project({
        name: 'Project 2',
        description: 'Second project',
        owner: testUser._id
      });
      await project1.save();
      await project2.save();

      const response = await request(app)
        .get('/api/projects')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.projects).toHaveLength(2);
    });

    it('should require authentication', async () => {
      await request(app)
        .get('/api/projects')
        .expect(401);
    });
  });

  describe('GET /api/projects/:id', () => {
    it('should get a specific project', async () => {
      const project = new Project({
        name: 'Test Project',
        description: 'A test project',
        owner: testUser._id
      });
      await project.save();

      const response = await request(app)
        .get(`/api/projects/${project._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.project.name).toBe('Test Project');
    });

    it('should return 404 for non-existent project', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      await request(app)
        .get(`/api/projects/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });
  });

  describe('PUT /api/projects/:id', () => {
    it('should update a project', async () => {
      const project = new Project({
        name: 'Original Name',
        description: 'Original description',
        owner: testUser._id
      });
      await project.save();

      const updateData = {
        name: 'Updated Name',
        description: 'Updated description'
      };

      const response = await request(app)
        .put(`/api/projects/${project._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.project.name).toBe('Updated Name');
    });
  });

  describe('DELETE /api/projects/:id', () => {
    it('should delete a project', async () => {
      const project = new Project({
        name: 'To Delete',
        description: 'This will be deleted',
        owner: testUser._id
      });
      await project.save();

      const response = await request(app)
        .delete(`/api/projects/${project._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);

      // Verify project is deleted
      const deletedProject = await Project.findById(project._id);
      expect(deletedProject).toBeNull();
    });
  });
});
