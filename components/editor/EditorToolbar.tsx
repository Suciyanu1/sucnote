'use client';

import React from 'react';
import { Editor } from '@tiptap/react';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  CheckSquare,
  Quote,
  Code,
  Minus,
  Link as LinkIcon,
  Undo,
  Redo,
} from 'lucide-react';

interface EditorToolbarProps {
  editor: Editor | null;
}

export function EditorToolbar({ editor }: EditorToolbarProps) {
  if (!editor) return null;

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('Enter URL:', previousUrl);
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const btnClass = (isActive: boolean) =>
    `p-1.5 rounded-md text-xs font-medium transition-colors ${
      isActive
        ? 'bg-zinc-200 dark:bg-zinc-700 text-black dark:text-white'
        : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-black dark:hover:text-white'
    }`;

  return (
    <div className="sticky top-0 z-20 flex flex-wrap items-center gap-0.5 p-1.5 border-b border-[#E5E5E5] dark:border-[#272727] bg-white/90 dark:bg-[#0A0A0A]/90 backdrop-blur-md">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={btnClass(editor.isActive('bold'))}
        title="Bold (Cmd+B)"
      >
        <Bold className="w-4 h-4" />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={btnClass(editor.isActive('italic'))}
        title="Italic (Cmd+I)"
      >
        <Italic className="w-4 h-4" />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={btnClass(editor.isActive('underline'))}
        title="Underline (Cmd+U)"
      >
        <UnderlineIcon className="w-4 h-4" />
      </button>

      <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800 mx-1" />

      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={btnClass(editor.isActive('heading', { level: 1 }))}
        title="Heading 1"
      >
        <Heading1 className="w-4 h-4" />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={btnClass(editor.isActive('heading', { level: 2 }))}
        title="Heading 2"
      >
        <Heading2 className="w-4 h-4" />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={btnClass(editor.isActive('heading', { level: 3 }))}
        title="Heading 3"
      >
        <Heading3 className="w-4 h-4" />
      </button>

      <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800 mx-1" />

      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={btnClass(editor.isActive('bulletList'))}
        title="Bullet List"
      >
        <List className="w-4 h-4" />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={btnClass(editor.isActive('orderedList'))}
        title="Ordered List"
      >
        <ListOrdered className="w-4 h-4" />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleTaskList().run()}
        className={btnClass(editor.isActive('taskList'))}
        title="Checklist"
      >
        <CheckSquare className="w-4 h-4" />
      </button>

      <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800 mx-1" />

      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={btnClass(editor.isActive('blockquote'))}
        title="Quote"
      >
        <Quote className="w-4 h-4" />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={btnClass(editor.isActive('codeBlock'))}
        title="Code Block"
      >
        <Code className="w-4 h-4" />
      </button>

      <button
        onClick={setLink}
        className={btnClass(editor.isActive('link'))}
        title="Insert Link"
      >
        <LinkIcon className="w-4 h-4" />
      </button>

      <button
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        className={btnClass(false)}
        title="Horizontal Rule"
      >
        <Minus className="w-4 h-4" />
      </button>

      <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800 mx-1 ml-auto" />

      <button
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        className="p-1.5 rounded-md text-xs font-medium text-zinc-500 hover:text-black dark:hover:text-white disabled:opacity-30"
        title="Undo"
      >
        <Undo className="w-4 h-4" />
      </button>

      <button
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        className="p-1.5 rounded-md text-xs font-medium text-zinc-500 hover:text-black dark:hover:text-white disabled:opacity-30"
        title="Redo"
      >
        <Redo className="w-4 h-4" />
      </button>
    </div>
  );
}
