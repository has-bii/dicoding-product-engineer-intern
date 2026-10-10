import { Skeleton } from "@/components/ui/skeleton"

function DescriptionSectionSkeleton({ lines }: { lines: number }) {
	return (
		<div className="flex flex-col gap-2">
			<Skeleton className="h-7 w-48" />
			<div className="flex flex-col gap-1.5">
				{Array.from({ length: lines }, (_, i) => (
					// biome-ignore lint/suspicious/noArrayIndexKey: static placeholders
					<Skeleton key={i} className="h-4 w-full last:w-2/3" />
				))}
			</div>
		</div>
	)
}

export default function VacancyDetailSkeleton() {
	return (
		<div aria-hidden>
			<section className="border-[#E4E4E7] border-b px-8">
				<div className="mx-auto flex max-w-6xl gap-4 py-8">
					<Skeleton className="size-16 shrink-0 rounded-[4px] md:size-24" />
					<div className="flex flex-col justify-center gap-2 pb-2">
						<Skeleton className="h-[34px] w-64" />
						<Skeleton className="h-5 w-44" />
						<div className="flex flex-wrap gap-4">
							<Skeleton className="h-4 w-32" />
							<Skeleton className="h-4 w-20" />
							<Skeleton className="h-4 w-28" />
						</div>
					</div>
				</div>
			</section>

			<section className="px-8">
				<div className="mx-auto flex max-w-[730px] flex-col gap-10 pt-8 pb-16">
					<div className="flex flex-col gap-8">
						<Skeleton className="h-[30px] w-24 rounded-full" />
						<DescriptionSectionSkeleton lines={5} />
						<DescriptionSectionSkeleton lines={4} />
						<DescriptionSectionSkeleton lines={6} />
					</div>

					<div className="flex flex-col gap-2">
						<Skeleton className="h-7 w-52" />
						<div className="grid gap-4 sm:grid-cols-2">
							<div className="flex flex-col gap-2">
								<Skeleton className="h-[22px] w-40" />
								<Skeleton className="h-[22px] w-20" />
							</div>
							<div className="flex flex-col gap-2">
								<Skeleton className="h-[22px] w-48" />
								<Skeleton className="h-[22px] w-24" />
							</div>
						</div>
					</div>
				</div>
			</section>
		</div>
	)
}
