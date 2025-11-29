import { v4 as uuidv4 } from 'uuid';
import type { CreateNoteDto, UpdateNoteDto, Note } from "./models.js"
import { notes } from "./models.js"

const createNote = (data: CreateNoteDto): Note => {
  if (!data.title || data.title.trim().length === 0) {
    throw new Error("Title is required");
  }

  if (!data.content || data.content.trim().length === 0) {
    throw new Error("Content is required");
  }

  const newNote = {
    id: uuidv4(),
    title: data.title,
    content: data.content,
    achieved: false,
    createdAt: new Date().toISOString(),
  };

  notes.push(newNote);

  return newNote;
};

const updateNote = (id: string, updateData: UpdateNoteDto): Note => {
  const index = notes.findIndex((note) => note.id === id);

  if (index === -1) {
    throw new Error("Note not found");
  }

  const existing = notes[index];

  const updatedNote = {
    ...existing,
    ...updateData,
    updatedAt: new Date().toISOString(),
  } as Note;

  notes[index] = updatedNote;
  return updatedNote;
};

export { createNote, updateNote };