const express = require('express');
const Project = require('../models/Project');
const Image = require('../models/Image');
const { authenticateToken, optionalAuth } = require('../middlewares/auth');

const router = express.Router();

/**
 * Create a new project
 * POST /api/projects
 */
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { name, description, settings } = req.body;

    if (!name) {
      return res.status(400).json({ 
        error: 'Project name is required' 
      });
    }

    const project = new Project({
      name,
      description,
      owner: req.user.email, // Use authenticated user's email
      settings: settings || {
        aiProvider: 'openai',
        analysisCategories: {
          accessibility: true,
          visualHierarchy: true,
          contentCopy: true,
          uxPatterns: true
        }
      }
    });

    await project.save();

    res.status(201).json({
      success: true,
      project: {
        _id: project._id,
        id: project._id,
        name: project.name,
        description: project.description,
        owner: project.owner,
        status: project.status,
        settings: project.settings,
        createdAt: project.createdAt
      }
    });

  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ 
      error: 'Failed to create project', 
      details: error.message 
    });
  }
});

/**
 * Get all projects for a user
 * GET /api/projects
 */
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { owner, status } = req.query;

    let query = { owner: req.user.email }; // Only show user's projects
    if (status) query.status = status;

    const projects = await Project.find(query)
      .sort({ createdAt: -1 })
      .select('-__v');

    // Get image counts for each project
    const projectsWithCounts = await Promise.all(
      projects.map(async (project) => {
        const imageCount = await Image.countDocuments({ projectId: project._id });
        return {
          _id: project._id,
          id: project._id,
          name: project.name,
          description: project.description,
          owner: project.owner,
          status: project.status,
          settings: project.settings,
          imageCount,
          createdAt: project.createdAt,
          updatedAt: project.updatedAt
        };
      })
    );

    res.json({
      success: true,
      projects: projectsWithCounts
    });

  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ 
      error: 'Failed to retrieve projects', 
      details: error.message 
    });
  }
});

/**
 * Get a specific project
 * GET /api/projects/:projectId
 */
router.get('/:projectId', async (req, res) => {
  try {
    const { projectId } = req.params;

    // Validate projectId
    if (!projectId || projectId === 'undefined') {
      return res.status(400).json({ error: 'Valid project ID is required' });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Get images for this project
    const images = await Image.find({ projectId })
      .sort({ createdAt: -1 })
      .select('filename originalName url dimensions metadata createdAt');

    res.json({
      success: true,
      project: {
        _id: project._id,
        id: project._id,
        name: project.name,
        description: project.description,
        owner: project.owner,
        status: project.status,
        settings: project.settings,
        imageCount: images.length,
        images,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt
      }
    });

  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({ 
      error: 'Failed to retrieve project', 
      details: error.message 
    });
  }
});

/**
 * Update a project
 * PUT /api/projects/:projectId
 */
router.put('/:projectId', async (req, res) => {
  try {
    const { projectId } = req.params;
    const { name, description, status, settings } = req.body;

    // Validate projectId
    if (!projectId || projectId === 'undefined') {
      return res.status(400).json({ error: 'Valid project ID is required' });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Update fields
    if (name !== undefined) project.name = name;
    if (description !== undefined) project.description = description;
    if (status !== undefined) project.status = status;
    if (settings !== undefined) project.settings = { ...project.settings, ...settings };

    await project.save();

    res.json({
      success: true,
      project: {
        _id: project._id,
        id: project._id,
        name: project.name,
        description: project.description,
        owner: project.owner,
        status: project.status,
        settings: project.settings,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt
      }
    });

  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ 
      error: 'Failed to update project', 
      details: error.message 
    });
  }
});

/**
 * Delete a project
 * DELETE /api/projects/:projectId
 */
router.delete('/:projectId', async (req, res) => {
  try {
    const { projectId } = req.params;

    // Validate projectId
    if (!projectId || projectId === 'undefined') {
      return res.status(400).json({ error: 'Valid project ID is required' });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Delete associated images and feedback
    await Image.deleteMany({ projectId });
    // Note: Feedback will be deleted via cascade or we can add explicit deletion

    await Project.findByIdAndDelete(projectId);

    res.json({
      success: true,
      message: 'Project deleted successfully'
    });

  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ 
      error: 'Failed to delete project', 
      details: error.message 
    });
  }
});

module.exports = router;
