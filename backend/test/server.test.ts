import { server } from "../src/server";
import Prisma from "../src/db";
import supertest from "supertest";

import { Entry } from "../../frontend/src/@types/context";

let entry: Entry | null = null;
let httpServer: any; // Adjust the type as needed

beforeAll(async () => {
  await Prisma.entry.deleteMany({});
  entry = await Prisma.entry.create({
    data: {
      title: "Test",
      description: "Test",
      created_at: new Date(),
      scheduled_at: new Date(),
    },
  });

  // Create HTTP server from Fastify server instance
  httpServer = await server.listen(0); // Listen on a random port
});

afterAll(async () => {
  await Prisma.entry.deleteMany({});
  await Prisma.$disconnect();

  // Close the Fastify server instance
  if (httpServer && httpServer.close) {
    await httpServer.close();
  }
});

// Test POST /create endpoint
test("Create Entry", async () => {
  const newEntry = {
    title: "Test",
    description: "Test",
    created_at: new Date() ?? null,
    scheduled_at: new Date() ?? null,
  };

  const response = await supertest(httpServer) 
    .post("/create/")
    .send(newEntry);

  expect(response.statusCode).toBe(200);
  expect(response.body.title).toBe("Test");
  expect(response.body.description).toBe("Test");
  expect(new Date(response.body.created_at)).toEqual(newEntry.created_at);
  expect(new Date(response.body.scheduled_at)).toEqual(newEntry.scheduled_at);
});

// Test PUT /update/:id endpoint
test("Get Entry by ID", async () => {
  if (!entry) {
    throw new Error("Entry not initialized");
  }

  const response = await supertest(httpServer)
    .get(`/entry/${entry.id}`)
    .send();

  expect(response.statusCode).toBe(200);
  expect(response.body.title).toBe("Test");
  expect(response.body.description).toBe("Test");
  expect(new Date(response.body.created_at)).toEqual(new Date(entry.created_at));
});
