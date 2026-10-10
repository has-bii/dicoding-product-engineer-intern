import type { ExperienceLevel, JobType } from "@/features/vacancy/types"

export const VACANCY_SEARCH_PARAM = "title"

// The backend has no company fields; every vacancy belongs to Dicoding
export const COMPANY_NAME = "Dicoding Indonesia"
export const COMPANY_LOGO_URL = "/images/company-logo-dicoding.png"
export const COMPANY_URL = "https://www.dicoding.com"
export const COMPANY_SECTOR = "Technology"
export const COMPANY_SIZE = "50-100 Karyawan"

export const jobTypeLabels: Record<JobType, string> = {
	full_time: "Full-Time",
	part_time: "Part-Time",
	contract: "Kontrak",
	internship: "Intern",
}

export const experienceLabels: Record<ExperienceLevel, string> = {
	less_than_1: "Kurang dari 1 tahun",
	"1_to_3": "1-3 tahun",
	"4_to_5": "4-5 tahun",
	"6_to_10": "6-10 tahun",
	more_than_10: "Lebih dari 10 tahun",
}

// The description is HTML authored in the rich text editor (h2, p, ul, ol, a, code); no typography plugin, so style it here
export const descriptionClassName = [
	"flex flex-col text-base text-[#18181B] leading-[22px] tracking-[-0.011em]",
	"[&_h2]:mb-2 [&_h2]:font-semibold [&_h2]:text-xl [&_h2]:leading-7 [&_h2]:tracking-[-0.017em] [&_h2:not(:first-child)]:mt-8",
	"[&_p+p]:mt-[22px] [&_p+ul]:mt-[22px] [&_ul+p]:mt-[22px]",
	"[&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_p+ol]:mt-[22px] [&_ol+p]:mt-[22px]",
	"[&_code]:rounded-[4px] [&_code]:bg-[#F4F4F5] [&_code]:px-1 [&_code]:font-mono [&_code]:text-sm",
	"[&_a]:underline [&_a]:underline-offset-2",
].join(" ")
