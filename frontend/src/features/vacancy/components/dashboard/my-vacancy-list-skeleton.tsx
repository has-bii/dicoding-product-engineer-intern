import { MyVacancyCardSkeleton } from "@/features/vacancy/components/dashboard/my-vacancy-card-skeleton"

type MyVacancyListSkeletonProps = {
	count?: number
}

export function MyVacancyListSkeleton({ count = 4 }: MyVacancyListSkeletonProps) {
	return (
		<ul className="flex flex-col gap-6">
			{Array.from({ length: count }, (_, i) => (
				// biome-ignore lint/suspicious/noArrayIndexKey: static placeholders
				<li key={i}>
					<MyVacancyCardSkeleton />
				</li>
			))}
		</ul>
	)
}
