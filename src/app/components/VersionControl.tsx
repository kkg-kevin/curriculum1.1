import { useState } from "react";
import { Plus, BookOpen, Calendar, GitBranch, MoreHorizontal, ChevronRight, ChevronLeft, Eye, Edit, ArrowRight, CheckCircle2 } from "lucide-react";

const versionTabs = ["Version Overview", "Change History", "Compare Versions", "Drafts", "Publishing Rules"];

const timeline = [
  {
    version: "v1.1", status: "CURRENT", publishStatus: "Published", date: "12 Jan 2024", by: "Super Admin",
    desc: "Added Digital Literacy to Grade 8 Term 2, updated Mathematics outcomes, and improved assessment rubrics.",
    color: "bg-green-500",
  },
  {
    version: "v1.0", status: null, publishStatus: "Published", date: "01 Sep 2023", by: "Super Admin",
    desc: "Initial release of the CBC Junior Secondary curriculum.",
    color: "bg-green-500",
  },
  {
    version: "v0.3", status: null, publishStatus: "Draft", date: "15 Aug 2023", by: "Curriculum Admin",
    desc: "Added Social Studies outcomes and learning resources.",
    color: "bg-gray-400",
  },
  {
    version: "v0.2", status: null, publishStatus: "Draft", date: "02 Aug 2023", by: "Curriculum Admin",
    desc: "Updated course structure for Grade 9.",
    color: "bg-gray-400",
  },
  {
    version: "v0.1", status: null, publishStatus: "Draft", date: "20 Jul 2023", by: "Curriculum Admin",
    desc: "First draft of curriculum structure.",
    color: "bg-gray-400",
  },
];

const allVersions = [
  { version: "v1.1", status: "Current", publishStatus: "Published", type: "Minor", date: "12 Jan 2024", by: "Super Admin", desc: "Added Digital Literacy, updated outcomes, improved rubrics.", deployed: "248 schools" },
  { version: "v1.0", status: null, publishStatus: "Published", type: "Major", date: "01 Sep 2023", by: "Super Admin", desc: "Initial release of the curriculum.", deployed: "220 schools" },
  { version: "v0.3", status: null, publishStatus: "Draft", type: "Minor", date: "15 Aug 2023", by: "Curriculum Admin", desc: "Added Social Studies outcomes and learning resources.", deployed: "—" },
  { version: "v0.2", status: null, publishStatus: "Draft", type: "Minor", date: "02 Aug 2023", by: "Curriculum Admin", desc: "Updated Grade 9 course structure.", deployed: "—" },
  { version: "v0.1", status: null, publishStatus: "Draft", type: "Major", date: "20 Jul 2023", by: "Curriculum Admin", desc: "First draft of curriculum structure.", deployed: "—" },
];

