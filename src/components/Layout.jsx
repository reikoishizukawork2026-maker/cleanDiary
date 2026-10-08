import { Link, Outlet, useLocation, useSearchParams } from 'react-router'
import SearchBox from './SearchBox.jsx'

// すべての画面に共通する枠。上にアプリ名と検索欄を出し、その下に各画面を表示する
function Layout() {
  const { pathname } = useLocation()
  const [searchParams] = useSearchParams()
  // 検索結果画面では、検索したキーワードを入力欄に残す
  const keyword = pathname === '/search' ? (searchParams.get('q') ?? '') : ''

  return (
    <>
      <header className="app-header">
        <div className="app-header-inner">
          <Link to="/" className="app-title">
            cleandiary
          </Link>
          {/* key にキーワードを入れて、キーワードが変わったら入力欄を作り直す */}
          <SearchBox key={keyword} initialKeyword={keyword} />
        </div>
      </header>
      <main>
        <Outlet />
      </main>
    </>
  )
}

export default Layout
