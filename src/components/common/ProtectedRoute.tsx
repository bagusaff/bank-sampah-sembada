import { Navigate, Outlet } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

// Hoisted outside component — static JSX, never recreated (Vercel hoist-jsx rule).
const loadingScreen = (
  <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 gap-6">
    <div className="relative">
      <div className="absolute inset-0 bg-brand-200 rounded-full blur-xl opacity-30 animate-pulse" />
      <Loader2
        size={44}
        className="animate-spin text-brand-600 relative z-10"
      />
    </div>
    <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.2em] animate-pulse">
      Memuat...
    </p>
  </div>
);

interface Props {
  role: "admin" | "member";
}

/**
 * Protects a route subtree for a specific role.
 *   loading  → spinner
 *   no session / no profile → /login
 *   wrong role → / (public home)
 *   correct role → <Outlet />
 */
export default function ProtectedRoute({ role }: Props) {
  const { isAuthenticated, profile, loading } = useAuth();

  if (loading) return loadingScreen;
  if (!isAuthenticated || !profile) return <Navigate to="/login" replace />;
  if (profile.role !== role) return <Navigate to="/" replace />;

  return <Outlet />;
}
