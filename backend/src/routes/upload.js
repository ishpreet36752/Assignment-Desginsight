const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs').promises;
// Simple UUID alternative
const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);

const Image = require('../models/Image');
const Project = require('../models/Project');
const Feedback = require('../models/Feedback');
const aiService = require('../services/aiService');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads');
    try {
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    const uniqueName = `${generateId()}-${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PNG, JPEG, JPG, and WebP images are allowed.'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 1
  }
});

/**
 * Upload and analyze design image
 * POST /api/upload
 */
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { projectId, categories, aiProvider } = req.body;
    
    // Validate required fields
    if (!projectId) {
      return res.status(400).json({ error: 'Project ID is required' });
    }
    
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    // Verify project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Get image dimensions using Sharp
    const imageInfo = await sharp(req.file.path).metadata();
    
    // Create image record
    const image = new Image({
      projectId,
      filename: req.file.filename,
      originalName: req.file.originalname,
      path: req.file.path,
      url: `/uploads/${req.file.filename}`,
      mimeType: req.file.mimetype,
      size: req.file.size,
      dimensions: {
        width: imageInfo.width,
        height: imageInfo.height
      },
      metadata: {
        uploadedBy: req.body.uploadedBy || 'anonymous',
        uploadSource: 'web'
      }
    });

    await image.save();

    // Start AI analysis in background
    const analysisCategories = categories ? JSON.parse(categories) : ['accessibility', 'visualHierarchy', 'contentCopy', 'uxPatterns'];
    const provider = aiProvider || project.settings.aiProvider || 'openai';
    
    // Update image status
    image.metadata.aiAnalysisStatus = 'analyzing';
    await image.save();

    // Perform AI analysis
    try {
      const aiResults = await aiService.analyzeDesign(req.file.path, {
        provider,
        categories: analysisCategories
      });

      // Save feedback items
      const feedbackPromises = aiResults.map(feedbackData => {
        const feedback = new Feedback({
          imageId: image._id,
          projectId: image.projectId,
          ...feedbackData,
          aiMetadata: {
            ...feedbackData.aiMetadata,
            analysisId: generateId()
          }
        });
        return feedback.save();
      });

      await Promise.all(feedbackPromises);

      // Update image status
      image.metadata.aiAnalysisStatus = 'completed';
      image.aiAnalysis = {
        provider,
        model: aiService.getAvailableProviders().find(p => p.id === provider)?.model || 'unknown',
        analysisId: generateId(),
        completedAt: new Date()
      };
      await image.save();

      res.json({
        success: true,
        image: {
          id: image._id,
          filename: image.filename,
          originalName: image.originalName,
          url: image.url,
          dimensions: image.dimensions,
          feedbackCount: aiResults.length,
          analysisStatus: 'completed'
        },
        feedback: aiResults
      });

    } catch (aiError) {
      console.error('AI analysis failed:', aiError);
      
      // Update image status
      image.metadata.aiAnalysisStatus = 'failed';
      image.aiAnalysis = {
        provider,
        error: aiError.message
      };
      await image.save();

      res.json({
        success: true,
        image: {
          id: image._id,
          filename: image.filename,
          originalName: image.originalName,
          url: image.url,
          dimensions: image.dimensions,
          analysisStatus: 'failed',
          error: 'AI analysis failed, but image was uploaded successfully'
        },
        feedback: []
      });
    }

  } catch (error) {
    console.error('Upload error:', error);
    
    // Clean up uploaded file if it exists
    if (req.file && req.file.path) {
      try {
        await fs.unlink(req.file.path);
      } catch (unlinkError) {
        console.error('Failed to clean up uploaded file:', unlinkError);
      }
    }
    
    res.status(500).json({ 
      error: 'Upload failed', 
      details: error.message 
    });
  }
});

/**
 * Get image with feedback
 * GET /api/upload/:imageId
 */
router.get('/:imageId', async (req, res) => {
  try {
    const { imageId } = req.params;
    const { role } = req.query;

    const image = await Image.findById(imageId).populate('projectId');
    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }

    // Build feedback query
    let feedbackQuery = { imageId };
    if (role && ['designer', 'reviewer', 'productManager', 'developer'].includes(role)) {
      feedbackQuery.targetRoles = role;
    }

    const feedback = await Feedback.find(feedbackQuery)
      .sort({ severity: -1, createdAt: -1 })
      .populate('comments');

    res.json({
      success: true,
      image: {
        id: image._id,
        filename: image.filename,
        originalName: image.originalName,
        url: image.url,
        dimensions: image.dimensions,
        project: image.projectId,
        analysisStatus: image.metadata.aiAnalysisStatus,
        createdAt: image.createdAt
      },
      feedback
    });

  } catch (error) {
    console.error('Get image error:', error);
    res.status(500).json({ 
      error: 'Failed to retrieve image', 
      details: error.message 
    });
  }
});

/**
 * Get available AI providers
 * GET /api/upload/providers
 */
router.get('/providers', (req, res) => {
  try {
    const providers = aiService.getAvailableProviders();
    res.json({
      success: true,
      providers
    });
  } catch (error) {
    console.error('Get providers error:', error);
    res.status(500).json({ 
      error: 'Failed to get AI providers', 
      details: error.message 
    });
  }
});

module.exports = router;
