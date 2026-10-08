import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { saveDiary } from './storage/diaryStorage.js'
import { renderWithRouter } from './test/renderWithRouter.jsx'

describe('画面の切り替え', () => {
  it('最初はカレンダー画面を表示する', () => {
    renderWithRouter('/?month=2026-10')
    expect(screen.getByRole('heading', { name: '2026年10月' })).toBeInTheDocument()
  })

  it('URL の日付で日記表示画面を開く', () => {
    renderWithRouter('/diary/2026-10-08')
    expect(screen.getByRole('heading', { name: '2026年10月8日（木）' })).toBeInTheDocument()
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
  })

  it('カレンダー → 表示 → 編集 → 表示 → 同じ月のカレンダーと移動できる', async () => {
    saveDiary('2026-11-03', { title: '', body: '書いた' })
    const user = userEvent.setup()
    renderWithRouter('/?month=2026-11')

    await user.click(screen.getByRole('link', { name: '2026-11-03（日記あり）' }))
    expect(screen.getByRole('heading', { name: '2026年11月3日（火）' })).toBeInTheDocument()

    await user.click(screen.getByRole('link', { name: '編集する' }))
    expect(
      screen.getByRole('heading', { name: '2026-11-03 の日記を編集' }),
    ).toBeInTheDocument()

    await user.click(screen.getByRole('link', { name: '表示に戻る' }))
    await user.click(screen.getByRole('link', { name: 'カレンダーに戻る' }))
    expect(screen.getByRole('heading', { name: '2026年11月' })).toBeInTheDocument()
  })

  it('どの画面でもアプリ名からカレンダーに戻れる', async () => {
    const user = userEvent.setup()
    const router = renderWithRouter('/search?q=a')
    await user.click(screen.getByRole('link', { name: 'cleandiary' }))
    expect(router.state.location.pathname).toBe('/')
  })
})
