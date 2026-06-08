export type AcademicCyclePreset = "3terms" | "2sem" | "custom";
export type CustomCycleKind = "term" | "semester";

export interface CurriculumCycleConfig {
  preset: AcademicCyclePreset;
  customKind: CustomCycleKind;
  customPeriods: string[];
}

export const defaultCurriculumCycle: CurriculumCycleConfig = {
  preset: "3terms",
  customKind: "term",
  customPeriods: ["Term 1", "Term 2", "Term 3"],
};

export function getDefaultPeriods(preset: Exclude<AcademicCyclePreset, "custom">) {
  return preset === "3terms"
    ? ["Term 1", "Term 2", "Term 3"]
    : ["Semester 1", "Semester 2"];
}

export function getCustomPeriodLabel(kind: CustomCycleKind, index: number) {
  const base = kind === "term" ? "Term" : "Semester";
  return `${base} ${index + 1}`;
}

export function normalizeCustomPeriods(kind: CustomCycleKind, count: number, existing: string[] = []) {
  const safeCount = Math.max(1, Math.min(12, Math.floor(count || 0)));

  return Array.from({ length: safeCount }, (_, index) => {
    const value = existing[index]?.trim();
    return value || getCustomPeriodLabel(kind, index);
  });
}

export function getCyclePeriods(cycle: CurriculumCycleConfig) {
  if (cycle.preset === "custom") {
    return cycle.customPeriods.length > 0
      ? cycle.customPeriods
      : normalizeCustomPeriods(cycle.customKind, 3);
  }

  return getDefaultPeriods(cycle.preset);
}

export function getCycleSummary(cycle: CurriculumCycleConfig) {
  if (cycle.preset === "3terms") {
    return "3 Terms";
  }

  if (cycle.preset === "2sem") {
    return "2 Semesters";
  }

  const customCount = getCyclePeriods(cycle).length;
  const label = cycle.customKind === "term" ? "Terms" : "Semesters";
  return `Custom ${label} (${customCount})`;
}
