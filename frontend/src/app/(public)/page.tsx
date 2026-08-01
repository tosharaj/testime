'use client';
import Link from 'next/link';
import { BookOpen, BrainCircuit, TrendingUp, Users, Award, ArrowRight, ChevronRight, Sparkles, CheckCircle, Target, BarChart3, Star, Shield, Zap, GraduationCap, Quote } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import CrayonStick from '@/components/ui/CrayonStick';
import { crayon, type Crayon } from '@/lib/crayon';
import { examCategories } from '@/lib/examCategories';
import ExamCategoryIcon from '@/components/icons/ExamCategoryIcon';

const stats = [
  { value: '10,00,000+', label: 'Students', icon: Users, c: crayon(5) },
  { value: '25,000+', label: 'Questions', icon: BrainCircuit, c: crayon(2) },
  { value: '5,000+', label: 'Notes', icon: BookOpen, c: crayon(1) },
  { value: '500+', label: 'Mock Tests', icon: TrendingUp, c: crayon(3) },
];

const features = [
  { image: '/images/notes.png', title: 'Curated Study Notes', desc: 'Well-organized notes by topic and exam. Download or read online — built for Odisha exams.', c: crayon(5) },
  { image: '/images/bank.png', title: 'Massive Question Bank', desc: 'Practice 25,000+ questions including PYQs with detailed step-by-step explanations.', c: crayon(1) },
  { image: '/images/mock_test.png', title: 'Realistic Mock Tests', desc: 'Exam simulation with timer, negative marking & All-Odisha ranking for real competition.', c: crayon(0) },
  { image: '/images/smart_analytics.png', title: 'Smart Analytics', desc: 'Track accuracy, speed, and topic-wise weaknesses with detailed performance insights.', c: crayon(3) },
  { image: '/images/ranking.png', title: 'All-Odisha Ranking', desc: 'See where you stand among thousands of aspirants from across the state.', c: crayon(2) },
  { image: '/images/premium.png', title: 'Premium Content', desc: 'Unlock advanced notes, topic tests & full-length mocks designed by exam experts.', c: crayon(4) },
];

const testimonials = [
  { quote: 'Testime transformed my preparation. The mock tests and analytics helped me identify weak areas and improve drastically.', name: 'Rahul Sharma', role: 'OSSC CGL Topper 2024', c: crayon(5) },
  { quote: 'The quality of study notes is exceptional. I cleared my OSSSC exam in first attempt thanks to Testime.', name: 'Priya Patel', role: 'OSSSC RI 2024', c: crayon(3) },
  { quote: 'Best platform for Odisha exam preparation. The all-Odisha ranking kept me motivated throughout.', name: 'Amit Kumar', role: 'OPSC Aspirant', c: crayon(2) },
];

const categoryColor: Record<string, Crayon> = {
  ossc: crayon(5),
  osssc: crayon(3),
  opsc: crayon(1),
  ssb: crayon(4),
  'odisha-police': crayon(0),
  'odisha-teaching': crayon(2),
  'odisha-universities': crayon(3),
  other: crayon(1),
};

