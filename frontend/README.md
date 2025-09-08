# DesignSight Frontend

A React + TypeScript + Vite frontend for the DesignSight AI-powered design feedback platform, built specifically for Slack teams.

## 🚀 Features

- **Slack-Personalized Design**: Built with Slack teams in mind, featuring familiar UI patterns and workflows
- **Coordinate-Anchored Feedback**: Interactive overlay system showing feedback directly on uploaded designs
- **Role-Based Views**: Switch between Designer, Reviewer, Product Manager, and Developer perspectives
- **Threaded Discussions**: Slack-style comment system with nested replies and reactions
- **AI-Powered Analysis**: Real-time feedback from AI vision models (OpenRouter GPT-4o-mini)
- **Human-Centered Design**: Following UI/UX principles with organic, imperfect design elements
- **Export Features**: PDF and JSON export for development handoff

## 🛠 Tech Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom Slack-inspired design system
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Routing**: React Router DOM

## 📋 Prerequisites

- Node.js 18+
- Backend server running on `http://localhost:5000`

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

### 3. Build for Production

```bash
npm run build
```

### 4. Preview Production Build

```bash
npm run preview
```

## 🎨 Design System

### Slack-Inspired Color Palette

```css
--slack-purple: #4A154B
--slack-green: #007A5A
--slack-blue: #1264A3
--slack-yellow: #FFB800
--slack-red: #E01E5A
```

### Role-Based Colors

- **Designer**: Purple (#8B5CF6) - Creativity and visual design
- **Reviewer**: Blue (#3B82F6) - Quality and systematic review
- **Product Manager**: Green (#10B981) - Growth and business impact
- **Developer**: Orange (#F59E0B) - Technical implementation

### Human-Centered Design Principles

- **Organic Shapes**: Slightly irregular borders and rounded corners
- **Imperfect Spacing**: Varied, human-like spacing instead of rigid grids
- **Hand-crafted Feel**: Custom shadows, organic animations, and tactile interactions
- **Slack-Style Elements**: Message bubbles, emoji reactions, and familiar UI patterns

## 📱 User Personas

### Designer (Sarah Chen)
- **Slack Handle**: @sarah.design
- **Team**: #design-team
- **Focus**: Visual hierarchy, typography, brand consistency
- **Workflow**: Shares iterations in #design-review, uses reactions for quick feedback

### Reviewer (Mike Rodriguez)
- **Slack Handle**: @mike.reviews
- **Team**: #design-ops
- **Focus**: Quality standards, design system adherence
- **Workflow**: Systematic review process, organized feedback discussions

### Product Manager (Jessica Kim)
- **Slack Handle**: @jessica.pm
- **Team**: #product-team
- **Focus**: User impact, conversion optimization, business alignment
- **Workflow**: Data-driven decisions, stakeholder alignment through Slack

### Developer (Alex Thompson)
- **Slack Handle**: @alex.dev
- **Team**: #engineering
- **Focus**: Technical feasibility, accessibility, implementation details
- **Workflow**: Clear specifications, code snippets, technical discussions

## 🔧 API Integration

The frontend integrates with the DesignSight backend API:

### Authentication
- JWT token-based authentication
- Cookie-based session management
- Automatic token refresh

### Core Endpoints
- `POST /api/auth/login` - User authentication
- `GET /api/projects` - List user projects
- `POST /api/images/upload/:projectId` - Upload and analyze images
- `GET /api/feedback/:imageId` - Get feedback with role filtering
- `POST /api/feedback/:feedbackId/comments` - Add threaded comments

## 🎯 Key Components

### FeedbackOverlay
- Coordinate-anchored feedback markers
- Interactive hover tooltips
- Severity-based visual indicators
- Bounding box highlighting for larger areas

### FeedbackPanel
- Slack-style threaded discussions
- Emoji reactions and replies
- Real-time comment updates
- Role-based comment filtering

### ImageUpload
- Drag-and-drop file upload
- Real-time upload progress
- AI analysis status tracking
- File validation and error handling

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Environment Variables

Create a `.env` file:

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_NAME=DesignSight
```

### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 📊 Performance

- **Bundle Size**: ~500KB gzipped
- **First Contentful Paint**: <1.5s
- **Largest Contentful Paint**: <2.5s
- **Cumulative Layout Shift**: <0.1

## 🔒 Security

- **XSS Protection**: Input sanitization and CSP headers
- **CSRF Protection**: SameSite cookie attributes
- **Secure Headers**: Helmet.js integration
- **API Security**: JWT token validation

## 🤝 Contributing

1. Follow the human-centered design principles
2. Maintain Slack-inspired UI patterns
3. Use TypeScript for type safety
4. Write tests for new components
5. Follow the existing code style

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the backend API documentation
- Review the Slack integration guide

---

Built with ❤️ for Slack teams who value creativity, quality, impact, and precision.