'use client';
import Link from 'next/link';
import { useState } from 'react';
import { ChevronRight, Newspaper, Calendar, Clock, Bookmark, Share2, ArrowRight } from 'lucide-react';

const categories = ['All', 'National', 'International', 'Odisha', 'Economy', 'Science & Tech', 'Environment'];

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

export default function CurrentAffairsPage() {
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = activeCategory === 'All'
    ? articles
    : articles.filter(a => a.category === activeCategory);

  return (
    <div className="bg-white min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <nav className="flex items-center gap-1.5 text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-gray-700 font-medium">Daily Current Affairs</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-10 lg:gap-12">
          <div className="w-full lg:w-[68%] min-w-0">
            <div className="mb-10">
              <span className="inline-block text-xs font-semibold text-blue-600 uppercase tracking-wider mb-2">Stay Updated</span>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
                Daily Current Affairs
              </h1>
              <p className="text-gray-500 leading-relaxed max-w-2xl text-base">
                Stay ahead with daily curated current affairs from national, international, and Odisha-specific news relevant for competitive exams.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 mb-8">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                    activeCategory === cat
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="space-y-4 mb-10">
              {filtered.map((article) => (
                <article key={article.id} className="border border-gray-200 rounded-lg bg-white p-5 sm:p-6 transition-all hover:border-gray-300 hover:shadow-sm">
                  <div className="flex items-center gap-2.5 mb-3">
                    <span className="inline-block rounded px-2 py-0.5 text-xs font-medium bg-blue-50 text-blue-700">
                      {article.category}
                    </span>
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> {article.date}
                    </span>
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {article.readTime}
                    </span>
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-2 leading-snug">{article.title}</h2>
                  <p className="text-sm text-gray-500 leading-relaxed mb-4">{article.excerpt}</p>
                  <div className="flex items-center gap-2.5">
                    <Link href={`/current-affairs/${article.slug}`} className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
                      Read Full Article
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                    <div className="ml-auto flex items-center gap-1">
                      <button className="p-1.5 text-gray-400 hover:text-blue-600 rounded-md hover:bg-gray-100 transition-all">
                        <Bookmark className="h-4 w-4" />
                      </button>
                      <button className="p-1.5 text-gray-400 hover:text-blue-600 rounded-md hover:bg-gray-100 transition-all">
                        <Share2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <aside className="w-full lg:w-[32%]">
            <div className="lg:sticky lg:top-24 space-y-6">
              <div className="border border-gray-200 rounded-lg bg-white p-6">
                <h3 className="text-base font-semibold text-gray-900 mb-1">Daily Quiz</h3>
                <p className="text-sm text-gray-500 mb-4">Test your knowledge with current affairs based MCQs.</p>
                <button className="w-full rounded-md bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                  Start Quiz <ArrowRight className="h-4 w-4" />
                </button>
              </div>
              <div className="border border-gray-200 rounded-lg bg-white p-6">
                <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Newspaper className="h-4 w-4 text-blue-600" />
                  Monthly Compilations
                </h3>
                <ul className="space-y-1">
                  {['July 2026', 'June 2026', 'May 2026', 'April 2026'].map((month) => (
                    <li key={month}>
                      <button className="w-full flex items-center gap-3 rounded-md px-3 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-gray-50 transition-all">
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
