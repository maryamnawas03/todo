// __tests__/unit/validators.test.js
const {
  isValidTitle,
  isValidId,
  isValidStatus,
  sanitizeTaskData,
} = require('../../utils/validators');

describe('Validators Unit Tests', () => {
  describe('isValidTitle', () => {
    it('should return true for valid titles', () => {
      expect(isValidTitle('Valid Title')).toBe(true);
      expect(isValidTitle('Task 123')).toBe(true);
      expect(isValidTitle('A')).toBe(true);
      expect(isValidTitle('Task-with-dashes')).toBe(true);
      expect(isValidTitle('Task_with_underscores')).toBe(true);
    });

    it('should return false for empty or whitespace titles', () => {
      expect(isValidTitle('')).toBe(false);
      expect(isValidTitle('   ')).toBe(false);
      expect(isValidTitle('\t')).toBe(false);
      expect(isValidTitle('\n')).toBe(false);
    });

    it('should return false for non-string values', () => {
      expect(isValidTitle(null)).toBe(false);
      expect(isValidTitle(undefined)).toBe(false);
      expect(isValidTitle(123)).toBe(false);
      expect(isValidTitle({})).toBe(false);
      expect(isValidTitle([])).toBe(false);
    });

    it('should trim whitespace when validating', () => {
      expect(isValidTitle('  Valid  ')).toBe(true);
      expect(isValidTitle('\tValid\t')).toBe(true);
    });
  });

  describe('isValidId', () => {
    it('should return true for valid numeric IDs', () => {
      expect(isValidId(1)).toBe(true);
      expect(isValidId('1')).toBe(true);
      expect(isValidId(123)).toBe(true);
      expect(isValidId('123')).toBe(true);
      expect(isValidId(999999)).toBe(true);
    });

    it('should return false for invalid IDs', () => {
      expect(isValidId('abc')).toBe(false);
      expect(isValidId('null')).toBe(false);
      expect(isValidId('undefined')).toBe(false);
      expect(isValidId('')).toBe(false);
    });

    it('should return false for zero and negative numbers', () => {
      expect(isValidId(0)).toBe(false);
      expect(isValidId(-1)).toBe(false);
      expect(isValidId('-5')).toBe(false);
    });

    it('should return false for decimal numbers', () => {
      expect(isValidId(12.5)).toBe(false);
      expect(isValidId('12.5')).toBe(false);
    });

    it('should return false for non-numeric values', () => {
      expect(isValidId(null)).toBe(false);
      expect(isValidId(undefined)).toBe(false);
      expect(isValidId({})).toBe(false);
      expect(isValidId([])).toBe(false);
    });
  });

  describe('isValidStatus', () => {
    it('should return true for boolean values', () => {
      expect(isValidStatus(true)).toBe(true);
      expect(isValidStatus(false)).toBe(true);
    });

    it('should return false for non-boolean values', () => {
      expect(isValidStatus('true')).toBe(false);
      expect(isValidStatus('false')).toBe(false);
      expect(isValidStatus(1)).toBe(false);
      expect(isValidStatus(0)).toBe(false);
      expect(isValidStatus(null)).toBe(false);
      expect(isValidStatus(undefined)).toBe(false);
      expect(isValidStatus({})).toBe(false);
      expect(isValidStatus([])).toBe(false);
    });
  });

  describe('sanitizeTaskData', () => {
    it('should trim whitespace from title and description', () => {
      const data = {
        title: '  Task Title  ',
        description: '  Task Description  ',
      };
      const result = sanitizeTaskData(data);
      
      expect(result.title).toBe('Task Title');
      expect(result.description).toBe('Task Description');
    });

    it('should set empty string for missing description', () => {
      const data = {
        title: 'Task Title',
      };
      const result = sanitizeTaskData(data);
      
      expect(result.title).toBe('Task Title');
      expect(result.description).toBe('');
    });

    it('should default isCompleted to false', () => {
      const data = {
        title: 'Task Title',
      };
      const result = sanitizeTaskData(data);
      
      expect(result.isCompleted).toBe(false);
    });

    it('should set isCompleted to true only if explicitly true', () => {
      const data1 = {
        title: 'Task Title',
        isCompleted: true,
      };
      const result1 = sanitizeTaskData(data1);
      expect(result1.isCompleted).toBe(true);

      const data2 = {
        title: 'Task Title',
        isCompleted: 'true',
      };
      const result2 = sanitizeTaskData(data2);
      expect(result2.isCompleted).toBe(false);

      const data3 = {
        title: 'Task Title',
        isCompleted: 1,
      };
      const result3 = sanitizeTaskData(data3);
      expect(result3.isCompleted).toBe(false);
    });

    it('should handle empty data gracefully', () => {
      const result = sanitizeTaskData({});
      
      expect(result.title).toBe('');
      expect(result.description).toBe('');
      expect(result.isCompleted).toBe(false);
    });
  });
});
