// utils/taskHelpers.js
// Helper functions for task operations

/**
 * Formats stats response
 * @param {number} todoCount - Number of todo tasks
 * @param {number} completedCount - Number of completed tasks
 * @returns {Object} - Formatted stats object
 */
const formatStats = (todoCount, completedCount) => {
  return {
    todo: todoCount,
    completed: completedCount,
  };
};

/**
 * Formats task response with stats
 * @param {Object} task - Task object
 * @param {Object} stats - Stats object
 * @returns {Object} - Formatted response
 */
const formatTaskResponse = (task, stats) => {
  return {
    task,
    stats,
  };
};

/**
 * Formats tasks list response with stats
 * @param {Array} tasks - Array of task objects
 * @param {Object} stats - Stats object
 * @returns {Object} - Formatted response
 */
const formatTasksResponse = (tasks, stats) => {
  return {
    tasks,
    stats,
  };
};

/**
 * Calculates total tasks
 * @param {number} todoCount - Number of todo tasks
 * @param {number} completedCount - Number of completed tasks
 * @returns {number} - Total number of tasks
 */
const calculateTotalTasks = (todoCount, completedCount) => {
  return todoCount + completedCount;
};

/**
 * Calculates completion percentage
 * @param {number} completedCount - Number of completed tasks
 * @param {number} totalCount - Total number of tasks
 * @returns {number} - Completion percentage (0-100)
 */
const calculateCompletionPercentage = (completedCount, totalCount) => {
  if (totalCount === 0) return 0;
  return Math.round((completedCount / totalCount) * 100);
};

module.exports = {
  formatStats,
  formatTaskResponse,
  formatTasksResponse,
  calculateTotalTasks,
  calculateCompletionPercentage,
};
