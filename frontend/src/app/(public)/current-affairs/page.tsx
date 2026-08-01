'use client';
import Link from 'next/link';
import { useState } from 'react';
import { ChevronRight, Newspaper, Calendar, Clock, Bookmark, Share2, ArrowRight, Sparkles } from 'lucide-react';
import CrayonStick from '@/components/ui/CrayonStick';
import { crayon, type Crayon } from '@/lib/crayon';

const categories = ['All', 'National', 'International', 'Odisha', 'Economy', 'Science & Tech', 'Environment'];

const categoryColor: Record<string, Crayon> = {
  National: crayon(5),
  International: crayon(1),
  Odisha: crayon(0),
  Economy: crayon(3),
  'Science & Tech': crayon(4),
  Environment: crayon(2),
};

const categoryIconMap: Record<string, { src: string; icon: string; bg: string }> = {
  National: { src: '/images/national.png', icon: '🇮🇳', bg: 'bg-brand-50' },
  International: { src: '/images/international.png', icon: '🌍', bg: 'bg-ocean-50' },
  Odisha: { src: '/images/odisha_govt.png', icon: '🏛️', bg: 'bg-coral-50' },
  Economy: { src: '/images/economy.png', icon: '📈', bg: 'bg-mint-50' },
  'Science & Tech': { src: '/images/science_tech.png', icon: '🚀', bg: 'bg-lavender-50' },
  Environment: { src: '/images/environment.png', icon: '🌱', bg: 'bg-sunny-50' },
};

