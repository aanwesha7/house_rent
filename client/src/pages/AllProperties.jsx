import React, { useState, useEffect, useMemo } from 'react';
import { Filter, ArrowUpDown, X, Search, MapPin, Home, IndianRupee, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import PropertyCard from '../components/property/PropertyCard';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Skeleton } from '../components/ui/skeleton';
import EmptyState from '../components/common/EmptyState';
import { MOCK_PROPERTIES } from '../data/mockData';
import useAppStore from '../store/useAppStore';
import { translations } from '../data/translations';
import api from '../services/api';

const ROOM_OPTIONS = ['1BHK', '2BHK', '3BHK', '4BHK'];
const PROPERTY_TYPE_OPTIONS = ['Apartment', 'Villa', 'House', 'Studio', 'Penthouse'];
const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&fit=crop';

const normalizeProperty = (property) => ({
    ...property,
    id: property._id || property.id,
    location: property.location || property.city || '',
    rooms: property.rooms || property.bhk || '',
    rating: Number(property.rating || 0),
    price: Number(property.price || 0),
    createdAt: property.createdAt || new Date().toISOString(),
    images: Array.isArray(property.images) && property.images.length > 0
        ? property.images
        : [property.image || DEFAULT_IMAGE],
});

export default function AllProperties() {
    const [searchParams] = useSearchParams();
    const searchQuery = searchParams.get('search');

    const { language } = useAppStore();
    const t = translations[language];
    const [loading, setLoading] = useState(true);
    const [properties, setProperties] = useState([]);
    const [showFilters, setShowFilters] = useState(false);

    // Filter state
    const [locationInput, setLocationInput] = useState(searchQuery || '');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [selectedRooms, setSelectedRooms] = useState('');
    const [selectedType, setSelectedType] = useState('');

    // Active filters (applied on "Apply")
    const [filters, setFilters] = useState(() => {
        if (searchQuery) return { location: searchQuery };
        return {};
    });

    const [sortBy, setSortBy] = useState('recent');

    // Keep filters synced if URL changes
    useEffect(() => {
        if (searchQuery) {
            setLocationInput(searchQuery);
            setFilters(prev => ({ ...prev, location: searchQuery }));
        }
    }, [searchQuery]);

    useEffect(() => {
        const fetchProperties = async () => {
            setLoading(true);
            try {
                const response = await api.getAllProperties();
                if (response?.success && Array.isArray(response.data)) {
                    setProperties(response.data.map(normalizeProperty));
                } else {
                    setProperties(MOCK_PROPERTIES.map(normalizeProperty));
                }
            } catch (_) {
                setProperties(MOCK_PROPERTIES.map(normalizeProperty));
            } finally {
                setLoading(false);
            }
        };

        fetchProperties();
    }, []);

    const applyFilters = () => {
        const newFilters = {};
        if (locationInput.trim()) newFilters.location = locationInput.trim();
        if (minPrice) newFilters.minPrice = Number(minPrice);
        if (maxPrice) newFilters.maxPrice = Number(maxPrice);
        if (selectedRooms) newFilters.rooms = selectedRooms;
        if (selectedType) newFilters.type = selectedType;
        setFilters(newFilters);
        setShowFilters(false);
    };

    const clearAllFilters = () => {
        setLocationInput('');
        setMinPrice('');
        setMaxPrice('');
        setSelectedRooms('');
        setSelectedType('');
        setFilters({});
    };

    const removeFilter = (key) => {
        setFilters(prev => {
            const newFilters = { ...prev };
            delete newFilters[key];
            return newFilters;
        });
        // Also reset the corresponding input
        if (key === 'location') setLocationInput('');
        if (key === 'minPrice') setMinPrice('');
        if (key === 'maxPrice') setMaxPrice('');
        if (key === 'rooms') setSelectedRooms('');
        if (key === 'type') setSelectedType('');
    };

    const activeFilterCount = Object.keys(filters).length;

    const filterDisplayLabels = {
        location: language === 'en' ? 'Location' : 'स्थान',
        minPrice: language === 'en' ? 'Min Price' : 'न्यूनतम मूल्य',
        maxPrice: language === 'en' ? 'Max Price' : 'अधिकतम मूल्य',
        rooms: language === 'en' ? 'Rooms' : 'कमरे',
        type: language === 'en' ? 'Type' : 'प्रकार',
    };

    const formatFilterValue = (key, value) => {
        if (key === 'minPrice' || key === 'maxPrice') return `₹${Number(value).toLocaleString('en-IN')}`;
        return value;
    };

    const filteredAndSortedProperties = useMemo(() => {
        let result = [...properties];

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
        if (filters.type) {
            result = result.filter(p => p.type === filters.type);
        }
        if (filters.minPrice) {
            result = result.filter(p => p.price >= filters.minPrice);
        }
        if (filters.maxPrice) {
            result = result.filter(p => p.price <= filters.maxPrice);
        }

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
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
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
                        <Button
                            variant="outline"
                            onClick={() => setShowFilters(!showFilters)}
                            className={`gap-2 bg-[#15161E] hover:bg-[#1A1C26] hover:text-white border-gray-800/60 text-gray-300 shadow-sm h-[42px] rounded-xl transition-all relative ${showFilters ? 'border-purple-500/50 bg-purple-900/10 text-white' : ''}`}
                        >
                            <Filter className="h-4 w-4 text-purple-400" /> {t.filters}
                            {activeFilterCount > 0 && (
                                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#9333EA] text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-[0_0_8px_rgba(147,51,234,0.5)]">
                                    {activeFilterCount}
                                </span>
                            )}
                            <ChevronDown className={`h-3.5 w-3.5 text-gray-500 transition-transform duration-300 ${showFilters ? 'rotate-180' : ''}`} />
                        </Button>
                    </div>
                </div>

                {/* ===== FILTER PANEL ===== */}
                <div
                    className={`overflow-hidden transition-all duration-500 ease-in-out ${showFilters ? 'max-h-[500px] opacity-100 mb-8' : 'max-h-0 opacity-0 mb-0'}`}
                >
                    <div className="bg-[#15161E]/80 backdrop-blur-xl border border-gray-800/60 rounded-3xl p-6 md:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.4)]">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">

                            {/* Location */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-xs font-bold text-purple-400 uppercase tracking-wider">
                                    <MapPin className="w-3.5 h-3.5" /> {language === 'en' ? 'Location' : 'स्थान'}
                                </label>
                                <div className="relative group">
                                    <input
                                        type="text"
                                        placeholder={language === 'en' ? 'Search city...' : 'शहर खोजें...'}
                                        value={locationInput}
                                        onChange={(e) => setLocationInput(e.target.value)}
                                        className="w-full px-4 py-3 pl-10 rounded-xl border border-gray-700/50 bg-[#1A1C26]/80 text-sm text-gray-200 focus:outline-none focus:ring-1 focus:ring-purple-500/50 focus:border-[#A855F7]/50 transition-all placeholder-gray-500"
                                    />
                                    <Search className="w-4 h-4 text-gray-500 group-focus-within:text-purple-400 absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors" />
                                </div>
                            </div>

                            {/* Price Range */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-xs font-bold text-purple-400 uppercase tracking-wider">
                                    <IndianRupee className="w-3.5 h-3.5" /> {language === 'en' ? 'Price Range' : 'मूल्य सीमा'}
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="number"
                                        placeholder={language === 'en' ? 'Min' : 'न्यूनतम'}
                                        min="0"
                                        value={minPrice}
                                        onChange={(e) => setMinPrice(e.target.value)}
                                        className="w-1/2 px-4 py-3 rounded-xl border border-gray-700/50 bg-[#1A1C26]/80 text-sm text-gray-200 focus:outline-none focus:ring-1 focus:ring-purple-500/50 focus:border-[#A855F7]/50 transition-all placeholder-gray-500"
                                    />
                                    <input
                                        type="number"
                                        placeholder={language === 'en' ? 'Max' : 'अधिकतम'}
                                        min="0"
                                        value={maxPrice}
                                        onChange={(e) => setMaxPrice(e.target.value)}
                                        className="w-1/2 px-4 py-3 rounded-xl border border-gray-700/50 bg-[#1A1C26]/80 text-sm text-gray-200 focus:outline-none focus:ring-1 focus:ring-purple-500/50 focus:border-[#A855F7]/50 transition-all placeholder-gray-500"
                                    />
                                </div>
                            </div>

                            {/* Room Type */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-xs font-bold text-purple-400 uppercase tracking-wider">
                                    <Home className="w-3.5 h-3.5" /> {language === 'en' ? 'Room Type' : 'कमरे का प्रकार'}
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {ROOM_OPTIONS.map((room) => (
                                        <button
                                            key={room}
                                            type="button"
                                            onClick={() => setSelectedRooms(selectedRooms === room ? '' : room)}
                                            className={`px-3.5 py-2 rounded-lg text-xs font-bold border transition-all duration-200 ${selectedRooms === room
                                                    ? 'bg-[#9333EA]/80 border-purple-500/50 text-white shadow-[0_0_10px_rgba(147,51,234,0.3)]'
                                                    : 'bg-[#1A1C26]/80 border-gray-700/50 text-gray-400 hover:border-purple-500/30 hover:text-purple-300'
                                                }`}
                                        >
                                            {room}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Property Type */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-xs font-bold text-purple-400 uppercase tracking-wider">
                                    <SlidersHorizontal className="w-3.5 h-3.5" /> {language === 'en' ? 'Property Type' : 'प्रॉपर्टी प्रकार'}
                                </label>
                                <select
                                    value={selectedType}
                                    onChange={(e) => setSelectedType(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-700/50 bg-[#1A1C26]/80 text-sm text-gray-200 focus:outline-none focus:ring-1 focus:ring-purple-500/50 focus:border-[#A855F7]/50 transition-all appearance-none cursor-pointer"
                                >
                                    <option value="" className="bg-[#15161E]">{language === 'en' ? 'All Types' : 'सभी प्रकार'}</option>
                                    {PROPERTY_TYPE_OPTIONS.map((type) => (
                                        <option key={type} value={type} className="bg-[#15161E]">{type}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Filter Actions */}
                        <div className="flex items-center justify-end gap-3 mt-6 pt-5 border-t border-gray-800/60">
                            <button
                                onClick={clearAllFilters}
                                className="px-5 py-2.5 text-sm font-semibold text-gray-400 hover:text-white rounded-xl hover:bg-gray-800/50 transition-all"
                            >
                                {language === 'en' ? 'Clear All' : 'सभी हटाएं'}
                            </button>
                            <button
                                onClick={applyFilters}
                                className="px-8 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-[#9333EA] to-[#A855F7] hover:from-[#A855F7] hover:to-[#9333EA] rounded-xl transition-all shadow-[0_0_15px_rgba(147,51,234,0.3)] hover:shadow-[0_0_20px_rgba(168,85,247,0.5)] active:scale-[0.97]"
                            >
                                {language === 'en' ? 'Apply Filters' : 'फ़िल्टर लागू करें'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Active Filter Chips */}
                {activeFilterCount > 0 && (
                    <div className="flex flex-wrap items-center gap-2 mb-8 p-4 bg-[#15161E]/60 backdrop-blur-md rounded-2xl border border-gray-800/60 shadow-inner">
                        <span className="text-sm text-gray-400 font-medium mr-2">{t.activeFilters}</span>
                        {Object.entries(filters).map(([key, value]) => (
                            <Badge key={key} variant="secondary" className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-purple-900/20 text-purple-300 shadow-sm border border-purple-500/20 rounded-lg">
                                <span className="capitalize text-purple-400/70">{filterDisplayLabels[key] || key}:</span>
                                <span className="font-semibold text-purple-200">{formatFilterValue(key, value)}</span>
                                <button
                                    onClick={() => removeFilter(key)}
                                    className="ml-1 hover:bg-purple-500/30 rounded-full p-0.5 transition-colors focus:outline-none hover:text-white"
                                >
                                    <X className="h-3.5 w-3.5" />
                                </button>
                            </Badge>
                        ))}
                        <button
                            onClick={clearAllFilters}
                            className="text-sm text-[#A855F7] hover:text-purple-300 ml-2 font-medium underline-offset-4 hover:underline transition-colors"
                        >
                            {t.clearAllSmall}
                        </button>
                    </div>
                )}

                {/* Results Count */}
                {!loading && (
                    <p className="text-sm text-gray-500 mb-6">
                        {language === 'en'
                            ? `Showing ${filteredAndSortedProperties.length} of ${properties.length} properties`
                            : `${properties.length} में से ${filteredAndSortedProperties.length} संपत्तियाँ दिखा रहे हैं`}
                    </p>
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
                            onAction={clearAllFilters}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
