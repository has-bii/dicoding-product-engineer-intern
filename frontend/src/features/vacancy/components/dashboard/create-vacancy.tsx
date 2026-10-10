"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import DashboardPageHeader from "@/components/dashboard/dashboard-page-header"
import AuthGuard from "@/features/auth/components/auth-guard"
import { createVacancy } from "@/features/vacancy/api/create-vacancy"
import { LOCATIONS_QUERY_KEY } from "@/features/vacancy/api/get-locations"
import { MY_VACANCIES_QUERY_KEY } from "@/features/vacancy/api/get-my-vacancies"
import { VACANCIES_QUERY_KEY } from "@/features/vacancy/api/get-vacancies"
import VacancyForm from "@/features/vacancy/components/form/vacancy-form"
import { VacancyFormSkeleton } from "@/features/vacancy/components/form/vacancy-form-skeleton"

export default function CreateVacancy() {
	const router = useRouter()
	const queryClient = useQueryClient()

	const createMutation = useMutation({
		mutationFn: createVacancy,
		onSuccess: async () => {
			// The new vacancy shows up in both lists and may add a new location suggestion
			await Promise.all([
				queryClient.invalidateQueries({ queryKey: MY_VACANCIES_QUERY_KEY().slice(0, 1) }),
				queryClient.invalidateQueries({ queryKey: VACANCIES_QUERY_KEY().slice(0, 1) }),
				queryClient.invalidateQueries({ queryKey: LOCATIONS_QUERY_KEY }),
			])
			router.push("/dashboard")
		},
	})

	return (
		<section className="flex max-w-[831px] flex-col gap-7.5">
			<DashboardPageHeader title="Buat lowongan pekerjaan" />

			<AuthGuard fallback={<VacancyFormSkeleton />}>
				<VacancyForm
					onSubmit={createMutation.mutateAsync}
					submitLabel="Buat lowongan"
					cancelHref="/dashboard"
				/>
			</AuthGuard>
		</section>
	)
}
