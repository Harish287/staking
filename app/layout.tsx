import ReduxProvider from '../store/Provider' // Adjust path as needed
import './globals.css' // Ensure global styles are applied
import { ToastProvider } from '../components/ui/ToastProvider'; 


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <ToastProvider/>
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  )
}
