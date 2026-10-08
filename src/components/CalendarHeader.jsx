// カレンダーの上に出す「◀ 2026年10月 ▶」の部分。
// 月の切り替えは親（CalendarPage）に任せ、ボタンが押されたことだけを伝える
function CalendarHeader({ year, month, onPrev, onNext, onThisMonth }) {
  return (
    <div className="calendar-header">
      <button type="button" onClick={onPrev} aria-label="前の月">
        ◀
      </button>
      <h1>
        {year}年{month}月
      </h1>
      <button type="button" onClick={onNext} aria-label="次の月">
        ▶
      </button>
      <button type="button" className="this-month-button" onClick={onThisMonth}>
        今月
      </button>
    </div>
  )
}

export default CalendarHeader
