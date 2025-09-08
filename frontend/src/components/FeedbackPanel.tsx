import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  MessageSquare, 
  Send, 
  User, 
  Clock, 
  Edit3,
  Trash2,
  Reply,
  ThumbsUp,
  ThumbsDown,
  MoreHorizontal
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { feedbackAPI, Feedback, Comment } from '../lib/api';
import { SLACK_FEEDBACK_CATEGORIES, SLACK_SEVERITY_LEVELS } from '../types/user-personas';

interface FeedbackPanelProps {
  feedback: Feedback[];
  selectedFeedback: Feedback | null;
  onFeedbackSelect: (feedback: Feedback | null) => void;
  onClose: () => void;
  imageId: string;
}

const FeedbackPanel: React.FC<FeedbackPanelProps> = ({
  feedback,
  selectedFeedback,
  onFeedbackSelect,
  onClose,
  imageId
}) => {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedFeedback) {
      loadComments();
    }
  }, [selectedFeedback]);

  const loadComments = async () => {
    if (!selectedFeedback) return;

    try {
      const response = await feedbackAPI.getComments(selectedFeedback._id);
      // Handle the response structure: { success: boolean; comments: Comment[] }
      if (response.success && Array.isArray(response.comments)) {
        setComments(response.comments);
      } else {
        setComments([]);
      }
    } catch (error) {
      console.error('Failed to load comments:', error);
      setComments([]); // Set to empty array on error
    }
  };

  const handleAddComment = async () => {
    if (!selectedFeedback || !newComment.trim()) return;

    try {
      setLoading(true);
      const response = await feedbackAPI.addComment(
        selectedFeedback._id,
        newComment.trim(),
        replyingTo || undefined,
        user?.name || 'Anonymous'
      );
      
      if (response.success && response.comment) {
        setComments(prev => [...prev, response.comment]);
        setNewComment('');
        setReplyingTo(null);
      }
    } catch (error) {
      console.error('Failed to add comment:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddReply = async (parentCommentId: string) => {
    if (!replyText.trim()) return;

    try {
      setLoading(true);
      const response = await feedbackAPI.addComment(
        selectedFeedback!._id,
        replyText.trim(),
        parentCommentId,
        user?.name || 'Anonymous'
      );
      
      if (response.success && response.comment) {
        setComments(prev => [...prev, response.comment]);
        setReplyText('');
        setReplyingTo(null);
      }
    } catch (error) {
      console.error('Failed to add reply:', error);
    } finally {
      setLoading(false);
    }
  };

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

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  const renderComment = (comment: Comment, isReply = false) => {
    // Ensure we have valid comment data
    if (!comment || !comment._id) {
      return null;
    }

    const authorName = comment.author || 'Anonymous';
    const authorInitial = authorName.charAt(0).toUpperCase();
    const content = comment.content || '';

    return (
      <motion.div
        key={comment._id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`${isReply ? 'ml-8' : ''} mb-4`}
      >
        <div className="message-bubble">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slack-purple to-slack-blue flex items-center justify-center flex-shrink-0">
              <span className="text-white text-sm font-medium">
                {authorInitial}
              </span>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <span className="font-medium text-slack-gray-800 text-sm">
                  {authorName}
                </span>
                <span className="text-xs text-slack-gray-500">
                  {formatTimeAgo(comment.createdAt)}
                </span>
                {comment.status === 'edited' && (
                  <span className="text-xs text-slack-gray-400">(edited)</span>
                )}
              </div>
              
              <p className="text-sm text-slack-gray-700 mb-2">
                {content}
              </p>
              
              <div className="flex items-center space-x-4">
                <button className="flex items-center space-x-1 text-xs text-slack-gray-500 hover:text-slack-gray-700">
                  <ThumbsUp className="w-3 h-3" />
                  <span>Like</span>
                </button>
                <button className="flex items-center space-x-1 text-xs text-slack-gray-500 hover:text-slack-gray-700">
                  <ThumbsDown className="w-3 h-3" />
                  <span>Dislike</span>
                </button>
                <button 
                  onClick={() => setReplyingTo(comment._id)}
                  className="flex items-center space-x-1 text-xs text-slack-gray-500 hover:text-slack-gray-700"
                >
                  <Reply className="w-3 h-3" />
                  <span>Reply</span>
                </button>
                {comment.author === user?.name && (
                  <button className="flex items-center space-x-1 text-xs text-slack-gray-500 hover:text-red-600">
                    <Trash2 className="w-3 h-3" />
                    <span>Delete</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Reply Form */}
        {replyingTo === comment._id && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="ml-8 mt-2"
          >
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Write a reply..."
                className="input-organic flex-1 text-sm"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleAddReply(comment._id);
                  }
                }}
              />
              <button
                onClick={() => handleAddReply(comment._id)}
                disabled={!replyText.trim() || loading}
                className="btn-slack px-3 py-2 text-sm disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  setReplyingTo(null);
                  setReplyText('');
                }}
                className="btn-organic border-2 border-slack-gray-300 text-slack-gray-700 px-3 py-2 text-sm"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 300 }}
      transition={{ duration: 0.3 }}
      className="fixed right-0 top-0 h-full w-96 bg-white shadow-xl border-l border-slack-gray-200 z-50 flex flex-col"
    >
      {/* Header */}
      <div className="p-4 border-b border-slack-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slack-gray-800">Feedback Discussion</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slack-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slack-gray-600" />
          </button>
        </div>

        {/* Feedback List */}
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {feedback.map((item) => {
            const categoryConfig = getCategoryConfig(item.category);
            const severityConfig = getSeverityConfig(item.severity);
            
            return (
              <button
                key={item._id}
                onClick={() => onFeedbackSelect(item)}
                className={`w-full p-3 rounded-lg text-left transition-all ${
                  selectedFeedback?._id === item._id
                    ? 'bg-slack-purple/10 border-2 border-slack-purple'
                    : 'hover:bg-slack-gray-50 border-2 border-transparent'
                }`}
              >
                <div className="flex items-start space-x-2">
                  <div className={`w-6 h-6 rounded-full ${categoryConfig.color} flex items-center justify-center text-white text-xs flex-shrink-0`}>
                    {categoryConfig.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-slack-gray-800 text-sm truncate">
                      {item.title}
                    </h4>
                    <p className="text-xs text-slack-gray-600 line-clamp-1">
                      {item.description}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        item.severity === 'high' ? 'bg-red-100 text-red-800' :
                        item.severity === 'medium' ? 'bg-orange-100 text-orange-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {severityConfig.emoji} {severityConfig.label}
                      </span>
                      <span className="text-xs text-slack-gray-500">
                        {categoryConfig.label}
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Feedback Details */}
      {selectedFeedback && (
        <div className="flex-1 flex flex-col min-h-0">
          <div className="p-4 border-b border-slack-gray-200 flex-shrink-0">
            <div className="flex items-start space-x-3">
              <div className={`w-10 h-10 rounded-lg ${getCategoryConfig(selectedFeedback.category).color} flex items-center justify-center text-white`}>
                {getCategoryConfig(selectedFeedback.category).emoji}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-slack-gray-800 mb-1">
                  {selectedFeedback.title}
                </h3>
                <p className="text-sm text-slack-gray-600 mb-2">
                  {selectedFeedback.description}
                </p>
                <div className="flex items-center space-x-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    selectedFeedback.severity === 'high' ? 'bg-red-100 text-red-800' :
                    selectedFeedback.severity === 'medium' ? 'bg-orange-100 text-orange-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {getSeverityConfig(selectedFeedback.severity).emoji} {getSeverityConfig(selectedFeedback.severity).label}
                  </span>
                  <span className="text-xs text-slack-gray-500">
                    {getCategoryConfig(selectedFeedback.category).label}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="mt-3 p-3 bg-slack-gray-50 rounded-lg">
              <h4 className="font-medium text-slack-gray-800 text-sm mb-1">Recommendation</h4>
              <p className="text-sm text-slack-gray-600">{selectedFeedback.recommendation}</p>
            </div>
          </div>

          {/* Comments Section */}
          <div className="flex-1 flex flex-col">
            <div className="p-4 border-b border-slack-gray-200">
              <h4 className="font-medium text-slack-gray-800 mb-3">
                Discussion ({comments.length})
              </h4>
              
              {/* Add Comment Form */}
              <div className="flex space-x-2 flex-shrink-0">
                <input
                  type="text"
                  placeholder="Add a comment..."
                  className="input-organic flex-1 text-sm"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleAddComment();
                    }
                  }}
                />
                <button
                  onClick={handleAddComment}
                  disabled={!newComment.trim() || loading}
                  className="btn-slack px-3 py-2 text-sm disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Comments List */}
            <div className="flex-1 overflow-y-auto p-4 min-h-0 discussion-scroll">
              {!Array.isArray(comments) || comments.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare className="w-12 h-12 text-slack-gray-400 mx-auto mb-4" />
                  <p className="text-slack-gray-600 text-sm">No comments yet</p>
                  <p className="text-slack-gray-500 text-xs mt-1">Start the discussion!</p>
                </div>
              ) : (
                <div className="space-y-4 pb-4">
                  {comments
                    .filter(comment => comment && !comment.parentCommentId)
                    .map(comment => (
                      <div key={comment._id}>
                        {renderComment(comment)}
                        {comments
                          .filter(reply => reply && reply.parentCommentId === comment._id)
                          .map(reply => renderComment(reply, true))
                        }
                      </div>
                    ))
                  }
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default FeedbackPanel;
