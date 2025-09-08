import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import FeedbackPanel from '../../components/FeedbackPanel';
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

// Mock feedback data
const mockFeedback = {
  _id: 'feedback-1',
  imageId: 'image-1',
  projectId: 'project-1',
  category: 'visualHierarchy',
  severity: 'medium',
  title: 'Test Feedback',
  description: 'This is a test feedback item',
  coordinates: { x: 100, y: 200 },
  targetRoles: ['designer'],
  author: 'ai-system',
  createdAt: new Date().toISOString()
};

// Mock comments data
const mockComments = [
  {
    _id: 'comment-1',
    feedbackId: 'feedback-1',
    author: 'Test User',
    content: 'This is a test comment',
    status: 'active' as const,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: 'comment-2',
    feedbackId: 'feedback-1',
    parentCommentId: 'comment-1',
    author: 'Another User',
    content: 'This is a reply',
    status: 'active' as const,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
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

describe('FeedbackPanel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock API responses
    mockedApi.feedbackAPI.getComments.mockResolvedValue({
      success: true,
      comments: mockComments
    });
    
    mockedApi.feedbackAPI.addComment.mockResolvedValue({
      success: true,
      comment: {
        _id: 'new-comment',
        feedbackId: 'feedback-1',
        author: 'Test User',
        content: 'New comment',
        status: 'active' as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    });
  });

  it('renders feedback details correctly', () => {
    renderWithProviders(
      <FeedbackPanel 
        selectedFeedback={mockFeedback}
        onClose={jest.fn()}
      />
    );

    expect(screen.getByText('Test Feedback')).toBeInTheDocument();
    expect(screen.getByText('This is a test feedback item')).toBeInTheDocument();
  });

  it('displays comments when available', async () => {
    renderWithProviders(
      <FeedbackPanel 
        selectedFeedback={mockFeedback}
        onClose={jest.fn()}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('This is a test comment')).toBeInTheDocument();
      expect(screen.getByText('This is a reply')).toBeInTheDocument();
    });
  });

  it('allows adding new comments', async () => {
    renderWithProviders(
      <FeedbackPanel 
        selectedFeedback={mockFeedback}
        onClose={jest.fn()}
      />
    );

    const commentInput = screen.getByPlaceholderText('Add a comment...');
    const sendButton = screen.getByRole('button', { name: /send/i });

    fireEvent.change(commentInput, { target: { value: 'New comment' } });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(mockedApi.feedbackAPI.addComment).toHaveBeenCalledWith(
        'feedback-1',
        'New comment',
        undefined,
        'Test User'
      );
    });
  });

  it('handles nested replies correctly', async () => {
    renderWithProviders(
      <FeedbackPanel 
        selectedFeedback={mockFeedback}
        onClose={jest.fn()}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('This is a test comment')).toBeInTheDocument();
    });

    // Find and click reply button
    const replyButtons = screen.getAllByText('Reply');
    fireEvent.click(replyButtons[0]);

    // Check if reply input appears
    const replyInput = screen.getByPlaceholderText('Add a comment...');
    expect(replyInput).toBeInTheDocument();

    // Add reply
    fireEvent.change(replyInput, { target: { value: 'This is a reply' } });
    const sendButton = screen.getByRole('button', { name: /send/i });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(mockedApi.feedbackAPI.addComment).toHaveBeenCalledWith(
        'feedback-1',
        'This is a reply',
        'comment-1',
        'Test User'
      );
    });
  });

  it('displays empty state when no comments', async () => {
    mockedApi.feedbackAPI.getComments.mockResolvedValue({
      success: true,
      comments: []
    });

    renderWithProviders(
      <FeedbackPanel 
        selectedFeedback={mockFeedback}
        onClose={jest.fn()}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('No comments yet')).toBeInTheDocument();
      expect(screen.getByText('Start the discussion!')).toBeInTheDocument();
    });
  });

  it('handles API errors gracefully', async () => {
    mockedApi.feedbackAPI.getComments.mockRejectedValue(new Error('API Error'));

    renderWithProviders(
      <FeedbackPanel 
        selectedFeedback={mockFeedback}
        onClose={jest.fn()}
      />
    );

    // Should not crash and should show empty state
    await waitFor(() => {
      expect(screen.getByText('No comments yet')).toBeInTheDocument();
    });
  });

  it('shows comment count in header', async () => {
    renderWithProviders(
      <FeedbackPanel 
        selectedFeedback={mockFeedback}
        onClose={jest.fn()}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Discussion (2)')).toBeInTheDocument();
    });
  });

  it('allows closing the panel', () => {
    const onCloseMock = jest.fn();
    renderWithProviders(
      <FeedbackPanel 
        selectedFeedback={mockFeedback}
        onClose={onCloseMock}
      />
    );

    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);

    expect(onCloseMock).toHaveBeenCalled();
  });
});
