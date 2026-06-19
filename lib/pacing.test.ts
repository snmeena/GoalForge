import { describe, it, expect } from 'vitest'
import { calculatePace } from './pacing'

describe('calculatePace', () => {
  it('should return on-track status when done >= expected', () => {
    const result = calculatePace(100, 50, 40, 10, 'volume')
    expect(result.status).toBe('on-track')
    expect(result.gap).toBe(10)
    expect(result.needed).toBe(5) // (100 - 50) / 10
  })

  it('should return behind status when done < expected but pct > 20', () => {
    const result = calculatePace(100, 25, 40, 10, 'volume')
    expect(result.status).toBe('behind')
    expect(result.gap).toBe(-15)
    expect(result.needed).toBe(8) // ceil(75/10)
  })

  it('should return critical status when done < expected and pct <= 20', () => {
    const result = calculatePace(100, 15, 40, 10, 'volume')
    expect(result.status).toBe('critical')
    expect(result.needed).toBe(9) // ceil(85/10)
  })

  it('should handle zero days left', () => {
    const result = calculatePace(100, 50, 40, 0, 'volume')
    expect(result.needed).toBe(0)
  })

  it('should generate correct messages for different types', () => {
    const codeResult = calculatePace(100, 30, 40, 10, 'volume')
    expect(codeResult.message).toContain('units/day')

    const gymResult = calculatePace(5, 2, 3, 2, 'routine')
    expect(gymResult.message).toContain('variance detected')

    const siegeResult = calculatePace(15, 5, 8, 5, 'siege')
    expect(siegeResult.message).toContain('intensity required')
  })
})
