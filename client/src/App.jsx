import React, { useState, useEffect } from "react"
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useParams } from "react-router-dom"
import {
  GraduationCap, Menu, X, ArrowRight, Award, Building2, Cpu, Radio, Cog, Building, BrainCircuit,
  Zap, Bell, Calendar, FileText, AlertCircle, MapPin, Phone, BookOpen, FlaskConical, ShieldAlert,
  TrendingUp, Briefcase, UserCheck, ShieldCheck, Landmark, Lock, Mail, LayoutDashboard, Users, Activity,
  Database, UserPlus, List, Trash2, Edit, Send, LogOut, CheckCircle, Percent, Link as LinkIcon, DownloadCloud, ChevronRight, BookOpenCheck, CalendarDays, Scale, Wallet, Banknote, Download, FileSpreadsheet
} from "lucide-react"

/* ============================================
   DATA CONSTANTS & PERMANENT IMAGES
   ============================================ */

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Academics", href: "/academics" },
  { name: "Admissions", href: "/admissions" },
  { name: "Departments", href: "/departments" },
  { name: "Placements", href: "/placements" },
]

const departments = [
  { 
    slug: "cse", name: "Computer Science & Engineering", shortName: "CSE", icon: Cpu, 
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80", 
    description: "Master programming, AI architectures, full-stack web development, and cloud computing.",
    labs: [
      { name: "Advanced Computing Lab", img: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=400&q=80" },
      { name: "AI & Server Architecture", img: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=400&q=80" }
    ]
  },
  { 
    slug: "ee", name: "Electrical Engineering", shortName: "EE", icon: Zap, 
    image: "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?auto=format&fit=crop&w=600&q=80", 
    description: "Study power systems, control architectures, and energy grids.",
    labs: [
      { name: "High Voltage & Circuits", img: "https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&w=400&q=80" },
      { name: "Electrical Machines Lab", img: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=400&q=80" }
    ]
  },
  { 
    slug: "ece", name: "Electronics & Communication", shortName: "ECE", icon: Radio, 
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80", 
    description: "Explore embedded systems, VLSI structural modeling, and telecommunications.",
    labs: [
      { name: "VLSI Design Lab", img: "https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=400&q=80" },
      { name: "Telecommunication Systems", img: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=400&q=80" }
    ]
  },
  { 
    slug: "me", name: "Mechanical Engineering", shortName: "ME", icon: Cog, 
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&q=80", 
    description: "Design and manufacture complex mechanical systems.",
    labs: [
      { name: "CAD/CAM Manufacturing", img: "https://images.unsplash.com/photo-1537462715879-360eeb61a0ad?auto=format&fit=crop&w=400&q=80" },
      { name: "Thermodynamics Lab", img: "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=400&q=80" }
    ]
  },
  { 
    slug: "ce", name: "Civil Engineering", shortName: "CE", icon: Building, 
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80", 
    description: "Build sustainable infrastructure, highways, and modern high-rises.",
    labs: [
      // NEW, permanent high-res construction URL below
      { name: "Concrete Technology", img: "https://images.unsplash.com/photo-1531834685032-c34bf0d84c77?auto=format&fit=crop&w=400&q=80" },
      { name: "Topography & Surveying", img: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=400&q=80" }
    ]
  },
  { 
    slug: "ai-ds", name: "AI & Data Science", shortName: "AI & DS", icon: BrainCircuit, 
    image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=600&q=80", 
    description: "Harness artificial intelligence to solve real-world complex problems.",
    labs: [
      { name: "Neural Networks Core", img: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=400&q=80" },
      { name: "Big Data Analytics Hub", img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=400&q=80" }
    ]
  },
]

const getNoticeIcon = (type) => {
  switch (type) {
    case "Urgent Announcement": return <AlertCircle className="h-5 w-5 text-red-500" />
    case "Campus Event": return <Calendar className="h-5 w-5 text-blue-500" />
    default: return <FileText className="h-5 w-5 text-slate-500" />
  }
}

const getNoticeBadge = (type) => {
  switch (type) {
    case "Urgent Announcement": return <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-700">Urgent</span>
    case "Campus Event": return <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-700">Event</span>
    default: return <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700">Academic</span>
  }
}

/* ============================================
   NAVIGATION COMPONENT 
   ============================================ */

function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#1e3a8a] shadow-lg border-b border-blue-900">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
            <div className="bg-white p-1 rounded-full shadow-md">
               <img src="/svist-logo.png" alt="SVIST Logo" className="h-12 w-12 object-contain" />
            </div>
            <div className="flex flex-col hidden sm:flex">
              <span className="text-xl font-black tracking-tight text-white leading-tight">SVIST</span>
              <span className="text-[10px] font-medium text-amber-400 uppercase tracking-widest leading-tight">Kolkata</span>
            </div>
          </Link>
          <div className="hidden items-center gap-1 xl:gap-4 lg:flex">
            {navLinks.map((link) => (
              <Link 
                key={link.name} to={link.href} 
                className={`rounded-md px-3 py-2 text-sm font-bold transition-colors ${location.pathname === link.href ? 'text-amber-400 bg-white/10' : 'text-white/90 hover:bg-white/10 hover:text-amber-400'}`}
              >
                {link.name}
              </Link>
            ))}
            <div className="flex gap-2 ml-4 border-l border-white/20 pl-4">
              <Link to="/student-login" className="rounded-md bg-white/10 border border-white/30 px-4 py-2 text-sm font-bold text-white shadow-sm transition-all hover:bg-white hover:text-[#1e3a8a]">Student Login</Link>
              <Link to="/hod-login" className="rounded-md bg-amber-500 px-4 py-2 text-sm font-bold text-slate-900 shadow-sm transition-all hover:bg-amber-400 hover:shadow-md">HOD Login</Link>
              <Link to="/admin-login" className="rounded-md bg-slate-900 px-4 py-2 text-sm font-bold text-white shadow-sm transition-all hover:bg-slate-800 hover:shadow-md border border-slate-700">Admin DB</Link>
            </div>
          </div>
          <button onClick={() => setIsOpen(!isOpen)} className="rounded-lg p-2 text-white transition-colors hover:bg-white/10 lg:hidden">
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>
      
      {/* MOBILE NAVIGATION MENU */}
      {isOpen && (
        <div className="lg:hidden bg-[#1e3a8a] border-t border-blue-800 pb-4 px-4 shadow-xl absolute w-full left-0 top-20">
           <div className="flex flex-col space-y-2 mt-2">
             {navLinks.map((link) => (
                <Link key={link.name} to={link.href} onClick={() => setIsOpen(false)} className="text-white font-bold py-2 border-b border-blue-800">{link.name}</Link>
             ))}
             <Link to="/student-login" onClick={() => setIsOpen(false)} className="text-amber-400 font-bold py-2">Student Login</Link>
             <Link to="/hod-login" onClick={() => setIsOpen(false)} className="text-amber-400 font-bold py-2 border-t border-blue-800">HOD Login</Link>
             <Link to="/admin-login" onClick={() => setIsOpen(false)} className="text-white font-bold py-2 border-t border-blue-800">Admin DB</Link>
           </div>
        </div>
      )}
    </nav>
  )
}

/* ============================================
   CONTENT PAGES & SECTIONS
   ============================================ */

function HomeView() {
  return (
    <div className="animate-in fade-in duration-500">
      <HeroSection />
      <WhySVISTSection />
      <DepartmentsSection />
      <NoticeBoard />
    </div>
  )
}

function HeroSection() {
  const [activeModal, setActiveModal] = useState(null);

  return (
    <section className="relative flex min-h-[90vh] items-center justify-center pt-20">
      
      {/* MODALS FOR BROCHURE AND FEES SCOPED CORRECTLY */}
      {activeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-200">
              <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50">
                <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                  {activeModal === 'fees' ? <FileSpreadsheet className="text-emerald-500"/> : <DownloadCloud className="text-blue-500"/>}
                  {activeModal === 'fees' ? 'B.Tech Fee Structure (2026-27)' : 'Download Official Brochure'}
                </h3>
                <button onClick={() => setActiveModal(null)} className="p-2 bg-white hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-full transition-colors border border-slate-200"><X className="w-5 h-5" /></button>
              </div>
              <div className="p-8">
                {activeModal === 'fees' ? (
                  <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-900 text-white">
                          <th className="p-4 text-xs font-bold uppercase tracking-wider">Fee Category</th>
                          <th className="p-4 text-xs font-bold uppercase tracking-wider text-right">Amount (INR)</th>
                        </tr>
                      </thead>
                      <tbody className="text-sm text-slate-700 font-medium">
                        <tr className="border-b border-slate-100 hover:bg-slate-50">
                          <td className="p-4 border-r border-slate-100">Admission Fee (One Time)</td><td className="p-4 text-right">₹30,000</td>
                        </tr>
                        <tr className="border-b border-slate-100 hover:bg-slate-50">
                          <td className="p-4 border-r border-slate-100">Tuition Fee (Per Semester)</td><td className="p-4 text-right">₹45,000</td>
                        </tr>
                        <tr className="border-b border-slate-100 hover:bg-slate-50">
                          <td className="p-4 border-r border-slate-100">Library & Lab Access (Per Semester)</td><td className="p-4 text-right">₹5,000</td>
                        </tr>
                        <tr className="bg-emerald-50 font-black text-emerald-800">
                          <td className="p-4 border-r border-emerald-100">Total 1st Semester Payable</td><td className="p-4 text-right">₹80,000</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <BookOpen className="w-16 h-16 text-blue-500 mx-auto mb-4" />
                    <h4 className="text-xl font-bold text-slate-900 mb-2">SVIST Engineering Prospectus 2026</h4>
                    <p className="text-slate-500 mb-6">Comprehensive details on syllabus, placement statistics, and campus infrastructure.</p>
                    <button onClick={() => {alert("Brochure downloaded successfully!"); setActiveModal(null);}} className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg">
                      <Download className="w-5 h-5"/> Download PDF (12MB)
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
      )}

      <div className="absolute inset-0 z-0">
        <img src="/pic51.webp" alt="SVIST Campus Building" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0f172a]/95 via-[#1e3a8a]/80 to-[#0f172a]/95" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-wrap items-center justify-center gap-4">
          <div className="flex items-center gap-2 rounded-full bg-white/10 px-5 py-2 backdrop-blur-md border border-white/20 shadow-lg">
            <Award className="h-5 w-5 text-amber-400" />
            <span className="text-sm font-bold text-white tracking-wide">NAAC Accredited & AICTE Approved</span>
          </div>
        </div>
        <h1 className="mx-auto max-w-5xl text-4xl font-black tracking-tight text-white sm:text-5xl md:text-7xl leading-tight">
          Swami Vivekananda Institute of <br/>
          <span className="text-amber-400 drop-shadow-lg">Science & Technology</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-white/90 sm:text-xl font-medium">
          Empowering future engineers with world-class education, high-performance computing labs, and industry-focused curriculum in Kolkata.
        </p>
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/admissions" className="flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-8 py-4 text-lg font-bold text-slate-900 shadow-xl transition-transform hover:scale-105 w-full sm:w-auto">
            Apply Now <ArrowRight className="h-6 w-6" />
          </Link>
          <button onClick={() => setActiveModal('brochure')} className="flex items-center justify-center gap-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 px-6 py-4 text-sm md:text-lg font-bold text-white shadow-xl transition-colors hover:bg-white/20 w-full sm:w-auto">
            <DownloadCloud className="w-5 h-5"/> Brochure
          </button>
          <button onClick={() => setActiveModal('fees')} className="flex items-center justify-center gap-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 px-6 py-4 text-sm md:text-lg font-bold text-white shadow-xl transition-colors hover:bg-white/20 w-full sm:w-auto">
            <FileSpreadsheet className="w-5 h-5"/> Fees Structure
          </button>
        </div>
      </div>
    </section>
  )
}

function WhySVISTSection() {
  const features = [
    { title: "Job Oriented Courses", desc: "Job Oriented Courses Offered", icon: TrendingUp, bg: "bg-slate-500", link: "/academics" },
    { title: "Advanced Laboratories", desc: "Advanced Laboratories as per syllabus", icon: FlaskConical, bg: "bg-slate-800", link: "/departments" },
    { title: "Excellent Placement", desc: "Excellent Placement Record", icon: Briefcase, bg: "bg-amber-500", textDark: true, link: "/placements" },
    { title: "Experienced Faculty", desc: "Highly Qualified and Industry Experienced Faculty Members", icon: UserCheck, bg: "bg-amber-500", textDark: true, wide: true, link: "/departments" },
    { title: "Ragging Free Campus", desc: "Zero Tolerance to Ragging", icon: ShieldCheck, bg: "bg-slate-600", link: "/academics" },
    { title: "Centralized Library", desc: "Centralized Library and Book Bank Facility", icon: BookOpen, bg: "bg-slate-900", link: "/academics" },
    { title: "Scholarship Grants", desc: "Government & Institutional Financial Aid", icon: Landmark, bg: "bg-slate-400", link: "/scholarships" },
  ];

  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-[#1e3a8a] sm:text-4xl leading-tight">
            Why Swami Vivekananda Institute of Science & Technology is the Best B.Tech College in Kolkata ?
          </h2>
          <p className="mt-6 text-slate-600 leading-relaxed text-lg">
            Welcome to Swami Vivekananda Institute of Science & Technology (SVIST), acclaimed as the best B.Tech college in Kolkata. Our distinction arises from a commitment to excellence evident in every aspect of our institution. 
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          {features.map((feature, idx) => (
            <Link to={feature.link} key={idx} className={`${feature.bg} ${feature.wide ? 'md:col-span-2' : ''} p-10 flex flex-col items-center justify-center text-center transition-transform hover:scale-[1.02] cursor-pointer shadow-sm min-h-[220px] group`}>
              <feature.icon className={`h-14 w-14 mb-4 transition-transform group-hover:-translate-y-2 ${feature.textDark ? 'text-slate-900' : 'text-white'}`} />
              <h3 className={`text-xl font-bold mb-2 ${feature.textDark ? 'text-slate-900' : 'text-white'}`}>{feature.title}</h3>
              <p className={`text-sm font-medium ${feature.textDark ? 'text-slate-800' : 'text-slate-200'}`}>{feature.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

function DepartmentsSection() {
  return (
    <section className="bg-slate-50 py-24 border-t border-slate-200">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="inline-block rounded-full bg-[#1e3a8a]/10 px-4 py-1.5 text-sm font-black tracking-wider text-[#1e3a8a] uppercase">Academics</span>
          <h2 className="mt-4 text-3xl font-black text-slate-900 sm:text-4xl md:text-5xl tracking-tight">Our Core Departments</h2>
        </div>
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {departments.map((dept) => (
            <Link to={`/departments/${dept.slug}`} key={dept.slug} className="group relative overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-500 border border-slate-200 block hover:-translate-y-2 hover:shadow-2xl">
              <div className="relative h-64 overflow-hidden bg-slate-900">
                <img src={dept.image} alt={dept.name} className="h-full w-full object-cover opacity-80 transition-transform duration-700 group-hover:scale-110 group-hover:opacity-100" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/90 via-[#0f172a]/20 to-transparent" />
                <div className="absolute bottom-6 left-6 z-20">
                   <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl inline-block transition-transform group-hover:scale-110 group-hover:bg-[#1e3a8a]/80">
                      <dept.icon className="h-10 w-10 text-amber-400" />
                   </div>
                </div>
                <div className="absolute top-4 right-4 z-20 rounded-full bg-white/20 px-4 py-1.5 text-sm font-black tracking-wide text-white backdrop-blur-md shadow-sm border border-white/20">
                   {dept.shortName}
                </div>
              </div>
              <div className="p-6 relative z-10 bg-white">
                <h3 className="text-xl font-black text-slate-900 transition-colors group-hover:text-[#1e3a8a]">{dept.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600 font-medium line-clamp-2">{dept.description}</p>
                <div className="mt-4 flex items-center text-sm font-bold text-[#1e3a8a]">
                  Explore Syllabus & Faculty <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-2" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

function NoticeBoard() {
  const [liveNotices, setLiveNotices] = useState([]);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const response = await fetch("https://svist-college-portal.onrender.com/api/notices");
        const data = await response.json();
        setLiveNotices(data);
      } catch (error) { console.error("Failed to fetch live notices"); }
    };
    fetchNotices();
  }, []);

  return (
    <section className="bg-white py-24 border-t border-slate-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-4 border-b border-slate-300 pb-6 mb-6">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1e3a8a]/10 shadow-inner relative">
                <Bell className="h-7 w-7 text-[#1e3a8a]" />
                <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white border-2 border-slate-50">{liveNotices.length}</span>
              </div>
              <div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Notice Board</h2>
                <p className="text-sm font-medium text-slate-500 mt-1 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Live Sync Active
                </p>
              </div>
            </div>
            <div className="space-y-4 overflow-y-auto max-h-[500px] pr-2">
              {liveNotices.length === 0 ? (
                <div className="py-12 text-center text-slate-400">
                  <FileText className="w-12 h-12 mx-auto mb-3 opacity-20" />
                  <p className="font-medium text-sm">No active broadcasts found in Atlas.</p>
                </div>
              ) : (
                liveNotices.map((notice) => (
                  <div key={notice._id} className="group flex gap-4 rounded-2xl border border-slate-200 bg-white p-5 transition-all hover:border-[#1e3a8a] hover:shadow-lg cursor-pointer flex-col sm:flex-row">
                    <div className="flex gap-4 flex-1">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-50 border border-slate-100">
                        {getNoticeIcon(notice.category)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                          {getNoticeBadge(notice.category)}
                          <p className="text-xs font-bold text-slate-400">{notice.date}</p>
                        </div>
                        <h3 className="text-base font-bold text-slate-900 group-hover:text-[#1e3a8a] leading-tight mb-2 mt-2">{notice.title}</h3>
                        <p className="text-sm font-medium text-slate-600 leading-relaxed">{notice.description}</p>
                      </div>
                    </div>
                    {notice.documentUrl && (
                      <a href={notice.documentUrl} target="_blank" rel="noreferrer" className="shrink-0 mt-4 sm:mt-0 px-4 py-2 bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white rounded-lg flex items-center gap-2 font-bold text-xs transition-colors self-start border border-blue-100 shadow-sm">
                        <DownloadCloud className="w-4 h-4"/> View Doc
                      </a>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Quick Resources</h2>
            <p className="mt-2 text-slate-600 font-medium">Access your portals and administrative links</p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <Link to="/student-login" className="group rounded-2xl border border-slate-200 bg-white p-5 transition-all hover:border-[#1e3a8a] hover:shadow-md block">
                <h3 className="font-bold text-slate-900 group-hover:text-[#1e3a8a] text-lg">Student Portal</h3>
                <p className="mt-1 text-sm font-medium text-slate-600">Access LMS & Results</p>
              </Link>
              <Link to="/placements" className="group rounded-2xl border border-slate-200 bg-white p-5 transition-all hover:border-[#1e3a8a] hover:shadow-md block">
                <h3 className="font-bold text-slate-900 group-hover:text-[#1e3a8a] text-lg">Placement Cell</h3>
                <p className="mt-1 text-sm font-medium text-slate-600">View career opportunities</p>
              </Link>
            </div>
            <div className="mt-8 overflow-hidden rounded-2xl bg-[#1e3a8a] p-5 shadow-lg border border-blue-800 relative">
              <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
              <div className="flex items-center gap-4 relative z-10">
                <AlertCircle className="h-6 w-6 shrink-0 text-amber-400 animate-pulse" />
                <div className="overflow-hidden">
                  <p className="animate-marquee whitespace-nowrap text-sm font-bold text-white tracking-wide">
                    ADMISSIONS OPEN FOR 2026-27 | Helpline: 1800-XXX-XXXX | 100% Placement Assistance | Engineering & Management Programs Available
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function AcademicsView() {
  const [activeModal, setActiveModal] = useState(null);

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20 animate-in fade-in duration-500 relative">
       {activeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-200">
              <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50">
                <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                  {activeModal === 'calendar' ? <CalendarDays className="text-emerald-500"/> : <Scale className="text-purple-500"/>}
                  {activeModal === 'calendar' ? 'Academic Calendar 2026-27' : 'Rules & Regulations'}
                </h3>
                <button onClick={() => setActiveModal(null)} className="p-2 bg-white hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-full transition-colors border border-slate-200"><X className="w-5 h-5" /></button>
              </div>
              <div className="p-8 max-h-[60vh] overflow-y-auto">
                {activeModal === 'calendar' ? (
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

       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-12 shadow-sm border border-slate-200 mb-8">
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
                <a href="https://makautwb.ac.in/page.php?id=314" target="_blank" rel="noreferrer" className="p-6 border border-slate-200 rounded-xl hover:shadow-lg transition-all hover:-translate-y-1 hover:border-amber-400 cursor-pointer group block">
                   <BookOpenCheck className="w-8 h-8 text-amber-500 mb-4 group-hover:scale-110 transition-transform" />
                   <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">Syllabus Archive <LinkIcon className="w-4 h-4 text-slate-400"/></h3>
                   <p className="text-sm text-slate-500 mt-2">Download official MAKAUT syllabus PDFs for all departments.</p>
                </a>
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
       </div>
    </div>
  )
}

function ScholarshipsView() {
  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20 animate-in fade-in duration-500">
       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#1e3a8a] rounded-3xl p-12 shadow-xl border border-blue-800 text-white mb-12 overflow-hidden relative">
             <div className="absolute top-0 right-0 opacity-10 pointer-events-none">
                <Landmark className="w-96 h-96 -mt-20 -mr-20" />
             </div>
             <div className="relative z-10">
               <h1 className="text-4xl md:text-5xl font-black mb-4">Scholarships & Financial Aid</h1>
               <p className="text-xl text-blue-200 max-w-2xl font-medium">Empowering meritorious students through comprehensive financial support systems.</p>
             </div>
          </div>

          <div className="space-y-12">
             <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="bg-emerald-500 p-6 flex items-center gap-4 text-white">
                   <Banknote className="w-8 h-8" />
                   <h2 className="text-2xl font-black">State & Government Grants</h2>
                </div>
                <div className="p-8 md:p-12">
                   <h3 className="text-2xl font-bold text-slate-900 mb-2">Swami Vivekananda Merit-cum-Means (SVMCM)</h3>
                   <p className="text-slate-600 mb-6 max-w-3xl">A flagship scholarship program provided by the Government of West Bengal to assist meritorious students belonging to economically backward families in the state.</p>
                   
                   <div className="grid md:grid-cols-2 gap-6 mb-8">
                     <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                        <h4 className="font-bold text-slate-900 mb-3 border-b border-slate-200 pb-2">Eligibility Criteria</h4>
                        <ul className="space-y-2 text-sm text-slate-700">
                          <li>• Domicile of West Bengal.</li>
                          <li>• Minimum 60% marks in the last qualifying exam.</li>
                          <li>• Family income must not exceed ₹2,50,000 per annum.</li>
                        </ul>
                     </div>
                     <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                        <h4 className="font-bold text-slate-900 mb-3 border-b border-slate-200 pb-2">Grant Amount</h4>
                        <p className="text-3xl font-black text-emerald-600">₹60,000 <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">/ Year</span></p>
                        <p className="text-sm text-slate-500 mt-2">Disbursed directly to the student's bank account.</p>
                     </div>
                   </div>
                   <a href="https://svmcm.wbhed.gov.in/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 font-bold px-6 py-3 rounded-lg hover:bg-emerald-500 hover:text-white transition-colors">
                     Apply on Official Portal <ArrowRight className="w-4 h-4"/>
                   </a>
                </div>
             </div>

             <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="bg-amber-500 p-6 flex items-center gap-4 text-slate-900">
                   <Award className="w-8 h-8" />
                   <h2 className="text-2xl font-black">Institutional Academic Excellence Awards</h2>
                </div>
                <div className="p-8 md:p-12">
                   <h3 className="text-2xl font-bold text-slate-900 mb-2">SVIST Chairman's Waiver</h3>
                   <p className="text-slate-600 mb-6 max-w-3xl">A dedicated institutional fund designed to reward exceptional academic performance during the WBJEE/JEE Mains entrance examinations.</p>
                   
                   <div className="grid md:grid-cols-2 gap-6 mb-8">
                     <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                        <h4 className="font-bold text-slate-900 mb-3 border-b border-slate-200 pb-2">Waiver Tiers (WBJEE Rank)</h4>
                        <ul className="space-y-2 text-sm text-slate-700">
                          <li>• Rank 1 - 5000: <strong className="text-amber-600">100% Tuition Waiver</strong></li>
                          <li>• Rank 5001 - 10000: <strong className="text-amber-600">50% Tuition Waiver</strong></li>
                          <li>• Semester Toppers: <strong className="text-amber-600">₹10,000 Reward</strong></li>
                        </ul>
                     </div>
                     <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 flex flex-col justify-center items-center text-center">
                        <Wallet className="w-12 h-12 text-slate-400 mb-3" />
                        <p className="text-sm font-bold text-slate-500">Contact the SVIST Admissions Cell directly during counseling to claim this institutional waiver.</p>
                     </div>
                   </div>
                </div>
             </div>
          </div>
       </div>
    </div>
  )
}

function AdmissionsView() {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", department: "Computer Science & Engineering", rank: "" });
  const [status, setStatus] = useState("");

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Submitting to Admin Database...");
    try {
      const response = await fetch("https://svist-college-portal.onrender.com/api/admissions", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData)
      });
      if (response.ok) {
        setStatus("SUCCESS: Application Sent to Admin Cell.");
        setFormData({ name: "", email: "", phone: "", department: "Computer Science & Engineering", rank: "" });
        setTimeout(() => setStatus(""), 5000);
      } else {
        setStatus("ERROR: Application failed to submit.");
      }
    } catch (err) {
      console.error(err);
      setStatus("ERROR: Network Connection Failed.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20 animate-in fade-in duration-500">
       <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-12 shadow-sm border border-slate-200 relative">
             <div className="text-center mb-10">
                <div className="bg-amber-100 p-4 rounded-full inline-block mb-4">
                   <FileText className="w-10 h-10 text-amber-600" />
                </div>
                <h1 className="text-4xl font-black text-slate-900">B.Tech Admissions 2026-27</h1>
                <p className="text-slate-500 font-medium mt-2">Join the next generation of technical innovators.</p>
             </div>
             
             {status && (
                <div className={`p-4 mb-6 rounded-lg text-center font-bold border ${status.includes("SUCCESS") ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-amber-50 text-amber-700 border-amber-200"}`}>
                   {status}
                </div>
             )}

             <form className="space-y-6" onSubmit={handleSubmit}>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                   <label className="block text-sm font-bold text-slate-700 mb-2">Candidate Full Name</label>
                   <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-[#1e3a8a] focus:ring-2 focus:ring-[#1e3a8a] outline-none" />
                 </div>
                 <div>
                   <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                   <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-[#1e3a8a] focus:ring-2 focus:ring-[#1e3a8a] outline-none" />
                 </div>
                 <div>
                   <label className="block text-sm font-bold text-slate-700 mb-2">Phone Number</label>
                   <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-[#1e3a8a] focus:ring-2 focus:ring-[#1e3a8a] outline-none" />
                 </div>
                 <div>
                   <label className="block text-sm font-bold text-slate-700 mb-2">Preferred Department</label>
                   <select name="department" value={formData.department} onChange={handleChange} className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-[#1e3a8a] focus:ring-2 focus:ring-[#1e3a8a] outline-none bg-white">
                     <option>Computer Science & Engineering</option>
                     <option>Artificial Intelligence & Data Science</option>
                     <option>Electronics & Communication</option>
                     <option>Electrical Engineering</option>
                     <option>Mechanical Engineering</option>
                     <option>Civil Engineering</option>
                   </select>
                 </div>
               </div>
               <div>
                 <label className="block text-sm font-bold text-slate-700 mb-2">WBJEE / JEE Main Rank (Approximate)</label>
                 <input type="text" name="rank" value={formData.rank} onChange={handleChange} required className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-[#1e3a8a] focus:ring-2 focus:ring-[#1e3a8a] outline-none" />
               </div>
               <button type="submit" className="w-full rounded-xl bg-amber-500 py-4 text-center font-black text-slate-900 text-lg hover:bg-amber-400 transition-colors shadow-lg">
                 Submit Application to Admin DB
               </button>
             </form>
          </div>
       </div>
    </div>
  )
}

function PlacementsView() {
  const recruiters = ["TCS", "Cognizant", "Wipro", "Infosys", "IBM", "Tech Mahindra", "Amazon", "Capgemini", "Accenture", "L&T"];
  
  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20 animate-in fade-in duration-500">
       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#1e3a8a] rounded-3xl p-12 shadow-xl border border-blue-800 text-white mb-8 overflow-hidden relative">
             <div className="absolute top-0 right-0 opacity-10 pointer-events-none">
                <Briefcase className="w-96 h-96 -mt-20 -mr-20" />
             </div>
             <div className="relative z-10">
               <h1 className="text-4xl md:text-5xl font-black mb-4">Training & Placement Cell</h1>
               <p className="text-xl text-blue-200 max-w-2xl font-medium">Achieving excellence with a consistent track record. We empower students to secure elite software engineering roles at top-tier multinational corporations.</p>
             </div>
          </div>

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

function DepartmentDetailView() {
  const { slug } = useParams();
  const [activeModal, setActiveModal] = useState(null);
  const [facultyRoster, setFacultyRoster] = useState([]);
  const dept = departments.find(d => d.slug === slug);

  useEffect(() => {
    if(!dept) return;
    const fetchFaculty = async () => {
      try {
        const response = await fetch("https://svist-college-portal.onrender.com/api/faculty");
        const data = await response.json();
        const deptFaculty = data.filter(f => f.department === dept.shortName);
        setFacultyRoster(deptFaculty);
      } catch(err) { console.error(err); }
    }
    fetchFaculty();
  }, [dept]);

  if (!dept) return <PageTemplate title="Department Not Found" icon={AlertCircle} description="The requested department does not exist in our system." />;

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20 animate-in fade-in duration-500 relative">
       
       {activeModal === 'faculty' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-200">
              <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50">
                <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                  <Users className="text-[#1e3a8a]"/> {dept.shortName} Faculty Roster
                </h3>
                <button onClick={() => setActiveModal(null)} className="p-2 bg-white hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-full transition-colors border border-slate-200"><X className="w-5 h-5" /></button>
              </div>
              <div className="p-8 max-h-[60vh] overflow-y-auto">
                 {facultyRoster.length === 0 ? (
                    <div className="text-center py-10">
                       <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                       <p className="text-slate-500 font-medium">No faculty members assigned yet.</p>
                       <p className="text-xs font-bold text-slate-400 uppercase mt-1">Admin must inject records via Database.</p>
                    </div>
                 ) : (
                    <ul className="space-y-4">
                      {facultyRoster.map((fac) => (
                        <li key={fac._id} className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 border border-slate-200 rounded-xl hover:shadow-md transition-shadow">
                           <div className="w-12 h-12 shrink-0 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-black">
                             {fac.designation === "HOD" ? "HOD" : "AP"}
                           </div>
                           <div>
                             <p className="font-bold text-slate-900 text-lg">{fac.name}</p>
                             <p className="text-slate-500 text-sm">{fac.designation}, {fac.qualification}</p>
                           </div>
                        </li>
                      ))}
                    </ul>
                 )}
              </div>
            </div>
          </div>
       )}

       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative h-64 md:h-80 rounded-3xl overflow-hidden mb-8 shadow-xl">
             <img src={dept.image} alt={dept.name} className="w-full h-full object-cover" />
             <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent"></div>
             <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 flex items-center gap-4 md:gap-6">
                <div className="bg-amber-400 p-3 md:p-4 rounded-2xl shadow-lg hidden sm:block">
                   <dept.icon className="w-10 h-10 md:w-12 md:h-12 text-slate-900" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-black text-white leading-tight">{dept.name}</h1>
                  <p className="text-amber-400 font-bold tracking-widest mt-1 text-sm md:text-base">DEPARTMENT CODE: {dept.shortName}</p>
                </div>
             </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
             <div className="md:col-span-2 space-y-8">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                   <h2 className="text-2xl font-bold text-slate-900 mb-4">About the Department</h2>
                   <p className="text-slate-600 leading-relaxed mb-4">{dept.description} We focus on intense practical implementation alongside rigorous theoretical understanding.</p>
                   <p className="text-slate-600 leading-relaxed">Students are encouraged to engage in modern frameworks, robust design, and deep system architecture optimization under the guidance of our expert faculty.</p>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                   <h2 className="text-2xl font-bold text-slate-900 mb-6 border-b border-slate-100 pb-3 flex items-center gap-2"><FlaskConical className="text-amber-500" /> Advanced Laboratories</h2>
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {dept.labs.map((lab, idx) => (
                        <div key={idx} className="relative group overflow-hidden rounded-xl h-48 border border-slate-200 shadow-sm cursor-pointer">
                           <img src={lab.img} alt={lab.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                           <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-transparent"></div>
                           <div className="absolute bottom-4 left-4 right-4">
                             <p className="text-white font-bold text-sm tracking-wide">{lab.name}</p>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
             </div>

             <div className="space-y-8">
                <div className="bg-[#1e3a8a] text-white p-8 rounded-2xl shadow-lg sticky top-24">
                   <h2 className="text-xl font-bold mb-6 border-b border-blue-800 pb-3">Quick Links</h2>
                   <ul className="space-y-5 font-medium">
                      <li onClick={() => setActiveModal('faculty')} className="flex items-center gap-3 hover:text-amber-400 cursor-pointer transition-colors group">
                        <div className="bg-white/10 p-2 rounded group-hover:bg-amber-400/20"><Users className="w-4 h-4"/></div> Faculty Roster
                      </li>
                      <li>
                        <a href="https://makautwb.ac.in/page.php?id=314" target="_blank" rel="noreferrer" className="flex items-center gap-3 hover:text-amber-400 cursor-pointer transition-colors group">
                          <div className="bg-white/10 p-2 rounded group-hover:bg-amber-400/20"><DownloadCloud className="w-4 h-4"/></div> Syllabus PDF <LinkIcon className="w-3 h-3 opacity-50"/>
                        </a>
                      </li>
                      <li onClick={() => alert("Redirecting to Alumni Network...")} className="flex items-center gap-3 hover:text-amber-400 cursor-pointer transition-colors group">
                        <div className="bg-white/10 p-2 rounded group-hover:bg-amber-400/20"><GraduationCap className="w-4 h-4"/></div> Alumni Network
                      </li>
                   </ul>
                </div>
             </div>
          </div>
       </div>
    </div>
  )
}

function StudentLoginView() {
  const [token, setToken] = useState("");
  const [studentData, setStudentData] = useState(null);
  const [loginData, setLoginData] = useState({ rollNumber: "", password: "" });
  const [error, setError] = useState("");
  const [activeModal, setActiveModal] = useState(null); 

  const handleChange = (e) => setLoginData({ ...loginData, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await fetch("https://svist-college-portal.onrender.com/api/students/login", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(loginData),
      });
      const data = await response.json();
      
      if (response.ok) {
        setToken(data.token);
        setStudentData(data.studentData);
      } else {
        setError(data.error || "Login Failed.");
      }
    } catch (err) {
      setError("Network error. Bridge to Atlas failed.");
      console.error(err);
    }
  };

  const handleLogout = () => {
    setToken(""); setStudentData(null); setLoginData({ rollNumber: "", password: "" }); setActiveModal(null);
  };

  if (token && studentData) {
    return (
      <div className="min-h-screen bg-slate-50 pt-32 pb-20 animate-in fade-in duration-500">
        <div className="mx-auto max-w-5xl px-4 relative">
          
          {activeModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-200">
                <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50">
                  <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                    {activeModal === 'attendance' ? <Activity className="text-emerald-500"/> : <Calendar className="text-purple-500"/>}
                    {activeModal === 'attendance' ? 'Attendance Overview' : 'Class Routine Matrix'}
                  </h3>
                  <button onClick={() => setActiveModal(null)} className="p-2 bg-white hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-full transition-colors border border-slate-200">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-8">
                  {activeModal === 'attendance' ? (
                    <div>
                      <div className="flex items-center justify-between mb-3">
                         <span className="font-bold text-slate-700 text-lg">Overall Synchronization</span>
                         <span className="font-black text-emerald-600 text-2xl">{studentData.attendance}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-4 mb-8 overflow-hidden shadow-inner">
                         <div className="bg-emerald-500 h-4 rounded-full relative overflow-hidden transition-all duration-1000" style={{ width: `${studentData.attendance}%` }}>
                           <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                         </div>
                      </div>
                      <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 text-center">
                         <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Status</p>
                         <p className={`text-xl font-black ${studentData.attendance >= 75 ? 'text-emerald-600' : 'text-red-600'}`}>
                           {studentData.attendance >= 75 ? "Eligible for Examinations" : "Warning: Below 75% Threshold"}
                         </p>
                      </div>
                    </div>
                  ) : (
                    <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-slate-900 text-white">
                            <th className="p-4 text-xs font-bold uppercase tracking-wider">Day</th>
                            <th className="p-4 text-xs font-bold uppercase tracking-wider">10:00 AM - 12:00 PM</th>
                            <th className="p-4 text-xs font-bold uppercase tracking-wider">01:00 PM - 03:00 PM</th>
                          </tr>
                        </thead>
                        <tbody className="text-sm">
                          <tr className="border-b border-slate-100 bg-white hover:bg-slate-50 transition-colors">
                            <td className="p-4 font-black text-slate-900 border-r border-slate-100">Monday</td>
                            <td className="p-4 text-slate-700 font-medium bg-indigo-50/50">Discrete Mathematics</td>
                            <td className="p-4 text-slate-700 font-medium">Economics for Engineers</td>
                          </tr>
                          <tr className="border-b border-slate-100 bg-white hover:bg-slate-50 transition-colors">
                            <td className="p-4 font-black text-slate-900 border-r border-slate-100">Tuesday</td>
                            <td className="p-4 text-slate-700 font-medium bg-amber-50/50">Computer Organization & Arch.</td>
                            <td className="p-4 text-slate-700 font-medium text-[#1e3a8a] font-bold">COA Practical Lab</td>
                          </tr>
                          <tr className="border-b border-slate-100 bg-white hover:bg-slate-50 transition-colors">
                            <td className="p-4 font-black text-slate-900 border-r border-slate-100">Wednesday</td>
                            <td className="p-4 text-slate-700 font-medium">Design & Analysis of Algorithms</td>
                            <td className="p-4 text-slate-700 font-bold text-[#1e3a8a]">DAA Practical Lab</td>
                          </tr>
                          <tr className="border-b border-slate-100 bg-white hover:bg-slate-50 transition-colors">
                            <td className="p-4 font-black text-slate-900 border-r border-slate-100">Thursday</td>
                            <td className="p-4 text-slate-700 font-medium">Formal Language & Automata Theory</td>
                            <td className="p-4 text-slate-700 font-medium bg-emerald-50/50">Project Discussion / Review</td>
                          </tr>
                          <tr className="bg-white hover:bg-slate-50 transition-colors">
                            <td className="p-4 font-black text-slate-900 border-r border-slate-100">Friday</td>
                            <td className="p-4 text-slate-700 font-medium">IT Workshop (SciLab/Python)</td>
                            <td className="p-4 text-slate-700 font-medium">Values & Ethics in Profession</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="bg-[#1e3a8a] p-8 text-white relative overflow-hidden">
               <div className="absolute top-0 right-0 opacity-10 pointer-events-none"><GraduationCap className="w-64 h-64 -mt-10 -mr-10" /></div>
               <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h1 className="text-3xl font-black tracking-tight">Welcome, {studentData.name}</h1>
                    <p className="mt-1 text-blue-200 font-medium">Student Academic Portal</p>
                  </div>
                  <button onClick={handleLogout} className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-5 py-2.5 rounded-lg font-bold transition-colors shadow-md">
                     <LogOut className="w-5 h-5" /> Terminate Session
                  </button>
               </div>
            </div>

            <div className="p-8">
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 shadow-sm hover:-translate-y-1 transition-transform">
                     <p className="text-xs font-bold text-slate-500 uppercase mb-1 tracking-wider">Roll Number</p>
                     <p className="text-2xl font-black text-slate-900">{studentData.rollNumber}</p>
                  </div>
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 shadow-sm border-b-4 border-b-[#1e3a8a] hover:-translate-y-1 transition-transform">
                     <p className="text-xs font-bold text-slate-500 uppercase mb-1 tracking-wider">Department</p>
                     <p className="text-2xl font-black text-[#1e3a8a]">{studentData.department}</p>
                  </div>
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 shadow-sm border-b-4 border-b-amber-500 hover:-translate-y-1 transition-transform">
                     <p className="text-xs font-bold text-slate-500 uppercase mb-1 tracking-wider">Semester</p>
                     <p className="text-2xl font-black text-amber-500">Sem {studentData.semester}</p>
                  </div>
               </div>
               
               <h3 className="text-xl font-bold text-slate-900 mt-10 mb-6 border-b border-slate-100 pb-3">Academic Shortcuts</h3>
               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  <a href="https://makaut1.ucanapply.com/" target="_blank" rel="noreferrer" className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md hover:border-[#1e3a8a] transition-all cursor-pointer text-center group block hover:-translate-y-1">
                     <BookOpen className="w-8 h-8 text-[#1e3a8a] mx-auto mb-3 group-hover:scale-110 transition-transform" />
                     <p className="font-bold text-slate-900 text-sm">Access LMS</p>
                  </a>
                  <a href="https://makautexam.net/" target="_blank" rel="noreferrer" className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md hover:border-amber-500 transition-all cursor-pointer text-center group block hover:-translate-y-1">
                     <FileText className="w-8 h-8 text-amber-500 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                     <p className="font-bold text-slate-900 text-sm">Exam Results</p>
                  </a>
                  <button onClick={() => setActiveModal('attendance')} className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md hover:border-emerald-500 transition-all cursor-pointer text-center group block w-full hover:-translate-y-1">
                     <Activity className="w-8 h-8 text-emerald-500 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                     <p className="font-bold text-slate-900 text-sm">Attendance</p>
                  </button>
                  <button onClick={() => setActiveModal('routine')} className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md hover:border-purple-500 transition-all cursor-pointer text-center group block w-full hover:-translate-y-1">
                     <Calendar className="w-8 h-8 text-purple-500 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                     <p className="font-bold text-slate-900 text-sm">Class Routine</p>
                  </button>
               </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 pt-32 pb-20 flex items-center justify-center animate-in fade-in zoom-in-95 duration-300">
      <div className="max-w-md w-full mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
        <div className="bg-[#1e3a8a] p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-black/10"></div>
          <div className="bg-white p-3 rounded-full w-20 h-20 mx-auto flex items-center justify-center mb-4 shadow-lg relative z-10">
            <GraduationCap className="h-10 w-10 text-[#1e3a8a]" />
          </div>
          <h2 className="text-2xl font-bold text-white relative z-10">Student Portal</h2>
          <p className="text-white/80 text-sm mt-1 relative z-10">Access LMS, Results & Attendance</p>
        </div>
        <div className="p-8">
          {error && <div className="mb-6 bg-red-50 text-red-600 border border-red-200 rounded-lg p-3 text-sm font-bold text-center flex items-center justify-center gap-2"><AlertCircle className="w-5 h-5" /> {error}</div>}
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">University Roll Number</label>
              <input type="text" name="rollNumber" value={loginData.rollNumber} onChange={handleChange} required className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-[#1e3a8a] focus:ring-2 focus:ring-[#1e3a8a] outline-none transition-all" placeholder="Enter your roll number" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Password</label>
              <input type="password" name="password" value={loginData.password} onChange={handleChange} required className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-[#1e3a8a] focus:ring-2 focus:ring-[#1e3a8a] outline-none transition-all" placeholder="••••••••" />
            </div>
            <button type="submit" className="w-full rounded-lg bg-[#1e3a8a] py-4 text-center font-bold text-white transition-colors hover:bg-blue-900 text-lg shadow-md">Secure Login</button>
          </form>
        </div>
      </div>
    </div>
  )
}

function HODLoginView() {
  const [token, setToken] = useState("");
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  
  const [notices, setNotices] = useState([]);
  const [editingNoticeId, setEditingNoticeId] = useState(null);
  const [noticeData, setNoticeData] = useState({ title: "", category: "Academic Notice", description: "", documentUrl: "" });
  const [status, setStatus] = useState("");
  
  const [students, setStudents] = useState([]);
  const [attendanceVals, setAttendanceVals] = useState({});

  const handleLoginChange = (e) => setLoginData({ ...loginData, [e.target.name]: e.target.value });
  const handleNoticeChange = (e) => setNoticeData({ ...noticeData, [e.target.name]: e.target.value });

  const fetchStudents = async () => {
    try {
      const response = await fetch("https://svist-college-portal.onrender.com/api/students");
      const data = await response.json();
      setStudents(data);
      const initialVals = {};
      data.forEach(s => initialVals[s._id] = s.attendance || 0);
      setAttendanceVals(initialVals);
    } catch (error) { console.error("Failed to fetch students"); }
  };

  const fetchNotices = async () => {
    try {
      const response = await fetch("https://svist-college-portal.onrender.com/api/notices");
      const data = await response.json();
      setNotices(data);
    } catch (error) { console.error("Failed to fetch notices"); }
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("https://svist-college-portal.onrender.com/api/hod/login", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(loginData),
      });
      const data = await response.json();
      if (response.ok) {
        setToken(data.token);
        fetchStudents(); 
        fetchNotices();
      } else alert("ACCESS DENIED: " + data.error);
    } catch (error) { console.error("Login failed"); }
  };

  const handleBroadcast = async (e) => {
    e.preventDefault();
    setStatus("Broadcasting...");
    
    const url = editingNoticeId ? `https://svist-college-portal.onrender.com/api/notices/${editingNoticeId}` : "https://svist-college-portal.onrender.com/api/notices";
    const method = editingNoticeId ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method: method, headers: { "Content-Type": "application/json", "Authorization": token }, body: JSON.stringify(noticeData),
      });
      if (response.ok) {
        setStatus(`SUCCESS: Notice ${editingNoticeId ? 'Updated' : 'Broadcasted'}!`);
        setNoticeData({ title: "", category: "Academic Notice", description: "", documentUrl: "" });
        setEditingNoticeId(null);
        fetchNotices(); 
        setTimeout(() => setStatus(""), 4000); 
      } else setStatus("FAILED: Master Key rejected.");
    } catch (error) { setStatus("FAILED: Network error."); }
  };

  const handleDeleteNotice = async (id) => {
     if(!window.confirm("Delete this notice permanently?")) return;
     try {
        const response = await fetch(`https://svist-college-portal.onrender.com/api/notices/${id}`, {
           method: "DELETE", headers: {"Authorization": token}
        });
        if(response.ok) fetchNotices();
     } catch(err) { console.error(err); }
  }

  const handleEditNotice = (n) => {
     setEditingNoticeId(n._id);
     setNoticeData({ title: n.title, category: n.category, description: n.description, documentUrl: n.documentUrl || "" });
  }

  const updateAttendance = async (id) => {
    try {
      const response = await fetch(`https://svist-college-portal.onrender.com/api/students/${id}/attendance`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "Authorization": token },
        body: JSON.stringify({ attendance: attendanceVals[id] })
      });
      if (response.ok) {
        alert("Attendance Sync Successful!");
        fetchStudents();
      } else {
        alert("Failed to sync attendance. Check credentials.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20 animate-in fade-in duration-500">
      <div className="mx-auto max-w-7xl px-4">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          
          <div className="bg-amber-500 p-8 text-slate-900 border-b border-amber-600">
            <div className="flex items-center gap-4">
              <ShieldAlert className="h-10 w-10 text-slate-900" />
              <div>
                <h1 className="text-3xl font-black tracking-tight">HOD Command Console</h1>
                <p className="mt-1 font-semibold text-slate-800">
                  {token ? 'Connection Secured: Broadcast & Academic Controls Active' : 'Authorized Department Heads Only'}
                </p>
              </div>
            </div>
          </div>

          <div className="p-8">
            {!token ? (
              <div className="text-center py-8 max-w-sm mx-auto animate-in zoom-in-95">
                 <Lock className="w-12 h-12 text-amber-500 mx-auto mb-4" />
                 <h2 className="text-2xl font-black text-slate-900 mb-2">HOD Authentication</h2>
                 <form onSubmit={handleLogin} className="space-y-4 mt-6">
                   <input type="text" name="username" placeholder="HOD Username" value={loginData.username} onChange={handleLoginChange} required className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500 text-center font-bold text-slate-700" />
                   <input type="password" name="password" placeholder="HOD Password" value={loginData.password} onChange={handleLoginChange} required className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500 text-center font-bold text-slate-700" />
                   <button type="submit" className="w-full px-8 py-4 mt-2 bg-slate-900 text-white font-black uppercase tracking-wider rounded-lg hover:bg-black shadow-lg transition-transform hover:-translate-y-1">Verify Credentials</button>
                 </form>
              </div>
            ) : (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4">
                
                <div className="bg-slate-50 p-8 rounded-xl border border-slate-200">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                      <Radio className="w-6 h-6 text-amber-500 animate-pulse" /> Live Network Broadcast
                    </h2>
                    {status && <span className={`text-sm font-bold ${status.includes("SUCCESS") ? "text-emerald-600" : "text-amber-600"}`}>{status}</span>}
                  </div>
                  
                  <form className="space-y-4 mb-8" onSubmit={handleBroadcast}>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Notice Title</label>
                      <input type="text" name="title" value={noticeData.title} onChange={handleNoticeChange} required className="w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:border-amber-500 focus:ring-2 focus:ring-amber-500 outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Category</label>
                      <select name="category" value={noticeData.category} onChange={handleNoticeChange} className="w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:border-amber-500 focus:ring-2 focus:ring-amber-500 outline-none">
                        <option>Academic Notice</option>
                        <option>Urgent Announcement</option>
                        <option>Campus Event</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Document Link (PDF/Drive URL)</label>
                      <input type="url" name="documentUrl" placeholder="https://..." value={noticeData.documentUrl} onChange={handleNoticeChange} className="w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:border-amber-500 focus:ring-2 focus:ring-amber-500 outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Detailed Message</label>
                      <textarea name="description" value={noticeData.description} onChange={handleNoticeChange} required rows="3" className="w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:border-amber-500 focus:ring-2 focus:ring-amber-500 outline-none"></textarea>
                    </div>
                    
                    <div className="flex gap-2">
                       <button type="submit" className="flex-1 rounded-lg bg-amber-500 py-3 text-center font-bold text-slate-900 transition-colors hover:bg-amber-400 shadow-md flex items-center justify-center gap-2">
                         <Send className="w-5 h-5" /> {editingNoticeId ? 'Update Notice' : 'Push to Home Page'}
                       </button>
                       {editingNoticeId && (
                         <button type="button" onClick={() => {setEditingNoticeId(null); setNoticeData({ title: "", category: "Academic Notice", description: "", documentUrl: "" })}} className="px-4 py-3 rounded-lg border border-slate-300 font-bold text-slate-500 hover:bg-slate-200">Cancel</button>
                       )}
                    </div>
                  </form>

                  <div className="mt-8 border-t border-slate-200 pt-6">
                     <h3 className="text-sm font-bold text-slate-500 uppercase mb-4 tracking-widest">Active Broadcasts</h3>
                     <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                        {notices.map(n => (
                           <div key={n._id} className="bg-white p-3 rounded-lg border border-slate-200 flex justify-between items-start gap-4">
                              <div>
                                 <p className="font-bold text-sm text-slate-900">{n.title}</p>
                                 <p className="text-xs text-slate-500 mt-1">{n.date}</p>
                              </div>
                              <div className="flex gap-1 shrink-0">
                                 <button onClick={() => handleEditNotice(n)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"><Edit className="w-4 h-4"/></button>
                                 <button onClick={() => handleDeleteNotice(n._id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4"/></button>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>
                </div>

                <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 flex flex-col">
                   <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
                     <Percent className="w-6 h-6 text-emerald-500" />
                     <h2 className="text-xl font-bold text-slate-900">Student Attendance Sync</h2>
                   </div>
                   <div className="flex-1 overflow-y-auto max-h-[600px] pr-2">
                     {students.length === 0 ? (
                       <p className="text-center text-slate-400 mt-10">No students registered in database.</p>
                     ) : (
                       <ul className="space-y-4">
                         {students.map((student) => (
                           <li key={student._id} className="bg-slate-50 border border-slate-200 rounded-lg p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:border-emerald-300 hover:shadow-md">
                             <div>
                               <p className="font-black text-slate-900">{student.name}</p>
                               <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Roll: {student.rollNumber} | Sem {student.semester}</p>
                             </div>
                             <div className="flex items-center gap-3">
                               <input 
                                 type="number" min="0" max="100" 
                                 value={attendanceVals[student._id] !== undefined ? attendanceVals[student._id] : student.attendance}
                                 onChange={(e) => setAttendanceVals({...attendanceVals, [student._id]: e.target.value})}
                                 className="w-20 rounded-lg border border-slate-300 px-3 py-2 text-center font-bold text-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500"
                               />
                               <span className="font-bold text-slate-400">%</span>
                               <button onClick={() => updateAttendance(student._id)} className="px-4 py-2 bg-emerald-100 hover:bg-emerald-500 text-emerald-700 hover:text-white rounded-lg font-bold transition-colors text-sm shadow-sm">
                                 Update
                               </button>
                             </div>
                           </li>
                         ))}
                       </ul>
                     )}
                   </div>
                </div>

              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function AdminLoginView() {
  const [token, setToken] = useState("");
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  
  const [activeTab, setActiveTab] = useState("students"); 

  const [formData, setFormData] = useState({ name: "", rollNumber: "", department: "CSE", semester: "" });
  const [students, setStudents] = useState([]);
  const [editingId, setEditingId] = useState(null); 

  const [facultyData, setFacultyData] = useState({ name: "", department: "CSE", designation: "Assistant Professor", qualification: "M.Tech" });
  const [facultyList, setFacultyList] = useState([]);

  const [admissionsList, setAdmissionsList] = useState([]);

  const fetchStudents = async () => {
    try {
      const response = await fetch("https://svist-college-portal.onrender.com/api/students");
      setStudents(await response.json());
    } catch (error) { console.error("Failed to fetch students"); }
  };

  const fetchFaculty = async () => {
    try {
      const response = await fetch("https://svist-college-portal.onrender.com/api/faculty");
      setFacultyList(await response.json());
    } catch (error) { console.error("Failed to fetch faculty"); }
  };

  const fetchAdmissions = async () => {
    try {
      const response = await fetch("https://svist-college-portal.onrender.com/api/admissions", {
        headers: { "Authorization": token }
      });
      setAdmissionsList(await response.json());
    } catch (error) { console.error("Failed to fetch admissions"); }
  };

  useEffect(() => { 
    if(token) {
      fetchStudents(); 
      fetchFaculty();
      fetchAdmissions();
    }
  }, [token]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("https://svist-college-portal.onrender.com/api/admin/login", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(loginData),
      });
      const data = await response.json();
      if (response.ok) {
         setToken(data.token);
      }
      else alert("ACCESS DENIED: " + data.error);
    } catch (error) { console.error("Login failed"); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editingId ? `https://svist-college-portal.onrender.com/api/students/${editingId}` : "https://svist-college-portal.onrender.com/api/students";
    const method = editingId ? "PUT" : "POST";
    try {
      const response = await fetch(url, {
        method: method, headers: { "Content-Type": "application/json", "Authorization": token }, body: JSON.stringify(formData),
      });
      if (response.ok) {
        setFormData({ name: "", rollNumber: "", department: "CSE", semester: "" }); 
        setEditingId(null); fetchStudents(); 
      } else alert("Transaction Failed.");
    } catch (error) { console.error("Failed to submit"); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("WARNING: Purge student from Atlas?")) return;
    try {
      const response = await fetch(`https://svist-college-portal.onrender.com/api/students/${id}`, {
        method: "DELETE", headers: { "Authorization": token }
      });
      if (response.ok) fetchStudents(); 
    } catch (error) { console.error("Failed to delete"); }
  };

  const handleFacultySubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("https://svist-college-portal.onrender.com/api/faculty", {
        method: "POST", headers: { "Content-Type": "application/json", "Authorization": token }, body: JSON.stringify(facultyData),
      });
      if (response.ok) {
        setFacultyData({ name: "", department: "CSE", designation: "Assistant Professor", qualification: "M.Tech" }); 
        fetchFaculty(); 
      } else alert("Transaction Failed.");
    } catch (error) { console.error("Failed to submit"); }
  };

  const handleFacultyDelete = async (id) => {
    if (!window.confirm("WARNING: Purge faculty from Atlas?")) return;
    try {
      const response = await fetch(`https://svist-college-portal.onrender.com/api/faculty/${id}`, {
        method: "DELETE", headers: { "Authorization": token }
      });
      if (response.ok) fetchFaculty(); 
    } catch (error) { console.error("Failed to delete"); }
  };

  const handleAdmissionDelete = async (id) => {
    if (!window.confirm("Process/Archive this application?")) return;
    try {
      const response = await fetch(`https://svist-college-portal.onrender.com/api/admissions/${id}`, {
        method: "DELETE", headers: { "Authorization": token }
      });
      if (response.ok) fetchAdmissions(); 
    } catch (error) { console.error("Failed to delete"); }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20 animate-in fade-in duration-500">
      <div className="mx-auto max-w-7xl px-4">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          
          <div className="bg-slate-900 p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 opacity-10 pointer-events-none"><Database className="w-64 h-64 -mt-10 -mr-10" /></div>
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-4 justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-cyan-900/50 p-4 rounded-xl border border-cyan-800"><Database className="h-8 w-8 text-cyan-400" /></div>
                <div>
                  <h1 className="text-3xl font-black tracking-tight">Central Database Architecture</h1>
                  <p className="mt-1 text-slate-400 font-medium">Live MongoDB Atlas Connection</p>
                </div>
              </div>
              {token && (
                 <div className="flex flex-wrap gap-2 bg-slate-800 rounded-lg p-1 border border-slate-700">
                    <button onClick={() => setActiveTab('students')} className={`px-4 py-2 rounded-md font-bold text-sm transition-colors ${activeTab === 'students' ? 'bg-cyan-500 text-slate-900' : 'text-slate-400 hover:text-white'}`}>Students</button>
                    <button onClick={() => setActiveTab('faculty')} className={`px-4 py-2 rounded-md font-bold text-sm transition-colors ${activeTab === 'faculty' ? 'bg-amber-500 text-slate-900' : 'text-slate-400 hover:text-white'}`}>Faculty</button>
                    <button onClick={() => setActiveTab('admissions')} className={`px-4 py-2 rounded-md font-bold text-sm transition-colors ${activeTab === 'admissions' ? 'bg-emerald-500 text-slate-900' : 'text-slate-400 hover:text-white'}`}>Admissions</button>
                 </div>
              )}
            </div>
          </div>

          <div className="p-8 bg-slate-50">
            {!token ? (
              <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 text-center py-16 max-w-lg mx-auto animate-in zoom-in-95">
                 <Lock className="w-12 h-12 text-[#1e3a8a] mx-auto mb-4" />
                 <h2 className="text-2xl font-black text-slate-900 mb-2">Secure Authentication Required</h2>
                 <form onSubmit={handleLogin} className="space-y-4 mt-6">
                   <input type="text" name="username" placeholder="Admin Username" value={loginData.username} onChange={(e) => setLoginData({...loginData, username: e.target.value})} required className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-[#1e3a8a] focus:ring-2 focus:ring-[#1e3a8a] text-center font-bold text-slate-700" />
                   <input type="password" name="password" placeholder="Master Password" value={loginData.password} onChange={(e) => setLoginData({...loginData, password: e.target.value})} required className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-[#1e3a8a] focus:ring-2 focus:ring-[#1e3a8a] text-center font-bold text-slate-700" />
                   <button type="submit" className="w-full px-8 py-4 mt-2 bg-[#1e3a8a] text-white font-black uppercase tracking-wider rounded-lg hover:bg-blue-900 shadow-lg transition-transform hover:-translate-y-1">Authenticate Session</button>
                 </form>
              </div>
            ) : (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                
                {/* DYNAMIC FORM COLUMN */}
                {activeTab === 'students' && (
                   <div className={`bg-white p-8 rounded-xl shadow-sm border transition-colors ${editingId ? 'border-amber-400 shadow-amber-100' : 'border-slate-200'}`}>
                      <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
                        {editingId ? <Edit className="w-6 h-6 text-amber-500" /> : <UserPlus className="w-6 h-6 text-[#1e3a8a]" />}
                        <h2 className="text-xl font-bold text-slate-900">{editingId ? "Update Student Record" : "Inject Student Record"}</h2>
                        {editingId && <button type="button" onClick={() => {setEditingId(null); setFormData({name: "", rollNumber: "", department: "CSE", semester: ""})}} className="ml-auto text-xs font-bold text-slate-400 hover:text-slate-700 underline">Cancel Edit</button>}
                      </div>
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Full Name</label>
                            <input type="text" name="name" value={formData.name} onChange={(e)=>setFormData({...formData, name: e.target.value})} required className="w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:border-[#1e3a8a] focus:ring-2 focus:ring-[#1e3a8a] outline-none" />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Roll Number</label>
                            <input type="text" name="rollNumber" value={formData.rollNumber} onChange={(e)=>setFormData({...formData, rollNumber: e.target.value})} required className="w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:border-[#1e3a8a] focus:ring-2 focus:ring-[#1e3a8a] outline-none" />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Department Code</label>
                            <select name="department" value={formData.department} onChange={(e)=>setFormData({...formData, department: e.target.value})} className="w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:border-[#1e3a8a] focus:ring-2 focus:ring-[#1e3a8a] outline-none bg-white">
                               <option value="CSE">CSE</option><option value="EE">EE</option><option value="ECE">ECE</option>
                               <option value="ME">ME</option><option value="CE">CE</option><option value="AI & DS">AI & DS</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Semester</label>
                            <input type="number" min="1" max="8" name="semester" value={formData.semester} onChange={(e)=>setFormData({...formData, semester: e.target.value})} required className="w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:border-[#1e3a8a] focus:ring-2 focus:ring-[#1e3a8a] outline-none" />
                          </div>
                        </div>
                        <button type="submit" className={`mt-4 w-full rounded-lg py-3 text-center font-bold text-white transition-colors shadow-md ${editingId ? 'bg-amber-500 hover:bg-amber-600' : 'bg-[#1e3a8a] hover:bg-blue-900'}`}>
                          {editingId ? "Save Modifications to Atlas" : "Commit to Atlas Database"}
                        </button>
                      </form>
                   </div>
                )}
                {activeTab === 'faculty' && (
                   <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
                      <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
                        <Users className="w-6 h-6 text-amber-500" />
                        <h2 className="text-xl font-bold text-slate-900">Inject Faculty Record</h2>
                      </div>
                      <form onSubmit={handleFacultySubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Full Name with Title</label>
                            <input type="text" name="name" placeholder="e.g. Dr. A. Bhattacharya" value={facultyData.name} onChange={(e)=>setFacultyData({...facultyData, name: e.target.value})} required className="w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:border-amber-500 focus:ring-2 focus:ring-amber-500 outline-none" />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Department</label>
                            <select name="department" value={facultyData.department} onChange={(e)=>setFacultyData({...facultyData, department: e.target.value})} className="w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:border-amber-500 focus:ring-2 focus:ring-amber-500 outline-none bg-white">
                               <option value="CSE">CSE</option><option value="EE">EE</option><option value="ECE">ECE</option>
                               <option value="ME">ME</option><option value="CE">CE</option><option value="AI & DS">AI & DS</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Designation</label>
                            <select name="designation" value={facultyData.designation} onChange={(e)=>setFacultyData({...facultyData, designation: e.target.value})} className="w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:border-amber-500 focus:ring-2 focus:ring-amber-500 outline-none bg-white">
                               <option value="HOD">Head of Department (HOD)</option>
                               <option value="Professor">Professor</option>
                               <option value="Assistant Professor">Assistant Professor</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Qualification</label>
                            <input type="text" name="qualification" placeholder="e.g. Ph.D. in Network Security" value={facultyData.qualification} onChange={(e)=>setFacultyData({...facultyData, qualification: e.target.value})} required className="w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:border-amber-500 focus:ring-2 focus:ring-amber-500 outline-none" />
                          </div>
                        </div>
                        <button type="submit" className="mt-4 w-full rounded-lg py-3 text-center font-bold text-slate-900 bg-amber-500 hover:bg-amber-400 transition-colors shadow-md">
                          Deploy Faculty to Atlas
                        </button>
                      </form>
                   </div>
                )}
                {activeTab === 'admissions' && (
                  <div className="bg-emerald-500 p-8 rounded-xl shadow-sm border border-emerald-600 text-white flex flex-col justify-center items-center text-center h-full min-h-[300px]">
                     <FileText className="w-16 h-16 mb-4 text-emerald-200" />
                     <h2 className="text-3xl font-black mb-2">Admissions Queue</h2>
                     <p className="font-medium text-emerald-100">Review pending application data from the public portal directly in the feed.</p>
                  </div>
                )}

                {/* DYNAMIC LIST COLUMN */}
                <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 flex flex-col">
                   <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
                     <div className="flex items-center gap-3">
                       <List className="w-6 h-6 text-[#1e3a8a]" />
                       <h2 className="text-xl font-bold text-slate-900">Live {activeTab === 'students' ? 'Student' : activeTab === 'faculty' ? 'Faculty' : 'Applications'} Output</h2>
                     </div>
                     <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">Admin Privileges</span>
                   </div>
                   
                   <div className="flex-1 overflow-y-auto max-h-[400px] pr-2">
                     {activeTab === 'students' && (
                        students.length === 0 ? (
                          <div className="h-full flex flex-col items-center justify-center text-slate-400 py-10"><Database className="w-12 h-12 mb-2 opacity-20" /><p className="text-sm font-medium">Database is empty.</p></div>
                        ) : (
                          <ul className="space-y-3">
                            {students.map((student) => (
                              <li key={student._id} className="bg-slate-50 border border-slate-200 rounded-lg p-4 flex items-center justify-between transition-colors hover:border-[#1e3a8a]">
                                <div>
                                  <p className="font-bold text-slate-900">{student.name}</p>
                                  <div className="flex gap-2 text-[10px] sm:text-xs font-bold mt-1">
                                    <span className="bg-white px-2 py-0.5 rounded border border-slate-200 text-[#1e3a8a]">Roll: {student.rollNumber}</span>
                                    <span className="bg-white px-2 py-0.5 rounded border border-slate-200 text-amber-600">{student.department} - Sem {student.semester}</span>
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <button onClick={() => handleEditClick(student)} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-colors" title="Edit"><Edit className="w-4 h-4" /></button>
                                  <button onClick={() => handleDelete(student._id)} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-colors" title="Delete"><Trash2 className="w-4 h-4" /></button>
                                </div>
                              </li>
                            ))}
                          </ul>
                        )
                     )}

                     {activeTab === 'faculty' && (
                        facultyList.length === 0 ? (
                          <div className="h-full flex flex-col items-center justify-center text-slate-400 py-10"><Database className="w-12 h-12 mb-2 opacity-20" /><p className="text-sm font-medium">Faculty DB is empty.</p></div>
                        ) : (
                          <ul className="space-y-3">
                            {facultyList.map((fac) => (
                              <li key={fac._id} className="bg-slate-50 border border-slate-200 rounded-lg p-4 flex items-center justify-between transition-colors hover:border-amber-400">
                                <div>
                                  <p className="font-bold text-slate-900">{fac.name}</p>
                                  <div className="flex gap-2 text-[10px] sm:text-xs font-bold mt-1">
                                    <span className="bg-white px-2 py-0.5 rounded border border-slate-200 text-amber-600">{fac.department}</span>
                                    <span className="bg-white px-2 py-0.5 rounded border border-slate-200 text-[#1e3a8a]">{fac.designation}</span>
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <button onClick={() => handleFacultyDelete(fac._id)} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-colors" title="Delete"><Trash2 className="w-4 h-4" /></button>
                                </div>
                              </li>
                            ))}
                          </ul>
                        )
                     )}

                     {activeTab === 'admissions' && (
                        admissionsList.length === 0 ? (
                          <div className="h-full flex flex-col items-center justify-center text-slate-400 py-10"><Database className="w-12 h-12 mb-2 opacity-20" /><p className="text-sm font-medium">No pending applications.</p></div>
                        ) : (
                          <ul className="space-y-3">
                            {admissionsList.map((app) => (
                              <li key={app._id} className="bg-slate-50 border border-slate-200 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors hover:border-emerald-500">
                                <div>
                                  <p className="font-bold text-slate-900">{app.name}</p>
                                  <p className="text-xs text-slate-500 flex flex-wrap gap-x-3 gap-y-1 mt-1">
                                    <span>{app.email}</span> <span>{app.phone}</span>
                                  </p>
                                  <div className="flex gap-2 text-[10px] sm:text-xs font-bold mt-2">
                                    <span className="bg-emerald-100 px-2 py-0.5 rounded text-emerald-800">{app.department}</span>
                                    <span className="bg-slate-200 px-2 py-0.5 rounded text-slate-800">Rank: {app.rank}</span>
                                  </div>
                                </div>
                                <div className="flex gap-2 shrink-0">
                                  <button onClick={() => handleAdmissionDelete(app._id)} className="p-2 bg-slate-200 text-slate-600 rounded-lg hover:bg-emerald-500 hover:text-white transition-colors text-xs font-bold" title="Process & Archive">Process / Archive</button>
                                </div>
                              </li>
                            ))}
                          </ul>
                        )
                     )}
                   </div>
                </div>

              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ============================================
   FOOTER COMPONENT 
   ============================================ */

function Footer() {
  return (
    <footer className="bg-slate-900 text-white border-t-4 border-[#1e3a8a]">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <div className="flex items-center gap-3">
              <div className="bg-white p-1 rounded-md shadow-md">
                 <img src="/svist-logo.png" alt="SVIST Logo" className="h-10 w-10 object-contain" />
              </div>
              <span className="text-2xl font-black tracking-tight text-white">SVIST</span>
            </div>
            <p className="mt-6 text-sm leading-relaxed text-slate-400 font-medium">Swami Vivekananda Institute of Science and Technology is committed to providing quality technical education and shaping future leaders in engineering.</p>
          </div>
          <div>
            <h4 className="font-bold text-lg text-white mb-6 border-b border-slate-700 pb-2 inline-block">Campus Location</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />
                <span className="text-sm font-medium text-slate-300">Dakshin Gobindapur, Sonarpur, Kolkata, West Bengal - 700145</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 shrink-0 text-amber-400" />
                <span className="text-sm font-medium text-slate-300">+91 33 2401 XXXX</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 shrink-0 text-amber-400" />
                <span className="text-sm font-medium text-slate-300">info@svist.edu.in</span>
              </li>
            </ul>
          </div>
          <div>
             <h4 className="font-bold text-lg text-white mb-6 border-b border-slate-700 pb-2 inline-block">Facilities</h4>
             <ul className="space-y-3">
                <li className="text-sm font-medium text-slate-300 flex items-center gap-2"><BookOpen className="w-4 h-4 text-cyan-400"/> Nationalized Book Bank</li>
                <li className="text-sm font-medium text-slate-300 flex items-center gap-2"><FlaskConical className="w-4 h-4 text-cyan-400"/> Industry-Grade Computing Labs</li>
                <li className="text-sm font-medium text-slate-300 flex items-center gap-2"><Building2 className="w-4 h-4 text-cyan-400"/> Secure Hostels & Infrastructure</li>
             </ul>
          </div>
        </div>
      </div>
      <div className="bg-black py-4 border-t border-slate-800">
         <p className="text-center text-xs font-bold text-slate-500 uppercase tracking-widest">© {new Date().getFullYear()} SVIST Kolkata. System Connected.</p>
      </div>
    </footer>
  )
}

/* ============================================
   MAIN APP ROUTER SHELL
   ============================================ */

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50 font-sans">
        <Navigation />
        
        <Routes>
          <Route path="/" element={<HomeView />} />
          <Route path="/academics" element={<AcademicsView />} />
          <Route path="/scholarships" element={<ScholarshipsView />} />
          <Route path="/admissions" element={<AdmissionsView />} />
          <Route path="/departments" element={<DepartmentsSection />} />
          <Route path="/departments/:slug" element={<DepartmentDetailView />} />
          <Route path="/placements" element={<PlacementsView />} />

          <Route path="/student-login" element={<StudentLoginView />} />
          <Route path="/hod-login" element={<HODLoginView />} />
          <Route path="/admin-login" element={<AdminLoginView />} />
        </Routes>
        
        <Footer />
      </div>
    </Router>
  )
}