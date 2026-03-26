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
const db = new Low(adapter, {
  orders: [],
  executions: [],
  statusHistory: [],
});
await db.read();

const root = new App();
root.use(json());

root.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }
  next();
});

root.get("/orders/filters/:field", async (req, res) => {
  const { field } = req.params;
  const q = req.query?.q;

  await db.read();

  const allowedFields = ["instrument", "side", "status"];
  if (!allowedFields.includes(field)) {
    res.status(400).json({ error: `Invalid filter field: ${field}` });
    return;
  }

  let values = [
    ...new Set(db.data.orders.map((order) => order[field])),
  ].sort();

  if (q) {
    const query = q.toLowerCase();
    values = values.filter((v) => String(v).toLowerCase().includes(query));
  }

  res.json(values);
});

root.use("/orders", async (req, res, next) => {
  const filterFields = ["instrument", "side", "status"];
  const hasMultiValue = filterFields.some((f) =>
    req.query[f]?.includes(",")
  );

  if (!hasMultiValue) {
    next();
    return;
  }

  await db.read();

  let results = [...db.data.orders];

  for (const field of filterFields) {
    const value = req.query[field];
    if (value && value.includes(",")) {
      const values = value.split(",");
      results = results.filter((order) => values.includes(order[field]));
    } else if (value) {
      results = results.filter((order) => order[field] === value);
    }
  }

  const sort = req.query._sort;
  if (sort) {
    const desc = sort.startsWith("-");
    const field = desc ? sort.slice(1) : sort;
    const getValue = (obj) => {
      const val = obj[field];
      return val && typeof val === "object" && "value" in val ? val.value : val;
    };
    results.sort((a, b) => {
      const aVal = getValue(a);
      const bVal = getValue(b);
      if (aVal < bVal) return desc ? 1 : -1;
      if (aVal > bVal) return desc ? -1 : 1;
      return 0;
    });
  }

  const page = parseInt(req.query._page) || 1;
  const perPage = parseInt(req.query._per_page) || 10;
  const total = results.length;
  const pages = Math.ceil(total / perPage);
  const start = (page - 1) * perPage;
  const data = results.slice(start, start + perPage);

  res.json({
    data,
    first: 1,
    prev: page > 1 ? page - 1 : null,
    next: page < pages ? page + 1 : null,
    last: pages,
    pages,
    items: total,
  });
});

const jsonServerApp = createApp(db, { logger: false });
root.use("/", jsonServerApp);

const PORT = process.env.PORT || 3001;
root.listen(PORT, () => {
  console.log(`JSON Server running on http://localhost:${PORT}`);
});
