import { v4 as uuidv4 } from 'uuid';
import type { CreateNoteDto, UpdateNoteDto, Note } from "./models.js";
import { db } from "./models.js";


const createNote = async (data: CreateNoteDto): Promise<Note> => {
  if (!data.title || data.title.trim().length === 0) {
    throw new Error("Title is required");
  }

  if (!data.content || data.content.trim().length === 0) {
    throw new Error("Content is required");
  }

  const newNote: Note = {
    id: uuidv4(),
    title: data.title,
    content: data.content,
    createdAt: new Date().toISOString(),
  };

  // Cache the new note
  db.data.notes.push(newNote);
  await db.write();

  return newNote;
};

const updateNote = async (id: string, updateData: UpdateNoteDto): Promise<Note> => {
  // Cache the updated note
  db.data.notes = db.data.notes.map(note => 
    note.id === id ? { ...note, ...updateData, updatedAt: new Date().toISOString() } : note
  );
  await db.write();
  
  const updatedNote = db.data.notes.find(note => note.id === id);
  if (!updatedNote) {
    throw new Error(`Note with id ${id} not found`);
  }
  return { ...updatedNote, ...updateData } as Note;
};

async function initDB() {
  await db.read()
}

export { createNote, updateNote, initDB };