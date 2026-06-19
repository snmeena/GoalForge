// lib/pace-engine.ts
// 🧠 GoalForge Pace Engine — Core Logic
// Pure functions only. No side effects. Fully testable.

export type GoalStatus =
  | "NOT_STARTED"
  | "ON_TRACK"
  | "AHEAD"
  | "BEHIND"
  | "CRITICAL"
  | "COMPLETED"
  | "FAILED";

export interface PaceInput {
  targetValue: number;      // e.g. 100 (LC problems)
  startDate: string;        // "2026-06-01"
  endDate: string;          // "2026-06-30"
  completedValue: number;   // done so far
  todayDate?: string;       // defaults to today
}

export interface CatchUpDay {
  date: string;
  needed: number;
}

export interface PaceResult {
  status: GoalStatus;
  percentComplete: number;       // 0-100
  daysTotal: number;
  daysElapsed: number;
  daysLeft: number;
  originalDailyQuota: number;    // what was needed from day 1
  adjustedDailyQuota: number;    // what's needed now
  projectedTotal: number;        // at current pace, end result
  expectedByNow: number;         // should have done X by today
  gap: number;                   // behind/ahead by how much
  catchUpPlan: CatchUpDay[];     // next 3 days breakdown
  message: string;               // human-readable, humorous
  isRestDay: boolean;
}

// ---- Helpers ----

function daysBetween(a: string, b: string): number {
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.round(
    (new Date(b).getTime() - new Date(a).getTime()) / msPerDay
  );
}

