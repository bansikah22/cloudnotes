export type Note = {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export type createNoteDto = {
  title: string;
  content: string;
};

export type updateNoteDto = Partial<createNoteDto>;