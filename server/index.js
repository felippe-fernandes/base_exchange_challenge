import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import { App } from "@tinyhttp/app";
import { json } from "milliparsec";
import { createApp } from "json-server/lib/app.js";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const dbPath = join(__dirname, "db.json");

const adapter = new JSONFile(dbPath);
const db = new Low(adapter, { orders: [], executions: [], statusHistory: [] });
await db.read();

const root = new App();
root.use(json());

// Custom endpoint: get unique values for a filterable field
root.get("/orders/filters/:field", async (req, res) => {
  const { field } = req.params;
  const q = req.query?.q;

  await db.read();

  const allowedFields = ["instrument", "side", "status"];
  if (!allowedFields.includes(field)) {
    res.status(400).json({ error: `Invalid filter field: ${field}` });
    return;
  }

  let values = [...new Set(db.data.orders.map((order) => order[field]))].sort();

  if (q) {
    const query = q.toLowerCase();
    values = values.filter((v) => String(v).toLowerCase().includes(query));
  }

  res.json(values);
});

// Mount json-server for everything else
const jsonServerApp = createApp(db, { logger: false });
root.use("/", jsonServerApp);

const PORT = process.env.PORT || 3001;
root.listen(PORT, () => {
  console.log(`JSON Server running on http://localhost:${PORT}`);
});