import { cn } from "cn"
import { CircleAlertIcon, RotateCwIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty"

type ErrorAlertProps = {
	title?: string
	description?: string
	onRetry?: () => void
	retryLabel?: string
	className?: string
}

export default function ErrorAlert({
	title = "Terjadi kesalahan",
	description = "Gagal memuat data. Silakan coba lagi.",
	onRetry,
	retryLabel = "Coba lagi",
	className,
}: ErrorAlertProps) {
	return (
		<Empty role="alert" className={cn("aspect-video border border-dashed", className)}>
			<EmptyHeader>
				<EmptyMedia variant="icon" className="bg-destructive/10 text-destructive">
					<CircleAlertIcon />
				</EmptyMedia>
				<EmptyTitle>{title}</EmptyTitle>
				<EmptyDescription>{description}</EmptyDescription>
			</EmptyHeader>
			{onRetry && (
				<EmptyContent>
					<Button variant="destructive" onClick={onRetry}>
						<RotateCwIcon data-icon="inline-start" />
						{retryLabel}
					</Button>
				</EmptyContent>
			)}
		</Empty>
	)
}
