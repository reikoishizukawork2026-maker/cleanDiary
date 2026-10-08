import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { saveDiary } from '../storage/diaryStorage.js'
import { renderWithRouter } from '../test/renderWithRouter.jsx'

describe('キーワード検索', () => {
  beforeEach(() => {
    saveDiary('2026-10-01', { title: 'カレー', body: '夕飯を作った' })
    saveDiary('2026-10-05', { title: '', body: '友だちとカレーを食べた' })
    saveDiary('2026-10-03', { title: 'React', body: '勉強した' })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('どの画面でもヘッダーから検索でき、検索結果画面へ移る', async () => {
    const user = userEvent.setup()
    const router = renderWithRouter('/?month=2026-10')

    await user.type(screen.getByRole('searchbox', { name: '検索キーワード' }), 'カレー')
    await user.click(screen.getByRole('button', { name: '検索' }))

    expect(router.state.location.pathname).toBe('/search')
    expect(screen.getByRole('heading', { name: '「カレー」の検索結果' })).toBeInTheDocument()
  })

  it('Enter キーでも検索できる', async () => {
    const user = userEvent.setup()
    renderWithRouter('/')

    await user.type(screen.getByRole('searchbox'), '勉強{Enter}')

    expect(screen.getByRole('heading', { name: '「勉強」の検索結果' })).toBeInTheDocument()
  })

  it('件数を表示し、新しい日付順に並べる', () => {
    renderWithRouter('/search?q=カレー')

    expect(screen.getByText('2件見つかりました。')).toBeInTheDocument()
    const items = screen.getAllByRole('listitem')
    expect(items).toHaveLength(2)
    expect(items[0]).toHaveTextContent('2026年10月5日（月）')
    expect(items[1]).toHaveTextContent('2026年10月1日（木）')
  })

  it('タイトル・本文の一部を表示し、キーワードを目立たせる', () => {
    renderWithRouter('/search?q=カレー')

    const [first, second] = screen.getAllByRole('listitem')
    // 本文に含む日記（タイトルなし）
    expect(first).toHaveTextContent('（タイトルなし）')
    expect(first).toHaveTextContent('友だちとカレーを食べた')
    expect(within(first).getByText('カレー', { selector: 'mark' })).toBeInTheDocument()
    // タイトルに含む日記
    expect(within(second).getByText('カレー', { selector: 'mark' })).toBeInTheDocument()
    expect(second).toHaveTextContent('夕飯を作った')
  })

  it('英字の大文字・小文字を区別しない', () => {
    renderWithRouter('/search?q=react')
    expect(screen.getByText('1件見つかりました。')).toBeInTheDocument()
    expect(screen.getByText('React', { selector: 'mark' })).toBeInTheDocument()
  })

  it('検索結果をクリックすると、日記表示画面へ移る', async () => {
    const user = userEvent.setup()
    const router = renderWithRouter('/search?q=勉強')

    await user.click(screen.getByRole('link', { name: /React/ }))

    expect(router.state.location.pathname).toBe('/diary/2026-10-03')
  })

  it('見つからなければ、その旨を表示する', () => {
    renderWithRouter('/search?q=旅行')
    expect(screen.getByText('見つかりませんでした。')).toBeInTheDocument()
    expect(screen.queryByRole('listitem')).not.toBeInTheDocument()
  })

  it('キーワードが空なら、入力するよう案内する', async () => {
    const user = userEvent.setup()
    renderWithRouter('/')

    await user.click(screen.getByRole('button', { name: '検索' }))

    expect(screen.getByRole('heading', { name: '検索' })).toBeInTheDocument()
    expect(
      screen.getByText('上の入力欄にキーワードを入力して、検索してください。'),
    ).toBeInTheDocument()
  })

  it('検索結果画面では、入力欄にキーワードが残る', () => {
    renderWithRouter('/search?q=カレー')
    expect(screen.getByRole('searchbox')).toHaveValue('カレー')
  })

  it('& や # を含むキーワードでも検索できる', async () => {
    saveDiary('2026-10-10', { title: '', body: 'Q&A #1 を見た' })
    const user = userEvent.setup()
    renderWithRouter('/')

    await user.type(screen.getByRole('searchbox'), 'Q&A #1{Enter}')

    expect(screen.getByRole('heading', { name: '「Q&A #1」の検索結果' })).toBeInTheDocument()
    expect(screen.getByText('1件見つかりました。')).toBeInTheDocument()
  })

  it('編集中に検索しようとすると、未保存の警告を出す', async () => {
    const confirm = vi.spyOn(window, 'confirm').mockReturnValue(false)
    const user = userEvent.setup()
    const router = renderWithRouter('/diary/2026-10-20/edit')

    await user.type(screen.getByLabelText('本文'), '書きかけ')
    await user.type(screen.getByRole('searchbox'), 'カレー{Enter}')

    expect(confirm).toHaveBeenCalledOnce()
    expect(router.state.location.pathname).toBe('/diary/2026-10-20/edit')
  })
})
