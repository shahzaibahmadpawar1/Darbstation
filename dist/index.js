// server/index.ts
import express from "express";
import session from "express-session";
import path from "path";

// server/routes.ts
import bcrypt from "bcryptjs";

// server/db.ts
import mysql from "mysql2/promise";
var pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DB,
  waitForConnections: true,
  connectionLimit: 10
});

// server/routes.ts
function authGuard(req, res, next) {
  const open = req.path === "/api/login" || req.path === "/api/logout";
  if (open) return next();
  const uid = req.session?.userId;
  if (!uid && req.path.startsWith("/api")) return res.status(401).json({ message: "Unauthorized" });
  next();
}
function registerRoutes(app2) {
  app2.use(authGuard);
  app2.post("/api/login", async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ message: "Missing credentials" });
    const [rows] = await pool.query("SELECT id, password_hash FROM users WHERE username=?", [username]);
    const user = rows[0];
    if (!user || !await bcrypt.compare(password, user.password_hash)) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    req.session.userId = user.id;
    res.json({ ok: true });
  });
  app2.post("/api/logout", (req, res) => {
    req.session.destroy(() => res.json({ ok: true }));
  });
  app2.get("/api/pumps", async (_req, res) => {
    const [rows] = await pool.query("SELECT * FROM pumps ORDER BY id DESC");
    res.json(rows);
  });
  app2.post("/api/pumps", async (req, res) => {
    const { name, location, manager } = req.body;
    if (!name || !location || !manager) return res.status(400).json({ message: "Missing fields" });
    const [r] = await pool.query("INSERT INTO pumps (name, location, manager) VALUES (?,?,?)", [name, location, manager]);
    res.status(201).json({ id: r.insertId, name, location, manager, asset_count: 0 });
  });
  app2.put("/api/pumps/:id", async (req, res) => {
    const { id } = req.params;
    const { name, location, manager } = req.body;
    await pool.query("UPDATE pumps SET name=?, location=?, manager=? WHERE id=?", [name, location, manager, id]);
    res.json({ ok: true });
  });
  app2.delete("/api/pumps/:id", async (req, res) => {
    const { id } = req.params;
    await pool.query("DELETE FROM pumps WHERE id=?", [id]);
    res.json({ ok: true });
  });
  app2.get("/api/assets/pump/:pumpId", async (req, res) => {
    const { pumpId } = req.params;
    const [rows] = await pool.query("SELECT * FROM assets WHERE pump_id=? ORDER BY id DESC", [pumpId]);
    res.json(rows);
  });
  app2.post("/api/assets", async (req, res) => {
    const { pump_id, serial_number, asset_name, asset_number, barcode, quantity, units, remarks } = req.body;
    const [r] = await pool.query(
      "INSERT INTO assets (pump_id, serial_number, asset_name, asset_number, barcode, quantity, units, remarks) VALUES (?,?,?,?,?,?,?,?)",
      [pump_id, serial_number, asset_name, asset_number, barcode ?? null, quantity, units, remarks ?? null]
    );
    res.status(201).json({ id: r.insertId });
  });
  app2.put("/api/assets/:id", async (req, res) => {
    const { id } = req.params;
    const { serial_number, asset_name, asset_number, barcode, quantity, units, remarks } = req.body;
    await pool.query(
      "UPDATE assets SET serial_number=?, asset_name=?, asset_number=?, barcode=?, quantity=?, units=?, remarks=? WHERE id=?",
      [serial_number, asset_name, asset_number, barcode ?? null, quantity, units, remarks ?? null, id]
    );
    res.json({ ok: true });
  });
  app2.delete("/api/assets/:id", async (req, res) => {
    const { id } = req.params;
    await pool.query("DELETE FROM assets WHERE id=?", [id]);
    res.json({ ok: true });
  });
}

// server/index.ts
var app = express();
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET || "replace-me",
    resave: false,
    saveUninitialized: false,
    cookie: { sameSite: "lax" }
    // set secure: true after HTTPS is configured
  })
);
registerRoutes(app);
var publicDir = path.join(process.cwd(), "dist", "public");
app.use(express.static(publicDir));
app.get("*", (_req, res) => res.sendFile(path.join(publicDir, "index.html")));
var PORT = Number(process.env.PORT || 3e3);
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
