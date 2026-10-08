// 日記を localStorage に読み書きする関数をまとめたファイル。
// すべての日記を 1 つのキーに、日付キーをキーにしたオブジェクトとして保存する。
// 例: { "2026-10-08": { date, title, body, createdAt, updatedAt }, ... }

const STORAGE_KEY = 'cleandiary.diaries'

export const TITLE_MAX_LENGTH = 50
export const BODY_MAX_LENGTH = 5000

function loadAll() {
  const json = localStorage.getItem(STORAGE_KEY)
  if (!json) return {}
  try {
    return JSON.parse(json)
  } catch {
    // 壊れたデータが入っていたときは、空として扱う
    return {}
  }
}

function saveAll(diaries) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(diaries))
}

// 入力内容をチェックし、問題のある項目のメッセージを返す。問題がなければ空のオブジェクト
export function validateDiary({ title, body }) {
  const errors = {}
  if (title.length > TITLE_MAX_LENGTH) {
    errors.title = `タイトルは${TITLE_MAX_LENGTH}文字以内で入力してください`
  }
  if (body.trim() === '') {
    errors.body = '本文を入力してください'
  } else if (body.length > BODY_MAX_LENGTH) {
    errors.body = `本文は${BODY_MAX_LENGTH.toLocaleString()}文字以内で入力してください`
  }
  return errors
}

// 指定した日の日記を返す。なければ null
export function getDiary(dateKey) {
  return loadAll()[dateKey] ?? null
}

// 指定した日の日記を保存し、保存した日記を返す。
// 新しく書いたときは作成日時を記録し、更新日時は毎回記録する
export function saveDiary(dateKey, { title, body }) {
  const errors = validateDiary({ title, body })
  if (Object.keys(errors).length > 0) {
    throw new Error(Object.values(errors).join('\n'))
  }

  const diaries = loadAll()
  const now = new Date().toISOString()
  const diary = {
    date: dateKey,
    title,
    body,
    createdAt: diaries[dateKey]?.createdAt ?? now,
    updatedAt: now,
  }
  diaries[dateKey] = diary
  saveAll(diaries)
  return diary
}

// 指定した日の日記を削除する
export function deleteDiary(dateKey) {
  const diaries = loadAll()
  delete diaries[dateKey]
  saveAll(diaries)
}

// 日記を書いた日の日付キーの一覧（カレンダーの印に使う）
export function getDiaryDates() {
  return Object.keys(loadAll())
}

// タイトルか本文にキーワードを含む日記を、新しい日付順で返す。
// 英字の大文字・小文字は区別しない。キーワードが空なら空の配列
export function searchDiaries(keyword) {
  const word = keyword.trim().toLowerCase()
  if (word === '') return []

  return Object.values(loadAll())
    .filter(
      (diary) =>
        diary.title.toLowerCase().includes(word) || diary.body.toLowerCase().includes(word),
    )
    .sort((a, b) => b.date.localeCompare(a.date))
}
