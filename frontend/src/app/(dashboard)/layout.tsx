import { BriefcaseBusinessIcon } from "lucide-react"
import DashboardSidebar, { type DashboardMenuItem } from "@/components/dashboard/dashboard-sidebar"
import Header from "@/components/header"

const menuItems: Array<DashboardMenuItem> = [
	{
		label: "Lowongan Saya",
		href: "/dashboard",
		icon: <BriefcaseBusinessIcon strokeWidth={1.5} />,
	},
]

export default function DashboardLayout({ children }: LayoutProps<"/">) {
	return (
		<>
			<Header />
			<div className="flex flex-1 px-8">
				<div className="mx-auto flex w-full max-w-6xl flex-col md:flex-row">
					<DashboardSidebar title="Jobs" items={menuItems} />
					<main className="flex-1 py-6 md:pl-6">{children}</main>
				</div>
			</div>
		</>
	)
}
