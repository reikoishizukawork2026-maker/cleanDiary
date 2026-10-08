import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { renderWithRouter } from './test/renderWithRouter.jsx'

describe('画面の切り替え', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('最初はカレンダー画面を表示する', () => {
    renderWithRouter('/')
    expect(screen.getByRole('heading', { name: 'カレンダー' })).toBeInTheDocument()
  })

  it('URL の日付で日記表示画面を開く', () => {
    renderWithRouter('/diary/2026-10-08')
    expect(screen.getByRole('heading', { name: '2026-10-08 の日記' })).toBeInTheDocument()
  })

  it('URL の日付で日記編集画面を開く', () => {
    renderWithRouter('/diary/2026-10-08/edit')
    expect(
      screen.getByRole('heading', { name: '2026-10-08 の日記を編集' }),
    ).toBeInTheDocument()
  })

  it('URL のキーワードで検索結果画面を開く', () => {
    renderWithRouter('/search?q=カレー')
    expect(screen.getByRole('heading', { name: '「カレー」の検索結果' })).toBeInTheDocument()
  })

  it('知らない URL はカレンダー画面に戻す', () => {
    const router = renderWithRouter('/unknown')
    expect(router.state.location.pathname).toBe('/')
    expect(screen.getByRole('heading', { name: 'カレンダー' })).toBeInTheDocument()
  })

  it('カレンダー → 表示 → 編集 → 表示 → カレンダーと移動できる', async () => {
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(new Date(2026, 9, 8))
    const user = userEvent.setup()
    renderWithRouter('/')

    await user.click(screen.getByRole('link', { name: '今日の日記を見る' }))
    expect(screen.getByRole('heading', { name: '2026-10-08 の日記' })).toBeInTheDocument()

    await user.click(screen.getByRole('link', { name: '編集する' }))
    expect(
      screen.getByRole('heading', { name: '2026-10-08 の日記を編集' }),
    ).toBeInTheDocument()

    await user.click(screen.getByRole('link', { name: '表示に戻る' }))
    await user.click(screen.getByRole('link', { name: 'カレンダーに戻る' }))
    expect(screen.getByRole('heading', { name: 'カレンダー' })).toBeInTheDocument()
  })

  it('どの画面でもアプリ名からカレンダーに戻れる', async () => {
    const user = userEvent.setup()
    renderWithRouter('/search?q=a')
    await user.click(screen.getByRole('link', { name: 'cleandiary' }))
    expect(screen.getByRole('heading', { name: 'カレンダー' })).toBeInTheDocument()
  })
})
