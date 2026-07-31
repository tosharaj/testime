'use client';

const icons: Record<string, React.ReactNode> = {
  ossc: (
    <span className="h-16 w-16 shrink-0 rounded-xl overflow-hidden bg-white flex items-center justify-center">
      <img src="/images/odisha_govt.png" alt="OSSC" className="h-full w-full object-contain" />
    </span>
  ),
  osssc: (
    <span className="h-16 w-16 shrink-0 rounded-xl overflow-hidden bg-white flex items-center justify-center">
      <img src="/images/odisha_govt.png" alt="OSSSC" className="h-full w-full object-contain" />
    </span>
  ),
  opsc: (
    <span className="h-16 w-16 shrink-0 rounded-xl overflow-hidden bg-white flex items-center justify-center">
      <img src="/images/opsc.jpeg" alt="OPSC" className="h-full w-full object-contain" />
    </span>
  ),
  ssb: (
    <span className="h-16 w-16 shrink-0 rounded-xl overflow-hidden bg-white flex items-center justify-center">
      <img src="/images/odisha_govt.png" alt="SSB" className="h-full w-full object-contain" />
    </span>
  ),
  'odisha-police': (
    <span className="h-16 w-16 shrink-0 rounded-xl overflow-hidden bg-white flex items-center justify-center">
      <img src="/images/Odisha_Police_Logo.png" alt="Odisha Police" className="h-full w-full object-contain" />
    </span>
  ),
  'odisha-teaching': (
    <span className="h-16 w-16 shrink-0 rounded-xl overflow-hidden bg-white flex items-center justify-center">
      <img src="/images/odisha_govt.png" alt="Odisha Teaching" className="h-full w-full object-contain" />
    </span>
  ),
  'odisha-universities': (
    <span className="h-16 w-16 shrink-0 rounded-xl overflow-hidden bg-white flex items-center justify-center">
      <img src="/images/odisha_govt.png" alt="Odisha Universities" className="h-full w-full object-contain" />
    </span>
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
