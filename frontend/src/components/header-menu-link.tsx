"use client"

import { cn } from "cn"
import Link from "next/link"
import { usePathname } from "next/navigation"

type HeaderMenuLinkProps = {
	label: string
	href: string
}

export function HeaderMenuLink({ label, href }: HeaderMenuLinkProps) {
	const pathname = usePathname()
	const isActive = href === pathname

	return (
		<Link href={href} data-state={isActive} className="group relative">
			{label}

			<span
				className={cn(
					"absolute bottom-0 left-1/2 block h-[4px] w-[20px] -translate-x-1/2 rounded-[1px] bg-content-primary",
					"transition-all duration-100 ease-in will-change-transform",
					"opacity-0 group-hover:translate-y-2 group-hover:opacity-100 group-data-[state=true]:translate-y-2 group-data-[state=true]:opacity-100",
				)}
			/>
		</Link>
	)
}
