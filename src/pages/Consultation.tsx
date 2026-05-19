import { motion, AnimatePresence } from "motion/react";
import { Mic, MicOff, Video, VideoOff, PhoneOff, Settings, MessageSquare, FileText, User, Share2, MoreHorizontal, ScreenShare, ChevronRight } from "lucide-react";
import { useState } from "react";
import { cn } from "../lib/utils.ts";

const ControlButton = ({ icon: Icon, active = false, onClick, danger = false }: any) => (
  <button 
    onClick={onClick}
    className={cn(
      "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300",
      danger ? "bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20" : 
      active ? "bg-cyan-500 text-black shadow-lg shadow-cyan-500/20" : 
      "bg-white/10 hover:bg-white/20 text-white"
    )}
  >
    <Icon size={20} />
  </button>
);

export default function Consultation() {
  const [micOn, setMicOn] = useState(true);
  const [videoOn, setVideoOn] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const [showReports, setShowReports] = useState(true);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      className="h-[calc(100vh-12rem)] flex gap-6"
    >
      {/* Main Video Area */}
      <div className="flex-1 relative glow-card overflow-hidden bg-slate-900 shadow-2xl">
        {/* Remote Video (Mockup) */}
        <div className="absolute inset-0 bg-[#050B18]">
           <div className="absolute inset-0 flex items-center justify-center opacity-20">
              <User size={200} className="text-slate-400" />
           </div>
           {/* Scan-line background pattern for tech feel */}
           <div className="absolute inset-0 bg-[radial-gradient(#ffffff05_1px,transparent_1px)] bg-[size:20px_20px]"></div>
           
           <div className="absolute top-6 left-6 flex items-center gap-4">
              <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-xs font-medium">Dr. Sarah Mitchell</span>
              </div>
              <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-[10px] text-slate-400 font-mono">
                08:42:15
              </div>
           </div>

           {/* Self View */}
           <div className="absolute bottom-6 right-6 w-48 aspect-video glow-card overflow-hidden z-20 border-2 border-white/10">
              <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                 <User size={40} className="text-slate-600" />
              </div>
              <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/60 rounded-md text-[10px] font-medium">You</div>
           </div>
        </div>

        {/* Floating Controls */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-4 z-30 scale-110">
          <ControlButton icon={micOn ? Mic : MicOff} active={micOn} onClick={() => setMicOn(!micOn)} />
          <ControlButton icon={videoOn ? Video : VideoOff} active={videoOn} onClick={() => setVideoOn(!videoOn)} />
          <ControlButton icon={ScreenShare} />
          <ControlButton icon={PhoneOff} danger onClick={() => window.history.back()} />
          <ControlButton icon={Settings} />
        </div>

        {/* Interactions right bar */}
        <div className="absolute top-1/2 -translate-y-1/2 right-6 flex flex-col gap-4 z-30">
          <ControlButton icon={MessageSquare} active={showChat} onClick={() => setShowChat(!showChat)} />
          <ControlButton icon={FileText} active={showReports} onClick={() => setShowReports(!showReports)} />
          <ControlButton icon={Share2} />
          <ControlButton icon={MoreHorizontal} />
        </div>
      </div>

      {/* Side Panel (Chat or Reports) */}
      <AnimatePresence>
        {showReports && (
          <motion.div 
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 360, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="glow-card flex flex-col overflow-hidden"
          >
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <h3 className="font-bold flex items-center gap-2">
                <FileText size={18} className="text-cyan-400" />
                Patient Reports
              </h3>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
               {[1, 2, 3].map((i) => (
                  <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-cyan-500/30 transition-all cursor-pointer group">
                    <div className="flex justify-between items-start mb-2">
                      <p className="text-xs font-bold">Chest X-Ray Analysis</p>
                      <span className="text-[10px] text-slate-500">May {10+i}, 2026</span>
                    </div>
                    <p className="text-[10px] text-slate-400 mb-3">AI Detection: No significant abnormalities detected in pleural space.</p>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] bg-cyan-500/10 text-cyan-400 px-2 py-0.5 rounded-full border border-cyan-500/20">98% Accuracy</span>
                      <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full">PDF 2.4MB</span>
                    </div>
                  </div>
               ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showChat && (
          <motion.div 
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 360, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="glow-card flex flex-col overflow-hidden"
          >
            <div className="p-4 border-b border-white/10">
              <h3 className="font-bold flex items-center gap-2">
                <MessageSquare size={18} className="text-cyan-400" />
                Live Consultation Chat
              </h3>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div className="flex flex-col gap-1">
                <div className="max-w-[80%] bg-slate-800 p-3 rounded-2xl rounded-tl-none text-xs leading-relaxed">
                  Hello Sameer, I'm reviewing your latest X-ray results. Everything looks mostly normal.
                </div>
                <span className="text-[10px] text-slate-500 ml-1">08:42 AM</span>
              </div>
              <div className="flex flex-col items-end gap-1">
                <div className="max-w-[80%] bg-cyan-600 p-3 rounded-2xl rounded-tr-none text-xs leading-relaxed text-black font-medium">
                  Thank you doctor. Should I be worried about the minor shadow found by AI?
                </div>
                <span className="text-[10px] text-slate-500 mr-1">08:43 AM</span>
              </div>
            </div>
            <div className="p-4 border-t border-white/10">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Type a message..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-12 text-sm focus:outline-none focus:border-cyan-500/50"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-cyan-500 text-black">
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
