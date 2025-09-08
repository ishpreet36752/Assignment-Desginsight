import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles, Users, Target, Zap, MessageSquare, Palette, Search, BarChart3, Wrench, Heart, Star, Coffee } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SLACK_USER_PERSONAS, SLACK_ROLE_CONFIG } from '../types/user-personas';

const HomePage: React.FC = () => {
  const [currentPersona, setCurrentPersona] = useState(0);
  
  const personas = [
    {
      role: 'Designer',
      icon: Palette,
      color: 'text-role-designer',
      bgColor: 'bg-role-designer/10',
      description: 'Create stunning designs that work seamlessly across Slack workspaces',
      features: ['Visual hierarchy analysis', 'Brand consistency checks', 'Accessibility feedback'],
      slackHandle: '@sarah.design',
      team: '#design-team',
      personality: 'Creative & Visionary'
    },
    {
      role: 'Reviewer',
      icon: Search,
      color: 'text-role-reviewer',
      bgColor: 'bg-role-reviewer/10',
      description: 'Ensure quality and consistency across all Slack design work',
      features: ['Systematic review process', 'Quality standards tracking', 'Team collaboration'],
      slackHandle: '@mike.reviews',
      team: '#design-ops',
      personality: 'Detail-Oriented & Analytical'
    },
    {
      role: 'Product Manager',
      icon: BarChart3,
      color: 'text-role-pm',
      bgColor: 'bg-role-pm/10',
      description: 'Align design decisions with Slack app business objectives',
      features: ['User impact analysis', 'Conversion optimization', 'Stakeholder alignment'],
      slackHandle: '@jessica.pm',
      team: '#product-team',
      personality: 'Strategic & Data-Driven'
    },
    {
      role: 'Developer',
      icon: Wrench,
      color: 'text-role-developer',
      bgColor: 'bg-role-developer/10',
      description: 'Get clear technical specifications for Slack app implementation',
      features: ['Accessibility requirements', 'Technical feasibility', 'Implementation details'],
      slackHandle: '@alex.dev',
      team: '#engineering',
      personality: 'Technical & Precise'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPersona((prev) => (prev + 1) % personas.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 px-6 bg-gradient-to-br from-white via-slack-gray-50/30 to-indigo-50/20">
        {/* Organic Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-slack-purple/10 to-slack-blue/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-slack-green/10 to-emerald-500/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-yellow-400/5 to-orange-500/5 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-8xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center space-x-3 mb-8"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-slack-purple via-slack-blue to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm font-semibold text-slack-gray-500 tracking-wider uppercase">
                AI-Powered Design Feedback
              </span>
            </motion.div>
            
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-8 tracking-tight">
              <span className="bg-gradient-to-r from-slack-purple via-slack-blue to-indigo-600 bg-clip-text text-transparent">
                DesignSight
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl lg:text-3xl text-slack-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed font-medium">
              Design feedback that feels{' '}
              <span className="text-role-designer font-bold relative">
                human
                <motion.div
                  className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-role-designer/30 to-role-designer/60 rounded-full"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 1, duration: 0.8 }}
                />
              </span>
              ,{' '}
              <span className="text-role-reviewer font-bold relative">
                thoughtful
                <motion.div
                  className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-role-reviewer/30 to-role-reviewer/60 rounded-full"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 1.2, duration: 0.8 }}
                />
              </span>
              , and{' '}
              <span className="text-role-pm font-bold relative">
                actionable
                <motion.div
                  className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-role-pm/30 to-role-pm/60 rounded-full"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 1.4, duration: 0.8 }}
                />
              </span>
            </p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/dashboard" className="group relative inline-flex items-center px-8 py-4 bg-gradient-to-r from-slack-purple to-slack-blue text-white font-bold text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                  <Sparkles className="w-6 h-6 mr-3 group-hover:rotate-12 transition-transform duration-300" />
                  Start Designing
                  <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/login" className="group inline-flex items-center px-8 py-4 bg-white/80 backdrop-blur-sm border-2 border-slack-purple/20 text-slack-purple font-bold text-lg rounded-2xl hover:bg-slack-purple hover:text-white hover:border-slack-purple transition-all duration-300 shadow-lg hover:shadow-xl">
                  <Heart className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform duration-300" />
                  Sign In to Slack
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Slack Persona Showcase */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-20"
          >
            {personas.map((persona, index) => {
              const IconComponent = persona.icon;
              return (
                <motion.div
                  key={persona.role}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.1, duration: 0.6 }}
                  className={`group relative cursor-pointer transition-all duration-300 ${
                    currentPersona === index 
                      ? 'transform scale-105' 
                      : 'hover:transform hover:scale-102'
                  }`}
                  onClick={() => setCurrentPersona(index)}
                  whileHover={{ y: -5 }}
                >
                  <div className={`card-organic h-full transition-all duration-300 ${
                    currentPersona === index 
                      ? 'ring-2 ring-slack-purple shadow-2xl bg-gradient-to-br from-white to-slack-purple/5' 
                      : 'hover:shadow-xl hover:bg-gradient-to-br hover:from-white hover:to-slack-gray-50/50'
                  }`}>
                    <div className="flex items-start mb-6">
                      <div className={`w-16 h-16 ${persona.bgColor} rounded-2xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                        <IconComponent className={`w-8 h-8 ${persona.color}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-slack-gray-800 mb-1">{persona.role}</h3>
                        <p className="text-sm text-slack-gray-500 font-medium">{persona.slackHandle}</p>
                        <p className="text-xs text-slack-gray-400 mt-1">{persona.personality}</p>
                      </div>
                    </div>
                    
                    <p className="text-sm text-slack-gray-600 mb-6 leading-relaxed">{persona.description}</p>
                    
                    <div className="space-y-3">
                      {persona.features.map((feature, featureIndex) => (
                        <motion.div 
                          key={featureIndex} 
                          className="flex items-center text-sm text-slack-gray-500"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 1.2 + index * 0.1 + featureIndex * 0.1 }}
                        >
                          <div className="w-2 h-2 bg-gradient-to-r from-slack-purple to-slack-blue rounded-full mr-3 flex-shrink-0"></div>
                          {feature}
                        </motion.div>
                      ))}
                    </div>
                    
                    <div className="mt-6 pt-4 border-t border-slack-gray-100">
                      <p className="text-xs text-slack-gray-400 font-medium">{persona.team}</p>
                    </div>
                  </div>
                  
                  {currentPersona === index && (
                    <motion.div
                      className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-slack-purple to-slack-blue rounded-full flex items-center justify-center shadow-lg"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Star className="w-3 h-3 text-white" />
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-white/50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-slack-gray-800 mb-6">
              Built for Real Slack Teams
            </h2>
            <p className="text-xl text-slack-gray-600 max-w-3xl mx-auto">
              Every feature is designed around how Slack teams actually work, 
              with the imperfections and nuances that make collaboration human.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Target className="w-8 h-8" />,
                title: 'Coordinate-Anchored Feedback',
                description: 'Click directly on design elements to see specific feedback. No more guessing where issues are in your Slack app.',
                color: 'text-category-accessibility'
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: 'Role-Based Perspectives',
                description: 'Switch between Designer, Reviewer, PM, and Developer views to see what matters to each Slack team member.',
                color: 'text-role-reviewer'
              },
              {
                icon: <Zap className="w-8 h-8" />,
                title: 'AI-Powered Analysis',
                description: 'Real AI vision models analyze your Slack app designs for accessibility, hierarchy, and UX patterns.',
                color: 'text-category-uxPatterns'
              },
              {
                icon: <MessageSquare className="w-8 h-8" />,
                title: 'Slack-Style Discussions',
                description: 'Threaded conversations that feel natural to Slack users, with emojis and reactions.',
                color: 'text-role-pm'
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                className="card-organic border-organic"
              >
                <div className={`${feature.color} mb-4`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-slack-gray-800 mb-3">
                  {feature.title}
                </h3>
                <p className="text-slack-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Slack Integration Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-slack-purple/5 to-slack-blue/5">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-slack-gray-800 mb-6">
              Designed for Slack Teams
            </h2>
            <p className="text-xl text-slack-gray-600 mb-8">
              Work the way your team already works. DesignSight integrates seamlessly 
              with your Slack workflow, making design feedback feel natural and collaborative.
            </p>
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="card-organic">
                <div className="text-2xl mb-2">📱</div>
                <h3 className="font-semibold mb-2">Slack App Integration</h3>
                <p className="text-sm text-slack-gray-600">Native Slack app experience with familiar UI patterns</p>
              </div>
              <div className="card-organic">
                <div className="text-2xl mb-2">💬</div>
                <h3 className="font-semibold mb-2">Channel-Based Workflow</h3>
                <p className="text-sm text-slack-gray-600">Organize feedback by Slack channels and teams</p>
              </div>
              <div className="card-organic">
                <div className="text-2xl mb-2">🎯</div>
                <h3 className="font-semibold mb-2">Role-Based Notifications</h3>
                <p className="text-sm text-slack-gray-600">Get relevant feedback based on your Slack role</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/dashboard" className="btn-slack text-lg px-8 py-4">
                <Sparkles className="w-5 h-5 mr-2" />
                Get Started Free
              </Link>
              <Link to="/login" className="btn-organic text-lg px-8 py-4">
                Sign In with Slack
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
