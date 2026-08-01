import type { Crayon } from '@/lib/crayon';

export default function CrayonStick({ c, height = 96, tilt = 0, delay = 0 }: { c: Crayon; height?: number; tilt?: number; delay?: number }) {
  return (
    <div
      className="flex flex-col items-center will-change-transform"
      style={{ transform: `rotate(${tilt}deg)`, animation: `float 6s ease-in-out ${delay}s infinite` }}
    >
      <div className={`relative w-5 rounded-t-xl ${c.body} shadow-lg`} style={{ height }}>
        <div className="absolute inset-x-0 top-1/2 h-2.5 bg-white/50" />
        <div className="absolute inset-x-0 bottom-0 h-1.5 rounded-b-md bg-black/5" />
      </div>
      <div className={`w-0 border-x-[10px] border-b-[13px] border-x-transparent ${c.tipBorder}`} />
    </div>
  );
}
