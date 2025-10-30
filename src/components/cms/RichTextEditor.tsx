import React, { useState, useRef, useEffect } from 'react';
import { Button } from '../ui/button';
import {
  Bold, Italic, Underline, Link as LinkIcon, List, ListOrdered,
  Quote, Code, Image as ImageIcon, Video, Eye, Save, Type,
  AlignLeft, AlignCenter, AlignRight, Heading1, Heading2, Heading3
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onAutoSave?: () => void;
}

export function RichTextEditor({ value, onChange, placeholder, onAutoSave }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [showPreview, setShowPreview] = useState(false);
  const autoSaveTimerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    // Auto-save functionality
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }

    autoSaveTimerRef.current = setTimeout(() => {
      if (onAutoSave && value) {
        onAutoSave();
        toast.success('Draft auto-saved', { duration: 2000 });
      }
    }, 3000);

    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [value, onAutoSave]);

  // Keep DOM as the source of truth. Only push prop value into DOM
  // when it differs (e.g., switching articles or external load).
  useEffect(() => {
    if (!editorRef.current) return;
    const el = editorRef.current;
    if (el.innerHTML !== value) {
      el.innerHTML = value || '';
    }
  }, [value]);

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  const insertHeading = (level: number) => {
    execCommand('formatBlock', `h${level}`);
  };

  const insertLink = () => {
    const url = prompt('Enter URL:');
    if (url) {
      execCommand('createLink', url);
    }
  };

  const insertImage = () => {
    const url = prompt('Enter image URL:');
    if (url) {
      execCommand('insertImage', url);
    }
  };

  const insertYouTube = () => {
    const url = prompt('Enter YouTube URL:');
    if (url) {
      const videoId = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)?.[1];
      if (videoId) {
        const iframe = `<iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>`;
        execCommand('insertHTML', iframe);
      }
    }
  };

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const toolbarButtons = [
    { icon: Heading1, label: 'Heading 1', action: () => insertHeading(1) },
    { icon: Heading2, label: 'Heading 2', action: () => insertHeading(2) },
    { icon: Heading3, label: 'Heading 3', action: () => insertHeading(3) },
    { divider: true },
    { icon: Bold, label: 'Bold', action: () => execCommand('bold') },
    { icon: Italic, label: 'Italic', action: () => execCommand('italic') },
    { icon: Underline, label: 'Underline', action: () => execCommand('underline') },
    { divider: true },
    { icon: AlignLeft, label: 'Align Left', action: () => execCommand('justifyLeft') },
    { icon: AlignCenter, label: 'Align Center', action: () => execCommand('justifyCenter') },
    { icon: AlignRight, label: 'Align Right', action: () => execCommand('justifyRight') },
    { divider: true },
    { icon: List, label: 'Bullet List', action: () => execCommand('insertUnorderedList') },
    { icon: ListOrdered, label: 'Numbered List', action: () => execCommand('insertOrderedList') },
    { icon: Quote, label: 'Quote', action: () => execCommand('formatBlock', 'blockquote') },
    { divider: true },
    { icon: LinkIcon, label: 'Insert Link', action: insertLink },
    { icon: ImageIcon, label: 'Insert Image', action: insertImage },
    { icon: Video, label: 'Embed YouTube', action: insertYouTube },
    { icon: Code, label: 'Code Block', action: () => execCommand('formatBlock', 'pre') },
  ];

  return (
    <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden bg-white dark:bg-gray-800">
      {/* Toolbar */}
      <div className="border-b border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 p-2">
        <div className="flex flex-wrap gap-1 items-center">
          {toolbarButtons.map((btn, idx) => 
            btn.divider ? (
              <div key={`divider-${idx}`} className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />
            ) : (
              <Button
                key={idx}
                type="button"
                variant="ghost"
                size="sm"
                onClick={btn.action}
                className="h-8 w-8 p-0"
                title={btn.label}
              >
                <btn.icon className="w-4 h-4" />
              </Button>
            )
          )}
          <div className="ml-auto flex gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowPreview(!showPreview)}
              className="h-8"
            >
              <Eye className="w-4 h-4 mr-1" />
              {showPreview ? 'Edit' : 'Preview'}
            </Button>
          </div>
        </div>
      </div>

      {/* Editor / Preview */}
      {showPreview ? (
        <div 
          className="p-4 min-h-[400px] prose dark:prose-invert max-w-none overflow-auto"
          dangerouslySetInnerHTML={{ __html: value }}
          dir="ltr"
          style={{ unicodeBidi: 'plaintext' as any }}
        />
      ) : (
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={handleInput}
          className="p-4 min-h-[400px] focus:outline-none prose dark:prose-invert max-w-none"
          data-placeholder={placeholder}
          dir="ltr"
          style={{
            minHeight: '400px',
            direction: 'ltr',
            unicodeBidi: 'plaintext' as any,
            textAlign: 'left',
            writingMode: 'horizontal-tb' as any,
          }}
        />
      )}
    </div>
  );
}
