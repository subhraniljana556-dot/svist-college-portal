// ================================================================
// PLACEMENTS VIEW — Training & Placement Cell + Active Drives
// ================================================================

import { useState, useEffect } from "react"
import {
  Briefcase, TrendingUp, Users, Building2, Calendar, Award, CheckCircle2,
  AlertCircle, ArrowRight, X, Clock, MapPin, Send, ShieldCheck
} from "lucide-react"
import { apiFetch } from "../config/api"

export default function PlacementsView() {
  const recruiters = ["TCS", "Cognizant", "Wipro", "Infosys", "IBM", "Tech Mahindra", "Amazon", "Capgemini", "Accenture", "L&T"];
  
  const [drives, setDrives] = useState([]);
  const [selectedDrive, setSelectedDrive] = useState(null);
  const [applyRoll, setApplyRoll] = useState("");
  const [applyStatus, setApplyStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchDrives = async () => {
    const { data } = await apiFetch("/api/placements/drives");
    if (data) setDrives(data);
  };

  useEffect(() => {
    fetchDrives();
  }, []);

  const handleApply = async (e) => {
    e.preventDefault();
    if (!selectedDrive || !applyRoll) return;

    setIsSubmitting(true);
    setApplyStatus(null);

    const { data, error } = await apiFetch("/api/placements/apply", {
      method: "POST",
      body: JSON.stringify({
        driveId: selectedDrive._id,
        rollNumber: applyRoll.trim(),
      }),
    });

    setIsSubmitting(false);

    if (data && data.success) {
      setApplyStatus({ type: "success", message: data.message });
      fetchDrives();
      setTimeout(() => {
        setSelectedDrive(null);
        setApplyRoll("");
        setApplyStatus(null);
      }, 3500);
    } else {
      setApplyStatus({
        type: "error",
        message: error || "Application submission failed. Please verify your eligibility.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20 animate-in fade-in duration-500">
       
       {/* ============================================================ */}
       {/* APPLY MODAL */}
       {/* ============================================================ */}
       {selectedDrive && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-200">
              <div className="bg-[#1e3a8a] p-6 text-white flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-black">{selectedDrive.companyName}</h3>
                  <p className="text-blue-200 text-xs font-bold mt-0.5">{selectedDrive.role} • {selectedDrive.package}</p>
                </div>
                <button onClick={() => { setSelectedDrive(null); setApplyStatus(null); }} className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-6 text-xs space-y-1.5">
                  <p className="text-slate-600"><strong>Eligibility Threshold:</strong> Min SGPA {selectedDrive.eligibilityCriteria?.minSgpa || 6.5}</p>
                  <p className="text-slate-600"><strong>Allowed Branches:</strong> {selectedDrive.eligibilityCriteria?.allowedDepartments?.join(", ") || "All Departments"}</p>
                  <p className="text-slate-600"><strong>Application Deadline:</strong> {selectedDrive.deadline}</p>
                </div>

                {applyStatus && (
                  <div className={`p-4 mb-4 rounded-xl border flex items-start gap-2.5 text-xs font-bold ${applyStatus.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                    {applyStatus.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0"/> : <AlertCircle className="w-5 h-5 text-red-600 shrink-0"/>}
                    <p className="leading-relaxed">{applyStatus.message}</p>
                  </div>
                )}

                <form onSubmit={handleApply} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Enter University Roll Number</label>
                    <input
                      type="text"
                      value={applyRoll}
                      onChange={(e) => setApplyRoll(e.target.value)}
                      placeholder="e.g. 15000123045"
                      required
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm font-bold text-slate-900 focus:border-[#1e3a8a] focus:ring-2 focus:ring-[#1e3a8a] outline-none"
                    />
                    <p className="text-[11px] text-slate-500 mt-1">System validates your recorded SGPA against Atlas records before registering.</p>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-3.5 rounded-xl font-black text-sm uppercase tracking-wider text-white shadow-md flex items-center justify-center gap-2 transition-all ${isSubmitting ? 'bg-slate-400 cursor-not-allowed' : 'bg-[#1e3a8a] hover:bg-blue-900'}`}
                  >
                    {isSubmitting ? "Validating Academic SGPA..." : <><Send className="w-4 h-4"/> Submit Application to T&P</>}
                  </button>
                </form>
              </div>
            </div>
          </div>
       )}

       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* HEADER BANNER */}
          <div className="bg-[#1e3a8a] rounded-3xl p-12 shadow-xl border border-blue-800 text-white mb-8 overflow-hidden relative">
             <div className="absolute top-0 right-0 opacity-10 pointer-events-none">
                <Briefcase className="w-96 h-96 -mt-20 -mr-20" />
             </div>
             <div className="relative z-10">
               <span className="inline-block bg-amber-400 text-slate-900 font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider mb-4">Corporate Relations & Careers</span>
               <h1 className="text-4xl md:text-5xl font-black mb-4">Training & Placement Cell</h1>
               <p className="text-xl text-blue-200 max-w-2xl font-medium">Achieving excellence with a consistent track record. We empower students to secure elite software engineering roles at top-tier multinational corporations.</p>
             </div>
          </div>

          {/* KEY METRICS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm text-center transform transition-transform hover:-translate-y-1">
              <TrendingUp className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
              <h3 className="text-4xl font-black text-slate-900 mb-2">12+ LPA</h3>
              <p className="text-slate-500 font-bold uppercase tracking-wider text-sm">Target & Highest Package</p>
            </div>
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm text-center transform transition-transform hover:-translate-y-1">
              <Users className="w-12 h-12 text-blue-500 mx-auto mb-4" />
              <h3 className="text-4xl font-black text-slate-900 mb-2">95%</h3>
              <p className="text-slate-500 font-bold uppercase tracking-wider text-sm">Placement Rate</p>
            </div>
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm text-center transform transition-transform hover:-translate-y-1">
              <Building2 className="w-12 h-12 text-amber-500 mx-auto mb-4" />
              <h3 className="text-4xl font-black text-slate-900 mb-2">50+</h3>
              <p className="text-slate-500 font-bold uppercase tracking-wider text-sm">Recruiting Partners</p>
            </div>
          </div>

          {/* ACTIVE CAMPUS PLACEMENT DRIVES SECTION */}
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-200 mb-12">
             <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b border-slate-100 pb-4">
                <div>
                   <h2 className="text-2xl md:text-3xl font-black text-slate-900">Active Campus Recruitment Drives</h2>
                   <p className="text-slate-500 text-sm font-medium mt-1">Verified on-campus hiring drives with real-time academic validation</p>
                </div>
                <span className="self-start sm:self-auto bg-emerald-100 text-emerald-800 font-bold text-xs px-3.5 py-1.5 rounded-full flex items-center gap-1.5">
                   <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span> {drives.length} Drives Open
                </span>
             </div>

             {drives.length === 0 ? (
               <p className="text-center py-12 text-slate-400 font-medium">No active campus drives found.</p>
             ) : (
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 {drives.map((drive) => (
                   <div key={drive._id} className="border border-slate-200 rounded-2xl p-6 bg-slate-50 flex flex-col justify-between hover:border-[#1e3a8a] hover:shadow-lg transition-all group">
                     <div>
                       <div className="flex justify-between items-start mb-4">
                         <span className="bg-[#1e3a8a]/10 text-[#1e3a8a] font-black text-xs px-3 py-1 rounded-lg">
                           {drive.package}
                         </span>
                         <span className="text-xs text-slate-400 font-bold flex items-center gap-1">
                           <Clock className="w-3.5 h-3.5"/> {drive.deadline}
                         </span>
                       </div>

                       <h3 className="text-xl font-black text-slate-900 group-hover:text-[#1e3a8a] transition-colors">{drive.companyName}</h3>
                       <p className="text-sm font-bold text-amber-600 mb-3">{drive.role}</p>
                       <p className="text-xs text-slate-600 leading-relaxed line-clamp-2 mb-4 font-medium">{drive.description}</p>
                       
                       <div className="bg-white p-3 rounded-xl border border-slate-200 text-xs space-y-1 mb-6">
                         <div className="flex justify-between">
                           <span className="text-slate-500 font-bold">Min SGPA:</span>
                           <span className="font-black text-emerald-600">{drive.eligibilityCriteria?.minSgpa || 6.5}</span>
                         </div>
                         <div className="flex justify-between">
                           <span className="text-slate-500 font-bold">Location:</span>
                           <span className="font-medium text-slate-800">{drive.location}</span>
                         </div>
                         <div className="flex justify-between">
                           <span className="text-slate-500 font-bold">Applicants:</span>
                           <span className="font-bold text-[#1e3a8a]">{drive.applicants?.length || 0} Registered</span>
                         </div>
                       </div>
                     </div>

                     <button
                       onClick={() => { setSelectedDrive(drive); setApplyStatus(null); }}
                       className="w-full py-3 bg-[#1e3a8a] hover:bg-blue-900 text-white rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-sm"
                     >
                       Apply for Drive <ArrowRight className="w-4 h-4"/>
                     </button>
                   </div>
                 ))}
               </div>
             )}
          </div>

          {/* RECRUITING PARTNERS */}
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-200">
             <h2 className="text-3xl font-black text-slate-900 mb-8 text-center border-b border-slate-100 pb-4">Our Top Recruiting Partners</h2>
             <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6">
                {recruiters.map((company, idx) => (
                  <div key={idx} className="p-4 border border-slate-100 bg-slate-50 rounded-xl flex items-center justify-center font-black text-slate-700 text-lg hover:bg-[#1e3a8a] hover:text-white transition-colors cursor-pointer shadow-sm text-center">
                    {company}
                  </div>
                ))}
             </div>
          </div>
       </div>
    </div>
  )
}
