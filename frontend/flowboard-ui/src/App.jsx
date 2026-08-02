import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProcessList from "./pages/ProcessList";
import ProcessDetail from "./pages/ProcessDetail";
import Layout from "./components/Layout";
import Profile from "./pages/Profile";

// Componente para proteger rutas privadas
const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/*" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Rutas protegidas con Navbar */}
      <Route
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/processes" element={<ProcessList />} />
        <Route path="/processes/:id" element={<ProcessDetail />} />
        <Route path="/profile" element={<Profile />} />
      </Route>
    </Routes>
  );
}
export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
