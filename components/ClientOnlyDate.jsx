"use client";

import { useEffect, useMemo, useState } from "react";

// Client-only date formatting to avoid SSR/client timezone/locale hydration mismatches.
export function ClientOnlyDate({ date, locale = "en-US", options }) {
  const [formatted, setFormatted] = useState(null);

  const safeDate = useMemo(() => {
    if (!date) return null;
    try {
      return new Date(date);
    } catch {
      return null;
    }
  }, [date]);

  useEffect(() => {
    if (!safeDate) {
      setFormatted(null);
      return;
    }
    try {
      const fmt = new Intl.DateTimeFormat(locale, options);
      setFormatted(fmt.format(safeDate));
    } catch {
      // Fallback
      try {
        setFormatted(safeDate.toISOString().slice(0, 10));
      } catch {
        setFormatted(null);
      }
    }
  }, [safeDate, locale, options]);

  if (formatted === null) return null;
  return <>{formatted}</>;
}
