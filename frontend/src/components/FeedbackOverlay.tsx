import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertCircle, 
  Eye, 
  MessageSquare, 
  Target,
  ArrowUpRight
} from 'lucide-react';
import { Feedback } from '../lib/api';
import { SLACK_FEEDBACK_CATEGORIES, SLACK_SEVERITY_LEVELS } from '../types/user-personas';

interface FeedbackOverlayProps {
  feedback: Feedback[];
  onFeedbackClick: (feedback: Feedback) => void;
  imageContainer: HTMLDivElement | null;
}

const FeedbackOverlay: React.FC<FeedbackOverlayProps> = ({
  feedback,
  onFeedbackClick,
  imageContainer
}) => {
  const [hoveredFeedback, setHoveredFeedback] = useState<string | null>(null);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (imageContainer) {
      const img = imageContainer.querySelector('img');
      if (img) {
        const updateDimensions = () => {
          setImageDimensions({
            width: img.offsetWidth,
            height: img.offsetHeight
          });
        };

        updateDimensions();
        
        // Update dimensions on window resize
        window.addEventListener('resize', updateDimensions);
        return () => window.removeEventListener('resize', updateDimensions);
      }
    }
  }, [imageContainer]);

  const getCategoryConfig = (category: string) => {
    return SLACK_FEEDBACK_CATEGORIES[category as keyof typeof SLACK_FEEDBACK_CATEGORIES] || {
      label: 'General',
      emoji: ':question:',
      color: 'bg-gray-500',
      description: 'General feedback'
    };
  };

  const getSeverityConfig = (severity: string) => {
    return SLACK_SEVERITY_LEVELS[severity as keyof typeof SLACK_SEVERITY_LEVELS] || {
      label: 'Medium',
      emoji: ':large_orange_circle:',
      color: 'text-orange-500',
      description: 'Medium priority'
    };
  };

  const calculatePosition = (coordinates: Feedback['coordinates']) => {
    if (!imageDimensions.width || !imageDimensions.height) {
      return { x: 0, y: 0, width: 0, height: 0 };
    }

    // Calculate relative position based on image dimensions
    const scaleX = imageDimensions.width / 1920; // Assuming original image width
    const scaleY = imageDimensions.height / 1080; // Assuming original image height
    
    return {
      x: coordinates.x * scaleX,
      y: coordinates.y * scaleY,
      width: coordinates.width * scaleX,
      height: coordinates.height * scaleY
    };
  };

  const getMarkerSize = (severity: string) => {
    switch (severity) {
      case 'high': return 'w-6 h-6';
      case 'medium': return 'w-5 h-5';
      case 'low': return 'w-4 h-4';
      default: return 'w-5 h-5';
    }
  };

  const getMarkerColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-orange-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  if (!imageContainer || feedback.length === 0) {
    return null;
  }

  return (
    <div className="absolute inset-0 pointer-events-none">
      <AnimatePresence>
        {feedback.map((item) => {
          const position = calculatePosition(item.coordinates);
          const categoryConfig = getCategoryConfig(item.category);
          const severityConfig = getSeverityConfig(item.severity);
          const isHovered = hoveredFeedback === item._id;

          return (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute pointer-events-auto"
              style={{
                left: position.x,
                top: position.y,
                width: position.width,
                height: position.height
              }}
              onMouseEnter={() => setHoveredFeedback(item._id)}
              onMouseLeave={() => setHoveredFeedback(null)}
            >
              {/* Feedback Marker */}
              <motion.button
                className={`${getMarkerSize(item.severity)} ${getMarkerColor(item.severity)} rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white text-xs font-bold cursor-pointer transition-all duration-200 hover:scale-110`}
                onClick={() => onFeedbackClick(item)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                animate={{
                  boxShadow: isHovered 
                    ? `0 0 0 4px ${getMarkerColor(item.severity).replace('bg-', 'rgba(').replace('-500', ', 0.3)')}`
                    : '0 4px 6px rgba(0, 0, 0, 0.1)'
                }}
              >
                {item.severity === 'high' ? '!' : item.severity === 'medium' ? '?' : 'i'}
              </motion.button>

              {/* Hover Tooltip */}
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                    className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-50"
                  >
                    <div className="bg-white rounded-lg shadow-lg border border-slack-gray-200 p-3 max-w-xs">
                      <div className="flex items-start space-x-2">
                        <div className={`w-8 h-8 rounded-lg ${categoryConfig.color} flex items-center justify-center text-white text-sm`}>
                          {categoryConfig.emoji}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-semibold text-slack-gray-800 text-sm truncate">
                              {item.title}
                            </h4>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              item.severity === 'high' ? 'bg-red-100 text-red-800' :
                              item.severity === 'medium' ? 'bg-orange-100 text-orange-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {severityConfig.emoji} {severityConfig.label}
                            </span>
                          </div>
                          <p className="text-xs text-slack-gray-600 line-clamp-2">
                            {item.description}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-slack-gray-500">
                              {categoryConfig.label}
                            </span>
                            <div className="flex items-center text-xs text-slack-gray-500">
                              <MessageSquare className="w-3 h-3 mr-1" />
                              Click to discuss
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Arrow pointing to marker */}
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2">
                        <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white"></div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Bounding Box (for larger feedback areas) */}
              {position.width > 50 && position.height > 50 && (
                <motion.div
                  className="absolute inset-0 border-2 border-dashed border-white/50 rounded-lg pointer-events-none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isHovered ? 1 : 0.3 }}
                  transition={{ duration: 0.2 }}
                />
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Feedback Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-slack-gray-200"
      >
        <div className="flex items-center space-x-2 mb-2">
          <Target className="w-4 h-4 text-slack-gray-600" />
          <span className="text-sm font-medium text-slack-gray-800">
            {feedback.length} feedback items
          </span>
        </div>
        
        <div className="flex space-x-2">
          {Object.entries(
            feedback.reduce((acc, item) => {
              acc[item.severity] = (acc[item.severity] || 0) + 1;
              return acc;
            }, {} as Record<string, number>)
          ).map(([severity, count]) => {
            const config = getSeverityConfig(severity);
            return (
              <div key={severity} className="flex items-center space-x-1">
                <div className={`w-2 h-2 rounded-full ${getMarkerColor(severity)}`} />
                <span className="text-xs text-slack-gray-600">{count}</span>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default FeedbackOverlay;
