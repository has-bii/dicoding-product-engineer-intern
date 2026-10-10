const TOKEN_KEY = "auth_token"

// Persists the Sanctum bearer token across reloads; only call from the browser
export const tokenStorage = {
	get: () => localStorage.getItem(TOKEN_KEY),
	set: (token: string) => localStorage.setItem(TOKEN_KEY, token),
	clear: () => localStorage.removeItem(TOKEN_KEY),
}
