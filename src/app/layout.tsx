import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./Provider";

export const metadata: Metadata = {
  title: "Discipline Management",
  description: "Quản lý danh mục trong hệ thống",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}