"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useParams, useRouter } from "next/navigation"
import DashboardPageHeader from "@/components/dashboard/dashboard-page-header"
import ErrorAlert from "@/components/error-alert"
import { getMeQueryOptions } from "@/features/auth/api/get-me"
import AuthGuard from "@/features/auth/components/auth-guard"
import { LOCATIONS_QUERY_KEY } from "@/features/vacancy/api/get-locations"
import { MY_VACANCIES_QUERY_KEY } from "@/features/vacancy/api/get-my-vacancies"
import { VACANCIES_QUERY_KEY } from "@/features/vacancy/api/get-vacancies"
import { getVacancyQueryOptions, VACANCY_QUERY_KEY } from "@/features/vacancy/api/get-vacancy"
import { updateVacancy } from "@/features/vacancy/api/update-vacancy"
import VacancyForm, { toVacancyFormValues } from "@/features/vacancy/components/form/vacancy-form"
import { VacancyFormSkeleton } from "@/features/vacancy/components/form/vacancy-form-skeleton"
import type { VacancyInput } from "@/features/vacancy/schemas"
import { getErrorMessage, isNotFoundError } from "@/lib/utils"

export default function EditVacancy() {
	return (
		<section className="flex max-w-[831px] flex-col gap-7.5">
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
	const queryClient = useQueryClient()
	const { data: user } = useQuery(getMeQueryOptions())
	const { data: vacancy, isPending, isError, error, refetch } = useQuery(getVacancyQueryOptions(id))

	const updateMutation = useMutation({
		mutationFn: (input: VacancyInput) => updateVacancy({ id, input }),
		onSuccess: async (updated) => {
			queryClient.setQueryData(VACANCY_QUERY_KEY(id), updated)
			// Title, dates and location show up in both lists, and the location may be new
			await Promise.all([
				queryClient.invalidateQueries({ queryKey: MY_VACANCIES_QUERY_KEY().slice(0, 1) }),
				queryClient.invalidateQueries({ queryKey: VACANCIES_QUERY_KEY().slice(0, 1) }),
				queryClient.invalidateQueries({ queryKey: LOCATIONS_QUERY_KEY }),
			])
			router.push("/dashboard")
		},
	})

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
			onSubmit={updateMutation.mutateAsync}
			submitLabel="Simpan perubahan"
			cancelHref="/dashboard"
		/>
	)
}
