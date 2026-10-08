import { Link, useNavigate, useParams } from 'react-router'
import DiaryForm from '../components/DiaryForm.jsx'
import { getDiary, saveDiary } from '../storage/diaryStorage.js'
import { formatDateJa, isValidDateKey } from '../utils/date.js'

// 日記編集画面。日記がない日は新しく書き、ある日は書き直す
function DiaryEditPage() {
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

  const diary = getDiary(date)

  function handleSave(values) {
    saveDiary(date, values)
    // 保存したら表示画面へ。「戻る」で編集画面に戻らないよう、履歴を置き換える。
    // 保存済みなので、未保存の警告は出さない
    navigate(`/diary/${date}`, { replace: true, state: { skipUnsavedWarning: true } })
  }

  function handleCancel() {
    // 書き直しなら表示画面へ、新しく書いていたならその月のカレンダーへ戻る
    navigate(diary ? `/diary/${date}` : `/?month=${date.slice(0, 7)}`)
  }

  return (
    <section>
      <h1>
        {formatDateJa(date)}の日記を{diary ? '編集' : '書く'}
      </h1>
      {/* key に日付を入れて、日付が変わったら入力欄を作り直す */}
      <DiaryForm
        key={date}
        initialTitle={diary?.title ?? ''}
        initialBody={diary?.body ?? ''}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    </section>
  )
}

export default DiaryEditPage
