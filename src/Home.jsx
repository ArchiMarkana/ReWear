import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "./Header.jsx";
import "./Home.css";
import Footer from "./Footer.jsx";
import { FaStar, FaHeart, FaShoppingCart, FaEye, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { getImageUrl } from "./utils/imageUtils";
import { isLoggedIn, addToWishlist, removeFromWishlist, addToCart } from "./utils/auth";

// Banner images (you can replace these with your actual banner images)
const banners = [
  { 
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=400&fit=crop", 
    title: "Summer Collection 2024",
    subtitle: "Discover the latest trends"
  },
  { 
    image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1200&h=400&fit=crop", 
    title: "Premium Accessories",
    subtitle: "Elevate your style"
  },
  { 
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=1200&h=400&fit=crop", 
    title: "Fashion Forward",
    subtitle: "Be the trendsetter"
  },
];

// Category configurations
const categories = [
  {
    id: "clothing",
    title: "Clothing",
    icon: "👗",
    description: "Elegant and stylish clothing for every occasion"
  },
  {
    id: "footwear",
    title: "Footwear",
    icon: "👟",
    description: "Comfortable and trendy footwear"
  },
  {
    id: "bags",
    title: "Bags & Purses",
    icon: "👜",
    description: "Trendy bags and purses to complete your look"
  },
  {
    id: "jewelry",
    title: "Jewelry",
    icon: "💎",
    description: "Sparkling jewelry to enhance your beauty"
  },
  {
    id: "accessories",
    title: "Accessories",
    icon: "🕶️",
    description: "Complete your look with stylish accessories"
  },
  {
    id: "watches",
    title: "Watches",
    icon: "⌚",
    description: "Timeless timepieces for every style"
  },
  {
    id: "eyewear",
    title: "Eyewear",
    icon: "👓",
    description: "Protect your eyes in style"
  }
];

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState(new Set());
  const [categoryProducts, setCategoryProducts] = useState({});

  // Fetch products for each category
  const fetchCategoryProducts = async (category) => {
    try {
      const response = await fetch(`http://localhost:5000/api/user/products/category/${category}?limit=8`);
      const data = await response.json();
      
      if (data.success) {
        return data.products;
      }
      return [];
    } catch (error) {
      console.error(`Error fetching ${category} products:`, error);
      return [];
    }
  };

  // Fetch wishlist on mount if logged in
  useEffect(() => {
    const fetchWishlist = async () => {
      if (isLoggedIn()) {
        try {
          const { getWishlist } = await import('./utils/auth');
          const wishlistData = await getWishlist();
          const wishlistIds = new Set(wishlistData.map(item => item.productId?._id || item.productId));
          setWishlist(wishlistIds);
        } catch (error) {
          console.error('Error fetching wishlist:', error);
        }
      }
    };
    fetchWishlist();
  }, []);

  // Fetch all category products on mount
  useEffect(() => {
    const fetchAllProducts = async () => {
      setLoading(true);
      const productPromises = categories.map(async (category) => {
        const products = await fetchCategoryProducts(category.id);
        return { [category.id]: products };
      });

      const results = await Promise.all(productPromises);
      const combinedData = results.reduce((acc, curr) => ({ ...acc, ...curr }), {});
      setCategoryProducts(combinedData);
      setLoading(false);
    };

    fetchAllProducts();
  }, []);

  // Auto rotate banner
  useEffect(() => {
    const id = setInterval(() => {
      if (!isPaused) {
        setCurrentIndex((prev) => (prev + 1) % banners.length);
      }
    }, 5000);
    return () => clearInterval(id);
  }, [isPaused]);

  const nextBanner = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  const prevBanner = () => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const toggleWishlist = async (productId) => {
    if (!isLoggedIn()) {
      alert('Please login to add items to wishlist');
      return;
    }

    try {
      const isInWishlist = wishlist.has(productId);
      if (isInWishlist) {
        await removeFromWishlist(productId);
        setWishlist(prev => {
          const newWishlist = new Set(prev);
          newWishlist.delete(productId);
          return newWishlist;
        });
      } else {
        await addToWishlist(productId);
        setWishlist(prev => {
          const newWishlist = new Set(prev);
          newWishlist.add(productId);
          return newWishlist;
        });
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      alert('Failed to update wishlist. Please try again.');
    }
  };

  const handleAddToCart = async (productId) => {
    if (!isLoggedIn()) {
      alert('Please login to add items to cart');
      return;
    }

    try {
      await addToCart(productId, 1);
      alert('Product added to cart!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add to cart. Please try again.');
    }
  };

  const ProductCard = ({ product }) => {
    const isInWishlist = wishlist.has(product._id);
    const primaryImage = product.images?.find(img => img.isPrimary) || product.images?.[0];
    const imageUrl = getImageUrl(primaryImage?.url);
    const discount = product.discount || 0;
    const finalPrice = discount > 0 ? product.price - (product.price * discount / 100) : product.price;

    return (
      <div className="product-card">
        <div className="product-image-container">
          <img src={imageUrl} alt={product.title} className="product-image" />
          <div className="product-overlay">
            <button
              className="wishlist-btn"
              onClick={() => toggleWishlist(product._id)}
            >
              <FaHeart className={isInWishlist ? "filled" : ""} />
            </button>
            <Link to={`/product/${product._id}`} className="quick-view-btn">
              <FaEye />
            </Link>
          </div>
          {discount > 0 && (
            <div className="discount-badge">
              -{Math.round(discount)}%
            </div>
          )}
        </div>

        <div className="product-info">
          <h3 className="product-title">{product.title}</h3>
          <p className="product-seller">by {product.sellerId?.name?.first} {product.sellerId?.name?.last}</p>
          <div className="product-rating">
            <div className="stars">
              {[...Array(5)].map((_, i) => (
                <FaStar
                  key={i}
                  className={i < 4 ? "filled" : ""} // Default 4-star rating
                />
              ))}
            </div>
            <span className="rating-text">(4.0)</span>
          </div>
          <div className="product-price">
            <span className="current-price">₹{finalPrice}</span>
            {product.originalPrice && product.originalPrice > finalPrice && (
              <span className="original-price">₹{product.originalPrice}</span>
            )}
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <Link to={`/product/${product._id}`} className="product-btn" style={{ flex: 1 }}>
              <FaEye />
              View Details
            </Link>
            <button 
              className="product-btn" 
              onClick={() => handleAddToCart(product._id)}
              style={{ flex: 1 }}
            >
              <FaShoppingCart />
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="home-root">
        <Header />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading amazing products...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="home-root">
      <Header />

      {/* Hero Banner */}
      <section className="hero-section">
        <div className="banner-container">
          <div
            className="banner-slider"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div
              className="banner-track"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {banners.map((banner, index) => (
                <div key={index} className="banner-slide">
                  <img src={banner.image} alt={banner.title} className="banner-image" />
                  <div className="banner-content">
                    <h1 className="banner-title">{banner.title}</h1>
                    <p className="banner-subtitle">{banner.subtitle}</p>
                    <Link to="/products" className="banner-cta">
                      Shop Now
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            <button className="banner-nav prev" onClick={prevBanner}>
              <FaChevronLeft />
            </button>
            <button className="banner-nav next" onClick={nextBanner}>
              <FaChevronRight />
            </button>

            <div className="banner-dots">
              {banners.map((_, index) => (
                <button
                  key={index}
                  className={`dot ${index === currentIndex ? "active" : ""}`}
                  onClick={() => setCurrentIndex(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Category Sections */}
      {categories.map((category) => (
        <section key={category.id} className="products-section">
          <div className="section-header">
            <div className="section-title">
              <span className="category-icon">{category.icon}</span>
              <div>
                <h2>{category.title}</h2>
                <p className="section-description">{category.description}</p>
              </div>
            </div>
            <Link to={`/category/${category.id}`} className="view-all-btn">
              View All
            </Link>
          </div>

          <div className="product-container">
            {categoryProducts[category.id]?.length > 0 ? (
              categoryProducts[category.id].map((product) => (
                <ProductCard key={product._id} product={product} />
              ))
            ) : (
              <div className="empty-state">
                <p>No products available in this category yet</p>
                <Link to="/seller/register" className="become-seller-link">
                  Become a seller to add products
                </Link>
              </div>
            )}
          </div>
        </section>
      ))}

      {/* Features Section */}
      <section className="features-section">
        <div className="features-container">
          <div className="feature-item">
            <div className="feature-icon">🚚</div>
            <h3>Free Shipping</h3>
            <p>Free delivery on orders above ₹500</p>
          </div>
          <div className="feature-item">
            <div className="feature-icon">💳</div>
            <h3>Secure Payment</h3>
            <p>100% secure payment processing</p>
          </div>
          <div className="feature-item">
            <div className="feature-icon">↩️</div>
            <h3>Easy Returns</h3>
            <p>7-day return policy</p>
          </div>
          <div className="feature-item">
            <div className="feature-icon">🎁</div>
            <h3>Gift Cards</h3>
            <p>Perfect gifts for your loved ones</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}