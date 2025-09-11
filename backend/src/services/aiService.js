const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');

class AIService {
  constructor() {
    this.openrouterConfig = {
      baseURL: 'https://openrouter.ai/api/v1',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json'
      }
    };
  }

  /**
   * Analyze design image using OpenRouter GPT-4 Vision
   * @param {string} imageUrl - URL to the image (Cloudinary or public URL)
   * @param {Array} categories - Analysis categories
   * @returns {Promise<Array>} Analysis results
   */
  async analyzeDesign(imageUrl, categories = ['accessibility', 'visualHierarchy', 'contentCopy', 'uxPatterns']) {
    try {
      // Validate API key
      if (!process.env.OPENROUTER_API_KEY || process.env.OPENROUTER_API_KEY === 'your_openrouter_api_key_here') {
        throw new Error('OpenRouter API key not configured. Please add OPENROUTER_API_KEY to your .env file');
      }

      console.log('Analyzing image with OpenRouter GPT-4 Vision:', imageUrl);

      const prompt = this.buildAnalysisPrompt(categories);

      const response = await axios.post(
        `${this.openrouterConfig.baseURL}/chat/completions`,
        {
          model: 'gpt-4o-mini', // OpenRouter GPT-4 Vision capable
          messages: [
            {
              role: 'user',
              content: [
                { type: 'text', text: prompt },
                { type: 'image_url', image_url: { url: imageUrl } }
              ]
            }
          ],
          max_tokens: 2000,
          temperature: 0.4 
        },
        {
          headers:{
            'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json'
          },
          timeout: 60000
        }
      );

      console.log('OpenRouter response received');
      return this.parseAIResponse(response.data.choices[0].message.content, 'openrouter');

    } catch (error) {
      console.error('OpenRouter analysis failed:', error.response?.data || error.message);
      throw new Error(`AI analysis failed: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  /**
   * Get MIME type from file path
   */
  getMimeType(imagePath) {
    const ext = path.extname(imagePath).toLowerCase();
    switch (ext) {
      case '.jpg':
      case '.jpeg': return 'image/jpeg';
      case '.png': return 'image/png';
      case '.gif': return 'image/gif';
      case '.webp': return 'image/webp';
      default: return 'image/png';
    }
  }

  /**
   * Build analysis prompt for GPT-4 Vision
   */
  buildAnalysisPrompt(categories) {
    const categoryDescriptions = {
      accessibility: 'Accessibility issues (color contrast, text readability, navigation, screen reader compatibility)',
      visualHierarchy: 'Visual hierarchy problems (spacing, alignment, typography consistency, information architecture)',
      contentCopy: 'Content and copy issues (tone, clarity, messaging effectiveness, call-to-action clarity)',
      uxPatterns: 'UI/UX pattern problems (button placement, user flow, best practices, interaction design)'
    };

    const selectedCategories = categories.map(cat => categoryDescriptions[cat]).join(', ');

    return `You are a design analysis expert. Analyze this design screenshot and provide structured feedback focusing on: ${selectedCategories}.

CRITICAL: You must respond with ONLY a valid JSON array. No other text, explanations, or formatting.

For each issue found, provide:
1. Category (${categories.join(', ')})
2. Severity (high, medium, low)
3. Title (brief description)
4. Description (detailed explanation)
5. Recommendation (actionable solution)
6. Coordinates (x, y, width, height) - estimate pixel positions based on the image
7. Target roles (ONLY use these exact values: designer, reviewer, productManager, developer)

REQUIRED JSON FORMAT (respond with ONLY this structure as Reference):
[
  {
    "category": "accessibility",
    "severity": "high",
    "title": "Low contrast text",
    "description": "The text has insufficient contrast against the background",
    "recommendation": "Increase contrast ratio to meet WCAG AA standards (4.5:1 for normal text)",
    "coordinates": {"x": 100, "y": 200, "width": 300, "height": 50},
    "targetRoles": ["designer", "developer"]
  }
]

IMPORTANT:
- Analyze and understand the Image then write the description
- Return ONLY the JSON array, no markdown, no code blocks, no explanations
- Be specific with coordinates based on the actual image layout
- Provide actionable feedback with specific recommendations
- Limit to 5-10 most important issues
- Ensure valid JSON syntax
- Focus on issues that would impact user experience or accessibility
- Look for real, specific issues in this particular design, not generic problems
- Vary your feedback based on what you actually see in the image
- CRITICAL: For targetRoles, ONLY use these exact values: "designer", "reviewer", "productManager", "developer"
- Do NOT use any other role names like "contentWriter", "writer", "pm", etc.`;
  }

  /**
   * Parse AI response and extract structured feedback
   */
  parseAIResponse(responseText, provider) {
    try {
      console.log('Raw AI response:', responseText);

      let cleanedText = responseText
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();

      if (!cleanedText.startsWith('[') && !cleanedText.startsWith('{')) {
        const jsonMatch = responseText.match(/\[[\s\S]*\]/);
        if (jsonMatch) cleanedText = jsonMatch[0];
      }

      console.log('Cleaned response:', cleanedText);

      const feedback = JSON.parse(cleanedText);
      const feedbackArray = Array.isArray(feedback) ? feedback : [feedback];

      return feedbackArray.map(item => ({
        category: item.category || 'general',
        severity: item.severity || 'medium',
        title: item.title || 'Design Issue',
        description: item.description || 'No description provided',
        recommendation: item.recommendation || 'Please review this area',
        coordinates: {
          x: Math.max(0, item.coordinates?.x || Math.floor(Math.random() * 400)),
          y: Math.max(0, item.coordinates?.y || Math.floor(Math.random() * 300)),
          width: Math.max(1, item.coordinates?.width || 100),
          height: Math.max(1, item.coordinates?.height || 50)
        },
        targetRoles: (() => {
          const originalRoles = item.targetRoles;
          const validatedRoles = this.validateTargetRoles(originalRoles);
          if (originalRoles && originalRoles.some(role => !['designer', 'reviewer', 'productManager', 'developer'].includes(role))) {
            console.log('Role mapping:', originalRoles, '→', validatedRoles);
          }
          return validatedRoles;
        })(),
        source: 'ai',
        aiMetadata: {
          provider,
          confidence: 0.8,
          timestamp: new Date().toISOString()
        }
      }));
    } catch (error) {
      console.error('Failed to parse AI response:', error);
      console.error('Response text:', responseText);

      return [{
        category: 'general',
        severity: 'medium',
        title: 'AI Analysis not Completed',
        description: 'AI analysis was completed but response format was unexpected. Please review the design manually.',
        recommendation: 'Review the uploaded design for potential improvements.',
        coordinates: { x: 50, y: 50, width: 200, height: 100 },
        targetRoles: this.validateTargetRoles(['designer']),
        source: 'ai',
        aiMetadata: {
          provider,
          confidence: 0.5,
          error: 'Response parsing failed',
          timestamp: new Date().toISOString()
        }
      }];
    }
  }

  /**
   * Validate and map target roles to valid enum values
   */
  validateTargetRoles(roles) {
    const validRoles = ['designer', 'reviewer', 'productManager', 'developer'];
    const roleMapping = {
      'contentWriter': 'productManager',
      'contentwriter': 'productManager',
      'content_writer': 'productManager',
      'writer': 'productManager',
      'copywriter': 'productManager',
      'uxwriter': 'productManager',
      'uxwriter': 'productManager',
      'pm': 'productManager',
      'productmanager': 'productManager',
      'product_manager': 'productManager',
      'dev': 'developer',
      'engineer': 'developer',
      'frontend': 'developer',
      'backend': 'developer',
      'fullstack': 'developer',
      'design': 'designer',
      'ui': 'designer',
      'ux': 'designer',
      'visual': 'designer',
      'review': 'reviewer',
      'qa': 'reviewer',
      'quality': 'reviewer'
    };

    if (!roles || !Array.isArray(roles)) {
      return ['designer'];
    }

    return roles.map(role => {
      const normalizedRole = role.toLowerCase().trim();
      
      // Direct match
      if (validRoles.includes(normalizedRole)) {
        return normalizedRole;
      }
      
      // Mapped match
      if (roleMapping[normalizedRole]) {
        return roleMapping[normalizedRole];
      }
      
      // Default fallback based on role type
      if (normalizedRole.includes('content') || normalizedRole.includes('copy') || normalizedRole.includes('text')) {
        return 'productManager';
      }
      if (normalizedRole.includes('dev') || normalizedRole.includes('engineer') || normalizedRole.includes('code')) {
        return 'developer';
      }
      if (normalizedRole.includes('design') || normalizedRole.includes('ui') || normalizedRole.includes('visual')) {
        return 'designer';
      }
      if (normalizedRole.includes('review') || normalizedRole.includes('qa') || normalizedRole.includes('test')) {
        return 'reviewer';
      }
      
      // Default fallback
      return 'designer';
    }).filter((role, index, arr) => arr.indexOf(role) === index); // Remove duplicates
  }

  /**
   * Get available AI providers
   */
  getAvailableProviders() {
    const providers = [];

    if (process.env.OPENROUTER_API_KEY && process.env.OPENROUTER_API_KEY !== 'your_openrouter_api_key_here') {
      providers.push({
        id: 'openrouter',
        name: 'OpenRouter GPT-4o-mini Vision',
        model: 'gpt-4o-mini',
        status: 'available'
      });
    } else {
      providers.push({
        id: 'openrouter',
        name: 'OpenRouter GPT-4o-mini Vision',
        model: 'gpt-4o-mini',
        status: 'not_configured',
        error: 'API key not set'
      });
    }

    return providers;
  }
}

module.exports = new AIService();
