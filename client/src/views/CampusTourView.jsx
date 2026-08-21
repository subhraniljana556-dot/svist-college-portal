// ================================================================
// CAMPUS VIRTUAL TOUR & INFRASTRUCTURE EXPLORER VIEW
// ================================================================

import React, { useState } from "react"
import {
  Building2, Cpu, BookOpen, Monitor, Award, CheckCircle2,
  Layers, MapPin, Sparkles, Phone, ShieldCheck, ChevronRight, Eye, Video
} from "lucide-react"

export default function CampusTourView() {
  const [activeCategory, setActiveCategory] = useState("computing")
  const [selectedFacility, setSelectedFacility] = useState(null)

  const facilities = {
    computing: {
      title: "Advanced Computing & AI Laboratories",
      description: "State-of-the-art computational infrastructure supporting Artificial Intelligence, Machine Learning, Deep Learning, Cloud Architectures, and Full-Stack Software Engineering.",
      items: [
        {
          name: "High-Performance AI & Cloud Computing Lab",
          floor: "Academic Block A • 3rd Floor",
          capacity: "120 Workstations",
          specs: "Intel Core i7-13700, 32GB RAM, NVIDIA RTX 4070 GPUs, 1 Gbps Leased Fiber Line",
          image: "https://images.unsplash.com/photo-1562774053-701939374585?w=800&auto=format&fit=crop&q=60",
          highlights: ["Deep Learning & PyTorch Testbed", "Kubernetes Multi-Node Cluster", "Dual 4K Display Stations"]
        },
        {
          name: "Data Structures & Algorithm Lab",
          floor: "Academic Block A • 2nd Floor",
          capacity: "90 Workstations",
          specs: "Intel Core i5-12400, 16GB DDR4, Ubuntu Linux & Windows Dual Boot",
          image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=60",
          highlights: ["Automated Code Evaluation Engine", "Competitive Programming Sandbox", "Database Servers (PostgreSQL/MongoDB)"]
        },
        {
          name: "Cybersecurity & Network Systems Lab",
          floor: "Academic Block B • 1st Floor",
          capacity: "80 Workstations",
          specs: "Cisco Catalyst Managed Switches, Hardware Firewalls, Kali Linux Virtualized Nodes",
          image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=60",
          highlights: ["Packet Analysis with Wireshark", "Penetration Testing Testbed", "Network Simulation (NS-3)"]
        }
      ]
    },
    core: {
      title: "Core Engineering Laboratories & Workshops",
      description: "Hands-on structural modeling, VLSI circuit prototyping, power transmission testing, and CNC machining centers.",
      items: [
        {
          name: "VLSI & Embedded Systems Laboratory",
          floor: "ECE Block • Ground Floor",
          capacity: "60 Seats",
          specs: "Xilinx FPGA Vivado Design Kits, Cadence EDA Suite, Mixed-Signal Oscilloscopes",
          image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=60",
          highlights: ["FPGA Synthesis & ASIC Design", "ARM Cortex-M4 Microcontroller Kits", "Logic Analyzers & Spectrum Analyzers"]
        },
        {
          name: "High-Voltage Electrical Machines Lab",
          floor: "EE Block • Ground Floor",
          capacity: "75 Seats",
          specs: "AC/DC Motor-Generator Sets, 3-Phase Transformers, Synchronization Panels",
          image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&auto=format&fit=crop&q=60",
          highlights: ["Synchronous Machine Testing", "Power Electronics Drives", "High Voltage Isolation Benches"]
        },
        {
          name: "Central CAD/CAM & Manufacturing Workshop",
          floor: "Mechanical Complex",
          capacity: "100 Students",
          specs: "CNC Lathe, Vertical Machining Center, TIG/MIG Welding Bays, Universal Testing Machine",
          image: "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=800&auto=format&fit=crop&q=60",
          highlights: ["SolidWorks & ANSYS Simulation", "Automated Metal Turning & Milling", "Material Tensile Stress Analysis"]
        }
      ]
    },
    library: {
      title: "Central Library & Digital Knowledge Center",
      description: "An extensive academic archive housing over 50,000 physical text volumes, IEEE Xplore e-journals, and air-conditioned digital reading halls.",
      items: [
        {
          name: "Nationalized Book Bank & Reading Hall",
          floor: "Central Block • 1st & 2nd Floor",
          capacity: "350 Students",
          specs: "50,000+ Text & Reference Volumes, Automated RFID Issue/Return Kiosks",
          image: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800&auto=format&fit=crop&q=60",
          highlights: ["Full Semester Book Bank for Every Student", "Quiet Research Cabins", "National & International Journal Archives"]
        },
        {
          name: "Digital e-Library & IEEE Resource Lab",
          floor: "Central Block • 2nd Floor",
          capacity: "80 Terminals",
          specs: "Direct Campus Access to IEEE, Springer, ScienceDirect, and NPTEL Video Lectures",
          image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800&auto=format&fit=crop&q=60",
          highlights: ["High-speed e-book downloads", "Plagiarism Checker Software", "MAKAUT Previous Years Question Bank"]
        }
      ]
    },
    amenities: {
      title: "Campus Amenities, Auditoriums & Residential Life",
      description: "Comprehensive living and recreational facilities designed to nurture academic focus and student wellness.",
      items: [
        {
          name: "Swami Vivekananda Central Auditorium",
          floor: "Main Administrative Complex",
          capacity: "600+ Seater",
          specs: "Fully Air-Conditioned, Acoustic Surround Sound, 4K Cinema Projector, Motorized Stage",
          image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=60",
          highlights: ["Annual TechFest & Cultural Conventions", "Corporate Placement Pre-Talks", "Distinguished Guest Lectures"]
        },
        {
          name: "On-Campus Hostels & Dining Hall",
          floor: "Residential Zone",
          capacity: "450 Students (Boys & Girls Blocks)",
          specs: "24/7 Security CCTV, High-Speed WiFi, RO Drinking Water, Hygienic Multi-Cuisine Mess",
          image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&auto=format&fit=crop&q=60",
          highlights: ["Recreation Rooms & Table Tennis", "24/7 Power Backup", "Dedicated Medical First-Aid Room"]
        },
        {
          name: "Sports Arena & Gymnasium",
          floor: "Campus Grounds",
          capacity: "Open Access",
          specs: "Full-Size Football Ground, Basketball Court, Badminton Courts, Multi-Gymnasium",
          image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=60",
          highlights: ["Inter-College Sports Championships", "Fitness Trainers", "Floodlight Evening Sports"]
        }
      ]
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20 animate-in fade-in duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Hero */}
        <div className="bg-gradient-to-r from-slate-900 via-[#1e3a8a] to-blue-950 text-white rounded-3xl p-8 sm:p-12 shadow-xl mb-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-amber-400 text-xs font-black tracking-wider uppercase mb-4">
              <Building2 className="w-3.5 h-3.5" /> 360° Virtual Campus Tour
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
              World-Class Infrastructure & Research Labs
            </h1>
            <p className="mt-4 text-blue-100 text-base sm:text-lg font-medium leading-relaxed">
              Explore SVIST's cutting-edge computational centers, heavy core engineering workshops, digital library archives, and residential life at Sonarpur, Kolkata.
            </p>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-3 mb-10">
          <button
            onClick={() => setActiveCategory("computing")}
            className={`flex items-center gap-2 px-6 py-3.5 rounded-2xl font-black text-sm transition-all shadow-sm cursor-pointer ${activeCategory === 'computing' ? 'bg-[#1e3a8a] text-white shadow-lg scale-105' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'}`}
          >
            <Cpu className="w-4 h-4 text-amber-400" /> Computing & AI Labs
          </button>
          <button
            onClick={() => setActiveCategory("core")}
            className={`flex items-center gap-2 px-6 py-3.5 rounded-2xl font-black text-sm transition-all shadow-sm cursor-pointer ${activeCategory === 'core' ? 'bg-[#1e3a8a] text-white shadow-lg scale-105' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'}`}
          >
            <Layers className="w-4 h-4 text-amber-400" /> Core Engineering & Workshops
          </button>
          <button
            onClick={() => setActiveCategory("library")}
            className={`flex items-center gap-2 px-6 py-3.5 rounded-2xl font-black text-sm transition-all shadow-sm cursor-pointer ${activeCategory === 'library' ? 'bg-[#1e3a8a] text-white shadow-lg scale-105' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'}`}
          >
            <BookOpen className="w-4 h-4 text-amber-400" /> Central Library & e-Resources
          </button>
          <button
            onClick={() => setActiveCategory("amenities")}
            className={`flex items-center gap-2 px-6 py-3.5 rounded-2xl font-black text-sm transition-all shadow-sm cursor-pointer ${activeCategory === 'amenities' ? 'bg-[#1e3a8a] text-white shadow-lg scale-105' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'}`}
          >
            <Building2 className="w-4 h-4 text-amber-400" /> Auditoriums & Hostels
          </button>
        </div>

        {/* Active Category Header */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 mb-8 shadow-sm">
          <h2 className="text-2xl font-black text-slate-900">{facilities[activeCategory].title}</h2>
          <p className="text-slate-600 font-medium text-sm sm:text-base mt-2">{facilities[activeCategory].description}</p>
        </div>

        {/* Facilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {facilities[activeCategory].items.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-md hover:shadow-2xl transition-all hover:-translate-y-2 flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-56 overflow-hidden bg-slate-900">
                  <img
                    src={item.image}
                    alt={item.name}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=60";
                    }}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                  />
                  <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md text-amber-400 px-3 py-1 rounded-full text-xs font-black border border-white/20">
                    {item.capacity}
                  </div>
                  <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-md text-white px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-blue-400" /> {item.floor}
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-black text-slate-900 group-hover:text-[#1e3a8a] transition-colors">
                    {item.name}
                  </h3>
                  
                  <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-700">
                    <span className="font-bold text-slate-900 block mb-0.5">Hardware & Lab Specifications:</span>
                    {item.specs}
                  </div>

                  <div className="mt-4 space-y-2">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Key Facilities & Features:</span>
                    {item.highlights.map((h, hIdx) => (
                      <div key={hIdx} className="flex items-center gap-2 text-xs font-bold text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0">
                <button
                  onClick={() => setSelectedFacility(item)}
                  className="w-full py-3 bg-blue-50 hover:bg-[#1e3a8a] text-[#1e3a8a] hover:text-white font-black rounded-xl text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 border border-blue-200 cursor-pointer"
                >
                  <Eye className="w-4 h-4" /> View Full Specs & Photo
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Facility Detail Modal */}
        {selectedFacility && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200 animate-in zoom-in-95">
              <div className="relative h-64 bg-slate-900">
                <img
                  src={selectedFacility.image}
                  alt={selectedFacility.name}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=60";
                  }}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setSelectedFacility(null)}
                  className="absolute top-4 right-4 p-2 bg-black/60 hover:bg-red-600 text-white rounded-full transition-colors cursor-pointer"
                >
                  ✕
                </button>
                <div className="absolute bottom-4 left-4 bg-slate-900/80 backdrop-blur-md text-white p-3 rounded-2xl border border-white/20">
                  <h3 className="text-lg font-black">{selectedFacility.name}</h3>
                  <p className="text-xs text-blue-200 flex items-center gap-1 mt-0.5"><MapPin className="w-3.5 h-3.5" /> {selectedFacility.floor}</p>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
                  <span className="font-black text-slate-900 block mb-1">Equipment Details:</span>
                  <p className="text-slate-700">{selectedFacility.specs}</p>
                </div>
                <div>
                  <span className="font-black text-xs text-slate-400 uppercase tracking-wider block mb-2">Key Lab Features:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedFacility.highlights.map((h, i) => (
                      <div key={i} className="p-2.5 bg-blue-50/60 rounded-xl text-xs font-bold text-slate-800 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#1e3a8a]" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="pt-2 text-right">
                  <button
                    onClick={() => setSelectedFacility(null)}
                    className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs uppercase cursor-pointer"
                  >
                    Close Preview
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
