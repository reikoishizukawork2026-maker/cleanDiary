import { Link, useParams } from 'react-router'

// 日記表示画面。日記の中身と削除はステップ4で作る
function DiaryViewPage() {
  const { date } = useParams()

  return (
    <section>
      <h1>{date} の日記</h1>
      <ul>
        <li>
          <Link to={`/diary/${date}/edit`}>編集する</Link>
        </li>
        <li>
          {/* この日記の月のカレンダーに戻る */}
          <Link to={`/?month=${date.slice(0, 7)}`}>カレンダーに戻る</Link>
        </li>
      </ul>
    </section>
  )
}

export default DiaryViewPage
