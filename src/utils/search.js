// 検索結果の表示に使う関数をまとめたファイル。
// 英字の大文字・小文字は区別しない（diaryStorage の searchDiaries と同じ）

// 本文から、キーワードを含むあたりを切り出す。
// キーワードの前を少し残し、全体が maxLength 文字くらいになるようにする。
// 改行は空白 1 つにまとめる
export function makeSnippet(text, keyword, maxLength = 80) {
  const oneLine = text.replace(/\s+/g, ' ').trim()
  const index = oneLine.toLowerCase().indexOf(keyword.trim().toLowerCase())

  // キーワードの 20 文字前から切り出す。キーワードがなければ先頭から
  const start = index > 20 ? index - 20 : 0
  const end = start + maxLength
  const prefix = start > 0 ? '…' : ''
  const suffix = end < oneLine.length ? '…' : ''
  return prefix + oneLine.slice(start, end) + suffix
}

// 文章を「キーワードの部分」と「それ以外」に分ける。
// 例: splitByKeyword('カレーとカレー', 'カレー')
//   → [{ text: 'カレー', isMatch: true }, { text: 'と', isMatch: false }, { text: 'カレー', isMatch: true }]
export function splitByKeyword(text, keyword) {
  const word = keyword.trim().toLowerCase()
  if (word === '') return [{ text, isMatch: false }]

  const lowerText = text.toLowerCase()
  const parts = []
  let position = 0
  while (position < text.length) {
    const index = lowerText.indexOf(word, position)
    if (index === -1) {
      parts.push({ text: text.slice(position), isMatch: false })
      break
    }
    if (index > position) {
      parts.push({ text: text.slice(position, index), isMatch: false })
    }
    parts.push({ text: text.slice(index, index + word.length), isMatch: true })
    position = index + word.length
  }
  return parts
}
