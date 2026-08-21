import { useState } from "react"
import {
  BookOpen, Award, CheckCircle, BookOpenCheck, CalendarDays, Scale, X,
  Link as LinkIcon, ShieldAlert, MessageSquare, Send, CheckCircle2, AlertCircle, RefreshCw
} from "lucide-react"
import { apiFetch } from "../config/api"

export default function AcademicsView() {
  const [activeModal, setActiveModal] = useState(null);

  // Support Helpdesk Form State
  const [ticketForm, setTicketForm] = useState({
    name: "",
    email: "",
    rollNumber: "",
    department: "Computer Science & Engineering",
    category: "General Academic Support",
    subject: "",
    message: ""
  });
  const [isSubmittingTicket, setIsSubmittingTicket] = useState(false);
  const [ticketResult, setTicketResult] = useState(null);

  const handleTicketChange = (e) => setTicketForm({ ...ticketForm, [e.target.name]: e.target.value });

  const handleTicketSubmit = async (e) => {
    e.preventDefault();
    setIsSubmittingTicket(true);
    setTicketResult(null);

    const { data, error } = await apiFetch("/api/support/ticket", {
      method: "POST",
      body: JSON.stringify(ticketForm),
    });

    setIsSubmittingTicket(false);

    if (data && data.success) {
      setTicketResult({
        type: "success",
        ticketId: data.ticketId,
        message: data.message,
      });
      setTicketForm({
        name: "",
        email: "",
        rollNumber: "",
        department: "Computer Science & Engineering",
        category: "General Academic Support",
        subject: "",
        message: ""
      });
    } else {
      setTicketResult({
        type: "error",
        message: error || "Failed to register support ticket. Please try again.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20 animate-in fade-in duration-500 relative">
       {activeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-200">
              <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50">
                 <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                  {activeModal === 'calendar' && <CalendarDays className="text-emerald-500"/>}
                  {activeModal === 'rules' && <Scale className="text-purple-500"/>}
                  {activeModal === 'syllabus' && <BookOpenCheck className="text-amber-500"/>}
                  {activeModal === 'calendar' && 'Academic Calendar 2026-27'}
                  {activeModal === 'rules' && 'Rules & Regulations'}
                  {activeModal === 'syllabus' && 'MAKAUT Official Department Syllabus Archive'}
                </h3>
                <button onClick={() => setActiveModal(null)} className="p-2 bg-white hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-full transition-colors border border-slate-200 cursor-pointer"><X className="w-5 h-5" /></button>
              </div>
              <div className="p-8 max-h-[60vh] overflow-y-auto">
                {activeModal === 'syllabus' ? (
                  <div className="space-y-4">
                    <p className="text-xs text-slate-600 font-medium">Download MAKAUT AICTE model curriculum syllabus PDFs for all 8 semesters:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        { dept: "Computer Science & Engg (CSE)", file: "MAKAUT-CSE-Curriculum-2026.pdf", sem: "Sem 1 to 8" },
                        { dept: "Artificial Intelligence & DS", file: "MAKAUT-AIDS-Curriculum-2026.pdf", sem: "Sem 1 to 8" },
                        { dept: "Electronics & Comm (ECE)", file: "MAKAUT-ECE-Curriculum-2026.pdf", sem: "Sem 1 to 8" },
                        { dept: "Electrical Engineering (EE)", file: "MAKAUT-EE-Curriculum-2026.pdf", sem: "Sem 1 to 8" },
                        { dept: "Mechanical Engineering (ME)", file: "MAKAUT-ME-Curriculum-2026.pdf", sem: "Sem 1 to 8" },
                        { dept: "Civil Engineering (CE)", file: "MAKAUT-CE-Curriculum-2026.pdf", sem: "Sem 1 to 8" }
                      ].map((item, idx) => (
                        <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-xl hover:border-amber-400 transition-colors flex items-center justify-between">
                          <div>
                            <p className="font-bold text-xs text-slate-900">{item.dept}</p>
                            <p className="text-[10px] text-slate-500">{item.sem} • AICTE Model</p>
                          </div>
                          <button
                            onClick={() => alert(`Downloading ${item.file} official MAKAUT course document...`)}
                            className="px-3 py-1.5 bg-[#1e3a8a] text-white rounded-lg text-[11px] font-bold hover:bg-blue-900 transition-colors cursor-pointer"
                          >
                            PDF ⬇
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : activeModal === 'calendar' ? (
                  <ul className="space-y-4">
                    <li className="flex gap-4 p-4 bg-emerald-50 rounded-lg border border-emerald-100">
                      <div className="text-emerald-600 font-black text-xl w-16 text-center">AUG</div>
                      <div><p className="font-bold text-slate-900">Odd Semester Commences</p><p className="text-sm text-slate-600">Orientation for 1st Year Students.</p></div>
                    </li>
                    <li className="flex gap-4 p-4 bg-slate-50 rounded-lg border border-slate-100">
                      <div className="text-slate-600 font-black text-xl w-16 text-center">OCT</div>
                      <div><p className="font-bold text-slate-900">Internal Assessment (CA1 & CA2)</p><p className="text-sm text-slate-600">First phase of continuous evaluation.</p></div>
                    </li>
                    <li className="flex gap-4 p-4 bg-amber-50 rounded-lg border border-amber-100">
                      <div className="text-amber-600 font-black text-xl w-16 text-center">DEC</div>
                      <div><p className="font-bold text-slate-900">Practical Examinations</p><p className="text-sm text-slate-600">All departmental laboratory exams.</p></div>
                    </li>
                  </ul>
                ) : (
                  <div className="space-y-6 text-slate-700">
                    <div>
                      <h4 className="font-bold text-slate-900 text-lg mb-2">1. Attendance Mandate</h4>
                      <p>As per MAKAUT guidelines, a minimum of 75% attendance in both theoretical and practical classes is strictly required to be eligible for end-semester examinations.</p>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-lg mb-2">2. Anti-Ragging Policy</h4>
                      <p>SVIST operates a zero-tolerance policy towards ragging. Any student found guilty of harassment or ragging will face immediate suspension and legal action under UGC guidelines.</p>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-lg mb-2">3. Dress Code & Discipline</h4>
                      <p>Students must adhere to the formal college uniform during lab hours and campus placements. Identity cards must be worn visibly at all times within campus premises.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
       )}

       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* Main Academic Overview */}
          <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-slate-200">
             <div className="flex items-center gap-4 mb-8 border-b border-slate-200 pb-6">
                <div className="bg-[#1e3a8a]/10 p-4 rounded-xl">
                   <BookOpen className="w-10 h-10 text-[#1e3a8a]" />
                </div>
                <div>
                   <h1 className="text-4xl font-black text-slate-900">Academic Excellence</h1>
                   <p className="text-slate-500 font-medium mt-1">Affiliated to MAKAUT & Approved by AICTE</p>
                </div>
             </div>
             
             <div className="grid md:grid-cols-2 gap-8 mb-12">
               <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200">
                 <h2 className="text-2xl font-bold text-slate-900 mb-4">Core Philosophy</h2>
                 <p className="text-slate-600 leading-relaxed mb-4">SVIST adheres strictly to the rigorous, industry-aligned syllabus mandated by Maulana Abul Kalam Azad University of Technology (MAKAUT). Our mission is to bridge the gap between deep theoretical engineering and rapid practical deployment.</p>
                 <p className="text-slate-600 leading-relaxed">Students engage deeply with core mathematics, advanced algorithms, and hands-on structural modeling, ensuring they are deployable engineers from day one.</p>
               </div>
               <div className="bg-[#1e3a8a] text-white p-8 rounded-2xl shadow-lg">
                 <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><Award className="text-amber-400" /> Academic Structure</h2>
                 <ul className="space-y-5">
                   <li className="flex items-start gap-3"><CheckCircle className="text-amber-400 w-6 h-6 shrink-0"/> <div><strong>8 Semesters over 4 Years</strong><br/><span className="text-blue-200 text-sm">Comprehensive theoretical and practical grounding.</span></div></li>
                   <li className="flex items-start gap-3"><CheckCircle className="text-amber-400 w-6 h-6 shrink-0"/> <div><strong>Continuous Assessment (CA)</strong><br/><span className="text-blue-200 text-sm">4 internal exams per semester to track real-time progress.</span></div></li>
                   <li className="flex items-start gap-3"><CheckCircle className="text-amber-400 w-6 h-6 shrink-0"/> <div><strong>Capstone Projects</strong><br/><span className="text-blue-200 text-sm">Final year focus on modern frameworks, AI/ML, and scalable infrastructure.</span></div></li>
                 </ul>
               </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div onClick={() => setActiveModal('syllabus')} className="p-6 border border-slate-200 rounded-xl hover:shadow-lg transition-all hover:-translate-y-1 hover:border-amber-400 cursor-pointer group block">
                   <BookOpenCheck className="w-8 h-8 text-amber-500 mb-4 group-hover:scale-110 transition-transform" />
                   <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">Syllabus Archive</h3>
                   <p className="text-sm text-slate-500 mt-2">Download official MAKAUT syllabus PDFs for all departments.</p>
                </div>
                <div onClick={() => setActiveModal('calendar')} className="p-6 border border-slate-200 rounded-xl hover:shadow-lg transition-all hover:-translate-y-1 hover:border-emerald-400 cursor-pointer group">
                   <CalendarDays className="w-8 h-8 text-emerald-500 mb-4 group-hover:scale-110 transition-transform" />
                   <h3 className="font-bold text-lg text-slate-900">Academic Calendar</h3>
                   <p className="text-sm text-slate-500 mt-2">View upcoming examination dates, holidays, and semester breaks.</p>
                </div>
                <div onClick={() => setActiveModal('rules')} className="p-6 border border-slate-200 rounded-xl hover:shadow-lg transition-all hover:-translate-y-1 hover:border-purple-400 cursor-pointer group">
                   <Scale className="w-8 h-8 text-purple-500 mb-4 group-hover:scale-110 transition-transform" />
                   <h3 className="font-bold text-lg text-slate-900">Rules & Regulations</h3>
                   <p className="text-sm text-slate-500 mt-2">Institution guidelines, attendance policies, and anti-ragging mandates.</p>
                </div>
             </div>
          </div>

          {/* 24x7 Student Support & Anti-Ragging Helpdesk */}
          <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-slate-200">
            <div className="flex items-center gap-4 mb-8 border-b border-slate-200 pb-6">
              <div className="bg-red-50 p-4 rounded-xl text-red-600">
                <ShieldAlert className="w-10 h-10" />
              </div>
              <div>
                <h2 className="text-3xl font-black text-slate-900">24x7 Student Support & Anti-Ragging Cell</h2>
                <p className="text-slate-500 font-medium mt-1">Submit your academic grievances, hostel concerns, or confidential inquiries directly.</p>
              </div>
            </div>

            {ticketResult && (
              <div className={`p-5 mb-8 rounded-2xl border font-bold text-sm flex items-start gap-3 animate-in fade-in ${ticketResult.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                {ticketResult.type === 'success' ? <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" /> : <AlertCircle className="w-6 h-6 text-red-600 shrink-0" />}
                <div>
                  <p>{ticketResult.message}</p>
                  {ticketResult.ticketId && (
                    <p className="mt-1 text-xs text-emerald-700 font-mono">Reference Ticket: {ticketResult.ticketId}</p>
                  )}
                </div>
              </div>
            )}

            <form onSubmit={handleTicketSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Your Name</label>
                  <input
                    type="text"
                    name="name"
                    value={ticketForm.name}
                    onChange={handleTicketChange}
                    required
                    placeholder="Enter your full name"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={ticketForm.email}
                    onChange={handleTicketChange}
                    required
                    placeholder="email@domain.com"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Roll Number (Optional)</label>
                  <input
                    type="text"
                    name="rollNumber"
                    value={ticketForm.rollNumber}
                    onChange={handleTicketChange}
                    placeholder="e.g. 1234567890"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Helpdesk Category</label>
                  <select
                    name="category"
                    value={ticketForm.category}
                    onChange={handleTicketChange}
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm font-bold bg-white focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                  >
                    <option>General Academic Support</option>
                    <option>Anti-Ragging Confidential Report</option>
                    <option>Hostel & Campus Facility Concern</option>
                    <option>Examination & Results Query</option>
                    <option>Scholarship & Fee Installment Help</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Subject / Inquiry Title</label>
                  <input
                    type="text"
                    name="subject"
                    value={ticketForm.subject}
                    onChange={handleTicketChange}
                    required
                    placeholder="Brief summary of your inquiry"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Detailed Description</label>
                <textarea
                  name="message"
                  rows={4}
                  value={ticketForm.message}
                  onChange={handleTicketChange}
                  required
                  placeholder="Provide all relevant details to help our team assist you efficiently..."
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmittingTicket}
                className="px-8 py-4 bg-[#1e3a8a] text-white font-black rounded-xl hover:bg-blue-900 transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 cursor-pointer"
              >
                {isSubmittingTicket ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" /> Submitting Ticket...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" /> Submit Helpdesk Ticket
                  </>
                )}
              </button>
            </form>
          </div>

       </div>
    </div>
  )
}