export function VersionControl() {
  const [activeTab, setActiveTab] = useState("Version Overview");

  return (
    <div className="flex-1 overflow-auto bg-gray-50">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Version Control</h1>
            <p className="text-gray-500 text-sm mt-0.5">Manage curriculum versions, track changes, and publish updates with confidence.</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white hover:bg-gray-50">
              <GitBranch size={14} />
              Version History
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#1a4db5] text-white rounded-lg text-sm hover:bg-blue-700">
              <Plus size={14} />
              Create New Version
            </button>
          </div>
        </div>

        {/* Curriculum Info Bar */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 mb-5 flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <BookOpen size={22} className="text-blue-600" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-gray-900">CBC Junior Secondary</span>
              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">Published v1.1</span>
            </div>
            <div className="text-xs text-gray-500 mt-0.5">Competency-Based Curriculum (CBC) • 3 Terms • Grades 7–9</div>
          </div>
          <div className="flex items-center gap-8">
            {[
              { icon: GitBranch, value: "3", label: "Major Versions", color: "text-blue-600", bg: "bg-blue-50" },
              { icon: GitBranch, value: "5", label: "Minor Versions", color: "text-green-600", bg: "bg-green-50" },
              { icon: Calendar, value: "12 Jan 2024", label: "Last Published", color: "text-orange-500", bg: "bg-orange-50" },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-2">
                <div className={`w-9 h-9 ${s.bg} rounded-lg flex items-center justify-center`}>
                  <s.icon size={15} className={s.color} />
                </div>
                <div>
                  <div className="font-bold text-gray-900 text-sm">{s.value}</div>
                  <div className="text-[10px] text-gray-400">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-5 bg-white border border-gray-200 rounded-xl p-1">
          {versionTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex-1 justify-center ${
                activeTab === tab
                  ? "bg-[#1a4db5] text-white"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-5 gap-5 mb-5">
          {/* Version Timeline */}
          <div className="col-span-3 bg-white rounded-xl border border-gray-100 p-5">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="font-semibold text-gray-900">Version Timeline</h2>
              <div className="w-4 h-4 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-gray-500 text-[9px] font-bold">?</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mb-5">Track the evolution of your curriculum over time.</p>

            <div className="relative">
              <div className="absolute left-[15px] top-3 bottom-3 w-0.5 bg-gray-200"></div>
              <div className="space-y-5">
                {timeline.map((item, i) => (
                  <div key={item.version} className="flex items-start gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 z-10 ${item.publishStatus === "Published" ? "bg-green-500" : "bg-gray-300"}`}>
                      {item.publishStatus === "Published" ? "✓" : ""}
                    </div>
                    <div className="flex-1 pb-2">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-bold text-gray-900 text-sm">{item.version}</span>
                        {item.status && (
                          <span className="px-1.5 py-0.5 bg-green-100 text-green-700 text-[10px] rounded font-medium uppercase">{item.status}</span>
                        )}
                        <span className={`px-1.5 py-0.5 text-[10px] rounded font-medium ${item.publishStatus === "Published" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                          {item.publishStatus}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 mb-1">{item.publishStatus === "Published" ? `Published on ${item.date}` : `Draft • ${item.date}`} • {item.by}</div>
                      <p className="text-xs text-gray-600 mb-1.5">{item.desc}</p>
                      <button className="text-xs text-blue-600 flex items-center gap-1 hover:underline">
                        View details <ArrowRight size={11} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Current Version Details */}
          <div className="col-span-2 space-y-4">
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle2 size={14} className="text-green-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 text-sm">Current Version: v1.1 (Published)</div>
                    <div className="text-xs text-gray-500">This is the active version deployed to 248 schools.</div>
                  </div>
                </div>
                <button className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50">
                  <MoreHorizontal size={14} className="text-gray-400" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                {[
                  { value: "32", label: "Courses", icon: BookOpen, color: "text-blue-600", bg: "bg-blue-50" },
                  { value: "9", label: "Classes", icon: Calendar, color: "text-green-600", bg: "bg-green-50" },
                  { value: "120", label: "Assessments", icon: CheckCircle2, color: "text-orange-500", bg: "bg-orange-50" },
                  { value: "86", label: "Outcomes", icon: GitBranch, color: "text-purple-600", bg: "bg-purple-50" },
                ].map((s) => (
                  <div key={s.label} className={`${s.bg} rounded-xl p-3 flex items-center gap-2`}>
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                      <s.icon size={14} className={s.color} />
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">{s.value}</div>
                      <div className="text-[10px] text-gray-500">{s.label}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <h4 className="text-xs font-semibold text-gray-700 mb-2">What's new in v1.1?</h4>
                <div className="space-y-1.5">
                  {[
                    "Added Digital Literacy to Grade 8, Term 2",
                    "Updated Mathematics learning outcomes for better alignment",
                    "Improved assessment rubrics and added teacher guidance notes",
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-2 p-2.5 bg-gray-50 rounded-lg">
                      <CheckCircle2 size={13} className="text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-xs text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* All Versions Table */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-semibold text-gray-900">All Versions</h2>
              <p className="text-xs text-gray-500">View, manage, and control all curriculum versions.</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <input placeholder="Search versions..." className="pl-8 pr-4 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none w-44" />
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs">🔍</span>
              </div>
              <select className="px-2 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none">
                <option>All Authors</option>
              </select>
              <select className="px-2 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none">
                <option>All Authors</option>
              </select>
              <button className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50">
                ⚙️
              </button>
            </div>
          </div>

          <table className="w-full text-xs">
            <thead>
              <tr className="text-gray-400 uppercase text-[10px] border-b border-gray-100">
                <th className="text-left pb-2 font-medium">Version</th>
                <th className="text-left pb-2 font-medium">Status</th>
                <th className="text-left pb-2 font-medium">Type</th>
                <th className="text-left pb-2 font-medium">Published On</th>
                <th className="text-left pb-2 font-medium">Published By</th>
                <th className="text-left pb-2 font-medium">Description</th>
                <th className="text-left pb-2 font-medium">Deployed To</th>
                <th className="text-left pb-2 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {allVersions.map((v) => (
                <tr key={v.version} className="border-b border-gray-50 last:border-0 hover:bg-gray-50">
                  <td className="py-3 font-medium text-gray-900">{v.version}</td>
                  <td className="py-3">
                    {v.status ? (
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-[10px] font-medium">Current</span>
                    ) : null}
                  </td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${v.publishStatus === "Published" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                      {v.publishStatus}
                    </span>
                  </td>
                  <td className="py-3 text-gray-600">{v.date}</td>
                  <td className="py-3 text-gray-600">{v.by}</td>
                  <td className="py-3 text-gray-500 max-w-xs truncate">{v.desc}</td>
                  <td className="py-3 text-gray-500">{v.deployed}</td>
                  <td className="py-3">
                    <div className="flex items-center gap-1">
                      {v.publishStatus === "Published" ? (
                        <>
                          <button className="flex items-center gap-1 px-2 py-1 border border-gray-200 rounded text-[10px] text-gray-600 hover:bg-gray-50">
                            <Eye size={10} />
                            View
                          </button>
                          <button className="w-6 h-6 rounded border border-gray-200 flex items-center justify-center hover:bg-gray-50">
                            <MoreHorizontal size={11} className="text-gray-400" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button className="flex items-center gap-1 px-2 py-1 border border-gray-200 rounded text-[10px] text-gray-600 hover:bg-gray-50">
                            <Edit size={10} />
                            Continue
                          </button>
                          <button className="w-6 h-6 rounded border border-gray-200 flex items-center justify-center hover:bg-gray-50">
                            <MoreHorizontal size={11} className="text-gray-400" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
            <span>Showing 1 to 5 of 5 versions</span>
            <div className="flex items-center gap-2">
              <button className="w-7 h-7 rounded border border-gray-200 flex items-center justify-center hover:bg-gray-50">
                <ChevronLeft size={13} className="text-gray-400" />
              </button>
              <button className="w-7 h-7 rounded border border-blue-500 bg-blue-500 text-white flex items-center justify-center text-xs font-medium">1</button>
              <button className="w-7 h-7 rounded border border-gray-200 flex items-center justify-center hover:bg-gray-50">
                <ChevronRight size={13} className="text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
