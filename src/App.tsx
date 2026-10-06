import { useEffect, useMemo, useState } from "react";
import type {
  ChangeEvent,
  FormEvent,
  ReactNode,
} from "react";

import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  CircleDollarSign,
  ClipboardList,
  CreditCard,
  Eye,
  FileText,
  Home,
  Menu,
  Percent,
  Plus,
  Search,
  Save,
  Settings,
  Upload,
  UserRound,
  UsersRound,
  WalletCards,
  X,
  CircleX,
} from "lucide-react";

import "./App.css";

type PaymentStatus = "Paid" | "Unpaid";

type Discount =
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

type Student = {
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

type Payment = {
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

type NewStudent = Omit<Student, "image"> & {
  image: string;
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
    contact: "09XXXXXXXXX",
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
    contact: "09XXXXXXXXX",
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
    contact: "09XXXXXXXXX",
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
    contact: "09XXXXXXXXX",
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
    contact: "09XXXXXXXXX",
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
      const savedStudents =
        localStorage.getItem("students");

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
      const savedPayments =
        localStorage.getItem("payments");

      if (savedPayments) {
        return JSON.parse(savedPayments) as Payment[];
      }

      return initialPayments;
    } catch {
      return initialPayments;
    }
  });

  const [selectedStudent, setSelectedStudent] =
    useState<Student | null>(null);

  const [showAddStudent, setShowAddStudent] =
    useState(false);

  const [showRecordPayment, setShowRecordPayment] =
    useState(false);

  useEffect(() => {
    localStorage.setItem(
      "students",
      JSON.stringify(students),
    );
  }, [students]);

  useEffect(() => {
    localStorage.setItem(
      "payments",
      JSON.stringify(payments),
    );
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
  };

  const handleLogout = () => {
    setLoggedIn(false);
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("currentPage");
    setSidebarOpen(false);
  };

  const addStudent = (student: NewStudent) => {
    setStudents((prev) => [...prev, student]);

    setShowAddStudent(false);
    setCurrentPage("student-directory");
  };

  const deleteStudent = (studentId: string) => {
    setStudents((prev) =>
      prev.filter((student) => student.id !== studentId),
    );

    setPayments((prev) =>
      prev.filter((payment) => payment.studentId !== studentId),
    );

    setSelectedStudent(null);
    setCurrentPage("student-directory");
  };

  const savePayment = (payment: Payment) => {
    setPayments((prev) => {
      const existing = prev.find(
        (item) => item.studentId === payment.studentId,
      );

      if (existing) {
        return prev.map((item) =>
          item.studentId === payment.studentId
            ? payment
            : item,
        );
      }

      return [...prev, payment];
    });

    setShowRecordPayment(false);
  };

  if (!loggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="app">

      {/* SIDEBAR */}
      <aside
        className={`sidebar ${
          sidebarOpen ? "open" : ""
        }`}
        aria-hidden={!sidebarOpen}
      >
        <div className="sidebar-header">

          {/* CCDI LOGO */}
          <div
            className="logo-box"
            style={{
              width: "42px",
              height: "42px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            <img
              src="/ccdi-logo.png"
              alt="CCDI Sorsogon"
              style={{
                width: "38px",
                height: "38px",
                objectFit: "contain",
              }}
            />
          </div>

          <span className="logo-text">
            SDPMS
          </span>

          <button
            className="close-sidebar"
            aria-label="Close sidebar"
            title="Close sidebar"
            onClick={() =>
              setSidebarOpen(false)
            }
          >
            <X size={24} />
          </button>
        </div>

        <nav className="sidebar-menu">

          <MenuButton
            icon={<Home />}
            label="Dashboard"
            active={
              currentPage === "dashboard"
            }
            onClick={() =>
              openPage("dashboard")
            }
          />

          <MenuButton
            icon={<UserRound />}
            label="Student Directory"
            active={
              currentPage ===
                "student-directory" ||
              currentPage ===
                "student-details" ||
              currentPage ===
                "add-student"
            }
            onClick={() =>
              openPage(
                "student-directory",
              )
            }
          />

          <MenuButton
            icon={<CreditCard />}
            label="Payment Information"
            active={
              currentPage ===
              "payment-information"
            }
            onClick={() =>
              openPage(
                "payment-information",
              )
            }
          />

          <MenuButton
            icon={<ClipboardList />}
            label="Payment Records"
            active={
              currentPage ===
              "payment-records"
            }
            onClick={() =>
              openPage(
                "payment-records",
              )
            }
          />

          <MenuButton
            icon={<Settings />}
            label="Settings"
            active={
              currentPage === "settings"
            }
            onClick={() =>
              openPage("settings")
            }
          />

          <MenuButton
            icon={<FileText />}
            label="About"
            active={
              currentPage === "about"
            }
            onClick={() =>
              openPage("about")
            }
          />
        </nav>
      </aside>

      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          role="button"
          tabIndex={0}
          aria-label="Close navigation"
          onClick={() =>
            setSidebarOpen(false)
          }
          onKeyDown={(event) => {
            if (
              event.key === "Escape" ||
              event.key === "Enter"
            ) {
              setSidebarOpen(false);
            }
          }}
        />
      )}

      <div className="main-wrapper">

        {/* TOPBAR */}
        <header className="topbar">

          <button
            className="hamburger"
            aria-label="Open sidebar"
            onClick={() =>
              setSidebarOpen(
                (open) => !open,
              )
            }
          >
            {sidebarOpen ? (
              <X
                size={27}
                strokeWidth={1.8}
              />
            ) : (
              <Menu
                size={27}
                strokeWidth={1.8}
              />
            )}
          </button>

          <div className="topbar-spacer" />

          <div
            className="admin-account"
            role="status"
            aria-label="Administrator account"
          >
            <UserRound
              size={23}
              strokeWidth={1.7}
            />

            <span>
              Welcome, Admin
            </span>

            <ChevronDown size={17} />
          </div>
        </header>

        {currentPage === "dashboard" && (
          <Dashboard
            students={students}
            payments={payments}
          />
        )}

        {currentPage ===
          "student-directory" &&
          !showAddStudent && (
            <StudentDirectory
              students={students}
              onAdd={() =>
                setShowAddStudent(true)
              }
              onView={(student) => {
                setSelectedStudent(
                  student,
                );

                setCurrentPage(
                  "student-details",
                );
              }}
            />
          )}

        {showAddStudent && (
          <AddStudent
            students={students}
            onCancel={() =>
              setShowAddStudent(false)
            }
            onSave={addStudent}
          />
        )}

        {currentPage ===
          "student-details" &&
          selectedStudent && (
            <StudentDetails
              student={selectedStudent}
              payment={payments.find(
                (payment) =>
                  payment.studentId ===
                  selectedStudent.id,
              )}
              onBack={() =>
                setCurrentPage(
                  "student-directory",
                )
              }
              onDelete={deleteStudent}
            />
          )}

        {currentPage ===
          "payment-information" && (
          <PaymentInformation
            students={students}
            payments={payments}
            onRecord={() =>
              setShowRecordPayment(true)
            }
            onView={(student) => {
              setSelectedStudent(
                student,
              );

              setCurrentPage(
                "student-details",
              );
            }}
          />
        )}

        {currentPage ===
          "payment-records" && (
          <PaymentRecords
            students={students}
            payments={payments}
          />
        )}

        {currentPage === "settings" && (
          <SettingsPage
            onLogout={handleLogout}
          />
        )}

        {currentPage === "about" && (
          <AboutPage />
        )}
      </div>

      {showRecordPayment && (
        <RecordPaymentModal
          students={students}
          payments={payments}
          onClose={() =>
            setShowRecordPayment(false)
          }
          onSave={savePayment}
        />
      )}
    </div>
  );
}


