"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { LogOutIcon } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { getMeQueryOptions } from "@/features/auth/api/get-me"
import { logout } from "@/features/auth/api/logout"
import { tokenStorage } from "@/lib/token-storage"

// Renders nothing for guests, so the header only shows it once the user is known
export default function UserMenu() {
	const queryClient = useQueryClient()
	const { data: user } = useQuery(getMeQueryOptions())

	const logoutMutation = useMutation({
		mutationFn: logout,
		// Drop the session locally even if the server call fails, the token is unusable either way
		onSettled: () => {
			tokenStorage.clear()
			queryClient.setQueryData(getMeQueryOptions().queryKey, null)
		},
	})

	if (!user) return null

	return (
		<DropdownMenu>
			<DropdownMenuTrigger className="flex items-center gap-2 text-sm outline-none">
				<Avatar>
					<AvatarImage src="https://github.com/shadcn.png" alt={user.name} />
					<AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
				</Avatar>
				<span className="font-medium">{user.name}</span>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuItem
					variant="destructive"
					disabled={logoutMutation.isPending}
					onClick={() => logoutMutation.mutate()}
				>
					<LogOutIcon />
					Keluar
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
