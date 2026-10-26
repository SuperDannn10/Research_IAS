import { useEffect, useMemo, useState } from "react";
import type { ChangeEvent, FormEvent, ReactNode } from "react";

import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  CircleDollarSign,
  ClipboardList,
  Clock,
  CreditCard,
  Eye,
  EyeOff,
  FileText,
  Home,
  Lock,
  LogOut,
  Menu,
  Percent,
  Plus,
  Search,
  Save,
  Settings,
  ShieldCheck,
  Sparkles,
  Trash2,
  Upload,
  UserRound,
  UsersRound,
  X,
  CircleX,
  Zap,
} from "lucide-react";

import "./App.css";

export type PaymentStatus = "Paid" | "Unpaid";

export type Discount =
  | 0
  | 10
  | 20
  | 30
  | 40
  | 50
  | 60
  | 70
  | 80
  | 90
  | 100;

export type Student = {
  id: string;
  firstName: string;
  middleName: string;
  lastName: string;
  yearLevel: string;
  course: string;
  section: string;
  contact: string;
  email: string;
  address: string;
  image: string;
};

export type Payment = {
  studentId: string;
  amount: number;
  originalAmount: number;
  discount: Discount;
  date: string;
  status: PaymentStatus;
  reference: string;
  promissoryNote: boolean;
  promissoryRequester?: string;
};

export type NewStudent = Omit<Student, "image"> & {
  image: string;
};

type ToastState = {
  id: number;
  title: string;
  message: string;
  type: "success" | "error" | "info";
};

const initialStudents: Student[] = [
  {
    id: "2026-001",
    firstName: "Juan",
    middleName: "Dela",
    lastName: "Cruz",
    yearLevel: "1st Year",
    course: "BSIT",
    section: "1A",
    contact: "09123456789",
    email: "juan@email.com",
    address: "Sorsogon City",
    image: "/juan-dela-cruz.png",
  },
  {
    id: "2026-002",
    firstName: "Maria",
    middleName: "",
    lastName: "Santos",
    yearLevel: "2nd Year",
    course: "BSCS",
    section: "2A",
    contact: "09234567890",
    email: "maria@email.com",
    address: "Sorsogon City",
    image: "/maria-santos.png",
  },
  {
    id: "2026-003",
    firstName: "Ana",
    middleName: "",
    lastName: "Reyes",
    yearLevel: "Grade 11",
    course: "SHS",
    section: "STEM-A",
    contact: "09345678901",
    email: "ana@email.com",
    address: "Sorsogon City",
    image: "/ana-reyes.png",
  },
  {
    id: "2026-004",
    firstName: "Pedro",
    middleName: "",
    lastName: "Lim",
    yearLevel: "3rd Year",
    course: "BSIS",
    section: "3A",
    contact: "09456789012",
    email: "pedro@email.com",
    address: "Sorsogon City",
    image: "/pedro-lim.png",
  },
  {
    id: "2026-005",
    firstName: "Carla",
    middleName: "",
    lastName: "Mendoza",
    yearLevel: "4th Year",
    course: "ACT",
    section: "4A",
    contact: "09567890123",
    email: "carla@email.com",
    address: "Sorsogon City",
    image: "/carla-mendoza.png",
  },
];

const initialPayments: Payment[] = [
  {
    studentId: "2026-001",
    amount: 500,
    originalAmount: 500,
    discount: 0,
    date: "Sept. 10, 2026",
    status: "Paid",
    reference: "PAY-0001",
    promissoryNote: false,
  },
  {
    studentId: "2026-002",
    amount: 0,
    originalAmount: 500,
    discount: 0,
    date: "-",
    status: "Unpaid",
    reference: "-",
    promissoryNote: false,
  },
  {
    studentId: "2026-003",
    amount: 500,
    originalAmount: 500,
    discount: 0,
    date: "Sept. 12, 2026",
    status: "Paid",
    reference: "PAY-0002",
    promissoryNote: false,
  },
  {
    studentId: "2026-004",
    amount: 0,
    originalAmount: 500,
    discount: 0,
    date: "-",
    status: "Unpaid",
    reference: "-",
    promissoryNote: false,
  },
  {
    studentId: "2026-005",
    amount: 500,
    originalAmount: 500,
    discount: 0,
    date: "Sept. 14, 2026",
    status: "Paid",
    reference: "PAY-0003",
    promissoryNote: false,
  },
];

const discountOptions: Discount[] = [
  0,
  10,
  20,
  30,
  40,
  50,
  60,
  70,
  80,
  90,
  100,
];

const courseOptions = [
  "BSIT",
  "BSCS",
  "BSIS",
  "ACT",
  "SHS",
];

const yearLevelOptions = [
  "All Year Levels",
  "Grade 11",
  "Grade 12",
  "1st Year",
  "2nd Year",
  "3rd Year",
  "4th Year",
];

