import request from 'supertest';
import server from '../src/server'; // Adjust the path as necessary
import Prisma from '../src/db';

describe('CRUD Endpoints', () => {
  let fastify: any;

  beforeAll(async () => {
    fastify = server;
    await fastify.ready();
  });

  afterAll(async () => {
    await fastify.close();
  });

  beforeEach(async () => {
    await Prisma.entry.deleteMany({}); // Clean up the database before each test
  });

  describe('POST /create/', () => {
    it('should create a new entry', async () => {
      const newEntry = {
        title: "Test",
        description: "Test",
        created_at: new Date().toISOString(),
        scheduled_at: new Date().toISOString(),
      };

      const response = await request(fastify.server)
        .post('/create/')
        .send(newEntry);

      expect(response.status).toBe(200);
      expect(response.body.title).toBe("Test");
      expect(response.body.description).toBe("Test");
      expect(new Date(response.body.created_at).toISOString()).toEqual(newEntry.created_at);
      expect(new Date(response.body.scheduled_at).toISOString()).toEqual(newEntry.scheduled_at);
    });
  });

  describe('PUT /update/:id', () => {
    let entryId: string;

    beforeEach(async () => {
      const newEntry = {
        title: "Test",
        description: "Test",
        created_at: new Date().toISOString(),
        scheduled_at: new Date().toISOString(),
      };

      const response = await request(fastify.server)
        .post('/create/')
        .send(newEntry);

      entryId = response.body.id;
    });

    it('should update an entry by ID', async () => {
      const updatedEntry = {
        title: "Updated Test",
        description: "Updated Test",
        created_at: new Date().toISOString(),
        scheduled_at: new Date().toISOString(),
      };

      const response = await request(fastify.server)
        .put(`/update/${entryId}`)
        .send(updatedEntry);

      expect(response.status).toBe(200);

      const getResponse = await request(fastify.server)
        .get(`/get/${entryId}`);

      expect(getResponse.body.title).toBe("Updated Test");
      expect(getResponse.body.description).toBe("Updated Test");
    });
  });

  describe('DELETE /delete/:id', () => {
    let entryId: string;

    beforeEach(async () => {
      const newEntry = {
        title: "Test",
        description: "Test",
        created_at: new Date().toISOString(),
        scheduled_at: new Date().toISOString(),
      };

      const response = await request(fastify.server)
        .post('/create/')
        .send(newEntry);

      entryId = response.body.id;
    });

    it('should delete an entry by ID', async () => {
      const response = await request(fastify.server)
        .delete(`/delete/${entryId}`);

      expect(response.status).toBe(200);

      const getResponse = await request(fastify.server)
        .get(`/get/${entryId}`);

      expect(getResponse.status).toBe(404);
    });
  });
});


