import { Priority } from "./models.js"
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

  if (data.priority?.toLocaleLowerCase() !== Priority.Low.toLocaleLowerCase() &&
    data.priority?.toLocaleLowerCase() !== Priority.Medium.toLocaleLowerCase() &&
    data.priority?.toLocaleLowerCase() !== Priority.High.toLocaleLowerCase()) {
    throw new Error("Priority must be Low, Medium, or High");
  }

  const newNote = {
    id: uuidv4(),
    title: data.title,
    content: data.content,
    achieved: false,
    priority: data.priority || Priority.Medium,
    createdAt: new Date().toISOString(),
    ...(data.description && { description: data.description }),
    ...(data.tags && { tags: data.tags }),
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