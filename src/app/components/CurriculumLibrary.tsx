import { useState, useEffect } from "react";
import { 
  BookOpen, 
  Search, 
  ChevronDown, 
  Filter, 
  Eye, 
  Edit, 
  Copy, 
  MoreHorizontal, 
  Calendar, 
  Users, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Plus,
  ArrowRight,
  School,
  TrendingUp
} from "lucide-react";
import { curriculumService } from "../lib/curriculumService";
import { LibraryEntry, Framework, CurriculumStatus } from "../lib/curriculumTypes";

type Screen = "management" | "create" | "structure" | "settings" | "deploy" | "version-control" | "library" | "competencies" | "review";

interface Props {
  onNavigate: (screen: Screen) => void;
}

const statusColors = {
  "published": "bg-green-100 text-green-700",
  "draft": "bg-blue-100 text-blue-700",
  "review": "bg-yellow-100 text-yellow-700",
  "archived": "bg-gray-100 text-gray-700"
};

const statusIcons = {
  "published": CheckCircle2,
  "draft": Edit,
  "review": Clock,
  "archived": AlertCircle
};

const frameworkColors = {
  "CBC": "bg-blue-50 text-blue-700 border-blue-200",
  "British": "bg-purple-50 text-purple-700 border-purple-200",
  "IGCSE": "bg-orange-50 text-orange-700 border-orange-200",
  "American": "bg-red-50 text-red-700 border-red-200",
  "IB": "bg-green-50 text-green-700 border-green-200"
};

