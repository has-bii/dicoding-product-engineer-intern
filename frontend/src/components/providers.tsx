"use client"

import { environmentManager, QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"

function makeQueryClient() {
	return new QueryClient({
		defaultOptions: {
			queries: {
				// Avoid refetching immediately on the client after SSR
				staleTime: 60 * 1000,
			},
		},
	})
}

let browserQueryClient: QueryClient | undefined

function getQueryClient() {
	if (environmentManager.isServer()) {
		return makeQueryClient()
	}
	// Reuse the browser client so it survives React suspending on initial render
	if (!browserQueryClient) browserQueryClient = makeQueryClient()
	return browserQueryClient
}

export default function Providers({ children }: { children: React.ReactNode }) {
	const queryClient = getQueryClient()

	return (
		<QueryClientProvider client={queryClient}>
			{children}
			<ReactQueryDevtools initialIsOpen={false} />
		</QueryClientProvider>
	)
}
