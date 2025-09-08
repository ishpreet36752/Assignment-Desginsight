

// Slack-Personalized User Personas for DesignSight
// Following human-centered design principles from uiux.mdc

export interface SlackUserPersona {
  id: string;
  name: string;
  role: 'designer' | 'reviewer' | 'productManager' | 'developer';
  slackHandle: string;
  team: string;
  goals: string[];
  behaviors: string[];
  emotionalNeeds: string[];
  painPoints: string[];
  context: string;
  visualPreferences: {
    colors: string[];
    layout: string;
    interactions: string[];
  };
  slackWorkflow: {
    channels: string[];
    notificationStyle: string;
    collaborationStyle: string;
  };
}

export const SLACK_USER_PERSONAS: SlackUserPersona[] = [
  {
    id: 'designer-sarah',
    name: 'Sarah Chen',
    role: 'designer',
    slackHandle: '@sarah.design',
    team: '#design-team',
    goals: [
      'Create visually stunning designs that work across all Slack workspaces',
      'Maintain brand consistency while pushing creative boundaries',
      'Collaborate seamlessly with PMs and developers in Slack channels',
      'Get quick, actionable feedback without endless Slack threads'
    ],
    behaviors: [
      'Shares design iterations in #design-review channel',
      'Uses Slack reactions for quick feedback approval',
      'Prefers visual feedback over long text descriptions',
      'Works in creative bursts, needs flexible feedback timing',
      'Values aesthetic harmony and visual hierarchy'
    ],
    emotionalNeeds: [
      'Creative freedom and expression within Slack guidelines',
      'Recognition for design expertise in team channels',
      'Confidence in design decisions before sharing publicly',
      'Inspiration and visual stimulation from team collaboration'
    ],
    painPoints: [
      'Feedback scattered across multiple Slack threads',
      'Design context lost in long message chains',
      'Difficulty tracking which designs need attention',
      'Time-consuming back-and-forth on design iterations'
    ],
    context: 'Senior designer at a fast-growing startup, working on Slack app redesign. Needs to balance creative vision with technical constraints while maintaining team collaboration.',
    visualPreferences: {
      colors: ['slack-purple', 'creative', 'inspiring'],
      layout: 'spacious, visual-first, creative freedom',
      interactions: ['smooth animations', 'visual feedback', 'drag-and-drop']
    },
    slackWorkflow: {
      channels: ['#design-team', '#design-review', '#product-updates'],
      notificationStyle: 'Visual-first, reaction-based feedback',
      collaborationStyle: 'Async with real-time collaboration when needed'
    }
  },
  {
    id: 'reviewer-mike',
    name: 'Mike Rodriguez',
    role: 'reviewer',
    slackHandle: '@mike.reviews',
    team: '#design-ops',
    goals: [
      'Ensure design quality and consistency across all Slack workspaces',
      'Maintain design system standards and brand guidelines',
      'Provide constructive feedback that improves team output',
      'Bridge communication between design and engineering teams'
    ],
    behaviors: [
      'Systematic approach to reviewing designs in dedicated channels',
      'Focuses on quality and adherence to Slack design principles',
      'Provides detailed, actionable feedback with clear next steps',
      'Works methodically through design elements and components',
      'Uses Slack threads to organize feedback discussions'
    ],
    emotionalNeeds: [
      'Structured and organized workflow within Slack channels',
      'Clear communication channels for design decisions',
      'Recognition for quality oversight and team improvement',
      'Confidence in review decisions and team alignment'
    ],
    painPoints: [
      'Inconsistent feedback formats across Slack channels',
      'Difficulty tracking feedback across multiple design iterations',
      'Lack of context for design decisions in Slack threads',
      'Time-consuming review processes that slow down team velocity'
    ],
    context: 'Design Operations Manager responsible for maintaining quality standards across multiple product teams and design systems, all coordinated through Slack.',
    visualPreferences: {
      colors: ['slack-blue', 'professional', 'trustworthy'],
      layout: 'organized, systematic, clear hierarchy',
      interactions: ['structured navigation', 'clear status indicators', 'organized lists']
    },
    slackWorkflow: {
      channels: ['#design-ops', '#design-review', '#engineering-design'],
      notificationStyle: 'Structured, organized, systematic',
      collaborationStyle: 'Scheduled reviews with async follow-up'
    }
  },
  {
    id: 'pm-jessica',
    name: 'Jessica Kim',
    role: 'productManager',
    slackHandle: '@jessica.pm',
    team: '#product-team',
    goals: [
      'Drive product success and user satisfaction in Slack ecosystem',
      'Align design decisions with business objectives and user needs',
      'Optimize user experience for Slack app adoption and engagement',
      'Coordinate cross-functional collaboration through Slack channels'
    ],
    behaviors: [
      'Data-driven decision making with Slack analytics integration',
      'Focuses on user impact and business value in design reviews',
      'Balances multiple stakeholder needs across different Slack workspaces',
      'Prioritizes based on impact and effort for Slack app features',
      'Uses Slack polls and reactions for quick team alignment'
    ],
    emotionalNeeds: [
      'Confidence in product direction and Slack integration strategy',
      'Clear visibility into design progress and team alignment',
      'Alignment across teams through transparent Slack communication',
      'Success metrics and validation for design decisions'
    ],
    painPoints: [
      'Design decisions not aligned with Slack app business goals',
      'Lack of user data to inform design choices for Slack features',
      'Slow feedback cycles delaying Slack app launches',
      'Difficulty prioritizing design improvements across multiple Slack workspaces'
    ],
    context: 'Product Manager for Slack app ecosystem, needs to ensure design decisions support user acquisition, retention, and engagement within Slack workspaces.',
    visualPreferences: {
      colors: ['slack-green', 'growth', 'success'],
      layout: 'data-focused, metrics-driven, clear priorities',
      interactions: ['quick access to key metrics', 'clear action items', 'progress tracking']
    },
    slackWorkflow: {
      channels: ['#product-team', '#design-review', '#user-research', '#analytics'],
      notificationStyle: 'Data-driven, metrics-focused, actionable',
      collaborationStyle: 'Async with scheduled sync meetings'
    }
  },
  {
    id: 'developer-alex',
    name: 'Alex Thompson',
    role: 'developer',
    slackHandle: '@alex.dev',
    team: '#engineering',
    goals: [
      'Implement Slack app designs accurately and efficiently',
      'Ensure technical feasibility of design decisions for Slack platform',
      'Maintain code quality and performance for Slack integrations',
      'Collaborate effectively with design team through Slack channels'
    ],
    behaviors: [
      'Technical and detail-oriented approach to design implementation',
      'Focuses on implementation feasibility within Slack API constraints',
      'Values clear specifications and requirements from design team',
      'Works systematically through technical challenges and Slack integrations',
      'Uses Slack code snippets and technical discussions for implementation details'
    ],
    emotionalNeeds: [
      'Clear technical requirements and Slack API specifications',
      'Confidence in implementation approach and technical decisions',
      'Recognition for technical expertise and Slack platform knowledge',
      'Efficient development workflow with minimal Slack context switching'
    ],
    painPoints: [
      'Unclear or incomplete design specifications for Slack features',
      'Design decisions that are technically challenging to implement',
      'Lack of context for design choices in Slack development channels',
      'Inconsistent feedback on implementation across Slack threads'
    ],
    context: 'Frontend developer specializing in Slack app development, needs clear technical specifications and accessibility requirements for Slack platform integration.',
    visualPreferences: {
      colors: ['slack-yellow', 'technical', 'practical'],
      layout: 'technical, detailed, implementation-focused',
      interactions: ['clear technical details', 'code examples', 'specification views']
    },
    slackWorkflow: {
      channels: ['#engineering', '#design-dev', '#slack-api', '#code-review'],
      notificationStyle: 'Technical, detailed, implementation-focused',
      collaborationStyle: 'Async with real-time pair programming when needed'
    }
  }
];

