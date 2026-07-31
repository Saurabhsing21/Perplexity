import { Navigate, useLocation } from "react-router";
import { useAuth } from "../context/auth-context";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#f6f2ec] text-[#6f675d] dark:bg-[#171615] dark:text-[#a39c93]">
        Loading...
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/auth" replace state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
}
