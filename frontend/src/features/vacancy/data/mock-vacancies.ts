import type { Vacancy } from "@/features/vacancy/types"

const baseVacancy = {
	job_type: "full_time",
	location: "Bandung",
	created_at: "2023-12-15T00:00:00.000000Z",
	active_until: "2023-12-30T00:00:00.000000Z",
} satisfies Partial<Vacancy>

export const mockVacancies: Array<Vacancy> = [
	{ ...baseVacancy, id: "1", title: "Product Engineer", min_experience: "1_to_3" },
	{ ...baseVacancy, id: "2", title: "Android Developer", min_experience: "4_to_5" },
	{ ...baseVacancy, id: "3", title: "iOS Developer", min_experience: "1_to_3" },
	{ ...baseVacancy, id: "4", title: "Code Reviewer", min_experience: "less_than_1" },
]
