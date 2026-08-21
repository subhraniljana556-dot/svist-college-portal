import { ArrowRight, Landmark, Award, Banknote, Wallet } from "lucide-react"

export default function ScholarshipsView() {
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
