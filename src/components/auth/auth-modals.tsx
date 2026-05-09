import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useStore } from "@/store/useStore";
import { toast } from "sonner";
import { LogOut, User as UserIcon } from "lucide-react";

export function AuthButtons() {
  const { currentUser, logout } = useStore();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);

  if (currentUser) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-sm font-medium bg-secondary/50 px-3 py-1.5 rounded-full">
          <UserIcon className="w-4 h-4" />
          <span>{currentUser.username}</span>
        </div>
        <Button variant="ghost" size="sm" onClick={logout} className="gap-2">
          <LogOut className="w-4 h-4" />
          Logout
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="sm" onClick={() => setIsLoginOpen(true)}>
        Login
      </Button>
      <Button size="sm" onClick={() => setIsSignUpOpen(true)}>
        Sign Up
      </Button>

      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
      <SignUpModal isOpen={isSignUpOpen} onClose={() => setIsSignUpOpen(false)} />
    </div>
  );
}

function LoginModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [username, setUsername] = useState("");
  const login = useStore((state) => state.login);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      login(username);
      toast.success(`Welcome back, ${username}!`);
      onClose();
    } catch (error: any) {
      toast.error(error.message || "Failed to login");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Login</DialogTitle>
          <DialogDescription>Enter your username to access your account.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleLogin} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="login-username">Username</Label>
            <Input
              id="login-username"
              placeholder="e.g. protolab_admin"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Login
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function SignUpModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const signup = useStore((state) => state.signup);

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      signup(username, email);
      toast.success("Account created successfully!");
      onClose();
    } catch (error: any) {
      toast.error(error.message || "Failed to create account");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Account</DialogTitle>
          <DialogDescription>Join the community to share and like projects.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSignUp} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="signup-username">Username</Label>
            <Input
              id="signup-username"
              placeholder="Choose a username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="signup-email">Email</Label>
            <Input
              id="signup-email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Sign Up
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
