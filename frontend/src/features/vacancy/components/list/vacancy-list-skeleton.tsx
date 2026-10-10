import { VacancyCardSkeleton } from "@/features/vacancy/components/list/vacancy-card-skeleton"

type VacancyListSkeletonProps = {
	count?: number
}

export function VacancyListSkeleton({ count = 4 }: VacancyListSkeletonProps) {
	return (
		<ul className="flex flex-col gap-6">
			{Array.from({ length: count }, (_, i) => (
				// biome-ignore lint/suspicious/noArrayIndexKey: static placeholders
				<li key={i}>
					<VacancyCardSkeleton />
				</li>
			))}
		</ul>
	)
}
