import { createClient } from '@/utils/supabase/client'
import { useDashboardStore } from '@/lib/store/useDashboardStore'
import { isLoggingAllowed } from '@/lib/routine-utils'

import { getLocalDateString } from '@/lib/date-utils'

export function useGoalMutations() {
  const supabase = createClient()
  const { activeGoals, setActiveGoals, setCheckedInGoals } = useDashboardStore()

  const handleDailyCheckIn = async (goalId: string, increment: number = 1, notes?: string) => {
    try {
      const goal = activeGoals.find(g => g.id === goalId)
      if (!goal) return
      
      if (goal.type === 'routine' && !isLoggingAllowed(goal.routineFreq)) {
        alert("This routine is not scheduled for today.")
        return
      }

      const newProgress = (goal.progress || 0) + increment

      const { error: updateError } = await supabase
        .from('user_goals')
        .update({ progress: newProgress })
        .eq('id', goalId)

      if (updateError) throw updateError

      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { error: logError } = await supabase
          .from('goal_logs')
          .insert([{
            goal_id: goalId,
            user_id: user.id,
            progress_added: increment,
            execution_notes: notes || null,
            date: getLocalDateString()
          }])
        
        if (logError) throw logError
      }

      setActiveGoals(prev => prev.map(g => g.id === goalId ? { ...g, progress: newProgress } : g))
      setCheckedInGoals(prev => Array.from(new Set([...prev, goalId])))

    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      console.error("Check-in Error:", message)
      alert(`Failed to log progress: ${message}`)
    }
  }

  const handleUndoCheckIn = async (goalId: string) => {
    try {
      const goal = activeGoals.find(g => g.id === goalId)
      if (!goal) return

      const today = getLocalDateString()
      
      const { data: logs, error: fetchError } = await supabase
        .from('goal_logs')
        .select('id, progress_added')
        .eq('goal_id', goalId)
        .eq('date', today)
        .order('created_at', { ascending: false })
        .limit(1)

      if (fetchError) throw fetchError
      
      const logEntry = logs && logs.length > 0 ? logs[0] : null
      const amountToDecrement = logEntry ? logEntry.progress_added : 1

      if (logEntry) {
        const { error: deleteError } = await supabase
          .from('goal_logs')
          .delete()
          .eq('id', logEntry.id)
        
        if (deleteError) throw deleteError
      }

      const newProgress = Math.max(0, (goal.progress || 0) - amountToDecrement)
      const { error: updateError } = await supabase
        .from('user_goals')
        .update({ progress: newProgress })
        .eq('id', goalId)

      if (updateError) throw updateError

      setActiveGoals(prev => prev.map(g => g.id === goalId ? { ...g, progress: newProgress } : g))
      setCheckedInGoals(prev => prev.filter(id => id !== goalId))

    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      console.error("Undo Check-in Error:", message)
      alert(`Failed to undo check-in: ${message}`)
    }
  }

  const handleDeleteGoal = async (id: string) => {
    if (id.length < 30) {
      setActiveGoals(prev => prev.filter(g => g.id !== id))
      return
    }

    if (!window.confirm("Are you sure you want to delete this matrix? This action cannot be undone.")) return

    try {
      const previousGoals = [...activeGoals]
      setActiveGoals(prev => prev.filter(g => g.id !== id))

      const { error } = await supabase
        .from('user_goals')
        .delete()
        .eq('id', id)

      if (error) {
        setActiveGoals(previousGoals)
        throw error
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      console.error("Delete Matrix Error:", message)
      alert(`Failed to delete matrix: ${message}`)
    }
  }

  return {
    handleDailyCheckIn,
    handleUndoCheckIn,
    handleDeleteGoal
  }
}
