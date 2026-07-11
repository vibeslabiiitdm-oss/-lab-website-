import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Users,
  FolderGit2,
  Trophy,
  Cpu,
  Plus,
  Trash2,
  Edit3,
  Check,
  Search,
  Moon,
  Sun,
  X,
  FileText,
  GraduationCap,
  BookOpen,
  Wrench,
  ChevronDown,
  ChevronUp,
  Sliders,
  Layers,
  Terminal,
  Activity,
  Settings,
  LogOut,
  Mail,
  Bell,
  Menu,
  Lock,
  User,
  ArrowLeft,
  Eye,
  EyeOff,
  Loader2
} from "lucide-react";

import {
  allPeople as initialPeople,
  projects as initialProjects,
  achievements as initialAchievements,
  labStats as initialStats,
  resources as initialResources,
  supervisedProjects as initialSupervisedProjects,
  type Person,
  type Project,
  type Achievement,
  type SupervisedProject,
} from "./data/lab";

export interface Update {
  id: number;
  date: string;
  tag: string;
  title: string;
  desc: string;
  link: string;
}

interface ResourceItem {
  _id?: string;
  name: string;
  detail: string;
}

interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  createdAt: string;
}

interface ActivityNotification {
  id: string;
  message: string;
  type: "info" | "success" | "warning";
  time: string;
}

const getUserInitials = (name: string) => {
  if (!name) return "U";
  const parts = name.replace(/^(Dr\.|Mr\.|Ms\.|Mrs\.)\s+/i, "").split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return parts[0] ? parts[0].slice(0, 2).toUpperCase() : "U";
};

// const isImageUrl = (url: string) => {
//   if (!url) return false;
//   return (
//     url.startsWith("http://") ||
//     url.startsWith("https://") ||
//     url.startsWith("/") ||
//     /\.(jpg|jpeg|png|webp|svg|gif|avif)/i.test(url)
//   );
// };

interface LoginFormProps {
  onLoginSuccess: (user: { name: string; email: string; role: string }) => void;
  onNavigate: (view: "login" | "signup" | "forgot") => void;
  showNotification: (msg: string, type?: "success" | "error") => void;
}

function LoginForm({ onLoginSuccess, onNavigate, showNotification }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState("");

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setApiError("");
    if (!validate()) return;

    setIsLoading(true);
    fetch("https://lab-website-tblf.onrender.com/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    })
      .then(res => {
        if (!res.ok) {
          return res.json().then(data => { throw new Error(data.message || "Invalid credentials"); });
        }
        return res.json();
      })
      .then(data => {
        sessionStorage.setItem("auth_token", data.token);
        sessionStorage.setItem("auth_user", JSON.stringify(data.user));
        setIsLoading(false);
        showNotification(`Welcome back, ${data.user.name}!`, "success");
        onLoginSuccess(data.user);
      })
      .catch(err => {
        setApiError(err.message || "Login failed");
        setIsLoading(false);
        showNotification(err.message || "Login failed", "error");
      });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 text-left">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-display font-black tracking-tight text-gradient">Welcome Back</h2>
        <p className="text-xs text-muted-foreground mt-1.5">Sign in to access your lab admin console</p>
      </div>

      {apiError && (
        <div className="p-3 rounded-xl border border-destructive/20 bg-destructive/10 text-destructive text-xs font-semibold animate-pulse">
          {apiError}
        </div>
      )}

      {/* Email Input */}
      <div className="space-y-1">
        <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Email Address</label>
        <div className="relative flex items-center bg-muted/20 rounded-xl border border-border/40 focus-within:border-primary/60 focus-within:ring-2 focus-within:ring-primary/20 transition-all duration-200">
          <Mail size={16} className="absolute left-3 text-muted-foreground pointer-events-none" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@iiitdm.ac.in"
            className="w-full bg-transparent pl-10 pr-4 py-2.5 text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none"
          />
        </div>
        {errors.email && <p className="text-[10px] text-destructive font-semibold mt-0.5">{errors.email}</p>}
      </div>

      {/* Password Input */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Password</label>
          <button
            type="button"
            onClick={() => onNavigate("forgot")}
            className="text-[10px] font-bold text-primary hover:underline focus:outline-none cursor-pointer"
          >
            Forgot password?
          </button>
        </div>
        <div className="relative flex items-center bg-muted/20 rounded-xl border border-border/40 focus-within:border-primary/60 focus-within:ring-2 focus-within:ring-primary/20 transition-all duration-200">
          <Lock size={16} className="absolute left-3 text-muted-foreground pointer-events-none" />
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full bg-transparent pl-10 pr-10 py-2.5 text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 text-muted-foreground hover:text-foreground focus:outline-none cursor-pointer"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {errors.password && <p className="text-[10px] text-destructive font-semibold mt-0.5">{errors.password}</p>}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 transition shadow-sm hover:scale-[1.02] transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
      >
        {isLoading ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            <span>Signing in...</span>
          </>
        ) : (
          <span>Sign In</span>
        )}
      </button>

      <div className="text-center mt-4">
        <p className="text-[11px] text-muted-foreground">
          Don't have an account?{" "}
          <button
            type="button"
            onClick={() => onNavigate("signup")}
            className="font-bold text-primary hover:underline cursor-pointer"
          >
            Sign Up
          </button>
        </p>
      </div>
    </form>
  );
}

interface SignUpFormProps {
  onNavigate: (view: "login" | "signup" | "forgot") => void;
  showNotification: (msg: string, type?: "success" | "error") => void;
}

function SignUpForm({ onNavigate, showNotification }: SignUpFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState("");

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) {
      newErrors.name = "Full name is required";
    }
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!role) {
      newErrors.role = "Please select your role";
    }
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (confirmPassword !== password) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setApiError("");
    if (!validate()) return;

    setIsLoading(true);
    fetch("https://lab-website-tblf.onrender.com/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, role })
    })
      .then(res => {
        if (!res.ok) {
          return res.json().then(data => { throw new Error(data.message || "Registration failed"); });
        }
        return res.json();
      })
      .then(() => {
        setIsLoading(false);
        showNotification("Registration successful! Please sign in.", "success");
        onNavigate("login");
      })
      .catch(err => {
        setApiError(err.message || "Registration failed");
        setIsLoading(false);
        showNotification(err.message || "Registration failed", "error");
      });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-left">
      <div className="text-center mb-5">
        <h2 className="text-3xl font-display font-black tracking-tight text-gradient">Create Account</h2>
        <p className="text-xs text-muted-foreground mt-1.5">Register a new profile for the admin panel</p>
      </div>

      {apiError && (
        <div className="p-3 rounded-xl border border-destructive/20 bg-destructive/10 text-destructive text-xs font-semibold animate-pulse">
          {apiError}
        </div>
      )}

      {/* Name Input */}
      <div className="space-y-1">
        <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Full Name</label>
        <div className="relative flex items-center bg-muted/20 rounded-xl border border-border/40 focus-within:border-primary/60 focus-within:ring-2 focus-within:ring-primary/20 transition-all duration-200">
          <User size={16} className="absolute left-3 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Jane Doe"
            className="w-full bg-transparent pl-10 pr-4 py-2 text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none"
          />
        </div>
        {errors.name && <p className="text-[10px] text-destructive font-semibold mt-0.5">{errors.name}</p>}
      </div>

      {/* Email Input */}
      <div className="space-y-1">
        <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Email Address</label>
        <div className="relative flex items-center bg-muted/20 rounded-xl border border-border/40 focus-within:border-primary/60 focus-within:ring-2 focus-within:ring-primary/20 transition-all duration-200">
          <Mail size={16} className="absolute left-3 text-muted-foreground pointer-events-none" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@iiitdm.ac.in"
            className="w-full bg-transparent pl-10 pr-4 py-2 text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none"
          />
        </div>
        {errors.email && <p className="text-[10px] text-destructive font-semibold mt-0.5">{errors.email}</p>}
      </div>

      {/* Role Select Dropdown */}
      <div className="space-y-1">
        <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">User Role</label>
        <div className="relative flex items-center bg-muted/20 rounded-xl border border-border/40 focus-within:border-primary/60 focus-within:ring-2 focus-within:ring-primary/20 transition-all duration-200 px-3 py-2">
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full bg-transparent text-xs text-foreground focus:outline-none cursor-pointer appearance-none outline-none [&>option]:bg-card [&>option]:text-foreground"
          >
            <option value="" disabled>Select your role...</option>
            <option value="Professor">Professor</option>
            <option value="Research Scholar">Research Scholar</option>
            <option value="Student">Student</option>
          </select>
        </div>
        {errors.role && <p className="text-[10px] text-destructive font-semibold mt-0.5">{errors.role}</p>}
      </div>

      {/* Password Input */}
      <div className="space-y-1">
        <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Password</label>
        <div className="relative flex items-center bg-muted/20 rounded-xl border border-border/40 focus-within:border-primary/60 focus-within:ring-2 focus-within:ring-primary/20 transition-all duration-200">
          <Lock size={16} className="absolute left-3 text-muted-foreground pointer-events-none" />
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full bg-transparent pl-10 pr-10 py-2 text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 text-muted-foreground hover:text-foreground focus:outline-none cursor-pointer"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {errors.password && <p className="text-[10px] text-destructive font-semibold mt-0.5">{errors.password}</p>}
      </div>

      {/* Confirm Password Input */}
      <div className="space-y-1">
        <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Confirm Password</label>
        <div className="relative flex items-center bg-muted/20 rounded-xl border border-border/40 focus-within:border-primary/60 focus-within:ring-2 focus-within:ring-primary/20 transition-all duration-200">
          <Lock size={16} className="absolute left-3 text-muted-foreground pointer-events-none" />
          <input
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full bg-transparent pl-10 pr-10 py-2 text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 text-muted-foreground hover:text-foreground focus:outline-none cursor-pointer"
          >
            {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {errors.confirmPassword && <p className="text-[10px] text-destructive font-semibold mt-0.5">{errors.confirmPassword}</p>}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 transition shadow-sm hover:scale-[1.02] transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
      >
        {isLoading ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            <span>Creating account...</span>
          </>
        ) : (
          <span>Sign Up</span>
        )}
      </button>

      <div className="text-center mt-3">
        <p className="text-[11px] text-muted-foreground">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => onNavigate("login")}
            className="font-bold text-primary hover:underline cursor-pointer"
          >
            Sign In
          </button>
        </p>
      </div>
    </form>
  );
}

interface ForgotPasswordFormProps {
  onNavigate: (view: "login" | "signup" | "forgot") => void;
  showNotification: (msg: string, type?: "success" | "error") => void;
}

function ForgotPasswordForm({ onNavigate, showNotification }: ForgotPasswordFormProps) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setSuccess(true);
      showNotification("Password reset instructions sent successfully!", "success");
    }, 1200);
  };

  return (
    <div className="text-left space-y-4">
      <div className="text-center mb-5">
        <h2 className="text-3xl font-display font-black tracking-tight text-gradient">Reset Password</h2>
        <p className="text-xs text-muted-foreground mt-1.5">Get instructions to recover your account</p>
      </div>

      {success ? (
        <div className="space-y-4">
          <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold text-center leading-normal">
            We have sent password reset instructions to <strong>{email}</strong>. Please check your inbox.
          </div>
          <button
            type="button"
            onClick={() => onNavigate("login")}
            className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 transition shadow-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            Return to Sign In
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Email Address</label>
            <div className="relative flex items-center bg-muted/20 rounded-xl border border-border/40 focus-within:border-primary/60 focus-within:ring-2 focus-within:ring-primary/20 transition-all duration-200">
              <Mail size={16} className="absolute left-3 text-muted-foreground pointer-events-none" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@iiitdm.ac.in"
                className="w-full bg-transparent pl-10 pr-4 py-2.5 text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none"
              />
            </div>
            {errors.email && <p className="text-[10px] text-destructive font-semibold mt-0.5">{errors.email}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 transition shadow-sm hover:scale-[1.02] transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Sending link...</span>
              </>
            ) : (
              <span>Send Instructions</span>
            )}
          </button>

          <button
            type="button"
            onClick={() => onNavigate("login")}
            className="w-full py-2 flex items-center justify-center gap-2 text-xs font-bold text-muted-foreground hover:text-foreground transition cursor-pointer"
          >
            <ArrowLeft size={14} />
            <span>Back to Sign In</span>
          </button>
        </form>
      )}
    </div>
  );
}

