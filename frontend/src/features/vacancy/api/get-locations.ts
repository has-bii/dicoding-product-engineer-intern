import { queryOptions } from "@tanstack/react-query"
import { api } from "@/lib/api"

export const getLocations = async () => {
	const res = await api.get<string[]>("/vacancy/locations")

	return res.data
}

export const LOCATIONS_QUERY_KEY = ["vacancy-locations"]

export const getLocationsQueryOptions = () => {
	return queryOptions({
		queryKey: LOCATIONS_QUERY_KEY,
		queryFn: getLocations,
	})
}
