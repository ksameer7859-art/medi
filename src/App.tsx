import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import { LayoutDashboard, FileText, Video, Calendar, User, Bell, Menu, X, PlusCircle, Activity } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "./lib/utils";

// Pages (to be implemented)
import Dashboard from "./pages/Dashboard.tsx";
import XrayAnalysis from "./pages/XrayAnalysis.tsx";
import Consultation from "./pages/Consultation.tsx";
import Booking from "./pages/Booking.tsx";
import DoctorDashboard from "./pages/DoctorDashboard.tsx";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4",
      isScrolled ? "bg-black/40 backdrop-blur-md border-b border-white/10" : "bg-transparent"
    )}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/50 flex items-center justify-center group-hover:shadow-[0_0_15px_rgba(6,182,212,0.5)] transition-all">
            <Activity className="text-cyan-400" size={24} />
          </div>
          <span className="text-xl font-bold tracking-tight glow-cyan">MediVision <span className="text-cyan-400">AI</span></span>
        </Link>
        
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <Link to="/" className="hover:text-cyan-400 transition-colors">Platform</Link>
          <Link to="/xray" className="hover:text-cyan-400 transition-colors">X-ray Analysis</Link>
          <Link to="/consult" className="hover:text-cyan-400 transition-colors">Consultations</Link>
          <Link to="/booking" className="hover:text-cyan-400 transition-colors">Booking</Link>
        </div>

        <div className="flex items-center gap-4">
          <button className="p-2 rounded-full hover:bg-white/5 transition-colors relative">
            <Bell size={20} className="text-slate-400" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-cyan-500 rounded-full border-2 border-[#030712]"></span>
          </button>
          <Link to="/doctor" className="px-4 py-2 rounded-lg border border-cyan-500/30 text-cyan-400 text-xs font-semibold hover:bg-cyan-500/10 transition-all">
            Doctor Portal
          </Link>
          <div className="w-10 h-10 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center overflow-hidden">
             <User size={20} className="text-slate-400" />
          </div>
        </div>
      </div>
    </nav>
  );
};

const Sidebar = () => {
  const location = useLocation();
  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/" },
    { icon: FileText, label: "AI Analysis", path: "/xray" },
    { icon: Video, label: "Consultation", path: "/consult" },
    { icon: Calendar, label: "Appointments", path: "/booking" },
  ];

  return (
    <aside className="fixed left-6 top-32 bottom-8 w-20 flex flex-col items-center py-8 glow-card z-40 hidden lg:flex">
      <div className="flex flex-col gap-8">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link 
              key={item.path} 
              to={item.path}
              className={cn(
                "p-3 rounded-2xl transition-all duration-300 relative group",
                isActive ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30" : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
              )}
            >
              <item.icon size={24} />
              <div className="absolute left-full ml-4 px-3 py-1 bg-black/80 rounded-lg text-xs font-medium opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap border border-white/10">
                {item.label}
              </div>
              {isActive && (
                 <motion.div 
                  layoutId="active-pill"
                  className="absolute -right-2 top-1/2 -translate-y-1/2 w-1 h-8 bg-cyan-500 rounded-full"
                 />
              )}
            </Link>
          );
        })}
      </div>
    </aside>
  );
};

export default function App() {
  return (
    <Router>
      <div className="min-h-screen relative">
        {/* Background Gradients */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-900/20 blur-[120px] rounded-full"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/20 blur-[120px] rounded-full"></div>
        </div>

        <Navbar />
        <Sidebar />

        <main className="lg:pl-32 pt-28 pb-12 px-6 max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/xray" element={<XrayAnalysis />} />
              <Route path="/consult" element={<Consultation />} />
              <Route path="/booking" element={<Booking />} />
              <Route path="/doctor" element={<DoctorDashboard />} />
            </Routes>
          </AnimatePresence>
        </main>
      </div>
    </Router>
  );
}
