const express = require('express');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const app = express();
const port = 3001;

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
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/tasks', async (req, res) => {
  try {
    const tasks = await prisma.task.findMany();
    res.json(tasks);
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
    res.json(task);
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
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
