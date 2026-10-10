"use client"

import dynamic from "next/dynamic"
import { VacancyListSkeleton } from "@/features/vacancy/components/list/vacancy-list-skeleton"

// next/dynamic with ssr: false is only allowed inside a Client Component
const VacancyListResults = dynamic(
	() => import("@/features/vacancy/components/list/vacancy-list-results"),
	{
		ssr: false,
		loading: () => <VacancyListSkeleton />,
	},
)

export default function VacancyListContent() {
	return <VacancyListResults />
}
