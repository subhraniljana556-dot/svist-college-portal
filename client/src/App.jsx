import React, { useState, useEffect, Suspense, lazy } from "react"
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useParams } from "react-router-dom"
import {
  GraduationCap, Menu, X, ArrowRight, Award, Building2, Cpu, Radio, Cog, Building, BrainCircuit,
  Zap, Bell, Calendar, FileText, AlertCircle, MapPin, Phone, BookOpen, FlaskConical, ShieldAlert,
  TrendingUp, Briefcase, UserCheck, ShieldCheck, Landmark, Lock, Mail, LayoutDashboard, Users, Activity,
  Database, UserPlus, List, Trash2, Edit, Send, LogOut, CheckCircle, Percent, Link as LinkIcon, DownloadCloud, ChevronRight, BookOpenCheck, CalendarDays, Scale, Wallet, Banknote, Download, FileSpreadsheet,
  CreditCard, Sparkles, QrCode, ChevronDown, Layers, Bus, Trophy
} from "lucide-react"
import { apiFetch } from "./config/api"
import SkeletonLoader from "./components/SkeletonLoader"

import AICampusAssistant from "./components/AICampusAssistant"

// ================================================================
// CODE-SPLITTING — React.lazy() for Heavy Route Components
// ================================================================
const AcademicsView = lazy(() => import("./views/AcademicsView"))
const ScholarshipsView = lazy(() => import("./views/ScholarshipsView"))
const PlacementsView = lazy(() => import("./views/PlacementsView"))
const OnlineFeesView = lazy(() => import("./views/OnlineFeesView"))
const StudentLoginView = lazy(() => import("./views/StudentLoginView"))
const HODLoginView = lazy(() => import("./views/HODLoginView"))
const AdminLoginView = lazy(() => import("./views/AdminLoginView"))
const DepartmentDetailView = lazy(() => import("./views/DepartmentDetailView"))
const CampusTourView = lazy(() => import("./views/CampusTourView"))
const AlumniView = lazy(() => import("./views/AlumniView"))
const TransportView = lazy(() => import("./views/TransportView"))
const ClubsEventsView = lazy(() => import("./views/ClubsEventsView"))

/* ============================================
   DATA CONSTANTS & PERMANENT IMAGES
   ============================================ */

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Academics", href: "/academics" },
  { name: "Admissions", href: "/admissions" },
  { name: "Campus Tour", href: "/campus-tour" },
  { name: "Alumni", href: "/alumni" },
  { name: "Clubs & Events", href: "/clubs-events" },
  { name: "Transport", href: "/transport" },
  { name: "Placements", href: "/placements" },
  { name: "Pay Fees", href: "/pay-fees", highlight: true },
]

