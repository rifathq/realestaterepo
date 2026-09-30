import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ChevronDown, Search, ArrowRight, HelpCircle } from 'lucide-react';

interface FaqItem {
  id: string;
  category: 'Buying' | 'Renting' | 'Selling' | 'Verification' | 'Escrow';
  question: string;
  answer: string;
}

export const FaqPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryParam || 'all');
  const [openId, setOpenId] = useState<string | null>('faq-1');

  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    } else {
      setSelectedCategory('all');
    }
  }, [categoryParam]);

  const handleCategorySelect = (cat: string) => {
    setSelectedCategory(cat);
    if (cat === 'all') {
      const next = new URLSearchParams(searchParams);
      next.delete('category');
      setSearchParams(next, { replace: true });
    } else {
      const next = new URLSearchParams(searchParams);
      next.set('category', cat);
      setSearchParams(next, { replace: true });
    }
  };

  const faqs: FaqItem[] = [
    {
      id: 'faq-1',
      category: 'Verification',
      question: 'What does "Digentic Certified & Title Inspected" mean?',
      answer: 'Every property bearing this status has completed our four-tier legal and physical review: verification of county deed ownership records, structural plan measurement, environmental compliance review, and validation that no undisclosed liens or municipal code infractions exist.'
    },
    {
      id: 'faq-2',
      category: 'Buying',
      question: 'How do I submit an offer on a Digentic listed property?',
      answer: 'Offers can be generated directly through your client dashboard or submitted by your assigned Digentic broker. Standardized digital contracts are executed with proof of liquid funds or lender pre-approval attached.'
    },
    {
      id: 'faq-3',
      category: 'Buying',
      question: 'Are unlisted or off-market properties accessible through Digentic Realty?',
      answer: 'Yes. Digentic Private Office maintains a confidential catalog of institutional commercial towers and high-net-worth residences that do not permit public marketing. Inquire through our Advisory Desk to sign a non-disclosure agreement and access private placements.'
    },
    {
      id: 'faq-4',
      category: 'Renting',
      question: 'What documentation is required for corporate commercial leases?',
      answer: 'Corporate tenants typically provide two years of audited financial statements, certificate of corporate incorporation, bank references, and authorized corporate signers. For residential leases, standard proof of income and credit authorization are processed digitally.'
    },
    {
      id: 'faq-5',
      category: 'Selling',
      question: 'What are Digentic brokerage and listing commission rates?',
      answer: 'Digentic Realty maintains transparent tiered fees. For residential sales, brokerage fees range from 2.0% to 2.5% per side. For commercial leases and asset transactions, standard customary regional schedule fees apply without hidden platform markup.'
    },
    {
      id: 'faq-6',
      category: 'Selling',
      question: 'How long does the property certification and listing process take?',
      answer: 'Once ownership documentation and architectural floor plans are submitted, our audit team completes title deed and zoning verification within 48 to 72 business hours. Photography and 3D scans are scheduled simultaneously.'
    },
    {
      id: 'faq-7',
      category: 'Verification',
      question: 'Can I schedule an independent structural engineer before contract signing?',
      answer: 'Absolutely. Digentic Realty encourages independent structural, MEP, and geotechnical inspections. We provide complete technical access to building systems during the formal due diligence inspection window.'
    },
    {
      id: 'faq-8',
      category: 'Escrow',
      question: 'How are earnest money deposits and closing funds safeguarded?',
      answer: 'All deposits and transaction balances are held in federally insured, independent third-party title escrow accounts (such as First American Title or Chicago Title). Funds are never held on Digentic operating ledgers.'
    }
  ];

  const categories = ['all', 'Buying', 'Renting', 'Selling', 'Verification', 'Escrow'];

  const filteredFaqs = faqs.filter((faq) => {
    if (selectedCategory !== 'all' && faq.category !== selectedCategory) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return faq.question.toLowerCase().includes(q) || faq.answer.toLowerCase().includes(q);
    }
    return true;
  });

  const toggleAccordion = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="pb-24 space-y-12">
      
      {/* Page Header */}
      <section className="bg-stone-900 text-white py-16 sm:py-24 border-b border-stone-800 w-full">
        <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 text-center space-y-4">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-stone-400 font-mono">
            <span className="w-2 h-2 rounded-full bg-white" />
            <span>Knowledge Base & Protocols</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white font-architectural">
            Frequently Asked Questions
          </h1>
          <p className="text-stone-300 text-base sm:text-lg max-w-3xl mx-auto leading-relaxed">
            Essential information regarding property verification, transaction mechanics, private viewings, and escrow procedures.
          </p>
        </div>
      </section>

      {/* Search & Categories */}
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-8 space-y-8">
        
        <div className="relative">
          <Search className="w-5 h-5 text-stone-400 absolute left-4 top-4 stroke-[1.5]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search questions about verification, fees, tours..."
            className="w-full text-base pl-12 pr-4 py-3.5 border border-stone-200 bg-white focus:outline-none focus:border-stone-900"
          />
        </div>

        {/* Category Pills (Interactive Filter Buttons) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategorySelect(cat)}
              className={`px-4 py-2 text-sm font-semibold capitalize transition-colors whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-stone-900 text-white'
                  : 'bg-stone-100 text-stone-600 hover:text-stone-900 border border-stone-200'
              }`}
            >
              {cat === 'all' ? 'All Questions' : cat}
            </button>
          ))}
        </div>

        {/* Accordion List */}
        <div className="space-y-4 pt-2">
          {filteredFaqs.length === 0 ? (
            <div className="p-8 bg-white border border-stone-200 text-center text-sm text-stone-500">
              No matching questions found. Contact our advisory desk for assistance.
            </div>
          ) : (
            filteredFaqs.map((faq) => {
              const isOpen = openId === faq.id;
              return (
                <div
                  key={faq.id}
                  className="bg-white border border-stone-200 overflow-hidden transition-colors shadow-xs"
                >
                  <button
                    onClick={() => toggleAccordion(faq.id)}
                    className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 hover:bg-stone-50 transition-colors"
                    aria-expanded={isOpen}
                  >
                    <span className="text-base sm:text-lg font-semibold text-stone-900">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-stone-500 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-stone-950' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-6 text-sm sm:text-base text-stone-600 leading-relaxed border-t border-stone-100 pt-4">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Need more help */}
        <div className="mt-12 p-8 bg-stone-100 border border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h4 className="text-base sm:text-lg font-bold text-stone-950">Have a specific question not covered here?</h4>
            <p className="text-sm text-stone-500 mt-1">Our legal counsel and brokerage partners are on hand to clarify complex transaction queries.</p>
          </div>
          <Link
            to="/contact"
            className="px-6 py-3.5 bg-black hover:bg-neutral-900 active:scale-95 text-white font-medium text-sm border border-black shadow-md hover:shadow-lg transition-all duration-200 whitespace-nowrap rounded-md"
          >
            Contact Advisory
          </Link>
        </div>

      </div>

    </div>
  );
};
