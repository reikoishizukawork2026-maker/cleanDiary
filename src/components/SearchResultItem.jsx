import { Link } from 'react-router'
import { formatDateJa } from '../utils/date.js'
import { makeSnippet } from '../utils/search.js'
import HighlightedText from './HighlightedText.jsx'

// 検索結果の 1 件分。日付・タイトル・本文の一部を表示し、クリックで日記表示画面へ移る
function SearchResultItem({ diary, keyword }) {
  return (
    <li className="search-result">
      <Link to={`/diary/${diary.date}`}>
        <span className="search-result-date">{formatDateJa(diary.date)}</span>
        <span className={diary.title ? 'search-result-title' : 'search-result-title is-empty'}>
          {diary.title ? (
            <HighlightedText text={diary.title} keyword={keyword} />
          ) : (
            '（タイトルなし）'
          )}
        </span>
        <span className="search-result-snippet">
          <HighlightedText text={makeSnippet(diary.body, keyword)} keyword={keyword} />
        </span>
      </Link>
    </li>
  )
}

export default SearchResultItem
