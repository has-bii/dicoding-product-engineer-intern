import { api } from "@/lib/api"
import type { VacancyInput } from "../schemas"
import type { VacancyDetail } from "../types"

type UpdateVacancyParams = {
	id: string
	input: VacancyInput
}

export const updateVacancy = async ({ id, input }: UpdateVacancyParams) => {
	const res = await api.put<VacancyDetail>(`/vacancy/${id}`, input)

	return res.data
}
