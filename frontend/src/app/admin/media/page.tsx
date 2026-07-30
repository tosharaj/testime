'use client';
import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Upload, FileText, Image, Trash2 } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function AdminMediaPage() {
  const [files, setFiles] = useState<any[]>([]);

  useEffect(() => {
    fetch('http://localhost:4000/api/media', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(r => r.json()).then(d => setFiles(d.data || [])).catch(console.error);
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-surface-900">Media Library</h1>
        <Button><Upload className="h-4 w-4 mr-1" /> Upload File</Button>
      </div>

      {files.length === 0 && (
        <div className="text-center py-20">
          <Image className="h-10 w-10 text-surface-300 mx-auto mb-3" />
          <p className="text-surface-500">No files uploaded yet.</p>
        </div>
      )}

      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {files.map((file) => (
          <Card key={file.id} className="group hover:shadow-card-hover transition-shadow">
            <CardContent className="p-4">
              <div className="h-32 rounded-lg bg-surface-50 flex items-center justify-center mb-3 overflow-hidden">
                {file.mimeType?.startsWith('image/') ? (
                  <img src={file.url} alt={file.originalName} className="h-full w-full object-cover rounded-lg" />
                ) : (
                  <FileText className="h-10 w-10 text-surface-300" />
                )}
              </div>
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-surface-900 truncate">{file.originalName}</p>
                  <p className="text-xs text-surface-400">{formatDate(file.createdAt)}</p>
                </div>
                <button className="p-1 text-surface-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-all shrink-0">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
