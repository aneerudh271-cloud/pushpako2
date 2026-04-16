'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Youtube from '@tiptap/extension-youtube';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import { Bold, Italic, Underline as UnderlineIcon, List, ListOrdered, Quote, Link as LinkIcon, Image as ImageIcon, Youtube as YoutubeIcon, AlignLeft, AlignCenter, AlignRight, Undo, Redo, Code, Heading1 as H1, Heading2 as H2 } from 'lucide-react';
import { useCallback, useEffect } from 'react';
import toast from 'react-hot-toast';

const MenuBar = ({ editor }) => {
    if (!editor) {
        return null;
    }

    const addImage = useCallback(() => {
        const url = window.prompt('URL');
        if (url) {
            editor.chain().focus().setImage({ src: url }).run();
        }
    }, [editor]);

    const addYoutube = useCallback(() => {
        const url = window.prompt('Enter YouTube URL');
        if (url) {
            editor.commands.setYoutubeVideo({
                src: url,
            });
        }
    }, [editor]);

    const setLink = useCallback(() => {
        const previousUrl = editor.getAttributes('link').href;
        const url = window.prompt('URL', previousUrl);

        // cancelled
        if (url === null) {
            return;
        }

        // empty
        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }

        // update link
        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }, [editor]);

    const uploadImage = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const toastId = toast.loading("Uploading image...");

        try {
            // Direct file upload in body, with filename in query params
            // This matches the logic in `api/upload/route.js`
            const res = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}`, {
                method: 'POST',
                body: file, // Send binary directly, NOT FormData
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.error || 'Upload failed');
            }

            const data = await res.json();

            if (data.url) {
                editor.chain().focus().setImage({ src: data.url }).run();
                toast.success("Image uploaded!");
            } else {
                throw new Error("No URL returned from upload");
            }
        } catch (err) {
            console.error("RichTextEditor Upload Error:", err);
            toast.error(`Failed to upload image: ${err.message}`);
        } finally {
            toast.dismiss(toastId);
            // Reset input so validation works if selecting same file again
            event.target.value = '';
        }
    };

    const Button = ({ onClick, disabled, isActive, title, icon: Icon }) => (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className={`p-1.5 rounded hover:bg-gray-700 transition ${isActive ? 'bg-gray-700 text-blue-400' : 'text-gray-300'}`}
            title={title}
        >
            <Icon className="w-4 h-4" />
        </button>
    );

    return (
        <div className="border border-gray-700 rounded-t-lg bg-gray-800 p-2 flex flex-wrap gap-2 sticky top-0 z-10">
            <div className="flex gap-1 border-r border-gray-700 pr-2">
                <Button onClick={() => editor.chain().focus().toggleBold().run()} disabled={!editor.can().chain().focus().toggleBold().run()} isActive={editor.isActive('bold')} title="Bold" icon={Bold} />
                <Button onClick={() => editor.chain().focus().toggleItalic().run()} disabled={!editor.can().chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')} title="Italic" icon={Italic} />
                <Button onClick={() => editor.chain().focus().toggleUnderline().run()} isActive={editor.isActive('underline')} title="Underline" icon={UnderlineIcon} />
            </div>

            <div className="flex gap-1 border-r border-gray-700 pr-2">
                <Button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} isActive={editor.isActive('heading', { level: 1 })} title="Heading 1" icon={H1} />
                <Button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} isActive={editor.isActive('heading', { level: 2 })} title="Heading 2" icon={H2} />
            </div>

            <div className="flex gap-1 border-r border-gray-700 pr-2">
                <Button onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive('bulletList')} title="Bullet List" icon={List} />
                <Button onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive('orderedList')} title="Ordered List" icon={ListOrdered} />
            </div>

            <div className="flex gap-1 border-r border-gray-700 pr-2">
                <Button onClick={() => editor.chain().focus().setTextAlign('left').run()} isActive={editor.isActive({ textAlign: 'left' })} title="Align Left" icon={AlignLeft} />
                <Button onClick={() => editor.chain().focus().setTextAlign('center').run()} isActive={editor.isActive({ textAlign: 'center' })} title="Align Center" icon={AlignCenter} />
                <Button onClick={() => editor.chain().focus().setTextAlign('right').run()} isActive={editor.isActive({ textAlign: 'right' })} title="Align Right" icon={AlignRight} />
            </div>

            <div className="flex gap-1 border-r border-gray-700 pr-2">
                <Button onClick={setLink} isActive={editor.isActive('link')} title="Link" icon={LinkIcon} />

                <button
                    type="button"
                    onClick={() => document.getElementById('tiptap-image-upload').click()}
                    className="p-1.5 rounded hover:bg-gray-700 transition text-gray-300"
                    title="Upload Image"
                >
                    <ImageIcon className="w-4 h-4" />
                </button>
                <input
                    id="tiptap-image-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={uploadImage}
                />

                <Button onClick={addYoutube} isActive={editor.isActive('youtube')} title="Youtube" icon={YoutubeIcon} />
                <Button onClick={() => editor.chain().focus().toggleBlockquote().run()} isActive={editor.isActive('blockquote')} title="Quote" icon={Quote} />
            </div>

            <div className="flex gap-1">
                <Button onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().chain().focus().undo().run()} title="Undo" icon={Undo} />
                <Button onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().chain().focus().redo().run()} title="Redo" icon={Redo} />
            </div>
        </div>
    );
};

export default function RichTextEditor({ content, onChange, placeholder = 'Start writing...' }) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Image.configure({
                inline: true,
                allowBase64: true,
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-blue-400 underline cursor-pointer',
                }
            }),
            Youtube.configure({
                controls: false,
            }),
            Underline,
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
        ],
        content: content || '',
        editorProps: {
            attributes: {
                class: 'prose-custom max-w-none focus:outline-none min-h-[300px] p-4 bg-gray-700/50 rounded-b-lg text-white',
            },
        },
        onUpdate: ({ editor }) => {
            // Send HTML up
            onChange(editor.getHTML());
        },
        immediatelyRender: false,
    });

    // Content Sync Logic
    // Only update content if it's completely empty in editor (initial load)
    // or if the difference is substantial (handling potential external reset).
    // Avoiding the loop by checking exact equality.
    useEffect(() => {
        if (editor && content !== undefined) {
            const currentHTML = editor.getHTML();
            if (content !== currentHTML) {
                // To avoid cursor jumping when typing, we only update if the content passed in 
                // is different from what's currently there. 
                // Caveat: If parent updates exactly what was typed, this shouldn't trigger.
                // But in optimal React patterns, onUpdate triggers parent state, which passes back here.
                // Tiptap's official recommendation is often to NOT sync back content unless it's a reset.

                // We will update only if the editor seems 'out of sync' or empty while content exists.
                // For now, simple check:

                // If the editor is focused, we assume the user is typing and WE HAVE THE TRUTH.
                // We should NOT overwrite from props if we are focused.
                if (!editor.isFocused) {
                    editor.commands.setContent(content);
                }
            }
        }
    }, [content, editor]);

    return (
        <div className="w-full">
            <MenuBar editor={editor} />
            <EditorContent editor={editor} />
            <style jsx global>{`
                /* Manual Styling for Rich Text inside the Editor (simulating prose) */
                .prose-custom h1 {
                    font-size: 2em;
                    font-weight: bold;
                    margin-top: 0.67em;
                    margin-bottom: 0.67em;
                    color: white;
                }
                .prose-custom h2 {
                    font-size: 1.5em;
                    font-weight: bold;
                    margin-top: 0.83em;
                    margin-bottom: 0.83em;
                    color: #e5e7eb;
                }
                .prose-custom h3 {
                    font-size: 1.17em;
                    font-weight: bold;
                    margin-top: 1em;
                    margin-bottom: 1em;
                    color: #e5e7eb;
                }
                .prose-custom p {
                    margin-top: 1em;
                    margin-bottom: 1em;
                    line-height: 1.6;
                }
                .prose-custom ul {
                    display: block;
                    list-style-type: disc;
                    margin-top: 1em;
                    margin-bottom: 1em;
                    padding-left: 40px;
                }
                .prose-custom ol {
                    display: block;
                    list-style-type: decimal;
                    margin-top: 1em;
                    margin-bottom: 1em;
                    padding-left: 40px;
                }
                .prose-custom li {
                    display: list-item;
                }
                .prose-custom blockquote {
                    border-left: 4px solid #3b82f6;
                    padding-left: 1em;
                    margin-left: 0;
                    margin-right: 0;
                    font-style: italic;
                    color: #9ca3af;
                    background: rgba(59, 130, 246, 0.1);
                    padding: 0.5rem 1rem;
                    border-radius: 0.25rem;
                }
                .prose-custom img {
                    max-width: 100%;
                    height: auto;
                    border-radius: 0.5rem;
                    margin: 1rem 0;
                }
                .prose-custom iframe {
                    width: 100%;
                    aspect-ratio: 16 / 9;
                    border-radius: 0.5rem;
                    margin: 1rem 0;
                }
                .prose-custom a {
                    color: #60a5fa;
                    text-decoration: underline;
                    cursor: pointer;
                }
                .ProseMirror p.is-editor-empty:first-child::before {
                    color: #6b7280;
                    content: attr(data-placeholder);
                    float: left;
                    height: 0;
                    pointer-events: none;
                }
            `}</style>
        </div>
    );
}
