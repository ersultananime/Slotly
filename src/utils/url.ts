/**
 * Helper to determine the application's base URL across environments
 * (Client, Vercel preview, Vercel production, or Local development).
 */
export function getBaseUrl(): string {
  // 1. Explicitly configured public URL (custom domain or production Vercel URL)
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '')
  }

  // 2. Vercel deployment URL (provided by Vercel in preview/prod)
  if (process.env.NEXT_PUBLIC_VERCEL_URL) {
    return `https://${process.env.NEXT_PUBLIC_VERCEL_URL.replace(/\/$/, '')}`
  }

  // 3. In the browser, fallback to current window location origin
  if (typeof window !== 'undefined' && window.location.origin) {
    return window.location.origin
  }

  // 4. Fallback for local SSR
  return 'http://localhost:3000'
}
