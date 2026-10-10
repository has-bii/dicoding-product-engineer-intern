import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import VacancyListContent from "@/features/vacancy/components/list/vacancy-list-content"
import VacancySearch from "@/features/vacancy/components/list/vacancy-search"

export default function VacancyList() {
	return (
		<section className="px-8">
			<div className="mx-auto flex max-w-6xl flex-col gap-6 py-12">
				<div className="mx-auto flex w-full max-w-[730px] flex-col gap-6">
					<div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
						<h2 className="font-semibold text-2xl text-[#18181B] leading-[34px]">
							Daftar Pekerjaan Terbaru
						</h2>
						<Suspense fallback={<Skeleton className="h-11 flex-1 lg:max-w-sm" />}>
							<VacancySearch />
						</Suspense>
					</div>

					<VacancyListContent />
				</div>
			</div>
		</section>
	)
}