/* =========================================================
   SIDEBAR BUTTON
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
      className={`menu-item ${
        active ? "active" : ""
      }`}
      onClick={onClick}
    >
      <span className="menu-icon">
        {icon}
      </span>

      <span>{label}</span>
    </button>
  );
}


/* =========================================================
   LOGIN PAGE
========================================================= */

function LoginPage({
  onLogin,
}: {
  onLogin: () => void;
}) {
  const [username, setUsername] =
    useState("");

  const [password, setPassword] =
    useState("");

  return (
    <div className="login-page">

      <div
        className="login-content"
        style={{
          width: "100%",
          maxWidth: "430px",
          margin: "0 auto",
        }}
      >

        {/* CCDI LOGO */}
        <div
          className="login-logo"
          style={{
            width: "86px",
            height: "86px",
            margin: "0 auto 14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src="/ccdi-logo.png"
            alt="CCDI Sorsogon Logo"
            style={{
              width: "78px",
              height: "78px",
              objectFit: "contain",
              display: "block",
            }}
          />
        </div>

        <p
          style={{
            margin: "0 0 5px",
            fontSize: "15px",
            fontWeight: 600,
            letterSpacing: "0.5px",
          }}
        >
          CCDI Sorsogon
        </p>

        <h1 className="login-script">
          Student Directory &
        </h1>

        <h2 className="login-main-title">
          Payment Management System
        </h2>

        <p className="login-subtitle">
          Manage Students&nbsp; • &nbsp;
          Track Payments&nbsp; • &nbsp;
          Build a Better School
        </p>

        {/* COMPACT LOGIN CARD */}
        <form
          className="login-card"
          style={{
            width: "100%",
            maxWidth: "380px",
            margin: "22px auto 0",
            boxSizing: "border-box",
          }}
          onSubmit={(event) => {
            event.preventDefault();
            onLogin();
          }}
        >

          <div className="login-input">
            <UserRound
              size={24}
              strokeWidth={1.7}
            />

            <input
              aria-label="Username"
              placeholder="Username"
              value={username}
              onChange={(event) =>
                setUsername(
                  event.target.value,
                )
              }
            />
          </div>

          <div className="login-input">
            <WalletCards
              size={24}
              strokeWidth={1.7}
            />

            <input
              aria-label="Password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(event) =>
                setPassword(
                  event.target.value,
                )
              }
            />
          </div>

          <button
            className="login-button"
            type="submit"
          >
            Login
            <span>→</span>
          </button>
        </form>
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

      <div className="heading-icon">
        {icon}
      </div>

      <div className="heading-copy">
        <h1 className="script-title">
          {title}
        </h1>

        <p>{subtitle}</p>
      </div>

      {action && (
        <div className="heading-action">
          {action}
        </div>
      )}
    </div>
  );
}


/* =========================================================
   DASHBOARD
========================================================= */

function Dashboard({
  students,
  payments,
}: {
  students: Student[];
  payments: Payment[];
}) {
  const paid = payments.filter(
    (payment) =>
      payment.status === "Paid",
  ).length;

  const unpaid = Math.max(
    0,
    students.length - paid,
  );

  const recent = payments
    .slice(-5)
    .reverse();

  return (
    <main className="content-area">

      <PageHeading
        icon={<Home size={40} />}
        title="Good Day, Admin!"
        subtitle="Here's the summary of the system."
      />

      <div
        className="summary-grid"
        aria-label="Dashboard summary"
      >
        <SummaryCard
          icon={<UsersRound />}
          label="Total Students"
          value={students.length}
        />

        <SummaryCard
          icon={<CheckCircle2 />}
          label="Paid"
          value={paid}
          tone="green"
        />

        <SummaryCard
          icon={<CircleX />}
          label="Unpaid"
          value={unpaid}
          tone="red"
        />
      </div>

      <div className="section-title">
        <CalendarDays size={27} />

        <h2>Recent Payments</h2>

        <span className="view-all">
          View All →
        </span>
      </div>

      <div
        className="table-card simple-table-card"
        aria-label="Recent payments"
      >
        <table>
          <caption className="sr-only">
            Recent payment transactions
          </caption>

          <thead>
            <tr>
              <th>Student Name</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {recent.map((payment) => {
              const student =
                students.find(
                  (item) =>
                    item.id ===
                    payment.studentId,
                );

              if (!student) return null;

              return (
                <tr
                  key={payment.studentId}
                >
                  <td>
                    {student.firstName}{" "}
                    {student.lastName}
                  </td>

                  <td>
                    ₱
                    {payment.amount.toLocaleString()}
                  </td>

                  <td>
                    {payment.date}
                  </td>

                  <td>
                    <StatusBadge
                      status={
                        payment.status
                      }
                    />
                  </td>
                </tr>
              );
            })}
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
  value: number;
  tone?: "green" | "red";
}) {
  return (
    <div
      className={`summary-card ${
        tone
          ? `summary-${tone}`
          : ""
      }`}
    >
      <span className="summary-icon">
        {icon}
      </span>

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
  onAdd,
  onView,
}: {
  students: Student[];
  onAdd: () => void;
  onView: (student: Student) => void;
}) {
  const [search, setSearch] =
    useState("");

  const [yearLevel, setYearLevel] =
    useState("All Year Levels");

  const [course, setCourse] =
    useState("All Courses");

  const filtered =
    students.filter((student) => {
      const searchableText = `
        ${student.firstName}
        ${student.middleName}
        ${student.lastName}
        ${student.id}
        ${student.course}
        ${student.yearLevel}
      `.toLowerCase();

      return (
        searchableText.includes(
          search.toLowerCase(),
        ) &&
        (yearLevel ===
          "All Year Levels" ||
          student.yearLevel ===
            yearLevel) &&
        (course === "All Courses" ||
          student.course === course)
      );
    });

  return (
    <main className="content-area">

      <PageHeading
        icon={<UsersRound size={42} />}
        title="Student Directory"
        subtitle="View and manage student information."
        action={
          <button
            className="primary-button"
            onClick={onAdd}
          >
            <Plus size={19} />
            Add Student
          </button>
        }
      />

      <div
        className="directory-toolbar"
        aria-label="Student directory filters"
      >
        <div className="search-box">
          <Search size={23} />

          <input
            placeholder="Search student..."
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value,
              )
            }
          />
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
              <th>Student ID</th>
              <th>Name</th>
              <th>Grade/Year</th>
              <th>Course</th>
              <th>Section</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map(
              (student) => (
                <tr key={student.id}>

                  <td>
                    {student.id}
                  </td>

                  <td>
                    {student.firstName}{" "}
                    {student.lastName}
                  </td>

                  <td>
                    {student.yearLevel}
                  </td>

                  <td>
                    {student.course}
                  </td>

                  <td>
                    {student.section}
                  </td>

                  <td>
                    <StatusBadge
                      status={
                        student.id ===
                          "2026-002" ||
                        student.id ===
                          "2026-004"
                          ? "Unpaid"
                          : "Paid"
                      }
                    />
                  </td>

                  <td>
                    <button
                      className="view-button"
                      aria-label={`View ${student.firstName} ${student.lastName}`}
                      onClick={() =>
                        onView(student)
                      }
                    >
                      <Eye size={17} />
                      View
                    </button>
                  </td>
                </tr>
              ),
            )}

            {filtered.length ===
              0 && (
              <tr>
                <td
                  colSpan={7}
                  style={{
                    textAlign:
                      "center",
                    padding:
                      "25px",
                  }}
                >
                  No students found.
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
  const [form, setForm] =
    useState<Omit<
      NewStudent,
      "image"
    >>({
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

  const [image, setImage] =
    useState("");

  const [idError, setIdError] =
    useState("");

  const update = (
    field: keyof typeof form,
    value: string,
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImage = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) return;

    if (
      !file.type.startsWith(
        "image/",
      )
    ) {
      return;
    }

    if (
      file.size >
      5 * 1024 * 1024
    ) {
      return;
    }

    const reader =
      new FileReader();

    reader.onload = () => {
      setImage(
        String(
          reader.result,
        ),
      );
    };

    reader.readAsDataURL(file);
  };

  const save = (
    event: FormEvent,
  ) => {
    event.preventDefault();

    const normalizedId = form.id.trim();

    if (!normalizedId) {
      setIdError("Student ID is required.");
      return;
    }

    if (students.some((student) => student.id.toLowerCase() === normalizedId.toLowerCase())) {
      setIdError("Student ID already exists.");
      return;
    }

    onSave({
      ...form,
      id: normalizedId,
      image:
        image ||
        "/icons.svg",
    });
  };

  return (
    <main className="content-area">

      <PageHeading
        icon={<UserRound size={42} />}
        title="Add Student"
        subtitle="Fill in the student information."
      />

      <form onSubmit={save}>

        <div className="add-form">

          <div className="form-column">

            <FormField label="Student ID: *">
              <input
                required
                value={form.id}
                placeholder="e.g. 2026-001"
                onChange={(event) => {
                setIdError("");
                update("id", event.target.value);
              }}
              onBlur={() =>
                update("id", form.id.trim())
              }
              />
              {idError && (
                <small className="field-error">{idError}</small>
              )}
            </FormField>

            <FormField label="First Name: *">
              <input
                required
                value={
                  form.firstName
                }
                placeholder="e.g. Juan"
                onChange={(event) =>
                  update(
                    "firstName",
                    event.target.value,
                  )
                }
              />
            </FormField>

            <FormField label="Middle Name:">
              <input
                value={
                  form.middleName
                }
                placeholder="e.g. Dela"
                onChange={(event) =>
                  update(
                    "middleName",
                    event.target.value,
                  )
                }
              />
            </FormField>

            <FormField label="Last Name: *">
              <input
                required
                value={
                  form.lastName
                }
                placeholder="e.g. Cruz"
                onChange={(event) =>
                  update(
                    "lastName",
                    event.target.value,
                  )
                }
              />
            </FormField>

            <FormField label="Grade/Year: *">
              <select
                required
                value={
                  form.yearLevel
                }
                onChange={(event) =>
                  update(
                    "yearLevel",
                    event.target.value,
                  )
                }
              >
                <option value="">
                  Select Grade/Year
                </option>

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

            <FormField label="Course: *">
              <select
                required
                value={form.course}
                onChange={(event) =>
                  update(
                    "course",
                    event.target.value,
                  )
                }
              >
                <option value="">
                  Select Course
                </option>

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
                value={
                  form.section
                }
                placeholder="e.g. 2A"
                onChange={(event) =>
                  update(
                    "section",
                    event.target.value,
                  )
                }
              />
            </FormField>

            <FormField label="Contact Number: *">
              <input
                required
                inputMode="numeric"
                pattern="09[0-9]{9}"
                maxLength={11}
                value={
                  form.contact
                }
                placeholder="e.g. 09123456789"
                onChange={(event) =>
                  update(
                    "contact",
                    event.target.value,
                  )
                }
              />
            </FormField>

            <FormField label="Email: *">
              <input
                required
                type="email"
                value={
                  form.email
                }
                placeholder="e.g. student@email.com"
                onChange={(event) =>
                  update(
                    "email",
                    event.target.value,
                  )
                }
              />
            </FormField>

            <FormField label="Address:">
              <input
                value={
                  form.address
                }
                placeholder="e.g. Sorsogon City"
                onChange={(event) =>
                  update(
                    "address",
                    event.target.value,
                  )
                }
              />
            </FormField>

            <div className="photo-upload">

              <label>
                Profile Picture:{" "}
                <span className="optional">
                  PNG/JPG
                </span>
              </label>

              <div className="photo-upload-row">

                <label className="upload-button">
                  <Upload size={18} />
                  Choose Picture

                  <input
                    type="file"
                    accept="image/png,image/jpeg"
                    onChange={
                      handleImage
                    }
                  />
                </label>

                {image && (
                  <img
                    className="upload-preview"
                    src={image}
                    alt="profile preview"
                  />
                )}
              </div>

              <small>
                the selected picture
                is used for this
                student's profile.
                choose a new image
                when adding another
                student.
              </small>
            </div>
          </div>
        </div>

        <div className="form-actions">

          <button
            type="button"
            className="cancel-button"
            onClick={onCancel}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="primary-button"
          >
            <Save size={18} />
            Save Student
          </button>

        </div>
      </form>
    </main>
  );
}


/* =========================================================
   FORM FIELD
========================================================= */

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
}: {
  student: Student;
  payment?: Payment;
  onBack: () => void;
  onDelete: (studentId: string) => void;
}) {
  return (
    <main className="content-area">

      <PageHeading
        icon={<UserRound size={42} />}
        title="Student Details"
        subtitle="View complete student information."
      />

      <div className="student-details">

        <div className="profile-section">

          <div className="profile-picture">
            <img
              src={student.image}
              alt={`${student.firstName} ${student.lastName}`}
              loading="lazy"
              decoding="async"
              onError={(event) => {
                event.currentTarget.src =
                  "/icons.svg";
              }}
            />
          </div>

          <div className="student-info">

            <InfoRow
              label="Student ID"
              value={student.id}
            />

            <InfoRow
              label="Name"
              value={`${student.firstName} ${
                student.middleName
                  ? `${student.middleName} `
                  : ""
              }${student.lastName}`}
            />

            <InfoRow
              label="Grade/Year"
              value={
                student.yearLevel
              }
            />

            <InfoRow
              label="Course"
              value={
                student.course
              }
            />

            <InfoRow
              label="Section"
              value={
                student.section
              }
            />

            <InfoRow
              label="Contact"
              value={
                student.contact
              }
            />

            <InfoRow
              label="Email"
              value={
                student.email
              }
            />

            <InfoRow
              label="Address"
              value={
                student.address
              }
            />
          </div>
        </div>

        <div className="payment-details-card">

          <div className="payment-card-title">
            <WalletCards size={28} />

            <h2>
              Payment Information
            </h2>
          </div>

          <InfoRow
            label="Payment Status"
            value={
              payment?.status ??
              "Unpaid"
            }
            status={
              payment?.status ??
              "Unpaid"
            }
          />

          <InfoRow
            label="Original Amount"
            value={`₱${(
              payment?.originalAmount ??
              500
            ).toLocaleString(
              undefined,
              {
                minimumFractionDigits: 2,
              },
            )}`}
          />

          <InfoRow
            label="Discount"
            value={`${
              payment?.discount ??
              0
            }%`}
          />

          <InfoRow
            label="Amount Paid"
            value={`₱${(
              payment?.amount ??
              0
            ).toLocaleString(
              undefined,
              {
                minimumFractionDigits: 2,
              },
            )}`}
          />

          <InfoRow
            label="Payment Date"
            value={
              payment?.date ?? "-"
            }
          />

          <InfoRow
            label="Reference No."
            value={
              payment?.reference ??
              "-"
            }
          />

          {payment?.promissoryNote && (
            <InfoRow
              label="Promissory Note"
              value={`Requested by ${payment.promissoryRequester}`}
            />
          )}
        </div>

        <div
          style={{
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
          }}
        >
          <button
            className="back-button"
            onClick={onBack}
          >
            <ArrowLeft size={19} />
            Back
          </button>

          <button
            className="back-button"
            type="button"
            onClick={() => {
              const confirmed = window.confirm(
                `Delete ${student.firstName} ${student.lastName}?`,
              );

              if (confirmed) {
                onDelete(student.id);
              }
            }}
          >
            <CircleX size={19} />
            Delete Student
          </button>
        </div>
      </div>
    </main>
  );
}


