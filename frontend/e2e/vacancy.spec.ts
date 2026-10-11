import { expect, test } from "@playwright/test"

test.describe("public", () => {
	test.use({ storageState: { cookies: [], origins: [] } })

	test("lists vacancies and opens the detail page", async ({ page }) => {
		await page.goto("/")
		await page.getByRole("link", { name: "Product Engineer" }).click()

		await expect(page).toHaveURL(/\/vacancy\/\d+/)
		await expect(page.getByRole("heading", { level: 1, name: "Product Engineer" })).toBeVisible()
	})

	test("asks guests to log in on the dashboard", async ({ page }) => {
		await page.goto("/dashboard")
		await expect(page.getByRole("alertdialog", { name: "Masuk ke Dashboard" })).toBeVisible()
	})
})

test("creates, edits and deletes a vacancy", async ({ page }) => {
	const title = `E2E Engineer ${Date.now()}`
	const editedTitle = `${title} (edited)`

	// Create
	await page.goto("/dashboard/vacancy/create")
	await page.getByLabel("Judul lowongan").fill(title)
	await page.getByRole("radio", { name: "Full-Time" }).click()
	await page.getByLabel("Kandidat yang dibutuhkan").fill("2")
	await page.getByLabel("Aktif hingga").click()
	await page.getByRole("button", { name: /next month/i }).click()
	await page.getByRole("gridcell", { name: "15" }).click()
	await page.getByLabel("Lokasi").fill("Bandung")
	await page.getByLabel("Gaji minimum").fill("5000000")
	await page.getByRole("radio", { name: "1-3 tahun" }).click()
	await page.getByRole("button", { name: "Buat lowongan" }).click()

	const card = (text: string) => page.locator("[data-slot=card]").filter({ hasText: text })

	await expect(page).toHaveURL("/dashboard")
	await expect(card(title)).toBeVisible()

	// Edit
	await card(title).getByRole("link", { name: "Edit" }).click()
	await expect(page.getByLabel("Judul lowongan")).toHaveValue(title)
	await page.getByLabel("Judul lowongan").fill(editedTitle)
	await page.getByRole("button", { name: "Simpan perubahan" }).click()

	await expect(page).toHaveURL("/dashboard")
	await expect(card(editedTitle)).toBeVisible()

	// Delete
	await card(editedTitle).getByRole("button", { name: "Hapus" }).click()
	await page.getByRole("dialog").getByRole("button", { name: "Hapus" }).click()

	await expect(card(editedTitle)).toHaveCount(0)
})
