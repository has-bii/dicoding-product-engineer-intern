import { mutationOptions } from "@tanstack/react-query"
import { api } from "@/lib/api"
import type { VacancyInput } from "../schemas"
import type { VacancyDetail } from "../types"
import { LOCATIONS_QUERY_KEY } from "./get-locations"
import { MY_VACANCIES_QUERY_KEY } from "./get-my-vacancies"
import { VACANCIES_QUERY_KEY } from "./get-vacancies"

export const createVacancy = async (input: VacancyInput) => {
	const res = await api.post<VacancyDetail>("/vacancy", input)

	return res.data
}

export const createVacancyMutationOptions = () => {
	return mutationOptions({
		mutationFn: createVacancy,
		onSuccess: async (_created, _input, _onMutateResult, { client }) => {
			await Promise.all([
				client.invalidateQueries({ queryKey: MY_VACANCIES_QUERY_KEY().slice(0, 1) }),
				client.invalidateQueries({ queryKey: VACANCIES_QUERY_KEY().slice(0, 1) }),
				client.invalidateQueries({ queryKey: LOCATIONS_QUERY_KEY }),
			])
		},
	})
}
