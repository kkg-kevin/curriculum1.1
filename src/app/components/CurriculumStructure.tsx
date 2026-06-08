import { useState } from "react";
import { BookOpen, CheckCircle2, Plus, ChevronRight, ChevronDown, Edit, MoreHorizontal, Eye, Settings, Calendar, GraduationCap, BookMarked, BarChart3, Map, Clock } from "lucide-react";

type Screen = "management" | "create" | "structure" | "settings" | "deploy" | "version-control";

interface Props {
  onNavigate: (screen: Screen) => void;
}

const tabs = [
  { label: "Structure", icon: BookOpen },
  { label: "Competencies", icon: CheckCircle2 },
  { label: "Courses", icon: BookMarked },
  { label: "Assessments", icon: BarChart3 },
  { label: "Resources", icon: BookMarked },
  { label: "Mapping", icon: Map },
  { label: "History", icon: Clock },
];

const gradesCourses = [
  { grade: "Grade 7", courses: 4, subjects: ["English", "Kiswahili", "Mathematics", "Integrated Science"], color: "bg-green-400" },
  { grade: "Grade 8", courses: 3, subjects: ["English", "Mathematics", "Social Studies"], color: "bg-blue-400" },
  { grade: "Grade 9", courses: 3, subjects: ["Kiswahili", "Mathematics", "Integrated Science"], color: "bg-purple-400" },
];

