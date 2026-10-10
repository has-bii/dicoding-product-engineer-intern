"use client"

import { QueryErrorResetBoundary, useSuspenseInfiniteQuery } from "@tanstack/react-query"
import { ErrorBoundary } from "react-error-boundary"
import ErrorAlert from "@/components/error-alert"
import { Button } from "@/components/ui/button"
import { getMyVacanciesInfiniteQueryOptions } from "@/features/vacancy/api/get-my-vacancies"
import MyVacancyCard from "@/features/vacancy/components/dashboard/my-vacancy-card"
import { MyVacancyCardSkeleton } from "@/features/vacancy/components/dashboard/my-vacancy-card-skeleton"
import { getErrorMessage } from "@/lib/utils"

export default function MyVacancyResults() {
	return (
		<QueryErrorResetBoundary>
			{({ reset }) => (
				<ErrorBoundary
					onReset={reset}
					fallbackRender={({ error, resetErrorBoundary }) => (
						<ErrorAlert
							title="Gagal memuat lowongan"
							description={getErrorMessage(error)}
							onRetry={resetErrorBoundary}
						/>
					)}
				>
					<MyVacancyItems />
				</ErrorBoundary>
			)}
		</QueryErrorResetBoundary>
	)
}

function MyVacancyItems() {
	const { data, error, fetchNextPage, hasNextPage, isFetchingNextPage, isFetchNextPageError } =
		useSuspenseInfiniteQuery(getMyVacanciesInfiniteQueryOptions())

	const vacancies = data.pages.flatMap((page) => page.data)

	if (vacancies.length === 0) {
		return <p className="py-12 text-center text-[#52525B] text-sm">Belum ada lowongan.</p>
	}

	return (
		<div className="flex flex-col gap-6">
			<ul className="flex flex-col gap-6">
				{vacancies.map((vacancy) => (
					<li key={vacancy.id}>
						<MyVacancyCard vacancy={vacancy} />
					</li>
				))}
				{isFetchingNextPage && (
					<li>
						<MyVacancyCardSkeleton />
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
