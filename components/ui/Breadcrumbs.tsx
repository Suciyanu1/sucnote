'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight, Folder } from 'lucide-react';

interface BreadcrumbItem {
  id: string;
  name: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="flex items-center gap-1.5 text-xs text-[#666666] dark:text-[#A1A1A1] overflow-x-auto py-1">
      <Link
        href="/app/folders"
        className="flex items-center gap-1 hover:text-[#111111] dark:hover:text-[#F5F5F5] transition-colors"
      >
        <Folder className="w-3.5 h-3.5" />
        <span>Folders</span>
      </Link>

      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        return (
          <React.Fragment key={item.id}>
            <ChevronRight className="w-3 h-3 text-zinc-400 shrink-0" />
            {isLast || !item.href ? (
              <span className="font-medium text-[#111111] dark:text-[#F5F5F5] truncate max-w-[160px]">
                {item.name}
              </span>
            ) : (
              <Link
                href={item.href}
                className="hover:text-[#111111] dark:hover:text-[#F5F5F5] transition-colors truncate max-w-[140px]"
              >
                {item.name}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
