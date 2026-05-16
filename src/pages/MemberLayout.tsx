import { useState, useCallback } from "react";
import { NavLink, Outlet, Link } from "react-router-dom";
import {
  Leaf,
  LayoutDashboard,
  History,
  Wallet,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  UserCircle,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useMediaQuery } from "../hooks/useMediaQuery";
import { useNotificationContext } from "../context/NotificationContext";

// ─── Sidebar nav config ───────────────────────────────────────────────────────
const NAV_ITEMS = [
  { to: "/member/dashboard",     label: "Dashboard",       icon: <LayoutDashboard size={18} />, end: true },
  { to: "/member/deposits",      label: "Riwayat Deposit", icon: <History size={18} />                    },
  { to: "/member/withdrawal",    label: "Penarikan",       icon: <Wallet size={18} />                     },
  { to: "/member/notifications", label: "Notifikasi",      icon: <Bell size={18} />                       },
  { to: "/member/settings",      label: "Pengaturan",      icon: <Settings size={18} />                   },
] as const;

// ─── Nav item ─────────────────────────────────────────────────────────────────
interface NavItemProps {
  to: string;
  label: string;
  icon: React.ReactNode;
  end?: boolean;
  badge?: number;
  onClick?: () => void;
}

function NavItem({ to, label, icon, end, badge, onClick }: NavItemProps) {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onClick}
      className={({ isActive }) =>
        [
          "group flex items-center justify-between px-4 py-3 rounded-2xl",
          "transition-all duration-200 border",
          isActive
            ? "bg-brand-50/60 border-brand-100/50 text-brand-700 shadow-sm"
            : "bg-transparent border-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-900",
        ].join(" ")
      }
    >
      {({ isActive }) => (
        <>
          <div className="flex items-center gap-3.5">
            <span className={isActive ? "text-brand-600" : ""}>{icon}</span>
            <span className="text-sm font-bold tracking-tight">{label}</span>
          </div>
          <div className="flex items-center gap-2">
            {/* Unread badge — ternary, not &&, to avoid rendering "0" (Vercel rule) */}
            {badge != null && badge > 0 ? (
              <span className="px-1.5 py-0.5 bg-red-500 text-white text-[10px] font-black rounded-full min-w-[18px] text-center leading-none py-1">
                {badge > 99 ? "99+" : badge}
              </span>
            ) : null}
            {isActive ? (
              <div className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
            ) : null}
          </div>
        </>
      )}
    </NavLink>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────
function Sidebar({
  onClose,
  onSignOut,
  memberName,
  unreadCount,
}: {
  onClose?: () => void;
  onSignOut: () => void;
  memberName: string;
  unreadCount: number;
}) {
  return (
    <aside className="w-[260px] bg-white border-r border-slate-200/60 flex flex-col h-full shadow-[2px_0_24px_-12px_rgba(0,0,0,0.06)]">
      {/* Logo */}
      <div className="flex items-center justify-between px-5 py-5 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-brand-600 flex items-center justify-center shadow-sm shadow-brand-200">
            <Leaf size={16} className="text-white" />
          </div>
          <div>
            <p className="text-xs font-black text-slate-900 leading-none">
              Bank Sampah
            </p>
            <p className="text-xs font-black text-brand-600 leading-none">
              Sembada
            </p>
          </div>
        </div>
        {onClose ? (
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-all"
            aria-label="Tutup sidebar"
          >
            <X size={18} />
          </button>
        ) : null}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
        <div className="px-4 pb-2">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Menu
          </span>
        </div>
        {NAV_ITEMS.map((item) => (
          <NavItem
            key={item.to}
            {...item}
            badge={item.to === "/member/notifications" ? unreadCount : undefined}
            onClick={onClose}
          />
        ))}
      </nav>

      {/* User footer */}
      <div className="p-4 border-t border-slate-100">
        <div className="flex items-center gap-3 px-2 py-2 mb-2">
          <div className="w-8 h-8 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center flex-shrink-0">
            <UserCircle size={18} className="text-brand-600" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-black text-slate-900 truncate">{memberName}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Anggota</p>
          </div>
        </div>
        <button
          onClick={onSignOut}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-bold text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
        >
          <LogOut size={15} />
          Keluar
        </button>
      </div>
    </aside>
  );
}

// ─── Layout ───────────────────────────────────────────────────────────────────
export default function MemberLayout() {
  const { profile, signOut }   = useAuth();
  const { unreadCount }        = useNotificationContext();
  const isMobile               = useMediaQuery("(max-width: 1023px)");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const openSidebar  = useCallback(() => setSidebarOpen(true),  []);
  const closeSidebar = useCallback(() => setSidebarOpen(false), []);

  const memberName = profile?.full_name ?? "Anggota";

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">

      {/* ── Desktop sidebar ── */}
      {!isMobile ? (
        <Sidebar
          onSignOut={signOut}
          memberName={memberName}
          unreadCount={unreadCount}
        />
      ) : null}

      {/* ── Mobile: overlay + slide-in sidebar ── */}
      {isMobile && sidebarOpen ? (
        <>
          <div
            className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm"
            onClick={closeSidebar}
            aria-hidden="true"
          />
          <div className="fixed inset-y-0 left-0 z-40 animate-in slide-in-from-left duration-200">
            <Sidebar
              onClose={closeSidebar}
              onSignOut={signOut}
              memberName={memberName}
              unreadCount={unreadCount}
            />
          </div>
        </>
      ) : null}

      {/* ── Main content ── */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">

        {/* Mobile top bar */}
        {isMobile ? (
          <div className="sticky top-0 z-20 flex items-center justify-between px-4 py-3 bg-white/80 backdrop-blur-md border-b border-slate-100">
            <button
              onClick={openSidebar}
              className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-xl transition-all"
              aria-label="Buka menu"
            >
              <Menu size={20} />
            </button>

            {/* Center brand */}
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-brand-600 flex items-center justify-center">
                <Leaf size={13} className="text-white" />
              </div>
              <span className="text-sm font-black text-slate-900">
                Bank Sampah Sembada
              </span>
            </div>

            {/* Right: bell + logout */}
            <div className="flex items-center gap-1">
              <Link
                to="/member/notifications"
                className="relative p-2 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-xl transition-all"
                aria-label="Notifikasi"
              >
                <Bell size={18} />
                {unreadCount > 0 ? (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                ) : null}
              </Link>
              <button
                onClick={signOut}
                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                aria-label="Keluar"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        ) : null}

        {/* Desktop top header */}
        {!isMobile ? (
          <div className="flex items-center justify-between px-8 py-4 bg-white border-b border-slate-100">
            <div>
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
                Selamat datang
              </p>
              <p className="text-base font-black text-slate-900 tracking-tight">
                {memberName}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {/* Notification bell — explicit ternary for badge (Vercel rule) */}
              <Link
                to="/member/notifications"
                className="relative p-2.5 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-xl transition-all"
                aria-label="Notifikasi"
              >
                <Bell size={20} />
                {unreadCount > 0 ? (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center leading-none">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                ) : null}
              </Link>
              <button
                onClick={signOut}
                className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
              >
                <LogOut size={15} />
                Keluar
              </button>
            </div>
          </div>
        ) : null}

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="max-w-[1600px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
