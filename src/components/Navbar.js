import React, { useState, useEffect } from 'react';
import { useCart } from '../contexts/CartContext';
import './Navbar.css';

const Navbar = ({ setCurrentPage, isAdmin }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { getCartItemCount, toggleCart } = useCart();

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (hash === 'contact') {
        setCurrentPage('contact');
      } else if (hash === 'admin' || hash === 'admin/login') {
        if (isAdmin) {
          setCurrentPage('admin');
        } else {
          setCurrentPage('admin-login');
        }
      } else {
        setCurrentPage('home');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [setCurrentPage, isAdmin]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleNavClick = (hash) => {
    window.location.hash = hash;
    closeMenu();
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <a 
          href="#home" 
          className="navbar-logo" 
          onClick={(e) => {
            e.preventDefault();
            handleNavClick('home');
          }}
        >
          <h2>ZOHIR SHOP</h2>
        </a>
        
        {/* Hamburger Button for Mobile and Cart */}
        <div className="navbar-actions">
          {/* Cart Button - Always visible */}
          <button
            className="cart-button"
            onClick={() => {
              toggleCart();
              closeMenu();
            }}
            aria-label="Shopping cart"
          >
            <svg className="cart-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="m1 1 4 4h15l-1 7H6"></path>
            </svg>
            {getCartItemCount() > 0 && (
              <span className="cart-count">{getCartItemCount()}</span>
            )}
          </button>

          <button 
            className={`hamburger ${isMenuOpen ? 'active' : ''}`}
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>

        {/* Menu */}
        <div className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          <a 
            href="#home" 
            className="navbar-link"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('home');
            }}
          >
            Home
          </a>
          <a 
            href="#products" 
            className="navbar-link"
            onClick={closeMenu}
          >
            Subscriptions
          </a>
          <a 
            href="#contact" 
            className="navbar-link"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('contact');
            }}
          >
            Contact Us
          </a>
          
          {isAdmin ? (
            <>
              <a 
                href="#admin" 
                className="navbar-link"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick('admin');
                }}
              >
                Admin
              </a>
            </>
          ) : (
            <a 
              href="#admin/login" 
              className="navbar-link"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('admin/login');
              }}
            >
              Admin Login
            </a>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
