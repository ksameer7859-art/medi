import { motion, AnimatePresence } from "motion/react";
import { Users, Activity, AlertCircle, Clock, Search, ChevronRight, FileText, CheckCircle, MoreVertical, TrendingUp, Plus, X, Trash2, Send } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { cn } from "../lib/utils.ts";
import { useState } from "react";
import { createPrescription } from "../services/api.ts";

const patientActivity = [
  { day: 'Mon', count: 12 },
  { day: 'Tue', count: 19 },
  { day: 'Wed', count: 15 },
  { day: 'Thu', count: 22 },
  { day: 'Fri', count: 30 },
  { day: 'Sat', count: 18 },
  { day: 'Sun', count: 10 },
];

const urgentCases = [
  { id: 1, name: "Anita Rao", finding: "Pneumonia suspected", confidence: 94, age: 42, time: "12 mins ago" },
  { id: 2, name: "David Miller", finding: "Fracture L-5 detected", confidence: 88, age: 29, time: "45 mins ago" },
];

const PrescriptionModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [patientName, setPatientName] = useState("");
  const [medicines, setMedicines] = useState([{ name: "", dosage: "", duration: "" }]);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addMedicine = () => setMedicines([...medicines, { name: "", dosage: "", duration: "" }]);
  const removeMedicine = (index: number) => setMedicines(medicines.filter((_, i) => i !== index));
  const updateMedicine = (index: number, field: string, value: string) => {
    const newMedicines = [...medicines];
    newMedicines[index] = { ...newMedicines[index], [field]: value };
    setMedicines(newMedicines);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await createPrescription({
        patientName,
        doctorName: "Dr. Sarah Mitchell",
        medicines: medicines.filter(m => m.name),
        notes
      });
      onClose();
      setPatientName("");
      setMedicines([{ name: "", dosage: "", duration: "" }]);
      setNotes("");
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
            className="relative w-full max-w-2xl bg-[#0a1120] border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
          >
            <div className="p-6 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-cyan-500/10 to-transparent">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <FileText className="text-cyan-400" />
                Digital Prescription
              </h2>
              <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6 text-white">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Patient Name</label>
                <input 
                  required
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="Full Name"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-cyan-500/50 outline-none"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Medicines</label>
                  <button type="button" onClick={addMedicine} className="text-cyan-400 text-xs font-bold flex items-center gap-1 hover:underline">
                    <Plus size={14} /> Add Medicine
                  </button>
                </div>
                
                <div className="space-y-3">
                  {medicines.map((med, idx) => (
                    <div key={idx} className="grid grid-cols-12 gap-3 items-end">
                      <div className="col-span-12 md:col-span-11 grid grid-cols-12 gap-2">
                        <div className="col-span-6">
                          <input 
                            placeholder="Name"
                            value={med.name}
                            onChange={(e) => updateMedicine(idx, 'name', e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs focus:border-cyan-500/50 outline-none"
                          />
                        </div>
                        <div className="col-span-3">
                          <input 
                            placeholder="Dosage"
                            value={med.dosage}
                            onChange={(e) => updateMedicine(idx, 'dosage', e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs focus:border-cyan-500/50 outline-none"
                          />
                        </div>
                        <div className="col-span-3">
                          <input 
                            placeholder="Days"
                            value={med.duration}
                            onChange={(e) => updateMedicine(idx, 'duration', e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs focus:border-cyan-500/50 outline-none"
                          />
                        </div>
                      </div>
                      <div className="col-span-12 md:col-span-1 flex justify-center">
                        <button type="button" onClick={() => removeMedicine(idx)} className="text-rose-500 p-2 hover:bg-rose-500/10 rounded-lg">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Notes</label>
                <textarea 
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Advice..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-cyan-500/50 h-24 resize-none"
                />
              </div>

              <div className="flex gap-4">
                <button type="button" onClick={onClose} className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 text-xs font-bold font-mono">CANCEL</button>
                <button type="submit" disabled={isSubmitting} className="flex-1 btn-primary flex items-center justify-center gap-2 text-xs font-bold">
                  <Send size={16} /> {isSubmitting ? "SIGNING..." : "SIGN & SEND RX"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default function DoctorDashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <PrescriptionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold">Doctor <span className="text-cyan-400">Portal</span></h1>
          <p className="text-slate-400 text-sm italic">Secure gateway for medical professionals.</p>
        </div>
        <div className="flex items-center gap-4 w-auto">
          <button onClick={() => setIsModalOpen(true)} className="btn-primary flex items-center gap-2 group whitespace-nowrap">
            <Plus size={18} className="group-hover:rotate-90 transition-transform" />
            <span>Write Rx</span>
          </button>
          <div className="relative hidden md:block w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input type="text" placeholder="Find patient..." className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs focus:border-cyan-500/50 outline-none" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { icon: Users, label: "Patients", value: "1,280", trend: "+12%", color: "text-blue-400" },
          { icon: Activity, label: "Analysis", value: "4,620", trend: "+24%", color: "text-cyan-400" },
          { icon: AlertCircle, label: "Urgent", value: "02", trend: "Critical", color: "text-red-400" },
          { icon: Clock, label: "Wait", value: "12m", trend: "Avg", color: "text-amber-400" },
        ].map((stat, i) => (
          <div key={i} className="glow-card p-6 border-b-2 border-b-white/5 hover:border-b-cyan-500/50">
            <div className="flex items-center justify-between mb-4">
              <stat.icon className={stat.color} size={20} />
              <span className={cn("text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest bg-white/5", stat.color)}>{stat.trend}</span>
            </div>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">{stat.label}</p>
            <h3 className="text-2xl font-bold mt-1 tracking-tighter">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <AlertCircle className="text-red-400 animate-pulse" size={20} />
            Urgent Patient Queue
          </h3>
          <div className="space-y-4">
            {urgentCases.map((caseItem) => (
              <div key={caseItem.id} className="glow-card p-5 flex items-center justify-between border-l-4 border-red-500/50">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center font-bold">{caseItem.name[0]}</div>
                  <div>
                    <h4 className="text-sm font-bold">{caseItem.name}</h4>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest">{caseItem.finding}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-slate-500 font-bold uppercase">Confidence</p>
                  <p className="text-md font-bold text-red-400">{caseItem.confidence}%</p>
                </div>
                <button className="p-2 hover:bg-cyan-500 hover:text-black rounded-lg transition-all border border-white/5">
                  <ChevronRight size={18} />
                </button>
              </div>
            ))}
          </div>

          <div className="glow-card p-6">
            <h3 className="font-bold mb-6">Patient Traffic Analytics</h3>
            <div className="h-64 w-full">
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={patientActivity}>
                    <Bar dataKey="count" fill="#22d3ee" radius={[4, 4, 0, 0]} />
                    <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '8px', fontSize: '10px' }} />
                 </BarChart>
               </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="space-y-6">
           <div className="glow-card p-6 bg-gradient-to-br from-cyan-900/10 to-transparent">
              <h3 className="font-bold mb-4">Patient Demographics</h3>
              <div className="space-y-5">
                 {[
                   { label: "Cardio", value: 35, color: "bg-blue-400" },
                   { label: "Radiology", value: 48, color: "bg-cyan-400" },
                   { label: "Neuro", value: 17, color: "bg-indigo-400" },
                 ].map((item, idx) => (
                    <div key={idx} className="space-y-1.5">
                       <div className="flex justify-between text-[10px] font-bold">
                          <span className="text-slate-400">{item.label}</span>
                          <span className="text-cyan-400">{item.value}%</span>
                       </div>
                       <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                          <div className={cn("h-full", item.color)} style={{ width: `${item.value}%` }}></div>
                       </div>
                    </div>
                 ))}
              </div>
           </div>

           <div className="glow-card p-6 border-cyan-500/20">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded bg-cyan-500 flex items-center justify-center text-black">
                   <TrendingUp size={16} />
                </div>
                <h3 className="font-bold">System Performance</h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed italic">
                AI diagnosis efficiency has improved by <span className="text-cyan-400 font-bold">14.2%</span> this week due to model quantization updates.
              </p>
           </div>
        </div>
      </div>
    </motion.div>
  );
}
