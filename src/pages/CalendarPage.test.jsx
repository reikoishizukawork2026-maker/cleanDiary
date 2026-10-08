import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { saveDiary } from '../storage/diaryStorage.js'
import { renderWithRouter } from '../test/renderWithRouter.jsx'

describe('カレンダー画面', () => {
  beforeEach(() => {
    // 今日を 2026 年 10 月 8 日に固定する
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(new Date(2026, 9, 8, 12, 0))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('最初は今月を表示する', () => {
    renderWithRouter('/')
    expect(screen.getByRole('heading', { name: '2026年10月' })).toBeInTheDocument()
  })

  it('曜日は月曜日から並ぶ', () => {
    renderWithRouter('/')
    const weekdays = screen.getAllByRole('columnheader').map((th) => th.textContent)
    expect(weekdays).toEqual(['月', '火', '水', '木', '金', '土', '日'])
  })

  it('URL で指定した月を表示する', () => {
    renderWithRouter('/?month=2027-02')
    expect(screen.getByRole('heading', { name: '2027年2月' })).toBeInTheDocument()
  })

  it('URL の月の形式が正しくなければ今月を表示する', () => {
    renderWithRouter('/?month=abc')
    expect(screen.getByRole('heading', { name: '2026年10月' })).toBeInTheDocument()
  })

  it('前の月・次の月・今月に切り替えられる', async () => {
    const user = userEvent.setup()
    const router = renderWithRouter('/')

    await user.click(screen.getByRole('button', { name: '前の月' }))
    expect(screen.getByRole('heading', { name: '2026年9月' })).toBeInTheDocument()
    expect(router.state.location.search).toBe('?month=2026-09')

    await user.click(screen.getByRole('button', { name: '次の月' }))
    await user.click(screen.getByRole('button', { name: '次の月' }))
    await user.click(screen.getByRole('button', { name: '次の月' }))
    expect(screen.getByRole('heading', { name: '2026年12月' })).toBeInTheDocument()

    // 年をまたぐ
    await user.click(screen.getByRole('button', { name: '次の月' }))
    expect(screen.getByRole('heading', { name: '2027年1月' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: '今月' }))
    expect(screen.getByRole('heading', { name: '2026年10月' })).toBeInTheDocument()
  })

  it('今日の日付を目立たせる', () => {
    renderWithRouter('/')
    expect(screen.getByRole('link', { name: '2026-10-08' })).toHaveAttribute(
      'aria-current',
      'date',
    )
    expect(screen.getByRole('link', { name: '2026-10-09' })).not.toHaveAttribute(
      'aria-current',
    )
  })

  it('日記を書いた日に印をつける', () => {
    saveDiary('2026-10-05', { title: '', body: '書いた' })
    renderWithRouter('/')
    expect(screen.getByRole('link', { name: '2026-10-05（日記あり）' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '2026-10-06' })).toBeInTheDocument()
  })

  it('日記がある日をクリックすると表示画面へ移る', async () => {
    saveDiary('2026-10-05', { title: '', body: '書いた' })
    const user = userEvent.setup()
    const router = renderWithRouter('/')

    await user.click(screen.getByRole('link', { name: '2026-10-05（日記あり）' }))
    expect(router.state.location.pathname).toBe('/diary/2026-10-05')
  })

  it('日記がない日をクリックすると編集画面へ移る（未来の日付も書ける）', async () => {
    const user = userEvent.setup()
    const router = renderWithRouter('/')

    await user.click(screen.getByRole('link', { name: '2026-10-20' }))
    expect(router.state.location.pathname).toBe('/diary/2026-10-20/edit')
  })

  it('前後の月の日付もクリックできる', async () => {
    const user = userEvent.setup()
    const router = renderWithRouter('/')

    // 2026 年 10 月のカレンダーは 9 月 28 日（月）から始まる
    await user.click(screen.getByRole('link', { name: '2026-09-28' }))
    expect(router.state.location.pathname).toBe('/diary/2026-09-28/edit')
  })
})
