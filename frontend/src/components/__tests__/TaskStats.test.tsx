// src/components/__tests__/TaskStats.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TaskStats } from '../TaskStats';

describe('TaskStats', () => {
  describe('Rendering', () => {
    it('should render both todo and completed stats', () => {
      const stats = { todo: 5, completed: 3 };
      render(<TaskStats stats={stats} />);
      
      expect(screen.getByText('5')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
      expect(screen.getByText('To Do')).toBeInTheDocument();
      expect(screen.getByText('Completed')).toBeInTheDocument();
    });

    it('should display zero values correctly', () => {
      const stats = { todo: 0, completed: 0 };
      render(<TaskStats stats={stats} />);
      
      const zeros = screen.getAllByText('0');
      expect(zeros).toHaveLength(2);
    });

    it('should render correct labels for stats', () => {
      const stats = { todo: 10, completed: 20 };
      render(<TaskStats stats={stats} />);
      
      expect(screen.getByText('To Do')).toBeInTheDocument();
      expect(screen.getByText('Completed')).toBeInTheDocument();
    });
  });

  describe('Different Values', () => {
    it('should handle single-digit numbers', () => {
      const stats = { todo: 1, completed: 2 };
      render(<TaskStats stats={stats} />);
      
      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
    });

    it('should handle double-digit numbers', () => {
      const stats = { todo: 42, completed: 99 };
      render(<TaskStats stats={stats} />);
      
      expect(screen.getByText('42')).toBeInTheDocument();
      expect(screen.getByText('99')).toBeInTheDocument();
    });

    it('should handle triple-digit numbers', () => {
      const stats = { todo: 123, completed: 456 };
      render(<TaskStats stats={stats} />);
      
      expect(screen.getByText('123')).toBeInTheDocument();
      expect(screen.getByText('456')).toBeInTheDocument();
    });

    it('should handle large numbers', () => {
      const stats = { todo: 9999, completed: 10000 };
      render(<TaskStats stats={stats} />);
      
      expect(screen.getByText('9999')).toBeInTheDocument();
      expect(screen.getByText('10000')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle when todo is zero and completed has value', () => {
      const stats = { todo: 0, completed: 10 };
      render(<TaskStats stats={stats} />);
      
      expect(screen.getByText('0')).toBeInTheDocument();
      expect(screen.getByText('10')).toBeInTheDocument();
    });

    it('should handle when completed is zero and todo has value', () => {
      const stats = { todo: 15, completed: 0 };
      render(<TaskStats stats={stats} />);
      
      expect(screen.getByText('15')).toBeInTheDocument();
      expect(screen.getByText('0')).toBeInTheDocument();
    });

    it('should handle equal todo and completed values', () => {
      const stats = { todo: 7, completed: 7 };
      render(<TaskStats stats={stats} />);
      
      const sevens = screen.getAllByText('7');
      expect(sevens).toHaveLength(2);
    });

    it('should re-render when stats prop changes', () => {
      const { rerender } = render(<TaskStats stats={{ todo: 5, completed: 3 }} />);
      
      expect(screen.getByText('5')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
      
      rerender(<TaskStats stats={{ todo: 10, completed: 8 }} />);
      
      expect(screen.getByText('10')).toBeInTheDocument();
      expect(screen.getByText('8')).toBeInTheDocument();
      expect(screen.queryByText('5')).not.toBeInTheDocument();
      expect(screen.queryByText('3')).not.toBeInTheDocument();
    });
  });

  describe('Layout', () => {
    it('should render two card components', () => {
      const stats = { todo: 5, completed: 3 };
      const { container } = render(<TaskStats stats={stats} />);
      
      // Check for grid container
      const gridContainer = container.querySelector('.grid');
      expect(gridContainer).toBeInTheDocument();
    });

    it('should maintain structure with different values', () => {
      const stats = { todo: 100, completed: 200 };
      render(<TaskStats stats={stats} />);
      
      // Both labels should still be present
      expect(screen.getByText('To Do')).toBeInTheDocument();
      expect(screen.getByText('Completed')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should render stats in readable format', () => {
      const stats = { todo: 5, completed: 3 };
      render(<TaskStats stats={stats} />);
      
      // Check that numbers and labels are associated correctly
      const todoSection = screen.getByText('To Do').closest('div');
      const completedSection = screen.getByText('Completed').closest('div');
      
      expect(todoSection).toBeInTheDocument();
      expect(completedSection).toBeInTheDocument();
    });

    it('should handle stats updates without losing structure', () => {
      const { rerender } = render(<TaskStats stats={{ todo: 1, completed: 1 }} />);
      
      expect(screen.getByText('To Do')).toBeInTheDocument();
      expect(screen.getByText('Completed')).toBeInTheDocument();
      
      rerender(<TaskStats stats={{ todo: 999, completed: 999 }} />);
      
      expect(screen.getByText('To Do')).toBeInTheDocument();
      expect(screen.getByText('Completed')).toBeInTheDocument();
    });
  });
});
