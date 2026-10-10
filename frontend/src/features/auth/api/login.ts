import { isAxiosError } from "axios"
import { api } from "@/lib/api"
import type { LoginInput } from "../schemas"
import type { User } from "../types"

type LoginResponse = {
	token: string
	token_type: "Bearer"
	user: User
}

export const login = async (input: LoginInput) => {
	const res = await api.post<LoginResponse>("/auth/login", input)

	return res.data
}

export function getLoginErrorMessage(error: unknown) {
	if (isAxiosError(error)) {
		const status = error.response?.status

		if (status === 422) {
			// Field validation failures carry `errors`; wrong credentials come back as a bare message
			return error.response?.data?.errors
				? error.response.data.message
				: "Email atau kata sandi salah."
		}
		if (status === 429) return "Terlalu banyak percobaan masuk. Silakan coba lagi nanti."
	}

	return "Terjadi kesalahan pada server. Silakan coba lagi."
}
