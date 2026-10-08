import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  BODY_MAX_LENGTH,
  TITLE_MAX_LENGTH,
  deleteDiary,
  getDiary,
  getDiaryDates,
  saveDiary,
  searchDiaries,
  validateDiary,
} from './diaryStorage.js'

describe('validateDiary', () => {
  it('本文があれば問題なし（タイトルは空でもよい）', () => {
    expect(validateDiary({ title: '', body: '晴れ' })).toEqual({})
  })

  it('本文が空や空白だけならエラー', () => {
    expect(validateDiary({ title: '', body: '' }).body).toBe('本文を入力してください')
    expect(validateDiary({ title: '', body: '  \n ' }).body).toBe('本文を入力してください')
  })

  it('タイトルは上限ちょうどまでよい', () => {
    expect(validateDiary({ title: 'あ'.repeat(TITLE_MAX_LENGTH), body: '本文' })).toEqual({})
    expect(
      validateDiary({ title: 'あ'.repeat(TITLE_MAX_LENGTH + 1), body: '本文' }).title,
    ).toBe('タイトルは50文字以内で入力してください')
  })

  it('本文は上限ちょうどまでよい', () => {
    expect(validateDiary({ title: '', body: 'あ'.repeat(BODY_MAX_LENGTH) })).toEqual({})
    expect(validateDiary({ title: '', body: 'あ'.repeat(BODY_MAX_LENGTH + 1) }).body).toBe(
      '本文は5,000文字以内で入力してください',
    )
  })
})

describe('日記の保存・読み込み・削除', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-10-08T01:00:00Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('保存していない日は null', () => {
    expect(getDiary('2026-10-08')).toBeNull()
  })

  it('保存した日記を読み込める', () => {
    saveDiary('2026-10-08', { title: '散歩', body: '公園に行った' })
    expect(getDiary('2026-10-08')).toEqual({
      date: '2026-10-08',
      title: '散歩',
      body: '公園に行った',
      createdAt: '2026-10-08T01:00:00.000Z',
      updatedAt: '2026-10-08T01:00:00.000Z',
    })
  })

  it('上書きすると、作成日時はそのままで更新日時だけ変わる', () => {
    saveDiary('2026-10-08', { title: '', body: '1回目' })
    vi.setSystemTime(new Date('2026-10-08T05:00:00Z'))
    saveDiary('2026-10-08', { title: '', body: '2回目' })

    const diary = getDiary('2026-10-08')
    expect(diary.body).toBe('2回目')
    expect(diary.createdAt).toBe('2026-10-08T01:00:00.000Z')
    expect(diary.updatedAt).toBe('2026-10-08T05:00:00.000Z')
  })

  it('未来の日付にも保存できる', () => {
    saveDiary('2027-01-01', { title: '', body: '予定' })
    expect(getDiary('2027-01-01').body).toBe('予定')
  })

  it('入力に問題があれば保存しない', () => {
    expect(() => saveDiary('2026-10-08', { title: '', body: '' })).toThrow()
    expect(getDiary('2026-10-08')).toBeNull()
  })

  it('削除するとその日だけ消える', () => {
    saveDiary('2026-10-08', { title: '', body: 'a' })
    saveDiary('2026-10-09', { title: '', body: 'b' })
    deleteDiary('2026-10-08')
    expect(getDiary('2026-10-08')).toBeNull()
    expect(getDiary('2026-10-09').body).toBe('b')
  })

  it('日記を書いた日の一覧を返す', () => {
    saveDiary('2026-10-08', { title: '', body: 'a' })
    saveDiary('2026-10-20', { title: '', body: 'b' })
    expect(getDiaryDates().sort()).toEqual(['2026-10-08', '2026-10-20'])
  })

  it('保存データが壊れていても空として扱う', () => {
    localStorage.setItem('cleandiary.diaries', '{壊れたデータ')
    expect(getDiary('2026-10-08')).toBeNull()
    expect(getDiaryDates()).toEqual([])
  })
})

describe('searchDiaries', () => {
  beforeEach(() => {
    saveDiary('2026-10-01', { title: 'カレー', body: '夕飯を作った' })
    saveDiary('2026-10-05', { title: '', body: '友だちとカレーを食べた' })
    saveDiary('2026-10-03', { title: 'React', body: '勉強した' })
  })

  it('タイトルか本文に含む日記を、新しい日付順で返す', () => {
    const dates = searchDiaries('カレー').map((d) => d.date)
    expect(dates).toEqual(['2026-10-05', '2026-10-01'])
  })

  it('英字の大文字・小文字を区別しない', () => {
    expect(searchDiaries('react').map((d) => d.date)).toEqual(['2026-10-03'])
  })

  it('キーワードの前後の空白は無視する', () => {
    expect(searchDiaries('  勉強 ').map((d) => d.date)).toEqual(['2026-10-03'])
  })

  it('キーワードが空なら何も返さない', () => {
    expect(searchDiaries('')).toEqual([])
    expect(searchDiaries('   ')).toEqual([])
  })

  it('見つからなければ空の配列', () => {
    expect(searchDiaries('旅行')).toEqual([])
  })
})
