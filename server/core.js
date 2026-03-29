export function getOrderValue(order, field) {
  const val = order[field];
  return val && typeof val === "object" && "value" in val ? val.value : val;
}

export function hasCustomFilter(query) {
  const filterFields = ["instrument", "side", "status"];
  const hasMultiValue = filterFields.some((f) => query[f]?.includes(","));
  const hasLike = Object.keys(query).some((k) => k.endsWith("_like"));
  const hasRange = Object.keys(query).some((k) => k.endsWith("_gte") || k.endsWith("_lte"));
  return hasMultiValue || hasLike || hasRange;
}

export function applyFilters(results, query) {
  const filterFields = ["instrument", "side", "status"];

  for (const field of filterFields) {
    const value = query[field];
    if (value && value.includes(",")) {
      const values = value.split(",");
      results = results.filter((order) => values.includes(order[field]));
    } else if (value) {
      results = results.filter((order) => order[field] === value);
    }
  }

  if (query.id_like) {
    const search = query.id_like.toLowerCase();
    results = results.filter((order) =>
      order.id.toLowerCase().includes(search),
    );
  }

  const rangeFields = ["price", "quantity", "remainingQuantity", "createdAt"];
  for (const field of rangeFields) {
    const gte = query[`${field}_gte`];
    const lte = query[`${field}_lte`];

    if (gte !== undefined) {
      if (field === "createdAt") {
        results = results.filter((order) => order.createdAt >= gte);
      } else {
        const min = Number(gte);
        results = results.filter((order) => getOrderValue(order, field) >= min);
      }
    }

    if (lte !== undefined) {
      if (field === "createdAt") {
        results = results.filter((order) => order.createdAt <= lte);
      } else {
        const max = Number(lte);
        results = results.filter((order) => getOrderValue(order, field) <= max);
      }
    }
  }

  return results;
}

export function applySort(results, sortParam) {
  if (!sortParam) return results;

  const sortFields = sortParam.split(",").map((s) => {
    const desc = s.startsWith("-");
    return { field: desc ? s.slice(1) : s, desc };
  });

  results.sort((a, b) => {
    for (const { field, desc } of sortFields) {
      const aVal = getOrderValue(a, field);
      const bVal = getOrderValue(b, field);
      if (aVal < bVal) return desc ? 1 : -1;
      if (aVal > bVal) return desc ? -1 : 1;
    }
    return 0;
  });

  return results;
}

export function addStatusHistory(db, orderId, fromStatus, toStatus, timestamp, reason) {
  db.data.statusHistory.push({
    id: crypto.randomUUID(),
    orderId,
    fromStatus,
    toStatus,
    timestamp,
    reason,
  });
}

export function resolveStatus(order) {
  if (order.remainingQuantity === 0) return "executed";
  if (order.remainingQuantity < order.quantity) return "partial";
  return order.status;
}

export function matchOrder(db, incomingOrder, now) {
  if (incomingOrder.status !== "open") return;

  const counterSide = incomingOrder.side === "buy" ? "sell" : "buy";
  const isBuy = incomingOrder.side === "buy";

  const candidates = db.data.orders.filter((o) =>
    o.id !== incomingOrder.id &&
    o.instrument === incomingOrder.instrument &&
    o.price.ccy === incomingOrder.price.ccy &&
    o.side === counterSide &&
    (o.status === "open" || o.status === "partial") &&
    o.remainingQuantity > 0 &&
    (isBuy ? o.price.value <= incomingOrder.price.value : o.price.value >= incomingOrder.price.value)
  );

  candidates.sort((a, b) => {
    const priceDir = isBuy ? a.price.value - b.price.value : b.price.value - a.price.value;
    if (priceDir !== 0) return priceDir;
    return a.createdAt < b.createdAt ? -1 : 1;
  });

  for (const candidate of candidates) {
    if (incomingOrder.remainingQuantity <= 0) break;

    const fillQty = Math.min(incomingOrder.remainingQuantity, candidate.remainingQuantity);
    const executionPrice = candidate.price;

    db.data.executions.push({
      id: crypto.randomUUID(),
      buyOrderId: isBuy ? incomingOrder.id : candidate.id,
      sellOrderId: isBuy ? candidate.id : incomingOrder.id,
      instrument: incomingOrder.instrument,
      price: { value: executionPrice.value, ccy: executionPrice.ccy },
      quantity: fillQty,
      executedAt: now,
    });

    const prevCandidateStatus = candidate.status;
    candidate.remainingQuantity -= fillQty;
    candidate.updatedAt = now;
    const newCandidateStatus = resolveStatus(candidate);
    if (newCandidateStatus !== prevCandidateStatus) {
      candidate.status = newCandidateStatus;
      addStatusHistory(db, candidate.id, prevCandidateStatus, newCandidateStatus, now,
        `Matched with order ${incomingOrder.id.slice(0, 8)}, filled ${fillQty} at ${executionPrice.value} ${executionPrice.ccy}`);
    }

    const prevIncomingStatus = incomingOrder.status;
    incomingOrder.remainingQuantity -= fillQty;
    incomingOrder.updatedAt = now;
    const newIncomingStatus = resolveStatus(incomingOrder);
    if (newIncomingStatus !== prevIncomingStatus) {
      incomingOrder.status = newIncomingStatus;
      addStatusHistory(db, incomingOrder.id, prevIncomingStatus, newIncomingStatus, now,
        `Matched with order ${candidate.id.slice(0, 8)}, filled ${fillQty} at ${executionPrice.value} ${executionPrice.ccy}`);
    }
  }
}
