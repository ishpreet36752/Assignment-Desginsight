import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  FolderOpen, 
  Image, 
  MessageSquare, 
  TrendingUp,
  Clock,
  Users,
  Filter,
  Search
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { projectAPI, Project } from '../lib/api';
import { SLACK_ROLE_CONFIG } from '../types/user-personas';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'archived' | 'completed'>('all');

  const userRole = user?.role as keyof typeof SLACK_ROLE_CONFIG;
  const roleConfig = userRole ? SLACK_ROLE_CONFIG[userRole] : null;

  useEffect(() => {
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
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || project.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const stats = {
    totalProjects: projects.length,
    activeProjects: projects.filter(p => p.status === 'active').length,
    completedProjects: projects.filter(p => p.status === 'completed').length,
    totalImages: 0, // This would come from API
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-organic w-16 h-16 rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-slack-gray-800 tracking-tight">
                Welcome back, {user?.name}
              </h1>
              <p className="text-lg text-slack-gray-600 mt-3 font-medium">
                {roleConfig?.label} • Ready to create amazing designs
              </p>
            </div>
            <Link
              to="/upload"
              className="btn-slack flex items-center"
            >
              <Plus className="w-5 h-5 mr-2" />
              New Project
            </Link>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 mb-12"
        >
          {[
            { label: 'Total Projects', value: stats.totalProjects, icon: FolderOpen, color: 'text-role-designer' },
            { label: 'Active Projects', value: stats.activeProjects, icon: TrendingUp, color: 'text-role-pm' },
            { label: 'Completed', value: stats.completedProjects, icon: Clock, color: 'text-role-reviewer' },
            { label: 'Team Members', value: 12, icon: Users, color: 'text-role-developer' },
          ].map((stat, index) => (
            <motion.div 
              key={stat.label} 
              className="card-organic group hover:shadow-lg transition-all duration-300"
              whileHover={{ y: -2 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-slack-gray-500 mb-2 tracking-wide uppercase">
                    {stat.label}
                  </p>
                  <p className="text-3xl font-bold text-slack-gray-800 mb-1">
                    {stat.value}
                  </p>
                </div>
                <div className={`p-4 rounded-2xl bg-gradient-to-br from-${stat.color.split('-')[1]}/5 to-${stat.color.split('-')[1]}/15 group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className={`w-7 h-7 ${stat.color} group-hover:rotate-12 transition-transform duration-300`} />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="flex flex-col lg:flex-row gap-6 mb-10"
        >
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slack-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search projects..."
              className="input-organic pl-10 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-slack-gray-400" />
            <select
              className="input-organic"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
            >
              <option value="all">All Projects</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </motion.div>

        {/* Projects Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          {filteredProjects.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-4 bg-slack-gray-100 rounded-full flex items-center justify-center">
                <FolderOpen className="w-12 h-12 text-slack-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-slack-gray-800 mb-2">
                {searchTerm ? 'No projects found' : 'No projects yet'}
              </h3>
              <p className="text-slack-gray-600 mb-6">
                {searchTerm 
                  ? 'Try adjusting your search terms'
                  : 'Get started by creating your first project'
                }
              </p>
              {!searchTerm && (
                <Link to="/upload" className="btn-slack">
                  <Plus className="w-5 h-5 mr-2" />
                  Create First Project
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1, duration: 0.6 }}
                  className="card-organic group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                >
                  <Link to={`/project/${project._id}`}>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-slack-gray-800 mb-2">
                          {project.name}
                        </h3>
                        <p className="text-sm text-slack-gray-600 mb-3">
                          {project.description || 'No description provided'}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        project.status === 'active' ? 'bg-green-100 text-green-800' :
                        project.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {project.status}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-slack-gray-500">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <Image className="w-4 h-4 mr-1" />
                          <span>0 images</span>
                        </div>
                        <div className="flex items-center">
                          <MessageSquare className="w-4 h-4 mr-1" />
                          <span>0 comments</span>
                        </div>
                      </div>
                      <span>
                        {new Date(project.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-16"
        >
          <h2 className="text-2xl font-bold text-slack-gray-800 mb-8 tracking-tight">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
              <Link
                to="/upload"
                className="card-organic hover:shadow-xl transition-all duration-300 group block"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-role-designer/10 to-role-designer/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Plus className="w-7 h-7 text-role-designer group-hover:rotate-90 transition-transform duration-300" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slack-gray-800 mb-2 group-hover:text-role-designer transition-colors duration-300">
                      Upload Design
                    </h3>
                    <p className="text-sm text-slack-gray-600 leading-relaxed">
                      Start a new design review
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
            
            <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
              <Link
                to="/dashboard"
                className="card-organic hover:shadow-xl transition-all duration-300 group block"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-role-reviewer/10 to-role-reviewer/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <MessageSquare className="w-7 h-7 text-role-reviewer group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slack-gray-800 mb-2 group-hover:text-role-reviewer transition-colors duration-300">
                      Review Feedback
                    </h3>
                    <p className="text-sm text-slack-gray-600 leading-relaxed">
                      Check pending reviews
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
            
            <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
              <Link
                to="/dashboard"
                className="card-organic hover:shadow-xl transition-all duration-300 group block"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-role-pm/10 to-role-pm/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <TrendingUp className="w-7 h-7 text-role-pm group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slack-gray-800 mb-2 group-hover:text-role-pm transition-colors duration-300">
                      View Analytics
                    </h3>
                    <p className="text-sm text-slack-gray-600 leading-relaxed">
                      Track design progress
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardPage;
