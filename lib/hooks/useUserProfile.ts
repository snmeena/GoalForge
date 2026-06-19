import { createClient } from '@/utils/supabase/client'
import { useDashboardStore } from '@/lib/store/useDashboardStore'

export function useUserProfile() {
  const supabase = createClient()
  const { setUserProfile, setIsUploading } = useDashboardStore()

  const handleUpdateProfile = async (name: string, bio: string, twitterUrl: string, githubUrl: string) => {
    try {
      setIsUploading(true)
      const { error } = await supabase.auth.updateUser({
        data: { full_name: name }
      })

      if (error) throw error

      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { error: profileError } = await supabase.from('profiles').update({ 
          full_name: name,
          bio: bio,
          twitter_handle: twitterUrl,
          github_handle: githubUrl
        }).eq('id', user.id)
        
        if (profileError) throw profileError
        
        setUserProfile({ name, bio, twitterUrl, githubUrl })
      }

      alert("Profile updated successfully!")
    } catch (error) {
      alert(error instanceof Error ? error.message : String(error))
    } finally {
      setIsUploading(false)
    }
  }

  const handleUpdateUsername = async (newUsername: string) => {
    try {
      if (!/^[a-zA-Z0-9_]{3,15}$/.test(newUsername)) {
        throw new Error("Username must be 3-15 characters and can only contain letters, numbers, and underscores.")
      }

      setIsUploading(true)
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Authentication required.")

      const { data: existing } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', newUsername)
        .maybeSingle()

      if (existing) throw new Error("This username is already taken.")

      const { error } = await supabase
        .from('profiles')
        .update({
          username: newUsername,
          username_claimed: true
        })
        .eq('id', user.id)

      if (error) throw error

      setUserProfile({ username: newUsername, canChangeUsername: false })
      alert("Username claimed successfully!")
    } catch (error) {
      alert(error instanceof Error ? error.message : String(error))
    } finally {
      setIsUploading(false)
    }
  }

  const handleAvatarUpload = async (file: File) => {
    try {
      setIsUploading(true)
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("No user found")

      const fileExt = file.name.split('.').pop()
      const filePath = `${user.id}-${Math.random()}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)

      const { error: updateError } = await supabase.auth.updateUser({
        data: { avatar_url: publicUrl }
      })

      if (updateError) throw updateError

      setUserProfile({ avatarUrl: publicUrl })
      alert("Profile picture updated successfully!")
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      console.error("Upload Error:", message)
      alert(`Failed to upload image: ${message}. Make sure 'avatars' bucket exists.`)
    } finally {
      setIsUploading(false)
    }
  }

  const handleUpdateNotificationSetting = async (key: string, value: string | boolean) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { error } = await supabase
        .from('profiles')
        .update({ [key]: value })
        .eq('id', user.id)

      if (error) throw error
      
      // Map database keys to store keys if necessary, or just use camelCase in store
      // For now, let's assume the caller passes the correct store key
    } catch (err) {
      console.error(`Failed to update ${key}:`, err)
    }
  }

  return {
    handleUpdateProfile,
    handleUpdateUsername,
    handleAvatarUpload,
    handleUpdateNotificationSetting
  }
}
