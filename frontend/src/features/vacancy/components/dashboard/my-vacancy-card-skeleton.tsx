import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function MyVacancyCardSkeleton() {
	return (
		<Card aria-hidden orientation="horizontal">
			<Skeleton className="size-16 shrink-0 rounded-sm" />

			<CardContent className="flex flex-1 flex-col gap-6">
				<div className="flex flex-col gap-2">
					<Skeleton className="h-[22px] w-56" />
					<div className="flex flex-wrap gap-x-4 gap-y-2">
						<Skeleton className="h-5 w-40" />
						<Skeleton className="h-5 w-48" />
					</div>
				</div>

				<div className="flex gap-3">
					<Skeleton className="h-9 w-20" />
					<Skeleton className="h-9 w-24" />
				</div>
			</CardContent>
		</Card>
	)
}
