"use client";

import { useRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Bold, Italic, List, Heading2, Link as LinkIcon, ListOrdered } from "lucide-react";

interface MarkdownEditorProps extends React.ComponentProps<typeof Textarea> {
  id: string;
  name: string;
}

export default function MarkdownEditor({ id, name, ...props }: MarkdownEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertText = (before: string, after: string = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selectedText = text.substring(start, end);

    const newText = text.substring(0, start) + before + selectedText + after + text.substring(end);
    
    // Setel value baru secara langsung
    textarea.value = newText;
    
    // Fokus ulang dan kembalikan kursor ke posisi yang tepat
    textarea.focus();
    const newCursorPos = start + before.length + selectedText.length;
    textarea.setSelectionRange(start + before.length, newCursorPos);
  };

  return (
    <div className="rounded-md border border-input bg-background overflow-hidden focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
      <div className="flex flex-wrap items-center gap-1 border-b border-input bg-muted/40 p-1">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
          onClick={() => insertText("**", "**")}
          title="Tebal (Bold)"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
          onClick={() => insertText("*", "*")}
          title="Miring (Italic)"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <div className="w-[1px] h-4 bg-border mx-1" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
          onClick={() => insertText("## ", "")}
          title="Sub Judul (Heading 2)"
        >
          <Heading2 className="h-4 w-4" />
        </Button>
        <div className="w-[1px] h-4 bg-border mx-1" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
          onClick={() => insertText("- ", "")}
          title="Daftar Titik (Bullet List)"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
          onClick={() => insertText("1. ", "")}
          title="Daftar Angka (Numbered List)"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <div className="w-[1px] h-4 bg-border mx-1" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
          onClick={() => insertText("[", "](https://...)")}
          title="Tautan (Link)"
        >
          <LinkIcon className="h-4 w-4" />
        </Button>
      </div>
      <Textarea
        ref={textareaRef}
        id={id}
        name={name}
        className="border-0 focus-visible:ring-0 rounded-none resize-y min-h-[120px] shadow-none"
        {...props}
      />
    </div>
  );
}
