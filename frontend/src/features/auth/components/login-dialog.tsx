"use client"

import { useForm } from "@tanstack/react-form"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { CircleAlertIcon } from "lucide-react"
import Link from "next/link"
import { Alert, AlertTitle } from "@/components/ui/alert"
import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button, buttonVariants } from "@/components/ui/button"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { getMeQueryOptions } from "@/features/auth/api/get-me"
import { getLoginErrorMessage, login } from "@/features/auth/api/login"
import { type LoginInput, loginSchema } from "@/features/auth/schemas"
import { tokenStorage } from "@/lib/token-storage"

const defaultValues: LoginInput = {
	email: "",
	password: "",
}

// Stays open until login succeeds; the auth guard unmounts it once the user is known
export default function LoginDialog() {
	const queryClient = useQueryClient()

	const loginMutation = useMutation({
		mutationFn: login,
		onSuccess: ({ token, user }) => {
			tokenStorage.set(token)
			queryClient.setQueryData(getMeQueryOptions().queryKey, user)
		},
	})

	const form = useForm({
		defaultValues,
		validators: {
			onSubmit: loginSchema,
		},
		onSubmit: async ({ value, formApi }) => {
			loginMutation.mutate(value)
			formApi.resetField("password")
		},
	})

	return (
		<AlertDialog open>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Masuk ke Dashboard</AlertDialogTitle>
					<AlertDialogDescription>
						Masuk dengan akun Anda untuk mengelola lowongan.
					</AlertDialogDescription>
				</AlertDialogHeader>

				<form
					noValidate
					onSubmit={(e) => {
						e.preventDefault()
						form.handleSubmit()
					}}
				>
					<FieldGroup>
						{loginMutation.isError && (
							<Alert variant="destructive">
								<CircleAlertIcon />
								<AlertTitle>{getLoginErrorMessage(loginMutation.error)}</AlertTitle>
							</Alert>
						)}

						<form.Field
							name="email"
							children={(field) => {
								const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

								return (
									<Field data-invalid={isInvalid}>
										<FieldLabel htmlFor={field.name}>Email</FieldLabel>
										<Input
											id={field.name}
											name={field.name}
											type="email"
											autoComplete="email"
											value={field.state.value}
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
											aria-invalid={isInvalid}
										/>
										{isInvalid && <FieldError errors={field.state.meta.errors} />}
									</Field>
								)
							}}
						/>

						<form.Field
							name="password"
							children={(field) => {
								const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

								return (
									<Field data-invalid={isInvalid}>
										<FieldLabel htmlFor={field.name}>Kata sandi</FieldLabel>
										<Input
											id={field.name}
											name={field.name}
											type="password"
											autoComplete="current-password"
											value={field.state.value}
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
											aria-invalid={isInvalid}
										/>
										{isInvalid && <FieldError errors={field.state.meta.errors} />}
									</Field>
								)
							}}
						/>

						<div className="flex flex-col gap-2">
							<Button type="submit" disabled={loginMutation.isPending}>
								{loginMutation.isPending ? "Memproses..." : "Masuk"}
							</Button>
							<Link href="/" className={buttonVariants({ variant: "link", size: "sm" })}>
								Kembali
							</Link>
						</div>
					</FieldGroup>
				</form>
			</AlertDialogContent>
		</AlertDialog>
	)
}
