// lib/date.ts
import { toJalaali, toGregorian } from "jalaali-js";

export function toShamsi(dateStr: string): string {
  const d = new Date(dateStr);
  const { jy, jm, jd } = toJalaali(
    d.getFullYear(),
    d.getMonth() + 1,
    d.getDate(),
  );

  const months = [
    "فروردین",
    "اردیبهشت",
    "خرداد",
    "تیر",
    "مرداد",
    "شهریور",
    "مهر",
    "آبان",
    "آذر",
    "دی",
    "بهمن",
    "اسفند",
  ];

  return `${jd} ${months[jm - 1]} ${jy}`;
}
