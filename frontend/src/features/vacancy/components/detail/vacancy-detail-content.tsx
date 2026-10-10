"use client"

import dynamic from "next/dynamic"
import VacancyDetailSkeleton from "@/features/vacancy/components/detail/vacancy-detail-skeleton"

const VacancyDetailResults = dynamic(
	() => import("@/features/vacancy/components/detail/vacancy-detail-results"),
	{
		ssr: false,
		loading: () => <VacancyDetailSkeleton />,
	},
)

export default function VacancyDetailContent() {
	return <VacancyDetailResults />
}
