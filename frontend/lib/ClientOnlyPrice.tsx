"use client";
import { useEffect, useState } from "react";

export default function PriceClientOnly({ value }: { value: number }) {
  const [formatted, setFormatted] = useState<string>("");

  useEffect(() => {
    setFormatted(value.toLocaleString("id-ID"));
  }, [value]);

  return <>{formatted || value}</>;
}
