import { useEffect, useState } from 'react';
import { ExternalLink, MapPin } from 'lucide-react';
import { BAKR_CONTACT } from '../data/menuData';

export const DEFAULT_BAKR_ADDRESS =
  'Taman Cilegon Indah Cluster Helikonia C4 No.9, Sukmajaya, Jombang, Cilegon, Banten 42422';

const MAPS_EMBED_QUERY = `BAKR Smoke, ${DEFAULT_BAKR_ADDRESS}`;
const MAPS_EMBED_URL = `https://www.google.com/maps?q=${encodeURIComponent(
  MAPS_EMBED_QUERY,
)}&output=embed`;

export function BakrLocationMap() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(() =>
    typeof navigator !== 'undefined' ? !navigator.onLine : false,
  );

  useEffect(() => {
    const handleOnline = () => setHasError(false);
    const handleOffline = () => setHasError(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div className="flex w-full flex-col overflow-hidden rounded-[4px] border border-white/25 bg-white text-[#161211] shadow-xl">
      {/* Header Kartu & Alamat */}
      <div className="flex items-start gap-3.5 p-4 sm:p-5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[2px] bg-[#d9291a] text-white">
          <MapPin className="h-5 w-5" aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-mono-ui text-[10px] font-bold uppercase tracking-[0.14em] text-[#d9291a]">
            Titik Lokasi Google Maps
          </p>
          <h3 className="mt-0.5 font-display italic text-base sm:text-lg font-extrabold uppercase tracking-tight text-[#161211]">
            BAKR SMOKE · CILEGON
          </h3>
          <p className="mt-1 text-xs sm:text-sm leading-relaxed text-[#5a5250]">
            {DEFAULT_BAKR_ADDRESS}
          </p>
        </div>
      </div>

      {/* Peta Google Maps Embed (tanpa API Key) di antara alamat & tombol */}
      <div className="relative h-[300px] min-h-[300px] w-full border-y border-[#e8e1df] bg-[#faf7f6] sm:h-[320px]">
        {!hasError ? (
          <>
            {!isLoaded && (
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-2 p-4 text-center">
                <div
                  aria-hidden="true"
                  className="dot-pattern-red pointer-events-none absolute inset-0 opacity-45"
                />
                <span className="relative z-10 font-mono-ui text-[10px] font-bold uppercase tracking-[0.12em] text-[#d9291a]">
                  Memuat Peta Lokasi...
                </span>
              </div>
            )}
            <iframe
              src={MAPS_EMBED_URL}
              title="Peta Lokasi BAKR Smoke · Cilegon di Google Maps"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
              onLoad={() => setIsLoaded(true)}
              onError={() => setHasError(true)}
              className="relative z-10 block h-full min-h-[300px] w-full border-0"
            />
          </>
        ) : (
          <div className="relative flex h-full w-full flex-col items-center justify-center p-6 text-center">
            <div
              aria-hidden="true"
              className="dot-pattern-red pointer-events-none absolute inset-0 opacity-45"
            />
            <div className="relative z-10 max-w-xs">
              <p className="font-mono-ui text-[10px] font-bold uppercase tracking-[0.12em] text-[#d9291a]">
                Peta Tidak Dapat Dimuat
              </p>
              <p className="mt-1.5 text-xs leading-relaxed text-[#5a5250]">
                Koneksi sedang terbatas. Gunakan tombol di bawah untuk membuka titik lokasi langsung
                di aplikasi Google Maps.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer Kartu & Tombol Buka di Google Maps */}
      <div className="flex flex-col gap-3 bg-white p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <span className="font-mono-ui text-[10px] font-bold uppercase tracking-[0.08em] text-[#5a5250]">
          Zoom &amp; geser peta langsung di sini
        </span>
        <a
          href={BAKR_CONTACT.mapsShareUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-[2px] bg-[#d9291a] px-4 py-2.5 font-mono-ui text-[11px] font-bold uppercase tracking-[0.06em] text-white whitespace-nowrap shrink-0 hover:bg-[#b81f12] transition-colors"
        >
          <span>Buka di Google Maps</span>
          <ExternalLink className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        </a>
      </div>
    </div>
  );
}