export function CurriculumLibrary({ onNavigate }: Props) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFramework, setSelectedFramework] = useState<string>("All Frameworks");
  const [selectedStatus, setSelectedStatus] = useState<string>("All Status");
  const [sortBy, setSortBy] = useState("lastModified");
  const [curriculums, setCurriculums] = useState<LibraryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load curriculums on component mount
  useEffect(() => {
    loadCurriculums();
  }, []);

  const loadCurriculums = async () => {
    setIsLoading(true);
    try {
      const libraryCurriculums = await curriculumService.getLibraryCurriculums();
      setCurriculums(libraryCurriculums);
    } catch (error) {
      console.error('Failed to load curriculums:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredCurriculums = curriculums.filter(curriculum => {
    const matchesSearch = curriculum.basicInfo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         curriculum.basicInfo.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFramework = selectedFramework === "All Frameworks" || curriculum.basicInfo.framework === selectedFramework;
    const matchesStatus = selectedStatus === "All Status" || curriculum.status === selectedStatus;
    
    return matchesSearch && matchesFramework && matchesStatus;
  });

  const sortedCurriculums = [...filteredCurriculums].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.basicInfo.name.localeCompare(b.basicInfo.name);
      case "lastModified":
        return new Date(b.modifiedAt).getTime() - new Date(a.modifiedAt).getTime();
      case "deployments":
        return b.deployments - a.deployments;
      case "learners":
        return b.learners - a.learners;
      default:
        return 0;
    }
  });

  return (
    <div className="flex-1 overflow-auto bg-gray-50">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Curriculum Library</h1>
            <p className="text-gray-500 text-sm mt-0.5">Browse, manage, and deploy all curriculum versions across your organization</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => onNavigate("management")}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white hover:bg-gray-50"
            >
              Back to Dashboard
            </button>
            <button
              onClick={() => onNavigate("create")}
              className="flex items-center gap-2 px-4 py-2 bg-[#1a4db5] text-white rounded-lg text-sm hover:bg-blue-700"
            >
              <Plus size={15} />
              New Curriculum
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <BookOpen size={18} className="text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{curriculums.length}</div>
                <div className="text-xs text-gray-500">Total Curriculums</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                <CheckCircle2 size={18} className="text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{curriculums.filter(c => c.status === "published").length}</div>
                <div className="text-xs text-gray-500">Published</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
                <School size={18} className="text-orange-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{curriculums.reduce((sum, c) => sum + c.deployments, 0)}</div>
                <div className="text-xs text-gray-500">Active Deployments</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center">
                <Users size={18} className="text-indigo-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{curriculums.reduce((sum, c) => sum + c.learners, 0).toLocaleString()}</div>
                <div className="text-xs text-gray-500">Total Learners</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="bg-white rounded-xl border border-gray-100 p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search curriculums..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 w-64"
                />
              </div>
              
              {/* Framework Filter */}
              <div className="relative">
                <select
                  value={selectedFramework}
                  onChange={(e) => setSelectedFramework(e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-lg text-sm appearance-none pr-8 focus:outline-none focus:ring-2 focus:ring-blue-300 min-w-40"
                >
                  <option>All Frameworks</option>
                  <option>CBC</option>
                  <option>British</option>
                  <option>IGCSE</option>
                  <option>American</option>
                  <option>IB</option>
                </select>
                <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>

              {/* Status Filter */}
              <div className="relative">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-lg text-sm appearance-none pr-8 focus:outline-none focus:ring-2 focus:ring-blue-300 min-w-36"
                >
                  <option>All Status</option>
                  <option>Published</option>
                  <option>Draft</option>
                  <option>Under Review</option>
                  <option>Archived</option>
                </select>
                <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Sort */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-lg text-sm appearance-none pr-8 focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                  <option value="lastModified">Last Modified</option>
                  <option value="name">Name</option>
                  <option value="deployments">Deployments</option>
                  <option value="learners">Learners</option>
                </select>
                <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>

              {/* View Toggle */}
              <div className="flex border border-gray-200 rounded-lg">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`px-3 py-2 text-sm ${viewMode === "grid" ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50"}`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`px-3 py-2 text-sm ${viewMode === "list" ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50"}`}
                >
                  List
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing {sortedCurriculums.length} of {curriculums.length} curriculums
          </p>
        </div>

        {/* Curriculum Grid/List */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedCurriculums.map((curriculum) => {
              const StatusIcon = statusIcons[curriculum.status];
              return (
                <div key={curriculum.id} className="bg-white rounded-xl border border-gray-100 p-5 hover:border-gray-200 transition-colors">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                        <BookOpen size={20} className="text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 text-sm">{curriculum.basicInfo.name}</h3>
                        <p className="text-xs text-gray-500">{curriculum.version}</p>
                      </div>
                    </div>
                    <div className="relative">
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <MoreHorizontal size={16} className="text-gray-400" />
                      </button>
                    </div>
                  </div>

                  {/* Framework & Status */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`px-2 py-1 text-xs font-medium rounded border ${frameworkColors[curriculum.basicInfo.framework]}`}>
                      {curriculum.basicInfo.framework}
                    </span>
                    <span className={`flex items-center gap-1 px-2 py-1 text-xs font-medium rounded ${statusColors[curriculum.status]}`}>
                      <StatusIcon size={12} />
                      {curriculum.status}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-gray-600 mb-4 line-clamp-2">{curriculum.basicInfo.description}</p>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="text-center p-2 bg-gray-50 rounded-lg">
                      <div className="text-sm font-semibold text-gray-900">{curriculum.structure.length}</div>
                      <div className="text-xs text-gray-500">Periods</div>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded-lg">
                      <div className="text-sm font-semibold text-gray-900">{curriculum.structure.reduce((sum, period) => sum + period.classes.length, 0)}</div>
                      <div className="text-xs text-gray-500">Classes</div>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded-lg">
                      <div className="text-sm font-semibold text-gray-900">{curriculum.deployments}</div>
                      <div className="text-xs text-gray-500">Schools</div>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded-lg">
                      <div className="text-sm font-semibold text-gray-900">{curriculum.learners.toLocaleString()}</div>
                      <div className="text-xs text-gray-500">Learners</div>
                    </div>
                  </div>

                  {/* Meta Info */}
                  <div className="text-xs text-gray-400 mb-4">
                    <div>Grades {curriculum.basicInfo.grades} • {curriculum.basicInfo.educationLevel}</div>
                    <div>Modified: {new Date(curriculum.modifiedAt).toLocaleDateString()}</div>
                    <div>By: {curriculum.creator}</div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button 
                      onClick={() => onNavigate("structure")}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-xs text-gray-700 hover:bg-gray-50"
                    >
                      <Eye size={12} />
                      View
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg text-xs hover:bg-blue-700">
                      <Edit size={12} />
                      Edit
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* List View */
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Curriculum</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Framework</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Deployments</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Learners</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Modified</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedCurriculums.map((curriculum) => {
                  const StatusIcon = statusIcons[curriculum.status];
                  return (
                    <tr key={curriculum.id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                            <BookOpen size={14} className="text-blue-600" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 text-sm">{curriculum.basicInfo.name}</div>
                            <div className="text-xs text-gray-500">{curriculum.version} • Grades {curriculum.basicInfo.grades}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded border ${frameworkColors[curriculum.basicInfo.framework]}`}>
                          {curriculum.basicInfo.framework}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`flex items-center gap-1 w-fit px-2 py-1 text-xs font-medium rounded ${statusColors[curriculum.status]}`}>
                          <StatusIcon size={12} />
                          {curriculum.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900">{curriculum.deployments}</td>
                      <td className="py-3 px-4 text-sm text-gray-900">{curriculum.learners.toLocaleString()}</td>
                      <td className="py-3 px-4 text-xs text-gray-500">{new Date(curriculum.modifiedAt).toLocaleDateString()}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => onNavigate("structure")}
                            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                          >
                            <Eye size={14} />
                          </button>
                          <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded">
                            <Edit size={14} />
                          </button>
                          <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded">
                            <Copy size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {sortedCurriculums.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
            <BookOpen size={48} className="text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No curriculums found</h3>
            <p className="text-gray-500 mb-6">Try adjusting your search or filter criteria</p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedFramework("All Frameworks");
                setSelectedStatus("All Status");
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}