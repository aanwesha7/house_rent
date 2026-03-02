import React, { useState, useEffect, useMemo } from 'react';
import { Filter, ArrowUpDown, X } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import PropertyCard from '../components/property/PropertyCard';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Skeleton } from '../components/ui/skeleton';
import EmptyState from '../components/common/EmptyState';
import { MOCK_PROPERTIES } from '../data/mockData';
import useAppStore from '../store/useAppStore';
import { translations } from '../data/translations';

export default function AllProperties() {
    const [searchParams] = useSearchParams();
    const searchQuery = searchParams.get('search');

    const { language } = useAppStore();
    const t = translations[language];
    const [loading, setLoading] = useState(true);
    const [properties, setProperties] = useState([]);

    // Initialize filters based on URL params
    const [filters, setFilters] = useState(() => {
        const initialFilters = {};
        if (searchQuery) {
            initialFilters.location = searchQuery;
        } else {
            initialFilters.location = 'Mumbai'; // Default 
            initialFilters.price = '<= 50,000';
            initialFilters.rooms = '3BHK';
        }
        return initialFilters;
    });

    const [sortBy, setSortBy] = useState('recent'); // recent, priceAsc, priceDesc, rating

    // Keep filters synced if URL changes
    useEffect(() => {
        if (searchQuery) {
            setFilters(prev => ({ ...prev, location: searchQuery }));
        }
    }, [searchQuery]);

    useEffect(() => {
        // Simulate API fetch delay
        const timer = setTimeout(() => {
            setProperties(MOCK_PROPERTIES);
            setLoading(false);
        }, 1500);
        return () => clearTimeout(timer);
    }, []);

    const removeFilter = (key) => {
        setFilters(prev => {
            const newFilters = { ...prev };
            delete newFilters[key];
            return newFilters;
        });
    };

    const filteredAndSortedProperties = useMemo(() => {
        let result = [...properties];

        // Apply Filters
        if (filters.location) {
            result = result.filter(p => {
                const loc = (p.location || p.city || '').toLowerCase();
                const q = filters.location.toLowerCase();
                return loc.includes(q) || (p.title && p.title.toLowerCase().includes(q));
            });
        }
        if (filters.rooms) {
            result = result.filter(p => p.rooms === filters.rooms);
        }
        if (filters.price) {
            // Mock price filter logic
            if (filters.price === '<= 50,000') {
                result = result.filter(p => p.price <= 50000);
            }
        }

        // Apply Sorting
        switch (sortBy) {
            case 'priceAsc':
                result.sort((a, b) => a.price - b.price);
                break;
            case 'priceDesc':
                result.sort((a, b) => b.price - a.price);
                break;
            case 'rating':
                result.sort((a, b) => b.rating - a.rating);
                break;
            case 'recent':
            default:
                result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                break;
        }

        return result;
    }, [properties, filters, sortBy]);

    return (
        <div className="relative min-h-screen bg-[#0B0B13] font-sans text-gray-200">
            {/* Ambient Background Glows */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden flex justify-center">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-900/10 blur-[120px] rounded-full"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-blue-900/10 blur-[120px] rounded-full"></div>
            </div>

            <div className="relative z-10 container mx-auto px-4 py-8 max-w-7xl animate-in fade-in duration-700">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                    <div>
                        <h1 className="text-4xl font-bold text-white tracking-tight mb-2">
                            {t.browseProperties}
                        </h1>
                        <p className="text-gray-400 text-[15px]">{t.findPerfectHome}</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="relative group">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="appearance-none bg-[#15161E] border border-gray-800/60 text-sm rounded-xl pl-10 pr-8 py-2.5 focus:outline-none focus:ring-1 focus:ring-purple-500/50 shadow-sm transition-all text-gray-200 group-hover:border-purple-500/30 cursor-pointer"
                            >
                                <option value="recent" className="bg-[#15161E] text-gray-200">{t.mostRecent}</option>
                                <option value="priceAsc" className="bg-[#15161E] text-gray-200">{t.priceLowToHigh}</option>
                                <option value="priceDesc" className="bg-[#15161E] text-gray-200">{t.priceHighToLow}</option>
                                <option value="rating" className="bg-[#15161E] text-gray-200">{t.highestRated}</option>
                            </select>
                            <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 group-hover:text-purple-400 transition-colors pointer-events-none" />
                        </div>
                        <Button variant="outline" className="gap-2 bg-[#15161E] hover:bg-[#1A1C26] hover:text-white border-gray-800/60 text-gray-300 shadow-sm h-[42px] rounded-xl transition-all">
                            <Filter className="h-4 w-4 text-purple-400" /> {t.filters}
                        </Button>
                    </div>
                </div>

                {/* Active Filter Chips */}
                {Object.keys(filters).length > 0 && (
                    <div className="flex flex-wrap items-center gap-2 mb-8 p-4 bg-[#15161E]/60 backdrop-blur-md rounded-2xl border border-gray-800/60 shadow-inner">
                        <span className="text-sm text-gray-400 font-medium mr-2">{t.activeFilters}</span>
                        {Object.entries(filters).map(([key, value]) => (
                            <Badge key={key} variant="secondary" className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-purple-900/20 text-purple-300 shadow-sm border border-purple-500/20 rounded-lg">
                                <span className="capitalize text-purple-400/70">{key}:</span>
                                <span className="font-semibold text-purple-200">{value}</span>
                                <button
                                    onClick={() => removeFilter(key)}
                                    className="ml-1 hover:bg-purple-500/30 rounded-full p-0.5 transition-colors focus:outline-none hover:text-white"
                                >
                                    <X className="h-3.5 w-3.5" />
                                </button>
                            </Badge>
                        ))}
                        <button
                            onClick={() => setFilters({})}
                            className="text-sm text-[#A855F7] hover:text-purple-300 ml-2 font-medium underline-offset-4 hover:underline transition-colors"
                        >
                            {t.clearAllSmall}
                        </button>
                    </div>
                )}

                {/* Loading State / Skeletons */}
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                            <div key={n} className="rounded-2xl overflow-hidden border border-gray-800/60 bg-[#15161E] shadow-sm">
                                <Skeleton className="aspect-[4/3] w-full rounded-none bg-gray-800" />
                                <div className="p-5 space-y-3">
                                    <Skeleton className="h-6 w-3/4 bg-gray-800" />
                                    <Skeleton className="h-4 w-1/2 bg-gray-800" />
                                    <div className="flex gap-2 pt-2">
                                        <Skeleton className="h-8 w-16 bg-gray-800" />
                                        <Skeleton className="h-8 w-16 bg-gray-800" />
                                    </div>
                                    <Skeleton className="h-6 w-1/3 mt-4 bg-gray-800" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : filteredAndSortedProperties.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredAndSortedProperties.map((property) => (
                            <PropertyCard key={property.id} property={property} />
                        ))}
                    </div>
                ) : (
                    <div className="bg-[#15161E]/80 border border-gray-800/60 rounded-3xl p-12 backdrop-blur-sm">
                        <EmptyState
                            title={t.noPropertiesFound}
                            description={t.tryAdjusting}
                            actionText={t.clearAllFilters}
                            actionLink="#"
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
