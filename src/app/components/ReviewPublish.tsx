import { useState } from "react";
import { 
  CheckCircle2, 
  AlertTriangle, 
  Eye, 
  Save, 
  Rocket, 
  Download, 
  Share, 
  BookOpen, 
  Calendar, 
  Users, 
  Target, 
  Settings as SettingsIcon, 
  ArrowRight, 
  ChevronRight, 
  Info, 
  Clock, 
  Award,
  FileText,
  GitBranch
} from "lucide-react";

type Screen = "management" | "create" | "structure" | "settings" | "deploy" | "version-control" | "library";

interface Props {
  onNavigate: (screen: Screen) => void;
}

interface ValidationItem {
  section: string;
  status: "valid" | "warning" | "error";
  message: string;
  action?: string;
}

const validationChecks: ValidationItem[] = [
  {
    section: "Basic Information",
    status: "valid",
    message: "All required fields completed",
  },
  {
    section: "Structure", 
    status: "valid",
    message: "3 terms, 3 classes, 9 courses defined",
  },
  {
    section: "Competencies",
    status: "warning", 
    message: "2 learning outcomes selected (minimum 3 recommended)",
    action: "Add more outcomes"
  },
  {
    section: "Settings",
    status: "valid",
    message: "Governance and supplement rules configured",
  }
];

const curriculumSummary = {
  name: "CBC Junior Secondary",
  version: "v1.1", 
  code: "CBC-JS-2024",
  framework: "CBC",
  educationLevel: "Junior Secondary",
  grades: "7-9",
  terms: 3,
  classes: 3,
  courses: 9,
  outcomes: 2,
  skills: 12,
  creator: "Ministry of Education",
  createdDate: new Date().toLocaleDateString(),
};

