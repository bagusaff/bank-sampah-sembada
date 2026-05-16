import { Link, Outlet } from "react-router-dom";
import { Leaf, LogIn } from "lucide-react";

export default function PublicLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* ── Navbar ── */}
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-brand-600 flex items-center justify-center shadow-sm shadow-brand-200 group-hover:scale-105 transition-transform duration-200">
              <Leaf size={16} className="text-white" />
            </div>
            <span className="text-sm font-black text-slate-900 tracking-tight">
              Bank Sampah Sembada
            </span>
          </Link>

          {/* Login CTA */}
          <Link
            to="/login"
            className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white font-bold rounded-xl text-sm hover:bg-brand-700 transition-all shadow-sm shadow-brand-200"
          >
            <LogIn size={15} />
            Masuk
          </Link>
        </div>
      </header>

      {/* ── Page content ── */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-slate-100 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="text-xs text-slate-400 font-medium">
            © {new Date().getFullYear()} Bank Sampah Sembada
          </span>
          <span className="text-xs text-slate-300 font-medium">
            Sistem Pengelolaan Bank Sampah Digital
          </span>
        </div>
      </footer>
    </div>
  );
}
