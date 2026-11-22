import { useCallback, useEffect, useState } from 'react';
import {
  APILoadingStatus,
  APIProvider,
  AdvancedMarker,
  InfoWindow,
  Map as GoogleMap,
  Pin,
  useAdvancedMarkerRef,
  useApiLoadingStatus,
  useMap,
  useMapsLibrary,
} from '@vis.gl/react-google-maps';
import { ExternalLink, MapPin, Navigation } from 'lucide-react';
import { BAKR_CONTACT } from '../data/menuData';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
export const DEFAULT_BAKR_ADDRESS =
  'Taman Cilegon Indah Cluster Helikonia C4 No.9, Sukmajaya, Jombang, Cilegon, Banten 42422';

export interface ResolvedPlace {
  displayName: string;
  formattedAddress: string;
  location: google.maps.LatLngLiteral;
  mapsUri: string;
}

interface LocationMapFallbackProps {
  address: string;
  isLoading?: boolean;
}

function LocationMapFallback({ address, isLoading = false }: LocationMapFallbackProps) {
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center bg-white p-4 sm:p-6 text-center text-[#161211]">
      <div
        aria-hidden="true"
        className="dot-pattern-red pointer-events-none absolute inset-0 opacity-45"
      />
      <div className="relative z-10 max-w-sm rounded-[4px] border border-[#e8e1df] bg-white p-4 sm:p-5 shadow-sm">
        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-[2px] bg-[#d9291a] text-white">
          <MapPin className="h-5 w-5" aria-hidden="true" />
        </div>
        <p className="mt-3 font-mono-ui text-[10px] font-bold uppercase tracking-[0.14em] text-[#d9291a]">
          {isLoading ? 'Memuat Peta Lokasi...' : 'Titik Lokasi Google Maps'}
        </p>
        <h3 className="mt-1 font-display italic text-base font-extrabold uppercase tracking-tight text-[#161211]">
          BAKR Smoke · Cilegon
        </h3>
        <p className="mt-1.5 text-xs leading-relaxed text-[#5a5250]">{address}</p>
        <a
          href={BAKR_CONTACT.mapsShareUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center justify-center gap-2 rounded-[2px] bg-[#d9291a] px-4 py-2 font-mono-ui text-[11px] font-bold uppercase tracking-[0.06em] text-white hover:bg-[#b81f12] transition-colors"
        >
          <span>Buka di Google Maps</span>
          <ExternalLink className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        </a>
      </div>
    </div>
  );
}

interface InteractiveMapCanvasProps {
  onPlaceResolved: (place: ResolvedPlace) => void;
}

function InteractiveMapCanvas({ onPlaceResolved }: InteractiveMapCanvasProps) {
  const status = useApiLoadingStatus();
  const placesLib = useMapsLibrary('places');
  const map = useMap();
  const [markerRef, marker] = useAdvancedMarkerRef();

  const [resolvedPlace, setResolvedPlace] = useState<ResolvedPlace | null>(null);
  const [lookupError, setLookupError] = useState(false);
  const [infoOpen, setInfoOpen] = useState(true);

  useEffect(() => {
    if (status === APILoadingStatus.AUTH_FAILURE || status === APILoadingStatus.FAILED) {
      if (status === APILoadingStatus.AUTH_FAILURE) {
        window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
      }
      setLookupError(true);
    }
  }, [status]);

  useEffect(() => {
    if (!placesLib || resolvedPlace || lookupError) return;

    let cancelled = false;

    const findBakrLocation = async () => {
      try {
        const request: google.maps.places.SearchByTextRequest = {
          textQuery: BAKR_CONTACT.mapsSearchQuery,
          fields: ['displayName', 'formattedAddress', 'location', 'googleMapsURI'],
          language: 'id',
          region: 'id',
          maxResultCount: 1,
        };

        const { places } = await placesLib.Place.searchByText(request);
        if (cancelled) return;

        const match = places?.[0];
        if (match?.location) {
          const lat =
            typeof match.location.lat === 'function'
              ? match.location.lat()
              : (match.location as unknown as google.maps.LatLngLiteral).lat;
          const lng =
            typeof match.location.lng === 'function'
              ? match.location.lng()
              : (match.location as unknown as google.maps.LatLngLiteral).lng;

          const resolved: ResolvedPlace = {
            displayName: match.displayName || 'BAKR Smoke',
            formattedAddress: match.formattedAddress || DEFAULT_BAKR_ADDRESS,
            location: { lat, lng },
            mapsUri: match.googleMapsURI || BAKR_CONTACT.mapsShareUrl,
          };

          setResolvedPlace(resolved);
          onPlaceResolved(resolved);
        } else {
          setLookupError(true);
        }
      } catch (err) {
        if (cancelled) return;
        const message = err instanceof Error ? err.message : String(err);
        if (
          message.includes('OVER_QUERY_LIMIT') ||
          message.includes('RESOURCE_EXHAUSTED') ||
          message.includes('Quota') ||
          message.includes('429')
        ) {
          window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
        }
        setLookupError(true);
      }
    };

    void findBakrLocation();

    return () => {
      cancelled = true;
    };
  }, [placesLib, resolvedPlace, lookupError, onPlaceResolved]);

  const handleRecenter = useCallback(() => {
    if (!map || !resolvedPlace) return;
    map.panTo(resolvedPlace.location);
    map.setZoom(16);
    setInfoOpen(true);
  }, [map, resolvedPlace]);

  if (lookupError || status === APILoadingStatus.FAILED || status === APILoadingStatus.AUTH_FAILURE) {
    return <LocationMapFallback address={DEFAULT_BAKR_ADDRESS} />;
  }

  if (!resolvedPlace) {
    return <LocationMapFallback address={DEFAULT_BAKR_ADDRESS} isLoading />;
  }

  return (
    <div className="relative h-full w-full">
      <GoogleMap
        mapId="DEMO_MAP_ID"
        defaultCenter={resolvedPlace.location}
        center={resolvedPlace.location}
        defaultZoom={16}
        gestureHandling="cooperative"
        mapTypeControl={false}
        streetViewControl={false}
        internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
        className="h-full w-full"
      >
        <AdvancedMarker
          ref={markerRef}
          position={resolvedPlace.location}
          title={resolvedPlace.displayName}
          onClick={() => setInfoOpen((prev) => !prev)}
        >
          <Pin background="#d9291a" borderColor="#991b11" glyphColor="#ffffff" scale={1.15} />
        </AdvancedMarker>

        {infoOpen && marker && (
          <InfoWindow
            anchor={marker}
            maxWidth={250}
            onCloseClick={() => setInfoOpen(false)}
          >
            <div className="p-1 text-[#161211]">
              <p className="font-mono-ui text-[10px] font-bold uppercase tracking-[0.08em] text-[#d9291a]">
                Titik Dapur BAKR.
              </p>
              <p className="mt-0.5 text-sm font-extrabold uppercase tracking-tight">
                {resolvedPlace.displayName}
              </p>
              <p className="mt-1 text-xs leading-snug text-[#5a5250]">
                {resolvedPlace.formattedAddress}
              </p>
              <a
                href={BAKR_CONTACT.mapsShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-1 font-mono-ui text-[11px] font-bold uppercase text-[#d9291a] hover:underline"
              >
                <span>Petunjuk Arah</span>
                <ExternalLink className="h-3 w-3" aria-hidden="true" />
              </a>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>

      <button
        type="button"
        onClick={handleRecenter}
        className="absolute bottom-3 left-3 z-10 inline-flex items-center gap-1.5 rounded-[2px] border border-[#e8e1df] bg-white px-3 py-2 font-mono-ui text-[10px] font-bold uppercase tracking-[0.06em] text-[#161211] shadow-md hover:border-[#d9291a] hover:text-[#d9291a] cursor-pointer transition-colors"
      >
        <Navigation className="h-3 w-3 text-[#d9291a]" aria-hidden="true" />
        <span>Pusatkan Pin</span>
      </button>
    </div>
  );
}

interface BakrLocationMapProps {
  onPlaceResolved: (place: ResolvedPlace) => void;
}

export function BakrLocationMap({ onPlaceResolved }: BakrLocationMapProps) {
  return (
    <div className="h-[280px] w-full overflow-hidden rounded-[4px] border border-white/25 bg-white shadow-xl sm:h-[320px] lg:h-[380px]">
      {GOOGLE_MAPS_API_KEY ? (
        <APIProvider
          apiKey={GOOGLE_MAPS_API_KEY}
          language="id"
          region="ID"
          libraries={['places', 'marker']}
        >
          <InteractiveMapCanvas onPlaceResolved={onPlaceResolved} />
        </APIProvider>
      ) : (
        <LocationMapFallback address={DEFAULT_BAKR_ADDRESS} />
      )}
    </div>
  );
}