/* =========================================================
   INFO ROW
========================================================= */

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

      {status ? (
        <StatusBadge
          status={status}
        />
      ) : (
        <strong>{value}</strong>
      )}
    </div>
  );
}


/* =========================================================
   STATUS BADGE
========================================================= */

function StatusBadge({
  status,
}: {
  status: PaymentStatus;
}) {
  return (
    <span
      className={`payment-status ${
        status === "Paid"
          ? "status-paid"
          : "status-unpaid"
      }`}
      aria-label={`Payment status: ${status}`}
    >
      {status}
    </span>
  );
}


/* =========================================================
   SELECT BOX
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

      <select
        value={value}
        onChange={(event) =>
          onChange(
            event.target.value,
          )
        }
      >
        {options.map(
          (option) => (
            <option
              key={option}
            >
              {option}
            </option>
          ),
        )}
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
  const [search, setSearch] =
    useState("");

  const [filter, setFilter] =
    useState("All");

  const rows = useMemo(() => {
    return students
      .map((student) => ({
        student,

        payment:
          payments.find(
            (item) =>
              item.studentId ===
              student.id,
          ) ?? {
            studentId: student.id,
            amount: 0,
            originalAmount: 500,
            discount:
              0 as Discount,
            date: "-",
            status:
              "Unpaid" as const,
            reference: "-",
            promissoryNote:
              false,
          },
      }))
      .filter((row) => {
        return (
          `
            ${row.student.firstName}
            ${row.student.lastName}
            ${row.student.id}
            ${row.payment.reference}
            ${row.student.course}
            ${row.student.yearLevel}
          `
            .toLowerCase()
            .includes(
              search.toLowerCase(),
            ) &&
          (filter === "All" ||
            row.payment.status ===
              filter)
        );
      });
  }, [
    students,
    payments,
    search,
    filter,
  ]);

  return (
    <main className="content-area">

      <PageHeading
        icon={<CreditCard size={42} />}
        title="Payment Information"
        subtitle="View and manage payment records."
      />

      <div className="payment-toolbar">

        <div className="search-box payment-search">
          <Search size={23} />

          <input
            placeholder="Search student or ID..."
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value,
              )
            }
          />
        </div>

        <SelectBox
          value={filter}
          onChange={setFilter}
          options={[
            "All",
            "Paid",
            "Unpaid",
          ]}
        />

        <button
          className="primary-button record-button"
          onClick={onRecord}
        >
          <Plus size={20} />
          Record Payment
        </button>
      </div>

      <div className="table-card payment-table-card">

        <table>

          <thead>
            <tr>
              <th>Student Name</th>
              <th>Student ID</th>
              <th>Course / Year</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>

            {rows.map((row) => (
              <tr
                key={row.student.id}
              >

                <td>
                  {row.student.firstName}{" "}
                  {row.student.lastName}
                </td>

                <td>{row.student.id}</td>

                <td>
                  {row.student.course} • {row.student.yearLevel}
                </td>

                <td>
                  ₱
                  {row.payment.amount.toLocaleString()}
                </td>

                <td>
                  {row.payment.date}
                </td>

                <td>
                  <StatusBadge
                    status={
                      row.payment.status
                    }
                  />
                </td>

                <td>
                  <button
                    className="view-button"
                    onClick={() =>
                      onView(
                        row.student,
                      )
                    }
                  >
                    <Eye size={17} />
                    View
                  </button>
                </td>

              </tr>
            ))}

            {rows.length ===
              0 && (
              <tr>
                <td
                  colSpan={7}
                  style={{
                    textAlign:
                      "center",
                    padding:
                      "25px",
                  }}
                >
                  No payment
                  records found.
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
   PAYMENT RECORDS
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
        icon={<ClipboardList size={40} />}
        title="Payment Records"
        subtitle="View all recorded payment transactions."
      />

      <div className="table-card payment-table-card">

        <table>

          <thead>
            <tr>
              <th>Student Name</th>
              <th>Course / Year</th>
              <th>Reference No.</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Status</th>
              <th>Discount</th>
              <th>Promissory Note</th>
            </tr>
          </thead>

          <tbody>

            {payments.map(
              (payment) => {
                const student =
                  students.find(
                    (item) =>
                      item.id ===
                      payment.studentId,
                  );

                if (!student)
                  return null;

                return (
                  <tr
                    key={
                      payment.studentId
                    }
                  >

                    <td>
                      {student.firstName}{" "}
                      {student.lastName}
                    </td>

                    <td>
                      {student.course} • {student.yearLevel}
                    </td>

                    <td>
                      {
                        payment.reference
                      }
                    </td>

                    <td>
                      ₱
                      {payment.amount.toLocaleString()}
                    </td>

                    <td>
                      {payment.date}
                    </td>

                    <td>
                      <StatusBadge
                        status={
                          payment.status
                        }
                      />
                    </td>

                    <td>
                      {
                        payment.discount
                      }%
                    </td>

                    <td>
                      {payment.promissoryNote
                        ? `Requested by ${payment.promissoryRequester}`
                        : "-"}
                    </td>

                  </tr>
                );
              },
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
  onClose,
  onSave,
}: {
  students: Student[];
  payments: Payment[];
  onClose: () => void;
  onSave: (payment: Payment) => void;
}) {
  const [studentSearch, setStudentSearch] =
    useState("");

  const [studentId, setStudentId] =
    useState("");

  const [studentTouched, setStudentTouched] =
    useState(false);

  const [originalAmount, setOriginalAmount] =
    useState("500");

  const [discount, setDiscount] =
    useState<Discount>(10);

  const [date, setDate] =
    useState("Sept. 16, 2026");

  const [status, setStatus] =
    useState<PaymentStatus>("Paid");

  const [promissoryNote, setPromissoryNote] =
    useState(false);

  const [amountError, setAmountError] =
    useState("");

  const selectedStudent =
    students.find(
      (student) =>
        student.id === studentId,
    );

  const normalizedSearch =
    studentSearch
      .trim()
      .toLowerCase();

  const suggestions =
    normalizedSearch
      ? students
          .filter((student) =>
            `
              ${student.id}
              ${student.firstName}
              ${student.middleName}
              ${student.lastName}
              ${student.course}
              ${student.yearLevel}
            `
              .toLowerCase()
              .includes(
                normalizedSearch,
              ),
          )
          .slice(0, 6)
      : [];

  const studentNotFound =
    studentTouched &&
    normalizedSearch.length > 0 &&
    !selectedStudent &&
    suggestions.length === 0;

  const requester =
    selectedStudent
      ? `${selectedStudent.firstName} ${selectedStudent.lastName}`
      : "";

  useEffect(() => {
    const onKeyDown = (
      event: KeyboardEvent,
    ) => {
      if (
        event.key ===
        "Escape"
      ) {
        onClose();
      }
    };

    window.addEventListener(
      "keydown",
      onKeyDown,
    );

    return () =>
      window.removeEventListener(
        "keydown",
        onKeyDown,
      );
  }, [onClose]);

  const selectStudent = (
    student: Student,
  ) => {
    setStudentId(
      student.id,
    );

    setStudentSearch(
      student.id,
    );

    setStudentTouched(false);
  };

  const handleStudentSearch = (
    value: string,
  ) => {
    setStudentSearch(value);
    setStudentTouched(true);

    const exactMatch = students.find(
      (student) =>
        student.id.toLowerCase() === value.trim().toLowerCase(),
    );

    if (exactMatch) {
      setStudentId(exactMatch.id);
      setStudentTouched(false);
      return;
    }

    setStudentId("");
  };

  const amount = Math.max(
    0,
    Number(originalAmount) *
      (1 -
        discount / 100),
  );

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
      } while (payments.some((payment) => payment.reference === reference));
    }

    onSave({
      studentId:
        selectedStudent.id,

      amount,

      originalAmount:
        Number(
          originalAmount,
        ) || 0,

      discount,

      date:
        status === "Paid"
          ? date || "-"
          : "-",

      status,

      reference,

      promissoryNote,

      promissoryRequester:
        promissoryNote
          ? requester ||
            "Administrator"
          : undefined,
    });
  };

  return (
    <div className="modal-overlay">

      <div className="payment-modal">

        <div className="modal-header">

          <div>

            <h2>
              Record Payment
            </h2>

            <p>
              enter payment,
              discount, or
              promissory note
              details.
            </p>

          </div>

          <button
            aria-label="Close"
            onClick={onClose}
          >
            <X size={24} />
          </button>
        </div>

        <label className="student-picker-label">

          Student ID

          <div
            className={`student-picker ${
              studentNotFound
                ? "student-picker-error"
                : ""
            }`}
          >

            {selectedStudent && (
              <div className="selected-student-chip">

                <img
                  src={
                    selectedStudent.image
                  }
                  alt=""
                  onError={(
                    event,
                  ) => {
                    event.currentTarget.src =
                      "/icons.svg";
                  }}
                />

                <span>

                  {selectedStudent.firstName}{" "}
                  {selectedStudent.lastName}

                  <small>
                    {
                      selectedStudent.id
                    }{" "}
                    •{" "}
                    {
                      selectedStudent.course
                    }
                  </small>

                </span>

                <button
                  type="button"
                  aria-label="Remove selected student"
                  onClick={() => {
                    setStudentId("");
                    setStudentSearch("");
                    setStudentTouched(
                      false,
                    );
                  }}
                >
                  <X size={14} />
                </button>
              </div>
            )}

            <input
              value={
                selectedStudent
                  ? ""
                  : studentSearch
              }
              placeholder={
                selectedStudent
                  ? "Student selected"
                  : "Type student ID (e.g. 2026-001)"
              }
              onChange={(event) =>
                handleStudentSearch(
                  event.target.value,
                )
              }
              onFocus={() =>
                setStudentTouched(
                  true,
                )
              }
              onKeyDown={(event) => {
                if (event.key === "Enter" && suggestions[0]) {
                  event.preventDefault();
                  selectStudent(suggestions[0]);
                }
              }}
              autoComplete="off"
            />
          </div>

          {suggestions.length >
            0 &&
            !selectedStudent && (
              <div className="student-suggestions">

                {suggestions.map(
                  (student) => (
                    <button
                      type="button"
                      className="student-suggestion"
                      key={
                        student.id
                      }
                      onMouseDown={(
                        event,
                      ) =>
                        event.preventDefault()
                      }
                      onClick={() =>
                        selectStudent(
                          student,
                        )
                      }
                    >

                      <img
                        src={
                          student.image
                        }
                        alt=""
                        onError={(
                          event,
                        ) => {
                          event.currentTarget.src =
                            "/icons.svg";
                        }}
                      />

                      <span>

                        <strong>
                          {
                            student.firstName
                          }{" "}
                          {
                            student.middleName
                              ? `${student.middleName} `
                              : ""
                          }
                          {
                            student.lastName
                          }
                        </strong>

                        <small>
                          {student.id}{" "}
                          •{" "}
                          {student.yearLevel}{" "}
                          •{" "}
                          {student.course}{" "}
                          •{" "}
                          {student.section}
                        </small>

                      </span>

                    </button>
                  ),
                )}

              </div>
            )}

          {studentNotFound && (
            <div className="student-not-found">

              <CircleX size={17} />

              <span>

                <strong>
                  Student not found.
                </strong>

                <small>
                  Please check the
                  student ID and try
                  again.
                </small>

              </span>

            </div>
          )}

        </label>

        <label>
          Original Amount

          <input
            type="number"
            min="0"
            step="0.01"
            value={
              originalAmount
            }
            onChange={(event) => {
              setAmountError("");
              setOriginalAmount(event.target.value);
            }}
          />
          {amountError && (
            <small className="field-error">{amountError}</small>
          )}
        </label>

        <label>
          Discount

          <SelectBox
            value={`${discount}%`}
            onChange={(value) =>
              setDiscount(
                Number(
                  value.replace(
                    "%",
                    "",
                  ),
                ) as Discount,
              )
            }
            options={discountOptions.map(
              (value) =>
                `${value}%`,
            )}
          />
        </label>

        <div className="calculation-card">

          <span>
            <CircleDollarSign
              size={18}
            />
            total after discount
          </span>

          <small>
            original: ₱
            {Number(
              originalAmount ||
                0,
            ).toLocaleString(
              undefined,
              {
                minimumFractionDigits: 2,
              },
            )}
          </small>

          <strong>
            ₱
            {amount.toLocaleString(
              undefined,
              {
                minimumFractionDigits: 2,
              },
            )}
          </strong>

          <small>
            {discount}%
            discount = ₱
            {(
              (Number(
                originalAmount ||
                  0,
              ) *
                discount) /
              100
            ).toLocaleString(
              undefined,
              {
                minimumFractionDigits: 2,
              },
            )}{" "}
            deducted
          </small>

        </div>

        <label>
          Status

          <select
            value={status}
            onChange={(event) =>
              setStatus(
                event.target
                  .value as PaymentStatus,
              )
            }
          >
            <option>
              Paid
            </option>

            <option>
              Unpaid
            </option>
          </select>
        </label>

        {status === "Paid" && (
          <label>
            Payment Date

            <input
              value={date}
              onChange={(event) =>
                setDate(
                  event.target.value,
                )
              }
            />
          </label>
        )}

        <label className="check-row">

          <input
            type="checkbox"
            checked={
              promissoryNote
            }
            onChange={(event) =>
              setPromissoryNote(
                event.target.checked,
              )
            }
          />

          <span>
            Promissory Note
            requested
          </span>

        </label>

        {promissoryNote && (
          <div className="requester-note">

            <FileText size={19} />

            <span>
              requested by
              selected student
            </span>

            <strong>
              {requester ||
                "selected student"}
            </strong>

          </div>
        )}

        <div className="modal-actions">

          <button
            className="cancel-button"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            className="primary-button"
            onClick={save}
            disabled={
              !selectedStudent
            }
          >
            <Save size={18} />
            Save Payment
          </button>

        </div>
      </div>
    </div>
  );
}


/* =========================================================
   SETTINGS
========================================================= */

