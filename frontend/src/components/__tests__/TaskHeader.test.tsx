// src/components/__tests__/TaskHeader.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TaskHeader } from '../TaskHeader';

describe('TaskHeader', () => {
  describe('Rendering', () => {
    it('should render the app title "TaskFlow"', () => {
      render(<TaskHeader />);
      
      expect(screen.getByText('TaskFlow')).toBeInTheDocument();
    });

    it('should render the subtitle', () => {
      render(<TaskHeader />);
      
      expect(screen.getByText('Master your productivity, one task at a time')).toBeInTheDocument();
    });

    it('should display both title and subtitle', () => {
      render(<TaskHeader />);
      
      expect(screen.getByText('TaskFlow')).toBeInTheDocument();
      expect(screen.getByText(/master your productivity/i)).toBeInTheDocument();
    });

    it('should render heading as h1', () => {
      render(<TaskHeader />);
      
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toHaveTextContent('TaskFlow');
    });
  });

  describe('Content', () => {
    it('should have centered layout', () => {
      render(<TaskHeader />);
      
      const title = screen.getByText('TaskFlow');
      const subtitle = screen.getByText(/master your productivity/i);
      
      expect(title).toBeInTheDocument();
      expect(subtitle).toBeInTheDocument();
    });
  });

  describe('Snapshot', () => {
    it('should match snapshot', () => {
      const { asFragment } = render(<TaskHeader />);
      expect(asFragment()).toMatchSnapshot();
    });
  });
});
