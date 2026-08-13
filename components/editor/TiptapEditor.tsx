'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import LinkExtension from '@tiptap/extension-link';
import UnderlineExtension from '@tiptap/extension-underline';
import TaskListExtension from '@tiptap/extension-task-list';
import TaskItemExtension from '@tiptap/extension-task-item';
import PlaceholderExtension from '@tiptap/extension-placeholder';
import ImageExtension from '@tiptap/extension-image';

import { Note, Folder as FolderType, Attachment } from '@/lib/types';
import { useSucNoteStore } from '@/lib/store';
import {
  updateNoteAction,
  toggleFavoriteNoteAction,
  togglePinNoteAction,
  softDeleteNoteAction,
} from '@/lib/actions/notes';
import { getFolders } from '@/lib/actions/folders';
import {
  getAttachments,
  addAttachmentAction,
  deleteAttachmentAction,
} from '@/lib/actions/attachments';

import { EditorToolbar } from './EditorToolbar';
import { SaveStatusIndicator } from './SaveStatusIndicator';
import { SlashCommands } from './SlashCommands';
import { MoveNoteModal } from '../folders/MoveNoteModal';
import {
  Star,
  Pin,
  Folder as FolderIcon,
  Trash2,
  Paperclip,
  UploadCloud,
  X,
  FileText,
} from 'lucide-react';
import { formatDateRelative } from '@/lib/utils';
import { useRouter } from 'next/navigation';

interface TiptapEditorProps {
  note: Note;
}

