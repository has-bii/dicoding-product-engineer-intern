import type { Metadata } from "next"
import MyVacancyList from "@/features/vacancy/components/dashboard/my-vacancy-list"

export const metadata: Metadata = {
	title: "Lowongan Saya",
}

export default function Page() {
	return <MyVacancyList />
}
