import { useEffect, useState } from "react";
import { getNotes, createNote, updateNote, deleteNote } from "./routes";
import type { Note } from "./models";
import NoteList from "./components/NoteList";
import NoteForm from "./components/NoteForm";

export default function App() {
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    getNotes().then(setNotes);
  }, []);

  async function refresh() {
    const data = await getNotes();
    setNotes(data);
  }

  async function handleCreate(noteData: Partial<Note>) {
    await createNote(noteData);
    await refresh();
  }

  async function handleUpdate(id: string, noteData: Partial<Note>) {
    await updateNote(id, noteData);
    await refresh();
  }

  async function handleDelete(id: string) {
    await deleteNote(id);
    await refresh();
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
