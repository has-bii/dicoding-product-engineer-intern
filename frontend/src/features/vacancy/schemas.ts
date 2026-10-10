import { format } from "date-fns"
import * as z from "zod"
import { experienceLabels, jobTypeLabels } from "@/features/vacancy/constants"
import type { ExperienceLevel, JobType } from "@/features/vacancy/types"

const jobTypes = Object.keys(jobTypeLabels) as [JobType, ...JobType[]]
const experienceLevels = Object.keys(experienceLabels) as [ExperienceLevel, ...ExperienceLevel[]]

// Number inputs keep their raw text in the form so they can start empty; the schema turns them into numbers
const digits = (requiredMessage: string) =>
	z
		.string()
		.trim()
		.min(1, requiredMessage)
		.regex(/^\d+$/, "Masukkan angka yang valid.")
		.transform(Number)

// TipTap leaves markup such as <p></p> behind when the editor is cleared
const hasText = (html: string) => html.replace(/<[^>]*>/g, "").trim().length > 0

export const vacancySchema = z
	.object({
		title: z
			.string()
			.trim()
			.min(1, "Judul lowongan wajib diisi.")
			.max(255, "Judul lowongan maksimal 255 karakter."),
		// Radio groups start unselected, so accept any string and narrow it to the enum
		job_type: z.string().pipe(z.enum(jobTypes, "Pilih tipe pekerjaan.")),
		candidates_needed: digits("Jumlah kandidat wajib diisi.").pipe(
			z.number().min(1, "Minimal 1 kandidat.").max(100, "Maksimal 100 kandidat."),
		),
		active_until: z
			.string()
			.min(1, "Tanggal aktif wajib diisi.")
			.refine(
				(date) => date >= format(new Date(), "yyyy-MM-dd"),
				"Tanggal tidak boleh sebelum hari ini.",
			),
		location: z
			.string()
			.trim()
			.min(1, "Lokasi wajib diisi.")
			.max(255, "Lokasi maksimal 255 karakter."),
		is_remote: z.boolean(),
		description: z.string().refine(hasText, "Deskripsi wajib diisi."),
		salary_min: digits("Gaji minimum wajib diisi."),
		salary_max: z
			.string()
			.trim()
			.regex(/^\d*$/, "Masukkan angka yang valid.")
			.transform((value) => (value ? Number(value) : null)),
		show_salary: z.boolean(),
		min_experience: z.string().pipe(z.enum(experienceLevels, "Pilih minimum pengalaman bekerja.")),
	})
	.refine(({ salary_min, salary_max }) => salary_max === null || salary_max >= salary_min, {
		message: "Gaji maksimum tidak boleh lebih kecil dari gaji minimum.",
		path: ["salary_max"],
	})

export type VacancyFormValues = z.input<typeof vacancySchema>

export type VacancyInput = z.output<typeof vacancySchema>
