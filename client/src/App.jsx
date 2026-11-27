import React, { useEffect, useRef } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CompareProvider } from './context/CompareContext';
import { WishlistProvider } from './context/WishlistContext';
import { trackPageView } from './utils/analytics';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import CompareModal from './components/CompareModal';
import ChatDrawer from './components/ChatDrawer';
import ConsentBanner from './components/ConsentBanner';

// Pages
import HomePage from './pages/HomePage';
import ExplorePage from './pages/ExplorePage';
import PropertyDetailPage from './pages/PropertyDetailPage';
import PostPropertyPage from './pages/PostPropertyPage';
import HraCalculatorPage from './pages/HraCalculatorPage';
import AgreementGeneratorPage from './pages/AgreementGeneratorPage';
import MoveInChecklistPage from './pages/MoveInChecklistPage';
import DashboardPage from './pages/DashboardPage';
import RoommatesPage from './pages/RoommatesPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AuthPage from './pages/AuthPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsPage from './pages/TermsPage';

function AppContent() {
  const { isChatOpen, setIsChatOpen, isAuthenticated } = useAuth();
  const location = useLocation();
  const lastTrackedPathRef = useRef(`${window.location.pathname}${window.location.search}`);

  useEffect(() => {
    const currentPath = `${location.pathname}${location.search}`;
    if (lastTrackedPathRef.current === currentPath) {
      return;
    }
    lastTrackedPathRef.current = currentPath;
    trackPageView(currentPath);
  }, [location.pathname, location.search]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: '#0f172a',
            color: '#fff',
            fontSize: '12px',
            fontWeight: '600',
            borderRadius: '12px',
          },
        }}
      />

      <Navbar />

      <main className="flex-grow p-2">
        <Routes>
          {/* Publicly Crawlable SEO Pages */}
          <Route path="/" element={<HomePage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/tools/hra-calculator" element={<HraCalculatorPage />} />
          <Route path="/tools/rental-agreement" element={<AgreementGeneratorPage />} />
          <Route path="/tools/move-in-checklist" element={<MoveInChecklistPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/register" element={<AuthPage />} />

          {/* Protected Application Routes: Require Login to view property lists, details, or manage listings */}
          <Route path="/explore" element={!isAuthenticated ? <Navigate to="/login" replace /> : <ExplorePage />} />
          <Route path="/roommates" element={!isAuthenticated ? <Navigate to="/login" replace /> : <RoommatesPage />} />
          <Route path="/property/:idOrSlug" element={!isAuthenticated ? <Navigate to="/login" replace /> : <PropertyDetailPage />} />
          <Route path="/post-property" element={!isAuthenticated ? <Navigate to="/login" replace /> : <PostPropertyPage />} />
          <Route path="/edit-property/:id" element={!isAuthenticated ? <Navigate to="/login" replace /> : <PostPropertyPage />} />
          <Route path="/dashboard" element={!isAuthenticated ? <Navigate to="/login" replace /> : <DashboardPage />} />
          <Route path="/admin" element={!isAuthenticated ? <Navigate to="/login" replace /> : <AdminDashboardPage />} />

          {/* Fallback unknown route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />
      <AuthModal />
      <CompareModal />
      <ChatDrawer isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      <ConsentBanner />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <WishlistProvider>
        <CompareProvider>
          <AppContent />
        </CompareProvider>
      </WishlistProvider>
    </AuthProvider>
  );
}

export default App;
