import { BookOpen, School, Puzzle, Users, TrendingUp, ArrowRight, Plus, ChevronRight, CheckCircle2, Clock, AlertCircle } from "lucide-react";

type Screen = "management" | "create" | "structure" | "settings" | "deploy" | "version-control" | "library";

interface Props {
  onNavigate: (screen: Screen) => void;
}

const deployments = [
  { school: "Greenfield Academy", location: "Nairobi", curriculum: "CBC Junior Secondary v1.1", dates: "Jan 15, 2024 – Dec 20, 2024", status: "Active", supplements: 2 },
  { school: "Starlight International", location: "Mombasa", curriculum: "British Lower Secondary v2.0", dates: "Nov 1, 2023 – Oct 31, 2024", status: "Active", supplements: 1 },
  { school: "Riverside School", location: "Kisumu", curriculum: "CBC Junior Secondary v1.1", dates: "Jan 10, 2024 – Dec 15, 2024", status: "Draft", supplements: 0 },
  { school: "Bright Future Academy", location: "Eldoret", curriculum: "IGCSE 9–1 v1.0", dates: "Feb 1, 2024 – Jan 31, 2025", status: "Pending", supplements: 1 },
];

const pendingApprovals = [
  { type: "Supplement Request", badge: "Additive", school: "Greenfield Academy", desc: "Robotics Enrichment Term 2", requestedBy: "Mary O.", time: "2 days ago", color: "bg-green-100 text-green-700" },
  { type: "Override Request", badge: "Pacing", school: "Riverside School", desc: "Compressed Term 2 Schedule", requestedBy: "John M.", time: "5 days ago", color: "bg-purple-100 text-purple-700" },
  { type: "Supplement Request", badge: "Substitutive", school: "Starlight International", desc: "Replace Art with Digital Design", requestedBy: "Sarah A.", time: "1 week ago", color: "bg-orange-100 text-orange-700" },
];

