import type { ReactNode } from "react"
import { DashboardSidebarLink } from "@/components/dashboard/dashboard-sidebar-link"

export type DashboardMenuItem = {
	label: string
	href: string
	icon: ReactNode
}

type DashboardSidebarProps = {
	title: string
	items: Array<DashboardMenuItem>
}

export default function DashboardSidebar({ title, items }: DashboardSidebarProps) {
	return (
		<aside className="shrink-0 border-b md:w-[252px] md:border-r md:border-b-0">
			<div className="flex h-[92px] items-center gap-6">
				<h2 className="p-4 font-medium text-2xl text-[#3F3F46] leading-8">{title}</h2>
				<img src="/images/dashboard-sidebar-art.png" alt="" className="h-[92px] w-[84px]" />
			</div>

			<nav>
				<ul>
					{items.map((item) => (
						<li key={item.href}>
							<DashboardSidebarLink {...item} />
						</li>
					))}
				</ul>
			</nav>
		</aside>
	)
}
