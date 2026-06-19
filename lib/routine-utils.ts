import { RoutineFrequency } from "@/components/dashboard/types";

export function isLoggingAllowed(freq: RoutineFrequency | null | undefined): boolean {
    if (!freq) return true; // Flexible/No specific restriction

    const today = new Date();
    // Map date to Sat, Sun, Mon...
    const daysMap = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dayName = daysMap[today.getDay()];

    if (freq.type === 'fixed') {
        // Handle "Last-Month" special case
        if (freq.days.includes('Last-Month')) {
            const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
            const lastDayOfCurrentMonth = new Date(nextMonth.getTime() - 1);
            // Check if we are in the last week of the month (e.g., last 7 days)
            if (today.getDate() > lastDayOfCurrentMonth.getDate() - 7) return true;
        }
        
        return freq.days.some(day => day === dayName);
    }
    
    // Flexible frequency (e.g., 3 days per week) is harder to enforce without tracking history.
    // For now, allow flexible logging if not a fixed schedule.
    return true; 
}
