import { useEffect, useState } from "react";
import {
  BookOpen,
  CheckCircle2,
  Plus,
  ChevronRight,
  ChevronDown,
  Edit,
  MoreHorizontal,
  Eye,
  Settings,
  Calendar,
  GraduationCap,
  BookMarked,
  BarChart3,
  Map,
  Clock,
  X,
} from "lucide-react";
import { getCyclePeriods, getCycleSummary, type CurriculumCycleConfig } from "../lib/curriculumCycle";

type Screen = "management" | "create" | "structure" | "settings" | "deploy" | "version-control";

interface Props {
  onNavigate: (screen: Screen) => void;
  cycleConfig: CurriculumCycleConfig;
}

type CourseNode = {
  id: string;
  name: string;
};

type ClassNode = {
  id: string;
  name: string;
  courses: CourseNode[];
};

type PeriodNode = {
  id: string;
  classes: ClassNode[];
};

const tabs = [
  { label: "Structure", icon: BookOpen },
  { label: "Competencies", icon: CheckCircle2 },
  { label: "Courses", icon: BookMarked },
  { label: "Assessments", icon: BarChart3 },
  { label: "Resources", icon: BookMarked },
  { label: "Mapping", icon: Map },
  { label: "History", icon: Clock },
];

const initialClasses: ClassNode[] = [
  {
    id: "grade-7",
    name: "Grade 7",
    courses: [
      { id: "eng", name: "English" },
      { id: "kis", name: "Kiswahili" },
      { id: "math", name: "Mathematics" },
      { id: "sci", name: "Integrated Science" },
    ],
  },
  {
    id: "grade-8",
    name: "Grade 8",
    courses: [
      { id: "eng-8", name: "English" },
      { id: "math-8", name: "Mathematics" },
      { id: "soc-8", name: "Social Studies" },
    ],
  },
  {
    id: "grade-9",
    name: "Grade 9",
    courses: [
      { id: "kis-9", name: "Kiswahili" },
      { id: "math-9", name: "Mathematics" },
      { id: "sci-9", name: "Integrated Science" },
    ],
  },
];

function cloneInitialClasses() {
  return initialClasses.map((classItem) => ({
    ...classItem,
    courses: classItem.courses.map((course) => ({ ...course })),
  }));
}

function buildInitialStructure(periods: string[]): PeriodNode[] {
  return periods.map((_, index) => ({
    id: `period-${index}`,
    classes: index === 0 ? cloneInitialClasses() : [],
  }));
}

function syncStructureToPeriods(previous: PeriodNode[], periods: string[]) {
  return periods.map((_, index) => {
    const existing = previous[index];

    if (existing) {
      return {
        ...existing,
        id: `period-${index}`,
      };
    }

    return {
      id: `period-${index}`,
      classes: [],
    };
  });
}

