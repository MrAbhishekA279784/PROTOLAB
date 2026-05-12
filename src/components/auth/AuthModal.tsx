import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import {
  X,
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Loader2,
  Github,
  Chrome,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Tab = "login" | "signup";

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const {
    loginWithGoogle,
    loginWithGithub,
    loginWithEmail,
    signupWithEmail,
    resetPassword,
  } = useAuth();

  const [tab, setTab] = useState<Tab>("login");

  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  // UI state
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<
    "google" | "github" | null
  >(null);
  const [error, setError] = useState<string | null>(null);

  // Reset state when modal opens/closes or tab changes
  useEffect(() => {
    if (!isOpen) {
      setEmail("");
      setPassword("");
      setUsername("");
      setError(null);
      setShowPassword(false);
      setLoading(false);
      setSocialLoading(null);
    }
  }, [isOpen]);

  useEffect(() => {
    setError(null);
  }, [tab]);

  // Escape key handler
  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  // ----- Helpers -----

  const friendlyError = (err: unknown): string => {
    const code = (err as { code?: string })?.code;
    switch (code) {
      case "auth/user-not-found":
        return "No account found with that email.";
      case "auth/wrong-password":
        return "Incorrect password.";
      case "auth/invalid-credential":
        return "Invalid credentials. Please try again.";
      case "auth/email-already-in-use":
        return "An account with this email already exists.";
      case "auth/weak-password":
        return "Password should be at least 6 characters.";
      case "auth/popup-closed-by-user":
        return "Sign-in popup was closed.";
      case "auth/account-exists-with-different-credential":
        return "An account already exists with a different sign-in method.";
      case "auth/too-many-requests":
        return "Too many attempts. Please try again later.";
      default:
        return (err as Error)?.message || "Something went wrong.";
    }
  };

  // ----- Handlers -----

  const handleGoogleLogin = useCallback(async () => {
    try {
      setSocialLoading("google");
      setError(null);
      await loginWithGoogle();
      toast.success("Welcome to ProtoLab!");
      onClose();
    } catch (err) {
      const msg = friendlyError(err);
      setError(msg);
      if (!((err as { code?: string })?.code?.includes("popup-closed"))) toast.error(msg);
    } finally {
      setSocialLoading(null);
    }
  }, [loginWithGoogle, onClose]);

  const handleGithubLogin = useCallback(async () => {
    try {
      setSocialLoading("github");
      setError(null);
      await loginWithGithub();
      toast.success("Welcome to ProtoLab!");
      onClose();
    } catch (err) {
      const msg = friendlyError(err);
      setError(msg);
      if (!((err as { code?: string })?.code?.includes("popup-closed"))) toast.error(msg);
    } finally {
      setSocialLoading(null);
    }
  }, [loginWithGithub, onClose]);

  const handleEmailLogin = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        setLoading(true);
        setError(null);
        await loginWithEmail(email, password, remember);
        toast.success("Welcome back!");
        onClose();
      } catch (err) {
        const msg = friendlyError(err);
        setError(msg);
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    },
    [email, password, remember, loginWithEmail, onClose]
  );

  const handleSignup = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (username.trim().length < 3) {
        setError("Username must be at least 3 characters.");
        return;
      }
      try {
        setLoading(true);
        setError(null);
        await signupWithEmail(email, password, username.trim());
        toast.success("Account created! Welcome to ProtoLab!");
        onClose();
      } catch (err) {
        const msg = friendlyError(err);
        setError(msg);
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    },
    [email, password, username, signupWithEmail, onClose]
  );

  const handleForgotPassword = useCallback(async () => {
    if (!email.trim()) {
      setError("Enter your email first, then click Forgot Password.");
      return;
    }
    try {
      setLoading(true);
      setError(null);
      await resetPassword(email);
      toast.success("Password reset email sent! Check your inbox.");
    } catch (err) {
      const msg = friendlyError(err);
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, [email, resetPassword]);

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal */}
          <motion.div
            className="relative w-full max-w-md rounded-2xl border border-cyan-500/20 bg-[#0c1425]/90 backdrop-blur-xl shadow-[0_0_60px_-10px_rgba(0,200,255,0.15)] overflow-hidden"
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 24 }}
            transition={{ type: "spring", damping: 26, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Glow top bar */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors z-10"
              aria-label="Close"
              id="auth-modal-close"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header */}
            <div className="px-8 pt-8 pb-2 text-center">
              <h2 className="text-2xl font-bold text-white tracking-tight">
                {tab === "login" ? "Welcome Back" : "Join ProtoLab"}
              </h2>
              <p className="text-sm text-gray-400 mt-1">
                {tab === "login"
                  ? "Sign in to your account"
                  : "Create your free account"}
              </p>
            </div>

            {/* Tab Switcher */}
            <div className="mx-8 mt-4 flex rounded-xl bg-white/5 p-1 border border-white/5">
              {(["login", "signup"] as Tab[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className="relative flex-1 py-2 text-sm font-medium capitalize transition-colors rounded-lg"
                  id={`auth-tab-${t}`}
                >
                  {tab === t && (
                    <motion.div
                      layoutId="auth-tab-indicator"
                      className="absolute inset-0 rounded-lg bg-cyan-500/15 border border-cyan-500/30"
                      transition={{
                        type: "spring",
                        damping: 25,
                        stiffness: 300,
                      }}
                    />
                  )}
                  <span
                    className={`relative z-10 ${
                      tab === t ? "text-cyan-400" : "text-gray-400"
                    }`}
                  >
                    {t === "login" ? "Login" : "Sign Up"}
                  </span>
                </button>
              ))}
            </div>

            {/* Body */}
            <div className="px-8 pt-5 pb-8">
              {/* Social Buttons */}
              <div className="flex gap-3 mb-5">
                <button
                  onClick={handleGoogleLogin}
                  disabled={!!socialLoading || loading}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-white/10 bg-white/5 text-sm font-medium text-gray-300 hover:bg-white/10 hover:border-cyan-500/30 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  id="auth-google-btn"
                >
                  {socialLoading === "google" ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Chrome className="w-4 h-4" />
                  )}
                  Google
                </button>
                <button
                  onClick={handleGithubLogin}
                  disabled={!!socialLoading || loading}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-white/10 bg-white/5 text-sm font-medium text-gray-300 hover:bg-white/10 hover:border-cyan-500/30 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  id="auth-github-btn"
                >
                  {socialLoading === "github" ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Github className="w-4 h-4" />
                  )}
                  GitHub
                </button>
              </div>

              {/* Divider */}
              <div className="flex items-center gap-3 mb-5">
                <div className="flex-1 h-px bg-white/10" />
                <span className="text-xs text-gray-500 uppercase tracking-wider">
                  or
                </span>
                <div className="flex-1 h-px bg-white/10" />
              </div>

              {/* Error */}
              <AnimatePresence mode="wait">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                    animate={{
                      opacity: 1,
                      height: "auto",
                      marginBottom: 16,
                    }}
                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                    className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-2.5 text-sm text-red-400 overflow-hidden"
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Form */}
              <AnimatePresence mode="wait">
                <motion.form
                  key={tab}
                  initial={{ opacity: 0, x: tab === "login" ? -16 : 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: tab === "login" ? 16 : -16 }}
                  transition={{ duration: 0.2 }}
                  onSubmit={tab === "login" ? handleEmailLogin : handleSignup}
                  className="space-y-4"
                >
                  {/* Username (signup only) */}
                  {tab === "signup" && (
                    <div className="space-y-1.5">
                      <label
                        htmlFor="auth-username"
                        className="text-xs font-medium text-gray-400 uppercase tracking-wider"
                      >
                        Username
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input
                          id="auth-username"
                          type="text"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          placeholder="Choose a username"
                          required
                          minLength={3}
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-gray-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all"
                        />
                      </div>
                    </div>
                  )}

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="auth-email"
                      className="text-xs font-medium text-gray-400 uppercase tracking-wider"
                    >
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input
                        id="auth-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        required
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-gray-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="auth-password"
                      className="text-xs font-medium text-gray-400 uppercase tracking-wider"
                    >
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input
                        id="auth-password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        minLength={6}
                        className="w-full pl-10 pr-11 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-gray-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                        aria-label="Toggle password visibility"
                        id="auth-toggle-password"
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Login extras: remember me + forgot */}
                  {tab === "login" && (
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor="auth-remember"
                        className="flex items-center gap-2 cursor-pointer select-none"
                      >
                        <input
                          id="auth-remember"
                          type="checkbox"
                          checked={remember}
                          onChange={(e) => setRemember(e.target.checked)}
                          className="w-3.5 h-3.5 rounded border-white/20 bg-white/5 text-cyan-500 focus:ring-cyan-500/20 focus:ring-offset-0"
                        />
                        <span className="text-xs text-gray-400">
                          Remember me
                        </span>
                      </label>
                      <button
                        type="button"
                        onClick={handleForgotPassword}
                        disabled={loading}
                        className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors disabled:opacity-50"
                        id="auth-forgot-password"
                      >
                        Forgot Password?
                      </button>
                    </div>
                  )}

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={loading || !!socialLoading}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-semibold hover:from-cyan-400 hover:to-blue-500 transition-all shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    id="auth-submit-btn"
                  >
                    {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                    {tab === "login" ? "Sign In" : "Create Account"}
                  </button>
                </motion.form>
              </AnimatePresence>

              {/* Footer toggle */}
              <p className="text-center text-xs text-gray-500 mt-5">
                {tab === "login"
                  ? "Don't have an account?"
                  : "Already have an account?"}{" "}
                <button
                  onClick={() =>
                    setTab(tab === "login" ? "signup" : "login")
                  }
                  className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
                  id="auth-switch-tab"
                >
                  {tab === "login" ? "Sign Up" : "Sign In"}
                </button>
              </p>
            </div>

            {/* Glow bottom bar */}
            <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
