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

const dateFormatter = new Intl.DateTimeFormat("id-ID", {
	day: "numeric",
	month: "long",
	year: "numeric",
})

export function formatDate(date: string) {
	return dateFormatter.format(new Date(date))
}
