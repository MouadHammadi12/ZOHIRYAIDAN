import React, { useState, useEffect } from 'react';
import './ImageSlider.css';

const ImageSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // يمكنك إضافة روابط الصور هنا
  const slides = [
    {
      image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=1200&q=80',
      title: 'Premium IPTV Service',
      subtitle: `🔥🔥inclusive of all TV packages and movies, updated every week.
✅Supports quality: H265, SD, HD, UHD, 4K, 3D.....
✅Supported channels: 2000+ Channels`,
    },
    {
      image: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=1200&q=80',
      title: '45,000+ Channels and movies',
      subtitle: 'iptv 12 months subscription, iptv 1 year uk, iptv smarters pro, duplex play, smart iptv, Gse smart, Magbox, Box tv, Android box, Amazon Firestick, Apple TV, iPhone, Android phone, Smart TV, MacBook. To get a free test, contact us!',
    },
    {
      image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=1200&q=80',
      title: '4K ultra HD Quality',
      subtitle: 'Crystal Clear Picture',
    },
    {
      image: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=1200&q=80',
      title: 'Best IPTV Experience',
      subtitle: 'Watch your favorite shows in the highest quality available',
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === slides.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // تغيير الصورة كل 5 ثواني

    return () => clearInterval(interval);
  }, [slides.length]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? slides.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === slides.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="image-slider">
      <div className="slider-container">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`slide ${index === currentIndex ? 'active' : ''}`}
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            <div className="slide-overlay">
              <div className="slide-content">
                <h2 className="slide-title">{slide.title}</h2>
                <p className="slide-subtitle">{slide.subtitle}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button className="slider-btn prev-btn" onClick={goToPrevious}>
        ‹
      </button>
      <button className="slider-btn next-btn" onClick={goToNext}>
        ›
      </button>

      {/* Dots Indicator */}
      <div className="slider-dots">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`dot ${index === currentIndex ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageSlider;