export function CurriculumStructure({ onNavigate }: Props) {
  const [activeTab, setActiveTab] = useState("Structure");
  const [expandedTerm, setExpandedTerm] = useState("Term 1");

  return (
    <div className="flex-1 overflow-auto bg-gray-50">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Curriculum Structure</h1>
            <p className="text-gray-500 text-sm mt-0.5">Design and organize the academic structure, terms, classes, courses, and learning content.</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => onNavigate("settings")} className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white hover:bg-gray-50">
              <Settings size={14} />
              Curriculum Settings
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white hover:bg-gray-50">
              <Eye size={14} />
              Preview Curriculum
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#1a4db5] text-white rounded-lg text-sm hover:bg-blue-700">
              <Plus size={14} />
              Add New Item
              <ChevronDown size={14} />
            </button>
          </div>
        </div>

        {/* Curriculum Info Bar */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 mb-4 flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <BookOpen size={22} className="text-blue-600" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-gray-900">CBC Junior Secondary v1.1</span>
              <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-medium">Published</span>
            </div>
            <div className="text-xs text-gray-500 mt-0.5">Competency-Based Curriculum (CBC) • 3 Terms • Grades 7–9 • Published on 12 Jan 2024</div>
          </div>
          <div className="flex items-center gap-6">
            {[
              { icon: Calendar, value: "3", label: "Terms" },
              { icon: GraduationCap, value: "9", label: "Classes" },
              { icon: BookMarked, value: "32", label: "Courses" },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                  <s.icon size={14} className="text-blue-600" />
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
        <div className="flex gap-1 mb-4 bg-white border border-gray-200 rounded-xl p-1">
          {tabs.map((tab) => (
            <button
              key={tab.label}
              onClick={() => setActiveTab(tab.label)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex-1 justify-center ${
                activeTab === tab.label
                  ? "bg-[#1a4db5] text-white"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              <tab.icon size={14} />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-4 gap-4">
          {/* Left Tree Panel */}
          <div className="col-span-1 bg-white rounded-xl border border-gray-100 p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-800 text-sm">Curriculum Structure</h3>
              <button className="text-xs text-blue-600 hover:underline">Collapse All</button>
            </div>

            <div className="space-y-1">
              {/* Root */}
              <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-blue-50 border border-blue-200">
                <ChevronDown size={12} className="text-blue-600" />
                <div className="w-5 h-5 bg-blue-600 rounded flex items-center justify-center flex-shrink-0">
                  <BookOpen size={10} className="text-white" />
                </div>
                <span className="text-xs font-medium text-blue-700 truncate">CBC Junior Secondary v1.1</span>
                <span className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0 ml-auto"></span>
              </div>

              {/* Terms */}
              {["Term 1", "Term 2", "Term 3"].map((term, ti) => (
                <div key={term} className="ml-3">
                  <button
                    onClick={() => setExpandedTerm(expandedTerm === term ? "" : term)}
                    className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-left transition-colors ${
                      expandedTerm === term ? "bg-blue-50" : "hover:bg-gray-50"
                    }`}
                  >
                    {expandedTerm === term ? <ChevronDown size={11} className="text-gray-400" /> : <ChevronRight size={11} className="text-gray-400" />}
                    <div className="w-4 h-4 bg-blue-100 rounded flex items-center justify-center flex-shrink-0">
                      <Calendar size={9} className="text-blue-600" />
                    </div>
                    <span className="text-xs text-gray-700">{term}</span>
                  </button>

                  {expandedTerm === term && ti === 0 && (
                    <div className="ml-4 space-y-0.5">
                      {["Grade 7", "Grade 8", "Grade 9"].map((grade) => (
                        <div key={grade} className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-50 cursor-pointer">
                          <ChevronRight size={10} className="text-gray-300" />
                          <div className="w-4 h-4 bg-green-100 rounded flex items-center justify-center flex-shrink-0">
                            <GraduationCap size={9} className="text-green-600" />
                          </div>
                          <span className="text-xs text-gray-600">{grade}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              <button className="w-full mt-2 flex items-center gap-2 px-3 py-2 border border-dashed border-blue-200 rounded-lg text-blue-600 text-xs hover:bg-blue-50 justify-center">
                <Plus size={12} />
                Add Term
              </button>
            </div>
          </div>

          {/* Center Content */}
          <div className="col-span-2 space-y-4">
            {/* Term 1 Header */}
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Calendar size={18} className="text-blue-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="font-bold text-gray-900">Term 1</h2>
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-medium">Active</span>
                    </div>
                    <div className="text-xs text-gray-500">Jan 15 – Apr 15, 2024 (13 weeks)</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-1 px-3 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-600 hover:bg-gray-50">
                    <Edit size={12} />
                    Edit
                  </button>
                  <button className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs hover:bg-blue-700">
                    <Plus size={12} />
                    Add Class
                  </button>
                  <button className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-50">
                    <MoreHorizontal size={14} />
                  </button>
                </div>
              </div>

              <div className="flex gap-4 p-3 bg-gray-50 rounded-lg mb-4">
                {[
                  { value: "3", label: "Classes" },
                  { value: "10", label: "Courses" },
                  { value: "120", label: "Lessons" },
                  { value: "8", label: "Assessments" },
                ].map((s) => (
                  <div key={s.label} className="text-center flex-1">
                    <div className="font-bold text-gray-900 text-lg">{s.value}</div>
                    <div className="text-xs text-gray-500">{s.label}</div>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg text-xs text-blue-700">
                <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 font-bold text-[9px]">i</span>
                </div>
                This term contains 3 classes with 10 courses. Courses are organized by class.
              </div>
            </div>

            {/* Courses by Class */}
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Courses by Class</h3>
                <div className="flex items-center gap-2">
                  <button className="text-xs text-blue-600 hover:underline">Expand All</button>
                  <button className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs hover:bg-blue-700">
                    <Plus size={12} />
                    Add Course
                  </button>
                </div>
              </div>
              <p className="text-xs text-gray-500 mb-4">Manage courses for each class in this term.</p>

              <div className="space-y-3">
                {gradesCourses.map((gc) => (
                  <div key={gc.grade} className="border border-gray-100 rounded-xl overflow-hidden">
                    <div className="flex items-center justify-between p-3 bg-gray-50 border-b border-gray-100">
                      <div className="flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${gc.color}`}></span>
                        <span className="text-sm font-semibold text-gray-800">{gc.grade}</span>
                        <span className="text-xs text-gray-400">{gc.courses} Courses</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {gc.subjects.map((s) => (
                          <span key={s} className="px-2 py-0.5 bg-white border border-gray-200 rounded-full text-xs text-gray-600">{s}</span>
                        ))}
                        <button className="flex items-center gap-1 px-2 py-1 text-blue-600 text-xs hover:bg-blue-50 rounded">
                          <Plus size={11} />
                          Add Course
                        </button>
                        <ChevronRight size={14} className="text-gray-300" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Panel */}
          <div className="col-span-1 space-y-4">
            {/* Structure Overview */}
            <div className="bg-white rounded-xl border border-gray-100 p-4">
              <h3 className="font-semibold text-gray-800 text-sm mb-3">Structure Overview</h3>
              <div className="flex justify-center mb-4">
                <div className="relative w-28 h-28">
                  <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                    <circle cx="18" cy="18" r="15" fill="none" stroke="#e5e7eb" strokeWidth="4" />
                    <circle cx="18" cy="18" r="15" fill="none" stroke="#3b82f6" strokeWidth="4" strokeDasharray="31 69" />
                    <circle cx="18" cy="18" r="15" fill="none" stroke="#f59e0b" strokeWidth="4" strokeDasharray="34 66" strokeDashoffset="-31" />
                    <circle cx="18" cy="18" r="15" fill="none" stroke="#8b5cf6" strokeWidth="4" strokeDasharray="34 66" strokeDashoffset="-65" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-xl font-bold text-gray-900">32</span>
                    <span className="text-[10px] text-gray-400">Courses</span>
                  </div>
                </div>
              </div>
              <div className="space-y-1.5">
                {[
                  { label: "Term 1", count: 10, color: "bg-blue-500" },
                  { label: "Term 2", count: 11, color: "bg-yellow-500" },
                  { label: "Term 3", count: 11, color: "bg-purple-500" },
                  { label: "Electives", count: 0, color: "bg-gray-300" },
                ].map((t) => (
                  <div key={t.label} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${t.color}`}></div>
                      <span className="text-gray-600">{t.label}</span>
                    </div>
                    <span className="font-semibold text-gray-700">{t.count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl border border-gray-100 p-4">
              <h3 className="font-semibold text-gray-800 text-sm mb-3">Quick Actions</h3>
              <div className="space-y-2">
                {[
                  { label: "Add Term / Semester", sub: "Define academic periods", icon: Calendar, color: "bg-blue-50 text-blue-600" },
                  { label: "Add Class / Grade", sub: "Create or import classes", icon: GraduationCap, color: "bg-green-50 text-green-600" },
                  { label: "Add Course", sub: "Attach subjects to classes", icon: BookMarked, color: "bg-purple-50 text-purple-600" },
                  { label: "Reorder Structure", sub: "Drag and drop to organize", icon: BarChart3, color: "bg-orange-50 text-orange-600" },
                ].map((a) => (
                  <button key={a.label} className="w-full flex items-center gap-3 p-2.5 rounded-lg border border-gray-100 hover:border-gray-200 hover:bg-gray-50 text-left">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${a.color.split(" ")[0]}`}>
                      <a.icon size={14} className={a.color.split(" ")[1]} />
                    </div>
                    <div>
                      <div className="text-xs font-medium text-gray-800">{a.label}</div>
                      <div className="text-[10px] text-gray-400">{a.sub}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Validity */}
            <div className="bg-green-50 rounded-xl border border-green-200 p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 size={14} className="text-green-600" />
                </div>
                <span className="text-sm font-semibold text-green-800">Structure is valid</span>
              </div>
              <p className="text-xs text-green-600 mb-2">All required components are in place.</p>
              <button className="text-xs text-green-700 flex items-center gap-1 hover:underline font-medium">
                Learn more <ChevronRight size={11} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
