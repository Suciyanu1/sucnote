'use client';

import React from 'react';
import { Editor } from '@tiptap/react';
import {
  Type,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  CheckSquare,
  Quote,
  Code,
  Minus,
  Image as ImageIcon,
} from 'lucide-react';

interface SlashCommandsProps {
  editor: Editor | null;
  isOpen: boolean;
  position: { top: number; left: number } | null;
  onClose: () => void;
}

export function SlashCommands({ editor, isOpen, position, onClose }: SlashCommandsProps) {
  if (!isOpen || !editor) return null;

  const handleCommand = (commandFn: () => void) => {
    // Delete the slash character first
    editor.chain().focus().deleteRange({ from: editor.state.selection.from - 1, to: editor.state.selection.from }).run();
    commandFn();
    onClose();
  };

  const addImage = () => {
    const url = window.prompt('Enter image URL:');
    if (url) {
      handleCommand(() => {
        editor.chain().focus().setImage({ src: url }).run();
      });
    } else {
      onClose();
    }
  };

  const items = [
    {
      label: 'Text',
      description: 'Just start writing plain text',
      icon: Type,
      action: () => editor.chain().focus().setParagraph().run(),
    },
    {
      label: 'Heading 1',
      description: 'Big section heading',
      icon: Heading1,
      action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
    },
    {
      label: 'Heading 2',
      description: 'Medium section heading',
      icon: Heading2,
      action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
    },
    {
      label: 'Heading 3',
      description: 'Small section heading',
      icon: Heading3,
      action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
    },
    {
      label: 'Bullet List',
      description: 'Create a simple bulleted list',
      icon: List,
      action: () => editor.chain().focus().toggleBulletList().run(),
    },
    {
      label: 'Numbered List',
      description: 'Create a numbered list',
      icon: ListOrdered,
      action: () => editor.chain().focus().toggleOrderedList().run(),
    },
    {
      label: 'Checklist',
      description: 'Track tasks with checkboxes',
      icon: CheckSquare,
      action: () => editor.chain().focus().toggleTaskList().run(),
    },
    {
      label: 'Quote',
      description: 'Capture a quote or highlight',
      icon: Quote,
      action: () => editor.chain().focus().toggleBlockquote().run(),
    },
    {
      label: 'Code Block',
      description: 'Format a code snippet',
      icon: Code,
      action: () => editor.chain().focus().toggleCodeBlock().run(),
    },
    {
      label: 'Divider',
      description: 'Visually divide blocks',
      icon: Minus,
      action: () => editor.chain().focus().setHorizontalRule().run(),
    },
    {
      label: 'Image',
      description: 'Embed an image from URL',
      icon: ImageIcon,
      action: addImage,
    },
  ];

  // Clamp position to avoid going off-screen
  const style: React.CSSProperties = position
    ? {
        position: 'fixed',
        top: position.top + 6,
        left: Math.min(position.left, window.innerWidth - 272),
        zIndex: 9999,
      }
    : { position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 9999 };

  return (
    <div
      style={style}
      className="w-64 rounded-xl border border-[#E5E5E5] dark:border-[#272727] bg-white dark:bg-[#141414] shadow-2xl p-1.5 space-y-0.5 animate-in fade-in slide-in-from-top-1">
      <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[#666666] dark:text-[#A1A1A1]">
        Insert Block
      </div>
      <div className="max-h-60 overflow-y-auto space-y-0.5">
        {items.map((item, i) => {
          const Icon = item.icon;
          return (
            <button
              key={i}
              onClick={() => handleCommand(item.action)}
              className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex items-center gap-2.5 group"
            >
              <div className="p-1 rounded bg-zinc-100 dark:bg-zinc-800 group-hover:bg-zinc-200 dark:group-hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300">
                <Icon className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-[#111111] dark:text-[#F5F5F5]">{item.label}</div>
                <div className="text-[10px] text-[#666666] dark:text-[#A1A1A1] truncate">{item.description}</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
