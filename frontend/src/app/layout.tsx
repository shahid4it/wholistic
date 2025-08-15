import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";
import "./styles/styles.scss";

import Main from "./components/main";

const inter = Inter({
  subsets: ["latin"], // required
  weight: ["300", "400", "500", "700"], // optional: choose your weights
  display: "swap", // optional: reduces layout shift
});

export const metadata: Metadata = {
  title: "Wholistic",
  description: "Your companion in your journey to wholeness",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Main>{children}</Main>
      </body>
    </html>
  );
}
