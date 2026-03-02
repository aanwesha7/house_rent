import React from 'react';
import { MapPin, ExternalLink, AlertCircle } from 'lucide-react';
import { Button } from '../ui/button';

export default function MapLocation({ address, coordinates, title = "Property Location" }) {
    // Use coordinates if available, otherwise fallback to address-based search
    const hasCoords = coordinates && coordinates.lat && coordinates.lng;
    const query = hasCoords
        ? `${coordinates.lat},${coordinates.lng}`
        : encodeURIComponent(address);

    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${query}`;

    // Google Maps Embed URL (No API key needed for simple search queries)
    const embedUrl = `https://www.google.com/maps/embed/v1/place?key=REPLACE_WITH_YOUR_API_KEY&q=${query}`;

    // Since we don't have an API key, we use the Iframe with direct search URL (standard practice for simple embeds)
    const fallbackEmbedUrl = `https://maps.google.com/maps?q=${query}&t=&z=13&ie=UTF8&iwloc=&output=embed`;

    if (!address && !hasCoords) {
        return (
            <div className="bg-gray-50 dark:bg-gray-900 border border-dashed border-gray-300 dark:border-gray-700 rounded-2xl p-8 text-center">
                <AlertCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500 dark:text-gray-400 font-medium">Location not available</p>
            </div>
        );
    }

    return (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    {title}
                </h3>
                <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 group"
                >
                    Open in Google Maps
                    <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
            </div>

            <div className="relative w-full h-[300px] md:h-[400px] rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-sm">
                <iframe
                    title="Property Location Map"
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    style={{ border: 0 }}
                    src={fallbackEmbedUrl}
                    allowFullScreen
                    loading="lazy"
                ></iframe>
            </div>

            {address && (
                <p className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
                    <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-gray-400" />
                    {address}
                </p>
            )}
        </div>
    );
}
