import { BrowserRouter, Route, Routes } from "react-router";
import { AuthProvider } from "./context/auth-context";
import { ProtectedRoute } from "./components/protected-route";
import { Lumina } from "@/pages/home";
import AuthPage from "@/pages/authpage";
import AuthCallbackPage from "@/pages/auth-callback";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Lumina />
              </ProtectedRoute>
            }
          />
          <Route
            path="/thread/:id"
            element={
              <ProtectedRoute>
                <Lumina />
              </ProtectedRoute>
            }
          />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/auth/callback" element={<AuthCallbackPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
