import { formatDateTime } from '../utils/date.js'

// 1 件の日記の中身（タイトル・本文・作成日時・更新日時）を表示する部品
function DiaryDetail({ diary }) {
  return (
    <article className="diary-detail">
      <h2 className={diary.title ? 'diary-title' : 'diary-title is-empty'}>
        {diary.title || '（タイトルなし）'}
      </h2>
      {/* 改行をそのまま表示するため、CSS で white-space: pre-wrap にしている */}
      <p className="diary-body">{diary.body}</p>
      <dl className="diary-timestamps">
        <dt>作成</dt>
        <dd>{formatDateTime(diary.createdAt)}</dd>
        <dt>更新</dt>
        <dd>{formatDateTime(diary.updatedAt)}</dd>
      </dl>
    </article>
  )
}

export default DiaryDetail
