const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs').promises;
const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);

const Image = require('../models/Image');
const Project = require('../models/Project');
const Feedback = require('../models/Feedback');
const aiService = require('../services/aiService');
const { authenticateToken, optionalAuth } = require('../middlewares/auth');
const cloudinary = require('../config/cloudinary');

// Debug Cloudinary configuration
console.log('🔧 Cloudinary Debug Info:');
console.log('CLOUDINARY_CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME);
console.log('CLOUDINARY_API_KEY:', process.env.CLOUDINARY_API_KEY);
console.log('CLOUDINARY_API_SECRET:', process.env.CLOUDINARY_API_SECRET ? '***SET***' : 'NOT SET');
console.log('Cloudinary config:', cloudinary.config());
console.log('');

const router = express.Router();

// Test AI providers endpoint
router.get('/test/ai-providers', authenticateToken, async (req, res) => {
  try {
    const providers = aiService.getAvailableProviders();
    
    res.json({
      success: true,
      availableProviders: providers,
      environment: {
        hasOpenRouter: !!(process.env.OPENROUTER_API_KEY && process.env.OPENROUTER_API_KEY !== 'your_openrouter_api_key_here'),
        openrouterKeyLength: process.env.OPENROUTER_API_KEY ? process.env.OPENROUTER_API_KEY.length : 0,
        openrouterKeyPrefix: process.env.OPENROUTER_API_KEY ? process.env.OPENROUTER_API_KEY.substring(0, 10) + '...' : 'not_set'
      },
      instructions: {
        message: "To enable AI analysis, create a .env file in the backend directory with:",
        example: "OPENROUTER_API_KEY=sk-or-your-actual-openrouter-api-key-here",
        getKeyFrom: "https://openrouter.ai/keys"
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Configure multer for memory storage (for Cloudinary upload)
const storage = multer.memoryStorage();

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
 * POST /api/images/upload/:projectId
 */
router.post('/upload/:projectId', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    const { projectId } = req.params;
    const { categories, aiProvider } = req.body;
    
    // Validate projectId
    if (!projectId || projectId === 'undefined') {
      return res.status(400).json({ error: 'Valid project ID is required' });
    }
    
    // Validate required fields
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    // Verify project exists and user owns it
    const project = await Project.findOne({ _id: projectId, owner: req.user.email });
    if (!project) {
      return res.status(404).json({ error: 'Project not found or access denied' });
    }

    // Upload to Cloudinary
    console.log('📤 Starting Cloudinary upload...');
    console.log('File buffer size:', req.file.buffer.length);
    console.log('File mimetype:', req.file.mimetype);
    console.log('File originalname:', req.file.originalname);
    
    const cloudinaryResult = await new Promise((resolve, reject) => {
      const uploadOptions = {
        resource_type: 'auto',
        folder: 'designsight',
        public_id: `design_${generateId()}_${Date.now()}`,
        transformation: [
          { quality: 'auto' },
          { fetch_format: 'auto' }
        ]
      };
      
      console.log('Cloudinary upload options:', uploadOptions);
      console.log('Cloudinary config before upload:', cloudinary.config());
      
      cloudinary.uploader.upload_stream(
        uploadOptions,
        (error, result) => {
          if (error) {
            console.error('❌ Cloudinary upload error:', error);
            console.error('Error details:', JSON.stringify(error, null, 2));
            reject(error);
          } else {
            console.log('✅ Cloudinary upload successful!');
            console.log('Result:', result);
            resolve(result);
          }
        }
      ).end(req.file.buffer);
    });

    // Get image dimensions using Sharp
    const imageInfo = await sharp(req.file.buffer).metadata();
    
    // Create image record
    const image = new Image({
      projectId,
      filename: cloudinaryResult.public_id,
      originalName: req.file.originalname,
      path: cloudinaryResult.secure_url, // Store Cloudinary URL as path
      url: cloudinaryResult.secure_url, // Public URL for AI analysis
      mimeType: req.file.mimetype,
      size: req.file.size,
      dimensions: {
        width: imageInfo.width,
        height: imageInfo.height
      },
      metadata: {
        uploadedBy: req.user.email,
        uploadSource: 'web',
        cloudinaryId: cloudinaryResult.public_id
      }
    });

    await image.save();

    // Start AI analysis in background
    const analysisCategories = categories ? JSON.parse(categories) : ['accessibility', 'visualHierarchy', 'contentCopy', 'uxPatterns'];
    const provider = aiProvider || project.settings.aiProvider || 'openrouter';
    
    // Update image status
    image.metadata.aiAnalysisStatus = 'analyzing';
    await image.save();

    // Perform AI analysis (only if API key is available)
    let aiResults = [];
    let aiError = null;
    
    try {
      if (process.env.OPENROUTER_API_KEY && process.env.OPENROUTER_API_KEY !== 'your_openrouter_api_key_here') {
        // Use Cloudinary URL for AI analysis
        console.log('🔗 Cloudinary URL for AI analysis:', cloudinaryResult.secure_url);
        
        aiResults = await aiService.analyzeDesign(cloudinaryResult.secure_url, analysisCategories);
        console.log('AI analysis completed successfully:', aiResults.length, 'issues found');
      } else {
        console.log('No OpenRouter API key provided, skipping AI analysis');
        aiResults = []; // No AI analysis
      }
    } catch (error) {
      console.error('AI analysis failed:', error.message);
      aiError = error.message;
      aiResults = []; // No AI analysis due to error
    }

    // Update image status and save feedback
    if (aiError) {
        image.metadata.aiAnalysisStatus = 'failed';
        image.aiAnalysis = {
          provider,
          model: aiService.getAvailableProviders().find(p => p.id === provider)?.model || 'unknown',
          analysisId: generateId(),
          completedAt: new Date(),
          error: aiError
        };
      } else if (aiResults.length > 0) {
        // Save feedback items
        console.log('💾 Saving feedback items:', aiResults.length);
        const feedbackPromises = aiResults.map((feedbackData, index) => {
          console.log(`📝 Saving feedback ${index + 1}:`, {
            title: feedbackData.title,
            category: feedbackData.category,
            targetRoles: feedbackData.targetRoles
          });
          
          const feedback = new Feedback({
            imageId: image._id,
            projectId: image.projectId,
            ...feedbackData,
            author: feedbackData.author || 'ai-system', // Use AI service author or default
            aiMetadata: {
              ...feedbackData.aiMetadata,
              analysisId: generateId()
            }
          });
          return feedback.save();
        });

        const savedFeedback = await Promise.all(feedbackPromises);
        console.log('✅ Successfully saved', savedFeedback.length, 'feedback items');

        image.metadata.aiAnalysisStatus = 'completed';
        image.aiAnalysis = {
          provider,
          model: aiService.getAvailableProviders().find(p => p.id === provider)?.model || 'unknown',
          analysisId: generateId(),
          completedAt: new Date()
        };
      } else {
        image.metadata.aiAnalysisStatus = 'skipped';
        image.aiAnalysis = {
          provider: 'none',
          model: 'no-api-key',
          analysisId: generateId(),
          completedAt: new Date(),
          reason: 'No API key configured'
        };
      }
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
          analysisStatus: aiError ? 'failed' : (aiResults.length > 0 ? 'completed' : 'skipped'),
          error: aiError || null
        },
        feedback: aiResults
      });

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
 * GET /api/images/:imageId
 */
router.get('/:imageId', optionalAuth, async (req, res) => {
  try {
    const { imageId } = req.params;
    const { role } = req.query;

    const image = await Image.findById(imageId).populate('projectId');
    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }

    // Check if user has access to this project
    if (req.user && image.projectId.owner !== req.user.email) {
      return res.status(403).json({ error: 'Access denied to this image' });
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
 * Get all images for a project
 * GET /api/images/project/:projectId
 */
router.get('/project/:projectId', authenticateToken, async (req, res) => {
  try {
    const { projectId } = req.params;

    // Validate projectId
    if (!projectId || projectId === 'undefined') {
      return res.status(400).json({ error: 'Valid project ID is required' });
    }

    // Verify project exists and user owns it
    const project = await Project.findOne({ _id: projectId, owner: req.user.email });
    if (!project) {
      return res.status(404).json({ error: 'Project not found or access denied' });
    }

    const images = await Image.find({ projectId })
      .sort({ createdAt: -1 })
      .select('filename originalName url dimensions metadata createdAt');

    res.json({
      success: true,
      images
    });

  } catch (error) {
    console.error('Get project images error:', error);
    res.status(500).json({ 
      error: 'Failed to retrieve images', 
      details: error.message 
    });
  }
});

/**
 * Delete an image
 * DELETE /api/images/:imageId
 */
router.delete('/:imageId', authenticateToken, async (req, res) => {
  try {
    const { imageId } = req.params;

    const image = await Image.findById(imageId).populate('projectId');
    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }

    // Check if user owns the project
    if (image.projectId.owner !== req.user.email) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Delete associated feedback
    await Feedback.deleteMany({ imageId });

    // Delete the image file
    try {
      await fs.unlink(image.path);
    } catch (unlinkError) {
      console.error('Failed to delete image file:', unlinkError);
    }

    // Delete the image record
    await Image.findByIdAndDelete(imageId);

    res.json({
      success: true,
      message: 'Image deleted successfully'
    });

  } catch (error) {
    console.error('Delete image error:', error);
    res.status(500).json({ 
      error: 'Failed to delete image', 
      details: error.message 
    });
  }
});

module.exports = router;
