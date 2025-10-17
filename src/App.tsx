import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/dashboard-page";
import { SidebarLayout } from "./components/layouts/sidebar-layout";
import MonitoringPage from "./pages/monitoring-page";
import Logs from "./pages/logs-page";

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
        <Route
          path="/monitoring"
          element={
            <SidebarLayout>
              <MonitoringPage />
            </SidebarLayout>
          }
        />
        <Route
          path="/logs"
          element={
            <SidebarLayout>
              <Logs />
            </SidebarLayout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