export default function HomePage() {
  return (
    <div className="overflow-hidden">
      {/* ───── HERO ───── */}
      <section className="relative overflow-hidden border-b-2 border-surface-200/60 bg-[#FFFBFA]">
        <div
          className="absolute inset-0 opacity-60"
          style={{ backgroundImage: 'radial-gradient(circle, rgba(239,97,80,0.12) 0.6px, transparent 0.6px)', backgroundSize: '22px 22px' }}
        />
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-coral-200/40 blur-3xl" />
        <div className="absolute bottom-20 left-20 h-96 w-96 rounded-full bg-lavender-200/30 blur-3xl" />
        <div className="absolute top-40 left-1/4 h-64 w-64 rounded-full bg-sunny-200/40 blur-3xl" />

        <div className="pointer-events-none absolute right-8 top-1/2 hidden -translate-y-1/2 items-end gap-2 lg:flex xl:right-16">
          <CrayonStick c={crayon(0)} height={84} tilt={-8} delay={0} />
          <CrayonStick c={crayon(5)} height={108} tilt={6} delay={0.4} />
          <CrayonStick c={crayon(2)} height={92} tilt={-4} delay={0.8} />
          <CrayonStick c={crayon(3)} height={124} tilt={9} delay={1.2} />
          <CrayonStick c={crayon(1)} height={76} tilt={-10} delay={0.6} />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-20 lg:py-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border-2 border-surface-200 bg-white/80 backdrop-blur-sm px-4 py-1.5 text-xs font-bold text-brand-700 mb-6 animate-fade-in-down shadow-sm">
              <Sparkles className="h-3.5 w-3.5 text-sunny-500" />
              Odisha&apos;s #1 Exam Prep Platform
            </div>
            <h1 className="section-heading text-surface-900 mb-5 animate-fade-in-up">
              Ace Your Exams with{' '}
              <span className="bg-gradient-to-r from-coral-500 via-sunny-500 to-mint-500 bg-clip-text text-transparent">Confidence</span>
            </h1>
            <p className="section-subheading mb-8 text-balance !mx-0 !max-w-xl">
              Access high-quality study notes, practice thousands of questions, and take realistic mock tests for OSSC, OSSSC, OPSC, SSB & more.
            </p>
            <div className="flex flex-col sm:flex-row items-start gap-3 animate-fade-in-up">
              <Link href="/register">
                <Button variant="primary-gradient" size="lg" className="rounded-full">
                  Get Started Free
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/exams">
                <Button variant="outline" size="lg" className="rounded-full bg-white">
                  Browse Exams
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="flex items-center gap-6 mt-8 text-sm text-surface-500 animate-fade-in">
              <span className="flex items-center gap-1.5"><CheckCircle className="h-4 w-4 text-mint-500" /> Free access</span>
              <span className="flex items-center gap-1.5"><CheckCircle className="h-4 w-4 text-mint-500" /> No credit card</span>
              <span className="flex items-center gap-1.5"><CheckCircle className="h-4 w-4 text-mint-500" /> Cancel anytime</span>
            </div>
          </div>
        </div>
      </section>

      {/* ───── STATS ───── */}
      <section className="relative -mt-8 z-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((s) => {
              const Icon = s.icon;
              return (
                <Card key={s.label} color={s.c.name} variant="raised" className="rounded-3xl">
                  <CardContent className="p-5 text-center">
                    <div className={`inline-flex items-center justify-center h-11 w-11 rounded-2xl ${s.c.body} text-white shadow-md mb-3`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <p className="font-display text-2xl font-bold text-surface-900">{s.value}</p>
                    <p className="text-sm text-surface-500">{s.label}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* ───── EXAM CATEGORIES ───── */}
      <section className="py-20 lg:py-24 bg-[#FFFBFA]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 border-2 border-brand-200/60 px-3 py-1 text-xs font-bold text-brand-600 mb-4">
              <GraduationCap className="h-3.5 w-3.5" />
              Choose Your Path
            </div>
            <h2 className="section-heading text-surface-900 mb-3">Your Target Exam Awaits</h2>
            <p className="section-subheading">Comprehensive preparation for all Odisha government exams under one roof</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {examCategories.map((exam, i) => {
              const c = categoryColor[exam.slug] || crayon(i);
              return (
                <Link key={exam.slug} href={`/exams/${exam.slug}`} className="group">
                  <Card color={c.name} className={`h-full ${c.hoverText}`}>
                    <CardContent className="p-5 flex flex-col items-center text-center">
                      <div className="mb-3 group-hover:scale-110 transition-transform duration-300 ease-out">
                        <ExamCategoryIcon exam={exam.slug} />
                      </div>
                      <h3 className={`font-display font-bold text-surface-900 ${c.hoverText}`}>{exam.name}</h3>
                      <p className={`text-xs font-semibold mt-1 ${c.text}`}>{exam.examCount} Exams</p>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ───── FEATURES ───── */}
      <section className="py-20 lg:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-ocean-50 border-2 border-ocean-200/60 px-3 py-1 text-xs font-bold text-ocean-600 mb-4">
              <Zap className="h-3.5 w-3.5" />
              Everything You Need
            </div>
            <h2 className="section-heading text-surface-900 mb-3">Built for Exam Excellence</h2>
            <p className="section-subheading">Comprehensive preparation tools designed for Odisha competitive exams</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <Card key={f.title} color={f.c.name} className="group">
                <CardContent className="relative text-center">
                  <div className={`h-12 w-12 rounded-xl ${f.c.soft} flex items-center justify-center mb-4 p-2 mx-auto border-2 ${f.c.border}`}>
                    <img src={f.image} alt={f.title} className="h-full w-full object-contain" />
                  </div>
                  <h3 className={`font-display font-bold text-surface-900 mb-2 ${f.c.hoverText}`}>{f.title}</h3>
                  <p className="text-sm text-surface-500 leading-relaxed">{f.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ───── TESTIMONIALS ───── */}
      <section className="py-20 lg:py-24 bg-[#FFFBFA] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-coral-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-sunny-50 border-2 border-sunny-200/60 px-3 py-1 text-xs font-bold text-sunny-600 mb-4">
              <Quote className="h-3.5 w-3.5" />
              Trusted by Thousands
            </div>
            <h2 className="section-heading text-surface-900 mb-3">Success Stories</h2>
            <p className="section-subheading">Hear from students who achieved their dreams with Testime</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <Card key={i} color={t.c.name} variant="raised" className="relative">
                <CardContent className="p-6">
                  <div className="flex gap-1 mb-4">
                    {[1,2,3,4,5].map((j) => (
                      <Star key={j} className="h-4 w-4 fill-sunny-400 text-sunny-400" />
                    ))}
                  </div>
                  <p className="text-sm text-surface-600 leading-relaxed mb-5 italic">&ldquo;{t.quote}&rdquo;</p>
                  <div className="flex items-center gap-3 pt-4 border-t border-surface-100">
                    <div className={`h-10 w-10 rounded-full ${t.c.body} flex items-center justify-center text-sm font-bold text-white shadow-md`}>
                      {t.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-surface-900">{t.name}</p>
                      <p className="text-xs text-surface-400">{t.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ───── CTA ───── */}
      <section className="relative overflow-hidden bg-gradient-cta py-20 lg:py-24">
        <div className="absolute inset-0 dot-bg opacity-[0.05]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/10 rounded-full blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/15 border border-white/20 px-4 py-1.5 text-xs font-medium text-white mb-6 backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5 text-sunny-300" />
            Start Your Journey Today
          </div>
          <h2 className="section-heading text-white mb-4">Ready to Ace Your Exams?</h2>
          <p className="text-white/80 text-lg max-w-lg mx-auto mb-8 leading-relaxed">
            Join 10,00,000+ students taking the first step towards their dream career
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/pricing">
              <Button size="lg" className="rounded-full bg-white text-brand-700 hover:bg-brand-50 shadow-lg">
                View Plans
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="outline" size="lg" className="rounded-full border-white/40 text-white hover:bg-white/10 hover:border-white/60">
                Create Free Account
              </Button>
            </Link>
          </div>
          <div className="flex items-center justify-center gap-6 mt-8 text-xs text-white/70">
            <span className="flex items-center gap-1.5"><Shield className="h-3.5 w-3.5" /> Secure payment</span>
            <span className="flex items-center gap-1.5"><CheckCircle className="h-3.5 w-3.5" /> Cancel anytime</span>
            <span className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5" /> 30-day refund</span>
          </div>
        </div>
      </section>
    </div>
  );
}
