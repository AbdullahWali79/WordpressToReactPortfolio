"use client";

import { useEffect } from "react";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

import { Button } from "@/components/ui/button";

type TiptapEditorProps = {
  value: string;
  onChange: (value: string) => void;
};

export function TiptapEditor({ value, onChange }: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3, 4] },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          rel: "noopener noreferrer",
          target: "_blank",
        },
      }),
      Underline,
    ],
    editorProps: {
      attributes: {
        class:
          "min-h-[280px] rounded-b-md border border-t-0 border-input bg-background px-4 py-3 text-sm focus:outline-none",
      },
    },
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "<p></p>", false);
    }
  }, [editor, value]);

  if (!editor) return null;

  return (
    <div>
      <div className="flex flex-wrap gap-2 rounded-t-md border border-input bg-muted p-2">
        <Button type="button" size="sm" variant="outline" onClick={() => editor.chain().focus().toggleBold().run()}>
          Bold
        </Button>
        <Button type="button" size="sm" variant="outline" onClick={() => editor.chain().focus().toggleItalic().run()}>
          Italic
        </Button>
        <Button type="button" size="sm" variant="outline" onClick={() => editor.chain().focus().toggleUnderline().run()}>
          Underline
        </Button>
        <Button type="button" size="sm" variant="outline" onClick={() => editor.chain().focus().toggleBulletList().run()}>
          Bullet
        </Button>
        <Button type="button" size="sm" variant="outline" onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          Numbered
        </Button>
        <Button type="button" size="sm" variant="outline" onClick={() => editor.chain().focus().toggleBlockquote().run()}>
          Quote
        </Button>
        <Button type="button" size="sm" variant="outline" onClick={() => editor.chain().focus().toggleCodeBlock().run()}>
          Code
        </Button>
        <Button type="button" size="sm" variant="outline" onClick={() => editor.chain().focus().setHorizontalRule().run()}>
          Rule
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => {
            const href = window.prompt("Enter URL");
            if (!href) return;
            editor.chain().focus().setLink({ href }).run();
          }}
        >
          Link
        </Button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
