export const metadata = { title: "Rebecca Studio" };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ background: "#000", color: "#e5e7eb", margin: 0, fontFamily: "system-ui" }}>
        {children}
      </body>
    </html>
  );
}