"use client"

import { QueryErrorResetBoundary, useSuspenseInfiniteQuery } from "@tanstack/react-query"
import { useSearchParams } from "next/navigation"
import { ErrorBoundary } from "react-error-boundary"
import ErrorAlert from "@/components/error-alert"
import { Button } from "@/components/ui/button"
import { getVacanciesInfiniteQueryOptions } from "@/features/vacancy/api/get-vacancies"
import VacancyCard from "@/features/vacancy/components/list/vacancy-card"
import { VacancyCardSkeleton } from "@/features/vacancy/components/list/vacancy-card-skeleton"
import { VACANCY_SEARCH_PARAM } from "@/features/vacancy/constants"
import { getErrorMessage } from "@/lib/utils"

export default function VacancyListResults() {
	const searchParams = useSearchParams()
	const title = searchParams.get(VACANCY_SEARCH_PARAM) ?? ""

	return (
		<QueryErrorResetBoundary>
			{({ reset }) => (
				<ErrorBoundary
					onReset={reset}
					resetKeys={[title]}
					fallbackRender={({ error, resetErrorBoundary }) => (
						<ErrorAlert
							title="Gagal memuat lowongan"
							description={getErrorMessage(error)}
							onRetry={resetErrorBoundary}
						/>
					)}
				>
					<VacancyListItems title={title} />
				</ErrorBoundary>
			)}
		</QueryErrorResetBoundary>
	)
}

type VacancyListItemsProps = {
	title: string
}

function VacancyListItems({ title }: VacancyListItemsProps) {
	const { data, error, fetchNextPage, hasNextPage, isFetchingNextPage, isFetchNextPageError } =
		useSuspenseInfiniteQuery(getVacanciesInfiniteQueryOptions(title))

	const vacancies = data.pages.flatMap((page) => page.data)

	if (vacancies.length === 0) {
		return (
			<p className="py-12 text-center text-[#52525B] text-sm">
				{title
					? `Tidak ada lowongan yang cocok dengan "${title}".`
					: "Belum ada lowongan yang tersedia."}
			</p>
		)
	}

	return (
		<div className="flex flex-col gap-6">
			<ul className="flex flex-col gap-6">
				{vacancies.map((vacancy) => (
					<li key={vacancy.id}>
						<VacancyCard vacancy={vacancy} />
					</li>
				))}
				{isFetchingNextPage && (
					<li>
						<VacancyCardSkeleton />
					</li>
				)}
			</ul>

			{/* Next-page errors keep existing data, so they're shown inline instead of via the boundary */}
			{isFetchNextPageError && (
				<ErrorAlert
					title="Gagal memuat lowongan berikutnya"
					description={getErrorMessage(error)}
					onRetry={() => fetchNextPage()}
				/>
			)}

			{hasNextPage && !isFetchNextPageError && (
				<Button
					variant="outline"
					className="self-center"
					disabled={isFetchingNextPage}
					onClick={() => fetchNextPage()}
				>
					{isFetchingNextPage ? "Memuat..." : "Muat lebih banyak"}
				</Button>
			)}
		</div>
	)
}
