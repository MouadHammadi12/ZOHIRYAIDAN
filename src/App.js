import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Contact from './pages/Contact';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import Footer from './components/Footer';
import Cart from './components/Cart';
import { ProductsProvider } from './contexts/ProductsContext';
import { CartProvider } from './contexts/CartContext';
import './App.css';

// Protected Route component for admin routes
const ProtectedRoute = ({ children, isAdmin }) => {
  return isAdmin ? children : <Navigate to="/admin/login" replace />;
};

function App() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check if admin is logged in
    const checkAdminStatus = () => {
      const adminLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';
      setIsAdmin(adminLoggedIn);
    };

    checkAdminStatus();

    // Listen for storage changes (when admin logs in/out in another tab)
    const handleStorageChange = (e) => {
      if (e.key === 'adminLoggedIn') {
        checkAdminStatus();
      }
    };
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleAdminLogin = (loggedIn) => {
    setIsAdmin(loggedIn);
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('adminLoggedIn');
    setIsAdmin(false);
  };

  return (
    <Router>
      <ProductsProvider>
        <CartProvider>
          <div className="App">
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
    </Router>
  );
}

export default App;
