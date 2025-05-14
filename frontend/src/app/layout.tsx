import type { Metadata } from "next";
import { Inter } from "next/font/google";
import styles from "./layout.module.scss";
import "@/styles/globals.scss";
import "react-toastify/dist/ReactToastify.css";
import "react-tooltip/dist/react-tooltip.css";
import { LayoutContent } from "./layout-content";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Quiz Show",
  description: "Quiz Show",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className={styles.contentBackground}></div>
        <main className={styles.mainWrapper}>
          <LayoutContent>{children}</LayoutContent>
        </main>
      </body>
    </html>
  );
}
