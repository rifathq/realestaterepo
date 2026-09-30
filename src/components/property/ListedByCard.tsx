import React from 'react';
import { ArrowUpRight, Mail, Phone } from 'lucide-react';
import { Property, LISTING_STATUS_LABEL } from '../../types/property';

// Contact card for a listing that comes from an agent's own site. It names the
// licensed agent and brokerage exactly as the agent's feed supplies them, and
// sends inquiries to the agent's own listing page.
export const ListedByCard: React.FC<{ property: Property }> = ({ property }) => {
  const by = property.listedBy;
  if (!by) return null;
  const firstName = by.agentName.split(' ')[0];
  const status = property.status ? LISTING_STATUS_LABEL[property.status] : null;

  return (
    <div className="bg-white border border-stone-200 p-6 space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-stone-100">
        <span className="text-[11px] font-mono uppercase tracking-wider text-stone-500">Listed by</span>
        {status && <span className="text-[11px] font-medium text-stone-700">{status}</span>}
      </div>

      <div className="flex items-center gap-4">
        <img src={by.photo} alt={by.agentName} className="w-14 h-14 object-cover object-top border border-stone-200 shrink-0" />
        <div>
          <h4 className="text-base font-bold text-stone-950">
            <a href={by.siteUrl} target="_blank" rel="noreferrer" className="hover:underline">
              {by.agentName}
            </a>
          </h4>
          <p className="text-xs text-stone-500">{by.agentTitle}</p>
          <p className="text-[11px] text-stone-400 font-mono">{by.licence}</p>
        </div>
      </div>

      <div className="text-xs text-stone-600 leading-relaxed border-l-2 border-stone-900 pl-3">
        <div className="font-semibold text-stone-900">{by.brokerage}</div>
        <div>{by.brokerageOffice}</div>
        <div>Office {by.brokeragePhone}</div>
      </div>

      <div className="space-y-2 text-xs text-stone-600 font-mono">
        {by.phone && (
          <div className="flex items-center gap-2">
            <Phone className="w-3.5 h-3.5 text-stone-400 stroke-[1.5]" />
            <span>{by.phone}</span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <Mail className="w-3.5 h-3.5 text-stone-400 stroke-[1.5]" />
          <a href={`mailto:${by.email}`} className="hover:underline">{by.email}</a>
        </div>
      </div>

      {property.listingUrl && (
        <a
          href={property.listingUrl}
          target="_blank"
          rel="noreferrer"
          className="w-full inline-flex items-center justify-center gap-2 py-2.5 bg-black hover:bg-neutral-900 text-white font-medium text-xs border border-black transition-colors"
        >
          Ask {firstName} about this home <ArrowUpRight className="w-3.5 h-3.5" />
        </a>
      )}

      <div className="text-center">
        <a href={`${by.siteUrl}/listings`} target="_blank" rel="noreferrer" className="text-xs text-stone-500 hover:text-stone-950 underline">
          See all of {firstName}'s listings
        </a>
      </div>
    </div>
  );
};
