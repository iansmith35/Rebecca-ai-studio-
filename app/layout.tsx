import './globals.css'

export const metadata = {
  title: 'Rebecca AI Studio - Business Empire HQ',
  description: 'Your Autonomous Business Empire Management System',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}