"use client";

import { usePathname } from "next/navigation";
import Footer from "../components/Footer";
import Navbar from "@/components/Navbar";

export default function LayoutWrapper({ children, token }: { children: React.ReactNode; token: string | null }) {
  const pathname = usePathname();
  const hideNavbar = ["/login", "/register"];

  return (
    <>
      {!hideNavbar.includes(pathname) && <Navbar token={token} />}
      {children}
      {!hideNavbar.includes(pathname) && <Footer />}
    </>
  );
}
