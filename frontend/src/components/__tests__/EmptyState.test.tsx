// src/components/__tests__/EmptyState.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { EmptyState } from '../EmptyState';

describe('EmptyState', () => {
  describe('Rendering', () => {
    it('should render "No tasks yet" heading', () => {
      render(<EmptyState />);
      
      expect(screen.getByText('No tasks yet')).toBeInTheDocument();
    });

    it('should render instructional message', () => {
      render(<EmptyState />);
      
      expect(screen.getByText('Create your first task to get started')).toBeInTheDocument();
    });

    it('should display both heading and description', () => {
      render(<EmptyState />);
      
      expect(screen.getByText('No tasks yet')).toBeInTheDocument();
      expect(screen.getByText(/create your first task/i)).toBeInTheDocument();
    });

    it('should render heading as h3', () => {
      render(<EmptyState />);
      
      const heading = screen.getByRole('heading', { level: 3 });
      expect(heading).toHaveTextContent('No tasks yet');
    });
  });

  describe('Content', () => {
    it('should provide encouraging message to create tasks', () => {
      render(<EmptyState />);
      
      const message = screen.getByText(/create your first task/i);
      expect(message).toBeVisible();
    });

    it('should be displayed when task list is empty', () => {
      render(<EmptyState />);
      
      expect(screen.getByText('No tasks yet')).toBeVisible();
      expect(screen.getByText('Create your first task to get started')).toBeVisible();
    });
  });

  describe('Snapshot', () => {
    it('should match snapshot', () => {
      const { asFragment } = render(<EmptyState />);
      expect(asFragment()).toMatchSnapshot();
    });
  });
});
