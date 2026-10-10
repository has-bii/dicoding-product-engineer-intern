"use client"

import { cn } from "cn"
import Link from "next/link"
import { usePathname } from "next/navigation"

const menuItems: Array<{ label: string; href: string }> = [
	{
		label: "Lowongan Kerja",
		href: "/",
	},
	{
		label: "Dashboard",
		href: "/dashboard",
	},
]

export default function Header() {
	const pathname = usePathname()

	const isMenuActive = (href: string) => href === pathname

	return (
		<header className="flex h-[70px] items-center border-[#E4E4E7] border-b bg-background px-8">
			<ul className="mx-auto flex w-full max-w-6xl items-center gap-8">
				<li>
					<Link href="/">
						<img src="/logo.svg" alt="Dicoding Logo" className="h-auto w-20" />
					</Link>
				</li>
				{menuItems.map((menu) => {
					const isActive = isMenuActive(menu.href)

					return (
						<li key={menu.label}>
							<Link href={menu.href} data-state={isActive} className="group relative">
								{menu.label}

								<span
									className={cn(
										"absolute bottom-0 left-1/2 block h-[4px] w-[20px] -translate-x-1/2 rounded-[1px] bg-content-primary",
										"transition-all duration-100 ease-in will-change-transform",
										"opacity-0 group-hover:translate-y-2 group-hover:opacity-100 group-data-[state=true]:translate-y-2 group-data-[state=true]:opacity-100",
									)}
								/>
							</Link>
						</li>
					)
				})}
			</ul>
		</header>
	)
}
