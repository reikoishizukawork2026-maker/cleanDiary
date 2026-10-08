import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { getDiary, saveDiary } from '../storage/diaryStorage.js'
import { renderWithRouter } from '../test/renderWithRouter.jsx'

describe('日記編集画面', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(new Date(2026, 9, 8, 20, 0))
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  describe('新しく書く', () => {
    it('見出しは「〜の日記を書く」で、入力欄は空', () => {
      renderWithRouter('/diary/2026-10-20/edit')
      expect(
        screen.getByRole('heading', { name: '2026年10月20日（火）の日記を書く' }),
      ).toBeInTheDocument()
      expect(screen.getByLabelText('タイトル（任意）')).toHaveValue('')
      expect(screen.getByLabelText('本文')).toHaveValue('')
    })

    it('保存すると記録され、表示画面へ移る', async () => {
      const user = userEvent.setup()
      const router = renderWithRouter('/diary/2026-10-20/edit')

      await user.type(screen.getByLabelText('タイトル（任意）'), '旅行')
      await user.type(screen.getByLabelText('本文'), '京都に行く予定')
      await user.click(screen.getByRole('button', { name: '保存する' }))

      expect(getDiary('2026-10-20')).toMatchObject({ title: '旅行', body: '京都に行く予定' })
      expect(router.state.location.pathname).toBe('/diary/2026-10-20')
      expect(screen.getByRole('heading', { name: '旅行' })).toBeInTheDocument()
    })

    it('本文が空なら保存せず、メッセージを出す', async () => {
      const user = userEvent.setup()
      const router = renderWithRouter('/diary/2026-10-20/edit')

      await user.type(screen.getByLabelText('タイトル（任意）'), 'タイトルだけ')
      await user.click(screen.getByRole('button', { name: '保存する' }))

      expect(screen.getByRole('alert')).toHaveTextContent('本文を入力してください')
      expect(screen.getByLabelText('本文')).toHaveAttribute('aria-invalid', 'true')
      expect(getDiary('2026-10-20')).toBeNull()
      expect(router.state.location.pathname).toBe('/diary/2026-10-20/edit')
    })

    it('タイトルが 50 文字を超えたら保存せず、メッセージを出す', async () => {
      const user = userEvent.setup()
      renderWithRouter('/diary/2026-10-20/edit')

      // 1 文字ずつ打つと遅いので、貼り付けで入力する
      await user.click(screen.getByLabelText('タイトル（任意）'))
      await user.paste('あ'.repeat(51))
      await user.type(screen.getByLabelText('本文'), '本文')
      expect(screen.getByText('51 / 50')).toHaveClass('is-over')

      await user.click(screen.getByRole('button', { name: '保存する' }))
      expect(screen.getByRole('alert')).toHaveTextContent('タイトルは50文字以内で入力してください')
      expect(getDiary('2026-10-20')).toBeNull()
    })

    it('文字数を表示する', async () => {
      const user = userEvent.setup()
      renderWithRouter('/diary/2026-10-20/edit')
      expect(screen.getByText('0 / 5,000')).toBeInTheDocument()

      await user.type(screen.getByLabelText('本文'), 'こんにちは')
      expect(screen.getByText('5 / 5,000')).toBeInTheDocument()
    })

    it('何も入力せずキャンセルすると、警告なしでその月のカレンダーへ戻る', async () => {
      const confirm = vi.spyOn(window, 'confirm')
      const user = userEvent.setup()
      const router = renderWithRouter('/diary/2026-11-03/edit')

      await user.click(screen.getByRole('button', { name: 'キャンセル' }))

      expect(confirm).not.toHaveBeenCalled()
      expect(router.state.location.search).toBe('?month=2026-11')
    })
  })

  describe('書き直す', () => {
    beforeEach(() => {
      saveDiary('2026-10-08', { title: '散歩', body: '公園に行った' })
    })

    it('見出しは「〜の日記を編集」で、今の内容が入っている', () => {
      renderWithRouter('/diary/2026-10-08/edit')
      expect(
        screen.getByRole('heading', { name: '2026年10月8日（木）の日記を編集' }),
      ).toBeInTheDocument()
      expect(screen.getByLabelText('タイトル（任意）')).toHaveValue('散歩')
      expect(screen.getByLabelText('本文')).toHaveValue('公園に行った')
    })

    it('保存すると上書きされ、作成日時はそのままで更新日時が変わる', async () => {
      const createdAt = getDiary('2026-10-08').createdAt
      vi.setSystemTime(new Date(2026, 9, 8, 22, 30))
      const user = userEvent.setup()
      renderWithRouter('/diary/2026-10-08/edit')

      await user.type(screen.getByLabelText('本文'), '。楽しかった')
      await user.click(screen.getByRole('button', { name: '保存する' }))

      const diary = getDiary('2026-10-08')
      expect(diary.body).toBe('公園に行った。楽しかった')
      expect(diary.createdAt).toBe(createdAt)
      expect(screen.getByText('2026/10/08 22:30')).toBeInTheDocument()
    })

    it('保存したあと「戻る」で編集画面には戻らない', async () => {
      const user = userEvent.setup()
      const router = renderWithRouter('/diary/2026-10-08')

      await user.click(screen.getByRole('link', { name: '編集する' }))
      await user.type(screen.getByLabelText('本文'), '!')
      await user.click(screen.getByRole('button', { name: '保存する' }))
      expect(router.state.location.pathname).toBe('/diary/2026-10-08')

      // 編集画面は履歴から置き換わっているので、1 つ前は表示画面
      await router.navigate(-1)
      expect(router.state.location.pathname).toBe('/diary/2026-10-08')
    })

    it('変更せずキャンセルすると、警告なしで表示画面へ戻る', async () => {
      const confirm = vi.spyOn(window, 'confirm')
      const user = userEvent.setup()
      const router = renderWithRouter('/diary/2026-10-08/edit')

      await user.click(screen.getByRole('button', { name: 'キャンセル' }))

      expect(confirm).not.toHaveBeenCalled()
      expect(router.state.location.pathname).toBe('/diary/2026-10-08')
    })
  })

  describe('未保存の警告', () => {
    it('変更してからキャンセルすると確認し、「キャンセル」を選ぶと留まる', async () => {
      const confirm = vi.spyOn(window, 'confirm').mockReturnValue(false)
      const user = userEvent.setup()
      const router = renderWithRouter('/diary/2026-10-20/edit')

      await user.type(screen.getByLabelText('本文'), '書きかけ')
      await user.click(screen.getByRole('button', { name: 'キャンセル' }))

      expect(confirm).toHaveBeenCalledWith(
        '保存していない内容があります。このページを離れますか？',
      )
      expect(router.state.location.pathname).toBe('/diary/2026-10-20/edit')
      expect(screen.getByLabelText('本文')).toHaveValue('書きかけ')
    })

    it('確認で「OK」を選ぶと、保存せずに移る', async () => {
      vi.spyOn(window, 'confirm').mockReturnValue(true)
      const user = userEvent.setup()
      const router = renderWithRouter('/diary/2026-10-20/edit')

      await user.type(screen.getByLabelText('本文'), '書きかけ')
      // ヘッダーのアプリ名からカレンダーへ移ろうとする
      await user.click(screen.getByRole('link', { name: 'cleandiary' }))

      expect(router.state.location.pathname).toBe('/')
      expect(getDiary('2026-10-20')).toBeNull()
    })

    it('変更があるときは、タブを閉じる・再読み込みでもブラウザの警告を出す', async () => {
      const user = userEvent.setup()
      renderWithRouter('/diary/2026-10-20/edit')

      const before = new Event('beforeunload', { cancelable: true })
      window.dispatchEvent(before)
      expect(before.defaultPrevented).toBe(false)

      await user.type(screen.getByLabelText('本文'), '書きかけ')
      const after = new Event('beforeunload', { cancelable: true })
      window.dispatchEvent(after)
      expect(after.defaultPrevented).toBe(true)
    })

    it('入力しても元の内容に戻せば、警告しない', async () => {
      const confirm = vi.spyOn(window, 'confirm')
      const user = userEvent.setup()
      renderWithRouter('/diary/2026-10-20/edit')

      await user.type(screen.getByLabelText('本文'), 'あ')
      await user.clear(screen.getByLabelText('本文'))
      await user.click(screen.getByRole('button', { name: 'キャンセル' }))

      expect(confirm).not.toHaveBeenCalled()
    })
  })

  it('URL の日付が正しくなければ、その旨を表示する', () => {
    renderWithRouter('/diary/2026-13-01/edit')
    expect(screen.getByRole('heading', { name: '日付が正しくありません' })).toBeInTheDocument()
  })
})
