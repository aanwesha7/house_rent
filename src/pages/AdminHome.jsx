import React from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Users, Home, TrendingUp, AlertCircle } from 'lucide-react';
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

export default function AdminHome() {
    const { user, language } = useAppStore();
    const t = translations[language];

    const totalBookingsByDate = [
        { name: language === 'en' ? '10 Jun' : '10 जून', total: 45 },
        { name: language === 'en' ? '11 Jun' : '11 जून', total: 52 },
        { name: language === 'en' ? '12 Jun' : '12 जून', total: 38 },
        { name: language === 'en' ? '13 Jun' : '13 जून', total: 65 },
        { name: language === 'en' ? '14 Jun' : '14 जून', total: 48 },
        { name: language === 'en' ? '15 Jun' : '15 जून', total: 72 },
    ];

    const usersByRole = [
        { name: t.renters || "Renters", value: 850 },
        { name: t.owners || "Owners", value: 150 },
        { name: t.admins || "Admins", value: 5 },
    ];

    const propertiesAdded = [
        { month: language === 'en' ? 'Jan' : 'जन', count: 20 },
        { month: language === 'en' ? 'Feb' : 'फर', count: 35 },
        { month: language === 'en' ? 'Mar' : 'मार्च', count: 45 },
        { month: language === 'en' ? 'Apr' : 'अप्रैल', count: 80 },
        { month: language === 'en' ? 'May' : 'मई', count: 120 },
        { month: language === 'en' ? 'Jun' : 'जून', count: 160 },
    ];

    return (
        <div className="min-h-screen bg-[#0B0B13] relative overflow-hidden font-sans">
            {/* Ambient Background Glows */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden flex justify-center">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-900/10 blur-[150px] rounded-full mix-blend-screen"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-900/10 blur-[150px] rounded-full mix-blend-screen"></div>
            </div>

            <div className="container mx-auto px-4 py-8 max-w-7xl animate-in fade-in relative z-10">
                <div className="mb-8 flex justify-between items-end p-6 bg-[#15161E]/60 backdrop-blur-md rounded-2xl border border-[#A855F7]/20 shadow-[0_0_20px_rgba(168,85,247,0.05)]">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">
                            {language === 'en' ? `Welcome back, ${user?.name || 'Admin'}!` : `वापसी पर स्वागत है, ${user?.name || 'एडमिन'}!`}
                        </h1>
                        <p className="text-gray-400">{t.superAdminDashboard || "Super Admin Dashboard"}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    {[
                        { title: t.totalUsers || "Total Users", value: '1,005', icon: Users, color: 'text-purple-400', bg: 'bg-purple-900/20', border: 'border-purple-500/20' },
                        { title: t.listedProperties || "Listed Properties", value: '462', icon: Home, color: 'text-blue-400', bg: 'bg-blue-900/20', border: 'border-blue-500/20' },
                        { title: t.platformRevenue || "Platform Revenue", value: language === 'en' ? '₹1.2M' : '₹1.2 मि.', icon: TrendingUp, color: 'text-green-400', bg: 'bg-green-900/20', border: 'border-green-500/20' },
                        { title: t.activeReports || "Active Reports", value: '14', icon: AlertCircle, color: 'text-pink-400', bg: 'bg-pink-900/20', border: 'border-pink-500/20' },
                    ].map((stat, i) => {
                        const Icon = stat.icon;
                        return (
                            <div key={i} className={`bg-[#15161E]/80 backdrop-blur-xl p-6 rounded-3xl border ${stat.border} shadow-[0_8px_30px_rgba(0,0,0,0.5)] flex items-center gap-4 hover:-translate-y-1 transition-transform duration-300 relative overflow-hidden group`}>
                                <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full ${stat.bg} mix-blend-screen opacity-50 group-hover:scale-150 transition-transform duration-500 pointer-events-none`}></div>
                                <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} shadow-inner flex items-center justify-center relative z-10 border ${stat.border}`}>
                                    <Icon className="w-7 h-7 drop-shadow-md" />
                                </div>
                                <div className="relative z-10">
                                    <p className="text-sm font-medium text-gray-400 mb-1">{stat.title}</p>
                                    <h3 className="text-3xl font-bold text-white tracking-tight">{stat.value}</h3>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                    {/* Line Chart */}
                    <div className="lg:col-span-2 bg-[#15161E]/80 backdrop-blur-xl p-6 lg:p-8 rounded-3xl border border-gray-800/60 shadow-[0_8px_30px_rgba(0,0,0,0.5)] relative group overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#A855F7]/5 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <h2 className="text-xl font-bold text-white mb-6 border-b border-gray-800/60 pb-4 inline-block">{t.propertiesGrowthTrend || "Properties Growth"}</h2>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={propertiesAdded} margin={{ top: 10, right: 30, left: -20, bottom: 0 }}>
                                    <XAxis dataKey="month" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Line type="monotone" dataKey="count" stroke="#A855F7" strokeWidth={4} dot={{ r: 6, fill: '#15161E', stroke: '#A855F7', strokeWidth: 2 }} activeDot={{ r: 8, fill: '#A855F7', stroke: '#fff', strokeWidth: 2 }} className="drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Pie Chart */}
                    <div className="bg-[#15161E]/80 backdrop-blur-xl p-6 lg:p-8 rounded-3xl border border-gray-800/60 shadow-[0_8px_30px_rgba(0,0,0,0.5)] flex flex-col items-center relative group overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-bl from-blue-500/5 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <h2 className="text-xl font-bold text-white mb-2 self-start border-b border-gray-800/60 pb-4 w-full">{t.usersByRole || "Users By Role"}</h2>
                        <div className="h-72 w-full mt-auto">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={usersByRole}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={70}
                                        outerRadius={100}
                                        paddingAngle={5}
                                        dataKey="value"
                                        stroke="none"
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                        labelLine={false}
                                    >
                                        {usersByRole.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} className="hover:opacity-80 transition-opacity cursor-pointer" />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip />} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Bar Chart */}
                    <div className="lg:col-span-3 bg-[#15161E]/80 backdrop-blur-xl p-6 lg:p-8 rounded-3xl border border-gray-800/60 shadow-[0_8px_30px_rgba(0,0,0,0.5)] relative group overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/5 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <h2 className="text-xl font-bold text-white mb-6 border-b border-gray-800/60 pb-4 inline-block">{t.dailyBookingVolume || "Daily Booking Volume"}</h2>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={totalBookingsByDate} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <XAxis dataKey="name" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(16, 185, 129, 0.1)' }} />
                                    <Bar dataKey="total" fill="#10B981" radius={[6, 6, 0, 0]} barSize={40}>
                                        {totalBookingsByDate.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={'url(#colorDaily)'} />
                                        ))}
                                    </Bar>
                                    <defs>
                                        <linearGradient id="colorDaily" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#059669" stopOpacity={0.2} />
                                        </linearGradient>
                                    </defs>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
