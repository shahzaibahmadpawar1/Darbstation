import express from "express";
import session from "express-session";
import path from "path";
import { registerRoutes } from "./routes";

const app = express();

// app.set("trust proxy", 1); // uncomment if you force HTTPS via proxy

app.use(express.json());

app.use(
session({
secret: process.env.SESSION_SECRET || "replace-me",
resave: false,
saveUninitialized: false,
cookie: { sameSite: "lax" } // set secure: true after HTTPS is configured
})
);

// Register API routes (login, pumps, assets)
registerRoutes(app);

// Serve React build
const publicDir = path.join(process.cwd(), "dist", "public");
app.use(express.static(publicDir));
app.get("*", (_req, res) => res.sendFile(path.join(publicDir, "index.html")));

const PORT = Number(process.env.PORT || 3000);
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));