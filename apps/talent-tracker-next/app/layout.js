import "./globals.css";

export const metadata = {
  title: "Talent Tracker Next",
  description: "Next.js candidate list and detail pages",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
