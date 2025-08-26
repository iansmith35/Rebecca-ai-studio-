import './globals.css'

export const metadata = {
  title: 'Rebecca Studio',
  description: 'Private Hard-Coded Setup (ISHE + Personal Hub)',
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