function App() {
  const [loggedIn, setLoggedIn] = useState(() => {
    return localStorage.getItem("loggedIn") === "true";
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(() => {
    return localStorage.getItem("currentPage") || "dashboard";
  });

  const [students, setStudents] = useState<Student[]>(() => {
    try {
      const savedStudents = localStorage.getItem("students");
      if (savedStudents) {
        return JSON.parse(savedStudents) as Student[];
      }
      return initialStudents;
    } catch {
      return initialStudents;
    }
  });

  const [payments, setPayments] = useState<Payment[]>(() => {
    try {
      const savedPayments = localStorage.getItem("payments");
      if (savedPayments) {
        return JSON.parse(savedPayments) as Payment[];
      }
      return initialPayments;
    } catch {
      return initialPayments;
    }
  });

  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [showRecordPayment, setShowRecordPayment] = useState(false);
  const [recordModalStudentId, setRecordModalStudentId] = useState<string | null>(null);

  // In-App Toast System
  const [toast, setToast] = useState<ToastState | null>(null);

  const showToast = (title: string, message: string, type: "success" | "error" | "info" = "success") => {
    setToast({ id: Date.now(), title, message, type });
  };

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      setToast(null);
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    localStorage.setItem("students", JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem("payments", JSON.stringify(payments));
  }, [payments]);

  useEffect(() => {
    localStorage.setItem("currentPage", currentPage);
  }, [currentPage]);

  const openPage = (page: string) => {
    setCurrentPage(page);
    setSidebarOpen(false);
    setSelectedStudent(null);
    setShowAddStudent(false);
    setShowRecordPayment(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLogin = () => {
    setLoggedIn(true);
    localStorage.setItem("loggedIn", "true");
    localStorage.setItem("currentPage", "dashboard");
    setSidebarOpen(false);
    setCurrentPage("dashboard");
    showToast("Login Successful", "Welcome back to the CCDI Sorsogon SDPMS Portal!", "success");
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out of the admin session?")) {
      setLoggedIn(false);
      localStorage.removeItem("loggedIn");
      localStorage.removeItem("currentPage");
      setSidebarOpen(false);
    }
  };

  const addStudent = (student: NewStudent) => {
    setStudents((prev) => [...prev, student]);
    // Create initial unpaid tuition record for the new student
    setPayments((prev) => [
      ...prev,
      {
        studentId: student.id,
        amount: 0,
        originalAmount: 500,
        discount: 0,
        date: "-",
        status: "Unpaid",
        reference: "-",
        promissoryNote: false,
      },
    ]);
    setSelectedStudent(null);
    setShowAddStudent(false);
    setCurrentPage("student-directory");
    showToast(
      "Student Registered",
      `${student.firstName} ${student.lastName} (${student.id}) has been added to the directory.`,
      "success"
    );
  };

  const deleteStudent = (studentId: string) => {
    const studentToDelete = students.find((s) => s.id === studentId);
    setStudents((prev) => prev.filter((student) => student.id !== studentId));
    setPayments((prev) => prev.filter((payment) => payment.studentId !== studentId));
    setSelectedStudent(null);
    setShowAddStudent(false);
    setShowRecordPayment(false);
    setSidebarOpen(false);
    setCurrentPage("student-directory");
    showToast(
      "Student Record Deleted",
      `${studentToDelete?.firstName ?? "Student"} ${studentToDelete?.lastName ?? ""} has been removed from the directory.`,
      "info"
    );
  };

  const savePayment = (payment: Payment) => {
    setPayments((prev) => {
      const existing = prev.find((item) => item.studentId === payment.studentId);
      if (existing) {
        return prev.map((item) =>
          item.studentId === payment.studentId ? payment : item
        );
      }
      return [...prev, payment];
    });

    const student = students.find((s) => s.id === payment.studentId);
    setShowRecordPayment(false);
    setRecordModalStudentId(null);
    setCurrentPage("payment-information");
    showToast(
      "Payment Recorded",
      `Payment of ₱${payment.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })} saved for ${student?.firstName ?? "student"} (Ref: ${payment.reference}).`,
      "success"
    );
  };

  const handleDirectRecord = (studentId: string) => {
    setRecordModalStudentId(studentId);
    setShowRecordPayment(true);
  };

  if (!loggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="app">
      {/* FLOATING TOAST NOTIFICATIONS */}
      {toast && (
        <div className="toast-container">
          <div className={`toast-card toast-${toast.type}`}>
            <div className="toast-icon">
              {toast.type === "success" && <CheckCircle2 size={20} />}
              {toast.type === "error" && <AlertCircle size={20} />}
              {toast.type === "info" && <CircleDollarSign size={20} />}
            </div>
            <div className="toast-body">
              <span className="toast-title">{toast.title}</span>
              <span className="toast-msg">{toast.message}</span>
            </div>
            <button
              className="toast-close"
              aria-label="Close notification"
              onClick={() => setToast(null)}
            >
              <X size={15} />
            </button>
          </div>
        </div>
      )}

      {/* SIDEBAR NAVIGATION */}
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`} aria-hidden={!sidebarOpen}>
        <div className="sidebar-header">
          <div className="logo-box">
            <img
              src="/ccdi-logo.png"
              alt="CCDI Logo"
              style={{ width: "32px", height: "32px", objectFit: "contain" }}
            />
          </div>

          <div>
            <div className="logo-text">SDPMS</div>
            <span className="logo-subtext">CCDI Sorsogon</span>
          </div>

          <button
            className="close-sidebar"
            aria-label="Close sidebar"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <nav className="sidebar-menu">
          <div className="menu-section-title">Overview</div>
          <MenuButton
            icon={<Home />}
            label="Dashboard"
            active={currentPage === "dashboard"}
            onClick={() => openPage("dashboard")}
          />

          <div className="menu-section-title" style={{ marginTop: "12px" }}>
            Student Management
          </div>
          <MenuButton
            icon={<UsersRound />}
            label="Student Directory"
            active={
              currentPage === "student-directory" ||
              currentPage === "student-details" ||
              currentPage === "add-student"
            }
            onClick={() => openPage("student-directory")}
          />

          <div className="menu-section-title" style={{ marginTop: "12px" }}>
            Billing & Finance
          </div>
          <MenuButton
            icon={<CreditCard />}
            label="Payment Info"
            active={currentPage === "payment-information"}
            onClick={() => openPage("payment-information")}
          />
          <MenuButton
            icon={<ClipboardList />}
            label="Payment Records"
            active={currentPage === "payment-records"}
            onClick={() => openPage("payment-records")}
          />

          <div className="menu-section-title" style={{ marginTop: "12px" }}>
            Administration
          </div>
          <MenuButton
            icon={<Settings />}
            label="Settings"
            active={currentPage === "settings"}
            onClick={() => openPage("settings")}
          />
          <MenuButton
            icon={<FileText />}
            label="About SDPMS"
            active={currentPage === "about"}
            onClick={() => openPage("about")}
          />
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-user-avatar">A</div>
            <div className="sidebar-user-info">
              <span className="sidebar-user-name">System Administrator</span>
              <span className="sidebar-user-role">admin@ccdi.edu.ph</span>
            </div>
            <button
              onClick={handleLogout}
              title="Log out"
              style={{
                color: "#e11d48",
                padding: "6px",
                borderRadius: "6px",
                display: "grid",
                placeItems: "center",
              }}
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* MOBILE SIDEBAR OVERLAY */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          role="button"
          tabIndex={0}
          aria-label="Close navigation"
          onClick={() => setSidebarOpen(false)}
          onKeyDown={(event) => {
            if (event.key === "Escape" || event.key === "Enter") {
              setSidebarOpen(false);
            }
          }}
        />
      )}

      {/* MAIN VIEW CONTENT */}
      <div className="main-wrapper">
        {/* TOPBAR */}
        <header className="topbar">
          <button
            className="hamburger"
            aria-label="Toggle navigation menu"
            onClick={() => setSidebarOpen((open) => !open)}
          >
            {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          <div className="topbar-institution">
            <div className="institution-pill">
              <span className="dot" />
              <span>CCDI Sorsogon • A.Y. 2026–2027</span>
            </div>
          </div>

          <div className="topbar-spacer" />

          <div className="topbar-clock">
            <Clock size={15} />
            <span>Academic Portal • Online</span>
          </div>

          <div className="admin-account" role="status" aria-label="Administrator profile">
            <div className="admin-avatar">A</div>
            <span>Admin Portal</span>
            <ChevronDown size={15} style={{ color: "#64748b" }} />
          </div>
        </header>

        {/* PAGE ROUTER */}
        {currentPage === "dashboard" && (
          <Dashboard
            students={students}
            payments={payments}
            onNavigate={(page) => openPage(page)}
            onDirectRecord={() => {
              setRecordModalStudentId(null);
              setShowRecordPayment(true);
            }}
          />
        )}

        {currentPage === "student-directory" && !showAddStudent && (
          <StudentDirectory
            students={students}
            payments={payments}
            onAdd={() => setShowAddStudent(true)}
            onView={(student) => {
              setSelectedStudent(student);
              setCurrentPage("student-details");
            }}
          />
        )}

        {showAddStudent && (
          <AddStudent
            students={students}
            onCancel={() => setShowAddStudent(false)}
            onSave={addStudent}
          />
        )}

        {currentPage === "student-details" && selectedStudent && (
          <StudentDetails
            student={selectedStudent}
            payment={payments.find((p) => p.studentId === selectedStudent.id)}
            onBack={() => setCurrentPage("student-directory")}
            onDelete={deleteStudent}
            onDirectRecord={handleDirectRecord}
          />
        )}

        {currentPage === "payment-information" && (
          <PaymentInformation
            students={students}
            payments={payments}
            onRecord={() => {
              setRecordModalStudentId(null);
              setShowRecordPayment(true);
            }}
            onView={(student) => {
              setSelectedStudent(student);
              setCurrentPage("student-details");
            }}
          />
        )}

        {currentPage === "payment-records" && (
          <PaymentRecords students={students} payments={payments} />
        )}

        {currentPage === "settings" && <SettingsPage onLogout={handleLogout} />}

        {currentPage === "about" && <AboutPage />}
      </div>

      {/* RECORD PAYMENT MODAL */}
      {showRecordPayment && (
        <RecordPaymentModal
          students={students}
          payments={payments}
          initialStudentId={recordModalStudentId}
          onClose={() => {
            setShowRecordPayment(false);
            setRecordModalStudentId(null);
          }}
          onSave={savePayment}
        />
      )}
    </div>
  );
}

/* =========================================================
   SIDEBAR MENU BUTTON
========================================================= */

function MenuButton({
  icon,
  label,
  active,
  onClick,
}: {
  icon: ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className={`menu-item ${active ? "active" : ""}`}
      onClick={onClick}
    >
      <span className="menu-icon">{icon}</span>
      <span>{label}</span>
    </button>
  );
}

/* =========================================================
   SPLIT-SCREEN LOGIN PAGE (Institutional Enterprise Style)
========================================================= */

function LoginPage({ onLogin }: { onLogin: () => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setTimeout(() => {
      onLogin();
    }, 350);
  };

  const handleAutofill = () => {
    setUsername("admin");
    setPassword("ccdi2026");
  };

  return (
    <div className="login-page-split">
      {/* LEFT HERO PANE */}
      <div className="login-hero-pane">
        <div className="hero-top-brand">
          <div className="hero-logo-box">
            <img src="/ccdi-logo.png" alt="CCDI Sorsogon Logo" />
          </div>
          <div className="hero-brand-copy">
            <h3>CCDI Sorsogon Campus</h3>
            <p>Computer Communication Development Institute</p>
          </div>
        </div>

        <div className="hero-main-content">
          <div className="hero-badge-tag">
            <span className="pulse-dot" />
            <span>Official Academic Management Portal</span>
          </div>

          <h1 className="hero-title">
            Student Directory & <span>Payment Management</span> System
          </h1>

          <p className="hero-desc">
            A centralized university portal engineered to organize student demographic profiles,
            automate tuition collections with real-time discounts, and audit promissory note filings.
          </p>

          <div className="hero-feature-list">
            <div className="hero-feature-item">
              <div className="hero-feature-icon">
                <UsersRound size={18} />
              </div>
              <div>
                <strong>Centralized Student Directory</strong>
                <span>Instant access to demographic records, academic levels, and section profiles</span>
              </div>
            </div>

            <div className="hero-feature-item">
              <div className="hero-feature-icon">
                <CreditCard size={18} />
              </div>
              <div>
                <strong>Automated Tuition & Fee Ledger</strong>
                <span>Real-time payment tracking, reference codes, and flexible discounts (0%–100%)</span>
              </div>
            </div>

            <div className="hero-feature-item">
              <div className="hero-feature-icon">
                <FileText size={18} />
              </div>
              <div>
                <strong>Promissory Note Processing</strong>
                <span>Official audit trail and approval tracking for authorized promissory requests</span>
              </div>
            </div>
          </div>
        </div>

        <div className="hero-footer-watermark">
          <span>SDPMS v1.0 • CCDI Sorsogon</span>
          <span>Capstone & IAS Research</span>
        </div>
      </div>

      {/* RIGHT LOGIN FORM PANE */}
      <div className="login-form-pane">
        <div className="login-form-box">
          <div className="login-form-header">
            <span className="login-badge">Administrator Portal</span>
            <h2>Sign In to SDPMS</h2>
            <p>Enter your administrative credentials to manage student records and payments.</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="login-input-group">
              <label htmlFor="login-user">Username or Admin ID</label>
              <div className="login-input-wrapper">
                <UserRound size={18} />
                <input
                  id="login-user"
                  type="text"
                  placeholder="e.g. admin"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  autoFocus
                />
              </div>
            </div>

            <div className="login-input-group">
              <label htmlFor="login-pass">Password</label>
              <div className="login-input-wrapper">
                <Lock size={18} />
                <input
                  id="login-pass"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword((prev) => !prev)}
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="login-options-row">
              <label className="remember-me">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Remember me</span>
              </label>

              <span
                className="forgot-link"
                role="button"
                tabIndex={0}
                onClick={() => alert("For administrative password recovery, please contact the CCDI ICT Office.")}
              >
                Forgot password?
              </span>
            </div>

            <button className="login-submit-btn" type="submit" disabled={loading}>
              {loading ? "Verifying Credentials..." : "Sign In to Dashboard"}
              <ArrowRight size={18} />
            </button>

            <button
              type="button"
              className="demo-autofill-btn"
              onClick={handleAutofill}
            >
              <Sparkles size={15} />
              Quick Fill Demo Credentials
            </button>

            <div className="security-badge">
              <ShieldCheck size={16} />
              <span>Official Institutional System • 256-bit Encrypted</span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   PAGE HEADING
========================================================= */

function PageHeading({
  icon,
  title,
  subtitle,
  action,
}: {
  icon: ReactNode;
  title: string;
  subtitle: string;
  action?: ReactNode;
}) {
  return (
    <div className="page-heading">
      <div className="heading-icon">{icon}</div>

      <div className="heading-copy">
        <h1 className="script-title">{title}</h1>
        <p>{subtitle}</p>
      </div>

      {action && <div className="heading-action">{action}</div>}
    </div>
  );
}

/* =========================================================
   DASHBOARD
========================================================= */

function Dashboard({
  students,
  payments,
  onNavigate,
  onDirectRecord,
}: {
  students: Student[];
  payments: Payment[];
  onNavigate: (page: string) => void;
  onDirectRecord: () => void;
}) {
  const paid = payments.filter((p) => p.status === "Paid").length;
  const unpaid = Math.max(0, students.length - paid);
  const collectionRate = students.length > 0 ? Math.round((paid / students.length) * 100) : 0;
  const recent = payments.slice(-5).reverse();

  return (
    <main className="content-area">
      <PageHeading
        icon={<Home size={28} />}
        title="Good Day, Administrator! 👋"
        subtitle="Here is your live summary of student enrollment and tuition payment collections."
      />

      {/* QUICK ACTIONS BAR */}
      <div className="quick-actions-bar">
        <div
          className="quick-action-card"
          role="button"
          tabIndex={0}
          onClick={() => onNavigate("student-directory")}
        >
          <div className="quick-action-icon">
            <Plus size={20} />
          </div>
          <div>
            <strong>Manage Directory</strong>
            <small>Register or view student profiles</small>
          </div>
        </div>

        <div
          className="quick-action-card"
          role="button"
          tabIndex={0}
          onClick={onDirectRecord}
        >
          <div className="quick-action-icon" style={{ background: "#ecfdf5", color: "#059669" }}>
            <Zap size={20} />
          </div>
          <div>
            <strong>Record Payment</strong>
            <small>Accept tuition and issue receipt</small>
          </div>
        </div>

        <div
          className="quick-action-card"
          role="button"
          tabIndex={0}
          onClick={() => onNavigate("payment-records")}
        >
          <div className="quick-action-icon" style={{ background: "#f5f3ff", color: "#7c3aed" }}>
            <ClipboardList size={20} />
          </div>
          <div>
            <strong>Payment Audit</strong>
            <small>View complete transaction ledger</small>
          </div>
        </div>
      </div>

      {/* SUMMARY STATS GRID */}
      <div className="summary-grid" aria-label="Dashboard summary">
        <SummaryCard
          icon={<UsersRound />}
          label="Total Students"
          value={students.length}
        />

        <SummaryCard
          icon={<CheckCircle2 />}
          label="Paid Accounts"
          value={paid}
          tone="green"
        />

        <SummaryCard
          icon={<CircleX />}
          label="Unpaid Accounts"
          value={unpaid}
          tone="red"
        />

        <SummaryCard
          icon={<Percent />}
          label="Collection Rate"
          value={`${collectionRate}%`}
          tone="purple"
        />
      </div>

      {/* TUITION COLLECTION PROGRESS BAR */}
      <div className="collection-progress-card">
        <div className="progress-header">
          <h3>Tuition Collection Progress</h3>
          <span>{collectionRate}% Collected ({paid} of {students.length} Students)</span>
        </div>

        <div className="progress-bar-track">
          <div
            className="progress-bar-fill"
            style={{ width: `${collectionRate}%` }}
          />
        </div>

        <div className="progress-legend">
          <span>
            <span className="dot-paid" /> Paid Accounts: {paid} students
          </span>
          <span>
            <span className="dot-unpaid" /> Pending Payment: {unpaid} students
          </span>
        </div>
      </div>

      {/* RECENT TRANSACTIONS TABLE */}
      <div className="section-title">
        <CalendarDays size={22} />
        <h2>Recent Payment Transactions</h2>
        <span
          className="view-all"
          role="button"
          tabIndex={0}
          onClick={() => onNavigate("payment-records")}
        >
          View All Transactions →
        </span>
      </div>

      <div className="table-card simple-table-card" aria-label="Recent payments">
        <table>
          <caption className="sr-only">Recent payment transactions</caption>
          <thead>
            <tr>
              <th>Student</th>
              <th>Student ID</th>
              <th>Amount Paid</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {recent.map((payment) => {
              const student = students.find((item) => item.id === payment.studentId);
              if (!student) return null;

              return (
                <tr key={payment.studentId}>
                  <td>
                    <div className="student-avatar-cell">
                      <img
                        className="student-thumbnail"
                        src={student.image}
                        alt=""
                        onError={(e) => {
                          e.currentTarget.src = "/icons.svg";
                        }}
                      />
                      <strong>
                        {student.firstName} {student.lastName}
                      </strong>
                    </div>
                  </td>
                  <td>
                    <span
                      style={{
                        padding: "3px 8px",
                        borderRadius: "6px",
                        background: "#f1f5f9",
                        fontWeight: 600,
                        fontSize: "13px",
                      }}
                    >
                      {student.id}
                    </span>
                  </td>
                  <td>
                    <strong>₱{payment.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong>
                  </td>
                  <td>{payment.date}</td>
                  <td>
                    <StatusBadge status={payment.status} />
                  </td>
                </tr>
              );
            })}

            {recent.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: "center", padding: "32px", color: "#64748b" }}>
                  No recent payment records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}

/* =========================================================
   SUMMARY CARD
========================================================= */

function SummaryCard({
  icon,
  label,
  value,
  tone,
}: {
  icon: ReactNode;
  label: string;
  value: number | string;
  tone?: "green" | "red" | "purple" | "blue";
}) {
  return (
    <div className={`summary-card ${tone ? `summary-${tone}` : ""}`}>
      <span className="summary-icon">{icon}</span>
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
      </div>
    </div>
  );
}

/* =========================================================
   STUDENT DIRECTORY
========================================================= */

function StudentDirectory({
  students,
  payments,
  onAdd,
  onView,
}: {
  students: Student[];
  payments: Payment[];
  onAdd: () => void;
  onView: (student: Student) => void;
}) {
  const [search, setSearch] = useState("");
  const [yearLevel, setYearLevel] = useState("All Year Levels");
  const [course, setCourse] = useState("All Courses");

  const filtered = students.filter((student) => {
    const searchableText = `
      ${student.firstName}
      ${student.middleName}
      ${student.lastName}
      ${student.id}
      ${student.course}
      ${student.yearLevel}
    `.toLowerCase();

    return (
      searchableText.includes(search.toLowerCase()) &&
      (yearLevel === "All Year Levels" || student.yearLevel === yearLevel) &&
      (course === "All Courses" || student.course === course)
    );
  });

  return (
    <main className="content-area">
      <PageHeading
        icon={<UsersRound size={28} />}
        title="Student Directory"
        subtitle="Manage registered student demographics, year levels, and enrollment statuses."
        action={
          <button className="primary-button" onClick={onAdd}>
            <Plus size={18} />
            Add Student
          </button>
        }
      />

      <div className="directory-toolbar" aria-label="Student directory filters">
        <div className="search-box">
          <Search size={20} />
          <input
            placeholder="Search by student name, ID, or course..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              style={{ color: "#94a3b8", display: "grid", placeItems: "center" }}
            >
              <X size={16} />
            </button>
          )}
        </div>

        <SelectBox
          value={yearLevel}
          onChange={setYearLevel}
          options={yearLevelOptions}
        />

        <SelectBox
          value={course}
          onChange={setCourse}
          options={["All Courses", ...courseOptions]}
        />
      </div>

      <div className="table-card directory-table">
        <table>
          <thead>
            <tr>
              <th>Student</th>
              <th>Student ID</th>
              <th>Year Level</th>
              <th>Course</th>
              <th>Section</th>
              <th>Payment Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((student) => {
              const payment = payments.find((p) => p.studentId === student.id);
              const status: PaymentStatus = payment ? payment.status : "Unpaid";

              return (
                <tr key={student.id}>
                  <td>
                    <div className="student-avatar-cell">
                      <img
                        className="student-thumbnail"
                        src={student.image}
                        alt=""
                        onError={(e) => {
                          e.currentTarget.src = "/icons.svg";
                        }}
                      />
                      <strong>
                        {student.firstName} {student.lastName}
                      </strong>
                    </div>
                  </td>
                  <td>
                    <span
                      style={{
                        padding: "3px 8px",
                        borderRadius: "6px",
                        background: "#f1f5f9",
                        fontWeight: 600,
                        fontSize: "13px",
                      }}
                    >
                      {student.id}
                    </span>
                  </td>
                  <td>{student.yearLevel}</td>
                  <td>
                    <span
                      style={{
                        padding: "3px 8px",
                        borderRadius: "6px",
                        background: "#eff6ff",
                        color: "#1d4ed8",
                        fontWeight: 600,
                        fontSize: "12.5px",
                      }}
                    >
                      {student.course}
                    </span>
                  </td>
                  <td>{student.section}</td>
                  <td>
                    <StatusBadge status={status} />
                  </td>
                  <td>
                    <button
                      className="view-button"
                      aria-label={`View ${student.firstName} ${student.lastName}`}
                      onClick={() => onView(student)}
                    >
                      <Eye size={15} />
                      View Profile
                    </button>
                  </td>
                </tr>
              );
            })}

            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} style={{ textAlign: "center", padding: "36px", color: "#64748b" }}>
                  No students found matching your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}

/* =========================================================
   ADD STUDENT
========================================================= */

function AddStudent({
  students,
  onCancel,
  onSave,
}: {
  students: Student[];
  onCancel: () => void;
  onSave: (student: NewStudent) => void;
}) {
  const [form, setForm] = useState<Omit<NewStudent, "image">>({
    id: "",
    firstName: "",
    middleName: "",
    lastName: "",
    yearLevel: "",
    course: "",
    section: "",
    contact: "",
    email: "",
    address: "",
  });

  const [image, setImage] = useState("");
  const [idError, setIdError] = useState("");

  const update = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImage = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image file (PNG/JPG).");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("File size exceeds 5MB limit.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setImage(String(reader.result));
    };
    reader.readAsDataURL(file);
  };

  const save = (event: FormEvent) => {
    event.preventDefault();
    const normalizedId = form.id.trim();

    if (!normalizedId) {
      setIdError("Student ID is required.");
      return;
    }

    if (students.some((s) => s.id.toLowerCase() === normalizedId.toLowerCase())) {
      setIdError("Student ID already exists.");
      return;
    }

    onSave({
      ...form,
      id: normalizedId,
      image: image || "/icons.svg",
    });
  };

  return (
    <main className="content-area">
      <PageHeading
        icon={<UserRound size={28} />}
        title="Add New Student"
        subtitle="Fill out student registration details for official enrollment records."
      />

      <form onSubmit={save}>
        <div className="add-form">
          <div className="form-column">
            <h3 style={{ margin: "0 0 10px", fontSize: "16px", color: "#1e293b" }}>
              Academic & Personal Information
            </h3>

            <FormField label="Student ID: *">
              <input
                required
                value={form.id}
                placeholder="e.g. 2026-006"
                onChange={(event) => {
                  setIdError("");
                  update("id", event.target.value);
                }}
                onBlur={() => update("id", form.id.trim())}
              />
              {idError && <small className="field-error">{idError}</small>}
            </FormField>

            <FormField label="First Name: *">
              <input
                required
                value={form.firstName}
                placeholder="e.g. Juan"
                onChange={(event) => update("firstName", event.target.value)}
              />
            </FormField>

            <FormField label="Middle Name:">
              <input
                value={form.middleName}
                placeholder="e.g. Dela"
                onChange={(event) => update("middleName", event.target.value)}
              />
            </FormField>

            <FormField label="Last Name: *">
              <input
                required
                value={form.lastName}
                placeholder="e.g. Cruz"
                onChange={(event) => update("lastName", event.target.value)}
              />
            </FormField>

            <FormField label="Grade/Year Level: *">
              <select
                required
                value={form.yearLevel}
                onChange={(event) => update("yearLevel", event.target.value)}
              >
                <option value="">Select Grade/Year</option>
                {yearLevelOptions
                  .filter((option) => option !== "All Year Levels")
                  .map((option) => (
                    <option value={option} key={option}>
                      {option}
                    </option>
                  ))}
              </select>
            </FormField>
          </div>

          <div className="form-column">
            <h3 style={{ margin: "0 0 10px", fontSize: "16px", color: "#1e293b" }}>
              Program, Contact & Profile Photo
            </h3>

            <FormField label="Course / Track: *">
              <select
                required
                value={form.course}
                onChange={(event) => update("course", event.target.value)}
              >
                <option value="">Select Course</option>
                {courseOptions.map((option) => (
                  <option value={option} key={option}>
                    {option}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField label="Section: *">
              <input
                required
                value={form.section}
                placeholder="e.g. 1A"
                onChange={(event) => update("section", event.target.value)}
              />
            </FormField>

            <FormField label="Contact Number: *">
              <input
                required
                inputMode="numeric"
                pattern="09[0-9]{9}"
                maxLength={11}
                value={form.contact}
                placeholder="e.g. 09123456789"
                onChange={(event) => update("contact", event.target.value)}
              />
            </FormField>

            <FormField label="Email Address: *">
              <input
                required
                type="email"
                value={form.email}
                placeholder="e.g. student@email.com"
                onChange={(event) => update("email", event.target.value)}
              />
            </FormField>

            <FormField label="Home Address:">
              <input
                value={form.address}
                placeholder="e.g. Sorsogon City"
                onChange={(event) => update("address", event.target.value)}
              />
            </FormField>

            <div className="photo-upload">
              <label>
                Student Photo: <span className="optional">(PNG/JPG, max 5MB)</span>
              </label>

              <div className="photo-upload-row">
                <label className="upload-button">
                  <Upload size={17} />
                  Choose Photo
                  <input
                    type="file"
                    accept="image/png,image/jpeg"
                    onChange={handleImage}
                  />
                </label>

                {image && (
                  <img
                    className="upload-preview"
                    src={image}
                    alt="Upload preview"
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="cancel-button" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className="primary-button">
            <Save size={18} />
            Save Student
          </button>
        </div>
      </form>
    </main>
  );
}

function FormField({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label>
      {label}
      {children}
    </label>
  );
}

/* =========================================================
   STUDENT DETAILS
========================================================= */

function StudentDetails({
  student,
  payment,
  onBack,
  onDelete,
  onDirectRecord,
}: {
  student: Student;
  payment?: Payment;
  onBack: () => void;
  onDelete: (studentId: string) => void;
  onDirectRecord: (studentId: string) => void;
}) {
  const studentName = `${student.firstName} ${student.lastName}`;

  return (
    <main className="content-area">
      <PageHeading
        icon={<UserRound size={28} />}
        title="Student Profile"
        subtitle={`Complete student demographic record and tuition account summary for ${studentName}.`}
      />

      <div className="student-details">
        <div className="profile-section">
          <div className="profile-picture">
            <img
              src={student.image}
              alt={studentName}
              loading="lazy"
              decoding="async"
              onError={(event) => {
                event.currentTarget.src = "/icons.svg";
              }}
            />
          </div>

          <div className="student-info">
            <h2 style={{ margin: "0 0 14px", fontSize: "22px", color: "#0f172a" }}>
              {student.firstName} {student.middleName ? `${student.middleName} ` : ""}{student.lastName}
            </h2>

            <InfoRow label="Student ID" value={student.id} />
            <InfoRow label="Grade/Year" value={student.yearLevel} />
            <InfoRow label="Course" value={student.course} />
            <InfoRow label="Section" value={student.section} />
            <InfoRow label="Contact" value={student.contact} />
            <InfoRow label="Email" value={student.email} />
            <InfoRow label="Address" value={student.address || "N/A"} />
          </div>
        </div>

        <div className="payment-details-card">
          <div className="payment-card-title">
            <CreditCard size={22} />
            <h2>Tuition & Payment Status</h2>
          </div>

          <InfoRow
            label="Payment Status"
            value={payment?.status ?? "Unpaid"}
            status={payment?.status ?? "Unpaid"}
          />

          <InfoRow
            label="Original Amount"
            value={`₱${(payment?.originalAmount ?? 500).toLocaleString(undefined, {
              minimumFractionDigits: 2,
            })}`}
          />

          <InfoRow
            label="Discount Applied"
            value={`${payment?.discount ?? 0}%`}
          />

          <InfoRow
            label="Amount Paid"
            value={`₱${(payment?.amount ?? 0).toLocaleString(undefined, {
              minimumFractionDigits: 2,
            })}`}
          />

          <InfoRow label="Payment Date" value={payment?.date ?? "-"} />
          <InfoRow label="Reference No." value={payment?.reference ?? "-"} />

          {payment?.promissoryNote && (
            <div className="requester-note" style={{ marginTop: "14px" }}>
              <FileText size={18} />
              <span>
                <strong>Promissory Note:</strong> Approved and filed for {payment.promissoryRequester || studentName}.
              </span>
            </div>
          )}
        </div>

        <div style={{ display: "flex", gap: "12px", marginTop: "20px", flexWrap: "wrap", alignItems: "center" }}>
          <button className="back-button" onClick={onBack}>
            <ArrowLeft size={18} />
            Back to Directory
          </button>

          {payment?.status === "Unpaid" && (
            <button
              className="primary-button"
              onClick={() => onDirectRecord(student.id)}
            >
              <CreditCard size={18} />
              Record Payment for this Student
            </button>
          )}

          <button
            className="cancel-button delete-button"
            type="button"
            style={{ marginLeft: "auto" }}
            onClick={() => {
              const confirmed = window.confirm(`Are you sure you want to delete ${studentName}? This action cannot be undone.`);
              if (confirmed) {
                onDelete(student.id);
              }
            }}
          >
            <Trash2 size={17} />
            Delete Student
          </button>
        </div>
      </div>
    </main>
  );
}

function InfoRow({
  label,
  value,
  status,
}: {
  label: string;
  value: string;
  status?: PaymentStatus;
}) {
  return (
    <div className="info-row">
      <span>{label}</span>
      <b>:</b>
      {status ? <StatusBadge status={status} /> : <strong>{value}</strong>}
    </div>
  );
}

/* =========================================================
   STATUS BADGE
========================================================= */

function StatusBadge({ status }: { status: PaymentStatus }) {
  return (
    <span className={`payment-status ${status === "Paid" ? "status-paid" : "status-unpaid"}`}>
      {status}
    </span>
  );
}

/* =========================================================
   CUSTOM SELECT BOX
========================================================= */

function SelectBox({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <div className="select-box">
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <ChevronDown size={18} />
    </div>
  );
}

/* =========================================================
   PAYMENT INFORMATION
========================================================= */

function PaymentInformation({
  students,
  payments,
  onRecord,
  onView,
}: {
  students: Student[];
  payments: Payment[];
  onRecord: () => void;
  onView: (student: Student) => void;
}) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const rows = useMemo(() => {
    return students
      .map((student) => ({
        student,
        payment: payments.find((item) => item.studentId === student.id) ?? {
          studentId: student.id,
          amount: 0,
          originalAmount: 500,
          discount: 0 as Discount,
          date: "-",
          status: "Unpaid" as const,
          reference: "-",
          promissoryNote: false,
        },
      }))
      .filter((row) => {
        const text = `
          ${row.student.firstName}
          ${row.student.lastName}
          ${row.student.id}
          ${row.payment.reference}
          ${row.student.course}
          ${row.student.yearLevel}
        `.toLowerCase();

        return (
          text.includes(search.toLowerCase()) &&
          (filter === "All" || row.payment.status === filter)
        );
      });
  }, [students, payments, search, filter]);

  return (
    <main className="content-area">
      <PageHeading
        icon={<CreditCard size={28} />}
        title="Payment Information"
        subtitle="Manage student fee balances, record tuition collections, and issue official payments."
      />

      <div className="payment-toolbar">
        <div className="search-box payment-search">
          <Search size={20} />
          <input
            placeholder="Search by student name or student ID..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              style={{ color: "#94a3b8", display: "grid", placeItems: "center" }}
            >
              <X size={16} />
            </button>
          )}
        </div>

        <SelectBox
          value={filter}
          onChange={setFilter}
          options={["All", "Paid", "Unpaid"]}
        />

        <button className="primary-button record-button" onClick={onRecord}>
          <Plus size={18} />
          Record Payment
        </button>
      </div>

      <div className="table-card payment-table-card">
        <table>
          <thead>
            <tr>
              <th>Student</th>
              <th>Student ID</th>
              <th>Course / Year</th>
              <th>Amount Paid</th>
              <th>Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.student.id}>
                <td>
                  <div className="student-avatar-cell">
                    <img
                      className="student-thumbnail"
                      src={row.student.image}
                      alt=""
                      onError={(e) => {
                        e.currentTarget.src = "/icons.svg";
                      }}
                    />
                    <strong>
                      {row.student.firstName} {row.student.lastName}
                    </strong>
                  </div>
                </td>
                <td>
                  <span
                    style={{
                      padding: "3px 8px",
                      borderRadius: "6px",
                      background: "#f1f5f9",
                      fontWeight: 600,
                      fontSize: "13px",
                    }}
                  >
                    {row.student.id}
                  </span>
                </td>
                <td>
                  {row.student.course} • {row.student.yearLevel}
                </td>
                <td>
                  <strong>₱{row.payment.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong>
                </td>
                <td>{row.payment.date}</td>
                <td>
                  <StatusBadge status={row.payment.status} />
                </td>
                <td>
                  <button
                    className="view-button"
                    onClick={() => onView(row.student)}
                  >
                    <Eye size={15} />
                    View
                  </button>
                </td>
              </tr>
            ))}

            {rows.length === 0 && (
              <tr>
                <td colSpan={7} style={{ textAlign: "center", padding: "36px", color: "#64748b" }}>
                  No payment records found matching your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}

/* =========================================================
   PAYMENT RECORDS (Audit Trail)
========================================================= */

function PaymentRecords({
  students,
  payments,
}: {
  students: Student[];
  payments: Payment[];
}) {
  return (
    <main className="content-area">
      <PageHeading
        icon={<ClipboardList size={28} />}
        title="Payment Records & Audit Trail"
        subtitle="Complete chronological history of payments, discounts, and promissory notes."
      />

      <div className="table-card payment-table-card">
        <table>
          <thead>
            <tr>
              <th>Student</th>
              <th>Program</th>
              <th>Reference No.</th>
              <th>Amount</th>
              <th>Payment Date</th>
              <th>Status</th>
              <th>Discount</th>
              <th>Promissory Note</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => {
              const student = students.find((item) => item.id === payment.studentId);
              if (!student) return null;

              return (
                <tr key={payment.studentId}>
                  <td>
                    <div className="student-avatar-cell">
                      <img
                        className="student-thumbnail"
                        src={student.image}
                        alt=""
                        onError={(e) => {
                          e.currentTarget.src = "/icons.svg";
                        }}
                      />
                      <strong>
                        {student.firstName} {student.lastName}
                      </strong>
                    </div>
                  </td>
                  <td>
                    {student.course} • {student.yearLevel}
                  </td>
                  <td>
                    <span
                      style={{
                        padding: "3px 8px",
                        borderRadius: "6px",
                        background: "#eff6ff",
                        color: "#1d4ed8",
                        fontWeight: 600,
                        fontSize: "12.5px",
                        fontFamily: "monospace",
                      }}
                    >
                      {payment.reference}
                    </span>
                  </td>
                  <td>
                    <strong>₱{payment.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong>
                  </td>
                  <td>{payment.date}</td>
                  <td>
                    <StatusBadge status={payment.status} />
                  </td>
                  <td>{payment.discount}%</td>
                  <td>
                    {payment.promissoryNote ? (
                      <span
                        style={{
                          display: "inline-block",
                          padding: "2px 8px",
                          borderRadius: "4px",
                          background: "#fffbeb",
                          color: "#92400e",
                          border: "1px solid #fde68a",
                          fontSize: "12px",
                        }}
                      >
                        Req. by {payment.promissoryRequester || "Student"}
                      </span>
                    ) : (
                      "-"
                    )}
                  </td>
                </tr>
              );
            })}

            {payments.length === 0 && (
              <tr>
                <td colSpan={8} style={{ textAlign: "center", padding: "36px", color: "#64748b" }}>
                  No transaction records available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}

/* =========================================================
   RECORD PAYMENT MODAL
========================================================= */

function RecordPaymentModal({
  students,
  payments,
  initialStudentId,
  onClose,
  onSave,
}: {
  students: Student[];
  payments: Payment[];
  initialStudentId?: string | null;
  onClose: () => void;
  onSave: (payment: Payment) => void;
}) {
  const [studentSearch, setStudentSearch] = useState(initialStudentId || "");
  const [studentId, setStudentId] = useState(initialStudentId || "");
  const [studentTouched, setStudentTouched] = useState(false);
  const [originalAmount, setOriginalAmount] = useState("500");
  const [discount, setDiscount] = useState<Discount>(0);
  const [date, setDate] = useState("Sept. 16, 2026");
  const [status, setStatus] = useState<PaymentStatus>("Paid");
  const [promissoryNote, setPromissoryNote] = useState(false);
  const [amountError, setAmountError] = useState("");

  const selectedStudent = students.find((s) => s.id === studentId);
  const normalizedSearch = studentSearch.trim().toLowerCase();

  const suggestions = normalizedSearch
    ? students
        .filter((student) => {
          const text = `${student.id} ${student.firstName} ${student.middleName} ${student.lastName} ${student.course}`.toLowerCase();
          return text.includes(normalizedSearch);
        })
        .slice(0, 5)
    : [];

  const studentNotFound =
    studentTouched &&
    normalizedSearch.length > 0 &&
    !selectedStudent &&
    suggestions.length === 0;

  const requester = selectedStudent
    ? `${selectedStudent.firstName} ${selectedStudent.lastName}`
    : "";

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const selectStudent = (student: Student) => {
    setStudentId(student.id);
    setStudentSearch(student.id);
    setStudentTouched(false);
  };

  const handleStudentSearch = (value: string) => {
    setStudentSearch(value);
    setStudentTouched(true);

    const exactMatch = students.find(
      (s) => s.id.toLowerCase() === value.trim().toLowerCase()
    );

    if (exactMatch) {
      setStudentId(exactMatch.id);
      setStudentTouched(false);
      return;
    }

    setStudentId("");
  };

  const parsedOriginal = Number(originalAmount) || 0;
  const discountAmount = (parsedOriginal * discount) / 100;
  const amount = Math.max(0, parsedOriginal - discountAmount);

  const save = () => {
    if (!selectedStudent) {
      setStudentTouched(true);
      return;
    }

    const numericAmount = Number(originalAmount);
    if (!Number.isFinite(numericAmount) || numericAmount < 0) {
      setAmountError("Enter a valid non-negative amount.");
      return;
    }

    setAmountError("");

    let reference = "-";
    if (status === "Paid") {
      do {
        reference = `PAY-${Math.floor(1000 + Math.random() * 9000)}`;
      } while (payments.some((p) => p.reference === reference));
    }

    onSave({
      studentId: selectedStudent.id,
      amount,
      originalAmount: Number(originalAmount) || 0,
      discount,
      date: status === "Paid" ? date || "Sept. 16, 2026" : "-",
      status,
      reference,
      promissoryNote,
      promissoryRequester: promissoryNote ? requester || "Student" : undefined,
    });
  };

  return (
    <div className="modal-overlay">
      <div className="payment-modal">
        <div className="modal-header">
          <div>
            <h2>Record Payment Transaction</h2>
            <p>Select student, apply discount or promissory note, and save payment record.</p>
          </div>
          <button aria-label="Close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <label className="student-picker-label">
          Select Student *
          <div className={`student-picker ${studentNotFound ? "student-picker-error" : ""}`}>
            {selectedStudent && (
              <div className="selected-student-chip">
                <img
                  src={selectedStudent.image}
                  alt=""
                  onError={(e) => {
                    e.currentTarget.src = "/icons.svg";
                  }}
                />
                <span>
                  {selectedStudent.firstName} {selectedStudent.lastName}
                  <small>
                    {selectedStudent.id} • {selectedStudent.course}
                  </small>
                </span>
                <button
                  type="button"
                  aria-label="Remove selected student"
                  onClick={() => {
                    setStudentId("");
                    setStudentSearch("");
                    setStudentTouched(false);
                  }}
                >
                  <X size={13} />
                </button>
              </div>
            )}

            <input
              value={selectedStudent ? "" : studentSearch}
              placeholder={
                selectedStudent
                  ? ""
                  : "Type student name or ID (e.g. 2026-001)"
              }
              onChange={(e) => handleStudentSearch(e.target.value)}
              onFocus={() => setStudentTouched(true)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && suggestions[0]) {
                  e.preventDefault();
                  selectStudent(suggestions[0]);
                }
              }}
              autoComplete="off"
            />
          </div>

          {suggestions.length > 0 && !selectedStudent && (
            <div className="student-suggestions">
              {suggestions.map((student) => (
                <button
                  type="button"
                  className="student-suggestion"
                  key={student.id}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => selectStudent(student)}
                >
                  <img
                    src={student.image}
                    alt=""
                    onError={(e) => {
                      e.currentTarget.src = "/icons.svg";
                    }}
                  />
                  <span>
                    <strong>
                      {student.firstName} {student.lastName}
                    </strong>
                    <small>
                      {student.id} • {student.yearLevel} • {student.course} - {student.section}
                    </small>
                  </span>
                </button>
              ))}
            </div>
          )}

          {studentNotFound && (
            <div className="student-not-found">
              <CircleX size={16} />
              <span>
                <strong>Student not found</strong>
                <small>Please check the student ID or name and try again.</small>
              </span>
            </div>
          )}
        </label>

        <label>
          Original Tuition / Fee (₱)
          <input
            type="number"
            min="0"
            step="0.01"
            value={originalAmount}
            onChange={(e) => {
              setAmountError("");
              setOriginalAmount(e.target.value);
            }}
          />
          {amountError && <small className="field-error">{amountError}</small>}
        </label>

        <label>
          Discount Percentage
          <SelectBox
            value={`${discount}%`}
            onChange={(val) =>
              setDiscount(Number(val.replace("%", "")) as Discount)
            }
            options={discountOptions.map((v) => `${v}%`)}
          />
        </label>

        <div className="calculation-card">
          <span>
            <CircleDollarSign size={18} />
            Summary Calculation
          </span>
          <strong>₱{amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong>
          <small>
            Original: ₱{parsedOriginal.toLocaleString(undefined, { minimumFractionDigits: 2 })} • Discount: {discount}% (-₱{discountAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })})
          </small>
        </div>

        <label>
          Payment Status
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as PaymentStatus)}
          >
            <option value="Paid">Paid</option>
            <option value="Unpaid">Unpaid</option>
          </select>
        </label>

        {status === "Paid" && (
          <label>
            Payment Date
            <input
              value={date}
              placeholder="e.g. Sept. 16, 2026"
              onChange={(e) => setDate(e.target.value)}
            />
          </label>
        )}

        <label className="check-row">
          <input
            type="checkbox"
            checked={promissoryNote}
            onChange={(e) => setPromissoryNote(e.target.checked)}
          />
          <span>Include Promissory Note request</span>
        </label>

        {promissoryNote && (
          <div className="requester-note">
            <FileText size={18} />
            <span>
              Requested for: <strong>{requester || "Selected Student"}</strong>
            </span>
          </div>
        )}

        <div className="modal-actions">
          <button className="cancel-button" onClick={onClose}>
            Cancel
          </button>
          <button
            className="primary-button"
            onClick={save}
            disabled={!selectedStudent}
          >
            <Save size={18} />
            Save Payment Record
          </button>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   SETTINGS PAGE
========================================================= */

function SettingsPage({ onLogout }: { onLogout: () => void }) {
  return (
    <main className="content-area">
      <PageHeading
        icon={<Settings size={28} />}
        title="System Settings"
        subtitle="Manage administrator profile, application preferences, and active sessions."
      />

      <div className="settings-card">
        <h2>Administrator Session</h2>
        <p>
          You are currently logged in with full administrative privileges. You can manage
          student directories, modify tuition fee discounts, and record payment transactions.
        </p>

        <div style={{ marginTop: "16px", padding: "14px", background: "#f8fafc", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
          <div style={{ fontSize: "14px", fontWeight: 600, color: "#0f172a" }}>Active User: Admin</div>
          <div style={{ fontSize: "13px", color: "#64748b" }}>Role: Head Registrar / Cashier</div>
          <div style={{ fontSize: "13px", color: "#64748b" }}>Institution: CCDI Sorsogon City Campus</div>
        </div>

        <button className="cancel-button logout-button" onClick={onLogout}>
          <LogOut size={16} />
          End Session & Log Out
        </button>
      </div>
    </main>
  );
}

/* =========================================================
   ABOUT PAGE
========================================================= */

function AboutPage() {
  return (
    <main className="content-area">
      <PageHeading
        icon={<FileText size={28} />}
        title="About SDPMS"
        subtitle="Student Directory & Payment Management System — Computer Communication Development Institute"
      />

      <div className="about-card">
        <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "14px" }}>
          <img src="/ccdi-logo.png" alt="CCDI Logo" style={{ width: "48px", height: "48px", objectFit: "contain" }} />
          <div>
            <h2 style={{ margin: 0, fontSize: "20px" }}>CCDI Sorsogon</h2>
            <span style={{ fontSize: "13px", color: "#64748b" }}>Research & Capstone Project</span>
          </div>
        </div>

        <p>
          <strong>SDPMS</strong> is an integrated student records and payment management platform engineered to streamline
          administrative operations. It centralizes student demographic data, enrollment tracking, tuition collection,
          flexible discount allocations (10% to 100%), and formal promissory note processing.
        </p>

        <div className="about-points">
          <span>
            <UsersRound size={20} />
            Student Profiles & Enrollment Records
          </span>

          <span>
            <CreditCard size={20} />
            Real-Time Payment Tracking & Receipts
          </span>

          <span>
            <Percent size={20} />
            Dynamic Discount Computation (0%–100%)
          </span>

          <span>
            <FileText size={20} />
            Promissory Note Filing & Records
          </span>
        </div>
      </div>
    </main>
  );
}

export default App;