"use client"

import { useMutation, useQuery } from "@tanstack/react-query"
import { useParams, useRouter } from "next/navigation"
import DashboardPageHeader from "@/components/dashboard/dashboard-page-header"
import ErrorAlert from "@/components/error-alert"
import { getMeQueryOptions } from "@/features/auth/api/get-me"
import AuthGuard from "@/features/auth/components/auth-guard"
import { getVacancyQueryOptions } from "@/features/vacancy/api/get-vacancy"
import { updateVacancyMutationOptions } from "@/features/vacancy/api/update-vacancy"
import VacancyForm, { toVacancyFormValues } from "@/features/vacancy/components/form/vacancy-form"
import { VacancyFormSkeleton } from "@/features/vacancy/components/form/vacancy-form-skeleton"
import { getErrorMessage, isNotFoundError } from "@/lib/utils"

export default function EditVacancy() {
	return (
		<section className="flex max-w-4xl flex-col gap-8">
			<DashboardPageHeader title="Edit lowongan pekerjaan" />

			<AuthGuard fallback={<VacancyFormSkeleton />}>
				<EditVacancyForm />
			</AuthGuard>
		</section>
	)
}

function EditVacancyForm() {
	const { id } = useParams<{ id: string }>()
	const router = useRouter()
	const { data: user } = useQuery(getMeQueryOptions())
	const { data: vacancy, isPending, isError, error, refetch } = useQuery(getVacancyQueryOptions(id))

	const updateMutation = useMutation(updateVacancyMutationOptions())

	if (isPending) return <VacancyFormSkeleton />

	if (isError) {
		return isNotFoundError(error) ? (
			<ErrorAlert
				title="Lowongan tidak ditemukan"
				description="Lowongan yang ingin kamu ubah mungkin sudah dihapus atau tautannya tidak valid."
			/>
		) : (
			<ErrorAlert
				title="Gagal memuat lowongan"
				description={getErrorMessage(error)}
				onRetry={() => refetch()}
			/>
		)
	}

	// The API rejects edits from other users anyway, so stop them before they fill in the form
	if (vacancy.user_id !== user?.id) {
		return (
			<ErrorAlert
				title="Akses ditolak"
				description="Kamu hanya bisa mengubah lowongan milikmu sendiri."
			/>
		)
	}

	return (
		<VacancyForm
			defaultValues={toVacancyFormValues(vacancy)}
			onSubmit={async (input) => {
				await updateMutation.mutateAsync({ id, input })
				router.push("/dashboard")
			}}
			submitLabel="Simpan perubahan"
			cancelHref="/dashboard"
		/>
	)
}
