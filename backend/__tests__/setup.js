// __tests__/setup.js
const { PrismaClient } = require('@prisma/client');

let prisma;

beforeAll(async () => {
  prisma = new PrismaClient();
  await prisma.$connect();
});

afterAll(async () => {
  await prisma.$disconnect();
});

beforeEach(async () => {
  // Clean up database before each test
  await prisma.task.deleteMany({});
});

module.exports = { getPrisma: () => prisma };
