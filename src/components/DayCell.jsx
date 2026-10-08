import { Link } from 'react-router'

// カレンダーの 1 日分のマス。
// 日記があれば表示画面へ、なければ編集画面（新しく書く）へ移る
function DayCell({ dateKey, day, isCurrentMonth, isToday, hasDiary }) {
  const to = hasDiary ? `/diary/${dateKey}` : `/diary/${dateKey}/edit`

  const classNames = ['day-cell']
  if (!isCurrentMonth) classNames.push('is-other-month')
  if (isToday) classNames.push('is-today')

  return (
    <td>
      <Link
        to={to}
        className={classNames.join(' ')}
        aria-current={isToday ? 'date' : undefined}
        aria-label={`${dateKey}${hasDiary ? '（日記あり）' : ''}`}
      >
        <span className="day-number">{day}</span>
        {hasDiary && <span className="diary-mark" aria-hidden="true" />}
      </Link>
    </td>
  )
}

export default DayCell
