import { infiniteQueryOptions } from "@tanstack/react-query"
import { api } from "@/lib/api"
import type { Paginated } from "@/types/paginated"
import type { Vacancy } from "../types"

type GetMyVacanciesParams = {
	title?: string
	cursor?: string | null
}

export const getMyVacancies = async ({ title, cursor }: GetMyVacanciesParams = {}) => {
	const res = await api.get<Paginated<Vacancy[]>>("/vacancy/mine", {
		params: {
			title: title || undefined,
			cursor: cursor || undefined,
		},
	})

	return res.data
}

export const MY_VACANCIES_QUERY_KEY = (query?: string) => ["my-vacancies", query]

export const getMyVacanciesInfiniteQueryOptions = (query?: string) => {
	return infiniteQueryOptions({
		queryKey: MY_VACANCIES_QUERY_KEY(query),
		queryFn: ({ pageParam }) => getMyVacancies({ title: query, cursor: pageParam }),
		initialPageParam: null as string | null,
		getNextPageParam: (lastPage) => lastPage.next_cursor,
	})
}
