"use client";

import { useEffect, useState } from "react";

export function ClientOnlyYear() {
  const [year, setYear] = useState(null);
  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);
  if (year === null) return null;
  return <>{year}</>;
}
