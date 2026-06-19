// lib/supabase.ts
import { createClient } from "@/utils/supabase/client";

// ---- Auth helpers ----

export async function signUp(email: string, password: string) {
  const supabase = createClient();
  return supabase.auth.signUp({ email, password });
}

export async function signIn(email: string, password: string) {
  const supabase = createClient();
  return supabase.auth.signInWithPassword({ email, password });
}

export async function signOut() {
  const supabase = createClient();
  return supabase.auth.signOut();
}

export async function getUser() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

// ---- Goals ----

export async function getGoals(userId: string) {
  const supabase = createClient();
  return supabase
    .from("goals")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
}

export async function createGoal(goal: {
  user_id: string;
  title: string;
  target_value: number;
  unit: string;
  start_date: string;
  end_date: string;
}) {
  const supabase = createClient();
  return supabase.from("goals").insert(goal).select().single();
}

export async function logGoalProgress(log: {
  goal_id: string;
  user_id: string;
  date: string;
  value_added: number;
  note?: string;
}) {
  const supabase = createClient();
  return supabase.from("goal_logs").insert(log).select().single();
}

export async function getGoalLogs(goalId: string) {
  const supabase = createClient();
  return supabase
    .from("goal_logs")
    .select("*")
    .eq("goal_id", goalId)
    .order("date", { ascending: true });
}

// ---- Habits ----

export async function getHabits(userId: string) {
  const supabase = createClient();
  return supabase
    .from("habits")
    .select("*")
    .eq("user_id", userId)
    .eq("is_active", true);
}

export async function createHabit(habit: {
  user_id: string;
  title: string;
  frequency_type: string;
  frequency_days?: number[];
  rest_days?: number[];
  icon?: string;
  color?: string;
}) {
  const supabase = createClient();
  return supabase.from("habits").insert(habit).select().single();
}

export async function logHabitCompletion(completion: {
  habit_id: string;
  user_id: string;
  date: string;
  status: "done" | "skipped" | "rest";
  note?: string;
}) {
  const supabase = createClient();
  // Upsert — same day pe double entry nahi
  return supabase
    .from("habit_completions")
    .upsert(completion, { onConflict: "habit_id,date" })
    .select()
    .single();
}

export async function getHabitCompletions(
  habitId: string,
  startDate: string,
  endDate: string
) {
  const supabase = createClient();
  return supabase
    .from("habit_completions")
    .select("*")
    .eq("habit_id", habitId)
    .gte("date", startDate)
    .lte("date", endDate);
}
