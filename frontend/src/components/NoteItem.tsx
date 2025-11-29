import { useState } from "react";
import type { Note } from "../models";

export default function NoteItem({
  note,
  onUpdate,
  onDelete,
}: {
  note: Note;
  onUpdate: (id: string, data: Partial<Note>) => void;
  onDelete: (id: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);

  function save() {
    onUpdate(note.id, { title, content });
    setEditing(false);
  }

  return (
    <div className="note-item">
      {editing ? (
        <>
          <input value={title} onChange={(e) => setTitle(e.target.value)} />
          <textarea value={content} onChange={(e) => setContent(e.target.value)} />
          <button onClick={save}>Save</button>
        </>
      ) : (
        <>
          <h3 className="note-title">{note.title}</h3>
          <p className="note-content">{note.content}</p>
        </>
      )}

      <div className="actions">
        {!editing && <button onClick={() => setEditing(true)}>Edit</button>}
        <button className="delete-btn" onClick={() => onDelete(note.id)}>Delete</button>
      </div>
    </div>
  );
}
