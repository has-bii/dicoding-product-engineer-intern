"use client"

import { type Editor, EditorContent, useEditor, useEditorState } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { cn } from "cn"
import {
	BoldIcon,
	CodeIcon,
	Heading2Icon,
	ItalicIcon,
	LinkIcon,
	ListIcon,
	ListOrderedIcon,
	UnderlineIcon,
} from "lucide-react"
import type { ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

type ToolbarButtonProps = {
	label: string
	isActive: boolean
	onClick: () => void
	children: ReactNode
}

function ToolbarButton({ label, isActive, onClick, children }: ToolbarButtonProps) {
	return (
		<Button
			type="button"
			variant="ghost"
			size="icon-sm"
			aria-label={label}
			aria-pressed={isActive}
			className={cn(isActive && "bg-border/60")}
			onClick={onClick}
		>
			{children}
		</Button>
	)
}

function promptLink(editor: Editor) {
	const previousUrl: string | undefined = editor.getAttributes("link").href
	const url = window.prompt("Masukkan URL", previousUrl ?? "https://")

	// Cancelled prompt keeps the current link; an empty one removes it
	if (url === null) return
	if (url.trim() === "") {
		editor.chain().focus().extendMarkRange("link").unsetLink().run()
		return
	}

	editor.chain().focus().extendMarkRange("link").setLink({ href: url.trim() }).run()
}

function RichTextToolbar({ editor }: { editor: Editor }) {
	const state = useEditorState({
		editor,
		selector: ({ editor }) => ({
			isBold: editor.isActive("bold"),
			isItalic: editor.isActive("italic"),
			isUnderline: editor.isActive("underline"),
			isHeading: editor.isActive("heading", { level: 2 }),
			isBulletList: editor.isActive("bulletList"),
			isOrderedList: editor.isActive("orderedList"),
			isLink: editor.isActive("link"),
			isCode: editor.isActive("code"),
		}),
	})

	return (
		<div className="flex flex-wrap items-center gap-1 border-b p-1">
			<ToolbarButton
				label="Tebal"
				isActive={state.isBold}
				onClick={() => editor.chain().focus().toggleBold().run()}
			>
				<BoldIcon />
			</ToolbarButton>
			<ToolbarButton
				label="Miring"
				isActive={state.isItalic}
				onClick={() => editor.chain().focus().toggleItalic().run()}
			>
				<ItalicIcon />
			</ToolbarButton>
			<ToolbarButton
				label="Garis bawah"
				isActive={state.isUnderline}
				onClick={() => editor.chain().focus().toggleUnderline().run()}
			>
				<UnderlineIcon />
			</ToolbarButton>

			<Separator orientation="vertical" className="mx-1 h-4 data-vertical:self-center" />

			<ToolbarButton
				label="Judul"
				isActive={state.isHeading}
				onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
			>
				<Heading2Icon />
			</ToolbarButton>
			<ToolbarButton
				label="Daftar poin"
				isActive={state.isBulletList}
				onClick={() => editor.chain().focus().toggleBulletList().run()}
			>
				<ListIcon />
			</ToolbarButton>
			<ToolbarButton
				label="Daftar bernomor"
				isActive={state.isOrderedList}
				onClick={() => editor.chain().focus().toggleOrderedList().run()}
			>
				<ListOrderedIcon />
			</ToolbarButton>

			<Separator orientation="vertical" className="mx-1 h-4 data-vertical:self-center" />

			<ToolbarButton label="Tautan" isActive={state.isLink} onClick={() => promptLink(editor)}>
				<LinkIcon />
			</ToolbarButton>
			<ToolbarButton
				label="Kode"
				isActive={state.isCode}
				onClick={() => editor.chain().focus().toggleCode().run()}
			>
				<CodeIcon />
			</ToolbarButton>
		</div>
	)
}

type RichTextEditorProps = {
	id?: string
	value: string
	onChange: (html: string) => void
	onBlur?: () => void
	"aria-invalid"?: boolean
	// Styles the editable area, so it can match where the HTML is rendered later
	contentClassName?: string
	className?: string
}

// Uncontrolled after mount: `value` only seeds the editor, later edits flow out through `onChange`
export default function RichTextEditor({
	id,
	value,
	onChange,
	onBlur,
	"aria-invalid": ariaInvalid,
	contentClassName,
	className,
}: RichTextEditorProps) {
	const editor = useEditor({
		extensions: [
			StarterKit.configure({
				heading: { levels: [2] },
				link: { openOnClick: false },
			}),
		],
		content: value,
		// Next.js renders on the server first; creating the editor there causes hydration mismatches
		immediatelyRender: false,
		editorProps: {
			attributes: {
				...(id && { id }),
				class: cn("min-h-64 px-3 py-2.5 outline-none", contentClassName),
			},
		},
		onUpdate: ({ editor }) => onChange(editor.getHTML()),
		onBlur: () => onBlur?.(),
	})

	return (
		<div
			data-slot="rich-text-editor"
			aria-invalid={ariaInvalid}
			className={cn(
				"rounded-sm border border-input transition-colors focus-within:border-ring focus-within:ring-1 focus-within:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-1 aria-invalid:ring-destructive/20",
				className,
			)}
		>
			{editor ? (
				<>
					<RichTextToolbar editor={editor} />
					<EditorContent editor={editor} className="max-h-[480px] overflow-y-auto" />
				</>
			) : (
				// Keeps the layout steady until the editor mounts on the client
				<div className="min-h-[calc(--spacing(64)+--spacing(9)+1px)]" />
			)}
		</div>
	)
}
