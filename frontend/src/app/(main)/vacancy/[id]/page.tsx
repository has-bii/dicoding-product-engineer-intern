import type { Metadata } from "next"
import VacancyDetailContent from "@/features/vacancy/components/detail/vacancy-detail-content"

export const metadata: Metadata = {
	title: "Detail Lowongan",
}

export default function Page() {
	return <VacancyDetailContent />
}