export function TiptapEditor({ note }: TiptapEditorProps) {
  const router = useRouter();
  const { saveStatus, setSaveStatus, showToast } = useSucNoteStore();

  const [title, setTitle] = useState(note.title);
  const [currentNote, setCurrentNote] = useState<Note>(note);
  const [folders, setFolders] = useState<FolderType[]>([]);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);
  const [isSlashOpen, setIsSlashOpen] = useState(false);
  const [showAttachments, setShowAttachments] = useState(false);

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedTimestampRef = useRef<number>(0);

  useEffect(() => {
    let active = true;

    async function loadEditorMeta() {
      const [fData, aData] = await Promise.all([
        getFolders(),
        getAttachments(note.id),
      ]);
      if (active) {
        setFolders(fData);
        setAttachments(aData);
      }
    }

    loadEditorMeta();

    return () => {
      active = false;
    };
  }, [note.id]);

  const currentFolder = folders.find((f) => f.id === currentNote.folder_id);

  // Perform server action update with timestamp race-condition check
  const saveToServer = useCallback(
    async (updatedTitle: string, updatedContent: any) => {
      const requestTimestamp = Date.now();
      setSaveStatus('saving');

      try {
        const res = await updateNoteAction(note.id, {
          title: updatedTitle,
          content: updatedContent,
        });

        if (res.success && res.note) {
          if (requestTimestamp >= lastSavedTimestampRef.current) {
            lastSavedTimestampRef.current = requestTimestamp;
            setCurrentNote(res.note);
            setSaveStatus('saved');
          }
        } else {
          setSaveStatus('error');
          showToast(res.error || 'Autosave failed. Retrying...', 'error');
        }
      } catch {
        setSaveStatus('error');
      }
    },
    [note.id, setSaveStatus, showToast]
  );

  // Handle title edit with debounce ~700ms
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    setSaveStatus('saving');

    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(() => {
      if (editor) {
        saveToServer(newTitle, editor.getJSON());
      }
    }, 700);
  };

  // Tiptap Editor Initialization
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      LinkExtension.configure({
        openOnClick: false,
        HTMLAttributes: { rel: 'noopener noreferrer', target: '_blank' },
      }),
      UnderlineExtension,
      TaskListExtension,
      TaskItemExtension.configure({ nested: true }),
      PlaceholderExtension.configure({
        placeholder: "Type '/' for commands or start writing...",
      }),
      ImageExtension,
    ],
    content: note.content || '',
    onUpdate: ({ editor }) => {
      setSaveStatus('saving');

      // Check slash commands
      const { selection } = editor.state;
      const textBefore = editor.state.doc.textBetween(
        Math.max(0, selection.from - 1),
        selection.from,
        '\n'
      );
      if (textBefore === '/') {
        setIsSlashOpen(true);
      } else {
        setIsSlashOpen(false);
      }

      // Debounced save ~700ms
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = setTimeout(() => {
        saveToServer(title, editor.getJSON());
      }, 700);
    },
  });

  const handleToggleFavorite = async () => {
    const res = await toggleFavoriteNoteAction(note.id);
    if (res.success && res.note) {
      setCurrentNote(res.note);
      showToast(res.note.is_favorite ? 'Added to favorites' : 'Removed from favorites', 'success');
      router.refresh();
    }
  };

  const handleTogglePin = async () => {
    const res = await togglePinNoteAction(note.id);
    if (res.success && res.note) {
      setCurrentNote(res.note);
      showToast(res.note.is_pinned ? 'Note pinned' : 'Note unpinned', 'info');
      router.refresh();
    }
  };

  const handleSoftDelete = async () => {
    const res = await softDeleteNoteAction(note.id);
    if (res.success) {
      showToast('Note moved to trash', 'info');
      router.push('/app/notes');
      router.refresh();
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    for (const file of Array.from(files)) {
      const mockUrl = URL.createObjectURL(file);
      const res = await addAttachmentAction({
        note_id: note.id,
        file_name: file.name,
        file_url: mockUrl,
        file_type: file.type || 'application/octet-stream',
        file_size: file.size || 0,
      });

      if (res.success && res.attachment) {
        setAttachments((prev) => [res.attachment!, ...prev]);
        showToast('Attachment uploaded', 'success');
      }
    }
  };

  const handleDeleteAttachment = async (id: string) => {
    const res = await deleteAttachmentAction(id);
    if (res.success) {
      setAttachments((prev) => prev.filter((a) => a.id !== id));
      showToast('Attachment deleted', 'info');
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#0A0A0A]">
      {/* Editor Header / Meta Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-3 border-b border-[#E5E5E5] dark:border-[#272727] bg-[#FAFAFA]/50 dark:bg-[#141414]/50">
        <div className="flex items-center gap-2">
          {/* Folder badge / selector */}
          <button
            onClick={() => setIsMoveModalOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border border-[#E5E5E5] dark:border-[#272727] bg-white dark:bg-[#141414] hover:bg-zinc-100 dark:hover:bg-zinc-800 text-[#666666] dark:text-[#A1A1A1] transition-colors cursor-pointer"
          >
            <FolderIcon className="w-3.5 h-3.5 text-zinc-400" />
            <span>{currentFolder ? currentFolder.name : 'Move to folder'}</span>
          </button>

          <SaveStatusIndicator
            status={saveStatus}
            onRetry={() => {
              if (editor) {
                saveToServer(title, editor.getJSON());
              }
            }}
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-400 hidden sm:inline">
            Updated {formatDateRelative(currentNote.updated_at)}
          </span>

          <button
            onClick={() => setShowAttachments(!showAttachments)}
            className={`p-1.5 rounded-lg border transition-colors flex items-center gap-1 text-xs cursor-pointer ${
              attachments.length > 0
                ? 'border-zinc-400 dark:border-zinc-600 font-semibold'
                : 'border-[#E5E5E5] dark:border-[#272727] text-zinc-500'
            }`}
            title="Note Attachments"
          >
            <Paperclip className="w-4 h-4" />
            {attachments.length > 0 && <span>{attachments.length}</span>}
          </button>

          <button
            onClick={handleTogglePin}
            className={`p-1.5 rounded-lg border border-[#E5E5E5] dark:border-[#272727] transition-colors cursor-pointer ${
              currentNote.is_pinned
                ? 'bg-zinc-100 dark:bg-zinc-800 text-black dark:text-white'
                : 'text-zinc-400 hover:text-black dark:hover:text-white'
            }`}
            title={currentNote.is_pinned ? 'Unpin Note' : 'Pin Note'}
          >
            <Pin className="w-4 h-4" />
          </button>

          <button
            onClick={handleToggleFavorite}
            className={`p-1.5 rounded-lg border border-[#E5E5E5] dark:border-[#272727] transition-colors cursor-pointer ${
              currentNote.is_favorite ? 'text-amber-500' : 'text-zinc-400 hover:text-amber-500'
            }`}
            title={currentNote.is_favorite ? 'Unfavorite' : 'Favorite'}
          >
            <Star className={`w-4 h-4 ${currentNote.is_favorite ? 'fill-amber-400' : ''}`} />
          </button>

          <button
            onClick={handleSoftDelete}
            className="p-1.5 rounded-lg border border-[#E5E5E5] dark:border-[#272727] text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer"
            title="Move to Trash"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Attachments Drawer */}
      {showAttachments && (
        <div className="p-4 bg-[#FAFAFA] dark:bg-[#141414] border-b border-[#E5E5E5] dark:border-[#272727] space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-semibold text-[#111111] dark:text-[#F5F5F5] flex items-center gap-2">
              <Paperclip className="w-3.5 h-3.5" />
              <span>Attachments ({attachments.length})</span>
            </h4>
            <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-black text-white dark:bg-white dark:text-black hover:opacity-90">
              <UploadCloud className="w-3.5 h-3.5" />
              <span>Upload File</span>
              <input type="file" multiple onChange={handleFileUpload} className="hidden" />
            </label>
          </div>

          {attachments.length === 0 ? (
            <p className="text-xs text-zinc-400 italic">No attachments added yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {attachments.map((att) => (
                <div
                  key={att.id}
                  className="flex items-center justify-between p-2 rounded-lg border border-[#E5E5E5] dark:border-[#272727] bg-white dark:bg-[#0A0A0A] text-xs"
                >
                  <a
                    href={att.file_url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 min-w-0 hover:underline"
                  >
                    <FileText className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                    <span className="truncate text-[#111111] dark:text-[#F5F5F5]">{att.file_name}</span>
                  </a>
                  <button
                    onClick={() => handleDeleteAttachment(att.id)}
                    className="p-1 text-zinc-400 hover:text-rose-500 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Fixed Formatting Toolbar */}
      <EditorToolbar editor={editor} />

      {/* Main Writing Canvas */}
      <div className="flex-1 overflow-y-auto p-6 md:p-12 max-w-4xl mx-auto w-full relative">
        {/* Title Input */}
        <input
          type="text"
          value={title}
          onChange={handleTitleChange}
          placeholder="Untitled Note"
          className="w-full bg-transparent text-3xl md:text-4xl font-extrabold text-[#111111] dark:text-[#F5F5F5] placeholder-zinc-300 dark:placeholder-zinc-700 focus:outline-hidden mb-6 border-b border-transparent focus:border-zinc-200 dark:focus:border-zinc-800 pb-2 transition-colors"
        />

        {/* Tiptap Editor Content */}
        <div className="relative">
          <EditorContent editor={editor} className="text-base text-[#111111] dark:text-[#F5F5F5]" />
          <SlashCommands editor={editor} isOpen={isSlashOpen} onClose={() => setIsSlashOpen(false)} />
        </div>
      </div>

      <MoveNoteModal
        isOpen={isMoveModalOpen}
        noteId={note.id}
        currentFolderId={currentNote.folder_id}
        onClose={() => {
          setIsMoveModalOpen(false);
          getFolders().then(setFolders);
        }}
      />
    </div>
  );
}
