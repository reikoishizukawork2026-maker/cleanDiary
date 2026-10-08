import { Link, Outlet } from 'react-router'

// すべての画面に共通する枠。上にアプリ名を出し、その下に各画面を表示する
function Layout() {
  return (
    <>
      <header className="app-header">
        <Link to="/" className="app-title">
          cleandiary
        </Link>
      </header>
      <main>
        <Outlet />
      </main>
    </>
  )
}

export default Layout
