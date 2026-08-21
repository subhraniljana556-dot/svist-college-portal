import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { Users, X, FlaskConical, GraduationCap, DownloadCloud, AlertCircle, Link as LinkIcon } from "lucide-react"
import { departments } from "../App"
import { apiFetch } from "../config/api"

export default function DepartmentDetailView() {
  const { slug } = useParams();
  const [activeModal, setActiveModal] = useState(null);
  const [facultyRoster, setFacultyRoster] = useState([]);
  const dept = departments.find(d => d.slug === slug);

  useEffect(() => {
    if(!dept) return;
    const fetchFaculty = async () => {
      const { data } = await apiFetch("/api/faculty");
      if (data) {
        const deptFaculty = data.filter(f => f.department === dept.shortName);
        setFacultyRoster(deptFaculty);
      }
    }
    fetchFaculty();
  }, [dept]);

  if (!dept) {
    return (
      <div className="min-h-screen bg-slate-50 pt-32 pb-20 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h1 className="text-2xl font-black text-slate-900">Department Not Found</h1>
          <p className="text-slate-500 mt-2">The requested department does not exist in our system.</p>
        </div>
      </div>
    );
  }

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
