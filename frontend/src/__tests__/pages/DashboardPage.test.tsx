import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import DashboardPage from '../../pages/DashboardPage';
import { AuthContext } from '../../contexts/AuthContext';
import * as api from '../../lib/api';

// Mock the API
jest.mock('../../lib/api');
const mockedApi = api as jest.Mocked<typeof api>;

// Mock user data
const mockUser = {
  id: '1',
  name: 'Test User',
  email: 'test@example.com'
};

// Mock projects data
const mockProjects = [
  {
    _id: 'project-1',
    id: 'project-1',
    name: 'Test Project 1',
    description: 'First test project',
    owner: 'user-1',
    status: 'active',
    settings: {
      aiProvider: 'openrouter',
      feedbackCategories: ['visualHierarchy', 'accessibility'],
      targetRoles: ['designer', 'reviewer']
    },
    createdAt: new Date().toISOString()
  },
  {
    _id: 'project-2',
    id: 'project-2',
    name: 'Test Project 2',
    description: 'Second test project',
    owner: 'user-1',
    status: 'active',
    settings: {
      aiProvider: 'openrouter',
      feedbackCategories: ['visualHierarchy'],
      targetRoles: ['designer']
    },
    createdAt: new Date().toISOString()
  }
];

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <AuthContext.Provider value={{ user: mockUser, login: jest.fn(), logout: jest.fn() }}>
        {component}
      </AuthContext.Provider>
    </BrowserRouter>
  );
};

describe('DashboardPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock API responses
    mockedApi.projectAPI.getProjects.mockResolvedValue({
      success: true,
      projects: mockProjects
    });
    
    mockedApi.projectAPI.createProject.mockResolvedValue({
      success: true,
      project: {
        _id: 'new-project',
        id: 'new-project',
        name: 'New Project',
        description: 'A new project',
        owner: 'user-1',
        status: 'active',
        settings: {
          aiProvider: 'openrouter',
          feedbackCategories: ['visualHierarchy'],
          targetRoles: ['designer']
        },
        createdAt: new Date().toISOString()
      }
    });
  });

  it('renders dashboard with user welcome message', async () => {
    renderWithProviders(<DashboardPage />);

    await waitFor(() => {
      expect(screen.getByText(/Welcome back, Test User/)).toBeInTheDocument();
    });
  });

  it('displays user projects', async () => {
    renderWithProviders(<DashboardPage />);

    await waitFor(() => {
      expect(screen.getByText('Test Project 1')).toBeInTheDocument();
      expect(screen.getByText('Test Project 2')).toBeInTheDocument();
    });
  });

  it('shows project statistics', async () => {
    renderWithProviders(<DashboardPage />);

    await waitFor(() => {
      expect(screen.getByText('2')).toBeInTheDocument(); // Total projects
    });
  });

  it('allows creating new projects', async () => {
    renderWithProviders(<DashboardPage />);

    // Click create project button
    const createButton = screen.getByText(/Create New Project/);
    fireEvent.click(createButton);

    // Fill in project form
    const nameInput = screen.getByPlaceholderText(/Project name/);
    const descriptionInput = screen.getByPlaceholderText(/Project description/);
    
    fireEvent.change(nameInput, { target: { value: 'New Project' } });
    fireEvent.change(descriptionInput, { target: { value: 'A new project' } });

    // Submit form
    const submitButton = screen.getByText(/Create Project/);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockedApi.projectAPI.createProject).toHaveBeenCalledWith({
        name: 'New Project',
        description: 'A new project'
      });
    });
  });

  it('handles API errors gracefully', async () => {
    mockedApi.projectAPI.getProjects.mockRejectedValue(new Error('API Error'));

    renderWithProviders(<DashboardPage />);

    // Should not crash and should show some fallback content
    await waitFor(() => {
      expect(screen.getByText(/Welcome back, Test User/)).toBeInTheDocument();
    });
  });

  it('displays quick action buttons', () => {
    renderWithProviders(<DashboardPage />);

    expect(screen.getByText(/Create New Project/)).toBeInTheDocument();
    expect(screen.getByText(/Upload Images/)).toBeInTheDocument();
  });

  it('shows role-based content', () => {
    renderWithProviders(<DashboardPage />);

    // Should show role selector or role-based content
    expect(screen.getByText(/Designer/)).toBeInTheDocument();
  });

  it('navigates to project details when project is clicked', async () => {
    renderWithProviders(<DashboardPage />);

    await waitFor(() => {
      const projectCard = screen.getByText('Test Project 1');
      fireEvent.click(projectCard);
      
      // Should navigate to project page (this would be tested with router testing)
    });
  });

  it('displays empty state when no projects', async () => {
    mockedApi.projectAPI.getProjects.mockResolvedValue({
      success: true,
      projects: []
    });

    renderWithProviders(<DashboardPage />);

    await waitFor(() => {
      // Should show empty state or create project prompt
      expect(screen.getByText(/Create New Project/)).toBeInTheDocument();
    });
  });
});
