import { describe, expect, it } from 'vitest'
import { makeSnippet, splitByKeyword } from './search.js'

describe('makeSnippet', () => {
  it('短い本文はそのまま返す', () => {
    expect(makeSnippet('カレーを作った', 'カレー')).toBe('カレーを作った')
  })

  it('改行は空白 1 つにまとめる', () => {
    expect(makeSnippet('一行目\n\n二行目', '二行目')).toBe('一行目 二行目')
  })

  it('キーワードが後ろのほうにあれば、20 文字前から切り出す', () => {
    const text = 'あ'.repeat(100) + 'カレー' + 'い'.repeat(100)
    const snippet = makeSnippet(text, 'カレー')
    expect(snippet).toBe('…' + 'あ'.repeat(20) + 'カレー' + 'い'.repeat(57) + '…')
  })

  it('キーワードが本文になければ先頭から切り出す', () => {
    const text = 'う'.repeat(100)
    expect(makeSnippet(text, 'カレー')).toBe('う'.repeat(80) + '…')
  })

  it('英字の大文字・小文字を区別せずに探す', () => {
    const text = 'x'.repeat(50) + 'React'
    expect(makeSnippet(text, 'react')).toBe('…' + 'x'.repeat(20) + 'React')
  })
})

describe('splitByKeyword', () => {
  it('キーワードの部分とそれ以外に分ける', () => {
    expect(splitByKeyword('夕飯はカレーとカレー', 'カレー')).toEqual([
      { text: '夕飯は', isMatch: false },
      { text: 'カレー', isMatch: true },
      { text: 'と', isMatch: false },
      { text: 'カレー', isMatch: true },
    ])
  })

  it('大文字・小文字を区別せず、元の文字のまま返す', () => {
    expect(splitByKeyword('I like React', 'react')).toEqual([
      { text: 'I like ', isMatch: false },
      { text: 'React', isMatch: true },
    ])
  })

  it('キーワードがなければ全体を 1 つで返す', () => {
    expect(splitByKeyword('こんにちは', 'カレー')).toEqual([
      { text: 'こんにちは', isMatch: false },
    ])
    expect(splitByKeyword('こんにちは', '')).toEqual([{ text: 'こんにちは', isMatch: false }])
  })
})
