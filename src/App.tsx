import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
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
  GraduationCap,
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
type Discount = 0 | 10 | 20 | 30 | 40 | 50 | 60 | 70 | 80 | 90 | 100;

type Student = {
  id: string;
  firstName: string;
  middleName: string;
  lastName: string;
  grade: string;
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

type NewStudent = Omit<Student, "image"> & { image: string };

const initialStudents: Student[] = [
  { id: "2026-001", firstName: "Juan", middleName: "Dela", lastName: "Cruz", grade: "12", section: "GAS-A", contact: "09XXXXXXXXX", email: "juan@email.com", address: "Sorsogon City", image: "/juan-dela-cruz.png" },
  { id: "2026-002", firstName: "Maria", middleName: "", lastName: "Santos", grade: "12", section: "GAS-A", contact: "09XXXXXXXXX", email: "maria@email.com", address: "Sorsogon City", image: "/maria-santos.png" },
  { id: "2026-003", firstName: "Ana", middleName: "", lastName: "Reyes", grade: "11", section: "STEM-A", contact: "09XXXXXXXXX", email: "ana@email.com", address: "Sorsogon City", image: "/ana-reyes.png" },
  { id: "2026-004", firstName: "Pedro", middleName: "", lastName: "Lim", grade: "12", section: "GAS-B", contact: "09XXXXXXXXX", email: "pedro@email.com", address: "Sorsogon City", image: "/pedro-lim.png" },
  { id: "2026-005", firstName: "Carla", middleName: "", lastName: "Mendoza", grade: "11", section: "HUMSS-A", contact: "09XXXXXXXXX", email: "carla@email.com", address: "Sorsogon City", image: "/carla-mendoza.png" },
];

const initialPayments: Payment[] = [
  { studentId: "2026-001", amount: 500, originalAmount: 500, discount: 0, date: "Sept. 10, 2026", status: "Paid", reference: "PAY-0001", promissoryNote: false },
  { studentId: "2026-002", amount: 0, originalAmount: 500, discount: 0, date: "-", status: "Unpaid", reference: "-", promissoryNote: false },
  { studentId: "2026-003", amount: 500, originalAmount: 500, discount: 0, date: "Sept. 12, 2026", status: "Paid", reference: "PAY-0002", promissoryNote: false },
  { studentId: "2026-004", amount: 0, originalAmount: 500, discount: 0, date: "-", status: "Unpaid", reference: "-", promissoryNote: false },
  { studentId: "2026-005", amount: 500, originalAmount: 500, discount: 0, date: "Sept. 14, 2026", status: "Paid", reference: "PAY-0003", promissoryNote: false },
];

const discountOptions: Discount[] = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [payments, setPayments] = useState<Payment[]>(initialPayments);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [showRecordPayment, setShowRecordPayment] = useState(false);

  const openPage = (page: string) => {
    setCurrentPage(page);
    setSidebarOpen(false);
    setSelectedStudent(null);
    setShowAddStudent(false);
    setShowRecordPayment(false);
  };

  const handleLogin = () => {
    setLoggedIn(true);
    setSidebarOpen(false);
    setCurrentPage("dashboard");
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setSidebarOpen(false);
  };

  const addStudent = (student: NewStudent) => {
    setStudents((prev) => [...prev, student]);
    setShowAddStudent(false);
    setCurrentPage("student-directory");
  };

  const savePayment = (payment: Payment) => {
    setPayments((prev) => {
      const existing = prev.find((item) => item.studentId === payment.studentId);
      if (existing) return prev.map((item) => item.studentId === payment.studentId ? payment : item);
      return [...prev, payment];
    });
    setShowRecordPayment(false);
  };

  if (!loggedIn) return <LoginPage onLogin={handleLogin} />;

  return (
    <div className="app">
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`} aria-hidden={!sidebarOpen} data-sidebar-state={sidebarOpen ? "open" : "closed"}>
        <div className="sidebar-header">
          <div className="logo-box"><GraduationCap size={39} strokeWidth={1.7} /></div>
          <span className="logo-text">SDPMS</span>
          <button className="close-sidebar" aria-label="Close sidebar" title="Close sidebar" onClick={() => setSidebarOpen(false)}><X size={24} /></button>
        </div>

        <nav className="sidebar-menu">
          <MenuButton icon={<Home />} label="Dashboard" active={currentPage === "dashboard"} onClick={() => openPage("dashboard")} />
          <MenuButton icon={<UserRound />} label="Student Directory" active={currentPage === "student-directory" || currentPage === "student-details" || currentPage === "add-student"} onClick={() => openPage("student-directory")} />
          <MenuButton icon={<CreditCard />} label="Payment Information" active={currentPage === "payment-information"} onClick={() => openPage("payment-information")} />
          <MenuButton icon={<ClipboardList />} label="Payment Records" active={currentPage === "payment-records"} onClick={() => openPage("payment-records")} />
          <MenuButton icon={<Settings />} label="Settings" active={currentPage === "settings"} onClick={() => openPage("settings")} />
          <MenuButton icon={<FileText />} label="About" active={currentPage === "about"} onClick={() => openPage("about")} />
        </nav>
      </aside>

      {sidebarOpen && <div className="sidebar-overlay" role="button" tabIndex={0} aria-label="Close navigation" onClick={() => setSidebarOpen(false)} onKeyDown={(event) => { if (event.key === "Escape" || event.key === "Enter") setSidebarOpen(false); }} />}

      <div className="main-wrapper">
        <header className="topbar">
          <button className="hamburger" aria-label="Open sidebar" onClick={() => setSidebarOpen((open) => !open)}>
            {sidebarOpen ? <X size={27} strokeWidth={1.8} /> : <Menu size={27} strokeWidth={1.8} />}
          </button>
          <div className="topbar-spacer" />
          <div className="admin-account" role="status" aria-label="Administrator account"><UserRound size={23} strokeWidth={1.7} /><span>Welcome, Admin</span><ChevronDown size={17} /></div>
        </header>

        {currentPage === "dashboard" && <Dashboard students={students} payments={payments} />}

        {currentPage === "student-directory" && !showAddStudent && (
          <StudentDirectory students={students} onAdd={() => setShowAddStudent(true)} onView={(student) => { setSelectedStudent(student); setCurrentPage("student-details"); }} />
        )}

        {showAddStudent && (
          <AddStudent onCancel={() => setShowAddStudent(false)} onSave={addStudent} />
        )}

        {currentPage === "student-details" && selectedStudent && (
          <StudentDetails student={selectedStudent} payment={payments.find((payment) => payment.studentId === selectedStudent.id)} onBack={() => setCurrentPage("student-directory")} />
        )}

        {currentPage === "payment-information" && (
          <PaymentInformation students={students} payments={payments} onRecord={() => setShowRecordPayment(true)} onView={(student) => { setSelectedStudent(student); setCurrentPage("student-details"); }} />
        )}

        {currentPage === "payment-records" && <PaymentRecords students={students} payments={payments} />}
        {currentPage === "settings" && <SettingsPage onLogout={handleLogout} />}
        {currentPage === "about" && <AboutPage />}
      </div>

      {showRecordPayment && <RecordPaymentModal students={students} onClose={() => setShowRecordPayment(false)} onSave={savePayment} />}
    </div>
  );
}

function MenuButton({ icon, label, active, onClick }: { icon: React.ReactNode; label: string; active: boolean; onClick: () => void }) {
  return <button className={`menu-item ${active ? "active" : ""}`} onClick={onClick}>{<span className="menu-icon">{icon}</span>}<span>{label}</span></button>;
}

function LoginPage({ onLogin }: { onLogin: () => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="login-page">
      <div className="login-content">
        <div className="login-logo"><GraduationCap size={92} strokeWidth={1.3} /></div>
        <h1 className="login-script">Student Directory &amp;</h1>
        <h2 className="login-main-title">Payment Management System</h2>
        <p className="login-subtitle">Manage Students&nbsp; • &nbsp;Track Payments&nbsp; • &nbsp;Build a Better School</p>
        <form className="login-card" onSubmit={(event) => { event.preventDefault(); onLogin(); }}>
          <div className="login-input"><UserRound size={24} strokeWidth={1.7} /><input aria-label="Username" placeholder="Username" value={username} onChange={(event) => setUsername(event.target.value)} /></div>
          <div className="login-input"><WalletCards size={24} strokeWidth={1.7} /><input aria-label="Password" type="password" placeholder="Password" value={password} onChange={(event) => setPassword(event.target.value)} /></div>
          <button className="login-button" type="submit">Login <span>→</span></button>
        </form>
      </div>
    </div>
  );
}

function PageHeading({ icon, title, subtitle, action }: { icon: React.ReactNode; title: string; subtitle: string; action?: React.ReactNode }) {
  return <div className="page-heading"><div className="heading-icon">{icon}</div><div className="heading-copy"><h1 className="script-title">{title}</h1><p>{subtitle}</p></div>{action && <div className="heading-action">{action}</div>}</div>;
}

function Dashboard({ students, payments }: { students: Student[]; payments: Payment[] }) {
  const paid = payments.filter((payment) => payment.status === "Paid").length;
  const unpaid = students.length - paid;
  const recent = payments.slice(-5).reverse();

  return <main className="content-area">
    <PageHeading icon={<Home size={40} />} title="Good Day, Admin!" subtitle="Here's the summary of the system." />
    <div className="summary-grid" aria-label="Dashboard summary">
      <SummaryCard icon={<UsersRound />} label="Total Students" value={students.length} />
      <SummaryCard icon={<CheckCircle2 />} label="Paid" value={paid} tone="green" />
      <SummaryCard icon={<CircleX />} label="Unpaid" value={unpaid} tone="red" />
    </div>
    <div className="section-title"><CalendarDays size={27} /><h2>Recent Payments</h2><span className="view-all">View All →</span></div>
    <div className="table-card simple-table-card" aria-label="Recent payments"><table><caption className="sr-only">Recent payment transactions</caption><thead><tr><th>Student Name</th><th>Amount</th><th>Date</th><th>Status</th></tr></thead><tbody>
      {recent.map((payment) => { const student = students.find((item) => item.id === payment.studentId); if (!student) return null; return <tr key={payment.studentId}><td>{student.firstName} {student.lastName}</td><td>₱{payment.amount.toLocaleString()}</td><td>{payment.date}</td><td><StatusBadge status={payment.status} /></td></tr>; })}
    </tbody></table></div>
  </main>;
}

function SummaryCard({ icon, label, value, tone }: { icon: React.ReactNode; label: string; value: number; tone?: "green" | "red" }) {
  return <div className={`summary-card ${tone ? `summary-${tone}` : ""}`}><span className="summary-icon">{icon}</span><div><span>{label}</span><strong>{value}</strong></div></div>;
}

function StudentDirectory({ students, onAdd, onView }: { students: Student[]; onAdd: () => void; onView: (student: Student) => void }) {
  const [search, setSearch] = useState("");
  const [grade, setGrade] = useState("All Grades");
  const filtered = students.filter((student) => `${student.firstName} ${student.lastName} ${student.id}`.toLowerCase().includes(search.toLowerCase()) && (grade === "All Grades" || student.grade === grade));

  return <main className="content-area">
    <PageHeading icon={<UsersRound size={42} />} title="Student Directory" subtitle="View and manage student information." action={<button className="primary-button" onClick={onAdd}><Plus size={19} /> Add Student</button>} />
    <div className="directory-toolbar" aria-label="Student directory filters"><div className="search-box"><Search size={23} /><input placeholder="Search student..." value={search} onChange={(event) => setSearch(event.target.value)} /></div><SelectBox value={grade} onChange={setGrade} options={["All Grades", "11", "12"]} /></div>
    <div className="table-card directory-table"><table><thead><tr><th>Student ID</th><th>Name</th><th>Grade/Year</th><th>Section</th><th>Status</th><th>Action</th></tr></thead><tbody>
      {filtered.map((student) => <tr key={student.id}><td>{student.id}</td><td>{student.firstName} {student.lastName}</td><td>{student.grade}</td><td>{student.section}</td><td><StatusBadge status={student.id === "2026-002" || student.id === "2026-004" ? "Unpaid" : "Paid"} /></td><td><button className="view-button" aria-label={`View ${student.firstName} ${student.lastName}`} onClick={() => onView(student)}><Eye size={17} />View</button></td></tr>)}
    </tbody></table></div>
  </main>;
}

function AddStudent({ onCancel, onSave }: { onCancel: () => void; onSave: (student: NewStudent) => void }) {
  const [form, setForm] = useState<Omit<NewStudent, "image">>({ id: "", firstName: "", middleName: "", lastName: "", grade: "", section: "", contact: "", email: "", address: "" });
  const [image, setImage] = useState("");
  const update = (field: keyof typeof form, value: string) => setForm((prev) => ({ ...prev, [field]: value }));
  const handleImage = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return;
    if (file.size > 5 * 1024 * 1024) return;
    const reader = new FileReader();
    reader.onload = () => setImage(String(reader.result));
    reader.readAsDataURL(file);
  };
  const save = (event: FormEvent) => {
    event.preventDefault();
    onSave({ ...form, image: image || "/icons.svg" });
  };

  return <main className="content-area">
    <PageHeading icon={<UserRound size={42} />} title="Add Student" subtitle="Fill in the student information." />
    <form onSubmit={save}>
      <div className="add-form">
        <div className="form-column">
          <FormField label="Student ID: *"><input required value={form.id} placeholder="e.g. 2026-001" onChange={(event) => update("id", event.target.value)} /></FormField>
          <FormField label="First Name: *"><input required value={form.firstName} placeholder="e.g. Juan" onChange={(event) => update("firstName", event.target.value)} /></FormField>
          <FormField label="Middle Name:"><input value={form.middleName} placeholder="e.g. Dela" onChange={(event) => update("middleName", event.target.value)} /></FormField>
          <FormField label="Last Name: *"><input required value={form.lastName} placeholder="e.g. Cruz" onChange={(event) => update("lastName", event.target.value)} /></FormField>
          <FormField label="Grade/Year: *"><select required value={form.grade} onChange={(event) => update("grade", event.target.value)}><option value="">Select Grade/Year</option><option>11</option><option>12</option></select></FormField>
        </div>
        <div className="form-column">
          <FormField label="Section: *"><input required value={form.section} placeholder="e.g. GAS-A" onChange={(event) => update("section", event.target.value)} /></FormField>
          <FormField label="Contact Number: *"><input required value={form.contact} placeholder="e.g. 09XXXXXXXXX" onChange={(event) => update("contact", event.target.value)} /></FormField>
          <FormField label="Email: *"><input required type="email" value={form.email} placeholder="e.g. student@email.com" onChange={(event) => update("email", event.target.value)} /></FormField>
          <FormField label="Address:"><input value={form.address} placeholder="e.g. Sorsogon City" onChange={(event) => update("address", event.target.value)} /></FormField>
          <div className="photo-upload"><label>Profile Picture: <span className="optional">PNG/JPG</span></label><div className="photo-upload-row"><label className="upload-button"><Upload size={18} />Choose Picture<input type="file" accept="image/png,image/jpeg" onChange={handleImage} /></label>{image && <img className="upload-preview" src={image} alt="profile preview" />}</div><small>the selected picture is used for this student's profile. choose a new image when adding another student.</small></div>
        </div>
      </div>
      <div className="form-actions"><button type="button" className="cancel-button" onClick={onCancel}>Cancel</button><button type="submit" className="primary-button"><Save size={18} />Save Student</button></div>
    </form>
  </main>;
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) { return <label>{label}{children}</label>; }

function StudentDetails({ student, payment, onBack }: { student: Student; payment?: Payment; onBack: () => void }) {
  return <main className="content-area">
    <PageHeading icon={<UserRound size={42} />} title="Student Details" subtitle="View complete student information." />
    <div className="student-details"><div className="profile-section"><div className="profile-picture"><img src={student.image} alt={`${student.firstName} ${student.lastName}`} loading="lazy" decoding="async" onError={(event) => { event.currentTarget.src = "/icons.svg"; }} /></div><div className="student-info"><InfoRow label="Student ID" value={student.id} /><InfoRow label="Name" value={`${student.firstName} ${student.middleName ? `${student.middleName} ` : ""}${student.lastName}`} /><InfoRow label="Grade/Year" value={student.grade} /><InfoRow label="Section" value={student.section} /><InfoRow label="Contact" value={student.contact} /><InfoRow label="Email" value={student.email} /><InfoRow label="Address" value={student.address} /></div></div>
      <div className="payment-details-card"><div className="payment-card-title"><WalletCards size={28} /><h2>Payment Information</h2></div><InfoRow label="Payment Status" value={payment?.status ?? "Unpaid"} status={payment?.status ?? "Unpaid"} /><InfoRow label="Original Amount" value={`₱${(payment?.originalAmount ?? 500).toLocaleString(undefined, { minimumFractionDigits: 2 })}`} /><InfoRow label="Discount" value={`${payment?.discount ?? 0}%`} /><InfoRow label="Amount Paid" value={`₱${(payment?.amount ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`} /><InfoRow label="Payment Date" value={payment?.date ?? "-"} /><InfoRow label="Reference No." value={payment?.reference ?? "-"} />{payment?.promissoryNote && <InfoRow label="Promissory Note" value={`Requested by ${payment.promissoryRequester}`} />}</div>
      <button className="back-button" onClick={onBack}><ArrowLeft size={19} />Back</button>
    </div>
  </main>;
}

function InfoRow({ label, value, status }: { label: string; value: string; status?: PaymentStatus }) { return <div className="info-row"><span>{label}</span><b>:</b>{status ? <StatusBadge status={status} /> : <strong>{value}</strong>}</div>; }

function StatusBadge({ status }: { status: PaymentStatus }) { return <span className={`payment-status ${status === "Paid" ? "status-paid" : "status-unpaid"}`} aria-label={`Payment status: ${status}`}>{status}</span>; }

function SelectBox({ value, onChange, options }: { value: string; onChange: (value: string) => void; options: string[] }) { return <div className="select-box"><select value={value} onChange={(event) => onChange(event.target.value)}>{options.map((option) => <option key={option}>{option}</option>)}</select><ChevronDown size={18} /></div>; }

function PaymentInformation({ students, payments, onRecord, onView }: { students: Student[]; payments: Payment[]; onRecord: () => void; onView: (student: Student) => void }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const rows = useMemo(() => students.map((student) => ({ student, payment: payments.find((item) => item.studentId === student.id) ?? { studentId: student.id, amount: 0, originalAmount: 500, discount: 0 as Discount, date: "-", status: "Unpaid" as const, reference: "-", promissoryNote: false } })).filter((row) => `${row.student.firstName} ${row.student.lastName} ${row.student.id} ${row.payment.reference}`.toLowerCase().includes(search.toLowerCase()) && (filter === "All" || row.payment.status === filter)), [students, payments, search, filter]);
  return <main className="content-area">
    <PageHeading icon={<CreditCard size={42} />} title="Payment Information" subtitle="View and manage payment records." />
    <div className="payment-toolbar"><div className="search-box payment-search"><Search size={23} /><input placeholder="Search student or ID..." value={search} onChange={(event) => setSearch(event.target.value)} /></div><SelectBox value={filter} onChange={setFilter} options={["All", "Paid", "Unpaid"]} /><button className="primary-button record-button" onClick={onRecord}><Plus size={20} />Record Payment</button></div>
    <div className="table-card payment-table-card"><table><thead><tr><th>Student Name</th><th>Amount</th><th>Date</th><th>Status</th><th>Action</th></tr></thead><tbody>{rows.map((row) => <tr key={row.student.id}><td>{row.student.firstName} {row.student.lastName}</td><td>₱{row.payment.amount.toLocaleString()}</td><td>{row.payment.date}</td><td><StatusBadge status={row.payment.status} /></td><td><button className="view-button" onClick={() => onView(row.student)}><Eye size={17} />View</button></td></tr>)}</tbody></table></div>
  </main>;
}

function PaymentRecords({ students, payments }: { students: Student[]; payments: Payment[] }) {
  return <main className="content-area"><PageHeading icon={<ClipboardList size={40} />} title="Payment Records" subtitle="View all recorded payment transactions." /><div className="table-card payment-table-card"><table><thead><tr><th>Student Name</th><th>Reference No.</th><th>Amount</th><th>Date</th><th>Status</th><th>Discount</th><th>Promissory Note</th></tr></thead><tbody>{payments.map((payment) => { const student = students.find((item) => item.id === payment.studentId); if (!student) return null; return <tr key={payment.studentId}><td>{student.firstName} {student.lastName}</td><td>{payment.reference}</td><td>₱{payment.amount.toLocaleString()}</td><td>{payment.date}</td><td><StatusBadge status={payment.status} /></td><td>{payment.discount}%</td><td>{payment.promissoryNote ? `Requested by ${payment.promissoryRequester}` : "-"}</td></tr>; })}</tbody></table></div></main>;
}

function RecordPaymentModal({ students, onClose, onSave }: { students: Student[]; onClose: () => void; onSave: (payment: Payment) => void }) {
  const [studentId, setStudentId] = useState(students[0]?.id ?? "");
  const [originalAmount, setOriginalAmount] = useState("500");
  const [discount, setDiscount] = useState<Discount>(10);
  const [date, setDate] = useState("Sept. 16, 2026");
  const [status, setStatus] = useState<PaymentStatus>("Paid");
  const [promissoryNote, setPromissoryNote] = useState(false);
  const selectedStudent = students.find((student) => student.id === studentId);
  const requester = selectedStudent ? `${selectedStudent.firstName} ${selectedStudent.lastName}` : "";
  useEffect(() => { const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); }; window.addEventListener("keydown", onKeyDown); return () => window.removeEventListener("keydown", onKeyDown); }, [onClose]);
  const amount = Math.max(0, Number(originalAmount) * (1 - discount / 100));
  const save = () => {
    const reference = status === "Paid" ? `PAY-${Math.floor(1000 + Math.random() * 9000)}` : "-";
    onSave({ studentId, amount, originalAmount: Number(originalAmount) || 0, discount, date: status === "Paid" ? date || "-" : "-", status, reference, promissoryNote, promissoryRequester: promissoryNote ? requester || "Administrator" : undefined });
  };
  return <div className="modal-overlay"><div className="payment-modal"><div className="modal-header"><div><h2>Record Payment</h2><p>enter payment, discount, or promissory note details.</p></div><button aria-label="Close" onClick={onClose}><X size={24} /></button></div>
    <label>Student<select value={studentId} onChange={(event) => setStudentId(event.target.value)}>{students.map((student) => <option key={student.id} value={student.id}>{student.firstName} {student.lastName} — {student.id}</option>)}</select></label>
    <label>Original Amount<input type="number" min="0" step="0.01" value={originalAmount} onChange={(event) => setOriginalAmount(event.target.value)} /></label>
    <label>Discount<SelectBox value={`${discount}%`} onChange={(value) => setDiscount(Number(value.replace("%", "")) as Discount)} options={discountOptions.map((value) => `${value}%`)} /></label>
    <div className="calculation-card"><span><CircleDollarSign size={18} />total after discount</span><small>original: ₱{Number(originalAmount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</small><strong>₱{amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong><small>{discount}% discount = ₱{(Number(originalAmount || 0) * discount / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })} deducted</small></div>
    <label>Status<select value={status} onChange={(event) => setStatus(event.target.value as PaymentStatus)}><option>Paid</option><option>Unpaid</option></select></label>
    {status === "Paid" && <label>Payment Date<input value={date} onChange={(event) => setDate(event.target.value)} /></label>}
    <label className="check-row"><input type="checkbox" checked={promissoryNote} onChange={(event) => setPromissoryNote(event.target.checked)} /><span>Promissory Note requested</span></label>
    {promissoryNote && <div className="requester-note"><FileText size={19} /><span>requested by selected student</span><strong>{requester || "selected student"}</strong></div>}
    <div className="modal-actions"><button className="cancel-button" onClick={onClose}>Cancel</button><button className="primary-button" onClick={save}><Save size={18} />Save Payment</button></div>
  </div></div>;
}

function SettingsPage({ onLogout }: { onLogout: () => void }) { return <main className="content-area"><PageHeading icon={<Settings size={40} />} title="Settings" subtitle="Manage your system settings." /><div className="settings-card"><h2>Administrator Account</h2><p>logged in as Administrator. use this area to end the current admin session.</p><button className="cancel-button logout-button" onClick={onLogout}>Log Out</button></div></main>; }

function AboutPage() { return <main className="content-area"><PageHeading icon={<GraduationCap size={40} />} title="About SDPMS" subtitle="Student Directory & Payment Management System" /><div className="about-card"><FileText size={35} /><h2>purpose of the web app</h2><p>SDPMS is designed for school administrators to organize student information and manage payment records in one place. it provides a student directory, profile pictures, payment tracking, discounts, payment history, and promissory-note requests so records are easier to view and update.</p><div className="about-points"><span><UsersRound size={20} />student information</span><span><CreditCard size={20} />payment tracking</span><span><Percent size={20} />10%–100% discounts</span><span><FileText size={20} />promissory notes</span></div></div></main>; }

export default App;
