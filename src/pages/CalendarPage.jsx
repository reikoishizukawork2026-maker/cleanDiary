import { Link } from 'react-router'
import { todayKey } from '../utils/date.js'

// カレンダー画面（アプリの起点）。月カレンダーはステップ3で作る
function CalendarPage() {
  const today = todayKey()

  return (
    <section>
      <h1>カレンダー</h1>
      <ul>
        <li>
          <Link to={`/diary/${today}`}>今日の日記を見る</Link>
        </li>
        <li>
          <Link to="/search?q=">検索結果</Link>
        </li>
      </ul>
    </section>
  )
}

export default CalendarPage
