import { useState } from "react";
import { X, CheckCircle2, ChevronDown, School, BookOpen, Info, Search, ChevronRight } from "lucide-react";

type Screen = "management" | "create" | "structure" | "settings" | "deploy" | "version-control" | "library";

interface Props {
  onNavigate: (screen: Screen) => void;
}

const steps = ["Select School", "Choose Course", "Configure", "Set Scope & Dates", "Review"];

const courses = [
  {
    title: "Robotics Enrichment",
    term: "Term 2",
    badges: ["Additive", "Additive"],
    subject: "STEM",
    grades: "7 – 9",
    desc: "Hands-on robotics and coding to build problem-solving skills.",
    color: "bg-blue-500",
    selected: true,
  },
  {
    title: "AI & Digital Literacy",
    term: "Term 3",
    badges: ["Additive", "Additive"],
    subject: "ICT",
    grades: "7 – 9",
    desc: "Build foundational AI and digital citizenship skills.",
    color: "bg-orange-400",
    selected: false,
  },
  {
    title: "Remedial Mathematics",
    term: "Term 1",
    badges: ["Cohort-Specific"],
    subject: "Mathematics",
    grades: "7 – 9",
    desc: "Targeted support to strengthen core math concepts.",
    color: "bg-pink-400",
    selected: false,
  },
];

