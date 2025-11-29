export enum Priority {
    Low = "Low",
    Medium = "Medium",
    High = "High"
}

export type Note = {
    id: string;
    title: string;
    description?: string;
    tags?: string[];
    content: string;
    achieved: boolean;
    priority?: Priority;
    createdAt: string;
    updatedAt?: string;
};

export type CreateNoteDto = {
  title: string;
  description?: string;
  tags?: string[];
  content: string;
  priority?: Priority;
};

export type UpdateNoteDto = Partial<Omit<Note, "id" | "createdAt">>;

export const notes: Note[] = [];
