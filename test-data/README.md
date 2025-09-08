# Test Data for DesignSight Demo

This directory contains sample data and scenarios for demonstrating DesignSight functionality.

## Sample Images

### Design Mockups
- `portfolio-design.png` - Portfolio website with accessibility issues
- `landing-page.png` - E-commerce landing page with visual hierarchy problems
- `mobile-app.png` - Mobile app interface with usability concerns
- `dashboard.png` - Admin dashboard with brand consistency issues

### Test Scenarios

#### Scenario 1: Portfolio Website Review
**File**: `portfolio-design.png`
**Issues to Demonstrate**:
- Poor color contrast ratios
- Inconsistent spacing between sections
- Missing alt text for images
- Unclear visual hierarchy
- Long paragraphs affecting readability

**Expected AI Feedback**:
- Accessibility violations (WCAG compliance)
- Visual hierarchy improvements
- Typography and spacing recommendations
- Brand consistency suggestions

#### Scenario 2: E-commerce Landing Page
**File**: `landing-page.png`
**Issues to Demonstrate**:
- Weak call-to-action buttons
- Cluttered layout
- Poor mobile responsiveness indicators
- Inconsistent button styles
- Missing trust indicators

**Expected AI Feedback**:
- Conversion optimization suggestions
- Layout and spacing improvements
- Button design recommendations
- Trust and credibility enhancements

#### Scenario 3: Mobile App Interface
**File**: `mobile-app.png`
**Issues to Demonstrate**:
- Touch target size issues
- Navigation clarity problems
- Information density concerns
- Platform-specific design violations
- User flow optimization opportunities

**Expected AI Feedback**:
- Mobile usability improvements
- Touch interaction optimization
- Navigation enhancement suggestions
- Information architecture recommendations

#### Scenario 4: Admin Dashboard
**File**: `dashboard.png`
**Issues to Demonstrate**:
- Data visualization clarity
- Navigation complexity
- Information overload
- Action prioritization
- User role differentiation

**Expected AI Feedback**:
- Data presentation improvements
- Navigation simplification
- Information hierarchy optimization
- User experience enhancements

## Demo Workflow

### 1. Upload and Analysis
1. Upload sample image
2. Wait for AI analysis (2-5 seconds)
3. Review generated feedback
4. Examine coordinate anchoring

### 2. Role-Based Filtering
1. Switch between different user roles
2. Observe how feedback changes
3. Demonstrate role-specific insights
4. Show filtering capabilities

### 3. Collaboration Features
1. Add comments to feedback items
2. Create threaded discussions
3. Demonstrate nested replies
4. Show author identification

### 4. Export and Handoff
1. Export feedback as JSON
2. Demonstrate data structure
3. Show coordinate information
4. Explain development handoff process

## Expected Results

### AI Analysis Output
```json
{
  "feedback": [
    {
      "category": "accessibility",
      "severity": "high",
      "title": "Poor Color Contrast",
      "description": "Text contrast ratio is below WCAG AA standards",
      "coordinates": { "x": 150, "y": 200 },
      "targetRoles": ["designer", "reviewer"]
    },
    {
      "category": "visualHierarchy",
      "severity": "medium",
      "title": "Inconsistent Spacing",
      "description": "Section spacing varies throughout the design",
      "coordinates": { "x": 100, "y": 300 },
      "targetRoles": ["designer"]
    }
  ]
}
```

### Collaboration Output
```json
{
  "comments": [
    {
      "author": "Sarah Chen",
      "content": "I'll update the color scheme to improve contrast",
      "timestamp": "2024-01-15T10:30:00Z",
      "replies": [
        {
          "author": "Mike Rodriguez",
          "content": "Thanks! Please also check the mobile version",
          "timestamp": "2024-01-15T10:35:00Z"
        }
      ]
    }
  ]
}
```

## Performance Benchmarks

### Expected Response Times
- Image upload: < 2 seconds
- AI analysis: 2-5 seconds
- Feedback display: < 1 second
- Comment loading: < 500ms

### Cost Estimates
- Small image (1MB): ~$0.001-0.005
- Medium image (5MB): ~$0.005-0.020
- Large image (10MB): ~$0.010-0.040

## Troubleshooting

### Common Issues
1. **AI Analysis Fails**: Check API key configuration
2. **Images Not Loading**: Verify Cloudinary setup
3. **Comments Not Saving**: Check database connection
4. **Slow Performance**: Monitor API rate limits

### Debug Information
- Check browser console for errors
- Verify network requests in DevTools
- Monitor backend logs for issues
- Test with different image formats

## Notes

- All sample images are designed to demonstrate specific issues
- AI feedback may vary based on model version and prompt changes
- Coordinate anchoring is approximate and may need adjustment
- Comments and discussions are simulated for demo purposes
- Export data structure matches production API format
