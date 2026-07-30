export const UserRole = { SUPER_ADMIN: 'SUPER_ADMIN', CONTENT_EDITOR: 'CONTENT_EDITOR', QUESTION_MANAGER: 'QUESTION_MANAGER', TEST_MANAGER: 'TEST_MANAGER', SUPPORT_EXECUTIVE: 'SUPPORT_EXECUTIVE', FINANCE_ADMIN: 'FINANCE_ADMIN', ANALYST: 'ANALYST', STUDENT: 'STUDENT' } as const;
export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export const ExamFamily = { OPSC: 'OPSC', OSSC: 'OSSC', OSSSC: 'OSSSC', OdishaPolice: 'OdishaPolice', Railway: 'Railway', SSC: 'SSC', Banking: 'Banking', Other: 'Other' } as const;
export type ExamFamily = (typeof ExamFamily)[keyof typeof ExamFamily];

export const ExamStage = { PRELIMS: 'PRELIMS', MAINS: 'MAINS', INTERVIEW: 'INTERVIEW', SKILL_TEST: 'SKILL_TEST', PET: 'PET', DOCUMENT_VERIFICATION: 'DOCUMENT_VERIFICATION' } as const;
export type ExamStage = (typeof ExamStage)[keyof typeof ExamStage];

export const TestType = { FULL_MOCK: 'FULL_MOCK', SECTIONAL: 'SECTIONAL', TOPIC_WISE: 'TOPIC_WISE', PYQ_TEST: 'PYQ_TEST', DAILY_QUIZ: 'DAILY_QUIZ', WEEKLY_REVISION: 'WEEKLY_REVISION', MONTHLY_GRAND_TEST: 'MONTHLY_GRAND_TEST', NCERT_BASED_TEST: 'NCERT_BASED_TEST', STATIC_GK_TEST: 'STATIC_GK_TEST', CURRENT_AFFAIRS_TEST: 'CURRENT_AFFAIRS_TEST' } as const;
export type TestType = (typeof TestType)[keyof typeof TestType];

export const TestMode = { PRACTICE: 'PRACTICE', TIMED: 'TIMED', LEARNING: 'LEARNING' } as const;
export type TestMode = (typeof TestMode)[keyof typeof TestMode];

export const AccessType = { FREE: 'FREE', PREMIUM: 'PREMIUM', PAID: 'PAID' } as const;
export type AccessType = (typeof AccessType)[keyof typeof AccessType];

export const SourceType = { NCERT: 'NCERT', PYQ: 'PYQ', CURRENT_AFFAIRS: 'CURRENT_AFFAIRS', STANDARD_BOOK: 'STANDARD_BOOK', MIXED: 'MIXED' } as const;
export type SourceType = (typeof SourceType)[keyof typeof SourceType];

export const TicketStatus = { OPEN: 'OPEN', IN_PROGRESS: 'IN_PROGRESS', RESOLVED: 'RESOLVED', CLOSED: 'CLOSED' } as const;
export type TicketStatus = (typeof TicketStatus)[keyof typeof TicketStatus];
