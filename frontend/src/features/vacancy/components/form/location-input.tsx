"use client"

import { Autocomplete } from "@base-ui/react/autocomplete"
import { useQuery } from "@tanstack/react-query"
import { Input } from "@/components/ui/input"
import { getLocationsQueryOptions } from "@/features/vacancy/api/get-locations"

// Reuse the stored spelling when the typed location only differs in case or spacing, so "jakarta" doesn't sit beside "Jakarta"
export function matchLocation(value: string, locations: string[]) {
	const normalized = value.trim().replace(/\s+/g, " ")
	const key = normalized.toLocaleLowerCase("id")

	return locations.find((location) => location.toLocaleLowerCase("id") === key) ?? normalized
}

type LocationInputProps = {
	id?: string
	value: string
	onChange: (value: string) => void
	onBlur?: () => void
	"aria-invalid"?: boolean
}

// Free text with suggestions from existing vacancies; a new location is fine
export default function LocationInput({
	id,
	value,
	onChange,
	onBlur,
	"aria-invalid": ariaInvalid,
}: LocationInputProps) {
	const { data: locations = [] } = useQuery(getLocationsQueryOptions())

	return (
		<Autocomplete.Root items={locations} value={value} onValueChange={onChange}>
			<Autocomplete.Input
				id={id}
				placeholder="Pilih atau ketik lokasi"
				autoComplete="off"
				aria-invalid={ariaInvalid}
				render={<Input />}
				onBlur={() => {
					const matched = matchLocation(value, locations)
					if (matched !== value) onChange(matched)
					onBlur?.()
				}}
			/>

			<Autocomplete.Portal>
				<Autocomplete.Positioner sideOffset={4} align="start" className="isolate z-50">
					<Autocomplete.Popup className="data-open:fade-in-0 data-open:zoom-in-95 data-closed:fade-out-0 data-closed:zoom-out-95 w-(--anchor-width) max-w-(--available-width) origin-(--transform-origin) overflow-hidden bg-popover text-popover-foreground shadow-md ring-1 ring-foreground/10 duration-100 data-empty:hidden data-closed:animate-out data-open:animate-in">
						<Autocomplete.List className="max-h-[min(--spacing(72),var(--available-height))] scroll-py-1 overflow-y-auto overscroll-contain">
							{(location: string) => (
								<Autocomplete.Item
									key={location}
									value={location}
									className="flex w-full cursor-default select-none items-center px-2.5 py-2 text-xs outline-hidden data-highlighted:bg-accent data-highlighted:text-accent-foreground"
								>
									{location}
								</Autocomplete.Item>
							)}
						</Autocomplete.List>
					</Autocomplete.Popup>
				</Autocomplete.Positioner>
			</Autocomplete.Portal>
		</Autocomplete.Root>
	)
}
