import type { ReactNode } from "react"

type DashboardPageHeaderProps = {
	title: string
	action?: ReactNode
}

export default function DashboardPageHeader({ title, action }: DashboardPageHeaderProps) {
	return (
		<div className="flex flex-wrap items-end justify-between gap-4">
			<h1 className="font-semibold text-2xl text-[#18181B] leading-[34px]">{title}</h1>
			{action}
		</div>
	)
}
