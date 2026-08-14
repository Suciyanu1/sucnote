'use client';

import React, { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AppLayout } from '@/components/layout/AppLayout';
import { getNoteById } from '@/lib/actions/notes';
import { Note } from '@/lib/types';
import { TiptapEditor } from '@/components/editor/TiptapEditor';
import { EmptyState } from '@/components/ui/EmptyState';
import { FileQuestion, RefreshCw } from 'lucide-react';

export default function SingleNotePage({ params }: { params: Promise<{ noteId: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();

  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadNote() {
      setLoading(true);
      const fetchedNote = await getNoteById(resolvedParams.noteId);
      if (active) {
        setNote(fetchedNote);
        setLoading(false);
      }
    }

    loadNote();

    return () => {
      active = false;
    };
  }, [resolvedParams.noteId]);

  if (loading) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center h-full p-12 text-zinc-400 gap-3">
          <RefreshCw className="w-5 h-5 animate-spin" />
          <span className="text-xs">Loading note...</span>
        </div>
      </AppLayout>
    );
  }

  if (!note || note.deleted_at !== null) {
    return (
      <AppLayout>
        <div className="p-10 max-w-2xl mx-auto text-center space-y-6">
          <EmptyState
            icon={FileQuestion}
            title="Note not found or deleted"
            description="The note you are looking for does not exist, belongs to another account, or has been moved to trash."
            actionLabel="Return to Notes"
            onAction={() => router.push('/note/notes')}
          />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <TiptapEditor key={note.id} note={note} />
    </AppLayout>
  );
}
