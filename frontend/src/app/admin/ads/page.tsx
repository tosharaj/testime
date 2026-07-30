'use client';
import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { Plus, Edit2, Trash2, Image } from 'lucide-react';

export default function AdminAdsPage() {
  const [ads, setAds] = useState<any[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('http://localhost:4000/api/ads', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(r => r.json()).then(setAds).catch(console.error);
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-surface-900">Ad Placements</h1>
        <Button><Plus className="h-4 w-4 mr-1" /> Add Ad</Button>
      </div>

      {ads.length === 0 && (
        <div className="text-center py-20">
          <Image className="h-10 w-10 text-surface-300 mx-auto mb-3" />
          <p className="text-surface-500">No ads created yet.</p>
        </div>
      )}

      <div className="space-y-4">
        {ads.map((ad) => (
          <Card key={ad.id} className="hover:shadow-card-hover transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-surface-50 flex items-center justify-center">
                    <Image className="h-4 w-4 text-surface-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-surface-900">{ad.name}</h3>
                    <p className="text-xs text-surface-500">Zone: {ad.zone} • {ad.page || 'All pages'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={ad.isActive ? 'success' : 'danger'}>{ad.isActive ? 'Active' : 'Inactive'}</Badge>
                  <button className="p-1.5 text-surface-400 hover:text-brand-600 transition-colors"><Edit2 className="h-4 w-4" /></button>
                  <button className="p-1.5 text-surface-400 hover:text-red-600 transition-colors"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
