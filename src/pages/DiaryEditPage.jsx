import { Link, useParams } from 'react-router'

// 日記編集画面。入力欄と保存はステップ5で作る
function DiaryEditPage() {
  const { date } = useParams()

  return (
    <section>
      <h1>{date} の日記を編集</h1>
      <ul>
        <li>
          <Link to={`/diary/${date}`}>表示に戻る</Link>
        </li>
      </ul>
    </section>
  )
}

export default DiaryEditPage
