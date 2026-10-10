import { BriefcaseBusinessIcon, Building2Icon, MapPinIcon } from "lucide-react"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import type { ExperienceLevel, JobType, Vacancy } from "@/features/vacancy/types"

// The backend has no company field; every vacancy belongs to Dicoding
const COMPANY_NAME = "Dicoding Indonesia"
const COMPANY_LOGO_URL = "/images/company-logo-dicoding.png"

const jobTypeLabels: Record<JobType, string> = {
	full_time: "Full-Time",
	part_time: "Part-Time",
	contract: "Kontrak",
	internship: "Intern",
}

const experienceLabels: Record<ExperienceLevel, string> = {
	less_than_1: "Kurang dari 1 tahun",
	"1_to_3": "1-3 tahun",
	"4_to_5": "4-5 tahun",
	"6_to_10": "6-10 tahun",
	more_than_10: "Lebih dari 10 tahun",
}

const dateFormatter = new Intl.DateTimeFormat("id-ID", {
	day: "numeric",
	month: "long",
	year: "numeric",
})

type VacancyCardProps = {
	vacancy: Vacancy
}

export default function VacancyCard({ vacancy }: VacancyCardProps) {
	return (
		<Card className="flex-row gap-4 rounded-[4px] p-4! text-[#18181B] text-xs leading-[17px] shadow-none ring-[#E4E4E7]">
			<img
				src={COMPANY_LOGO_URL}
				alt={`Logo ${COMPANY_NAME}`}
				className="size-16 shrink-0 rounded-[4px] object-cover md:size-24"
			/>

			<CardContent className="flex flex-1 flex-col justify-between gap-4 px-0 md:flex-row md:gap-2">
				<div className="flex flex-col gap-4">
					<CardTitle className="font-sans text-base normal-case leading-[22px] tracking-normal">
						{vacancy.title}
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
						Dibuat pada{" "}
						<time dateTime={vacancy.created_at}>
							{dateFormatter.format(new Date(vacancy.created_at))}
						</time>
					</p>
					<p>
						Lamar sebelum{" "}
						<time dateTime={vacancy.active_until}>
							{dateFormatter.format(new Date(vacancy.active_until))}
						</time>
					</p>
				</div>
			</CardContent>
		</Card>
	)
}
