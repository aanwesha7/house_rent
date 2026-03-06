import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { translations } from '../data/translations';
import useAppStore from '../store/useAppStore';
import useAuthStore from '../store/useAuthStore';
import {
    ChevronLeft, Star, MapPin, Share, Heart,
    Wifi, Car, Home as HomeIcon, CheckCircle2,
    Mail, Phone, Shield, MessageSquare,
    CheckCircle, AlertCircle, Loader2
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Skeleton } from '../components/ui/skeleton';
import MapLocation from '../components/property/MapLocation';
import AvailabilityCalendar from '../components/booking/AvailabilityCalendar';
import MultiStepBooking from '../components/booking/MultiStepBooking';
import { cn } from '../lib/utils';
import { format } from 'date-fns';
import api from '../services/api';

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&fit=crop';

const normalizeProperty = (property) => ({
    ...property,
    id: property._id || property.id,
    location: property.location || property.city || '',
    rooms: property.rooms || property.bhk || '',
    reviews: property.reviews || property.reviewCount || 0,
    amenities: Array.isArray(property.amenities) ? property.amenities : [],
    hostId: property.owner?._id || property.hostId || 'owner',
    coordinates: property.coordinates || { lat: 28.7041, lng: 77.1025 },
    images: Array.isArray(property.images) && property.images.length > 0
        ? property.images
        : [property.image || DEFAULT_IMAGE],
});

