import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import ListingsPage from './pages/ListingsPage';
import ListingDetailPage from './pages/ListingDetailPage';
import CategoryPage from './pages/CategoryPage';
import CreateListingPage from './pages/CreateListingPage';
import ProfilePage from './pages/ProfilePage';
import MyListingsPage from './pages/MyListingsPage';
import MessagesPage from './pages/MessagesPage';
import ConversationPage from './pages/ConversationPage';
import AadhaarVerificationPage from './pages/AadhaarVerificationPage';
import ProfileCompletePage from './pages/ProfileCompletePage';
import AdminPage from './pages/AdminPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { useAuthStore } from './store/authStore';
import { ToastContainer } from './components/ui/Toast';

// Create a client
const queryClient = new QueryClient();

function App() {
  // Initialize auth state from localStorage on app load
  const checkAuth = useAuthStore(state => state.checkAuth);
  
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ToastContainer />
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/verify-aadhaar" element={<AadhaarVerificationPage />} />
          <Route path="/listings" element={<ListingsPage />} />
          <Route path="/listings/:id" element={<ListingDetailPage />} />
          <Route path="/category/:categoryName" element={<CategoryPage />} />
          
          {/* Protected routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } />
          <Route path="/my-listings" element={
            <ProtectedRoute>
              <MyListingsPage />
            </ProtectedRoute>
          } />
          <Route path="/messages" element={
            <ProtectedRoute>
              <MessagesPage />
            </ProtectedRoute>
          } />
          <Route path="/messages/:conversationId" element={
            <ProtectedRoute>
              <ConversationPage />
            </ProtectedRoute>
          } />
          <Route path="/listings/create" element={
            <ProtectedRoute>
              <CreateListingPage />
            </ProtectedRoute>
          } />
          <Route path="/aadhaar-verification" element={
            <ProtectedRoute>
              <AadhaarVerificationPage />
            </ProtectedRoute>
          } />
          <Route path="/profile-complete" element={
            <ProtectedRoute>
              <ProfileCompletePage />
            </ProtectedRoute>
          } />
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminPage />
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;