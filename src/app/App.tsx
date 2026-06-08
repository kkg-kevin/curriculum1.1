import { useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { TopBar } from "./components/TopBar";
import { CurriculumManagement } from "./components/CurriculumManagement";
import { CreateCurriculum } from "./components/CreateCurriculum";
import { CurriculumStructure } from "./components/CurriculumStructure";
import { CurriculumSettings } from "./components/CurriculumSettings";
import { DeploySupplementary } from "./components/DeploySupplementary";
import { VersionControl } from "./components/VersionControl";

type Screen = "management" | "create" | "structure" | "settings" | "deploy" | "version-control";

const breadcrumbMap: Record<Screen, Array<{ label: string; active?: boolean }>> = {
  management: [
    { label: "Curriculum", active: true },
  ],
  create: [
    { label: "Curriculum" },
    { label: "Create New Curriculum", active: true },
  ],
  structure: [
    { label: "Curriculum" },
    { label: "Curriculum Library" },
    { label: "CBC Junior Secondary v1.1" },
    { label: "Structure", active: true },
  ],
  settings: [
    { label: "Curriculum" },
    { label: "Settings", active: true },
  ],
  deploy: [
    { label: "Curriculum" },
    { label: "Deployments" },
    { label: "Supplementary Course", active: true },
  ],
  "version-control": [
    { label: "Curriculum" },
    { label: "Settings" },
    { label: "Version Control", active: true },
  ],
};

export default function App() {
  const [screen, setScreen] = useState<Screen>("management");

  return (
    <div className="flex h-screen w-full overflow-hidden bg-gray-50 font-sans">
      <Sidebar activeScreen={screen} onNavigate={setScreen} />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <TopBar breadcrumbs={breadcrumbMap[screen]} />

        {/* Quick nav bar */}
        <div className="flex items-center gap-2 px-6 py-2 bg-white border-b border-gray-100 text-xs overflow-x-auto flex-shrink-0">
          {([
            { id: "management", label: "Curriculum Management" },
            { id: "create", label: "Create New Curriculum" },
            { id: "structure", label: "Curriculum Structure" },
            { id: "settings", label: "Curriculum Settings" },
            { id: "deploy", label: "Deploy Supplementary" },
            { id: "version-control", label: "Version Control" },
          ] as { id: Screen; label: string }[]).map((item) => (
            <button
              key={item.id}
              onClick={() => setScreen(item.id)}
              className={`px-3 py-1.5 rounded-full whitespace-nowrap font-medium transition-colors ${
                screen === item.id
                  ? "bg-[#1a4db5] text-white"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {screen === "management" && <CurriculumManagement onNavigate={setScreen} />}
        {screen === "create" && <CreateCurriculum onNavigate={setScreen} />}
        {screen === "structure" && <CurriculumStructure onNavigate={setScreen} />}
        {screen === "settings" && <CurriculumSettings />}
        {screen === "deploy" && <DeploySupplementary onNavigate={setScreen} />}
        {screen === "version-control" && <VersionControl />}
      </div>
    </div>
  );
}
