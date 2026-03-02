import React, { useState } from 'react';
import { MOCK_PROPERTIES } from '../data/mockData';
import EmptyState from '../components/common/EmptyState';
import { Check, Minus, Star, MapPin } from 'lucide-react';
import useAppStore from '../store/useAppStore';
import { translations } from '../data/translations';

export default function CompareProperties() {
    const { language, savedPropertyIds, ownerProperties } = useAppStore();
    const t = translations[language];

    const comparedProperties = React.useMemo(() => {
        const allProps = [
            ...MOCK_PROPERTIES,
            ...ownerProperties.map(p => ({
                ...p,
                location: p.city,
                rooms: `${p.bhk} BHK`,
                type: 'Apartment',
                rating: 5.0,
                reviews: 0,
                amenities: ['WiFi', 'Parking'],
                images: [p.image]
            }))
        ];
        return allProps.filter(p => (savedPropertyIds || []).includes(p.id));
    }, [savedPropertyIds, ownerProperties]);

    if (comparedProperties.length === 0) {
        return (
            <div className="min-h-screen bg-[#0B0B13] relative overflow-hidden font-sans flex items-center justify-center">
                {/* Ambient Background Glows */}
                <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-1/4 left-1/4 w-[40%] h-[40%] bg-purple-900/10 blur-[120px] rounded-full mix-blend-screen"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-[40%] h-[40%] bg-blue-900/10 blur-[120px] rounded-full mix-blend-screen"></div>
                </div>
                <div className="container mx-auto px-4 py-12 max-w-4xl relative z-10">
                    <div className="bg-[#15161E]/80 backdrop-blur-xl rounded-3xl border border-gray-800/60 p-8 shadow-2xl">
                        <EmptyState
                            title={t.noPropertiesToCompare}
                            description={t.noPropertiesToCompareDesc}
                            actionText={t.browseProperties}
                            actionLink="/properties"
                        />
                    </div>
                </div>
            </div>
        );
    }

    // Get all unique amenities across compared properties
    const allAmenities = Array.from(
        new Set(comparedProperties.flatMap(p => p.amenities))
    ).sort();

    return (
        <div className="min-h-screen bg-[#0B0B13] relative overflow-hidden font-sans py-12">
            {/* Ambient Background Glows */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden flex justify-center">
                <div className="absolute top-0 left-1/4 w-[50%] h-[50%] bg-purple-900/10 blur-[150px] rounded-full"></div>
                <div className="absolute bottom-0 right-1/4 w-[30%] h-[50%] bg-blue-900/10 blur-[150px] rounded-full"></div>
            </div>

            <div className="container mx-auto px-4 max-w-7xl animate-in fade-in relative z-10">
                <div className="mb-8 p-6 bg-[#15161E]/60 backdrop-blur-md rounded-2xl border border-[#A855F7]/20 shadow-[0_0_20px_rgba(168,85,247,0.05)]">
                    <h1 className="text-3xl font-bold text-white mb-2">{t.compareProperties}</h1>
                    <p className="text-gray-400">Side-by-side comparison of your saved properties.</p>
                </div>

                <div className="overflow-x-auto rounded-3xl border border-gray-800/60 shadow-[0_0_30px_rgba(0,0,0,0.5)] bg-[#15161E]/80 backdrop-blur-xl custom-scrollbar">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr>
                                <th className="p-5 border-b border-r border-gray-800/60 bg-[#1A1C26]/90 backdrop-blur-md text-white font-bold w-48 sticky left-0 z-20 min-w-[150px] shadow-[4px_0_15px_rgba(0,0,0,0.3)] text-lg">
                                    {t.features}
                                </th>
                                {comparedProperties.map(p => (
                                    <th key={p.id} className="p-5 border-b border-gray-800/60 text-center min-w-[280px] align-top bg-[#15161E]/50">
                                        <div className="relative aspect-video rounded-xl overflow-hidden mb-4 border border-gray-700/50 shadow-lg group">
                                            <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B13]/80 via-transparent to-transparent pointer-events-none" />
                                        </div>
                                        <h3 className="font-semibold text-lg text-white mb-1 line-clamp-1">{p.title}</h3>
                                        <div className="text-[#A855F7] font-bold text-2xl mb-2 drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]">
                                            <span className="text-sm text-gray-400 font-normal mr-1">₹</span>
                                            {p.price.toLocaleString(language === 'en' ? 'en-IN' : 'hi-IN')}
                                            <span className="text-sm font-normal text-gray-500 ml-1">/{t.month}</span>
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800/60 text-gray-300">
                            {/* Location */}
                            <tr className="hover:bg-[#1A1C26]/40 transition-colors">
                                <td className="p-4 font-semibold text-gray-200 bg-[#1A1C26]/80 sticky left-0 z-10 shadow-[4px_0_15px_rgba(0,0,0,0.2)] border-r border-gray-800/60">{t.location}</td>
                                {comparedProperties.map(p => (
                                    <td key={`loc-${p.id}`} className="p-4 text-center">
                                        <div className="flex items-center justify-center gap-1.5 text-blue-300 group cursor-default">
                                            <MapPin className="w-4 h-4 text-blue-500" />
                                            <span className="truncate max-w-[200px]">{p.location}</span>
                                        </div>
                                    </td>
                                ))}
                            </tr>
                            {/* Rooms */}
                            <tr className="hover:bg-[#1A1C26]/40 transition-colors">
                                <td className="p-4 font-semibold text-gray-200 bg-[#1A1C26]/80 sticky left-0 z-10 shadow-[4px_0_15px_rgba(0,0,0,0.2)] border-r border-gray-800/60">{t.roomsLabel}</td>
                                {comparedProperties.map(p => (
                                    <td key={`rooms-${p.id}`} className="p-4 text-center font-semibold text-white">{p.rooms}</td>
                                ))}
                            </tr>
                            {/* Type */}
                            <tr className="hover:bg-[#1A1C26]/40 transition-colors">
                                <td className="p-4 font-semibold text-gray-200 bg-[#1A1C26]/80 sticky left-0 z-10 shadow-[4px_0_15px_rgba(0,0,0,0.2)] border-r border-gray-800/60">{t.propertyType}</td>
                                {comparedProperties.map(p => (
                                    <td key={`type-${p.id}`} className="p-4 text-center text-gray-300">{p.type}</td>
                                ))}
                            </tr>
                            {/* Rating */}
                            <tr className="hover:bg-[#1A1C26]/40 transition-colors">
                                <td className="p-4 font-semibold text-gray-200 bg-[#1A1C26]/80 sticky left-0 z-10 shadow-[4px_0_15px_rgba(0,0,0,0.2)] border-r border-gray-800/60">{t.rating}</td>
                                {comparedProperties.map(p => (
                                    <td key={`rating-${p.id}`} className="p-4 text-center">
                                        <div className="flex items-center justify-center gap-1.5">
                                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 drop-shadow-[0_0_5px_rgba(234,179,8,0.5)]" />
                                            <span className="font-bold text-white">{p.rating}</span>
                                            <span className="text-sm text-gray-500">({p.reviews})</span>
                                        </div>
                                    </td>
                                ))}
                            </tr>
                            {/* Amenities Section Header */}
                            <tr>
                                <td colSpan={comparedProperties.length + 1} className="p-4 font-bold bg-purple-900/10 text-[#A855F7] text-center border-y border-purple-500/20 shadow-[inset_0_0_20px_rgba(168,85,247,0.05)] tracking-wider uppercase text-sm">
                                    {t.amenities}
                                </td>
                            </tr>
                            {/* Dynamic Amenities */}
                            {allAmenities.map(amenity => (
                                <tr key={amenity} className="hover:bg-[#1A1C26]/40 transition-colors">
                                    <td className="p-4 font-medium text-gray-300 bg-[#1A1C26]/80 sticky left-0 z-10 shadow-[4px_0_15px_rgba(0,0,0,0.2)] border-r border-gray-800/60">{amenity}</td>
                                    {comparedProperties.map(p => (
                                        <td key={`${p.id}-${amenity}`} className="p-4 text-center">
                                            {p.amenities.includes(amenity) ? (
                                                <div className="w-8 h-8 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto shadow-[0_0_10px_rgba(34,197,94,0.1)]">
                                                    <Check className="w-4 h-4 text-green-400 drop-shadow-[0_0_5px_rgba(34,197,94,0.5)]" />
                                                </div>
                                            ) : (
                                                <div className="w-8 h-8 rounded-full bg-gray-800/50 border border-gray-700/50 flex items-center justify-center mx-auto">
                                                    <Minus className="w-4 h-4 text-gray-600" />
                                                </div>
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