function createId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function CurriculumStructure({ onNavigate, cycleConfig }: Props) {
  const periods = getCyclePeriods(cycleConfig);
  const cycleSummary = getCycleSummary(cycleConfig);
  const periodsKey = periods.join("|");
  const [activeTab, setActiveTab] = useState("Structure");
  const [expandedPeriodIndex, setExpandedPeriodIndex] = useState(0);
  const [structure, setStructure] = useState<PeriodNode[]>(() => buildInitialStructure(periods));
  const [openClassKey, setOpenClassKey] = useState<string>("0:0");
  const [classDraftPeriodIndex, setClassDraftPeriodIndex] = useState<number | null>(null);
  const [classDraftName, setClassDraftName] = useState("");
  const [courseDraftTarget, setCourseDraftTarget] = useState<{ periodIndex: number; classIndex: number } | null>(null);
  const [courseDraftName, setCourseDraftName] = useState("");

  useEffect(() => {
    setStructure((previous) => syncStructureToPeriods(previous, periods));
    setExpandedPeriodIndex((current) => Math.min(current, Math.max(periods.length - 1, 0)));
    setOpenClassKey((current) => {
      const [periodKey, classKey] = current.split(":");
      const nextPeriodIndex = Math.min(Number(periodKey || 0), Math.max(periods.length - 1, 0));
      const nextPeriod = syncStructureToPeriods(structure, periods)[nextPeriodIndex];
      if (!nextPeriod?.classes.length) {
        return "";
      }
      const nextClassIndex = Math.min(Number(classKey || 0), Math.max(nextPeriod.classes.length - 1, 0));
      return `${nextPeriodIndex}:${nextClassIndex}`;
    });
  }, [periodsKey]);

  const activePeriod = periods[expandedPeriodIndex] ?? periods[0] ?? "";
  const activePeriodNode = structure[expandedPeriodIndex] ?? structure[0];
  const activePeriodClasses = activePeriodNode?.classes ?? [];
  const activePeriodCourseCount = activePeriodClasses.reduce((total, classNode) => total + classNode.courses.length, 0);

  const updateStructure = (updater: (current: PeriodNode[]) => PeriodNode[]) => {
    setStructure((current) => updater(current));
  };

  const beginAddClass = (periodIndex: number) => {
    setClassDraftPeriodIndex(periodIndex);
    setClassDraftName("");
    setCourseDraftTarget(null);
  };

  const addClass = () => {
    if (classDraftPeriodIndex === null) {
      return;
    }

    const trimmedName = classDraftName.trim();
    if (!trimmedName) {
      return;
    }

    updateStructure((current) =>
      current.map((period, index) => {
        if (index !== classDraftPeriodIndex) {
          return period;
        }

        return {
          ...period,
          classes: [
            ...period.classes,
            {
              id: createId(`period-${index}-class`),
              name: trimmedName,
              courses: [],
            },
          ],
        };
      }),
    );

    setClassDraftName("");
    setClassDraftPeriodIndex(null);
  };

  const beginAddCourse = (periodIndex: number, classIndex: number) => {
    setCourseDraftTarget({ periodIndex, classIndex });
    setCourseDraftName("");
    setClassDraftPeriodIndex(null);
  };

  const addCourse = () => {
    if (!courseDraftTarget) {
      return;
    }

    const trimmedName = courseDraftName.trim();
    if (!trimmedName) {
      return;
    }

    updateStructure((current) =>
      current.map((period, periodIndex) => {
        if (periodIndex !== courseDraftTarget.periodIndex) {
          return period;
        }

        return {
          ...period,
          classes: period.classes.map((classNode, classIndex) => {
            if (classIndex !== courseDraftTarget.classIndex) {
              return classNode;
            }

            return {
              ...classNode,
              courses: [
                ...classNode.courses,
                {
                  id: createId(`period-${periodIndex}-class-${classIndex}-course`),
                  name: trimmedName,
                },
              ],
            };
          }),
        };
      }),
    );

    setCourseDraftName("");
    setCourseDraftTarget(null);
  };

  return (
    <div className="flex-1 overflow-auto bg-gray-50">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Curriculum Structure</h1>
            <p className="text-gray-500 text-sm mt-0.5">
              Design and organize the academic structure, terms, classes, courses, and learning content.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate("settings")}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white hover:bg-gray-50"
            >
              <Settings size={14} />
              Curriculum Settings
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white hover:bg-gray-50">
              <Eye size={14} />
              Preview Curriculum
            </button>
            <button
              onClick={() => beginAddClass(expandedPeriodIndex)}
              className="flex items-center gap-2 px-4 py-2 bg-[#1a4db5] text-white rounded-lg text-sm hover:bg-blue-700"
            >
              <Plus size={14} />
              Add Class
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
            <div className="text-xs text-gray-500 mt-0.5">
              Competency-Based Curriculum (CBC) • {cycleSummary} • Grades 7-9 • Published on 12 Jan 2024
            </div>
          </div>
          <div className="flex items-center gap-6">
            {[
              {
                icon: Calendar,
                value: String(periods.length),
                label: cycleConfig.preset === "2sem"
                  ? "Semesters"
                  : cycleConfig.preset === "custom"
                    ? cycleConfig.customKind === "semester"
                      ? "Semesters"
                      : "Terms"
                    : "Terms",
              },
              { icon: GraduationCap, value: String(activePeriodClasses.length), label: "Classes" },
              { icon: BookMarked, value: String(activePeriodCourseCount), label: "Courses" },
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
                activeTab === tab.label ? "bg-[#1a4db5] text-white" : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
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

              {/* Periods */}
              {periods.map((period, periodIndex) => {
                const periodNode = structure[periodIndex];
                const classCount = periodNode?.classes.length ?? 0;
                const periodCourseCount = periodNode?.classes.reduce((total, classNode) => total + classNode.courses.length, 0) ?? 0;

                return (
                  <div key={period} className="ml-3">
                    <button
                      onClick={() => setExpandedPeriodIndex(expandedPeriodIndex === periodIndex ? -1 : periodIndex)}
                      className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-left transition-colors ${
                        expandedPeriodIndex === periodIndex ? "bg-blue-50" : "hover:bg-gray-50"
                      }`}
                    >
                      {expandedPeriodIndex === periodIndex ? (
                        <ChevronDown size={11} className="text-gray-400" />
                      ) : (
                        <ChevronRight size={11} className="text-gray-400" />
                      )}
                      <div className="w-4 h-4 bg-blue-100 rounded flex items-center justify-center flex-shrink-0">
                        <Calendar size={9} className="text-blue-600" />
                      </div>
                      <span className="text-xs text-gray-700 flex-1">{period}</span>
                      <span className="text-[10px] text-gray-400">
                        {classCount} class{classCount === 1 ? "" : "es"}
                      </span>
                    </button>

                    {expandedPeriodIndex === periodIndex && (
                      <div className="ml-4 mt-1 space-y-1">
                        {periodNode?.classes.map((classNode, classIndex) => {
                          const classKey = `${periodIndex}:${classIndex}`;
                          const isOpen = openClassKey === classKey;

                          return (
                            <div key={classNode.id} className="rounded-lg border border-gray-100 bg-white">
                              <button
                                onClick={() => setOpenClassKey(isOpen ? "" : classKey)}
                                className="w-full flex items-center gap-2 px-2 py-2 text-left hover:bg-gray-50 rounded-lg"
                              >
                                {isOpen ? (
                                  <ChevronDown size={11} className="text-gray-400" />
                                ) : (
                                  <ChevronRight size={11} className="text-gray-400" />
                                )}
                                <div className="w-4 h-4 bg-green-100 rounded flex items-center justify-center flex-shrink-0">
                                  <GraduationCap size={9} className="text-green-600" />
                                </div>
                                <span className="text-xs text-gray-700 flex-1">{classNode.name}</span>
                                <span className="text-[10px] text-gray-400">{classNode.courses.length} courses</span>
                              </button>

                              {isOpen && (
                                <div className="px-2 pb-2">
                                  <div className="flex flex-wrap gap-1 mb-2">
                                    {classNode.courses.length > 0 ? (
                                      classNode.courses.map((course) => (
                                        <span
                                          key={course.id}
                                          className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] rounded-full"
                                        >
                                          {course.name}
                                        </span>
                                      ))
                                    ) : (
                                      <span className="text-[10px] text-gray-400">No courses yet</span>
                                    )}
                                  </div>
                                  <button
                                    onClick={() => beginAddCourse(periodIndex, classIndex)}
                                    className="w-full flex items-center justify-center gap-1 rounded-lg border border-dashed border-blue-200 px-2 py-1.5 text-[11px] text-blue-600 hover:bg-blue-50"
                                  >
                                    <Plus size={10} />
                                    Add Course
                                  </button>
                                </div>
                              )}
                            </div>
                          );
                        })}

                        {classDraftPeriodIndex === periodIndex && (
                          <div className="rounded-lg border border-dashed border-blue-200 bg-blue-50/50 p-2">
                            <label className="mb-1 block text-[10px] font-medium uppercase tracking-wide text-gray-500">
                              New class in {period}
                            </label>
                            <div className="flex gap-2">
                              <input
                                value={classDraftName}
                                onChange={(e) => setClassDraftName(e.target.value)}
                                placeholder="e.g. Grade 10"
                                className="flex-1 rounded-lg border border-gray-300 px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-300"
                              />
                              <button
                                onClick={addClass}
                                className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700"
                              >
                                Add
                              </button>
                            </div>
                            <button
                              onClick={() => setClassDraftPeriodIndex(null)}
                              className="mt-1 text-[10px] text-gray-400 hover:text-gray-600"
                            >
                              Cancel
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    <button
                      onClick={() => beginAddClass(periodIndex)}
                      className="ml-3 mt-2 w-[calc(100%-0.75rem)] flex items-center gap-2 px-3 py-2 border border-dashed border-blue-200 rounded-lg text-blue-600 text-xs hover:bg-blue-50 justify-center"
                    >
                      <Plus size={12} />
                      Add Class
                    </button>
                  </div>
                );
              })}

              <button className="w-full mt-2 flex items-center gap-2 px-3 py-2 border border-dashed border-gray-200 rounded-lg text-gray-500 text-xs hover:bg-gray-50 justify-center">
                <Plus size={12} />
                Add Period
              </button>
            </div>
          </div>

          {/* Center Content */}
          <div className="col-span-2 space-y-4">
            {/* Period Header */}
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Calendar size={18} className="text-blue-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="font-bold text-gray-900">{activePeriod || "Period"}</h2>
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-medium">Active</span>
                    </div>
                    <div className="text-xs text-gray-500">Jan 15 - Apr 15, 2024 (13 weeks)</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-1 px-3 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-600 hover:bg-gray-50">
                    <Edit size={12} />
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      if (activePeriodClasses.length > 0) {
                        beginAddCourse(expandedPeriodIndex, 0);
                        return;
                      }

                      beginAddClass(expandedPeriodIndex);
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs hover:bg-blue-700"
                  >
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
                  { value: String(activePeriodClasses.length), label: "Classes" },
                  { value: String(activePeriodCourseCount), label: "Courses" },
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
                This period contains {activePeriodClasses.length} class
                {activePeriodClasses.length === 1 ? "" : "es"} with {activePeriodCourseCount} courses. Courses are organized by class.
              </div>
            </div>

            {/* Courses by Class */}
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Courses by Class</h3>
                <div className="flex items-center gap-2">
                  <button className="text-xs text-blue-600 hover:underline">Expand All</button>
                  <button
                    onClick={() => beginAddClass(expandedPeriodIndex)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs hover:bg-blue-700"
                  >
                    <Plus size={12} />
                    Add Course
                  </button>
                </div>
              </div>
              <p className="text-xs text-gray-500 mb-4">Manage courses for each class in this period.</p>

              <div className="space-y-3">
                {activePeriodClasses.length > 0 ? (
                  activePeriodClasses.map((classNode, classIndex) => {
                    const classKey = `${expandedPeriodIndex}:${classIndex}`;
                    const isOpen = openClassKey === classKey;

                    return (
                      <div key={classNode.id} className="border border-gray-100 rounded-xl overflow-hidden">
                        <div className="flex items-center justify-between p-3 bg-gray-50 border-b border-gray-100">
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-blue-400"></span>
                            <span className="text-sm font-semibold text-gray-800">{classNode.name}</span>
                            <span className="text-xs text-gray-400">{classNode.courses.length} Courses</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setOpenClassKey(isOpen ? "" : classKey)}
                              className="flex items-center gap-1 px-2 py-1 text-blue-600 text-xs hover:bg-blue-50 rounded"
                            >
                              {isOpen ? <ChevronDown size={11} /> : <ChevronRight size={11} />}
                              {isOpen ? "Hide Courses" : "Show Courses"}
                            </button>
                            <button
                              onClick={() => beginAddCourse(expandedPeriodIndex, classIndex)}
                              className="flex items-center gap-1 px-2 py-1 text-blue-600 text-xs hover:bg-blue-50 rounded"
                            >
                              <Plus size={11} />
                              Add Course
                            </button>
                            <ChevronRight size={14} className="text-gray-300" />
                          </div>
                        </div>

                        {isOpen && (
                          <div className="p-3">
                            <div className="flex flex-wrap gap-2 mb-3">
                              {classNode.courses.length > 0 ? (
                                classNode.courses.map((course) => (
                                  <span
                                    key={course.id}
                                    className="px-2 py-0.5 bg-white border border-gray-200 rounded-full text-xs text-gray-600"
                                  >
                                    {course.name}
                                  </span>
                                ))
                              ) : (
                                <span className="text-xs text-gray-400">No courses added yet.</span>
                              )}
                            </div>

                            {courseDraftTarget?.periodIndex === expandedPeriodIndex &&
                              courseDraftTarget.classIndex === classIndex && (
                                <div className="rounded-lg border border-dashed border-blue-200 bg-blue-50/50 p-2">
                                  <label className="mb-1 block text-[10px] font-medium uppercase tracking-wide text-gray-500">
                                    New course for {classNode.name}
                                  </label>
                                  <div className="flex gap-2">
                                    <input
                                      value={courseDraftName}
                                      onChange={(e) => setCourseDraftName(e.target.value)}
                                      placeholder="e.g. Creative Arts"
                                      className="flex-1 rounded-lg border border-gray-300 px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-300"
                                    />
                                    <button
                                      onClick={addCourse}
                                      className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700"
                                    >
                                      Add
                                    </button>
                                  </div>
                                  <button
                                    onClick={() => setCourseDraftTarget(null)}
                                    className="mt-1 text-[10px] text-gray-400 hover:text-gray-600"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              )}
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-6 text-center">
                    <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                      <GraduationCap size={18} className="text-blue-600" />
                    </div>
                    <p className="text-sm font-medium text-gray-800">No classes in this period yet</p>
                    <p className="mt-1 text-xs text-gray-500">Add a class to start building the course structure.</p>
                    <button
                      onClick={() => beginAddClass(expandedPeriodIndex)}
                      className="mt-3 inline-flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-2 text-xs font-medium text-white hover:bg-blue-700"
                    >
                      <Plus size={12} />
                      Add Class
                    </button>
                  </div>
                )}
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
                    <span className="text-xl font-bold text-gray-900">{activePeriodCourseCount}</span>
                    <span className="text-[10px] text-gray-400">Courses</span>
                  </div>
                </div>
              </div>
              <div className="space-y-1.5">
                {periods.map((period, periodIndex) => {
                  const periodNode = structure[periodIndex];
                  const classCount = periodNode?.classes.length ?? 0;
                  const courseCount = periodNode?.classes.reduce((total, classNode) => total + classNode.courses.length, 0) ?? 0;

                  return (
                    <div key={period} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            periodIndex % 3 === 0 ? "bg-blue-500" : periodIndex % 3 === 1 ? "bg-yellow-500" : "bg-purple-500"
                          }`}
                        ></div>
                        <span className="text-gray-600">{period}</span>
                      </div>
                      <span className="font-semibold text-gray-700">
                        {classCount} class{classCount === 1 ? "" : "es"} / {courseCount} courses
                      </span>
                    </div>
                  );
                })}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                    <span className="text-gray-600">Electives</span>
                  </div>
                  <span className="font-semibold text-gray-700">0</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl border border-gray-100 p-4">
              <h3 className="font-semibold text-gray-800 text-sm mb-3">Quick Actions</h3>
              <div className="space-y-2">
                {[
                  {
                    label: `Add ${cycleConfig.customKind === "semester" || cycleConfig.preset === "2sem" ? "Semester" : "Term"}`,
                    sub: "Define academic periods",
                    icon: Calendar,
                    color: "bg-blue-50 text-blue-600",
                  },
                  { label: "Add Class / Grade", sub: "Create or import classes", icon: GraduationCap, color: "bg-green-50 text-green-600" },
                  { label: "Add Course", sub: "Attach subjects to classes", icon: BookMarked, color: "bg-purple-50 text-purple-600" },
                  { label: "Reorder Structure", sub: "Drag and drop to organize", icon: BarChart3, color: "bg-orange-50 text-orange-600" },
                ].map((a) => (
                  <button
                    key={a.label}
                    className="w-full flex items-center gap-3 p-2.5 rounded-lg border border-gray-100 hover:border-gray-200 hover:bg-gray-50 text-left"
                  >
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
