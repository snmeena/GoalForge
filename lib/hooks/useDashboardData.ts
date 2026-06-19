import { useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useDashboardStore } from '@/lib/store/useDashboardStore'
import { Goal, EngineType } from '@/components/dashboard/types'
import { useRouter } from 'next/navigation'

export function useDashboardData() {
  const supabase = createClient()
  const router = useRouter()
  const {
    setActiveGoals,
    setCheckedInGoals,
    setUserProfile,
    setNotifications,
    setIsLoggingOut,
  } = useDashboardStore()

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()

        if (user) {
          const fullName = user.user_metadata?.full_name || user.user_metadata?.username || "Forged User"
          
          const identities = user.identities || []
          const isOAuth = identities.some(id => id.provider === 'google' || id.provider === 'github')
          const hasSetPassword = user.user_metadata?.has_password_set === true || !isOAuth

          setUserProfile({
            email: user.email || "",
            avatarUrl: user.user_metadata?.avatar_url || "",
            name: fullName.includes(' (') ? fullName.split(' (')[0] : fullName,
            hasPassword: hasSetPassword,
          })

          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .maybeSingle()

          if (profileError) throw profileError

          if (profile) {
            setUserProfile({
              username: profile.username,
              bio: profile.bio || "",
              avatarUrl: profile.avatar_url || user.user_metadata?.avatar_url || "",
              twitterUrl: profile.twitter_handle || "",
              githubUrl: profile.github_handle || "",
              canChangeUsername: profile.username_claimed !== true && isOAuth,
            })

            setNotifications({
              reminderTime: profile.reminder_time || "20:00",
              emailAlerts: profile.email_alerts !== false,
              paceWarnings: profile.pace_warnings !== false,
              pushNotifications: profile.push_notifications === true,
              weeklyDigest: profile.weekly_digest !== false,
              quietHoursStart: profile.quiet_hours_start || "22:00",
              quietHoursEnd: profile.quiet_hours_end || "07:00",
            })
          }

          const { data: savedGoals, error: goalsError } = await supabase
            .from('user_goals')
            .select('*')
            .order('created_at', { ascending: false })

          if (goalsError) throw goalsError

          if (savedGoals) {
            const mappedGoals: Goal[] = savedGoals.map(g => ({
              id: g.id,
              title: g.title,
              type: (g.status as EngineType) || "volume",
              deadline: g.deadline || "",
              startDate: g.created_at,
              priority: g.priority || "medium",
              volumeTarget: g.volume_target?.toString() || "100",
              volumeUnit: g.volume_unit || undefined,
              routineFreq: g.routine_freq ? (typeof g.routine_freq === 'string' ? JSON.parse(g.routine_freq) : g.routine_freq) : null,
              pipelineTasks: g.pipeline_tasks || undefined,
              siegeNotes: g.siege_notes || undefined,
              progress: g.progress || 0
            }))
            setActiveGoals(mappedGoals)
          }
        } else {
          router.push("/login")
        }
      } catch (error) {
        console.error("Initialization Error:", error instanceof Error ? error.message : String(error))
      }
    }

    fetchUserData()
  }, [supabase, router, setActiveGoals, setUserProfile, setNotifications])

  useEffect(() => {
    const fetchTodayCheckins = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const today = new Date().toISOString().split('T')[0]

      const { data, error } = await supabase
        .from('goal_logs')
        .select('goal_id')
        .eq('user_id', user.id)
        .gte('created_at', `${today}T00:00:00Z`)
        .lte('created_at', `${today}T23:59:59Z`)

      if (!error && data) {
        const checkedInIds = data.map(log => log.goal_id)
        setCheckedInGoals(Array.from(new Set(checkedInIds)))
      }
    }

    fetchTodayCheckins()
  }, [supabase, setCheckedInGoals])

  const handleSignOut = async () => {
    try {
      setIsLoggingOut(true)
      await supabase.auth.signOut()
      setTimeout(() => {
        router.push("/login")
        setIsLoggingOut(false)
      }, 400)
    } catch (error) {
      console.error("Sign Out Error:", error instanceof Error ? error.message : String(error))
      router.push("/login")
      setIsLoggingOut(false)
    }
  }

  return { handleSignOut }
}
