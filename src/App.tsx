import { useMemo } from 'react'
import { RouterProvider } from 'react-router-dom'
import { ConfigProvider, App as AntApp } from 'antd'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { getFompTheme } from '@/theme/antd.theme'
import { usePreferencesStore } from '@/store/preferences.store'
import { ErrorBoundary } from '@/components/common'
import router from '@/router'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    },
  },
})

const App = () => {
  const textScale = usePreferencesStore((s) => s.textScale)
  const theme = useMemo(() => getFompTheme(textScale), [textScale])

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ConfigProvider theme={theme}>
          <AntApp>
            <RouterProvider router={router} />
          </AntApp>
        </ConfigProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  )
}

export default App