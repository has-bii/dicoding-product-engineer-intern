"use client"

import { SearchIcon, XIcon } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupInput,
} from "@/components/ui/input-group"
import { VACANCY_SEARCH_PARAM } from "@/features/vacancy/constants"
import { useDebounce } from "@/hooks/use-debounce"

export default function VacancySearch() {
	const router = useRouter()
	const pathname = usePathname()
	const searchParams = useSearchParams()
	const title = searchParams.get(VACANCY_SEARCH_PARAM) ?? ""

	const [value, setValue] = useState(title)
	const debouncedValue = useDebounce(value.trim(), 400)

	useEffect(() => {
		if (debouncedValue === title) return

		const params = new URLSearchParams(searchParams)
		if (debouncedValue) params.set(VACANCY_SEARCH_PARAM, debouncedValue)
		else params.delete(VACANCY_SEARCH_PARAM)

		const queryString = params.toString()
		router.replace(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false })
	}, [debouncedValue, title, searchParams, pathname, router])

	return (
		<InputGroup className="h-11 flex-1 lg:max-w-sm">
			<InputGroupAddon className="pr-1 pl-3 text-[#52525B]">
				<SearchIcon className="size-5" />
			</InputGroupAddon>
			<InputGroupInput
				type="text"
				aria-label="Cari lowongan"
				placeholder="Pekerjaan apa yang sedang kamu cari?"
				className="placeholder:text-[#52525B] placeholder:text-sm"
				value={value}
				onChange={(e) => setValue(e.target.value)}
			/>
			{value && (
				<InputGroupAddon align="inline-end" className="pr-3 text-[#52525B]">
					<InputGroupButton
						size="icon-xs"
						aria-label="Hapus pencarian"
						onClick={() => setValue("")}
					>
						<XIcon className="size-4" />
					</InputGroupButton>
				</InputGroupAddon>
			)}
		</InputGroup>
	)
}
