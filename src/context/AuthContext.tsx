import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db, googleProvider, githubProvider } from "@/lib/firebase";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  username: string | null;
  createdAt: unknown;
  lastLoginAt: unknown;
  provider: string;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  loginWithGithub: () => Promise<void>;
  loginWithEmail: (
    email: string,
    password: string,
    remember?: boolean
  ) => Promise<void>;
  signupWithEmail: (
    email: string,
    password: string,
    username: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ---------------------------------------------------------------------------
// Helper — ensure a Firestore profile exists for the user
// ---------------------------------------------------------------------------

async function ensureUserProfile(
  user: User,
  provider: string,
  extraFields?: Partial<UserProfile>
): Promise<UserProfile> {
  const userRef = doc(db, "users", user.uid);
  const snap = await getDoc(userRef);

  if (snap.exists()) {
    // Update last login timestamp
    await setDoc(userRef, { lastLoginAt: serverTimestamp() }, { merge: true });
    return snap.data() as UserProfile;
  }

  // First-time profile creation
  const newProfile: UserProfile = {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
    username: extraFields?.username ?? user.displayName,
    createdAt: serverTimestamp(),
    lastLoginAt: serverTimestamp(),
    provider,
    ...extraFields,
  };

  await setDoc(userRef, newProfile);
  return newProfile;
}

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        try {
          const providerData = firebaseUser.providerData[0];
          const providerId = providerData?.providerId ?? "unknown";
          const userProfile = await ensureUserProfile(
            firebaseUser,
            providerId
          );
          setProfile(userProfile);
        } catch (err) {
          console.error("Failed to load user profile:", err);
          setProfile(null);
        }
      } else {
        setProfile(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // --------------------------------------------------
  // 1. Google Login
  // --------------------------------------------------
  const loginWithGoogle = useCallback(async () => {
    try {
      setLoading(true);
      await setPersistence(auth, browserLocalPersistence);
      const result = await signInWithPopup(auth, googleProvider);
      const userProfile = await ensureUserProfile(
        result.user,
        "google.com"
      );
      setProfile(userProfile);
    } catch (err) {
      console.error("Google login failed:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // --------------------------------------------------
  // 2. GitHub Login
  // --------------------------------------------------
  const loginWithGithub = useCallback(async () => {
    try {
      setLoading(true);
      await setPersistence(auth, browserLocalPersistence);
      const result = await signInWithPopup(auth, githubProvider);
      const userProfile = await ensureUserProfile(
        result.user,
        "github.com"
      );
      setProfile(userProfile);
    } catch (err) {
      console.error("GitHub login failed:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // --------------------------------------------------
  // 3. Email Login
  // --------------------------------------------------
  const loginWithEmail = useCallback(
    async (email: string, password: string, remember: boolean = true) => {
      try {
        setLoading(true);
        await setPersistence(
          auth,
          remember ? browserLocalPersistence : browserSessionPersistence
        );
        const result = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        const userProfile = await ensureUserProfile(
          result.user,
          "password"
        );
        setProfile(userProfile);
      } catch (err) {
        console.error("Email login failed:", err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // --------------------------------------------------
  // 4. Email Signup
  // --------------------------------------------------
  const signupWithEmail = useCallback(
    async (email: string, password: string, username: string) => {
      try {
        setLoading(true);
        await setPersistence(auth, browserLocalPersistence);
        const result = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const userProfile = await ensureUserProfile(
          result.user,
          "password",
          { username }
        );
        setProfile(userProfile);
      } catch (err) {
        console.error("Email signup failed:", err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // --------------------------------------------------
  // 5. Logout
  // --------------------------------------------------
  const logout = useCallback(async () => {
    try {
      setLoading(true);
      await signOut(auth);
      setUser(null);
      setProfile(null);
    } catch (err) {
      console.error("Logout failed:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // --------------------------------------------------
  // 6. Forgot Password
  // --------------------------------------------------
  const resetPassword = useCallback(async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (err) {
      console.error("Password reset failed:", err);
      throw err;
    }
  }, []);

  // --------------------------------------------------
  // Context value
  // --------------------------------------------------
  const value: AuthContextType = {
    user,
    profile,
    loading,
    loginWithGoogle,
    loginWithGithub,
    loginWithEmail,
    signupWithEmail,
    logout,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
