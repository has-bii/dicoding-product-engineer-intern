"use client"

import { cn } from "cn"
import { format, parseISO } from "date-fns"
import { id as idLocale } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"
import { useState } from "react"
import type { Matcher } from "react-day-picker"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

type DatePickerProps = {
	id?: string
	// ISO date (yyyy-MM-dd) or empty string, matching what the API sends and expects
	value: string
	onChange: (value: string) => void
	onBlur?: () => void
	disabled?: Matcher | Matcher[]
	placeholder?: string
	"aria-invalid"?: boolean
	className?: string
}

export default function DatePicker({
	id,
	value,
	onChange,
	onBlur,
	disabled,
	placeholder = "Pilih tanggal",
	"aria-invalid": ariaInvalid,
	className,
}: DatePickerProps) {
	const [open, setOpen] = useState(false)
	const selected = value ? parseISO(value) : undefined

	return (
		<Popover
			open={open}
			onOpenChange={(nextOpen) => {
				setOpen(nextOpen)
				if (!nextOpen) onBlur?.()
			}}
		>
			<PopoverTrigger
				render={
					<Button
						id={id}
						type="button"
						variant="outline"
						aria-invalid={ariaInvalid}
						className={cn(
							"h-8 w-full justify-between rounded-none border-input px-2.5 text-xs",
							!selected && "text-muted-foreground",
							className,
						)}
					/>
				}
			>
				{selected ? format(selected, "d MMMM yyyy", { locale: idLocale }) : placeholder}
				<CalendarIcon className="text-muted-foreground" />
			</PopoverTrigger>
			<PopoverContent align="start" className="w-auto p-0">
				<Calendar
					mode="single"
					locale={idLocale}
					selected={selected}
					defaultMonth={selected}
					disabled={disabled}
					onSelect={(date) => {
						onChange(date ? format(date, "yyyy-MM-dd") : "")
						setOpen(false)
						onBlur?.()
					}}
				/>
			</PopoverContent>
		</Popover>
	)
}
