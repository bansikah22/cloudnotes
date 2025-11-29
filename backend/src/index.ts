import express from "express";
import notesRouter from "./routes.js"

const PORT = process.env['PORT'] || 5000;
const HOST = process.env['HOST'] || '0.0.0.0';
const app = express();

app.use(express.json());

app.get("/", (_req : express.Request, res : express.Response) => {
    console.log("[GET]: /")
    res.send("Welcome to ToDo Notes application");
});

// Mount all API routes under /api
app.use("/api", notesRouter)

app.listen(PORT, () => {
    console.log(`Server is running on http://${HOST}:${PORT}`);
});