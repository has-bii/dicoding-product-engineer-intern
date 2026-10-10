"use client"

import { QueryErrorResetBoundary, useSuspenseQuery } from "@tanstack/react-query"
import { useParams } from "next/navigation"
import { ErrorBoundary } from "react-error-boundary"
import ErrorAlert from "@/components/error-alert"
import { getVacancyQueryOptions } from "@/features/vacancy/api/get-vacancy"
import VacancyDetail from "@/features/vacancy/components/detail/vacancy-detail"
import VacancyNotFound from "@/features/vacancy/components/detail/vacancy-not-found"
import { getErrorMessage, isNotFoundError } from "@/lib/utils"

// Suspends into the Suspense boundary that next/dynamic (ssr: false) wraps around this module
export default function VacancyDetailResults() {
	const { id } = useParams<{ id: string }>()

	return (
		<QueryErrorResetBoundary>
			{({ reset }) => (
				<ErrorBoundary
					onReset={reset}
					resetKeys={[id]}
					fallbackRender={({ error, resetErrorBoundary }) =>
						isNotFoundError(error) ? (
							<VacancyNotFound />
						) : (
							<section className="px-8">
								<div className="mx-auto max-w-[730px] py-12">
									<ErrorAlert
										title="Gagal memuat lowongan"
										description={getErrorMessage(error)}
										onRetry={resetErrorBoundary}
									/>
								</div>
							</section>
						)
					}
				>
					<VacancyDetailData id={id} />
				</ErrorBoundary>
			)}
		</QueryErrorResetBoundary>
	)
}

type VacancyDetailDataProps = {
	id: string
}

function VacancyDetailData({ id }: VacancyDetailDataProps) {
	const { data } = useSuspenseQuery(getVacancyQueryOptions(id))

	return <VacancyDetail vacancy={data} />
}
