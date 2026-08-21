// ================================================================
// STUDENT LOGIN VIEW — Attendance, Fees & Academic Console
// ================================================================

import React, { useState, useEffect } from "react"
import {
  GraduationCap, X, Activity, Calendar, BookOpen, FileText, AlertCircle,
  LogOut, CreditCard, CheckCircle2, Download, ShieldCheck, History, Clock,
  FileSpreadsheet, Receipt, Contact, Calculator, Printer, Sparkles, QrCode, ArrowRight, ExternalLink,
  Award, FileCheck, Stamp
} from "lucide-react"
import { apiFetch } from "../config/api"

function AttendanceRing({ percentage }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - percentage / 100);
  
  const color = percentage >= 75 ? "#10b981" : "#ef4444";
  const bgColor = percentage >= 75 ? "#d1fae5" : "#fecaca";

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="140" height="140" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r={radius} fill="none" stroke={bgColor} strokeWidth="10" />
        <circle
          cx="60" cy="60" r={radius} fill="none"
          stroke={color} strokeWidth="10" strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 60 60)"
          style={{ transition: "stroke-dashoffset 1s ease-in-out" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-black" style={{ color }}>{percentage}%</span>
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Attendance</span>
      </div>
    </div>
  );
}

export default function StudentLoginView() {
  const [token, setToken] = useState("");
  const [studentData, setStudentData] = useState(null);
  const [loginData, setLoginData] = useState({ rollNumber: "", password: "" });
  const [error, setError] = useState("");
  const [activeModal, setActiveModal] = useState(null); 

  // Finance / Fee Gateway States
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [feeReceipts, setFeeReceipts] = useState([]);
  const [latestReceipt, setLatestReceipt] = useState(null);

  // Self-Service Certificate State
  const [certType, setCertType] = useState("bonafide"); // 'bonafide', 'nodues', 'character'

  // SGPA Calculator State
  const [gpaSubjects, setGpaSubjects] = useState([
    { name: "Design & Analysis of Algorithms", credits: 4, gradePoint: 9 },
    { name: "Operating Systems & Kernels", credits: 4, gradePoint: 9 },
    { name: "Formal Language & Automata", credits: 3, gradePoint: 8 },
    { name: "Database Management Systems", credits: 4, gradePoint: 10 },
    { name: "Environmental Sciences", credits: 2, gradePoint: 8 },
    { name: "Algorithms & OS Laboratory", credits: 3, gradePoint: 10 },
  ]);

  const gradeOptions = [
    { label: "O (Outstanding - 10)", value: 10 },
    { label: "E (Excellent - 9)", value: 9 },
    { label: "A (Very Good - 8)", value: 8 },
    { label: "B (Good - 7)", value: 7 },
    { label: "C (Fair - 6)", value: 6 },
    { label: "D (Pass - 5)", value: 5 },
    { label: "F (Fail - 0)", value: 0 },
  ];

  const calculateSgpa = () => {
    const totalCredits = gpaSubjects.reduce((acc, s) => acc + s.credits, 0);
    const totalPoints = gpaSubjects.reduce((acc, s) => acc + (s.credits * s.gradePoint), 0);
    return (totalPoints / totalCredits).toFixed(2);
  };

  const handleChange = (e) => setLoginData({ ...loginData, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    const { data, error: apiError } = await apiFetch("/api/students/login", {
      method: "POST", body: JSON.stringify(loginData),
    });
    if (data) {
      setToken(data.token);
      setStudentData(data.studentData);
      fetchReceipts(data.studentData.rollNumber);
    } else {
      setError(apiError || "Login Failed.");
    }
  };

  const fetchReceipts = async (roll) => {
    if (!roll) return;
    const { data } = await apiFetch(`/api/finance/receipts/${roll}`);
    if (data) {
      setFeeReceipts(data);
    }
  };

  const handleLogout = () => {
    setToken("");
    setStudentData(null);
    setLoginData({ rollNumber: "", password: "" });
    setActiveModal(null);
    setLatestReceipt(null);
    setPaymentStatus(null);
  };

  const handleFeePayment = async () => {
    if (!studentData) return;
    setIsProcessing(true);
    setPaymentStatus({ type: "info", message: "Connecting to SVIST Payment Gateway..." });

    const payload = {
      studentId: studentData._id,
      studentRoll: studentData.rollNumber,
      studentName: studentData.name,
      semester: studentData.semester,
      amount: 52000,
    };

    const { data, error: payError } = await apiFetch("/api/finance/pay", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    setIsProcessing(false);

    if (data && data.success) {
      setLatestReceipt(data.receipt);
      setPaymentStatus({ type: "success", message: "Transaction Approved & Verified!" });
      fetchReceipts(studentData.rollNumber);
    } else {
      setPaymentStatus({
        type: "error",
        message: payError || "Payment failed. Please try again.",
      });
    }
  };

  if (token && studentData) {
    const subjectStats = {};
    if (studentData.attendanceLog && studentData.attendanceLog.length > 0) {
      studentData.attendanceLog.forEach(entry => {
        if (!subjectStats[entry.subject]) {
          subjectStats[entry.subject] = { total: 0, present: 0 };
        }
        subjectStats[entry.subject].total += 1;
        if (entry.status === "Present") {
          subjectStats[entry.subject].present += 1;
        }
      });
    }
    const subjectList = Object.entries(subjectStats).map(([subject, stats]) => ({
      subject,
      total: stats.total,
      present: stats.present,
      percentage: Math.round((stats.present / stats.total) * 100),
    }));

    return (
      <div className="min-h-screen bg-slate-50 pt-32 pb-20 animate-in fade-in duration-500">
        <div className="mx-auto max-w-5xl px-4 relative">
          
          {/* ============================================================ */}
          {/* MODAL DIALOGS */}
          {/* ============================================================ */}
          {activeModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-200 my-8">
                <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50">
                  <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                    {activeModal === 'lms' && <BookOpen className="text-blue-500"/>}
                    {activeModal === 'results' && <FileText className="text-amber-500"/>}
                    {activeModal === 'attendance' && <Activity className="text-emerald-500"/>}
                    {activeModal === 'routine' && <Calendar className="text-purple-500"/>}
                    {activeModal === 'fees' && <CreditCard className="text-amber-500"/>}
                    {activeModal === 'idcard' && <Contact className="text-blue-500"/>}
                    {activeModal === 'gpa' && <Calculator className="text-indigo-500"/>}
                    {activeModal === 'certificates' && <Award className="text-emerald-500"/>}
                    {activeModal === 'lms' && 'Student E-Learning & Course LMS'}
                    {activeModal === 'results' && 'MAKAUT Semester Grade Cards & Academic Results'}
                    {activeModal === 'attendance' && 'Attendance Dashboard'}
                    {activeModal === 'routine' && 'Class Routine Matrix'}
                    {activeModal === 'fees' && `Semester ${studentData.semester} Fee Gateway & Receipts`}
                    {activeModal === 'idcard' && 'Official Digital Student Identity Card'}
                    {activeModal === 'gpa' && 'MAKAUT SGPA & Credit Calculator'}
                    {activeModal === 'certificates' && 'Official Self-Service Certificates & Clearances'}
                  </h3>
                  <button onClick={() => { setActiveModal(null); setPaymentStatus(null); }} className="p-2 bg-white hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-full transition-colors border border-slate-200 cursor-pointer">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-8 max-h-[75vh] overflow-y-auto">
                  
                  {/* --- LMS & E-LEARNING MODAL --- */}
                  {activeModal === 'lms' && (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between bg-blue-50 p-4 rounded-2xl border border-blue-100">
                        <div>
                          <h4 className="font-black text-slate-900 text-sm">Active Semester 4 Digital Courseware</h4>
                          <p className="text-xs text-slate-600">Download syllabus notes, lab worksheets, and access recorded lectures.</p>
                        </div>
                        <span className="px-3 py-1 bg-[#1e3a8a] text-white text-xs font-bold rounded-full">
                          5 Active Modules
                        </span>
                      </div>

                      <div className="space-y-3">
                        {[
                          { code: "PCC-CS401", title: "Design & Analysis of Algorithms", faculty: "Prof. S. Jana", slides: "14 Lecture PPTs", lab: "Assignment 4 (Dynamic Programming)", color: "border-blue-200" },
                          { code: "PCC-CS402", title: "Operating Systems & Kernels", faculty: "Dr. P. Mukherjee", slides: "11 Lecture Notes", lab: "Unix Process Fork Lab 3", color: "border-emerald-200" },
                          { code: "PCC-CS403", title: "Database Management Systems", faculty: "Prof. A. Das", slides: "16 PPTs (SQL/NoSQL)", lab: "PostgreSQL Indexing Lab", color: "border-amber-200" },
                          { code: "PCC-CS404", title: "Formal Language & Automata Theory", faculty: "Prof. K. Roy", slides: "9 Lecture Guides", lab: "Turing Machine Simulator", color: "border-purple-200" },
                          { code: "PCC-CS491", title: "Algorithms & OS Laboratory", faculty: "Prof. S. Jana & Team", slides: "Lab Manual 2026", lab: "Lab Viva Examination", color: "border-cyan-200" }
                        ].map((sub, idx) => (
                          <div key={idx} className={`p-4 bg-white rounded-2xl border ${sub.color} shadow-xs hover:shadow-md transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3`}>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-xs font-bold text-[#1e3a8a] bg-blue-50 px-2 py-0.5 rounded-md">{sub.code}</span>
                                <h5 className="font-bold text-slate-900 text-sm">{sub.title}</h5>
                              </div>
                              <p className="text-xs text-slate-500 mt-1">Instructor: {sub.faculty} • {sub.slides} • {sub.lab}</p>
                            </div>
                            <div className="flex gap-2 w-full sm:w-auto">
                              <button
                                onClick={() => alert(`Downloading latest course materials & slides for ${sub.title}`)}
                                className="flex-1 sm:flex-none px-3 py-1.5 bg-[#1e3a8a] hover:bg-blue-900 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                              >
                                Download Slides
                              </button>
                              <button
                                onClick={() => alert(`Assignment portal active for ${sub.title}. Submit your PDF solution before Friday 11:59 PM.`)}
                                className="flex-1 sm:flex-none px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                              >
                                Submit Task
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-600 flex items-center justify-between">
                        <span>Official University Server: MAKAUT Exam & E-Learning Portal</span>
                        <a href="https://makautwb.ac.in/" target="_blank" rel="noreferrer" className="text-[#1e3a8a] font-bold hover:underline">makautwb.ac.in ↗</a>
                      </div>
                    </div>
                  )}

                  {/* --- ACADEMIC RESULTS & GRADE CARDS MODAL --- */}
                  {activeModal === 'results' && (
                    <div className="space-y-6">
                      
                      {/* Overall SGPA / CGPA Summary Card */}
                      <div className="bg-gradient-to-r from-slate-900 to-[#1e3a8a] text-white p-6 rounded-2xl shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block">MAKAUT Official Transcript</span>
                          <h4 className="text-2xl font-black">{studentData.name}</h4>
                          <p className="text-xs text-blue-200 font-mono mt-0.5">Roll: {studentData.rollNumber} • {studentData.department}</p>
                        </div>
                        <div className="text-left sm:text-right bg-white/10 p-3 rounded-xl border border-white/20">
                          <span className="text-[10px] text-blue-200 uppercase font-bold block">Cumulative YGPA</span>
                          <span className="text-2xl font-black text-amber-400">8.78 / 10.0</span>
                        </div>
                      </div>

                      {/* Semester Grade Card Breakdown Table */}
                      <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead className="bg-slate-900 text-white uppercase text-[10px] tracking-wider">
                            <tr>
                              <th className="p-3.5">Semester</th>
                              <th className="p-3.5">Credits Earned</th>
                              <th className="p-3.5">SGPA</th>
                              <th className="p-3.5">Key Grades</th>
                              <th className="p-3.5 text-right">Result Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                            <tr className="hover:bg-slate-50">
                              <td className="p-3.5 font-bold text-slate-900">Semester 1 (1st Year)</td>
                              <td className="p-3.5">22 Credits</td>
                              <td className="p-3.5 font-black text-emerald-600 font-mono">8.65</td>
                              <td className="p-3.5">Maths: O, Physics: E, C-Prog: O</td>
                              <td className="p-3.5 text-right"><span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded-full text-[10px]">PASSED</span></td>
                            </tr>
                            <tr className="hover:bg-slate-50">
                              <td className="p-3.5 font-bold text-slate-900">Semester 2 (1st Year)</td>
                              <td className="p-3.5">24 Credits</td>
                              <td className="p-3.5 font-black text-emerald-600 font-mono">8.80</td>
                              <td className="p-3.5">Chem: E, Data Structures: O, EE: E</td>
                              <td className="p-3.5 text-right"><span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded-full text-[10px]">PASSED</span></td>
                            </tr>
                            <tr className="hover:bg-slate-50">
                              <td className="p-3.5 font-bold text-slate-900">Semester 3 (2nd Year)</td>
                              <td className="p-3.5">24 Credits</td>
                              <td className="p-3.5 font-black text-emerald-600 font-mono">8.75</td>
                              <td className="p-3.5">Discrete Maths: E, Digital Logic: O, OOP: A</td>
                              <td className="p-3.5 text-right"><span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded-full text-[10px]">PASSED</span></td>
                            </tr>
                            <tr className="hover:bg-blue-50/50 bg-blue-50/20">
                              <td className="p-3.5 font-bold text-[#1e3a8a]">Semester 4 (Current)</td>
                              <td className="p-3.5">24 Credits</td>
                              <td className="p-3.5 font-black text-[#1e3a8a] font-mono">8.90 (Proj.)</td>
                              <td className="p-3.5">Algorithms: O, OS: E, DBMS: O</td>
                              <td className="p-3.5 text-right"><span className="px-2 py-0.5 bg-blue-100 text-[#1e3a8a] font-bold rounded-full text-[10px]">CA EVALUATED</span></td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      <div className="flex justify-end gap-3 pt-2">
                        <button
                          onClick={() => window.print()}
                          className="px-6 py-3 bg-[#1e3a8a] hover:bg-blue-900 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-md cursor-pointer"
                        >
                          <Printer className="w-4 h-4" /> Print Semester Grade Card
                        </button>
                      </div>
                    </div>
                  )}

                  {/* --- CERTIFICATES & CLEARANCES MODAL --- */}
                  {activeModal === 'certificates' && (
                    <div className="space-y-6">
                      
                      {/* Certificate Type Selector Pills */}
                      <div className="flex flex-wrap gap-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200">
                        <button
                          type="button"
                          onClick={() => setCertType("bonafide")}
                          className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs transition-all cursor-pointer ${certType === 'bonafide' ? 'bg-[#1e3a8a] text-white shadow-md' : 'text-slate-700 hover:bg-white'}`}
                        >
                          Bonafide / Study Certificate
                        </button>
                        <button
                          type="button"
                          onClick={() => setCertType("nodues")}
                          className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs transition-all cursor-pointer ${certType === 'nodues' ? 'bg-[#1e3a8a] text-white shadow-md' : 'text-slate-700 hover:bg-white'}`}
                        >
                          Semester No-Dues Slip
                        </button>
                        <button
                          type="button"
                          onClick={() => setCertType("character")}
                          className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs transition-all cursor-pointer ${certType === 'character' ? 'bg-[#1e3a8a] text-white shadow-md' : 'text-slate-700 hover:bg-white'}`}
                        >
                          Conduct & Character Certificate
                        </button>
                      </div>

                      {/* Printable Official Document Container */}
                      <div className="bg-white p-8 rounded-2xl border-2 border-slate-300 shadow-md relative text-slate-900 font-serif leading-relaxed">
                        
                        {/* Certificate Header */}
                        <div className="text-center border-b-2 border-slate-900 pb-5 mb-6">
                          <div className="flex items-center justify-center gap-3 mb-2">
                            <img src="/svist-logo.png" alt="SVIST Logo" className="h-14 w-14 object-contain" />
                            <div>
                              <h2 className="text-xl sm:text-2xl font-black text-slate-950 font-sans tracking-wide">SWAMI VIVEKANANDA INSTITUTE OF SCIENCE & TECHNOLOGY</h2>
                              <p className="text-xs text-slate-600 font-sans font-medium">Approved by AICTE, Govt. of India • Affiliated to MAKAUT, West Bengal</p>
                              <p className="text-[11px] text-slate-500 font-sans">Dakshin Gobindapur, Sonarpur, Kolkata - 700145 | www.svist.edu.in</p>
                            </div>
                          </div>
                        </div>

                        {/* Ref & Date */}
                        <div className="flex justify-between items-center text-xs font-sans font-bold text-slate-600 mb-6">
                          <span>Ref No: SVIST/ACAD/{certType.toUpperCase()}/2026/{studentData.rollNumber}</span>
                          <span>Date: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                        </div>

                        {/* Certificate Heading */}
                        <div className="text-center my-6">
                          <span className="inline-block border-b-2 border-slate-900 pb-1 text-lg font-black tracking-wider uppercase font-sans text-[#1e3a8a]">
                            {certType === 'bonafide' && "BONAFIDE STUDENT CERTIFICATE"}
                            {certType === 'nodues' && "SEMESTER FEE CLEARANCE & NO-DUES SLIP"}
                            {certType === 'character' && "CHARACTER & CONDUCT CERTIFICATE"}
                          </span>
                        </div>

                        {/* Certificate Body Text */}
                        <div className="text-sm sm:text-base space-y-4 my-8 text-justify">
                          {certType === 'bonafide' && (
                            <>
                              <p>
                                This is to certify that <strong>{studentData.name}</strong>, Son/Daughter of Sri/Smt. <strong>B. Jana</strong>, bearing University Roll Number <strong className="font-mono">{studentData.rollNumber}</strong>, is a genuine and bonafide student of this Institute.
                              </p>
                              <p>
                                The student is currently pursuing the 4-year undergraduate degree program in <strong>Bachelor of Technology (B.Tech)</strong> in <strong>{studentData.department}</strong> and is presently studying in <strong>Semester {studentData.semester}</strong> during the Academic Session <strong>2024–2028</strong>.
                              </p>
                              <p>
                                This certificate is issued upon the request of the student for the official purpose of <em>Scholarship / Railway Concession / Educational Loan / Passport Verification</em>.
                              </p>
                            </>
                          )}

                          {certType === 'nodues' && (
                            <>
                              <p>
                                This is to certify that <strong>{studentData.name}</strong> (Roll Number: <strong className="font-mono">{studentData.rollNumber}</strong>), of <strong>{studentData.department}</strong>, has successfully settled all institutional dues including Semester Tuition Fees, Laboratory Development Fees, and MAKAUT Exam Registration up to <strong>Semester {studentData.semester}</strong>.
                              </p>
                              <p>
                                The Accounts & Finance department of SVIST confirms that there are <strong>NO OUTSTANDING LIABILITIES</strong> on the central ledger against the student as on date.
                              </p>
                              <p>
                                This clearance slip validates the issuance of University Admit Cards and Semester Grade Sheets.
                              </p>
                            </>
                          )}

                          {certType === 'character' && (
                            <>
                              <p>
                                This is to certify that <strong>{studentData.name}</strong>, bearing Roll Number <strong className="font-mono">{studentData.rollNumber}</strong>, has been a student of the Department of <strong>{studentData.department}</strong> at Swami Vivekananda Institute of Science and Technology.
                              </p>
                              <p>
                                To the best of our institutional knowledge and records, the student possesses good moral character and has actively maintained exemplary discipline and academic diligence throughout the tenure at this college.
                              </p>
                              <p>
                                We wish the student all success and prosperity in all future academic and professional endeavors.
                              </p>
                            </>
                          )}
                        </div>

                        {/* Signatures & Seal */}
                        <div className="mt-12 pt-8 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-end gap-6 font-sans">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-slate-50 border border-slate-300 rounded-xl">
                              <QrCode className="w-14 h-14 text-slate-800" />
                            </div>
                            <div className="text-[10px] text-slate-500 font-mono">
                              <p className="font-bold text-slate-700">Digital Seal Verified</p>
                              <p>ID: {studentData.rollNumber}</p>
                              <p>Status: VALID</p>
                            </div>
                          </div>

                          <div className="text-center sm:text-right">
                            <div className="w-36 border-b border-slate-900 mx-auto sm:ml-auto mb-1"></div>
                            <p className="font-black text-xs text-slate-900">Dr. Sonali Sarkar</p>
                            <p className="text-[11px] text-slate-600 font-bold">Principal & Dean (Academics)</p>
                            <p className="text-[10px] text-slate-400">SVIST Kolkata</p>
                          </div>
                        </div>

                      </div>

                      {/* Print Action Bar */}
                      <div className="flex justify-end gap-3 pt-2">
                        <button
                          onClick={() => window.print()}
                          className="px-6 py-3 bg-[#1e3a8a] hover:bg-blue-900 text-white font-bold rounded-xl text-sm transition-all flex items-center gap-2 shadow-md cursor-pointer"
                        >
                          <Printer className="w-4 h-4" /> Print Official Certificate
                        </button>
                      </div>

                    </div>
                  )}

                  {/* --- DIGITAL ID CARD MODAL --- */}
                  {activeModal === 'idcard' && (
                    <div className="space-y-6">
                      <div className="max-w-md mx-auto bg-gradient-to-br from-slate-900 via-[#1e3a8a] to-blue-900 text-white rounded-3xl p-6 shadow-2xl border-4 border-amber-400/40 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />
                        
                        {/* Header */}
                        <div className="flex items-center gap-3 border-b border-white/20 pb-4 mb-5">
                          <div className="bg-white p-1 rounded-xl">
                            <img src="/svist-logo.png" alt="SVIST Logo" className="h-10 w-10 object-contain" />
                          </div>
                          <div>
                            <h4 className="text-sm font-black tracking-tight leading-tight">SWAMI VIVEKANANDA</h4>
                            <p className="text-[10px] text-amber-400 uppercase font-bold tracking-widest">Inst. of Science & Technology</p>
                          </div>
                          <span className="ml-auto text-[9px] bg-amber-400 text-slate-950 font-black px-2 py-0.5 rounded-full uppercase">
                            Student ID
                          </span>
                        </div>

                        {/* Body Details */}
                        <div className="flex gap-4 items-center">
                          <div className="w-20 h-24 bg-white/20 rounded-2xl border-2 border-white/40 flex flex-col items-center justify-center shrink-0 overflow-hidden text-amber-300 font-black text-2xl shadow-inner">
                            {studentData.name.charAt(0)}
                          </div>
                          <div className="space-y-1 text-xs">
                            <p className="text-base font-black text-white">{studentData.name}</p>
                            <p className="text-blue-200">Roll: <span className="font-mono font-bold text-white">{studentData.rollNumber}</span></p>
                            <p className="text-blue-200">Dept: <span className="font-bold text-white">{studentData.department} (B.Tech)</span></p>
                            <p className="text-blue-200">Semester: <span className="font-bold text-white">{studentData.semester}th Semester</span></p>
                            <p className="text-blue-200">Blood Group: <span className="font-bold text-amber-400">O+ Positive</span></p>
                          </div>
                        </div>

                        {/* Barcode & Seal */}
                        <div className="mt-6 pt-4 border-t border-white/20 flex items-center justify-between">
                          <div className="space-y-0.5">
                            <div className="h-6 w-32 bg-white/90 rounded px-1 flex items-center justify-between">
                              <span className="font-mono text-[9px] font-black text-slate-900 tracking-widest">||| | |||| | || |||</span>
                            </div>
                            <span className="text-[9px] text-slate-300 font-mono">MAKAUT-REG-2024-SVIST</span>
                          </div>
                          <div className="text-right">
                            <span className="text-[9px] text-blue-200 block uppercase">Valid Till</span>
                            <span className="text-xs font-bold text-amber-400">June 2028</span>
                          </div>
                        </div>

                      </div>

                      {/* Print ID Card Button */}
                      <div className="text-center pt-2">
                        <button
                          onClick={() => window.print()}
                          className="px-6 py-3 bg-[#1e3a8a] text-white font-bold rounded-xl hover:bg-blue-800 transition-colors inline-flex items-center gap-2 shadow-md cursor-pointer"
                        >
                          <Printer className="w-4 h-4" /> Print / Download Official ID Card
                        </button>
                      </div>
                    </div>
                  )}

                  {/* --- MAKAUT SGPA CALCULATOR MODAL --- */}
                  {activeModal === 'gpa' && (
                    <div className="space-y-6">
                      <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-2xl flex items-center justify-between">
                        <div>
                          <h4 className="font-black text-indigo-950 text-base">MAKAUT 10-Point Credit SGPA Calculator</h4>
                          <p className="text-xs text-indigo-700 mt-0.5">Select your anticipated letter grades to forecast your semester SGPA</p>
                        </div>
                        <div className="text-right bg-white px-4 py-2 rounded-xl border border-indigo-200 shadow-sm">
                          <span className="text-[10px] text-slate-500 font-bold uppercase block">Projected SGPA</span>
                          <span className="text-2xl font-black text-indigo-600 font-mono">{calculateSgpa()}</span>
                        </div>
                      </div>

                      <div className="space-y-3">
                        {gpaSubjects.map((sub, idx) => (
                          <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div>
                              <p className="font-bold text-sm text-slate-900">{sub.name}</p>
                              <span className="text-xs text-slate-500">Credits: <strong className="text-slate-800">{sub.credits}</strong></span>
                            </div>
                            <select
                              value={sub.gradePoint}
                              onChange={(e) => {
                                const newSubs = [...gpaSubjects];
                                newSubs[idx].gradePoint = Number(e.target.value);
                                setGpaSubjects(newSubs);
                              }}
                              className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                              {gradeOptions.map(g => (
                                <option key={g.value} value={g.value}>{g.label}</option>
                              ))}
                            </select>
                          </div>
                        ))}
                      </div>

                      <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs">
                        <span className="font-bold text-emerald-900">Total Registered Semester Credits: 20</span>
                        <span className="font-black text-emerald-700 text-sm">Target Status: First Class with Honours</span>
                      </div>
                    </div>
                  )}

                  {/* --- ATTENDANCE DASHBOARD MODAL --- */}
                  {activeModal === 'attendance' && (
                    <div>
                      <div className="flex flex-col sm:flex-row items-center gap-8 mb-8 pb-8 border-b border-slate-100">
                        <AttendanceRing percentage={studentData.attendance || 0} />
                        <div className="flex-1 text-center sm:text-left">
                          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Examination Eligibility</p>
                          <p className={`text-xl font-black ${studentData.attendance >= 75 ? 'text-emerald-600' : 'text-red-600'}`}>
                            {studentData.attendance >= 75 ? "✓ Eligible for Examinations" : "⚠ Below 75% Threshold — Warning"}
                          </p>
                          <p className="text-sm text-slate-500 mt-2">
                            Minimum 75% required as per MAKAUT guidelines.
                          </p>
                        </div>
                      </div>

                      {subjectList.length > 0 ? (
                        <div className="mb-8">
                          <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Subject-wise Breakdown</h4>
                          <div className="overflow-x-auto rounded-xl border border-slate-200">
                            <table className="w-full text-left border-collapse">
                              <thead>
                                <tr className="bg-slate-900 text-white">
                                  <th className="p-3 text-xs font-bold uppercase tracking-wider">Subject</th>
                                  <th className="p-3 text-xs font-bold uppercase tracking-wider text-center">Present</th>
                                  <th className="p-3 text-xs font-bold uppercase tracking-wider text-center">Total</th>
                                  <th className="p-3 text-xs font-bold uppercase tracking-wider text-center">%</th>
                                </tr>
                              </thead>
                              <tbody className="text-sm">
                                {subjectList.map((s, idx) => (
                                  <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50">
                                    <td className="p-3 font-bold text-slate-900">{s.subject}</td>
                                    <td className="p-3 text-center text-emerald-600 font-bold">{s.present}</td>
                                    <td className="p-3 text-center text-slate-500 font-medium">{s.total}</td>
                                    <td className="p-3 text-center">
                                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-black ${s.percentage >= 75 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                                        {s.percentage}%
                                      </span>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 text-center mb-8">
                          <Activity className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                          <p className="text-sm font-bold text-slate-500">Subject-wise data will appear once lecture-wise attendance is recorded.</p>
                        </div>
                      )}

                      {studentData.attendanceLog && studentData.attendanceLog.length > 0 && (
                        <div>
                          <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Recent Attendance Log</h4>
                          <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                            {studentData.attendanceLog.slice(-10).reverse().map((entry, idx) => (
                              <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                                <div className="flex items-center gap-3">
                                  <div className={`w-2.5 h-2.5 rounded-full ${entry.status === 'Present' ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                                  <span className="font-bold text-sm text-slate-900">{entry.subject}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                  <span className={`text-xs font-bold ${entry.status === 'Present' ? 'text-emerald-600' : 'text-red-600'}`}>{entry.status}</span>
                                  <span className="text-xs text-slate-400">{new Date(entry.date).toLocaleDateString()}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* --- CLASS ROUTINE MODAL --- */}
                  {activeModal === 'routine' && (
                    <div>
                      <div className="overflow-x-auto rounded-xl border border-slate-200">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="bg-slate-900 text-white">
                              <th className="p-3 text-xs font-bold uppercase tracking-wider">Day</th>
                              <th className="p-3 text-xs font-bold uppercase tracking-wider">10:00 - 11:00</th>
                              <th className="p-3 text-xs font-bold uppercase tracking-wider">11:00 - 12:00</th>
                              <th className="p-3 text-xs font-bold uppercase tracking-wider">12:00 - 01:00</th>
                              <th className="p-3 text-xs font-bold uppercase tracking-wider">02:00 - 04:00</th>
                            </tr>
                          </thead>
                          <tbody className="text-sm font-medium">
                            <tr className="border-b border-slate-100 hover:bg-slate-50">
                              <td className="p-3 font-bold text-[#1e3a8a] bg-slate-50">Monday</td>
                              <td className="p-3 font-bold">Data Structures</td>
                              <td className="p-3 text-slate-600">Digital Electronics</td>
                              <td className="p-3 text-slate-600">Discrete Math</td>
                              <td className="p-3 bg-blue-50/50 text-[#1e3a8a] font-bold">Programming Lab (Lab 2)</td>
                            </tr>
                            <tr className="border-b border-slate-100 hover:bg-slate-50">
                              <td className="p-3 font-bold text-[#1e3a8a] bg-slate-50">Tuesday</td>
                              <td className="p-3 text-slate-600">Computer Org</td>
                              <td className="p-3 font-bold">Data Structures</td>
                              <td className="p-3 text-slate-600">Formal Language</td>
                              <td className="p-3 bg-amber-50/50 text-amber-800 font-bold">Digital Systems Lab</td>
                            </tr>
                            <tr className="border-b border-slate-100 hover:bg-slate-50">
                              <td className="p-3 font-bold text-[#1e3a8a] bg-slate-50">Wednesday</td>
                              <td className="p-3 text-slate-600">Discrete Math</td>
                              <td className="p-3 text-slate-600">Economics</td>
                              <td className="p-3 font-bold">Data Structures</td>
                              <td className="p-3 bg-emerald-50/50 text-emerald-800 font-bold">Library / Self Study</td>
                            </tr>
                            <tr className="border-b border-slate-100 hover:bg-slate-50">
                              <td className="p-3 font-bold text-[#1e3a8a] bg-slate-50">Thursday</td>
                              <td className="p-3 text-slate-600">Formal Language</td>
                              <td className="p-3 text-slate-600">Computer Org</td>
                              <td className="p-3 text-slate-600">Digital Electronics</td>
                              <td className="p-3 bg-purple-50/50 text-purple-800 font-bold">AI & Python Workshop</td>
                            </tr>
                            <tr className="hover:bg-slate-50">
                              <td className="p-3 font-bold text-[#1e3a8a] bg-slate-50">Friday</td>
                              <td className="p-3 text-slate-600">Economics</td>
                              <td className="p-3 font-bold">Data Structures</td>
                              <td className="p-3 text-slate-600">Discrete Math</td>
                              <td className="p-3 bg-slate-100 text-slate-700 font-bold">Mentorship / Seminar</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* --- FEES GATEWAY MODAL --- */}
                  {activeModal === 'fees' && (
                    <div className="space-y-6">
                      
                      {/* Gateway Status Banner */}
                      {paymentStatus && (
                        <div className={`p-4 rounded-xl font-bold text-sm border flex items-center gap-3 animate-in fade-in duration-200 ${paymentStatus.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : paymentStatus.type === 'error' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-blue-50 text-[#1e3a8a] border-blue-200'}`}>
                          {paymentStatus.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0"/>}
                          {paymentStatus.type === 'error' && <AlertCircle className="w-5 h-5 text-red-500 shrink-0"/>}
                          {paymentStatus.type === 'info' && <Clock className="w-5 h-5 text-blue-500 shrink-0 animate-spin"/>}
                          <div>{paymentStatus.message}</div>
                        </div>
                      )}

                      {/* INVOICE SUMMARY */}
                      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                        <div className="flex justify-between items-center mb-4">
                          <div>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Active Invoice</span>
                            <h4 className="text-lg font-black text-slate-900">B.Tech Semester {studentData.semester} Tuition & Lab Fees</h4>
                          </div>
                          <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full font-bold text-xs">Payment Pending</span>
                        </div>

                        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
                          <table className="w-full text-left border-collapse text-sm">
                            <thead>
                              <tr className="bg-slate-900 text-white text-xs uppercase tracking-wider">
                                <th className="p-3.5 font-bold">Fee Description</th>
                                <th className="p-3.5 font-bold text-right">Amount (INR)</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              <tr className="border-b border-slate-100 hover:bg-slate-50">
                                <td className="p-3.5 font-medium text-slate-800">Tuition & Faculty Instruction (Sem {studentData.semester})</td>
                                <td className="p-3.5 text-right font-bold text-slate-900">₹45,000</td>
                              </tr>
                              <tr className="border-b border-slate-100 hover:bg-slate-50">
                                <td className="p-3.5 font-medium text-slate-800">Advanced Computing Lab & Hardware Maintenance</td>
                                <td className="p-3.5 text-right font-bold text-slate-900">₹5,000</td>
                              </tr>
                              <tr className="border-b border-slate-100 hover:bg-slate-50">
                                <td className="p-3.5 font-medium text-slate-800">Central Library, Book Bank & IEEE Subscriptions</td>
                                <td className="p-3.5 text-right font-bold text-slate-900">₹2,000</td>
                              </tr>
                              <tr className="bg-amber-50 font-black text-amber-900">
                                <td className="p-3.5 text-base border-t-2 border-amber-200">Total Semester Amount Payable</td>
                                <td className="p-3.5 text-right text-lg text-[#1e3a8a] border-t-2 border-amber-200">₹52,000</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                          <div className="flex items-center gap-3">
                            <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0"/>
                            <p className="text-xs text-slate-600 font-medium">PCI-DSS Compliant 256-Bit Encrypted Gateway Tunnel.</p>
                          </div>
                          <button
                            onClick={handleFeePayment}
                            disabled={isProcessing}
                            className={`w-full sm:w-auto px-8 py-3.5 rounded-xl font-black text-sm uppercase tracking-wider text-slate-900 transition-all shadow-md cursor-pointer ${isProcessing ? 'bg-slate-300 cursor-not-allowed' : 'bg-amber-500 hover:bg-amber-400 hover:scale-105'}`}
                          >
                            {isProcessing ? "Authorizing Payment..." : "Pay ₹52,000 Online"}
                          </button>
                        </div>
                      </div>

                      {/* PAYMENT HISTORY LEDGER */}
                      <div>
                        <div className="flex items-center gap-2 mb-4">
                          <History className="w-5 h-5 text-[#1e3a8a]" />
                          <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Transaction History & Receipts Ledger</h4>
                        </div>
                        {feeReceipts.length === 0 ? (
                          <p className="text-center text-slate-400 py-6 text-sm font-medium bg-slate-50 rounded-xl border border-slate-100">No payment records located on Atlas ledger.</p>
                        ) : (
                          <div className="space-y-3">
                            {feeReceipts.map((rcpt) => (
                              <div key={rcpt._id} className="p-4 bg-white border border-slate-200 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm hover:border-[#1e3a8a] transition-all">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-black text-slate-900 text-sm">Sem {rcpt.semester} Tuition Fee</span>
                                    <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">{rcpt.status}</span>
                                  </div>
                                  <p className="text-xs text-slate-500 mt-1">Txn: <span className="font-mono text-slate-700">{rcpt.transactionId}</span> • {new Date(rcpt.date).toLocaleDateString()}</p>
                                </div>
                                <div className="text-right flex items-center gap-4 self-end sm:self-center">
                                  <span className="text-base font-black text-slate-900">₹{rcpt.amount.toLocaleString('en-IN')}</span>
                                  <button onClick={() => { setLatestReceipt(rcpt); }} className="text-xs font-bold text-[#1e3a8a] hover:underline cursor-pointer">View Receipt</button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                    </div>
                  )}

                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* MAIN STUDENT PORTAL DASHBOARD CARD */}
          {/* ============================================================ */}
          <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="bg-[#1e3a8a] p-8 text-white relative overflow-hidden">
               <div className="absolute top-0 right-0 opacity-10 pointer-events-none"><GraduationCap className="w-64 h-64 -mt-10 -mr-10" /></div>
               <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h1 className="text-3xl font-black tracking-tight">Welcome, {studentData.name}</h1>
                    <p className="mt-1 text-blue-200 font-medium">Student Academic Portal</p>
                  </div>
                  <button onClick={handleLogout} className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-5 py-2.5 rounded-lg font-bold transition-colors shadow-md cursor-pointer">
                     <LogOut className="w-5 h-5" /> Terminate Session
                  </button>
               </div>
            </div>

            <div className="p-8">
               <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 shadow-sm border-b-4 border-b-emerald-500 hover:-translate-y-1 transition-transform">
                     <p className="text-xs font-bold text-slate-500 uppercase mb-1 tracking-wider">Cumulative SGPA</p>
                     <p className="text-2xl font-black text-emerald-600">{studentData.sgpa ? studentData.sgpa.toFixed(2) : "8.45"}</p>
                  </div>
               </div>
               
               <h3 className="text-xl font-bold text-slate-900 mt-10 mb-6 border-b border-slate-100 pb-3">Academic, ID Card, Financial & Certificate Shortcuts</h3>
               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-3">
                  <button onClick={() => setActiveModal('lms')} className="p-5 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md hover:border-[#1e3a8a] transition-all cursor-pointer text-center group block w-full hover:-translate-y-1">
                     <BookOpen className="w-7 h-7 text-[#1e3a8a] mx-auto mb-2 group-hover:scale-110 transition-transform" />
                     <p className="font-bold text-slate-900 text-xs">Access LMS</p>
                  </button>
                  <button onClick={() => setActiveModal('results')} className="p-5 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md hover:border-amber-500 transition-all cursor-pointer text-center group block w-full hover:-translate-y-1">
                     <FileText className="w-7 h-7 text-amber-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                     <p className="font-bold text-slate-900 text-xs">Exam Results</p>
                  </button>
                  <button onClick={() => setActiveModal('attendance')} className="p-5 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md hover:border-emerald-500 transition-all cursor-pointer text-center group block w-full hover:-translate-y-1">
                     <Activity className="w-7 h-7 text-emerald-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                     <p className="font-bold text-slate-900 text-xs">Attendance</p>
                  </button>
                  <button onClick={() => setActiveModal('routine')} className="p-5 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md hover:border-purple-500 transition-all cursor-pointer text-center group block w-full hover:-translate-y-1">
                     <Calendar className="w-7 h-7 text-purple-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                     <p className="font-bold text-slate-900 text-xs">Class Routine</p>
                  </button>
                  <button onClick={() => setActiveModal('idcard')} className="p-5 bg-white border border-blue-200 bg-blue-50/40 rounded-xl shadow-sm hover:shadow-md hover:border-blue-500 transition-all cursor-pointer text-center group block w-full hover:-translate-y-1">
                     <Contact className="w-7 h-7 text-blue-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                     <p className="font-bold text-slate-900 text-xs">Digital ID Card</p>
                  </button>
                  <button onClick={() => setActiveModal('gpa')} className="p-5 bg-white border border-indigo-200 bg-indigo-50/40 rounded-xl shadow-sm hover:shadow-md hover:border-indigo-500 transition-all cursor-pointer text-center group block w-full hover:-translate-y-1">
                     <Calculator className="w-7 h-7 text-indigo-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                     <p className="font-bold text-slate-900 text-xs">SGPA Calculator</p>
                  </button>
                  <button onClick={() => setActiveModal('fees')} className="p-5 bg-white border border-amber-300 bg-amber-50/40 rounded-xl shadow-sm hover:shadow-md hover:border-amber-500 transition-all cursor-pointer text-center group block w-full hover:-translate-y-1">
                     <CreditCard className="w-7 h-7 text-amber-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                     <p className="font-bold text-slate-900 text-xs">Semester Fees</p>
                  </button>
                  <button onClick={() => setActiveModal('certificates')} className="p-5 bg-white border border-emerald-300 bg-emerald-50/40 rounded-xl shadow-sm hover:shadow-md hover:border-emerald-500 transition-all cursor-pointer text-center group block w-full hover:-translate-y-1">
                     <Award className="w-7 h-7 text-emerald-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                     <p className="font-bold text-slate-900 text-xs">Certificates & Clearances</p>
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
          <p className="text-white/80 text-sm mt-1 relative z-10">Access LMS, Fees, Results & Attendance</p>
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
            <button type="submit" className="w-full rounded-lg bg-[#1e3a8a] py-4 text-center font-bold text-white transition-colors hover:bg-blue-900 text-lg shadow-md cursor-pointer">Secure Login</button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-slate-500 font-medium">
              Need assistance or password reset? Contact the <span className="font-bold text-[#1e3a8a]">SVIST Academic Office</span>.
            </p>
          </div>

        </div>
      </div>
    </div>
  )
}
