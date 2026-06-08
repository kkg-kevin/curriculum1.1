import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { 
  CurriculumData, 
  BasicInfo, 
  CurriculumCycleConfig, 
  PeriodNode, 
  CompetenciesData, 
  CurriculumSettings,
  StepValidation
} from './curriculumTypes';
import { curriculumService } from './curriculumService';

// Context State Interface
interface CurriculumContextState {
  curriculum: CurriculumData | null;
  currentStep: number;
  isLoading: boolean;
  error: string | null;
  isDirty: boolean; // Has unsaved changes
  autoSaveEnabled: boolean;
}

// Context Actions
type CurriculumAction =
  | { type: 'SET_CURRICULUM'; payload: CurriculumData }
  | { type: 'UPDATE_BASIC_INFO'; payload: Partial<BasicInfo> }
  | { type: 'UPDATE_CYCLE_CONFIG'; payload: CurriculumCycleConfig }
  | { type: 'UPDATE_STRUCTURE'; payload: PeriodNode[] }
  | { type: 'UPDATE_COMPETENCIES'; payload: Partial<CompetenciesData> }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<CurriculumSettings> }
  | { type: 'SET_CURRENT_STEP'; payload: number }
  | { type: 'COMPLETE_STEP'; payload: number }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_DIRTY'; payload: boolean }
  | { type: 'SET_AUTO_SAVE'; payload: boolean }
  | { type: 'RESET_CURRICULUM' };

// Context Interface
interface CurriculumContextType {
  state: CurriculumContextState;
  
  // Curriculum Management
  createNewCurriculum: () => Promise<void>;
  loadCurriculum: (id: string) => Promise<void>;
  loadDraft: () => Promise<void>;
  saveCurriculum: () => Promise<string>;
  saveDraft: () => Promise<void>;
  publishCurriculum: () => Promise<void>;
  
  // Step Management
  goToStep: (step: number) => void;
  completeStep: (step: number) => void;
  canProceedToStep: (step: number) => boolean;
  getCurrentStepValidation: () => StepValidation;
  
  // Data Updates
  updateBasicInfo: (updates: Partial<BasicInfo>) => void;
  updateCycleConfig: (config: CurriculumCycleConfig) => void;
  updateStructure: (structure: PeriodNode[]) => void;
  updateCompetencies: (updates: Partial<CompetenciesData>) => void;
  updateSettings: (updates: Partial<CurriculumSettings>) => void;
  
  // Utility
  resetCurriculum: () => void;
  setAutoSave: (enabled: boolean) => void;
}

// Initial State
const initialState: CurriculumContextState = {
  curriculum: null,
  currentStep: 0,
  isLoading: false,
  error: null,
  isDirty: false,
  autoSaveEnabled: true,
};

// Reducer
function curriculumReducer(state: CurriculumContextState, action: CurriculumAction): CurriculumContextState {
  switch (action.type) {
    case 'SET_CURRICULUM':
      return {
        ...state,
        curriculum: action.payload,
        currentStep: action.payload.currentStep,
        isDirty: false,
        error: null,
      };
      
    case 'UPDATE_BASIC_INFO':
      if (!state.curriculum) return state;
      return {
        ...state,
        curriculum: {
          ...state.curriculum,
          basicInfo: { ...state.curriculum.basicInfo, ...action.payload },
          modifiedAt: new Date().toISOString(),
        },
        isDirty: true,
      };
      
    case 'UPDATE_CYCLE_CONFIG':
      if (!state.curriculum) return state;
      return {
        ...state,
        curriculum: {
          ...state.curriculum,
          cycleConfig: action.payload,
          modifiedAt: new Date().toISOString(),
        },
        isDirty: true,
      };
      
    case 'UPDATE_STRUCTURE':
      if (!state.curriculum) return state;
      return {
        ...state,
        curriculum: {
          ...state.curriculum,
          structure: action.payload,
          modifiedAt: new Date().toISOString(),
        },
        isDirty: true,
      };
      
    case 'UPDATE_COMPETENCIES':
      if (!state.curriculum) return state;
      return {
        ...state,
        curriculum: {
          ...state.curriculum,
          competencies: { ...state.curriculum.competencies, ...action.payload },
          modifiedAt: new Date().toISOString(),
        },
        isDirty: true,
      };
      
    case 'UPDATE_SETTINGS':
      if (!state.curriculum) return state;
      return {
        ...state,
        curriculum: {
          ...state.curriculum,
          settings: { ...state.curriculum.settings, ...action.payload },
          modifiedAt: new Date().toISOString(),
        },
        isDirty: true,
      };
      
    case 'SET_CURRENT_STEP':
      if (!state.curriculum) return state;
      return {
        ...state,
        curriculum: {
          ...state.curriculum,
          currentStep: action.payload,
        },
        currentStep: action.payload,
        isDirty: true,
      };
      
    case 'COMPLETE_STEP':
      if (!state.curriculum) return state;
      const newCompletedSteps = [...state.curriculum.completedSteps];
      newCompletedSteps[action.payload] = true;
      return {
        ...state,
        curriculum: {
          ...state.curriculum,
          completedSteps: newCompletedSteps,
          modifiedAt: new Date().toISOString(),
        },
        isDirty: true,
      };
      
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
      
    case 'SET_ERROR':
      return { ...state, error: action.payload };
      
    case 'SET_DIRTY':
      return { ...state, isDirty: action.payload };
      
    case 'SET_AUTO_SAVE':
      return { ...state, autoSaveEnabled: action.payload };
      
    case 'RESET_CURRICULUM':
      return { ...initialState };
      
    default:
      return state;
  }
}
// Create Context
const CurriculumContext = createContext<CurriculumContextType | undefined>(undefined);

