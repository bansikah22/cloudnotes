import { useEffect, useState, useCallback } from "react";
import { getNotes, createNote, updateNote, deleteNote } from "./routes";
import type { Note } from "./models";
import NoteList from "./components/NoteList";
import NoteForm from "./components/NoteForm";

export default function App() {
  const [notes, setNotes] = useState<Note[]>([]);

  const load = useCallback(async () => {
    const data = await getNotes();
    setNotes(data);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleCreate(noteData: Partial<Note>) {
    await createNote(noteData);
    load();
  }

  async function handleUpdate(id: string, noteData: Partial<Note>) {
    await updateNote(id, noteData);
    load();
  }

  async function handleDelete(id: string) {
    await deleteNote(id);
    load();
  }

  return (
    <div className="app-container">
      <h1>Notes App</h1>

      <NoteForm onSubmit={handleCreate} />

      <NoteList
        notes={notes}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
      />
    </div>
  );
}
