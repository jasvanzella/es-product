import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Import lazy do microfrontend remoto
const LoginPage = lazy(() => import("mfe_auth/LoginPage"));
const RegisterPage = lazy(() => import("mfe_auth/RegisterPage"));
const SuccessPage = lazy(() => import("mfe_auth/SuccessPage"));
const DashboardPage = lazy(() => import("mfe_auth/DashboardPage"));

function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<p>Carregando...</p>}>
        <Routes>
          <Route
            path="/login"
            element={
              <LoginPage
                onLogin={() => (window.location.href = "/success")}
              />
            }
          />
          <Route 
            path="/success" 
            element={
              <SuccessPage 
              />
            } 
          />
          <Route
            path="/register"
            element={
              <RegisterPage 
              />
            }
          />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <DashboardPage />
              </PrivateRoute>
            }
          />
          {/* rotas nao encontradas  */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
