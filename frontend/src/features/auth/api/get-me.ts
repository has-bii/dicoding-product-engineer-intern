import { queryOptions } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { tokenStorage } from "@/lib/token-storage"
import { isUnauthorizedError } from "@/lib/utils"
import type { User } from "../types"

// Resolves to null for guests instead of throwing, so callers can branch on the user
export const getMe = async () => {
	if (!tokenStorage.get()) return null

	try {
		const res = await api.get<User>("/auth/me")
		return res.data
	} catch (error) {
		if (isUnauthorizedError(error)) return null
		throw error
	}
}

export const ME_QUERY_KEY = ["me"]

export const getMeQueryOptions = () => {
	return queryOptions({
		queryKey: ME_QUERY_KEY,
		queryFn: getMe,
	})
}
