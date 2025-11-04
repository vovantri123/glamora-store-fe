'use client';

import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface OrderNoteCardProps {
  note: string;
  onNoteChange: (note: string) => void;
}

export default function OrderNoteCard({
  note,
  onNoteChange,
}: OrderNoteCardProps) {
  return (
    <Card className="border-0 bg-gradient-to-br from-white to-gray-50/50 shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-xl">
          <div className="rounded-full bg-gradient-to-r from-orange-500 to-orange-600 p-2 shadow-lg">
            <CheckCircle2 className="h-6 w-6 text-white" />
          </div>
          <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text font-bold text-transparent">
            Order Notes
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <textarea
          className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:border-orange-600 focus:outline-none"
          rows={4}
          placeholder="Add any special instructions for your order..."
          value={note}
          onChange={(e) => onNoteChange(e.target.value)}
        />
      </CardContent>
    </Card>
  );
}
