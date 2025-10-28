import type { Express, Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import { pool } from "./db";

// Simple auth guard for /api/* except /api/login and /api/logout
function authGuard(req: Request, res: Response, next: NextFunction) {
const open = req.path === "/api/login" || req.path === "/api/logout";
if (open) return next();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const uid = (req.session as any)?.userId;
if (!uid && req.path.startsWith("/api")) return res.status(401).json({ message: "Unauthorized" });
next();
}

export function registerRoutes(app: Express) {
app.use(authGuard);

// AUTH
app.post("/api/login", async (req, res) => {
const { username, password } = req.body as { username: string; password: string };
if (!username || !password) return res.status(400).json({ message: "Missing credentials" });
const [rows] = await pool.query("SELECT id, password_hash FROM users WHERE username=?", [username]);
const user = (rows as any[])[0];
if (!user || !(await bcrypt.compare(password, user.password_hash))) {
  return res.status(401).json({ message: "Invalid credentials" });
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(req.session as any).userId = user.id;
res.json({ ok: true });
});

app.post("/api/logout", (req, res) => {
req.session.destroy(() => res.json({ ok: true }));
});

// PUMPS
app.get("/api/pumps", async (_req, res) => {
const [rows] = await pool.query("SELECT * FROM pumps ORDER BY id DESC");
res.json(rows);
});

app.post("/api/pumps", async (req, res) => {
const { name, location, manager } = req.body as { name: string; location: string; manager: string };
if (!name || !location || !manager) return res.status(400).json({ message: "Missing fields" });
const [r] = await pool.query("INSERT INTO pumps (name, location, manager) VALUES (?,?,?)", [name, location, manager]);
res.status(201).json({ id: (r as any).insertId, name, location, manager, asset_count: 0 });
});

app.put("/api/pumps/:id", async (req, res) => {
const { id } = req.params as { id: string };
const { name, location, manager } = req.body as { name: string; location: string; manager: string };
await pool.query("UPDATE pumps SET name=?, location=?, manager=? WHERE id=?", [name, location, manager, id]);
res.json({ ok: true });
});

app.delete("/api/pumps/:id", async (req, res) => {
const { id } = req.params as { id: string };
await pool.query("DELETE FROM pumps WHERE id=?", [id]);
res.json({ ok: true });
});

// ASSETS
app.get("/api/assets/pump/:pumpId", async (req, res) => {
const { pumpId } = req.params as { pumpId: string };
const [rows] = await pool.query("SELECT * FROM assets WHERE pump_id=? ORDER BY id DESC", [pumpId]);
res.json(rows);
});

app.post("/api/assets", async (req, res) => {
const { pump_id, serial_number, asset_name, asset_number, barcode, quantity, units, remarks } = req.body as {
pump_id: number; serial_number: string; asset_name: string; asset_number: string; barcode?: string;
quantity: number; units: string; remarks?: string | null;
};
const [r] = await pool.query(
"INSERT INTO assets (pump_id, serial_number, asset_name, asset_number, barcode, quantity, units, remarks) VALUES (?,?,?,?,?,?,?,?)",
[pump_id, serial_number, asset_name, asset_number, barcode ?? null, quantity, units, remarks ?? null]
);
res.status(201).json({ id: (r as any).insertId });
});

app.put("/api/assets/:id", async (req, res) => {
const { id } = req.params as { id: string };
const { serial_number, asset_name, asset_number, barcode, quantity, units, remarks } = req.body as {
serial_number: string; asset_name: string; asset_number: string; barcode?: string;
quantity: number; units: string; remarks?: string | null;
};
await pool.query(
"UPDATE assets SET serial_number=?, asset_name=?, asset_number=?, barcode=?, quantity=?, units=?, remarks=? WHERE id=?",
[serial_number, asset_name, asset_number, barcode ?? null, quantity, units, remarks ?? null, id]
);
res.json({ ok: true });
});

app.delete("/api/assets/:id", async (req, res) => {
const { id } = req.params as { id: string };
await pool.query("DELETE FROM assets WHERE id=?", [id]);
res.json({ ok: true });
});
}