// Provider Component
interface CurriculumProviderProps {
  children: ReactNode;
}

export function CurriculumProvider({ children }: CurriculumProviderProps) {
  const [state, dispatch] = useReducer(curriculumReducer, initialState);

  // Auto-save effect
  useEffect(() => {
    if (state.isDirty && state.autoSaveEnabled && state.curriculum) {
      const autoSaveTimer = setTimeout(async () => {
        try {
          await curriculumService.saveDraft(state.curriculum!);
          dispatch({ type: 'SET_DIRTY', payload: false });
        } catch (error) {
          console.error('Auto-save failed:', error);
        }
      }, 2000); // Auto-save after 2 seconds of inactivity

      return () => clearTimeout(autoSaveTimer);
    }
  }, [state.isDirty, state.autoSaveEnabled, state.curriculum]);

  // Initialize sample data on first load
  useEffect(() => {
    curriculumService.initializeSampleData();
  }, []);

  // Context Methods
  const createNewCurriculum = async (): Promise<void> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const newCurriculum = curriculumService.createNewCurriculum();
      dispatch({ type: 'SET_CURRICULUM', payload: newCurriculum });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: (error as Error).message });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const loadCurriculum = async (id: string): Promise<void> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const curriculum = await curriculumService.getCurriculum(id);
      if (curriculum) {
        dispatch({ type: 'SET_CURRICULUM', payload: curriculum });
      } else {
        dispatch({ type: 'SET_ERROR', payload: 'Curriculum not found' });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: (error as Error).message });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const loadDraft = async (): Promise<void> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const draft = curriculumService.getDraft();
      if (draft) {
        dispatch({ type: 'SET_CURRICULUM', payload: draft });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: (error as Error).message });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const saveCurriculum = async (): Promise<string> => {
    if (!state.curriculum) {
      throw new Error('No curriculum to save');
    }
    
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const id = await curriculumService.saveCurriculum(state.curriculum);
      dispatch({ type: 'SET_DIRTY', payload: false });
      return id;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: (error as Error).message });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const saveDraft = async (): Promise<void> => {
    if (!state.curriculum) {
      throw new Error('No curriculum to save');
    }
    
    try {
      await curriculumService.saveDraft(state.curriculum);
      dispatch({ type: 'SET_DIRTY', payload: false });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: (error as Error).message });
      throw error;
    }
  };

  const publishCurriculum = async (): Promise<void> => {
    if (!state.curriculum) {
      throw new Error('No curriculum to publish');
    }
    
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      // Update status to published and save
      const updatedCurriculum = {
        ...state.curriculum,
        status: 'published' as const,
        modifiedAt: new Date().toISOString(),
      };
      
      await curriculumService.saveCurriculum(updatedCurriculum);
      dispatch({ type: 'SET_CURRICULUM', payload: updatedCurriculum });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: (error as Error).message });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const goToStep = (step: number): void => {
    dispatch({ type: 'SET_CURRENT_STEP', payload: step });
  };

  const completeStep = (step: number): void => {
    dispatch({ type: 'COMPLETE_STEP', payload: step });
  };

  const canProceedToStep = (step: number): boolean => {
    if (!state.curriculum) return false;
    
    // Can always go back
    if (step <= state.currentStep) return true;
    
    // Can proceed to next step if current step is completed
    return state.curriculum.completedSteps[step - 1] === true;
  };

  const getCurrentStepValidation = (): StepValidation => {
    if (!state.curriculum) {
      return { isValid: false, errors: ['No curriculum loaded'], warnings: [] };
    }
    
    const validation = curriculumService.validateCurriculum(state.curriculum);
    return {
      isValid: validation.isValid,
      errors: validation.errors,
      warnings: validation.warnings,
    };
  };

  const updateBasicInfo = (updates: Partial<BasicInfo>): void => {
    dispatch({ type: 'UPDATE_BASIC_INFO', payload: updates });
  };

  const updateCycleConfig = (config: CurriculumCycleConfig): void => {
    dispatch({ type: 'UPDATE_CYCLE_CONFIG', payload: config });
  };

  const updateStructure = (structure: PeriodNode[]): void => {
    dispatch({ type: 'UPDATE_STRUCTURE', payload: structure });
  };

  const updateCompetencies = (updates: Partial<CompetenciesData>): void => {
    dispatch({ type: 'UPDATE_COMPETENCIES', payload: updates });
  };

  const updateSettings = (updates: Partial<CurriculumSettings>): void => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: updates });
  };

  const resetCurriculum = (): void => {
    dispatch({ type: 'RESET_CURRICULUM' });
  };

  const setAutoSave = (enabled: boolean): void => {
    dispatch({ type: 'SET_AUTO_SAVE', payload: enabled });
  };

  const contextValue: CurriculumContextType = {
    state,
    createNewCurriculum,
    loadCurriculum,
    loadDraft,
    saveCurriculum,
    saveDraft,
    publishCurriculum,
    goToStep,
    completeStep,
    canProceedToStep,
    getCurrentStepValidation,
    updateBasicInfo,
    updateCycleConfig,
    updateStructure,
    updateCompetencies,
    updateSettings,
    resetCurriculum,
    setAutoSave,
  };

  return (
    <CurriculumContext.Provider value={contextValue}>
      {children}
    </CurriculumContext.Provider>
  );
}

// Custom Hook
export function useCurriculum(): CurriculumContextType {
  const context = useContext(CurriculumContext);
  if (context === undefined) {
    throw new Error('useCurriculum must be used within a CurriculumProvider');
  }
  return context;
}

// Export context for direct access if needed
export { CurriculumContext };