import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { getDiary, saveDiary } from '../storage/diaryStorage.js'
import { renderWithRouter } from '../test/renderWithRouter.jsx'

describe('日記表示画面', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(new Date(2026, 9, 8, 9, 30))
    saveDiary('2026-10-08', { title: '散歩', body: '公園に行った。\n紅葉がきれいだった。' })
    vi.setSystemTime(new Date(2026, 9, 8, 21, 15))
    saveDiary('2026-10-08', { title: '散歩', body: '公園に行った。\n紅葉がきれいだった。' })
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('日付・タイトル・本文・作成日時・更新日時を表示する', () => {
    renderWithRouter('/diary/2026-10-08')
    expect(screen.getByRole('heading', { name: '2026年10月8日（木）' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: '散歩' })).toBeInTheDocument()
    expect(screen.getByText(/紅葉がきれいだった。/)).toBeInTheDocument()
    expect(screen.getByText('2026/10/08 09:30')).toBeInTheDocument()
    expect(screen.getByText('2026/10/08 21:15')).toBeInTheDocument()
  })

  it('タイトルがなければ「（タイトルなし）」と表示する', () => {
    saveDiary('2026-10-09', { title: '', body: '本文だけ' })
    renderWithRouter('/diary/2026-10-09')
    expect(screen.getByRole('heading', { name: '（タイトルなし）' })).toBeInTheDocument()
  })

  it('編集するボタンで編集画面へ移る', async () => {
    const user = userEvent.setup()
    const router = renderWithRouter('/diary/2026-10-08')
    await user.click(screen.getByRole('link', { name: '編集する' }))
    expect(router.state.location.pathname).toBe('/diary/2026-10-08/edit')
  })

  it('削除を確認して OK なら、削除してその月のカレンダーへ戻る', async () => {
    const confirm = vi.spyOn(window, 'confirm').mockReturnValue(true)
    const user = userEvent.setup()
    const router = renderWithRouter('/diary/2026-10-08')

    await user.click(screen.getByRole('button', { name: '削除する' }))

    expect(confirm).toHaveBeenCalledOnce()
    expect(getDiary('2026-10-08')).toBeNull()
    expect(router.state.location.pathname).toBe('/')
    expect(router.state.location.search).toBe('?month=2026-10')
    // カレンダーの印も消えている
    expect(screen.getByRole('link', { name: '2026-10-08' })).toBeInTheDocument()
  })

  it('削除の確認でキャンセルしたら、削除しない', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(false)
    const user = userEvent.setup()
    const router = renderWithRouter('/diary/2026-10-08')

    await user.click(screen.getByRole('button', { name: '削除する' }))

    expect(getDiary('2026-10-08')).not.toBeNull()
    expect(router.state.location.pathname).toBe('/diary/2026-10-08')
  })

  it('日記がない日は、その旨と「日記を書く」を表示する', async () => {
    const user = userEvent.setup()
    const router = renderWithRouter('/diary/2026-10-20')
    expect(screen.getByText('この日の日記はまだありません。')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: '削除する' })).not.toBeInTheDocument()

    await user.click(screen.getByRole('link', { name: '日記を書く' }))
    expect(router.state.location.pathname).toBe('/diary/2026-10-20/edit')
  })

  it('URL の日付が正しくなければ、その旨を表示する', () => {
    renderWithRouter('/diary/2026-02-30')
    expect(screen.getByRole('heading', { name: '日付が正しくありません' })).toBeInTheDocument()
  })

  it('カレンダーに戻ると、その日記の月を表示する', async () => {
    const user = userEvent.setup()
    renderWithRouter('/diary/2026-10-08')
    await user.click(screen.getByRole('link', { name: 'カレンダーに戻る' }))
    expect(screen.getByRole('heading', { name: '2026年10月' })).toBeInTheDocument()
  })
})
