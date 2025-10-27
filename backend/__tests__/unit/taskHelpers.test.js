// __tests__/unit/taskHelpers.test.js
const {
  formatStats,
  formatTaskResponse,
  formatTasksResponse,
  calculateTotalTasks,
  calculateCompletionPercentage,
} = require('../../utils/taskHelpers');

describe('Task Helpers Unit Tests', () => {
  describe('formatStats', () => {
    it('should format stats correctly', () => {
      const result = formatStats(5, 3);
      
      expect(result).toEqual({
        todo: 5,
        completed: 3,
      });
    });

    it('should handle zero values', () => {
      const result = formatStats(0, 0);
      
      expect(result).toEqual({
        todo: 0,
        completed: 0,
      });
    });

    it('should handle large numbers', () => {
      const result = formatStats(999, 1000);
      
      expect(result).toEqual({
        todo: 999,
        completed: 1000,
      });
    });
  });

  describe('formatTaskResponse', () => {
    it('should format task response with stats', () => {
      const task = { id: 1, title: 'Test Task', isCompleted: false };
      const stats = { todo: 5, completed: 3 };
      
      const result = formatTaskResponse(task, stats);
      
      expect(result).toEqual({
        task: { id: 1, title: 'Test Task', isCompleted: false },
        stats: { todo: 5, completed: 3 },
      });
    });

    it('should handle null task', () => {
      const stats = { todo: 5, completed: 3 };
      
      const result = formatTaskResponse(null, stats);
      
      expect(result.task).toBeNull();
      expect(result.stats).toEqual(stats);
    });
  });

  describe('formatTasksResponse', () => {
    it('should format tasks list response with stats', () => {
      const tasks = [
        { id: 1, title: 'Task 1', isCompleted: false },
        { id: 2, title: 'Task 2', isCompleted: false },
      ];
      const stats = { todo: 2, completed: 0 };
      
      const result = formatTasksResponse(tasks, stats);
      
      expect(result).toEqual({
        tasks,
        stats,
      });
    });

    it('should handle empty tasks array', () => {
      const tasks = [];
      const stats = { todo: 0, completed: 0 };
      
      const result = formatTasksResponse(tasks, stats);
      
      expect(result.tasks).toEqual([]);
      expect(result.stats).toEqual(stats);
    });
  });

  describe('calculateTotalTasks', () => {
    it('should calculate total tasks correctly', () => {
      expect(calculateTotalTasks(5, 3)).toBe(8);
      expect(calculateTotalTasks(10, 20)).toBe(30);
      expect(calculateTotalTasks(0, 0)).toBe(0);
    });

    it('should handle zero values', () => {
      expect(calculateTotalTasks(5, 0)).toBe(5);
      expect(calculateTotalTasks(0, 3)).toBe(3);
    });

    it('should handle large numbers', () => {
      expect(calculateTotalTasks(999, 1001)).toBe(2000);
    });
  });

  describe('calculateCompletionPercentage', () => {
    it('should calculate completion percentage correctly', () => {
      expect(calculateCompletionPercentage(3, 10)).toBe(30);
      expect(calculateCompletionPercentage(5, 10)).toBe(50);
      expect(calculateCompletionPercentage(10, 10)).toBe(100);
    });

    it('should return 0 when total is 0', () => {
      expect(calculateCompletionPercentage(0, 0)).toBe(0);
    });

    it('should return 0 when completed is 0', () => {
      expect(calculateCompletionPercentage(0, 10)).toBe(0);
    });

    it('should round to nearest integer', () => {
      expect(calculateCompletionPercentage(1, 3)).toBe(33); // 33.33... rounds to 33
      expect(calculateCompletionPercentage(2, 3)).toBe(67); // 66.66... rounds to 67
    });

    it('should handle decimal results properly', () => {
      expect(calculateCompletionPercentage(1, 6)).toBe(17); // 16.66... rounds to 17
      expect(calculateCompletionPercentage(5, 6)).toBe(83); // 83.33... rounds to 83
    });
  });
});