function SettingsPage({
  onLogout,
}: {
  onLogout: () => void;
}) {
  return (
    <main className="content-area">

      <PageHeading
        icon={<Settings size={40} />}
        title="Settings"
        subtitle="Manage your system settings."
      />

      <div className="settings-card">

        <h2>
          Administrator Account
        </h2>

        <p>
          logged in as
          Administrator. use
          this area to end the
          current admin session.
        </p>

        <button
          className="cancel-button logout-button"
          onClick={onLogout}
        >
          Log Out
        </button>

      </div>
    </main>
  );
}


/* =========================================================
   ABOUT
========================================================= */

function AboutPage() {
  return (
    <main className="content-area">

      <PageHeading
        icon={<Home size={40} />}
        title="About SDPMS"
        subtitle="CCDI Sorsogon Student Directory & Payment Management System"
      />

      <div className="about-card">

        <FileText size={35} />

        <h2>
          purpose of the web app
        </h2>

        <p>
          SDPMS is designed for
          school administrators
          to organize student
          information and manage
          payment records in one
          place. it provides a
          student directory,
          profile pictures,
          payment tracking,
          discounts, payment
          history, and
          promissory-note
          requests so records
          are easier to view and
          update.
        </p>

        <div className="about-points">

          <span>
            <UsersRound size={20} />
            student information
          </span>

          <span>
            <CreditCard size={20} />
            payment tracking
          </span>

          <span>
            <Percent size={20} />
            10%–100% discounts
          </span>

          <span>
            <FileText size={20} />
            promissory notes
          </span>

        </div>
      </div>
    </main>
  );
}

export default App;