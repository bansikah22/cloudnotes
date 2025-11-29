import 'dotenv/config';
import express from "express";
import notesRouter from "./routes.js"
import cors from "cors";

const PORT = process.env['PORT'] || 5000;
const HOST = process.env['HOST'] || '0.0.0.0';
const app = express();
const corsOptions = {
  origin: `${process.env['FRONTEND_URL'] || 'http://localhost:3000'}`,
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type', 'application/json']
};

app.use(express.json());
app.use(cors(corsOptions));

app.get("/", (_req : express.Request, res : express.Response) => {
    console.log("[GET]: /")
    res.send("Welcome to ToDo Notes application");
});

// Mount all API routes under /api
app.use("/api", notesRouter)

app.listen(Number(PORT), HOST, () => {
    console.log(`Server is running on http://${HOST}:${PORT}`);
});