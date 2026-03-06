import React from 'react';
import { MapPin, BedDouble, Star, ExternalLink, Heart } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Link } from 'react-router-dom';
import useAppStore from '../../store/useAppStore';

export default function PropertyCard({ property }) {
    const { savedPropertyIds, toggleSaveProperty } = useAppStore();
    const propertyId = property.id || property._id;
    const imageUrl = (Array.isArray(property.images) && property.images.length > 0)
        ? property.images[0]
        : property.image;
    const location = property.location || property.city || 'Location unavailable';
    const rooms = property.rooms || property.bhk || '-';
    const price = Number(property.price || 0);

    const handleShowMap = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const hasCoords = property.coordinates && property.coordinates.lat && property.coordinates.lng;
        const query = hasCoords
            ? `${property.coordinates.lat},${property.coordinates.lng}`
            : encodeURIComponent(property.address || property.location);
        window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
    };

    return (
        <Link to={`/properties/${propertyId}`} className="group block h-full">
            <div className="h-full flex flex-col rounded-2xl overflow-hidden border border-gray-800/60 bg-[#15161E]/80 backdrop-blur-sm shadow-lg transition-all hover:shadow-[0_0_20px_rgba(168,85,247,0.15)] hover:-translate-y-1 hover:border-purple-500/40 duration-300">
                <div className="relative aspect-[4/3] overflow-hidden flex-shrink-0">
                    <img
                        src={imageUrl}
                        alt={property.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#15161E] via-transparent to-transparent opacity-60"></div>

                    <div className="absolute top-3 left-3 flex gap-2">
                        <Badge variant="secondary" className="bg-[#0B0B13]/80 backdrop-blur-md text-white border border-gray-700/50 shadow-sm">
                            {property.type}
                        </Badge>
                    </div>
                </div>

                <div className="p-5 flex flex-col flex-grow relative">
                    {/* Floating Action Buttons */}
                    <div className="absolute -top-6 right-4 flex gap-2 items-center">
                        <div className="bg-[#15161E]/90 backdrop-blur-md rounded-full px-2.5 py-1.5 flex items-center gap-1.5 text-sm font-bold text-white shadow-lg border border-gray-700/50">
                            <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400 drop-shadow-sm" />
                            <span>{property.rating}</span>
                        </div>
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                toggleSaveProperty(propertyId);
                            }}
                            className={`p-2 rounded-full bg-[#15161E]/90 backdrop-blur-md transition-all shadow-lg border border-gray-700/50 hover:scale-110 hover:border-red-500/50 ${(savedPropertyIds || []).includes(propertyId) ? 'text-red-500 border-red-500/30' : 'text-gray-400 hover:text-red-500'}`}
                        >
                            <Heart className={`w-4 h-4 ${(savedPropertyIds || []).includes(propertyId) ? 'fill-red-500 drop-shadow-[0_0_5px_rgba(239,68,68,0.5)]' : ''}`} />
                        </button>
                    </div>

                    <div className="flex items-start justify-between mb-3 mt-2">
                        <div>
                            <h3 className="text-lg font-bold text-white line-clamp-1 mb-1.5 group-hover:text-[#A855F7] transition-colors">
                                {property.title}
                            </h3>
                            <p className="flex items-center text-sm text-gray-400 gap-1.5 line-clamp-1">
                                <MapPin className="w-3.5 h-3.5 text-purple-400/80" />
                                {location}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-300 mb-4 flex-grow">
                        <div className="flex items-center gap-1.5 bg-purple-900/20 px-3 py-1.5 rounded-lg border border-purple-500/20 shadow-inner">
                            <BedDouble className="w-4 h-4 text-purple-400" />
                            <span className="font-semibold text-purple-100">{rooms}</span>
                        </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-800/60 mt-auto">
                        <div className="font-bold text-xl text-white flex items-baseline gap-1">
                            ₹{price.toLocaleString('en-IN')}
                            <span className="text-xs font-medium text-gray-500">/mo</span>
                        </div>
                        <button
                            onClick={handleShowMap}
                            className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-white transition-all bg-purple-900/10 hover:bg-purple-600/20 px-3 py-2 rounded-full border border-gray-700/50 hover:border-[#A855F7]/50 group/btn shadow-sm"
                        >
                            <MapPin className="w-3 h-3 text-purple-400 group-hover/btn:text-[#A855F7]" />
                            Map
                            <ExternalLink className="w-3 h-3 text-gray-500 group-hover/btn:text-white transition-colors" />
                        </button>
                    </div>
                </div>
            </div>
        </Link>
    );
}
