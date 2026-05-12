import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import AuthModal from "@/components/auth/AuthModal";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, User as UserIcon, Settings, ChevronDown } from "lucide-react";
import { toast } from "sonner";

export function AuthButtons() {
  const { user, profile, loading, logout } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    if (!isDropdownOpen) return;
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isDropdownOpen]);

  const handleLogout = async () => {
    try {
      setIsDropdownOpen(false);
      await logout();
      toast.success("Logged out successfully.");
    } catch {
      toast.error("Failed to log out.");
    }
  };

  // -- Loading skeleton --
  if (loading) {
    return (
      <div className="w-8 h-8 rounded-full bg-secondary animate-pulse" />
    );
  }

  // -- Logged in --
  if (user) {
    const avatarUrl = profile?.photoURL || user.photoURL;
    const displayName =
      profile?.username || profile?.displayName || user.displayName || "User";
    const initials = displayName.charAt(0).toUpperCase();

    return (
      <div ref={dropdownRef} className="relative" id="auth-user-menu">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-secondary/60 transition-colors"
          id="auth-avatar-btn"
        >
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={displayName}
              className="w-7 h-7 rounded-full object-cover border border-border"
            />
          ) : (
            <div className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center text-xs font-bold text-primary border border-primary/20">
              {initials}
            </div>
          )}
          <span className="text-xs font-medium text-foreground hidden sm:inline-block max-w-[80px] truncate">
            {displayName}
          </span>
          <ChevronDown
            className={`w-3 h-3 text-muted-foreground transition-transform ${
              isDropdownOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        <AnimatePresence>
          {isDropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: -4, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.96 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full mt-2 w-48 rounded-xl border border-border bg-card shadow-lg overflow-hidden z-50"
              id="auth-dropdown-menu"
            >
              {/* User info header */}
              <div className="px-4 py-3 border-b border-border">
                <p className="text-sm font-semibold text-foreground truncate">
                  {displayName}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user.email}
                </p>
              </div>

              {/* Menu items */}
              <div className="py-1">
                {profile?.username && (
                  <Link
                    to={`/profile/${profile.username}`}
                    onClick={() => setIsDropdownOpen(false)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-secondary/60 transition-colors"
                    id="auth-menu-profile"
                  >
                    <UserIcon className="w-4 h-4 text-muted-foreground" />
                    Profile
                  </Link>
                )}
                {!profile?.username && (
                  <button
                    onClick={() => setIsDropdownOpen(false)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-secondary/60 transition-colors"
                    id="auth-menu-profile-fallback"
                  >
                    <UserIcon className="w-4 h-4 text-muted-foreground" />
                    Profile
                  </button>
                )}
                <button
                  onClick={() => setIsDropdownOpen(false)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-secondary/60 transition-colors"
                  id="auth-menu-settings"
                >
                  <Settings className="w-4 h-4 text-muted-foreground" />
                  Settings
                </button>
              </div>

              <div className="border-t border-border py-1">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                  id="auth-menu-logout"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // -- Logged out --
  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="px-4 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-all hover:scale-105 active:scale-95 shadow-md shadow-primary/20"
        id="auth-login-btn"
      >
        Login
      </button>
      <AuthModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
