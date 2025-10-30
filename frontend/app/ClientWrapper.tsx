"use client";

import LayoutWrapper from "./LayoutWrapper";


export default function ClientLayout({ children, token }: { children: React.ReactNode, token: string | null }) {
  return <LayoutWrapper token={token}>{children}</LayoutWrapper>;
}
