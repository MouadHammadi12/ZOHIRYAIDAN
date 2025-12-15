import React, { useState, useEffect } from 'react';
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

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check if admin is logged in
    const checkAdminStatus = () => {
      const adminLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';
      setIsAdmin(adminLoggedIn);
      return adminLoggedIn;
    };

    // Handle hash changes
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      const loggedIn = checkAdminStatus();
      
      if (hash === 'contact') {
        setCurrentPage('contact');
      } else if (hash === 'admin' || hash === 'admin/login') {
        if (loggedIn) {
          setCurrentPage('admin');
        } else {
          setCurrentPage('admin-login');
        }
      } else {
        setCurrentPage('home');
      }
    };

    // Check initial hash
    handleHashChange();

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);

    // Listen for storage changes (when admin logs in/out in another tab)
    const handleStorageChange = (e) => {
      if (e.key === 'adminLoggedIn') {
        checkAdminStatus();
      }
    };
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleAdminLogin = (loggedIn) => {
    setIsAdmin(loggedIn);
    if (loggedIn) {
      setCurrentPage('admin');
      window.location.hash = 'admin';
    }
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('adminLoggedIn');
    setIsAdmin(false);
    setCurrentPage('home');
    window.location.hash = 'home';
  };

  const renderPage = () => {
    if (currentPage === 'admin-login') {
      return <AdminLogin onLogin={handleAdminLogin} />;
    }
    if (currentPage === 'admin') {
      if (!isAdmin) {
        // Redirect to login if not admin
        setCurrentPage('admin-login');
        window.location.hash = 'admin/login';
        return <AdminLogin onLogin={handleAdminLogin} />;
      }
      return <AdminDashboard onLogout={handleAdminLogout} />;
    }
    if (currentPage === 'contact') {
      return <Contact />;
    }
    return <Home />;
  };

  return (
    <ProductsProvider>
      <CartProvider>
        <div className="App">
          <Navbar setCurrentPage={setCurrentPage} isAdmin={isAdmin} />
          {renderPage()}
          {currentPage !== 'admin' && currentPage !== 'admin-login' && <Footer />}
          <Cart />
        </div>
      </CartProvider>
    </ProductsProvider>
  );
}

export default App;
