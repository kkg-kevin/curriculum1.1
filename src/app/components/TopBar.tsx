import { Search, Bell, HelpCircle, ChevronDown } from "lucide-react";

interface Breadcrumb {
  label: string;
  active?: boolean;
}

interface TopBarProps {
  breadcrumbs: Breadcrumb[];
  notificationCount?: number;
}

export function TopBar({ breadcrumbs, notificationCount = 3 }: TopBarProps) {
  return (
    <div className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 flex-shrink-0">
      <nav className="flex items-center gap-1 text-sm">
        {breadcrumbs.map((crumb, i) => (
          <span key={i} className="flex items-center gap-1">
            {i > 0 && <span className="text-gray-400">›</span>}
            <span className={crumb.active ? "text-[#1a4db5] font-medium" : "text-gray-500 hover:text-gray-700 cursor-pointer"}>
              {crumb.label}
            </span>
          </span>
        ))}
      </nav>

      <div className="flex items-center gap-3">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search Digifunzi..."
            className="pl-8 pr-4 py-1.5 text-sm border border-gray-200 rounded-lg bg-gray-50 w-52 focus:outline-none focus:ring-1 focus:ring-blue-300"
          />
        </div>
        <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200">
          <HelpCircle size={16} />
        </button>
        <button className="relative w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200">
          <Bell size={16} />
          {notificationCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-[9px] flex items-center justify-center">
              {notificationCount}
            </span>
          )}
        </button>
        <div className="flex items-center gap-2 cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-white text-xs font-bold">KM</div>
          <div className="hidden md:block">
            <div className="text-xs font-semibold text-gray-800 leading-tight">Ken.</div>
            <div className="text-[10px] text-gray-400 leading-tight">Super Admin</div>
          </div>
          <ChevronDown size={12} className="text-gray-400" />
        </div>
      </div>
    </div>
  );
}
