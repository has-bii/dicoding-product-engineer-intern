import { api } from "@/lib/api"

type DeleteVacancyParams = {
	id: string
}

export const deleteVacancy = async ({ id }: DeleteVacancyParams) => {
	await api.delete(`/vacancy/${id}`)
}
