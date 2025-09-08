// API client for DesignSight backend integration
// Connects to the existing Express.js backend

import axios, { type AxiosInstance, type AxiosResponse } from 'axios';

// Types for API responses
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'designer' | 'reviewer' | 'productManager' | 'developer';
  lastLogin?: string;
}

export interface Project {
  _id: string;
  name: string;
  description?: string;
  owner: string;
  status: 'active' | 'archived' | 'completed';
  settings: {
    aiProvider: string;
    analysisCategories: {
      accessibility: boolean;
      visualHierarchy: boolean;
      contentCopy: boolean;
      uxPatterns: boolean;
    };
  };
  createdAt: string;
  updatedAt: string;
}

export interface Image {
  _id: string;
  projectId: string;
  filename: string;
  originalName: string;
  url: string;
  mimeType: string;
  size: number;
  dimensions: {
    width: number;
    height: number;
  };
  metadata: {
    uploadedBy: string;
    uploadSource: string;
    processingStatus: string;
    aiAnalysisStatus: string;
  };
  aiAnalysis?: {
    provider: string;
    model: string;
    analysisId: string;
    completedAt: string;
    error?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Feedback {
  _id: string;
  imageId: string;
  projectId: string;
  category: 'accessibility' | 'visualHierarchy' | 'contentCopy' | 'uxPatterns' | 'general';
  severity: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  recommendation: string;
  coordinates: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  targetRoles: string[];
  source: 'ai' | 'human';
  author: string;
  status: 'active' | 'resolved' | 'dismissed';
  tags: string[];
  aiMetadata?: {
    provider: string;
    model: string;
    confidence: number;
    analysisId: string;
    timestamp: string;
    error?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  _id: string;
  feedbackId: string;
  parentCommentId?: string;
  author: string;
  content: string;
  status: 'active' | 'deleted' | 'edited';
  editedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
  user: User;
}

export interface UploadResponse {
  success: boolean;
  image: Image;
  feedback: Feedback[];
}

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 30000,
  withCredentials: true, // For cookie-based auth
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.success) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },

  register: async (name: string, email: string, password: string, role: string): Promise<LoginResponse> => {
    const response = await api.post('/auth/register', { name, email, password, role });
    if (response.data.success) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
    localStorage.removeItem('token');
  },

  getProfile: async (): Promise<User> => {
    const response = await api.get('/auth/me');
    return response.data.user;
  },

  updateProfile: async (updates: Partial<User>): Promise<User> => {
    const response = await api.put('/auth/profile', updates);
    return response.data.user;
  }
};

// Projects API
export const projectAPI = {
  createProject: async (name: string, description?: string, settings?: any): Promise<{ success: boolean; project: Project }> => {
    const response = await api.post('/projects', { name, description, settings });
    return response.data;
  },

  getProjects: async (): Promise<{ success: boolean; projects: Project[] }> => {
    const response = await api.get('/projects');
    return response.data;
  },

  getProject: async (id: string): Promise<{ success: boolean; project: Project }> => {
    const response = await api.get(`/projects/${id}`);
    return response.data;
  },

  updateProject: async (id: string, updates: Partial<Project>): Promise<{ success: boolean; project: Project }> => {
    const response = await api.put(`/projects/${id}`, updates);
    return response.data;
  },

  deleteProject: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete(`/projects/${id}`);
    return response.data;
  }
};

// Images API
export const imageAPI = {
  uploadImage: async (projectId: string, formData: FormData, onProgress?: (progressEvent: any) => void): Promise<{ success: boolean; image: any; feedback: any[] }> => {
    const response = await api.post(`/images/upload/${projectId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: onProgress,
    });
    return response.data;
  },

  getImage: async (id: string): Promise<{ success: boolean; image: Image; feedback: Feedback[] }> => {
    const response = await api.get(`/images/${id}`);
    return response.data;
  },

  getImagesByProject: async (projectId: string): Promise<{ success: boolean; images: Image[] }> => {
    const response = await api.get(`/images/project/${projectId}`);
    return response.data;
  },

  deleteImage: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete(`/images/${id}`);
    return response.data;
  }
};

// Feedback API
export const feedbackAPI = {
  getFeedbackForImage: async (imageId: string, params?: { role?: string; severity?: string; category?: string }): Promise<{ success: boolean; feedback: Feedback[] }> => {
    const queryParams = new URLSearchParams();
    if (params?.role) queryParams.append('role', params.role);
    if (params?.severity) queryParams.append('severity', params.severity);
    if (params?.category) queryParams.append('category', params.category);
    
    const response = await api.get(`/feedback/${imageId}?${queryParams.toString()}`);
    return response.data;
  },

  updateFeedback: async (id: string, updates: Partial<Feedback>): Promise<{ success: boolean; feedback: Feedback }> => {
    const response = await api.put(`/feedback/${id}`, updates);
    return response.data;
  },

  addComment: async (feedbackId: string, content: string, parentCommentId?: string, author?: string): Promise<{ success: boolean; comment: Comment }> => {
    const response = await api.post(`/feedback/${feedbackId}/comments`, {
      content,
      author: author || 'current-user',
      parentCommentId
    });
    return response.data;
  },

  getComments: async (feedbackId: string): Promise<{ success: boolean; comments: Comment[] }> => {
    const response = await api.get(`/feedback/${feedbackId}/comments`);
    return response.data;
  },

  updateComment: async (commentId: string, text: string): Promise<{ success: boolean; comment: Comment }> => {
    const response = await api.put(`/feedback/comments/${commentId}`, { text });
    return response.data;
  },

  deleteComment: async (commentId: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete(`/feedback/comments/${commentId}`);
    return response.data;
  }
};

// Export the main API instance for custom requests
export default api;
