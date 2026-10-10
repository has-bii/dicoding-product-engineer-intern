"use client"

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useUnsavedChangesGuard } from "@/hooks/use-unsaved-changes-guard"

type UnsavedChangesDialogProps = {
	// Turns the guard on; usually the form's dirty state
	when: boolean
}

export default function UnsavedChangesDialog({ when }: UnsavedChangesDialogProps) {
	const { pendingHref, confirm, cancel } = useUnsavedChangesGuard(when)

	return (
		<AlertDialog
			open={pendingHref !== null}
			onOpenChange={(open) => {
				if (!open) cancel()
			}}
		>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Tinggalkan halaman ini?</AlertDialogTitle>
					<AlertDialogDescription>
						Perubahan yang belum disimpan akan hilang jika Anda meninggalkan halaman ini.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel size="sm">Lanjutkan mengisi</AlertDialogCancel>
					<AlertDialogAction size="sm" variant="destructive" onClick={confirm}>
						Tinggalkan
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}
