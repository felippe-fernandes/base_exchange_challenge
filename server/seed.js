const { writeSeedFile } = require("./seed-utils.cjs");

const DEFAULT_ORDER_COUNT = 1200;

function resolveOrderCount(argv = process.argv, lifecycleEvent = process.env.npm_lifecycle_event ?? "") {
  const argValue = Number(argv[2]);
  if (Number.isInteger(argValue) && argValue > 0) {
    return argValue;
  }

  const suffix = lifecycleEvent.split(":")[1];
  const eventValue = Number(suffix);
  if (Number.isInteger(eventValue) && eventValue > 0) {
    return eventValue;
  }

  return DEFAULT_ORDER_COUNT;
}

function main() {
  const orderCount = resolveOrderCount();

  console.log(`Generating ${orderCount} orders...`);
  const { counts, outputPath } = writeSeedFile(orderCount);

  console.log(`Done! Created:`);
  console.log(`  - ${counts.orders} orders`);
  console.log(`  - ${counts.statusHistory} status history entries`);
  console.log(`  - ${counts.executions} executions`);
  console.log(`Output: ${outputPath}`);
}

if (require.main === module) {
  main();
}

module.exports = {
  DEFAULT_ORDER_COUNT,
  resolveOrderCount,
  main,
};
