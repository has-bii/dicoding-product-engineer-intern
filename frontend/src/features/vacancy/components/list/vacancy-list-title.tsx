"use client"

import { useSearchParams } from "next/navigation"
import { VACANCY_SEARCH_PARAM } from "@/features/vacancy/constants"
import { cn } from "@/lib/utils"

const DEFAULT_TITLE = "Daftar Pekerjaan Terbaru"
const SEARCH_TITLE = "Hasil Pencarian"

export function VacancyListTitleFallback() {
	return <h2 className="font-semibold text-2xl text-[#18181B] leading-[34px]">{DEFAULT_TITLE}</h2>
}

export default function VacancyListTitle() {
	const searchParams = useSearchParams()
	const isSearching = Boolean(searchParams.get(VACANCY_SEARCH_PARAM))

	return (
		<h2 className="h-[34px] overflow-hidden font-semibold text-2xl text-[#18181B] leading-[34px]">
			<span
				className={cn(
					"flex flex-col transition-transform duration-300 ease-out motion-reduce:transition-none",
					isSearching && "-translate-y-[34px]",
				)}
			>
				<span aria-hidden={isSearching}>{DEFAULT_TITLE}</span>
				<span aria-hidden={!isSearching}>{SEARCH_TITLE}</span>
			</span>
		</h2>
	)
}
