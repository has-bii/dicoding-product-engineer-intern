import { api } from "@/lib/api"

export const logout = async () => {
	await api.post("/auth/logout")
}
