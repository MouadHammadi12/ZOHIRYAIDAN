import React, { useEffect } from 'react';
import { useProducts } from '../contexts/ProductsContext';
import ImageSlider from '../components/ImageSlider';
import ProductCard from '../components/ProductCard';
import './Home.css';

const Home = () => {
  const { products, loading, refreshProducts } = useProducts();

  useEffect(() => {
    // Listen for products updates from admin
    const handleProductsUpdate = () => {
      refreshProducts();
    };
    
    window.addEventListener('productsUpdated', handleProductsUpdate);
    
    return () => {
      window.removeEventListener('productsUpdated', handleProductsUpdate);
    };
  }, [refreshProducts]);

  // Filter only active products
  const activeProducts = products.filter(product => product.is_active === true || product.is_active === 'true');

  return (
    <div className="home-page" id="home">
      {/* Image Slider */}
      <ImageSlider />

      <div className="products-section" id="products">
        <h2 className="section-title">Choose Your Subscription</h2>
        <div className="products-grid">
          {loading ? (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Loading products...</p>
            </div>
          ) : activeProducts.length > 0 ? (
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
