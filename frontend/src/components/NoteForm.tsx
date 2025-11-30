import { useState } from "react";
import type { Note } from "../models";

export default function NoteForm({
  onSubmit,
}: {
  onSubmit: (data: Partial<Note>) => void;
}) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;

    onSubmit({ title, content });
    setTitle("");
    setContent("");
  }

  return (
    <form className="add-note-form" onSubmit={submit}>
      <input
        placeholder="Note title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        placeholder="Note content..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <button type="submit">Add Note</button>
    </form>
  );
}
