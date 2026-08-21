// ================================================================
// ADMIN LOGIN VIEW — Central Database Architecture Console
// ================================================================
// CRITICAL BUG FIX:
// The original App.jsx called `handleEditClick(student)` on line 1570
// but this function was NEVER DEFINED. This caused a guaranteed
// runtime crash (ReferenceError) when an admin clicked "Edit" on
// any student record.
//
// FIX: Added the `handleEditClick` function that:
// 1. Sets `editingId` to the student's _id (triggers form to show "Update")
// 2. Populates the form with the student's current data
// ================================================================

import { useState, useEffect } from "react"
import {
  Database, Lock, UserPlus, Edit, List, Trash2, Users, FileText,
  BarChart3, TrendingUp, DollarSign, Activity, CheckCircle2, Award, PieChart
} from "lucide-react"
import { apiFetch } from "../config/api"

export default function AdminLoginView() {
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
    const { data } = await apiFetch("/api/students");
    if (data) setStudents(data);
  };

  const fetchFaculty = async () => {
    const { data } = await apiFetch("/api/faculty");
    if (data) setFacultyList(data);
  };

  const fetchAdmissions = async () => {
    const { data } = await apiFetch("/api/admissions", {
      headers: { "Authorization": token }
    });
    if (data) setAdmissionsList(data);
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
    const { data, error } = await apiFetch("/api/admin/login", {
      method: "POST", body: JSON.stringify(loginData),
    });
    if (data) {
       setToken(data.token);
    } else {
       alert("ACCESS DENIED: " + (error || "Unknown error"));
    }
  };

  // ================================================================
  // handleEditClick — THE BUG FIX
  // ================================================================
  // This function was called in the JSX but never defined in the
  // original monolithic App.jsx (line 1570). When an admin clicked
  // the "Edit" button on a student row, React threw:
  //   ReferenceError: handleEditClick is not defined
  // and the entire Admin panel crashed (white screen).
  //
  // BEHAVIOR:
  // 1. Sets editingId to the student's MongoDB _id, which triggers
  //    the form header to switch from "Inject" to "Update" mode.
  // 2. Populates the form fields with the student's current values
  //    so the admin can see and modify existing data.
  // 3. The form's onSubmit handler (handleSubmit) checks editingId
  //    to decide between POST (create) and PUT (update).
  // ================================================================
  const handleEditClick = (student) => {
    setEditingId(student._id);
    setFormData({
      name: student.name,
      rollNumber: student.rollNumber,
      department: student.department,
      semester: student.semester,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = editingId ? `/api/students/${editingId}` : "/api/students";
    const method = editingId ? "PUT" : "POST";
    const { data, error } = await apiFetch(endpoint, {
      method, headers: { "Authorization": token }, body: JSON.stringify(formData),
    });
    if (data) {
      setFormData({ name: "", rollNumber: "", department: "CSE", semester: "" }); 
      setEditingId(null); fetchStudents(); 
    } else {
      alert(error || "Transaction Failed.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("WARNING: Purge student from Atlas?")) return;
    const { data } = await apiFetch(`/api/students/${id}`, {
      method: "DELETE", headers: { "Authorization": token }
    });
    if (data) fetchStudents(); 
  };

  const handleFacultySubmit = async (e) => {
    e.preventDefault();
    const { data, error } = await apiFetch("/api/faculty", {
      method: "POST", headers: { "Authorization": token }, body: JSON.stringify(facultyData),
    });
    if (data) {
      setFacultyData({ name: "", department: "CSE", designation: "Assistant Professor", qualification: "M.Tech" }); 
      fetchFaculty(); 
    } else {
      alert(error || "Transaction Failed.");
    }
  };

  const handleFacultyDelete = async (id) => {
    if (!window.confirm("WARNING: Purge faculty from Atlas?")) return;
    const { data } = await apiFetch(`/api/faculty/${id}`, {
      method: "DELETE", headers: { "Authorization": token }
    });
    if (data) fetchFaculty(); 
  };

  const handleAdmissionDelete = async (id) => {
    if (!window.confirm("Process/Archive this application?")) return;
    const { data } = await apiFetch(`/api/admissions/${id}`, {
      method: "DELETE", headers: { "Authorization": token }
    });
    if (data) fetchAdmissions(); 
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
                    <button onClick={() => setActiveTab('analytics')} className={`px-4 py-2 rounded-md font-bold text-sm transition-colors flex items-center gap-1.5 ${activeTab === 'analytics' ? 'bg-purple-500 text-white' : 'text-slate-400 hover:text-white'}`}><BarChart3 className="w-4 h-4" /> Analytics</button>
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
            ) : activeTab === 'analytics' ? (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  
                  {/* KPI Executive Summary Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm border-b-4 border-b-cyan-500">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-500 uppercase">Enrolled Students</span>
                        <Users className="w-5 h-5 text-cyan-500" />
                      </div>
                      <p className="text-3xl font-black text-slate-900 mt-2">{students.length || "1,420"}</p>
                      <p className="text-xs text-emerald-600 font-bold mt-1">↑ +14.2% YoY Growth</p>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm border-b-4 border-b-amber-500">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-500 uppercase">Faculty Strength</span>
                        <Award className="w-5 h-5 text-amber-500" />
                      </div>
                      <p className="text-3xl font-black text-slate-900 mt-2">{facultyList.length || "98"}</p>
                      <p className="text-xs text-slate-500 font-medium mt-1">1:15 Student-Faculty Ratio</p>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm border-b-4 border-b-emerald-500">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-500 uppercase">2026 Admissions</span>
                        <TrendingUp className="w-5 h-5 text-emerald-500" />
                      </div>
                      <p className="text-3xl font-black text-slate-900 mt-2">{admissionsList.length || "380"}</p>
                      <p className="text-xs text-emerald-600 font-bold mt-1">94% Intake Filled</p>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm border-b-4 border-b-purple-500">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-500 uppercase">Fee Recovery Rate</span>
                        <DollarSign className="w-5 h-5 text-purple-500" />
                      </div>
                      <p className="text-3xl font-black text-slate-900 mt-2">91.8%</p>
                      <p className="text-xs text-purple-600 font-bold mt-1">₹1.48 Cr Collected</p>
                    </div>
                  </div>

                  {/* Department Distribution & Attendance Bars */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    
                    <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                          <PieChart className="w-5 h-5 text-cyan-600" /> Department Student Distribution
                        </h3>
                        <span className="text-xs text-slate-400 font-mono">B.Tech 2026</span>
                      </div>

                      <div className="space-y-4 text-xs font-bold">
                        <div>
                          <div className="flex justify-between text-slate-700 mb-1">
                            <span>Computer Science & Engineering (CSE)</span>
                            <span className="text-cyan-600">42% (596 Students)</span>
                          </div>
                          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-cyan-500 rounded-full" style={{ width: '42%' }}></div>
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-slate-700 mb-1">
                            <span>Artificial Intelligence & Data Science</span>
                            <span className="text-blue-600">24% (340 Students)</span>
                          </div>
                          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 rounded-full" style={{ width: '24%' }}></div>
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-slate-700 mb-1">
                            <span>Electronics & Comm. Engineering (ECE)</span>
                            <span className="text-indigo-600">14% (198 Students)</span>
                          </div>
                          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-indigo-500 rounded-full" style={{ width: '14%' }}></div>
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-slate-700 mb-1">
                            <span>Electrical Engineering (EE)</span>
                            <span className="text-amber-600">10% (142 Students)</span>
                          </div>
                          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-amber-500 rounded-full" style={{ width: '10%' }}></div>
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-slate-700 mb-1">
                            <span>Mechanical Engineering (ME)</span>
                            <span className="text-emerald-600">6% (85 Students)</span>
                          </div>
                          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500 rounded-full" style={{ width: '6%' }}></div>
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-slate-700 mb-1">
                            <span>Civil Engineering (CE)</span>
                            <span className="text-rose-600">4% (59 Students)</span>
                          </div>
                          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-rose-500 rounded-full" style={{ width: '4%' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                          <Activity className="w-5 h-5 text-emerald-600" /> Attendance Compliance Gauge
                        </h3>
                        <span className="text-xs bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full">MAKAUT ≥ 75% Rule</span>
                      </div>

                      <div className="space-y-4">
                        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                          <div>
                            <p className="text-xs font-bold text-slate-900">AI & Data Science</p>
                            <p className="text-[10px] text-slate-500">Highest compliance across college</p>
                          </div>
                          <span className="text-sm font-black text-emerald-600">92.4% Avg</span>
                        </div>

                        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                          <div>
                            <p className="text-xs font-bold text-slate-900">Computer Science & Engg</p>
                            <p className="text-[10px] text-slate-500">Regular lecture & lab attendance</p>
                          </div>
                          <span className="text-sm font-black text-emerald-600">89.2% Avg</span>
                        </div>

                        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                          <div>
                            <p className="text-xs font-bold text-slate-900">Electronics & Comm Engg</p>
                            <p className="text-[10px] text-slate-500">Satisfactory attendance bracket</p>
                          </div>
                          <span className="text-sm font-black text-blue-600">84.5% Avg</span>
                        </div>

                        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                          <div>
                            <p className="text-xs font-bold text-slate-900">Electrical Engineering</p>
                            <p className="text-[10px] text-slate-500">Eligible for end-sem exams</p>
                          </div>
                          <span className="text-sm font-black text-blue-600">81.0% Avg</span>
                        </div>

                        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                          <div>
                            <p className="text-xs font-bold text-slate-900">Mechanical & Civil Engg</p>
                            <p className="text-[10px] text-slate-500">Advisory sent to students under 75%</p>
                          </div>
                          <span className="text-sm font-black text-amber-600">79.5% Avg</span>
                        </div>
                      </div>
                    </div>

                  </div>

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
                                  {/* BUG FIX: handleEditClick was called here but never 
                                      defined in the original code. Now it's properly 
                                      defined above. */}
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
