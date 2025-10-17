import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/dashboard-page";
import { SidebarLayout } from "./components/layouts/sidebar-layout";

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <SidebarLayout>
              <Dashboard />
            </SidebarLayout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