const steps = ["Basic Information", "Structure", "Classes & Courses", "Competencies", "Settings", "Review"];
export function ReviewPublish({ onNavigate }: Props) {
  const [publishOption, setPublishOption] = useState<"draft" | "review" | "publish">("draft");
  const [isPublishing, setIsPublishing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const handlePublish = async () => {
    setIsPublishing(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Navigate to library after successful publish
    onNavigate("library");
    setIsPublishing(false);
  };

  const getValidationSummary = () => {
    const errors = validationChecks.filter(item => item.status === "error").length;
    const warnings = validationChecks.filter(item => item.status === "warning").length;
    const valid = validationChecks.filter(item => item.status === "valid").length;
    
    return { errors, warnings, valid, total: validationChecks.length };
  };

  const { errors, warnings, valid, total } = getValidationSummary();
  const canPublish = errors === 0;

  return (
    <div className="flex-1 overflow-auto bg-gray-50">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Review & Publish Curriculum</h1>
            <p className="text-gray-500 text-sm mt-0.5">
              Review your curriculum, validate completeness, and choose how to publish it.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => onNavigate("settings")}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white hover:bg-gray-50"
            >
              ← Back to Settings
            </button>
            <button 
              onClick={() => setShowPreview(true)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white hover:bg-gray-50"
            >
              <Eye size={14} />
              Preview
            </button>
            <button
              onClick={handlePublish}
              disabled={!canPublish || isPublishing}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${
                canPublish && !isPublishing
                  ? "bg-green-600 text-white hover:bg-green-700"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              {isPublishing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Publishing...
                </>
              ) : (
                <>
                  <Rocket size={14} />
                  Publish Curriculum
                </>
              )}
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
                    i < 5 ? "bg-green-500 text-white" :
                    i === 5 ? "bg-[#1a4db5] text-white" :
                    "bg-white border-2 border-gray-200 text-gray-400"
                  }`}
                >
                  {i < 5 ? <CheckCircle2 size={16} /> : i + 1}
                </div>
                <span className={`text-xs mt-1 whitespace-nowrap ${
                  i === 5 ? "text-[#1a4db5] font-medium" : 
                  i < 5 ? "text-green-600" : "text-gray-400"
                }`}>
                  {step}
                </span>
              </div>
              {i < steps.length - 1 && <div className="flex-1 h-px bg-gray-200 mx-2 mb-4"></div>}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-6">
          {/* Left Column - Curriculum Summary */}
          <div className="col-span-2 space-y-6">
            {/* Curriculum Overview */}
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
                  <BookOpen size={24} className="text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{curriculumSummary.name}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm text-gray-500">{curriculumSummary.code} • {curriculumSummary.version}</span>
                    <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded-full font-medium">
                      Draft
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{curriculumSummary.framework} • {curriculumSummary.educationLevel}</p>
                </div>
              </div>

              {/* Summary Stats */}
              <div className="grid grid-cols-4 gap-4 mb-6">
                {[
                  { icon: Calendar, label: "Terms", value: curriculumSummary.terms, color: "bg-blue-50 text-blue-600" },
                  { icon: Users, label: "Classes", value: curriculumSummary.classes, color: "bg-green-50 text-green-600" },
                  { icon: BookOpen, label: "Courses", value: curriculumSummary.courses, color: "bg-purple-50 text-purple-600" },
                  { icon: Target, label: "Outcomes", value: curriculumSummary.outcomes, color: "bg-orange-50 text-orange-600" },
                ].map((stat) => (
                  <div key={stat.label} className="text-center p-4 bg-gray-50 rounded-xl">
                    <div className={`w-10 h-10 ${stat.color.split(' ')[0]} rounded-lg flex items-center justify-center mx-auto mb-2`}>
                      <stat.icon size={18} className={stat.color.split(' ')[1]} />
                    </div>
                    <div className="text-xl font-bold text-gray-900">{stat.value}</div>
                    <div className="text-xs text-gray-500">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Structure Preview */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Curriculum Structure</h3>
                <div className="space-y-3">
                  {["Term 1", "Term 2", "Term 3"].map((term, index) => (
                    <div key={term} className="p-4 border border-gray-200 rounded-xl">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span className="font-medium text-gray-900">{term}</span>
                        </div>
                        <span className="text-xs text-gray-500">3 classes • 3 courses each</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {["Grade 7", "Grade 8", "Grade 9"].map((grade) => (
                          <div key={grade} className="p-2 bg-gray-50 rounded-lg text-center">
                            <div className="text-xs font-medium text-gray-700">{grade}</div>
                            <div className="text-[10px] text-gray-500">3 courses</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Validation Results */}
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Validation Results</h3>
              
              {/* Validation Summary */}
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl mb-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-green-600" />
                  <span className="text-sm font-medium text-green-800">{valid} Valid</span>
                </div>
                {warnings > 0 && (
                  <div className="flex items-center gap-2">
                    <AlertTriangle size={16} className="text-yellow-600" />
                    <span className="text-sm font-medium text-yellow-800">{warnings} Warnings</span>
                  </div>
                )}
                {errors > 0 && (
                  <div className="flex items-center gap-2">
                    <AlertTriangle size={16} className="text-red-600" />
                    <span className="text-sm font-medium text-red-800">{errors} Errors</span>
                  </div>
                )}
                <div className="ml-auto text-sm text-gray-600">{valid}/{total} sections validated</div>
              </div>

              {/* Validation Details */}
              <div className="space-y-3">
                {validationChecks.map((check, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      {check.status === "valid" && <CheckCircle2 size={16} className="text-green-600" />}
                      {check.status === "warning" && <AlertTriangle size={16} className="text-yellow-600" />}
                      {check.status === "error" && <AlertTriangle size={16} className="text-red-600" />}
                      <div>
                        <div className="font-medium text-gray-900 text-sm">{check.section}</div>
                        <div className="text-xs text-gray-600">{check.message}</div>
                      </div>
                    </div>
                    {check.action && (
                      <button className="text-sm text-blue-600 hover:underline">
                        {check.action}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Right Column - Publishing Options */}
          <div className="space-y-6">
            {/* Publishing Options */}
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h3 className="font-semibold text-gray-900 mb-4">Publishing Options</h3>
              
              <div className="space-y-3">
                {[
                  {
                    id: "draft",
                    title: "Save as Draft",
                    description: "Keep working on this curriculum later",
                    icon: Save,
                    color: "border-gray-200 bg-gray-50",
                    available: true
                  },
                  {
                    id: "review", 
                    title: "Submit for Review",
                    description: "Send to administrators for approval",
                    icon: Clock,
                    color: "border-yellow-200 bg-yellow-50",
                    available: canPublish
                  },
                  {
                    id: "publish",
                    title: "Publish Immediately", 
                    description: "Make available for deployment",
                    icon: Rocket,
                    color: "border-green-200 bg-green-50",
                    available: canPublish
                  }
                ].map((option) => (
                  <label
                    key={option.id}
                    className={`flex items-start gap-3 p-3 rounded-xl border-2 cursor-pointer transition-colors ${
                      publishOption === option.id 
                        ? "border-blue-500 bg-blue-50" 
                        : option.available 
                          ? `${option.color} hover:border-gray-300` 
                          : "border-gray-200 bg-gray-100 cursor-not-allowed opacity-60"
                    }`}
                  >
                    <input
                      type="radio"
                      name="publishOption"
                      value={option.id}
                      checked={publishOption === option.id}
                      onChange={(e) => setPublishOption(e.target.value as typeof publishOption)}
                      disabled={!option.available}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <option.icon size={14} className="text-gray-600" />
                        <span className="font-medium text-gray-900 text-sm">{option.title}</span>
                      </div>
                      <p className="text-xs text-gray-600">{option.description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Version Control */}
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h3 className="font-semibold text-gray-900 mb-4">Version Control</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <GitBranch size={14} className="text-gray-600" />
                    <span className="text-sm text-gray-700">Version</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">v1.1</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock size={14} className="text-gray-600" />
                    <span className="text-sm text-gray-700">Created</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{curriculumSummary.createdDate}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users size={14} className="text-gray-600" />
                    <span className="text-sm text-gray-700">Creator</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{curriculumSummary.creator}</span>
                </div>
              </div>
            </div>

            {/* Export Options */}
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h3 className="font-semibold text-gray-900 mb-4">Export Options</h3>
              
              <div className="space-y-2">
                {[
                  { icon: Download, label: "Export as PDF", description: "Complete curriculum document" },
                  { icon: FileText, label: "Export as Word", description: "Editable document format" },
                  { icon: Share, label: "Generate Share Link", description: "Share with stakeholders" }
                ].map((exportOption) => (
                  <button 
                    key={exportOption.label}
                    className="w-full flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 text-left"
                  >
                    <exportOption.icon size={16} className="text-gray-600" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">{exportOption.label}</div>
                      <div className="text-xs text-gray-500">{exportOption.description}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Status Card */}
            <div className={`rounded-xl p-4 border ${
              canPublish 
                ? "bg-green-50 border-green-200" 
                : "bg-yellow-50 border-yellow-200"
            }`}>
              <div className="flex items-center gap-2 mb-2">
                {canPublish ? (
                  <CheckCircle2 size={16} className="text-green-600" />
                ) : (
                  <AlertTriangle size={16} className="text-yellow-600" />
                )}
                <span className={`text-sm font-semibold ${
                  canPublish ? "text-green-800" : "text-yellow-800"
                }`}>
                  {canPublish ? "Ready to Publish" : "Action Required"}
                </span>
              </div>
              <p className={`text-xs ${canPublish ? "text-green-700" : "text-yellow-700"}`}>
                {canPublish 
                  ? "Your curriculum meets all requirements and is ready for publishing."
                  : "Please address the validation warnings before publishing."
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 z-50 bg-black/50 p-4">
          <div className="mx-auto flex h-full w-full max-w-6xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Curriculum Preview</h2>
              <button
                onClick={() => setShowPreview(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
              >
                Close Preview
              </button>
            </div>
            
            <div className="flex-1 overflow-auto p-6">
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{curriculumSummary.name}</h1>
                  <p className="text-lg text-gray-600">{curriculumSummary.framework} Framework • Grades {curriculumSummary.grades}</p>
                  <div className="flex justify-center gap-4 mt-4">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                      {curriculumSummary.terms} Terms
                    </span>
                    <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                      {curriculumSummary.courses} Courses
                    </span>
                    <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">
                      {curriculumSummary.outcomes} Outcomes
                    </span>
                  </div>
                </div>
                
                <div className="prose max-w-none">
                  <h2>Curriculum Overview</h2>
                  <p>This curriculum is designed to provide comprehensive education for junior secondary learners following the Competency-Based Curriculum framework.</p>
                  
                  <h2>Academic Structure</h2>
                  <p>The curriculum is organized into {curriculumSummary.terms} academic terms, with {curriculumSummary.classes} grade levels and {curriculumSummary.courses} total courses.</p>
                  
                  <h2>Learning Outcomes</h2>
                  <p>Learners will develop {curriculumSummary.outcomes} key learning outcomes aligned with national competency standards.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}