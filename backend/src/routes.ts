import express from "express"
import { createNote, updateNote } from "./helper.js"
import { db } from "./models.js"
import type { Note } from "./models.js"
const router = express.Router();

// Health check
router.get("/health", (_req: express.Request, res: express.Response) => {
  res.status(200).json({ status: "ok" });
});

// Get all notes
router.get("/notes", (_req: express.Request, res: express.Response) => {
  console.log("[GET]: /api/notes");
  res.json(
    db.data.notes
  );
});

router.get("/note/:id", (req: express.Request, res: express.Response) => {
  const id = req.params['id']!;

  console.log(`[GET]: /api/note/${id}`);
  const note = db.data.notes.find((n: Note) => n.id === id);
  if (!note) {
    return res.status(404).json({ error: "Note not found" });
  }
  return res.json(note);
});

// Create a new note
router.post("/notes", async (req: express.Request, res: express.Response) => {
  console.log("[POST]: /api/notes");
  try {
    const newNote = await createNote(req.body);
    return res.status(201).json(newNote);
  } catch (error: any) {
    console.error("Error creating note:", error);
    return res.status(400).json({ error: error.message || "Invalid note data" });
  }
});

// Update a note
router.put("/notes/:id", async (req: express.Request, res: express.Response) => {
  const id = req.params['id']!;
  console.log(`[PUT]: /api/notes/${id}`);
  try {
    console.log(req.body);
    const updatedNote = await updateNote(id, req.body);
    return res.status(200).json(updatedNote);
  } catch (error: any) {
    console.error("Error updating note:", error);
    return res.status(400).json({ error: error.message || "Invalid note data" });
  }
});

// Delete a note
router.delete("/notes/:id", async (req: express.Request, res: express.Response) => {
  const id = req.params['id']!;
  console.log(`[DELETE]: /api/notes/${id}`);
  try {
    const index = db.data.notes.findIndex((note: Note) => note.id === id);
    if (index === -1) {
      throw new Error("Note not found");
    }
    db.data.notes.splice(index, 1);
    await db.write();
    return res.status(204).send();
  } catch (error: any) {
    console.error("Error deleting note:", error);
    return res.status(400).json({ error: error.message || "Invalid note data" });
  }
});

export default router;