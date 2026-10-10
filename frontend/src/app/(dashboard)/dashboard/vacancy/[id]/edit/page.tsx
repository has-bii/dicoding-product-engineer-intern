import type { Metadata } from "next"
import EditVacancy from "@/features/vacancy/components/dashboard/edit-vacancy"

export const metadata: Metadata = {
	title: "Edit Lowongan",
}

export default function Page() {
	return <EditVacancy />
}
