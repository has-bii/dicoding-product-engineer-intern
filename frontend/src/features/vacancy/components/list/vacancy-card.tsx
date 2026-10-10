import { BriefcaseBusinessIcon, Building2Icon, MapPinIcon } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import {
	COMPANY_LOGO_URL,
	COMPANY_NAME,
	experienceLabels,
	jobTypeLabels,
} from "@/features/vacancy/constants"
import type { Vacancy } from "@/features/vacancy/types"
import { formatDate } from "@/lib/utils"

type VacancyCardProps = {
	vacancy: Vacancy
}

export default function VacancyCard({ vacancy }: VacancyCardProps) {
	return (
		<Card
			orientation="horizontal"
			className="relative rounded-[4px] text-[#18181B] text-xs leading-[17px] transition-colors hover:bg-secondary"
		>
			<img
				src={COMPANY_LOGO_URL}
				alt={`Logo ${COMPANY_NAME}`}
				className="size-16 shrink-0 rounded-[4px] object-cover md:size-24"
			/>

			<CardContent className="flex flex-1 flex-col justify-between gap-4 md:flex-row md:gap-2">
				<div className="flex flex-col gap-4">
					<CardTitle className="font-sans text-base normal-case leading-[22px] tracking-normal">
						{/* Stretched link makes the whole card clickable */}
						<Link href={`/vacancy/${vacancy.id}`} className="after:absolute after:inset-0">
							{vacancy.title}
						</Link>
					</CardTitle>

					<div className="flex flex-col gap-2">
						<div className="flex flex-wrap items-center gap-x-4 gap-y-2">
							<span className="flex items-center gap-1">
								<Building2Icon className="size-4" />
								{COMPANY_NAME}
							</span>
							<span>{jobTypeLabels[vacancy.job_type]}</span>
						</div>
						<div className="flex flex-wrap items-center gap-x-4 gap-y-2">
							<span className="flex items-center gap-1">
								<MapPinIcon className="size-4" />
								{vacancy.location}
							</span>
							<span className="flex items-center gap-1">
								<BriefcaseBusinessIcon className="size-4" />
								{experienceLabels[vacancy.min_experience]}
							</span>
						</div>
					</div>
				</div>

				<div className="flex flex-col gap-2 text-[#52525B] md:items-end">
					<p>
						Dibuat pada <time dateTime={vacancy.created_at}>{formatDate(vacancy.created_at)}</time>
					</p>
					<p>
						Lamar sebelum{" "}
						<time dateTime={vacancy.active_until}>{formatDate(vacancy.active_until)}</time>
					</p>
				</div>
			</CardContent>
		</Card>
	)
}
