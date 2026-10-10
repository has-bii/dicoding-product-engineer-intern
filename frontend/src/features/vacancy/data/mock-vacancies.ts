import type { Vacancy } from "@/features/vacancy/types"

const baseVacancy = {
	companyName: "Dicoding Indonesia",
	companyLogoUrl: "/images/company-logo-dicoding.png",
	employmentType: "Full-time",
	location: "Bandung",
	createdAt: "2023-12-15",
	applyBefore: "2023-12-30",
}

export const mockVacancies: Array<Vacancy> = [
	{ ...baseVacancy, id: "1", title: "Product Engineer", experience: "1-3 tahun" },
	{ ...baseVacancy, id: "2", title: "Android Developer", experience: "4-5 tahun" },
	{ ...baseVacancy, id: "3", title: "iOS Developer", experience: "1-3 tahun" },
	{ ...baseVacancy, id: "4", title: "Code Reviewer", experience: "Kurang dari 1 tahun" },
]
