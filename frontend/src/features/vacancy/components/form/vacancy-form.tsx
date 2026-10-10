"use client"

import { useForm, useSelector } from "@tanstack/react-form"
import { useQueryClient } from "@tanstack/react-query"
import { startOfToday } from "date-fns"
import { CircleAlertIcon } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import DatePicker from "@/components/date-picker"
import RichTextEditor from "@/components/rich-text-editor"
import { Alert, AlertTitle } from "@/components/ui/alert"
import { Button, buttonVariants } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
	Field,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
	FieldLegend,
	FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import UnsavedChangesDialog from "@/components/unsaved-changes-dialog"
import { getLocationsQueryOptions } from "@/features/vacancy/api/get-locations"
import LocationInput, { matchLocation } from "@/features/vacancy/components/form/location-input"
import { descriptionClassName, experienceLabels, jobTypeLabels } from "@/features/vacancy/constants"
import {
	type VacancyFormValues,
	type VacancyInput,
	vacancySchema,
} from "@/features/vacancy/schemas"
import { getErrorMessage, getValidationErrors } from "@/lib/utils"

const DESCRIPTION_TEMPLATE = [
	"<h2>Deskripsi Pekerjaan</h2>",
	"<p>Sebagai [Posisi Lowongan], Anda akan berpartisipasi dalam proses pembangunan aplikasi yang sedang dibangun dalam perusahaan [Nama Perusahaan]. Anda juga diharapkan mampu bekerja dalam tim.</p>",
	"<h2>Tanggung Jawab</h2>",
	"<ul><li><p>Membuat atau memodifikasi program yang sudah ada.</p></li><li><p>Bertanggung jawab dalam mengelola program.</p></li></ul>",
].join("")

export const emptyVacancyFormValues: VacancyFormValues = {
	title: "",
	job_type: "",
	candidates_needed: "",
	active_until: "",
	location: "",
	is_remote: false,
	description: DESCRIPTION_TEMPLATE,
	salary_min: "",
	salary_max: "",
	show_salary: false,
	min_experience: "",
}

// Salary inputs show thousand separators but keep only digits in the form
const formatDigits = (value: string) => (value ? Number(value).toLocaleString("id-ID") : "")
const toDigits = (value: string) => value.replace(/\D/g, "")

function RequiredMark() {
	return (
		<span aria-hidden className="text-destructive">
			*
		</span>
	)
}

type VacancyFormProps = {
	defaultValues?: VacancyFormValues
	onSubmit: (input: VacancyInput) => Promise<unknown>
	submitLabel: string
	cancelHref: string
}

