import { ArrowLeftIcon, SearchXIcon } from "lucide-react"
import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty"

export default function VacancyNotFound() {
	return (
		<section className="px-8">
			<div className="mx-auto max-w-[730px] py-12">
				<Empty className="aspect-video border border-dashed">
					<EmptyHeader>
						<EmptyMedia variant="icon">
							<SearchXIcon />
						</EmptyMedia>
						<EmptyTitle>Lowongan tidak ditemukan</EmptyTitle>
						<EmptyDescription>
							Lowongan yang kamu cari mungkin sudah dihapus atau tautannya tidak valid.
						</EmptyDescription>
					</EmptyHeader>
					<EmptyContent>
						<Link href="/" className={buttonVariants({ variant: "outline" })}>
							<ArrowLeftIcon data-icon="inline-start" />
							Kembali ke daftar lowongan
						</Link>
					</EmptyContent>
				</Empty>
			</div>
		</section>
	)
}
