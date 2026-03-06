import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ArrowRight, SlidersHorizontal, X, Shield, MapPin, Headset } from 'lucide-react';
import { translations } from '../data/translations';
import { MOCK_PROPERTIES } from '../data/mockData';
import useAppStore from '../store/useAppStore';
import PropertyCard from '../components/property/PropertyCard';
import { Button } from '../components/ui/button';
import api from '../services/api';

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&fit=crop';

const normalizeProperty = (property) => ({
    ...property,
    id: property._id || property.id,
    location: property.location || property.city || '',
    rooms: property.rooms || property.bhk || '',
    price: Number(property.price || 0),
    rating: Number(property.rating || 0),
    createdAt: property.createdAt || new Date().toISOString(),
    images: Array.isArray(property.images) && property.images.length > 0
        ? property.images
        : [property.image || DEFAULT_IMAGE],
});

export default function Home() {
    const { language } = useAppStore();
    const t = translations[language];
    const [apiProperties, setApiProperties] = useState([]);

    // Search & Filter state
    const [searchCity, setSearchCity] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [sortBy, setSortBy] = useState('newest'); // 'newest', 'price-low', 'price-high'

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const response = await api.getAllProperties();
                if (response?.success && Array.isArray(response.data)) {
                    setApiProperties(response.data.map(normalizeProperty));
                    return;
                }
            } catch (_) {
                // fall back to mock data
            }

            setApiProperties(MOCK_PROPERTIES.map(normalizeProperty));
        };

        fetchProperties();
    }, []);

    const allProperties = apiProperties;

    // Filtered properties
    const filteredProperties = allProperties.filter(property => {
        const city = (property.location || property.city || '').toLowerCase();
        const matchesCity = !searchCity || city.includes(searchCity.toLowerCase());
        const matchesMin = !minPrice || property.price >= Number(minPrice);
        const matchesMax = !maxPrice || property.price <= Number(maxPrice);
        return matchesCity && matchesMin && matchesMax;
    }).sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'newest') return new Date(b.createdAt || b.id) - new Date(a.createdAt || a.id);
        return 0;
    });

    const hasFilters = searchCity || minPrice || maxPrice;

    const clearFilters = () => {
        setSearchCity('');
        setMinPrice('');
        setMaxPrice('');
        setSortBy('newest');
    };

    return (
        <div className="flex flex-col animate-in fade-in duration-700 bg-[#0B0B13] font-sans">
            {/* Hero Section */}
            <section className="relative w-full h-[600px] md:h-[750px] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-[#0B0B13] z-0"></div>
                <img
                    src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2000"
                    alt="Modern Architecture"
                    className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-luminosity scale-105 animate-[pulse_20s_ease-in-out_infinite_alternate]"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-[#0B0B13]/60 to-[#0B0B13] z-0" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#0B0B13_100%)] z-0" />

                <div className="relative z-10 text-center px-4 max-w-5xl flex flex-col items-center mt-10">
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 uppercase tracking-[0.2em] drop-shadow-[0_0_20px_rgba(168,85,247,0.4)] leading-tight">
                        {t.heroTitle}
                    </h1>
                    <p className="text-lg md:text-2xl text-purple-200/90 mb-12 font-serif italic max-w-2xl drop-shadow-md">
                        "{t.heroSubtitle}"
                    </p>
                    <Link to="/properties">
                        <Button
                            variant="outline"
                            className="bg-purple-900/20 border border-purple-500/50 text-white hover:bg-[#A855F7] hover:border-[#A855F7] hover:text-white rounded-full px-10 py-7 text-sm md:text-base font-bold tracking-[0.2em] uppercase transition-all duration-500 backdrop-blur-md shadow-[0_0_30px_rgba(147,51,234,0.3)] hover:shadow-[0_0_40px_rgba(168,85,247,0.6)] hover:scale-105"
                        >
                            {t.exploreProperties}
                        </Button>
                    </Link>
                </div>
            </section>

            {/* View All Properties Section */}
            <section className="py-24 relative overflow-hidden" id="listings">
                {/* Ambient glow */}
                <div className="absolute top-1/2 left-0 w-[40%] h-[50%] bg-purple-900/10 blur-[150px] rounded-full pointer-events-none -translate-y-1/2 -ml-[20%]" />
                <div className="absolute top-0 right-0 w-[30%] h-[40%] bg-blue-900/10 blur-[150px] rounded-full pointer-events-none -mt-[10%] -mr-[10%]" />

                <div className="container mx-auto px-4 max-w-7xl relative z-10">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-4xl font-bold text-white tracking-tight">
                                {t.allProperties}
                            </h2>
                            <p className="text-gray-400 mt-2 text-lg">
                                {language === 'en'
                                    ? `Showing ${filteredProperties.length} of ${allProperties.length} cosmic properties`
                                    : `${allProperties.length} में से ${filteredProperties.length} संपत्तियाँ`}
                            </p>
                        </div>
                    </div>

                    {/* Search & Filter Bar */}
                    <div className="bg-[#15161E]/80 backdrop-blur-md border border-gray-800/60 rounded-3xl p-6 mb-12 shadow-2xl">
                        <div className="flex flex-col md:flex-row gap-5 items-stretch md:items-end">

                            {/* Search by City */}
                            <div className="flex-1">
                                <label className="flex items-center gap-2 text-xs font-bold text-purple-400 mb-2 uppercase tracking-wider">
                                    <Search className="w-4 h-4" /> {t.searchByCity}
                                </label>
                                <div className="relative group">
                                    <input
                                        type="text"
                                        placeholder={t.cityPlaceholder}
                                        value={searchCity}
                                        onChange={(e) => setSearchCity(e.target.value)}
                                        className="w-full px-5 py-4 pl-12 pr-14 rounded-2xl border border-gray-700/50 bg-[#1A1C26]/80 text-sm text-gray-200 focus:outline-none focus:ring-1 focus:ring-purple-500/50 focus:border-[#A855F7]/50 focus:bg-[#1E202A] transition-all placeholder-gray-500"
                                    />
                                    <Search className="w-5 h-5 text-gray-500 group-focus-within:text-purple-400 absolute left-4 top-1/2 -translate-y-1/2 transition-colors" />
                                    <button
                                        type="button"
                                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#9333EA] hover:bg-[#A855F7] text-white p-2.5 rounded-xl transition-all shadow-[0_0_10px_rgba(147,51,234,0.3)] hover:shadow-[0_0_15px_rgba(168,85,247,0.5)]"
                                    >
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Min Price */}
                            <div className="w-full md:w-48">
                                <label className="flex items-center gap-2 text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">
                                    <SlidersHorizontal className="w-4 h-4 text-purple-400" /> {t.minPriceLabel}
                                </label>
                                <input
                                    type="number"
                                    placeholder="0"
                                    min="0"
                                    value={minPrice}
                                    onChange={(e) => setMinPrice(e.target.value)}
                                    className="w-full px-5 py-4 rounded-2xl border border-gray-700/50 bg-[#1A1C26]/80 text-sm text-gray-200 focus:outline-none focus:ring-1 focus:ring-purple-500/50 focus:border-[#A855F7]/50 focus:bg-[#1E202A] transition-all placeholder-gray-500"
                                />
                            </div>

                            {/* Max Price */}
                            <div className="w-full md:w-48">
                                <label className="text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider block">
                                    {t.maxPriceLabel}
                                </label>
                                <input
                                    type="number"
                                    placeholder="Any"
                                    min="0"
                                    value={maxPrice}
                                    onChange={(e) => setMaxPrice(e.target.value)}
                                    className="w-full px-5 py-4 rounded-2xl border border-gray-700/50 bg-[#1A1C26]/80 text-sm text-gray-200 focus:outline-none focus:ring-1 focus:ring-purple-500/50 focus:border-[#A855F7]/50 focus:bg-[#1E202A] transition-all placeholder-gray-500"
                                />
                            </div>

                            {/* Sort By */}
                            <div className="w-full md:w-56">
                                <label className="text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider block">
                                    {t.sortByLabel}
                                </label>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="w-full px-5 py-4 rounded-2xl border border-gray-700/50 bg-[#1A1C26]/80 text-sm text-gray-200 focus:outline-none focus:ring-1 focus:ring-purple-500/50 focus:border-[#A855F7]/50 focus:bg-[#1E202A] transition-all appearance-none cursor-pointer"
                                >
                                    <option value="newest" className="bg-[#15161E]">{t.newestFirst}</option>
                                    <option value="price-low" className="bg-[#15161E]">{t.priceLowToHigh}</option>
                                    <option value="price-high" className="bg-[#15161E]">{t.priceHighToLow}</option>
                                </select>
                            </div>

                            {/* Clear Filters */}
                            {hasFilters && (
                                <button
                                    onClick={clearFilters}
                                    className="flex items-center justify-center gap-2 px-5 py-4 rounded-2xl bg-red-900/20 border border-red-500/20 text-red-400 text-sm font-bold hover:bg-red-500/20 hover:text-white transition-all whitespace-nowrap"
                                >
                                    <X className="w-4 h-4" /> {t.clear}
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Property Grid */}
                    {filteredProperties.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredProperties.map((property) => (
                                <PropertyCard key={property.id || property._id} property={property} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-[#15161E]/80 backdrop-blur-md rounded-3xl border border-gray-800/60 shadow-xl">
                            <div className="w-20 h-20 mx-auto bg-gray-800/50 rounded-full flex items-center justify-center mb-6">
                                <Search className="w-10 h-10 text-gray-500" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-3">{t.noPropertiesFound}</h3>
                            <p className="text-gray-400 mb-8 max-w-md mx-auto">{t.tryAdjusting}</p>
                            <button
                                onClick={clearFilters}
                                className="bg-purple-900/20 border border-purple-500/30 hover:bg-[#A855F7] hover:border-[#A855F7] text-white text-base font-bold py-3 px-8 rounded-full transition-all shadow-[0_0_15px_rgba(147,51,234,0.2)] hover:shadow-[0_0_20px_rgba(168,85,247,0.5)] inline-flex items-center justify-center"
                            >
                                {t.clearAllFilters}
                            </button>
                        </div>
                    )}
                </div>
            </section>

            {/* Why Choose Us Section */}
            <section className="py-24 relative overflow-hidden bg-[#0B0B13]">
                {/* Ambient glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] bg-purple-900/10 blur-[200px] rounded-full pointer-events-none" />

                <div className="container mx-auto px-4 max-w-7xl relative z-10 border-t border-gray-800/60 pt-20">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
                            {language === 'en' ? 'Why Choose HomeHive?' : 'होम-हाइव क्यों चुनें?'}
                        </h2>
                        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
                            {language === 'en'
                                ? 'We provide a seamless, secure, and transparent experience for finding your perfect home.'
                                : 'हम आपका आदर्श घर खोजने के लिए एक सहज, सुरक्षित और पारदर्शी अनुभव प्रदान करते हैं।'}
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-[#15161E]/80 backdrop-blur-md p-10 rounded-[32px] border border-gray-800/60 text-center shadow-lg hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] hover:-translate-y-2 hover:border-purple-500/30 transition-all duration-500">
                            <div className="w-20 h-20 mx-auto bg-blue-900/20 border border-blue-500/20 rounded-2xl rotate-3 flex items-center justify-center mb-8 shadow-inner hover:rotate-6 transition-transform">
                                <Shield className="w-10 h-10 text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.5)]" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-4">{language === 'en' ? 'Trust & Safety' : 'विश्वास और सुरक्षा'}</h3>
                            <p className="text-gray-400 leading-relaxed">{language === 'en' ? 'All properties and owners are verified to ensure a secure rental experience.' : 'एक सुरक्षित किराये का अनुभव सुनिश्चित करने के लिए सभी संपत्तियों और मालिकों का सत्यापन किया जाता है।'}</p>
                        </div>
                        <div className="bg-[#15161E]/80 backdrop-blur-md p-10 rounded-[32px] border border-gray-800/60 text-center shadow-lg hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] hover:-translate-y-2 hover:border-purple-500/30 transition-all duration-500">
                            <div className="w-20 h-20 mx-auto bg-purple-900/20 border border-purple-500/20 rounded-2xl -rotate-3 flex items-center justify-center mb-8 shadow-inner hover:-rotate-6 transition-transform">
                                <MapPin className="w-10 h-10 text-purple-400 drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-4">{language === 'en' ? 'Prime Locations' : 'प्रमुख स्थान'}</h3>
                            <p className="text-gray-400 leading-relaxed">{language === 'en' ? 'Find homes in the best neighborhoods with access to all essential amenities.' : 'सभी आवश्यक सुविधाओं तक पहुंच के साथ बेहतरीन पड़ोस में घर खोजें।'}</p>
                        </div>
                        <div className="bg-[#15161E]/80 backdrop-blur-md p-10 rounded-[32px] border border-gray-800/60 text-center shadow-lg hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] hover:-translate-y-2 hover:border-purple-500/30 transition-all duration-500">
                            <div className="w-20 h-20 mx-auto bg-orange-900/20 border border-orange-500/20 rounded-2xl rotate-3 flex items-center justify-center mb-8 shadow-inner hover:rotate-6 transition-transform">
                                <Headset className="w-10 h-10 text-orange-400 drop-shadow-[0_0_8px_rgba(251,146,60,0.5)]" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-4">{language === 'en' ? '24/7 Support' : '24/7 सहायता'}</h3>
                            <p className="text-gray-400 leading-relaxed">{language === 'en' ? 'Our dedicated support team is always here to help you with any issues.' : 'हमारी समर्पित सहायता टीम आपके किसी भी मुद्दे पर मदद के लिए हमेशा यहाँ है।'}</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
