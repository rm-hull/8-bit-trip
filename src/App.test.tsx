import { createMemoryHistory, createRouter, RouterProvider } from "@tanstack/react-router";
import { render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { Provider } from "./components/ui/provider";
import { routeTree } from "./routeTree.gen";

// Mock AudioContext if needed, though Home only uses it on interaction
// But just in case some component needs it
window.AudioContext = vi.fn().mockImplementation(() => ({
  createMediaStreamDestination: vi.fn(() => ({ stream: {} })),
  audioWorklet: {
    addModule: vi.fn(),
  },
})) as any;

test("renders app and handles redirect", async () => {
  const history = createMemoryHistory({ initialEntries: ["/"] });
  const router = createRouter({
    routeTree,
    history,
    // basepath is not strictly needed for memory history unless we simulate that path
  });

  render(
    <React.StrictMode>
      <Provider>
        <RouterProvider router={router} />
      </Provider>
    </React.StrictMode>
  );

  // Should redirect to the code route.
  // The Home component renders "Start" button.
  await waitFor(() => expect(screen.getByText("Start")).toBeInTheDocument());
});
