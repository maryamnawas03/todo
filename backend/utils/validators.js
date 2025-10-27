// utils/validators.js
// Pure validation functions for unit testing

/**
 * Validates if a title is valid
 * @param {string} title - The title to validate
 * @returns {boolean} - True if valid, false otherwise
 */
const isValidTitle = (title) => {
  return typeof title === 'string' && title.trim() !== '';
};

/**
 * Validates if an ID is valid
 * @param {string|number} id - The ID to validate
 * @returns {boolean} - True if valid, false otherwise
 */
const isValidId = (id) => {
  const numId = Number(id);
  return !isNaN(numId) && numId > 0 && id !== '' && Number.isInteger(numId);
};

/**
 * Validates if status is valid boolean
 * @param {any} status - The status to validate
 * @returns {boolean} - True if valid boolean, false otherwise
 */
const isValidStatus = (status) => {
  return typeof status === 'boolean';
};

/**
 * Sanitizes task input data
 * @param {Object} data - Task data to sanitize
 * @returns {Object} - Sanitized task data
 */
const sanitizeTaskData = (data) => {
  return {
    title: data.title ? data.title.trim() : '',
    description: data.description ? data.description.trim() : '',
    isCompleted: data.isCompleted === true,
  };
};

module.exports = {
  isValidTitle,
  isValidId,
  isValidStatus,
  sanitizeTaskData,
};
