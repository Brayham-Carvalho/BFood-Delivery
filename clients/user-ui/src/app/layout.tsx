import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers/NextUiProvider";
import { Toaster } from "react-hot-toast";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-Poppins",
});

export const metadata: Metadata = {
  title: "BFood Delery",
  description: "BFood Delery website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body className={`${poppins.variable}`}>
        <Providers>{children}</Providers>
        <Toaster position="top-center" reverseOrder={false} />
      </body>
    </html>
  );
}
