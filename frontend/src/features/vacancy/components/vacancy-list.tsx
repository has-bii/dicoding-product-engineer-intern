import VacancyCard from "@/features/vacancy/components/vacancy-card"
import VacancySearch from "@/features/vacancy/components/vacancy-search"
import { mockVacancies } from "@/features/vacancy/data/mock-vacancies"

export default function VacancyList() {
	return (
		<section className="px-8">
			<div className="mx-auto flex max-w-6xl flex-col gap-6 py-12">
				<div className="mx-auto flex w-full max-w-[730px] flex-col gap-6">
					<div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
						<h2 className="font-semibold text-2xl text-[#18181B] leading-[34px]">
							Daftar Pekerjaan Terbaru
						</h2>
						<VacancySearch />
					</div>

					<ul className="flex flex-col gap-6">
						{mockVacancies.map((vacancy) => (
							<li key={vacancy.id}>
								<VacancyCard vacancy={vacancy} />
							</li>
						))}
					</ul>
				</div>
			</div>
		</section>
	)
}
