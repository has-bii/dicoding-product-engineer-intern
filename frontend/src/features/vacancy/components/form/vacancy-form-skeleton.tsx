import { Skeleton } from "@/components/ui/skeleton"

export function VacancyFormSkeleton() {
	return (
		<div className="flex max-w-[600px] flex-col gap-8">
			{Array.from({ length: 5 }, (_, i) => (
				// biome-ignore lint/suspicious/noArrayIndexKey: static placeholders
				<div key={i} className="flex flex-col gap-2">
					<Skeleton className="h-4 w-40" />
					<Skeleton className="h-8 w-full" />
				</div>
			))}
			<div className="flex flex-col gap-2">
				<Skeleton className="h-4 w-24" />
				<Skeleton className="h-72 w-full" />
			</div>
		</div>
	)
}
