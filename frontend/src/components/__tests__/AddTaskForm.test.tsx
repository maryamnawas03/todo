// src/components/__tests__/AddTaskForm.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AddTaskForm } from '../AddTaskForm';

describe('AddTaskForm', () => {
  const mockOnAddTask = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render the form with all elements', () => {
      render(<AddTaskForm onAddTask={mockOnAddTask} />);
      
      expect(screen.getByText('Add a Task')).toBeInTheDocument();
      expect(screen.getByText(/task title/i)).toBeInTheDocument();
      expect(screen.getByText(/description/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /add task/i })).toBeInTheDocument();
    });

    it('should render empty input fields initially', () => {
      render(<AddTaskForm onAddTask={mockOnAddTask} />);
      
      const titleInput = screen.getByPlaceholderText(/what needs to be done/i) as HTMLInputElement;
      const descInput = screen.getByPlaceholderText(/add more details/i) as HTMLTextAreaElement;
      
      expect(titleInput.value).toBe('');
      expect(descInput.value).toBe('');
    });

    it('should display correct placeholders', () => {
      render(<AddTaskForm onAddTask={mockOnAddTask} />);
      
      expect(screen.getByPlaceholderText('What needs to be done?')).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/add more details/i)).toBeInTheDocument();
    });
  });

  describe('Input Handling', () => {
    it('should update title input when typing', () => {
      render(<AddTaskForm onAddTask={mockOnAddTask} />);
      
      const titleInput = screen.getByPlaceholderText(/what needs to be done/i) as HTMLInputElement;
      fireEvent.change(titleInput, { target: { value: 'New Task' } });
      
      expect(titleInput.value).toBe('New Task');
    });

    it('should update description input when typing', () => {
      render(<AddTaskForm onAddTask={mockOnAddTask} />);
      
      const descInput = screen.getByPlaceholderText(/add more details/i) as HTMLTextAreaElement;
      fireEvent.change(descInput, { target: { value: 'Task description' } });
      
      expect(descInput.value).toBe('Task description');
    });

    it('should handle multiple character inputs', () => {
      render(<AddTaskForm onAddTask={mockOnAddTask} />);
      
      const titleInput = screen.getByPlaceholderText(/what needs to be done/i);
      
      fireEvent.change(titleInput, { target: { value: 'T' } });
      fireEvent.change(titleInput, { target: { value: 'Te' } });
      fireEvent.change(titleInput, { target: { value: 'Tes' } });
      fireEvent.change(titleInput, { target: { value: 'Test' } });
      
      expect((titleInput as HTMLInputElement).value).toBe('Test');
    });
  });

  describe('Form Submission', () => {
    it('should call onAddTask with title and description when button clicked', async () => {
      mockOnAddTask.mockResolvedValue(true);
      render(<AddTaskForm onAddTask={mockOnAddTask} />);
      
      const titleInput = screen.getByPlaceholderText(/what needs to be done/i);
      const descInput = screen.getByPlaceholderText(/add more details/i);
      
      fireEvent.change(titleInput, { target: { value: 'New Task' } });
      fireEvent.change(descInput, { target: { value: 'Task description' } });
      
      const addButton = screen.getByRole('button', { name: /add task/i });
      fireEvent.click(addButton);
      
      await waitFor(() => {
        expect(mockOnAddTask).toHaveBeenCalledTimes(1);
        expect(mockOnAddTask).toHaveBeenCalledWith('New Task', 'Task description');
      });
    });

    it('should call onAddTask when Enter key is pressed in title input', async () => {
      mockOnAddTask.mockResolvedValue(true);
      render(<AddTaskForm onAddTask={mockOnAddTask} />);
      
      const titleInput = screen.getByPlaceholderText(/what needs to be done/i);
      fireEvent.change(titleInput, { target: { value: 'Quick Task' } });
      fireEvent.keyPress(titleInput, { key: 'Enter', code: 'Enter', charCode: 13 });
      
      await waitFor(() => {
        expect(mockOnAddTask).toHaveBeenCalledWith('Quick Task', '');
      });
    });

    it('should clear inputs after successful submission', async () => {
      mockOnAddTask.mockResolvedValue(true);
      render(<AddTaskForm onAddTask={mockOnAddTask} />);
      
      const titleInput = screen.getByPlaceholderText(/what needs to be done/i) as HTMLInputElement;
      const descInput = screen.getByPlaceholderText(/add more details/i) as HTMLTextAreaElement;
      
      fireEvent.change(titleInput, { target: { value: 'Task to clear' } });
      fireEvent.change(descInput, { target: { value: 'Description to clear' } });
      
      const addButton = screen.getByRole('button', { name: /add task/i });
      fireEvent.click(addButton);
      
      await waitFor(() => {
        expect(titleInput.value).toBe('');
        expect(descInput.value).toBe('');
      });
    });

    it('should not clear inputs after failed submission', async () => {
      mockOnAddTask.mockResolvedValue(false);
      render(<AddTaskForm onAddTask={mockOnAddTask} />);
      
      const titleInput = screen.getByPlaceholderText(/what needs to be done/i) as HTMLInputElement;
      const descInput = screen.getByPlaceholderText(/add more details/i) as HTMLTextAreaElement;
      
      fireEvent.change(titleInput, { target: { value: 'Failed Task' } });
      fireEvent.change(descInput, { target: { value: 'Failed Description' } });
      
      const addButton = screen.getByRole('button', { name: /add task/i });
      fireEvent.click(addButton);
      
      await waitFor(() => {
        expect(titleInput.value).toBe('Failed Task');
        expect(descInput.value).toBe('Failed Description');
      });
    });

    it('should handle submission with only title', async () => {
      mockOnAddTask.mockResolvedValue(true);
      render(<AddTaskForm onAddTask={mockOnAddTask} />);
      
      const titleInput = screen.getByPlaceholderText(/what needs to be done/i);
      fireEvent.change(titleInput, { target: { value: 'Only Title' } });
      
      const addButton = screen.getByRole('button', { name: /add task/i });
      fireEvent.click(addButton);
      
      await waitFor(() => {
        expect(mockOnAddTask).toHaveBeenCalledWith('Only Title', '');
      });
    });

    it('should handle submission with empty title', async () => {
      mockOnAddTask.mockResolvedValue(false);
      render(<AddTaskForm onAddTask={mockOnAddTask} />);
      
      const addButton = screen.getByRole('button', { name: /add task/i });
      fireEvent.click(addButton);
      
      await waitFor(() => {
        expect(mockOnAddTask).toHaveBeenCalledWith('', '');
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle very long title input', () => {
      render(<AddTaskForm onAddTask={mockOnAddTask} />);
      
      const longTitle = 'A'.repeat(500);
      const titleInput = screen.getByPlaceholderText(/what needs to be done/i) as HTMLInputElement;
      
      fireEvent.change(titleInput, { target: { value: longTitle } });
      expect(titleInput.value).toBe(longTitle);
    });

    it('should handle very long description input', () => {
      render(<AddTaskForm onAddTask={mockOnAddTask} />);
      
      const longDesc = 'B'.repeat(1000);
      const descInput = screen.getByPlaceholderText(/add more details/i) as HTMLTextAreaElement;
      
      fireEvent.change(descInput, { target: { value: longDesc } });
      expect(descInput.value).toBe(longDesc);
    });

    it('should handle special characters in inputs', async () => {
      mockOnAddTask.mockResolvedValue(true);
      render(<AddTaskForm onAddTask={mockOnAddTask} />);
      
      const specialChars = '!@#$%^&*()_+-={}[]|:";\'<>?,./';
      const titleInput = screen.getByPlaceholderText(/what needs to be done/i);
      
      fireEvent.change(titleInput, { target: { value: specialChars } });
      
      const addButton = screen.getByRole('button', { name: /add task/i });
      fireEvent.click(addButton);
      
      await waitFor(() => {
        expect(mockOnAddTask).toHaveBeenCalledWith(specialChars, '');
      });
    });

    it('should handle whitespace-only inputs', async () => {
      mockOnAddTask.mockResolvedValue(false);
      render(<AddTaskForm onAddTask={mockOnAddTask} />);
      
      const titleInput = screen.getByPlaceholderText(/what needs to be done/i);
      fireEvent.change(titleInput, { target: { value: '   ' } });
      
      const addButton = screen.getByRole('button', { name: /add task/i });
      fireEvent.click(addButton);
      
      await waitFor(() => {
        expect(mockOnAddTask).toHaveBeenCalledWith('   ', '');
      });
    });
  });

  describe('Async Behavior', () => {
    it('should handle slow onAddTask promise resolution', async () => {
      const slowMock = jest.fn((): Promise<boolean> => 
        new Promise(resolve => setTimeout(() => resolve(true), 100))
      );
      
      render(<AddTaskForm onAddTask={slowMock} />);
      
      const titleInput = screen.getByPlaceholderText(/what needs to be done/i);
      fireEvent.change(titleInput, { target: { value: 'Slow Task' } });
      
      const addButton = screen.getByRole('button', { name: /add task/i });
      fireEvent.click(addButton);
      
      await waitFor(() => {
        expect(slowMock).toHaveBeenCalled();
      });
      
      await waitFor(() => {
        expect((titleInput as HTMLInputElement).value).toBe('');
      });
    });
  });
});
