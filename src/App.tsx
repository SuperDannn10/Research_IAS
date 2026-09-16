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

function MenuButton({ icon, label, active, onClick }

function LoginPage({ onLogin }

function PageHeading({ icon, title, subtitle, action }

function App(){ const [loggedIn,setLoggedIn]=useState(false); const [sidebarOpen,setSidebarOpen]=useState(false); if(!loggedIn)return <LoginPage onLogin={()=>setLoggedIn(true)}/>; return <div className="app"><aside className={`sidebar ${sidebarOpen?"open":""}`}><div className="sidebar-header"><GraduationCap size={39}/><span className="logo-text">SDPMS</span></div><nav className="sidebar-menu"><MenuButton icon={<Home/>} label="Dashboard" active={true} onClick={()=>{}}/><MenuButton icon={<UserRound/>} label="Student Directory" active={false} onClick={()=>{}}/><MenuButton icon={<CreditCard/>} label="Payment Information" active={false} onClick={()=>{}}/><MenuButton icon={<ClipboardList/>} label="Payment Records" active={false} onClick={()=>{}}/><MenuButton icon={<Settings/>} label="Settings" active={false} onClick={()=>{}}/></nav></aside><div className="main-wrapper"><header className="topbar"><button className="hamburger" aria-label="Open sidebar" onClick={()=>setSidebarOpen(v=>!v)}>{sidebarOpen?<X/>:<Menu/>}</button></header><main className="content-area"><PageHeading icon={<Home size={40}/>} title="Good Day, Admin!" subtitle="Here's the summary of the system." /></main></div></div>; }
export default App;
