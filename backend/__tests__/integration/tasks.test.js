// __tests__/integration/tasks.test.js
const request = require('supertest');
const { PrismaClient } = require('@prisma/client');
const createApp = require('../../app');

const prisma = new PrismaClient();
let app;

beforeAll(async () => {
  await prisma.$connect();
  app = createApp(prisma);
});

afterAll(async () => {
  await prisma.$disconnect();
});

beforeEach(async () => {
  // Clean up database before each test
  await prisma.task.deleteMany({});
});

describe('Task API Integration Tests', () => {
  describe('POST /tasks', () => {
    it('should create a new task with title and description', async () => {
      const response = await request(app)
        .post('/tasks')
        .send({
          title: 'Test Task',
          description: 'Test Description',
        })
        .expect(201);

      expect(response.body.task).toHaveProperty('id');
      expect(response.body.task.title).toBe('Test Task');
      expect(response.body.task.description).toBe('Test Description');
      expect(response.body.task.isCompleted).toBe(false);
      expect(response.body.stats.todo).toBe(1);
      expect(response.body.stats.completed).toBe(0);
    });

    it('should create a task without description', async () => {
      const response = await request(app)
        .post('/tasks')
        .send({
          title: 'Task without description',
        })
        .expect(201);

      expect(response.body.task.title).toBe('Task without description');
      expect(response.body.task.description).toBe('');
    });

    it('should return 400 if title is missing', async () => {
      const response = await request(app)
        .post('/tasks')
        .send({
          description: 'Description only',
        })
        .expect(400);

      expect(response.body.error).toBe('Title is required');
    });

    it('should return 400 if title is empty string', async () => {
      const response = await request(app)
        .post('/tasks')
        .send({
          title: '   ',
          description: 'Description',
        })
        .expect(400);

      expect(response.body.error).toBe('Title is required');
    });
  });

  describe('GET /tasks', () => {
    it('should return empty array when no tasks exist', async () => {
      const response = await request(app).get('/tasks').expect(200);

      expect(response.body.tasks).toEqual([]);
      expect(response.body.stats.todo).toBe(0);
      expect(response.body.stats.completed).toBe(0);
    });

    it('should return only incomplete tasks', async () => {
      // Create completed and incomplete tasks
      await prisma.task.create({
        data: { title: 'Completed Task', description: '', isCompleted: true },
      });
      await prisma.task.create({
        data: { title: 'Incomplete Task', description: '', isCompleted: false },
      });

      const response = await request(app).get('/tasks').expect(200);

      expect(response.body.tasks.length).toBe(1);
      expect(response.body.tasks[0].title).toBe('Incomplete Task');
      expect(response.body.stats.todo).toBe(1);
      expect(response.body.stats.completed).toBe(1);
    });

    it('should return only the 5 most recent incomplete tasks', async () => {
      // Create 7 incomplete tasks
      for (let i = 1; i <= 7; i++) {
        await prisma.task.create({
          data: { title: `Task ${i}`, description: '', isCompleted: false },
        });
        // Small delay to ensure different timestamps
        await new Promise((resolve) => setTimeout(resolve, 10));
      }

      const response = await request(app).get('/tasks').expect(200);

      expect(response.body.tasks.length).toBe(5);
      // Should return tasks 7, 6, 5, 4, 3 (most recent first)
      expect(response.body.tasks[0].title).toBe('Task 7');
      expect(response.body.tasks[4].title).toBe('Task 3');
      expect(response.body.stats.todo).toBe(7);
    });

    it('should return tasks ordered by most recent first', async () => {
      await prisma.task.create({
        data: { title: 'First Task', description: '', isCompleted: false },
      });
      await new Promise((resolve) => setTimeout(resolve, 10));
      await prisma.task.create({
        data: { title: 'Second Task', description: '', isCompleted: false },
      });

      const response = await request(app).get('/tasks').expect(200);

      expect(response.body.tasks[0].title).toBe('Second Task');
      expect(response.body.tasks[1].title).toBe('First Task');
    });
  });

  describe('GET /tasks/:id', () => {
    it('should return a task by id', async () => {
      const task = await prisma.task.create({
        data: { title: 'Test Task', description: 'Test Description' },
      });

      const response = await request(app).get(`/tasks/${task.id}`).expect(200);

      expect(response.body.id).toBe(task.id);
      expect(response.body.title).toBe('Test Task');
      expect(response.body.description).toBe('Test Description');
    });

    it('should return 404 if task not found', async () => {
      const response = await request(app).get('/tasks/9999').expect(404);

      expect(response.body.error).toBe('Task not found');
    });

    it('should return 400 for invalid task id', async () => {
      const response = await request(app).get('/tasks/invalid').expect(400);

      expect(response.body.error).toBe('Invalid task ID');
    });
  });

  describe('PUT /tasks/:id', () => {
    it('should update a task', async () => {
      const task = await prisma.task.create({
        data: { title: 'Original Title', description: 'Original Description' },
      });

      const response = await request(app)
        .put(`/tasks/${task.id}`)
        .send({
          title: 'Updated Title',
          description: 'Updated Description',
          isCompleted: false,
        })
        .expect(200);

      expect(response.body.task.title).toBe('Updated Title');
      expect(response.body.task.description).toBe('Updated Description');
    });

    it('should mark a task as completed', async () => {
      const task = await prisma.task.create({
        data: { title: 'Task to Complete', description: '' },
      });

      const response = await request(app)
        .put(`/tasks/${task.id}`)
        .send({
          isCompleted: true,
        })
        .expect(200);

      expect(response.body.task.isCompleted).toBe(true);
      expect(response.body.stats.todo).toBe(0);
      expect(response.body.stats.completed).toBe(1);
    });

    it('should return 404 if task not found', async () => {
      const response = await request(app)
        .put('/tasks/9999')
        .send({
          title: 'Updated Title',
        })
        .expect(404);

      expect(response.body.error).toBe('Task not found');
    });

    it('should return 400 for invalid task id', async () => {
      const response = await request(app)
        .put('/tasks/invalid')
        .send({
          title: 'Updated Title',
        })
        .expect(400);

      expect(response.body.error).toBe('Invalid task ID');
    });
  });

  describe('DELETE /tasks/:id', () => {
    it('should delete a task', async () => {
      const task = await prisma.task.create({
        data: { title: 'Task to Delete', description: '' },
      });

      const response = await request(app)
        .delete(`/tasks/${task.id}`)
        .expect(200);

      expect(response.body.task.id).toBe(task.id);
      expect(response.body.stats.todo).toBe(0);

      // Verify task is deleted
      const deletedTask = await prisma.task.findUnique({
        where: { id: task.id },
      });
      expect(deletedTask).toBeNull();
    });

    it('should return 404 if task not found', async () => {
      const response = await request(app).delete('/tasks/9999').expect(404);

      expect(response.body.error).toBe('Task not found');
    });

    it('should return 400 for invalid task id', async () => {
      const response = await request(app).delete('/tasks/invalid').expect(400);

      expect(response.body.error).toBe('Invalid task ID');
    });

    it('should update stats after deletion', async () => {
      await prisma.task.create({
        data: { title: 'Task 1', description: '' },
      });
      const task2 = await prisma.task.create({
        data: { title: 'Task 2', description: '' },
      });

      const response = await request(app)
        .delete(`/tasks/${task2.id}`)
        .expect(200);

      expect(response.body.stats.todo).toBe(1);
      expect(response.body.stats.completed).toBe(0);
    });
  });

  describe('Stats Accuracy', () => {
    it('should accurately track todo and completed counts across operations', async () => {
      // Create 3 tasks
      await request(app).post('/tasks').send({ title: 'Task 1' });
      await request(app).post('/tasks').send({ title: 'Task 2' });
      const task3Response = await request(app)
        .post('/tasks')
        .send({ title: 'Task 3' });

      expect(task3Response.body.stats.todo).toBe(3);
      expect(task3Response.body.stats.completed).toBe(0);

      // Complete one task
      const updateResponse = await request(app)
        .put(`/tasks/${task3Response.body.task.id}`)
        .send({ isCompleted: true });

      expect(updateResponse.body.stats.todo).toBe(2);
      expect(updateResponse.body.stats.completed).toBe(1);

      // Get tasks - should return only 2 incomplete
      const getResponse = await request(app).get('/tasks');
      expect(getResponse.body.tasks.length).toBe(2);
      expect(getResponse.body.stats.todo).toBe(2);
      expect(getResponse.body.stats.completed).toBe(1);
    });
  });

  describe('GET /stats', () => {
    it('should return comprehensive statistics with totals and percentage', async () => {
      // Create 3 tasks: 2 incomplete, 1 completed
      await prisma.task.create({
        data: { title: 'Task 1', description: '', isCompleted: false },
      });
      await prisma.task.create({
        data: { title: 'Task 2', description: '', isCompleted: false },
      });
      await prisma.task.create({
        data: { title: 'Task 3', description: '', isCompleted: true },
      });

      const response = await request(app).get('/stats').expect(200);

      expect(response.body.todo).toBe(2);
      expect(response.body.completed).toBe(1);
      expect(response.body.total).toBe(3);
      expect(response.body.completionPercentage).toBe(33); // 1/3 = 33%
    });

    it('should return 0% completion when no tasks are completed', async () => {
      await prisma.task.create({
        data: { title: 'Task 1', description: '', isCompleted: false },
      });
      await prisma.task.create({
        data: { title: 'Task 2', description: '', isCompleted: false },
      });

      const response = await request(app).get('/stats').expect(200);

      expect(response.body.todo).toBe(2);
      expect(response.body.completed).toBe(0);
      expect(response.body.total).toBe(2);
      expect(response.body.completionPercentage).toBe(0);
    });

    it('should return 100% completion when all tasks are completed', async () => {
      await prisma.task.create({
        data: { title: 'Task 1', description: '', isCompleted: true },
      });
      await prisma.task.create({
        data: { title: 'Task 2', description: '', isCompleted: true },
      });

      const response = await request(app).get('/stats').expect(200);

      expect(response.body.todo).toBe(0);
      expect(response.body.completed).toBe(2);
      expect(response.body.total).toBe(2);
      expect(response.body.completionPercentage).toBe(100);
    });

    it('should return 0 for all stats when no tasks exist', async () => {
      const response = await request(app).get('/stats').expect(200);

      expect(response.body.todo).toBe(0);
      expect(response.body.completed).toBe(0);
      expect(response.body.total).toBe(0);
      expect(response.body.completionPercentage).toBe(0);
    });

    it('should handle large numbers correctly', async () => {
      // Create 10 tasks: 7 completed, 3 incomplete
      for (let i = 1; i <= 7; i++) {
        await prisma.task.create({
          data: { title: `Completed Task ${i}`, description: '', isCompleted: true },
        });
      }
      for (let i = 1; i <= 3; i++) {
        await prisma.task.create({
          data: { title: `Incomplete Task ${i}`, description: '', isCompleted: false },
        });
      }

      const response = await request(app).get('/stats').expect(200);

      expect(response.body.todo).toBe(3);
      expect(response.body.completed).toBe(7);
      expect(response.body.total).toBe(10);
      expect(response.body.completionPercentage).toBe(70); // 7/10 = 70%
    });
  });
});
