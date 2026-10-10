"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

// Returns the in-app URL a click would navigate to, or null when the click should be left alone
function getGuardedHref(event: MouseEvent) {
	if (event.defaultPrevented || event.button !== 0) return null
	if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return null

	const anchor = (event.target as Element | null)?.closest("a[href]")
	if (!(anchor instanceof HTMLAnchorElement)) return null
	if (anchor.target && anchor.target !== "_self") return null
	if (anchor.hasAttribute("download")) return null

	const url = new URL(anchor.href)
	if (url.origin !== window.location.origin) return null
	// Hash links stay on the page, so nothing gets lost
	if (url.pathname === window.location.pathname && url.search === window.location.search)
		return null

	return `${url.pathname}${url.search}${url.hash}`
}

/**
 * Holds back link clicks and page reloads while `enabled` is true.
 * In-app links wait for `confirm`/`cancel`; reloads and closing the tab get the browser's own prompt,
 * since browsers don't allow custom UI there.
 */
export function useUnsavedChangesGuard(enabled: boolean) {
	const router = useRouter()
	const [pendingHref, setPendingHref] = useState<string | null>(null)

	useEffect(() => {
		if (!enabled) return

		const handleBeforeUnload = (event: BeforeUnloadEvent) => {
			event.preventDefault()
		}

		// Capture phase runs before Next's <Link> handler, so links anywhere on the page are covered
		const handleClick = (event: MouseEvent) => {
			const href = getGuardedHref(event)
			if (!href) return

			event.preventDefault()
			event.stopPropagation()
			setPendingHref(href)
		}

		window.addEventListener("beforeunload", handleBeforeUnload)
		document.addEventListener("click", handleClick, true)

		return () => {
			window.removeEventListener("beforeunload", handleBeforeUnload)
			document.removeEventListener("click", handleClick, true)
		}
	}, [enabled])

	return {
		pendingHref,
		confirm: () => {
			if (pendingHref) router.push(pendingHref)
			setPendingHref(null)
		},
		cancel: () => setPendingHref(null),
	}
}