export const departments = [
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

export const getNoticeIcon = (type) => {
  switch (type) {
    case "Urgent Announcement": return <AlertCircle className="h-5 w-5 text-red-500" />
    case "Campus Event": return <Calendar className="h-5 w-5 text-blue-500" />
    default: return <FileText className="h-5 w-5 text-slate-500" />
  }
}

export const getNoticeBadge = (type) => {
  switch (type) {
    case "Urgent Announcement": return <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-700">Urgent</span>
    case "Campus Event": return <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-700">Event</span>
    default: return <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700">Academic</span>
  }
}

/* ============================================
   NAVIGATION COMPONENT — PROFESSIONAL TIERED
   ============================================ */

function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [isCampusOpen, setIsCampusOpen] = useState(false)
  const location = useLocation()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 shadow-xl">
      
      {/* 1. TOP MICRO UTILITY STRIP */}
      <div className="bg-slate-950 text-slate-300 text-[11px] font-medium border-b border-slate-800 py-1.5 px-4 sm:px-8 hidden md:block">
        <div className="mx-auto max-w-[1440px] flex items-center justify-between">
          <div className="flex items-center gap-4 text-slate-400">
            <span className="flex items-center gap-1.5 text-amber-400 font-bold">
              <Award className="w-3.5 h-3.5" /> AICTE Approved • MAKAUT Affiliated (Code: 247)
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-cyan-400" /> Sonarpur, Kolkata - 700145
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-slate-300">
              <Phone className="w-3 h-3 text-amber-400" /> Helpline: +91 33 2401 XXXX
            </span>
            <div className="flex items-center gap-1.5 pl-3 border-l border-slate-700">
              <Link to="/student-login" className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 hover:bg-blue-500 hover:text-white font-bold transition-colors">
                Student Portal
              </Link>
              <Link to="/hod-login" className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 hover:bg-amber-500 hover:text-slate-950 font-bold transition-colors">
                HOD Portal
              </Link>
              <Link to="/admin-login" className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white font-bold transition-colors border border-slate-700">
                Admin DB
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 2. MAIN NAVIGATION BAR */}
      <nav className="bg-[#1e3a8a] border-b border-blue-900">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
          <div className="flex h-18 sm:h-20 items-center justify-between">
            
            {/* Institution Brand */}
            <Link to="/" className="flex items-center gap-3.5 hover:opacity-95 transition-opacity group">
              <div className="bg-white p-1.5 rounded-2xl shadow-md border border-white/30 group-hover:scale-105 transition-transform shrink-0">
                <img src="/svist-logo.png" alt="SVIST Logo" className="h-10 w-10 sm:h-12 sm:w-12 object-contain" />
              </div>
              <div className="flex flex-col">
                <span className="text-base sm:text-xl font-black tracking-tight text-white leading-tight">
                  SWAMI VIVEKANANDA
                </span>
                <span className="text-[10px] sm:text-xs font-bold text-amber-400 uppercase tracking-widest leading-tight">
                  Institute of Science & Technology
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center gap-1 xl:gap-2">
              <Link
                to="/"
                className={`px-3.5 py-2 rounded-xl text-sm font-bold transition-all ${location.pathname === '/' ? 'bg-white/15 text-amber-400 shadow-xs' : 'text-white/90 hover:text-amber-400 hover:bg-white/10'}`}
              >
                Home
              </Link>

              <Link
                to="/academics"
                className={`px-3.5 py-2 rounded-xl text-sm font-bold transition-all ${location.pathname === '/academics' ? 'bg-white/15 text-amber-400 shadow-xs' : 'text-white/90 hover:text-amber-400 hover:bg-white/10'}`}
              >
                Academics
              </Link>

              <Link
                to="/admissions"
                className={`px-3.5 py-2 rounded-xl text-sm font-bold transition-all ${location.pathname === '/admissions' ? 'bg-white/15 text-amber-400 shadow-xs' : 'text-white/90 hover:text-amber-400 hover:bg-white/10'}`}
              >
                Admissions
              </Link>

              {/* Campus Life Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setIsCampusOpen(true)}
                onMouseLeave={() => setIsCampusOpen(false)}
              >
                <button
                  className={`px-3.5 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-1.5 cursor-pointer ${['/campus-tour', '/transport', '/clubs-events'].includes(location.pathname) ? 'bg-white/15 text-amber-400' : 'text-white/90 hover:text-amber-400 hover:bg-white/10'}`}
                >
                  <span>Campus Life</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isCampusOpen ? 'rotate-180 text-amber-400' : 'text-blue-300'}`} />
                </button>

                {isCampusOpen && (
                  <div className="absolute top-full left-0 w-64 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-2 animate-in fade-in slide-in-from-top-2 duration-150 z-50">
                    <Link
                      to="/campus-tour"
                      onClick={() => setIsCampusOpen(false)}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/10 text-white transition-colors group"
                    >
                      <Building2 className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
                      <div>
                        <p className="text-xs font-black">360° Virtual Tour</p>
                        <p className="text-[10px] text-slate-400">High-Tech Labs & Hostels</p>
                      </div>
                    </Link>

                    <Link
                      to="/transport"
                      onClick={() => setIsCampusOpen(false)}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/10 text-white transition-colors group"
                    >
                      <Bus className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
                      <div>
                        <p className="text-xs font-black">Transport & Bus Routes</p>
                        <p className="text-[10px] text-slate-400">Timetables & Stoppages</p>
                      </div>
                    </Link>

                    <Link
                      to="/clubs-events"
                      onClick={() => setIsCampusOpen(false)}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/10 text-white transition-colors group"
                    >
                      <Trophy className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
                      <div>
                        <p className="text-xs font-black">Clubs & INNOVA Fest</p>
                        <p className="text-[10px] text-slate-400">Hackathons & Societies</p>
                      </div>
                    </Link>
                  </div>
                )}
              </div>

              <Link
                to="/placements"
                className={`px-3.5 py-2 rounded-xl text-sm font-bold transition-all ${location.pathname === '/placements' ? 'bg-white/15 text-amber-400 shadow-xs' : 'text-white/90 hover:text-amber-400 hover:bg-white/10'}`}
              >
                Placements
              </Link>

              <Link
                to="/alumni"
                className={`px-3.5 py-2 rounded-xl text-sm font-bold transition-all ${location.pathname === '/alumni' ? 'bg-white/15 text-amber-400 shadow-xs' : 'text-white/90 hover:text-amber-400 hover:bg-white/10'}`}
              >
                Alumni
              </Link>

              {/* Pay Fees Highlight Button */}
              <Link
                to="/pay-fees"
                className="ml-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider transition-all shadow-md hover:shadow-emerald-500/20 flex items-center gap-2 hover:scale-105"
              >
                <CreditCard className="w-4 h-4" />
                <span>Pay Fees</span>
              </Link>
            </div>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-white hover:bg-white/10 rounded-xl transition-colors lg:hidden cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* MOBILE DRAWER */}
        {isOpen && (
          <div className="lg:hidden bg-slate-900 border-t border-blue-800 p-5 shadow-2xl animate-in slide-in-from-top duration-200">
            <div className="space-y-2">
              <Link to="/" onClick={() => setIsOpen(false)} className="block py-2 px-3 rounded-lg text-white font-bold hover:bg-white/10">Home</Link>
              <Link to="/academics" onClick={() => setIsOpen(false)} className="block py-2 px-3 rounded-lg text-white font-bold hover:bg-white/10">Academics</Link>
              <Link to="/admissions" onClick={() => setIsOpen(false)} className="block py-2 px-3 rounded-lg text-white font-bold hover:bg-white/10">Admissions</Link>
              <Link to="/campus-tour" onClick={() => setIsOpen(false)} className="block py-2 px-3 rounded-lg text-amber-300 font-bold hover:bg-white/10">360° Campus Tour</Link>
              <Link to="/transport" onClick={() => setIsOpen(false)} className="block py-2 px-3 rounded-lg text-cyan-300 font-bold hover:bg-white/10">Transport & Bus Routes</Link>
              <Link to="/clubs-events" onClick={() => setIsOpen(false)} className="block py-2 px-3 rounded-lg text-emerald-300 font-bold hover:bg-white/10">Clubs & TechFest</Link>
              <Link to="/placements" onClick={() => setIsOpen(false)} className="block py-2 px-3 rounded-lg text-white font-bold hover:bg-white/10">Placements</Link>
              <Link to="/alumni" onClick={() => setIsOpen(false)} className="block py-2 px-3 rounded-lg text-white font-bold hover:bg-white/10">Alumni Mentorship</Link>
              
              <Link to="/pay-fees" onClick={() => setIsOpen(false)} className="block py-3 px-4 bg-emerald-500 text-slate-950 font-black rounded-xl text-center text-xs uppercase tracking-wider mt-3">
                💳 Pay Online Fees
              </Link>
              
              <div className="pt-4 mt-4 border-t border-slate-800 grid grid-cols-3 gap-2 text-center text-xs">
                <Link to="/student-login" onClick={() => setIsOpen(false)} className="py-2.5 bg-blue-600/30 text-blue-300 font-bold rounded-lg border border-blue-500/40">Student</Link>
                <Link to="/hod-login" onClick={() => setIsOpen(false)} className="py-2.5 bg-amber-500/30 text-amber-300 font-bold rounded-lg border border-amber-500/40">HOD</Link>
                <Link to="/admin-login" onClick={() => setIsOpen(false)} className="py-2.5 bg-slate-800 text-slate-300 font-bold rounded-lg border border-slate-700">Admin DB</Link>
              </div>
            </div>
          </div>
        )}

      </nav>
    </header>
  )
}

