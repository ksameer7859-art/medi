import { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Upload, Scan, FileText, AlertCircle, CheckCircle2, ChevronRight, Languages, Loader2 } from "lucide-react";
import { analyzeXray } from "../services/api.ts";
import { XrayAnalysisResponse } from "../types.ts";
import ReactMarkdown from "react-markdown";

export default function XrayAnalysis() {
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<XrayAnalysisResponse | null>(null);
  const [language, setLanguage] = useState("English");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const startAnalysis = async () => {
    if (!image) return;
    setIsAnalyzing(true);
    try {
      const data = await analyzeXray(image, language);
      setResult(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-4xl mx-auto space-y-10"
    >
      <section className="text-center space-y-4">
        <h1 className="text-4xl font-bold glow-cyan">AI X-ray Analysis</h1>
        <p className="text-slate-400 max-w-2xl mx-auto">
          Upload chest, bone, or dental X-rays for instant AI analysis. Our neural networks assist in detecting anomalies with high precision.
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Upload & Preview */}
        <div className="space-y-6">
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="aspect-square glow-card relative overflow-hidden flex flex-col items-center justify-center cursor-pointer group border-dashed hover:border-cyan-500/50 transition-all"
          >
            {image ? (
              <div className="w-full h-full relative">
                <img src={image} alt="X-ray Preview" className="w-full h-full object-cover" />
                {isAnalyzing && (
                   <motion.div 
                    initial={{ top: 0 }}
                    animate={{ top: "100%" }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="scanline"
                   />
                )}
                {/* Heatmap Simulation overlay if result exists */}
                {result && !isAnalyzing && (
                  <div className="absolute inset-0 bg-red-500/10 mix-blend-overlay"></div>
                )}
              </div>
            ) : (
              <div className="text-center space-y-4 p-8">
                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                  <Upload className="text-cyan-400" size={32} />
                </div>
                <div>
                  <p className="font-bold">Drop X-ray scan here</p>
                  <p className="text-xs text-slate-500 mt-1">Supports PNG, JPG, DICOM (Converted)</p>
                </div>
              </div>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              className="hidden" 
              accept="image/*"
            />
          </div>

          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-2">
              <Languages size={18} className="text-slate-400" />
              <select 
                value={language} 
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-transparent text-sm focus:outline-none cursor-pointer"
              >
                <option value="English">English</option>
                <option value="Hindi">Hindi</option>
                <option value="Urdu">Urdu</option>
              </select>
            </div>
            
            <button 
              onClick={startAnalysis}
              disabled={!image || isAnalyzing}
              className="flex-1 btn-primary disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  <span>Analyzing Scan...</span>
                </>
              ) : (
                <>
                  <Scan size={20} />
                  <span>Scan with MediVision</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-6">
          <AnimatePresence mode="wait">
            {!result && !isAnalyzing && (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glow-card p-8 flex flex-col items-center justify-center text-center h-full border-dashed"
              >
                <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center mb-4">
                  <FileText className="text-slate-600" size={32} />
                </div>
                <h3 className="font-bold text-slate-400">Awaiting Data</h3>
                <p className="text-xs text-slate-600 mt-2">Upload and scan to see AI predictions</p>
              </motion.div>
            )}

            {isAnalyzing && (
               <motion.div 
                 key="loading"
                 className="glow-card p-8 space-y-6 h-full"
               >
                 <div className="h-8 bg-white/5 rounded-lg animate-pulse w-3/4"></div>
                 <div className="space-y-3">
                   <div className="h-4 bg-white/5 rounded animate-pulse"></div>
                   <div className="h-4 bg-white/5 rounded animate-pulse w-5/6"></div>
                   <div className="h-4 bg-white/5 rounded animate-pulse w-4/6"></div>
                 </div>
                 <div className="pt-8">
                    <div className="flex justify-between items-end mb-2">
                      <div className="h-4 bg-white/5 rounded w-20"></div>
                      <div className="h-8 bg-white/5 rounded w-16"></div>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                       <motion.div 
                         className="h-full bg-cyan-500" 
                         initial={{ width: "0%" }}
                         animate={{ width: "70%" }}
                         transition={{ duration: 2, repeat: Infinity }}
                       />
                    </div>
                 </div>
               </motion.div>
            )}

            {result && !isAnalyzing && (
              <motion.div 
                key="result"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="glow-card p-6 space-y-6"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="text-green-400" size={20} />
                    <span className="font-bold">Prediction Complete</span>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Confidence Score</p>
                    <p className="text-3xl font-bold text-cyan-400 glow-cyan">{result.confidence}%</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-bold border-b border-white/10 pb-2">Detected Suspicious Areas</h4>
                  <div className="space-y-2">
                    {result.suspiciousAreas.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                        <div className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-[10px] font-bold mt-0.5">
                          {idx + 1}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-200">{item.area}</p>
                          <p className="text-[10px] text-slate-500">{item.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                   <h4 className="text-sm font-bold border-b border-white/10 pb-2">Analysis Findings</h4>
                   <div className="text-xs text-slate-300 leading-relaxed max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                     <ReactMarkdown>{result.explanation}</ReactMarkdown>
                   </div>
                </div>

                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex gap-3">
                  <AlertCircle className="text-amber-400 shrink-0" size={18} />
                  <p className="text-[10px] text-amber-200 leading-relaxed italic">
                    {result.disclaimer}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
