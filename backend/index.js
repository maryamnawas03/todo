const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Define routes here...
app.post('/tasks', async (req, res) => {
  const { title, description } = req.body;
  try {
    const task = await prisma.task.create({
      data: {
        title,
        description,
      },
    });
    
    // Return the new task with updated stats
    const todoCount = await prisma.task.count({
      where: { isCompleted: false },
    });
    const completedCount = await prisma.task.count({
      where: { isCompleted: true },
    });
    
    res.json({
      task,
      stats: {
        todo: todoCount,
        completed: completedCount,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

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
    
    res.json({
      tasks,
      stats: {
        todo: todoCount,
        completed: completedCount,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/tasks/:id', async (req, res) => {
  const { id } = req.params;
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

app.put('/tasks/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description, isCompleted } = req.body;
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
    
    res.json({
      task,
      stats: {
        todo: todoCount,
        completed: completedCount,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.delete('/tasks/:id', async (req, res) => {
  const { id } = req.params;
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
    
    res.json({
      task,
      stats: {
        todo: todoCount,
        completed: completedCount,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
