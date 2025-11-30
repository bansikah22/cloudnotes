import type { Note } from "./models";

const BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export async function getNotes(): Promise<Note[]> {
  const res = await fetch(`${BASE}/notes`);
  return res.json();
}

export async function createNote(body: Partial<Note>) {
  const res = await fetch(`${BASE}/notes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.json();
}

export async function updateNote(id: string, body: Partial<Note>) {
  const res = await fetch(`${BASE}/notes/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.json();
}

export async function deleteNote(id: string) {
  return fetch(`${BASE}/notes/${id}`, { method: "DELETE" });
}