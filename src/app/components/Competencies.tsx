import { useState } from "react";
import { 
  Target, 
  CheckCircle2, 
  Plus, 
  Search, 
  ChevronDown, 
  ChevronRight, 
  BookOpen, 
  Link,
  ArrowRight,
  Award,
  Info
} from "lucide-react";
import { useCurriculum } from "../lib/curriculumContext";

type Screen = "management" | "create" | "structure" | "settings" | "deploy" | "version-control" | "library" | "competencies" | "review";

interface Props {
  onNavigate: (screen: Screen) => void;
}

interface LearningOutcome {
  id: string;
  code: string;
  title: string;
  description: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  framework: string;
  courses: string[];
  skills: string[];
}

interface CompetencyFramework {
  id: string;
  name: string;
  description: string;
  outcomes: number;
  domains: string[];
}

interface Skill {
  id: string;
  name: string;
  category: "Cognitive" | "Social" | "Emotional" | "Physical";
  description: string;
  outcomes: string[];
}

const competencyFrameworks: CompetencyFramework[] = [
  {
    id: "cbc-framework",
    name: "CBC Competency Framework",
    description: "Official Competency-Based Curriculum framework for Kenya",
    outcomes: 124,
    domains: ["Communication", "Thinking", "Self-Efficacy", "Learning", "Social"]
  }
];

const mockLearningOutcomes: LearningOutcome[] = [
  {
    id: "lo-1",
    code: "ENG.7.1.1",
    title: "Communicate effectively in various contexts",
    description: "Learner demonstrates ability to express ideas clearly in speaking and writing",
    level: "Intermediate",
    framework: "CBC",
    courses: ["English", "Kiswahili"],
    skills: ["Communication", "Critical Thinking"]
  },
  {
    id: "lo-2", 
    code: "MATH.7.2.1",
    title: "Apply mathematical concepts to solve problems",
    description: "Use mathematical reasoning and problem-solving strategies",
    level: "Intermediate",
    framework: "CBC",
    courses: ["Mathematics"],
    skills: ["Logical Thinking", "Problem Solving"]
  },
  {
    id: "lo-3",
    code: "SCI.7.3.1", 
    title: "Demonstrate scientific inquiry skills",
    description: "Plan and conduct investigations using scientific methods",
    level: "Advanced",
    framework: "CBC",
    courses: ["Integrated Science"],
    skills: ["Critical Thinking", "Creativity"]
  }
];

const skillCategories = [
  {
    category: "Cognitive" as const,
    skills: ["Critical Thinking", "Problem Solving", "Logical Thinking", "Creative Thinking"],
    color: "bg-blue-50 text-blue-700 border-blue-200"
  },
  {
    category: "Social" as const, 
    skills: ["Communication", "Collaboration", "Leadership", "Empathy"],
    color: "bg-green-50 text-green-700 border-green-200"
  },
  {
    category: "Emotional" as const,
    skills: ["Self-Awareness", "Emotional Regulation", "Resilience", "Adaptability"], 
    color: "bg-purple-50 text-purple-700 border-purple-200"
  },
  {
    category: "Physical" as const,
    skills: ["Motor Skills", "Health & Wellness", "Coordination", "Fitness"],
    color: "bg-orange-50 text-orange-700 border-orange-200"
  }
];

