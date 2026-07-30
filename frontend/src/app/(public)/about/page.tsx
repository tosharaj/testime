import { GraduationCap, Target, Users, Award } from 'lucide-react';

const values = [
  { icon: Target, title: 'Our Mission', desc: 'To make quality exam preparation accessible to every student in Odisha, regardless of their background.' },
  { icon: Users, title: '10,00,000+ Students', desc: 'Trusted by millions of aspirants across the state for their exam preparation journey.' },
  { icon: Award, title: 'Expert Content', desc: 'Content curated by subject matter experts and former exam toppers.' },
  { icon: GraduationCap, title: 'Proven Results', desc: 'Our students consistently rank among the top in OSSC, OPSSC, OPSC, and other state exams.' },
];

export default function AboutPage() {
  return (
    <div className="py-16 lg:py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="text-center mb-16">
          <h1 className="text-3xl lg:text-4xl font-bold text-surface-900 mb-4">About Testime</h1>
          <p className="text-surface-500 text-lg max-w-2xl mx-auto">Odisha&apos;s most advanced exam preparation platform, built by educators who understand the challenges of competitive exams.</p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6 mb-16">
          {values.map((v) => {
            const Icon = v.icon;
            return (
              <div key={v.title} className="p-6 rounded-2xl border border-surface-200 hover:border-brand-200 hover:shadow-sm transition-all">
                <div className="h-10 w-10 rounded-xl bg-brand-50 flex items-center justify-center mb-3">
                  <Icon className="h-5 w-5 text-brand-600" />
                </div>
                <h3 className="font-bold text-surface-900 mb-1">{v.title}</h3>
                <p className="text-sm text-surface-500 leading-relaxed">{v.desc}</p>
              </div>
            );
          })}
        </div>

        <div className="p-8 rounded-2xl bg-gradient-to-br from-brand-50 to-brand-100/50 border border-brand-200">
          <h2 className="text-2xl font-bold text-surface-900 mb-4">Our Story</h2>
          <div className="space-y-4 text-surface-600 text-sm leading-relaxed">
            <p>Testime was founded with a simple vision: bridge the gap between aspirants and quality exam preparation resources. We recognized that students in Odisha faced unique challenges—limited access to structured study materials, lack of exam-specific practice, and no way to benchmark their performance against peers.</p>
            <p>Today, Testime serves over 10 lakh students with 25,000+ practice questions, 500+ mock tests, and comprehensive study notes covering all major Odisha government exams including OSSC, OPSSC, OPSC, SSB, and Odisha Police.</p>
            <p>Our team of educators, technologists, and former toppers works tirelessly to ensure every student has the tools they need to succeed.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
