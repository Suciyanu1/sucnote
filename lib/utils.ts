import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Folder } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Extracts plain text excerpt from Tiptap JSON document structure or string
 */
export function generateExcerptFromTiptap(content: any, maxLength = 120): string {
  if (!content) return "Empty note";
  
  if (typeof content === "string") {
    const stripped = content.replace(/<[^>]*>?/gm, "").trim();
    if (!stripped) return "Empty note";
    return stripped.length > maxLength ? stripped.slice(0, maxLength) + "..." : stripped;
  }

  let textSegments: string[] = [];

  function traverse(node: any) {
    if (!node) return;
    if (node.type === "text" && node.text) {
      textSegments.push(node.text);
    }
    if (Array.isArray(node.content)) {
      node.content.forEach(traverse);
    }
  }

  traverse(content);

  const fullText = textSegments.join(" ").replace(/\s+/g, " ").trim();
  if (!fullText) return "Empty note";
  return fullText.length > maxLength ? fullText.slice(0, maxLength) + "..." : fullText;
}

/**
 * Formats ISO date string into readable concise timestamp
 */
export function formatDateRelative(dateString: string): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInSecs = Math.floor(diffInMs / 1000);

  if (diffInSecs < 60) return "Just now";
  const diffInMins = Math.floor(diffInSecs / 60);
  if (diffInMins < 60) return `${diffInMins}m ago`;
  const diffInHours = Math.floor(diffInMins / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) return "Yesterday";
  if (diffInDays < 7) return `${diffInDays}d ago`;

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
}

/**
 * Converts flat folder array into nested parent-child folder tree
 */
export function buildFolderTree(folders: Folder[]): Folder[] {
  const folderMap = new Map<string, Folder>();
  const rootFolders: Folder[] = [];

  folders.forEach((f) => {
    folderMap.set(f.id, { ...f, children: [] });
  });

  folderMap.forEach((folder) => {
    if (folder.parent_id && folderMap.has(folder.parent_id)) {
      folderMap.get(folder.parent_id)!.children!.push(folder);
    } else {
      rootFolders.push(folder);
    }
  });

  return rootFolders;
}
