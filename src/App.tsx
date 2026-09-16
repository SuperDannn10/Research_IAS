import { ChangeEvent, FormEvent, useMemo, useState } from "react";
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

function LoginPage({ onLogin }

function App() { const [loggedIn, setLoggedIn] = useState(false); if (!loggedIn) return <LoginPage onLogin={() => setLoggedIn(true)} />; return <div className="app" />; }

export default App;
