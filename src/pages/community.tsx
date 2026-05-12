import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Cpu, ShoppingBag, CircuitBoard, Code2, Users, Sun, Moon, ArrowLeft } from "lucide-react";
import CommunityHub from "@/features/community/components/community-hub";
import { AuthButtons } from "@/components/auth/auth-modals";
import { useStore } from "@/store/useStore";

const CommunityPage = () => {
  const { theme, setTheme } = useStore();

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background">
      {/* Global Header */}
      <header className="h-12 flex items-center justify-between px-4 border-b border-border bg-card shrink-0 relative z-20">
        <div className="flex items-center gap-4">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            <Link
              to="/"
              className="flex items-center gap-2 shrink-0 group relative"
              id="navbar-logo"
            >
              <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center group-hover:shadow-[0_0_15px_rgba(79,107,255,0.4)] transition-shadow">
                <Cpu className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-bold text-sm tracking-tight hidden sm:inline-block bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent group-hover:from-primary group-hover:to-primary/70 transition-all">
                ProtoLab
              </span>
            </Link>
          </motion.div>
        </div>

        <nav className="flex items-center gap-1.5">
          <Link
            to="/"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
          >
            <ShoppingBag className="w-4 h-4" />
            Store
          </Link>
          <Link
            to="/"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-primary text-primary-foreground shadow-md"
          >
            <Users className="w-4 h-4" />
            Community
          </Link>
        </nav>

        <div className="flex items-center gap-4 shrink-0">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          >
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground border-r border-border pr-4">
            <span className="px-2 py-0.5 rounded-md bg-accent/20 text-accent-foreground font-medium">
              v0.2 Beta
            </span>
          </div>
          <AuthButtons />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        <div className="w-full h-full animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out fill-mode-forwards relative">
          <CommunityHub />
        </div>
      </main>
    </div>
  );
};

export default CommunityPage;