const articles = [
  {
    id: 1, slug: 'odisha-cabinet-approves-major-infrastructure-projects', title: 'Odisha Cabinet Approves Major Infrastructure Projects', category: 'Odisha', date: '27 Jul 2026',
    excerpt: 'The Odisha Cabinet has approved 15 major infrastructure projects worth ₹8,500 crore across sectors including road, health, and education.',
    content: 'The Odisha Cabinet, chaired by Chief Minister, has given its approval to 15 major infrastructure projects with a total investment of ₹8,500 crore. These projects span across critical sectors including road infrastructure, healthcare facilities, and educational institutions.\n\nAmong the key approvals are the construction of four new medical colleges in underserved districts, a 200-km highway corridor connecting southern Odisha, and the modernization of 50 government schools under the "Odisha Education Transformation Mission."\n\nThe Cabinet also approved the establishment of a dedicated "Green Energy Corridor" to facilitate the transmission of renewable energy from coastal wind farms to industrial hubs in western Odisha. This project is expected to attract private investment of over ₹2,000 crore and create 5,000 new jobs.\n\nAdditionally, a special package for the KBK region (Kalahandi, Balangir, and Koraput) was announced, focusing on drinking water supply and irrigation projects to address the long-standing drought issues in these districts.',
    readTime: '3 min',
  },
  {
    id: 2, slug: 'india-and-asean-sign-new-trade-agreement', title: 'India and ASEAN Sign New Trade Agreement', category: 'International', date: '26 Jul 2026',
    excerpt: 'India and ASEAN nations have signed a comprehensive economic partnership agreement aimed at boosting bilateral trade by 25% over the next five years.',
    content: 'India and the ASEAN (Association of Southeast Asian Nations) bloc have signed a landmark Comprehensive Economic Partnership Agreement (CEPA) that is expected to boost bilateral trade by 25% over the next five years.\n\nThe agreement, signed after two years of negotiations, covers tariff reductions on over 5,000 products, streamlined customs procedures, and enhanced cooperation in digital trade, services, and investment.\n\nKey highlights include the elimination of import duties on 65% of traded goods immediately, with a phased reduction on an additional 20% over the next five years. Sectors such as pharmaceuticals, IT services, textiles, and agricultural products are expected to benefit significantly.\n\nPrime Minister described the pact as a "win-win" for all parties, emphasizing India\'s commitment to the "Act East" policy. ASEAN Secretary-General called it a "milestone" in India-ASEAN relations, which have grown from US$80 billion in trade in 2020 to over US$130 billion in 2025.',
    readTime: '4 min',
  },
  {
    id: 3, slug: 'rbi-keeps-repo-rate-unchanged', title: 'RBI Keeps Repo Rate Unchanged at 6.25%', category: 'Economy', date: '25 Jul 2026',
    excerpt: 'The Reserve Bank of India has maintained the repo rate at 6.25% for the third consecutive policy review, citing stable inflation.',
    content: 'The Reserve Bank of India (RBI) has decided to keep the repo rate unchanged at 6.25% for the third consecutive monetary policy review, maintaining its "neutral" stance.\n\nThe decision comes as retail inflation remains within the RBI\'s target range of 4-6%, with the latest CPI reading at 4.8%. The Monetary Policy Committee (MPC) voted 4-2 in favor of maintaining the status quo, with two members advocating for a 25 basis point cut to support growth.\n\nRBI Governor stated that while inflation is moderating, the central bank remains cautious about global uncertainties, including volatile crude oil prices and geopolitical tensions. The GDP growth projection for FY 2026-27 was retained at 6.8%.\n\nExperts believe the RBI may consider rate cuts in the latter half of the fiscal year if inflation continues to trend downward. The next MPC meeting is scheduled for October 2026.',
    readTime: '3 min',
  },
  {
    id: 4, slug: 'isro-launches-earth-observation-satellite', title: 'ISRO Successfully Launches Earth Observation Satellite', category: 'Science & Tech', date: '24 Jul 2026',
    excerpt: 'ISRO\'s latest Earth observation satellite was successfully placed in orbit, promising enhanced capabilities for weather forecasting and disaster management.',
    content: 'The Indian Space Research Organisation (ISRO) has successfully launched its latest Earth observation satellite, EOS-06, from the Satish Dhawan Space Centre in Sriharikota.\n\nThe satellite was placed into a sun-synchronous polar orbit approximately 720 km above Earth by the Polar Satellite Launch Vehicle (PSLV-C62). This marks ISRO\'s 95th successful launch mission.\n\nEOS-06 is equipped with advanced imaging sensors capable of capturing high-resolution images in 12 spectral bands, enabling precise monitoring of agricultural patterns, forest cover changes, urban expansion, and oceanic conditions. The satellite has a design life of seven years.\n\nISRO Chairman highlighted that the satellite\'s data will be crucial for improving weather forecasting accuracy, enabling early warning systems for cyclones in the Bay of Bengal, and supporting disaster management efforts across the country.\n\nThe launch was watched by thousands of space enthusiasts who had gathered at the viewing gallery in Sriharikota.',
    readTime: '5 min',
  },
  {
    id: 5, slug: 'odisha-launches-climate-action-plan', title: 'Odisha Launches State Climate Action Plan 2.0', category: 'Odisha', date: '23 Jul 2026',
    excerpt: 'The Odisha government has launched an updated climate action plan focusing on renewable energy, coastal protection, and sustainable agriculture.',
    content: 'The Odisha government has unveiled the "Odisha State Climate Action Plan 2.0," an updated roadmap to address the growing challenges of climate change in the state.\n\nThe plan, which builds on the first action plan implemented between 2018-2025, sets ambitious targets including a 40% reduction in carbon emissions by 2035, increasing renewable energy capacity to 15 GW, and achieving 30% green cover across the state.\n\nCoastal protection is a major focus area, with the plan allocating ₹3,200 crore for mangrove restoration, construction of sea walls in vulnerable areas like Puri and Paradip, and developing climate-resilient fishing communities.\n\nIn the agriculture sector, the plan promotes climate-resilient crop varieties, micro-irrigation systems, and weather-based crop insurance for small and marginal farmers. The government will also establish a "Climate Innovation Fund" with an initial corpus of ₹500 crore to support startups working on climate solutions.',
    readTime: '4 min',
  },
  {
    id: 6, slug: 'supreme-court-landmark-judgment-fundamental-rights', title: 'Supreme Court Issues Landmark Judgment on Fundamental Rights', category: 'National', date: '22 Jul 2026',
    excerpt: 'The Supreme Court has delivered a landmark judgment expanding the scope of fundamental rights in the digital age.',
    content: 'The Supreme Court of India delivered a landmark judgment on Thursday, expanding the interpretation of fundamental rights under Article 21 (Right to Life and Personal Liberty) to include the "Right to Digital Privacy" and "Right to be Forgotten."\n\nA nine-judge Constitution Bench, in a 7-2 majority verdict, ruled that the right to privacy extends to the digital realm, including personal data, online communications, and digital footprints. The court held that any state surveillance must pass the tests of legality, necessity, and proportionality.\n\nThe judgment also recognized the "Right to be Forgotten" as a facet of the right to privacy, allowing individuals to request the removal of outdated or irrelevant personal information from online platforms, subject to reasonable restrictions.\n\nChief Justice of India, reading the lead opinion, stated that "in the digital age, privacy is not just about seclusion but about autonomy over one\'s digital identity." The court directed the central government to expedite the enactment of a comprehensive data protection framework.\n\nLegal experts have hailed the judgment as "historic" and comparable to the landmark 2017 privacy judgment.',
    readTime: '6 min',
  },
];