function addDays(date: string, days: number): string {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

// ---- Status Messages (humorous but motivating) ----

const MESSAGES: Record<GoalStatus, (gap: number, daysLeft: number) => string> = {
  NOT_STARTED:  () => "Protocol initialized. Awaiting initial execution to establish baseline velocity.",
  COMPLETED:    () => "Target objective achieved. All metrics synchronized successfully. 🎉",
  FAILED:       (gap) => `Objective incomplete. Final deficit of ${Math.abs(gap)} units detected. Data archived for review. 📊`,
  AHEAD:        (gap) => `Velocity exceeds projection. Currently ${gap} units ahead of schedule. Maintaining optimal performance. 🚀`,
  ON_TRACK:     () => "Execution is perfectly synchronized with the target pace. Maintain current output. ✅",
  BEHIND:       (gap, daysLeft) => `Variance detected: ${Math.abs(gap)} units behind. Requires adjusted daily output for ${daysLeft} days to recover. 📈`,
  CRITICAL:     (gap, daysLeft) => `Critical deficit: ${Math.abs(gap)} units behind with ${daysLeft} days remaining. Activation of high-intensity protocol required. 🔥`,
};

// ---- Main Engine ----

export function calculatePace(input: PaceInput): PaceResult {
  const today = input.todayDate ?? new Date().toISOString().split("T")[0];
  const { targetValue, startDate, endDate, completedValue } = input;

  const daysTotal   = daysBetween(startDate, endDate) + 1;
  const daysElapsed = Math.max(0, Math.min(daysBetween(startDate, today) + 1, daysTotal));
  const daysLeft    = Math.max(0, daysTotal - daysElapsed);

  const percentComplete = Math.min(100, round1((completedValue / targetValue) * 100));

  // Not started yet
  if (daysElapsed <= 0) {
    return {
      status: "NOT_STARTED",
      percentComplete: 0,
      daysTotal,
      daysElapsed: 0,
      daysLeft,
      originalDailyQuota: round1(targetValue / daysTotal),
      adjustedDailyQuota: round1(targetValue / daysTotal),
      projectedTotal: 0,
      expectedByNow: 0,
      gap: 0,
      catchUpPlan: [],
      message: MESSAGES.NOT_STARTED(0, daysLeft),
      isRestDay: false,
    };
  }

  // Completed
  if (completedValue >= targetValue) {
    return {
      status: "COMPLETED",
      percentComplete: 100,
      daysTotal,
      daysElapsed,
      daysLeft,
      originalDailyQuota: round1(targetValue / daysTotal),
      adjustedDailyQuota: 0,
      projectedTotal: completedValue,
      expectedByNow: targetValue,
      gap: completedValue - targetValue,
      catchUpPlan: [],
      message: MESSAGES.COMPLETED(0, 0),
      isRestDay: false,
    };
  }

  // Failed (month ended, incomplete)
  if (daysLeft === 0 && completedValue < targetValue) {
    const gap = completedValue - targetValue;
    return {
      status: "FAILED",
      percentComplete,
      daysTotal,
      daysElapsed,
      daysLeft: 0,
      originalDailyQuota: round1(targetValue / daysTotal),
      adjustedDailyQuota: 0,
      projectedTotal: completedValue,
      expectedByNow: targetValue,
      gap,
      catchUpPlan: [],
      message: MESSAGES.FAILED(gap, 0),
      isRestDay: false,
    };
  }

  const originalDailyQuota = round1(targetValue / daysTotal);
  
  // Logic: Only expect progress from YESTERDAY. This gives a 1-day grace period for today's work.
  const completedDays = Math.max(0, daysElapsed - 1);
  const expectedByNow = round1((completedDays / daysTotal) * targetValue);
  const gap = round1(completedValue - expectedByNow); // positive = ahead or on track with today's work

  // Adjusted quota for remaining days
  const remaining          = targetValue - completedValue;
  const adjustedDailyQuota = daysLeft > 0 ? round1(remaining / daysLeft) : 0;

  // Projected total at current average pace
  const dailyAverage  = daysElapsed > 0 ? completedValue / daysElapsed : 0;
  const projectedTotal = Math.round(dailyAverage * daysTotal);

  // Status calculation based on variance from EXPECTED (yesterday's requirement)
  let status: GoalStatus;
  const gapPercent = (gap / targetValue) * 100;

  if (completedValue >= targetValue) {
      status = "COMPLETED";
  } else if (daysElapsed >= daysTotal && completedValue < targetValue) {
      status = "FAILED";
  } else if (gapPercent >= 0) {
      // If we've met yesterday's goal, we are either ON_TRACK or AHEAD
      // We are AHEAD only if we've also made significant progress on TODAY'S goal
      const todayRequirement = round1((daysElapsed / daysTotal) * targetValue);
      if (completedValue > todayRequirement + (targetValue * 0.05)) {
          status = "AHEAD";
      } else {
          status = "ON_TRACK";
      }
  } else if (gapPercent >= -15) {
      status = "BEHIND";
  } else {
      status = "CRITICAL";
  }

  // Catch-up plan (next 3 days)
  const catchUpPlan: CatchUpDay[] = [];
  if (status === "BEHIND" || status === "CRITICAL") {
    for (let i = 0; i < Math.min(3, daysLeft); i++) {
      catchUpPlan.push({
        date: addDays(today, i),
        needed: Math.ceil(adjustedDailyQuota),
      });
    }
  }

  return {
    status,
    percentComplete,
    daysTotal,
    daysElapsed,
    daysLeft,
    originalDailyQuota,
    adjustedDailyQuota,
    projectedTotal,
    expectedByNow,
    gap,
    catchUpPlan,
    message: MESSAGES[status](gap, daysLeft),
    isRestDay: false,
  };
}

// ---- Habit helpers ----

export type HabitFrequency =
  | "DAILY"
  | "WEEKDAYS"
  | "WEEKENDS"
  | "CUSTOM";

export interface HabitSchedule {
  frequency: HabitFrequency;
  customDays?: number[]; // 0=Sun, 1=Mon ... 6=Sat
  restDays?: number[];   // days to skip (0-6)
}

export function isHabitDueToday(
  schedule: HabitSchedule,
  date?: string
): boolean {
  const d = date ? new Date(date) : new Date();
  const day = d.getDay(); // 0=Sun

  if (schedule.restDays?.includes(day)) return false;

  switch (schedule.frequency) {
    case "DAILY":    return true;
    case "WEEKDAYS": return day >= 1 && day <= 5;
    case "WEEKENDS": return day === 0 || day === 6;
    case "CUSTOM":   return schedule.customDays?.includes(day) ?? false;
    default:         return false;
  }
}

export function getHabitCompletionRate(
  completions: { date: string; status: "done" | "skipped" | "rest" }[],
  startDate: string,
  endDate: string,
  schedule: HabitSchedule
): number {
  let dueCount = 0;
  let doneCount = 0;

  const start = new Date(startDate);
  const end   = new Date(endDate);

  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split("T")[0];
    if (!isHabitDueToday(schedule, dateStr)) continue;

    dueCount++;
    const entry = completions.find((c) => c.date === dateStr);
    if (entry?.status === "done") doneCount++;
  }

  return dueCount === 0 ? 0 : round1((doneCount / dueCount) * 100);
}