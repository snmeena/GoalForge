import { createClient } from '@/utils/supabase/client'
import { useDashboardStore } from '@/lib/store/useDashboardStore'
import { useRouter } from 'next/navigation'

export function useAccountActions() {
  const supabase = createClient()
  const router = useRouter()
  const { setIsUploading, setIsLoggingOut, setUserProfile } = useDashboardStore()

  const handleVerifyPassword = async (currentPassword: string) => {
    try {
      setIsUploading(true)
      const { data: { user } } = await supabase.auth.getUser()
      if (!user || !user.email) throw new Error("User session expired.")

      const { error: verifyError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword
      })

      if (verifyError) {
        if (verifyError.message.includes("Invalid login credentials")) {
          throw new Error("Current password is incorrect.")
        }
        throw verifyError
      }
      return true
    } catch (error: unknown) {
      throw error
    } finally {
      setIsUploading(false)
    }
  }

  const handleUpdatePassword = async (newPassword: string) => {
    try {
      if (newPassword.length < 6) throw new Error("Password must be at least 6 characters.")

      setIsUploading(true)
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
        data: { has_password_set: true }
      })

      if (error) throw error
      setUserProfile({ hasPassword: true })
      return true
    } catch (error: unknown) {
      throw error
    } finally {
      setIsUploading(false)
    }
  }

  const handleDeactivateAccount = async (password: string) => {
    try {
      setIsUploading(true)
      const { data: { user } } = await supabase.auth.getUser()
      if (!user || !user.email) throw new Error("User session expired.")

      const { error: verifyError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: password
      })

      if (verifyError) throw new Error("Incorrect password. Verification failed.")

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ is_deactivated: true })
        .eq('id', user.id)

      if (updateError) throw updateError
      
      // Sign out
      setIsLoggingOut(true)
      await supabase.auth.signOut()
      router.push("/login")
    } catch (error: unknown) {
      throw error
    } finally {
      setIsUploading(false)
      setIsLoggingOut(false)
    }
  }

  const handleDeleteAccount = async (password: string) => {
    try {
      setIsUploading(true)
      const { data: { user } } = await supabase.auth.getUser()
      if (!user || !user.email) throw new Error("User session expired.")

      const { error: verifyError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: password
      })

      if (verifyError) throw new Error("Incorrect password. Verification failed.")

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', user.id)

      if (updateError) throw updateError
      
      // Sign out
      setIsLoggingOut(true)
      await supabase.auth.signOut()
      router.push("/login")
    } catch (error: unknown) {
      throw error
    } finally {
      setIsUploading(false)
      setIsLoggingOut(false)
    }
  }

  return {
    handleVerifyPassword,
    handleUpdatePassword,
    handleDeactivateAccount,
    handleDeleteAccount
  }
}
