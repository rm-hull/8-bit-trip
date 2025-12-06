import { Navigate, Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home";

export function App() {
  return (
    <Routes>
      <Route
        path="/about"
        element={
          <div>
            <h3>About page</h3>
          </div>
        }
      />
      <Route
        path="/"
        element={
          <Navigate
            to="/eyJzYW1wbGVSYXRlIjo4MDAwLCJhbGdvcml0aG0iOiIoKDEtKCgodCsxMCk%2BPigodD4%2BOSkmKCh0Pj4xNCkpKSkmKHQ%2BPjQmLTIpKSkqMikqKCgodD4%2BMTApXigodCsoKHQ%2BPjYpJjEyNykpPj4xMCkpJjEpKjMyKzEyOCJ9"
            replace
          />
        }
      />
      <Route path="/:code" element={<Home />} />
    </Routes>
  );
}
