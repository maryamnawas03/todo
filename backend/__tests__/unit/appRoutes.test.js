// __tests__/unit/appRoutes.test.js
// Unit tests for app.js routes with mocked Prisma

const request = require('supertest');
const createApp = require('../../app');

describe('App Routes Unit Tests (Mocked)', () => {
  let app;
  let mockPrisma;

  beforeEach(() => {
    // Create a mock Prisma client
    mockPrisma = {
      task: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        count: jest.fn(),
      },
    };

    // Create app with mocked Prisma
    app = createApp(mockPrisma);
  });

  describe('POST /tasks', () => {
    it('should create a new task successfully', async () => {
      const newTask = {
        id: 1,
        title: 'Test Task',
        description: 'Test Description',
        isCompleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.task.create.mockResolvedValue(newTask);
      mockPrisma.task.count
        .mockResolvedValueOnce(1) // todo count
        .mockResolvedValueOnce(0); // completed count

      const response = await request(app)
        .post('/tasks')
        .send({ title: 'Test Task', description: 'Test Description' })
        .expect(201);

      // Dates get serialized as strings in JSON, so compare properties separately
      expect(response.body.task.id).toBe(1);
      expect(response.body.task.title).toBe('Test Task');
      expect(response.body.task.description).toBe('Test Description');
      expect(response.body.task.isCompleted).toBe(false);
      expect(response.body.stats).toEqual({ todo: 1, completed: 0 });
      expect(mockPrisma.task.create).toHaveBeenCalledWith({
        data: {
          title: 'Test Task',
          description: 'Test Description',
        },
      });
    });

    it('should return 400 if title is missing', async () => {
      const response = await request(app)
        .post('/tasks')
        .send({ description: 'Only description' })
        .expect(400);

      expect(response.body.error).toBe('Title is required');
      expect(mockPrisma.task.create).not.toHaveBeenCalled();
    });

    it('should return 400 if title is empty string', async () => {
      const response = await request(app)
        .post('/tasks')
        .send({ title: '   ', description: 'Description' })
        .expect(400);

      expect(response.body.error).toBe('Title is required');
      expect(mockPrisma.task.create).not.toHaveBeenCalled();
    });

    it('should handle database errors', async () => {
      mockPrisma.task.create.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .post('/tasks')
        .send({ title: 'Test Task' })
        .expect(500);

      expect(response.body.error).toBe('Database error');
    });
  });

  describe('GET /tasks', () => {
    it('should return tasks with stats', async () => {
      const mockTasks = [
        { id: 1, title: 'Task 1', description: '', isCompleted: false },
        { id: 2, title: 'Task 2', description: '', isCompleted: false },
      ];

      mockPrisma.task.findMany.mockResolvedValue(mockTasks);
      mockPrisma.task.count
        .mockResolvedValueOnce(2) // todo count
        .mockResolvedValueOnce(0); // completed count

      const response = await request(app).get('/tasks').expect(200);

      expect(response.body.tasks).toEqual(mockTasks);
      expect(response.body.stats).toEqual({ todo: 2, completed: 0 });
      expect(mockPrisma.task.findMany).toHaveBeenCalledWith({
        where: { isCompleted: false },
        orderBy: { createdAt: 'desc' },
        take: 5,
      });
    });

    it('should return empty array when no tasks', async () => {
      mockPrisma.task.findMany.mockResolvedValue([]);
      mockPrisma.task.count.mockResolvedValue(0);

      const response = await request(app).get('/tasks').expect(200);

      expect(response.body.tasks).toEqual([]);
      expect(response.body.stats).toEqual({ todo: 0, completed: 0 });
    });

    it('should handle database errors', async () => {
      mockPrisma.task.findMany.mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/tasks').expect(500);

      expect(response.body.error).toBe('Database error');
    });
  });

  describe('GET /tasks/:id', () => {
    it('should return a task by id', async () => {
      const mockTask = {
        id: 1,
        title: 'Task 1',
        description: 'Description',
        isCompleted: false,
      };

      mockPrisma.task.findUnique.mockResolvedValue(mockTask);

      const response = await request(app).get('/tasks/1').expect(200);

      expect(response.body).toEqual(mockTask);
      expect(mockPrisma.task.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should return 404 if task not found', async () => {
      mockPrisma.task.findUnique.mockResolvedValue(null);

      const response = await request(app).get('/tasks/999').expect(404);

      expect(response.body.error).toBe('Task not found');
    });

    it('should return 400 for invalid id', async () => {
      const response = await request(app).get('/tasks/invalid').expect(400);

      expect(response.body.error).toBe('Invalid task ID');
      expect(mockPrisma.task.findUnique).not.toHaveBeenCalled();
    });
  });

  describe('PUT /tasks/:id', () => {
    it('should update a task', async () => {
      const updatedTask = {
        id: 1,
        title: 'Updated Task',
        description: 'Updated Description',
        isCompleted: false,
      };

      mockPrisma.task.update.mockResolvedValue(updatedTask);
      mockPrisma.task.count
        .mockResolvedValueOnce(1) // todo count
        .mockResolvedValueOnce(0); // completed count

      const response = await request(app)
        .put('/tasks/1')
        .send({
          title: 'Updated Task',
          description: 'Updated Description',
          isCompleted: false,
        })
        .expect(200);

      expect(response.body.task).toEqual(updatedTask);
      expect(response.body.stats).toEqual({ todo: 1, completed: 0 });
    });

    it('should return 404 if task not found', async () => {
      const error = new Error('Record not found');
      error.code = 'P2025';
      mockPrisma.task.update.mockRejectedValue(error);

      const response = await request(app)
        .put('/tasks/999')
        .send({ title: 'Updated' })
        .expect(404);

      expect(response.body.error).toBe('Task not found');
    });

    it('should return 400 for invalid id', async () => {
      const response = await request(app)
        .put('/tasks/invalid')
        .send({ title: 'Updated' })
        .expect(400);

      expect(response.body.error).toBe('Invalid task ID');
    });
  });

  describe('DELETE /tasks/:id', () => {
    it('should delete a task', async () => {
      const deletedTask = {
        id: 1,
        title: 'Deleted Task',
        description: '',
        isCompleted: false,
      };

      mockPrisma.task.delete.mockResolvedValue(deletedTask);
      mockPrisma.task.count
        .mockResolvedValueOnce(0) // todo count
        .mockResolvedValueOnce(0); // completed count

      const response = await request(app).delete('/tasks/1').expect(200);

      expect(response.body.task).toEqual(deletedTask);
      expect(response.body.stats).toEqual({ todo: 0, completed: 0 });
    });

    it('should return 404 if task not found', async () => {
      const error = new Error('Record not found');
      error.code = 'P2025';
      mockPrisma.task.delete.mockRejectedValue(error);

      const response = await request(app).delete('/tasks/999').expect(404);

      expect(response.body.error).toBe('Task not found');
    });

    it('should return 400 for invalid id', async () => {
      const response = await request(app).delete('/tasks/invalid').expect(400);

      expect(response.body.error).toBe('Invalid task ID');
    });
  });

  describe('GET /stats', () => {
    it('should return comprehensive statistics', async () => {
      mockPrisma.task.count
        .mockResolvedValueOnce(5) // todo count
        .mockResolvedValueOnce(3); // completed count

      const response = await request(app).get('/stats').expect(200);

      expect(response.body.todo).toBe(5);
      expect(response.body.completed).toBe(3);
      expect(response.body.total).toBe(8);
      expect(response.body.completionPercentage).toBe(38); // 3/8 = 37.5% rounded to 38
    });

    it('should return 0 stats when no tasks exist', async () => {
      mockPrisma.task.count
        .mockResolvedValueOnce(0) // todo count
        .mockResolvedValueOnce(0); // completed count

      const response = await request(app).get('/stats').expect(200);

      expect(response.body.todo).toBe(0);
      expect(response.body.completed).toBe(0);
      expect(response.body.total).toBe(0);
      expect(response.body.completionPercentage).toBe(0);
    });

    it('should handle database errors', async () => {
      mockPrisma.task.count.mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/stats').expect(500);

      expect(response.body.error).toBe('Database error');
    });
  });
});
