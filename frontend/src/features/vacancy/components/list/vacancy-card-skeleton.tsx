import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function VacancyCardSkeleton() {
	return (
		<Card aria-hidden className="flex-row gap-4 rounded-[4px] p-4! shadow-none ring-[#E4E4E7]">
			<Skeleton className="size-16 shrink-0 rounded-[4px] md:size-24" />

			<CardContent className="flex flex-1 flex-col justify-between gap-4 px-0 md:flex-row md:gap-2">
				<div className="flex flex-col gap-4">
					<Skeleton className="h-[22px] w-56" />
					<div className="flex flex-col gap-2">
						<div className="flex gap-4">
							<Skeleton className="h-4 w-32" />
							<Skeleton className="h-4 w-16" />
						</div>
						<div className="flex gap-4">
							<Skeleton className="h-4 w-24" />
							<Skeleton className="h-4 w-28" />
						</div>
					</div>
				</div>

				<div className="flex flex-col gap-2 md:items-end">
					<Skeleton className="h-4 w-40" />
					<Skeleton className="h-4 w-44" />
				</div>
			</CardContent>
		</Card>
	)
}
