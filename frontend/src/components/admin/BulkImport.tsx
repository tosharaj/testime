'use client';
import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { Upload, Download, FileSpreadsheet, CheckCircle, AlertCircle, X, ChevronDown, ChevronUp } from 'lucide-react';
import { csvToObjects, downloadTemplate } from '@/lib/csvParser';

interface Column {
  key: string;
  label: string;
  required?: boolean;
  default?: string;
}

interface BulkImportProps {
  columns: Column[];
  templateFilename: string;
  templateRows: string[][];
  onImport: (records: Record<string, string>[]) => void;
  onClose: () => void;
}

export default function BulkImport({ columns, templateFilename, templateRows, onImport, onClose }: BulkImportProps) {
  const [records, setRecords] = useState<Record<string, string>[]>([]);
  const [error, setError] = useState('');
  const [showPreview, setShowPreview] = useState(true);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    setError('');

    const ext = file.name.split('.').pop()?.toLowerCase();
    if (ext !== 'csv') {
      setError('Please upload a .csv file. Open Excel → Save As → CSV UTF-8.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      try {
        const parsed = csvToObjects<Record<string, string>>(text);
        if (parsed.length === 0) {
          setError('No records found in file. Check the template format.');
          return;
        }
        setRecords(parsed);
      } catch {
        setError('Failed to parse CSV. Check the file format.');
      }
    };
    reader.readAsText(file);
  };

  const handleImport = () => {
    if (records.length === 0) return;
    onImport(records);
    onClose();
  };

  const headerKeys = columns.map(c => c.key);

  return (
    <Card className="mb-6 border-brand-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5 text-brand-500" />
            Bulk Import from CSV
          </CardTitle>
          <button onClick={onClose} className="p-1 text-surface-400 hover:text-surface-600 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <Button
            variant="outline"
            onClick={() => downloadTemplate(templateFilename, columns.map(c => c.label), templateRows)}
          >
            <Download className="h-4 w-4 mr-1" /> Download Template
          </Button>
          <input
            ref={fileRef}
            type="file"
            accept=".csv"
            className="hidden"
            onChange={e => handleFile(e.target.files?.[0])}
          />
          <Button onClick={() => fileRef.current?.click()}>
            <Upload className="h-4 w-4 mr-1" /> Upload CSV
          </Button>
          <span className="text-xs text-surface-400">Supports CSV files only</span>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700 mb-4">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        {records.length > 0 && (
          <>
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center gap-2 text-sm font-medium text-surface-700 mb-3 hover:text-brand-600 transition-colors"
            >
              {showPreview ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              Preview ({records.length} records)
            </button>

            {showPreview && (
              <div className="overflow-x-auto mb-4 border rounded-lg">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-surface-50 border-b border-surface-200">
                      <th className="px-3 py-2 text-left font-medium text-surface-600">#</th>
                      {columns.map(c => (
                        <th key={c.key} className="px-3 py-2 text-left font-medium text-surface-600">
                          {c.label}
                          {c.required && <span className="text-red-400 ml-0.5">*</span>}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {records.slice(0, 10).map((rec, i) => (
                      <tr key={i} className="border-b border-surface-100 hover:bg-surface-50">
                        <td className="px-3 py-2 text-surface-400">{i + 1}</td>
                        {columns.map(c => (
                          <td key={c.key} className="px-3 py-2 text-surface-700 max-w-[200px] truncate">
                            {rec[c.key] || '-'}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                {records.length > 10 && (
                  <p className="text-xs text-surface-400 px-3 py-2 bg-surface-50 border-t border-surface-100">
                    ...and {records.length - 10} more records
                  </p>
                )}
              </div>
            )}

            <div className="flex items-center gap-2.5">
              <Button onClick={handleImport}>
                <CheckCircle className="h-4 w-4 mr-1" /> Import {records.length} Questions
              </Button>
              <Button variant="outline" onClick={onClose}>Cancel</Button>
            </div>
          </>
        )}

        {records.length === 0 && !error && (
          <div className="text-center py-8 border-2 border-dashed border-surface-200 rounded-lg">
            <FileSpreadsheet className="h-8 w-8 text-surface-300 mx-auto mb-2" />
            <p className="text-sm text-surface-500">Upload a CSV file to bulk import questions</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
