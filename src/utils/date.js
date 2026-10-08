// 日付を扱う関数をまとめたファイル。
// 日記は「2026-10-08」のような文字列（日付キー）で管理する。
// 時刻のずれを避けるため、すべてブラウザのローカル時刻で計算する。

const DATE_KEY_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/

function pad2(number) {
  return String(number).padStart(2, '0')
}

// Date を「YYYY-MM-DD」の文字列にする
export function toDateKey(date) {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`
}

// 「YYYY-MM-DD」が実在する日付かどうか（2026-02-30 などは false）
export function isValidDateKey(dateKey) {
  const match = DATE_KEY_PATTERN.exec(dateKey)
  if (!match) return false
  const [, year, month, day] = match.map(Number)
  const date = new Date(year, month - 1, day)
  return (
    date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day
  )
}

// 「YYYY-MM-DD」を Date にする
export function parseDateKey(dateKey) {
  const [year, month, day] = dateKey.split('-').map(Number)
  return new Date(year, month - 1, day)
}

// 今日の日付キー
export function todayKey() {
  return toDateKey(new Date())
}

// 年月を diff か月ずらす。month は 1〜12
export function shiftMonth(year, month, diff) {
  const date = new Date(year, month - 1 + diff, 1)
  return { year: date.getFullYear(), month: date.getMonth() + 1 }
}

// 月カレンダーに並べる日付を、週ごとの配列で返す。週は月曜日始まり。
// 前後の月の日付も含めて、どの週も 7 日そろえる。
// 例: [[{ dateKey: '2026-09-28', day: 28, isCurrentMonth: false }, ...], ...]
export function getCalendarWeeks(year, month) {
  const firstDay = new Date(year, month - 1, 1)
  // getDay() は日曜 0〜土曜 6。月曜を 0 にそろえる
  const daysBeforeFirst = (firstDay.getDay() + 6) % 7
  const daysInMonth = new Date(year, month, 0).getDate()
  const totalDays = Math.ceil((daysBeforeFirst + daysInMonth) / 7) * 7

  const weeks = []
  for (let i = 0; i < totalDays; i++) {
    const date = new Date(year, month - 1, 1 - daysBeforeFirst + i)
    if (i % 7 === 0) weeks.push([])
    weeks[weeks.length - 1].push({
      dateKey: toDateKey(date),
      day: date.getDate(),
      isCurrentMonth: date.getMonth() === month - 1,
    })
  }
  return weeks
}

// 年月を「YYYY-MM」の文字列にする（カレンダーの URL「/?month=2026-10」に使う）
export function toMonthKey(year, month) {
  return `${year}-${pad2(month)}`
}

// 「YYYY-MM」を { year, month } にする。形式が正しくなければ null
export function parseMonthKey(monthKey) {
  const match = /^(\d{4})-(\d{2})$/.exec(monthKey ?? '')
  if (!match) return null
  const year = Number(match[1])
  const month = Number(match[2])
  if (month < 1 || month > 12) return null
  return { year, month }
}

const WEEKDAY_NAMES = ['日', '月', '火', '水', '木', '金', '土']

// 日付キーを「2026年10月8日（木）」の形にする（画面の見出しに使う）
export function formatDateJa(dateKey) {
  const date = parseDateKey(dateKey)
  const weekday = WEEKDAY_NAMES[date.getDay()]
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日（${weekday}）`
}

// 保存した日時（ISO 形式の文字列）を「2026/10/08 14:05」の形にする
export function formatDateTime(isoString) {
  const date = new Date(isoString)
  const time = `${pad2(date.getHours())}:${pad2(date.getMinutes())}`
  return `${toDateKey(date).replaceAll('-', '/')} ${time}`
}
