// ================================================================
// SVIST ONLINE FEE PAYMENT GATEWAY & DIGITAL RECEIPT PORTAL
// ================================================================

import React, { useState } from "react"
import {
  CreditCard, QrCode, Building2, CheckCircle2, ShieldCheck, Download,
  Printer, ArrowRight, Search, RefreshCw, AlertCircle, FileText,
  Lock, Wallet, Landmark, HelpCircle, ChevronRight, UserCheck, Sparkles, X
} from "lucide-react"
import { apiFetch } from "../config/api"

export default function OnlineFeesView() {
  const [rollNumber, setRollNumber] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [studentInfo, setStudentInfo] = useState(null)
  const [pastReceipts, setPastReceipts] = useState([])
  const [lookupError, setLookupError] = useState("")
  
  // Fee Category & Calculation
  const [selectedCategory, setSelectedCategory] = useState("tuition")
  const [customAmount, setCustomAmount] = useState("")
  const [selectedSemester, setSelectedSemester] = useState(4)
  
  // Payment Gateway State
  const [paymentMethod, setPaymentMethod] = useState("upi")
  const [cardData, setCardData] = useState({ number: "", holder: "", expiry: "", cvv: "" })
  const [selectedBank, setSelectedBank] = useState("State Bank of India")
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentError, setPaymentError] = useState("")
  
  // Active Receipt Modal
  const [activeReceipt, setActiveReceipt] = useState(null)

  const feeCategories = [
    {
      id: "tuition",
      title: "B.Tech Semester Tuition Fee",
      desc: "Full semester tuition, computer lab access, and library book bank",
      amount: 52000,
      breakdown: [
        { item: "Tuition Fee (Sem " + selectedSemester + ")", amount: 45000 },
        { item: "Computer & Hardware Lab Usage", amount: 4000 },
        { item: "Library & Book Bank Access", amount: 3000 },
      ]
    },
    {
      id: "exam",
      title: "MAKAUT Semester Exam Registration",
      desc: "University semester examination form fill-up & admit card processing",
      amount: 1200,
      breakdown: [
        { item: "MAKAUT Examination Fee", amount: 1000 },
        { item: "Center & Verification Processing", amount: 200 },
      ]
    },
    {
      id: "hostel",
      title: "Campus Hostel & Mess Accommodations",
      desc: "Hostel lodging, 24/7 security, high-speed WiFi & mess dining (Per Sem)",
      amount: 28000,
      breakdown: [
        { item: "Hostel Room Occupancy (AC/Non-AC)", amount: 16000 },
        { item: "Nutritious Mess Meal Plan", amount: 12000 },
      ]
    },
    {
      id: "backlog",
      title: "Backlog / Supplementary Paper Clearance",
      desc: "Special supplementary examination per backlog subject paper",
      amount: 1000,
      breakdown: [
        { item: "Supplementary Paper Processing (Per Subject)", amount: 1000 },
      ]
    },
    {
      id: "custom",
      title: "Custom / Partial Dues Payment",
      desc: "Pay specific amount towards pending balance or institutional dues",
      amount: Number(customAmount) || 0,
      breakdown: [
        { item: "Custom Payment Amount", amount: Number(customAmount) || 0 },
      ]
    }
  ]

  const currentCategory = feeCategories.find(c => c.id === selectedCategory)
  const payableAmount = selectedCategory === "custom" ? (Number(customAmount) || 0) : currentCategory.amount

  const handleLookup = async (rollToSearch) => {
    const roll = rollToSearch || rollNumber
    if (!roll.trim()) {
      setLookupError("Please enter a valid University Roll Number.")
      return
    }

    setIsSearching(true)
    setLookupError("")
    setStudentInfo(null)

    const { data, error } = await apiFetch(`/api/finance/lookup/${roll.trim()}`)
    setIsSearching(false)

    if (data && data.student) {
      setStudentInfo(data.student)
      setSelectedSemester(data.student.semester || 4)
      setPastReceipts(data.receipts || [])
      setRollNumber(data.student.rollNumber)
    } else {
      setLookupError(error || "Student record not found. Please verify your roll number.")
    }
  }

  const handleQuickSelect = (roll) => {
    setRollNumber(roll)
    handleLookup(roll)
  }

  const handlePayment = async () => {
    if (!studentInfo) {
      setPaymentError("Please verify your student profile before making a payment.")
      return
    }

    if (payableAmount <= 0) {
      setPaymentError("Payment amount must be greater than ₹0.")
      return
    }

    setIsProcessing(true)
    setPaymentError("")

    let methodLabel = "NetBanking / UPI / Card"
    if (paymentMethod === "upi") methodLabel = "UPI (Google Pay / PhonePe / Paytm)"
    else if (paymentMethod === "card") methodLabel = `Card (ending in ${cardData.number.slice(-4) || "XXXX"})`
    else if (paymentMethod === "netbanking") methodLabel = `Net Banking (${selectedBank})`

    const payload = {
      studentId: studentInfo._id,
      studentRoll: studentInfo.rollNumber,
      studentName: studentInfo.name,
      semester: selectedSemester,
      amount: payableAmount,
      feeType: currentCategory.title,
      paymentMethod: methodLabel,
    }

    const { data, error } = await apiFetch("/api/finance/pay", {
      method: "POST",
      body: JSON.stringify(payload),
    })

    setIsProcessing(false)

    if (data && data.success) {
      setActiveReceipt(data.receipt)
      // Refresh past receipts list
      handleLookup(studentInfo.rollNumber)
    } else {
      setPaymentError(error || "Transaction could not be processed. Please try again.")
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-20 animate-in fade-in duration-500">
      
      {/* ================================================================ */}
      {/* PRINTABLE OFFICIAL DIGITAL RECEIPT MODAL */}
      {/* ================================================================ */}
      {activeReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-200 my-8 animate-in zoom-in-95 duration-300">
            
            {/* Modal Header Actions */}
            <div className="flex justify-between items-center px-8 py-4 bg-slate-900 text-white">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span className="font-bold text-sm tracking-wide text-emerald-400 uppercase">Payment Verified & Approved</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors border border-white/20"
                >
                  <Printer className="w-4 h-4" /> Print / PDF
                </button>
                <button
                  onClick={() => setActiveReceipt(null)}
                  className="p-1.5 hover:bg-white/10 text-slate-300 hover:text-white rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Printable Receipt Paper Container */}
            <div className="p-8 sm:p-10 space-y-6" id="printable-fee-receipt">
              
              {/* Institution Header */}
              <div className="text-center border-b-2 border-slate-200 pb-6">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <div className="bg-[#1e3a8a] p-2 rounded-xl">
                    <Building2 className="w-7 h-7 text-amber-400" />
                  </div>
                  <div className="text-left">
                    <h2 className="text-xl font-black text-slate-900 tracking-tight leading-none">SWAMI VIVEKANANDA</h2>
                    <p className="text-xs font-bold text-[#1e3a8a] tracking-widest uppercase">Institute of Science & Technology</p>
                  </div>
                </div>
                <p className="text-xs text-slate-500 font-medium">Dakshin Gobindapur, Sonarpur, Kolkata - 700145 | AICTE Approved & MAKAUT Affiliated</p>
                <div className="inline-block mt-3 px-4 py-1 bg-blue-50 border border-blue-200 rounded-full text-xs font-black text-[#1e3a8a] uppercase tracking-wider">
                  Official E-Receipt for Fee Payment
                </div>
              </div>

              {/* Transaction Metadata Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 bg-slate-50 p-5 rounded-2xl border border-slate-200 text-xs">
                <div>
                  <span className="text-slate-400 font-bold block uppercase tracking-wider text-[10px]">Transaction ID</span>
                  <span className="font-mono font-bold text-slate-900 text-xs break-all">{activeReceipt.transactionId}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block uppercase tracking-wider text-[10px]">Payment Date</span>
                  <span className="font-bold text-slate-800">{new Date(activeReceipt.date).toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block uppercase tracking-wider text-[10px]">Payment Status</span>
                  <span className="inline-flex items-center gap-1 font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full text-[11px]">
                    <CheckCircle2 className="w-3 h-3" /> Paid & Settled
                  </span>
                </div>
              </div>

              {/* Student Identification */}
              <div className="border border-slate-200 rounded-2xl p-5 space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Student Information</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-500 text-xs block">Candidate Name</span>
                    <span className="font-black text-slate-900">{activeReceipt.studentName}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-xs block">University Roll Number</span>
                    <span className="font-black text-slate-900 font-mono">{activeReceipt.studentRoll}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-xs block">Academic Semester</span>
                    <span className="font-bold text-slate-800">Semester {activeReceipt.semester} (B.Tech)</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-xs block">Payment Mode</span>
                    <span className="font-bold text-slate-800">{activeReceipt.paymentMethod}</span>
                  </div>
                </div>
              </div>

              {/* Fee Breakdown Table */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse text-sm">
                  <thead className="bg-slate-900 text-white text-xs uppercase tracking-wider">
                    <tr>
                      <th className="p-3.5 font-bold">Description / Fee Category</th>
                      <th className="p-3.5 font-bold text-right">Amount (INR)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                    <tr>
                      <td className="p-3.5">{activeReceipt.feeType || "B.Tech Semester Tuition Fee"}</td>
                      <td className="p-3.5 text-right font-mono font-bold">₹{Number(activeReceipt.amount).toLocaleString('en-IN')}.00</td>
                    </tr>
                    <tr className="bg-emerald-50 text-emerald-950 font-black text-base">
                      <td className="p-3.5 text-[#1e3a8a]">Total Amount Paid:</td>
                      <td className="p-3.5 text-right text-emerald-700 font-mono">₹{Number(activeReceipt.amount).toLocaleString('en-IN')}.00</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Institutional Authorization & Seal */}
              <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-slate-200 gap-4">
                <div className="text-center sm:text-left">
                  <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
                    This is a computer-generated official receipt authorized by the Finance Cell of SVIST.
                    No physical signature required.
                  </p>
                </div>
                <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl border border-slate-200 shrink-0">
                  <ShieldCheck className="w-6 h-6 text-emerald-600" />
                  <div className="text-left">
                    <span className="block text-[10px] font-bold text-slate-400 uppercase leading-tight">Authenticity Verified</span>
                    <span className="block text-xs font-black text-slate-900 leading-tight">SVIST FINANCE CELL</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-6 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
              <button
                onClick={() => setActiveReceipt(null)}
                className="px-6 py-3 bg-[#1e3a8a] text-white font-bold rounded-xl hover:bg-blue-800 transition-colors shadow-md text-sm"
              >
                Close & Return
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ================================================================ */}
      {/* HERO / PORTAL HEADER */}
      {/* ================================================================ */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb & Title */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1e3a8a]/10 border border-[#1e3a8a]/20 text-[#1e3a8a] text-xs font-black tracking-wider uppercase mb-4">
            <Lock className="w-3.5 h-3.5" /> 256-Bit SSL Encrypted Payment Gateway
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            SVIST Online Fee Portal
          </h1>
          <p className="mt-3 text-slate-600 text-base sm:text-lg font-medium">
            Pay semester tuition, examination fees, and campus hostel dues with instant automated digital receipt generation.
          </p>
        </div>

        {/* ================================================================ */}
        {/* STEP 1: ROLL NUMBER LOOKUP & VERIFICATION */}
        {/* ================================================================ */}
        <div className="max-w-4xl mx-auto mb-10">
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
              <div className="p-3 bg-[#1e3a8a]/10 rounded-2xl text-[#1e3a8a]">
                <Search className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900">Step 1: Student Verification</h3>
                <p className="text-xs text-slate-500 font-medium">Enter your University Roll Number to fetch active dues</p>
              </div>
            </div>

            <form
              onSubmit={(e) => { e.preventDefault(); handleLookup(); }}
              className="flex flex-col sm:flex-row gap-3"
            >
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Enter 10-Digit Roll Number (e.g., 1234567890)"
                  value={rollNumber}
                  onChange={(e) => setRollNumber(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3.5 text-base font-bold text-slate-800 placeholder-slate-400 focus:border-[#1e3a8a] focus:ring-2 focus:ring-[#1e3a8a] outline-none transition-all shadow-inner"
                />
              </div>
              <button
                type="submit"
                disabled={isSearching}
                className="px-8 py-3.5 bg-[#1e3a8a] text-white font-black rounded-xl hover:bg-blue-900 transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50 text-sm"
              >
                {isSearching ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                Verify Student
              </button>
            </form>

            {/* Lookup Error Message */}
            {lookupError && (
              <div className="mt-4 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 font-bold text-sm flex items-center gap-3">
                <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />
                {lookupError}
              </div>
            )}

            {/* Student Verified Profile Badge */}
            {studentInfo && (
              <div className="mt-6 bg-gradient-to-r from-blue-900 to-[#1e3a8a] text-white p-6 rounded-2xl shadow-lg animate-in fade-in duration-300">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-amber-400 font-black text-xl border border-white/20 shadow-inner">
                      {studentInfo.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xl font-black text-white">{studentInfo.name}</h4>
                        <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 rounded-full text-[10px] font-black uppercase">
                          Verified
                        </span>
                      </div>
                      <p className="text-xs text-blue-200 font-medium mt-0.5">
                        Roll: <span className="font-mono font-bold text-white">{studentInfo.rollNumber}</span> | Dept: <span className="font-bold text-white">{studentInfo.department}</span> | Current Sem: <span className="font-bold text-white">{studentInfo.semester}th</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-white/10 px-4 py-2 rounded-xl border border-white/20 text-xs">
                    <div>
                      <span className="text-[10px] text-blue-200 block font-bold uppercase">Attendance</span>
                      <span className="font-black text-amber-400">{studentInfo.attendance}%</span>
                    </div>
                    <div className="border-l border-white/20 pl-3">
                      <span className="text-[10px] text-blue-200 block font-bold uppercase">Semester GPA</span>
                      <span className="font-black text-amber-400">{studentInfo.sgpa || "7.8"}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* ================================================================ */}
        {/* STEP 2 & 3: CATEGORY SELECTION & PAYMENT FORM */}
        {/* ================================================================ */}
        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left 2 Cols: Fee Category & Payment Method Selection */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Category Selector */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200">
              <h3 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
                <Wallet className="w-5 h-5 text-[#1e3a8a]" /> Step 2: Select Fee Type
              </h3>

              {/* Semester Selector */}
              <div className="mb-6">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Target Academic Semester</label>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                    <button
                      key={sem}
                      type="button"
                      onClick={() => setSelectedSemester(sem)}
                      className={`py-2 text-xs font-bold rounded-lg border transition-all cursor-pointer ${selectedSemester === sem ? 'bg-[#1e3a8a] text-white border-[#1e3a8a] shadow-sm' : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'}`}
                    >
                      Sem {sem}
                    </button>
                  ))}
                </div>
              </div>

              {/* Categories Radio Cards */}
              <div className="space-y-3">
                {feeCategories.map((cat) => (
                  <div
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-start justify-between gap-4 ${selectedCategory === cat.id ? 'border-[#1e3a8a] bg-blue-50/50 shadow-sm' : 'border-slate-200 hover:border-slate-300 bg-white'}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`mt-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${selectedCategory === cat.id ? 'border-[#1e3a8a]' : 'border-slate-300'}`}>
                        {selectedCategory === cat.id && <div className="w-2 h-2 rounded-full bg-[#1e3a8a]" />}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">{cat.title}</h4>
                        <p className="text-xs text-slate-500 mt-0.5">{cat.desc}</p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      {cat.id === "custom" ? (
                        <span className="text-xs font-bold text-slate-500">Flexible</span>
                      ) : (
                        <span className="font-black text-slate-900 text-base font-mono">₹{cat.amount.toLocaleString('en-IN')}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Custom Amount Input if Selected */}
              {selectedCategory === "custom" && (
                <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-2xl animate-in fade-in">
                  <label className="block text-xs font-bold text-amber-900 mb-1">Enter Custom Amount to Pay (INR)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-3 font-black text-slate-500">₹</span>
                    <input
                      type="number"
                      placeholder="e.g. 15000"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      className="w-full rounded-xl border border-amber-300 pl-8 pr-4 py-2.5 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] bg-white"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Payment Method Selector */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200">
              <h3 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-[#1e3a8a]" /> Step 3: Payment Method
              </h3>

              <div className="grid grid-cols-3 gap-3 mb-6">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("upi")}
                  className={`p-3.5 rounded-xl border text-center font-bold text-xs transition-all flex flex-col items-center gap-2 cursor-pointer ${paymentMethod === "upi" ? 'border-[#1e3a8a] bg-blue-50 text-[#1e3a8a] shadow-sm' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                >
                  <QrCode className="w-6 h-6" />
                  UPI & QR Code
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod("card")}
                  className={`p-3.5 rounded-xl border text-center font-bold text-xs transition-all flex flex-col items-center gap-2 cursor-pointer ${paymentMethod === "card" ? 'border-[#1e3a8a] bg-blue-50 text-[#1e3a8a] shadow-sm' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                >
                  <CreditCard className="w-6 h-6" />
                  Debit / Credit Card
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod("netbanking")}
                  className={`p-3.5 rounded-xl border text-center font-bold text-xs transition-all flex flex-col items-center gap-2 cursor-pointer ${paymentMethod === "netbanking" ? 'border-[#1e3a8a] bg-blue-50 text-[#1e3a8a] shadow-sm' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                >
                  <Landmark className="w-6 h-6" />
                  Net Banking
                </button>
              </div>

              {/* UPI Tab */}
              {paymentMethod === "upi" && (
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-4">
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 inline-block shadow-sm">
                    {/* Simulated Dynamic UPI QR */}
                    <div className="w-36 h-36 bg-slate-900 rounded-xl flex flex-col items-center justify-center p-2 text-white relative overflow-hidden">
                      <QrCode className="w-24 h-24 text-white" />
                      <span className="text-[9px] font-mono tracking-tighter text-amber-400">SCAN & PAY WITH ANY UPI</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-700">Official Institutional VPA: <span className="font-mono text-[#1e3a8a]">svist.kolkata@sbi</span></p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Supports Google Pay, PhonePe, Paytm, BHIM, Cred & Amazon Pay</p>
                  </div>
                </div>
              )}

              {/* Card Tab */}
              {paymentMethod === "card" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Card Number</label>
                    <input
                      type="text"
                      maxLength={19}
                      placeholder="4532 •••• •••• 8892"
                      value={cardData.number}
                      onChange={(e) => setCardData({ ...cardData, number: e.target.value })}
                      className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-mono font-bold focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">Expiry Date</label>
                      <input
                        type="text"
                        maxLength={5}
                        placeholder="MM/YY"
                        value={cardData.expiry}
                        onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
                        className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-mono font-bold focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">CVV / CVC</label>
                      <input
                        type="password"
                        maxLength={4}
                        placeholder="•••"
                        value={cardData.cvv}
                        onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
                        className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-mono font-bold focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Net Banking Tab */}
              {paymentMethod === "netbanking" && (
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-2">Select Your Bank</label>
                  <select
                    value={selectedBank}
                    onChange={(e) => setSelectedBank(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm font-bold text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                  >
                    <option>State Bank of India</option>
                    <option>HDFC Bank</option>
                    <option>ICICI Bank</option>
                    <option>Axis Bank</option>
                    <option>Punjab National Bank</option>
                    <option>Bank of Baroda</option>
                    <option>Canara Bank</option>
                  </select>
                </div>
              )}

            </div>

          </div>

          {/* Right 1 Col: Summary & Payment Submission */}
          <div className="space-y-6">
            
            {/* Order Summary Box */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 sticky top-28">
              <h3 className="text-lg font-black text-slate-900 mb-4 pb-3 border-b border-slate-100 flex items-center justify-between">
                <span>Fee Summary</span>
                <span className="text-xs font-bold text-[#1e3a8a] bg-blue-50 px-2.5 py-1 rounded-full">Sem {selectedSemester}</span>
              </h3>

              {/* Breakdown List */}
              <div className="space-y-3 mb-6 text-xs text-slate-600 font-medium">
                {currentCategory.breakdown.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center">
                    <span>{item.item}</span>
                    <span className="font-mono font-bold text-slate-900">₹{item.amount.toLocaleString('en-IN')}</span>
                  </div>
                ))}
                <div className="border-t border-slate-200 pt-3 flex justify-between items-center text-sm font-black text-slate-900">
                  <span>Total Amount</span>
                  <span className="text-xl text-[#1e3a8a] font-mono">₹{payableAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Payment Error */}
              {paymentError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-bold rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                  {paymentError}
                </div>
              )}

              {/* Pay Button */}
              <button
                type="button"
                onClick={handlePayment}
                disabled={isProcessing || payableAmount <= 0}
                className="w-full py-4 bg-amber-500 text-slate-900 font-black rounded-2xl hover:bg-amber-400 transition-all text-base shadow-lg hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" /> Authorizing Gateway...
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" /> Pay ₹{payableAmount.toLocaleString('en-IN')} Securely
                  </>
                )}
              </button>

              <p className="text-[11px] text-slate-400 text-center font-medium mt-3 flex items-center justify-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-500" /> Instant Digital Tax-Exempt Receipt
              </p>

              {/* Help & Support Note */}
              <div className="mt-6 pt-6 border-t border-slate-100 text-center">
                <p className="text-xs text-slate-500 font-medium">Need payment support or installment plans?</p>
                <a href="mailto:finance@svist.edu.in" className="text-xs font-bold text-[#1e3a8a] hover:underline mt-1 inline-block">
                  Contact SVIST Finance Cell
                </a>
              </div>

            </div>

          </div>

        </div>

        {/* ================================================================ */}
        {/* PAST PAYMENT RECEIPTS HISTORY */}
        {/* ================================================================ */}
        {pastReceipts.length > 0 && (
          <div className="max-w-4xl mx-auto mt-12 bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200">
            <h3 className="text-xl font-black text-slate-900 mb-4 flex items-center gap-2">
              <FileText className="w-6 h-6 text-[#1e3a8a]" /> Payment History for {studentInfo?.name || "Student"}
            </h3>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-700 border-b border-slate-200">
                    <th className="p-3 font-bold uppercase">Transaction ID</th>
                    <th className="p-3 font-bold uppercase">Fee Type</th>
                    <th className="p-3 font-bold uppercase">Semester</th>
                    <th className="p-3 font-bold uppercase">Date</th>
                    <th className="p-3 font-bold uppercase text-right">Amount</th>
                    <th className="p-3 font-bold uppercase text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800 font-medium">
                  {pastReceipts.map((rec) => (
                    <tr key={rec._id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3 font-mono font-bold text-[#1e3a8a]">{rec.transactionId}</td>
                      <td className="p-3 font-bold">{rec.feeType || "Semester Tuition Fee"}</td>
                      <td className="p-3">Sem {rec.semester}</td>
                      <td className="p-3 text-slate-500">{new Date(rec.date).toLocaleDateString()}</td>
                      <td className="p-3 text-right font-mono font-bold">₹{Number(rec.amount).toLocaleString('en-IN')}</td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => setActiveReceipt(rec)}
                          className="px-3 py-1 bg-blue-50 text-[#1e3a8a] hover:bg-[#1e3a8a] hover:text-white rounded-lg font-bold transition-colors inline-flex items-center gap-1 shadow-sm cursor-pointer"
                        >
                          <Download className="w-3 h-3" /> View Receipt
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
