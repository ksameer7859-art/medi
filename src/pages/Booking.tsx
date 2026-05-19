import { motion, AnimatePresence } from "motion/react";
import { Calendar as CalIcon, Clock, ChevronRight, ChevronLeft, User, Star, MapPin, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { cn } from "../lib/utils.ts";

const specialists = [
  { id: 1, name: "Dr. Sarah Mitchell", specialty: "Radiologist", rating: 4.9, experience: "12 Yrs", location: "Mumbai, IN", price: "$40" },
  { id: 2, name: "Dr. James Wilson", specialty: "General Physician", rating: 4.8, experience: "8 Yrs", location: "Bangalore, IN", price: "$25" },
  { id: 3, name: "Dr. Aisha Khan", specialty: "Neurologist", rating: 5.0, experience: "15 Yrs", location: "Delhi, IN", price: "$60" },
  { id: 4, name: "Dr. Robert Chen", specialty: "Orthopedic", rating: 4.7, experience: "10 Yrs", location: "Chennai, IN", price: "$35" },
];

const timeSlots = ["09:00 AM", "10:30 AM", "11:45 AM", "02:00 PM", "03:30 PM", "05:00 PM", "07:15 PM"];

export default function Booking() {
  const [step, setStep] = useState(1);
  const [selectedSpecialist, setSelectedSpecialist] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const days = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d;
  });

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <section className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Book a <span className="text-cyan-400">Consultation</span></h1>
          <p className="text-slate-400 text-sm mt-1">Connect with verified specialists globally.</p>
        </div>
        <div className="flex items-center gap-2">
           {[1, 2, 3].map(s => (
             <div key={s} className={cn(
               "w-3 h-3 rounded-full transition-all duration-500",
               step >= s ? "bg-cyan-500 shadow-[0_0_8px_#06b6d4]" : "bg-white/10"
             )}></div>
           ))}
        </div>
      </section>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div 
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {specialists.map((doc) => (
              <motion.div 
                key={doc.id}
                whileHover={{ y: -5 }}
                onClick={() => { setSelectedSpecialist(doc); nextStep(); }}
                className={cn(
                  "glow-card p-6 cursor-pointer border group",
                  selectedSpecialist?.id === doc.id ? "border-cyan-500/50 bg-cyan-500/5" : "border-white/10"
                )}
              >
                <div className="flex gap-4">
                   <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center border border-white/10 overflow-hidden shrink-0">
                      <User size={30} className="text-slate-600" />
                   </div>
                   <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className="font-bold text-lg group-hover:text-cyan-400 transition-colors">{doc.name}</h3>
                        <div className="flex items-center gap-1 text-amber-400">
                          <Star size={14} fill="currentColor" />
                          <span className="text-xs font-bold">{doc.rating}</span>
                        </div>
                      </div>
                      <p className="text-cyan-400/80 text-xs font-medium">{doc.specialty}</p>
                      
                      <div className="flex items-center gap-3 mt-3 text-[10px] text-slate-500 font-medium">
                        <div className="flex items-center gap-1"><MapPin size={12} /> {doc.location}</div>
                        <div className="flex items-center gap-1">• {doc.experience}</div>
                        <div className="flex items-center gap-1">• {doc.price}/Call</div>
                      </div>
                   </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {step === 2 && (
          <motion.div 
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <div className="flex items-center gap-4">
              <button onClick={prevStep} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors">
                <ChevronLeft size={20} />
              </button>
              <h2 className="text-xl font-bold">Select Date & Time</h2>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-slate-400 mb-4 px-2">Availability Schedule</h3>
                <div className="flex gap-3 overflow-x-auto pb-4 custom-scrollbar">
                  {days.map((date, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setSelectedDate(idx)}
                      className={cn(
                        "flex flex-col items-center gap-1 min-w-[70px] p-4 rounded-2xl border transition-all duration-300",
                        selectedDate === idx ? "bg-cyan-500 border-cyan-400 text-black shadow-lg shadow-cyan-500/20" : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10"
                      )}
                    >
                      <span className="text-[10px] font-bold uppercase tracking-wider">{date.toLocaleDateString('en', { weekday: 'short' })}</span>
                      <span className="text-lg font-black">{date.getDate()}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-400 mb-4 px-2">Preferred Slots</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
                   {timeSlots.map((slot) => (
                      <button 
                        key={slot}
                        onClick={() => setSelectedSlot(slot)}
                        className={cn(
                          "py-3 rounded-xl border text-xs font-bold transition-all duration-300 flex items-center justify-center gap-2",
                          selectedSlot === slot ? "bg-white/10 border-cyan-500 text-cyan-400" : "bg-white/5 border-white/10 text-slate-500 hover:border-white/20"
                        )}
                      >
                        <Clock size={14} />
                        {slot}
                      </button>
                   ))}
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-white/10 flex justify-end">
              <button 
                onClick={nextStep}
                disabled={selectedDate === null || !selectedSlot}
                className="btn-primary disabled:opacity-50 flex items-center gap-2 group"
              >
                Continue to Payment
                <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div 
            key="step3"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glow-card p-12 text-center space-y-6 max-w-xl mx-auto"
          >
            <div className="w-24 h-24 rounded-full bg-cyan-500/20 border-2 border-cyan-500/50 flex items-center justify-center mx-auto mb-4 relative">
              <CheckCircle2 size={48} className="text-cyan-400" />
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1.5, opacity: 0 }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute inset-0 rounded-full border border-cyan-500"
              />
            </div>
            <h2 className="text-3xl font-bold">Booking Confirmed!</h2>
            <p className="text-slate-400">
               Your consultation with <span className="text-white font-bold">{selectedSpecialist?.name}</span> is scheduled for 
               <br />
               <span className="text-cyan-400 font-bold">
                 {days[selectedDate || 0].toLocaleDateString('en', { month: 'long', day: 'numeric' })} at {selectedSlot}
               </span>
            </p>
            <div className="pt-6 flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => setStep(1)}
                className="px-6 py-2.5 rounded-xl border border-white/10 text-sm font-bold hover:bg-white/5 transition-all"
              >
                Back to Dashboard
              </button>
              <button className="btn-primary">
                Add to Calendar
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
