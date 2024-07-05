import fastify from "fastify";
import cors from "@fastify/cors";
import { Entry } from "@prisma/client";
import Prisma from "./db";

export const server = fastify();

server.register(cors, {});

server.get<{ Reply: Entry[] }>("/get/", async (req, reply) => {
  const dbAllEntries = await Prisma.entry.findMany({});
  reply.send(dbAllEntries);
});

server.get<{ Params: { id: string } }>(
  "/get/:id",
  async (req, reply) => {
    try {
      const dbEntry = await Prisma.entry.findUnique({
        where: { id: (req.params.id) },
      });
      if (!dbEntry) {
        reply.status(404).send({ msg: `Entry with id ${req.params.id} not found` });
        return;
      }
      reply.send(dbEntry);
    } catch (error) {
      console.error("Error fetching entry:", error);
      reply.status(500).send({ msg: "Error fetching entry" });
    }
  }
);


  server.post<{ Body: Entry }>("/create/", async (req, reply) => {
    try {
      const newEntry = req.body;
      newEntry.created_at = new Date(req.body.created_at); 
      newEntry.scheduled_at = req.body.scheduled_at ? new Date(req.body.scheduled_at) : null; 
  
      const createdEntryData = await Prisma.entry.create({ data: newEntry });
  
      const entryWithId = await Prisma.entry.findUnique({
        where: { id: createdEntryData.id }
      });
  
      reply.send(entryWithId); 
  
    } catch (error) {
      console.error("Error creating entry:", error);
      reply.status(500).send({ msg: "Error creating entry" });
    }
  });


server.delete<{ Params: { id: string } }>("/delete/:id", async (req, reply) => {
  try {
    await Prisma.entry.delete({ where: { id: (req.params.id) } });
    reply.send({ msg: "Deleted successfully" });
  } catch {
    reply.status(500).send({ msg: "Error deleting entry" });
  }
});

server.put<{ Params: { id: string }; Body: Entry }>(
  "/update/:id",
  async (req, reply) => {
    let updatedEntryBody = req.body;
    updatedEntryBody.created_at
      ? (updatedEntryBody.created_at = new Date(req.body.created_at))
      : (updatedEntryBody.created_at = new Date());

    updatedEntryBody.scheduled_at = req.body.scheduled_at ? new Date(req.body.scheduled_at) : null;
    
    try {
      await Prisma.entry.update({
        data: req.body,
        where: { id: (req.params.id) },
      });
      reply.send({ msg: "Updated successfully" });
    } catch {
      reply.status(500).send({ msg: "Error updating" });
    }
  }
);


