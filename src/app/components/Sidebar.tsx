import { LayoutDashboard, School, BookOpen, Users, GraduationCap, BookMarked, ClipboardList, BarChart3, Settings, HelpCircle, ExternalLink } from "lucide-react";

type Screen = "management" | "create" | "structure" | "settings" | "deploy" | "version-control" | "library" | "competencies" | "review";

interface SidebarProps {
  activeScreen: Screen;
  onNavigate: (screen: Screen) => void;
}

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", screen: null },
  { icon: School, label: "Schools", screen: null },
  { icon: BookOpen, label: "Curriculum", screen: "management" as Screen },
  { icon: Users, label: "Learners", screen: null },
  { icon: GraduationCap, label: "Teachers", screen: null },
  { icon: BookMarked, label: "Classes", screen: null },
  { icon: ClipboardList, label: "Assessments", screen: null },
  { icon: BarChart3, label: "Reports", screen: null },
  { icon: Settings, label: "Settings", screen: "settings" as Screen },
];

export function Sidebar({ activeScreen, onNavigate }: SidebarProps) {
  const isActive = (screen: Screen | null) => {
    if (!screen) return false;
    if (screen === "management") {
      return ["management", "create", "structure", "deploy", "version-control", "library", "competencies", "review"].includes(activeScreen);
    }
    return activeScreen === screen;
  };

  return (
    <div className="w-[168px] min-h-screen bg-[#0e1e3d] flex flex-col flex-shrink-0">
      <div className="p-4 mb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <span className="text-[#0e1e3d] font-bold text-xs">df</span>
          </div>
          <div>
            <div className="text-white font-bold text-sm leading-tight">digifunzi</div>
            <div className="text-[#8899bb] text-[9px] leading-tight">Future-Ready Learning</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-2">
        {navItems.map((item) => {
          const active = isActive(item.screen);
          return (
            <button
              key={item.label}
              onClick={() => item.screen && onNavigate(item.screen)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mb-0.5 text-left transition-colors ${
                active
                  ? "bg-[#1a4db5] text-white"
                  : "text-[#8899bb] hover:text-white hover:bg-[#162e5c]"
              }`}
            >
              <item.icon size={16} />
              <span className="text-[13px]">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-3 mx-2 mb-4 bg-[#162e5c] rounded-lg">
        <div className="text-white text-xs font-semibold mb-1">Need Help?</div>
        <div className="text-[#8899bb] text-[10px] mb-2">Contact support.</div>
        <button className="flex items-center gap-1 text-[#4a9eff] text-[11px]">
          <HelpCircle size={12} />
          Get Help
          <ExternalLink size={10} />
        </button>
      </div>

      <div className="px-4 pb-4">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-6 h-6 bg-white rounded flex items-center justify-center">
            <span className="text-[#0e1e3d] font-bold text-[8px]">df</span>
          </div>
          <span className="text-white text-xs font-semibold">digifunzi</span>
        </div>
        <div className="text-[#8899bb] text-[10px]">© 2026 Digifunzi.</div>
      </div>
    </div>
  );
}
