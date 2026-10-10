import type { LucideIcon } from "lucide-react"
import type { ReactNode } from "react"

type MetaItemProps = {
	icon: LucideIcon
	children: ReactNode
}

export default function MetaItem({ icon: Icon, children }: MetaItemProps) {
	return (
		<span className="flex items-center gap-1">
			<Icon className="size-4 shrink-0" />
			{children}
		</span>
	)
}
