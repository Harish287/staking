import ReduxProvider from "../store/Provider"; // Adjust path as needed
import "./globals.css"; // Ensure global styles are applied

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body >
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
}
