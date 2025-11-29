import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Define the database schema
type Schema = {
  notes: Note[];
};

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

export type UpdateNoteDto = Partial<Omit<Note, 'id' | 'createdAt'>>;

// Use JSON file for storage
const dbFileName = process.env['DB_FILE'] || 'db.json';
const file = join(__dirname, dbFileName);
const adapter = new JSONFile<Schema>(file);

// Create a properly typed database instance
const db = new Low<Schema>(adapter, { notes: [] });

// Initialize the database
async function initDB() {
  await db.read();
  
  console.log(`Database initialized: ${JSON.stringify(db.data)}`);
  if (!db.data) {
    db.data = { notes: [] };
    await db.write();
  }
}

// Run the initialization
initDB().catch(console.error);

export { db };