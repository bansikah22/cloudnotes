import NoteItem from "./NoteItem";
import type { Note } from "../models";

export default function NoteList({
  notes,
  onUpdate,
  onDelete,
}: {
  notes: Note[];
  onUpdate: (id: string, data: Partial<Note>) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="list">
      {notes.map((n) => (
        <NoteItem
          key={n.id}
          note={n}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