export default function PropertyDetails() {
    const { id } = useParams();
    const { language, toggleChat, savedPropertyIds, toggleSaveProperty } = useAppStore();
    const { isAuthenticated, user } = useAuthStore();
    const t = translations[language];

    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [bookingStatus, setBookingStatus] = useState(null); // 'loading', 'success', 'error'

    // Gallery state
    const [activeImage, setActiveImage] = useState(0);

    // Selected dates for booking
    const [selectedRange, setSelectedRange] = useState({ from: null, to: null });

    // Booking modal state
    const [isBookingOpen, setIsBookingOpen] = useState(false);

    useEffect(() => {
        const fetchProperty = async () => {
            setLoading(true);
            try {
                const response = await api.getPropertyById(id);
                if (response?.success && response.data) {
                    setProperty(normalizeProperty(response.data));
                } else {
                    setProperty(null);
                }
            } catch (_) {
                setProperty(null);
            } finally {
                setLoading(false);
            }
        };

        fetchProperty();
    }, [id]);

    const handleBooking = async () => {
        if (!isAuthenticated) {
            alert(language === 'en' ? 'Please login to book a property' : 'प्रॉपर्टी बुक करने के लिए कृपया लॉगिन करें');
            return;
        }
        setIsBookingOpen(true);
    };

    const propertyId = property?.id || property?._id;
    const ownerName = property?.owner?.name || (property?.hostId === 'owner' ? (language === 'en' ? 'You (Owner)' : 'आप (मालिक)') : 'Owner');
    const ownerEmail = property?.owner?.email || 'owner@email.com';
    const ownerMobile = property?.owner?.mobile || '+91 98XXX XXXXX';

    const handleShare = async () => {
        const shareData = {
            title: property.title,
            text: `Check out this property on HomeHive: ${property.title}`,
            url: window.location.href
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(shareData.url);
                alert(language === 'en' ? 'Link copied to clipboard!' : 'लिंक क्लिपबोर्ड पर कॉपी हो गया!');
            }
        } catch (err) {
            console.error('Error sharing:', err);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0B0B13] p-8">
                <div className="container mx-auto px-4 max-w-6xl animate-pulse">
                    <div className="h-8 bg-gray-800/50 rounded w-1/3 mb-4" />
                    <div className="flex gap-4 mb-6">
                        <div className="h-4 bg-gray-800/50 rounded w-32" />
                        <div className="h-4 bg-gray-800/50 rounded w-32" />
                    </div>
                    <div className="h-[400px] bg-gray-800/50 w-full rounded-2xl mb-4" />
                    <div className="grid grid-cols-5 gap-4">
                        <div className="h-24 bg-gray-800/50 rounded-xl" />
                        <div className="h-24 bg-gray-800/50 rounded-xl" />
                        <div className="h-24 bg-gray-800/50 rounded-xl" />
                    </div>
                </div>
            </div>
        );
    }

    if (!property) return <div className="min-h-screen bg-[#0B0B13] p-8 text-center text-red-500">Property not found</div>;

    return (
        <div className="min-h-screen bg-[#0B0B13] relative overflow-hidden font-sans">
            {/* Ambient Background Glows */}
            <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-purple-900/10 blur-[150px] rounded-full pointer-events-none" />
            <div className="absolute bottom-1/4 left-1/4 w-[30%] h-[30%] bg-blue-900/10 blur-[120px] rounded-full pointer-events-none" />

            <div className="container mx-auto px-4 py-8 max-w-6xl relative z-10 animate-in fade-in duration-500">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
                    <div>
                        <Link to="/" className="inline-flex items-center text-sm text-gray-400 hover:text-purple-400 mb-4 transition-colors">
                            <ChevronLeft className="w-4 h-4 mr-1" /> {t.backToListings}
                        </Link>
                        <h1 className="text-3xl md:text-5xl font-bold text-white mb-3 tracking-tight">
                            {property.title}
                        </h1>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                            <span className="flex items-center gap-1.5">
                                <Star className="w-4 h-4 text-[#A855F7] fill-[#A855F7]" />
                                <span className="font-semibold text-gray-200">{property.rating}</span>
                                <span className="underline hover:text-white cursor-pointer transition-colors">({property.reviews} {t.reviews})</span>
                            </span>
                            <span className="flex items-center gap-1.5">
                                <MapPin className="w-4 h-4 text-purple-400" />
                                {property.location}
                            </span>
                            <Badge className="bg-purple-900/30 text-purple-300 border py-1 border-purple-500/20">{property.type}</Badge>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <Button variant="outline" className="gap-2 bg-[#1A1C26]/50 border-gray-700/50 text-gray-300 hover:bg-[#1A1C26] hover:text-white" onClick={handleShare}>
                            <Share className="w-4 h-4" /> {t.share}
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => toggleSaveProperty(propertyId)}
                            className={`gap-2 transition-colors ${(savedPropertyIds || []).includes(propertyId) ? 'text-pink-500 bg-pink-950/30 border-pink-900/50' : 'bg-[#1A1C26]/50 border-gray-700/50 text-gray-300 hover:bg-[#1A1C26] hover:text-pink-400 hover:border-pink-900/50'}`}
                        >
                            <Heart className={`w-4 h-4 ${(savedPropertyIds || []).includes(propertyId) ? 'fill-pink-500' : ''}`} /> {t.save}
                        </Button>
                    </div>
                </div>

                {/* Media Gallery */}
                <div className="mb-12">
                    <div className="relative h-[400px] md:h-[500px] rounded-[32px] overflow-hidden mb-4 group shadow-[0_0_40px_rgba(0,0,0,0.5)] border border-gray-800/60 ring-1 ring-white/5">
                        <img
                            src={property.images[activeImage]}
                            alt="Property view"
                            className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-[1.02]"
                        />
                    </div>

                    {/* Thumbnails */}
                    {property.images.length > 1 && (
                        <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
                            {property.images.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveImage(idx)}
                                    className={`relative h-20 w-32 md:h-24 md:w-36 rounded-2xl overflow-hidden flex-shrink-0 transition-all ${activeImage === idx
                                        ? 'ring-2 ring-[#A855F7] ring-offset-2 ring-offset-[#0B0B13] shadow-lg opacity-100'
                                        : 'opacity-50 hover:opacity-100'
                                        }`}
                                >
                                    <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                    {/* Left Column (Details & Amenities) */}
                    <div className="lg:col-span-2 space-y-12">
                        <section>
                            <h2 className="text-2xl font-bold text-white mb-6 border-b border-gray-800/60 pb-4">{t.aboutThisSpace}</h2>
                            <p className="text-gray-400 leading-relaxed text-lg">
                                {property.description
                                    ? property.description
                                    : language === 'en'
                                        ? `Experience luxury living in the heart of ${property.location}. This beautiful ${property.type?.toLowerCase()} offers panoramic views, modern amenities, and a comfortable stay for you and your family. Fully furnished and ready to move in.`
                                        : `${property.location} के केंद्र में विलासितापूर्ण जीवन का अनुभव करें। यह सुंदर ${property.type?.toLowerCase()} मनोरम दृश्य, आधुनिक सुविधाएं और आपके और आपके परिवार के लिए आरामदायक प्रवास प्रदान करता है। पूरी तरह से सुसज्जित और रहने के लिए तैयार।`}
                            </p>
                            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
                                <div className="bg-[#15161E]/80 backdrop-blur-sm border border-gray-800/60 rounded-2xl p-5 text-center">
                                    <p className="text-2xl font-bold text-white">{property.rooms}</p>
                                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mt-1">{t.roomsLabel}</p>
                                </div>
                                <div className="bg-[#15161E]/80 backdrop-blur-sm border border-gray-800/60 rounded-2xl p-5 text-center">
                                    <p className="text-2xl font-bold text-white">{property.type}</p>
                                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mt-1">{t.typeLabel}</p>
                                </div>
                                <div className="bg-[#15161E]/80 backdrop-blur-sm border border-gray-800/60 rounded-2xl p-5 text-center">
                                    <p className="text-2xl font-bold text-white">₹{Number(property.price).toLocaleString()}</p>
                                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mt-1">{t.perMonthLabel}</p>
                                </div>
                                <div className="bg-[#15161E]/80 backdrop-blur-sm border border-gray-800/60 rounded-2xl p-5 text-center">
                                    <p className="text-xl font-bold text-white truncate px-2" title={property.location}>{property.location}</p>
                                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mt-1">{t.cityLabel}</p>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-6 border-b border-gray-800/60 pb-4">{t.whatOffers}</h2>
                            <div className="grid grid-cols-2 gap-y-6">
                                {property.amenities.map((amenity, idx) => (
                                    <div key={idx} className="flex items-center gap-4 text-gray-300 hover:text-white transition-colors">
                                        {amenity === 'WiFi' && <Wifi className="w-6 h-6 text-[#A855F7]" />}
                                        {amenity === 'Parking' && <Car className="w-6 h-6 text-[#A855F7]" />}
                                        {amenity === 'AC' && <HomeIcon className="w-6 h-6 text-[#A855F7]" />}
                                        {!['WiFi', 'Parking', 'AC'].includes(amenity) && <CheckCircle2 className="w-6 h-6 text-[#A855F7]" />}
                                        <span className="text-lg">{amenity}</span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Location / Map Section */}
                        <section className="bg-[#15161E]/50 rounded-[32px] overflow-hidden border border-gray-800/60">
                            <MapLocation
                                address={property.address}
                                coordinates={property.coordinates}
                                title={t.locationNeighborhood}
                            />
                        </section>

                        {/* Owner Info */}
                        <section>
                            <h2 className="text-2xl font-bold text-white mb-6 border-b border-gray-800/60 pb-4">{t.ownerInfo}</h2>
                            <div className="bg-[#15161E]/80 backdrop-blur-sm border border-gray-800/60 rounded-[32px] p-8 flex flex-col sm:flex-row items-start sm:items-center gap-6">
                                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#9333EA] to-[#3B82F6] flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-purple-900/30 flex-shrink-0 border-2 border-[#15161E] ring-2 ring-purple-500/20">
                                    {ownerName?.charAt(0)?.toUpperCase() || 'O'}
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-xl text-white mb-1">
                                        {ownerName}
                                    </h3>
                                    <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-400">
                                        <span className="flex items-center gap-2"><Mail className="w-4 h-4 text-purple-400" /> {ownerEmail}</span>
                                        <span className="flex items-center gap-2"><Phone className="w-4 h-4 text-green-400" /> {ownerMobile}</span>
                                    </div>
                                    <div className="flex items-center gap-3 mt-4">
                                        <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-green-900/30 text-green-400 border border-green-500/20 px-3 py-1.5 rounded-full">
                                            <Shield className="w-3.5 h-3.5" /> {t.verifiedOwner}
                                        </span>
                                        <span className="text-xs text-gray-500 font-medium">{t.memberSince} 2023</span>
                                    </div>
                                </div>
                                <Button
                                    onClick={() => toggleChat({
                                        id: property.owner?._id || property.hostId,
                                        name: ownerName,
                                        role: 'owner'
                                    })}
                                    variant="outline"
                                    className="gap-2 border-purple-500/30 text-purple-400 hover:bg-purple-900/20 bg-[#1A1C26]/50 rounded-xl px-6 py-5 h-auto transition-colors mt-4 sm:mt-0"
                                >
                                    <MessageSquare size={18} />
                                    {t.chatWithOwner}
                                </Button>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-6 border-b border-gray-800/60 pb-4">{t.availabilityOverview}</h2>
                            <div className="bg-[#15161E]/80 backdrop-blur-sm border border-gray-800/60 rounded-3xl p-6">
                                <AvailabilityCalendar
                                    blockedDates={['2024-07-15', '2024-07-16', '2024-07-17']}
                                    selectedRange={selectedRange}
                                    onSelectRange={setSelectedRange}
                                />
                            </div>
                        </section>
                    </div>

                    {/* Right Column (Booking Card) */}
                    <div className="relative">
                        <div className="sticky top-24 bg-[#15161E]/80 backdrop-blur-xl border border-gray-800/60 rounded-[32px] p-8 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
                            <div className="flex items-end justify-between mb-8">
                                <div>
                                    <span className="text-4xl font-bold text-white">₹{Number(property.price).toLocaleString('en-IN')}</span>
                                    <span className="text-gray-400 font-medium ml-1"> / {language === 'en' ? 'month' : 'माह'}</span>
                                </div>
                            </div>

                            <div className="space-y-6 mb-8">
                                <div className="border border-gray-700/60 rounded-2xl overflow-hidden divide-y divide-gray-700/60 bg-[#1A1C26]/50">
                                    <div className="flex max-sm:flex-col sm:divide-x divide-gray-700/60">
                                        <div className="p-4 w-full cursor-pointer hover:bg-[#1A1C26] transition-colors">
                                            <label className="text-[10px] font-bold uppercase text-gray-500 block mb-1.5">{t.checkIn}</label>
                                            <div className={cn("text-sm", selectedRange.from ? "text-[#A855F7] font-bold" : "text-gray-400")}>
                                                {selectedRange.from ? format(selectedRange.from, 'dd MMM yyyy') : t.addDate}
                                            </div>
                                        </div>
                                        <div className="p-4 w-full cursor-pointer hover:bg-[#1A1C26] transition-colors">
                                            <label className="text-[10px] font-bold uppercase text-gray-500 block mb-1.5">{t.checkOut}</label>
                                            <div className={cn("text-sm", selectedRange.to ? "text-[#A855F7] font-bold" : "text-gray-400")}>
                                                {selectedRange.to ? format(selectedRange.to, 'dd MMM yyyy') : t.addDate}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-4 hover:bg-[#1A1C26] transition-colors cursor-pointer">
                                        <label className="text-[10px] font-bold uppercase text-gray-500 block mb-1.5">{t.guests}</label>
                                        <div className="text-gray-300 text-sm font-medium">{t.oneGuest}</div>
                                    </div>
                                </div>
                            </div>

                            {bookingStatus === 'success' ? (
                                <div className="bg-green-900/20 border border-green-500/30 rounded-3xl p-6 text-center animate-in zoom-in duration-300">
                                    <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                                    <h3 className="text-xl font-bold text-green-400">{t.successBooking}</h3>
                                    <p className="text-sm text-green-300/80 mt-2">{t.successMessage}</p>
                                    <Button variant="outline" className="mt-6 w-full bg-[#1A1C26]/50 border-gray-700 hover:bg-[#1A1C26] text-white" onClick={() => setBookingStatus(null)}>{language === 'en' ? 'Book Again' : 'दोबारा बुक करें'}</Button>
                                </div>
                            ) : bookingStatus === 'error' ? (
                                <div className="bg-red-900/20 border border-red-500/30 rounded-3xl p-6 mb-4 text-center">
                                    <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
                                    <h3 className="font-bold text-red-400">{language === 'en' ? 'Backend Connection Error' : 'बैकएंड कनेक्शन त्रुटि'}</h3>
                                    <p className="text-xs text-red-300/70 mt-2">{language === 'en' ? 'Is the backend server running on port 5000?' : 'क्या बैकएंड सर्वर पोर्ट 5000 पर चल रहा है?'}</p>
                                    <div className="space-y-3 mt-6">
                                        <Button variant="default" className="w-full bg-[#9333EA] hover:bg-[#A855F7]" onClick={handleBooking}>{language === 'en' ? 'Retry Connection' : 'पुनः प्रयास करें'}</Button>
                                        <Button variant="outline" className="w-full bg-[#1A1C26]/50 border-gray-700/50 text-gray-300 hover:bg-[#1A1C26] hover:text-white" onClick={() => {
                                            setBookingStatus('loading');
                                            setTimeout(() => setBookingStatus('success'), 1500);
                                        }}>{language === 'en' ? 'Try Demo Payment' : 'डेमो भुगतान का प्रयास करें'}</Button>
                                    </div>
                                </div>
                            ) : (
                                <Button
                                    size="lg"
                                    className="w-full h-14 text-lg bg-[#9333EA] hover:bg-[#A855F7] shadow-[0_0_15px_rgba(147,51,234,0.3)] hover:shadow-[0_0_25px_rgba(168,85,247,0.5)] flex items-center justify-center gap-2 rounded-2xl text-white font-bold transition-all disabled:opacity-70"
                                    onClick={() => setIsBookingOpen(true)}
                                    disabled={bookingStatus === 'loading'}
                                >
                                    {bookingStatus === 'loading' ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin text-white" />
                                            <span className="text-white">{language === 'en' ? 'Processing...' : 'प्रक्रिया जारी है...'}</span>
                                        </>
                                    ) : (
                                        t.bookNow
                                    )}
                                </Button>
                            )}

                            <Button
                                variant="outline"
                                className="w-full mt-4 h-12 flex items-center justify-center gap-2 rounded-2xl border-gray-700/50 bg-[#1A1C26]/50 hover:bg-[#1A1C26] text-purple-400 transition-colors"
                                onClick={() => toggleChat({
                                    id: property.owner?._id || property.hostId,
                                    name: ownerName,
                                    role: 'owner'
                                })}
                            >
                                <MessageSquare size={18} />
                                <span className="font-semibold">{t.inquiryChat}</span>
                            </Button>

                            <p className="text-center text-xs text-gray-500 mt-6 font-medium">{t.securePayment}</p>
                        </div>
                    </div>
                </div>

                {/* Dynamic Booking Modal (Legacy fallback) */}
                <MultiStepBooking
                    isOpen={isBookingOpen}
                    onClose={() => setIsBookingOpen(false)}
                    property={property}
                    initialRange={selectedRange}
                />

            </div>
        </div>
    );
}