function CategoryIcon({ category }: { category: string }) {
  const meta = categoryIconMap[category];
  const [hasImage, setHasImage] = useState(true);
  if (!meta) return null;
  if (!hasImage) {
    return (
      <span className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-lg ${meta.bg}`}>
        {meta.icon}
      </span>
    );
  }
  return (
    <img
      src={meta.src}
      alt={category}
      onError={() => setHasImage(false)}
      className="h-9 w-9 shrink-0 rounded-lg object-contain bg-surface-50"
    />
  );
}

export default function CurrentAffairsPage() {
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = activeCategory === 'All'
    ? articles
    : articles.filter(a => a.category === activeCategory);

  return (
    <div className="bg-white min-h-screen animate-fade-in">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <nav className="flex items-center gap-1.5 text-sm text-surface-400 mb-8">
          <Link href="/" className="hover:text-brand-600 transition-colors">Home</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-surface-600 font-medium">Daily Current Affairs</span>
        </nav>

        {/* Crayon hero */}
        <div className="relative mb-10 overflow-hidden rounded-4xl bg-[#FFFBFA] border-2 border-surface-200/70 p-8 lg:p-10">
          <div
            className="absolute inset-0 opacity-60"
            style={{ backgroundImage: 'radial-gradient(circle, rgba(239,97,80,0.12) 0.6px, transparent 0.6px)', backgroundSize: '22px 22px' }}
          />
          <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-sunny-200/40 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-lavender-200/40 blur-3xl" />
          <div className="pointer-events-none absolute right-6 top-1/2 hidden -translate-y-1/2 items-end gap-2 lg:flex xl:right-12">
            <CrayonStick c={crayon(5)} height={72} tilt={-8} delay={0} />
            <CrayonStick c={crayon(0)} height={96} tilt={6} delay={0.4} />
            <CrayonStick c={crayon(3)} height={80} tilt={-4} delay={0.8} />
            <CrayonStick c={crayon(2)} height={108} tilt={9} delay={1.2} />
          </div>
          <div className="relative max-w-2xl">
            <div className="inline-flex items-center gap-1.5 rounded-full border-2 border-surface-200 bg-white/80 px-3 py-1 text-xs font-bold text-brand-600 mb-4 shadow-sm">
              <Sparkles className="h-3.5 w-3.5" />
              Stay Updated
            </div>
            <h1 className="font-display text-3xl lg:text-5xl font-bold text-surface-900 mb-3 leading-tight">
              Daily Current <span className="bg-gradient-to-r from-coral-500 via-sunny-500 to-mint-500 bg-clip-text text-transparent">Affairs</span>
            </h1>
            <p className="text-surface-500 text-base lg:text-lg leading-relaxed max-w-2xl">
              Stay ahead with daily curated current affairs from national, international, and Odisha-specific news relevant for competitive exams.
            </p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-10 lg:gap-12">
          <div className="w-full lg:w-[68%] min-w-0">
            <div className="flex flex-wrap gap-2 mb-8">
              {categories.map(cat => {
                const c = cat === 'All' ? crayon(5) : categoryColor[cat];
                const isActive = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`rounded-full border-2 px-4 py-1.5 text-sm font-semibold transition-all ${
                      isActive ? `${c.body} border-transparent text-white shadow-md` : 'border-surface-200 bg-white text-surface-600 hover:border-surface-300 hover:text-surface-800'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            <div className="space-y-4 mb-10">
              {filtered.map((article) => {
                const c = categoryColor[article.category] || crayon(5);
                return (
                  <article key={article.id} className={`relative overflow-hidden rounded-2xl border-2 ${c.border} bg-white p-5 sm:p-6 transition-all hover:-translate-y-0.5 hover:shadow-lg ${c.hoverBorder} ${c.hoverShadow}`}>
                    <div className={`absolute inset-x-0 top-0 h-2 ${c.body}`} />
                    <div className="flex items-center gap-2.5 mb-3">
                      <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-bold ${c.chip} ${c.chipText}`}>
                        {article.category}
                      </span>
                      <span className="text-xs text-surface-400 flex items-center gap-1">
                        <Calendar className="h-3 w-3" /> {article.date}
                      </span>
                      <span className="text-xs text-surface-400 flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {article.readTime}
                      </span>
                    </div>
                    <div className="flex items-start gap-3 mb-2">
                      <CategoryIcon category={article.category} />
                      <h2 className={`font-display text-lg font-bold text-surface-900 mb-2 leading-snug ${c.hoverText}`}>{article.title}</h2>
                    </div>
                    <p className="text-sm text-surface-500 leading-relaxed mb-4">{article.excerpt}</p>
                    <div className="flex items-center gap-2.5">
                      <Link href={`/current-affairs/${article.slug}`} className={`inline-flex items-center gap-1.5 text-sm font-bold ${c.text} hover:underline transition-colors`}>
                        Read Full Article
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                      <div className="ml-auto flex items-center gap-1">
                        <button className={`p-1.5 text-surface-400 hover:text-brand-600 rounded-lg hover:bg-surface-100 transition-all`}>
                          <Bookmark className="h-4 w-4" />
                        </button>
                        <button className={`p-1.5 text-surface-400 hover:text-brand-600 rounded-lg hover:bg-surface-100 transition-all`}>
                          <Share2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

          <aside className="w-full lg:w-[32%]">
            <div className="lg:sticky lg:top-24 space-y-6">
              <div className="rounded-2xl border-2 border-surface-200 bg-white p-6 shadow-card">
                <h3 className="font-display text-base font-bold text-surface-900 mb-1">Daily Quiz</h3>
                <p className="text-sm text-surface-500 mb-4">Test your knowledge with current affairs based MCQs.</p>
                <button className="w-full rounded-xl bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-600 transition-colors flex items-center justify-center gap-2 shadow-md shadow-brand-500/25">
                  Start Quiz <ArrowRight className="h-4 w-4" />
                </button>
              </div>
              <div className="relative overflow-hidden rounded-2xl border-2 border-surface-200 bg-white p-6 shadow-card">
                <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-coral-500 via-sunny-500 to-mint-500" />
                <h3 className="font-display text-base font-bold text-surface-900 mb-4 flex items-center gap-2">
                  <Newspaper className="h-4 w-4 text-brand-600" />
                  Monthly Compilations
                </h3>
                <ul className="space-y-1">
                  {['July 2026', 'June 2026', 'May 2026', 'April 2026'].map((month) => (
                    <li key={month}>
                      <button className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-surface-600 hover:text-brand-600 hover:bg-surface-50 transition-all">
                        {month} Monthly Digest
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
