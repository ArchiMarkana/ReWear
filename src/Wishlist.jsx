import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import { FaHeart, FaShoppingCart, FaEye, FaTrash } from "react-icons/fa";
import { isLoggedIn, getWishlist, removeFromWishlist } from "./utils/auth";
import { getImageUrl } from "./utils/imageUtils";
import "./Wishlist.css";

export default function Wishlist() {
  const navigate = useNavigate();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch real wishlist data from API
  useEffect(() => {
    const fetchWishlist = async () => {
      console.log('Wishlist component: Checking authentication...');
      
      if (!isLoggedIn()) {
        console.log('Wishlist component: User not logged in, redirecting to login');
        navigate('/login');
        return;
      }

      try {
        console.log('Wishlist component: Fetching wishlist data...');
        const wishlistData = await getWishlist();
        console.log('Wishlist component: Received wishlist data:', wishlistData);
        
        // Transform the data to match the expected format
        const transformedWishlist = wishlistData.map(item => ({
          _id: item.productId?._id || item._id,
          title: item.productId?.title || 'Product Title',
          price: item.productId?.price || 0,
          originalPrice: item.productId?.originalPrice || null,
          discount: item.productId?.discount || 0,
          images: item.productId?.images || [],
          sellerId: item.productId?.sellerId || { name: { first: 'Unknown', last: 'Seller' } },
          category: item.productId?.category || 'general',
          addedAt: item.addedAt
        }));
        
        setWishlistItems(transformedWishlist);
      } catch (error) {
        console.error('Wishlist component: Error fetching wishlist:', error);
        setError('Failed to load wishlist');
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [navigate]);

  const handleRemoveFromWishlist = async (productId) => {
    try {
      console.log('Removing product from wishlist:', productId);
      await removeFromWishlist(productId);
      setWishlistItems(prev => prev.filter(item => item._id !== productId));
      console.log('Product removed from wishlist successfully');
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      alert('Failed to remove item from wishlist');
    }
  };

  const addToCart = async (product) => {
    try {
      const { addToCart: addToCartAPI } = await import('./utils/auth');
      await addToCartAPI(product._id, 1);
      alert(`${product.title} added to cart!`);
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add to cart. Please try again.');
    }
  };

  const moveAllToCart = async () => {
    if (wishlistItems.length === 0) return;
    
    try {
      const { addToCart: addToCartAPI } = await import('./utils/auth');
      for (const product of wishlistItems) {
        await addToCartAPI(product._id, 1);
      }
      alert(`All ${wishlistItems.length} items added to cart!`);
    } catch (error) {
      console.error('Error moving items to cart:', error);
      alert('Failed to add some items to cart. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="wishlist-root">
        <Header />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your wishlist...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="wishlist-root">
        <Header />
        <div className="wishlist-container">
          <div className="error-container">
            <p className="error-message">{error}</p>
            <button onClick={() => window.location.reload()} className="retry-btn">
              Try Again
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="wishlist-root">
      <Header />
      
      <div className="wishlist-container">
        <div className="wishlist-header">
          <div className="header-content">
            <h1>My Wishlist</h1>
            <p>{wishlistItems.length} items in your wishlist</p>
          </div>
          {wishlistItems.length > 0 && (
            <button className="move-all-btn" onClick={moveAllToCart}>
              <FaShoppingCart />
              Move All to Cart
            </button>
          )}
        </div>

        {wishlistItems.length === 0 ? (
          <div className="empty-wishlist">
            <div className="empty-icon">
              <FaHeart />
            </div>
            <h2>Your wishlist is empty</h2>
            <p>Start adding items you love to your wishlist</p>
            <Link to="/" className="start-shopping-btn">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="wishlist-grid">
            {wishlistItems.map((product) => {
              const primaryImage = product.images?.[0];
              const imageUrl = getImageUrl(primaryImage?.url);
              const finalPrice = product.discount > 0 ? product.price - (product.price * product.discount / 100) : product.price;

              return (
                <div key={product._id} className="wishlist-item">
                  <div className="item-image-container">
                    <img src={imageUrl} alt={product.title} className="item-image" />
                    <div className="item-overlay">
                      <Link to={`/product/${product._id}`} className="quick-view-btn">
                        <FaEye />
                      </Link>
                      <button 
                        className="remove-btn"
                        onClick={() => handleRemoveFromWishlist(product._id)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                    {product.discount > 0 && (
                      <div className="discount-badge">
                        -{Math.round(product.discount)}%
                      </div>
                    )}
                  </div>

                  <div className="item-info">
                    <h3 className="item-title">{product.title}</h3>
                    <p className="item-seller">by {product.sellerId?.name?.first} {product.sellerId?.name?.last}</p>
                    
                    <div className="item-rating">
                      <div className="stars">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={i < 4 ? "star filled" : "star"}>★</span>
                        ))}
                      </div>
                      <span className="rating-text">(4.0)</span>
                    </div>

                    <div className="item-price">
                      <span className="current-price">₹{finalPrice}</span>
                      {product.originalPrice && product.originalPrice > finalPrice && (
                        <span className="original-price">₹{product.originalPrice}</span>
                      )}
                    </div>

                    <div className="item-actions">
                      <button 
                        className="add-to-cart-btn"
                        onClick={() => addToCart(product)}
                      >
                        <FaShoppingCart />
                        Add to Cart
                      </button>
                      <Link to={`/product/${product._id}`} className="view-details-btn">
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
}
