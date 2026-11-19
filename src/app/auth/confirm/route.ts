import { createServerClient } from '@supabase/ssr'
import type { EmailOtpType } from '@supabase/supabase-js'
import { NextResponse, type NextRequest } from 'next/server'

function safeNextPath(value: string | null) {
  return value?.startsWith('/') && !value.startsWith('//')
    ? value
    : '/update-password'
}

export async function GET(request: NextRequest) {
  const tokenHash = request.nextUrl.searchParams.get('token_hash')
  const type = request.nextUrl.searchParams.get('type') as EmailOtpType | null
  const next = safeNextPath(request.nextUrl.searchParams.get('next'))

  if (!tokenHash || !type) {
    return NextResponse.redirect(
      new URL('/forgot-password?error=invalid_link', request.url)
    )
  }

  const response = NextResponse.redirect(new URL(next, request.url))
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  const { error } = await supabase.auth.verifyOtp({
    type,
    token_hash: tokenHash,
  })

  if (error) {
    return NextResponse.redirect(
      new URL('/forgot-password?error=invalid_link', request.url)
    )
  }

  return response
}
