import { useState, useCallback } from 'react'
import { supabase } from '../supabaseClient'

export default function useResendVerification() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const resend = useCallback(async (email: string) => {
    setError(null)
    setLoading(true)
    try {
      const { error: resendError } = await supabase.auth.signInWithOtp({ email: email.trim(), options: { shouldCreateUser: false } })
      if (resendError) throw resendError
      return true
    } catch (err: any) {
      setError(err?.message ?? String(err))
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  return { resend, loading, error }
}