// Shared by create and edit; the caller decides which endpoint receives the parsed input
export default function VacancyForm({
	defaultValues = emptyVacancyFormValues,
	onSubmit,
	submitLabel,
	cancelHref,
}: VacancyFormProps) {
	const queryClient = useQueryClient()
	const [submitError, setSubmitError] = useState<unknown>(null)

	const form = useForm({
		defaultValues,
		validators: {
			onSubmit: vacancySchema,
		},
		onSubmit: async ({ value, formApi }) => {
			const input = vacancySchema.parse(value)
			// Enter can submit while the location input still has focus, so match the casing here too
			const locations = queryClient.getQueryData(getLocationsQueryOptions().queryKey) ?? []
			input.location = matchLocation(input.location, locations)

			setSubmitError(null)
			try {
				await onSubmit(input)
			} catch (error) {
				setSubmitError(error)

				for (const [name, message] of Object.entries(getValidationErrors(error) ?? {})) {
					if (!(name in value)) continue
					formApi.setFieldMeta(name as keyof VacancyFormValues, (prev) => ({
						...prev,
						errorMap: { ...prev.errorMap, onSubmit: message },
					}))
				}
			}
		},
	})

	// Changing a field back to its default doesn't count, so the guard only asks when something would be lost
	const isDirty = useSelector(form.store, (state) => !state.isDefaultValue)

	return (
		<>
			<UnsavedChangesDialog when={isDirty} />

			<form
				noValidate
				className="max-w-[600px]"
				onSubmit={(e) => {
					e.preventDefault()
					form.handleSubmit()
				}}
			>
				<FieldGroup className="gap-8">
					<form.Field
						name="title"
						children={(field) => {
							const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

							return (
								<Field data-invalid={isInvalid}>
									<FieldLabel htmlFor={field.name} className="gap-1">
										Judul lowongan <RequiredMark />
									</FieldLabel>
									<Input
										id={field.name}
										name={field.name}
										placeholder="Masukkan judul lowongan"
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										aria-invalid={isInvalid}
									/>
									<FieldDescription>Contoh: Android Native Developer</FieldDescription>
									{isInvalid && <FieldError errors={field.state.meta.errors} />}
								</Field>
							)
						}}
					/>

					<form.Field
						name="job_type"
						children={(field) => {
							const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

							return (
								<FieldSet data-invalid={isInvalid}>
									<FieldLegend variant="label" className="flex gap-1">
										Tipe pekerjaan <RequiredMark />
									</FieldLegend>
									<RadioGroup
										name={field.name}
										value={field.state.value}
										onValueChange={(value) => field.handleChange(String(value))}
										aria-invalid={isInvalid}
									>
										{Object.entries(jobTypeLabels).map(([value, label]) => (
											<Field key={value} orientation="horizontal">
												<RadioGroupItem
													id={`${field.name}-${value}`}
													value={value}
													aria-invalid={isInvalid}
												/>
												<FieldLabel htmlFor={`${field.name}-${value}`} className="font-normal">
													{label}
												</FieldLabel>
											</Field>
										))}
									</RadioGroup>
									{isInvalid && <FieldError errors={field.state.meta.errors} />}
								</FieldSet>
							)
						}}
					/>

					<form.Field
						name="candidates_needed"
						children={(field) => {
							const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

							return (
								<Field data-invalid={isInvalid}>
									<FieldLabel htmlFor={field.name} className="gap-1">
										Kandidat yang dibutuhkan <RequiredMark />
									</FieldLabel>
									<Input
										id={field.name}
										name={field.name}
										type="number"
										inputMode="numeric"
										min={1}
										max={100}
										placeholder="Masukkan jumlah kandidat yang dibutuhkan"
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
						name="active_until"
						children={(field) => {
							const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

							return (
								<Field data-invalid={isInvalid}>
									<FieldLabel htmlFor={field.name} className="gap-1">
										Aktif hingga <RequiredMark />
									</FieldLabel>
									<DatePicker
										id={field.name}
										value={field.state.value}
										onChange={field.handleChange}
										onBlur={field.handleBlur}
										disabled={{ before: startOfToday() }}
										aria-invalid={isInvalid}
									/>
									{isInvalid && <FieldError errors={field.state.meta.errors} />}
								</Field>
							)
						}}
					/>

					<FieldGroup className="gap-3">
						<form.Field
							name="location"
							children={(field) => {
								const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

								return (
									<Field data-invalid={isInvalid}>
										<FieldLabel htmlFor={field.name} className="gap-1">
											Lokasi <RequiredMark />
										</FieldLabel>
										<LocationInput
											id={field.name}
											value={field.state.value}
											onChange={field.handleChange}
											onBlur={field.handleBlur}
											aria-invalid={isInvalid}
										/>
										{isInvalid && <FieldError errors={field.state.meta.errors} />}
									</Field>
								)
							}}
						/>

						<form.Field
							name="is_remote"
							children={(field) => (
								<Field orientation="horizontal">
									<Checkbox
										id={field.name}
										name={field.name}
										checked={field.state.value}
										onCheckedChange={(checked) => field.handleChange(checked)}
									/>
									<FieldLabel htmlFor={field.name} className="font-normal">
										Bisa remote
									</FieldLabel>
								</Field>
							)}
						/>
					</FieldGroup>

					<form.Field
						name="description"
						children={(field) => {
							const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

							return (
								<Field data-invalid={isInvalid}>
									<FieldLabel htmlFor={field.name} className="gap-1">
										Deskripsi <RequiredMark />
									</FieldLabel>
									<RichTextEditor
										id={field.name}
										value={field.state.value}
										onChange={field.handleChange}
										onBlur={field.handleBlur}
										contentClassName={descriptionClassName}
										aria-invalid={isInvalid}
									/>
									<FieldDescription>
										Anda bisa mengubah templat yang telah disediakan di atas.
									</FieldDescription>
									{isInvalid && <FieldError errors={field.state.meta.errors} />}
								</Field>
							)
						}}
					/>

					<FieldSet className="gap-3">
						<FieldLegend variant="label" className="mb-0 flex gap-1">
							Rentang gaji per bulan <RequiredMark />
						</FieldLegend>
						<div className="grid grid-cols-[1fr_auto_1fr] items-start gap-3">
							<form.Field
								name="salary_min"
								children={(field) => {
									const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

									return (
										<Field data-invalid={isInvalid}>
											<InputGroup className="overflow-hidden">
												<InputGroupAddon className="self-stretch border-r bg-muted px-2 py-0">
													Rp
												</InputGroupAddon>
												<InputGroupInput
													id={field.name}
													name={field.name}
													inputMode="numeric"
													placeholder="Minimum"
													aria-label="Gaji minimum"
													value={formatDigits(field.state.value)}
													onBlur={field.handleBlur}
													onChange={(e) => field.handleChange(toDigits(e.target.value))}
													aria-invalid={isInvalid}
												/>
											</InputGroup>
											{isInvalid && <FieldError errors={field.state.meta.errors} />}
										</Field>
									)
								}}
							/>
							<span aria-hidden className="pt-1.5 text-muted-foreground">
								-
							</span>
							<form.Field
								name="salary_max"
								children={(field) => {
									const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

									return (
										<Field data-invalid={isInvalid}>
											<InputGroup className="overflow-hidden">
												<InputGroupAddon className="self-stretch border-r bg-muted px-2 py-0">
													Rp
												</InputGroupAddon>
												<InputGroupInput
													id={field.name}
													name={field.name}
													inputMode="numeric"
													placeholder="Maksimum (opsional)"
													aria-label="Gaji maksimum"
													value={formatDigits(field.state.value)}
													onBlur={field.handleBlur}
													onChange={(e) => field.handleChange(toDigits(e.target.value))}
													aria-invalid={isInvalid}
												/>
											</InputGroup>
											{isInvalid && <FieldError errors={field.state.meta.errors} />}
										</Field>
									)
								}}
							/>
						</div>
						<FieldDescription>
							Anda tidak perlu mengisi kolom "Maksimum" jika yang dimasukkan adalah gaji pokok.
						</FieldDescription>

						<form.Field
							name="show_salary"
							children={(field) => (
								<Field orientation="horizontal" className="mt-2 flex-wrap">
									<Switch
										id={field.name}
										name={field.name}
										checked={field.state.value}
										onCheckedChange={(checked) => field.handleChange(checked)}
									/>
									<FieldLabel htmlFor={field.name} className="font-normal">
										Tampilkan gaji
									</FieldLabel>
								</Field>
							)}
						/>
						<FieldDescription>
							Gaji akan ditampilkan di lowongan pekerjaan dan dapat dilihat oleh kandidat.
						</FieldDescription>
					</FieldSet>

					<form.Field
						name="min_experience"
						children={(field) => {
							const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

							return (
								<FieldSet data-invalid={isInvalid}>
									<FieldLegend variant="label" className="flex gap-1">
										Minimum pengalaman bekerja <RequiredMark />
									</FieldLegend>
									<RadioGroup
										name={field.name}
										value={field.state.value}
										onValueChange={(value) => field.handleChange(String(value))}
										aria-invalid={isInvalid}
									>
										{Object.entries(experienceLabels).map(([value, label]) => (
											<Field key={value} orientation="horizontal">
												<RadioGroupItem
													id={`${field.name}-${value}`}
													value={value}
													aria-invalid={isInvalid}
												/>
												<FieldLabel htmlFor={`${field.name}-${value}`} className="font-normal">
													{label}
												</FieldLabel>
											</Field>
										))}
									</RadioGroup>
									{isInvalid && <FieldError errors={field.state.meta.errors} />}
								</FieldSet>
							)
						}}
					/>

					{submitError != null && (
						<Alert variant="destructive">
							<CircleAlertIcon />
							<AlertTitle>
								{getErrorMessage(submitError) ??
									"Terjadi kesalahan pada server. Silakan coba lagi."}
							</AlertTitle>
						</Alert>
					)}

					<form.Subscribe
						selector={(state) => state.isSubmitting}
						children={(isSubmitting) => (
							<div className="flex gap-3">
								<Button type="submit" disabled={isSubmitting}>
									{isSubmitting ? "Memproses..." : submitLabel}
								</Button>
								<Link href={cancelHref} className={buttonVariants({ variant: "outline" })}>
									Batal
								</Link>
							</div>
						)}
					/>
				</FieldGroup>
			</form>
		</>
	)
}
