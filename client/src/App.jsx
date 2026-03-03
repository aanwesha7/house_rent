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
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import TermsAndConditions from './pages/TermsAndConditions';
import PrivacyPolicy from './pages/PrivacyPolicy';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/signup" element={<SignUp />} />
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="properties" element={<AllProperties />} />
                    <Route path="properties/:id" element={<PropertyDetails />} />
                    <Route path="compare" element={<CompareProperties />} />
                    <Route path="about" element={<AboutUs />} />
                    <Route path="contact" element={<ContactUs />} />
                    <Route path="terms" element={<TermsAndConditions />} />
                    <Route path="privacy" element={<PrivacyPolicy />} />

                    <Route path="renter" element={<RenterHome />} />
                    <Route path="owner" element={<OwnerHome />} />
                    <Route path="owner/add-property" element={<AddProperty />} />
                    <Route path="admin" element={<AdminHome />} />
                    <Route path="profile" element={<Profile />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
