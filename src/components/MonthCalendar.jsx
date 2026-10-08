import { getCalendarWeeks } from '../utils/date.js'
import DayCell from './DayCell.jsx'

const WEEKDAYS = ['月', '火', '水', '木', '金', '土', '日']

// 月カレンダーの表。週は月曜日始まり。
// diaryDates は日記を書いた日の日付キーの Set
function MonthCalendar({ year, month, today, diaryDates }) {
  const weeks = getCalendarWeeks(year, month)

  return (
    <table className="month-calendar">
      <thead>
        <tr>
          {WEEKDAYS.map((weekday) => (
            <th key={weekday} scope="col">
              {weekday}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {weeks.map((week) => (
          <tr key={week[0].dateKey}>
            {week.map((d) => (
              <DayCell
                key={d.dateKey}
                dateKey={d.dateKey}
                day={d.day}
                isCurrentMonth={d.isCurrentMonth}
                isToday={d.dateKey === today}
                hasDiary={diaryDates.has(d.dateKey)}
              />
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default MonthCalendar
