import { expect, test as setup } from "@playwright/test"

const authFile = "e2e/.auth/user.json"

// Logs in once with the seeded admin; the token lands in localStorage, which storageState keeps
setup("authenticate", async ({ page }) => {
	await page.goto("/dashboard")
	await page.getByLabel("Email").fill("admin@dicoding.com")
	await page.getByLabel("Kata sandi").fill("dicoding123")
	await page.getByRole("button", { name: "Masuk" }).click()
	await expect(page.getByText("Admin")).toBeVisible()

	await page.context().storageState({ path: authFile })
})
