import { beforeEach, describe, expect, it } from "vitest";
import { DEFAULT_USER_CONFIG } from "@/lib/schemas/userConfig.schema";
import { useUserConfigStore } from "./userConfigStore";

describe("userConfigStore", () => {
  beforeEach(() => {
    localStorage.clear();
    useUserConfigStore.setState({
      ...DEFAULT_USER_CONFIG,
      tableDefaults: { tableId: "", defaultSort: "", columnOrder: [] },
    });
  });

  it("initializes defaults and updates table values", () => {
    const store = useUserConfigStore.getState();
    store.initDefaults({ tableId: "orders", defaultSort: "-createdAt", columnOrder: ["id"] });

    expect(useUserConfigStore.getState().defaultSort).toBe("-createdAt");
    expect(useUserConfigStore.getState().getTableConfig().columnOrder).toEqual(["id"]);

    store.setDefaultSort("price");
    store.setPerPage(100);
    store.setColumnOrder(["price"]);
    store.setColumnSizing({ price: 100 });

    expect(useUserConfigStore.getState()).toMatchObject({
      defaultSort: "price",
      perPage: 100,
    });
    expect(useUserConfigStore.getState().getTableConfig()).toEqual({
      columnOrder: ["price"],
      columnSizing: { price: 100 },
    });
  });

  it("stores and updates user preferences", () => {
    const store = useUserConfigStore.getState();

    store.setTheme("dark");
    store.setPreferredCurrency("BRL");
    store.setDateFormat("br");
    store.setTimeFormat("12h");

    expect(useUserConfigStore.getState()).toMatchObject({
      theme: "dark",
      preferredCurrency: "BRL",
      dateFormat: "br",
      timeFormat: "12h",
    });
  });

  it("resets column settings using table defaults", () => {
    useUserConfigStore.getState().initDefaults({
      tableId: "orders",
      defaultSort: "-createdAt",
      columnOrder: ["id", "price"],
    });
    useUserConfigStore.getState().setColumnOrder(["price"]);
    useUserConfigStore.getState().setColumnSizing({ price: 100 });

    const store = useUserConfigStore.getState();
    store.resetColumnOrder();
    store.resetColumnSizing();

    expect(useUserConfigStore.getState().getTableConfig()).toEqual({
      columnOrder: ["id", "price"],
      columnSizing: {},
    });
  });
});
