import { mutationOptions } from "@tanstack/react-query"
import { api } from "@/lib/api"
import type { VacancyInput } from "../schemas"
import type { VacancyDetail } from "../types"
import { LOCATIONS_QUERY_KEY } from "./get-locations"
import { MY_VACANCIES_QUERY_KEY } from "./get-my-vacancies"
import { VACANCIES_QUERY_KEY } from "./get-vacancies"
import { VACANCY_QUERY_KEY } from "./get-vacancy"

type UpdateVacancyParams = {
	id: string
	input: VacancyInput
}

export const updateVacancy = async ({ id, input }: UpdateVacancyParams) => {
	const res = await api.put<VacancyDetail>(`/vacancy/${id}`, input)

	return res.data
}

export const updateVacancyMutationOptions = () => {
	return mutationOptions({
		mutationFn: updateVacancy,
		onSuccess: async (updated, { id }, _onMutateResult, { client }) => {
			client.setQueryData(VACANCY_QUERY_KEY(id), updated)
			await Promise.all([
				client.invalidateQueries({ queryKey: MY_VACANCIES_QUERY_KEY().slice(0, 1) }),
				client.invalidateQueries({ queryKey: VACANCIES_QUERY_KEY().slice(0, 1) }),
				client.invalidateQueries({ queryKey: LOCATIONS_QUERY_KEY }),
			])
		},
	})
}
