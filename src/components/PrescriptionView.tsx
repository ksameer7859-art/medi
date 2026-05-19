import { motion } from "motion/react";
import { X, Printer, Download, Pill, Calendar, User, FileText, CheckCircle2, ShieldCheck, Activity } from "lucide-react";
import { Prescription } from "../types.ts";
import { cn } from "../lib/utils.ts";

interface PrescriptionViewProps {
  prescription: Prescription;
  onClose: () => void;
}

export default function PrescriptionView({ prescription, onClose }: PrescriptionViewProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/90 backdrop-blur-md"
      />
      
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative w-full max-w-2xl bg-white text-slate-900 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(34,211,238,0.2)] print:bg-white print:shadow-none print:m-0"
      >
        {/* Actions Header (Hidde on Print) */}
        <div className="p-4 bg-slate-100 flex items-center justify-between border-b border-slate-200 print:hidden">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-600 flex items-center justify-center text-white">
              <Activity size={18} />
            </div>
            <span className="font-bold text-slate-700">Medical Document</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handlePrint} className="p-2 hover:bg-white rounded-lg text-slate-600 transition-colors flex items-center gap-2 text-xs font-bold">
              <Printer size={16} /> Print
            </button>
            <button className="p-2 hover:bg-white rounded-lg text-slate-600 transition-colors flex items-center gap-2 text-xs font-bold">
              <Download size={16} /> Save PDF
            </button>
            <div className="w-px h-4 bg-slate-300 mx-2" />
            <button onClick={onClose} className="p-2 hover:bg-white rounded-lg text-slate-600 transition-colors">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* The "PDF" Content */}
        <div className="p-10 space-y-10 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] bg-[size:32px_32px]">
          {/* Header */}
          <div className="flex justify-between items-start border-b-2 border-slate-900 pb-8">
            <div>
              <h1 className="text-3xl font-black tracking-tighter text-cyan-600 uppercase italic">MediVision AI</h1>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mt-1">Smart Healthcare Ecosystem</p>
              <div className="mt-6 space-y-1">
                 <p className="text-sm font-bold">{prescription.doctorName}</p>
                 <p className="text-[10px] text-slate-500">M.B.B.S, M.D. (Radiology) • Reg NO: MV-2026-X8</p>
                 <p className="text-[10px] text-slate-400">12th Floor, Cyber Medical Park, Mumbai</p>
              </div>
            </div>
            <div className="text-right">
              <div className="bg-slate-900 text-white px-3 py-1 text-[10px] font-bold rounded mb-4">DIGITAL RX</div>
              <p className="text-xs font-bold text-slate-500 uppercase">Date</p>
              <p className="text-sm font-black">{prescription.date}</p>
              <p className="text-xs font-bold text-slate-500 uppercase mt-4">Record ID</p>
              <p className="text-sm font-mono font-bold">#{prescription.id}</p>
            </div>
          </div>

          {/* Patient Info */}
          <div className="grid grid-cols-2 gap-8 py-6 bg-slate-50 rounded-2xl px-6 border border-slate-100">
             <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Patient Name</p>
                <p className="text-md font-bold">{prescription.patientName}</p>
             </div>
             <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Age / Sex</p>
                <p className="text-md font-bold">24 Yrs / Male</p>
             </div>
          </div>

          {/* Rx Icon */}
          <div className="text-5xl font-serif italic text-slate-900 opacity-20 select-none">Rx</div>

          {/* Medicines */}
          <div className="space-y-6">
            <table className="w-full">
              <thead className="border-b border-slate-200">
                <tr className="text-[10px] text-slate-400 uppercase tracking-widest text-left font-black">
                  <th className="pb-3">Medicine Description</th>
                  <th className="pb-3 px-4">Dosage</th>
                  <th className="pb-3 text-right">Duration</th>
                </tr>
              </thead>
              <tbody>
                {prescription.medicines.map((med, idx) => (
                  <tr key={idx} className="border-b border-slate-100 last:border-0 font-medium">
                    <td className="py-4">
                       <span className="block text-sm font-bold text-slate-800">{med.name}</span>
                    </td>
                    <td className="py-4 px-4 text-xs text-slate-600">{med.dosage}</td>
                    <td className="py-4 text-right text-xs font-bold text-slate-500">{med.duration}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Notes */}
          {prescription.notes && (
            <div className="p-4 bg-cyan-50 rounded-xl border border-cyan-100 mt-8">
               <p className="text-[10px] font-bold text-cyan-600 uppercase mb-2">Doctor's Advice</p>
               <p className="text-xs leading-relaxed text-slate-700 italic">"{prescription.notes}"</p>
            </div>
          )}

          {/* Footer / QR / Sign */}
          <div className="pt-10 flex justify-between items-end">
            <div className="flex gap-4 items-center opacity-70">
               <div className="w-16 h-16 bg-slate-200 rounded-lg flex items-center justify-center p-2">
                 {/* Simulated QR Code */}
                 <div className="w-full h-full border-2 border-slate-400 border-dashed rounded flex items-center justify-center">
                    <CheckCircle2 className="text-slate-400" size={24} />
                 </div>
               </div>
               <div className="text-[9px] text-slate-400 font-medium leading-relaxed italic">
                 Scan to verify authenticity.<br />Digitally signed by MediVision AI<br />Network Time Protocol Verified.
               </div>
            </div>
            <div className="text-center">
               <div className="mb-2 text-cyan-600">
                 <ShieldCheck size={40} className="mx-auto" strokeWidth={1} />
               </div>
               <p className="text-[10px] font-bold uppercase tracking-widest">Digital Signature</p>
               <p className="text-xs font-mono font-bold mt-1 text-slate-400 underline decoration-dotted">DR_SARAH_MITCHELL_SECURED</p>
            </div>
          </div>
        </div>

        {/* Emergency Disclaimer */}
        <div className="p-4 bg-slate-900 text-slate-500 text-[8px] text-center uppercase tracking-[0.2em] font-bold">
           Not for medico-legal purposes • Cloud generated Rx • Valid for 30 days from date of issue
        </div>
      </motion.div>
    </div>
  );
}
