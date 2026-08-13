'use client';

import React, { use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AppLayout } from '@/components/layout/AppLayout';
import { useSucNoteStore } from '@/lib/store';
import { TiptapEditor } from '@/components/editor/TiptapEditor';
import { EmptyState } from '@/components/ui/EmptyState';
import { FileQuestion, ArrowLeft } from 'lucide-react';

export default function SingleNotePage({ params }: { params: Promise<{ noteId: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { notes } = useSucNoteStore();

  const note = notes.find((n) => n.id === resolvedParams.noteId);

  if (!note || note.deleted_at !== null) {
    return (
      <AppLayout>
        <div className="p-10 max-w-2xl mx-auto text-center space-y-6">
          <EmptyState
            icon={FileQuestion}
            title="Note not found or deleted"
            description="The note you are looking for does not exist or has been moved to trash."
            actionLabel="Return to Notes"
            onAction={() => router.push('/app/notes')}
          />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <TiptapEditor note={note} />
    </AppLayout>
  );
}
