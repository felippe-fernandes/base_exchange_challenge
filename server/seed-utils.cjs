const { randomUUID } = require("crypto");
const { INSTRUMENTS } = require("./instruments");

const SIDES = ["buy", "sell"];

function getCcy(symbol) {
  if (symbol.endsWith("USD")) return "USD";
  if (/\d+$/.test(symbol)) return "BRL";
  return "USD";
}

function randomFloat(min, max, decimals = 2) {
  return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomDate(daysBack = 7) {
  const now = Date.now();
  const past = now - daysBack * 24 * 60 * 60 * 1000;
  return new Date(past + Math.random() * (now - past));
}

function generateOrders(count) {
  const orders = [];
  const statusHistory = [];
  const executions = [];

  const orderIds = [];

  for (let i = 0; i < count; i++) {
    const orderId = randomUUID();
    orderIds.push(orderId);

    const instrument = randomElement(INSTRUMENTS);
    const side = randomElement(SIDES);
    const ccy = getCcy(instrument.symbol);
    const priceValue = randomFloat(instrument.minPrice, instrument.maxPrice);
    const price = { value: priceValue, ccy };
    const quantity = randomInt(1, 500) * 100;
    const createdAt = randomDate();
    const updatedAt = new Date(
      createdAt.getTime() + randomInt(0, 3600000)
    );

    const statusRoll = Math.random();
    let status;
    if (statusRoll < 0.3) status = "open";
    else if (statusRoll < 0.5) status = "partial";
    else if (statusRoll < 0.85) status = "executed";
    else status = "cancelled";

    let remainingQuantity;
    if (status === "executed" || status === "cancelled") {
      remainingQuantity = 0;
    } else if (status === "partial") {
      remainingQuantity = randomInt(1, Math.floor(quantity / 100) - 1) * 100;
    } else {
      remainingQuantity = quantity;
    }

    orders.push({
      id: orderId,
      instrument: instrument.symbol,
      side,
      price,
      quantity,
      remainingQuantity,
      status,
      createdAt: createdAt.toISOString(),
      updatedAt: updatedAt.toISOString(),
    });

    statusHistory.push({
      id: randomUUID(),
      orderId,
      fromStatus: null,
      toStatus: "open",
      timestamp: createdAt.toISOString(),
      reason: "Order created",
    });

    if (status === "partial") {
      const partialAt = new Date(
        createdAt.getTime() + randomInt(1000, 1800000)
      );
      statusHistory.push({
        id: randomUUID(),
        orderId,
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

      if (Math.random() < 0.3) {
        const partialAt = new Date(
          createdAt.getTime() + randomInt(1000, 1800000)
        );
        statusHistory.push({
          id: randomUUID(),
          orderId,
          fromStatus: "open",
          toStatus: "partial",
          timestamp: partialAt.toISOString(),
          reason: "Partially matched",
        });
        statusHistory.push({
          id: randomUUID(),
          orderId,
          fromStatus: "partial",
          toStatus: "executed",
          timestamp: executedAt.toISOString(),
          reason: "Fully matched",
        });
      } else {
        statusHistory.push({
          id: randomUUID(),
          orderId,
          fromStatus: "open",
          toStatus: "executed",
          timestamp: executedAt.toISOString(),
          reason: "Fully matched",
        });
      }

      const counterpartId = randomElement(orderIds);
      executions.push({
        id: randomUUID(),
        buyOrderId: side === "buy" ? orderId : counterpartId,
        sellOrderId: side === "sell" ? orderId : counterpartId,
        instrument: instrument.symbol,
        price: { value: priceValue, ccy },
        quantity: quantity - remainingQuantity,
        executedAt: executedAt.toISOString(),
      });
    }

    if (status === "cancelled") {
      const cancelledAt = new Date(
        createdAt.getTime() + randomInt(1000, 7200000)
      );
      statusHistory.push({
        id: randomUUID(),
        orderId,
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

module.exports = {
  SIDES,
  getCcy,
  randomFloat,
  randomInt,
  randomElement,
  randomDate,
  generateOrders,
};
