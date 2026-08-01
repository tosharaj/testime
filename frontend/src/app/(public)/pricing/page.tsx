'use client';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Check, ArrowRight, Shield, Sparkles } from 'lucide-react';

const plans = [
  {
    id: 'free',
    name: 'Free',
    description: 'Get started with basic access to practice materials.',
    price: 0,
    durationDays: null,
    features: [
      'Access to 10+ free mock tests',
      'Basic performance analytics',
      'Community forum access',
      'Daily current affairs quiz',
      'Limited question bank access',
    ],
    cta: 'Get Started',
    variant: 'outline' as const,
  },
  {
    id: 'plus-monthly',
    name: 'Plus Monthly',
    description: 'Extended access with advanced practice and insights.',
    price: 249,
    durationDays: 30,
    features: [
      'Everything in Free, plus:',
      'Access to 200+ mock tests',
      'All PYQ tests and sectional quizzes',
      'Detailed performance analytics & insights',
      'Ad-free experience',
      'All Odisha exams covered (OSSC, OSSSC, OPSC, etc.)',
      'Downloadable answer keys & solutions',
    ],
    cta: 'Subscribe Now',
    variant: 'primary' as const,
  },

];

export default function PricingPage() {
  return (
    <div className="py-16 lg:py-24 animate-fade-in bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border-2 border-surface-200 bg-white px-4 py-1.5 text-sm font-bold text-sunny-700 mb-6 shadow-sm">
            <Sparkles className="h-4 w-4 text-sunny-500" />
            Unlock Premium Features
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-surface-900 mb-4 tracking-tight">
            Choose Your{' '}
            <span className="bg-gradient-to-r from-coral-500 via-sunny-500 to-mint-500 bg-clip-text text-transparent">Plan</span>
          </h1>
          <p className="text-surface-500 text-lg max-w-xl mx-auto">
            Unlock full access to test series, premium notes, and advanced analytics for all Odisha exams.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto items-start">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              color={plan.price === 0 ? 'ocean' : 'brand'}
              className="relative"
            >
              <CardContent className="p-7">
                <h3 className="text-xl font-bold text-surface-900 mb-2">{plan.name}</h3>
                <p className="text-sm text-surface-500 mb-5">{plan.description}</p>

                <div className="mb-6">
                  <span className="text-4xl sm:text-5xl font-bold text-surface-900">
                    {plan.price === 0 ? 'Free' : `₹${plan.price}`}
                  </span>
                  {plan.price > 0 && (
                    <span className="text-sm text-surface-400 ml-2">/ month</span>
                  )}
                  {plan.durationDays && (
                    <p className="text-sm text-surface-400 mt-1.5">
                      Billed monthly &bull; Cancel anytime
                    </p>
                  )}
                </div>

                <ul className="space-y-3 mb-7">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-surface-600">
                      <Check className="h-5 w-5 text-mint-500 mt-0.5 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>

                <Link href={plan.price === 0 ? '/register' : `/register?plan=${plan.id}`}>
                  <Button className="w-full" variant={plan.price === 0 ? 'outline' : 'primary'}>
                    {plan.cta}
                    <ArrowRight className="h-4 w-4 ml-1.5" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 text-sm text-surface-400">
            <Shield className="h-4 w-4" />
            Secure payment &bull; Cancel anytime &bull; No questions asked refund
          </div>
        </div>
      </div>
    </div>
  );
}
