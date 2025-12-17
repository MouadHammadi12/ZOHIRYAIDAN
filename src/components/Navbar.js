import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useLanguage } from '../contexts/LanguageContext';
import './Navbar.css';

const Navbar = ({ isAdmin }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const { getCartItemCount, toggleCart } = useCart();
  const { language, changeLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

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

  const handleHomeClick = (e) => {
    e.preventDefault();
    closeMenu();

    if (location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/');
    }
  };

  const handleSubscriptionsClick = (e) => {
    e.preventDefault();
    closeMenu();

    const scrollToSubscriptions = () => {
      const section = document.getElementById('products');
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };

    if (window.location.pathname !== '/') {
      navigate('/');
      // ntaqlo l home w mn b3d nscrolliw
      setTimeout(scrollToSubscriptions, 0);
    } else {
      scrollToSubscriptions();
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link
          to="/"
          className="navbar-logo"
          onClick={closeMenu}
        >
          <h2>ZOHAIR SHOP</h2>
        </Link>

        {/* Hamburger Button for Mobile and Cart */}
        <div className="navbar-actions">
          {/* Language Toggle - Small Dropdown */}
          <div className="language-toggle">
            <button
              className="lang-btn-small"
              onClick={() => setShowLangMenu(!showLangMenu)}
              aria-label="Change language"
            >
              {language === 'en' && '🇬🇧'}
              {language === 'fr' && '🇫🇷'}
              {language === 'ar' && '🇲🇦'}
            </button>
            {showLangMenu && (
              <div className="lang-menu-small" onClick={() => setShowLangMenu(false)}>
                <button
                  className={`lang-option-small ${language === 'en' ? 'active' : ''}`}
                  onClick={() => {
                    changeLanguage('en');
                    setShowLangMenu(false);
                  }}
                >
                  🇬🇧 EN
                </button>
                <button
                  className={`lang-option-small ${language === 'fr' ? 'active' : ''}`}
                  onClick={() => {
                    changeLanguage('fr');
                    setShowLangMenu(false);
                  }}
                >
                  🇫🇷 FR
                </button>
                <button
                  className={`lang-option-small ${language === 'ar' ? 'active' : ''}`}
                  onClick={() => {
                    changeLanguage('ar');
                    setShowLangMenu(false);
                  }}
                >
                  🇲🇦 AR
                </button>
              </div>
            )}
          </div>

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
          {/* Language Toggle for Mobile */}
          <div className="language-toggle-mobile">
            <div className="lang-label-mobile">{t('nav.language') || 'Language'}:</div>
            <div className="lang-buttons-mobile">
              <button
                className={`lang-btn-mobile ${language === 'en' ? 'active' : ''}`}
                onClick={() => {
                  changeLanguage('en');
                  closeMenu();
                }}
              >
                🇬🇧 EN
              </button>
              <button
                className={`lang-btn-mobile ${language === 'fr' ? 'active' : ''}`}
                onClick={() => {
                  changeLanguage('fr');
                  closeMenu();
                }}
              >
                🇫🇷 FR
              </button>
              <button
                className={`lang-btn-mobile ${language === 'ar' ? 'active' : ''}`}
                onClick={() => {
                  changeLanguage('ar');
                  closeMenu();
                }}
              >
                🇲🇦 AR
              </button>
            </div>
          </div>

          <a
            href="/"
            className="navbar-link"
            onClick={handleHomeClick}
          >
            {t('nav.home')}
          </a>
          <a
            href="#products"
            className="navbar-link"
            onClick={handleSubscriptionsClick}
          >
            {t('nav.subscriptions')}
          </a>
          <Link
            to="/contact"
            className="navbar-link"
            onClick={closeMenu}
          >
            {t('nav.contact')}
          </Link>

          {isAdmin ? (
            <Link
              to="/admin"
              className="navbar-link"
              onClick={closeMenu}
            >
              {t('nav.admin')}
            </Link>
          ) : (
            <Link
              to="/admin/login"
              className="navbar-link"
              onClick={closeMenu}
            >
              {t('nav.adminLogin')}
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
