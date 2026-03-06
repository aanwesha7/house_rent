import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/common/Layout';
import Home from './pages/Home';
import AllProperties from './pages/AllProperties';
import PropertyDetails from './pages/PropertyDetails';
import CompareProperties from './pages/CompareProperties';
import OwnerHome from './pages/OwnerHome';
import AdminHome from './pages/AdminHome';
import RenterHome from './pages/RenterHome';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import AddProperty from './pages/AddProperty';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import ForgotPassword from './pages/ForgotPassword';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import TermsAndConditions from './pages/TermsAndConditions';
import PrivacyPolicy from './pages/PrivacyPolicy';
import ProtectedRoute from './components/common/ProtectedRoute';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/signup" element={<SignUp />} />
                <Route path="/login" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="properties" element={<AllProperties />} />
                    <Route path="properties/:id" element={<PropertyDetails />} />
                    <Route path="compare" element={<CompareProperties />} />
                    <Route path="about" element={<AboutUs />} />
                    <Route path="contact" element={<ContactUs />} />
                    <Route path="terms" element={<TermsAndConditions />} />
                    <Route path="privacy" element={<PrivacyPolicy />} />

                    <Route path="renter" element={<ProtectedRoute allowedRoles={['renter', 'owner', 'admin']}><RenterHome /></ProtectedRoute>} />
                    <Route path="owner" element={<ProtectedRoute allowedRoles={['owner', 'admin']}><OwnerHome /></ProtectedRoute>} />
                    <Route path="owner/add-property" element={<ProtectedRoute allowedRoles={['owner', 'admin']}><AddProperty /></ProtectedRoute>} />
                    <Route path="admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminHome /></ProtectedRoute>} />
                    <Route path="profile" element={<ProtectedRoute allowedRoles={['renter', 'owner', 'admin']}><Profile /></ProtectedRoute>} />
                    <Route path="settings" element={<ProtectedRoute allowedRoles={['renter', 'owner', 'admin']}><Settings /></ProtectedRoute>} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
