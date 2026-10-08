// URL と画面の対応表。
// 日付は「2026-10-08」の形で URL に入れる。
import { Navigate } from 'react-router'
import Layout from './components/Layout.jsx'
import CalendarPage from './pages/CalendarPage.jsx'
import DiaryEditPage from './pages/DiaryEditPage.jsx'
import DiaryViewPage from './pages/DiaryViewPage.jsx'
import SearchPage from './pages/SearchPage.jsx'

export const routes = [
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <CalendarPage /> },
      { path: 'diary/:date', element: <DiaryViewPage /> },
      { path: 'diary/:date/edit', element: <DiaryEditPage /> },
      { path: 'search', element: <SearchPage /> },
      // どれにも当てはまらない URL はカレンダーに戻す
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
]