/* ============================================
   CONTENT PAGES & SECTIONS
   ============================================ */

function HomeView() {
  return (
    <div className="animate-in fade-in duration-500">
      <HeroSection />
      <AllInOnePortalHub />
      <WhySVISTSection />
      <DepartmentsSection />
      <NoticeBoard />
    </div>
  )
}

function AllInOnePortalHub() {
  return (
    <section className="bg-slate-900 text-white py-20 border-y-4 border-[#1e3a8a] relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-amber-400 text-xs font-black tracking-wider uppercase mb-4">
            <Award className="w-3.5 h-3.5" /> All-in-One Digital Campus Portal
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            Single Gateway for All College Services
          </h2>
          <p className="mt-4 text-slate-300 text-base sm:text-lg font-medium">
            Everything you need is integrated in one place — pay fees, access student attendance, download Digital ID cards, compute SGPA, and submit online admissions.
          </p>
        </div>

        {/* Unified 6-Card Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Card 1: Online Fee Payment Gateway */}
          <div className="bg-slate-800/90 rounded-3xl p-7 border-2 border-emerald-500/40 hover:border-emerald-400 transition-all hover:-translate-y-1.5 shadow-xl flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3.5 bg-emerald-500/20 text-emerald-400 rounded-2xl border border-emerald-500/30">
                  <CreditCard className="w-8 h-8" />
                </div>
                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full text-xs font-black uppercase">
                  Active Gateway
                </span>
              </div>
              <h3 className="text-2xl font-black text-white group-hover:text-emerald-400 transition-colors">Pay Online Fees</h3>
              <p className="mt-2 text-sm text-slate-300 font-medium leading-relaxed">
                Pay semester tuition (₹52,000), MAKAUT exam fees, and hostel dues via UPI QR code or Card with instant official digital receipts.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-700/60">
              <Link to="/pay-fees" className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-center flex items-center justify-center gap-2 transition-all shadow-md">
                Launch Fee Gateway <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Card 2: Student Portal & ID Card */}
          <div className="bg-slate-800/90 rounded-3xl p-7 border-2 border-[#1e3a8a]/60 hover:border-blue-400 transition-all hover:-translate-y-1.5 shadow-xl flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3.5 bg-blue-500/20 text-blue-400 rounded-2xl border border-blue-500/30">
                  <GraduationCap className="w-8 h-8" />
                </div>
                <span className="px-3 py-1 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-full text-xs font-black uppercase">
                  Student Console
                </span>
              </div>
              <h3 className="text-2xl font-black text-white group-hover:text-blue-400 transition-colors">Student Portal & ID Card</h3>
              <p className="mt-2 text-sm text-slate-300 font-medium leading-relaxed">
                Check attendance, view weekly lecture routines, download your printable Digital Student ID Card, and calculate semester SGPA.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-700/60">
              <Link to="/student-login" className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-xl text-center flex items-center justify-center gap-2 transition-all shadow-md">
                Enter Student Portal <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Card 3: Online Admissions 2026-27 */}
          <div className="bg-slate-800/90 rounded-3xl p-7 border-2 border-amber-500/40 hover:border-amber-400 transition-all hover:-translate-y-1.5 shadow-xl flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3.5 bg-amber-500/20 text-amber-400 rounded-2xl border border-amber-500/30">
                  <FileText className="w-8 h-8" />
                </div>
                <span className="px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full text-xs font-black uppercase">
                  Admissions Open
                </span>
              </div>
              <h3 className="text-2xl font-black text-white group-hover:text-amber-400 transition-colors">Apply for Admissions</h3>
              <p className="mt-2 text-sm text-slate-300 font-medium leading-relaxed">
                Direct online admission application for B.Tech CSE, AI & DS, EE, ECE, ME, and CE programs. Instant synchronization with Admin DB.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-700/60">
              <Link to="/admissions" className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-center flex items-center justify-center gap-2 transition-all shadow-md">
                Submit Application <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Card 4: Academics & 24x7 Helpdesk */}
          <div className="bg-slate-800/90 rounded-3xl p-7 border border-slate-700 hover:border-purple-400 transition-all hover:-translate-y-1.5 shadow-xl flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3.5 bg-purple-500/20 text-purple-400 rounded-2xl border border-purple-500/30">
                  <BookOpen className="w-8 h-8" />
                </div>
                <span className="px-3 py-1 bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-full text-xs font-black uppercase">
                  MAKAUT Syllabus
                </span>
              </div>
              <h3 className="text-2xl font-black text-white group-hover:text-purple-400 transition-colors">Academics & 24x7 Support</h3>
              <p className="mt-2 text-sm text-slate-300 font-medium leading-relaxed">
                Official MAKAUT syllabus repository, semester academic calendar, anti-ragging grievance ticketing, and student helpdesk.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-700/60">
              <Link to="/academics" className="w-full py-3.5 bg-purple-600 hover:bg-purple-500 text-white font-black rounded-xl text-center flex items-center justify-center gap-2 transition-all shadow-md">
                View Academics & Helpdesk <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Card 5: Training & Placement Drives */}
          <div className="bg-slate-800/90 rounded-3xl p-7 border border-slate-700 hover:border-cyan-400 transition-all hover:-translate-y-1.5 shadow-xl flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3.5 bg-cyan-500/20 text-cyan-400 rounded-2xl border border-cyan-500/30">
                  <Briefcase className="w-8 h-8" />
                </div>
                <span className="px-3 py-1 bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded-full text-xs font-black uppercase">
                  T&P Cell
                </span>
              </div>
              <h3 className="text-2xl font-black text-white group-hover:text-cyan-400 transition-colors">Campus Placement Drives</h3>
              <p className="mt-2 text-sm text-slate-300 font-medium leading-relaxed">
                Live recruitment drives (TCS, AWS, Cognizant) with real-time SGPA eligibility validation, salary package details, and instant applications.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-700/60">
              <Link to="/placements" className="w-full py-3.5 bg-cyan-600 hover:bg-cyan-500 text-white font-black rounded-xl text-center flex items-center justify-center gap-2 transition-all shadow-md">
                Explore Placement Drives <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Card 6: Administration & Department Control */}
          <div className="bg-slate-800/90 rounded-3xl p-7 border border-slate-700 hover:border-rose-400 transition-all hover:-translate-y-1.5 shadow-xl flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3.5 bg-rose-500/20 text-rose-400 rounded-2xl border border-rose-500/30">
                  <Database className="w-8 h-8" />
                </div>
                <span className="px-3 py-1 bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-full text-xs font-black uppercase">
                  Faculty & Admin
                </span>
              </div>
              <h3 className="text-2xl font-black text-white group-hover:text-rose-400 transition-colors">Admin DB & HOD Control</h3>
              <p className="mt-2 text-sm text-slate-300 font-medium leading-relaxed">
                Manage student rosters, update attendance records, publish live campus broadcasts, and oversee online admission applications.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-700/60 flex gap-2">
              <Link to="/hod-login" className="flex-1 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-center text-xs transition-all shadow-md">
                HOD Portal
              </Link>
              <Link to="/admin-login" className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 text-white font-black rounded-xl text-center text-xs transition-all shadow-md border border-slate-600">
                Admin Database
              </Link>
            </div>
          </div>

        </div>

      </div>
    </section>
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
          <Link to="/pay-fees" className="flex items-center justify-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 px-8 py-4 text-lg font-black text-slate-950 shadow-xl transition-transform hover:scale-105 w-full sm:w-auto">
            <CreditCard className="w-6 h-6"/> Pay Online Fees
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

