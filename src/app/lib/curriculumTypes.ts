// Core curriculum data types and interfaces

export type CurriculumStatus = "draft" | "review" | "published" | "archived";
export type Framework = "CBC" | "British" | "IGCSE" | "American" | "IB";
export type EducationLevel = "Primary" | "Junior Secondary" | "Senior Secondary" | "Middle School" | "High School";

// Basic Information (Step 1)
export interface BasicInfo {
  name: string;
  code: string;
  description: string;
  framework: Framework;
  educationLevel: EducationLevel;
  grades: string;
  countries: string[];
  tags: string[];
}

// Academic Cycle Configuration (from existing)
export interface CurriculumCycleConfig {
  preset: "3terms" | "2sem" | "custom";
  customKind: "term" | "semester";
  customPeriods: string[];
}

// Structure Data (Step 2)
export interface CourseNode {
  id: string;
  name: string;
}

export interface ClassNode {
  id: string;
  name: string;
  courses: CourseNode[];
}

export interface PeriodNode {
  id: string;
  classes: ClassNode[];
}

// Competencies (Step 4)
export interface LearningOutcome {
  id: string;
  code: string;
  title: string;
  description: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  framework: string;
  courses: string[];
  skills: string[];
}

export interface Skill {
  id: string;
  name: string;
  category: "Cognitive" | "Social" | "Emotional" | "Physical";
  description: string;
  outcomes: string[];
}

export interface CompetencyFramework {
  id: string;
  name: string;
  description: string;
  outcomes: number;
  domains: string[];
}

export interface CompetenciesData {
  selectedFramework: string;
  learningOutcomes: LearningOutcome[];
  selectedOutcomes: string[];
  skills: Skill[];
  selectedSkills: string[];
  standardsAlignment: StandardAlignment[];
}

export interface StandardAlignment {
  standardId: string;
  standardName: string;
  alignedOutcomes: string[];
}
// Settings (Step 5) - simplified from existing CurriculumSettings
export interface CurriculumSettings {
  general: {
    defaultAcademicCycle: string;
    defaultAcademicWeek: string;
    progressCalculation: string;
    enableCompetencies: boolean;
    autoArchiveInactive: boolean;
    languagePreference: string;
  };
  content: {
    outcomeFramework: string;
    requireOutcomeMapping: boolean;
    minimumAssessments: number;
    allowCourseReuse: boolean;
  };
  governance: {
    roles: Record<string, {
      create: boolean;
      edit: boolean;
      publish: boolean;
      approve: boolean;
    }>;
  };
  supplements: {
    enableSupplements: boolean;
    requireApproval: boolean;
    allowedTypes: string[];
    defaultExpiry: number;
  };
  compliance: {
    auditLogging: boolean;
    dataRetention: boolean;
    exportOptions: boolean;
    complianceMode: boolean;
  };
}

// Main Curriculum Data Structure
export interface CurriculumData {
  id: string;
  
  // Step 1: Basic Information
  basicInfo: BasicInfo;
  
  // Step 2: Academic Cycle & Structure  
  cycleConfig: CurriculumCycleConfig;
  structure: PeriodNode[];
  
  // Step 4: Competencies
  competencies: CompetenciesData;
  
  // Step 5: Settings
  settings: CurriculumSettings;
  
  // Metadata
  status: CurriculumStatus;
  version: string;
  createdAt: string;
  modifiedAt: string;
  creator: string;
  completedSteps: boolean[];
  currentStep: number;
}

// Validation
export interface ValidationItem {
  section: string;
  status: "valid" | "warning" | "error";
  message: string;
  action?: string;
}

export interface StepValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

// Library Display
export interface LibraryEntry extends CurriculumData {
  completionPercentage: number;
  lastEditedStep: string;
  canContinue: boolean;
  deployments: number;
  learners: number;
}

// Default values
export const defaultBasicInfo: BasicInfo = {
  name: "",
  code: "",
  description: "",
  framework: "CBC",
  educationLevel: "Junior Secondary", 
  grades: "",
  countries: [],
  tags: []
};

export const defaultCycleConfig: CurriculumCycleConfig = {
  preset: "3terms",
  customKind: "term",
  customPeriods: ["Term 1", "Term 2", "Term 3"]
};

export const defaultCompetencies: CompetenciesData = {
  selectedFramework: "",
  learningOutcomes: [],
  selectedOutcomes: [],
  skills: [],
  selectedSkills: [],
  standardsAlignment: []
};

export const defaultSettings: CurriculumSettings = {
  general: {
    defaultAcademicCycle: "3terms",
    defaultAcademicWeek: "Monday",
    progressCalculation: "Competency-Based",
    enableCompetencies: true,
    autoArchiveInactive: true,
    languagePreference: "English"
  },
  content: {
    outcomeFramework: "Digifunzi Competency Framework",
    requireOutcomeMapping: true,
    minimumAssessments: 2,
    allowCourseReuse: true
  },
  governance: {
    roles: {
      "Super Admin": { create: true, edit: true, publish: true, approve: true },
      "Curriculum Admin": { create: true, edit: true, publish: true, approve: false },
      "Deployment Admin": { create: false, edit: true, publish: true, approve: false },
      "School Admin": { create: false, edit: false, publish: false, approve: true },
      "Teacher": { create: false, edit: false, publish: false, approve: false }
    }
  },
  supplements: {
    enableSupplements: true,
    requireApproval: true,
    allowedTypes: ["Additive", "Substitutive", "Pacing", "Cohort-Specific"],
    defaultExpiry: 180
  },
  compliance: {
    auditLogging: true,
    dataRetention: true,
    exportOptions: true,
    complianceMode: true
  }
};