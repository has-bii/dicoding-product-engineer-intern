import { SearchIcon } from "lucide-react"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"

export default function VacancySearch() {
	return (
		<InputGroup className="h-11 flex-1 lg:max-w-sm">
			<InputGroupAddon className="pr-1 pl-3 text-[#52525B]">
				<SearchIcon className="size-5" />
			</InputGroupAddon>
			<InputGroupInput
				type="search"
				aria-label="Cari lowongan"
				placeholder="Pekerjaan apa yang sedang kamu cari?"
				className="placeholder:text-[#52525B] placeholder:text-sm"
			/>
		</InputGroup>
	)
}
