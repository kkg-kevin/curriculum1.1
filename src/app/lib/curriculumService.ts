import { 
  CurriculumData, 
  LibraryEntry, 
  CurriculumStatus, 
  defaultBasicInfo, 
  defaultCycleConfig, 
  defaultCompetencies, 
  defaultSettings 
} from './curriculumTypes';

// Local Storage Service for Curriculum Management
export class CurriculumStorageService {
  private readonly storageKey = 'digifunzi-curriculums';
  private readonly draftKey = 'digifunzi-curriculum-draft';

  // Generate unique ID
  private generateId(): string {
    return `curriculum-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  // Get current timestamp
  private getTimestamp(): string {
    return new Date().toISOString();
  }

  // Calculate completion percentage based on completed steps
  private calculateCompletion(curriculum: CurriculumData): number {
    const completedCount = curriculum.completedSteps.filter(Boolean).length;
    return Math.round((completedCount / curriculum.completedSteps.length) * 100);
  }

  // Get last edited step name
  private getLastEditedStep(curriculum: CurriculumData): string {
    const steps = ["Basic Information", "Structure", "Classes & Courses", "Competencies", "Settings", "Review"];
    const lastCompletedIndex = curriculum.completedSteps.lastIndexOf(true);
    return lastCompletedIndex >= 0 ? steps[lastCompletedIndex] : "Not started";
  }

  // Create new curriculum with defaults
  createNewCurriculum(creator: string = "Current User"): CurriculumData {
    const now = this.getTimestamp();
    return {
      id: this.generateId(),
      basicInfo: { ...defaultBasicInfo },
      cycleConfig: { ...defaultCycleConfig },
      structure: [],
      competencies: { ...defaultCompetencies },
      settings: { ...defaultSettings },
      status: "draft",
      version: "v1.0",
      createdAt: now,
      modifiedAt: now,
      creator,
      completedSteps: [false, false, false, false, false, false], // 6 steps
      currentStep: 0
    };
  }

  // Save curriculum to localStorage
  async saveCurriculum(curriculum: CurriculumData): Promise<string> {
    try {
      curriculum.modifiedAt = this.getTimestamp();
      
      const existingCurriculums = this.getAllCurriculums();
      const index = existingCurriculums.findIndex(c => c.id === curriculum.id);
      
      if (index >= 0) {
        existingCurriculums[index] = curriculum;
      } else {
        existingCurriculums.push(curriculum);
      }
      
      localStorage.setItem(this.storageKey, JSON.stringify(existingCurriculums));
      
      // Clear draft if this was saved as final
      if (curriculum.status !== "draft") {
        this.clearDraft();
      }
      
      return curriculum.id;
    } catch (error) {
      console.error('Error saving curriculum:', error);
      throw new Error('Failed to save curriculum');
    }
  }

  // Save as draft (temporary save)
  async saveDraft(curriculum: CurriculumData): Promise<void> {
    try {
      curriculum.modifiedAt = this.getTimestamp();
      localStorage.setItem(this.draftKey, JSON.stringify(curriculum));
    } catch (error) {
      console.error('Error saving draft:', error);
      throw new Error('Failed to save draft');
    }
  }

  // Get draft curriculum
  getDraft(): CurriculumData | null {
    try {
      const draft = localStorage.getItem(this.draftKey);
      return draft ? JSON.parse(draft) : null;
    } catch (error) {
      console.error('Error loading draft:', error);
      return null;
    }
  }

  // Clear draft
  clearDraft(): void {
    localStorage.removeItem(this.draftKey);
  }
  // Get all curriculums from localStorage
  getAllCurriculums(): CurriculumData[] {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading curriculums:', error);
      return [];
    }
  }

  // Get curriculum by ID
  async getCurriculum(id: string): Promise<CurriculumData | null> {
    try {
      const curriculums = this.getAllCurriculums();
      return curriculums.find(c => c.id === id) || null;
    } catch (error) {
      console.error('Error loading curriculum:', error);
      return null;
    }
  }

  // Get curriculums for library display
  async getLibraryCurriculums(): Promise<LibraryEntry[]> {
    try {
      const curriculums = this.getAllCurriculums();
      return curriculums.map(curriculum => ({
        ...curriculum,
        completionPercentage: this.calculateCompletion(curriculum),
        lastEditedStep: this.getLastEditedStep(curriculum),
        canContinue: curriculum.status === "draft",
        deployments: this.getMockDeployments(curriculum.id),
        learners: this.getMockLearners(curriculum.id)
      }));
    } catch (error) {
      console.error('Error loading library curriculums:', error);
      return [];
    }
  }

  // Delete curriculum
  async deleteCurriculum(id: string): Promise<void> {
    try {
      const curriculums = this.getAllCurriculums();
      const filtered = curriculums.filter(c => c.id !== id);
      localStorage.setItem(this.storageKey, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error deleting curriculum:', error);
      throw new Error('Failed to delete curriculum');
    }
  }

  // Publish curriculum (change status)
  async publishCurriculum(id: string): Promise<void> {
    try {
      const curriculum = await this.getCurriculum(id);
      if (!curriculum) {
        throw new Error('Curriculum not found');
      }
      
      curriculum.status = "published";
      curriculum.modifiedAt = this.getTimestamp();
      
      await this.saveCurriculum(curriculum);
    } catch (error) {
      console.error('Error publishing curriculum:', error);
      throw new Error('Failed to publish curriculum');
    }
  }

  // Update curriculum status
  async updateCurriculumStatus(id: string, status: CurriculumStatus): Promise<void> {
    try {
      const curriculum = await this.getCurriculum(id);
      if (!curriculum) {
        throw new Error('Curriculum not found');
      }
      
      curriculum.status = status;
      curriculum.modifiedAt = this.getTimestamp();
      
      await this.saveCurriculum(curriculum);
    } catch (error) {
      console.error('Error updating curriculum status:', error);
      throw new Error('Failed to update curriculum status');
    }
  }

  // Mock data for deployments and learners (replace with real API calls later)
  private getMockDeployments(curriculumId: string): number {
    // Mock deployment counts based on curriculum ID
    const hash = curriculumId.split('-').pop() || '';
    return Math.floor(Math.random() * 200) + 10;
  }

  private getMockLearners(curriculumId: string): number {
    // Mock learner counts based on curriculum ID  
    const hash = curriculumId.split('-').pop() || '';
    return Math.floor(Math.random() * 50000) + 1000;
  }

  // Validate curriculum completeness
  validateCurriculum(curriculum: CurriculumData): { isValid: boolean; errors: string[]; warnings: string[] } {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Step 1: Basic Information validation
    if (!curriculum.basicInfo.name.trim()) {
      errors.push("Curriculum name is required");
    }
    if (!curriculum.basicInfo.code.trim()) {
      errors.push("Curriculum code is required");
    }
    if (!curriculum.basicInfo.description.trim()) {
      errors.push("Description is required");
    }

    // Step 2: Structure validation
    if (curriculum.structure.length === 0) {
      errors.push("At least one academic period is required");
    }

    const totalClasses = curriculum.structure.reduce((sum, period) => sum + period.classes.length, 0);
    if (totalClasses === 0) {
      warnings.push("No classes defined in curriculum structure");
    }

    const totalCourses = curriculum.structure.reduce((sum, period) => 
      sum + period.classes.reduce((classSum, cls) => classSum + cls.courses.length, 0), 0);
    if (totalCourses === 0) {
      warnings.push("No courses defined in curriculum structure");
    }

    // Step 4: Competencies validation  
    if (curriculum.competencies.selectedOutcomes.length < 3) {
      warnings.push("At least 3 learning outcomes recommended");
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  // Initialize with sample data (for demo purposes)
  async initializeSampleData(): Promise<void> {
    const existing = this.getAllCurriculums();
    if (existing.length === 0) {
      // Create sample curriculum
      const sample = this.createNewCurriculum("Ministry of Education");
      sample.basicInfo.name = "CBC Junior Secondary";
      sample.basicInfo.code = "CBC-JS-2024";
      sample.basicInfo.description = "Competency-Based Curriculum for Junior Secondary (Grades 7-9) aligned with CBC framework";
      sample.basicInfo.framework = "CBC";
      sample.basicInfo.grades = "7-9";
      sample.basicInfo.countries = ["Kenya"];
      sample.basicInfo.tags = ["CBC", "Junior Secondary", "Core Curriculum"];
      sample.status = "published";
      sample.completedSteps = [true, true, false, true, true, false];
      sample.currentStep = 5;

      await this.saveCurriculum(sample);
    }
  }
}

// Export singleton instance
export const curriculumService = new CurriculumStorageService();