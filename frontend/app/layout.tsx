import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientLayout from "./ClientWrapper";
import { cookies } from "next/headers";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | Belajaain",
    default: "Belajaain - Tempat Barang Berkualitas", // This will be used when no title is provided
  },
  description: "Your one-stop shop for high-quality digital products",
};
// import { Metadata } from 'next'

// export const metadata: Metadata = {
//   title: 'Products', // Will become "Products | StoreName"
// } contoh penggunaan

export default async function RootLayout(
  {
  
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookitStore = await cookies()
  const token = cookitStore.get("token")?.value || null;
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClientLayout token={token}>{children}</ClientLayout>
      </body>
    </html>
  );
}
