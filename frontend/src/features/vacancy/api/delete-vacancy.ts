import { mutationOptions } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { MY_VACANCIES_QUERY_KEY } from "./get-my-vacancies"
import { VACANCIES_QUERY_KEY } from "./get-vacancies"
import { VACANCY_QUERY_KEY } from "./get-vacancy"

type DeleteVacancyParams = {
	id: string
}

export const deleteVacancy = async ({ id }: DeleteVacancyParams) => {
	await api.delete(`/vacancy/${id}`)
}

export const deleteVacancyMutationOptions = () => {
	return mutationOptions({
		mutationFn: deleteVacancy,
		onSuccess: async (_data, { id }, _onMutateResult, { client }) => {
			client.removeQueries({ queryKey: VACANCY_QUERY_KEY(id) })
			await Promise.all([
				client.invalidateQueries({ queryKey: MY_VACANCIES_QUERY_KEY().slice(0, 1) }),
				client.invalidateQueries({ queryKey: VACANCIES_QUERY_KEY().slice(0, 1) }),
			])
		},
	})
}
