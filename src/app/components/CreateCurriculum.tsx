import { useState } from "react";
import { X, ChevronDown, Calendar, GitBranch, CheckCircle2, Rocket, BarChart3, BookOpen } from "lucide-react";
import {
  getCyclePeriods,
  getCycleSummary,
  normalizeCustomPeriods,
  type CurriculumCycleConfig,
  type CustomCycleKind,
} from "../lib/curriculumCycle";

type Screen = "management" | "create" | "structure" | "settings" | "deploy" | "version-control" | "library";

interface Props {
  onNavigate: (screen: Screen) => void;
  cycleConfig: CurriculumCycleConfig;
  onCycleConfigChange: (cycleConfig: CurriculumCycleConfig) => void;
}

const steps = ["Basic Information", "Structure", "Classes & Courses", "Competencies", "Settings", "Review"];

const academicCycleOptions = [
  { id: "3terms", label: "3 Terms", sub: "(Term 1, Term 2, Term 3)", icon: Calendar },
  { id: "2sem", label: "2 Semesters", sub: "(Sem 1, Sem 2)", icon: Calendar },
  { id: "custom", label: "Custom", sub: "Define your own", icon: Calendar },
] as const;

export function CreateCurriculum({ onNavigate, cycleConfig, onCycleConfigChange }: Props) {
  const [curriculumName, setCurriculumName] = useState("CBC Junior Secondary");
  const [curriculumCode, setCurriculumCode] = useState("CBC-JS-2024");
  const [description, setDescription] = useState(
    "Competency-Based Curriculum for Junior Secondary\n(Grades 7-9) aligned with the latest CBC framework.",
  );
  const [framework, setFramework] = useState("Competency-Based Curriculum (CBC)");
  const [educationLevel, setEducationLevel] = useState("Junior Secondary");

  const periods = getCyclePeriods(cycleConfig);
  const cycleSummary = getCycleSummary(cycleConfig);
  const isCustom = cycleConfig.preset === "custom";

  const updateCycleConfig = (next: CurriculumCycleConfig) => {
    onCycleConfigChange(next);
  };

  const setPreset = (preset: CurriculumCycleConfig["preset"]) => {
    if (preset === "custom") {
      updateCycleConfig({
        preset,
        customKind: cycleConfig.customKind,
        customPeriods: normalizeCustomPeriods(
          cycleConfig.customKind,
          cycleConfig.customPeriods.length || 3,
          cycleConfig.customPeriods,
        ),
      });
      return;
    }

    updateCycleConfig({
      preset,
      customKind: cycleConfig.customKind,
      customPeriods: preset === "3terms" ? ["Term 1", "Term 2", "Term 3"] : ["Semester 1", "Semester 2"],
    });
  };

  const setCustomKind = (kind: CustomCycleKind) => {
    const count = cycleConfig.customPeriods.length || 3;
    updateCycleConfig({
      preset: "custom",
      customKind: kind,
      customPeriods: normalizeCustomPeriods(kind, count, cycleConfig.customPeriods),
    });
  };

  const setCustomPeriodCount = (count: number) => {
    updateCycleConfig({
      ...cycleConfig,
      preset: "custom",
      customPeriods: normalizeCustomPeriods(cycleConfig.customKind, count, cycleConfig.customPeriods),
    });
  };

  const setCustomPeriodLabel = (index: number, value: string) => {
    const nextPeriods = [...periods];
    nextPeriods[index] = value;
    updateCycleConfig({
      ...cycleConfig,
      preset: "custom",
      customPeriods: nextPeriods,
    });
  };

  return (
    <div className="flex-1 overflow-auto bg-gray-50">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Create New Curriculum</h1>
            <p className="text-gray-500 text-sm mt-0.5">
              Build a structured learning journey that can be deployed to one or more schools.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate("management")}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white hover:bg-gray-50">
              Save as Draft
            </button>
            <button
              onClick={() => onNavigate("structure")}
              className="flex items-center gap-2 px-4 py-2 bg-[#1a4db5] text-white rounded-lg text-sm hover:bg-blue-700"
            >
              Next: Add Structure {"->"}
            </button>
          </div>
        </div>

        {/* Stepper */}
        <div className="flex items-center mb-8">
          {steps.map((step, i) => (
            <div key={step} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    i === 0 ? "bg-[#1a4db5] text-white" : "bg-white border-2 border-gray-200 text-gray-400"
                  }`}
                >
                  {i + 1}
                </div>
                <span className={`text-xs mt-1 whitespace-nowrap ${i === 0 ? "text-[#1a4db5] font-medium" : "text-gray-400"}`}>
                  {step}
                </span>
              </div>
              {i < steps.length - 1 && <div className="flex-1 h-px bg-gray-200 mx-2 mb-4"></div>}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-5 gap-6">
          {/* Left Form */}
          <div className="col-span-3 space-y-6">
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h2 className="font-semibold text-gray-900 mb-1">Basic Information</h2>
              <p className="text-sm text-gray-500 mb-5">Provide the essential details about this curriculum.</p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Curriculum Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    value={curriculumName}
                    onChange={(e) => setCurriculumName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Curriculum Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    value={curriculumCode}
                    onChange={(e) => setCurriculumCode(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                  <p className="text-xs text-gray-400 mt-1">A unique code to identify this curriculum.</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none"
                    />
                    <span className="absolute bottom-2 right-2 text-[10px] text-gray-400">{description.length}/300</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Curriculum Framework <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={framework}
                        onChange={(e) => setFramework(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 appearance-none pr-8"
                      >
                        <option>Competency-Based Curriculum (CBC)</option>
                        <option>IGCSE</option>
                        <option>British National Curriculum</option>
                      </select>
                      <ChevronDown
                        size={14}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Education Level <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={educationLevel}
                        onChange={(e) => setEducationLevel(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 appearance-none pr-8"
                      >
                        <option>Junior Secondary</option>
                        <option>Primary</option>
                        <option>Senior Secondary</option>
                      </select>
                      <ChevronDown
                        size={14}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Academic Cycle Model <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {academicCycleOptions.map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => setPreset(opt.id)}
                        className={`p-3 rounded-lg border-2 text-center transition-colors ${
                          cycleConfig.preset === opt.id
                            ? "border-[#1a4db5] bg-blue-50"
                            : "border-gray-200 bg-white hover:border-gray-300"
                        }`}
                      >
                        <opt.icon
                          size={20}
                          className={`mx-auto mb-1 ${cycleConfig.preset === opt.id ? "text-[#1a4db5]" : "text-gray-400"}`}
                        />
                        <div className={`text-xs font-semibold ${cycleConfig.preset === opt.id ? "text-[#1a4db5]" : "text-gray-700"}`}>
                          {opt.label}
                        </div>
                        <div className="text-[10px] text-gray-400">{opt.sub}</div>
                      </button>
                    ))}
                  </div>

                  {isCustom && (
                    <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50/70 p-4">
                      <div className="flex items-center justify-between gap-3 mb-3">
                        <div>
                          <p className="text-sm font-semibold text-gray-900">Customize academic cycle</p>
                          <p className="text-xs text-gray-500">
                            Choose whether this curriculum uses terms or semesters, then name each period.
                          </p>
                        </div>
                        <div className="text-xs font-medium text-[#1a4db5]">{cycleSummary}</div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 mb-4">
                        {[
                          { id: "term", label: "Terms" },
                          { id: "semester", label: "Semesters" },
                        ].map((kind) => (
                          <button
                            key={kind.id}
                            onClick={() => setCustomKind(kind.id as CustomCycleKind)}
                            className={`rounded-lg border px-3 py-2 text-left transition-colors ${
                              cycleConfig.customKind === kind.id
                                ? "border-[#1a4db5] bg-white"
                                : "border-gray-200 bg-white/70 hover:border-gray-300"
                            }`}
                          >
                            <div className={`text-sm font-semibold ${cycleConfig.customKind === kind.id ? "text-[#1a4db5]" : "text-gray-700"}`}>
                              {kind.label}
                            </div>
                            <div className="text-[10px] text-gray-400">Use this label family for the custom periods.</div>
                          </button>
                        ))}
                      </div>

                      <div className="flex items-center gap-3 mb-4">
                        <label className="text-xs font-medium text-gray-700">Number of periods</label>
                        <input
                          type="number"
                          min={1}
                          max={12}
                          value={periods.length}
                          onChange={(e) => setCustomPeriodCount(Number(e.target.value || 1))}
                          className="w-24 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                        />
                        <button
                          onClick={() => setCustomPeriodCount(periods.length + 1)}
                          className="ml-auto rounded-lg border border-blue-200 bg-white px-3 py-2 text-xs font-medium text-[#1a4db5] hover:bg-blue-50"
                        >
                          Add Period
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        {periods.map((period, index) => (
                          <div key={`${period}-${index}`}>
                            <label className="mb-1 block text-[10px] font-medium uppercase tracking-wide text-gray-500">
                              {cycleConfig.customKind} {index + 1}
                            </label>
                            <input
                              value={period}
                              onChange={(e) => setCustomPeriodLabel(index, e.target.value)}
                              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Intended Countries / Regions</label>
                  <div className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg">
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full flex items-center gap-1">
                      Kenya
                      <button className="ml-1 text-blue-500 hover:text-blue-700">
                        <X size={10} />
                      </button>
                    </span>
                    <ChevronDown size={14} className="ml-auto text-gray-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                  <div className="flex items-center flex-wrap gap-2 px-3 py-2 border border-gray-300 rounded-lg">
                    {["CBC", "Junior Secondary", "Core Curriculum"].map((tag) => (
                      <span key={tag} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full flex items-center gap-1">
                        {tag}
                        <button className="text-gray-400 hover:text-gray-600">
                          <X size={10} />
                        </button>
                      </span>
                    ))}
                    <input placeholder="Add tags..." className="text-xs border-none outline-none flex-1 min-w-20" />
                    <ChevronDown size={14} className="text-gray-400" />
                  </div>
                </div>
              </div>

              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-[9px] font-bold">i</span>
                </div>
                <p className="text-xs text-blue-700">
                  You can always edit these details later. Once published, a new version will be created for major changes.
                </p>
              </div>
            </div>

            {/* Feature Highlights */}
            <div className="grid grid-cols-4 gap-3">
              {[
                {
                  icon: GitBranch,
                  label: "Version Controlled",
                  desc: "Every update creates a new version for easy tracking.",
                  color: "text-blue-600",
                  bg: "bg-blue-50",
                },
                {
                  icon: CheckCircle2,
                  label: "Standards-Aligned",
                  desc: "Map competencies and outcomes to learning standards.",
                  color: "text-green-600",
                  bg: "bg-green-50",
                },
                {
                  icon: Rocket,
                  label: "Flexible Deployment",
                  desc: "Deploy to one or multiple schools with custom settings.",
                  color: "text-purple-600",
                  bg: "bg-purple-50",
                },
                {
                  icon: BarChart3,
                  label: "Full Visibility",
                  desc: "Track progress and performance across all schools.",
                  color: "text-orange-600",
                  bg: "bg-orange-50",
                },
              ].map((f) => (
                <div key={f.label} className="bg-white rounded-lg border border-gray-100 p-3">
                  <div className={`w-8 h-8 ${f.bg} rounded-lg flex items-center justify-center mb-2`}>
                    <f.icon size={16} className={f.color} />
                  </div>
                  <div className="text-xs font-semibold text-gray-800 mb-0.5">{f.label}</div>
                  <div className="text-[10px] text-gray-500">{f.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Preview */}
          <div className="col-span-2 space-y-4">
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h3 className="font-semibold text-gray-900 mb-1">Curriculum Preview</h3>
              <p className="text-xs text-gray-500 mb-4">This is how your curriculum structure will look.</p>

              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <div className="p-4 bg-gray-50 flex items-center gap-3 border-b border-gray-200">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <BookOpen size={18} className="text-blue-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900 text-sm">{curriculumName || "Curriculum Name"}</span>
                      <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-[10px] rounded-full font-medium">+ Draft</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {cycleSummary} {"->"} Grades 7 - 9
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {periods.map((t) => (
                      <div key={t} className="border border-dashed border-gray-200 rounded-lg p-3 text-center">
                        <Calendar size={16} className="text-blue-400 mx-auto mb-1" />
                        <div className="text-xs font-medium text-gray-700">{t}</div>
                        <div className="text-[10px] text-gray-400">Coming up</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">What's next?</h4>
                <p className="text-xs text-gray-500 mb-3">You'll define the academic structure, classes, and courses.</p>
                <div className="space-y-2">
                  {[
                    { label: "Add Terms & Periods", sub: "Define the academic periods in this curriculum.", icon: Calendar },
                    { label: "Add Classes / Grades", sub: "Set up the grade levels for this curriculum.", icon: BookOpen },
                    { label: "Add Courses", sub: "Attach subjects to each class and term.", icon: BookOpen },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                      <div className="w-7 h-7 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                        <item.icon size={13} className="text-blue-600" />
                      </div>
                      <div>
                        <div className="text-xs font-medium text-gray-800">{item.label}</div>
                        <div className="text-[10px] text-gray-400">{item.sub}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
