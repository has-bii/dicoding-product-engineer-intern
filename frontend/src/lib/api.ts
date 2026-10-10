import axios from "axios"
import { tokenStorage } from "@/lib/token-storage"
import { isUnauthorizedError } from "@/lib/utils"

export const api = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api",
	headers: {
		Accept: "application/json",
	},
})

api.interceptors.request.use((config) => {
	const token = typeof window !== "undefined" ? tokenStorage.get() : null
	if (token) {
		config.headers.set("Authorization", `Bearer ${token}`)
	}
	return config
})

api.interceptors.response.use(undefined, (error) => {
	// The token was revoked or expired, so drop it and let the auth guard ask for a new login
	if (isUnauthorizedError(error)) tokenStorage.clear()
	return Promise.reject(error)
})
