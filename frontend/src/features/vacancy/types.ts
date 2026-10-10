export type JobType = "full_time" | "part_time" | "contract" | "internship"

export type ExperienceLevel = "less_than_1" | "1_to_3" | "4_to_5" | "6_to_10" | "more_than_10"

// Summary fields returned by GET /vacancy
export type Vacancy = {
	id: string
	title: string
	job_type: JobType
	location: string
	active_until: string
	min_experience: ExperienceLevel
	created_at: string
}

// Full record returned by GET /vacancy/:id
export type VacancyDetail = Vacancy & {
	user_id: string
	candidates_needed: number
	is_remote: boolean
	description: string
	salary_min: number
	salary_max: number | null
	show_salary: boolean
	updated_at: string
}
