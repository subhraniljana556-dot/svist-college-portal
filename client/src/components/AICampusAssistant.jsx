// ================================================================
// SVIST GENIUS AI — 24x7 CAMPUS INTELLIGENCE ASSISTANT
// ================================================================

import React, { useState, useRef, useEffect } from "react"
import {
  MessageSquare, X, Send, Bot, User, Sparkles, ChevronRight,
  ExternalLink, CreditCard, BookOpen, GraduationCap, MapPin, Phone, RefreshCw, Minimize2, Maximize2
} from "lucide-react"
import { Link } from "react-router-dom"

export default function AICampusAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "bot",
      text: "Hello! I am SVIST Genius AI, your 24x7 digital campus guide. How can I help you today?",
      quickChips: [
        "How to pay semester fees?",
        "B.Tech admission process",
        "MAKAUT syllabus & exams",
        "Hostel & bus facilities",
        "Scholarships (SVMCM/OASIS)"
      ]
    }
  ])
  const [inputText, setInputText] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom()
    }
  }, [messages, isOpen, isMinimized])

  // Intelligent Campus Knowledge Engine
  const generateResponse = (query) => {
    const q = query.toLowerCase()

    if (q.includes("fee") || q.includes("pay") || q.includes("tuition") || q.includes("dues") || q.includes("receipt")) {
      return {
        text: "You can pay your semester fees online with instant digital receipts! The standard B.Tech semester fee is ₹52,000 (₹45,000 Tuition + ₹7,000 Lab/Development). We support UPI QR, Cards, and NetBanking.",
        linkText: "Open Online Fee Payment Gateway",
        linkUrl: "/pay-fees",
        quickChips: ["Check hostel fees", "Fee payment receipts", "Scholarship assistance"]
      }
    }

    if (q.includes("admiss") || q.includes("apply") || q.includes("wbjee") || q.includes("jee") || q.includes("cutoff") || q.includes("rank")) {
      return {
        text: "Admissions for B.Tech (2026-27) are currently OPEN! SVIST accepts WBJEE & JEE Main scores for CSE, AI & DS, ECE, EE, ME, and CE departments. Direct management quota seats are also available.",
        linkText: "Submit Online Admission Application",
        linkUrl: "/admissions",
        quickChips: ["Fee structure", "Department details", "Placement stats"]
      }
    }

    if (q.includes("syllabus") || q.includes("makaut") || q.includes("exam") || q.includes("routine") || q.includes("ca") || q.includes("result")) {
      return {
        text: "SVIST is affiliated to MAKAUT. Semester examinations consist of 4 Continuous Assessments (CA1–CA4) and an end-semester university exam. Minimum 75% attendance is mandatory to appear for exams.",
        linkText: "View Academic Syllabus & Helpdesk",
        linkUrl: "/academics",
        quickChips: ["Class routine", "Attendance rules", "Anti-ragging cell"]
      }
    }

    if (q.includes("hostel") || q.includes("mess") || q.includes("room") || q.includes("accommodation")) {
      return {
        text: "We provide separate, fully secured boys and girls hostels on campus with 24/7 security, high-speed WiFi, power backup, and hygienic mess dining at ₹28,000 per semester.",
        linkText: "Explore Campus Facilities & Tour",
        linkUrl: "/campus-tour",
        quickChips: ["Bus transport", "Canteen food", "Campus location"]
      }
    }

    if (q.includes("bus") || q.includes("transport") || q.includes("route") || q.includes("travel") || q.includes("pickup")) {
      return {
        text: "SVIST operates dedicated college buses connecting Howrah, Sealdah, Salt Lake, Ruby, Garia, and Baruipur directly to the Sonarpur campus.",
        linkText: "View Bus Routes & Schedules",
        linkUrl: "/transport",
        quickChips: ["Campus location", "Contact transport desk", "Hostel facilities"]
      }
    }

    if (q.includes("scholarship") || q.includes("svmcm") || q.includes("oasis") || q.includes("aikyashree") || q.includes("financial")) {
      return {
        text: "Students can avail West Bengal Government scholarships including Swami Vivekananda Merit-cum-Means (SVMCM - ₹60,000/year), OASIS for SC/ST/OBC, Aikyashree for minorities, and Pragati for girl engineers.",
        linkText: "Read Scholarship Guide & Eligibility",
        linkUrl: "/scholarships",
        quickChips: ["Fee installment help", "Admission inquiry", "Student portal"]
      }
    }

    if (q.includes("placement") || q.includes("job") || q.includes("package") || q.includes("company") || q.includes("salary") || q.includes("tcs")) {
      return {
        text: "Our Training & Placement Cell has an excellent track record! Top recruiters include TCS (7.5 LPA), Amazon Web Services (12.0 LPA), Cognizant (6.75 LPA), Infosys, and Capgemini with over 85% placement rate.",
        linkText: "View Live Placement Drives & Packages",
        linkUrl: "/placements",
        quickChips: ["Alumni network", "Department labs", "Student login"]
      }
    }

    if (q.includes("alumni") || q.includes("mentor") || q.includes("senior")) {
      return {
        text: "Our alumni are thriving at global tech giants like AWS, Google, Microsoft, and TCS. Junior students can book 1-on-1 mock interviews and career mentorship sessions.",
        linkText: "Connect with Alumni Mentors",
        linkUrl: "/alumni",
        quickChips: ["Placement drives", "Coding club", "TechFest INNOVA"]
      }
    }

    if (q.includes("club") || q.includes("event") || q.includes("hackathon") || q.includes("techfest") || q.includes("innova") || q.includes("code")) {
      return {
        text: "Join CodeSVIST (Coding Club), Robotics Society, and Cultural Club! Registration for the annual INNOVA 2026 TechFest and 24-hour CodeStorm Hackathon is now live.",
        linkText: "Explore Clubs & Hackathons Hub",
        linkUrl: "/clubs-events",
        quickChips: ["Coding hackathons", "Robotics club", "Academic calendar"]
      }
    }

    if (q.includes("id card") || q.includes("certificate") || q.includes("bonafide") || q.includes("no dues") || q.includes("login")) {
      return {
        text: "Students can log into their Student Portal to generate printable official Bonafide Certificates, No-Dues Slips, Digital Student ID Cards, and calculate MAKAUT SGPA.",
        linkText: "Go to Student Portal Login",
        linkUrl: "/student-login",
        quickChips: ["How to pay fees", "Attendance check", "Routine matrix"]
      }
    }

    if (q.includes("contact") || q.includes("address") || q.includes("phone") || q.includes("location") || q.includes("where")) {
      return {
        text: "SVIST is located at Dakshin Gobindapur, Sonarpur, Kolkata, West Bengal - 700145. Helpline: +91 33 2401 XXXX | Email: info@svist.edu.in | General Academic Office open 9:30 AM to 5:30 PM.",
        linkText: "Submit 24x7 Helpdesk Ticket",
        linkUrl: "/academics",
        quickChips: ["Bus transport", "Campus virtual tour", "Admissions"]
      }
    }

    // Default Fallback
    return {
      text: "I can help you with Online Fee Payments, Admissions, MAKAUT Syllabus, Campus Hostels, Transport Routes, Placement Drives, and Student ID Cards. Please select a topic or ask a specific question!",
      quickChips: [
        "How to pay semester fees?",
        "B.Tech admission process",
        "View bus routes",
        "Download syllabus",
        "Alumni mentorship"
      ]
    }
  }

  const handleSend = (textToSend) => {
    const text = textToSend || inputText
    if (!text.trim()) return

    const userMessage = { id: Date.now(), sender: "user", text }
    setMessages((prev) => [...prev, userMessage])
    setInputText("")
    setIsTyping(true)

    setTimeout(() => {
      const response = generateResponse(text)
      const botMessage = {
        id: Date.now() + 1,
        sender: "bot",
        text: response.text,
        linkText: response.linkText,
        linkUrl: response.linkUrl,
        quickChips: response.quickChips || []
      }
      setMessages((prev) => [...prev, botMessage])
      setIsTyping(false)
    }, 500)
  }

  return (
    <>
      {/* ================================================================ */}
      {/* FLOATING LAUNCHER BUTTON */}
      {/* ================================================================ */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-gradient-to-r from-[#1e3a8a] via-blue-900 to-indigo-950 text-white px-5 py-3.5 rounded-full shadow-2xl hover:scale-105 transition-all border-2 border-amber-400/60 group cursor-pointer"
          aria-label="Open SVIST AI Assistant"
        >
          <div className="relative">
            <Bot className="w-6 h-6 text-amber-400 group-hover:rotate-12 transition-transform" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500" />
          </div>
          <div className="text-left hidden sm:block">
            <span className="block text-xs font-black tracking-wide text-white leading-tight">SVIST Genius AI</span>
            <span className="block text-[10px] text-amber-300 font-bold uppercase tracking-wider leading-tight">24/7 Campus Guide</span>
          </div>
        </button>
      )}

      {/* ================================================================ */}
      {/* CHAT WINDOW MODAL */}
      {/* ================================================================ */}
      {isOpen && (
        <div className={`fixed z-50 transition-all duration-300 ${isMinimized ? 'bottom-6 right-6 w-80' : 'bottom-4 right-4 sm:bottom-6 sm:right-6 w-[calc(100vw-2rem)] sm:w-[420px] max-h-[620px] h-[85vh]'}`}>
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col h-full animate-in zoom-in-95 duration-200">
            
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-slate-900 via-[#1e3a8a] to-blue-950 text-white px-5 py-4 flex items-center justify-between border-b border-blue-900 shadow-md">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 text-amber-400">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-black tracking-tight text-white leading-none">SVIST Genius AI</h3>
                    <span className="px-1.5 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 rounded-full text-[9px] font-black uppercase">
                      Live
                    </span>
                  </div>
                  <p className="text-[11px] text-blue-200 font-medium mt-0.5 leading-none">Instant Campus Knowledge Assistant</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                  title={isMinimized ? "Maximize" : "Minimize"}
                >
                  {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 text-slate-300 hover:text-red-400 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                  title="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Chat Body (Hidden when minimized) */}
            {!isMinimized && (
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {msg.sender === 'bot' && (
                        <div className="w-8 h-8 rounded-xl bg-[#1e3a8a] text-amber-400 flex items-center justify-center shrink-0 text-xs shadow-sm mt-0.5">
                          <Bot className="w-4 h-4" />
                        </div>
                      )}
                      <div className={`max-w-[82%] space-y-2`}>
                        <div
                          className={`p-3.5 rounded-2xl text-xs sm:text-sm font-medium leading-relaxed shadow-sm ${msg.sender === 'user' ? 'bg-[#1e3a8a] text-white rounded-br-none' : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none'}`}
                        >
                          {msg.text}

                          {/* Direct Navigation Button inside message */}
                          {msg.linkUrl && (
                            <div className="mt-3 pt-2 border-t border-slate-100">
                              <Link
                                to={msg.linkUrl}
                                onClick={() => setIsOpen(false)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-[#1e3a8a] text-[#1e3a8a] hover:text-white rounded-lg text-xs font-bold transition-all border border-blue-200 shadow-sm"
                              >
                                <span>{msg.linkText}</span>
                                <ExternalLink className="w-3.5 h-3.5" />
                              </Link>
                            </div>
                          )}
                        </div>

                        {/* Quick Interactive Prompt Chips */}
                        {msg.quickChips && msg.quickChips.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {msg.quickChips.map((chip, idx) => (
                              <button
                                key={idx}
                                onClick={() => handleSend(chip)}
                                className="px-2.5 py-1 bg-white hover:bg-blue-50 text-slate-700 hover:text-[#1e3a8a] rounded-lg text-[11px] font-bold border border-slate-200 shadow-2xs transition-colors cursor-pointer"
                              >
                                {chip}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Typing Indicator */}
                  {isTyping && (
                    <div className="flex gap-2.5 justify-start items-center">
                      <div className="w-8 h-8 rounded-xl bg-[#1e3a8a] text-amber-400 flex items-center justify-center shrink-0">
                        <Bot className="w-4 h-4" />
                      </div>
                      <div className="bg-white border border-slate-200 p-3 rounded-2xl shadow-sm flex items-center gap-1.5">
                        <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                        <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                        <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Input Box Footer */}
                <div className="p-3 bg-white border-t border-slate-200">
                  <form
                    onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                    className="flex items-center gap-2"
                  >
                    <input
                      type="text"
                      placeholder="Ask anything about SVIST..."
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] text-slate-800 placeholder-slate-400"
                    />
                    <button
                      type="submit"
                      disabled={!inputText.trim()}
                      className="p-2.5 bg-[#1e3a8a] hover:bg-blue-900 text-white rounded-xl transition-colors shadow-md disabled:opacity-40 cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                  <p className="text-[10px] text-slate-400 text-center font-medium mt-1.5">
                    Official AI Assistant • Swami Vivekananda Institute of Science & Technology
                  </p>
                </div>
              </>
            )}

          </div>
        </div>
      )}
    </>
  )
}
