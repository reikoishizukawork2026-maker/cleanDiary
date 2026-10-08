import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from './App.jsx'

describe('App', () => {
  it('アプリ名を表示する', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'cleandiary' })).toBeInTheDocument()
  })
})
