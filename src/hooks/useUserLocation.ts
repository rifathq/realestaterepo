import { useState, useEffect } from 'react';

const STORAGE_KEY = 'digentic_visitor_location_v1';
const DEFAULT_CITY = 'Arlington';
const DEFAULT_LOCATION = 'Arlington, VA';

export interface UserLocationState {
  city: string;
  formattedLocation: string;
  isLoaded: boolean;
  isDetected: boolean;
}

export function useUserLocation(): UserLocationState {
  const [locationState, setLocationState] = useState<UserLocationState>(() => {
    // 1. Try to read from sessionStorage first
    try {
      if (typeof window !== 'undefined' && window.sessionStorage) {
        const cached = window.sessionStorage.getItem(STORAGE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed && parsed.formattedLocation) {
            return {
              city: parsed.city || DEFAULT_CITY,
              formattedLocation: parsed.formattedLocation || DEFAULT_LOCATION,
              isLoaded: true,
              isDetected: Boolean(parsed.isDetected),
            };
          }
        }
      }
    } catch {
      // sessionStorage might be restricted in some privacy modes
    }

    return {
      city: DEFAULT_CITY,
      formattedLocation: DEFAULT_LOCATION,
      isLoaded: false,
      isDetected: false,
    };
  });

  useEffect(() => {
    // If already loaded from cache, no need to fetch again
    if (locationState.isLoaded) return;

    let isMounted = true;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    async function detectLocation() {
      let detectedCity = '';
      let detectedFormatted = '';

      // Attempt 1: ipwho.is (fast, reliable, CORS enabled, no API key needed)
      try {
        const res = await fetch('https://ipwho.is/', {
          signal: controller.signal,
          headers: { Accept: 'application/json' },
        });
        if (res.ok) {
          const data = await res.json();
          if (data && data.success !== false && data.city) {
            detectedCity = data.city;
            if (data.country_code === 'US' && data.region_code) {
              detectedFormatted = `${data.city}, ${data.region_code}`;
            } else if (data.country_code && data.country_code !== 'US') {
              detectedFormatted = `${data.city}, ${data.country_code}`;
            } else {
              detectedFormatted = data.city;
            }
          }
        }
      } catch {
        // Fallback to secondary source
      }

      // Attempt 2: ipapi.co fallback if ipwho.is was blocked or empty
      if (!detectedCity) {
        try {
          const res = await fetch('https://ipapi.co/json/', {
            signal: controller.signal,
            headers: { Accept: 'application/json' },
          });
          if (res.ok) {
            const data = await res.json();
            if (data && !data.error && data.city) {
              detectedCity = data.city;
              if (data.region_code) {
                detectedFormatted = `${data.city}, ${data.region_code}`;
              } else {
                detectedFormatted = data.city;
              }
            }
          }
        } catch {
          // Graceful fallback to default
        }
      }

      clearTimeout(timeoutId);

      if (!isMounted) return;

      const finalCity = detectedCity || DEFAULT_CITY;
      const finalFormatted = detectedFormatted || DEFAULT_LOCATION;
      const isDetected = Boolean(detectedCity);

      const newState: UserLocationState = {
        city: finalCity,
        formattedLocation: finalFormatted,
        isLoaded: true,
        isDetected,
      };

      setLocationState(newState);

      // Cache result in sessionStorage
      try {
        if (typeof window !== 'undefined' && window.sessionStorage) {
          window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
        }
      } catch {
        // Ignore cache storage failure
      }
    }

    detectLocation();

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [locationState.isLoaded]);

  return locationState;
}