export function DeploySupplementary({ onNavigate }: Props) {
  const [activeStep] = useState(1);
  const [selectedCourse, setSelectedCourse] = useState(0);
  const [gradeLevel, setGradeLevel] = useState("Grade 8");
  const [supplementType, setSupplementType] = useState("Additive");
  const [coursePacing, setCoursePacing] = useState("default");

  return (
    <div className="flex-1 overflow-auto bg-gray-50">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Deploy Supplementary Course</h1>
            <p className="text-gray-500 text-sm mt-0.5">Add enrichment, remediation, or specialized courses to a school's curriculum without altering the base curriculum.</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white hover:bg-gray-50">
              Save as Draft
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#1a4db5] text-white rounded-lg text-sm hover:bg-blue-700">
              Review & Submit →
            </button>
          </div>
        </div>

        {/* Stepper */}
        <div className="flex items-center mb-6">
          {steps.map((step, i) => (
            <div key={step} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold ${
                  i + 1 < activeStep ? "bg-green-500 text-white" :
                  i + 1 === activeStep ? "bg-[#1a4db5] text-white" :
                  "bg-white border-2 border-gray-200 text-gray-400"
                }`}>
                  {i + 1 < activeStep ? <CheckCircle2 size={16} /> : i + 1}
                </div>
                <span className={`text-xs mt-1 whitespace-nowrap ${i + 1 === activeStep ? "text-[#1a4db5] font-medium" : "text-gray-400"}`}>{step}</span>
              </div>
              {i < steps.length - 1 && <div className="flex-1 h-px bg-gray-200 mx-3 mb-4"></div>}
            </div>
          ))}
        </div>

        {/* Info Banner */}
        <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-xl mb-6">
          <Info size={16} className="text-blue-500 flex-shrink-0" />
          <p className="text-sm text-blue-700">
            Supplementary courses are added on top of the base curriculum. They do <strong>not replace or modify</strong> existing courses unless specified.
          </p>
          <button className="ml-auto text-blue-400 hover:text-blue-600"><X size={14} /></button>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 space-y-5">
            {/* 1. Select School */}
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h2 className="font-semibold text-gray-900 mb-0.5">1. Select School</h2>
              <p className="text-sm text-gray-500 mb-4">Choose the school and base curriculum this supplement will be added to.</p>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">School <span className="text-red-500">*</span></label>
                  <div className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg">
                    <div className="w-5 h-5 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <School size={11} className="text-orange-500" />
                    </div>
                    <span className="text-sm text-gray-700 flex-1">Greenfield Academy</span>
                    <ChevronDown size={14} className="text-gray-400" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Base Curriculum</label>
                  <div className="p-3 border border-gray-200 rounded-lg bg-gray-50">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-5 h-5 bg-blue-100 rounded flex items-center justify-center">
                        <BookOpen size={10} className="text-blue-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-800">CBC Junior Secondary v1.1</span>
                      <span className="px-1.5 py-0.5 bg-green-100 text-green-700 text-[10px] rounded font-medium">Active</span>
                    </div>
                    <p className="text-[10px] text-gray-400 ml-7">Deployed on 15 Jan 2024 • Grades 7–9 • 3 Terms</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Choose Supplementary Course */}
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h2 className="font-semibold text-gray-900 mb-0.5">2. Choose Supplementary Course</h2>
              <p className="text-sm text-gray-500 mb-4">Select an approved supplementary course to add.</p>

              <div className="flex items-center gap-3 mb-4">
                <div className="relative flex-1">
                  <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input placeholder="Search courses..." className="w-full pl-8 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-300" />
                </div>
                <div className="relative">
                  <select className="px-3 py-2 border border-gray-200 rounded-lg text-sm appearance-none pr-7 focus:outline-none">
                    <option>All Types</option>
                  </select>
                  <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
                <div className="relative">
                  <select className="px-3 py-2 border border-gray-200 rounded-lg text-sm appearance-none pr-7 focus:outline-none">
                    <option>All Subjects</option>
                  </select>
                  <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <p className="text-xs font-medium text-gray-600 mb-3">Course Library</p>

              <div className="relative">
                <div className="flex gap-3 overflow-hidden">
                  {courses.map((course, i) => (
                    <div
                      key={course.title}
                      onClick={() => setSelectedCourse(i)}
                      className={`flex-1 min-w-0 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        selectedCourse === i ? "border-blue-500 bg-blue-50" : "border-gray-200 bg-white hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className={`w-12 h-12 ${course.color} rounded-xl flex items-center justify-center text-2xl`}>
                          {i === 0 ? "🤖" : i === 1 ? "🧠" : "❤️"}
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                          selectedCourse === i ? "border-blue-500 bg-blue-500" : "border-gray-300"
                        }`}>
                          {selectedCourse === i && <div className="w-2 h-2 bg-white rounded-full"></div>}
                        </div>
                      </div>
                      <div className="flex gap-1 mb-2 flex-wrap">
                        {course.badges.map((b, bi) => (
                          <span key={bi} className="px-1.5 py-0.5 bg-green-100 text-green-700 text-[9px] rounded font-medium">{b}</span>
                        ))}
                      </div>
                      <div className="font-semibold text-gray-900 text-sm mb-0.5">{course.title}</div>
                      <div className="text-xs text-gray-500 mb-0.5">{course.term}</div>
                      <div className="text-xs text-gray-400 mb-0.5">Subject: {course.subject}</div>
                      <div className="text-xs text-gray-400 mb-2">Grades: {course.grades}</div>
                      <p className="text-xs text-gray-500 line-clamp-2">{course.desc}</p>
                    </div>
                  ))}
                </div>
                <button className="absolute right-0 top-1/2 -translate-y-1/2 w-7 h-7 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm hover:bg-gray-50">
                  <ChevronRight size={14} className="text-gray-500" />
                </button>
              </div>

              <div className="mt-4 p-3 bg-gray-50 rounded-lg flex items-center gap-2 text-xs text-gray-500">
                Can't find what you need?
                <button className="text-blue-600 underline flex items-center gap-1">Request a new supplementary course <ChevronRight size={11} /></button>
              </div>
            </div>

            {/* 3. Configure Supplement */}
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h2 className="font-semibold text-gray-900 mb-0.5">3. Configure Supplement</h2>
              <p className="text-sm text-gray-500 mb-4">Define how this course will be delivered.</p>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Supplement Type</label>
                  <div className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg">
                    <div className="w-5 h-5 bg-green-100 rounded flex items-center justify-center">
                      <span className="text-green-600 text-[10px]">+</span>
                    </div>
                    <span className="text-sm text-gray-700 flex-1">{supplementType}</span>
                    <ChevronDown size={14} className="text-gray-400" />
                  </div>
                  <p className="text-[10px] text-gray-400 mt-1">Adds new content without changing the base curriculum</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Integration with Base Curriculum</label>
                  <div className="relative">
                    <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm appearance-none pr-7 focus:outline-none">
                      <option>Stand-Alone</option>
                    </select>
                    <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                  <p className="text-[10px] text-gray-400 mt-1">Does not replace any existing courses</p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">Course Pacing</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: "default", label: "Use Course Default", sub: "Follows the recommended 13-week plan" },
                    { id: "customize", label: "Customize Pacing", sub: "Adjust weeks and milestones" },
                    { id: "condensed", label: "Condensed", sub: "Deliver in fewer weeks" },
                  ].map((opt) => (
                    <label
                      key={opt.id}
                      className={`flex items-start gap-2 p-3 rounded-xl border-2 cursor-pointer transition-colors ${
                        coursePacing === opt.id ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="pacing"
                        value={opt.id}
                        checked={coursePacing === opt.id}
                        onChange={() => setCoursePacing(opt.id)}
                        className="mt-0.5"
                      />
                      <div>
                        <div className="text-xs font-medium text-gray-800">{opt.label}</div>
                        <div className="text-[10px] text-gray-400">{opt.sub}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Deployment Summary */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h3 className="font-semibold text-gray-900 mb-4">Deployment Summary</h3>
              <div className="space-y-3 text-sm">
                {[
                  { label: "School", value: "Greenfield Academy", icon: "🏫" },
                  { label: "Base Curriculum", value: "CBC Junior Secondary v1.1", icon: "📘" },
                  { label: "Supplement Course", value: "Robotics Enrichment Term 2", icon: "📗" },
                  { label: "Type", value: "Additive", type: "badge", badgeColor: "bg-green-100 text-green-700" },
                  { label: "Scope", value: "Grade 8 • Cohort A", icon: null },
                  { label: "Dates", value: "15 Apr – 05 Jul 2024", icon: null },
                  { label: "Status", value: "Pending Approval", type: "badge", badgeColor: "bg-yellow-100 text-yellow-700" },
                ].map((item) => (
                  <div key={item.label} className="flex items-start justify-between gap-2">
                    <span className="text-gray-500 text-xs flex-shrink-0">{item.label}</span>
                    {item.type === "badge" ? (
                      <span className={`px-2 py-0.5 text-xs rounded font-medium ${item.badgeColor}`}>{item.value}</span>
                    ) : (
                      <span className="text-gray-800 text-xs font-medium text-right">{item.value}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Scope & Schedule */}
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h3 className="font-semibold text-gray-900 mb-1">Scope & Schedule</h3>
              <p className="text-xs text-gray-500 mb-4">4. Set Scope and Dates — Choose who will access this course and when.</p>

              <div className="mb-3">
                <label className="block text-xs font-medium text-gray-700 mb-2">Apply To</label>
                <div className="flex gap-1">
                  {["Grade", "Class", "Cohort", "Learners"].map((t) => (
                    <button key={t} className={`flex-1 py-1.5 text-xs rounded-lg font-medium ${t === "Grade" ? "bg-[#1a4db5] text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}>{t}</button>
                  ))}
                </div>
              </div>

              <div className="mb-3">
                <label className="block text-xs font-medium text-gray-700 mb-2">Grade Level <span className="text-red-500">*</span></label>
                <div className="flex gap-2">
                  {["Grade 7", "Grade 8", "Grade 9"].map((g) => (
                    <label key={g} className="flex items-center gap-1.5 cursor-pointer">
                      <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${gradeLevel === g ? "bg-[#1a4db5] border-[#1a4db5]" : "border-gray-300"}`}>
                        {gradeLevel === g && <div className="w-2 h-2 bg-white rounded-sm"></div>}
                      </div>
                      <span className="text-xs text-gray-700">{g}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mb-3">
                <label className="block text-xs font-medium text-gray-700 mb-1">Cohort (Optional)</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <select className="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-xs appearance-none pr-6 focus:outline-none">
                      <option>Cohort A</option>
                    </select>
                    <ChevronDown size={11} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                  <div className="relative flex-1">
                    <select className="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-xs appearance-none pr-6 focus:outline-none">
                      <option>Cohort</option>
                    </select>
                    <ChevronDown size={11} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">Effective Dates</label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="px-2 py-1.5 border border-gray-200 rounded-lg flex items-center gap-1.5">
                    <span className="text-[10px] text-gray-400">📅</span>
                    <span className="text-xs text-gray-700">15 Apr 2024</span>
                  </div>
                  <div className="px-2 py-1.5 border border-gray-200 rounded-lg flex items-center gap-1.5">
                    <span className="text-[10px] text-gray-400">📅</span>
                    <span className="text-xs text-gray-700">05 Jul 2024</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Approval Required */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <CheckCircle2 size={16} className="text-green-600" />
              </div>
              <div>
                <div className="text-sm font-semibold text-green-800 mb-1">Approval Required</div>
                <p className="text-xs text-green-700">This deployment will be reviewed by a Deployment Admin before it goes live.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
