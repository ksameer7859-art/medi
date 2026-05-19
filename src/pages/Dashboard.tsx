import { motion, AnimatePresence } from "motion/react";
import { Activity, Heart, Wind, Moon, ChevronRight, Plus, Calendar as CalIcon, ArrowUpRight, FileText, Pill } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAppointments, getPrescriptions } from "../services/api.ts";
import { cn } from "../lib/utils.ts";
import PrescriptionView from "../components/PrescriptionView.tsx";
import { Prescription } from "../types.ts";

const healthData = [
  { time: '00:00', heart: 65, oxygen: 98 },
  { time: '04:00', heart: 62, oxygen: 99 },
  { time: '08:00', heart: 72, oxygen: 98 },
  { time: '12:00', heart: 85, oxygen: 97 },
  { time: '16:00', heart: 78, oxygen: 98 },
  { time: '20:00', heart: 70, oxygen: 98 },
  { time: '23:59', heart: 68, oxygen: 99 },
];

const StatCard = ({ icon: Icon, label, value, unit, trend, colorClass }: any) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="glow-card p-6 flex flex-col gap-4"
  >
    <div className="flex items-start justify-between">
      <div className={cn("p-3 rounded-xl bg-opacity-10", colorClass.replace('text', 'bg'))}>
        <Icon className={colorClass} size={24} />
      </div>
      <div className="flex items-center gap-1 text-xs font-medium text-green-400 bg-green-400/10 px-2 py-1 rounded-full">
        <ArrowUpRight size={12} />
        {trend}
      </div>
    </div>
    <div>
      <p className="text-slate-400 text-sm font-medium">{label}</p>
      <div className="flex items-baseline gap-1 mt-1">
        <h3 className="text-2xl font-bold">{value}</h3>
        <span className="text-slate-500 text-xs">{unit}</span>
      </div>
    </div>
  </motion.div>
);

export default function Dashboard() {
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [selectedRx, setSelectedRx] = useState<Prescription | null>(null);

  useEffect(() => {
    getAppointments().then(setAppointments);
    getPrescriptions().then(setPrescriptions);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-10"
    >
      <AnimatePresence>
        {selectedRx && (
          <PrescriptionView 
            prescription={selectedRx} 
            onClose={() => setSelectedRx(null)} 
          />
        )}
      </AnimatePresence>

      {/* Header */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-2">
            Welcome back, <span className="text-cyan-400 glow-cyan">Sameer</span>
          </h1>
          <p className="text-slate-400">Your health parameters are looking stable today. 2 upcoming consultations.</p>
        </div>
        <Link to="/xray" className="btn-primary group flex items-center gap-2">
          <Plus size={18} />
          <span>Upload New Report</span>
        </Link>
      </section>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={Heart} label="Heart Rate" value="72" unit="BPM" trend="+2%" colorClass="text-rose-400" />
        <StatCard icon={Wind} label="Oxygen Level" value="98" unit="%" trend="0%" colorClass="text-cyan-400" />
        <StatCard icon={Activity} label="Blood Pressure" value="120/80" unit="mmHg" trend="-1%" colorClass="text-blue-400" />
        <StatCard icon={Moon} label="Sleep Quality" value="7.4" unit="Hrs" trend="+12%" colorClass="text-indigo-400" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Activity Chart */}
        <div className="lg:col-span-2 glow-card p-6">
           <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-bold">Health Activity</h3>
              <div className="flex gap-4">
                <div className="flex items-center gap-2 text-xs">
                  <span className="w-3 h-3 rounded-full bg-cyan-400"></span>
                  <span className="text-slate-400">Heart Rate</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                  <span className="text-slate-400">Oxygen</span>
                </div>
              </div>
           </div>
           <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={healthData}>
                <defs>
                  <linearGradient id="colorHeart" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff10" />
                <XAxis dataKey="time" stroke="#ffffff40" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#ffffff40" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} 
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="heart" stroke="#22d3ee" fillOpacity={1} fill="url(#colorHeart)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
           </div>
        </div>

        {/* Sidebar content */}
        <div className="space-y-8">
          {/* Recent Prescriptions */}
          <div className="glow-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold">Recent prescriptions</h3>
              <div className="text-cyan-400 text-[10px] font-bold uppercase tracking-widest">Secured</div>
            </div>
            <div className="space-y-4">
              {prescriptions.map((rx) => (
                <div key={rx.id} className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-cyan-500/30 transition-all group">
                   <div className="flex justify-between items-start mb-3">
                      <div className="flex gap-3">
                        <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
                          <Pill size={18} />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-200">{rx.doctorName}</p>
                          <p className="text-[10px] text-slate-500">{rx.date}</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono text-slate-600 font-bold">#{rx.id}</span>
                   </div>
                   <button 
                    onClick={() => setSelectedRx(rx)}
                    className="w-full py-2 rounded-lg bg-white/5 border border-white/10 text-[10px] font-bold hover:bg-cyan-500 hover:text-black transition-all flex items-center justify-center gap-2"
                   >
                     <FileText size={14} />
                     View Medicine PDF (For Pharmacy)
                   </button>
                </div>
              ))}
              {prescriptions.length === 0 && <p className="text-center py-4 text-slate-500 text-sm">No prescriptions found</p>}
            </div>
          </div>

          {/* Upcoming Appointments */}
          <div className="glow-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold">Appointments</h3>
              <Link to="/booking" className="text-cyan-400 text-xs font-semibold hover:underline">View All</Link>
            </div>
            <div className="space-y-4">
              {appointments.slice(0, 1).map((apt: any) => (
                <div key={apt.id} className="flex gap-4 p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                  <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-cyan-400 border border-cyan-500/20">
                    <CalIcon size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold">{apt.doctor}</h4>
                    <p className="text-xs text-slate-500">{apt.specialty} • {apt.time}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 text-[10px] font-bold">
                        {apt.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              {appointments.length === 0 && <p className="text-center py-4 text-slate-500 text-sm">No upcoming visits</p>}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
