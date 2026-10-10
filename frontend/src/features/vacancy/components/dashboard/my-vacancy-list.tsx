import { PlusIcon } from "lucide-react"
import DashboardPageHeader from "@/components/dashboard/dashboard-page-header"
import { Button } from "@/components/ui/button"
import MyVacancyCard from "@/features/vacancy/components/dashboard/my-vacancy-card"
import { mockVacancies } from "@/features/vacancy/data/mock-vacancies"

export default function MyVacancyList() {
	return (
		<section className="flex max-w-[831px] flex-col gap-7.5">
			<DashboardPageHeader
				title="Lowongan Saya"
				action={
					<Button>
						<PlusIcon />
						Buat lowongan
					</Button>
				}
			/>

			<ul className="flex flex-col gap-6">
				{mockVacancies.map((vacancy) => (
					<li key={vacancy.id}>
						<MyVacancyCard vacancy={vacancy} />
					</li>
				))}
			</ul>
		</section>
	)
}
