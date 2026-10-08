import { useSearchParams } from 'react-router'
import CalendarHeader from '../components/CalendarHeader.jsx'
import MonthCalendar from '../components/MonthCalendar.jsx'
import { getDiaryDates } from '../storage/diaryStorage.js'
import { parseMonthKey, shiftMonth, toMonthKey, todayKey } from '../utils/date.js'

// カレンダー画面（アプリの起点）。
// 表示する月は URL の「?month=2026-10」で持つ。日記から戻ったときに同じ月を表示できるようにするため。
// 指定がない・形式が正しくないときは今月を表示する
function CalendarPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const today = todayKey()
  const thisMonth = parseMonthKey(today.slice(0, 7))
  const { year, month } = parseMonthKey(searchParams.get('month')) ?? thisMonth
  const diaryDates = new Set(getDiaryDates())

  function showMonth(target) {
    setSearchParams({ month: toMonthKey(target.year, target.month) })
  }

  return (
    <section>
      <CalendarHeader
        year={year}
        month={month}
        onPrev={() => showMonth(shiftMonth(year, month, -1))}
        onNext={() => showMonth(shiftMonth(year, month, 1))}
        onThisMonth={() => showMonth(thisMonth)}
      />
      <MonthCalendar year={year} month={month} today={today} diaryDates={diaryDates} />
    </section>
  )
}

export default CalendarPage
