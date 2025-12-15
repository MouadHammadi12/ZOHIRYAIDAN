import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import ImageSlider from '../components/ImageSlider';
import ProductCard from '../components/ProductCard';
import './Home.css';

const Home = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      await loadProducts();
    };
    fetchProducts();
    
    // Listen for products updates from admin
    const handleProductsUpdate = () => {
      loadProducts();
    };
    
    window.addEventListener('productsUpdated', handleProductsUpdate);
    
    return () => {
      window.removeEventListener('productsUpdated', handleProductsUpdate);
    };
  }, []);

  const loadProducts = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'product'));
      const productsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProducts(productsData);
    } catch (error) {
      console.error('Error loading products:', error);
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
