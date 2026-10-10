"use client"

import dynamic from "next/dynamic"
import AuthGuard from "@/features/auth/components/auth-guard"
import { MyVacancyListSkeleton } from "@/features/vacancy/components/dashboard/my-vacancy-list-skeleton"

const MyVacancyResults = dynamic(
	() => import("@/features/vacancy/components/dashboard/my-vacancy-results"),
	{
		ssr: false,
		loading: () => <MyVacancyListSkeleton />,
	},
)

export default function MyVacancyContent() {
	return (
		<AuthGuard fallback={<MyVacancyListSkeleton />}>
			<MyVacancyResults />
		</AuthGuard>
	)
}