const steps = ["Basic Information", "Structure", "Classes & Courses", "Competencies", "Settings", "Review"];
export function Competencies({ onNavigate }: Props) {
  const { state, updateCompetencies, goToStep, completeStep } = useCurriculum();
  const [activeTab, setActiveTab] = useState("Frameworks");
  const [selectedFramework, setSelectedFramework] = useState("cbc-framework");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOutcomes, setSelectedOutcomes] = useState<string[]>(["lo-1", "lo-2"]);
  const [expandedOutcome, setExpandedOutcome] = useState<string | null>("lo-1");

  const handleNext = () => {
    if (state.curriculum) {
      // Update competencies in context
      updateCompetencies({
        selectedFramework,
        selectedOutcomes,
        // Add other competency data as needed
      });
      
      // Mark step as completed and go to next
      completeStep(3);
      goToStep(4);
      onNavigate("settings");
    }
  };

  const handleSaveDraft = async () => {
    if (state.curriculum) {
      updateCompetencies({
        selectedFramework,
        selectedOutcomes,
      });
    }
  };

  const filteredOutcomes = mockLearningOutcomes.filter(outcome =>
    outcome.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    outcome.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleOutcomeSelection = (outcomeId: string) => {
    setSelectedOutcomes(prev => 
      prev.includes(outcomeId) 
        ? prev.filter(id => id !== outcomeId)
        : [...prev, outcomeId]
    );
  };

  return (
    <div className="flex-1 overflow-auto bg-gray-50">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Curriculum Competencies</h1>
            <p className="text-gray-500 text-sm mt-0.5">
              Define learning outcomes, competencies, and skills that learners will develop through this curriculum.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => onNavigate("structure")}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white hover:bg-gray-50"
            >
              ← Back to Structure
            </button>
            <button 
              onClick={handleSaveDraft}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white hover:bg-gray-50">
              Save as Draft
            </button>
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-4 py-2 bg-[#1a4db5] text-white rounded-lg text-sm hover:bg-blue-700"
            >
              Next: Settings <ArrowRight size={14} />
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
                    i < 3 ? "bg-green-500 text-white" :
                    i === 3 ? "bg-[#1a4db5] text-white" :
                    "bg-white border-2 border-gray-200 text-gray-400"
                  }`}
                >
                  {i < 3 ? <CheckCircle2 size={16} /> : i + 1}
                </div>
                <span className={`text-xs mt-1 whitespace-nowrap ${
                  i === 3 ? "text-[#1a4db5] font-medium" : 
                  i < 3 ? "text-green-600" : "text-gray-400"
                }`}>
                  {step}
                </span>
              </div>
              {i < steps.length - 1 && <div className="flex-1 h-px bg-gray-200 mx-2 mb-4"></div>}
            </div>
          ))}
        </div>
        {/* Curriculum Info Bar */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <BookOpen size={22} className="text-blue-600" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-gray-900">CBC Junior Secondary v1.1</span>
              <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded-full font-medium">Draft</span>
            </div>
            <div className="text-xs text-gray-500 mt-0.5">
              Competency-Based Curriculum (CBC) • 3 Terms • Grades 7-9 • Step 4 of 6
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
                <Target size={14} className="text-green-600" />
              </div>
              <div>
                <div className="font-bold text-gray-900 text-sm">{selectedOutcomes.length}</div>
                <div className="text-[10px] text-gray-400">Outcomes</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
                <Award size={14} className="text-purple-600" />
              </div>
              <div>
                <div className="font-bold text-gray-900 text-sm">12</div>
                <div className="text-[10px] text-gray-400">Skills</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-white border border-gray-200 rounded-xl p-1">
          {["Frameworks", "Learning Outcomes", "Skills Matrix", "Standards"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex-1 justify-center ${
                activeTab === tab ? "bg-[#1a4db5] text-white" : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              {tab === "Frameworks" && <Target size={14} />}
              {tab === "Learning Outcomes" && <CheckCircle2 size={14} />}
              {tab === "Skills Matrix" && <Award size={14} />}
              {tab === "Standards" && <Link size={14} />}
              {tab}
            </button>
          ))}
        </div>
        {/* Content based on active tab */}
        {activeTab === "Frameworks" && (
          <div className="grid grid-cols-3 gap-6">
            {/* Framework Selection */}
            <div className="col-span-2 bg-white rounded-xl border border-gray-100 p-5">
              <h2 className="font-semibold text-gray-900 mb-1">Competency Framework</h2>
              <p className="text-sm text-gray-500 mb-5">Choose the competency framework that aligns with your curriculum.</p>

              <div className="space-y-4">
                {competencyFrameworks.map((framework) => (
                  <div
                    key={framework.id}
                    onClick={() => setSelectedFramework(framework.id)}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedFramework === framework.id 
                        ? "border-blue-500 bg-blue-50" 
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Target size={18} className="text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{framework.name}</h3>
                          <p className="text-xs text-gray-500">{framework.outcomes} learning outcomes</p>
                        </div>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        selectedFramework === framework.id 
                          ? "border-blue-500 bg-blue-500" 
                          : "border-gray-300"
                      }`}>
                        {selectedFramework === framework.id && <div className="w-2 h-2 bg-white rounded-full"></div>}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{framework.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {framework.domains.map((domain) => (
                        <span key={domain} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          {domain}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
                
                <div className="p-4 border border-dashed border-gray-300 rounded-xl text-center">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <Plus size={18} className="text-gray-400" />
                  </div>
                  <p className="text-sm font-medium text-gray-600">Add Custom Framework</p>
                  <p className="text-xs text-gray-400">Create your own competency framework</p>
                </div>
              </div>
            </div>

            {/* Framework Preview */}
            <div className="space-y-4">
              <div className="bg-white rounded-xl border border-gray-100 p-4">
                <h3 className="font-semibold text-gray-800 text-sm mb-3">Framework Overview</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Total Outcomes</span>
                    <span className="font-semibold text-gray-900">124</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Competency Domains</span>
                    <span className="font-semibold text-gray-900">5</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Grade Levels</span>
                    <span className="font-semibold text-gray-900">7-9</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Info size={14} className="text-blue-600" />
                  <span className="text-sm font-semibold text-blue-800">About CBC Framework</span>
                </div>
                <p className="text-xs text-blue-700">
                  The Competency-Based Curriculum focuses on developing key competencies that prepare learners for the 21st century.
                </p>
              </div>
            </div>
          </div>
        )}
        {activeTab === "Learning Outcomes" && (
          <div className="grid grid-cols-3 gap-6">
            {/* Outcomes List */}
            <div className="col-span-2 space-y-4">
              {/* Search and Filters */}
              <div className="bg-white rounded-xl border border-gray-100 p-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="relative flex-1">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search learning outcomes..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-2 w-full border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                    />
                  </div>
                  <div className="relative">
                    <select className="px-3 py-2 border border-gray-200 rounded-lg text-sm appearance-none pr-8 focus:outline-none">
                      <option>All Levels</option>
                      <option>Beginner</option>
                      <option>Intermediate</option>
                      <option>Advanced</option>
                    </select>
                    <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                
                <div className="text-sm text-gray-600">
                  Showing {filteredOutcomes.length} outcomes • {selectedOutcomes.length} selected
                </div>
              </div>

              {/* Outcomes Cards */}
              <div className="space-y-3">
                {filteredOutcomes.map((outcome) => (
                  <div key={outcome.id} className="bg-white rounded-xl border border-gray-100 p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-3">
                        <button
                          onClick={() => toggleOutcomeSelection(outcome.id)}
                          className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center ${
                            selectedOutcomes.includes(outcome.id)
                              ? "bg-blue-500 border-blue-500" 
                              : "border-gray-300 hover:border-gray-400"
                          }`}
                        >
                          {selectedOutcomes.includes(outcome.id) && (
                            <CheckCircle2 size={12} className="text-white" />
                          )}
                        </button>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-gray-900 text-sm">{outcome.code}</span>
                            <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                              outcome.level === "Advanced" ? "bg-red-100 text-red-700" :
                              outcome.level === "Intermediate" ? "bg-yellow-100 text-yellow-700" :
                              "bg-green-100 text-green-700"
                            }`}>
                              {outcome.level}
                            </span>
                          </div>
                          <h3 className="font-medium text-gray-800 mb-1">{outcome.title}</h3>
                          <p className="text-sm text-gray-600">{outcome.description}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setExpandedOutcome(
                          expandedOutcome === outcome.id ? null : outcome.id
                        )}
                        className="p-1 text-gray-400 hover:text-gray-600"
                      >
                        {expandedOutcome === outcome.id ? (
                          <ChevronDown size={16} />
                        ) : (
                          <ChevronRight size={16} />
                        )}
                      </button>
                    </div>

                    {expandedOutcome === outcome.id && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-xs font-semibold text-gray-700 mb-2">Mapped Courses</h4>
                            <div className="flex flex-wrap gap-1">
                              {outcome.courses.map((course) => (
                                <span key={course} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">
                                  {course}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h4 className="text-xs font-semibold text-gray-700 mb-2">Related Skills</h4>
                            <div className="flex flex-wrap gap-1">
                              {outcome.skills.map((skill) => (
                                <span key={skill} className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded-full">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Selected Outcomes Summary */}
            <div className="space-y-4">
              <div className="bg-white rounded-xl border border-gray-100 p-4">
                <h3 className="font-semibold text-gray-800 text-sm mb-3">Selected Outcomes</h3>
                <div className="space-y-2">
                  {selectedOutcomes.slice(0, 3).map((outcomeId) => {
                    const outcome = mockLearningOutcomes.find(o => o.id === outcomeId);
                    return outcome ? (
                      <div key={outcome.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                        <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-medium text-gray-800 truncate">{outcome.code}</div>
                          <div className="text-[10px] text-gray-500 truncate">{outcome.title}</div>
                        </div>
                      </div>
                    ) : null;
                  })}
                  {selectedOutcomes.length > 3 && (
                    <div className="text-xs text-gray-500 text-center py-1">
                      +{selectedOutcomes.length - 3} more outcomes
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 size={14} className="text-green-600" />
                  <span className="text-sm font-semibold text-green-800">Selection Valid</span>
                </div>
                <p className="text-xs text-green-700">
                  You have selected {selectedOutcomes.length} learning outcomes that cover all essential competencies.
                </p>
              </div>
            </div>
          </div>
        )}
        {activeTab === "Skills Matrix" && (
          <div className="grid grid-cols-4 gap-6">
            {skillCategories.map((category) => (
              <div key={category.category} className="bg-white rounded-xl border border-gray-100 p-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className={`w-3 h-3 rounded-full ${category.color.split(' ')[0]}`}></div>
                  <h3 className="font-semibold text-gray-900 text-sm">{category.category} Skills</h3>
                </div>
                
                <div className="space-y-2">
                  {category.skills.map((skill) => (
                    <label key={skill} className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        defaultChecked={true}
                        className="w-3 h-3 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-xs text-gray-700">{skill}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "Standards" && (
          <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Link size={24} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Standards Alignment</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              Map your curriculum to national and international standards for compliance and quality assurance.
            </p>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
              Configure Standards
            </button>
          </div>
        )}

        {/* Progress Summary */}
        <div className="mt-8 bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Competencies Progress</h3>
              <p className="text-sm text-gray-500">
                {selectedOutcomes.length} learning outcomes selected • 12 skills mapped • Ready for next step
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {[1,2,3].map((i) => (
                  <div key={i} className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center border-2 border-white">
                    <span className="text-xs font-medium text-blue-600">{i}</span>
                  </div>
                ))}
              </div>
              <span className="text-sm text-gray-500">3 domains covered</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}