"use client"

import { useQuery } from "@tanstack/react-query"
import type { ReactNode } from "react"
import ErrorAlert from "@/components/error-alert"
import { getMeQueryOptions } from "@/features/auth/api/get-me"
import LoginDialog from "@/features/auth/components/login-dialog"
import { getErrorMessage } from "@/lib/utils"

type AuthGuardProps = {
	fallback: ReactNode
	children: ReactNode
}

// Guests keep seeing the fallback with a login dialog on top until they sign in
export default function AuthGuard({ fallback, children }: AuthGuardProps) {
	const { data: user, isPending, isError, error, refetch } = useQuery(getMeQueryOptions())

	if (isError) {
		return (
			<ErrorAlert
				title="Gagal memuat sesi"
				description={getErrorMessage(error)}
				onRetry={() => refetch()}
			/>
		)
	}

	if (user) return children

	return (
		<>
			{fallback}
			{!isPending && <LoginDialog />}
		</>
	)
}
