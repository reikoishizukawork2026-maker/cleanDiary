import { useState } from 'react'
import { useNavigate } from 'react-router'

// キーワードの入力欄。検索すると検索結果画面「/search?q=キーワード」へ移る
function SearchBox({ initialKeyword }) {
  const [keyword, setKeyword] = useState(initialKeyword)
  const navigate = useNavigate()

  function handleSubmit(event) {
    event.preventDefault()
    // URL に入れられない文字（& や # など）があっても大丈夫なように、エンコードする
    navigate(`/search?q=${encodeURIComponent(keyword.trim())}`)
  }

  return (
    <form role="search" className="search-box" onSubmit={handleSubmit}>
      <input
        type="search"
        value={keyword}
        onChange={(event) => setKeyword(event.target.value)}
        placeholder="キーワードで検索"
        aria-label="検索キーワード"
      />
      <button type="submit" className="button">
        検索
      </button>
    </form>
  )
}

export default SearchBox
