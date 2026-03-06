import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAppStore from '../store/useAppStore';
import { Upload, X, Home, MapPin, IndianRupee, BedDouble, FileText, Image } from 'lucide-react';
import { translations } from '../data/translations';
import api from '../services/api';
import useAuthStore from '../store/useAuthStore';

export default function AddProperty() {
    const navigate = useNavigate();
    const { addOwnerProperty, language } = useAppStore();
    const { isAuthenticated, user } = useAuthStore();
    const t = translations[language];

    const [form, setForm] = useState({
        title: '',
        city: '',
        price: '',
        bhk: '',
        description: '',
        image: '',
        address: '',
        latitude: '',
        longitude: ''
    });

    const [imagePreview, setImagePreview] = useState(null);
    const [errors, setErrors] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [apiError, setApiError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
                setForm(prev => ({ ...prev, image: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setImagePreview(null);
        setForm(prev => ({ ...prev, image: '' }));
    };

    const validate = () => {
        const newErrors = {};
        if (!form.title.trim()) newErrors.title = t.titleRequired || "Title required";
        if (!form.city.trim()) newErrors.city = t.cityRequired || "City required";
        if (!form.price || Number(form.price) <= 0) newErrors.price = t.validPrice || "Valid price required";
        if (!form.description.trim()) newErrors.description = t.descRequired || "Description required";
        if (!form.address.trim()) newErrors.address = t.addressRequired || "Address required";
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        if (!isAuthenticated || !user) {
            navigate('/login');
            return;
        }

        setApiError('');
        setSubmitting(true);

        const payload = {
            title: form.title,
            city: form.city,
            price: Number(form.price),
            bhk: form.bhk ? `${form.bhk}BHK` : '1BHK',
            description: form.description,
            address: form.address,
            image: form.image || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&fit=crop',
            coordinates: form.latitude && form.longitude ? {
                lat: parseFloat(form.latitude),
                lng: parseFloat(form.longitude)
            } : null,
        };

        try {
            const response = await api.createProperty(payload);
            if (response?.success && response.data) {
                addOwnerProperty({
                    ...response.data,
                    id: response.data._id || response.data.id,
                    location: response.data.city,
                    rooms: response.data.bhk,
                    images: response.data.images?.length ? response.data.images : [response.data.image],
                });
                setSubmitted(true);
                setTimeout(() => {
                    navigate('/owner');
                }, 2000);
                return;
            }

            setApiError(response?.message || 'Failed to add property');
        } catch (error) {
            setApiError(error.message || 'Failed to add property');
        } finally {
            setSubmitting(false);
        }
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-[#0B0B13] relative overflow-hidden font-sans flex items-center justify-center p-4">
                {/* Ambient Background Glows */}
                <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-900/20 blur-[120px] rounded-full mix-blend-screen"></div>
                    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/20 blur-[120px] rounded-full mix-blend-screen"></div>
                </div>

                <div className="container mx-auto max-w-2xl text-center animate-in fade-in relative z-10">
                    <div className="bg-[#15161E]/80 backdrop-blur-xl rounded-3xl border border-green-500/20 p-12 shadow-[0_0_30px_rgba(34,197,94,0.1)]">
                        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(34,197,94,0.3)] border border-green-500/30">
                            <svg className="w-10 h-10 text-green-400 drop-shadow-[0_0_8px_rgba(34,197,94,0.8)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">{t.propertyListedSuccess || "Property Listed Successfully"}</h2>
                        <p className="text-gray-400">{t.redirectingToDashboard || "Redirecting to your dashboard..."}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0B0B13] relative overflow-hidden font-sans py-12">
            {/* Ambient Background Glows */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden flex justify-center">
                <div className="absolute top-0 left-1/4 w-[50%] h-[50%] bg-purple-900/10 blur-[150px] rounded-full"></div>
                <div className="absolute bottom-0 right-1/4 w-[30%] h-[50%] bg-blue-900/10 blur-[150px] rounded-full"></div>
            </div>

            <div className="container mx-auto px-4 max-w-3xl animate-in fade-in relative z-10">
                {/* Header */}
                <div className="mb-8 p-6 bg-[#15161E]/60 backdrop-blur-md rounded-2xl border border-[#A855F7]/20 shadow-[0_0_20px_rgba(168,85,247,0.05)] text-center">
                    <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">{t.addNewProperty || "Add New Property"}</h1>
                    <p className="text-gray-400">{t.propertyDetailsDesc || "Fill in the details below."}</p>
                </div>

                <form onSubmit={handleSubmit} className="bg-[#15161E]/80 backdrop-blur-xl rounded-3xl border border-gray-800/60 p-8 shadow-xl space-y-6">
                    {apiError ? (
                        <div className="p-3 rounded-xl bg-red-900/30 border border-red-500/40 text-red-200 text-sm">
                            {apiError}
                        </div>
                    ) : null}

                    {/* Title */}
                    <div>
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-2">
                            <Home className="w-4 h-4 text-[#A855F7]" /> {t.propertyTitle || "Property Title"}
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            placeholder={t.propertyTitlePlaceholder || "e.g., Luxury Apartment in Downtown"}
                            className={`w-full px-4 py-3 rounded-xl border ${errors.title ? 'border-red-400/50 focus:ring-red-400/50' : 'border-gray-700/50 focus:ring-[#A855F7]/30'} bg-[#1A1C26]/80 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-[#A855F7]/50 transition-all`}
                        />
                        {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title}</p>}
                    </div>

                    {/* City & Price Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-2">
                                <MapPin className="w-4 h-4 text-blue-400" /> {t.city || "City"}
                            </label>
                            <input
                                type="text"
                                name="city"
                                value={form.city}
                                onChange={handleChange}
                                placeholder={t.cityPlaceholder || "Enter city"}
                                className={`w-full px-4 py-3 rounded-xl border ${errors.city ? 'border-red-400/50 focus:ring-red-400/50' : 'border-gray-700/50 focus:ring-[#A855F7]/30'} bg-[#1A1C26]/80 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-[#A855F7]/50 transition-all`}
                            />
                            {errors.city && <p className="text-red-400 text-xs mt-1">{errors.city}</p>}
                        </div>

                        <div>
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-2">
                                <IndianRupee className="w-4 h-4 text-green-400" /> {t.monthlyRent || "Monthly Rent"}
                            </label>
                            <input
                                type="number"
                                name="price"
                                value={form.price}
                                onChange={handleChange}
                                placeholder={t.monthlyRentPlaceholder || "e.g., 25000"}
                                min="0"
                                className={`w-full px-4 py-3 rounded-xl border ${errors.price ? 'border-red-400/50 focus:ring-red-400/50' : 'border-gray-700/50 focus:ring-[#A855F7]/30'} bg-[#1A1C26]/80 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-[#A855F7]/50 transition-all`}
                            />
                            {errors.price && <p className="text-red-400 text-xs mt-1">{errors.price}</p>}
                        </div>
                    </div>

                    {/* BHK */}
                    <div>
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-2">
                            <BedDouble className="w-4 h-4 text-yellow-500" /> {t.bhkType || "BHK Type"}
                        </label>
                        <div className="flex flex-wrap gap-3">
                            {['1', '2', '3', '4', '5+'].map((bhk) => (
                                <button
                                    key={bhk}
                                    type="button"
                                    onClick={() => setForm(prev => ({ ...prev, bhk }))}
                                    className={`px-5 py-2.5 rounded-xl text-sm font-semibold border transition-all ${form.bhk === bhk
                                        ? 'bg-[#9333EA] text-white border-purple-500 shadow-[0_0_15px_rgba(147,51,234,0.4)]'
                                        : 'bg-[#1A1C26]/80 text-gray-400 border-gray-700/50 hover:border-purple-500/50 hover:text-gray-200'
                                        }`}
                                >
                                    {bhk} BHK
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Address */}
                    <div>
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-2">
                            <MapPin className="w-4 h-4 text-red-500" /> {t.addressLabel || "Full Address"}
                        </label>
                        <input
                            type="text"
                            name="address"
                            value={form.address}
                            onChange={handleChange}
                            placeholder={t.addressPlaceholder || "Enter full address"}
                            className={`w-full px-4 py-3 rounded-xl border ${errors.address ? 'border-red-400/50 focus:ring-red-400/50' : 'border-gray-700/50 focus:ring-[#A855F7]/30'} bg-[#1A1C26]/80 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-[#A855F7]/50 transition-all`}
                        />
                        {errors.address && <p className="text-red-400 text-xs mt-1">{errors.address}</p>}
                    </div>

                    {/* Description */}
                    <div>
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-2">
                            <FileText className="w-4 h-4 text-teal-400" /> {t.descriptionLabel || "Description"}
                        </label>
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            placeholder={t.descriptionPlaceholder || "Describe your property..."}
                            rows={4}
                            className={`w-full px-4 py-3 rounded-xl border ${errors.description ? 'border-red-400/50 focus:ring-red-400/50' : 'border-gray-700/50 focus:ring-[#A855F7]/30'} bg-[#1A1C26]/80 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-[#A855F7]/50 transition-all resize-none`}
                        />
                        {errors.description && <p className="text-red-400 text-xs mt-1">{errors.description}</p>}
                    </div>

                    {/* Image Upload */}
                    <div>
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-2">
                            <Image className="w-4 h-4 text-pink-400" /> {t.propertyImage || "Property Image"}
                        </label>
                        {imagePreview ? (
                            <div className="relative w-full h-56 rounded-2xl overflow-hidden border border-gray-700/50 shadow-inner">
                                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                                <button
                                    type="button"
                                    onClick={removeImage}
                                    className="absolute top-3 right-3 bg-red-500/80 hover:bg-red-600 backdrop-blur-md text-white rounded-full p-2 transition-colors shadow-[0_0_10px_rgba(239,68,68,0.5)]"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            <label className="flex flex-col items-center justify-center w-full h-44 rounded-2xl border-2 border-dashed border-gray-700/80 hover:border-[#A855F7] bg-[#1A1C26]/60 cursor-pointer transition-colors group">
                                <div className="p-4 rounded-full bg-purple-900/20 group-hover:bg-purple-900/40 transition-colors mb-3">
                                    <Upload className="w-8 h-8 text-gray-400 group-hover:text-[#A855F7] transition-colors" />
                                </div>
                                <span className="text-sm text-gray-400 group-hover:text-gray-200 transition-colors font-medium">{t.clickToUpload || "Click to upload an image"}</span>
                                <span className="text-xs text-gray-500 mt-1">{t.uploadLimits || "PNG, JPG up to 5MB"}</span>
                                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                            </label>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-4 pt-4 border-t border-gray-800/60 mt-6">
                        <button
                            type="button"
                            onClick={() => navigate('/owner')}
                            className="flex-1 bg-gray-800/50 hover:bg-gray-700 text-gray-300 font-semibold py-3.5 rounded-xl transition-all border border-gray-700/50 hover:border-gray-500 flex items-center justify-center gap-2"
                        >
                            <X className="w-4 h-4" />
                            {t.cancel || "Cancel"}
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="flex-[2] bg-gradient-to-r from-[#9333EA] to-[#A855F7] hover:from-[#A855F7] hover:to-[#9333EA] text-white font-bold py-3.5 rounded-xl transition-all shadow-[0_0_15px_rgba(147,51,234,0.4)] hover:shadow-[0_0_25px_rgba(147,51,234,0.6)] flex items-center justify-center gap-2"
                        >
                            <Upload className="w-5 h-5" />
                            {submitting ? (t.loading || 'Submitting...') : (t.listProperty || 'List Property')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

