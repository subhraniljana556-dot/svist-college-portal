// ================================================================
// ALUMNI NETWORK & MENTORSHIP CONNECT VIEW
// ================================================================

import React, { useState } from "react"
import {
  GraduationCap, Briefcase, Award, Calendar, CheckCircle2, MessageSquare,
  Sparkles, ExternalLink, Filter, Search, UserCheck, Send, AlertCircle
} from "lucide-react"

export default function AlumniView() {
  const [selectedDept, setSelectedDept] = useState("ALL")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedMentor, setSelectedMentor] = useState(null)
  
  // Mentorship Booking Form State
  const [mentorForm, setMentorForm] = useState({
    studentName: "",
    rollNumber: "",
    department: "Computer Science & Engineering",
    semester: "4",
    topic: "Technical Mock Interview & DSA",
    date: "",
    notes: ""
  })
  const [bookingSuccess, setBookingSuccess] = useState(null)

  const alumniList = [
    {
      id: 1,
      name: "Debanjan Mukherjee",
      batch: "Batch of 2020",
      department: "CSE",
      role: "Senior Cloud Solutions Architect",
      company: "Amazon Web Services (AWS)",
      location: "Bengaluru, India",
      package: "₹38.5 LPA",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=60",
      specialization: "Distributed Systems, AWS Cloud, Kubernetes",
      quote: "SVIST gave me the algorithmic foundation and hands-on lab environment that directly paved my way into AWS."
    },
    {
      id: 2,
      name: "Priyanka Roy",
      batch: "Batch of 2021",
      department: "CSE",
      role: "Software Engineer III",
      company: "Google",
      location: "Hyderabad, India",
      package: "₹42.0 LPA",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=60",
      specialization: "Golang, Large Language Models, System Design",
      quote: "The coding culture at SVIST helped me crack competitive programming contests and multi-round tech interviews."
    },
    {
      id: 3,
      name: "Soumya Chakraborty",
      batch: "Batch of 2022",
      department: "ECE",
      role: "Lead Hardware Design Engineer",
      company: "Qualcomm",
      location: "Bengaluru, India",
      package: "₹26.0 LPA",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=60",
      specialization: "VLSI Prototyping, FPGA Synthesis, Verilog HDL",
      quote: "The advanced VLSI laboratory at SVIST allowed us to work directly with Xilinx Vivado kits from our 3rd year."
    },
    {
      id: 4,
      name: "Ananya Ghosh",
      batch: "Batch of 2021",
      department: "CSE",
      role: "Full-Stack Tech Lead",
      company: "Microsoft",
      location: "Noida, India",
      package: "₹34.0 LPA",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=60",
      specialization: "React, Node.js, Azure DevOps, Microservices",
      quote: "Capstone project mentorship from SVIST faculty prepared me for real-world enterprise software architectures."
    },
    {
      id: 5,
      name: "Rohan Banerjee",
      batch: "Batch of 2023",
      department: "EE",
      role: "Smart Grid Integration Engineer",
      company: "Schneider Electric",
      location: "Kolkata, India",
      package: "₹18.0 LPA",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=60",
      specialization: "Renewable Energy, SCADA Systems, Power Distribution",
      quote: "High-voltage machines lab experiments gave me the exact practical competencies required in power automation."
    },
    {
      id: 6,
      name: "Shreya Sen",
      batch: "Batch of 2022",
      department: "CSE",
      role: "Senior Consultant (AI & Analytics)",
      company: "PwC India",
      location: "Kolkata / Mumbai",
      package: "₹22.5 LPA",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=60",
      specialization: "Predictive Analytics, PowerBI, Enterprise AI",
      quote: "The campus placement training drives gave me huge confidence during my multi-stage consulting assessments."
    }
  ]

  const filteredAlumni = alumniList.filter(alumnus => {
    const matchesDept = selectedDept === "ALL" || alumnus.department === selectedDept
    const matchesSearch = alumnus.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          alumnus.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          alumnus.role.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesDept && matchesSearch
  })

  const handleBookingSubmit = (e) => {
    e.preventDefault()
    const refCode = "SVIST-MENTOR-" + Math.random().toString(36).substring(2, 8).toUpperCase()
    setBookingSuccess({
      refCode,
      mentorName: selectedMentor.name,
      company: selectedMentor.company,
      topic: mentorForm.topic,
      date: mentorForm.date || "Next Available Weekend Slot"
    })
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20 animate-in fade-in duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Hero */}
        <div className="bg-gradient-to-r from-slate-900 via-[#1e3a8a] to-blue-950 text-white rounded-3xl p-8 sm:p-12 shadow-xl mb-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-amber-400 text-xs font-black tracking-wider uppercase mb-4">
              <GraduationCap className="w-3.5 h-3.5" /> SVIST Global Alumni Network
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
              Alumni Mentorship & Career Connect
            </h1>
            <p className="mt-4 text-blue-100 text-base sm:text-lg font-medium leading-relaxed">
              Connect with SVIST graduates leading innovations at Amazon, Google, Microsoft, Qualcomm, and PwC. Book 1-on-1 mock technical interviews, resume reviews, and career counseling.
            </p>
          </div>
        </div>

        {/* Filters & Search Bar */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm mb-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-2 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Department:
            </span>
            {["ALL", "CSE", "ECE", "EE", "ME", "CE"].map((dept) => (
              <button
                key={dept}
                onClick={() => setSelectedDept(dept)}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${selectedDept === dept ? 'bg-[#1e3a8a] text-white shadow-md' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
              >
                {dept}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search mentor or company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
            />
          </div>
        </div>

        {/* Alumni Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {filteredAlumni.map((alumnus) => (
            <div
              key={alumnus.id}
              className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-md hover:shadow-xl transition-all hover:-translate-y-1.5 flex flex-col justify-between group"
            >
              <div>
                <div className="p-6 bg-gradient-to-r from-slate-900 to-[#1e3a8a] text-white flex items-center gap-4">
                  <img
                    src={alumnus.image}
                    alt={alumnus.name}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-400/80 shadow-md"
                  />
                  <div>
                    <h3 className="text-lg font-black text-white">{alumnus.name}</h3>
                    <p className="text-xs text-amber-300 font-bold">{alumnus.batch} • {alumnus.department}</p>
                    <span className="inline-block mt-1 px-2.5 py-0.5 bg-white/10 rounded-full text-[10px] font-bold text-blue-200">
                      {alumnus.location}
                    </span>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">Current Role & Firm</span>
                    <p className="text-sm font-black text-slate-900">{alumnus.role}</p>
                    <p className="text-xs font-bold text-[#1e3a8a]">{alumnus.company}</p>
                  </div>

                  <div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Domain Expertise</span>
                    <p className="text-xs font-medium text-slate-700">{alumnus.specialization}</p>
                  </div>

                  <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100 text-xs italic text-slate-600">
                    "{alumnus.quote}"
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0">
                <button
                  onClick={() => { setSelectedMentor(alumnus); setBookingSuccess(null); }}
                  className="w-full py-3.5 bg-[#1e3a8a] hover:bg-blue-900 text-white font-black rounded-xl text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-md cursor-pointer"
                >
                  <Calendar className="w-4 h-4 text-amber-400" /> Book 1-on-1 Mentorship
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Mentorship Booking Modal */}
        {selectedMentor && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border border-slate-200 animate-in zoom-in-95">
              
              <div className="bg-[#1e3a8a] text-white p-6 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <img src={selectedMentor.image} alt={selectedMentor.name} className="w-12 h-12 rounded-xl object-cover border-2 border-amber-400" />
                  <div>
                    <h3 className="text-lg font-black">{selectedMentor.name}</h3>
                    <p className="text-xs text-blue-200 font-medium">{selectedMentor.role} • {selectedMentor.company}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedMentor(null)} className="p-2 bg-white/10 hover:bg-red-500 rounded-full transition-colors cursor-pointer">
                  ✕
                </button>
              </div>

              <div className="p-6">
                {bookingSuccess ? (
                  <div className="text-center py-6 space-y-4">
                    <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                      <CheckCircle2 className="w-10 h-10" />
                    </div>
                    <h4 className="text-xl font-black text-slate-900">Mentorship Session Requested!</h4>
                    <p className="text-xs text-slate-600 max-w-md mx-auto">
                      Your request has been dispatched to <strong>{bookingSuccess.mentorName}</strong> ({bookingSuccess.company}). You will receive a Google Meet link on your registered email.
                    </p>
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-mono font-bold text-[#1e3a8a]">
                      Session Reference: {bookingSuccess.refCode}
                    </div>
                    <button
                      onClick={() => setSelectedMentor(null)}
                      className="px-6 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-xs uppercase cursor-pointer"
                    >
                      Close Window
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleBookingSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">Your Full Name</label>
                        <input
                          type="text"
                          required
                          value={mentorForm.studentName}
                          onChange={(e) => setMentorForm({ ...mentorForm, studentName: e.target.value })}
                          placeholder="Student Name"
                          className="w-full p-2.5 border border-slate-300 rounded-xl text-xs font-bold focus:ring-2 focus:ring-[#1e3a8a] outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">University Roll Number</label>
                        <input
                          type="text"
                          required
                          value={mentorForm.rollNumber}
                          onChange={(e) => setMentorForm({ ...mentorForm, rollNumber: e.target.value })}
                          placeholder="e.g. 1234567890"
                          className="w-full p-2.5 border border-slate-300 rounded-xl text-xs font-bold focus:ring-2 focus:ring-[#1e3a8a] outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">Mentorship Focus Topic</label>
                        <select
                          value={mentorForm.topic}
                          onChange={(e) => setMentorForm({ ...mentorForm, topic: e.target.value })}
                          className="w-full p-2.5 border border-slate-300 rounded-xl text-xs font-bold bg-white focus:ring-2 focus:ring-[#1e3a8a] outline-none"
                        >
                          <option>Technical Mock Interview & DSA</option>
                          <option>Resume Review & ATS Optimization</option>
                          <option>System Design & Cloud Architecture</option>
                          <option>Off-Campus Placement Strategy</option>
                          <option>Higher Studies Guidance (GATE/GRE)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">Preferred Date / Weekend</label>
                        <input
                          type="date"
                          value={mentorForm.date}
                          onChange={(e) => setMentorForm({ ...mentorForm, date: e.target.value })}
                          className="w-full p-2.5 border border-slate-300 rounded-xl text-xs font-bold focus:ring-2 focus:ring-[#1e3a8a] outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">Specific Questions or Target Companies</label>
                      <textarea
                        rows={3}
                        value={mentorForm.notes}
                        onChange={(e) => setMentorForm({ ...mentorForm, notes: e.target.value })}
                        placeholder="Briefly describe what you'd like to focus on during this 45-minute session..."
                        className="w-full p-2.5 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#1e3a8a] outline-none"
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3.5 bg-[#1e3a8a] hover:bg-blue-900 text-white font-black rounded-xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
                    >
                      <Send className="w-4 h-4 text-amber-400" /> Confirm & Send Mentorship Request
                    </button>
                  </form>
                )}
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  )
}
