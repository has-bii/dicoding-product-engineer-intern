"use client"

import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import DashboardPageHeader from "@/components/dashboard/dashboard-page-header"
import AuthGuard from "@/features/auth/components/auth-guard"
import { createVacancyMutationOptions } from "@/features/vacancy/api/create-vacancy"
import VacancyForm from "@/features/vacancy/components/form/vacancy-form"
import { VacancyFormSkeleton } from "@/features/vacancy/components/form/vacancy-form-skeleton"

export default function CreateVacancy() {
	const router = useRouter()
	const createMutation = useMutation(createVacancyMutationOptions())

	return (
		<section className="flex max-w-4xl flex-col gap-8">
			<DashboardPageHeader title="Buat lowongan pekerjaan" />

			<AuthGuard fallback={<VacancyFormSkeleton />}>
				<VacancyForm
					onSubmit={async (input) => {
						await createMutation.mutateAsync(input)
						router.push("/dashboard")
					}}
					submitLabel="Buat lowongan"
					cancelHref="/dashboard"
				/>
			</AuthGuard>
		</section>
	)
}
