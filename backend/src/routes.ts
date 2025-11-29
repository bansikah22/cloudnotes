import express from "express"
import { createNote, updateNote } from "./helper.js"
import { notes } from "./models.js"
import type { Note } from "./models.js"
const router = express.Router();

// Get all notes
router.get("/notes", (_req: express.Request, res: express.Response) => {
  console.log("[GET]: /api/notes");
  res.json(notes);
});

// Create a new note
router.post("/notes", (req: express.Request, res: express.Response) => {
  console.log("[POST]: /api/notes");
  try {
    const newNote = createNote(req.body);
    res.status(201).json(newNote);
  } catch (error: any) {
    console.error("Error creating note:", error);
    res.status(400).json({ error: error.message || "Invalid note data" });
  }
});

// Update a note
router.put("/notes/:id", (req: express.Request, res: express.Response) => {
  const id = req.params['id']!;
  console.log(`[PUT]: /api/notes/${id}`);
  try {
    console.log(req.body);
    const updatedNote = updateNote(id, req.body);
    res.json(updatedNote);
  } catch (error: any) {
    console.error("Error updating note:", error);
    res.status(400).json({ error: error.message || "Invalid note data" });
  }
});

// Delete a note
router.delete("/notes/:id", (req: express.Request, res: express.Response) => {
  const id = req.params['id']!;
  console.log(`[DELETE]: /api/notes/${id}`);
  try {
    const index = notes.findIndex((note: Note) => note.id === id);
    if (index === -1) {
      throw new Error("Note not found");
    }
    notes.splice(index, 1);
    res.status(204).send();
  } catch (error: any) {
    console.error("Error deleting note:", error);
    res.status(400).json({ error: error.message || "Invalid note data" });
  }
});

router.get("/health", (_req, res) => {
  console.log("[GET}: /api/health")
  res.status(200).json({ "status": "running" })
})

export default router;