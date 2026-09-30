import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { MapPin, Building2 } from 'lucide-react';

export const AdminLocationsPage: React.FC = () => {
  const [locations, setLocations] = useState<any[]>([]);

  useEffect(() => {
    api.locations.list().then(setLocations).catch(console.error);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-architectural text-white tracking-tight">
          Metropolitan Hubs & Regional Advisory
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Active regional centers with dedicated private client advisory boardrooms.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {locations.map((loc) => (
          <div
            key={loc.id}
            className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl group"
          >
            <div className="h-44 overflow-hidden relative">
              <img
                src={loc.image}
                alt={loc.city}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
              <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white font-architectural">
                    {loc.city}, {loc.state}
                  </h3>
                  <div className="text-[10px] font-mono text-amber-400 uppercase tracking-widest font-semibold">
                    {loc.region}
                  </div>
                </div>
                <div className="px-2.5 py-1 bg-slate-950/80 border border-slate-700/80 rounded-full font-mono text-[11px] text-slate-200">
                  {loc.activeListings} Active
                </div>
              </div>
            </div>
            <div className="p-4 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800">
              <span className="flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-slate-500" />
                <span>Private Advisory Boardroom</span>
              </span>
              <span className="text-emerald-400 font-mono font-semibold">Operational</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
