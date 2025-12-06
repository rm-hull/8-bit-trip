import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    // eslint-disable-next-line @typescript-eslint/only-throw-error
    throw redirect({
      to: "/$code",
      params: {
        code: "eyJzYW1wbGVSYXRlIjo4MDAwLCJhbGdvcml0aG0iOiIoKDEtKCgodCsxMCk+PigodD4+OSkmKCh0Pj4xNCkpKSkmKHQ+PjQmLTIpKSkqMikqKCgodD4+MTApXigodCsoKHQ+PjYpJjEyNykpPj4xMCkpJjEpKjMyKzEyOCJ9",
      },
    });
  },
});
