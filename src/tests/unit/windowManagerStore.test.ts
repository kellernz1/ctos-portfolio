import { beforeEach, describe, expect, it } from "vitest";
import { useWindowManagerStore } from "../../stores/windowManagerStore";

describe("windowManagerStore", () => {
  beforeEach(() => {
    useWindowManagerStore.setState({ windows: [], focusedId: null });
  });

  it("opens and focuses a window", () => {
    useWindowManagerStore.getState().openWindow("projects");
    const state = useWindowManagerStore.getState();
    expect(state.windows).toHaveLength(1);
    expect(state.windows[0].component).toBe("projects");
    expect(state.focusedId).toBe(state.windows[0].id);
  });

  it("closes all windows", () => {
    useWindowManagerStore.getState().openWindow("about");
    useWindowManagerStore.getState().openWindow("skills");
    useWindowManagerStore.getState().closeAll();
    expect(useWindowManagerStore.getState().windows).toHaveLength(0);
  });
});
