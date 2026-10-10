"use client"

import dynamic from "next/dynamic"
import { VacancyListSkeleton } from "@/features/vacancy/components/list/vacancy-list-skeleton"

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
