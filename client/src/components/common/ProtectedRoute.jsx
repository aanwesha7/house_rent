import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';

export default function ProtectedRoute({ children, allowedRoles = [] }) {
    const { isAuthenticated, user, loading, getProfile } = useAuthStore();
    const token = localStorage.getItem('authToken');

    useEffect(() => {
        if (token && !user && !loading) {
            getProfile().catch(() => {});
        }
    }, [token, user, loading, getProfile]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0B0B13] text-white flex items-center justify-center">
                Loading...
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
        return <Navigate to="/" replace />;
    }

    return children;
}