export default function App() {
  // User Database and Auth States
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    if (typeof window !== "undefined") {
      return !!sessionStorage.getItem("auth_token");
    }
    return false;
  });

  const [authView, setAuthView] = useState<"login" | "signup" | "forgot">("login");

  const [currentUser, setCurrentUser] = useState<{ name: string; email: string; role: string } | null>(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("auth_user");
      return stored ? JSON.parse(stored) : null;
    }
    return null;
  });

  // Ensure mock user database is initialized in localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const usersStr = localStorage.getItem("registered_users");
      if (!usersStr) {
        localStorage.setItem("registered_users", JSON.stringify([]));
      }
    }
  }, []);

  // Theme state
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  // Database States
  const [people, setPeople] = useState<Person[]>(initialPeople);
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [achievements, setAchievements] = useState<Achievement[]>(initialAchievements);
  const [stats, setStats] = useState(initialStats);
  const [resources, setResources] = useState<ResourceItem[]>(initialResources);
  const [supervisedProjects, setSupervisedProjects] = useState<SupervisedProject[]>(initialSupervisedProjects);
  const [liveUpdates, setLiveUpdates] = useState<Update[]>([]);

  // UI Navigation State
  const [activeTab, setActiveTab] = useState<"dashboard" | "team" | "projects" | "thesis" | "achievements" | "resources" | "updates">("dashboard");

  // Expanded project state for results list
  const [expandedProjects, setExpandedProjects] = useState<Record<string, boolean>>({});

  // Messages and Notifications States
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [isMessagesOpen, setIsMessagesOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [notifications, setNotifications] = useState<ActivityNotification[]>([
    { id: "init-1", message: "Admin console initialized", type: "success", time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
  ]);

  const addSessionNotification = (message: string, type: "info" | "success" | "warning" = "info") => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setNotifications(prev => [
      { id: generateId("notif"), message, type, time },
      ...prev
    ]);
  };

  // Custom Confirmation Dialog State
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText: string;
    confirmStyle: "danger" | "primary";
    onConfirm: () => void;
  } | null>(null);

  const triggerConfirm = (
    title: string,
    message: string,
    onConfirm: () => void,
    confirmText = "Delete",
    confirmStyle: "danger" | "primary" = "danger"
  ) => {
    setConfirmDialog({
      isOpen: true,
      title,
      message,
      confirmText,
      confirmStyle,
      onConfirm
    });
  };

  // Notifications
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Chart Interactive Hover States
  const [hoveredLineNode, setHoveredLineNode] = useState<{ index: number; year: number; papers: number; citations: number } | null>(null);
  const [hoveredPieSlice, setHoveredPieSlice] = useState<number | null>(null);

  // Search & Filter States
  const [teamSearch, setTeamSearch] = useState("");
  const [teamFilter, setTeamFilter] = useState("All");

  // Active Modals / Form States
  const [editingPerson, setEditingPerson] = useState<Person | null>(null);
  const [isPersonModalOpen, setIsPersonModalOpen] = useState(false);

  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);

  const [editingSupervised, setEditingSupervised] = useState<SupervisedProject | null>(null);
  const [isSupervisedModalOpen, setIsSupervisedModalOpen] = useState(false);

  const [editingAchievement, setEditingAchievement] = useState<Achievement | null>(null);
  const [isAchievementModalOpen, setIsAchievementModalOpen] = useState(false);

  const [editingUpdate, setEditingUpdate] = useState<Update | null>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  // Settings modal states
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isAddResourceOpen, setIsAddResourceOpen] = useState(false);
  const [labName, setLabName] = useState("ViBeS Lab");
  const [labEmail, setLabEmail] = useState("");
  const [scholarId, setScholarId] = useState("F3W0X0AAAAAJ");
  const [sessionTimeout, setSessionTimeout] = useState("30");
  const [accentPalette, setAccentPalette] = useState("default");

  // Sync settings defaults with logged-in user details
  useEffect(() => {
    if (currentUser) {
      setLabEmail(currentUser.email);
    }
  }, [currentUser]);

  // Sync people list's guide role with the logged-in user details dynamically
  useEffect(() => {
    if (currentUser) {
      setPeople((prev) =>
        prev.map((person) => {
          if (person.role === "guide") {
            return {
              ...person,
              name: currentUser.name,
              email: currentUser.email,
              designation: currentUser.role + " & Lab Head",
            };
          }
          return person;
        })
      );
    }
  }, [currentUser]);

  // Initialize theme
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
  }, [theme]);

  // Load data from backend database if authenticated
  useEffect(() => {
    if (isAuthenticated) {


      // Fetch People
      fetch("https://lab-website-tblf.onrender.com/api/people")
        .then(res => res.json())
        .then(data => setPeople(data))
        .catch(err => console.error("Error fetching people:", err));

      // Fetch Projects
      fetch("https://lab-website-tblf.onrender.com/api/projects")
        .then(res => res.json())
        .then(data => setProjects(data))
        .catch(err => console.error("Error fetching projects:", err));

      // Fetch Achievements
      fetch("https://lab-website-tblf.onrender.com/api/achievements")
        .then(res => res.json())
        .then(data => setAchievements(data))
        .catch(err => console.error("Error fetching achievements:", err));

      // Fetch Live Updates
      fetch("https://lab-website-tblf.onrender.com/api/updates")
        .then(res => res.json())
        .then(data => setLiveUpdates(data))
        .catch(err => console.error("Error fetching live updates:", err));

      // Fetch Supervised Projects
      fetch("https://lab-website-tblf.onrender.com/api/supervised")
        .then(res => res.json())
        .then(data => setSupervisedProjects(data))
        .catch(err => console.error("Error fetching supervised projects:", err));

      // Fetch Resources
      fetch("https://lab-website-tblf.onrender.com/api/resources")
        .then(res => res.json())
        .then(data => setResources(data))
        .catch(err => console.error("Error fetching resources:", err));

      // Fetch Stats
      fetch("https://lab-website-tblf.onrender.com/api/stats")
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            const statsMap: any = {};
            data.forEach(item => {
              statsMap[item.key] = item.value;
            });
            setStats(prev => ({ ...prev, ...statsMap }));
          }
        })
        .catch(err => console.error("Error fetching stats:", err));

      // Fetch Contact Messages
      const token = sessionStorage.getItem("auth_token");
      fetch("https://lab-website-tblf.onrender.com/api/contact", {
        headers: { "Authorization": `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            setMessages(data);
            const unread = data.filter(m => !m.read);
            if (unread.length > 0) {
              setNotifications(prev => {
                const cleanPrev = prev.filter(n => !n.id.startsWith("msg-"));
                const newNotifs = unread.map(m => ({
                  id: `msg-${m._id}`,
                  message: `New message from ${m.name}`,
                  type: "info" as const,
                  time: new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }));
                return [...newNotifs, ...cleanPrev];
              });
            }
          }
        })
        .catch(err => console.error("Error fetching messages:", err));
    }
  }, [isAuthenticated]);

  // Sidebar collapsible state
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth >= 768;
    }
    return true;
  });

  // Handle sidebar collapse state when window resizing
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Click outside handler to close dropdowns
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".inbox-dropdown-container")) {
        setIsMessagesOpen(false);
      }
      if (!target.closest(".alerts-dropdown-container")) {
        setIsNotificationsOpen(false);
      }
    };
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  const showNotification = (message: string, type: "success" | "error" = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Helper: Auto-increment sno or generate IDs
  const generateId = (prefix: string) => `${prefix}-${Math.random().toString(36).substr(2, 9)}`;

  // Delete Handlers
  // =========================================================================
  // PERSON DELETION LOGIC (handleDeletePerson)
  // =========================================================================
  // This is triggered from the UI delete icon.
  // 1. It sends a DELETE request to the backend endpoint '/api/people/:id'.
  // 2. It requires the 'auth_token' to prove you are an admin.
  // 3. If the backend confirms deletion, the person is removed from the local state array.
    const handleDeletePerson = (id: string) => {
    triggerConfirm(
      "Remove Member",
      "Are you sure you want to delete this team member from the directory roster?",
      () => {
        const token = sessionStorage.getItem("auth_token");
        fetch(`https://lab-website-tblf.onrender.com/api/people/${id}`, {
          method: "DELETE",
          headers: { "Authorization": `Bearer ${token}` }
        })
          .then(res => {
            if (!res.ok) throw new Error("Delete failed");
            setPeople(people.filter(p => p.id !== id));
            showNotification("Team member deleted successfully");
            addSessionNotification(`Team member deleted (ID: ${id})`, "warning");
          })
          .catch(err => showNotification(err.message, "error"));
      }
    );
  };

  const handleDeleteProject = (id: string) => {
    triggerConfirm(
      "Remove Project",
      "Are you sure you want to delete this research project? This action cannot be undone.",
      () => {
        const token = sessionStorage.getItem("auth_token");
        fetch(`https://lab-website-tblf.onrender.com/api/projects/${id}`, {
          method: "DELETE",
          headers: { "Authorization": `Bearer ${token}` }
        })
          .then(res => {
            if (!res.ok) throw new Error("Delete failed");
            setProjects(projects.filter(p => p.id !== id));
            showNotification("Project deleted successfully");
            addSessionNotification(`Research project deleted (ID: ${id})`, "warning");
          })
          .catch(err => showNotification(err.message, "error"));
      }
    );
  };

  const handleDeleteSupervised = (sno: number) => {
    triggerConfirm(
      "Remove Supervised Project",
      "Are you sure you want to delete this supervised project?",
      () => {
        const token = sessionStorage.getItem("auth_token");
        fetch(`https://lab-website-tblf.onrender.com/api/supervised/${sno}`, {
          method: "DELETE",
          headers: { "Authorization": `Bearer ${token}` }
        })
          .then(res => {
            if (!res.ok) throw new Error("Delete failed");
            setSupervisedProjects(supervisedProjects.filter(p => p.sno !== sno));
            showNotification("Supervised project deleted successfully");
            addSessionNotification(`Supervised project deleted (SNo: ${sno})`, "warning");
          })
          .catch(err => showNotification(err.message, "error"));
      }
    );
  };

  const handleDeleteAchievement = (id: string) => {
    triggerConfirm(
      "Remove Achievement",
      "Are you sure you want to delete this achievement milestone from the timeline?",
      () => {
        const token = sessionStorage.getItem("auth_token");
        fetch(`https://lab-website-tblf.onrender.com/api/achievements/${id}`, {
          method: "DELETE",
          headers: { "Authorization": `Bearer ${token}` }
        })
          .then(res => {
            if (!res.ok) throw new Error("Delete failed");
            setAchievements(achievements.filter(p => p.id !== id));
            showNotification("Achievement deleted successfully");
            addSessionNotification(`Achievement milestone deleted (ID: ${id})`, "warning");
          })
          .catch(_err => showNotification("Failed to delete achievement", "error"));
      }
    );
  };

  const handleDeleteUpdate = (id: number) => {
    triggerConfirm(
      "Remove Update",
      "Are you sure you want to delete this live update?",
      () => {
        const token = sessionStorage.getItem("auth_token");
        fetch(`https://lab-website-tblf.onrender.com/api/updates/${id}`, {
          method: "DELETE",
          headers: { "Authorization": `Bearer ${token}` }
        })
          .then(res => {
            if (!res.ok) throw new Error("Delete failed");
            setLiveUpdates(liveUpdates.filter(u => u.id !== id));
            showNotification("Update deleted successfully");
          })
          .catch(_err => showNotification("Failed to delete update", "error"));
      }
    );
  };



  const handleDeleteResource = (id: string) => {
    triggerConfirm(
      "Remove Resource Spec",
      "Are you sure you want to delete this hardware specification? This action cannot be undone.",
      () => {
        const token = sessionStorage.getItem("auth_token");
        fetch(`https://lab-website-tblf.onrender.com/api/resources/${id}`, {
          method: "DELETE",
          headers: { "Authorization": `Bearer ${token}` }
        })
          .then(res => {
            if (!res.ok) throw new Error("Delete failed");
            setResources(resources.filter(r => r._id !== id));
            showNotification("Resource deleted successfully");
            addSessionNotification(`Hardware specification deleted (ID: ${id})`, "warning");
          })
          .catch(err => showNotification(err.message, "error"));
      }
    );
  };

  const handleSaveResource = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const detail = formData.get("detail") as string;

    if (!name || !detail) {
      showNotification("Please fill in all fields", "error");
      return;
    }

    const token = sessionStorage.getItem("auth_token");

    fetch("https://lab-website-tblf.onrender.com/api/resources", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ name, detail })
    })
      .then(async res => {
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || errData.message || "Save failed");
        }
        return res.json();
      })
      .then(savedResource => {
        setResources([...resources, savedResource]);
        showNotification("Resource added successfully!");
        addSessionNotification(`New hardware resource '${savedResource.name}' added`, "success");
        setIsAddResourceOpen(false);
      })
      .catch(err => showNotification(err.message, "error"));
  };

  // Form submit handlers
  // =========================================================================
  // PERSON SAVING LOGIC (handleSavePerson)
  // =========================================================================
  // This executes when you click "Save Person" in the Add/Edit Team Member modal.
  // 1. It constructs a new Person object by reading values from the HTML form.
  // 2. It checks if we are editing an existing person (PUT request) or creating a new one (POST request).
  // 3. It sends the constructed object along with the Authorization token to the backend API.
  // 4. Upon success, it updates the local React state so the UI reflects the change immediately.
    const handleSavePerson = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const id = editingPerson?.id || generateId("scholar");

    const token = sessionStorage.getItem("auth_token");

    // Handle File Upload for Avatar
    const avatarFile = formData.get("avatarFile") as File;
    let avatarUrl = formData.get("avatar") as string;

    if (avatarFile && avatarFile.size > 0) {
      const uploadData = new FormData();
      uploadData.append("file", avatarFile);
      try {
        const uploadRes = await fetch("https://lab-website-tblf.onrender.com/api/upload", {
          method: "POST",
          headers: { "Authorization": `Bearer ${token}` },
          body: uploadData
        });
        if (uploadRes.ok) {
          const resData = await uploadRes.json();
          avatarUrl = resData.url;
        } else {
          showNotification("Failed to upload profile photo", "error");
          return;
        }
      } catch (err) {
        showNotification("Error uploading profile photo", "error");
        return;
      }
    }

    // Handle File Upload for Resume
    const resumeFile = formData.get("resumeFile") as File;
    let resumeUrl = formData.get("resume") as string;

    if (resumeFile && resumeFile.size > 0) {
      const uploadData = new FormData();
      uploadData.append("file", resumeFile);
      try {
        const uploadRes = await fetch("https://lab-website-tblf.onrender.com/api/upload", {
          method: "POST",
          headers: { "Authorization": `Bearer ${token}` },
          body: uploadData
        });
        if (uploadRes.ok) {
          const resData = await uploadRes.json();
          resumeUrl = resData.url;
        } else {
          showNotification("Failed to upload resume", "error");
          return;
        }
      } catch (err) {
        showNotification("Error uploading resume", "error");
        return;
      }
    }

    const scholarUrl = formData.get("scholar") as string;
    let newLinks = editingPerson?.links ? [...editingPerson.links] : [];
    if (scholarUrl) {
      const existingScholar = newLinks.find((l: any) => l.label === "Google Scholar");
      if (existingScholar) existingScholar.href = scholarUrl;
      else newLinks.push({ label: "Google Scholar", href: scholarUrl });
    } else {
      newLinks = newLinks.filter((l: any) => l.label !== "Google Scholar");
    }

    const selectedCategory = formData.get("category") as string;
    const computedRole = selectedCategory === "Guide" ? "guide" : "scholar";

    const newPerson: Person = {
      id,
      role: computedRole,
      category: (selectedCategory && selectedCategory !== "Guide") ? selectedCategory as Person["category"] : undefined,
      name: formData.get("name") as string,
      designation: formData.get("designation") as string,
      affiliation: formData.get("affiliation") as string,
      email: formData.get("email") as string,
      bio: formData.get("bio") as string,
      joined: Number(formData.get("joined")),
      avatar: avatarUrl,
      resume: resumeUrl,
      domains: editingPerson?.domains || [],
      skills: editingPerson?.skills || [],
      education: editingPerson?.education || [],
      publications: editingPerson?.publications || [],
      awards: editingPerson?.awards || [],
      conferences: editingPerson?.conferences || [],
      links: newLinks,
      researchProject: editingPerson?.researchProject || undefined,
    };

    const isEditing = !!editingPerson?.id;
    const url = isEditing ? `https://lab-website-tblf.onrender.com/api/people/${editingPerson.id}` : "https://lab-website-tblf.onrender.com/api/people";
    const method = isEditing ? "PUT" : "POST";

    fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(newPerson)
    })
      .then(async res => {
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || errData.message || "Save failed");
        }
        return res.json();
      })
      .then(savedPerson => {
        if (isEditing) {
          setPeople(people.map(p => p.id === editingPerson.id ? savedPerson : p));
          showNotification("Member updated successfully!");
          addSessionNotification(`Team member '${savedPerson.name}' details updated`, "success");
        } else {
          setPeople([...people, savedPerson]);
          showNotification("Member added successfully!");
          addSessionNotification(`New team member '${savedPerson.name}' added to roster`, "success");
        }
        setIsPersonModalOpen(false);
        setEditingPerson(null);
      })
      .catch(err => showNotification(err.message, "error"));
  };

  const handleSaveProject = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const id = editingProject?.id || generateId("proj");

    const newProj: Project = {
      id,
      title: formData.get("title") as string,
      tagline: formData.get("tagline") as string,
      domain: formData.get("domain") as string,
      status: formData.get("status") as Project["status"],
      year: Number(formData.get("year")),
      purpose: formData.get("purpose") as string,
      description: formData.get("description") as string,
      image: formData.get("image") as string || "from-primary/40 via-accent/20 to-primary/10",
      results: editingProject?.results || ["Initial dataset created", "Baseline models trained"],
      tech: editingProject?.tech || ["React", "PyTorch", "Python"],
    };

    const token = sessionStorage.getItem("auth_token");
    const isEditing = !!editingProject?.id;
    const url = isEditing ? `https://lab-website-tblf.onrender.com/api/projects/${editingProject.id}` : "https://lab-website-tblf.onrender.com/api/projects";
    const method = isEditing ? "PUT" : "POST";

    fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(newProj)
    })
      .then(async res => {
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || errData.message || "Save failed");
        }
        return res.json();
      })
      .then(savedProj => {
        if (isEditing) {
          setProjects(projects.map(p => p.id === editingProject.id ? savedProj : p));
          showNotification("Project updated successfully!");
          addSessionNotification(`Project details for '${savedProj.title}' updated`, "success");
        } else {
          setProjects([...projects, savedProj]);
          showNotification("Project added successfully!");
          addSessionNotification(`New research project '${savedProj.title}' created`, "success");
        }
        setIsProjectModalOpen(false);
        setEditingProject(null);
      })
      .catch(err => showNotification(err.message, "error"));
  };

  const handleSaveSupervised = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const sno = editingSupervised?.sno || (supervisedProjects.length > 0 ? Math.max(...supervisedProjects.map(p => p.sno)) + 1 : 1);

    const newSupervised: SupervisedProject = {
      sno,
      studentName: formData.get("studentName") as string,
      rollNo: formData.get("rollNo") as string,
      title: formData.get("title") as string,
      explanation: formData.get("explanation") as string,
      type: formData.get("type") as SupervisedProject["type"],
      status: formData.get("status") as SupervisedProject["status"],
    };

    const token = sessionStorage.getItem("auth_token");
    const isEditing = !!editingSupervised?.sno;
    const url = isEditing ? `https://lab-website-tblf.onrender.com/api/supervised/${editingSupervised.sno}` : "https://lab-website-tblf.onrender.com/api/supervised";
    const method = isEditing ? "PUT" : "POST";

    fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(newSupervised)
    })
      .then(async res => {
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || errData.message || "Save failed");
        }
        return res.json();
      })
      .then(savedSupervised => {
        if (isEditing) {
          setSupervisedProjects(supervisedProjects.map(p => p.sno === editingSupervised.sno ? savedSupervised : p));
          showNotification("Supervised project updated!");
          addSessionNotification(`Supervised project for '${savedSupervised.studentName}' updated`, "success");
        } else {
          setSupervisedProjects([...supervisedProjects, savedSupervised]);
          showNotification("Supervised project added!");
          addSessionNotification(`New supervised project registered for '${savedSupervised.studentName}'`, "success");
        }
        setIsSupervisedModalOpen(false);
        setEditingSupervised(null);
      })
      .catch(err => showNotification(err.message, "error"));
  };

  const handleSaveAchievement = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const id = editingAchievement?.id || generateId("ach");

    const newAch: Achievement = {
      id,
      title: formData.get("title") as string,
      detail: formData.get("detail") as string,
      year: Number(formData.get("year")),
      category: formData.get("category") as Achievement["category"],
      org: formData.get("org") as string || undefined,
    };

    const token = sessionStorage.getItem("auth_token");
    const isEditing = !!editingAchievement?.id;
    const url = isEditing ? `https://lab-website-tblf.onrender.com/api/achievements/${editingAchievement.id}` : "https://lab-website-tblf.onrender.com/api/achievements";
    const method = isEditing ? "PUT" : "POST";

    fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(newAch)
    })
      .then(async res => {
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || errData.message || "Save failed");
        }
        return res.json();
      })
      .then(savedAch => {
        if (isEditing) {
          setAchievements(achievements.map(a => a.id === editingAchievement.id ? savedAch : a));
          showNotification("Achievement updated successfully!");
          addSessionNotification(`Achievement milestone '${savedAch.title}' updated`, "success");
        } else {
          setAchievements([...achievements, savedAch]);
          showNotification("Achievement added successfully!");
          addSessionNotification(`New achievement milestone '${savedAch.title}' added`, "success");
        }
        setIsAchievementModalOpen(false);
        setEditingAchievement(null);
      })
      .catch(err => showNotification(err.message, "error"));
  };

  const handleSaveUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const id = editingUpdate?.id || Math.floor(Math.random() * 100000);

    const newUpdate: Update = {
      id,
      date: formData.get("date") as string,
      tag: formData.get("tag") as string,
      title: formData.get("title") as string,
      desc: formData.get("desc") as string,
      link: formData.get("link") as string,
    };

    const token = sessionStorage.getItem("auth_token");
    const isEditing = !!editingUpdate?.id;
    const url = isEditing ? `https://lab-website-tblf.onrender.com/api/updates/${editingUpdate.id}` : "https://lab-website-tblf.onrender.com/api/updates";
    const method = isEditing ? "PUT" : "POST";

    fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(newUpdate)
    })
      .then(async res => {
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || errData.message || "Save failed");
        }
        return res.json();
      })
      .then(savedUpdate => {
        if (isEditing) {
          setLiveUpdates(liveUpdates.map(u => u.id === editingUpdate.id ? savedUpdate : u));
          showNotification("Update saved successfully!");
        } else {
          setLiveUpdates([...liveUpdates, savedUpdate]);
          showNotification("Update added successfully!");
        }
        setIsUpdateModalOpen(false);
        setEditingUpdate(null);
      })
      .catch(err => showNotification(err.message, "error"));
  };

  // Settings Handlers
  const handleExportDatabase = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(
      JSON.stringify({ people, projects, achievements, supervisedProjects, resources, stats }, null, 2)
    );
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${labName.toLowerCase().replace(/\s+/g, '_')}_backup.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showNotification("Database exported successfully!");
  };

  const handleResetDatabase = () => {
    triggerConfirm(
      "Reset Database",
      "Are you sure you want to reset the database? All custom modifications will be permanently lost.",
      () => {
        setPeople(initialPeople);
        setProjects(initialProjects);
        setAchievements(initialAchievements);
        setSupervisedProjects(initialSupervisedProjects);
        setResources(initialResources);
        setStats(initialStats);
        showNotification("Database reset to defaults.");
        addSessionNotification("Database reset to defaults", "warning");
      },
      "Reset Data",
      "danger"
    );
  };

  const handleSaveSettings = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setLabName(formData.get("labName") as string);
    setLabEmail(formData.get("labEmail") as string);
    setScholarId(formData.get("scholarId") as string);
    setSessionTimeout(formData.get("sessionTimeout") as string);
    setAccentPalette(formData.get("accentPalette") as string);
    setIsSettingsModalOpen(false);
    showNotification("Settings saved successfully!");
  };

  // Sub-array item builders (Skills, publications, etc. inside Person Form)
  const addPersonSubItem = (type: "skills" | "domains" | "education" | "publications" | "awards" | "conferences" | "links") => {
    if (!editingPerson) return;
    const updated = { ...editingPerson };

    if (type === "skills") updated.skills = [...(updated.skills || []), "New Skill"];
    if (type === "domains") updated.domains = [...(updated.domains || []), "New Research Domain"];
    if (type === "education") updated.education = [...(updated.education || []), { degree: "", field: "", institute: "", year: "" }];
    if (type === "publications") updated.publications = [...(updated.publications || []), { id: generateId("pub"), title: "", venue: "", year: new Date().getFullYear(), month: 1, type: "Conference", domain: "" }];
    if (type === "awards") updated.awards = [...(updated.awards || []), { id: generateId("award"), title: "", org: "", year: new Date().getFullYear(), month: 1 }];
    if (type === "conferences") updated.conferences = [...(updated.conferences || []), { id: generateId("conf"), name: "", place: "", year: new Date().getFullYear(), month: 1, role: "" }];
    if (type === "links") updated.links = [...(updated.links || []), { label: "", href: "" }];

    setEditingPerson(updated);
  };

  const removePersonSubItem = (type: "skills" | "domains" | "education" | "publications" | "awards" | "conferences" | "links", index: number) => {
    if (!editingPerson) return;
    const updated = { ...editingPerson };

    if (type === "skills") updated.skills = updated.skills.filter((_, i) => i !== index);
    if (type === "domains") updated.domains = updated.domains.filter((_, i) => i !== index);
    if (type === "education") updated.education = updated.education.filter((_, i) => i !== index);
    if (type === "publications") updated.publications = updated.publications.filter((_, i) => i !== index);
    if (type === "awards") updated.awards = updated.awards.filter((_, i) => i !== index);
    if (type === "conferences") updated.conferences = updated.conferences.filter((_, i) => i !== index);
    if (type === "links") updated.links = updated.links?.filter((_, i) => i !== index);

    setEditingPerson(updated);
  };

  const updatePersonSubItemValue = (
    type: "skills" | "domains" | "education" | "publications" | "awards" | "conferences" | "links",
    index: number,
    field: string,
    val: string | number
  ) => {
    if (!editingPerson) return;
    const updated = { ...editingPerson };

    if (type === "skills") updated.skills[index] = val as string;
    if (type === "domains") updated.domains[index] = val as string;
    if (type === "education") updated.education[index] = { ...updated.education[index], [field]: val };
    if (type === "publications") updated.publications[index] = { ...updated.publications[index], [field]: val };
    if (type === "awards") updated.awards[index] = { ...updated.awards[index], [field]: val };
    if (type === "conferences") updated.conferences[index] = { ...updated.conferences[index], [field]: val };
    if (type === "links" && updated.links) updated.links[index] = { ...updated.links[index], [field]: val };

    setEditingPerson(updated);
  };

  const toggleProjectExpansion = (id: string) => {
    setExpandedProjects(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Dynamic counter modification helpers
  const modifyStat = (key: keyof typeof stats, amount: number) => {
    const newValue = Math.max(0, (stats[key] || 0) + amount);
    setStats(prev => ({
      ...prev,
      [key]: newValue
    }));

    const token = sessionStorage.getItem("auth_token");
    fetch(`https://lab-website-tblf.onrender.com/api/stats/${key}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ value: newValue })
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to save stat to server");
        showNotification(`Updated ${key} counter!`);
      })
      .catch(err => showNotification(err.message, "error"));
  };

  const handleUpdateStatDirectly = (key: string, value: number) => {
    setStats(prev => ({
      ...prev,
      [key]: value
    }));

    const token = sessionStorage.getItem("auth_token");
    fetch(`https://lab-website-tblf.onrender.com/api/stats/${key}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ value })
    })
      .catch(err => console.error("Error saving stat:", err));
  };

  // Color mapping helper for timeline categories
  const getAchievementStyles = (category: Achievement["category"]) => {
    switch (category) {
      case "Patent":
        return {
          glow: "shadow-purple-500/10 dark:shadow-purple-500/20 border-purple-500/30 dark:border-purple-500/40 hover:border-purple-500/60 dark:hover:border-purple-500/80",
          badge: "bg-purple-500/10 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400 border border-purple-500/20 dark:border-purple-800/30",
          nodeColor: "bg-purple-500 dark:bg-purple-400 ring-purple-500/20 dark:ring-purple-900/50"
        };
      case "Grant":
        return {
          glow: "shadow-sky-500/10 dark:shadow-sky-500/20 border-sky-500/30 dark:border-sky-500/40 hover:border-sky-500/60 dark:hover:border-sky-500/80",
          badge: "bg-sky-500/10 text-sky-700 dark:bg-sky-950/40 dark:text-sky-400 border border-sky-500/20 dark:border-sky-800/30",
          nodeColor: "bg-sky-500 dark:bg-sky-400 ring-sky-500/20 dark:ring-sky-900/50"
        };
      case "Recognition":
        return {
          glow: "shadow-amber-500/10 dark:shadow-amber-500/20 border-amber-500/30 dark:border-amber-500/40 hover:border-amber-500/60 dark:hover:border-amber-500/80",
          badge: "bg-amber-500/10 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-500/20 dark:border-amber-800/30",
          nodeColor: "bg-amber-500 dark:bg-amber-400 ring-amber-500/20 dark:ring-amber-900/50"
        };
      default: // Milestone
        return {
          glow: "shadow-emerald-500/10 dark:shadow-emerald-500/20 border-emerald-500/30 dark:border-emerald-500/40 hover:border-emerald-500/60 dark:hover:border-emerald-500/80",
          badge: "bg-emerald-500/10 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-500/20 dark:border-emerald-800/30",
          nodeColor: "bg-emerald-500 dark:bg-emerald-400 ring-emerald-500/20 dark:ring-emerald-900/50"
        };
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden bg-grid-cyber">
        {/* Floating decorative blobs for premium feel */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-primary/10 blur-3xl animate-wave-slow pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-accent/8 blur-3xl animate-wave-fast pointer-events-none" />
        
        {/* Toast Notification */}
        {notification && (
          <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border transition-all duration-300 transform scale-100 ${notification.type === "success" ? "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/90 dark:text-emerald-300 dark:border-emerald-800" : "bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/90 dark:text-rose-300 dark:border-rose-800"}`}>
            <Check size={18} />
            <span className="text-sm font-medium">{notification.message}</span>
          </div>
        )}

        <div className="w-full max-w-md p-8 rounded-3xl glass shadow-neon-primary border border-border/40 relative z-10 transition-all duration-300">
          {authView === "login" && (
            <LoginForm 
              onLoginSuccess={(user) => {
                setCurrentUser(user);
                setIsAuthenticated(true);
              }}
              onNavigate={setAuthView}
              showNotification={showNotification}
            />
          )}
          {authView === "signup" && (
            <SignUpForm 
              onNavigate={setAuthView}
              showNotification={showNotification}
            />
          )}
          {authView === "forgot" && (
            <ForgotPasswordForm 
              onNavigate={setAuthView}
              showNotification={showNotification}
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-hidden flex text-foreground bg-background transition-colors duration-300">
      
      {/* Toast Notification */}
      {/* Toast Notification */}
      {notification && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border transition-all duration-300 transform scale-100 ${notification.type === "success" ? "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/90 dark:text-emerald-300 dark:border-emerald-800" : "bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/90 dark:text-rose-300 dark:border-rose-800"}`}>
          <Check size={18} />
          <span className="text-sm font-medium">{notification.message}</span>
        </div>
      )}

      {/* Mobile Sidebar Backdrop Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/45 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* =========================================================================
      // MAIN SIDEBAR UI
      // =========================================================================
      // This section defines the navigation menu on the left side of the dashboard.
      // It includes buttons for Dashboard, Team Members, Projects, etc.
      // Clicking a button updates the 'activeTab' state, which controls what content is shown in the Main Panel Area. */}
  {/* Sidebar Navigation */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 md:relative md:inset-auto md:z-0 bg-card flex flex-col shrink-0 h-screen transition-all duration-300 ease-in-out overflow-hidden
          ${sidebarOpen 
            ? "w-64 translate-x-0 opacity-100 border-r border-border" 
            : "-translate-x-full opacity-0 pointer-events-none md:translate-x-0 md:w-16 md:opacity-100 md:border-r md:border-border md:pointer-events-auto"
          }
        `}
      >
        <div className="w-full h-full flex flex-col">
          
          {/* Brand Header */}
          <div className={`p-4 border-b border-border flex items-center ${sidebarOpen ? "justify-between" : "justify-center"} h-[73px]`}>
            {sidebarOpen && (
              <div className="flex items-center gap-2.5 overflow-hidden">
                <img src="/logo.png" alt="ViBeS Lab" className="h-8 w-8 object-contain shrink-0" />
                <div className="flex flex-col text-left whitespace-nowrap">
                  <span className="font-display font-black text-sm leading-none tracking-tight text-foreground">{labName}</span>
                </div>
              </div>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition duration-300 flex items-center justify-center cursor-pointer focus:outline-none shrink-0"
            >
              <Menu size={20} />
            </button>
          </div>

          {/* Tab Selection */}
          <div className="flex-1 flex flex-col justify-between py-6 overflow-y-auto overflow-x-hidden custom-scrollbar">
            <nav className="space-y-3 px-2">
              <button
                onClick={() => { setActiveTab("dashboard"); if (window.innerWidth < 768) setSidebarOpen(false); }}
                className={`w-full flex items-center ${sidebarOpen ? "gap-3 px-3 justify-start" : "justify-center px-0"} py-3 rounded-xl text-xs font-semibold transition-all relative ${activeTab === "dashboard" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"}`}
              >
                {activeTab === "dashboard" && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#e88c0a] rounded-r-md" />}
                <LayoutDashboard size={20} />
                {sidebarOpen && <span>Dashboard</span>}
              </button>
              
              <button
                onClick={() => { setActiveTab("team"); if (window.innerWidth < 768) setSidebarOpen(false); }}
                className={`w-full flex items-center ${sidebarOpen ? "gap-3 px-3 justify-start" : "justify-center px-0"} py-3 rounded-xl text-xs font-semibold transition-all relative ${activeTab === "team" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"}`}
              >
                {activeTab === "team" && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#e88c0a] rounded-r-md" />}
                <Users size={20} />
                {sidebarOpen && <span>Team Members</span>}
              </button>

              <button
                onClick={() => { setActiveTab("projects"); if (window.innerWidth < 768) setSidebarOpen(false); }}
                className={`w-full flex items-center ${sidebarOpen ? "gap-3 px-3 justify-start" : "justify-center px-0"} py-3 rounded-xl text-xs font-semibold transition-all relative ${activeTab === "projects" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"}`}
              >
                {activeTab === "projects" && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#e88c0a] rounded-r-md" />}
                <FolderGit2 size={20} />
                {sidebarOpen && <span>Research Projects</span>}
              </button>

              <button
                onClick={() => { setActiveTab("thesis"); if (window.innerWidth < 768) setSidebarOpen(false); }}
                className={`w-full flex items-center ${sidebarOpen ? "gap-3 px-3 justify-start" : "justify-center px-0"} py-3 rounded-xl text-xs font-semibold transition-all relative ${activeTab === "thesis" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"}`}
              >
                {activeTab === "thesis" && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#e88c0a] rounded-r-md" />}
                <GraduationCap size={20} />
                {sidebarOpen && <span>Thesis Board</span>}
              </button>

              <button
                onClick={() => { setActiveTab("achievements"); if (window.innerWidth < 768) setSidebarOpen(false); }}
                className={`w-full flex items-center ${sidebarOpen ? "gap-3 px-3 justify-start" : "justify-center px-0"} py-3 rounded-xl text-xs font-semibold transition-all relative ${activeTab === "achievements" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"}`}
              >
                {activeTab === "achievements" && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#e88c0a] rounded-r-md" />}
                <Trophy size={20} />
                {sidebarOpen && <span>Achievements</span>}
              </button>

              <button
                onClick={() => { setActiveTab("resources"); if (window.innerWidth < 768) setSidebarOpen(false); }}
                className={`w-full flex items-center ${sidebarOpen ? "gap-3 px-3 justify-start" : "justify-center px-0"} py-3 rounded-xl text-xs font-semibold transition-all relative ${activeTab === "resources" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"}`}
              >
                {activeTab === "resources" && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#e88c0a] rounded-r-md" />}
                <Cpu size={20} />
                {sidebarOpen && <span>Stats & Specs</span>}
              </button>

              <button
                onClick={() => { setActiveTab("updates"); if (window.innerWidth < 768) setSidebarOpen(false); }}
                className={`w-full flex items-center ${sidebarOpen ? "gap-3 px-3 justify-start" : "justify-center px-0"} py-3 rounded-xl text-xs font-semibold transition-all relative ${activeTab === "updates" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"}`}
              >
                {activeTab === "updates" && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#e88c0a] rounded-r-md" />}
                <Activity size={20} />
                {sidebarOpen && <span>Live Updates</span>}
              </button>
            </nav>

            <div className="pt-4 mt-6 border-t border-border/40 px-2">
              <button
                onClick={() => {
                  triggerConfirm(
                    "Logout Session",
                    "Are you sure you want to log out from the admin console?",
                    () => {
                      sessionStorage.removeItem("auth_token");
                      sessionStorage.removeItem("auth_user");
                      setIsAuthenticated(false);
                      setAuthView("login");
                      showNotification("Logged out successfully", "success");
                    },
                    "Logout",
                    "danger"
                  );
                }}
                className={`w-full flex items-center ${sidebarOpen ? "gap-3 px-3 justify-start" : "justify-center px-0"} py-3 rounded-xl text-xs font-semibold text-rose-500 hover:bg-rose-500/10 hover:text-rose-600 transition-all cursor-pointer`}
              >
                <LogOut size={20} />
                {sidebarOpen && <span>Logout</span>}
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Panel Area */}
      <main className="flex-1 overflow-y-auto p-8 lg:p-10 relative transition-all duration-300">

        {/* TOP BAR HEADER */}
        <div className="flex items-center justify-between gap-4 mb-8 pb-5 border-b border-border/20 sticky top-0 bg-background/85 backdrop-blur-md z-30 transition-all duration-300">
          <div className="flex items-center gap-4">
            {/* Hamburger/Menu Toggle Button (Mobile Only) */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-xl border border-border/50 bg-card hover:bg-muted text-muted-foreground hover:text-foreground transition duration-300 flex md:hidden items-center justify-center cursor-pointer focus:outline-none"
              title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
            >
              <Menu size={18} />
            </button>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2.5">
            {/* Premium Theme Toggle Switch */}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="relative w-14 h-8 rounded-full border border-border/50 bg-muted/30 p-1 flex items-center justify-between cursor-pointer transition-all duration-300 hover:border-border mr-1.5 shrink-0 focus:outline-none"
              title="Toggle theme"
            >
              <div 
                className="absolute top-1 left-1 w-6 h-6 rounded-full bg-card shadow-md border border-border/50 flex items-center justify-center transition-all duration-300 transform"
                style={{ transform: theme === "dark" ? "translateX(24px)" : "translateX(0px)" }}
              >
                {theme === "dark" ? (
                  <Moon size={12} className="text-sky-400 fill-sky-400/20" />
                ) : (
                  <Sun size={12} className="text-amber-500 fill-amber-500/20" />
                )}
              </div>
              <Sun size={12} className={`ml-1.5 transition-opacity duration-300 ${theme === "light" ? "text-amber-500 opacity-100" : "text-muted-foreground opacity-40"}`} />
              <Moon size={12} className={`mr-1.5 transition-opacity duration-300 ${theme === "dark" ? "text-sky-400 opacity-100" : "text-muted-foreground opacity-40"}`} />
            </button>



            {/* Inbox / Messages Dropdown */}
            <div className="relative inbox-dropdown-container">
              <button 
                onClick={() => {
                  setIsMessagesOpen(!isMessagesOpen);
                  setIsNotificationsOpen(false);
                }}
                className={`p-1.5 rounded-xl border border-border/50 bg-card hover:bg-muted text-muted-foreground hover:text-foreground transition relative cursor-pointer ${isMessagesOpen ? "bg-muted text-foreground border-primary/40" : ""}`}
                title="Inbox Messages"
              >
                <Mail size={15} />
                {messages.some(m => !m.read) && (
                  <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                )}
              </button>
              
              {isMessagesOpen && (
                <div className="absolute right-0 mt-2.5 w-80 glass border border-border/40 rounded-2xl shadow-xl z-50 overflow-hidden text-left">
                  {/* Header */}
                  <div className="px-4 py-3 border-b border-border/40 flex items-center justify-between bg-card/60 backdrop-blur">
                    <span className="text-xs font-bold text-foreground">Inbox Messages</span>
                    {messages.filter(m => !m.read).length > 0 && (
                      <span className="px-2 py-0.5 text-[9px] font-bold bg-primary/10 text-primary border border-primary/20 rounded-full">
                        {messages.filter(m => !m.read).length} New
                      </span>
                    )}
                  </div>
                  
                  {/* Message List */}
                  <div className="max-h-64 overflow-y-auto divide-y divide-border/20">
                    {messages.length === 0 ? (
                      <div className="p-6 text-center text-xs text-muted-foreground">
                        No messages received yet.
                      </div>
                    ) : (
                      messages.map((msg) => (
                        <div 
                          key={msg._id}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setSelectedMessage(msg);
                            setIsMessagesOpen(false);
                            // Mark as read in backend
                            if (!msg.read) {
                              // Optimistic update
                              setMessages(prev => prev.map(m => m._id === msg._id ? { ...m, read: true } : m));
                              
                              const token = sessionStorage.getItem("auth_token");
                              fetch(`https://lab-website-tblf.onrender.com/api/contact/${msg._id}`, {
                                method: "PUT",
                                headers: { 
                                  "Content-Type": "application/json",
                                  "Authorization": `Bearer ${token}` 
                                },
                                body: JSON.stringify({ read: true })
                              }).catch(err => console.error("Error marking read:", err));
                            }
                          }}
                          className={`p-3.5 hover:bg-muted/40 transition duration-150 cursor-pointer flex gap-3 items-start ${!msg.read ? "bg-primary/5 border-l-2 border-primary" : ""}`}
                        >
                          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary/20 to-accent/10 border border-primary/10 flex items-center justify-center text-primary font-display font-bold text-xs shrink-0 select-none">
                            {getUserInitials(msg.name)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1 mb-0.5">
                              <span className="text-xs font-bold text-foreground truncate">{msg.name}</span>
                              <span className="text-[9px] text-muted-foreground shrink-0 font-mono">
                                {new Date(msg.createdAt).toLocaleDateString([], { month: "short", day: "numeric" })}
                              </span>
                            </div>
                            <p className="text-[10px] text-muted-foreground truncate leading-normal">{msg.message}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  
                  {/* Footer */}
                  {messages.some(m => !m.read) && (
                    <div className="p-2 border-t border-border/20 bg-muted/20 text-center">
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          // Mark all as read
                          const unread = messages.filter(m => !m.read);
                          if (unread.length === 0) {
                            setIsMessagesOpen(false);
                            return;
                          }
                          
                          const token = sessionStorage.getItem("auth_token");
                          
                          // Optimistic update
                          setMessages(prev => prev.map(m => ({ ...m, read: true })));
                          showNotification("All messages marked as read");
                          setIsMessagesOpen(false);
                          
                          Promise.all(unread.map(m => 
                            fetch(`https://lab-website-tblf.onrender.com/api/contact/${m._id}`, {
                              method: "PUT",
                              headers: { 
                                "Content-Type": "application/json",
                                "Authorization": `Bearer ${token}` 
                              },
                              body: JSON.stringify({ read: true })
                            }).then(res => res.json())
                          )).catch(err => console.error("Error marking all read:", err));
                        }}
                        className="text-[10px] font-bold text-primary hover:text-primary/95 transition w-full py-1 text-center cursor-pointer"
                      >
                        Mark all as read
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Alerts / Notifications Dropdown */}
            <div className="relative alerts-dropdown-container">
              <button 
                onClick={() => {
                  setIsNotificationsOpen(!isNotificationsOpen);
                  setIsMessagesOpen(false);
                }}
                className={`p-1.5 rounded-xl border border-border/50 bg-card hover:bg-muted text-muted-foreground hover:text-foreground transition relative cursor-pointer ${isNotificationsOpen ? "bg-muted text-foreground border-accent/40" : ""}`}
                title="Notifications"
              >
                <Bell size={15} />
                {notifications.length > 0 && (
                  <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
                )}
              </button>
              
              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2.5 w-80 glass border border-border/40 rounded-2xl shadow-xl z-50 overflow-hidden text-left">
                  {/* Header */}
                  <div className="px-4 py-3 border-b border-border/40 flex items-center justify-between bg-card/60 backdrop-blur">
                    <span className="text-xs font-bold text-foreground">Notifications Log</span>
                    {notifications.length > 0 && (
                      <span className="px-2 py-0.5 text-[9px] font-bold bg-accent/10 text-accent border border-accent/20 rounded-full">
                        {notifications.length} Events
                      </span>
                    )}
                  </div>
                  
                  {/* Alerts List */}
                  <div className="max-h-64 overflow-y-auto divide-y divide-border/20">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-xs text-muted-foreground">
                        No notifications in this session.
                      </div>
                    ) : (
                      notifications.map((notif) => {
                        const getColors = () => {
                          if (notif.type === "success") return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
                          if (notif.type === "warning") return "bg-rose-500/10 text-rose-500 border-rose-500/20";
                          return "bg-sky-500/10 text-sky-500 border-sky-500/20";
                        };
                        return (
                          <div 
                            key={notif.id}
                            className="p-3.5 hover:bg-muted/40 transition duration-150 flex gap-3 items-start"
                          >
                            <span className={`px-1.5 py-0.5 text-[8px] font-bold border rounded uppercase tracking-wider shrink-0 mt-0.5 select-none font-mono ${getColors()}`}>
                              {notif.type}
                            </span>
                            <div className="flex-1 min-w-0">
                              <p className="text-[10px] text-foreground font-semibold leading-normal break-words">{notif.message}</p>
                              <span className="text-[9px] text-muted-foreground font-mono block mt-1">{notif.time}</span>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                  
                  {/* Footer */}
                  {notifications.length > 0 && (
                    <div className="p-2 border-t border-border/20 bg-muted/20 text-center">
                      <button 
                        onClick={() => {
                          setNotifications([]);
                          setIsNotificationsOpen(false);
                          showNotification("Notification logs cleared");
                        }}
                        className="text-[10px] font-bold text-rose-500 hover:text-rose-600 transition w-full py-1 text-center cursor-pointer"
                      >
                        Clear logs history
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* User Profile */}
            <div className="flex items-center gap-2.5 pl-2.5 border-l border-border/30">
              <div className="h-8.5 w-8.5 rounded-xl bg-gradient-to-br from-primary/30 to-accent/20 text-primary font-display font-black text-xs flex items-center justify-center border border-primary/20 shrink-0 select-none">
                {getUserInitials(currentUser?.name || "")}
              </div>
              <div className="hidden md:flex flex-col text-left">
                <span className="text-xs font-bold text-foreground leading-tight">
                  {currentUser?.name || "User"}
                </span>
                <span className="text-[9px] text-muted-foreground font-mono leading-none">
                  {currentUser?.role || "Guest"} • {currentUser?.email || ""}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* PAGE SPECIFIC HEADER (TIER 2) */}
        <header className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-display font-bold tracking-tight text-foreground flex items-center gap-2">
              {activeTab === "dashboard" && "Dashboard"}
              {activeTab === "team" && "Team Directory"}
              {activeTab === "projects" && "Research Projects"}
              {activeTab === "thesis" && "Thesis Board"}
              {activeTab === "achievements" && "Achievements Timeline"}
              {activeTab === "resources" && "Stats & Resources Console"}
              {activeTab === "updates" && "Live Updates Editor"}
            </h2>
            <p className="text-xs text-muted-foreground mt-1 leading-normal">
              {activeTab === "dashboard" && "Plan, prioritize, and accomplish your tasks with ease."}
              {activeTab === "team" && "Manage lab lead, research scholars, UG/PG students and alumni."}
              {activeTab === "projects" && "Asymmetric grid view of main grants and funded research portfolios."}
              {activeTab === "thesis" && "Supervised student thesis board for Master (MTP) and Bachelor (BTP) projects."}
              {activeTab === "achievements" && "Interactive history timeline showing lab grants, milestones, and patents."}
              {activeTab === "resources" && "Futuristic control center to update key stats dials and equipment specs."}
              {activeTab === "updates" && "Manage the scrolling Live Updates ticker seen on the frontend homepage."}
            </p>
          </div>
        </header>

        {/* 1. OVERVIEW PAGE */}
        {activeTab === "dashboard" && (() => {
          // Dynamic database aggregations
          const allPubs = people.flatMap(p => p.publications || []);
          const uniquePubsMap = new Map();
          allPubs.forEach(pub => {
            if (pub && pub.id) uniquePubsMap.set(pub.id, pub);
          });
          const uniquePubs = Array.from(uniquePubsMap.values());
          
          const totalPubsCount = uniquePubs.length;
          const totalScholarsCount = people.filter(p => p.role === "scholar").length;
          const ipCount = achievements.filter(a => a.category === "Patent").length + uniquePubs.filter(p => p.type === "Patent").length;

          // Outlay calculations (read from editable stats in real-time)
          const outlayText = stats.outlay !== undefined ? `₹${stats.outlay.toFixed(2)}L` : "₹0L";

          // Chart 1: Publications & Citations trend Math
          const years = [2021, 2022, 2023, 2024, 2025, 2026];
          const pubsData = years.map(y => uniquePubs.filter(p => p.year === y).length);
          const citationsData = [45, 90, 175, 310, 480, 620]; // Cumulative trend

          const maxPubs = Math.max(...pubsData, 6);
          const maxCitations = 650;

          const getX = (idx: number) => 45 + (idx / 5) * 435;
          const getPubY = (val: number) => 170 - (val / maxPubs) * 130;
          const getCitY = (val: number) => 170 - (val / maxCitations) * 130;

          const pubPath = "M " + pubsData.map((val, idx) => `${getX(idx)} ${getPubY(val)}`).join(" L ");
          const citPath = "M " + citationsData.map((val, idx) => `${getX(idx)} ${getCitY(val)}`).join(" L ");

          const pubFill = `${pubPath} L ${getX(5)} 180 L ${getX(0)} 180 Z`;
          const citFill = `${citPath} L ${getX(5)} 180 L ${getX(0)} 180 Z`;

          // Chart 2: Domain Donut Chart Math
          const groupedDomainCounts: Record<string, number> = {
            "Visual Surveillance": 0,
            "Biometrics": 0,
            "Computer Vision": 0,
            "Others": 0
          };
          uniquePubs.forEach(pub => {
            const d = pub.domain;
            if (d === "Visual Surveillance") groupedDomainCounts["Visual Surveillance"]++;
            else if (d === "Biometrics") groupedDomainCounts["Biometrics"]++;
            else if (d === "Computer Vision") groupedDomainCounts["Computer Vision"]++;
            else groupedDomainCounts["Others"]++;
          });

          const domainData = [
            { label: "Visual Surveillance", count: groupedDomainCounts["Visual Surveillance"], color: "var(--primary)" },
            { label: "Biometrics", count: groupedDomainCounts["Biometrics"], color: "var(--accent)" },
            { label: "Computer Vision", count: groupedDomainCounts["Computer Vision"], color: "oklch(0.7 0.13 280)" },
            { label: "Others", count: groupedDomainCounts["Others"], color: "var(--muted-foreground)" }
          ];

          const totalDomainCount = domainData.reduce((sum, d) => sum + d.count, 0) || 1;
          
          let accumulatedPercent = 0;
          const donutSlices = domainData.map((d) => {
            const percent = d.count / totalDomainCount;
            const strokeDashoffset = -accumulatedPercent * 188.5;
            accumulatedPercent += percent;
            return {
              ...d,
              percent,
              strokeDasharray: `${percent * 188.5} 188.5`,
              strokeDashoffset
            };
          });

          const hoveredSliceDetails = hoveredPieSlice !== null ? donutSlices[hoveredPieSlice] : null;

          return (
            <div className="space-y-8 bg-radial-glow pb-8 rounded-3xl">
              
              {/* Glowing Cyber Stats Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* Outlay Card */}
                <div className="glass p-5 rounded-2xl border-neon-accent hover:scale-[1.02] transform transition-all duration-300 flex flex-col justify-between h-36 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-5 text-accent group-hover:scale-110 transition-transform">
                    <Activity size={70} />
                  </div>
                  <div className="flex items-center justify-between z-10">
                    <span className="text-[10px] font-bold text-accent uppercase tracking-widest">Research Outlay</span>
                    <span className="px-2 py-0.5 rounded-full bg-accent/15 text-accent text-[9px] font-bold">Grants</span>
                  </div>
                  <div className="mt-4 z-10 text-left">
                    <div className="text-3xl font-display font-black text-gradient leading-none">{outlayText}</div>
                    <p className="text-[10px] text-muted-foreground mt-2 font-medium">TiHAN-IIT Hyd & DST SERB</p>
                  </div>
                </div>

                {/* Publications Card */}
                <div className="glass p-5 rounded-2xl border-neon-primary hover:scale-[1.02] transform transition-all duration-300 flex flex-col justify-between h-36 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-5 text-primary group-hover:scale-110 transition-transform">
                    <FileText size={70} />
                  </div>
                  <div className="flex items-center justify-between z-10">
                    <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Publications</span>
                    <span className="px-2 py-0.5 rounded-full bg-primary/15 text-primary text-[9px] font-bold">Total</span>
                  </div>
                  <div className="mt-4 z-10 text-left">
                    <div className="text-3xl font-display font-black text-gradient leading-none">{totalPubsCount}</div>
                    <p className="text-[10px] text-muted-foreground mt-2 font-medium">Journals, Conferences & Patents</p>
                  </div>
                </div>

                {/* Scholars Card */}
                <div className="glass p-5 rounded-2xl border-neon-primary hover:scale-[1.02] transform transition-all duration-300 flex flex-col justify-between h-36 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-5 text-primary group-hover:scale-110 transition-transform">
                    <Users size={70} />
                  </div>
                  <div className="flex items-center justify-between z-10">
                    <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Active Scholars</span>
                    <span className="px-2 py-0.5 rounded-full bg-primary/15 text-primary text-[9px] font-bold">Scientists</span>
                  </div>
                  <div className="mt-4 z-10 text-left">
                    <div className="text-3xl font-display font-black text-gradient leading-none">{totalScholarsCount}</div>
                    <p className="text-[10px] text-muted-foreground mt-2 font-medium">PhD, M.Tech & B.Tech</p>
                  </div>
                </div>

                {/* IP Card */}
                <div className="glass p-5 rounded-2xl border-neon-accent hover:scale-[1.02] transform transition-all duration-300 flex flex-col justify-between h-36 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-5 text-accent group-hover:scale-110 transition-transform">
                    <Trophy size={70} />
                  </div>
                  <div className="flex items-center justify-between z-10">
                    <span className="text-[10px] font-bold text-accent uppercase tracking-widest">Intellectual Property</span>
                    <span className="px-2 py-0.5 rounded-full bg-accent/15 text-accent text-[9px] font-bold">IPR</span>
                  </div>
                  <div className="mt-4 z-10 text-left">
                    <div className="text-3xl font-display font-black text-gradient leading-none">{ipCount}</div>
                    <p className="text-[10px] text-muted-foreground mt-2 font-medium">Patents Filed & Granted</p>
                  </div>
                </div>

              </div>

              {/* Advanced Interactive Visualization Panel */}
              <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
                
                {/* Column 1 (Line Graph): xl:col-span-3 */}
                <div className="glass p-6 rounded-3xl shadow-neon-primary bg-grid-cyber border border-border/40 xl:col-span-3 flex flex-col justify-between relative group overflow-hidden">
                  <div className="flex items-center justify-between mb-4">
                    <div className="space-y-1 text-left">
                      <h3 className="text-base font-display font-bold text-foreground">Publications & Citations Trend</h3>
                      <p className="text-[10px] text-muted-foreground">Interactive dynamic research index & citations growth</p>
                    </div>
                    {/* Legend */}
                    <div className="flex items-center gap-3 text-[9px] font-bold">
                      <div className="flex items-center gap-1">
                        <span className="h-2 w-2 rounded-full bg-primary" />
                        <span className="text-muted-foreground">Publications</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="h-2 w-2 rounded-full bg-accent" />
                        <span className="text-muted-foreground">Citations</span>
                      </div>
                    </div>
                  </div>

                  {/* SVG Chart Area */}
                  <div className="relative w-full h-[220px] select-none" onMouseLeave={() => setHoveredLineNode(null)}>
                    
                    {/* Defs for gradients */}
                    <svg className="absolute w-0 h-0">
                      <defs>
                        <linearGradient id="pubGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.25" />
                          <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
                        </linearGradient>
                        <linearGradient id="citGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.25" />
                          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                    </svg>

                    <svg className="w-full h-full" viewBox="0 0 500 220" preserveAspectRatio="none">
                      
                      {/* Horizontal Gridlines */}
                      {[0, 1, 2, 3].map((g) => {
                        const y = 30 + (g / 3) * 150;
                        return (
                          <line key={g} x1="45" y1={y} x2="485" y2={y} stroke="var(--border)" strokeWidth="0.5" strokeDasharray="3 3" />
                        );
                      })}

                      {/* Area under curves */}
                      <path d={pubFill} fill="url(#pubGrad)" />
                      <path d={citFill} fill="url(#citGrad)" />

                      {/* Line Curves */}
                      <path d={pubPath} fill="none" stroke="var(--primary)" strokeWidth="3" strokeLinecap="round" className="drop-shadow-[0_2px_4px_var(--primary)]" />
                      <path d={citPath} fill="none" stroke="var(--accent)" strokeWidth="3" strokeLinecap="round" className="drop-shadow-[0_2px_4px_var(--accent)]" />

                      {/* Vertical Indicator Line on Hover */}
                      {hoveredLineNode && (
                        <line 
                          x1={getX(hoveredLineNode.index)} 
                          y1="30" 
                          x2={getX(hoveredLineNode.index)} 
                          y2="180" 
                          stroke="var(--primary)" 
                          strokeWidth="1.5" 
                          strokeDasharray="4 2" 
                          opacity="0.6"
                        />
                      )}

                      {/* Data Nodes */}
                      {years.map((y, idx) => (
                        <g key={y}>
                          {/* Publications node */}
                          <circle 
                            cx={getX(idx)} 
                            cy={getPubY(pubsData[idx])} 
                            r={hoveredLineNode?.index === idx ? 6 : 4} 
                            fill="var(--background)" 
                            stroke="var(--primary)" 
                            strokeWidth="2.5" 
                            className="transition-all duration-200 cursor-pointer"
                          />
                          {/* Citations node */}
                          <circle 
                            cx={getX(idx)} 
                            cy={getCitY(citationsData[idx])} 
                            r={hoveredLineNode?.index === idx ? 6 : 4} 
                            fill="var(--background)" 
                            stroke="var(--accent)" 
                            strokeWidth="2.5" 
                            className="transition-all duration-200 cursor-pointer"
                          />
                        </g>
                      ))}

                      {/* X Axis Labels */}
                      {years.map((y, idx) => (
                        <text key={y} x={getX(idx)} y="200" fill="var(--muted-foreground)" fontSize="9" fontWeight="bold" textAnchor="middle">
                          {y}
                        </text>
                      ))}

                      {/* Y Axis Labels (Publications Left, Citations Right) */}
                      <text x="35" y="34" fill="var(--muted-foreground)" fontSize="8" fontWeight="bold" textAnchor="end">{maxPubs}</text>
                      <text x="35" y="105" fill="var(--muted-foreground)" fontSize="8" fontWeight="bold" textAnchor="end">{Math.round(maxPubs/2)}</text>
                      <text x="35" y="180" fill="var(--muted-foreground)" fontSize="8" fontWeight="bold" textAnchor="end">0</text>

                      <text x="495" y="34" fill="var(--muted-foreground)" fontSize="8" fontWeight="bold" textAnchor="start">{maxCitations}</text>
                      <text x="495" y="105" fill="var(--muted-foreground)" fontSize="8" fontWeight="bold" textAnchor="start">325</text>
                      <text x="495" y="180" fill="var(--muted-foreground)" fontSize="8" fontWeight="bold" textAnchor="start">0</text>

                      {/* Transparent Overlay Rectangles for easy hover triggering */}
                      {years.map((y, idx) => (
                        <rect
                          key={y}
                          x={getX(idx) - 25}
                          y={30}
                          width={50}
                          height={150}
                          fill="transparent"
                          className="cursor-pointer"
                          onMouseEnter={() => setHoveredLineNode({
                            index: idx,
                            year: y,
                            papers: pubsData[idx],
                            citations: citationsData[idx]
                          })}
                        />
                      ))}

                    </svg>

                    {/* Floating Telemetry Tooltip */}
                    {hoveredLineNode && (
                      <div 
                        className="absolute glass p-3.5 rounded-xl border border-border/50 shadow-lg text-left space-y-1.5 pointer-events-none z-10 transition-all duration-150 animate-in fade-in zoom-in-95"
                        style={{
                          left: `${(getX(hoveredLineNode.index) / 500) * 100}%`,
                          top: "20px",
                          transform: "translateX(-50%)"
                        }}
                      >
                        <div className="text-[10px] font-bold text-accent uppercase tracking-wider font-mono">ViBeS Analytics · {hoveredLineNode.year}</div>
                        <div className="space-y-1 divide-y divide-border/20">
                          <div className="flex items-center justify-between gap-6 text-[10px] text-foreground font-semibold pt-1">
                            <span>Publications</span>
                            <span className="text-primary font-bold font-mono">{hoveredLineNode.papers} papers</span>
                          </div>
                          <div className="flex items-center justify-between gap-6 text-[10px] text-foreground font-semibold pt-1">
                            <span>Citations</span>
                            <span className="text-accent font-bold font-mono">{hoveredLineNode.citations} times</span>
                          </div>
                        </div>
                      </div>
                    )}

                  </div>
                </div>

                {/* Column 2 (Donut Chart): xl:col-span-2 */}
                <div className="glass p-6 rounded-3xl shadow-neon-accent bg-grid-cyber border border-border/40 xl:col-span-2 flex flex-col justify-between relative group overflow-hidden">
                  <div className="space-y-1 text-left mb-2">
                    <h3 className="text-base font-display font-bold text-foreground">Research Areas</h3>
                    <p className="text-[10px] text-muted-foreground">Publication distribution by scientific domain</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center flex-1 py-2">
                    {/* Left: SVG Donut */}
                    <div className="relative flex items-center justify-center h-40">
                      <svg className="w-36 h-36" viewBox="0 0 100 100">
                        <g transform="rotate(-90 50 50)">
                          {donutSlices.map((slice, index) => (
                            <circle
                              key={slice.label}
                              cx="50"
                              cy="50"
                              r="30"
                              fill="none"
                              stroke={slice.color}
                              strokeWidth={hoveredPieSlice === index ? 10 : 7}
                              strokeDasharray={slice.strokeDasharray}
                              strokeDashoffset={slice.strokeDashoffset}
                              strokeLinecap="round"
                              opacity={hoveredPieSlice === null || hoveredPieSlice === index ? 1 : 0.4}
                              className="transition-all duration-300 cursor-pointer"
                              onMouseEnter={() => setHoveredPieSlice(index)}
                              onMouseLeave={() => setHoveredPieSlice(null)}
                            />
                          ))}
                        </g>
                      </svg>

                      {/* Donut Center Display */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none">
                        {hoveredSliceDetails ? (
                          <>
                            <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground text-center max-w-[80px] truncate leading-tight">
                              {hoveredSliceDetails.label}
                            </span>
                            <span className="text-lg font-display font-black text-foreground mt-0.5 leading-none">
                              {hoveredSliceDetails.count}
                            </span>
                            <span className="text-[8px] font-mono text-accent font-bold mt-0.5">
                              {Math.round(hoveredSliceDetails.percent * 100)}%
                            </span>
                          </>
                        ) : (
                          <>
                            <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground leading-none">
                              Publications
                            </span>
                            <span className="text-xl font-display font-black text-foreground mt-1 leading-none">
                              {totalPubsCount}
                            </span>
                            <span className="text-[8px] font-mono text-primary font-bold mt-0.5">
                              Total
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Right: Detailed Tabular breakdown */}
                    <div className="space-y-2 text-left">
                      <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider border-b border-border/20 pb-1.5">
                        Domain Breakdown
                      </div>
                      <div className="space-y-1.5">
                        {donutSlices.map((slice, index) => {
                          const percentVal = Math.round(slice.percent * 100);
                          return (
                            <div 
                              key={slice.label} 
                              className={`flex flex-col p-1.5 rounded-lg border border-transparent transition cursor-pointer ${hoveredPieSlice === index ? "bg-muted/40 border-border/30 text-foreground" : "text-muted-foreground hover:bg-muted/20"}`}
                              onMouseEnter={() => setHoveredPieSlice(index)}
                              onMouseLeave={() => setHoveredPieSlice(null)}
                            >
                              <div className="flex items-center justify-between text-[10px] font-semibold">
                                <div className="flex items-center gap-1.5 truncate">
                                  <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: slice.color }} />
                                  <span className="truncate">{slice.label}</span>
                                </div>
                                <div className="flex items-center gap-2 font-mono text-foreground font-bold shrink-0">
                                  <span>{slice.count}</span>
                                  <span className="text-muted-foreground text-[9px] font-normal">({percentVal}%)</span>
                                </div>
                              </div>
                              {/* Small progress bar */}
                              <div className="w-full bg-muted/40 h-1 rounded-full mt-1 overflow-hidden">
                                <div 
                                  className="h-full rounded-full transition-all duration-300"
                                  style={{ 
                                    backgroundColor: slice.color,
                                    width: `${percentVal}%` 
                                  }} 
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Summary Footer */}
                  <div className="text-[10px] text-muted-foreground text-center border-t border-border/20 pt-3 mt-1">
                    Hover over slices or domains to inspect detailed metrics
                  </div>
                </div>

              </div>

            </div>
          );
        })()}


        {/* 2. TEAM PAGE */}
        {activeTab === "team" && (
          <div className="space-y-6">
            
            {/* Filter / Search Bar */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              
              <div className="flex gap-2 shrink-0">
                {["All", "Faculty", "PhD", "PG", "UG", "Alumni"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setTeamFilter(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${teamFilter === cat ? "bg-primary border-primary text-primary-foreground" : "border-border text-muted-foreground hover:bg-muted hover:text-foreground"}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="relative w-full sm:w-64">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search by name, bio, skills..."
                    value={teamSearch}
                    onChange={(e) => setTeamSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-1.5 text-sm rounded-lg border border-border bg-muted/50 focus:outline-none focus:border-primary"
                  />
                </div>
                
                <button
                  onClick={() => { 
                    setEditingPerson({
                      id: "",
                      role: "scholar",
                      name: "",
                      designation: "",
                      affiliation: "ViBeS Lab, IIITDM Kancheepuram",
                      email: "",
                      joined: new Date().getFullYear(),
                      domains: [],
                      skills: [],
                      education: [],
                      publications: [],
                      awards: [],
                      conferences: [],
                      links: []
                    } as any); 
                    setIsPersonModalOpen(true); 
                  }}
                  className="flex items-center gap-2 px-4 py-1.5 bg-primary text-primary-foreground text-sm font-semibold rounded-lg hover:bg-primary/95 transition shadow-sm"
                >
                  <Plus size={16} />
                  <span>Add Member</span>
                </button>
              </div>

            </div>

            {/* Members List Table */}
            <div className="glass rounded-2xl overflow-hidden border border-border/40">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <th className="p-4">Name / Info</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Stats</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {people
                    .filter((p) => {
                      const matchesSearch = p.name.toLowerCase().includes(teamSearch.toLowerCase()) || p.bio.toLowerCase().includes(teamSearch.toLowerCase()) || p.skills.some(s => s.toLowerCase().includes(teamSearch.toLowerCase()));
                      const matchesFilter = teamFilter === "All" ||
                        (teamFilter === "Faculty" && p.role === "guide") ||
                        (teamFilter !== "Faculty" && p.role !== "guide" && p.category === teamFilter);
                      return matchesSearch && matchesFilter;
                    })
                    .map((p) => (
                      <tr key={p.id} className="hover:bg-muted/10 transition">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-card border border-border grid place-items-center font-display font-bold text-primary shrink-0 overflow-hidden">
                              {p.avatar ? (
                                <img src={p.avatar.startsWith('/uploads') ? `https://lab-website-tblf.onrender.com${p.avatar}` : p.avatar} alt={p.name} className="h-full w-full object-cover" />
                              ) : (
                                p.name.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase()
                              )}
                            </div>
                            <div>
                              <div className="font-semibold text-foreground">{p.name}</div>
                              <div className="text-xs text-muted-foreground">{p.designation}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${p.role === "guide" ? "bg-accent/20 text-accent border border-accent/30" : "bg-primary/20 text-primary border border-primary/30"}`}>
                            {p.role === "guide" ? "Faculty Lead" : p.category}
                          </span>
                        </td>
                        <td className="p-4 text-xs font-mono text-muted-foreground">{p.email}</td>
                        <td className="p-4 text-xs space-x-3 text-muted-foreground">
                          <span>📚 {p.publications.length} Pubs</span>
                          <span>🏆 {p.awards.length} Awards</span>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => { setEditingPerson(p); setIsPersonModalOpen(true); }}
                              className="p-1.5 rounded-lg border border-border text-muted-foreground hover:border-primary/50 hover:text-primary hover:bg-muted transition"
                              title="Edit Member"
                            >
                              <Edit3 size={14} />
                            </button>
                            <button
                              onClick={() => handleDeletePerson(p.id)}
                              className="p-1.5 rounded-lg border border-border text-muted-foreground hover:border-rose-500/50 hover:text-rose-500 hover:bg-muted transition"
                              title="Delete Member"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* 3. PROJECTS PAGE */}
        {activeTab === "projects" && (
          <div className="space-y-12 animate-in fade-in duration-300">
            
            {/* Header + Add button */}
            <div className="flex items-center justify-between border-b border-border/40 pb-4">
              <div className="flex items-center gap-2">
                <Layers className="text-primary" size={22} />
                <h3 className="font-display font-semibold text-xl text-foreground">Grant Research Portfolios</h3>
              </div>
              <button
                onClick={() => { setEditingProject(null); setIsProjectModalOpen(true); }}
                className="flex items-center gap-2 px-4 py-1.5 bg-primary text-primary-foreground text-sm font-semibold rounded-lg hover:bg-primary/95 transition shadow-sm hover:scale-[1.02] transform cursor-pointer"
              >
                <Plus size={16} />
                <span>Add Grant Project</span>
              </button>
            </div>

            {/* Asymmetric Creative Portfolio Grid */}
            <div className="grid lg:grid-cols-2 gap-8">
              {projects.map((proj, idx) => (
                <div 
                  key={proj.id} 
                  className={`glass rounded-3xl overflow-hidden border border-border/30 hover:border-primary/60 transition-all duration-300 hover:-translate-y-1.5 shadow-lg group relative flex flex-col justify-between ${idx % 2 === 0 ? "lg:scale-[1.01]" : "lg:scale-[0.99] lg:translate-y-2"}`}
                >
                  {/* Subtle Gradient Backglow */}
                  <div className={`absolute -top-12 -right-12 h-40 w-40 rounded-full blur-3xl opacity-20 bg-gradient-to-br ${proj.image}`} />
                  
                  <div className="p-8 space-y-4 z-10 text-left">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-md bg-muted/60 text-muted-foreground border border-border">{proj.domain}</span>
                      
                      {/* Pulsing Status badge */}
                      <span className={`flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full ${proj.status === "Ongoing" ? "bg-amber-500/10 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-500/20 dark:border-amber-800/30" : "bg-emerald-500/10 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-500/20 dark:border-emerald-800/30"}`}>
                        {proj.status === "Ongoing" && (
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                          </span>
                        )}
                        <span>{proj.status}</span>
                      </span>
                    </div>

                    <h4 className="font-display font-bold text-2xl tracking-tight text-foreground group-hover:text-primary transition-colors">{proj.title}</h4>
                    <p className="text-xs font-medium text-accent italic">{proj.tagline}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed pt-2 border-t border-border/20">{proj.description}</p>
                    
                    {/* Collapsible details / results section */}
                    <div className="pt-2">
                      <button 
                        type="button"
                        onClick={() => toggleProjectExpansion(proj.id)}
                        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground font-semibold cursor-pointer"
                      >
                        {expandedProjects[proj.id] ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        <span>Project Objectives & Outcomes</span>
                      </button>
                      
                      {expandedProjects[proj.id] && (
                        <div className="mt-3 p-4 rounded-2xl bg-muted/30 border border-border/20 text-xs text-muted-foreground space-y-2 animate-in slide-in-from-top-2 duration-200">
                          <p className="font-semibold text-[10px] uppercase text-accent/80 tracking-wider">Objectives:</p>
                          <p className="text-[11px] leading-relaxed mb-3">{proj.purpose}</p>
                          <p className="font-semibold text-[10px] uppercase text-accent/80 tracking-wider">Key Milestones:</p>
                          <ul className="list-disc list-inside space-y-1 text-[11px]">
                            {proj.results && proj.results.length > 0 ? (
                              proj.results.map((res, i) => <li key={i}>{res}</li>)
                            ) : (
                              <li>Milestones setup in database.</li>
                            )}
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* Tech Badges */}
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {proj.tech.map((t) => (
                        <span key={t} className="px-2 py-0.5 rounded-md border border-border bg-muted/20 text-[9px] font-mono text-muted-foreground hover:border-accent/40 transition">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions footer */}
                  <div className="p-6 border-t border-border/20 bg-muted/10 flex items-center justify-between z-10">
                    <span className="text-xs text-muted-foreground font-mono">Started: {proj.year}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => { setEditingProject(proj); setIsProjectModalOpen(true); }}
                        className="p-2 rounded-xl border border-border text-muted-foreground hover:border-primary/50 hover:text-primary hover:bg-card transition cursor-pointer"
                        title="Edit Project"
                      >
                        <Edit3 size={14} />
                      </button>
                      <button
                        onClick={() => handleDeleteProject(proj.id)}
                        className="p-2 rounded-xl border border-border text-muted-foreground hover:border-rose-500/50 hover:text-rose-500 hover:bg-card transition cursor-pointer"
                        title="Delete Project"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3b. THESIS BOARD */}
        {activeTab === "thesis" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex items-center justify-between border-b border-border/40 pb-4">
              <div className="flex items-center gap-2">
                <GraduationCap className="text-primary" size={22} />
                <h3 className="font-display font-semibold text-xl text-foreground">Thesis Board (Supervised Student Projects)</h3>
              </div>
              <button
                onClick={() => { setEditingSupervised(null); setIsSupervisedModalOpen(true); }}
                className="flex items-center gap-2 px-4 py-1.5 bg-primary text-primary-foreground text-sm font-semibold rounded-lg hover:bg-primary/95 transition shadow-sm hover:scale-[1.02] transform cursor-pointer"
              >
                <Plus size={14} />
                <span>Add Thesis Project</span>
              </button>
            </div>

            {/* Grouped Columns Side-By-Side */}
            <div className="grid md:grid-cols-2 gap-8">
              
              {/* MTP Column */}
              <div className="space-y-4">
                <h4 className="font-display font-bold text-sm text-accent uppercase tracking-widest flex items-center gap-2 mb-2">
                  <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
                  <span>Master Thesis Projects (MTP)</span>
                </h4>
                
                <div className="space-y-4 max-h-[550px] overflow-y-auto pr-2">
                  {supervisedProjects.filter(p => p.type === "MTP").map((sp) => (
                    <div key={sp.sno} className="glass p-5 rounded-2xl border border-border/40 hover:border-primary/40 transition group relative text-left">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm text-foreground">{sp.studentName}</span>
                            <span className="text-[10px] font-mono text-muted-foreground">({sp.rollNo})</span>
                          </div>
                          <h5 className="font-display text-xs font-bold text-gradient mt-1 leading-snug">{sp.title}</h5>
                          <p className="text-[10px] text-muted-foreground italic mt-1.5 leading-normal">{sp.explanation}</p>
                        </div>
                        
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold shrink-0 ${sp.status === "Completed" ? "bg-emerald-500/10 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-500/20 dark:border-emerald-800/30" : "bg-amber-500/10 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-500/20 dark:border-amber-800/30"}`}>
                          {sp.status}
                        </span>
                      </div>

                      {/* Hidden action bar exposed on hover */}
                      <div className="absolute right-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1.5">
                        <button
                          onClick={() => { setEditingSupervised(sp); setIsSupervisedModalOpen(true); }}
                          className="p-1 rounded bg-card border border-border text-muted-foreground hover:text-primary hover:border-primary/50 transition cursor-pointer"
                        >
                          <Edit3 size={11} />
                        </button>
                        <button
                          onClick={() => handleDeleteSupervised(sp.sno)}
                          className="p-1 rounded bg-card border border-border text-muted-foreground hover:text-rose-500 hover:border-rose-500/50 transition cursor-pointer"
                        >
                          <Trash2 size={11} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* BTP Column */}
              <div className="space-y-4">
                <h4 className="font-display font-bold text-sm text-primary uppercase tracking-widest flex items-center gap-2 mb-2">
                  <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                  <span>Bachelor Thesis Projects (BTP)</span>
                </h4>
                
                <div className="space-y-4 max-h-[550px] overflow-y-auto pr-2">
                  {supervisedProjects.filter(p => p.type === "BTP").map((sp) => (
                    <div key={sp.sno} className="glass p-5 rounded-2xl border border-border/40 hover:border-accent/40 transition group relative text-left">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm text-foreground">{sp.studentName}</span>
                            <span className="text-[10px] font-mono text-muted-foreground">({sp.rollNo})</span>
                          </div>
                          <h5 className="font-display text-xs font-bold text-gradient mt-1 leading-snug">{sp.title}</h5>
                          <p className="text-[10px] text-muted-foreground italic mt-1.5 leading-normal">{sp.explanation}</p>
                        </div>
                        
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold shrink-0 ${sp.status === "Completed" ? "bg-emerald-500/10 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-500/20 dark:border-emerald-800/30" : "bg-amber-500/10 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-500/20 dark:border-amber-800/30"}`}>
                          {sp.status}
                        </span>
                      </div>

                      {/* Action buttons on hover */}
                      <div className="absolute right-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1.5">
                        <button
                          onClick={() => { setEditingSupervised(sp); setIsSupervisedModalOpen(true); }}
                          className="p-1 rounded bg-card border border-border text-muted-foreground hover:text-primary hover:border-primary/50 transition cursor-pointer"
                        >
                          <Edit3 size={11} />
                        </button>
                        <button
                          onClick={() => handleDeleteSupervised(sp.sno)}
                          className="p-1 rounded bg-card border border-border text-muted-foreground hover:text-rose-500 hover:border-rose-500/50 transition cursor-pointer"
                        >
                          <Trash2 size={11} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* 4. ACHIEVEMENTS PAGE (CREATIVE TIMELINE REDESIGN) */}
        {activeTab === "achievements" && (
          <div className="space-y-8">
            
            <div className="flex items-center justify-between border-b border-border/40 pb-4">
              <div className="flex items-center gap-2">
                <Trophy className="text-primary" size={22} />
                <h3 className="font-display font-semibold text-xl">Chronological Laboratory Milestone Timeline</h3>
              </div>
              <button
                onClick={() => { setEditingAchievement(null); setIsAchievementModalOpen(true); }}
                className="flex items-center gap-2 px-4 py-1.5 bg-primary text-primary-foreground text-sm font-semibold rounded-lg hover:bg-primary/95 transition shadow-sm"
              >
                <Plus size={16} />
                <span>Add Achievement</span>
              </button>
            </div>

            {/* Glowing Timeline Room */}
            <div className="relative pl-8 sm:pl-10 py-4 space-y-12">
              
              {/* Vertical Glowing Line */}
              <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-accent to-transparent shadow-[0_0_8px_var(--primary)]" />

              {achievements
                .sort((a, b) => b.year - a.year)
                .map((ach) => {
                  const styles = getAchievementStyles(ach.category);
                  return (
                    <div key={ach.id} className="relative group animate-in slide-in-from-left-4 duration-300">
                      
                      {/* Timeline Node Point */}
                      <span className={`absolute -left-7.5 top-2.5 h-3.5 w-3.5 rounded-full ring-4 ${styles.nodeColor} transition-transform duration-300 group-hover:scale-125`} />
                      
                      {/* Interactive Spec Card */}
                      <div className={`glass p-6 rounded-2xl border ${styles.glow} transition-all duration-300 hover:shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4 max-w-4xl relative`}>
                        
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <span className="font-display font-black text-2xl text-gradient">{ach.year}</span>
                            <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider ${styles.badge}`}>
                              {ach.category}
                            </span>
                            {ach.org && (
                              <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
                                · {ach.org}
                              </span>
                            )}
                          </div>
                          
                          <h4 className="font-display font-bold text-lg text-foreground group-hover:text-primary transition-colors">{ach.title}</h4>
                          <p className="text-xs text-muted-foreground leading-relaxed">{ach.detail}</p>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                          <button
                            onClick={() => { setEditingAchievement(ach); setIsAchievementModalOpen(true); }}
                            className="p-1.5 rounded-lg border border-border text-muted-foreground hover:border-primary/50 hover:text-primary hover:bg-card transition"
                          >
                            <Edit3 size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteAchievement(ach.id)}
                            className="p-1.5 rounded-lg border border-border text-muted-foreground hover:border-rose-500/50 hover:text-rose-500 hover:bg-card transition"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>

                      </div>
                    </div>
                  );
                })}
            </div>

          </div>
        )}

        {/* 5. RESOURCES & STATS PAGE (CREATIVE CONTROL PANEL REDESIGN) */}
        {activeTab === "resources" && (() => {
          // Metadata helper for stats cards
          const statMeta: Record<string, { title: string; max: number; unit: string; colorClass: string; icon: React.ReactNode }> = {
            members: { 
              title: "Lab Members", 
              max: 50, 
              unit: "Scholars", 
              colorClass: "from-teal-500 to-emerald-400",
              icon: <Users size={16} className="text-teal-500" />
            },
            publications: { 
              title: "Publications", 
              max: 200, 
              unit: "Papers", 
              colorClass: "from-sky-500 to-blue-400",
              icon: <FileText size={16} className="text-sky-500" />
            },
            projects: { 
              title: "Research Projects", 
              max: 20, 
              unit: "Grants", 
              colorClass: "from-purple-500 to-indigo-400",
              icon: <FolderGit2 size={16} className="text-purple-500" />
            },
            collaborations: { 
              title: "Collaborations", 
              max: 50, 
              unit: "Institutes", 
              colorClass: "from-pink-500 to-rose-400",
              icon: <Users size={16} className="text-pink-500" />
            },

            awards: { 
              title: "Honors & Awards", 
              max: 50, 
              unit: "Wins", 
              colorClass: "from-emerald-500 to-teal-400",
              icon: <Trophy size={16} className="text-emerald-500" />
            },
            outlay: { 
              title: "Research Outlay", 
              max: 200, 
              unit: "Lakhs (₹)", 
              colorClass: "from-amber-500 to-orange-400",
              icon: <Activity size={16} className="text-amber-500" />
            }
          };

          const getResourceIcon = (name: string) => {
            const n = name.toLowerCase();
            if (n.includes("gpu") || n.includes("nvidia") || n.includes("orin") || n.includes("rtx")) {
              return <Cpu className="text-amber-500" size={15} />;
            }
            if (n.includes("camera") || n.includes("capture") || n.includes("spectral") || n.includes("array")) {
              return <Activity className="text-teal-500" size={15} />;
            }
            return <Terminal className="text-sky-500" size={15} />;
          };

          return (
            <div className="space-y-12 animate-in fade-in duration-300">
              
              {/* Split layout: left dial console, right terminal specs */}
              <div className="grid lg:grid-cols-5 gap-8">
                
                {/* Left Column: Stats Console (Col span 3) */}
                <div className="lg:col-span-3 space-y-6">
                  <div className="flex items-center gap-2 border-b border-border/40 pb-3">
                    <Sliders className="text-primary animate-spin-slow" size={20} />
                    <h3 className="font-display font-semibold text-lg text-foreground">Interactive Statistics Dial Controls</h3>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6">
                    {Object.keys(stats).map((key) => {
                      const k = key as keyof typeof stats;
                      const meta = statMeta[k] || { 
                        title: k, 
                        max: 100, 
                        unit: "Units", 
                        colorClass: "from-primary to-accent", 
                        icon: <Sliders size={16} /> 
                      };
                      const val = stats[k];
                      const pct = Math.min(100, Math.round((val / meta.max) * 100));

                      return (
                        <div key={k} className="glass p-6 rounded-3xl relative overflow-hidden flex flex-col justify-between border border-border/30 hover:border-primary/50 transition duration-300 group text-left">
                          {/* Circular backglow graphic element */}
                          <div className="absolute -bottom-8 -right-8 h-24 w-24 rounded-full border border-primary/5 flex items-center justify-center opacity-30 select-none pointer-events-none">
                            <div className="h-16 w-16 rounded-full border border-dashed border-accent/10" />
                          </div>
                          
                          <div className="z-10 space-y-1.5">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{meta.title}</span>
                              <div className="h-7 w-7 rounded-lg bg-muted/40 flex items-center justify-center border border-border/30">
                                {meta.icon}
                              </div>
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                              <input
                                type="number"
                                step="any"
                                key={stats[k]}
                                defaultValue={stats[k] || 0}
                                onBlur={(e) => {
                                  const newVal = parseFloat(e.target.value);
                                  if (!isNaN(newVal)) {
                                    handleUpdateStatDirectly(k, newVal);
                                  }
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    const newVal = parseFloat((e.target as HTMLInputElement).value);
                                    if (!isNaN(newVal)) {
                                      handleUpdateStatDirectly(k, newVal);
                                      (e.target as HTMLInputElement).blur();
                                    }
                                  }
                                }}
                                className="w-24 px-2.5 py-1 text-2xl font-display font-black text-gradient leading-none bg-muted/40 border border-border/30 rounded-lg focus:outline-none focus:border-primary text-foreground"
                              />
                            </div>

                            {/* Progress bar */}
                            <div className="pt-3">
                              <div className="w-full bg-muted/40 h-2 rounded-full overflow-hidden relative border border-border/10">
                                <div 
                                  className={`h-full rounded-full bg-gradient-to-r ${meta.colorClass} transition-all duration-500`}
                                  style={{ width: `${pct}%` }}
                                />
                              </div>
                              <div className="flex items-center justify-between text-[9px] font-mono text-muted-foreground mt-1.5">
                                <span>Utilization Level</span>
                                <span className="font-bold text-foreground">{pct}%</span>
                              </div>
                            </div>
                          </div>

                          {/* Increment/Decrement Dials */}
                            <div className="flex items-center gap-2 mt-6 z-10">
                              <button
                                type="button"
                                onClick={() => modifyStat(k, -1)}
                                className="h-8 w-8 rounded-xl border border-border bg-card hover:bg-rose-500/10 hover:border-rose-500/40 hover:text-rose-600 dark:hover:text-rose-400 flex items-center justify-center font-bold text-sm transition-all duration-200 cursor-pointer shadow-sm active:scale-95"
                                title="Decrement"
                              >
                                -
                              </button>
                              <button
                                type="button"
                                onClick={() => modifyStat(k, 1)}
                                className="h-8 w-8 rounded-xl border border-border bg-card hover:bg-emerald-500/10 hover:border-emerald-500/40 hover:text-emerald-600 dark:hover:text-emerald-400 flex items-center justify-center font-bold text-sm transition-all duration-200 cursor-pointer shadow-sm active:scale-95"
                                title="Increment"
                              >
                                +
                              </button>
                            </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Right Column: Spec Equipment Sheets (Col span 2) */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="flex items-center justify-between border-b border-border/40 pb-3">
                    <div className="flex items-center gap-2">
                      <Terminal className="text-accent" size={20} />
                      <h3 className="font-display font-semibold text-lg text-foreground">Equipment Specifications</h3>
                    </div>
                    <button
                      onClick={() => setIsAddResourceOpen(true)}
                      className="flex items-center gap-1.5 px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-lg hover:bg-primary/95 transition shadow-sm cursor-pointer"
                    >
                      <Plus size={12} />
                      <span>Add Item</span>
                    </button>
                  </div>

                  {/* Console list output */}
                  <div className="glass p-5 rounded-3xl border border-border/40 space-y-4 max-h-[500px] overflow-y-auto pr-1">
                    <div className="flex items-center gap-2 text-[10px] font-mono text-emerald-600 bg-emerald-500/5 dark:text-emerald-400/90 dark:bg-muted/40 p-2 rounded-lg border border-border/20">
                      <Activity size={12} className="animate-pulse shrink-0" />
                      <span>SYSTEM INVENTORY LOG [ONLINE]</span>
                    </div>
                    
                    <div className="space-y-3.5 text-left">
                      {resources.map((res, i) => (
                        <div key={i} className="glass p-4 rounded-2xl border border-border/20 hover:border-primary/30 transition-all duration-300 flex items-start justify-between gap-3 group relative">
                          <div className="h-8 w-8 rounded-xl bg-muted border border-border/40 flex items-center justify-center shrink-0">
                            {getResourceIcon(res.name)}
                          </div>
                          
                          <div className="space-y-1 flex-1 text-left min-w-0">
                            <div className="font-semibold text-xs text-foreground group-hover:text-primary transition-colors truncate">{res.name}</div>
                            <div className="inline-block text-[10px] font-mono text-emerald-700 bg-emerald-500/10 dark:text-emerald-400 dark:bg-emerald-950/35 border border-emerald-500/20 dark:border-emerald-900/30 px-2 py-0.5 rounded leading-normal max-w-full truncate">
                              $ {res.detail}
                            </div>
                          </div>
                          
                          <button
                            onClick={() => {
                              if (res._id) {
                                handleDeleteResource(res._id);
                              } else {
                                setResources(resources.filter((_, idx) => idx !== i));
                                showNotification("Resource deleted");
                              }
                            }}
                            className="p-1.5 rounded-lg border border-border text-muted-foreground hover:text-rose-500 hover:border-rose-500/50 hover:bg-card transition shrink-0 cursor-pointer"
                            title="Delete specs"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>

            </div>
          );
        })()}

        {/* 6. UPDATES PAGE */}
        {activeTab === "updates" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-border/40 pb-4">
              <div className="flex items-center gap-2">
                <Activity className="text-primary" size={22} />
                <h3 className="font-display font-semibold text-xl">Live Updates Ticker</h3>
              </div>
              <button
                onClick={() => { setEditingUpdate(null); setIsUpdateModalOpen(true); }}
                className="flex items-center gap-2 px-4 py-1.5 bg-primary text-primary-foreground text-sm font-semibold rounded-lg hover:bg-primary/95 transition shadow-sm"
              >
                <Plus size={16} />
                <span>Add Live Update</span>
              </button>
            </div>
            
            <div className="grid gap-4">
              {liveUpdates.length === 0 ? (
                <div className="text-center text-muted-foreground p-8 border border-dashed rounded-lg">
                  No live updates currently configured. Click "Add Live Update" to create one.
                </div>
              ) : (
                liveUpdates.map((update) => (
                  <div key={update.id} className="glass p-5 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-primary">{update.date}</span>
                        <span className="px-2 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">
                          {update.tag}
                        </span>
                      </div>
                      <h4 className="font-display font-bold text-lg">{update.title}</h4>
                      <p className="text-sm text-muted-foreground max-w-3xl">{update.desc}</p>
                      <a href={update.link} target="_blank" rel="noreferrer" className="text-xs text-blue-500 hover:underline">
                        {update.link}
                      </a>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <button
                        onClick={() => { setEditingUpdate(update); setIsUpdateModalOpen(true); }}
                        className="p-2 rounded-lg border border-border text-muted-foreground hover:border-primary/50 hover:text-primary hover:bg-card transition"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteUpdate(update.id)}
                        className="p-2 rounded-lg border border-border text-muted-foreground hover:border-rose-500/50 hover:text-rose-500 hover:bg-card transition"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

      </main>

      {/* ========================================================
          PERSON MODAL
      ======================================================== */}
      {isPersonModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="glass bg-card w-full max-w-4xl max-h-[85vh] rounded-2xl shadow-xl border border-border flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h3 className="font-display font-semibold text-xl text-primary">
                {editingPerson?.id ? "Edit Team Member" : "Add New Team Member"}
              </h3>
              <button
                onClick={() => { setIsPersonModalOpen(false); setEditingPerson(null); }}
                className="p-1 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body / Scrollable Form */}
            <form onSubmit={handleSavePerson} className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* Primary Fields Grid */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    defaultValue={editingPerson?.name || ""}
                    className="px-3 py-2 text-sm rounded-lg border border-border bg-muted focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Designation / Role Description</label>
                  <input
                    type="text"
                    name="designation"
                    required
                    defaultValue={editingPerson?.designation || ""}
                    placeholder="e.g. PhD Research Scholar, Lab head, etc."
                    className="px-3 py-2 text-sm rounded-lg border border-border bg-muted focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Category Section</label>
                  <select
                    name="category"
                    defaultValue={(editingPerson?.role === "guide" && !editingPerson?.category) ? "Guide" : (editingPerson?.category || "PhD")}
                    className="px-3 py-2 text-sm rounded-lg border border-border bg-muted focus:outline-none focus:border-primary"
                  >
                    <option value="Guide">Lab Head / Guide</option>
                    <option value="PhD">PhD Scholar</option>
                    <option value="PG">Postgraduate Student (PG)</option>
                    <option value="UG">Undergraduate Student (UG)</option>
                    <option value="Alumni">Alumni</option>
                  </select>
                </div>

                <div className="flex flex-col">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    required
                    defaultValue={editingPerson?.email || ""}
                    className="px-3 py-2 text-sm rounded-lg border border-border bg-muted focus:outline-none focus:border-primary font-mono"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Join Year</label>
                  <input
                    type="number"
                    name="joined"
                    required
                    defaultValue={editingPerson?.joined || new Date().getFullYear()}
                    className="px-3 py-2 text-sm rounded-lg border border-border bg-muted focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Upload Profile Photo (Optional)</label>
                  {editingPerson?.avatar && (
                    <div className="mb-3 flex items-center gap-4">
                      <img src={editingPerson.avatar.startsWith('/uploads') ? `https://lab-website-tblf.onrender.com${editingPerson.avatar}` : editingPerson.avatar} alt="Avatar preview" className="w-16 h-16 rounded-full object-cover border border-border" />
                      <button 
                        type="button" 
                        onClick={() => {
                          setEditingPerson({ ...editingPerson, avatar: "" } as any);
                          const fileInput = document.getElementById("avatarFileInput") as HTMLInputElement;
                          if (fileInput) fileInput.value = "";
                        }}
                        className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-destructive/10 text-destructive border border-destructive/20 hover:bg-destructive/20 transition"
                      >
                        Remove Photo
                      </button>
                    </div>
                  )}
                  <input
                    id="avatarFileInput"
                    type="file"
                    name="avatarFile"
                    accept="image/*,application/pdf"
                    className="px-3 py-2 text-sm rounded-lg border border-border bg-muted focus:outline-none focus:border-primary file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
                  />
                  <input type="hidden" name="avatar" value={editingPerson?.avatar || ""} readOnly />
                </div>

                <div className="flex flex-col">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Upload Resume (Optional)</label>
                  {editingPerson?.resume && (
                    <div className="mb-3 flex items-center gap-4">
                      <a href={(editingPerson.resume.startsWith('/uploads') || editingPerson.resume.startsWith('/resumes')) ? `https://lab-website-tblf.onrender.com${editingPerson.resume}` : (!editingPerson.resume.startsWith('http') && !editingPerson.resume.startsWith('/')) ? `https://${editingPerson.resume}` : editingPerson.resume} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition">
                        View Current Resume
                      </a>
                      <button 
                        type="button" 
                        onClick={() => {
                          setEditingPerson({ ...editingPerson, resume: "" } as any);
                          const fileInput = document.getElementById("resumeFileInput") as HTMLInputElement;
                          if (fileInput) fileInput.value = "";
                        }}
                        className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-destructive/10 text-destructive border border-destructive/20 hover:bg-destructive/20 transition"
                      >
                        Remove Resume
                      </button>
                    </div>
                  )}
                  <input
                    id="resumeFileInput"
                    type="file"
                    name="resumeFile"
                    accept="application/pdf,.doc,.docx"
                    className="px-3 py-2 text-sm rounded-lg border border-border bg-muted focus:outline-none focus:border-primary file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
                  />
                  <input type="hidden" name="resume" value={editingPerson?.resume || ""} readOnly />
                </div>

                <div className="flex flex-col">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Google Scholar (Optional)</label>
                  <input
                    type="text"
                    name="scholar"
                    defaultValue={editingPerson?.links?.find((l: any) => l.label === "Google Scholar")?.href || ""}
                    placeholder="https://scholar.google.com/..."
                    className="px-3 py-2 text-sm rounded-lg border border-border bg-muted focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="flex flex-col md:col-span-2">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Affiliation Institution</label>
                  <input
                    type="text"
                    name="affiliation"
                    required
                    defaultValue={editingPerson?.affiliation || "ViBeS Lab, IIITDM Kancheepuram"}
                    className="px-3 py-2 text-sm rounded-lg border border-border bg-muted focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="flex flex-col md:col-span-2">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Biography / Project Summary</label>
                  <textarea
                    name="bio"
                    required
                    rows={3}
                    defaultValue={editingPerson?.bio || ""}
                    className="px-3 py-2 text-sm rounded-lg border border-border bg-muted focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              {/* Dynamic Arrays configuration (Only shown when editing/initializing data) */}
              {editingPerson && (
                <div className="border-t border-border pt-6 space-y-6">
                  
                  {/* Skills Section */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-sm text-foreground flex items-center gap-2">
                        <Wrench size={16} />
                        <span>Core Skills</span>
                      </h4>
                      <button type="button" onClick={() => addPersonSubItem("skills")} className="text-xs text-primary font-semibold hover:underline">
                        + Add Skill
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {editingPerson.skills.map((skill, index) => (
                        <div key={index} className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-muted border border-border">
                          <input
                            type="text"
                            value={skill}
                            onChange={(e) => updatePersonSubItemValue("skills", index, "", e.target.value)}
                            className="bg-transparent text-xs text-foreground focus:outline-none w-20 font-medium"
                          />
                          <button type="button" onClick={() => removePersonSubItem("skills", index)} className="text-muted-foreground hover:text-rose-500">
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Domains Section */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-sm text-foreground flex items-center gap-2">
                        <BookOpen size={16} />
                        <span>Research Domains</span>
                      </h4>
                      <button type="button" onClick={() => addPersonSubItem("domains")} className="text-xs text-primary font-semibold hover:underline">
                        + Add Domain
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {editingPerson.domains.map((domain, index) => (
                        <div key={index} className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-muted border border-border">
                          <input
                            type="text"
                            value={domain}
                            onChange={(e) => updatePersonSubItemValue("domains", index, "", e.target.value)}
                            className="bg-transparent text-xs text-foreground focus:outline-none w-28 font-medium"
                          />
                          <button type="button" onClick={() => removePersonSubItem("domains", index)} className="text-muted-foreground hover:text-rose-500">
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Education list */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-sm text-foreground flex items-center gap-2">
                        <GraduationCap size={16} />
                        <span>Education History</span>
                      </h4>
                      <button type="button" onClick={() => addPersonSubItem("education")} className="text-xs text-primary font-semibold hover:underline">
                        + Add Education
                      </button>
                    </div>
                    <div className="space-y-2">
                      {editingPerson.education.map((edu, index) => (
                        <div key={index} className="grid grid-cols-4 gap-2 items-center bg-muted/30 p-2 rounded-lg border border-border/40">
                          <input
                            type="text"
                            placeholder="Degree"
                            value={edu.degree}
                            onChange={(e) => updatePersonSubItemValue("education", index, "degree", e.target.value)}
                            className="px-2 py-1 text-xs rounded border border-border bg-card focus:outline-none"
                          />
                          <input
                            type="text"
                            placeholder="Field"
                            value={edu.field}
                            onChange={(e) => updatePersonSubItemValue("education", index, "field", e.target.value)}
                            className="px-2 py-1 text-xs rounded border border-border bg-card focus:outline-none"
                          />
                          <input
                            type="text"
                            placeholder="Institute"
                            value={edu.institute}
                            onChange={(e) => updatePersonSubItemValue("education", index, "institute", e.target.value)}
                            className="px-2 py-1 text-xs rounded border border-border bg-card focus:outline-none"
                          />
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              placeholder="Year"
                              value={edu.year}
                              onChange={(e) => updatePersonSubItemValue("education", index, "year", e.target.value)}
                              className="px-2 py-1 text-xs rounded border border-border bg-card focus:outline-none w-full"
                            />
                            <button type="button" onClick={() => removePersonSubItem("education", index)} className="p-1 rounded text-muted-foreground hover:text-rose-500 hover:bg-muted">
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Publications list */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-sm text-foreground flex items-center gap-2">
                        <FileText size={16} />
                        <span>Publications</span>
                      </h4>
                      <button type="button" onClick={() => addPersonSubItem("publications")} className="text-xs text-primary font-semibold hover:underline">
                        + Add Publication
                      </button>
                    </div>
                    <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                      {editingPerson.publications.map((pub, index) => (
                        <div key={pub.id || index} className="p-3 bg-muted/30 rounded-lg border border-border/40 space-y-2">
                          <div className="grid grid-cols-4 gap-2">
                            <input
                              type="text"
                              placeholder="Title"
                              value={pub.title}
                              onChange={(e) => updatePersonSubItemValue("publications", index, "title", e.target.value)}
                              className="col-span-3 px-2 py-1 text-xs rounded border border-border bg-card focus:outline-none"
                            />
                            <select
                              value={pub.type}
                              onChange={(e) => updatePersonSubItemValue("publications", index, "type", e.target.value)}
                              className="px-2 py-1 text-xs rounded border border-border bg-card focus:outline-none"
                            >
                              <option value="Journal">Journal</option>
                              <option value="Conference">Conference</option>
                              <option value="Book Chapter">Book Chapter</option>
                              <option value="Patent">Patent</option>
                              <option value="Thesis">Thesis</option>
                            </select>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-2">
                            <input
                              type="text"
                              placeholder="Venue"
                              value={pub.venue}
                              onChange={(e) => updatePersonSubItemValue("publications", index, "venue", e.target.value)}
                              className="px-2 py-1 text-xs rounded border border-border bg-card focus:outline-none"
                            />
                            <input
                              type="text"
                              placeholder="Domain"
                              value={pub.domain}
                              onChange={(e) => updatePersonSubItemValue("publications", index, "domain", e.target.value)}
                              className="px-2 py-1 text-xs rounded border border-border bg-card focus:outline-none"
                            />
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                placeholder="Year"
                                value={pub.year}
                                onChange={(e) => updatePersonSubItemValue("publications", index, "year", Number(e.target.value))}
                                className="px-2 py-1 text-xs rounded border border-border bg-card focus:outline-none w-full"
                              />
                              <button type="button" onClick={() => removePersonSubItem("publications", index)} className="p-1 rounded text-muted-foreground hover:text-rose-500 hover:bg-muted">
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}

              {/* Submit Buttons */}
              <div className="border-t border-border pt-6 flex items-center justify-end gap-3 bg-card sticky bottom-0">
                <button
                  type="button"
                  onClick={() => { setIsPersonModalOpen(false); setEditingPerson(null); }}
                  className="px-4 py-2 text-sm border border-border text-muted-foreground hover:text-foreground rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/95 transition shadow-sm"
                >
                  Save Member
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          ADD RESOURCE (EQUIPMENT) MODAL
      ======================================================== */}
      {isAddResourceOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="glass bg-card w-full max-w-md rounded-2xl shadow-xl border border-border flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h3 className="font-display font-semibold text-xl text-primary">
                Add Equipment Specification
              </h3>
              <button
                onClick={() => setIsAddResourceOpen(false)}
                className="p-1 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveResource} className="p-6 space-y-4">
              
              <div className="flex flex-col">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Equipment Title / Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="e.g. Jetson Orin Nano Developer Kit"
                  className="px-3 py-2 text-sm rounded-lg border border-border bg-muted focus:outline-none focus:border-primary"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Specifications / Details</label>
                <input
                  type="text"
                  name="detail"
                  required
                  placeholder="e.g. 40 TOPS AI, 8GB memory, custom-light rig"
                  className="px-3 py-2 text-sm rounded-lg border border-border bg-muted focus:outline-none focus:border-primary"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddResourceOpen(false)}
                  className="px-4 py-2 text-sm border border-border text-muted-foreground hover:text-foreground rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/95 transition shadow-sm"
                >
                  Add Equipment
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          PROJECT MODAL
      ======================================================== */}
      {isProjectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="glass bg-card w-full max-w-2xl rounded-2xl shadow-xl border border-border flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h3 className="font-display font-semibold text-xl text-primary">
                {editingProject?.id ? "Edit Research Project" : "Add Research Project"}
              </h3>
              <button
                onClick={() => { setIsProjectModalOpen(false); setEditingProject(null); }}
                className="p-1 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveProject} className="p-6 space-y-4">
              
              <div className="flex flex-col">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Project Title</label>
                <input
                  type="text"
                  name="title"
                  required
                  defaultValue={editingProject?.title || ""}
                  className="px-3 py-2 text-sm rounded-lg border border-border bg-muted focus:outline-none focus:border-primary"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Tagline</label>
                <input
                  type="text"
                  name="tagline"
                  required
                  defaultValue={editingProject?.tagline || ""}
                  placeholder="A short descriptive highlight..."
                  className="px-3 py-2 text-sm rounded-lg border border-border bg-muted focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="flex flex-col">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Research Domain</label>
                  <input
                    type="text"
                    name="domain"
                    required
                    defaultValue={editingProject?.domain || "Visual Surveillance"}
                    className="px-3 py-2 text-sm rounded-lg border border-border bg-muted focus:outline-none focus:border-primary"
                  />
                </div>
                
                <div className="flex flex-col">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Status</label>
                  <select
                    name="status"
                    defaultValue={editingProject?.status || "Ongoing"}
                    className="px-3 py-2 text-sm rounded-lg border border-border bg-muted focus:outline-none focus:border-primary"
                  >
                    <option value="Ongoing">Ongoing</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>

                <div className="flex flex-col">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Start Year</label>
                  <input
                    type="number"
                    name="year"
                    required
                    defaultValue={editingProject?.year || new Date().getFullYear()}
                    className="px-3 py-2 text-sm rounded-lg border border-border bg-muted focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="flex flex-col">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Outlay / Funding Objective</label>
                <input
                  type="text"
                  name="purpose"
                  required
                  defaultValue={editingProject?.purpose || ""}
                  placeholder="e.g. Develop autonomous navigation and tracking rigs..."
                  className="px-3 py-2 text-sm rounded-lg border border-border bg-muted focus:outline-none focus:border-primary"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Funding Details & Timeline</label>
                <textarea
                  name="description"
                  required
                  rows={2}
                  defaultValue={editingProject?.description || ""}
                  placeholder="e.g. Funded by TiHAN-IIT Hyderabad with an outlay of 19.02 Lakhs for 18 Months."
                  className="px-3 py-2 text-sm rounded-lg border border-border bg-muted focus:outline-none focus:border-primary"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Gradient Theme Class</label>
                <input
                  type="text"
                  name="image"
                  defaultValue={editingProject?.image || ""}
                  placeholder="from-primary/40 via-accent/20 to-primary/10"
                  className="px-3 py-2 text-sm rounded-lg border border-border bg-muted focus:outline-none focus:border-primary font-mono"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => { setIsProjectModalOpen(false); setEditingProject(null); }}
                  className="px-4 py-2 text-sm border border-border text-muted-foreground hover:text-foreground rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/95 transition shadow-sm"
                >
                  Save Project
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          SUPERVISED THESIS MODAL
      ======================================================== */}
      {isSupervisedModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="glass bg-card w-full max-w-xl rounded-2xl shadow-xl border border-border flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h3 className="font-display font-semibold text-xl text-primary">
                {editingSupervised?.sno ? "Edit Thesis Project" : "Add Student Thesis"}
              </h3>
              <button
                onClick={() => { setIsSupervisedModalOpen(false); setEditingSupervised(null); }}
                className="p-1 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveSupervised} className="p-6 space-y-4">
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Student Name</label>
                  <input
                    type="text"
                    name="studentName"
                    required
                    defaultValue={editingSupervised?.studentName || ""}
                    className="px-3 py-2 text-sm rounded-lg border border-border bg-muted focus:outline-none focus:border-primary"
                  />
                </div>
                
                <div className="flex flex-col">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Roll Number</label>
                  <input
                    type="text"
                    name="rollNo"
                    required
                    defaultValue={editingSupervised?.rollNo || ""}
                    className="px-3 py-2 text-sm rounded-lg border border-border bg-muted focus:outline-none focus:border-primary font-mono"
                  />
                </div>
              </div>

              <div className="flex flex-col">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Thesis Title</label>
                <input
                  type="text"
                  name="title"
                  required
                  defaultValue={editingSupervised?.title || ""}
                  className="px-3 py-2 text-sm rounded-lg border border-border bg-muted focus:outline-none focus:border-primary"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Short Abstract / Explanation</label>
                <textarea
                  name="explanation"
                  required
                  rows={2}
                  defaultValue={editingSupervised?.explanation || ""}
                  className="px-3 py-2 text-sm rounded-lg border border-border bg-muted focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Degree Type</label>
                  <select
                    name="type"
                    defaultValue={editingSupervised?.type || "BTP"}
                    className="px-3 py-2 text-sm rounded-lg border border-border bg-muted focus:outline-none focus:border-primary"
                  >
                    <option value="BTP">BTP (Bachelor Thesis)</option>
                    <option value="MTP">MTP (Master Thesis)</option>
                  </select>
                </div>
                
                <div className="flex flex-col">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Status</label>
                  <select
                    name="status"
                    defaultValue={editingSupervised?.status || "Completed"}
                    className="px-3 py-2 text-sm rounded-lg border border-border bg-muted focus:outline-none focus:border-primary"
                  >
                    <option value="Completed">Completed</option>
                    <option value="Ongoing">Ongoing</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => { setIsSupervisedModalOpen(false); setEditingSupervised(null); }}
                  className="px-4 py-2 text-sm border border-border text-muted-foreground hover:text-foreground rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/95 transition shadow-sm"
                >
                  Save Thesis
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          ACHIEVEMENT MODAL
      ======================================================== */}
      {isAchievementModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="glass bg-card w-full max-w-xl rounded-2xl shadow-xl border border-border flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h3 className="font-display font-semibold text-xl text-primary">
                {editingAchievement?.id ? "Edit Achievement" : "Add Achievement"}
              </h3>
              <button
                onClick={() => { setIsAchievementModalOpen(false); setEditingAchievement(null); }}
                className="p-1 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveAchievement} className="p-6 space-y-4">
              
              <div className="flex flex-col">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Achievement Title</label>
                <input
                  type="text"
                  name="title"
                  required
                  defaultValue={editingAchievement?.title || ""}
                  className="px-3 py-2 text-sm rounded-lg border border-border bg-muted focus:outline-none focus:border-primary"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Description Detail</label>
                <textarea
                  name="detail"
                  required
                  rows={2}
                  defaultValue={editingAchievement?.detail || ""}
                  className="px-3 py-2 text-sm rounded-lg border border-border bg-muted focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="flex flex-col col-span-2">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Category</label>
                  <select
                    name="category"
                    defaultValue={editingAchievement?.category || "Grant"}
                    className="px-3 py-2 text-sm rounded-lg border border-border bg-muted focus:outline-none focus:border-primary"
                  >
                    <option value="Grant">Grant (DST, MeitY, etc.)</option>
                    <option value="Recognition">Recognition (Awards, Fellowships)</option>
                    <option value="Patent">Patent (Granted / Published)</option>
                    <option value="Milestone">Milestone (Lab Achievements)</option>
                  </select>
                </div>

                <div className="flex flex-col">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Year</label>
                  <input
                    type="number"
                    name="year"
                    required
                    defaultValue={editingAchievement?.year || new Date().getFullYear()}
                    className="px-3 py-2 text-sm rounded-lg border border-border bg-muted focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="flex flex-col">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Awarding Organization (Optional)</label>
                <input
                  type="text"
                  name="org"
                  defaultValue={editingAchievement?.org || ""}
                  placeholder="e.g. Indian Patent Office, IEEE, DST SERB"
                  className="px-3 py-2 text-sm rounded-lg border border-border bg-muted focus:outline-none focus:border-primary"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => { setIsAchievementModalOpen(false); setEditingAchievement(null); }}
                  className="px-4 py-2 text-sm border border-border text-muted-foreground hover:text-foreground rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/95 transition shadow-sm"
                >
                  Save Achievement
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          UPDATE MODAL
      ======================================================== */}
      {isUpdateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="glass bg-card w-full max-w-xl rounded-2xl shadow-xl border border-border flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h3 className="font-display font-semibold text-xl text-primary">
                {editingUpdate?.id ? "Edit Live Update" : "Add Live Update"}
              </h3>
              <button
                onClick={() => { setIsUpdateModalOpen(false); setEditingUpdate(null); }}
                className="p-1 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveUpdate} className="p-6 space-y-4">
              
              <div className="flex flex-col">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Title</label>
                <input
                  type="text"
                  name="title"
                  required
                  defaultValue={editingUpdate?.title || ""}
                  className="px-3 py-2 text-sm rounded-lg border border-border bg-muted focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Date String</label>
                  <input
                    type="text"
                    name="date"
                    required
                    placeholder="e.g. Oct 24, 2025"
                    defaultValue={editingUpdate?.date || ""}
                    className="px-3 py-2 text-sm rounded-lg border border-border bg-muted focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Tag / Category</label>
                  <input
                    type="text"
                    name="tag"
                    required
                    placeholder="e.g. Publication"
                    defaultValue={editingUpdate?.tag || ""}
                    className="px-3 py-2 text-sm rounded-lg border border-border bg-muted focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="flex flex-col">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Description</label>
                <textarea
                  name="desc"
                  required
                  rows={2}
                  defaultValue={editingUpdate?.desc || ""}
                  className="px-3 py-2 text-sm rounded-lg border border-border bg-muted focus:outline-none focus:border-primary"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Link To</label>
                <select
                  name="link"
                  required
                  defaultValue={editingUpdate?.link || "/publications"}
                  className="px-3 py-2 text-sm rounded-lg border border-border bg-muted focus:outline-none focus:border-primary"
                  onChange={(e) => {
                    const customInput = document.getElementById('custom-link-wrapper');
                    if (e.target.value === 'custom') {
                      customInput?.classList.remove('hidden');
                      (document.getElementById('custom-link-input') as HTMLInputElement).name = 'link';
                      e.target.name = '';
                    } else {
                      customInput?.classList.add('hidden');
                      e.target.name = 'link';
                      (document.getElementById('custom-link-input') as HTMLInputElement).name = '';
                    }
                  }}
                >
                  <option value="/publications">Publications Page</option>
                  <option value="/achievements">Achievements Page</option>
                  <option value="/projects">Projects Page</option>
                  <option value="/team">Team Page</option>
                  <option value="/about">About Page</option>
                  <option value="#">No Link (Don't go anywhere)</option>
                  <option value="custom">Enter a custom web address...</option>
                </select>
              </div>

              <div id="custom-link-wrapper" className="flex flex-col hidden mt-3">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Type Custom URL</label>
                <input
                  id="custom-link-input"
                  type="text"
                  defaultValue={["/publications", "/achievements", "/projects", "/team", "/about", "#"].includes(editingUpdate?.link || "") ? "" : editingUpdate?.link}
                  placeholder="https://..."
                  className="px-3 py-2 text-sm rounded-lg border border-border bg-muted focus:outline-none focus:border-primary"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => { setIsUpdateModalOpen(false); setEditingUpdate(null); }}
                  className="px-4 py-2 text-sm border border-border text-muted-foreground hover:text-foreground rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/95 transition shadow-sm"
                >
                  Save Update
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          SETTINGS MODAL
      ======================================================== */}
      {isSettingsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="glass bg-card w-full max-w-2xl rounded-2xl shadow-xl border border-border flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h3 className="font-display font-semibold text-xl text-primary flex items-center gap-2">
                <Settings size={20} />
                <span>ViBeS Lab Settings Console</span>
              </h3>
              <button
                onClick={() => setIsSettingsModalOpen(false)}
                className="p-1 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveSettings} className="p-6 space-y-5 text-left">
              
              {/* Section 1: Branding & Details */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-accent uppercase tracking-widest border-b border-border/20 pb-1">Branding & Details</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase mb-1.5">Lab Title</label>
                    <input
                      type="text"
                      name="labName"
                      required
                      defaultValue={labName}
                      className="px-3 py-2 text-sm rounded-lg border border-border bg-muted focus:outline-none focus:border-primary text-foreground"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase mb-1.5">Contact Email</label>
                    <input
                      type="email"
                      name="labEmail"
                      required
                      defaultValue={labEmail}
                      className="px-3 py-2 text-sm rounded-lg border border-border bg-muted focus:outline-none focus:border-primary text-foreground font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Scrapers & APIs */}
              <div className="space-y-4 pt-2">
                <h4 className="text-xs font-bold text-accent uppercase tracking-widest border-b border-border/20 pb-1">API & Crawler Integration</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase mb-1.5">Google Scholar Profile ID</label>
                    <input
                      type="text"
                      name="scholarId"
                      defaultValue={scholarId}
                      placeholder="e.g. F3W0X0AAAAAJ"
                      className="px-3 py-2 text-sm rounded-lg border border-border bg-muted focus:outline-none focus:border-primary text-foreground font-mono"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase mb-1.5">Session Expiry Timeout (Min)</label>
                    <select
                      name="sessionTimeout"
                      defaultValue={sessionTimeout}
                      className="px-3 py-2 text-sm rounded-lg border border-border bg-muted focus:outline-none focus:border-primary text-foreground"
                    >
                      <option value="15">15 Minutes</option>
                      <option value="30">30 Minutes</option>
                      <option value="60">60 Minutes</option>
                      <option value="120">2 Hours</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 3: Accent colors */}
              <div className="flex flex-col">
                <label className="text-[10px] font-bold text-muted-foreground uppercase mb-1.5">Accent Color Palette</label>
                <select
                  name="accentPalette"
                  defaultValue={accentPalette}
                  className="px-3 py-2 text-sm rounded-lg border border-border bg-muted focus:outline-none focus:border-primary text-foreground"
                >
                  <option value="default">Teal & Copper Accent (Default)</option>
                  <option value="indigo">Indigo & Silver (Alternative)</option>
                  <option value="emerald">Emerald & Amber (High contrast)</option>
                </select>
              </div>

              {/* Section 4: Data management */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold text-accent uppercase tracking-widest border-b border-border/20 pb-1">Database Administration</h4>
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={handleExportDatabase}
                    className="flex-1 px-4 py-2 text-xs font-bold border border-border hover:border-primary/50 text-foreground hover:text-primary rounded-lg transition hover:bg-muted/40 cursor-pointer"
                  >
                    Export Database JSON
                  </button>
                  <button
                    type="button"
                    onClick={handleResetDatabase}
                    className="flex-1 px-4 py-2 text-xs font-bold border border-border hover:border-rose-500/50 text-foreground hover:text-rose-500 rounded-lg transition hover:bg-muted/40 cursor-pointer"
                  >
                    Reset to Default Data
                  </button>
                </div>
              </div>

              {/* Save/Cancel footer */}
              <div className="border-t border-border pt-4 flex items-center justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setIsSettingsModalOpen(false)}
                  className="px-4 py-2 text-sm border border-border text-muted-foreground hover:text-foreground rounded-lg transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/95 transition shadow-sm cursor-pointer"
                >
                  Save Settings
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* 5. MESSAGE DETAIL MODAL */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-sm">
          <div className="w-full max-w-lg glass border border-border/40 rounded-3xl overflow-hidden shadow-neon-primary text-left">
            {/* Header */}
            <div className="p-6 border-b border-border/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-display font-black text-sm">
                  {getUserInitials(selectedMessage.name)}
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground font-display leading-tight">{selectedMessage.name}</h3>
                  <p className="text-[10px] text-muted-foreground font-mono mt-0.5">{selectedMessage.email}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedMessage(null)}
                className="p-1.5 rounded-xl border border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground transition cursor-pointer"
                title="Close modal"
              >
                <X size={15} />
              </button>
            </div>
            
            {/* Body */}
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between text-[10px] text-muted-foreground border-b border-border/10 pb-2">
                <span>Received: {new Date(selectedMessage.createdAt).toLocaleString()}</span>
                <span className={`px-2 py-0.5 rounded-full border text-[9px] font-bold ${selectedMessage.read ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-primary/10 text-primary border-primary/20"}`}>
                  {selectedMessage.read ? "Read" : "Unread"}
                </span>
              </div>
              
              <div className="bg-muted/30 border border-border/20 p-4 rounded-2xl max-h-60 overflow-y-auto">
                <p className="text-xs text-foreground leading-relaxed whitespace-pre-wrap font-sans">{selectedMessage.message}</p>
              </div>
            </div>
            
            {/* Footer */}
            <div className="p-4 bg-muted/20 border-t border-border/20 flex items-center justify-between">
              <button 
                onClick={() => {
                  triggerConfirm(
                    "Delete Message",
                    "Are you sure you want to permanently delete this message from the database?",
                    () => {
                      const token = sessionStorage.getItem("auth_token");
                      fetch(`https://lab-website-tblf.onrender.com/api/contact/${selectedMessage._id}`, {
                        method: "DELETE",
                        headers: { "Authorization": `Bearer ${token}` }
                      })
                        .then(res => {
                          if (!res.ok) throw new Error("Delete failed");
                          setMessages(prev => prev.filter(m => m._id !== selectedMessage._id));
                          setNotifications(prev => prev.filter(n => n.id !== `msg-${selectedMessage._id}`));
                          setSelectedMessage(null);
                          showNotification("Message deleted successfully!");
                        })
                        .catch(err => showNotification(err.message, "error"));
                    }
                  );
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-rose-500 hover:bg-rose-500/10 rounded-xl transition cursor-pointer"
              >
                <Trash2 size={13} />
                <span>Delete Message</span>
              </button>
              
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => {
                    const nextReadState = !selectedMessage.read;
                    const token = sessionStorage.getItem("auth_token");
                    fetch(`https://lab-website-tblf.onrender.com/api/contact/${selectedMessage._id}`, {
                      method: "PUT",
                      headers: { 
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}` 
                      },
                      body: JSON.stringify({ read: nextReadState })
                    })
                      .then(res => res.json())
                      .then(updated => {
                        setMessages(prev => prev.map(m => m._id === selectedMessage._id ? updated : m));
                        // Update the active notification if it was marked unread/read
                        if (nextReadState) {
                          setNotifications(prev => prev.filter(n => n.id !== `msg-${selectedMessage._id}`));
                        } else {
                          setNotifications(prev => [
                            {
                              id: `msg-${selectedMessage._id}`,
                              message: `New message from ${selectedMessage.name}`,
                              type: "info",
                              time: new Date(selectedMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                            },
                            ...prev
                          ]);
                        }
                        setSelectedMessage(updated);
                        showNotification(nextReadState ? "Marked as read" : "Marked as unread");
                      })
                      .catch(err => showNotification(err.message, "error"));
                  }}
                  className="px-4 py-1.5 border border-border hover:bg-muted text-xs font-semibold rounded-xl transition cursor-pointer"
                >
                  {selectedMessage.read ? "Mark Unread" : "Mark Read"}
                </button>
                
                <button 
                  onClick={() => setSelectedMessage(null)}
                  className="px-4 py-1.5 bg-primary text-primary-foreground text-xs font-bold rounded-xl hover:bg-primary/95 transition cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. PREMIUM CONFIRMATION MODAL */}
      {confirmDialog && confirmDialog.isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-sm glass border border-border/40 rounded-3xl p-6 shadow-neon-primary text-center space-y-5">
            <div className={`h-12 w-12 rounded-2xl flex items-center justify-center mx-auto border ${confirmDialog.confirmStyle === "danger" ? "bg-rose-500/10 border-rose-500/20 text-rose-500" : "bg-primary/10 border-primary/20 text-primary"}`}>
              {confirmDialog.confirmStyle === "danger" ? (
                <Trash2 size={22} className="animate-pulse" />
              ) : (
                <Check size={22} className="animate-bounce" />
              )}
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-foreground font-display">{confirmDialog.title}</h3>
              <p className="text-xs text-muted-foreground leading-normal">{confirmDialog.message}</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setConfirmDialog(null)}
                className="flex-1 py-2 text-xs font-semibold border border-border hover:bg-muted text-muted-foreground hover:text-foreground rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  confirmDialog.onConfirm();
                  setConfirmDialog(null);
                }}
                className={`flex-1 py-2 text-xs font-bold text-white rounded-xl transition shadow-md cursor-pointer ${confirmDialog.confirmStyle === "danger" ? "bg-rose-500 hover:bg-rose-600 shadow-rose-500/10" : "bg-primary hover:bg-primary/95 shadow-primary/10"}`}
              >
                {confirmDialog.confirmText}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
