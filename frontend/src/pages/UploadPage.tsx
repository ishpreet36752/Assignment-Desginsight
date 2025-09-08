import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  Upload, 
  Image, 
  X, 
  CheckCircle, 
  AlertCircle,
  Plus,
  FolderOpen
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { projectAPI, imageAPI, Project } from '../lib/api';

const UploadPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedImage, setUploadedImage] = useState<any>(null);
  const [error, setError] = useState('');
  const [showNewProject, setShowNewProject] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');

  // Load projects on component mount
  React.useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const response = await projectAPI.getProjects();
      if (response.success) {
        setProjects(response.projects);
      }
    } catch (error) {
      console.error('Failed to load projects:', error);
    }
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, [selectedProject]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (file: File) => {
    if (!selectedProject) {
      setError('Please select a project first');
      return;
    }

    // Validate file type
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('Please upload a PNG, JPEG, JPG, or WebP image');
      return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }

    setError('');
    setUploading(true);
    setUploadProgress(0);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const formData = new FormData();
      formData.append('image', file);
      formData.append('categories', JSON.stringify([
        'accessibility',
        'visualHierarchy', 
        'contentCopy',
        'uxPatterns'
      ]));

      const response = await imageAPI.uploadImage(selectedProject, formData, (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
        setUploadProgress(percentCompleted);
      });

      clearInterval(progressInterval);
      setUploadProgress(100);
      setUploadedImage(response.image);

      // Navigate to project page after successful upload
      setTimeout(() => {
        navigate(`/project/${selectedProject}`);
      }, 2000);

    } catch (error: any) {
      setError(error.response?.data?.error || 'Upload failed. Please try again.');
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const createNewProject = async () => {
    if (!newProjectName.trim()) {
      setError('Project name is required');
      return;
    }

    try {
      const response = await projectAPI.createProject(newProjectName, newProjectDescription, {
        aiProvider: 'openrouter',
        analysisCategories: {
          accessibility: true,
          visualHierarchy: true,
          contentCopy: true,
          uxPatterns: true
        }
      });

      if (response.success) {
        setProjects(prev => [...prev, response.project]);
        setSelectedProject(response.project._id);
      }
      setShowNewProject(false);
      setNewProjectName('');
      setNewProjectDescription('');
      setError('');
    } catch (error: any) {
      setError(error.response?.data?.error || 'Failed to create project');
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-slack-gray-800 mb-2">
            Upload Design for Review
          </h1>
          <p className="text-slack-gray-600">
            Upload your design and get AI-powered feedback from your Slack team
          </p>
        </motion.div>

        {/* Project Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="card-organic mb-6"
        >
          <h2 className="text-lg font-semibold text-slack-gray-800 mb-4">Select Project</h2>
          
          {projects.length === 0 ? (
            <div className="text-center py-8">
              <FolderOpen className="w-12 h-12 text-slack-gray-400 mx-auto mb-4" />
              <p className="text-slack-gray-600 mb-4">No projects found</p>
              <button
                onClick={() => setShowNewProject(true)}
                className="btn-slack"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create First Project
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projects.map((project) => (
                <button
                  key={project._id}
                  onClick={() => setSelectedProject(project._id)}
                  className={`p-4 rounded-lg border-2 text-left transition-all ${
                    selectedProject === project._id
                      ? 'border-slack-purple bg-slack-purple/5'
                      : 'border-slack-gray-200 hover:border-slack-gray-300'
                  }`}
                >
                  <h3 className="font-medium text-slack-gray-800">{project.name}</h3>
                  <p className="text-sm text-slack-gray-600 mt-1">
                    {project.description || 'No description'}
                  </p>
                  <span className={`inline-block mt-2 px-2 py-1 rounded-full text-xs font-medium ${
                    project.status === 'active' ? 'bg-green-100 text-green-800' :
                    project.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {project.status}
                  </span>
                </button>
              ))}
              
              <button
                onClick={() => setShowNewProject(true)}
                className="p-4 rounded-lg border-2 border-dashed border-slack-gray-300 hover:border-slack-purple hover:bg-slack-purple/5 transition-all text-center"
              >
                <Plus className="w-8 h-8 text-slack-gray-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-slack-gray-600">Create New Project</p>
              </button>
            </div>
          )}
        </motion.div>

        {/* New Project Form */}
        {showNewProject && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-organic mb-6"
          >
            <h2 className="text-lg font-semibold text-slack-gray-800 mb-4">Create New Project</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slack-gray-700 mb-2">
                  Project Name
                </label>
                <input
                  type="text"
                  className="input-organic w-full"
                  placeholder="e.g., Mobile App Redesign"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slack-gray-700 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  className="input-organic w-full h-20 resize-none"
                  placeholder="Brief description of the project..."
                  value={newProjectDescription}
                  onChange={(e) => setNewProjectDescription(e.target.value)}
                />
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={createNewProject}
                  className="btn-slack"
                >
                  Create Project
                </button>
                <button
                  onClick={() => {
                    setShowNewProject(false);
                    setNewProjectName('');
                    setNewProjectDescription('');
                  }}
                  className="btn-organic border-2 border-slack-gray-300 text-slack-gray-700 hover:bg-slack-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Upload Area */}
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="card-organic"
          >
            {!uploading && !uploadedImage && (
              <>
                <h2 className="text-lg font-semibold text-slack-gray-800 mb-4">Upload Design</h2>
                
                <div
                  className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-all ${
                    dragActive
                      ? 'border-slack-purple bg-slack-purple/5'
                      : 'border-slack-gray-300 hover:border-slack-gray-400'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/webp"
                    onChange={handleFileInput}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  
                  <div className="space-y-4">
                    <div className="w-16 h-16 mx-auto bg-slack-purple/10 rounded-full flex items-center justify-center">
                      <Upload className="w-8 h-8 text-slack-purple" />
                    </div>
                    <div>
                      <p className="text-lg font-medium text-slack-gray-800">
                        Drop your design here
                      </p>
                      <p className="text-slack-gray-600 mt-1">
                        or click to browse files
                      </p>
                    </div>
                    <div className="text-sm text-slack-gray-500">
                      <p>Supports PNG, JPEG, JPG, WebP</p>
                      <p>Maximum file size: 10MB</p>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Upload Progress */}
            {uploading && (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-slack-blue/10 rounded-full flex items-center justify-center">
                  <Upload className="w-8 h-8 text-slack-blue animate-bounce" />
                </div>
                <h3 className="text-lg font-medium text-slack-gray-800 mb-2">
                  Uploading and Analyzing...
                </h3>
                <p className="text-slack-gray-600 mb-4">
                  AI is analyzing your design for feedback
                </p>
                <div className="w-full bg-slack-gray-200 rounded-full h-2 mb-2">
                  <div
                    className="bg-slack-blue h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-sm text-slack-gray-500">{uploadProgress}% complete</p>
              </div>
            )}

            {/* Upload Success */}
            {uploadedImage && (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-medium text-slack-gray-800 mb-2">
                  Upload Successful!
                </h3>
                <p className="text-slack-gray-600 mb-4">
                  Found {uploadedImage.feedback?.length || 0} feedback items
                </p>
                <p className="text-sm text-slack-gray-500">
                  Redirecting to project page...
                </p>
              </div>
            )}

            {/* Error Display */}
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-4 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start"
              >
                <AlertCircle className="w-5 h-5 text-red-600 mr-3 mt-0.5" />
                <div>
                  <p className="text-red-800 font-medium">Upload Error</p>
                  <p className="text-red-600 text-sm mt-1">{error}</p>
                </div>
                <button
                  onClick={() => setError('')}
                  className="ml-auto text-red-400 hover:text-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default UploadPage;
