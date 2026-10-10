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
