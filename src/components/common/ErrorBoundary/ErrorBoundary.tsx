import { Component } from 'react'
import type { ErrorInfo, ReactNode } from 'react'
import { Result, Button } from 'antd'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}

/**
 * Last-resort catch for render errors anywhere in the tree.
 * Router-level errors are handled by RouteError; this guards
 * everything outside the router (providers, theme, etc.).
 */
class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (import.meta.env.DEV) {
      console.error('[FOMP] Uncaught render error:', error, info)
    }
  }

  handleReload = () => {
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#f8fafc',
          }}
        >
          <Result
            status="error"
            title="Something went wrong"
            subTitle="An unexpected error occurred. Reload the page to continue — if it keeps happening, contact your administrator."
            extra={
              <Button type="primary" onClick={this.handleReload}>
                Reload Page
              </Button>
            }
          />
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
