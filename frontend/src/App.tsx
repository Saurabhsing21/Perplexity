import { BrowserRouter, Route, Routes } from "react-router";
import { AuthProvider } from "./context/auth-context";
import { ProtectedRoute } from "./components/protected-route";
import { Perplexity } from "@/pages/home";
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
                <Perplexity />
              </ProtectedRoute>
            }
          />
          <Route
            path="/thread/:id"
            element={
              <ProtectedRoute>
                <Perplexity />
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
