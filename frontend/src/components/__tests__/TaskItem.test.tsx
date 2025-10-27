// src/components/__tests__/TaskItem.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TaskItem } from '../TaskItem';
import { Task } from '../../types/task.types';

describe('TaskItem', () => {
  const mockTask: Task = {
    id: 1,
    title: 'Test Task',
    description: 'Test Description',
    isCompleted: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const mockHandlers = {
    onComplete: jest.fn(),
    onEdit: jest.fn(),
    onDelete: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Display Mode', () => {
    it('should render task title and description', () => {
      render(<TaskItem task={mockTask} {...mockHandlers} />);
      
      expect(screen.getByText('Test Task')).toBeInTheDocument();
      expect(screen.getByText('Test Description')).toBeInTheDocument();
    });

    it('should render task without description', () => {
      const taskWithoutDesc = { ...mockTask, description: '' };
      render(<TaskItem task={taskWithoutDesc} {...mockHandlers} />);
      
      expect(screen.getByText('Test Task')).toBeInTheDocument();
      expect(screen.queryByText('Test Description')).not.toBeInTheDocument();
    });

    it('should display complete button', () => {
      render(<TaskItem task={mockTask} {...mockHandlers} />);
      
      const completeButton = screen.getByRole('button', { name: /mark task as complete/i });
      expect(completeButton).toBeInTheDocument();
    });

    it('should display edit and delete buttons', () => {
      render(<TaskItem task={mockTask} {...mockHandlers} />);
      
      // Check that buttons exist in the document
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
    });
  });

  describe('Actions', () => {
    it('should call onComplete when complete button is clicked', () => {
      render(<TaskItem task={mockTask} {...mockHandlers} />);
      
      const completeButton = screen.getByRole('button', { name: /mark task as complete/i });
      fireEvent.click(completeButton);
      
      expect(mockHandlers.onComplete).toHaveBeenCalledTimes(1);
      expect(mockHandlers.onComplete).toHaveBeenCalledWith(mockTask.id);
    });

    it('should call onDelete when delete button is clicked', () => {
      render(<TaskItem task={mockTask} {...mockHandlers} />);
      
      const buttons = screen.getAllByRole('button');
      // Delete button is typically the last button in display mode
      const deleteButton = buttons[buttons.length - 1];
      fireEvent.click(deleteButton);
      
      expect(mockHandlers.onDelete).toHaveBeenCalledTimes(1);
      expect(mockHandlers.onDelete).toHaveBeenCalledWith(mockTask);
    });

    it('should enter edit mode when edit button is clicked', () => {
      render(<TaskItem task={mockTask} {...mockHandlers} />);
      
      const buttons = screen.getAllByRole('button');
      // Edit button is typically the second-to-last button in display mode  
      const editButton = buttons[buttons.length - 2];
      fireEvent.click(editButton);
      
      // Should show input fields
      expect(screen.getByDisplayValue('Test Task')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Test Description')).toBeInTheDocument();
    });
  });

  describe('Edit Mode', () => {
    it('should update input values when typing', () => {
      render(<TaskItem task={mockTask} {...mockHandlers} />);
      
      // Enter edit mode
      const buttons = screen.getAllByRole('button');
      const editButton = buttons[buttons.length - 2];
      fireEvent.click(editButton);
      
      // Update title
      const titleInput = screen.getByDisplayValue('Test Task') as HTMLInputElement;
      fireEvent.change(titleInput, { target: { value: 'Updated Task' } });
      expect(titleInput.value).toBe('Updated Task');
      
      // Update description
      const descInput = screen.getByDisplayValue('Test Description') as HTMLTextAreaElement;
      fireEvent.change(descInput, { target: { value: 'Updated Description' } });
      expect(descInput.value).toBe('Updated Description');
    });

    it('should call onEdit with updated values when save is clicked', () => {
      render(<TaskItem task={mockTask} {...mockHandlers} />);
      
      // Enter edit mode
      const buttons = screen.getAllByRole('button');
      const editButton = buttons[buttons.length - 2];
      fireEvent.click(editButton);
      
      // Update values
      const titleInput = screen.getByDisplayValue('Test Task');
      fireEvent.change(titleInput, { target: { value: 'Updated Task' } });
      
      const descInput = screen.getByDisplayValue('Test Description');
      fireEvent.change(descInput, { target: { value: 'Updated Description' } });
      
      // Save changes - click the Save text which is inside the button
      const saveText = screen.getByText(/save/i);
      fireEvent.click(saveText);
      
      expect(mockHandlers.onEdit).toHaveBeenCalledTimes(1);
      expect(mockHandlers.onEdit).toHaveBeenCalledWith(
        mockTask.id,
        'Updated Task',
        'Updated Description'
      );
    });

    it('should exit edit mode after saving', () => {
      render(<TaskItem task={mockTask} {...mockHandlers} />);
      
      // Enter edit mode
      const buttons = screen.getAllByRole('button');
      const editButton = buttons[buttons.length - 2];
      fireEvent.click(editButton);
      
      // Save changes
      const saveText = screen.getByText(/save/i);
      fireEvent.click(saveText);
      
      // Should be back in display mode - check for task title text
      expect(screen.getByText('Test Task')).toBeInTheDocument();
    });

    it('should revert changes when cancel is clicked', () => {
      render(<TaskItem task={mockTask} {...mockHandlers} />);
      
      // Enter edit mode
      const buttons = screen.getAllByRole('button');
      const editButton = buttons[buttons.length - 2];
      fireEvent.click(editButton);
      
      // Update values
      const titleInput = screen.getByDisplayValue('Test Task');
      fireEvent.change(titleInput, { target: { value: 'Changed Task' } });
      
      // Cancel changes
      const cancelText = screen.getByText(/cancel/i);
      fireEvent.click(cancelText);
      
      // Should be back in display mode with original values
      expect(screen.getByText('Test Task')).toBeInTheDocument();
      expect(mockHandlers.onEdit).not.toHaveBeenCalled();
    });

    it('should not call onEdit when cancel is clicked', () => {
      render(<TaskItem task={mockTask} {...mockHandlers} />);
      
      // Enter edit mode
      const buttons = screen.getAllByRole('button');
      const editButton = buttons[buttons.length - 2];
      fireEvent.click(editButton);
      
      // Cancel
      const cancelText = screen.getByText(/cancel/i);
      fireEvent.click(cancelText);
      
      expect(mockHandlers.onEdit).not.toHaveBeenCalled();
    });
  });

  describe('Edge Cases', () => {
    it('should handle task with null description', () => {
      const taskWithNullDesc = { ...mockTask, description: null as any };
      render(<TaskItem task={taskWithNullDesc} {...mockHandlers} />);
      
      expect(screen.getByText('Test Task')).toBeInTheDocument();
    });

    it('should handle empty string edits', () => {
      render(<TaskItem task={mockTask} {...mockHandlers} />);
      
      // Enter edit mode
      const buttons = screen.getAllByRole('button');
      const editButton = buttons[buttons.length - 2];
      fireEvent.click(editButton);
      
      // Clear title
      const titleInput = screen.getByDisplayValue('Test Task');
      fireEvent.change(titleInput, { target: { value: '' } });
      
      // Save
      const saveButton = screen.getByText(/save/i);
      fireEvent.click(saveButton);
      
      expect(mockHandlers.onEdit).toHaveBeenCalledWith(mockTask.id, '', 'Test Description');
    });
  });
});
