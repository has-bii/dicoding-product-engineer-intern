export default function VacancyHeader() {
	return (
		<section className="border-[#52525B] border-b bg-[#18181B] px-8">
			<div className="mx-auto flex max-w-6xl flex-col gap-4 py-12">
				<p className="font-semibold text-[#3B82F6] text-xl leading-7 tracking-[-0.017em]">
					Dicoding Jobs
				</p>

				<h1 className="flex flex-col font-semibold text-3xl text-white leading-[1.5] md:text-[40px] md:leading-[61px]">
					<span>Temukan lowongan yang</span>
					<span className="flex flex-wrap items-center gap-x-3 gap-y-2 md:gap-x-5">
						cocok untuk kamu
						<img
							src="/images/vacancy-header-art.jpg"
							alt=""
							className="h-11 w-[147px] rounded-full object-cover md:h-[61px] md:w-[203px]"
						/>
					</span>
				</h1>
			</div>
		</section>
	)
}
