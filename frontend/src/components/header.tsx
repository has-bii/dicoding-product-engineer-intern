import Link from "next/link"
import { HeaderMenuLink } from "@/components/header-menu-link"
import UserMenu from "@/features/auth/components/user-menu"

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
	return (
		<header className="flex h-[70px] items-center border-b bg-background px-8">
			<ul className="mx-auto flex w-full max-w-6xl items-center gap-8">
				<li>
					<Link href="/">
						<img src="/logo.svg" alt="Dicoding Logo" className="h-auto w-20" />
					</Link>
				</li>
				{menuItems.map((menu) => (
					<li key={menu.label}>
						<HeaderMenuLink {...menu} />
					</li>
				))}
				<li className="ml-auto">
					<UserMenu />
				</li>
			</ul>
		</header>
	)
}
