export type Crayon = {
  name: string;
  body: string;
  tip: string;
  tipBorder: string;
  soft: string;
  text: string;
  border: string;
  solid: string;
  chip: string;
  chipText: string;
  hoverBorder: string;
  hoverText: string;
  hoverShadow: string;
};

export const crayons: Crayon[] = [
  {
    name: 'coral',
    body: 'bg-coral-500',
    tip: 'bg-coral-400',
    tipBorder: 'border-b-coral-400',
    soft: 'bg-coral-50',
    text: 'text-coral-700',
    border: 'border-coral-200',
    solid: 'bg-coral-500',
    chip: 'bg-coral-100',
    chipText: 'text-coral-700',
    hoverBorder: 'hover:border-coral-300',
    hoverText: 'group-hover:text-coral-700',
    hoverShadow: 'hover:shadow-coral-500/10',
  },
  {
    name: 'ocean',
    body: 'bg-ocean-500',
    tip: 'bg-ocean-400',
    tipBorder: 'border-b-ocean-400',
    soft: 'bg-ocean-50',
    text: 'text-ocean-700',
    border: 'border-ocean-200',
    solid: 'bg-ocean-500',
    chip: 'bg-ocean-100',
    chipText: 'text-ocean-700',
    hoverBorder: 'hover:border-ocean-300',
    hoverText: 'group-hover:text-ocean-700',
    hoverShadow: 'hover:shadow-ocean-500/10',
  },
  {
    name: 'sunny',
    body: 'bg-sunny-500',
    tip: 'bg-sunny-400',
    tipBorder: 'border-b-sunny-400',
    soft: 'bg-sunny-50',
    text: 'text-sunny-700',
    border: 'border-sunny-200',
    solid: 'bg-sunny-500',
    chip: 'bg-sunny-100',
    chipText: 'text-sunny-700',
    hoverBorder: 'hover:border-sunny-300',
    hoverText: 'group-hover:text-sunny-700',
    hoverShadow: 'hover:shadow-sunny-500/10',
  },
  {
    name: 'mint',
    body: 'bg-mint-500',
    tip: 'bg-mint-400',
    tipBorder: 'border-b-mint-400',
    soft: 'bg-mint-50',
    text: 'text-mint-700',
    border: 'border-mint-200',
    solid: 'bg-mint-500',
    chip: 'bg-mint-100',
    chipText: 'text-mint-700',
    hoverBorder: 'hover:border-mint-300',
    hoverText: 'group-hover:text-mint-700',
    hoverShadow: 'hover:shadow-mint-500/10',
  },
  {
    name: 'lavender',
    body: 'bg-lavender-500',
    tip: 'bg-lavender-400',
    tipBorder: 'border-b-lavender-400',
    soft: 'bg-lavender-50',
    text: 'text-lavender-700',
    border: 'border-lavender-200',
    solid: 'bg-lavender-500',
    chip: 'bg-lavender-100',
    chipText: 'text-lavender-700',
    hoverBorder: 'hover:border-lavender-300',
    hoverText: 'group-hover:text-lavender-700',
    hoverShadow: 'hover:shadow-lavender-500/10',
  },
  {
    name: 'brand',
    body: 'bg-brand-500',
    tip: 'bg-brand-400',
    tipBorder: 'border-b-brand-400',
    soft: 'bg-brand-50',
    text: 'text-brand-700',
    border: 'border-brand-200',
    solid: 'bg-brand-500',
    chip: 'bg-brand-100',
    chipText: 'text-brand-700',
    hoverBorder: 'hover:border-brand-300',
    hoverText: 'group-hover:text-brand-700',
    hoverShadow: 'hover:shadow-brand-500/10',
  },
];

export function crayon(index: number): Crayon {
  const n = crayons.length;
  return crayons[((index % n) + n) % n];
}
