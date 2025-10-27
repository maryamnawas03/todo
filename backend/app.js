// app.js - Express application (for testing)
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const { isValidTitle, isValidId, sanitizeTaskData } = require('./utils/validators');
const { formatStats, formatTaskResponse, formatTasksResponse } = require('./utils/taskHelpers');

const createApp = (prismaClient) => {
  const app = express();
  const prisma = prismaClient || new PrismaClient();

  app.use(cors());
  app.use(express.json());

  // POST /tasks - Create a new task
  app.post('/tasks', async (req, res) => {
    const { title, description } = req.body;
    
    // Use validator from utilities
    if (!isValidTitle(title)) {
      return res.status(400).json({ error: 'Title is required' });
    }

    try {
      // Use sanitizeTaskData to clean input
      const sanitized = sanitizeTaskData({ title, description });
      
      const task = await prisma.task.create({
        data: {
          title: sanitized.title,
          description: sanitized.description,
        },
      });
      
      // Get counts for stats
      const todoCount = await prisma.task.count({
        where: { isCompleted: false },
      });
      const completedCount = await prisma.task.count({
        where: { isCompleted: true },
      });
      
      // Use formatTaskResponse helper
      const stats = formatStats(todoCount, completedCount);
      res.status(201).json(formatTaskResponse(task, stats));
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // GET /tasks - Get all incomplete tasks (limit 5, most recent)
  app.get('/tasks', async (req, res) => {
    try {
      // Get only incomplete tasks, ordered by most recent, limit to 5
      const tasks = await prisma.task.findMany({
        where: {
          isCompleted: false,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 5,
      });
      
      // Get counts for stats
      const todoCount = await prisma.task.count({
        where: { isCompleted: false },
      });
      const completedCount = await prisma.task.count({
        where: { isCompleted: true },
      });
      
      // Use formatTasksResponse helper
      const stats = formatStats(todoCount, completedCount);
      res.json(formatTasksResponse(tasks, stats));
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // GET /tasks/:id - Get a specific task
  app.get('/tasks/:id', async (req, res) => {
    const { id } = req.params;
    
    // Use validator from utilities
    if (!isValidId(id)) {
      return res.status(400).json({ error: 'Invalid task ID' });
    }

    try {
      const task = await prisma.task.findUnique({
        where: { id: Number(id) },
      });
      
      if (task) {
        res.json(task);
      } else {
        res.status(404).json({ error: 'Task not found' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // PUT /tasks/:id - Update a task
  app.put('/tasks/:id', async (req, res) => {
    const { id } = req.params;
    const { title, description, isCompleted } = req.body;
    
    // Use validator from utilities
    if (!isValidId(id)) {
      return res.status(400).json({ error: 'Invalid task ID' });
    }

    try {
      const task = await prisma.task.update({
        where: { id: Number(id) },
        data: {
          title,
          description,
          isCompleted,
        },
      });
      
      // Return updated stats
      const todoCount = await prisma.task.count({
        where: { isCompleted: false },
      });
      const completedCount = await prisma.task.count({
        where: { isCompleted: true },
      });
      
      // Use helper functions
      const stats = formatStats(todoCount, completedCount);
      res.json(formatTaskResponse(task, stats));
    } catch (error) {
      if (error.code === 'P2025') {
        return res.status(404).json({ error: 'Task not found' });
      }
      res.status(500).json({ error: error.message });
    }
  });

  // DELETE /tasks/:id - Delete a task
  app.delete('/tasks/:id', async (req, res) => {
    const { id } = req.params;
    
    // Use validator from utilities
    if (!isValidId(id)) {
      return res.status(400).json({ error: 'Invalid task ID' });
    }

    try {
      const task = await prisma.task.delete({
        where: { id: Number(id) },
      });
      
      // Return updated stats
      const todoCount = await prisma.task.count({
        where: { isCompleted: false },
      });
      const completedCount = await prisma.task.count({
        where: { isCompleted: true },
      });
      
      // Use helper functions
      const stats = formatStats(todoCount, completedCount);
      res.json(formatTaskResponse(task, stats));
    } catch (error) {
      if (error.code === 'P2025') {
        return res.status(404).json({ error: 'Task not found' });
      }
      res.status(500).json({ error: error.message });
    }
  });

  // GET /stats - Get comprehensive task statistics
  app.get('/stats', async (req, res) => {
    try {
      const todoCount = await prisma.task.count({
        where: { isCompleted: false },
      });
      const completedCount = await prisma.task.count({
        where: { isCompleted: true },
      });
      
      // Use helper functions
      const { calculateTotalTasks, calculateCompletionPercentage } = require('./utils/taskHelpers');
      const total = calculateTotalTasks(todoCount, completedCount);
      const completionPercentage = calculateCompletionPercentage(completedCount, total);
      
      res.json({
        todo: todoCount,
        completed: completedCount,
        total: total,
        completionPercentage: completionPercentage,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  return app;
};

module.exports = createApp;
