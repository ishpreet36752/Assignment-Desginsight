# DesignSight Backend

AI-powered design feedback platform backend built with Express.js, MongoDB, and real AI vision models.

## Features

- **Image Upload & Processing**: Handle PNG, JPEG, JPG, WebP files up to 10MB
- **AI-Powered Analysis**: Integration with OpenAI GPT-4V, Anthropic Claude, and Google Gemini
- **Coordinate-Anchored Feedback**: Precise feedback positioning on uploaded designs
- **Role-Based Filtering**: Designer, Reviewer, Product Manager, Developer perspectives
- **Threaded Discussions**: Collaborative feedback with nested comments
- **Project Management**: Organize images and feedback by projects
- **Real-Time Processing**: Background AI analysis with status tracking

## Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **File Upload**: Multer with Sharp for image processing
- **AI Integration**: OpenAI GPT-4V, Anthropic Claude, Google Gemini
- **Security**: Helmet, CORS, Rate Limiting
- **Containerization**: Docker & Docker Compose

## Prerequisites

- Node.js 18+ 
- MongoDB (local or Docker)
- At least one AI provider API key:
  - OpenAI API key for GPT-4V
  - Anthropic API key for Claude Vision
  - Google API key for Gemini Vision

## Quick Start

### 1. Clone and Install

```bash
cd designsight/backend
npm install
```

### 2. Environment Setup

```bash
# Copy environment template
cp env.example .env

# Edit .env with your API keys
nano .env
```

**Required Environment Variables:**
```env
MONGO_URI=mongodb://localhost:27017/designsight
OPENAI_API_KEY=your_openai_api_key_here
# OR
ANTHROPIC_API_KEY=your_anthropic_api_key_here
# OR  
GOOGLE_API_KEY=your_google_api_key_here
```

### 3. Start MongoDB

**Option A: Docker (Recommended)**
```bash
docker-compose up -d mongo
```

**Option B: Local MongoDB**
```bash
# Install and start MongoDB locally
mongod
```

### 4. Run the Server

```bash
# Development mode
npm run dev

# Production mode
npm start
```

Server will start at `http://localhost:5000`

## 🐳 Docker Deployment

### Full Stack with Docker Compose

```bash
# Start all services (MongoDB, Redis, Mongo Express)
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Services Available:
- **Backend API**: `http://localhost:5000`
- **MongoDB**: `mongodb://localhost:27017`
- **Mongo Express**: `http://localhost:8081` (admin/admin123)
- **Redis**: `localhost:6379`

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Core Endpoints

#### Projects
- `POST /api/projects` - Create project
- `GET /api/projects` - List projects
- `GET /api/projects/:id` - Get project details
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

#### Image Upload & Analysis
- `POST /api/upload` - Upload and analyze image
- `GET /api/upload/:id` - Get image with feedback
- `GET /api/upload/providers` - List available AI providers

#### Feedback & Comments
- `GET /api/feedback/:imageId` - Get feedback for image
- `PUT /api/feedback/:id` - Update feedback status
- `POST /api/feedback/:id/comments` - Add comment
- `GET /api/feedback/:id/comments` - Get comments

### Example Usage

#### 1. Create a Project
```bash
curl -X POST http://localhost:5000/api/projects \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Mobile App Redesign",
    "description": "Redesigning the mobile app interface",
    "owner": "designer@company.com"
  }'
```

#### 2. Upload and Analyze Image
```bash
curl -X POST http://localhost:5000/api/upload \
  -F "image=@screenshot.png" \
  -F "projectId=PROJECT_ID_HERE" \
  -F "categories=[\"accessibility\",\"visualHierarchy\"]"
```

#### 3. Get Feedback with Role Filter
```bash
curl "http://localhost:5000/api/feedback/IMAGE_ID_HERE?role=designer&severity=high"
```

## 🔧 Configuration

### AI Provider Setup

#### OpenAI GPT-4V
1. Get API key from [OpenAI Platform](https://platform.openai.com)
2. Add to `.env`: `OPENAI_API_KEY=sk-...`
3. Set as default: `DEFAULT_AI_PROVIDER=openai`

#### Anthropic Claude Vision
1. Get API key from [Anthropic Console](https://console.anthropic.com)
2. Add to `.env`: `ANTHROPIC_API_KEY=sk-ant-...`
3. Set as default: `DEFAULT_AI_PROVIDER=anthropic`

#### Google Gemini Vision
1. Get API key from [Google AI Studio](https://makersuite.google.com)
2. Add to `.env`: `GOOGLE_API_KEY=...`
3. Set as default: `DEFAULT_AI_PROVIDER=google`

### Analysis Categories

Configure which feedback categories to analyze:

```javascript
{
  "accessibility": true,      // Color contrast, text readability
  "visualHierarchy": true,    // Spacing, alignment, typography
  "contentCopy": true,        // Tone, clarity, messaging
  "uxPatterns": true          // Button placement, user flow
}
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run with coverage
npm test -- --coverage
```

## 📊 Monitoring & Health

### Health Check
```bash
curl http://localhost:5000/health
```

### API Documentation
```bash
curl http://localhost:5000/api
```

## 🔒 Security Features

- **Rate Limiting**: 100 requests per 15 minutes per IP
- **File Validation**: Only image files, 10MB max
- **CORS Protection**: Configurable origins
- **Helmet Security**: Security headers
- **Input Sanitization**: XSS protection
- **Error Handling**: No sensitive data in errors

## 💰 Cost Management

### AI API Costs (Approximate)
- **OpenAI GPT-4V**: ~$0.01-0.03 per image
- **Anthropic Claude**: ~$0.015-0.04 per image  
- **Google Gemini**: ~$0.001-0.005 per image

### Cost Tracking
Enable in `.env`:
```env
TRACK_AI_COSTS=true
COST_ALERT_THRESHOLD=10.00
```

## 🚨 Troubleshooting

### Common Issues

#### MongoDB Connection Failed
```bash
# Check if MongoDB is running
docker-compose ps mongo

# Check logs
docker-compose logs mongo
```

#### AI Analysis Failing
1. Verify API key is correct
2. Check API quota/credits
3. Ensure image format is supported
4. Check network connectivity

#### File Upload Issues
1. Verify file size < 10MB
2. Check file format (PNG, JPEG, JPG, WebP)
3. Ensure uploads directory exists
4. Check disk space

### Debug Mode
```bash
# Enable verbose logging
DEBUG=true VERBOSE_LOGGING=true npm run dev
```

## 📈 Performance

### Optimization Tips
- Use image compression before upload
- Implement caching for repeated analyses
- Use background job queues for heavy processing
- Monitor memory usage with large images

### Scaling Considerations
- Use Redis for session storage
- Implement horizontal scaling with load balancer
- Use CDN for image serving
- Consider database sharding for large datasets

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the troubleshooting section
- Review API documentation at `/api` endpoint

---

**Built with ❤️ for better design feedback**
