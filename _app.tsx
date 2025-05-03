import React from 'react'
import { Provider } from 'react-redux'
import { store } from './store/store'
import ProtectedRoute from './app/ProtectedRoute'
// import { Toaster } from './components/ui/sonner'
import { Toaster } from 'react-hot-toast'

export default function MyApp({ Component, pageProps }: any) {
  return (
    <ProtectedRoute>
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          style: {
            background: '#333',
            color: '#fff',
          },
          success: {
            iconTheme: {
              primary: 'green',
              secondary: 'white',
            },
          },
          error: {
            iconTheme: {
              primary: 'red',
              secondary: 'white',
            },
          },
        }}
      />

      <Provider store={store}>
        <Component {...pageProps} />
      </Provider>
    </ProtectedRoute>
  )
}
