import express, { Request, Response } from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import eventsRouter from "./routes/events.js";
import photosRouter from "./routes/photos.js";
import Database from "./services/database.js";
import CloudinaryStorage from "./services/cloudinaryStorage.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function createApp() {
    const app = express();

    const db = new Database();
    const storage = new CloudinaryStorage();

    await storage.init();

    app.locals.db = db;
    app.locals.storage = storage;

    app.use(cors({
        origin: ["http://localhost:5173"],
        credentials: true,
    }));

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.use(express.static(path.join(__dirname, "..", "public")));

    app.get("/", (_req: Request, res: Response) => {
        res.send("Circlo API Server");
    });

    app.get("/health", (_req: Request, res: Response) => {
        res.json({ status: "Running" });
    });

    app.use("/api", eventsRouter);
    app.use("/api", photosRouter);

    return app;
}