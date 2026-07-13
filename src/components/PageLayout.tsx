import { useRef, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Activity, User, LogOut, Menu, X } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { storageService } from "../services/storage.service";
import type { ReactNode } from "react";

interface PageLayoutProps {
  children: ReactNode;
  /** Max width of main content: "md" (max-w-4xl) or "lg" (max-w-6xl). Default "lg". */
  maxWidth?: "md" | "lg";
}

export default function PageLayout({ children, maxWidth = "lg" }: PageLayoutProps) {
  const { isAuthenticated ,baSlug } = useAuth();
  const location = useLocation();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const [activeStudyPath, setActiveStudyPath] = useState<string | null>("");
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    setIsMobileNavOpen(false);
  }, [location.pathname, location.hash]);

  const handleLogout = () => {
    storageService.resetAuthData();
    setIsProfileOpen(false);
    window.location.href = "/";
  };

  useEffect(() => {
   if (baSlug) {
    setActiveStudyPath(`/${baSlug}`);
   }
  }, [baSlug]);

  const navItems = [
    { id: "home", label: "Home", path: "/" },
    { id: "focus", label: "Focus Areas", path: "/#focus" },
    { id: "analysis", label: "Flow Analysis", path: "/#analysis" },
    { id: "active", label: "Active Analyses", path: "/#active" },
    { id: "methodology", label: "Methodology", path: "/#methodology" },
    { id: "access", label: "Access", path: "/#access" },
    { id: "about", label: "About", path: "/#about" },
    { id: "activestudy", label: "Active Studies", path: activeStudyPath ?? "/studies" },
    { id: "survey", label: "Survey", path: "/survey" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500/20 rounded-lg blur-md group-hover:blur-lg transition-all" />
                <Activity className="w-7 h-7 text-blue-700 relative" strokeWidth={2.5} />
              </div>
              <span className="text-xl font-bold text-slate-900 tracking-tight">
                ClearLedger
              </span>
            </Link>
            <div className="flex items-center gap-2">
              <nav className="hidden md:flex items-center gap-1 bg-slate-100/60 rounded-full px-2 py-2">
                {navItems.map((item) => (
                  <Link
                    key={item.id}
                    to={item.path ?? (item.id === "home" ? "/" : `/#${item.id}`)}
                    className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 rounded-full hover:bg-white/50 transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
              <button
                type="button"
                onClick={() => setIsMobileNavOpen((open) => !open)}
                className="md:hidden flex items-center justify-center p-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                aria-label="Toggle navigation"
                aria-expanded={isMobileNavOpen}
              >
                {isMobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
              {isAuthenticated ? (
                <div className="relative" ref={profileRef}>
                  <button
                    type="button"
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center justify-center p-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                    aria-label="Profile menu"
                  >
                    <User className="w-5 h-5" />
                  </button>
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-xl shadow-lg border-2 border-slate-200 z-50">
                      <Link
                        to="/account"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-700"
                      >
                        <User className="w-4 h-4" />
                        Account
                      </Link>
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="flex items-center gap-2 w-full px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-amber-50 hover:text-amber-800"
                      >
                        <LogOut className="w-4 h-4" />
                        Log out
                      </button>
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          </div>
          {isMobileNavOpen ? (
            <div className="md:hidden mt-3">
              <nav className="flex flex-col items-start text-left gap-1 bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-200 p-2 shadow-sm">
                {navItems.map((item) => (
                  <Link
                    key={item.id}
                    to={item.path ?? (item.id === "home" ? "/" : `/#${item.id}`)}
                    onClick={() => setIsMobileNavOpen(false)}
                    className="w-full text-left px-3 py-2.5 text-sm font-medium text-slate-700 rounded-xl hover:bg-slate-100"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
          ) : null}
        </div>
      </header>

      <main
        className={`pt-10 pb-24 px-6 ${maxWidth === "md" ? "max-w-4xl" : "max-w-6xl"} mx-auto`}
      >
        {children}
      </main>
    </div>
  );
}
