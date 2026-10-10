import { infiniteQueryOptions } from "@tanstack/react-query"
import { api } from "@/lib/api"
import type { Paginated } from "@/types/paginated"
import type { Vacancy } from "../types"

type GetVacanciesParams = {
	title?: string
	cursor?: string | null
}

export const getVacancies = async ({ title, cursor }: GetVacanciesParams = {}) => {
	const res = await api.get<Paginated<Vacancy[]>>("/vacancy", {
		params: {
			title: title || undefined,
			cursor: cursor || undefined,
		},
	})

	return res.data
}

export const VACANCIES_QUERY_KEY = (query?: string) => ["vacancies", query]

export const getVacanciesInfiniteQueryOptions = (query?: string) => {
	return infiniteQueryOptions({
		queryKey: VACANCIES_QUERY_KEY(query),
		queryFn: ({ pageParam }) => getVacancies({ title: query, cursor: pageParam }),
		initialPageParam: null as string | null,
		getNextPageParam: (lastPage) => lastPage.next_cursor,
	})
}
