"use client";

import { useEffect, useMemo, useState } from "react";

function timeAgoFromSeconds(seconds, language) {
  const isAr = language === "ar";
  if (seconds < 60) return isAr ? "الآن" : "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return isAr ? `قبل ${minutes} دقيقة` : `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return isAr ? `قبل ${hours} ساعة` : `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return isAr ? `قبل ${days} يوم` : `${days}d ago`;
}

// Client-only relative time to avoid SSR mismatch (time passes between SSR and hydration).
export function ClientOnlyTimeAgo({ date, language = "en" }) {
  const [label, setLabel] = useState(null);

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
      setLabel(null);
      return;
    }

    const update = () => {
      const seconds = Math.floor((Date.now() - safeDate.getTime()) / 1000);
      setLabel(timeAgoFromSeconds(Math.max(0, seconds), language));
    };

    update();
    const id = setInterval(update, 30 * 1000);
    return () => clearInterval(id);
  }, [safeDate, language]);

  if (label === null) return null;
  return <>{label}</>;
}
