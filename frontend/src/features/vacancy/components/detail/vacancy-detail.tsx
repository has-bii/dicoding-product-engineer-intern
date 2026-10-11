import { BanknoteIcon, Building2Icon, MapPinIcon, UsersIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
	COMPANY_LOGO_URL,
	COMPANY_NAME,
	COMPANY_SECTOR,
	COMPANY_SIZE,
	COMPANY_URL,
	descriptionClassName,
	experienceLabels,
	jobTypeLabels,
} from "@/features/vacancy/constants"
import type { VacancyDetail as VacancyDetailData } from "@/features/vacancy/types"
import { formatCurrency } from "@/lib/utils"

// A missing salary_max means the range has no upper bound
function formatSalaryRange(min: number, max: number | null | undefined) {
	return max == null
		? `Mulai dari ${formatCurrency(min)}`
		: `${formatCurrency(min)} - ${formatCurrency(max)}`
}

type VacancyDetailHeaderProps = {
	vacancy: VacancyDetailData
}

function VacancyDetailHeader({ vacancy }: VacancyDetailHeaderProps) {
	return (
		<section className="border-b px-8">
			<div className="mx-auto flex max-w-6xl gap-4 py-8">
				<img
					src={COMPANY_LOGO_URL}
					alt={`Logo ${COMPANY_NAME}`}
					className="size-16 shrink-0 rounded-[4px] border object-cover md:size-24"
				/>

				<div className="flex flex-col justify-center gap-2 pb-2">
					<h1 className="font-semibold text-2xl text-[#18181B] leading-[34px] tracking-[-0.019em]">
						{vacancy.title}
					</h1>
					<p className="text-[#52525B] text-sm leading-5 tracking-[-0.006em]">
						Sektor Bisnis: {COMPANY_SECTOR}
					</p>
					<div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[#18181B] text-xs leading-[17px]">
						<span className="flex items-center gap-1">
							<Building2Icon className="size-4" />
							<a
								href={COMPANY_URL}
								target="_blank"
								rel="noopener noreferrer"
								className="text-[#3B82F6] underline underline-offset-2"
							>
								{COMPANY_NAME}
							</a>
						</span>
						<span className="flex items-center gap-1">
							<MapPinIcon className="size-4" />
							{vacancy.location}
						</span>
						<span className="flex items-center gap-1">
							<UsersIcon className="size-4" />
							{COMPANY_SIZE}
						</span>
						{vacancy.show_salary && vacancy.salary_min !== undefined && (
							<span className="flex items-center gap-1">
								<BanknoteIcon className="size-4" />
								{formatSalaryRange(vacancy.salary_min, vacancy.salary_max)}
							</span>
						)}
					</div>
				</div>
			</div>
		</section>
	)
}

type VacancyDetailProps = {
	vacancy: VacancyDetailData
}

export default function VacancyDetail({ vacancy }: VacancyDetailProps) {
	return (
		<>
			<VacancyDetailHeader vacancy={vacancy} />

			<section className="px-8">
				<div className="mx-auto flex max-w-[730px] flex-col gap-10 pt-8 pb-16">
					<div className="flex flex-col gap-8">
						<Badge
							variant={vacancy.job_type}
							className="h-auto px-4 py-2 font-semibold text-sm leading-[14px] tracking-[-0.006em]"
						>
							{jobTypeLabels[vacancy.job_type]}
						</Badge>

						<div
							className={descriptionClassName}
							// biome-ignore lint/security/noDangerouslySetInnerHtml: description is HTML authored by admins
							dangerouslySetInnerHTML={{ __html: vacancy.description }}
						/>
					</div>

					<div className="flex flex-col gap-2 text-[#18181B] text-base leading-[22px] tracking-[-0.011em]">
						<h2 className="font-semibold text-xl leading-7 tracking-[-0.017em]">
							Informasi Tambahan
						</h2>
						<dl className="grid gap-4 sm:grid-cols-2">
							<div className="flex flex-col gap-2">
								<dt className="font-semibold">Pengalaman bekerja</dt>
								<dd>{experienceLabels[vacancy.min_experience]}</dd>
							</div>
							<div className="flex flex-col gap-2">
								<dt className="font-semibold">Kandidat yang dibutuhkan</dt>
								<dd>{vacancy.candidates_needed} kandidat</dd>
							</div>
						</dl>
					</div>
				</div>
			</section>
		</>
	)
}
