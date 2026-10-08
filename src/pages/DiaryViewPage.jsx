import { Link, useNavigate, useParams } from 'react-router'
import DiaryDetail from '../components/DiaryDetail.jsx'
import { deleteDiary, getDiary } from '../storage/diaryStorage.js'
import { formatDateJa, isValidDateKey } from '../utils/date.js'

// 日記表示画面。URL の日付の日記を表示し、編集・削除ができる
function DiaryViewPage() {
  const { date } = useParams()
  const navigate = useNavigate()

  if (!isValidDateKey(date)) {
    return (
      <section>
        <h1>日付が正しくありません</h1>
        <Link to="/">カレンダーに戻る</Link>
      </section>
    )
  }

  // この日記の月のカレンダーに戻るための URL
  const calendarUrl = `/?month=${date.slice(0, 7)}`
  const diary = getDiary(date)

  function handleDelete() {
    // 消した日記は元に戻せないので、確認してから削除する
    if (!window.confirm(`${formatDateJa(date)}の日記を削除しますか？\nこの操作は元に戻せません。`)) {
      return
    }
    deleteDiary(date)
    // 削除した日記の画面には戻れないよう、履歴を置き換えてカレンダーへ移る
    navigate(calendarUrl, { replace: true })
  }

  return (
    <section>
      <h1>{formatDateJa(date)}</h1>

      {diary ? (
        <>
          <DiaryDetail diary={diary} />
          <div className="actions">
            <Link to={`/diary/${date}/edit`} className="button primary">
              編集する
            </Link>
            <button type="button" className="button danger" onClick={handleDelete}>
              削除する
            </button>
          </div>
        </>
      ) : (
        <>
          <p>この日の日記はまだありません。</p>
          <div className="actions">
            <Link to={`/diary/${date}/edit`} className="button primary">
              日記を書く
            </Link>
          </div>
        </>
      )}

      <p>
        <Link to={calendarUrl}>カレンダーに戻る</Link>
      </p>
    </section>
  )
}

export default DiaryViewPage
