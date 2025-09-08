# API Costs and Usage Documentation

## Overview

DesignSight integrates with multiple AI providers and cloud services. This document outlines the costs associated with each service and provides guidance on cost management.

## AI Provider Costs

### OpenRouter (Recommended)

OpenRouter provides access to multiple AI models through a single API, making it the recommended choice for DesignSight.

**Models Available:**
- GPT-4o-mini (Primary model used by DesignSight)
- GPT-4o
- Claude 3.5 Sonnet
- Claude 3 Haiku
- Gemini Pro Vision

**Pricing (as of 2024):**
- GPT-4o-mini: $0.15 per 1M input tokens, $0.60 per 1M output tokens
- GPT-4o: $2.50 per 1M input tokens, $10.00 per 1M output tokens
- Claude 3.5 Sonnet: $3.00 per 1M input tokens, $15.00 per 1M output tokens

**Estimated Cost per Image Analysis:**
- Small image (1MB): ~$0.001 - $0.005
- Medium image (5MB): ~$0.005 - $0.020
- Large image (10MB): ~$0.010 - $0.040

**Free Tier:** $5 credit for new accounts

### Direct OpenAI API

**GPT-4o-mini Pricing:**
- Input: $0.15 per 1M tokens
- Output: $0.60 per 1M tokens

**GPT-4o Pricing:**
- Input: $2.50 per 1M tokens
- Output: $10.00 per 1M tokens

**Free Tier:** $5 credit for new accounts

### Anthropic Claude API

**Claude 3.5 Sonnet Pricing:**
- Input: $3.00 per 1M tokens
- Output: $15.00 per 1M tokens

**Claude 3 Haiku Pricing:**
- Input: $0.25 per 1M tokens
- Output: $1.25 per 1M tokens

**Free Tier:** $5 credit for new accounts

### Google Gemini API

**Gemini Pro Vision Pricing:**
- Input: $0.0005 per 1K tokens
- Output: $0.0015 per 1K tokens

**Free Tier:** 15 requests per minute, 1M tokens per day

## Cloud Storage Costs

### Cloudinary

**Free Tier:**
- 25 GB storage
- 25 GB bandwidth per month
- 25,000 transformations per month

**Paid Plans:**
- Basic: $89/month for 100 GB storage, 100 GB bandwidth
- Advanced: $179/month for 500 GB storage, 500 GB bandwidth

**Estimated Usage:**
- Image storage: ~$0.10 per GB per month
- Transformations: ~$0.10 per 1,000 transformations
- Bandwidth: ~$0.10 per GB

## Database Costs

### MongoDB Atlas

**Free Tier (M0):**
- 512 MB storage
- Shared RAM
- No backup

**Paid Plans:**
- M2: $9/month for 2 GB storage
- M5: $25/month for 5 GB storage
- M10: $57/month for 10 GB storage

## Cost Estimation Examples

### Small Team (5 users, 100 images/month)
- AI Analysis: $5-20/month
- Cloud Storage: $0-10/month
- Database: $0-25/month
- **Total: $5-55/month**

### Medium Team (20 users, 500 images/month)
- AI Analysis: $25-100/month
- Cloud Storage: $10-50/month
- Database: $25-57/month
- **Total: $60-207/month**

### Large Team (100 users, 2000 images/month)
- AI Analysis: $100-400/month
- Cloud Storage: $50-200/month
- Database: $57-200/month
- **Total: $207-800/month**

## Cost Optimization Strategies

### 1. Model Selection
- Use GPT-4o-mini for most analysis (90% cost reduction vs GPT-4o)
- Reserve GPT-4o for complex or critical analysis
- Consider Claude Haiku for simple tasks

### 2. Image Optimization
- Compress images before upload (reduce token usage)
- Use appropriate image sizes (1024x1024 max recommended)
- Implement image caching to avoid re-analysis

### 3. Usage Monitoring
- Enable cost tracking in environment variables
- Set up alerts for budget thresholds
- Monitor usage patterns and optimize accordingly

### 4. Caching Strategy
- Cache AI analysis results for identical images
- Implement smart refresh policies
- Use CDN for frequently accessed images

## Budget Management

### Setting Up Cost Alerts

1. Configure cost tracking in your `.env` file:
```env
TRACK_AI_COSTS=true
COST_ALERT_THRESHOLD=50.00
DAILY_COST_LIMIT=10.00
MONTHLY_COST_LIMIT=200.00
```

2. Monitor costs through provider dashboards:
- OpenRouter: Dashboard shows real-time usage
- Cloudinary: Analytics tab shows storage and bandwidth usage
- MongoDB Atlas: Metrics tab shows database usage

### Cost Tracking Implementation

The application includes built-in cost tracking:

```javascript
// Example cost tracking in AI service
const trackCost = (provider, model, inputTokens, outputTokens) => {
  const cost = calculateCost(provider, model, inputTokens, outputTokens);
  // Log to database or external service
  console.log(`AI Analysis Cost: $${cost.toFixed(4)}`);
};
```

## Free Tier Limitations

### OpenRouter
- $5 credit for new accounts
- No recurring free tier
- Pay-per-use model

### OpenAI
- $5 credit for new accounts
- No recurring free tier
- Pay-per-use model

### Anthropic
- $5 credit for new accounts
- No recurring free tier
- Pay-per-use model

### Google Gemini
- 15 requests per minute
- 1M tokens per day
- Free tier available indefinitely

### Cloudinary
- 25 GB storage
- 25 GB bandwidth per month
- 25,000 transformations per month
- Free tier available indefinitely

### MongoDB Atlas
- 512 MB storage
- Shared RAM
- No backup
- Free tier available indefinitely

## Recommendations

### For Development
- Start with free tiers
- Use GPT-4o-mini for cost efficiency
- Implement local caching
- Monitor usage closely

### For Production
- Set up proper cost monitoring
- Implement usage limits
- Use appropriate model for task complexity
- Consider enterprise plans for high volume

### For Enterprise
- Negotiate custom pricing with providers
- Implement advanced caching strategies
- Use dedicated infrastructure
- Set up comprehensive monitoring and alerting

## Support and Resources

- OpenRouter Documentation: https://openrouter.ai/docs
- OpenAI Pricing: https://openai.com/pricing
- Anthropic Pricing: https://www.anthropic.com/pricing
- Google AI Pricing: https://ai.google.dev/pricing
- Cloudinary Pricing: https://cloudinary.com/pricing
- MongoDB Atlas Pricing: https://www.mongodb.com/atlas/pricing
