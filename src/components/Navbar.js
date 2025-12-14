import React, { useState, useEffect } from 'react';
import './Navbar.css';

const Navbar = ({ setCurrentPage, isAdmin }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
        
        {/* Hamburger Button for Mobile */}
        <button 
          className={`hamburger ${isMenuOpen ? 'active' : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

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
