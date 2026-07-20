import dotenv from "dotenv";
dotenv.config();

import { createServer } from "http";
import { createApp } from "./app.js";
import { initializeSocket } from "./services/socket.js";
import "./config/mongoose-connection.js";

async function startServer() {
    try {
        const app = await createApp();

        const httpServer = createServer(app);

        const io = initializeSocket(httpServer);
        app.locals.io = io;

        const PORT = process.env.PORT || 3001;

        httpServer.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });

    } catch (err) {
        console.error("Server failed to start");
    }
}

startServer();