"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Minus,
  Undo,
  Redo,
} from "lucide-react";
import { useEffect } from "react";

interface TiptapEditorProps {
  initialContent?: any;
  onChange: (data: { json: any; text: string }) => void;
  placeholder?: string;
}

export function TiptapEditor({ initialContent, onChange }: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3],
        },
      }),
    ],
    content: initialContent || { type: "doc", content: [] },
    editorProps: {
      attributes: {
        class:
          "min-h-[220px] max-w-none focus:outline-none font-body text-base text-ink leading-relaxed px-4 py-3 selection:bg-mustard/30",
      },
    },
    onUpdate: ({ editor }) => {
      onChange({
        json: editor.getJSON(),
        text: editor.getText(),
      });
    },
  });

  // Sync content if initialContent changes externally (e.g. reload after conflict)
  useEffect(() => {
    if (editor && initialContent && !editor.isFocused) {
      const currentJson = JSON.stringify(editor.getJSON());
      const nextJson = JSON.stringify(initialContent);
      if (currentJson !== nextJson) {
        editor.commands.setContent(initialContent);
      }
    }
  }, [editor, initialContent]);

  if (!editor) {
    return (
      <div className="h-[260px] bg-paper-aged animate-pulse rounded border border-vintage-border" />
    );
  }

  const ToolBtn = ({
    isActive,
    onClick,
    icon: Icon,
    title,
  }: {
    isActive?: boolean;
    onClick: () => void;
    icon: any;
    title: string;
  }) => (
    <button
      type="button"
      onClick={onClick}
      className={`p-1.5 rounded text-xs font-typewriter transition-colors border ${
        isActive
          ? "bg-paper-aged text-ink border-teal shadow-stamp font-bold"
          : "text-ink-muted hover:text-ink hover:bg-paper-warm border-transparent"
      }`}
      title={title}
      aria-label={title}
    >
      <Icon className="w-3.5 h-3.5" />
    </button>
  );

  return (
    <div className="border border-vintage-border rounded bg-vintage-card overflow-hidden shadow-sm">
      {/* Vintage Typewriter Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 bg-paper-warm border-b border-vintage-border">
        <ToolBtn
          isActive={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
          icon={Bold}
          title="Bold (Ctrl+B)"
        />
        <ToolBtn
          isActive={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          icon={Italic}
          title="Italic (Ctrl+I)"
        />

        <div className="h-4 w-[1px] bg-vintage-border mx-1" />

        <ToolBtn
          isActive={editor.isActive("heading", { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          icon={Heading2}
          title="Heading 2"
        />
        <ToolBtn
          isActive={editor.isActive("heading", { level: 3 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          icon={Heading3}
          title="Heading 3"
        />

        <div className="h-4 w-[1px] bg-vintage-border mx-1" />

        <ToolBtn
          isActive={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          icon={List}
          title="Bullet List"
        />
        <ToolBtn
          isActive={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          icon={ListOrdered}
          title="Numbered List"
        />
        <ToolBtn
          isActive={editor.isActive("blockquote")}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          icon={Quote}
          title="Blockquote"
        />
        <ToolBtn
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          icon={Minus}
          title="Divider Line"
        />

        <div className="h-4 w-[1px] bg-vintage-border mx-1" />

        <ToolBtn
          onClick={() => editor.chain().focus().undo().run()}
          icon={Undo}
          title="Undo (Ctrl+Z)"
        />
        <ToolBtn
          onClick={() => editor.chain().focus().redo().run()}
          icon={Redo}
          title="Redo (Ctrl+Y)"
        />
      </div>

      {/* Editor Content Area */}
      <EditorContent editor={editor} />
    </div>
  );
}