export type UserRole = 'designer' | 'reviewer' | 'productManager' | 'developer';

export const SLACK_ROLE_CONFIG = {
  designer: {
    label: 'Designer',
    icon: 'design',
    color: 'role-designer',
    slackEmoji: '',
    focus: 'Visual hierarchy, typography, spacing, brand consistency',
    feedbackCategories: ['visualHierarchy', 'uxPatterns', 'accessibility'],
    slackChannels: ['#design-team', '#design-review', '#brand-guidelines']
  },
  reviewer: {
    label: 'Reviewer',
    icon: 'review',
    color: 'role-reviewer',
    slackEmoji: '',
    focus: 'Overall quality, design system adherence, user experience',
    feedbackCategories: ['accessibility', 'visualHierarchy', 'uxPatterns', 'contentCopy'],
    slackChannels: ['#design-ops', '#design-review', '#quality-assurance']
  },
  productManager: {
    label: 'Product Manager',
    icon: 'analytics',
    color: 'role-pm',
    slackEmoji: '',
    focus: 'Usability, content strategy, conversion optimization',
    feedbackCategories: ['contentCopy', 'uxPatterns', 'accessibility'],
    slackChannels: ['#product-team', '#user-research', '#analytics']
  },
  developer: {
    label: 'Developer',
    icon: 'code',
    color: 'role-developer',
    slackEmoji: '',
    focus: 'Accessibility requirements, implementation complexity',
    feedbackCategories: ['accessibility', 'uxPatterns'],
    slackChannels: ['#engineering', '#design-dev', '#accessibility']
  }
} as const;

// Slack-specific feedback categories with emojis
export const SLACK_FEEDBACK_CATEGORIES = {
  accessibility: {
    label: 'Accessibility',
    emoji: '',
    color: 'category-accessibility',
    description: 'Color contrast, text readability, navigation issues'
  },
  visualHierarchy: {
    label: 'Visual Hierarchy',
    emoji: '',
    color: 'category-visualHierarchy',
    description: 'Spacing, alignment, typography consistency'
  },
  contentCopy: {
    label: 'Content & Copy',
    emoji: '',
    color: 'category-contentCopy',
    description: 'Tone, clarity, messaging effectiveness'
  },
  uxPatterns: {
    label: 'UX Patterns',
    emoji: '',
    color: 'category-uxPatterns',
    description: 'Button placement, user flow, best practices'
  }
} as const;

// Slack severity levels with emojis
export const SLACK_SEVERITY_LEVELS = {
  high: {
    label: 'High Priority',
    emoji: '',
    color: 'severity-high',
    description: 'Critical issues that need immediate attention'
  },
  medium: {
    label: 'Medium Priority',
    emoji: '',
    color: 'severity-medium',
    description: 'Important issues that should be addressed soon'
  },
  low: {
    label: 'Low Priority',
    emoji: '',
    color: 'severity-low',
    description: 'Nice-to-have improvements for future iterations'
  }
} as const;
