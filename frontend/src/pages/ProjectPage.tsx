import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Download, 
  MessageSquare, 
  Filter,
  Eye,
  EyeOff,
  Plus,
  Settings,
  Users,
  Target,
  AlertCircle,
  CheckCircle,
  Clock,
  Code,
  ChevronUp,
  ChevronDown,
  Palette,
  Search,
  BarChart3,
  Wrench
} from 'lucide-react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { projectAPI, imageAPI, feedbackAPI, Project, Image, Feedback } from '../lib/api';
import { SLACK_ROLE_CONFIG, SLACK_FEEDBACK_CATEGORIES, SLACK_SEVERITY_LEVELS } from '../types/user-personas';
import FeedbackOverlay from '../components/FeedbackOverlay';
import FeedbackPanel from '../components/FeedbackPanel';

const ProjectPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [images, setImages] = useState<Image[]>([]);
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState<string>(user?.role || 'designer');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showFeedbackPanel, setShowFeedbackPanel] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  const [imageContainerRef, setImageContainerRef] = useState<HTMLDivElement | null>(null);
  const [showJson, setShowJson] = useState(false);

  const userRole = user?.role as keyof typeof SLACK_ROLE_CONFIG;
  const roleConfig = userRole ? SLACK_ROLE_CONFIG[userRole] : null;

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'designer': return Palette;
      case 'reviewer': return Search;
      case 'productManager': return BarChart3;
      case 'developer': return Wrench;
      default: return Users;
    }
  };

  useEffect(() => {
    if (id) {
      loadProjectData();
    }
  }, [id]);

  useEffect(() => {
    if (selectedImage) {
      loadFeedback();
    }
  }, [selectedImage, selectedRole, selectedSeverity, selectedCategory]);

  const loadProjectData = async () => {
    if (!id) return;
    
    try {
      const [projectResponse, imagesResponse] = await Promise.all([
        projectAPI.getProject(id),
        imageAPI.getImagesByProject(id)
      ]);
      
      if (projectResponse.success) {
        setProject(projectResponse.project);
      }
      
      if (imagesResponse.success) {
        setImages(imagesResponse.images);
        
        if (imagesResponse.images.length > 0) {
          setSelectedImage(imagesResponse.images[0]);
        }
      }
    } catch (error) {
      console.error('Failed to load project data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadFeedback = async () => {
    if (!selectedImage) return;

    try {
      const params: { role?: string; severity?: string; category?: string } = {};
      if (selectedRole !== 'all') params.role = selectedRole;
      if (selectedSeverity !== 'all') params.severity = selectedSeverity;
      if (selectedCategory !== 'all') params.category = selectedCategory;
      
      const response = await feedbackAPI.getFeedbackForImage(selectedImage._id, params);
      if (response.success) {
        setFeedback(response.feedback);
      }
    } catch (error) {
      console.error('Failed to load feedback:', error);
    }
  };

  const filteredFeedback = feedback.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesRole = selectedRole === 'all' || item.targetRoles.includes(selectedRole);
    const matchesSeverity = selectedSeverity === 'all' || item.severity === selectedSeverity;
    return matchesCategory && matchesRole && matchesSeverity;
  });

  const handleFeedbackClick = (feedbackItem: Feedback) => {
    setSelectedFeedback(feedbackItem);
    setShowFeedbackPanel(true);
  };

  const handleExportPDF = () => {
    // TODO: Implement PDF export
    console.log('Export PDF functionality to be implemented');
  };

  const handleExportJSON = () => {
    const exportData = {
      project: project,
      image: selectedImage,
      feedback: filteredFeedback,
      exportedAt: new Date().toISOString(),
      exportedBy: user?.name
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project?.name}-feedback-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-organic w-16 h-16 rounded-full"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slack-gray-800 mb-2">Project Not Found</h2>
          <p className="text-slack-gray-600 mb-6">The project you're looking for doesn't exist.</p>
          <Link to="/dashboard" className="btn-slack">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slack-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-slack-gray-200 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/dashboard" className="p-2 hover:bg-slack-gray-100 rounded-lg transition-colors">
                <ArrowLeft className="w-5 h-5 text-slack-gray-600" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-slack-gray-800">{project.name}</h1>
                <p className="text-slack-gray-600">{project.description}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={handleExportPDF}
                className="btn-organic border-2 border-slack-gray-300 text-slack-gray-700 hover:bg-slack-gray-50"
              >
                <Download className="w-4 h-4 mr-2" />
                Export PDF
              </button>
              <button
                onClick={handleExportJSON}
                className="btn-slack"
              >
                <Download className="w-4 h-4 mr-2" />
                Export JSON
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-8xl mx-auto px-6 sm:px-8 lg:px-12 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 xl:gap-12">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-8">
            {/* Role Selector */}
            <div className="card-organic">
              <h3 className="font-semibold text-slack-gray-800 mb-4">View as</h3>
              <div className="space-y-2">
                {Object.entries(SLACK_ROLE_CONFIG).map(([role, config]) => {
                  const IconComponent = getRoleIcon(role);
                  return (
                    <motion.button
                      key={role}
                      onClick={() => setSelectedRole(role)}
                      className={`w-full flex items-center p-4 rounded-xl transition-all duration-300 group ${
                        selectedRole === role
                          ? 'bg-gradient-to-r from-slack-purple/10 to-slack-purple/5 border-2 border-slack-purple shadow-lg'
                          : 'hover:bg-slack-gray-50 border-2 border-transparent hover:border-slack-gray-200'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className={`p-2 rounded-lg mr-4 transition-colors duration-300 ${
                        selectedRole === role 
                          ? 'bg-slack-purple/20' 
                          : 'bg-slack-gray-100 group-hover:bg-slack-gray-200'
                      }`}>
                        <IconComponent className={`w-5 h-5 transition-colors duration-300 ${
                          selectedRole === role 
                            ? 'text-slack-purple' 
                            : 'text-slack-gray-600 group-hover:text-slack-gray-800'
                        }`} />
                      </div>
                      <div className="text-left flex-1">
                        <p className="font-semibold text-slack-gray-800 text-sm">{config.label}</p>
                        <p className="text-xs text-slack-gray-500 mt-1">{config.focus}</p>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Filters */}
            <div className="card-organic">
              <h3 className="font-semibold text-slack-gray-800 mb-4">Filters</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slack-gray-700 mb-2">
                    Severity
                  </label>
                  <select
                    className="input-organic w-full"
                    value={selectedSeverity}
                    onChange={(e) => setSelectedSeverity(e.target.value)}
                  >
                    <option value="all">All Severities</option>
                    {Object.entries(SLACK_SEVERITY_LEVELS).map(([severity, config]) => (
                      <option key={severity} value={severity}>
                        {config.emoji} {config.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slack-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    className="input-organic w-full"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    <option value="all">All Categories</option>
                    {Object.entries(SLACK_FEEDBACK_CATEGORIES).map(([category, config]) => (
                      <option key={category} value={category}>
                        {config.emoji} {config.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Image Gallery */}
            <div className="card-organic">
              <h3 className="font-semibold text-slack-gray-800 mb-4">Images ({images.length})</h3>
              <div className="space-y-2">
                {images.map((image) => (
                  <button
                    key={image._id}
                    onClick={() => setSelectedImage(image)}
                    className={`w-full p-3 rounded-lg text-left transition-all ${
                      selectedImage?._id === image._id
                        ? 'bg-slack-blue/10 border-2 border-slack-blue'
                        : 'hover:bg-slack-gray-50 border-2 border-transparent'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-slack-gray-200 rounded-lg flex items-center justify-center">
                        <img
                          src={image.url}
                          alt={image.originalName}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slack-gray-800 truncate">
                          {image.originalName}
                        </p>
                        <p className="text-xs text-slack-gray-500">
                          {image.dimensions.width} × {image.dimensions.height}
                        </p>
                        <div className="flex items-center mt-1">
                          {image.metadata.aiAnalysisStatus === 'completed' ? (
                            <CheckCircle className="w-3 h-3 text-green-500 mr-1" />
                          ) : image.metadata.aiAnalysisStatus === 'failed' ? (
                            <AlertCircle className="w-3 h-3 text-red-500 mr-1" />
                          ) : (
                            <Clock className="w-3 h-3 text-yellow-500 mr-1" />
                          )}
                          <span className="text-xs text-slack-gray-500">
                            {image.metadata.aiAnalysisStatus}
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {selectedImage ? (
              <div className="card-organic">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-slack-gray-800">
                    {selectedImage.originalName}
                  </h2>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-slack-gray-500">
                      {filteredFeedback.length} feedback items
                    </span>
                    <button
                      onClick={() => setShowFeedbackPanel(!showFeedbackPanel)}
                      className="btn-organic border-2 border-slack-gray-300 text-slack-gray-700 hover:bg-slack-gray-50"
                    >
                      {showFeedbackPanel ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Image with Feedback Overlay */}
                <div 
                  ref={setImageContainerRef}
                  className="relative bg-white rounded-lg border border-slack-gray-200 overflow-hidden"
                >
                  <img
                    src={selectedImage.url}
                    alt={selectedImage.originalName}
                    className="w-full h-auto"
                    style={{ maxHeight: '70vh' }}
                  />
                  
                  <FeedbackOverlay
                    feedback={filteredFeedback}
                    onFeedbackClick={handleFeedbackClick}
                    imageContainer={imageContainerRef}
                  />
                </div>

                {/* JSON Display Block */}
                <div className="mt-6 card-organic">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-slack-gray-800 flex items-center">
                      <Code className="w-5 h-5 mr-2" />
                      AI Analysis JSON
                    </h3>
                    <button
                      onClick={() => setShowJson(!showJson)}
                      className="btn-organic border-2 border-slack-gray-300 text-slack-gray-700 hover:bg-slack-gray-50 px-3 py-2"
                    >
                      {showJson ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                  
                  {showJson && (
                    <div className="bg-slack-gray-50 rounded-lg p-4 border border-slack-gray-200">
                      <pre className="text-sm text-slack-gray-700 overflow-x-auto whitespace-pre-wrap">
                        {JSON.stringify({
                          image: {
                            id: selectedImage._id,
                            filename: selectedImage.filename,
                            originalName: selectedImage.originalName,
                            url: selectedImage.url,
                            dimensions: selectedImage.dimensions,
                            createdAt: selectedImage.createdAt
                          },
                          feedback: filteredFeedback.map(f => ({
                            id: f._id,
                            title: f.title,
                            category: f.category,
                            severity: f.severity,
                            description: f.description,
                            recommendation: f.recommendation,
                            coordinates: f.coordinates,
                            targetRoles: f.targetRoles,
                            source: f.source,
                            author: f.author,
                            status: f.status,
                            createdAt: f.createdAt
                          })),
                          analysis: {
                            totalFeedback: filteredFeedback.length,
                            byCategory: filteredFeedback.reduce((acc, f) => {
                              acc[f.category] = (acc[f.category] || 0) + 1;
                              return acc;
                            }, {} as Record<string, number>),
                            bySeverity: filteredFeedback.reduce((acc, f) => {
                              acc[f.severity] = (acc[f.severity] || 0) + 1;
                              return acc;
                            }, {} as Record<string, number>),
                            byRole: filteredFeedback.reduce((acc, f) => {
                              f.targetRoles.forEach(role => {
                                acc[role] = (acc[role] || 0) + 1;
                              });
                              return acc;
                            }, {} as Record<string, number>)
                          }
                        }, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="card-organic text-center py-12">
                <Target className="w-16 h-16 text-slack-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slack-gray-800 mb-2">
                  No Images in Project
                </h3>
                <p className="text-slack-gray-600 mb-6">
                  Upload some designs to get started with AI-powered feedback
                </p>
                <Link to="/upload" className="btn-slack">
                  <Plus className="w-5 h-5 mr-2" />
                  Upload Design
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Feedback Panel */}
      <AnimatePresence>
        {showFeedbackPanel && selectedImage && (
          <FeedbackPanel
            feedback={filteredFeedback}
            selectedFeedback={selectedFeedback}
            onFeedbackSelect={setSelectedFeedback}
            onClose={() => setShowFeedbackPanel(false)}
            imageId={selectedImage._id}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProjectPage;
