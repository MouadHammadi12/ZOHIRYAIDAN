import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import './Navbar.css';

const Navbar = ({ isAdmin }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { getCartItemCount, toggleCart } = useCart();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleCartClick = () => {
    toggleCart();
    closeMenu();
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link
          to="/"
          className="navbar-logo"
          onClick={closeMenu}
        >
          <h2>ZOHIR SHOP</h2>
        </Link>

        {/* Hamburger Button for Mobile and Cart */}
        <div className="navbar-actions">
          {/* Cart Button - Always visible */}
          <button
            className="cart-button"
            onClick={handleCartClick}
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
          <Link
            to="/"
            className="navbar-link"
            onClick={closeMenu}
          >
            Home
          </Link>
          <a
            href="#products"
            className="navbar-link"
            onClick={closeMenu}
          >
            Subscriptions
          </a>
          <Link
            to="/contact"
            className="navbar-link"
            onClick={closeMenu}
          >
            Contact Us
          </Link>

          {isAdmin ? (
            <Link
              to="/admin"
              className="navbar-link"
              onClick={closeMenu}
            >
              Admin
            </Link>
          ) : (
            <Link
              to="/admin/login"
              className="navbar-link"
              onClick={closeMenu}
            >
              Admin Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
