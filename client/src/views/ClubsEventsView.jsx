// ================================================================
// STUDENT CLUBS, TECH FEST & HACKATHONS HUB VIEW
// ================================================================

import React, { useState } from "react"
import {
  Sparkles, Code, Cpu, Trophy, Users, Calendar, Award,
  CheckCircle2, ArrowRight, Send, AlertCircle, Zap, ShieldCheck
} from "lucide-react"

export default function ClubsEventsView() {
  const [activeTab, setActiveTab] = useState("innova")
  const [selectedEvent, setSelectedEvent] = useState(null)

  // Registration Form State
  const [regForm, setRegForm] = useState({
    eventName: "CodeStorm 24H Hackathon",
    teamName: "",
    leaderName: "",
    leaderRoll: "",
    email: "",
    phone: "",
    membersCount: "3",
    projectIdea: ""
  })
  const [regResult, setRegResult] = useState(null)

  const innovaEvents = [
    {
      id: "codestorm",
      title: "CodeStorm 24-Hour National Hackathon",
      category: "Software & AI",
      prize: "₹50,000 Cash Pool",
      teamSize: "2 - 4 Members",
      date: "OCT 14–15, 2026",
      venue: "High-Performance AI Computing Lab",
      image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=60",
      description: "Non-stop 24-hour sprint to build scalable AI solutions, blockchain dApps, and modern SaaS products tackling real-world challenges.",
      rules: ["Bring your own laptops & chargers", "All code must be committed to GitHub during the hackathon window", "Open-source APIs allowed"]
    },
    {
      id: "robowars",
      title: "RoboWars: 15kg Combat Robot Arena",
      category: "Robotics & Hardware",
      prize: "₹35,000 Cash Pool",
      teamSize: "2 - 5 Members",
      date: "OCT 15, 2026",
      venue: "Central Auditorium Combat Ring",
      image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop&q=60",
      description: "Design and maneuver destructive wired/wireless combat bots inside a reinforced polycarbonate hazard arena.",
      rules: ["Maximum weight: 15kg", "Pneumatic / spinning flippers allowed", "Standard 2.4GHz remote transceivers required"]
    },
    {
      id: "webcrafters",
      title: "WebCrafters: UI/UX & Frontend Sprint",
      category: "Design & Web",
      prize: "₹20,000 Cash Pool",
      teamSize: "1 - 2 Members",
      date: "OCT 14, 2026",
      venue: "Design Innovation Studio",
      image: "https://images.unsplash.com/photo-1542744094-3a31f272c490?w=800&auto=format&fit=crop&q=60",
      description: "Convert a surprise Figma design brief into a hyper-responsive, accessible React web application in 3 hours.",
      rules: ["Framework: React / Next.js / Tailwind", "Clean responsive layout for mobile and desktop", "Animation & accessibility scored"]
    },
    {
      id: "projectexpo",
      title: "InnovEx: B.Tech Capstone Project Exhibition",
      category: "Research & Hardware",
      prize: "₹25,000 Cash Pool",
      teamSize: "2 - 4 Members",
      date: "OCT 16, 2026",
      venue: "Central Library Corridor",
      image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=60",
      description: "Showcase physical engineering working prototypes, IoT gadgets, and renewable energy models before industry judges.",
      rules: ["Working physical demonstration mandatory", "Poster board with system architecture diagram", "5-minute live Q&A with jury"]
    }
  ]

  const clubs = [
    {
      name: "CodeSVIST (Official Coding Club)",
      lead: "President: Subhranil Jana",
      members: "280+ Active Coders",
      focus: "Competitive Programming (LeetCode/Codeforces), Web3, AI/ML Workshops & Weekly Coding Contests.",
      icon: Code,
      color: "bg-blue-500/10 text-blue-600 border-blue-200"
    },
    {
      name: "SVIST Robotics & Automation Society",
      lead: "President: A. Das",
      members: "150+ Engineers",
      focus: "Autonomous line-followers, Drone assembly, Microcontroller programming (ESP32/Arduino), and IoT.",
      icon: Cpu,
      color: "bg-emerald-500/10 text-emerald-600 border-emerald-200"
    },
    {
      name: "RHYTHM (Cultural & Performing Arts Club)",
      lead: "Secretary: P. Banerjee",
      members: "320+ Members",
      focus: "Music bands, Drama productions, Annual Fest Celebrations, Photography, and Fine Arts.",
      icon: Sparkles,
      color: "bg-purple-500/10 text-purple-600 border-purple-200"
    },
    {
      name: "SVIST Sports & E-Sports League",
      lead: "Convener: S. Bhunia",
      members: "200+ Athletes",
      focus: "Inter-College Cricket & Football Tournaments, Basketball Championships, and BGMI/Valorant E-Sports.",
      icon: Trophy,
      color: "bg-amber-500/10 text-amber-600 border-amber-200"
    }
  ]

  const handleRegSubmit = (e) => {
    e.preventDefault()
    const passCode = "INNOVA-2026-" + Math.random().toString(36).substring(2, 7).toUpperCase()
    setRegResult({
      passCode,
      teamName: regForm.teamName,
      eventName: regForm.eventName,
      leaderName: regForm.leaderName
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
              <Zap className="w-3.5 h-3.5" /> Campus Life & Student Societies
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
              INNOVA 2026 TechFest & Student Clubs
            </h1>
            <p className="mt-4 text-blue-100 text-base sm:text-lg font-medium leading-relaxed">
              Explore SVIST's vibrant extracurricular ecosystem. Register your team for the annual INNOVA 2026 TechFest, 24-hour CodeStorm hackathon, and robotics tournaments.
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-4 mb-10">
          <button
            onClick={() => setActiveTab("innova")}
            className={`flex items-center gap-2 px-6 py-3.5 rounded-2xl font-black text-sm transition-all shadow-sm cursor-pointer ${activeTab === 'innova' ? 'bg-[#1e3a8a] text-white shadow-lg scale-105' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'}`}
          >
            <Trophy className="w-4 h-4 text-amber-400" /> INNOVA 2026 TechFest
          </button>
          <button
            onClick={() => setActiveTab("clubs")}
            className={`flex items-center gap-2 px-6 py-3.5 rounded-2xl font-black text-sm transition-all shadow-sm cursor-pointer ${activeTab === 'clubs' ? 'bg-[#1e3a8a] text-white shadow-lg scale-105' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'}`}
          >
            <Users className="w-4 h-4 text-amber-400" /> Student Clubs & Societies
          </button>
        </div>

        {/* ================================================================ */}
        {/* INNOVA TECHFEST TAB */}
        {/* ================================================================ */}
        {activeTab === "innova" && (
          <div className="space-y-12">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {innovaEvents.map((evt) => (
                <div
                  key={evt.id}
                  className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-md hover:shadow-xl transition-all hover:-translate-y-1.5 flex flex-col justify-between group"
                >
                  <div>
                    <div className="relative h-56 bg-slate-900 overflow-hidden">
                      <img
                        src={evt.image}
                        alt={evt.title}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=60";
                        }}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                      />
                      <div className="absolute top-4 left-4 bg-amber-400 text-slate-950 px-3.5 py-1 rounded-full text-xs font-black shadow-md">
                        {evt.prize}
                      </div>
                      <div className="absolute bottom-4 left-4 bg-slate-900/80 backdrop-blur-md text-white px-3 py-1 rounded-xl text-xs font-bold">
                        {evt.date} • {evt.venue}
                      </div>
                    </div>

                    <div className="p-6 space-y-4">
                      <div>
                        <span className="text-[10px] font-black text-[#1e3a8a] uppercase tracking-widest block">{evt.category}</span>
                        <h3 className="text-xl font-black text-slate-900 mt-1">{evt.title}</h3>
                        <p className="text-xs text-slate-600 font-medium mt-2 leading-relaxed">{evt.description}</p>
                      </div>

                      <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1.5 text-xs text-slate-700">
                        <span className="font-bold text-slate-900 block text-[11px] uppercase tracking-wider">Tournament Rules:</span>
                        {evt.rules.map((r, rIdx) => (
                          <div key={rIdx} className="flex items-center gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                            <span>{r}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="p-6 pt-0">
                    <button
                      onClick={() => { setSelectedEvent(evt); setRegForm({ ...regForm, eventName: evt.title }); setRegResult(null); }}
                      className="w-full py-3.5 bg-[#1e3a8a] hover:bg-blue-900 text-white font-black rounded-xl text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-md cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4 text-amber-400" /> Register Team for {evt.title.split(":")[0]}
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* ================================================================ */}
        {/* STUDENT CLUBS TAB */}
        {/* ================================================================ */}
        {activeTab === "clubs" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {clubs.map((c, idx) => {
              const IconComp = c.icon
              return (
                <div key={idx} className="bg-white rounded-3xl p-8 border border-slate-200 shadow-md hover:shadow-xl transition-all space-y-4">
                  <div className="flex items-center gap-4">
                    <div className={`p-4 rounded-2xl border ${c.color}`}>
                      <IconComp className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-slate-900">{c.name}</h3>
                      <p className="text-xs text-slate-500 font-bold mt-0.5">{c.lead} • {c.members}</p>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                    {c.focus}
                  </p>
                  <div className="pt-2">
                    <button
                      onClick={() => { setSelectedEvent({ title: c.name }); setRegForm({ ...regForm, eventName: c.name + " Membership" }); setRegResult(null); }}
                      className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-black transition-colors cursor-pointer"
                    >
                      Join Club Society →
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Registration Modal */}
        {selectedEvent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border border-slate-200 animate-in zoom-in-95">
              
              <div className="bg-[#1e3a8a] text-white p-6 flex justify-between items-center">
                <div>
                  <span className="text-[10px] text-amber-300 font-bold uppercase tracking-wider">Registration Form</span>
                  <h3 className="text-lg font-black">{selectedEvent.title}</h3>
                </div>
                <button onClick={() => setSelectedEvent(null)} className="p-2 bg-white/10 hover:bg-red-500 rounded-full transition-colors cursor-pointer">
                  ✕
                </button>
              </div>

              <div className="p-6">
                {regResult ? (
                  <div className="text-center py-6 space-y-4">
                    <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                      <CheckCircle2 className="w-10 h-10" />
                    </div>
                    <h4 className="text-xl font-black text-slate-900">Registration Confirmed!</h4>
                    <p className="text-xs text-slate-600 max-w-md mx-auto">
                      Team <strong>{regResult.teamName}</strong> is registered for <strong>{regResult.eventName}</strong>. Bring this verification pass on the event day.
                    </p>
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-mono font-bold text-[#1e3a8a]">
                      Official Pass Code: {regResult.passCode}
                    </div>
                    <button
                      onClick={() => setSelectedEvent(null)}
                      className="px-6 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-xs uppercase cursor-pointer"
                    >
                      Done & Close
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleRegSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">Team Name</label>
                        <input
                          type="text"
                          required
                          value={regForm.teamName}
                          onChange={(e) => setRegForm({ ...regForm, teamName: e.target.value })}
                          placeholder="e.g. ByteBusters"
                          className="w-full p-2.5 border border-slate-300 rounded-xl text-xs font-bold focus:ring-2 focus:ring-[#1e3a8a] outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">Team Size</label>
                        <select
                          value={regForm.membersCount}
                          onChange={(e) => setRegForm({ ...regForm, membersCount: e.target.value })}
                          className="w-full p-2.5 border border-slate-300 rounded-xl text-xs font-bold bg-white focus:ring-2 focus:ring-[#1e3a8a] outline-none"
                        >
                          <option value="1">1 Member (Solo)</option>
                          <option value="2">2 Members</option>
                          <option value="3">3 Members</option>
                          <option value="4">4 Members</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">Team Leader Name</label>
                        <input
                          type="text"
                          required
                          value={regForm.leaderName}
                          onChange={(e) => setRegForm({ ...regForm, leaderName: e.target.value })}
                          placeholder="Leader Full Name"
                          className="w-full p-2.5 border border-slate-300 rounded-xl text-xs font-bold focus:ring-2 focus:ring-[#1e3a8a] outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">University Roll Number</label>
                        <input
                          type="text"
                          required
                          value={regForm.leaderRoll}
                          onChange={(e) => setRegForm({ ...regForm, leaderRoll: e.target.value })}
                          placeholder="e.g. 1234567890"
                          className="w-full p-2.5 border border-slate-300 rounded-xl text-xs font-bold focus:ring-2 focus:ring-[#1e3a8a] outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">Email Address</label>
                        <input
                          type="email"
                          required
                          value={regForm.email}
                          onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                          placeholder="email@domain.com"
                          className="w-full p-2.5 border border-slate-300 rounded-xl text-xs font-bold focus:ring-2 focus:ring-[#1e3a8a] outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">Contact Phone</label>
                        <input
                          type="tel"
                          required
                          value={regForm.phone}
                          onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
                          placeholder="+91 98300 XXXXX"
                          className="w-full p-2.5 border border-slate-300 rounded-xl text-xs font-bold focus:ring-2 focus:ring-[#1e3a8a] outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">Project Concept / Idea Abstract (Optional)</label>
                      <textarea
                        rows={2}
                        value={regForm.projectIdea}
                        onChange={(e) => setRegForm({ ...regForm, projectIdea: e.target.value })}
                        placeholder="Brief summary of your proposed project or bot design..."
                        className="w-full p-2.5 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#1e3a8a] outline-none"
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3.5 bg-[#1e3a8a] hover:bg-blue-900 text-white font-black rounded-xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
                    >
                      <Send className="w-4 h-4 text-amber-400" /> Submit Team Registration Pass
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
