import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import { App } from "@tinyhttp/app";
import { createApp } from "json-server/lib/app.js";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import {
  addStatusHistory,
  applyFilters,
  applySort,
  getOrderValue,
  hasCustomFilter,
  matchOrder,
  resolveStatus,
} from "./core.js";

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

root.use((req, res, next) => {
  console.log(`→ ${req.method} ${req.url}`);
  if (req.method === "GET" || req.method === "OPTIONS" || req.body) return next();
  let body = "";
  req.on("data", (chunk) => { body += chunk; });
  req.on("end", () => {
    try { req.body = JSON.parse(body); } catch { req.body = {}; }
    console.log(`  body parsed:`, req.body);
    next();
  });
});

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

root.get("/orders/range/:field", async (req, res) => {
  const { field } = req.params;
  await db.read();

  const allowedFields = ["price", "quantity", "remainingQuantity"];
  if (!allowedFields.includes(field)) {
    res.status(400).json({ error: `Invalid range field: ${field}` });
    return;
  }

  const values = db.data.orders.map((order) => {
    const val = order[field];
    return val && typeof val === "object" && "value" in val ? val.value : val;
  });

  res.json({
    min: Math.min(...values),
    max: Math.max(...values),
  });
});

root.get("/executions/by-order/:orderId", async (req, res) => {
  const { orderId } = req.params;
  const { q, _page, _per_page } = req.query;
  await db.read();

  let results = db.data.executions.filter(
    (e) => e.buyOrderId === orderId || e.sellOrderId === orderId,
  );

  if (q) {
    const search = q.toLowerCase();
    results = results.filter(
      (e) =>
        e.id.toLowerCase().includes(search) ||
        e.instrument.toLowerCase().includes(search),
    );
  }

  const total = results.length;
  const page = parseInt(_page) || 1;
  const perPage = parseInt(_per_page) || 10;
  const pages = Math.ceil(total / perPage);
  const start = (page - 1) * perPage;

  res.json({
    data: results.slice(start, start + perPage),
    page,
    pages,
    items: total,
  });
});

function sendJson(res, status, data) {
  const body = JSON.stringify(data);
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Content-Length": Buffer.byteLength(body),
  });
  res.end(body);
}

root.post("/orders", async (req, res) => {
  try {
    await db.read();
    const now = new Date().toISOString();
    const order = {
      id: crypto.randomUUID(),
      ...req.body,
      remainingQuantity: req.body.remainingQuantity ?? req.body.quantity,
      status: req.body.status ?? "open",
      createdAt: req.body.createdAt ?? now,
      updatedAt: req.body.updatedAt ?? now,
    };
    db.data.orders.push(order);
    addStatusHistory(db, order.id, null, "open", now, "Order created");
    matchOrder(db, order, now);
    await db.write();
    console.log("Order created:", order.id, "status:", order.status);
    sendJson(res, 201, order);
  } catch (err) {
    console.error("POST /orders error:", err);
    sendJson(res, 500, { error: String(err) });
  }
});

root.delete("/orders/:id", async (req, res) => {
  await db.read();
  const index = db.data.orders.findIndex((o) => o.id === req.params.id);
  if (index === -1) return sendJson(res, 404, { error: "Not found" });
  db.data.orders.splice(index, 1);
  await db.write();
  sendJson(res, 200, {});
});

root.patch("/orders/:id", async (req, res) => {
  await db.read();
  const order = db.data.orders.find((o) => o.id === req.params.id);
  if (!order) return sendJson(res, 404, { error: "Not found" });
  const prevStatus = order.status;
  Object.assign(order, req.body);
  if (req.body.status && req.body.status !== prevStatus) {
    addStatusHistory(db, order.id, prevStatus, req.body.status, order.updatedAt || new Date().toISOString(),
      req.body.status === "cancelled" ? "Cancelled by user" : `Status changed to ${req.body.status}`);
  }
  await db.write();
  sendJson(res, 200, order);
});

root.use("/orders", async (req, res, next) => {
  if (req.method !== "GET" || !hasCustomFilter(req.query)) {
    next();
    return;
  }

  await db.read();

  let results = [...db.data.orders];
  results = applyFilters(results, req.query);
  results = applySort(results, req.query._sort);

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