export function CurriculumManagement({ onNavigate }: Props) {
  return (
    <div className="flex-1 overflow-auto bg-gray-50">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Curriculum Management</h1>
            <p className="text-gray-500 text-sm mt-0.5">Design, deploy, and track learning journeys across all schools</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => onNavigate("library")}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white hover:bg-gray-50"
            >
              <BookOpen size={15} />
              Curriculum Library
            </button>
            <button
              onClick={() => onNavigate("create")}
              className="flex items-center gap-2 px-4 py-2 bg-[#1a4db5] text-white rounded-lg text-sm hover:bg-blue-700"
            >
              <Plus size={15} />
              New Curriculum
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-5 gap-4 mb-6">
          {[
            { label: "Curriculum Versions", value: "12", sub: "Published", icon: BookOpen, color: "text-blue-600", bg: "bg-blue-50" },
            { label: "Schools Deployed", value: "248", sub: "Across all curricula", icon: School, color: "text-orange-500", bg: "bg-orange-50" },
            { label: "Active Supplements", value: "45", sub: "Across 32 schools", icon: Puzzle, color: "text-purple-500", bg: "bg-purple-50" },
            { label: "Learners on Journey", value: "128,540", sub: "+8.4% this term", icon: Users, color: "text-indigo-500", bg: "bg-indigo-50" },
            { label: "Completion Rate", value: "72%", sub: "Across all schools", icon: TrendingUp, color: "text-green-500", bg: "bg-green-50", large: true },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-xl p-4 border border-gray-100">
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 ${s.bg} rounded-lg flex items-center justify-center`}>
                  <s.icon size={18} className={s.color} />
                </div>
                {s.large && (
                  <div className="w-12 h-12 relative">
                    <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                      <circle cx="18" cy="18" r="15" fill="none" stroke="#e5e7eb" strokeWidth="3" />
                      <circle cx="18" cy="18" r="15" fill="none" stroke="#22c55e" strokeWidth="3" strokeDasharray="67 33" />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-gray-700">72%</span>
                  </div>
                )}
              </div>
              <div className="text-xl font-bold text-gray-900">{s.value}</div>
              <div className="text-xs text-gray-500 mt-0.5">{s.sub}</div>
              <button className="text-xs text-blue-600 mt-2 flex items-center gap-1 hover:underline">View all <ArrowRight size={10} /></button>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-6 mb-6">
          {/* Curriculum Structure Preview */}
          <div className="col-span-2 bg-white rounded-xl border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900">Curriculum Structure Preview</h2>
              <button onClick={() => onNavigate("structure")} className="text-sm text-blue-600 flex items-center gap-1 hover:underline">
                View full curriculum <ArrowRight size={12} />
              </button>
            </div>
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <BookOpen size={18} className="text-blue-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900 text-sm">CBC Junior Secondary v1.1</span>
                  <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-medium">Published</span>
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                </div>
                <div className="text-xs text-gray-500 mt-0.5">3 Terms • Grades 7–9 • Published on 12 Jan 2024</div>
              </div>
            </div>
            <div className="flex gap-2 mb-4">
              {["Term 1", "Term 2", "Term 3"].map((t, i) => (
                <button key={t} className={`px-4 py-1.5 rounded-full text-xs font-medium ${i === 0 ? "bg-[#1a4db5] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>{t}</button>
              ))}
            </div>
            <div className="grid grid-cols-6 gap-2 text-xs">
              {[
                { subj: "English", units: 5, assess: 4 },
                { subj: "Kiswahili", units: 5, assess: 3 },
                { subj: "Mathematics", units: 6, assess: 4 },
                { subj: "Integrated Science", units: 5, assess: 3 },
                { subj: "Social Studies", units: 4, assess: 2 },
                { subj: "+ 4 more", units: null, assess: null, extra: true },
              ].map((s) => (
                <div key={s.subj} className={`p-2 rounded-lg border ${s.extra ? "border-dashed border-blue-200 bg-blue-50 flex items-center justify-center text-blue-600" : "border-gray-100 bg-gray-50"}`}>
                  {s.extra ? (
                    <span className="text-center text-[10px] font-medium">{s.subj}</span>
                  ) : (
                    <>
                      <div className="font-medium text-gray-800 mb-1 text-[10px]">{s.subj}</div>
                      <div className="text-gray-500 text-[9px]">{s.units} Units</div>
                      <div className="text-gray-500 text-[9px]">{s.assess} Assessments</div>
                    </>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-3 p-2 bg-blue-50 rounded-lg flex items-center gap-2 text-xs text-blue-700">
              <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center flex-shrink-0">
                <CheckCircle2 size={12} className="text-blue-600" />
              </div>
              <span><strong>Competencies & Outcomes</strong> — 24 Key Competencies • 86 Learning Outcomes</span>
            </div>
          </div>

          {/* Deployment Overview */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900">Deployment Overview</h2>
              <button className="text-sm text-blue-600 flex items-center gap-1 hover:underline">View all <ArrowRight size={12} /></button>
            </div>
            <div className="flex justify-center mb-4">
              <div className="relative w-36 h-36">
                <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                  <circle cx="18" cy="18" r="15" fill="none" stroke="#e5e7eb" strokeWidth="4" />
                  <circle cx="18" cy="18" r="15" fill="none" stroke="#22c55e" strokeWidth="4" strokeDasharray="75 25" />
                  <circle cx="18" cy="18" r="15" fill="none" stroke="#3b82f6" strokeWidth="4" strokeDasharray="13 87" strokeDashoffset="-75" />
                  <circle cx="18" cy="18" r="15" fill="none" stroke="#f59e0b" strokeWidth="4" strokeDasharray="7 93" strokeDashoffset="-88" />
                  <circle cx="18" cy="18" r="15" fill="none" stroke="#9ca3af" strokeWidth="4" strokeDasharray="5 95" strokeDashoffset="-95" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold text-gray-900">248</span>
                  <span className="text-xs text-gray-500">Schools</span>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              {[
                { label: "Active", count: 186, color: "bg-green-500" },
                { label: "Draft", count: 32, color: "bg-blue-500" },
                { label: "Pending", count: 18, color: "bg-yellow-500" },
                { label: "Archived", count: 12, color: "bg-gray-400" },
              ].map((d) => (
                <div key={d.label} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${d.color}`}></div>
                    <span className="text-gray-600">{d.label}</span>
                  </div>
                  <span className="font-semibold text-gray-900">{d.count}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-green-50 rounded-lg flex items-start gap-2">
              <CheckCircle2 size={14} className="text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-xs font-semibold text-green-800">All active schools are up to date</div>
                <div className="text-[10px] text-green-600 mt-0.5">Great job! No expired deployments.</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Recent Deployments */}
          <div className="col-span-2 bg-white rounded-xl border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900">Recent School Deployments</h2>
              <button className="text-sm text-blue-600 flex items-center gap-1 hover:underline">View all <ArrowRight size={12} /></button>
            </div>
            <table className="w-full text-xs">
              <thead>
                <tr className="text-gray-400 uppercase text-[10px] border-b border-gray-100">
                  <th className="text-left pb-2 font-medium">School</th>
                  <th className="text-left pb-2 font-medium">Curriculum Version</th>
                  <th className="text-left pb-2 font-medium">Effective Dates</th>
                  <th className="text-left pb-2 font-medium">Status</th>
                  <th className="text-left pb-2 font-medium">Supplements</th>
                </tr>
              </thead>
              <tbody>
                {deployments.map((d) => (
                  <tr key={d.school} className="border-b border-gray-50 last:border-0">
                    <td className="py-2.5">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center text-[9px] font-bold text-orange-600">{d.school[0]}</div>
                        <div>
                          <div className="font-medium text-gray-800">{d.school}</div>
                          <div className="text-gray-400">{d.location}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-2.5 text-gray-600">{d.curriculum}</td>
                    <td className="py-2.5 text-gray-500">{d.dates}</td>
                    <td className="py-2.5">
                      <span className={`flex items-center gap-1 w-fit px-2 py-0.5 rounded-full text-[10px] font-medium ${
                        d.status === "Active" ? "bg-green-100 text-green-700" :
                        d.status === "Draft" ? "bg-blue-100 text-blue-700" :
                        "bg-yellow-100 text-yellow-700"
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${d.status === "Active" ? "bg-green-500" : d.status === "Draft" ? "bg-blue-500" : "bg-yellow-500"}`}></span>
                        {d.status}
                      </span>
                    </td>
                    <td className="py-2.5">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-600">{d.supplements}</span>
                        <button className={`px-2.5 py-1 rounded-md text-[10px] font-medium ${
                          d.status === "Active" ? "bg-blue-600 text-white" :
                          d.status === "Draft" ? "border border-blue-300 text-blue-600" :
                          "bg-yellow-100 text-yellow-700"
                        }`}>
                          {d.status === "Active" ? "Manage" : d.status === "Draft" ? "Continue" : "Review"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pending Approvals */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900">Pending Approvals</h2>
              <button className="text-sm text-blue-600 flex items-center gap-1 hover:underline">View all <ArrowRight size={12} /></button>
            </div>
            <div className="space-y-3">
              {pendingApprovals.map((p) => (
                <div key={p.desc} className="flex items-center gap-3 p-3 border border-gray-100 rounded-lg hover:border-gray-200 cursor-pointer group">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Puzzle size={14} className="text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="text-xs font-medium text-gray-800">{p.type}</span>
                      <span className={`px-1.5 py-0.5 text-[9px] rounded font-medium ${p.color}`}>{p.badge}</span>
                    </div>
                    <div className="text-[11px] text-gray-600 truncate">{p.school}</div>
                    <div className="text-[10px] text-gray-400 truncate">{p.desc}</div>
                    <div className="text-[9px] text-gray-400">Requested by: {p.requestedBy} • {p.time}</div>
                  </div>
                  <ChevronRight size={14} className="text-gray-300 group-hover:text-gray-500 flex-shrink-0" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Learner Journey at a Glance */}
        <div className="mt-6 bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Learner Journey at a Glance</h2>
            <button className="text-sm text-blue-600 flex items-center gap-1 hover:underline">View analytics <ArrowRight size={12} /></button>
          </div>
          <div className="flex items-center gap-3">
            {[
              { label: "Base Curriculum", sub: "CBC Junior Secondary v1.1", detail: "3 Terms • 8 Courses", icon: BookOpen, bg: "bg-blue-50", color: "text-blue-600" },
              { label: "Supplements", sub: "2 Active Supplements", detail: "Added to this school", icon: Puzzle, bg: "bg-purple-50", color: "text-purple-600" },
              { label: "Active Learners", sub: "1,245 Learners", detail: "In 45 Classes", icon: Users, bg: "bg-indigo-50", color: "text-indigo-600" },
              { label: "Progress", sub: "72% Avg. Completion", detail: "On track", icon: TrendingUp, bg: "bg-green-50", color: "text-green-600" },
              { label: "Outcomes", sub: "85% Mastery Rate", detail: "This Term", icon: CheckCircle2, bg: "bg-yellow-50", color: "text-yellow-600" },
            ].map((item, i) => (
              <div key={item.label} className="flex items-center gap-3 flex-1">
                <div className={`flex items-center gap-3 flex-1 p-3 ${item.bg} rounded-xl`}>
                  <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                    <item.icon size={16} className={item.color} />
                  </div>
                  <div>
                    <div className="text-[10px] text-gray-500">{item.label}</div>
                    <div className="text-xs font-semibold text-gray-800">{item.sub}</div>
                    <div className="text-[10px] text-gray-400">{item.detail}</div>
                  </div>
                </div>
                {i < 4 && <ArrowRight size={16} className="text-gray-300 flex-shrink-0" />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
