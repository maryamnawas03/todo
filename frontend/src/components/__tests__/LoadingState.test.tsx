// src/components/__tests__/LoadingState.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { LoadingState } from '../LoadingState';

describe('LoadingState', () => {
  describe('Rendering', () => {
    it('should render "Loading tasks..." message', () => {
      render(<LoadingState />);
      
      expect(screen.getByText('Loading tasks...')).toBeInTheDocument();
    });

    it('should be visible when rendered', () => {
      render(<LoadingState />);
      
      const loadingText = screen.getByText('Loading tasks...');
      expect(loadingText).toBeVisible();
    });

    it('should display loading indicator', () => {
      render(<LoadingState />);
      
      expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });
  });

  describe('Content', () => {
    it('should have accessible loading indication', () => {
      render(<LoadingState />);
      
      const loadingMessage = screen.getByText('Loading tasks...');
      expect(loadingMessage).toBeInTheDocument();
    });

    it('should show appropriate message while fetching tasks', () => {
      render(<LoadingState />);
      
      expect(screen.getByText(/loading tasks/i)).toBeVisible();
    });
  });

  describe('Snapshot', () => {
    it('should match snapshot', () => {
      const { asFragment } = render(<LoadingState />);
      expect(asFragment()).toMatchSnapshot();
    });
  });
});
