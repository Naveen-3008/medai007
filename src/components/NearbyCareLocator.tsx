import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Hospital,
  Pill,
  Stethoscope,
  ExternalLink,
  Navigation,
  PhoneCall,
  AlertTriangle,
  LocateFixed,
  Loader2,
  ChevronDown,
  ChevronUp,
  Search,
  X,
  Sparkles
} from 'lucide-react';

interface NearbyCareLocatorProps {
  language?: 'English' | 'Tamil';
  isCompact?: boolean;
  severity?: string;
}

export const NearbyCareLocator: React.FC<NearbyCareLocatorProps> = ({
  language = 'English',
  isCompact = false,
  severity,
}) => {
  const isTamil = language === 'Tamil';
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [customLocation, setCustomLocation] = useState<string>('');
  const [locating, setLocating] = useState(false);
  const [locationStatus, setLocationStatus] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(!isCompact || severity === 'Severe / Seek Emergency Care');

  // Load saved custom location if previously entered
  useEffect(() => {
    try {
      const saved = localStorage.getItem('mrhealthai_custom_location');
      if (saved) {
        setCustomLocation(saved);
      }
    } catch (e) {
      console.warn(e);
    }
  }, []);

  // Attempt browser geolocation on mount
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCoords({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
          setLocationStatus(isTamil ? '✓ ஜி.பி.எஸ் இடம் இணைக்கப்பட்டது' : '✓ Live GPS Location Connected');
        },
        () => {
          // Normal fallback for laptop/desktop IP
        },
        { timeout: 6000 }
      );
    }
  }, [isTamil]);

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
    if (!('geolocation' in navigator)) {
      alert(isTamil ? 'உங்கள் உலாவியில் ஜிபிஎஸ் ஆதரவு இல்லை.' : 'Geolocation is not supported by your browser.');
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setLocationStatus(isTamil ? '✓ நேரடி ஜி.பி.எஸ் பெறப்பட்டது' : '✓ Live GPS Active');
        setLocating(false);
      },
      () => {
        setLocating(false);
        setLocationStatus(isTamil ? 'பகுதி தேடல் பயன்முறை' : 'Area Search Mode');
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const openGoogleMaps = (type: 'hospital' | 'pharmacy' | 'clinic') => {
    let query = '';
    const loc = customLocation.trim();

    if (type === 'hospital') {
      query = loc ? `nearest 24/7 emergency hospital in ${loc}` : 'nearest 24/7 emergency hospital';
    } else if (type === 'pharmacy') {
      query = loc ? `nearest 24 hours pharmacy medical store in ${loc}` : 'nearest 24 hours pharmacy medical store';
    } else {
      query = loc ? `nearest doctor clinic in ${loc}` : 'nearest doctor clinic';
    }

    let mapsUrl = '';
    if (!loc && coords) {
      // Use device GPS coordinates if no custom area typed
      mapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(query)}/@${coords.lat},${coords.lng},14z`;
    } else {
      // Use custom locality query for 100% accuracy on laptops/PCs
      mapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(query)}`;
    }
    window.open(mapsUrl, '_blank', 'noopener,noreferrer');
  };

  const isSevere = severity === 'Severe / Seek Emergency Care';

  return (
    <section
      id="nearby-care-locator-card"
      aria-label="Emergency Care & Pharmacy Locator"
      className={`rounded-2xl border transition-all duration-200 shadow-2xs overflow-hidden w-full ${
        isSevere
          ? 'bg-rose-50/90 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 ring-2 ring-rose-500/20'
          : 'bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800'
      }`}
    >
      {/* Header Bar */}
      <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-xs ${
              isSevere
                ? 'bg-rose-600 shadow-rose-600/30 animate-pulse'
                : 'bg-gradient-to-tr from-emerald-600 to-teal-600 shadow-emerald-600/20'
            }`}
          >
            <Hospital className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight leading-none">
                {isTamil ? 'அருகிலுள்ள அவசர சிகிச்சை & மருந்தகங்கள்' : 'Nearby Emergency Care & Pharmacy Locator'}
              </h2>
              {isSevere && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-600 text-white animate-bounce">
                  {isTamil ? 'அவசரம்' : 'URGENT'}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              {isTamil
                ? 'Google Maps மூலம் 24/7 மருத்துவமனைகள் & மருந்தகங்களை கண்டறியவும்'
                : '1-Click instant Google Maps directions to 24/7 hospitals, clinics, and medical shops'}
            </p>
          </div>
        </div>

        {/* GPS trigger & expand controls */}
        <div className="flex items-center gap-2 self-end sm:self-center">
          <button
            type="button"
            onClick={requestLocation}
            disabled={locating}
            className="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-200 dark:border-slate-700 transition cursor-pointer"
            title="Detect GPS location"
          >
            {locating ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-600" />
            ) : (
              <LocateFixed className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
            )}
            <span className="hidden sm:inline">
              {coords ? (isTamil ? 'ஜி.பி.எஸ் உள்ளது' : 'GPS Active') : (isTamil ? 'ஜிபிஎஸ் கண்டறி' : 'Detect GPS')}
            </span>
          </button>

          {isCompact && (
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1.5 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              aria-label="Toggle Care Locator"
            >
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>

      {/* Body Content */}
      {isExpanded && (
        <div className="p-4 sm:p-5 space-y-4">
          {/* Laptop / PC Location Fix: Manual Area & City Input Box */}
          <div className="bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl p-3 space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label
                htmlFor="input-custom-location"
                className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5"
              >
                <MapPin className="w-3.5 h-3.5 text-rose-600" />
                <span>
                  {isTamil ? 'உங்கள் பகுதி / நகரம் / அஞ்சல் குறியீடு (துல்லியமான தேடலுக்கு):' : 'Set Your Specific Area, City, or Pincode (Accurate for Laptops & Mobile):'}
                </span>
              </label>

              {customLocation && (
                <button
                  type="button"
                  onClick={() => handleCustomLocationChange('')}
                  className="text-[11px] text-slate-500 hover:text-rose-600 flex items-center gap-1 self-end sm:self-auto cursor-pointer"
                >
                  <X className="w-3 h-3" />
                  {isTamil ? 'நீக்கு (ஜிபிஎஸ் பயன்படுத்து)' : 'Clear (Use GPS)'}
                </button>
              )}
            </div>

            <div className="relative flex items-center">
              <input
                id="input-custom-location"
                type="text"
                value={customLocation}
                onChange={(e) => handleCustomLocationChange(e.target.value)}
                placeholder={
                  isTamil
                    ? 'எ.கா: T. Nagar Chennai, Coimbatore, Madurai, Anna Nagar, அல்லது அஞ்சல் குறியீடு 600017...'
                    : 'e.g. T. Nagar Chennai, Coimbatore, Bangalore, Manhattan NY, or Pin code 600017...'
                }
                className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl py-2 pl-9 pr-3 text-xs sm:text-sm font-medium text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-hidden focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition shadow-2xs"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
            </div>

            <p className="text-[10px] text-slate-500 dark:text-slate-400">
              💡 {isTamil
                ? 'மடிக்கணினியில் (Laptop) தவறான இடம் காட்டினால், உங்கள் சரியான பகுதியை மேலே உள்ளிடவும்.'
                : 'Laptops use Wi-Fi IP routing which can be inaccurate. Typing your area above ensures 100% accurate results.'}
            </p>
          </div>

          {/* Quick 1-Click Google Maps Search Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {/* 1. 24/7 Emergency Hospital */}
            <button
              id="btn-find-hospital"
              type="button"
              onClick={() => openGoogleMaps('hospital')}
              className="p-3.5 rounded-2xl bg-gradient-to-br from-rose-50 to-rose-100/60 dark:from-rose-950/30 dark:to-rose-900/20 hover:from-rose-100 hover:to-rose-200/80 dark:hover:from-rose-900/40 dark:hover:to-rose-800/30 border border-rose-200 dark:border-rose-900/50 text-left transition group cursor-pointer shadow-2xs active:scale-98 flex flex-col justify-between"
            >
              <div className="flex items-start justify-between">
                <div className="w-9 h-9 rounded-xl bg-rose-600 text-white flex items-center justify-center shadow-xs shadow-rose-600/30">
                  <Hospital className="w-5 h-5" />
                </div>
                <span className="flex items-center gap-1 text-[11px] font-bold text-rose-700 dark:text-rose-400 group-hover:underline">
                  <span>Google Maps</span>
                  <ExternalLink className="w-3 h-3" />
                </span>
              </div>
              <div className="mt-3">
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white group-hover:text-rose-700 dark:group-hover:text-rose-300">
                  {isTamil ? '24/7 அவசர மருத்துவமனைகள்' : '24/7 Emergency Hospitals'}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                  {customLocation
                    ? (isTamil ? `${customLocation} பகுதியில் உள்ள மருத்துவமனைகள்` : `Emergency trauma centers in ${customLocation}`)
                    : (isTamil ? 'அருகிலுள்ள அவசர சிகிச்சை பிரிவுகள்' : 'Nearest emergency trauma centers')}
                </p>
              </div>
            </button>

            {/* 2. Pharmacy / Medical Stores */}
            <button
              id="btn-find-pharmacy"
              type="button"
              onClick={() => openGoogleMaps('pharmacy')}
              className="p-3.5 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-100/60 dark:from-emerald-950/30 dark:to-teal-900/20 hover:from-emerald-100 hover:to-teal-200/80 dark:hover:from-emerald-900/40 dark:hover:to-teal-800/30 border border-emerald-200 dark:border-emerald-900/50 text-left transition group cursor-pointer shadow-2xs active:scale-98 flex flex-col justify-between"
            >
              <div className="flex items-start justify-between">
                <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs shadow-emerald-600/30">
                  <Pill className="w-5 h-5" />
                </div>
                <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 group-hover:underline">
                  <span>Google Maps</span>
                  <ExternalLink className="w-3 h-3" />
                </span>
              </div>
              <div className="mt-3">
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-300">
                  {isTamil ? 'மருந்தகங்கள் & மெடிக்கல்' : 'Pharmacies & Medical Stores'}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                  {customLocation
                    ? (isTamil ? `${customLocation} பகுதியில் உள்ள மருந்தகங்கள்` : `24-hour chemists in ${customLocation}`)
                    : (isTamil ? '24 மணி நேர மருந்து கடைகள்' : '24-hour chemists & medical stores')}
                </p>
              </div>
            </button>

            {/* 3. Doctors & Walk-in Clinics */}
            <button
              id="btn-find-clinic"
              type="button"
              onClick={() => openGoogleMaps('clinic')}
              className="p-3.5 rounded-2xl bg-gradient-to-br from-sky-50 to-blue-100/60 dark:from-sky-950/30 dark:to-blue-900/20 hover:from-sky-100 hover:to-blue-200/80 dark:hover:from-sky-900/40 dark:hover:to-blue-800/30 border border-sky-200 dark:border-sky-900/50 text-left transition group cursor-pointer shadow-2xs active:scale-98 flex flex-col justify-between"
            >
              <div className="flex items-start justify-between">
                <div className="w-9 h-9 rounded-xl bg-sky-600 text-white flex items-center justify-center shadow-xs shadow-sky-600/30">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <span className="flex items-center gap-1 text-[11px] font-bold text-sky-700 dark:text-sky-400 group-hover:underline">
                  <span>Google Maps</span>
                  <ExternalLink className="w-3 h-3" />
                </span>
              </div>
              <div className="mt-3">
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white group-hover:text-sky-700 dark:group-hover:text-sky-300">
                  {isTamil ? 'கிளினிக்குகள் & மருத்துவர்கள்' : 'Clinics & General Doctors'}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                  {customLocation
                    ? (isTamil ? `${customLocation} பகுதியில் உள்ள மருத்துவர்கள்` : `Family doctors & clinics in ${customLocation}`)
                    : (isTamil ? 'பொது மருத்துவ கிளினிக்குகள்' : 'Walk-in outpatient clinics')}
                </p>
              </div>
            </button>
          </div>

          {/* Quick Emergency Phone Hotlines Banner */}
          <div className="rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 p-3 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <PhoneCall className="w-4 h-4 text-rose-600 shrink-0" />
              <span>
                <strong className="text-slate-900 dark:text-white">{isTamil ? 'உடனடி அவசர அழைப்பு:' : 'Instant Emergency Hotlines:'}</strong>{' '}
                {isTamil ? 'கடுமையான அவசர நிலைக்கு உடனே அழைக்கவும்' : 'For severe trauma or immediate emergency'}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <a
                href="tel:108"
                className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold flex items-center gap-1.5 transition shadow-2xs cursor-pointer"
              >
                <PhoneCall className="w-3 h-3" />
                <span>108 (India)</span>
              </a>
              <a
                href="tel:112"
                className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold flex items-center gap-1.5 transition shadow-2xs cursor-pointer"
              >
                <PhoneCall className="w-3 h-3" />
                <span>112 (Universal)</span>
              </a>
              <a
                href="tel:911"
                className="px-3 py-1.5 rounded-lg bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 text-white font-bold flex items-center gap-1.5 transition shadow-2xs cursor-pointer"
              >
                <PhoneCall className="w-3 h-3" />
                <span>911 (US/CA)</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
