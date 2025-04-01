import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { useContext } from 'react'
import SessionContextProvider, { SessionContext, useSessionContext } from '../SessionContext'

// Test component that consumes the context
const TestConsumer = () => {
  const { gameStats, queueingPlayers, isQueueing, isInstantQueue } = useSessionContext()

  return (
    <div>
      <div data-testid="game-type">{gameStats.type}</div>
      <div data-testid="game-counter">{gameStats.counter}</div>
      <div data-testid="queueing-players">{queueingPlayers.join(',')}</div>
      <div data-testid="is-queueing">{isQueueing.toString()}</div>
      <div data-testid="is-instant-queue">{isInstantQueue.toString()}</div>
    </div>
  )
}

// Test component that directly accesses the context
const DirectConsumer = () => {
  const context = useContext(SessionContext)

  if (!context) {
    return <div>No context</div>
  }

  return <div data-testid="has-context">Context exists</div>
}

describe('SessionContext', () => {
  it('provides default values', () => {
    render(
      <SessionContextProvider>
        <TestConsumer />
      </SessionContextProvider>
    )

    expect(screen.getByTestId('game-type')).toHaveTextContent('Ночь')
    expect(screen.getByTestId('game-counter')).toHaveTextContent('0')
    expect(screen.getByTestId('queueing-players')).toHaveTextContent('')
    expect(screen.getByTestId('is-queueing')).toHaveTextContent('false')
    expect(screen.getByTestId('is-instant-queue')).toHaveTextContent('false')
  })

  it('makes context available to consumers', () => {
    render(
      <SessionContextProvider>
        <DirectConsumer />
      </SessionContextProvider>
    )

    expect(screen.getByTestId('has-context')).toBeInTheDocument()
  })

  it('throws an error when useSessionContext is used outside provider', () => {
    // We're suppressing the error console to keep test output clean
    // eslint-disable-next-line no-console
    const originalError = console.error
    // eslint-disable-next-line no-console
    console.error = vi.fn()

    expect(() => {
      render(<TestConsumer />)
    }).toThrow('useSessionContext should be consumed within SessionContextProvider')
    // eslint-disable-next-line no-console
    console.error = originalError
  })
})
