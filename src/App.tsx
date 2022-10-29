import { Route, Routes, useParams } from "react-router-dom";

function App() {
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
          <div>
            <h3>Home page</h3>
          </div>
        }
      />
      <Route path="/:id" element={<Child />} />
    </Routes>
  );
}

function Child() {
  const { id } = useParams();

  return (
    <div>
      <h3>ID: {id}</h3>
    </div>
  );
}

export default App;
