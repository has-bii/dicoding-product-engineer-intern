import Footer from "@/components/footer"
import Header from "@/components/header"

export default function MainLayout({ children }: LayoutProps<"/">) {
	return (
		<>
			<Header />
			{children}
			<Footer />
		</>
	)
}
