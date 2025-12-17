import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Contact from './pages/Contact';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import Footer from './components/Footer';
import Cart from './components/Cart';
import { ProductsProvider } from './contexts/ProductsContext';
import { CartProvider } from './contexts/CartContext';
import { LanguageProvider } from './contexts/LanguageContext';
import './App.css';

// Protected Route component for admin routes
const ProtectedRoute = ({ children, isAdmin }) => {
  return isAdmin ? children : <Navigate to="/admin/login" replace />;
};

// Scroll to top on route change (except when we handle custom scroll like Subscriptions)
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);

  return null;
};

// Session timeout: 30 minutes (1800000 ms)
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

// Check if admin session is still valid
const checkSession = () => {
  const adminLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';
  const loginTime = localStorage.getItem('adminLoginTime');
  
  if (!adminLoggedIn || !loginTime) {
    return false;
  }

  const now = Date.now();
  const timeElapsed = now - parseInt(loginTime, 10);
  
  // If session expired, clear it
  if (timeElapsed > SESSION_TIMEOUT) {
    localStorage.removeItem('adminLoggedIn');
    localStorage.removeItem('adminLoginTime');
    return false;
  }
  
  return true;
};

function App() {
  const [isAdmin, setIsAdmin] = useState(() => {
    return checkSession();
  });

  useEffect(() => {
    // Check session on mount and periodically
    const interval = setInterval(() => {
      const isValid = checkSession();
      if (!isValid && isAdmin) {
        setIsAdmin(false);
        // Redirect to login if on admin page
        if (window.location.pathname.startsWith('/admin')) {
          window.location.href = '/admin/login';
        }
      }
    }, 60000); // Check every minute

    // Listen for storage changes (when admin logs in/out in another tab)
    const handleStorageChange = (e) => {
      if (e.key === 'adminLoggedIn' || e.key === 'adminLoginTime') {
        const isValid = checkSession();
        setIsAdmin(isValid);
      }
    };
    window.addEventListener('storage', handleStorageChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [isAdmin]);

  const handleAdminLogin = (loggedIn) => {
    setIsAdmin(loggedIn);
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('adminLoggedIn');
    localStorage.removeItem('adminLoginTime');
    setIsAdmin(false);
  };

  return (
    <Router>
      <LanguageProvider>
        <ProductsProvider>
          <CartProvider>
            <div className="App">
              <ScrollToTop />
              <Navbar isAdmin={isAdmin} />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/contact" element={<Contact />} />
                <Route
                  path="/admin/login"
                  element={<AdminLogin onLogin={handleAdminLogin} />}
                />
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute isAdmin={isAdmin}>
                      <AdminDashboard onLogout={handleAdminLogout} />
                    </ProtectedRoute>
                  }
                />
                {/* Redirect any unknown routes to home */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
              <Footer />
              <Cart />
            </div>
          </CartProvider>
        </ProductsProvider>
      </LanguageProvider>
    </Router>
  );
}

export default App;
