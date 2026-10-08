import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  getCalendarWeeks,
  isValidDateKey,
  parseDateKey,
  shiftMonth,
  toDateKey,
  todayKey,
} from './date.js'

describe('toDateKey', () => {
  it('月と日を 2 桁にそろえる', () => {
    expect(toDateKey(new Date(2026, 0, 5))).toBe('2026-01-05')
  })
})

describe('parseDateKey', () => {
  it('日付キーを Date に戻す', () => {
    const date = parseDateKey('2026-10-08')
    expect(date.getFullYear()).toBe(2026)
    expect(date.getMonth()).toBe(9)
    expect(date.getDate()).toBe(8)
  })
})

describe('isValidDateKey', () => {
  it('実在する日付は true', () => {
    expect(isValidDateKey('2026-10-08')).toBe(true)
    expect(isValidDateKey('2028-02-29')).toBe(true)
  })

  it('実在しない日付や形式違いは false', () => {
    expect(isValidDateKey('2026-02-29')).toBe(false)
    expect(isValidDateKey('2026-13-01')).toBe(false)
    expect(isValidDateKey('2026-1-8')).toBe(false)
    expect(isValidDateKey('abc')).toBe(false)
  })
})

describe('todayKey', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('今日の日付キーを返す', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 9, 8, 23, 59))
    expect(todayKey()).toBe('2026-10-08')
  })
})

describe('shiftMonth', () => {
  it('年をまたいで月をずらせる', () => {
    expect(shiftMonth(2026, 12, 1)).toEqual({ year: 2027, month: 1 })
    expect(shiftMonth(2026, 1, -1)).toEqual({ year: 2025, month: 12 })
    expect(shiftMonth(2026, 10, 0)).toEqual({ year: 2026, month: 10 })
  })
})

describe('getCalendarWeeks', () => {
  it('週は月曜日始まりで、前後の月の日付で埋める', () => {
    // 2026 年 10 月 1 日は木曜日
    const weeks = getCalendarWeeks(2026, 10)
    expect(weeks).toHaveLength(5)
    expect(weeks[0][0]).toEqual({ dateKey: '2026-09-28', day: 28, isCurrentMonth: false })
    expect(weeks[0][3]).toEqual({ dateKey: '2026-10-01', day: 1, isCurrentMonth: true })
    expect(weeks[4][6]).toEqual({ dateKey: '2026-11-01', day: 1, isCurrentMonth: false })
  })

  it('どの週も 7 日ある', () => {
    for (const week of getCalendarWeeks(2026, 10)) {
      expect(week).toHaveLength(7)
    }
  })

  it('1 日が月曜日なら前の月の日付を入れない', () => {
    // 2026 年 6 月 1 日は月曜日
    const weeks = getCalendarWeeks(2026, 6)
    expect(weeks[0][0].dateKey).toBe('2026-06-01')
  })

  it('1 日が日曜日なら前の月の日付を 6 日入れる', () => {
    // 2026 年 2 月 1 日は日曜日
    const weeks = getCalendarWeeks(2026, 2)
    expect(weeks[0][0].dateKey).toBe('2026-01-26')
    expect(weeks[0][6].dateKey).toBe('2026-02-01')
  })

  it('閏年の 2 月は 29 日まである', () => {
    const days = getCalendarWeeks(2028, 2)
      .flat()
      .filter((d) => d.isCurrentMonth)
    expect(days).toHaveLength(29)
  })
})
