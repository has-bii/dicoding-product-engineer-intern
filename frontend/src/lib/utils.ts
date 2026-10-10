import { isAxiosError } from "axios"

export { cn } from "cn"

export function getErrorMessage(error: unknown): string | undefined {
	if (isAxiosError(error)) return error.response?.data?.message ?? error.message
	if (error instanceof Error) return error.message
	return undefined
}

export function isNotFoundError(error: unknown) {
	return isAxiosError(error) && error.response?.status === 404
}
