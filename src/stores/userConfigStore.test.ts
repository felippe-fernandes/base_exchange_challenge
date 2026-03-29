import { beforeEach, describe, expect, it } from "vitest";
import { useUserConfigStore } from "./userConfigStore";

describe("userConfigStore", () => {
  beforeEach(() => {
    localStorage.clear();
    useUserConfigStore.setState({
      defaultSort: "",
      perPage: 50,
      columnOrder: [],
      columnSizing: {},
      tableDefaults: { defaultSort: "", columnOrder: [] },
    });
  });

  it("initializes defaults and updates values", () => {
    const store = useUserConfigStore.getState();
    store.initDefaults({ defaultSort: "-createdAt", columnOrder: ["id"] });
    expect(useUserConfigStore.getState().defaultSort).toBe("-createdAt");
    expect(useUserConfigStore.getState().columnOrder).toEqual(["id"]);

    store.setDefaultSort("price");
    store.setPerPage(100);
    store.setColumnOrder(["price"]);
    store.setColumnSizing({ price: 100 });

    expect(useUserConfigStore.getState()).toMatchObject({
      defaultSort: "price",
      perPage: 100,
      columnOrder: ["price"],
      columnSizing: { price: 100 },
    });
  });

  it("resets column settings", () => {
    useUserConfigStore.setState({
      tableDefaults: { defaultSort: "-createdAt", columnOrder: ["id", "price"] },
      columnOrder: ["price"],
      columnSizing: { price: 100 },
    });

    const store = useUserConfigStore.getState();
    store.resetColumnOrder();
    store.resetColumnSizing();

    expect(useUserConfigStore.getState().columnOrder).toEqual(["id", "price"]);
    expect(useUserConfigStore.getState().columnSizing).toEqual({});
  });
});
