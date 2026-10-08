import { Link, useSearchParams } from 'react-router'
import SearchResultItem from '../components/SearchResultItem.jsx'
import { searchDiaries } from '../storage/diaryStorage.js'

// 検索結果画面。キーワードは URL の「?q=」で受け取る。
// タイトルか本文にキーワードを含む日記を、新しい日付順に並べる
function SearchPage() {
  const [searchParams] = useSearchParams()
  const keyword = (searchParams.get('q') ?? '').trim()

  if (keyword === '') {
    return (
      <section>
        <h1>検索</h1>
        <p>上の入力欄にキーワードを入力して、検索してください。</p>
        <Link to="/">カレンダーに戻る</Link>
      </section>
    )
  }

  const results = searchDiaries(keyword)

  return (
    <section>
      <h1>「{keyword}」の検索結果</h1>
      {results.length > 0 ? (
        <>
          <p>{results.length}件見つかりました。</p>
          <ul className="search-results">
            {results.map((diary) => (
              <SearchResultItem key={diary.date} diary={diary} keyword={keyword} />
            ))}
          </ul>
        </>
      ) : (
        <p>見つかりませんでした。</p>
      )}
      <Link to="/">カレンダーに戻る</Link>
    </section>
  )
}

export default SearchPage
