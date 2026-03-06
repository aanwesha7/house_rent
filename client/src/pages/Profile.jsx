import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';

export default function Profile() {
	const navigate = useNavigate();
	const { user, isAuthenticated, getProfile, loading, error, logout } = useAuthStore();

	useEffect(() => {
		if (!isAuthenticated) {
			navigate('/login');
			return;
		}

		getProfile().catch(() => {});
	}, [isAuthenticated, navigate, getProfile]);

	if (!isAuthenticated) {
		return null;
	}

	return (
		<div className="min-h-screen bg-[#0B0B13] text-white p-6">
			<div className="max-w-2xl mx-auto bg-[#15161E]/90 border border-gray-800/60 rounded-2xl p-6">
				<h1 className="text-2xl font-bold mb-4">My Profile</h1>

				{loading ? <p className="text-gray-400">Loading profile...</p> : null}
				{error ? <p className="text-red-400 mb-3">{error}</p> : null}

				<div className="space-y-3 text-gray-200">
					<p><span className="text-gray-400">Name:</span> {user?.name || '-'}</p>
					<p><span className="text-gray-400">Email:</span> {user?.email || '-'}</p>
					<p><span className="text-gray-400">Mobile:</span> {user?.mobile || '-'}</p>
					<p><span className="text-gray-400">Role:</span> {user?.role || '-'}</p>
				</div>

				<div className="mt-6 flex gap-3">
					<Link
						to={user?.role === 'admin' ? '/admin' : user?.role === 'owner' ? '/owner' : '/renter'}
						className="px-4 py-2 rounded-lg bg-[#9333EA] hover:bg-[#A855F7] transition-colors"
					>
						Go to Dashboard
					</Link>
					<button
						onClick={() => {
							logout();
							navigate('/');
						}}
						className="px-4 py-2 rounded-lg bg-red-500/20 text-red-300 border border-red-500/40 hover:bg-red-500/30 transition-colors"
					>
						Logout
					</button>
				</div>
			</div>
		</div>
	);
}
