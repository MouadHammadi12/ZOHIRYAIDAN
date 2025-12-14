import React, { useState, useEffect } from 'react';
import ImageSlider from '../components/ImageSlider';
import ProductCard from '../components/ProductCard';
import './Home.css';

const Home = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    loadProducts();
    
    // Listen for products updates from admin
    const handleProductsUpdate = () => {
      loadProducts();
    };
    
    window.addEventListener('productsUpdated', handleProductsUpdate);
    
    return () => {
      window.removeEventListener('productsUpdated', handleProductsUpdate);
    };
  }, []);

  const loadProducts = () => {
    // Load from localStorage
    const savedProducts = localStorage.getItem('products');
    if (savedProducts) {
      const parsedProducts = JSON.parse(savedProducts);
      setProducts(parsedProducts);
    } else {
      // Default products if none exist
      const defaultProducts = [
        {
          id: 1,
          name: '1 Month Subscription',
          description: 'Perfect for trying out our service. Access to all channels and movies for one month.',
          image: null,
          price: 50.00,
          channels: 45000,
          is_active: true
        },
        {
          id: 2,
          name: '3 Months Subscription',
          description: 'Best value for short-term users. Enjoy 3 months of premium IPTV service with 24/7 support.',
          image: null,
          price: 120.00,
          channels: 45000,
          is_active: true
        },
        {
          id: 3,
          name: '6 Months Subscription',
          description: 'Great savings for long-term users. Get 6 months of unlimited access to all channels and movies.',
          image: null,
          price: 200.00,
          channels: 45000,
          is_active: true
        },
        {
          id: 4,
          name: '1 Year Subscription',
          description: 'The best deal! Get a full year of premium IPTV service with the lowest monthly price.',
          image: null,
          price: 350.00,
          channels: 45000,
          is_active: true
        }
      ];
      setProducts(defaultProducts);
      localStorage.setItem('products', JSON.stringify(defaultProducts));
    }
  };

  // Filter only active products
  const activeProducts = products.filter(product => product.is_active);

  return (
    <div className="home-page" id="home">
      {/* Image Slider */}
      <ImageSlider />

      <div className="products-section" id="products">
        <h2 className="section-title">Choose Your Subscription</h2>
        <div className="products-grid">
          {activeProducts.length > 0 ? (
            activeProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))
          ) : (
            <div className="no-products">
              <p>No products available at the moment.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
