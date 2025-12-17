import React from 'react';
import { useCart } from '../contexts/CartContext';
import { useLanguage } from '../contexts/LanguageContext';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { t } = useLanguage();

  const handleWhatsApp = () => {
    const message = `Hello! I'm interested in the ${product.name} for ${product.price} €.`;
    const phoneNumber = '212632932177';
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.location.href = whatsappUrl;
  };

  const handleAddToCart = () => {
    addToCart(product);
    // Show a brief success message
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.textContent = 'Added to cart!';
    document.body.appendChild(notification);

    setTimeout(() => {
      document.body.removeChild(notification);
    }, 2000);
  };

  return (
    <div className="product-card">
      {/* Image Section at Top */}
      <div className="product-image-container">
        {product.image && product.image.trim() !== '' ? (
          <img src={product.image} alt={product.name} className="product-image" />
        ) : (
          <div className="product-image-placeholder">
            <span className="placeholder-icon">📺</span>
            <span className="placeholder-text">{product.name}</span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="product-content">
        <div className="product-header">
          <h3 className="product-title">{product.name}</h3>
        </div>

        {product.description && (
          <p className="product-description">{product.description}</p>
        )}
        
        <div className="product-price-section">
          <div className="price-main">
            <span className="price-amount">{product.price.toFixed(2)} €</span>
          </div>
        </div>

        {product.channels && (
          <div className="channels-info">
            <span className="channels-badge">📡 {product.channels.toLocaleString()} {t('product.channels')}</span>
          </div>
        )}

        <div className="product-buttons">
          <button
            className="cart-btn"
            onClick={handleAddToCart}
          >
            <svg className="cart-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="m1 1 4 4h15l-1 7H6"></path>
            </svg>
            {t('product.addToCart')}
          </button>

          <button
            className="whatsapp-btn"
            onClick={handleWhatsApp}
          >
            <svg className="whatsapp-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
            {t('product.subscribeNow')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
