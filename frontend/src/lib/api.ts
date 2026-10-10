import axios from "axios"

let authToken: string | null = null

export function setAuthToken(token: string | null) {
	authToken = token
}

export const api = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api",
	headers: {
		Accept: "application/json",
	},
})

api.interceptors.request.use((config) => {
	if (authToken) {
		config.headers.set("Authorization", `Bearer ${authToken}`)
	}
	return config
})
