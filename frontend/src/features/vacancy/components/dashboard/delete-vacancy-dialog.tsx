"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Trash2Icon } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog"
import { deleteVacancy } from "@/features/vacancy/api/delete-vacancy"
import { MY_VACANCIES_QUERY_KEY } from "@/features/vacancy/api/get-my-vacancies"
import { VACANCIES_QUERY_KEY } from "@/features/vacancy/api/get-vacancies"
import { VACANCY_QUERY_KEY } from "@/features/vacancy/api/get-vacancy"
import type { Vacancy } from "@/features/vacancy/types"
import { getErrorMessage } from "@/lib/utils"

type DeleteVacancyDialogProps = {
	vacancy: Vacancy
}

export default function DeleteVacancyDialog({ vacancy }: DeleteVacancyDialogProps) {
	const [open, setOpen] = useState(false)
	const queryClient = useQueryClient()

	const deleteMutation = useMutation({
		mutationFn: () => deleteVacancy({ id: vacancy.id }),
		onSuccess: async () => {
			queryClient.removeQueries({ queryKey: VACANCY_QUERY_KEY(vacancy.id) })
			await Promise.all([
				queryClient.invalidateQueries({ queryKey: MY_VACANCIES_QUERY_KEY().slice(0, 1) }),
				queryClient.invalidateQueries({ queryKey: VACANCIES_QUERY_KEY().slice(0, 1) }),
			])
			setOpen(false)
		},
	})

	return (
		<Dialog
			open={open}
			onOpenChange={(nextOpen) => {
				// Don't let the dialog close mid-request, and start fresh next time it opens
				if (!nextOpen && deleteMutation.isPending) return
				if (nextOpen) deleteMutation.reset()
				setOpen(nextOpen)
			}}
		>
			<DialogTrigger render={<Button variant="destructive" />}>
				<Trash2Icon />
				Hapus
			</DialogTrigger>
			<DialogContent showCloseButton={false}>
				<DialogHeader>
					<DialogTitle>Hapus lowongan ini?</DialogTitle>
					<DialogDescription>
						Lowongan <strong>{vacancy.title}</strong> akan dihapus secara permanen dan tidak bisa
						dikembalikan.
					</DialogDescription>
				</DialogHeader>
				{deleteMutation.isError && (
					<p role="alert" className="text-destructive text-xs">
						{getErrorMessage(deleteMutation.error) ?? "Gagal menghapus lowongan."}
					</p>
				)}
				<DialogFooter>
					<DialogClose
						render={<Button size="sm" variant="outline" disabled={deleteMutation.isPending} />}
					>
						Batal
					</DialogClose>
					<Button
						size="sm"
						variant="destructive"
						disabled={deleteMutation.isPending}
						onClick={() => deleteMutation.mutate()}
					>
						{deleteMutation.isPending ? "Menghapus..." : "Hapus"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