export function DepartmentsSection() {
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
      const { data } = await apiFetch("/api/notices");
      if (data) setLiveNotices(data);
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
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <Link to="/student-login" className="group rounded-2xl border border-slate-200 bg-white p-5 transition-all hover:border-[#1e3a8a] hover:shadow-md block">
                <h3 className="font-bold text-slate-900 group-hover:text-[#1e3a8a] text-lg">Student Portal</h3>
                <p className="mt-1 text-sm font-medium text-slate-600">Access LMS & Results</p>
              </Link>
              <Link to="/pay-fees" className="group rounded-2xl border border-emerald-200 bg-emerald-50/50 p-5 transition-all hover:border-emerald-500 hover:shadow-md block">
                <h3 className="font-bold text-emerald-900 group-hover:text-emerald-700 text-lg flex items-center gap-1.5">
                  <CreditCard className="w-5 h-5 text-emerald-600"/> Pay Online Fees
                </h3>
                <p className="mt-1 text-sm font-medium text-emerald-700">Tuition & Exam Gateway</p>
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

function AdmissionsView() {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", department: "Computer Science & Engineering", rank: "" });
  const [status, setStatus] = useState("");

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Submitting to Admin Database...");
    const { data, error } = await apiFetch("/api/admissions", {
      method: "POST", body: JSON.stringify(formData)
    });
    if (data) {
      setStatus("SUCCESS: Application Sent to Admin Cell.");
      setFormData({ name: "", email: "", phone: "", department: "Computer Science & Engineering", rank: "" });
      setTimeout(() => setStatus(""), 5000);
    } else {
      setStatus(error || "ERROR: Application failed to submit.");
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
        
        <Suspense fallback={<SkeletonLoader />}>
          <Routes>
            <Route path="/" element={<HomeView />} />
            <Route path="/academics" element={<AcademicsView />} />
            <Route path="/scholarships" element={<ScholarshipsView />} />
            <Route path="/admissions" element={<AdmissionsView />} />
            <Route path="/departments" element={<DepartmentsSection />} />
            <Route path="/departments/:slug" element={<DepartmentDetailView />} />
            <Route path="/campus-tour" element={<CampusTourView />} />
            <Route path="/alumni" element={<AlumniView />} />
            <Route path="/transport" element={<TransportView />} />
            <Route path="/clubs-events" element={<ClubsEventsView />} />
            <Route path="/placements" element={<PlacementsView />} />
            <Route path="/pay-fees" element={<OnlineFeesView />} />

            <Route path="/student-login" element={<StudentLoginView />} />
            <Route path="/hod-login" element={<HODLoginView />} />
            <Route path="/admin-login" element={<AdminLoginView />} />
          </Routes>
        </Suspense>
        
        {/* GLOBAL 24/7 AI CAMPUS ASSISTANT WIDGET */}
        <AICampusAssistant />

        <Footer />
      </div>
    </Router>
  )
}