import React, { useState, useEffect } from 'react';
import {
  Hospital,
  Pill,
  ExternalLink,
  MapPin,
  LocateFixed,
  Loader2,
  X,
  PhoneCall
} from 'lucide-react';

interface NearbyCareLocatorProps {
  language?: 'English' | 'Tamil';
  severity?: string;
}

export const NearbyCareLocator: React.FC<NearbyCareLocatorProps> = ({
  language = 'English',
  severity,
}) => {
  const isTamil = language === 'Tamil';
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [customLocation, setCustomLocation] = useState<string>('');
  const [locating, setLocating] = useState(false);
  const [showLocationInput, setShowLocationInput] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('mrhealthai_custom_location');
      if (saved) setCustomLocation(saved);
    } catch (e) {
      console.warn(e);
    }
  }, []);

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCoords({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        () => {},
        { timeout: 6000 }
      );
    }
  }, []);

  const handleCustomLocationChange = (val: string) => {
    setCustomLocation(val);
    try {
      if (val.trim()) {
        localStorage.setItem('mrhealthai_custom_location', val);
      } else {
        localStorage.removeItem('mrhealthai_custom_location');
      }
    } catch (e) {
      console.warn(e);
    }
  };

  const requestLocation = () => {
    if (!('geolocation' in navigator)) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setLocating(false);
      },
      () => {
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const openGoogleMaps = (type: 'hospital' | 'pharmacy') => {
    let query = '';
    const loc = customLocation.trim();

    if (type === 'hospital') {
      query = loc ? `nearest 24/7 emergency hospital in ${loc}` : 'nearest 24/7 emergency hospital';
    } else {
      query = loc ? `nearest 24 hours pharmacy medical store in ${loc}` : 'nearest 24 hours pharmacy medical store';
    }

    let mapsUrl = '';
    if (!loc && coords) {
      mapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(query)}/@${coords.lat},${coords.lng},14z`;
    } else {
      mapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(query)}`;
    }
    window.open(mapsUrl, '_blank', 'noopener,noreferrer');
  };

  const isSevere = severity === 'Severe / Seek Emergency Care';

  return (
    <div
      id="compact-care-locator"
      className={`rounded-2xl border p-3 sm:p-3.5 space-y-2.5 transition-all shadow-2xs ${
        isSevere
          ? 'bg-rose-50/90 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800'
          : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700'
      }`}
    >
      {/* Title & Location Trigger */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-rose-500 to-red-600 text-white flex items-center justify-center shadow-xs">
            <Hospital className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-extrabold text-slate-900 dark:text-white leading-tight">
              {isTamil ? 'அருகிலுள்ள மருத்துவமனை & மருந்தகம்' : 'Nearby Hospitals & Pharmacy Map'}
            </h3>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">
              {customLocation ? `📍 ${customLocation}` : isTamil ? 'Google Maps நேரடி வழிகாட்டல்' : '1-Click Google Maps directions'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowLocationInput(!showLocationInput)}
          className="text-[11px] font-bold text-cyan-700 dark:text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
        >
          <MapPin className="w-3 h-3 text-rose-500" />
          <span>{customLocation ? (isTamil ? 'மாற்று' : 'Edit Area') : (isTamil ? 'பகுதி தேர்வு' : 'Set Area')}</span>
        </button>
      </div>

      {/* Expandable Area Input for Laptops / Specific Locality */}
      {showLocationInput && (
        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-2 space-y-1.5 animate-fadeIn">
          <div className="flex items-center gap-1.5">
            <input
              type="text"
              value={customLocation}
              onChange={(e) => handleCustomLocationChange(e.target.value)}
              placeholder={isTamil ? 'எ.கா: T. Nagar Chennai, Coimbatore...' : 'e.g. T. Nagar Chennai, Coimbatore, Bangalore...'}
              className="flex-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:border-cyan-500"
            />
            {customLocation && (
              <button
                type="button"
                onClick={() => handleCustomLocationChange('')}
                className="p-1 text-slate-400 hover:text-rose-500"
                title="Clear"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              type="button"
              onClick={requestLocation}
              disabled={locating}
              className="p-1.5 bg-slate-100 dark:bg-slate-700 rounded-lg text-slate-700 dark:text-slate-200 text-xs flex items-center gap-1"
              title="Detect GPS"
            >
              {locating ? <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-600" /> : <LocateFixed className="w-3.5 h-3.5 text-cyan-600" />}
            </button>
          </div>
        </div>
      )}

      {/* Two Compact 1-Click Map Buttons */}
      <div className="grid grid-cols-2 gap-2">
        {/* Hospital */}
        <button
          type="button"
          onClick={() => openGoogleMaps('hospital')}
          className="p-2.5 rounded-xl bg-gradient-to-br from-rose-50 to-rose-100/70 dark:from-rose-950/40 dark:to-rose-900/30 hover:from-rose-100 hover:to-rose-200 border border-rose-200 dark:border-rose-900/60 text-left transition cursor-pointer active:scale-98 flex items-center justify-between shadow-2xs"
        >
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
              <Hospital className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="font-extrabold text-xs text-slate-900 dark:text-white block leading-tight">
                {isTamil ? 'மருத்துவமனை' : 'Hospitals'}
              </span>
              <span className="text-[10px] text-rose-700 dark:text-rose-400 font-semibold">
                24/7 Emergency
              </span>
            </div>
          </div>
          <ExternalLink className="w-3.5 h-3.5 text-rose-600 shrink-0" />
        </button>

        {/* Pharmacy */}
        <button
          type="button"
          onClick={() => openGoogleMaps('pharmacy')}
          className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-100/70 dark:from-emerald-950/40 dark:to-teal-900/30 hover:from-emerald-100 hover:to-teal-200 border border-emerald-200 dark:border-emerald-900/60 text-left transition cursor-pointer active:scale-98 flex items-center justify-between shadow-2xs"
        >
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
              <Pill className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="font-extrabold text-xs text-slate-900 dark:text-white block leading-tight">
                {isTamil ? 'மருந்தகம்' : 'Pharmacies'}
              </span>
              <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold">
                24 Hours Medical
              </span>
            </div>
          </div>
          <ExternalLink className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
        </button>
      </div>

      {/* Emergency Dial Badge */}
      <div className="flex items-center justify-between pt-0.5 text-[11px] text-slate-600 dark:text-slate-400">
        <span className="flex items-center gap-1 font-semibold text-rose-700 dark:text-rose-400">
          <PhoneCall className="w-3 h-3" />
          {isTamil ? 'அவசர அழைப்பு:' : 'SOS Hotlines:'}
        </span>
        <div className="flex items-center gap-2 font-bold">
          <a href="tel:108" className="text-rose-600 hover:underline">108 (IN)</a>
          <span>•</span>
          <a href="tel:112" className="text-rose-600 hover:underline">112 (Universal)</a>
          <span>•</span>
          <a href="tel:911" className="text-slate-700 dark:text-slate-300 hover:underline">911 (US)</a>
        </div>
      </div>
    </div>
  );
};
