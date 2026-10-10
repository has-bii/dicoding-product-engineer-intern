import { PlusIcon } from "lucide-react"
import Link from "next/link"
import DashboardPageHeader from "@/components/dashboard/dashboard-page-header"
import { buttonVariants } from "@/components/ui/button"
import MyVacancyContent from "@/features/vacancy/components/dashboard/my-vacancy-content"

export default function MyVacancyList() {
	return (
		<section className="flex max-w-[831px] flex-col gap-7.5">
			<DashboardPageHeader
				title="Lowongan Saya"
				action={
					<Link href="/dashboard/vacancy/create" className={buttonVariants()}>
						<PlusIcon />
						Buat lowongan
					</Link>
				}
			/>

			<MyVacancyContent />
		</section>
	)
}
