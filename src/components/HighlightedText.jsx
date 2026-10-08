import { splitByKeyword } from '../utils/search.js'

// 文章の中のキーワードを <mark> で目立たせて表示する部品
function HighlightedText({ text, keyword }) {
  return splitByKeyword(text, keyword).map((part, index) =>
    part.isMatch ? <mark key={index}>{part.text}</mark> : part.text,
  )
}

export default HighlightedText
