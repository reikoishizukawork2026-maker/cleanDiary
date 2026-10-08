import { useEffect } from 'react'
import { useBlocker } from 'react-router'

const MESSAGE = '保存していない内容があります。このページを離れますか？'

// 保存していない変更があるときに、ページを離れる前に確認するフック。
// - アプリ内の画面移動（リンク・戻るボタンなど）: React Router の useBlocker で止めて確認する
// - タブを閉じる・再読み込み: ブラウザの beforeunload イベントで、ブラウザ標準の警告を出す
// shouldWarn が true の間だけ警告する。
// 保存したあとの移動のように、警告せずに移りたいときは
// navigate(url, { state: { skipUnsavedWarning: true } }) で移る
export function useUnsavedChangesWarning(shouldWarn) {
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      shouldWarn &&
      !nextLocation.state?.skipUnsavedWarning &&
      currentLocation.pathname !== nextLocation.pathname,
  )

  useEffect(() => {
    if (blocker.state !== 'blocked') return
    if (window.confirm(MESSAGE)) {
      blocker.proceed()
    } else {
      blocker.reset()
    }
  }, [blocker])

  useEffect(() => {
    if (!shouldWarn) return

    function handleBeforeUnload(event) {
      // ブラウザ標準の「このサイトを離れますか？」を出す（文言はブラウザが決める）
      event.preventDefault()
      event.returnValue = ''
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [shouldWarn])
}
