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

export function isUnauthorizedError(error: unknown) {
	return isAxiosError(error) && error.response?.status === 401
}

const dateFormatter = new Intl.DateTimeFormat("id-ID", {
	day: "numeric",
	month: "long",
	year: "numeric",
})

export function formatDate(date: string) {
	return dateFormatter.format(new Date(date))
}

const currencyFormatter = new Intl.NumberFormat("id-ID", {
	style: "currency",
	currency: "IDR",
	maximumFractionDigits: 0,
})

export function formatCurrency(amount: number) {
	return currencyFormatter.format(amount)
}

// Laravel answers failed validation with 422 and `errors: { field: string[] }`; keep the first message per field
export function getValidationErrors(error: unknown): Record<string, string> | undefined {
	if (!isAxiosError(error) || error.response?.status !== 422) return undefined

	const errors: Record<string, string[]> | undefined = error.response.data?.errors
	if (!errors) return undefined

	return Object.fromEntries(Object.entries(errors).map(([field, messages]) => [field, messages[0]]))
}
