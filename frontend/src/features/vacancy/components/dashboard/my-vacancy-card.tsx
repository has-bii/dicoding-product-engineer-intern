import { ClockIcon, PencilIcon, Trash2Icon, UploadIcon } from "lucide-react"
import Link from "next/link"
import MetaItem from "@/components/meta-item"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { COMPANY_LOGO_URL, COMPANY_NAME } from "@/features/vacancy/constants"
import type { Vacancy } from "@/features/vacancy/types"
import { formatDate } from "@/lib/utils"

type MyVacancyCardProps = {
	vacancy: Vacancy
}

export default function MyVacancyCard({ vacancy }: MyVacancyCardProps) {
	return (
		<Card orientation="horizontal">
			<figure className="size-16 shrink-0 overflow-hidden rounded-sm border border-[#D4D4D8]">
				<img
					src={COMPANY_LOGO_URL}
					alt={`Logo ${COMPANY_NAME}`}
					className="size-full object-cover"
				/>
			</figure>

			<CardContent className="flex flex-1 flex-col gap-6">
				<div className="flex flex-col gap-2">
					<CardTitle className="font-semibold text-[#3F3F46] text-base leading-[22px]">
						{vacancy.title}
					</CardTitle>

					<div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[#52525B] text-sm leading-5">
						<MetaItem icon={UploadIcon}>
							<span>
								Dibuat: <time dateTime={vacancy.created_at}>{formatDate(vacancy.created_at)}</time>
							</span>
						</MetaItem>
						<MetaItem icon={ClockIcon}>
							<span>
								Aktif hingga:{" "}
								<time dateTime={vacancy.active_until}>{formatDate(vacancy.active_until)}</time>
							</span>
						</MetaItem>
					</div>
				</div>

				<div className="flex gap-3">
					<Link
						href={`/dashboard/vacancy/${vacancy.id}/edit`}
						className={buttonVariants({ variant: "secondary" })}
					>
						<PencilIcon />
						Edit
					</Link>
					<Button variant="destructive">
						<Trash2Icon />
						Hapus
					</Button>
				</div>
			</CardContent>
		</Card>
	)
}
