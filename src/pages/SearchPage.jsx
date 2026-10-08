import { Link, useSearchParams } from 'react-router'

// 検索結果画面。キーワードは URL の「?q=」で受け取る。検索はステップ6で作る
function SearchPage() {
  const [searchParams] = useSearchParams()
  const keyword = searchParams.get('q') ?? ''

  return (
    <section>
      <h1>「{keyword}」の検索結果</h1>
      <Link to="/">カレンダーに戻る</Link>
    </section>
  )
}

export default SearchPage
