import { render } from '@testing-library/react'
import { RouterProvider, createMemoryRouter } from 'react-router'
import { routes } from '../routes.jsx'

// テスト用: 指定した URL からアプリを表示する。
// 本番の HashRouter の代わりに、メモリ上で URL を持つ MemoryRouter を使う
export function renderWithRouter(initialPath) {
  const router = createMemoryRouter(routes, { initialEntries: [initialPath] })
  render(<RouterProvider router={router} />)
  return router
}
