"use client"

import { cn } from "cn"
import Link from "next/link"
import { usePathname } from "next/navigation"
import type { ReactNode } from "react"

type DashboardSidebarLinkProps = {
	label: string
	href: string
	icon: ReactNode
}

export function DashboardSidebarLink({ label, href, icon }: DashboardSidebarLinkProps) {
	const pathname = usePathname()
	const isActive = href === pathname

	return (
		<Link
			href={href}
			aria-current={isActive ? "page" : undefined}
			className={cn(
				"flex items-center gap-2 p-4 text-[#18181B] text-base leading-[22px] transition-colors hover:bg-[#F4F4F5] [&_svg]:size-6 [&_svg]:shrink-0",
				isActive && "bg-[#F4F4F5]",
			)}
		>
			{icon}
			{label}
		</Link>
	)
}
