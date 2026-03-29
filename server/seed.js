const { randomUUID } = require("crypto");
const fs = require("fs");
const path = require("path");
const { generateOrders } = require("./seed-utils.cjs");

const ORDER_COUNT = 1200;

console.log(`Generating ${ORDER_COUNT} orders...`);
const db = generateOrders(ORDER_COUNT);

const outputPath = path.join(__dirname, "db.json");
fs.writeFileSync(outputPath, JSON.stringify(db, null, 2));

console.log(`Done! Created:`);
console.log(`  - ${db.orders.length} orders`);
console.log(`  - ${db.statusHistory.length} status history entries`);
console.log(`  - ${db.executions.length} executions`);
console.log(`Output: ${outputPath}`);
