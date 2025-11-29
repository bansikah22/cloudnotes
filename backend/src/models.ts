export type Note = {
    id: string;
    title: string;
    content: string;
    createdAt: string;
    updatedAt?: string;
};

export type CreateNoteDto = {
  title: string;
  content: string;
};

export type UpdateNoteDto = CreateNoteDto;

export const notes: Note[] = [];
