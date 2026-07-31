'use client';

const icons: Record<string, React.ReactNode> = {
  ossc: (
    <span className="h-14 w-14 shrink-0 rounded-xl overflow-hidden bg-white border border-surface-200 flex items-center justify-center">
      <img src="/images/OSSC.svg" alt="OSSC" className="h-full w-full object-contain p-0.5" />
    </span>
  ),
  osssc: (
    <span className="h-14 w-14 shrink-0 rounded-xl overflow-hidden bg-white border border-surface-200 flex items-center justify-center">
      <img src="/images/OSSSC.png" alt="OSSSC" className="h-full w-full object-contain p-0.5" />
    </span>
  ),
  opsc: (
    <span className="h-14 w-14 shrink-0 rounded-xl overflow-hidden bg-white border border-surface-200 flex items-center justify-center">
      <img src="/images/opsc.jpeg" alt="OPSC" className="h-full w-full object-contain p-0.5" />
    </span>
  ),
  ssb: (
    <span className="h-14 w-14 shrink-0 rounded-xl overflow-hidden bg-white border border-surface-200 flex items-center justify-center">
      <img src="/images/SSB.svg" alt="SSB" className="h-full w-full object-contain p-0.5" />
    </span>
  ),
  'odisha-police': (
    <span className="h-14 w-14 shrink-0 rounded-xl overflow-hidden bg-white border border-surface-200 flex items-center justify-center">
      <img src="/images/Odisha_Police_Logo.png" alt="Odisha Police" className="h-full w-full object-contain p-0.5" />
    </span>
  ),
  'odisha-teaching': (
    <svg viewBox="0 0 48 48" fill="none" className="h-14 w-14 shrink-0">
      <rect width="48" height="48" rx="12" fill="#d97706" />
      <path d="M16 28l8-12 8 12H16z" fill="white" opacity="0.9" />
      <rect x="16" y="30" width="16" height="4" rx="1" fill="white" opacity="0.6" />
      <circle cx="24" cy="20" r="4" fill="#d97706" opacity="0.2" />
      <line x1="24" y1="12" x2="24" y2="15" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
    </svg>
  ),
  'odisha-universities': (
    <svg viewBox="0 0 48 48" fill="none" className="h-14 w-14 shrink-0">
      <rect width="48" height="48" rx="12" fill="#0d9488" />
      <path d="M24 12l-10 6 10 6 10-6-10-6z" fill="white" opacity="0.9" />
      <rect x="16" y="22" width="16" height="12" rx="1" fill="white" opacity="0.85" />
      <rect x="19" y="25" width="4" height="3" rx="0.5" fill="#0d9488" opacity="0.2" />
      <rect x="25" y="25" width="4" height="3" rx="0.5" fill="#0d9488" opacity="0.2" />
      <line x1="24" y1="30" x2="24" y2="32" stroke="#0d9488" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
    </svg>
  ),
  other: (
    <svg viewBox="0 0 48 48" fill="none" className="h-14 w-14 shrink-0">
      <rect width="48" height="48" rx="12" fill="#64748b" />
      <circle cx="18" cy="18" r="4" fill="white" opacity="0.8" />
      <circle cx="30" cy="18" r="4" fill="white" opacity="0.8" />
      <circle cx="18" cy="30" r="4" fill="white" opacity="0.8" />
      <circle cx="30" cy="30" r="4" fill="white" opacity="0.8" />
    </svg>
  ),
};

interface Props {
  exam: string;
  className?: string;
}

export default function ExamCategoryIcon({ exam, className }: Props) {
  const icon = icons[exam];
  return <span className={className}>{icon}</span>;
}
