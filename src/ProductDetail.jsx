import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from './Header.jsx';
import Footer from './Footer.jsx';
import './ProductDetail.css';
import { FaStar, FaHeart, FaShoppingCart, FaArrowLeft, FaShare } from 'react-icons/fa';
import { getImageUrl } from './utils/imageUtils';
import { isLoggedIn, addToWishlist, removeFromWishlist, addToCart } from './utils/auth';

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [wishlist, setWishlist] = useState(new Set());

  useEffect(() => {
    fetchProduct();
    fetchWishlist();
  }, [id]);

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

  const fetchProduct = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/user/products/${id}`);
      const data = await response.json();
      
      if (data.success) {
        setProduct(data.product);
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const toggleWishlist = async (productId) => {
    if (!isLoggedIn()) {
      alert('Please login to add items to wishlist');
      navigate('/login');
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

  const handleAddToCart = async () => {
    if (!isLoggedIn()) {
      navigate('/login');
      return;
    }

    try {
      await addToCart(product._id, quantity);
      alert('Product added to cart!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add to cart. Please try again.');
    }
  };

  const handleBuyNow = () => {
    if (!isLoggedIn()) {
      navigate('/login');
      return;
    }

    // Navigate to payment page
    navigate('/payment', { state: { product, quantity } });
  };

  if (loading) {
    return (
      <div className="product-detail-root">
        <Header />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading product details...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-detail-root">
        <Header />
        <div className="error-container">
          <h2>Product not found</h2>
          <button onClick={() => navigate('/')} className="back-btn">
            <FaArrowLeft /> Back to Home
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  const primaryImage = product.images?.find(img => img.isPrimary) || product.images?.[0];
  const imageUrl = getImageUrl(primaryImage?.url);
  const discount = product.discount || 0;
  const finalPrice = discount > 0 ? product.price - (product.price * discount / 100) : product.price;
  const isInWishlist = product ? wishlist.has(product._id) : false;

  return (
    <div className="product-detail-root">
      <Header />
      
      <div className="product-detail-container">
        <button onClick={() => navigate(-1)} className="back-btn">
          <FaArrowLeft /> Back
        </button>

        <div className="product-detail-content">
          <div className="product-images">
            <div className="main-image">
              <img src={imageUrl} alt={product.title} />
              {discount > 0 && (
                <div className="discount-badge">
                  -{Math.round(discount)}%
                </div>
              )}
            </div>
            
            {product.images && product.images.length > 1 && (
              <div className="image-thumbnails">
                {product.images.map((image, index) => (
                  <img
                    key={index}
                    src={getImageUrl(image.url)}
                    alt={`${product.title} ${index + 1}`}
                    className={selectedImage === index ? 'active' : ''}
                    onClick={() => setSelectedImage(index)}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="product-info">
            <div className="product-header">
              <h1 className="product-title">{product.title}</h1>
              <div className="product-actions">
                <button
                  className={`wishlist-btn ${isInWishlist ? 'active' : ''}`}
                  onClick={() => toggleWishlist(product._id)}
                >
                  <FaHeart />
                </button>
                <button className="share-btn">
                  <FaShare />
                </button>
              </div>
            </div>

            <div className="product-meta">
              <p className="seller-info">
                Sold by: <strong>{product.sellerId?.name?.first} {product.sellerId?.name?.last}</strong>
              </p>
              <div className="product-rating">
                <div className="stars">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className={i < 4 ? "filled" : ""} />
                  ))}
                </div>
                <span className="rating-text">(4.0) • 12 reviews</span>
              </div>
            </div>

            <div className="product-price">
              <span className="current-price">₹{finalPrice}</span>
              {product.originalPrice && product.originalPrice > finalPrice && (
                <span className="original-price">₹{product.originalPrice}</span>
              )}
              {discount > 0 && (
                <span className="discount-text">You save ₹{product.originalPrice - finalPrice}</span>
              )}
            </div>

            <div className="product-details">
              <div className="detail-item">
                <strong>Category:</strong> {product.category}
              </div>
              <div className="detail-item">
                <strong>Subcategory:</strong> {product.subcategory}
              </div>
              <div className="detail-item">
                <strong>Size:</strong> {product.size}
              </div>
              <div className="detail-item">
                <strong>Color:</strong> {product.color}
              </div>
              <div className="detail-item">
                <strong>Condition:</strong> {product.condition}
              </div>
              <div className="detail-item">
                <strong>Gender:</strong> {product.gender}
              </div>
              {product.material && (
                <div className="detail-item">
                  <strong>Material:</strong> {product.material}
                </div>
              )}
              <div className="detail-item">
                <strong>Stock:</strong> {product.stock} available
              </div>
            </div>

            <div className="product-description">
              <h3>Description</h3>
              <p>{product.description}</p>
            </div>

            <div className="product-actions-section">
              <div className="quantity-selector">
                <label>Quantity:</label>
                <div className="quantity-controls">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <span>{quantity}</span>
                  <button 
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="action-buttons">
                <button className="add-to-cart-btn" onClick={handleAddToCart}>
                  <FaShoppingCart />
                  Add to Cart
                </button>
                <button className="buy-now-btn" onClick={handleBuyNow}>
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default ProductDetail;

