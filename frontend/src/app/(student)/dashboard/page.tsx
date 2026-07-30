'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/Card';
import { api } from '@/lib/api';
import { formatDate, getInitials } from '@/lib/utils';
import { BrainCircuit, BookOpen, Target, TrendingUp, ArrowRight, Clock, Flame, ChevronRight, BarChart3, Zap, GraduationCap, Sparkles, AlertTriangle, Lightbulb, Award, BookMarked } from 'lucide-react';

const suggestionIcons: Record<string, any> = { Target, Lightbulb, Award, BookOpen };

export default function StudentDashboard() {
  const [data, setData] = useState<any>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    api.getStudentDashboard().then(setData).catch(console.error);
    const u = localStorage.getItem('user');
    if (u) setUser(JSON.parse(u));
  }, []);

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-brand-500/20 animate-pulse">
            <GraduationCap className="h-7 w-7 text-white" />
          </div>
          <p className="text-surface-400 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const s = data.analytics;
  const stats = [
    { icon: BrainCircuit, label: 'Tests Attempted', value: data.stats?.totalAttempts || 0, color: 'from-violet-500 to-violet-600', badge: 'bg-violet-100 text-violet-700' },
    { icon: Target, label: 'Avg Accuracy', value: `${data.stats?.avgAccuracy || 0}%`, color: 'from-emerald-500 to-emerald-600', badge: 'bg-emerald-100 text-emerald-700' },
    { icon: BookOpen, label: 'Saved Notes', value: data.stats?.totalBookmarks || 0, color: 'from-sky-500 to-sky-600', badge: 'bg-sky-100 text-sky-700' },
    { icon: TrendingUp, label: 'Best Rank', value: `#${data.stats?.bestRank || '--'}`, color: 'from-amber-500 to-amber-600', badge: 'bg-amber-100 text-amber-700' },
  ];

  const initials = user?.name ? getInitials(user.name) : 'U';
  const maxWeeklyTests = Math.max(...(s?.weeklyProgress?.map((w: any) => w.tests) || [1]), 1);

  return (
    <div className="animate-fade-in space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-brand-500/20">
            {initials}
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-bold text-surface-900">
                Welcome back{user ? `, ${user.name}` : ''}
              </h1>
              <Sparkles className="h-5 w-5 text-amber-400" />
            </div>
            <p className="text-surface-500 text-sm">Let&apos;s pick up where you left off</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-orange-50 to-amber-50 border border-amber-200/60">
            <Flame className="h-4 w-4 text-orange-500" />
            <span className="text-sm font-bold text-orange-700">{data.progress?.streak || 0} day streak</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-50 border border-brand-200/60">
            <Zap className="h-4 w-4 text-brand-600" />
            <span className="text-sm font-bold text-brand-700">{data.progress?.thisWeek || 0} this week</span>
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.label} className="group hover:shadow-lg transition-all duration-300 border-0 overflow-hidden">
            <div className={`h-1.5 bg-gradient-to-r ${s.color}`} />
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center shadow-md`}>
                  <s.icon className="h-5 w-5 text-white" />
                </div>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${s.badge}`}>{s.label}</span>
              </div>
              <p className="text-2xl font-bold text-surface-900">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-0 shadow-sm">
            <div className="px-6 pt-6 pb-4 flex items-center justify-between border-b border-surface-100">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-lg bg-violet-100 flex items-center justify-center">
                  <BarChart3 className="h-4 w-4 text-violet-600" />
                </div>
                <h2 className="text-base font-bold text-surface-900">Recent Tests</h2>
              </div>
              <Link href="/my-tests" className="text-sm font-medium text-brand-600 hover:text-brand-700 flex items-center gap-1 transition-colors">
                View All <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="p-6">
              {data.recentAttempts?.length > 0 ? (
                <div className="space-y-2">
                  {data.recentAttempts.map((a: any, i: number) => (
                    <div key={a.id} className="flex items-center justify-between p-3.5 rounded-xl hover:bg-surface-50 transition-colors group/item">
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="h-8 w-8 rounded-lg bg-surface-100 flex items-center justify-center text-xs font-bold text-surface-400 shrink-0">{i + 1}</span>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-surface-900 truncate">{a.test?.title}</p>
                          <p className="text-xs text-surface-400">{formatDate(a.submittedAt)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 shrink-0">
                        <div className="text-right">
                          <p className="text-sm font-bold text-surface-900">{a.score}/{a.totalMarks}</p>
                          <div className="flex items-center gap-1 justify-end">
                            <span className={`text-xs font-semibold ${a.accuracy >= 80 ? 'text-emerald-600' : a.accuracy >= 60 ? 'text-amber-600' : 'text-red-500'}`}>
                              {Math.round(a.accuracy || 0)}%
                            </span>
                            <div className="w-12 h-1.5 rounded-full bg-surface-200 overflow-hidden">
                              <div className={`h-full rounded-full ${a.accuracy >= 80 ? 'bg-emerald-500' : a.accuracy >= 60 ? 'bg-amber-500' : 'bg-red-400'}`} style={{ width: `${a.accuracy}%` }} />
                            </div>
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-surface-300 group-hover/item:text-brand-500 transition-colors" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <div className="h-14 w-14 rounded-2xl bg-surface-100 flex items-center justify-center mx-auto mb-4">
                    <BrainCircuit className="h-7 w-7 text-surface-300" />
                  </div>
                  <p className="text-sm text-surface-500 mb-4 font-medium">No tests attempted yet</p>
                  <Link href="/test-series">
                    <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:text-brand-700 transition-colors">
                      Try a Free Test <ArrowRight className="h-4 w-4" />
                    </span>
                  </Link>
                </div>
              )}
            </div>
          </Card>

          <Card className="border-0 shadow-sm">
            <div className="px-6 pt-6 pb-4 flex items-center justify-between border-b border-surface-100">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-emerald-600" />
                </div>
                <h2 className="text-base font-bold text-surface-900">Weekly Activity</h2>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-brand-500" />
                  <span className="text-surface-400">Tests</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                  <span className="text-surface-400">Accuracy</span>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-end justify-between gap-3 h-40">
                {s?.weeklyProgress?.map((w: any) => (
                  <div key={w.day} className="flex flex-col items-center gap-2 flex-1">
                    <span className="text-xs font-semibold text-surface-400">{w.accuracy > 0 ? `${w.accuracy}%` : ''}</span>
                    <div className="flex flex-col items-center gap-1 w-full h-24 justify-end">
                      <div
                        className="w-full max-w-[28px] rounded-t-md bg-gradient-to-t from-emerald-400 to-emerald-300 transition-all"
                        style={{ height: `${w.accuracy}%`, opacity: w.accuracy > 0 ? 1 : 0.2 }}
                      />
                      <div
                        className="w-full max-w-[28px] rounded-t-md bg-gradient-to-t from-brand-500 to-brand-400 transition-all"
                        style={{ height: `${(w.tests / maxWeeklyTests) * 100}%`, opacity: w.tests > 0 ? 1 : 0.2 }}
                      />
                    </div>
                    <span className="text-xs font-medium text-surface-500">{w.day}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          <Card className="border-0 shadow-sm">
            <div className="px-6 pt-6 pb-4 border-b border-surface-100">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-lg bg-amber-100 flex items-center justify-center">
                  <Target className="h-4 w-4 text-amber-600" />
                </div>
                <h2 className="text-base font-bold text-surface-900">Subject-wise Performance</h2>
              </div>
            </div>
            <div className="p-6 space-y-4">
              {s?.subjectPerformance?.map((sub: any) => (
                <div key={sub.subject}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium text-surface-700">{sub.subject}</span>
                    <span className={`text-xs font-bold ${sub.accuracy >= 80 ? 'text-emerald-600' : sub.accuracy >= 70 ? 'text-amber-600' : 'text-red-500'}`}>
                      {sub.accuracy}%
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-surface-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${sub.accuracy >= 80 ? 'bg-gradient-to-r from-emerald-400 to-emerald-500' : sub.accuracy >= 70 ? 'bg-gradient-to-r from-amber-400 to-amber-500' : 'bg-gradient-to-r from-red-400 to-red-500'}`}
                      style={{ width: `${sub.accuracy}%` }}
                    />
                  </div>
                  <p className="text-xs text-surface-400 mt-0.5">{sub.testsTaken} tests taken</p>
                </div>
              ))}
            </div>
            <div className="px-6 pb-6 grid grid-cols-2 gap-4">
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-100">
                <p className="text-xs font-semibold text-emerald-700 mb-1.5">Strong Areas</p>
                <div className="flex flex-wrap gap-1.5">
                  {s?.strongAreas?.map((a: string) => (
                    <span key={a} className="text-xs bg-emerald-200/60 text-emerald-800 px-2 py-0.5 rounded-md font-medium">{a}</span>
                  ))}
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-100">
                <p className="text-xs font-semibold text-red-700 mb-1.5">Needs Improvement</p>
                <div className="flex flex-wrap gap-1.5">
                  {s?.weakAreas?.map((a: string) => (
                    <span key={a} className="text-xs bg-red-200/60 text-red-800 px-2 py-0.5 rounded-md font-medium">{a}</span>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-0 shadow-sm">
            <div className="p-6">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="h-8 w-8 rounded-lg bg-amber-100 flex items-center justify-center">
                  <Clock className="h-4 w-4 text-amber-600" />
                </div>
                <h2 className="text-base font-bold text-surface-900">Upcoming</h2>
              </div>
              {data.upcomingTests?.length > 0 ? (
                <div className="space-y-3">
                  {data.upcomingTests.map((t: any, i: number) => (
                    <div key={i} className="p-3.5 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100">
                      <p className="text-sm font-semibold text-surface-900 mb-1">{t.title}</p>
                      <p className="text-xs text-amber-600 font-medium flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {formatDate(t.scheduledAt)}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-surface-400 text-center py-6">No upcoming tests</p>
              )}
            </div>
          </Card>

          <Card className="border-0 shadow-sm bg-gradient-to-br from-brand-500 to-brand-700 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
            <div className="p-6 relative">
              <div className="h-10 w-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-bold mb-1">Quick Practice</h3>
              <p className="text-sm text-white/80 mb-5 leading-relaxed">Take a quick 15-min daily quiz to keep your preparation on track.</p>
              <Link href="/test-series">
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold bg-white/20 backdrop-blur-sm hover:bg-white/30 px-4 py-2.5 rounded-xl transition-all">
                  Start Now <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            </div>
          </Card>

          <Card className="border-0 shadow-sm">
            <div className="p-6">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="h-8 w-8 rounded-lg bg-brand-100 flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-brand-600" />
                </div>
                <h2 className="text-base font-bold text-surface-900">Recommended</h2>
              </div>
              {data.recommendedTests?.length > 0 ? (
                <div className="space-y-2">
                  {data.recommendedTests.map((t: any) => (
                    <div key={t.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-surface-50 transition-colors">
                      <div>
                        <p className="text-sm font-semibold text-surface-900">{t.title}</p>
                        <p className="text-xs text-surface-400">{t.duration} min &bull; Free</p>
                      </div>
                      <Link href="/test-series">
                        <span className="text-xs font-semibold text-brand-600 hover:text-brand-700 transition-colors">Start</span>
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-surface-400 text-center py-6">No recommendations</p>
              )}
            </div>
          </Card>

          <Card className="border-0 shadow-sm">
            <div className="px-6 pt-6 pb-4 border-b border-surface-100">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-lg bg-purple-100 flex items-center justify-center">
                  <Lightbulb className="h-4 w-4 text-purple-600" />
                </div>
                <h2 className="text-base font-bold text-surface-900">Insights</h2>
              </div>
            </div>
            <div className="p-6 space-y-3">
              {data.suggestions?.map((sg: any, i: number) => {
                const Icon = suggestionIcons[sg.icon] || Lightbulb;
                const borderMap: Record<string, string> = { warning: 'border-l-amber-400 bg-amber-50/50', tip: 'border-l-brand-400 bg-brand-50/50', achievement: 'border-l-emerald-400 bg-emerald-50/50', info: 'border-l-sky-400 bg-sky-50/50' };
                const colorMap: Record<string, string> = { warning: 'text-amber-700', tip: 'text-brand-700', achievement: 'text-emerald-700', info: 'text-sky-700' };
                return (
                  <div key={i} className={`p-3.5 rounded-xl border-l-4 ${borderMap[sg.type] || borderMap.info}`}>
                    <div className="flex items-start gap-2.5">
                      <Icon className={`h-4 w-4 mt-0.5 shrink-0 ${colorMap[sg.type] || colorMap.info}`} />
                      <div>
                        <p className="text-xs text-surface-600 leading-relaxed">{sg.message}</p>
                        {sg.action && sg.link && (
                          <Link href={sg.link} className="inline-block mt-1.5 text-xs font-semibold text-brand-600 hover:text-brand-700 transition-colors">
                            {sg.action} <ArrowRight className="h-3 w-3 inline" />
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
