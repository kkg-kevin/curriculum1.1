import { useState } from "react";
import { Save, RotateCcw, ChevronDown, CheckCircle2, X, Info, ExternalLink, ArrowRight } from "lucide-react";

type Screen = "management" | "create" | "structure" | "settings" | "deploy" | "version-control" | "library";

interface Props {
  onNavigate: (screen: Screen) => void;
}

const settingsTabs = ["General", "Governance", "Version Control", "Supplement Rules", "Deployment", "Integrations", "Notifications", "Audit"];

function Toggle({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${
        enabled ? "bg-blue-600" : "bg-gray-200"
      }`}
    >
      <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition duration-200 ${enabled ? "translate-x-5" : "translate-x-0"}`} />
    </button>
  );
}

export function CurriculumSettings({ onNavigate }: Props) {
  const [activeTab, setActiveTab] = useState("General");
  const [toggles, setToggles] = useState({
    competencies: true,
    autoArchive: true,
    requireOutcomeMapping: true,
    allowCourseReuse: true,
    auditLogging: true,
    dataRetention: true,
    exportOptions: true,
    complianceMode: true,
    enableSupplements: true,
    requireApproval: true,
  });

  const toggle = (key: keyof typeof toggles) => {
    setToggles(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="flex-1 overflow-auto bg-gray-50">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Curriculum Settings</h1>
            <p className="text-gray-500 text-sm mt-0.5">Configure global preferences, governance, and rules that keep your curriculum consistent and compliant.</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white hover:bg-gray-50">
              <RotateCcw size={14} />
              Reset
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700">
              <Save size={14} />
              Save Changes
            </button>
            <button 
              onClick={() => onNavigate("library")}
              className="flex items-center gap-2 px-4 py-2 bg-[#1a4db5] text-white rounded-lg text-sm hover:bg-blue-700"
            >
              Next: Review <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-white border border-gray-200 rounded-xl p-1 flex-wrap">
          {settingsTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                activeTab === tab
                  ? "bg-[#1a4db5] text-white"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-5">
            {/* General Preferences */}
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h2 className="font-semibold text-gray-900 mb-0.5">General Preferences</h2>
              <p className="text-xs text-gray-500 mb-4">Configure how curriculum operates across the platform.</p>

              <div className="space-y-4">
                {[
                  {
                    icon: "📅", label: "Default Academic Cycle",
                    sub: "Select the default cycle model for new curricula.",
                    control: (
                      <div className="relative w-56">
                        <select className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs appearance-none pr-7 focus:outline-none">
                          <option>3 Terms (Term 1, Term 2, Term 3)</option>
                        </select>
                        <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                      </div>
                    )
                  },
                  {
                    icon: "📆", label: "Default Academic Week",
                    sub: "Define the starting day of the academic week.",
                    control: (
                      <div className="relative w-32">
                        <select className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs appearance-none pr-7 focus:outline-none">
                          <option>Monday</option>
                        </select>
                        <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                      </div>
                    )
                  },
                  {
                    icon: "📈", label: "Progress Calculation",
                    sub: "Choose how learner progress is calculated.",
                    control: (
                      <div className="relative w-40">
                        <select className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs appearance-none pr-7 focus:outline-none">
                          <option>Competency-Based</option>
                        </select>
                        <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                      </div>
                    )
                  },
                  {
                    icon: "🎯", label: "Enable Competencies",
                    sub: "Track learning using competencies and outcomes.",
                    control: <Toggle enabled={toggles.competencies} onToggle={() => toggle("competencies")} />
                  },
                  {
                    icon: "📦", label: "Auto-Archive Inactive Versions",
                    sub: "Automatically archive curriculum versions after",
                    control: (
                      <div className="flex items-center gap-2">
                        <input type="number" defaultValue={24} className="w-14 px-2 py-1.5 border border-gray-200 rounded-lg text-xs text-center focus:outline-none" />
                        <span className="text-xs text-gray-500">months</span>
                        <Toggle enabled={toggles.autoArchive} onToggle={() => toggle("autoArchive")} />
                      </div>
                    )
                  },
                  {
                    icon: "🌐", label: "Language Preference",
                    sub: "Default language for curriculum content.",
                    control: (
                      <div className="relative w-28">
                        <select className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs appearance-none pr-7 focus:outline-none">
                          <option>English</option>
                        </select>
                        <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                      </div>
                    )
                  },
                ].map((s) => (
                  <div key={s.label} className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0 text-base">
                        {s.icon}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-800">{s.label}</div>
                        <div className="text-xs text-gray-400">{s.sub}</div>
                      </div>
                    </div>
                    {s.control}
                  </div>
                ))}
              </div>
            </div>

            {/* Content & Standards */}
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h2 className="font-semibold text-gray-900 mb-0.5">Content & Standards</h2>
              <p className="text-xs text-gray-500 mb-4">Manage curriculum standards and content behavior.</p>

              <div className="space-y-4">
                {[
                  {
                    icon: "🏛️", label: "Outcome Framework",
                    sub: "Select the framework for learning outcomes.",
                    control: (
                      <div className="flex items-center gap-2">
                        <div className="relative">
                          <select className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs appearance-none pr-7 focus:outline-none">
                            <option>Digifunzi Competency Framework</option>
                          </select>
                          <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>
                        <Info size={14} className="text-gray-400" />
                      </div>
                    )
                  },
                  {
                    icon: "🔗", label: "Require Outcome Mapping",
                    sub: "Ensure every course maps to at least one outcome.",
                    control: <Toggle enabled={toggles.requireOutcomeMapping} onToggle={() => toggle("requireOutcomeMapping")} />
                  },
                  {
                    icon: "📋", label: "Minimum Assessments per Course",
                    sub: "Set the minimum number of assessments required.",
                    control: (
                      <div className="flex items-center">
                        <div className="flex border border-gray-200 rounded-lg overflow-hidden">
                          <input type="number" defaultValue={2} className="w-12 px-2 py-1.5 text-xs text-center focus:outline-none" />
                          <div className="flex flex-col border-l border-gray-200">
                            <button className="px-1 py-0.5 hover:bg-gray-50 text-gray-400 text-[10px] leading-none">▲</button>
                            <button className="px-1 py-0.5 hover:bg-gray-50 text-gray-400 text-[10px] leading-none">▼</button>
                          </div>
                        </div>
                      </div>
                    )
                  },
                  {
                    icon: "♻️", label: "Allow Course Reuse",
                    sub: "Allow courses to be reused across terms or classes.",
                    control: <Toggle enabled={toggles.allowCourseReuse} onToggle={() => toggle("allowCourseReuse")} />
                  },
                ].map((s) => (
                  <div key={s.label} className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0 text-base">
                        {s.icon}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-800">{s.label}</div>
                        <div className="text-xs text-gray-400">{s.sub}</div>
                      </div>
                    </div>
                    {s.control}
                  </div>
                ))}
              </div>
            </div>

            {/* Data & Compliance */}
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h2 className="font-semibold text-gray-900 mb-0.5">Data & Compliance</h2>
              <p className="text-xs text-gray-500 mb-4">Ensure data integrity and auditability.</p>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: "🔍", label: "Audit Logging", sub: "Track all curriculum changes.", key: "auditLogging", tag: "Enabled" },
                  { icon: "💾", label: "Data Retention", sub: "Keep curriculum data for", key: "dataRetention", select: "7 years" },
                  { icon: "📤", label: "Export Options", sub: "Allow curriculum exports.", key: "exportOptions", tag: "Enabled" },
                  { icon: "🛡️", label: "Compliance Mode", sub: "Enforce strict governance rule.", key: "complianceMode", tag: "Enabled" },
                ].map((s) => (
                  <div key={s.label} className="flex items-center gap-3 p-3 border border-gray-100 rounded-xl">
                    <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0 text-base">
                      {s.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-gray-800">{s.label}</div>
                      <div className="text-[10px] text-gray-400 truncate">{s.sub}</div>
                    </div>
                    {s.tag ? (
                      <div className="flex items-center gap-1.5">
                        <Toggle enabled={toggles[s.key as keyof typeof toggles]} onToggle={() => toggle(s.key as keyof typeof toggles)} />
                        <span className="text-[10px] text-gray-500">→</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1">
                        <Toggle enabled={toggles[s.key as keyof typeof toggles]} onToggle={() => toggle(s.key as keyof typeof toggles)} />
                        <span className="text-xs text-gray-500 whitespace-nowrap">{s.select}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-5">
            {/* Governance & Permissions */}
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h2 className="font-semibold text-gray-900 mb-0.5">Governance & Permissions</h2>
              <p className="text-xs text-gray-500 mb-4">Control who can create, edit, and approve curriculum.</p>

              <table className="w-full text-xs">
                <thead>
                  <tr className="text-gray-400 uppercase text-[10px]">
                    <th className="text-left pb-2 font-medium">Role</th>
                    <th className="text-center pb-2 font-medium">Create</th>
                    <th className="text-center pb-2 font-medium">Edit</th>
                    <th className="text-center pb-2 font-medium">Publish</th>
                    <th className="text-center pb-2 font-medium">Approve</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { role: "Super Admin", create: true, edit: true, publish: true, approve: true },
                    { role: "Curriculum Admin", create: true, edit: true, publish: true, approve: false },
                    { role: "Deployment Admin", create: false, edit: true, publish: true, approve: false },
                    { role: "School Admin", create: false, edit: false, publish: false, approve: true },
                    { role: "Teacher", create: false, edit: false, publish: false, approve: false },
                  ].map((r) => (
                    <tr key={r.role} className="border-t border-gray-50">
                      <td className="py-2.5 text-gray-700 font-medium">{r.role}</td>
                      {[r.create, r.edit, r.publish, r.approve].map((val, i) => (
                        <td key={i} className="py-2.5 text-center">
                          {val ? (
                            <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                              <CheckCircle2 size={12} className="text-green-600" />
                            </div>
                          ) : (
                            <div className="w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                              <X size={10} className="text-gray-300" />
                            </div>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="mt-3 p-3 bg-blue-50 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Info size={13} className="text-blue-500" />
                  <span className="text-xs text-blue-700">Permission changes apply to all users with the selected role.</span>
                </div>
                <button className="text-xs text-blue-700 font-medium flex items-center gap-1 hover:underline">
                  Manage Roles <ExternalLink size={11} />
                </button>
              </div>
            </div>

            {/* Supplement Settings */}
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h2 className="font-semibold text-gray-900 mb-0.5">Supplement Settings</h2>
              <p className="text-xs text-gray-500 mb-4">Control how supplements and overrides work.</p>

              <div className="space-y-4">
                {[
                  {
                    icon: "🧩", label: "Enable Supplements",
                    sub: "Allow schools to request and use supplements.",
                    key: "enableSupplements" as const,
                  },
                  {
                    icon: "✅", label: "Require Approval",
                    sub: "All supplements must be approved before activation.",
                    key: "requireApproval" as const,
                  },
                ].map((s) => (
                  <div key={s.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0 text-base">
                        {s.icon}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-800">{s.label}</div>
                        <div className="text-xs text-gray-400">{s.sub}</div>
                      </div>
                    </div>
                    <Toggle enabled={toggles[s.key]} onToggle={() => toggle(s.key)} />
                  </div>
                ))}

                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0 text-base">📋</div>
                    <div>
                      <div className="text-sm font-medium text-gray-800">Allowed Supplement Types</div>
                      <div className="text-xs text-gray-400">Select which types of supplements are allowed.</div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 ml-11">
                    {["Additive", "Substitutive", "Pacing", "Cohort-Specific"].map(type => (
                      <span key={type} className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full border border-blue-200">
                        {type}
                        <button className="text-blue-400 hover:text-blue-600"><X size={10} /></button>
                      </span>
                    ))}
                    <button className="px-2 py-1 border border-dashed border-gray-300 text-gray-400 text-xs rounded-full hover:border-gray-400">
                      <ChevronDown size={12} />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0 text-base">⏱️</div>
                    <div>
                      <div className="text-sm font-medium text-gray-800">Default Expiry (days)</div>
                      <div className="text-xs text-gray-400">Supplements expire after the set number of days.</div>
                    </div>
                  </div>
                  <input type="number" defaultValue={180} className="w-16 px-2 py-1.5 border border-gray-200 rounded-lg text-xs text-center focus:outline-none" />
                </div>
              </div>

              <div className="mt-4 p-3 bg-green-50 rounded-lg flex items-center gap-2">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 size={12} className="text-green-600" />
                </div>
                <div>
                  <span className="text-xs text-green-800">Your supplement policies ensure quality and consistency. </span>
                  <button className="text-xs text-green-700 underline">Learn more</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
