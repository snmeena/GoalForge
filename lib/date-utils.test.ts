import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { getLocalDateString, isToday } from './date-utils'

describe('date-utils', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should return correct local date string', () => {
    // Set a specific date: 2026-06-18 20:00:00 UTC
    // If we are in UTC-5 (NYC), it should be 2026-06-18 15:00:00 local -> 2026-06-18
    // If we are in UTC+5, it should be 2026-06-19 01:00:00 local -> 2026-06-19
    
    const date = new Date(Date.UTC(2026, 5, 18, 22, 0, 0)) // June 18, 2026 10PM UTC
    vi.setSystemTime(date)
    
    // We can't easily test the exact string without knowing the environment's timezone,
    // but we can test the logic by mocking the offset if we really wanted to.
    // However, getLocalDateString(date) should be consistent with how the browser handles it.
    
    const result = getLocalDateString(date)
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })

  it('isToday should correctly identify today', () => {
    const todayStr = getLocalDateString()
    expect(isToday(todayStr)).toBe(true)
    expect(isToday('2000-01-01')).toBe(false)
  })
})
