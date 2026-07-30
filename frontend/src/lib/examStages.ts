export const examStageMap: Record<string, string[]> = {
  ossc: ['Prelims', 'Mains', 'Skill Test'],
  osssc: ['Prelims', 'Mains', 'Skill Test'],
  opsc: ['Prelims', 'Mains', 'Interview'],
  ssb: ['Prelims', 'Mains', 'Interview', 'PET', 'Document Verification'],
  'odisha-police': ['Prelims', 'Mains', 'PET', 'Skill Test', 'Document Verification'],
  railway: ['Prelims', 'Mains', 'Skill Test', 'Document Verification'],
  ssc: ['Prelims', 'Mains', 'Skill Test'],
  banking: ['Prelims', 'Mains', 'Interview', 'Skill Test'],
  'odisha-teaching': ['Prelims'],
  'odisha-universities': ['Prelims'],
  other: ['Prelims', 'Mains', 'Skill Test'],
};

export const defaultStages = ['Prelims', 'Mains'];

export function getStagesForExam(examId: string): string[] {
  return examStageMap[examId] || defaultStages;
}
