const fs = require("fs");
const path = require("path");

const INSTRUMENTS = [
  // Acoes brasileiras
  { symbol: "PETR4", minPrice: 25, maxPrice: 40 },
  { symbol: "VALE3", minPrice: 60, maxPrice: 85 },
  { symbol: "ITUB4", minPrice: 28, maxPrice: 38 },
  { symbol: "BBDC4", minPrice: 12, maxPrice: 18 },
  { symbol: "ABEV3", minPrice: 10, maxPrice: 16 },
  { symbol: "WEGE3", minPrice: 35, maxPrice: 55 },
  { symbol: "RENT3", minPrice: 40, maxPrice: 65 },
  { symbol: "BBAS3", minPrice: 24, maxPrice: 35 },
  { symbol: "SUZB3", minPrice: 45, maxPrice: 65 },
  { symbol: "HAPV3", minPrice: 3, maxPrice: 6 },
  { symbol: "MGLU3", minPrice: 1, maxPrice: 4 },
  { symbol: "B3SA3", minPrice: 10, maxPrice: 15 },
  { symbol: "ELET3", minPrice: 35, maxPrice: 50 },
  { symbol: "CSAN3", minPrice: 12, maxPrice: 20 },
  { symbol: "RADL3", minPrice: 22, maxPrice: 30 },
  // Acoes americanas
  { symbol: "AAPL", minPrice: 160, maxPrice: 200 },
  { symbol: "MSFT", minPrice: 350, maxPrice: 430 },
  { symbol: "GOOGL", minPrice: 130, maxPrice: 175 },
  { symbol: "AMZN", minPrice: 150, maxPrice: 200 },
  { symbol: "TSLA", minPrice: 180, maxPrice: 280 },
  { symbol: "NVDA", minPrice: 600, maxPrice: 950 },
  { symbol: "META", minPrice: 400, maxPrice: 550 },
  // Cripto
  { symbol: "BTCUSD", minPrice: 55000, maxPrice: 72000 },
  { symbol: "ETHUSD", minPrice: 2800, maxPrice: 4000 },
  { symbol: "SOLUSD", minPrice: 80, maxPrice: 180 },
];

const STATUSES = ["open", "partial", "executed", "cancelled"];
const SIDES = ["buy", "sell"];

function randomFloat(min, max, decimals = 2) {
  return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomDate(daysBack = 90) {
  const now = Date.now();
  const past = now - daysBack * 24 * 60 * 60 * 1000;
  return new Date(past + Math.random() * (now - past));
}

function generateOrders(count) {
  const orders = [];
  const statusHistory = [];
  const executions = [];

  let historyId = 1;
  let executionId = 1;

  for (let i = 1; i <= count; i++) {
    const instrument = randomElement(INSTRUMENTS);
    const side = randomElement(SIDES);
    const price = randomFloat(instrument.minPrice, instrument.maxPrice);
    const quantity = randomInt(1, 500) * 100;
    const createdAt = randomDate();
    const updatedAt = new Date(
      createdAt.getTime() + randomInt(0, 3600000)
    );

    // Weighted status distribution: more open/executed than cancelled
    const statusRoll = Math.random();
    let status;
    if (statusRoll < 0.3) status = "open";
    else if (statusRoll < 0.5) status = "partial";
    else if (statusRoll < 0.85) status = "executed";
    else status = "cancelled";

    let remainingQuantity;
    if (status === "executed") {
      remainingQuantity = 0;
    } else if (status === "cancelled") {
      remainingQuantity = 0;
    } else if (status === "partial") {
      remainingQuantity = randomInt(1, Math.floor(quantity / 100) - 1) * 100;
    } else {
      remainingQuantity = quantity;
    }

    const order = {
      id: String(i),
      instrument: instrument.symbol,
      side,
      price,
      quantity,
      remainingQuantity,
      status,
      createdAt: createdAt.toISOString(),
      updatedAt: updatedAt.toISOString(),
    };

    orders.push(order);

    // Status history: every order starts as "open"
    statusHistory.push({
      id: String(historyId++),
      orderId: String(i),
      fromStatus: null,
      toStatus: "open",
      timestamp: createdAt.toISOString(),
      reason: "Order created",
    });

    // Additional history based on final status
    if (status === "partial") {
      const partialAt = new Date(
        createdAt.getTime() + randomInt(1000, 1800000)
      );
      statusHistory.push({
        id: String(historyId++),
        orderId: String(i),
        fromStatus: "open",
        toStatus: "partial",
        timestamp: partialAt.toISOString(),
        reason: "Partially matched",
      });
    }

    if (status === "executed") {
      const executedAt = new Date(
        createdAt.getTime() + randomInt(1000, 3600000)
      );

      // Some executed orders go through partial first
      if (Math.random() < 0.3) {
        const partialAt = new Date(
          createdAt.getTime() + randomInt(1000, 1800000)
        );
        statusHistory.push({
          id: String(historyId++),
          orderId: String(i),
          fromStatus: "open",
          toStatus: "partial",
          timestamp: partialAt.toISOString(),
          reason: "Partially matched",
        });
        statusHistory.push({
          id: String(historyId++),
          orderId: String(i),
          fromStatus: "partial",
          toStatus: "executed",
          timestamp: executedAt.toISOString(),
          reason: "Fully matched",
        });
      } else {
        statusHistory.push({
          id: String(historyId++),
          orderId: String(i),
          fromStatus: "open",
          toStatus: "executed",
          timestamp: executedAt.toISOString(),
          reason: "Fully matched",
        });
      }

      // Create execution record
      const counterpartId = randomInt(1, count);
      executions.push({
        id: String(executionId++),
        buyOrderId: side === "buy" ? String(i) : String(counterpartId),
        sellOrderId: side === "sell" ? String(i) : String(counterpartId),
        instrument: instrument.symbol,
        price,
        quantity: quantity - remainingQuantity,
        executedAt: executedAt.toISOString(),
      });
    }

    if (status === "cancelled") {
      const cancelledAt = new Date(
        createdAt.getTime() + randomInt(1000, 7200000)
      );
      statusHistory.push({
        id: String(historyId++),
        orderId: String(i),
        fromStatus: "open",
        toStatus: "cancelled",
        timestamp: cancelledAt.toISOString(),
        reason: randomElement([
          "Cancelled by user",
          "Market closed",
          "Risk limit exceeded",
          "Strategy adjustment",
        ]),
      });
    }
  }

  return { orders, statusHistory, executions };
}

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
