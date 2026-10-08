import { useState } from 'react'
import { useUnsavedChangesWarning } from '../hooks/useUnsavedChangesWarning.js'
import { BODY_MAX_LENGTH, TITLE_MAX_LENGTH, validateDiary } from '../storage/diaryStorage.js'

// 日記の入力フォーム（タイトルと本文）。
// 保存・キャンセルしたときの動きは親（DiaryEditPage）に任せる。
// 保存していない変更があれば、ページを離れる前に確認する
function DiaryForm({ initialTitle, initialBody, onSave, onCancel }) {
  const [title, setTitle] = useState(initialTitle)
  const [body, setBody] = useState(initialBody)
  const [errors, setErrors] = useState({})

  const isDirty = title !== initialTitle || body !== initialBody
  useUnsavedChangesWarning(isDirty)

  function handleSubmit(event) {
    event.preventDefault()
    const newErrors = validateDiary({ title, body })
    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) return

    try {
      onSave({ title, body })
    } catch {
      setErrors({ save: '保存できませんでした。ブラウザの保存領域がいっぱいの可能性があります。' })
    }
  }

  return (
    // noValidate: ブラウザ標準のチェックではなく、validateDiary のメッセージを表示する
    <form className="diary-form" onSubmit={handleSubmit} noValidate>
      <div className="form-field">
        <label htmlFor="diary-title">タイトル（任意）</label>
        <input
          id="diary-title"
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          aria-invalid={errors.title ? true : undefined}
          aria-describedby="diary-title-count diary-title-error"
        />
        <CharacterCount id="diary-title-count" length={title.length} max={TITLE_MAX_LENGTH} />
        <ErrorMessage id="diary-title-error" message={errors.title} />
      </div>

      <div className="form-field">
        <label htmlFor="diary-body">本文</label>
        <textarea
          id="diary-body"
          rows={12}
          value={body}
          onChange={(event) => setBody(event.target.value)}
          aria-required="true"
          aria-invalid={errors.body ? true : undefined}
          aria-describedby="diary-body-count diary-body-error"
        />
        <CharacterCount id="diary-body-count" length={body.length} max={BODY_MAX_LENGTH} />
        <ErrorMessage id="diary-body-error" message={errors.body} />
      </div>

      <ErrorMessage message={errors.save} />

      <div className="actions">
        <button type="submit" className="button primary">
          保存する
        </button>
        <button type="button" className="button" onClick={onCancel}>
          キャンセル
        </button>
      </div>
    </form>
  )
}

// 「12 / 50」のような文字数の表示。上限を超えたら赤くする
function CharacterCount({ id, length, max }) {
  const className = length > max ? 'character-count is-over' : 'character-count'
  return (
    <p id={id} className={className}>
      {length.toLocaleString()} / {max.toLocaleString()}
    </p>
  )
}

function ErrorMessage({ id, message }) {
  if (!message) return null
  return (
    <p id={id} className="error-message" role="alert">
      {message}
    </p>
  )
}

export default DiaryForm
