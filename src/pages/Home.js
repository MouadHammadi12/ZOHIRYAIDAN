import React, { useEffect, useState, useMemo } from 'react';
import { useProducts } from '../contexts/ProductsContext';
import { useLanguage } from '../contexts/LanguageContext';
import ImageSlider from '../components/ImageSlider';
import ProductCard from '../components/ProductCard';
import { db } from '../firebase';
import { doc, updateDoc, increment, setDoc } from 'firebase/firestore';
import './Home.css';

const Home = () => {
  const { products, loading, refreshProducts } = useProducts();
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Listen for products updates from admin
    const handleProductsUpdate = () => {
      refreshProducts();
    };
    
    window.addEventListener('productsUpdated', handleProductsUpdate);

    // Increment visit counter
    const incrementVisits = async () => {
      const docRef = doc(db, 'stats', 'visits');
      try {
        await updateDoc(docRef, {
          count: increment(1)
        });
      } catch (error) {
        // If document doesn't exist, create it
        await setDoc(docRef, { count: 1 });
      }
    };
    incrementVisits();
    
    return () => {
      window.removeEventListener('productsUpdated', handleProductsUpdate);
    };
  }, [refreshProducts]);

  // Filter only active products
  const activeProducts = useMemo(
    () =>
      products.filter(
        (product) => product.is_active === true || product.is_active === 'true'
      ),
    [products]
  );

  // Search filter
  const filteredProducts = useMemo(() => {
    if (!searchTerm.trim()) return activeProducts;
    const lower = searchTerm.toLowerCase();
    return activeProducts.filter((product) => {
      const name = (product.name || '').toLowerCase();
      const desc = (product.description || '').toLowerCase();
      return name.includes(lower) || desc.includes(lower);
    });
  }, [searchTerm, activeProducts]);

  return (
    <div className="home-page" id="home">
      {/* Image Slider */}
      <ImageSlider />

      <div className="products-section" id="products">
        <h2 className="section-title">{t('home.title')}</h2>

        <div className="products-search">
          <input
            type="text"
            placeholder={t('home.searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="products-grid">
          {loading ? (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>{t('home.loading')}</p>
            </div>
          ) : filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))
          ) : (
            <div className="no-products">
              <p>{t('home.noProducts')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
