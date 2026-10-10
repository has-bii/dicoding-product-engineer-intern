import { api } from "@/lib/api"
import type { VacancyInput } from "../schemas"
import type { VacancyDetail } from "../types"

export const createVacancy = async (input: VacancyInput) => {
	const res = await api.post<VacancyDetail>("/vacancy", input)

	return res.data
}
