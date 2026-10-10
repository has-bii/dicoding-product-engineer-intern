import { queryOptions } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { isNotFoundError } from "@/lib/utils"
import type { VacancyDetail } from "../types"

type GetVacancyParams = {
	id: string
}

export const getVacancy = async ({ id }: GetVacancyParams) => {
	const res = await api.get<VacancyDetail>(`/vacancy/${id}`)

	return res.data
}

export const VACANCY_QUERY_KEY = (id: string) => ["vacancy", id]

export const getVacancyQueryOptions = (id: string) => {
	return queryOptions({
		queryKey: VACANCY_QUERY_KEY(id),
		queryFn: () => getVacancy({ id }),
		// A missing vacancy won't appear on retry, so surface the 404 right away
		retry: (failureCount, error) => !isNotFoundError(error) && failureCount < 3,
	})
}
