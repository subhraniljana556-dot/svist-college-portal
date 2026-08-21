import { useState } from "react"
import { ShieldAlert, Lock, Radio, Send, Edit, Trash2, Percent, X } from "lucide-react"
import { apiFetch } from "../config/api"

export default function HODLoginView() {
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
    const { data } = await apiFetch("/api/students");
    if (data) {
      setStudents(data);
      const initialVals = {};
      data.forEach(s => initialVals[s._id] = s.attendance || 0);
      setAttendanceVals(initialVals);
    }
  };

  const fetchNotices = async () => {
    const { data } = await apiFetch("/api/notices");
    if (data) setNotices(data);
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    const { data, error } = await apiFetch("/api/hod/login", {
      method: "POST", body: JSON.stringify(loginData),
    });
    if (data) {
      setToken(data.token);
      fetchStudents(); 
      fetchNotices();
    } else {
      alert("ACCESS DENIED: " + (error || "Unknown error"));
    }
  };

  const handleBroadcast = async (e) => {
    e.preventDefault();
    setStatus("Broadcasting...");
    
    const endpoint = editingNoticeId ? `/api/notices/${editingNoticeId}` : "/api/notices";
    const method = editingNoticeId ? "PUT" : "POST";

    const { data, error } = await apiFetch(endpoint, {
      method, headers: { "Authorization": token }, body: JSON.stringify(noticeData),
    });
    if (data) {
      setStatus(`SUCCESS: Notice ${editingNoticeId ? 'Updated' : 'Broadcasted'}!`);
      setNoticeData({ title: "", category: "Academic Notice", description: "", documentUrl: "" });
      setEditingNoticeId(null);
      fetchNotices(); 
      setTimeout(() => setStatus(""), 4000); 
    } else {
      setStatus(error || "FAILED: Master Key rejected.");
    }
  };

  const handleDeleteNotice = async (id) => {
     if(!window.confirm("Delete this notice permanently?")) return;
     const { data } = await apiFetch(`/api/notices/${id}`, {
       method: "DELETE", headers: {"Authorization": token}
     });
     if(data) fetchNotices();
  }

  const handleEditNotice = (n) => {
     setEditingNoticeId(n._id);
     setNoticeData({ title: n.title, category: n.category, description: n.description, documentUrl: n.documentUrl || "" });
  }

  const updateAttendance = async (id) => {
    const { data, error } = await apiFetch(`/api/students/${id}/attendance`, {
      method: "PATCH",
      headers: { "Authorization": token },
      body: JSON.stringify({ attendance: attendanceVals[id] })
    });
    if (data) {
      alert("Attendance Sync Successful!");
      fetchStudents();
    } else {
      alert(error || "Failed to sync attendance. Check credentials.");
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
