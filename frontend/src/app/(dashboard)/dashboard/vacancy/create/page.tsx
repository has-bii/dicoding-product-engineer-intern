import type { Metadata } from "next"
import CreateVacancy from "@/features/vacancy/components/dashboard/create-vacancy"

export const metadata: Metadata = {
	title: "Buat Lowongan",
}

export default function Page() {
	return <CreateVacancy />
}
