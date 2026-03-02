import React from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Home, IndianRupee, Star, TrendingUp, Plus } from 'lucide-react';
import useAppStore from '../store/useAppStore';
import { translations } from '../data/translations';

const COLORS = ['#9333EA', '#3B82F6', '#10B981', '#F59E0B'];

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-[#15161E]/90 backdrop-blur-md border border-[#A855F7]/30 p-3 rounded-lg shadow-[0_0_15px_rgba(168,85,247,0.2)]">
                <p className="text-gray-300 mb-1">{`${label}`}</p>
                <p className="text-white font-bold">{`${payload[0].name}: ${payload[0].value}`}</p>
            </div>
        );
    }
    return null;
};

export default function OwnerHome() {
    const { user, ownerProperties, language } = useAppStore();
    const t = translations[language];

    const monthlyBookings = [
        { name: language === 'en' ? 'Jan' : 'जन', bookings: 12 },
        { name: language === 'en' ? 'Feb' : 'फर', bookings: 19 },
        { name: language === 'en' ? 'Mar' : 'मार्च', bookings: 15 },
        { name: language === 'en' ? 'Apr' : 'अप्रैल', bookings: 22 },
        { name: language === 'en' ? 'May' : 'मई', bookings: 28 },
        { name: language === 'en' ? 'Jun' : 'जून', bookings: 24 },
    ];

    const roomDistribution = [
        { name: '1BHK', value: 3 },
        { name: '2BHK', value: 8 },
        { name: '3BHK', value: 5 },
        { name: 'Villa', value: 2 },
    ];

    return (
        <div className="min-h-screen bg-[#0B0B13] relative overflow-hidden font-sans">
            {/* Ambient Background Glows */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-purple-900/10 blur-[120px] rounded-full mix-blend-screen"></div>
                <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-blue-900/10 blur-[120px] rounded-full mix-blend-screen"></div>
            </div>

            <div className="container mx-auto px-4 py-8 max-w-7xl animate-in fade-in relative z-10">
                <div className="mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 bg-[#15161E]/60 backdrop-blur-md rounded-2xl border border-[#A855F7]/20 shadow-[0_0_20px_rgba(168,85,247,0.05)]">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-1">
                            {language === 'en' ? `Welcome back, ${user?.name || 'Owner'}!` : `वापसी पर स्वागत है, ${user?.name || 'मालिक'}!`}
                        </h1>
                        <p className="text-gray-400">{t.ownerDashboard || "Owner Dashboard"}</p>
                    </div>
                    <Link to="/owner/add-property">
                        <button className="flex items-center gap-2 bg-gradient-to-r from-[#9333EA] to-[#A855F7] hover:from-[#A855F7] hover:to-[#9333EA] text-white font-bold py-3 px-6 rounded-xl transition-all shadow-[0_0_15px_rgba(147,51,234,0.4)] hover:shadow-[0_0_25px_rgba(147,51,234,0.6)] border border-purple-400/20 text-sm">
                            <Plus className="w-5 h-5" /> {t.addProperty || "Add Property"}
                        </button>
                    </Link>
                </div>

                {/* Stat Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {[
                        { title: t.totalProperties || "Total Properties", value: String(18 + ownerProperties.length), icon: Home, color: 'text-blue-400', bg: 'bg-blue-900/20', border: 'border-blue-500/20' },
                        { title: t.totalBookingsStat || "Total Bookings", value: '120', icon: TrendingUp, color: 'text-green-400', bg: 'bg-green-900/20', border: 'border-green-500/20' },
                        { title: t.rentCollected || "Rent Collected", value: language === 'en' ? '₹4.2L' : '₹4.2 लाख', icon: IndianRupee, color: 'text-purple-400', bg: 'bg-purple-900/20', border: 'border-purple-500/20' },
                        { title: t.avgRating || "Avg Rating", value: '4.8', icon: Star, color: 'text-yellow-400', bg: 'bg-yellow-900/20', border: 'border-yellow-500/20' },
                    ].map((stat, i) => {
                        const Icon = stat.icon;
                        return (
                            <div key={i} className={`bg-[#15161E]/80 backdrop-blur-xl p-6 rounded-2xl border ${stat.border} shadow-[0_4px_20px_rgba(0,0,0,0.3)] flex items-center gap-4 hover:-translate-y-1 transition-transform duration-300`}>
                                <div className={`p-4 rounded-xl ${stat.bg} ${stat.color} shadow-inner flex items-center justify-center`}>
                                    <Icon className="w-6 h-6 drop-shadow-md" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-400 mb-1">{stat.title}</p>
                                    <h3 className="text-3xl font-bold text-white tracking-tight">{stat.value}</h3>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Owner's Listed Properties */}
                {ownerProperties.length > 0 && (
                    <div className="mb-8 p-6 bg-[#15161E]/60 backdrop-blur-md border border-gray-800/60 rounded-3xl shadow-[0_4px_25px_rgba(0,0,0,0.4)]">
                        <h2 className="text-xl font-bold text-white mb-6 border-b border-gray-800/60 pb-4 inline-block">{t.yourListedProperties || "Your Listed Properties"}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {ownerProperties.map((prop) => (
                                <div key={prop.id} className="bg-[#1A1C26]/80 rounded-2xl border border-gray-700/50 shadow-md overflow-hidden group hover:border-[#A855F7]/40 transition-all hover:shadow-[0_0_20px_rgba(168,85,247,0.15)] flex flex-col">
                                    <div className="h-48 overflow-hidden relative">
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1C26] via-transparent to-transparent z-10" />
                                        <img src={prop.image} alt={prop.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                        <div className="absolute top-3 right-3 z-20 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white border border-gray-600/50">
                                            {prop.bhk} BHK
                                        </div>
                                    </div>
                                    <div className="p-5 flex flex-col flex-1">
                                        <h3 className="font-bold text-lg text-white mb-2 line-clamp-1 group-hover:text-[#A855F7] transition-colors">{prop.title}</h3>
                                        <p className="text-sm text-gray-400 flex items-center gap-1.5 mb-4">
                                            <span className="text-blue-400">📍</span> {prop.city}
                                        </p>
                                        <div className="mt-auto pt-4 border-t border-gray-700/50 flex justify-between items-center">
                                            <p className="text-[#A855F7] font-bold text-xl drop-shadow-[0_0_5px_rgba(168,85,247,0.3)]">
                                                ₹{Number(prop.price).toLocaleString(language === 'en' ? 'en-IN' : 'hi-IN')}
                                                <span className="text-sm font-normal text-gray-500 ml-1">/{language === 'en' ? 'mo' : 'माह'}</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    <div className="bg-[#15161E]/80 backdrop-blur-xl p-6 rounded-3xl border border-gray-800/60 shadow-[0_4px_25px_rgba(0,0,0,0.4)] relative group overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#9333EA]/5 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <h2 className="text-xl font-bold text-white mb-6 border-b border-gray-800/60 pb-4 inline-block">{t.bookingsByMonth || "Bookings by Month"}</h2>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={monthlyBookings} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <XAxis dataKey="name" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(147, 51, 234, 0.1)' }} />
                                    <Bar dataKey="bookings" fill="#A855F7" radius={[4, 4, 0, 0]} barSize={30}>
                                        {monthlyBookings.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={'url(#colorBookings)'} />
                                        ))}
                                    </Bar>
                                    <defs>
                                        <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#A855F7" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#9333EA" stopOpacity={0.2} />
                                        </linearGradient>
                                    </defs>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="bg-[#15161E]/80 backdrop-blur-xl p-6 rounded-3xl border border-gray-800/60 shadow-[0_4px_25px_rgba(0,0,0,0.4)] relative group overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-bl from-blue-500/5 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <h2 className="text-xl font-bold text-white mb-6 border-b border-gray-800/60 pb-4 inline-block">{t.propertyTypesDistribution || "Property Types"}</h2>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={roomDistribution}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={80}
                                        outerRadius={110}
                                        paddingAngle={5}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {roomDistribution.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} className="hover:opacity-80 transition-opacity cursor-pointer" />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend verticalAlign="bottom" height={36} iconType="circle" formatter={(value) => <span className="text-gray-300 ml-1">{value}</span>} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
