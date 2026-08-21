// ================================================================
// CAMPUS TRANSPORT & BUS ROUTE TRACKER VIEW
// ================================================================

import React, { useState } from "react"
import {
  Bus, MapPin, Clock, ShieldCheck, Phone, AlertCircle,
  CheckCircle2, CreditCard, ChevronRight, Navigation, Sparkles
} from "lucide-react"
import { Link } from "react-router-dom"

export default function TransportView() {
  const [activeRoute, setActiveRoute] = useState(1)

  const routes = [
    {
      id: 1,
      name: "Route 1: Howrah Station ⇄ SVIST Campus",
      busNumber: "WB-19-SVIST-01",
      driver: "Mr. B. Karmakar (+91 98301 XXXXX)",
      color: "from-blue-600 to-indigo-800",
      morningDeparture: "07:30 AM",
      campusArrival: "09:00 AM",
      eveningDeparture: "05:15 PM",
      stops: [
        { stop: "Howrah Railway Station (Platform 1 Exit)", time: "07:30 AM" },
        { stop: "Rabindra Sadan / Exide Crossing", time: "07:50 AM" },
        { stop: "Ballygunge Phari / Gariahat", time: "08:10 AM" },
        { stop: "Ruby General Hospital (EM Bypass)", time: "08:25 AM" },
        { stop: "Garia Mahamayatala / Kamalgazi", time: "08:45 AM" },
        { stop: "SVIST Sonarpur Campus Main Gate", time: "09:00 AM" },
      ]
    },
    {
      id: 2,
      name: "Route 2: Sealdah ⇄ EM Bypass ⇄ SVIST Campus",
      busNumber: "WB-19-SVIST-02",
      driver: "Mr. S. Mondal (+91 98312 XXXXX)",
      color: "from-emerald-600 to-teal-800",
      morningDeparture: "07:35 AM",
      campusArrival: "09:05 AM",
      eveningDeparture: "05:15 PM",
      stops: [
        { stop: "Sealdah Main Station (Flyover Bus Stop)", time: "07:35 AM" },
        { stop: "Beleghata Building More", time: "07:50 AM" },
        { stop: "Science City Roundabout", time: "08:10 AM" },
        { stop: "Kalikapur / Mukundapur Crossing", time: "08:30 AM" },
        { stop: "Garia Station Road (Patuli Fire Station)", time: "08:45 AM" },
        { stop: "SVIST Sonarpur Campus Main Gate", time: "09:05 AM" },
      ]
    },
    {
      id: 3,
      name: "Route 3: Salt Lake Sector V ⇄ SVIST Campus",
      busNumber: "WB-19-SVIST-03",
      driver: "Mr. D. Paul (+91 98323 XXXXX)",
      color: "from-purple-600 to-indigo-900",
      morningDeparture: "07:30 AM",
      campusArrival: "09:00 AM",
      eveningDeparture: "05:15 PM",
      stops: [
        { stop: "Salt Lake Sector V (College More / Technopolis)", time: "07:30 AM" },
        { stop: "Karunamoyee Bus Terminus", time: "07:45 AM" },
        { stop: "Ultadanga / Hudco Crossing", time: "08:00 AM" },
        { stop: "Chingrighata EM Bypass", time: "08:15 AM" },
        { stop: "Ajaynagar / Peerless Hospital", time: "08:40 AM" },
        { stop: "SVIST Sonarpur Campus Main Gate", time: "09:00 AM" },
      ]
    },
    {
      id: 4,
      name: "Route 4: Baruipur ⇄ Sonarpur ⇄ SVIST Campus",
      busNumber: "WB-19-SVIST-04",
      driver: "Mr. T. Das (+91 98334 XXXXX)",
      color: "from-amber-600 to-orange-800",
      morningDeparture: "08:10 AM",
      campusArrival: "08:55 AM",
      eveningDeparture: "05:15 PM",
      stops: [
        { stop: "Baruipur Rail Gate / Padmapukur", time: "08:10 AM" },
        { stop: "Mallickpur Market", time: "08:25 AM" },
        { stop: "Subhasgram Railway Station", time: "08:35 AM" },
        { stop: "Sonarpur Station Auto Stand", time: "08:45 AM" },
        { stop: "SVIST Sonarpur Campus Main Gate", time: "08:55 AM" },
      ]
    }
  ]

  const currentRoute = routes.find(r => r.id === activeRoute)

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20 animate-in fade-in duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Hero */}
        <div className="bg-gradient-to-r from-slate-900 via-[#1e3a8a] to-blue-950 text-white rounded-3xl p-8 sm:p-12 shadow-xl mb-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-amber-400 text-xs font-black tracking-wider uppercase mb-4">
              <Bus className="w-3.5 h-3.5" /> Fleet & Transport Department
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
              Campus Bus Routes & Timetables
            </h1>
            <p className="mt-4 text-blue-100 text-base sm:text-lg font-medium leading-relaxed">
              Safe, air-conditioned and punctual daily transportation connecting Howrah, Sealdah, Salt Lake, Garia, and South 24 Parganas directly to the SVIST Sonarpur campus.
            </p>
          </div>
        </div>

        {/* Route Selector Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {routes.map((r) => (
            <button
              key={r.id}
              onClick={() => setActiveRoute(r.id)}
              className={`p-5 rounded-2xl border text-left transition-all shadow-sm cursor-pointer ${activeRoute === r.id ? 'bg-[#1e3a8a] text-white border-[#1e3a8a] shadow-lg scale-105' : 'bg-white text-slate-800 border-slate-200 hover:border-blue-300'}`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${activeRoute === r.id ? 'bg-amber-400 text-slate-950' : 'bg-blue-50 text-[#1e3a8a]'}`}>
                  {r.busNumber}
                </span>
                <Bus className={`w-5 h-5 ${activeRoute === r.id ? 'text-amber-400' : 'text-slate-400'}`} />
              </div>
              <h3 className="font-black text-sm">{r.name.split(":")[0]}</h3>
              <p className={`text-xs mt-1 ${activeRoute === r.id ? 'text-blue-200' : 'text-slate-500'}`}>{r.name.split(":")[1]}</p>
            </button>
          ))}
        </div>

        {/* Active Route Details Card */}
        {currentRoute && (
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-md mb-12">
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-slate-100 pb-6 mb-8">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900">{currentRoute.name}</h2>
                </div>
                <p className="text-xs text-slate-500 font-medium mt-1">Bus Assigned: <strong className="text-[#1e3a8a] font-mono">{currentRoute.busNumber}</strong> • Coordinator: {currentRoute.driver}</p>
              </div>

              <div className="flex gap-4">
                <div className="p-3.5 bg-blue-50 rounded-2xl border border-blue-100 text-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Morning Start</span>
                  <span className="text-base font-black text-[#1e3a8a]">{currentRoute.morningDeparture}</span>
                </div>
                <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-100 text-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Campus Arrival</span>
                  <span className="text-base font-black text-emerald-700">{currentRoute.campusArrival}</span>
                </div>
                <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-100 text-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Evening Return</span>
                  <span className="text-base font-black text-amber-700">{currentRoute.eveningDeparture}</span>
                </div>
              </div>
            </div>

            {/* Timeline Route Stops */}
            <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
              <Navigation className="w-5 h-5 text-[#1e3a8a]" /> Scheduled Pickup Points & Arrival Times
            </h3>

            <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-blue-200">
              {currentRoute.stops.map((st, sIdx) => (
                <div key={sIdx} className="relative flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-blue-300 transition-colors">
                  <div className="absolute -left-6 sm:-left-8 w-6 h-6 rounded-full bg-[#1e3a8a] border-4 border-white shadow-md flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400"></div>
                  </div>
                  <div>
                    <h4 className="font-black text-sm text-slate-900">{st.stop}</h4>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">Stop #{sIdx + 1} on route sequence</p>
                  </div>
                  <div className="px-3 py-1 bg-white border border-slate-200 rounded-xl text-xs font-mono font-black text-[#1e3a8a] shadow-xs">
                    {st.time}
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* Transport Fees & Guidelines */}
        <div className="grid md:grid-cols-2 gap-8">
          
          <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-xl flex flex-col justify-between">
            <div>
              <div className="p-3 bg-amber-400/20 text-amber-400 rounded-2xl w-fit mb-4">
                <CreditCard className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-black">Transport Fee & Pass Issuance</h3>
              <p className="text-slate-300 text-sm mt-2 leading-relaxed">
                Semester Bus Pass fee is ₹14,000 / semester (inclusive of morning pickup and evening drop). Students can pay transport fees directly via the Online Fee Portal.
              </p>
              <div className="mt-6 p-4 bg-white/10 rounded-2xl border border-white/20 text-xs text-blue-200">
                ⚡ RFID-enabled Smart Bus Passes are issued by the Transport Desk (Room 104) upon fee clearance.
              </div>
            </div>
            <div className="mt-6">
              <Link
                to="/pay-fees"
                className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-center text-xs uppercase tracking-wider block transition-colors shadow-md"
              >
                Pay Transport Fees Online →
              </Link>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <ShieldCheck className="text-emerald-500" /> Transport Safety & Discipline Policy
            </h3>
            <ul className="space-y-3 text-xs sm:text-sm text-slate-600 font-medium">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Students must reach designated pickup stops 5 minutes prior to scheduled time.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Physical or Digital SVIST Student ID card must be presented upon boarding.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>All buses are GPS-tracked with 24/7 CCTV surveillance and speed limiters.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Emergency helpline for route delays or lost items: <strong>+91 33 2401 XXXX</strong></span>
              </li>
            </ul>
          </div>

        </div>

      </div>
    </div>
  )
}
