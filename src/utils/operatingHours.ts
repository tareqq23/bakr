import { useEffect, useState } from 'react';

export const BAKR_OPERATING_HOURS = {
  enforceOperatingHours: true,
  openHour: 9,
  openMinute: 0,
  closeHour: 17,
  closeMinute: 0,
  timeZone: 'Asia/Jakarta',
  scheduleText: 'Senin – Minggu, 09.00 – 17.00 WIB',
} as const;

export type OperatingReason = 'open' | 'before-open' | 'after-close';

export interface OperatingHoursStatus {
  isOpen: boolean;
  reason: OperatingReason;
  headline: string;
  message: string;
}

function getJakartaHourMinute(date: Date): { hour: number; minute: number } {
  try {
    const parts = new Intl.DateTimeFormat('en-GB', {
      timeZone: BAKR_OPERATING_HOURS.timeZone,
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
    }).formatToParts(date);

    const hourPart = parts.find((p) => p.type === 'hour')?.value ?? '0';
    const minutePart = parts.find((p) => p.type === 'minute')?.value ?? '0';
    const hour = Number.parseInt(hourPart, 10);
    const minute = Number.parseInt(minutePart, 10);

    if (!Number.isNaN(hour) && !Number.isNaN(minute)) {
      return { hour, minute };
    }
  } catch {
    // Fallback to UTC+7 offset calculation if Intl timezone fails
  }

  const utcMinutes = date.getUTCHours() * 60 + date.getUTCMinutes();
  const wibTotalMinutes = (utcMinutes + 7 * 60) % (24 * 60);
  return {
    hour: Math.floor(wibTotalMinutes / 60),
    minute: wibTotalMinutes % 60,
  };
}

export function getOperatingHoursStatus(now: Date = new Date()): OperatingHoursStatus {
  if (!BAKR_OPERATING_HOURS.enforceOperatingHours) {
    return {
      isOpen: true,
      reason: 'open',
      headline: 'Dapur Sedang Buka',
      message: 'Melayani pesanan setiap hari pukul 09.00 – 17.00 WIB.',
    };
  }

  const { hour, minute } = getJakartaHourMinute(now);
  const currentMinutes = hour * 60 + minute;
  const openMinutes = BAKR_OPERATING_HOURS.openHour * 60 + BAKR_OPERATING_HOURS.openMinute;
  const closeMinutes = BAKR_OPERATING_HOURS.closeHour * 60 + BAKR_OPERATING_HOURS.closeMinute;

  if (currentMinutes >= openMinutes && currentMinutes < closeMinutes) {
    return {
      isOpen: true,
      reason: 'open',
      headline: 'Dapur Sedang Buka',
      message: `Melayani pesanan setiap hari pukul 09.00 – 17.00 WIB.`,
    };
  }

  if (currentMinutes < openMinutes) {
    return {
      isOpen: false,
      reason: 'before-open',
      headline: 'Dapur Belum Buka',
      message:
        'Jam operasional BAKR. dimulai pukul 09.00 – 17.00 WIB. Pesanan baru dapat dibuat mulai pukul 09.00 WIB.',
    };
  }

  return {
    isOpen: false,
    reason: 'after-close',
    headline: 'Jam Operasional Selesai',
    message:
      'Jam operasional hari ini (09.00 – 17.00 WIB) telah selesai. Pesanan baru dapat dibuat kembali besok mulai pukul 09.00 WIB.',
  };
}

export function useOperatingHours(): OperatingHoursStatus {
  const [status, setStatus] = useState<OperatingHoursStatus>(() => getOperatingHoursStatus());

  useEffect(() => {
    const syncStatus = () => {
      const next = getOperatingHoursStatus();
      setStatus((prev) =>
        prev.isOpen === next.isOpen && prev.reason === next.reason ? prev : next,
      );
    };

    syncStatus();
    const intervalId = window.setInterval(syncStatus, 15000);
    window.addEventListener('focus', syncStatus);
    document.addEventListener('visibilitychange', syncStatus);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener('focus', syncStatus);
      document.removeEventListener('visibilitychange', syncStatus);
    };
  }, []);

  return status;
}
